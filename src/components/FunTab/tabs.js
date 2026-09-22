import {
	defineComponent,
	ref,
	computed,
	watch,
	nextTick,
	toRef,
	provide,
	onMounted,
	onBeforeUnmount,
	openBlock,
	createElementBlock,
	createElementVNode,
	normalizeStyle,
	renderSlot
} from 'vue'
import { tabsInjectionKey } from './types.js'
import { windowInit } from './utils/requestAnimationFrame.js'
import _export_sfc from './_virtual/plugin-vue_export-helper.js'

const _sfc_main = defineComponent({
	name: 'FunTabs',
	props: {
		modelValue: {
			type: [String, Number],
			default: ''
		},
		lineWidth: {
			type: [Number, String],
			default: 30
		},
		lineHeight: {
			type: Number,
			default: 3
		},
		activeColor: {
			type: String,
			default: '#1677ff'
		},
		additionalX: {
			type: Number,
			default: 50
		},
		reBoundExponent: {
			type: Number,
			default: 10,
			validator(v) {
				return v > 0
			}
		},
		inertialDuration: {
			type: Number,
			default: 1e3,
			validator(v) {
				return v > 0
			}
		},
		reBoundingDuration: {
			type: Number,
			default: 360
		}
	},
	emits: ['update:modelValue', 'change'],
	setup(props, { emit, expose }) {
		let refreshTask = null
		const children = []
		const viewAreaRef = ref()
		const listRef = ref()
		const activeValue = ref(props.modelValue)
		const lineOffset = ref(0)
		const activeLineWidth = ref(0)
		const viewAreaWidth = ref(0)
		const offsetX = ref(0)
		const speed = ref(0)
		const touching = ref(false)
		const reBounding = ref(false)
		const translateX = ref(0)
		const startX = ref(0)
		const lastX = ref(0)
		const currentX = ref(0)
		const startMoveTime = ref(0)
		const endMoveTime = ref(0)
		const frameTime = ref(16.7)
		const frameStartTime = ref(0)
		const frameEndTime = ref(0)
		const inertiaFrame = ref(0)
		const zeroSpeed = ref(1e-3)
		const acceleration = ref(1e-3)
		const listStyle = computed(() => {
			const duration = reBounding.value && !touching.value ? props.reBoundingDuration : 0
			return {
				transitionTimingFunction: reBounding.value
					? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
					: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
				transitionDuration: `${duration}ms`,
				transform: `translate3d(${translateX.value}px, 0px, 0px)`
			}
		})
		const activeBarStyle = computed(() => {
			return {
				transition: `all 300ms`,
				width: `${activeLineWidth.value}px`,
				height: `${props.lineHeight}px`,
				transform: `translate3d(${lineOffset.value}px, 0, 0)`,
				backgroundColor: props.activeColor
			}
		})
		const isMoveLeft = computed(() => currentX.value <= startX.value)
		watch(
			() => props.modelValue,
			(v) => {
				activeValue.value = v;
				refreshState()
			}
		)
		const refreshState = () => {
			if (refreshTask) {
				return
			}
			refreshTask = new Promise((resolve) => {
				nextTick(() => {
					resize()
					resolve()
					refreshTask = null
				})
			})
		}
		const setActiveValue = (value) => {
			activeValue.value = value
			emit('update:modelValue', value)
			emit('change', value)
		}
		const addItem = (tabItem) => {
			children.push(tabItem)
			refreshState()
		}
		const removeItem = (tabItem) => {
			const index = children.findIndex((item) => item.name === tabItem.name)
			if (index === -1) return
			children.splice(index, 1)
			refreshState()
		}
		const injection = {
			activeValue,
			activeColor: toRef(props, 'activeColor'),
			addItem,
			removeItem,
			setActiveValue
		}
		provide(tabsInjectionKey, injection)
		const resize = () => {
			viewAreaWidth.value = viewAreaRef.value?.offsetWidth || 0
			offsetX.value = listRef.value?.offsetWidth - viewAreaWidth.value
			checkPosition()
			calcLineOffset()
		}
		const reboundIfNeeded = () => {
			reBounding.value = false
			if (translateX.value > 0) {
				reBounding.value = true
				translateX.value = 0
			} else if (translateX.value < -offsetX.value) {
				reBounding.value = true
				translateX.value = -offsetX.value
			}
			return reBounding.value
		}
		const moveFollowTouch = () => {
			if (isMoveLeft.value) {
				if ((translateX.value <= 0 && translateX.value + offsetX.value > 0) || translateX.value > 0) {
					translateX.value += currentX.value - lastX.value
				} else if (translateX.value + offsetX.value <= 0) {
					translateX.value +=
						(props.additionalX * (currentX.value - lastX.value)) /
						(viewAreaWidth.value + Math.abs(translateX.value + offsetX.value))
				}
			} else {
				if (translateX.value >= 0) {
					translateX.value +=
						(props.additionalX * (currentX.value - lastX.value)) / (viewAreaWidth.value + translateX.value)
				} else if (
					(translateX.value <= 0 && translateX.value + offsetX.value >= 0) ||
					translateX.value + offsetX.value <= 0
				) {
					translateX.value += currentX.value - lastX.value
				}
			}
			lastX.value = currentX.value
		}
		const moveByInertia = () => {
			frameEndTime.value = Date.now()
			frameTime.value = frameEndTime.value - frameStartTime.value
			if (isMoveLeft.value) {
				if (translateX.value <= -offsetX.value) {
					acceleration.value *=
						(props.reBoundExponent + Math.abs(translateX.value + offsetX.value)) / props.reBoundExponent
					speed.value = Math.min(speed.value - acceleration.value, 0)
				} else {
					speed.value = Math.min(speed.value - acceleration.value * frameTime.value, 0)
				}
			} else {
				if (translateX.value >= 0) {
					acceleration.value *= (props.reBoundExponent + translateX.value) / props.reBoundExponent
					speed.value = Math.max(speed.value - acceleration.value, 0)
				} else {
					speed.value = Math.max(speed.value - acceleration.value * frameTime.value, 0)
				}
			}
			translateX.value += (speed.value * frameTime.value) / 2
			if (Math.abs(speed.value) <= zeroSpeed.value) {
				reboundIfNeeded()
				return
			}
			frameStartTime.value = frameEndTime.value
			inertiaFrame.value = requestAnimationFrame(moveByInertia)
		}
		const getActiveItemEl = () => {
			if (!children.length) {
				return
			}
			const target = children.find((child) => child.name.value === activeValue.value)
			return target && target.el.value
		}
		const calcLineOffset = () => {
			const itemEl = getActiveItemEl()
			if (!itemEl) {
				return
			}
			const itemWidth = itemEl.offsetWidth
			const itemLeft = itemEl.offsetLeft
			const { lineWidth } = props
			if (lineWidth === 'auto') {
				activeLineWidth.value = itemWidth
			} else if (lineWidth < 1) {
				activeLineWidth.value = itemWidth * lineWidth
			} else {
				activeLineWidth.value = lineWidth
			}
			lineOffset.value = itemLeft + (itemWidth - activeLineWidth.value) / 2
		}
		const checkPosition = () => {
			const activeItemEl = getActiveItemEl()
			if (!activeItemEl) {
				return
			}
			const offsetLeft = activeItemEl.offsetLeft
			const half = (viewAreaWidth.value - activeItemEl.offsetWidth) / 2
			let changeX = 0
			const absTransX = Math.abs(translateX.value)
			if (offsetLeft <= absTransX + half) {
				changeX = half - (offsetLeft + translateX.value)
			} else {
				changeX = -(offsetLeft - absTransX - half)
			}
			let targetX = changeX + translateX.value
			if (targetX > 0) {
				targetX = 0
			}
			if (targetX < -offsetX.value) {
				targetX = -offsetX.value
			}
			reBounding.value = true
			translateX.value = targetX
		}
		const handleTouchStart = (event) => {
			event.stopPropagation()
			cancelAnimationFrame(inertiaFrame.value)
			lastX.value = event.touches[0].clientX
		}
		const handleTouchMove = (event) => {
			if (offsetX.value <= 0) {
				return
			}
			event.preventDefault()
			event.stopPropagation()
			touching.value = true
			startMoveTime.value = endMoveTime.value
			startX.value = lastX.value
			currentX.value = event.touches[0].clientX
			moveFollowTouch()
			endMoveTime.value = event.timeStamp
		}
		const handleTouchEnd = (event) => {
			touching.value = false
			if (reboundIfNeeded()) {
				cancelAnimationFrame(inertiaFrame.value)
			} else {
				let silenceTime = event.timeStamp - endMoveTime.value
				let timeStamp = endMoveTime.value - startMoveTime.value
				timeStamp = timeStamp > 0 ? timeStamp : 8
				if (silenceTime > 100) {
					return
				}
				speed.value = (lastX.value - startX.value) / timeStamp
				acceleration.value = speed.value / props.inertialDuration
				frameStartTime.value = Date.now()
				inertiaFrame.value = requestAnimationFrame(moveByInertia)
			}
		}
		const bindEvents = () => {
			const el = viewAreaRef.value
			el.addEventListener('touchstart', handleTouchStart, false)
			el.addEventListener('touchmove', handleTouchMove, false)
			el.addEventListener('touchend', handleTouchEnd, false)
		}
		const removeEvents = () => {
			const el = viewAreaRef.value
			el.removeEventListener('touchstart', handleTouchStart)
			el.removeEventListener('touchmove', handleTouchMove)
			el.removeEventListener('touchend', handleTouchEnd)
		}
		onMounted(() => {
			windowInit()
			bindEvents()
			refreshState()
		})
		onBeforeUnmount(() => {
			removeEvents()
		})
		expose({
			resize
		})
		return {
			viewAreaRef,
			listRef,
			activeValue,
			lineOffset,
			activeLineWidth,
			viewAreaWidth,
			offsetX,
			speed,
			touching,
			reBounding,
			translateX,
			startX,
			lastX,
			currentX,
			startMoveTime,
			endMoveTime,
			frameTime,
			frameStartTime,
			frameEndTime,
			inertiaFrame,
			zeroSpeed,
			acceleration,
			listStyle,
			activeBarStyle,
			isMoveLeft
		}
	}
})
const _hoisted_1 = {
	ref: 'viewAreaRef',
	class: 'fun-tabs'
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return (
		openBlock(),
		createElementBlock(
			'div',
			_hoisted_1,
			[
				createElementVNode(
					'div',
					{
						ref: 'listRef',
						style: normalizeStyle(_ctx.listStyle),
						class: 'fun-tabs__tab-list'
					},
					[
						renderSlot(_ctx.$slots, 'default'),
						createElementVNode(
							'div',
							{
								style: normalizeStyle(_ctx.activeBarStyle),
								class: 'fun-tabs__active-line'
							},
							null,
							4
						)
					],
					4
				)
			],
			512
		)
	)
}
var FunTabs = /* @__PURE__ */ _export_sfc(_sfc_main, [
	['render', _sfc_render],
	['__file', '/Users/scoutyin/Documents/ScoutYin/fun-tab/src/tabs.vue']
])

export { FunTabs as default }
