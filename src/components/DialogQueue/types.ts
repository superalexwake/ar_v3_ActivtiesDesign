import type { Component, Raw } from 'vue'

/**
 * 注册表 key。业务方通过字符串 key 注册组件后，
 * 可以用 createDialogQueueItem(key, options) 快速创建队列项。
 */
export type DialogQueueKey = string

/** Host 展示形态：center 居中；bottom 底部；fullscreen 全屏拦截；top 顶部非阻塞横幅（站内信）。 */
export type DialogQueuePresentation = 'center' | 'bottom' | 'fullscreen' | 'top'

/**
 * 弹窗关闭原因，会透传给 onClose 回调，便于做分支处理。
 *
 * - `close`         主动调用 close() / closeCurrent() 关闭
 * - `confirm`       子组件 emit('confirm')
 * - `cancel`        子组件 emit('cancel')
 * - `overlay`       点击遮罩关闭
 * - `dismiss-today` 子组件 emit('dismiss-today')；配合 dismissForToday() 中间件会写入存储，今天内不再入队
 * - `clear`         调用 clear() 整队清空
 */
export type DialogQueueCloseReason =
	| 'close'
	| 'confirm'
	| 'cancel'
	| 'overlay'
	| 'dismiss-today'
	| 'clear'

/**
 * 单条弹窗的策略。控制入队/展示行为。
 */
export interface DialogQueuePolicy {
	/** 优先级，数字越大越靠前；默认 0。同优先级按入队顺序 FIFO。 */
	priority?: number
	/** 互斥分组。队列中已存在同分组项时，新入队默认被丢弃。 */
	group?: string
	/** 强制弹窗：点击遮罩、按 ESC 都不会关闭。 */
	force?: boolean
	/** 是否允许点遮罩关闭；默认 true。force=true 时此项被忽略。 */
	closeOnClickOverlay?: boolean
	/** 是否允许相同 id 入队；默认 false（去重）。 */
	allowDuplicate?: boolean
	/** 入队前预加载的图片 URL；可填字符串或数组。失败/超时均静默放行，不阻塞队列。 */
	preloadImage?: string | string[]
	/** Host 展示形态。center 为普通居中弹窗；bottom 为底部弹窗；fullscreen 用于 AppLock 这类全屏拦截。 */
	presentation?: DialogQueuePresentation
	/**
	 * 常驻：用户点 close / overlay 关闭时不真的从队列里删，只标记隐藏；
	 * 路由再变到 allowedRoutes 内且队列里没其它可见弹窗时，自动恢复显示。
	 *
	 * 其它 reason（dismiss-today / confirm / cancel / clear）仍然正常删除——
	 * 比如"今日不再"是显式的"今天就别烦我了"，应该走 dismissForToday 中间件落盘 + 真正出队。
	 */
	persistent?: boolean
	/**
	 * 允许展示的路由 name 白名单。
	 * - 不传 / 空数组：不限制，弹窗在任何路由（routeGuard 没拦的）都展示
	 * - 非空：当前 route.name 不在白名单时弹窗被自动隐藏（不出队，回到白名单再恢复）
	 *
	 * 用来表达"这个弹窗只在首页弹"、"这个弹窗在 4 个 tab 页都弹"这类常见诉求。
	 */
	allowedRoutes?: string[]
	/**
	 * 禁止展示的路由黑名单，匹配当前 route.name 或 route.meta.parent。
	 * - 命中时弹窗自动隐藏（不出队），离开这些页面后自动恢复显示
	 * - 与 allowedRoutes 同时命中时黑名单优先
	 *
	 * 用来表达"游戏/彩票玩法页里别打扰玩家，退出来再弹"这类诉求；
	 * 填 parent（如 'saasLottery'）可一次覆盖该分组下全部子页面。
	 */
	blockedRoutes?: string[]
}

/**
 * 一条入队记录。
 *
 * 通常用 createDialogQueueItem(key, options) 构造；也可以手动拼。
 */
export interface DialogQueueItem<TProps extends Record<string, unknown> = Record<string, unknown>> {
	/** 弹窗唯一 id，用于去重、close(id)、has(id)。 */
	id: string
	/** 注册表 key（可选）。createDialogQueueItem 会自动填。 */
	key?: DialogQueueKey
	/** 实际要渲染的组件；进入队列时会被 markRaw 防止被代理化。 */
	component: Raw<Component>
	/** 透传给组件的 props。 */
	props?: TProps
	/** 策略。 */
	policy?: DialogQueuePolicy
	/** 关闭回调；reason 见 DialogQueueCloseReason。 */
	onClose?: (reason: DialogQueueCloseReason) => void
}

/** 队列内部使用的已解析项；外部一般不用手动构造。 */
export interface ResolvedDialogQueueItem<TProps extends Record<string, unknown> = Record<string, unknown>>
	extends DialogQueueItem<TProps> {
	/** 归一化后的优先级，用于排序。 */
	_priority: number
	/** 入队自增序号，用于同优先级 FIFO。 */
	_order: number
	/**
	 * 用户主动关掉（persistent 弹窗在 close/overlay 时置 true）。
	 * 区别于 _routeHidden：用户关掉是"今天看够了"，路由切换不会自动撤销；
	 * 只有"队列里没其它可见弹窗了"时（onRouteChanged 内判断）才允许重新激活。
	 */
	_userClosed?: boolean
	/**
	 * 当前路由不在 allowedRoutes 白名单时置 true。区别于 _userClosed：
	 * 完全由路由驱动，进出白名单自动切换，不需要用户操作。
	 */
	_routeHidden?: boolean
}

/** 注册表条目。 */
export interface DialogQueueRegistryItem<TProps extends Record<string, unknown> = Record<string, unknown>> {
	key: DialogQueueKey
	component: Raw<Component>
	/** 默认 props，调用方传入的 props 会浅合并覆盖。 */
	defaultProps?: TProps
	/** 默认 policy，调用方传入的 policy 会浅合并覆盖。 */
	defaultPolicy?: DialogQueuePolicy
}

// =============================================================================
// Pipe 系统类型
// -----------------------------------------------------------------------------
// 中间件 = (item) => item | null（同步或异步），返回 null 即丢弃；
// createPipe(...mws) 返回 DialogPipe，pipe.push(item) 走完所有 mw 才落到 queue.push。
// =============================================================================

/**
 * 中间件。返回 `null` 表示丢弃这条入队请求；返回 item（可以是新对象）继续往下走。
 *
 * @example
 * // 单条 mw
 * const requireLogin: PipeMiddleware = item => isLoggedIn() ? item : null
 *
 * @example
 * // 改 item
 * const bumpPriority: PipeMiddleware = item => ({
 *   ...item,
 *   policy: { ...item.policy, priority: 999 },
 * })
 */
export type PipeMiddleware = (
	item: DialogQueueItem,
) => DialogQueueItem | null | Promise<DialogQueueItem | null>
