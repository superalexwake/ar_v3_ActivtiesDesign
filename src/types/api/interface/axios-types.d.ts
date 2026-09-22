import { extend } from '@/utils/basic'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RequestConfig extends AxiosRequestConfig {
	noLoading?: boolean
	headers?: any
	// 缓存过期时间(ms)，不传走默认；不进 params，避免泄漏到 URL query
	cacheTtl?: number
	// 内部标记：本次响应来自缓存 adapter
	_fromCache?: boolean
	// 内部标记：401 后已重放过一次，杜绝刷新死循环
	_retried?: boolean
}
export interface AxiosResponseConfig extends AxiosResponse {
	code?: number
	msg?: string
	msgCode?: number
}

export interface Result {
	code: number
	msg: string
	success: boolean
	data: any
}
