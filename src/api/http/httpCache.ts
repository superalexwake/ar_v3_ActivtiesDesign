import type { AxiosResponse } from 'axios'
import type { RequestConfig } from '@/types/api'
import { getRequestKey } from './requestKey'

interface CacheEntry {
	data: any
	expireAt: number
}

// 独立内存缓存（取代挂在 homeStore 的 cacheData，消除基础设施反依赖 UI store）
const store = new Map<string, CacheEntry>()
const DEFAULT_TTL = 5 * 60 * 1000 // 5 分钟

export function getCache(key: string): any | undefined {
	const entry = store.get(key)
	if (!entry) return undefined
	if (Date.now() > entry.expireAt) {
		store.delete(key)
		return undefined
	}
	return entry.data
}

export function setCache(key: string, data: any, ttl: number = DEFAULT_TTL): void {
	store.set(key, { data, expireAt: Date.now() + ttl })
}

export function clearCache(): void {
	store.clear()
}

// 请求侧守卫：命中未过期缓存则挂 adapter 直接 resolve，返回 true 让拦截器短路。
// 用 adapter 走正常成功通道，取代原 reject→error-handler-return 反模式。
export function cacheGuard(config: RequestConfig): boolean {
	if (!config.params?.cache) return false
	const cached = getCache(getRequestKey(config))
	if (cached === undefined) return false
	config._fromCache = true
	// 伪造一个 AxiosResponse（适配器 shim，故此处单点 cast）
	config.adapter = () =>
		Promise.resolve({
			data: { ...cached, cache: true },
			status: 200,
			statusText: 'OK (from cache)',
			headers: {},
			config,
			request: {},
		} as unknown as AxiosResponse)
	return true
}

// 响应侧写入：命中回放不回写（避免刷新 TTL / 污染 cache 标记）
export function saveCache(config: RequestConfig, data: any): void {
	if (config._fromCache) return
	if (config.params?.cache) {
		const ttl = typeof config.cacheTtl === 'number' ? config.cacheTtl : DEFAULT_TTL
		setCache(getRequestKey(config), data, ttl)
	}
}
