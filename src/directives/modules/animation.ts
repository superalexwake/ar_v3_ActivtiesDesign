import type { Directive } from 'vue'
import AnimationScrill from './AnimationScrill'

// 扩展 Window 接口
declare global {
    interface Window {
        hiddenAn?: HTMLElement[]
    }
    
    interface HTMLElement {
        AnimationScroll?: AnimationScrill
    }
}
document.addEventListener('touchmove', () => {
    window.hiddenAn?.map(ele => {
        ele.AnimationScroll?.foldUp()
        if (ele.AnimationScroll) {
            clearTimeout(ele.AnimationScroll!.timer)
            ele.AnimationScroll!.timer = setTimeout(() => {
                if (ele && ele.AnimationScroll) {
                    clearTimeout(ele.AnimationScroll!.timer)
                    ele.AnimationScroll?.expand()
                }
            }, 1500)
        }
    })
})
const animationScroll:Directive = {

    mounted(el: HTMLElement, binding) {
        el.AnimationScroll = new AnimationScrill(el)
        if (window.hiddenAn && Array.isArray(window.hiddenAn)) {
            window.hiddenAn.push(el)
        } else {
            window.hiddenAn = [el]
        }
    },
    unmounted(el) {
        // 清理资源
        if (el.AnimationScroll) {
            // 清理el在window中的引用
            if (Array.isArray(window.hiddenAn)) {
                window.hiddenAn = window.hiddenAn.filter(item => item != el)
            }
            el.AnimationScroll = undefined
        }
    }
}

export default animationScroll