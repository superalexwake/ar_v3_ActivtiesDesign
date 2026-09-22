/**
 * v-lazy
 * @param {string} 图片地址
 * @example
 * <img v-lazy="imgUrl" />
 * <img v-lazy="'https://www.mockimg.com/123.png'"  />
 */

import type { DirectiveBinding } from 'vue'

const vLazy = (observer: IntersectionObserver) => {
	return {
		beforeMount: (el: HTMLImageElement, binding: DirectiveBinding) => {
			el.classList.add('ar-lazyload')
			const { value } = binding
			// <img data-origin="" />
			el.dataset.origin = value
			// console.log('beforeMount: ', binding.value)
			observer.observe(el)
		},
		updated(el: HTMLImageElement, binding: DirectiveBinding) {
			//实时更新最新的目标内容
			el.dataset.origin = binding.value
			// console.log('update: ', binding.value)
			observer.observe(el)
		},
		unmounted(el: HTMLImageElement, binding: DirectiveBinding) {
			observer.unobserve(el)
			// console.log('unmounted: ', binding.value)
		},

		mounted(el: HTMLImageElement, binding: DirectiveBinding) {
			// if (typeof binding.value !== 'string') {
			// 	throw new Error('v-lazy: value must be a string')
			// }
			observer.observe(el)
		}
	}
}

export default vLazy
