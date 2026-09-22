import { useSessionStorage } from '@vueuse/core'
import type { Directive } from 'vue'
const permission: Directive = {
	mounted(el, binding) {
		const { value: id } = binding
		let permission: any = useSessionStorage('permission', null)
		if (permission.value === null || !id) return
		permission && (permission = JSON.parse(permission.value))
		if (permission && permission[id] === false) {
			el.style.display = 'none'
		}
	}
}

export default permission
