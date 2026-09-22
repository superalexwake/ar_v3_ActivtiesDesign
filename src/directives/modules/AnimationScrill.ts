// 导出 AnimationScrill 类供全局使用
export class AnimationScrill {
	public timer: NodeJS.Timeout | undefined = undefined
	private el: HTMLElement | undefined = undefined

	constructor(ele: HTMLElement) {
		if (!this.el) {
			this.el = ele
			this.el.style.transition = 'all .3s'
			this.setTransformStyle('none')
		}
	}
	
	foldUp() {
		if (this.el) {
			// 视口的宽度和高度
			const viewWidth = window.innerWidth
			const viewHeight = window.innerHeight
			// 获取当前元素的位置信息，根据当前位置计算元素距离视窗上下左右四个数值
			const rect = this.el.getBoundingClientRect()
			const top = rect.top < 0 ? 0 : rect.top
			const left = rect.left < 0 ? 0 : rect.left
			const right = viewWidth - rect.right < 0 ? 0 : viewWidth - rect.right
			const bottom = viewHeight - rect.bottom < 0 ? 0 : viewHeight - rect.bottom
			// 计算当前元素与那个个边的距离最近
			const min = Math.min(top, left, right, bottom)
			// 计算折叠位移量
			
			if (min === top) {
				const foldDistance = rect.height * 0.8 + top
				this.setTransformStyle(`translate(0, -${foldDistance}px)`)
			}
			else if (min === left) {
				const foldDistance = -1 * rect.width * 0.8 - left
				this.setTransformStyle(`translate(${foldDistance}px, 0)`)
			}
			else if (min === right) {
				const foldDistance = rect.width * 0.8 + right
				this.setTransformStyle(`translate(${foldDistance}px, 0)`)
			}
			else if (min === bottom) {
				const foldDistance = rect.height * 0.8 + bottom
				this.setTransformStyle(`translate(0, ${foldDistance}px)`)
			}
		}
	}
	
	expand() {
		if (this.el) {
			this.setTransformStyle('none')
		}
	}
	
	setTransformStyle(value: string) {
		if (this.el) {
			const nowValue = getStyle(this.el).transform ?? 'none'
			if (nowValue == 'none' && value != nowValue) {
				this.el.style.transform = value
			} else if (value == 'none' && value != nowValue) {
				this.el.style.transform = value
			}
		}
	}
}

function getStyle(ele: HTMLElement) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(ele, null)
	} else if (document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(ele, null)
	} else {
		return ele.style
	}
}

export default AnimationScrill