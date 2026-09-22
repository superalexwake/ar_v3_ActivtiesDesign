import {
	defineComponent,
	inject,
	ref,
	computed,
	toRef,
	onMounted,
	onUnmounted,
	openBlock,
	createElementBlock,
	normalizeStyle,
	createElementVNode,
	renderSlot,
	createTextVNode,
	toDisplayString,
	createCommentVNode
} from 'vue'
import { tabsInjectionKey } from './types.js'
import _export_sfc from './_virtual/plugin-vue_export-helper.js'

const _sfc_main = defineComponent({
	name: 'FunTabItem',
	props: {
		title: String,
		name: [String, Number],
		badge: [String, Number]
	},
	setup(props) {
		const parent = inject(tabsInjectionKey)
		const el = ref()
		const style = computed(() => {
			return parent?.activeValue.value === props.name
				? {
						color: parent?.activeColor.value
				  }
				: {}
		})
		const handleClick = () => {
			parent?.setActiveValue(props.name)
		}
		const instance = {
			name: toRef(props, 'name'),
			el
		}
		onMounted(() => {
			parent.addItem?.(instance)
		})
		onUnmounted(() => {
			parent.removeItem?.(instance)
		})
		return {
			el,
			style,
			handleClick
		}
	}
})
const _hoisted_1 = { class: 'fun-tab-item__wrap' }
const _hoisted_2 = { class: 'fun-tab-item__label' }
const _hoisted_3 = {
	key: 0,
	class: 'fun-tab-item__badge'
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return (
		openBlock(),
		createElementBlock(
			'div',
			{
				ref: 'el',
				style: normalizeStyle(_ctx.style),
				class: 'fun-tab-item',
				onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
			},
			[
				createElementVNode('div', _hoisted_1, [
					renderSlot(_ctx.$slots, 'icon'),
					createElementVNode('div', _hoisted_2, [
						renderSlot(_ctx.$slots, 'default', {}, () => [createTextVNode(toDisplayString(_ctx.title), 1)])
					]),
					_ctx.badge
						? (openBlock(), createElementBlock('div', _hoisted_3, toDisplayString(_ctx.badge), 1))
						: createCommentVNode('v-if', true)
				])
			],
			4
		)
	)
}
var FunTabItem = /* @__PURE__ */ _export_sfc(_sfc_main, [
	['render', _sfc_render],
	['__file', '/Users/scoutyin/Documents/ScoutYin/fun-tab/src/tab-item.vue']
])

export { FunTabItem as default }
