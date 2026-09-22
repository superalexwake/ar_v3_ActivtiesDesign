import type { DialogQueueItem, DialogQueueKey, DialogQueuePolicy, DialogQueueRegistryItem } from './types'

// =============================================================================
// 注册表：key → 组件 + 默认 props/policy 的映射。
// -----------------------------------------------------------------------------
// 目的是让业务调用方只持有字符串 key，不直接 import 组件，便于动态/异步装载，
// 也方便统一在一个地方维护默认 priority / group / dismiss 策略。
// =============================================================================

const registry = new Map<DialogQueueKey, DialogQueueRegistryItem>()

/**
 * 注册一个可通过 key 创建的弹窗。同 key 重复注册会覆盖。
 *
 * @example
 * registerDialog({
 *   key: 'registerGift',
 *   component: RegisterGiftDialog,
 *   defaultPolicy: { priority: 10, group: 'reward' },
 * })
 */
export function registerDialog<TProps extends Record<string, unknown> = Record<string, unknown>>(
	item: DialogQueueRegistryItem<TProps>,
) {
	registry.set(item.key, item as DialogQueueRegistryItem)
}

/** 取注册项；找不到返回 null。 */
export function getRegisteredDialog(key: DialogQueueKey) {
	return registry.get(key) || null
}

/**
 * 用注册表中的 key 快速创建一条 DialogQueueItem。
 *
 * defaultProps / defaultPolicy 会与传入的 options.props / policy 浅合并，
 * 调用方传入的值优先。
 *
 * @returns 未注册返回 null（开发环境会 console.warn 出来定位 typo）。
 *
 * @example
 * const item = createDialogQueueItem('registerGift', {
 *   props: { amount: 100 },
 *   policy: { priority: 99 },
 *   onClose: reason => console.log(reason),
 * })
 * if (item) await queue.push(item)
 */
export function createDialogQueueItem<TProps extends Record<string, unknown> = Record<string, unknown>>(
	key: DialogQueueKey,
	options: {
		id?: string
		props?: TProps
		policy?: DialogQueuePolicy
		onClose?: DialogQueueItem<TProps>['onClose']
	} = {},
): DialogQueueItem<TProps> | null {
	const registered = registry.get(key)
	if (!registered) {
		if (import.meta.env.DEV) {
			// eslint-disable-next-line no-console
			console.warn(`[DialogQueue] createDialogQueueItem: key "${key}" is not registered.`)
		}
		return null
	}

	return {
		id: options.id || key,
		key,
		component: registered.component,
		props: {
			...registered.defaultProps,
			...options.props,
		} as TProps,
		policy: {
			...registered.defaultPolicy,
			...options.policy,
		},
		onClose: options.onClose,
	}
}

/**
 * 和 createDialogQueueItem 类似，但未注册时直接抛错。
 * 适合 producers 这类内部固定 key：配置缺失就是代码错误，不应该静默跳过。
 */
export function createRequiredDialogQueueItem<TProps extends Record<string, unknown> = Record<string, unknown>>(
	key: DialogQueueKey,
	options: Parameters<typeof createDialogQueueItem<TProps>>[1] = {},
) {
	const item = createDialogQueueItem<TProps>(key, options)
	if (!item) throw new Error(`[DialogQueue] key "${key}" is not registered.`)

	return item
}
