// 3秒钟内只能触发一次点击事件的指令 throttleClick.ts
import type { Directive } from 'vue'

type ThrottleClickOptions = {
	[x: string]: any
	wait?: number
}

const throttleClick: Directive<ThrottleClickOptions> = {
	mounted(el, binding) {
		let lastClickTime = 0
		const wait = binding.value && binding.value.wait ? binding.value.wait : 3000 // 默认等待时间为 3000ms

		const throttleHandler = (event: Event) => {
			const now = Date.now()
			if (now - lastClickTime >= wait) {
				lastClickTime = now
				binding.value && binding.value.handler && binding.value.handler(event)
			}
		}

		el.addEventListener('click', throttleHandler)

		el._throttleClickCleanup = () => {
			el.removeEventListener('click', throttleHandler)
		}
	},
	unmounted(el) {
		el._throttleClickCleanup && el._throttleClickCleanup()
		delete el._throttleClickCleanup
	}
}

export default throttleClick
