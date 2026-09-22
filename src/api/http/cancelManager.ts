import type { RequestConfig } from '@/types/api'
import { getRequestKey } from './requestKey'

// 在途请求注册表：key -> AbortController
const pending = new Map<string, AbortController>()

// 接口名白名单：允许重复并发，不做去重取消
// GetInvitationNoAuthCouponByNum：注册页手机/邮箱两表单同时挂载各查一次同券码，去重会把先发的那个 abort 成空卡
const cancelWhiteList = [
	'GetRechargeRecord',
	'GetPointMallState',
	'GetRechargeTypes',
	'RegisterState',
	'GetInvitationNoAuthCouponByNum'
]

function isWhiteListed(url?: string): boolean {
	if (!url) return false
	const matched = /api\/webapi\/(.+)/.exec(url)
	return !!matched && cancelWhiteList.includes(matched[1])
}

// 取消同 key 的在途旧请求（后发覆盖先发）
export function cancelDuplicate(config: RequestConfig): void {
	if (isWhiteListed(config.url)) return
	const key = getRequestKey(config)
	if (!key) return
	const controller = pending.get(key)
	if (controller) {
		controller.abort('cancel')
		pending.delete(key)
	}
}

// 注册全新 AbortController 并覆盖 signal —— 覆盖保证「重放请求」拿到的是未中止的 signal
export function registerPending(config: RequestConfig): void {
	if (isWhiteListed(config.url)) return
	const key = getRequestKey(config)
	if (!key) return
	const controller = new AbortController()
	pending.set(key, controller)
	config.signal = controller.signal
}

// 终态释放：config 为空安全返回（修复超时/网络错误 removePending(undefined) 崩溃 + pending 泄漏）
export function removePending(config?: RequestConfig | null): void {
	if (!config) return
	const key = getRequestKey(config)
	if (key) pending.delete(key)
}
