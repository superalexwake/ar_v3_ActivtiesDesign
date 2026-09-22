import { computed, markRaw, reactive, ref } from 'vue'
import type { Component, Raw } from 'vue'
import type {
	DialogQueueCloseReason,
	DialogQueueItem,
	DialogQueuePolicy,
	ResolvedDialogQueueItem,
} from './types'

// =============================================================================
// 模块级单例状态
// -----------------------------------------------------------------------------
// 整个 app 共享一个队列。多次调用 useDialogQueue() 拿到的是同一组 ref/方法。
//
// 注：pipe 系统在 pipe.ts，不耦合在 queue 里。queue 是"最底层的存储 + 渲染契约"，
// 业务通过 createPipe(...mws).push(item) 走管道；也可以 queue.push(item) 直推（绕过 pipe）。
// =============================================================================

const items = reactive<ResolvedDialogQueueItem[]>([])
let order = 0

/**
 * 当前路由 name。Host 在 setup 里 watch router.currentRoute.value.name 并写到这里，
 * 让队列的 current / route 过滤可以纯粹基于这个 ref 推导，不直接 import vue-router。
 */
const currentRouteName = ref('')
/** 当前路由 meta.parent，配合 blockedRoutes 做分组级屏蔽（如 saasLottery 下全部彩票玩法页）。 */
const currentRouteParent = ref('')

/**
 * 队首"可见项"：跳过 _userClosed=true 和 _routeHidden=true 的项。
 * _routeHidden 由 policy.allowedRoutes 推导（见 isRouteHidden）。
 */
const current = computed<ResolvedDialogQueueItem | null>(
	() => items.find(item => !item._userClosed && !item._routeHidden) || null,
)
const isEmpty = computed(() => items.length === 0)

// persistent 弹窗在哪些 close reason 下"只藏不删"；其它 reason（dismiss-today / confirm /
// cancel / clear）仍然走真正出队。
const HIDE_REASONS_ON_PERSISTENT: DialogQueueCloseReason[] = ['close', 'overlay']

/** 根据 policy.blockedRoutes(黑名单，优先) / allowedRoutes(白名单) 判断 item 在当前路由下是否应被隐藏。 */
function isRouteHidden(item: ResolvedDialogQueueItem): boolean {
	const blocked = item.policy?.blockedRoutes
	if (blocked?.some(r => r === currentRouteName.value || r === currentRouteParent.value)) return true
	const allowed = item.policy?.allowedRoutes
	if (!allowed || allowed.length === 0) return false
	return !allowed.includes(currentRouteName.value)
}

// =============================================================================
// 内部工具
// =============================================================================

/** 填充策略默认值；不改入参，返回新对象。 */
function normalizePolicy(policy?: DialogQueuePolicy): DialogQueuePolicy {
	return {
		priority: 0,
		closeOnClickOverlay: true,
		...policy,
	}
}

/**
 * 预加载单张图片。失败 / 超时一律静默 resolve，
 * 避免某张图挂掉就把整条队列卡死。
 */
function preloadImage(url: string, timeout = 5000): Promise<void> {
	return new Promise(resolve => {
		const img = new Image()
		const timer = window.setTimeout(resolve, timeout)
		img.onload = () => {
			window.clearTimeout(timer)
			resolve()
		}
		img.onerror = () => {
			window.clearTimeout(timer)
			resolve()
		}
		img.src = url
	})
}

async function preloadImages(policy: DialogQueuePolicy) {
	if (!policy.preloadImage) return
	const urls = Array.isArray(policy.preloadImage) ? policy.preloadImage : [policy.preloadImage]
	await Promise.all(urls.map(url => preloadImage(url)))
}

function resolveItem(item: DialogQueueItem): ResolvedDialogQueueItem {
	const resolved: ResolvedDialogQueueItem = {
		...item,
		component: markRaw(item.component) as Raw<Component>,
		policy: item.policy,
		_priority: item.policy?.priority ?? 0,
		_order: ++order,
	}
	// 新 push 进来的 item 也按当前路由算一次 _routeHidden，
	// 否则只有 onRouteChanged 触发时才会算，导致"已经在非白名单路由上时新 push 的弹窗"漏过 allowedRoutes 立刻显示。
	resolved._routeHidden = isRouteHidden(resolved)
	return resolved
}

/** 按优先级降序、同优先级按入队顺序升序插入。 */
function insertByPriority(item: ResolvedDialogQueueItem) {
	const index = items.findIndex(currentItem => {
		if (currentItem._priority === item._priority) return currentItem._order > item._order
		return currentItem._priority < item._priority
	})

	if (index === -1) items.push(item)
	else items.splice(index, 0, item)
}

function hasId(id: string) {
	return items.some(i => i.id === id)
}

