/**
 * 弹窗管道系统
 *
 * @description Transducer 风格的中间件链：每个 mw 是 (item) => item | null，
 *   返回 null 即丢弃。每个调用方拥有自己的 DialogPipe（"每个弹窗级别"的过滤拦截）。
 *   pipe 跑完后才落到底层 queue.push；queue.push 自身仍有去重 / 分组 / 预加载兜底。
 *
 * @example
 * ```ts
 * const firstRechargePipe = createPipe(
 *   condition(() => !isDialogCleanRoute()),
 *   condition(async () => {
 *     const list = await getFirstRechargeList()
 *     return !!list?.length && !list.find(i => i.isFinshed)
 *   }),
 * )
 * await firstRechargePipe.push(createRequiredDialogQueueItem('home-first-recharge'))
 * ```
 */

import type { DialogQueueItem, PipeMiddleware } from './types'
import { useDialogQueue } from './useDialogQueue'

// =============================================================================
// 核心
// =============================================================================

/**
 * 一条弹窗管道。
 *
 * 注册顺序就是执行顺序：第一条中间件最先看到 item，依次往下传；
 * 任何一条返回 null 就停链并不入队。
 */
export class DialogPipe {
	private middlewares: PipeMiddleware[] = []

	/** 注册一条中间件。支持链式：`pipe.use(a).use(b)`。 */
	use(mw: PipeMiddleware): this {
		this.middlewares.push(mw)
		return this
	}

	/**
	 * 让 item 走完整条管道并尝试入队。
	 *
	 * @returns 成功入队返回 true；被某条 mw 丢弃 / 被底层 queue.push 去重时返回 false。
	 *
	 * DEV 环境下被丢弃时会打印 console.debug，附带 item.id 与丢弃它的 middleware 序号，方便定位。
	 */
	async push(item: DialogQueueItem): Promise<boolean> {
		const queue = useDialogQueue()

		let current: DialogQueueItem = item
		for (let i = 0; i < this.middlewares.length; i += 1) {
			const result = await this.middlewares[i](current)
			if (result === null) {
				if (import.meta.env.DEV) {
					// eslint-disable-next-line no-console
					console.debug(`[DialogQueue] "${current.id}" dropped by middleware #${i}`)
				}
				return false
			}
			current = result
		}

		return queue.push(current)
	}
}

/**
 * 创建一条管道实例。
 *
 * @param middlewares 初始中间件列表（可后续继续 .use()）
 *
 * @example
 * const pipe = createPipe(condition(check), dismissForToday().middleware)
 */
export function createPipe(...middlewares: PipeMiddleware[]): DialogPipe {
	const pipe = new DialogPipe()
	middlewares.forEach(mw => pipe.use(mw))
	return pipe
}

// =============================================================================
// 内置中间件
// -----------------------------------------------------------------------------
// 注意：去重 (allowDuplicate) / 分组互斥 / policy.preloadImage 已经做在 queue.push 里，
// 这里不再提供 dedup() / preloadImage() 中间件，避免双层逻辑造成困惑。
// =============================================================================

/**
 * 条件过滤：fn 返回 false（或 Promise<false>）时丢弃。
 *
 * @example
 * condition(() => !isDialogCleanRoute())          // 路由守卫
 * condition(item => Number(item.props?.amount) > 0)// 业务前置检查
 * condition(async () => (await fetchToken()) != null)
 */
export function condition(
	fn: (item: DialogQueueItem) => boolean | Promise<boolean>,
): PipeMiddleware {
	return async item => ((await fn(item)) ? item : null)
}

/**
 * "今日不再显示"。返回的对象同时给出：
 *   - middleware：挂进 pipe；入队前检查 / 关闭时（reason === 'dismiss-today'）落盘
 *   - dismiss(id) / isDismissed(id) / clear()：手动控制接口
 *
 * 存储格式：localStorage[storageKey] = { [scope]: { [id]: 'Mon Mar 04 2024' } }
 * 跨日自然失效，逻辑等同于 toDateString() 字符串比对。
 *
 * @param storageKey localStorage 顶层 key，默认 'dialog:dismissed'
 * @param scope      命名空间。不同站点 / 不同账户可用不同 scope 隔离，默认 '_'
 *
 * @example
 * const noToday = dismissForToday()
 * const pipe = createPipe(noToday.middleware, ...)
 *
 * // 子组件按下"今日不再"按钮 → emit('dismiss-today') → Host closeCurrent('dismiss-today')
 * //   → middleware 包装过的 onClose 自动调 dismiss(id) 落盘
 * //
 * // 也可以手动调：
 * noToday.dismiss('home-first-recharge')
 */
export function dismissForToday(storageKey = 'dialog:dismissed', scope = '_') {
	function readStore(): Record<string, Record<string, string>> {
		try {
			return JSON.parse(localStorage.getItem(storageKey) || '{}')
		} catch {
			return {}
		}
	}

	function writeStore(store: Record<string, Record<string, string>>) {
		try {
			localStorage.setItem(storageKey, JSON.stringify(store))
		} catch {
			// 隐私模式下 setItem 会抛 QuotaExceededError，吞掉即可。
		}
	}

	function isDismissed(id: string): boolean {
		const store = readStore()
		const today = new Date().toDateString()
		return store[scope]?.[id] === today
	}

	function dismiss(id: string) {
		const store = readStore()
		if (!store[scope]) store[scope] = {}
		store[scope][id] = new Date().toDateString()
		writeStore(store)
	}

	function clear(scopeArg?: string) {
		if (scopeArg !== undefined) {
			const store = readStore()
			delete store[scopeArg]
			writeStore(store)
			return
		}
		try {
			localStorage.removeItem(storageKey)
		} catch {
			// 同上
		}
	}

	const middleware: PipeMiddleware = item => {
		if (isDismissed(item.id)) return null
		const original = item.onClose
		return {
			...item,
			onClose: reason => {
				if (reason === 'dismiss-today') dismiss(item.id)
				original?.(reason)
			},
		}
	}

	return { middleware, dismiss, isDismissed, clear }
}
