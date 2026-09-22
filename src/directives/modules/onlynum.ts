// onlyNum.ts
import type { Directive, DirectiveBinding } from 'vue'

const onlyNum: Directive = {
	mounted(el: HTMLInputElement, binding: DirectiveBinding) {
		el.addEventListener('input', (event) => {
			const inputValue = el.value
			const onlyNumbers = inputValue.replace(/\D+/g, '')
			el.value = onlyNumbers
			binding.value = onlyNumbers
		})
	}
}

export default onlyNum
