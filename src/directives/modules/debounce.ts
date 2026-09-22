/**
 * v-debounce
 * @param {Function} fn
 * @example
 * <button v-debounce="[fn, 500]">click</button>
 */
import type { Directive, DirectiveBinding } from 'vue'
interface ElType extends HTMLElement {
    __handleClick__: () => any
}
const debounce: Directive = {
    mounted(el: ElType, binding: DirectiveBinding) {
        if (
            typeof binding.value[0] !== 'function' ||
            typeof binding.value[1] !== 'number'
        ) {
            throw new Error(
                'v-debounce: value must be an array that includes a function and a number'
            )
        }
        let timer: NodeJS.Timeout | null = null
        const fn = binding.value[0]
        const delay = binding.value[1]
        el.__handleClick__ = function () {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                fn()
            }, delay || 500)
        }
        el.addEventListener('click', el.__handleClick__)
    },
    beforeUnmount(el: ElType) {
        el.removeEventListener('click', el.__handleClick__)
    },
}

export default debounce
