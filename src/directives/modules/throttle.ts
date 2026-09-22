/**
 * @description
 * v-throttle
 * @param {Function} fn
 * @example
 * <button v-throttle="[fn, 500]">click</button>
 */
import type { Directive, DirectiveBinding } from 'vue'
interface ElType extends HTMLElement {
    __handleClick__: () => any
    disabled: boolean
}
const throttle: Directive = {
    mounted(el: ElType, binding: DirectiveBinding) {
        if (
            typeof binding.value[0] !== 'function' ||
            typeof binding.value[1] !== 'number'
        ) {
            throw new Error(
                'v-throttle: value must be an array that includes a function and a number'
            )
        }
        let timer: NodeJS.Timeout | null = null
        const fn = binding.value[0]
        const delay = binding.value[1]
        el.__handleClick__ = function () {
            if (timer) {
                clearTimeout(timer)
            }
            if (!el.disabled) {
                el.disabled = true
                fn()
                timer = setTimeout(() => {
                    el.disabled = false
                }, delay || 500)
            }
        }
        el.addEventListener('click', el.__handleClick__)
    },
    beforeUnmount(el) {
        el.removeEventListener('click', el.__handleClick__)
    },
}

export default throttle
