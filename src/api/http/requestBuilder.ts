import { getLocal1, randomGuid } from '@/utils'
import { native } from '@/utils/bridges'
import { getVersions } from '@/utils/bridges/JSBridgesUtil'
import { GlobalStore } from '@/stores'
import type { RequestConfig } from '@/types/api'
import { isRefreshTokenUrl } from './requestKey'

function normalizeData(data: unknown): Record<string, any> {
	if (typeof data === 'string') {
		try {
			const o = JSON.parse(data)
			return o && typeof o === 'object' ? o : {}
		} catch {
			return {}
		}
	}
	return data && typeof data === 'object' ? (data as Record<string, any>) : {}
}

/**
 * 注入请求公共字段。
 *
 * @remarks 原型环境不计算请求签名（空实现）：假数据层不校验签名，真实后端会拒绝这些请求，
 * 因此这份代码不能直接拿去连接真实服务器。data 可能是上次序列化后的字符串，先归一化为对象。
 * @param config - 即将发出的请求配置，会被原地修改。
 */
export function signRequest(config: RequestConfig): void {
	const data = normalizeData(config.data)
	delete data.signature
	data.language = getLocal1()
	data.random = randomGuid()
	data.timestamp = Math.floor(Date.now() / 1000)
	config.data = data
}

// 拼装请求头：Authorization 按端点选 token / refreshToken
export function buildHeaders(config: RequestConfig): void {
	const token = GlobalStore().getToken
	const tokenHeader = localStorage.getItem('tokenHeader') || ''
	const refreshToken = localStorage.getItem('refreshToken') || ''

	const extra: Record<string, string> = {}
	if (native.isFullapk()) {
		extra['X-App-Version'] = getVersions()
	}

	config.headers = {
		'Content-Type': 'application/json;charset=UTF-8',
		...config.headers,
		...extra,
		Authorization: isRefreshTokenUrl(config.url) ? tokenHeader + refreshToken : tokenHeader + token,
		'Ar-Origin': window.location.origin,
	}
}
