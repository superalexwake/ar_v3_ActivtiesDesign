import { deepCopy } from '@/utils'

type KeyableConfig = { url?: string; data?: unknown } | null | undefined

// 请求指纹：url + 排序稳定的业务参数(剔除 random/timestamp/signature)。
// 取消去重与缓存共用同一口径；与签名一致地按 key 排序，规避参数顺序导致的 miss。
export function getRequestKey(config?: KeyableConfig): string {
	if (!config?.url) return ''
	const { url, data } = config
	let obj: Record<string, any>
	try {
		obj = typeof data === 'string' ? JSON.parse(data) : deepCopy(data ?? {})
	} catch {
		obj = {}
	}
	if (!obj || typeof obj !== 'object') obj = {}
	delete obj.random
	delete obj.timestamp
	delete obj.signature
	const sorted = Object.keys(obj)
		.sort()
		.reduce<Record<string, any>>((acc, k) => {
			acc[k] = obj[k]
			return acc
		}, {})
	return `${url}&${JSON.stringify(sorted)}`
}

// 是否为 RefreshToken 端点：刷新失败判定 / 防死循环共用，收敛原先两套实现。
export function isRefreshTokenUrl(url?: string): boolean {
	return !!url && url.endsWith('/api/webapi/RefreshToken')
}
