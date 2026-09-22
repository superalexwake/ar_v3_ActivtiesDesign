import { refreshToken } from '@/api/modules/user'
import { GlobalStore, useNotifyWsStore } from '@/stores'
import { useEventBus } from '@/components/common/use'

interface RefreshData {
	token: string
	tokenHeader: string
	refreshToken: string
}

// 单飞：同一时刻只允许一个 RefreshToken 在途，并发调用共享同一个 Promise。
// 这是「正在刷新」的唯一真值源，取代原 refreshTokenLock / isOpen / isRefreshToken 三标志。
let inflight: Promise<string> | null = null

// token 落库：拦截器刷新与 wsRefresher 共用，消除重复逻辑
export function persistTokens(d: RefreshData): void {
	GlobalStore().setToken(d.token)
	localStorage.setItem('tokenHeader', d.tokenHeader)
	localStorage.setItem('refreshToken', d.refreshToken)
}

// 拦截器侧：单飞刷新 → 落库 → websocket 重连 → 返回新 token。
// 刷新无效（无 token）时抛出，调用方据此回登录。
export function refreshOnce(): Promise<string> {
	if (!inflight) {
		inflight = (async () => {
			const res: any = await refreshToken({}, {})
			const d = res?.data
			if (!d?.token) throw res ?? new Error('refresh token failed')
			persistTokens(d)
			// 刷新成功 → 通知各品牌 App.vue 整页重挂（codeKey++ → router-view 重拉），与精确重放并存
			useEventBus().emit('keyChange')
			await useNotifyWsStore().replaceSession({
				webSocketUrl: d.webSocketUrl,
				channels: d.webSocketChannels ?? [],
				tokenExpireAt: d.webSocketTokenExpireAt ?? 0,
			})
			return d.token as string
		})().finally(() => {
			inflight = null
		})
	}
	return inflight
}
