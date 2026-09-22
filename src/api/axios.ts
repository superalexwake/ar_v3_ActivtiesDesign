import router from '@/router'
import { showFailToast, showLoadingToast } from 'vant'
import axios, { type AxiosError, type AxiosResponse } from 'axios'

import { LOGIN_URL } from '@/config/config'
import { useUserStore } from '@/stores'
import { ContentTypeEnum, ResultEnum } from '@/types/enums'
import type { RequestConfig } from '@/types/api'
import type { NotifyWsSubscription } from '@/stores/modules/notifyWs'
import i18n from '@/languages'
import { fixMsg } from '@/utils'
import { refreshToken } from './modules/user'
import { checkStatus } from './helper/checkStatus'

import { isRefreshTokenUrl } from './http/requestKey'
import { signRequest, buildHeaders } from './http/requestBuilder'
import { cancelDuplicate, registerPending, removePending } from './http/cancelManager'
import { cacheGuard, saveCache } from './http/httpCache'
import { persistTokens, refreshOnce } from './http/tokenRefresher'

const { t } = i18n.global

const baseURL = window.CONFIG?.VITE_API_URL || (import.meta.env.VITE_API_URL as string)
const extendURL = '/api/webapi'
const isLoginOffUrl = (url?: string): boolean => /\/LoginOff(?:$|\?)/.test(url || '')

const service = axios.create({
	// 超时时间（30s）
	timeout: ResultEnum.TIMEOUT,
})

// 登出 → 回登录页
const arriveLogin = () => {
	void useUserStore().logoutLocal({ path: LOGIN_URL })
}

const getResponseStatus = (error: unknown): number => {
	const status = Number((error as { response?: { status?: unknown } })?.response?.status)
	return Number.isFinite(status) ? status : 0
}

const getAuthErrorCode = (error: unknown): number => {
	const source = error as {
		code?: unknown
		msgCode?: unknown
		response?: { data?: { code?: unknown; msgCode?: unknown } }
	}
	const code = Number(source?.code ?? source?.msgCode ?? source?.response?.data?.code ?? source?.response?.data?.msgCode)
	return Number.isFinite(code) ? code : 0
}

const isAuthInvalidError = (error: unknown): boolean => {
	const code = getAuthErrorCode(error)
	return getResponseStatus(error) === 401 || code === 4 || code === 22
}

// ===== 请求拦截器：中间件链（签名 → 缓存守卫 → 取消守卫 → 拼 header）=====
service.interceptors.request.use(
	(config: RequestConfig) => {
		signRequest(config)
		// 命中缓存：已挂 adapter，直接短路，不进取消注册
		if (cacheGuard(config)) return config
		cancelDuplicate(config)
		registerPending(config)
		buildHeaders(config)
		return config
	},
	(error: AxiosError) => Promise.reject(error),
)

// ===== 响应拦截器 =====
// code: -2 自定义错误 / -1 系统错误 / 4 token过期 / 13 网络异常 / 14 维护中
service.interceptors.response.use(
	(response: AxiosResponse) => {
		const config = response.config as RequestConfig
		// 缓存命中：原样返回，绕过业务码判断与回写
		if (config._fromCache) return response.data

		removePending(config)
		switch (response.data.code) {
			case -2:
				return Promise.reject(response.data)
			case -1:
				return Promise.reject({ msg: 'System Error' })
			case 4:
				if (isLoginOffUrl(config.url)) return Promise.reject(response.data)
				arriveLogin()
				return Promise.reject({ msg: t('tokenExpired') })
			case 13:
				return Promise.reject({ msg: 'Network Abnormal' })
			case 14:
				router.push({ name: 'maintenance' })
				return Promise.reject({ msg: 'In maintenance' })
		}
		if (response.data.code !== 0 && response.data.code !== 1) {
			return Promise.reject(response.data)
		}
		saveCache(config, response.data)
		return response.data
	},
	async (error: AxiosError) => {
		// 请求被取消：对外保持 reject(false)
		if (axios.isCancel(error)) return Promise.reject(false)

		const config = error.config as RequestConfig | undefined
		removePending(config) // 释放本次 pending（null 安全）

		if (error.code === 'ERR_NETWORK') {
			showLoadingToast({ message: 'loading...', forbidClick: true })
		}
		if (error.message && error.message.indexOf('timeout') !== -1) {
			showFailToast(t('requestTimedOut'))
		}

		const { response } = error
		if (response) {
			if (response.status === 401) {
				if (config && isLoginOffUrl(config.url)) return Promise.reject(error)
				const refreshTokenStr = localStorage.getItem('refreshToken') || ''
				// 无 refreshToken / 刷新端点自身 401 / 已重放过 → 回登录，杜绝死循环
				if (!config || !refreshTokenStr || isRefreshTokenUrl(config.url) || config._retried) {
					showFailToast(t('tokenExpired'))
					arriveLogin()
					return Promise.reject(error)
				}
				try {
					await refreshOnce() // 单飞：并发 401 只刷一次
				} catch (err: any) {
					if (err?.code === 12) fixMsg(err)
					arriveLogin()
					return Promise.reject(err)
				}
				config._retried = true
				return service(config) // 重放：拦截器自动带新 token，resolve 真实数据
			}

			const url = response.config.url || ''
			// 特定接口不提示错误
			const whiteList = ['/GetPwaDomainList']
			if (whiteList.some((item) => url.includes(item))) {
				return Promise.reject(response.data)
			}
			if (!/NotifyARGameRecover|Transfer|UserFBMsgSubscribe|UpdateOnlineStatus/.test(url)) {
				checkStatus(response.status)
			}
		}
		return Promise.reject(error)
	},
)

// 站内信续连刷新器：proactive 定时器 / 断线兜底 —— 复用 refreshToken 拿新连接信息（不复用旧 Token）
export async function wsRefresher(): Promise<NotifyWsSubscription | null> {
	try {
		const res: any = await refreshToken({}, {})
		const d = res?.data
		if (!d) return null
		if (d.token) persistTokens(d)
		if (d.webSocketUrl) {
			return {
				webSocketUrl: d.webSocketUrl,
				channels: d.webSocketChannels ?? [],
				tokenExpireAt: d.webSocketTokenExpireAt ?? 0,
			}
		}
		return null
	} catch (error) {
		if (isAuthInvalidError(error)) arriveLogin()
		return null
	}
}

const post = (
	url: string,
	data?: object | string,
	option?: {
		isUploadFile?: boolean
		noLoading?: boolean
		cache?: boolean
		cacheTtl?: number
	},
	header?: object,
) => {
	const query: RequestConfig = {
		url: url.startsWith('https://') ? url : baseURL + extendURL + url,
		method: 'post',
		headers: {
			'Content-Type': ContentTypeEnum.JSON,
			noLoading: option?.noLoading || false,
		},
		data: data ? data : {},
	}
	query.headers = Object.assign(query.headers, header)
	if (option?.cache) {
		query.params = { cache: true }
		if (typeof option.cacheTtl === 'number') query.cacheTtl = option.cacheTtl
	}
	return service(query)
}

export { post }
export default service