function hasGroup(group: string) {
	return items.some(i => i.policy?.group === group)
}

// =============================================================================
// 对外 API
// =============================================================================

/**
 * 获取（全局单例的）弹窗队列控制器。
 *
 * 这是最底层入口；正常业务建议通过 createPipe(...mws).push(item) 上管道。
 *
 * @example
 * const queue = useDialogQueue()
 * await queue.push(item)
 * queue.closeCurrent('confirm')
 */
export function useDialogQueue() {
	/**
	 * 入队一条弹窗。
	 *
	 * 流程（扁平实现，无 pipe）：
	 *   1. 归一化 policy（默认 priority=0、closeOnClickOverlay=true）
	 *   2. 去重 / 分组 fail-fast（避免做无谓的图片预加载）
	 *   3. 预加载图片
	 *   4. 复检去重 / 分组（preload 期间可能有另一次 push 已经进队，闭环并发竞态）
	 *   5. 按优先级插入
	 *
	 * @returns 是否真正入队（被去重 / 同分组占位返回 false）
	 */
	async function push(item: DialogQueueItem): Promise<boolean> {
		const policy = normalizePolicy(item.policy)
		const draft: DialogQueueItem = { ...item, policy }

		if (!policy.allowDuplicate && hasId(draft.id)) return reject(draft, 'duplicate-id')
		if (policy.group && hasGroup(policy.group)) return reject(draft, `group:${policy.group}`)

		await preloadImages(policy)

		if (!policy.allowDuplicate && hasId(draft.id)) return reject(draft, 'duplicate-id (post-preload)')
		if (policy.group && hasGroup(policy.group)) return reject(draft, `group:${policy.group} (post-preload)`)

		insertByPriority(resolveItem(draft))
		return true
	}

	/** 给 DEV 打日志的辅助；生产环境直接 return false 不进入 console。 */
	function reject(item: DialogQueueItem, reason: string): false {
		if (import.meta.env.DEV) {
			// eslint-disable-next-line no-console
			console.debug(`[DialogQueue] "${item.id}" dropped by queue: ${reason}`)
		}
		return false
	}

	/**
	 * 按 id 关闭。
	 *
	 * - persistent 弹窗在 close / overlay reason 下**只标记 _userClosed 不出队**；
	 *   其它 reason（dismiss-today / confirm / cancel / clear）走真正出队。
	 * - 非 persistent 弹窗一律出队。
	 */
	function close(id: string, reason: DialogQueueCloseReason = 'close') {
		const index = items.findIndex(item => item.id === id)
		if (index === -1) return false

		const item = items[index]
		const isPersistentHide =
			item.policy?.persistent
			&& HIDE_REASONS_ON_PERSISTENT.includes(reason)
		if (isPersistentHide) {
			item._userClosed = true
			// 仍要触发 onClose 让中间件 / 业务做副作用（埋点等）
			item.onClose?.(reason)
			return true
		}

		items.splice(index, 1)
		item.onClose?.(reason)
		return true
	}

	/**
	 * 路由变化时 Host 调一次。
	 *
	 * 两件事：
	 *   1. 重算每条 item 的 _routeHidden（基于 policy.allowedRoutes）
	 *   2. 若过滤后队列里没其它可见弹窗了，把 persistent 的 _userClosed 重置——这样
	 *      "用户没勾今日不再"的 FirstRecharge 切到下一个允许的页面时会再弹一次，
	 *      但不会打断正在显示的别的弹窗。
	 */
	function onRouteChanged(name: string, parent = '') {
		currentRouteName.value = name
		currentRouteParent.value = parent

		items.forEach(item => {
			item._routeHidden = isRouteHidden(item)
		})

		if (current.value !== null) return
		items.forEach(item => {
			if (item.policy?.persistent && item._userClosed) item._userClosed = false
		})
	}

	/** 关闭队首（current）。 */
	function closeCurrent(reason: DialogQueueCloseReason = 'close') {
		if (!current.value) return false
		return close(current.value.id, reason)
	}

	/** 清空队列，每一项都会触发 onClose(reason)。 */
	function clear(reason: DialogQueueCloseReason = 'clear') {
		const closingItems = items.splice(0)
		closingItems.forEach(item => item.onClose?.(reason))
	}

	/** 丢弃队列，不触发 onClose。适合路由切换时取消弹窗与业务副作用。 */
	function discard() {
		items.splice(0)
		order = 0
	}

	/** 队列中是否包含该 id（不止队首）。 */
	function has(id: string) {
		return items.some(item => item.id === id)
	}

	return {
		current,
		items: items as readonly ResolvedDialogQueueItem[],
		isEmpty,
		push,
		close,
		closeCurrent,
		clear,
		discard,
		has,
		onRouteChanged,
	}
}
