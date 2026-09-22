import type { MockEnvelope } from './types'

/**
 * 分页列表数据，字段与线上分页接口一致。
 *
 * @typeParam T - 列表项类型。
 */
export interface PagedData<T> {
	/** 当前页数据 */
	list: T[]
	/** 总条数 */
	totalCount: number
	/** 总页数，最小为 1 */
	totalPage: number
	/** 当前页码，从 1 开始 */
	pageNo: number
}

/**
 * 构造成功信封。
 *
 * @typeParam T - 业务数据类型。
 * @param data - 业务数据。
 * @returns `code` 为 0 的信封。
 */
export const ok = <T>(data: T): MockEnvelope<T> => ({ code: 0, msg: 'Succeed', data, msgCode: 0 })

/**
 * 构造业务失败信封。
 *
 * @param msg - 展示给用户的文案（handler 传 pick() 结果）。
 * @param extra - msgCode：页面按它查语言包或分流弹窗；data：失败时附带的数据；
 *   code：默认 -2（拦截器 reject，AwaitApiResult 弹 toast）；只有页面自己 await 接口且只处理 resolve 分支时用 1。
 * @returns 失败信封；没有 msgCode 时不带该字段，没有 data 时为 null。
 */
export const fail = (msg: string, extra: { msgCode?: number; data?: unknown; code?: -2 | 1 } = {}): MockEnvelope => {
	const envelope: MockEnvelope = { code: extra.code ?? -2, msg, data: extra.data ?? null }
	if (extra.msgCode !== undefined) envelope.msgCode = extra.msgCode
	return envelope
}

/**
 * 按请求中的 `pageNo`、`pageSize` 对完整列表分页。
 *
 * @typeParam T - 列表项类型。
 * @param all - 完整列表。
 * @param body - 请求参数；缺少分页参数时按第 1 页、每页 20 条处理。
 * @returns 当前页的分页数据。
 */
export function paged<T>(all: T[], body: Record<string, unknown>): PagedData<T> {
	const pageNo = Number(body.pageNo) || 1
	const pageSize = Number(body.pageSize) || 20
	const start = (pageNo - 1) * pageSize
	return {
		list: all.slice(start, start + pageSize),
		totalCount: all.length,
		totalPage: Math.max(1, Math.ceil(all.length / pageSize)),
		pageNo,
	}
}
