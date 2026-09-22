<template>
	<Teleport to="body">
		<Transition :name="transitionName">
			<div
				v-if="current"
				ref="rootRef"
				class="dialog-queue-host"
				:class="`dialog-queue-host--${presentation}`"
				:style="hostStyle"
				role="dialog"
				aria-modal="true"
				tabindex="-1"
			>
				<div v-if="presentation !== 'fullscreen' && presentation !== 'top'" class="dialog-queue-host__overlay" @click="handleOverlayClick"></div>
				<Transition :name="transitionName" mode="out-in">
					<div :key="current.id" class="dialog-queue-host__content" @click.stop>
						<component
							:is="current.component"
							v-bind="current.props"
							:dialog-id="current.id"
							@close="handleClose"
							@confirm="handleConfirm"
							@cancel="handleCancel"
							@dismiss-today="handleDismissToday"
						/>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogQueue } from './useDialogQueue'

/**
 * DialogQueueHost
 *
 * 把全局队列里的 current item 挂到 body 末尾渲染，统一处理：
 *   - 遮罩点击 / ESC 关闭（force=true 弹窗除外）
 *   - body 滚动锁
 *   - 焦点：进入时记录原焦点并把焦点移到 host，关闭后还原
 *   - 切换动画
 */
interface Props {
	/** 容器层 z-index，默认低于 Vant toast(4000)，避免队列弹窗遮挡全局提示。 */
	zIndex?: number | string
	/** 允许 ESC 关闭；force=true 的弹窗永不响应 ESC。默认 true。 */
	closeOnEsc?: boolean
	/** 显示时锁 body 滚动。默认 true。 */
	lockBodyScroll?: boolean
	/** 过渡名（对应下方 scss 里 dialog-queue-fade-* 那一组类名）。 */
	transitionName?: string
}

const props = withDefaults(defineProps<Props>(), {
	zIndex: 3900,
	closeOnEsc: true,
	lockBodyScroll: true,
	transitionName: 'dialog-queue-fade',
})

const { current, closeCurrent, onRouteChanged } = useDialogQueue()
const router = useRouter()

// 路由名变化通知队列：队列内部据此
//   1. 按各 item 的 policy.allowedRoutes 重算 _routeHidden（不在白名单的自动隐藏 / 回到白名单自动恢复）
//   2. 若过滤后没其它可见弹窗了，重新激活 persistent 被用户关掉的项（FirstRecharge 这种"切页再弹"）
//
// 初次执行：用 immediate 把当前路由名先同步给队列，避免首次 push 时 _routeHidden 全是 false 漏判。
watch(
	() => {
		const route = router.currentRoute.value
		return `${String(route.name || '')}|${String(route.meta?.parent || '')}`
	},
	key => {
		const [name, parent] = key.split('|')
		onRouteChanged(name, parent)
	},
	{ immediate: true },
)

const rootRef = ref<HTMLElement | null>(null)
/** 弹窗出现前的焦点元素，关闭后用来还原。 */
const previouslyFocused = ref<HTMLElement | null>(null)

const hostStyle = computed(() => ({ zIndex: String(props.zIndex) }))
const presentation = computed(() => current.value?.policy?.presentation || 'center')

// -----------------------------------------------------------------------------
// 关闭原因分发：子组件 emit 什么，就用对应 reason 关闭队首。
// -----------------------------------------------------------------------------
function handleClose() {
	closeCurrent('close')
}
function handleConfirm() {
	closeCurrent('confirm')
}
function handleCancel() {
	closeCurrent('cancel')
}
function handleDismissToday() {
	closeCurrent('dismiss-today')
}

function handleOverlayClick() {
	if (!current.value) return
	const policy = current.value.policy
	if (policy?.force) return
	if (policy?.closeOnClickOverlay === false) return
	closeCurrent('overlay')
}

// -----------------------------------------------------------------------------
// ESC：用 document 级别监听，避免依赖 host div 拿到焦点。
// -----------------------------------------------------------------------------
function onKeydown(e: KeyboardEvent) {
	if (e.key !== 'Escape') return
	if (!props.closeOnEsc) return
	if (!current.value) return
	if (current.value.policy?.force) return
	e.preventDefault()
	closeCurrent('close')
}

// -----------------------------------------------------------------------------
// body 滚动锁：进入时记录原 overflow、最后一条关闭时还原。
// 用模块内 closure 变量记录，确保即便 reactive 值在 unmount 中已置空也能正确还原。
// -----------------------------------------------------------------------------
let originalOverflow: string | null = null
function lockScroll() {
	if (presentation.value === 'top') return // 顶部横幅非阻塞：不锁滚动
	if (!props.lockBodyScroll) return
	if (originalOverflow !== null) return
	originalOverflow = document.body.style.overflow
	document.body.style.overflow = 'hidden'
}
function unlockScroll() {
	if (originalOverflow === null) return
	document.body.style.overflow = originalOverflow
	originalOverflow = null
}

// -----------------------------------------------------------------------------
// 队首变化时：管理焦点 / 滚动锁 / ESC 监听
// -----------------------------------------------------------------------------
watch(current, async (val, prev) => {
	const wasShowing = !!prev
	const isShowing = !!val

	if (isShowing && !wasShowing) {
		// 首次出现：记录前一焦点，锁滚动，挂全局 ESC 监听
		previouslyFocused.value = document.activeElement as HTMLElement | null
		lockScroll()
		document.addEventListener('keydown', onKeydown)
	}

	if (isShowing && presentation.value !== 'top') {
		// 首次出现或 A→B 切换：把焦点移到 host（rootRef 有 tabindex="-1"）；顶部横幅非阻塞不抢焦点
		await nextTick()
		rootRef.value?.focus?.()
	}

	if (!isShowing && wasShowing) {
		// 最后一条关闭：还原滚动 / 焦点，卸掉监听
		unlockScroll()
		document.removeEventListener('keydown', onKeydown)
		previouslyFocused.value?.focus?.()
		previouslyFocused.value = null
	}
})

onBeforeUnmount(() => {
	// 兜底：组件销毁时确保副作用清干净，否则 body 可能永远卡在 overflow:hidden。
	unlockScroll()
	document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped lang="scss">
.dialog-queue-host {
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	// tabindex=-1 + focus() 会画一条默认 outline，模态背景里不需要
	outline: none;

	&__overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
	}

	&__content {
		position: relative;
		z-index: 1;
		max-width: calc(100vw - 32px);
		// 不裁内容：单条 dialog 内部各自管 max-height + 滚动条
		// （FirstRecharge / Announcement 都有自己的滚动区；其他短的不需要）。
		// 否则像 FirstRecharge "浮在 dialog 下方 70px 的 close 按钮" 会被这里 overflow 切掉。
	}

	&--fullscreen {
		.dialog-queue-host__content {
			width: 100%;
			height: 100%;
			max-width: none;
			max-height: none;
			overflow: hidden;
		}
	}

	&--bottom {
		align-items: flex-end;

		.dialog-queue-host__content {
			width: 100%;
			max-width: 750px;
			display: flex;
			justify-content: center;
		}
	}

	// 顶部非阻塞横幅（站内信）：容器不拦点击，仅内容可交互
	&--top {
		align-items: flex-start;
		padding-top: 24px;
		pointer-events: none;

		.dialog-queue-host__content {
			pointer-events: auto;
		}
	}
}

.dialog-queue-fade-enter-active,
.dialog-queue-fade-leave-active {
	transition: opacity 0.2s ease;
}

.dialog-queue-fade-enter-from,
.dialog-queue-fade-leave-to {
	opacity: 0;
}
</style>
