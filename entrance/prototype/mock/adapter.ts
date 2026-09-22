import axios from 'axios'
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { writeState } from './state'
import type { MockContext, MockEnvelope, MockHandler, MockRoutes, ParamValue, ProtoLang, Scenario, SessionState } from './types'

/** 需要从路径中去掉的接口前缀，按顺序匹配 */
const PATH_PREFIXES = ['/api/webapi', '/api']

/**
 * 从完整请求地址提取接口路径。
 *
 * @param url - 请求地址，可以带域名和查询串。
 * @returns 去掉域名、查询串和 `/api/webapi`、`/api` 前缀后的路径，如 `/GetActivityList`。
 */
export function toMockPath(url: string): string {
	const { pathname } = new URL(url, location.href)
	const prefix = PATH_PREFIXES.find((item) => pathname.startsWith(item + '/'))
	return prefix ? pathname.slice(prefix.length) : pathname
}

/**
 * 读取当前 H5 语言。
 *
 * @returns localStorage 中合法的语言；缺失或不合法时按 `zh` 处理。
 */
export function readLang(): ProtoLang {
	const raw = localStorage.getItem('language')
	return raw === 'zh' || raw === 'en' || raw === 'hd' ? raw : 'zh'
}

/**
 * 创建按接口路径分发的 axios adapter。
 *
 * @remarks 所有请求都在本地完成，不发起网络请求；处理函数执行期间不会感知取消信号，其副作用照常发生，
 * axios 只会在这个 adapter resolve 之后才让被取消的请求 reject。
 * 未命中路由表的接口返回兜底数据，并去重记入 `window.__protoMock.unhandled`。
 * 响应数据每次深拷贝，页面修改返回值不会污染假数据常量。
 * 每次请求都重新读取当前语言，应用内切换语言无需刷新页面即可生效。
 * 每个请求先等待 catalog.json 解析完成，再把活动参数注入 `ctx.params`。
 * @param routes - 路由表。
 * @param scenario - 本次启动的场景。
 * @param state - 会话状态；处理函数修改后由 adapter 持久化。
 * @param ready - catalog.json 解析出的各活动有效参数；加载失败时为空对象。
 * @returns 可以赋给 `axios.defaults.adapter` 的 adapter。
 */
export function createMockAdapter(
	routes: MockRoutes,
	scenario: Scenario,
	state: SessionState,
	ready: Promise<Record<string, Record<string, ParamValue>>>
): AxiosAdapter {
	return async (config) => {
		const url = axios.getUri(config)
		const path = toMockPath(url)
		const params = await ready
		await new Promise((resolve) => setTimeout(resolve, scenario.latencyMs))
		const handler = routes[path]
		if (!handler) return respond(config, fallback(path))
		return respond(config, run(handler, { path, body: readBody(url, config.data), scenario, state, lang: readLang(), params }))
	}
}

function run(handler: MockHandler, ctx: MockContext): MockEnvelope {
	try {
		const envelope = handler(ctx)
		writeState(ctx.state)
		return envelope
	} catch (error) {
		console.error('[mock] 处理函数异常: ' + ctx.path, error)
		return { code: -1, msg: 'System Error', data: null }
	}
}

function fallback(path: string): unknown {
	const { unhandled } = window.__protoMock
	if (!unhandled.includes(path)) {
		unhandled.push(path)
		console.warn('[mock] 未覆盖: ' + path)
	}
	// ArUPI 支付接口没有信封，开奖数据是静态 JSON，两者都返回空对象
	if (path.endsWith('.json') || path.startsWith('/ar-wallet/')) return {}
	return { code: 0, msg: 'Succeed', data: { list: [], totalCount: 0, totalPage: 1 } }
}

function readBody(url: string, data: unknown): Record<string, unknown> {
	const query = Object.fromEntries(new URL(url, location.href).searchParams)
	if (typeof data !== 'string') return query
	try {
		const body: unknown = JSON.parse(data)
		return body && typeof body === 'object' ? { ...query, ...(body as Record<string, unknown>) } : query
	} catch {
		return query
	}
}

function respond(config: InternalAxiosRequestConfig, data: unknown): AxiosResponse {
	return { data: structuredClone(data), status: 200, statusText: 'OK', headers: {}, config, request: {} }
}
