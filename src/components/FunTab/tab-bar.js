import { defineComponent, ref, watch, provide, toRef, openBlock, createElementBlock, createElementVNode, renderSlot } from 'vue'
import { tabsInjectionKey } from './types.js'
import _export_sfc from './_virtual/plugin-vue_export-helper.js'

const _sfc_main = defineComponent({
	name: 'FunTabBar',
	props: {
		modelValue: {
			type: [String, Number],
			default: ''
		},
		activeColor: {
			type: String,
			default: '#1677ff'
		}
	},
	emits: ['update:modelValue', 'change'],
	setup(props, { emit }) {
		const activeValue = ref(props.modelValue)
		watch(
			() => props.modelValue,
			(v) => {
				activeValue.value = v
			}
		)
		const setActiveValue = (value) => {
			activeValue.value = value
			emit('update:modelValue', value)
			emit('change', value)
		}
		provide(tabsInjectionKey, {
			activeValue,
			activeColor: toRef(props, 'activeColor'),
			setActiveValue
		})
	}
})
const _hoisted_1 = { class: 'fun-tab-bar' }
const _hoisted_2 = { class: 'fun-tab-bar-wrap' }
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return (
		openBlock(),
		createElementBlock('div', _hoisted_1, [createElementVNode('div', _hoisted_2, [renderSlot(_ctx.$slots, 'default')])])
	)
}
var FunTabBar = /* @__PURE__ */ _export_sfc(_sfc_main, [
	['render', _sfc_render],
	['__file', '/Users/scoutyin/Documents/ScoutYin/fun-tab/src/tab-bar.vue']
])

export { FunTabBar as default }
