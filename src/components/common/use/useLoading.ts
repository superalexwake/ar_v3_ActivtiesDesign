import { useEventBus } from '@/components/common/use'
import { onUnmounted, ref } from 'vue'

export const useLoading = () => {
	let timer: any = null
	let loading = false
	const flag = ref(false)
	const eventBus = useEventBus()
	const start = (callback: Function) => {
		flag.value = false
		loading = true
		eventBus.emit('changeIsGame')
		clearInterval(timer)
		timer = setTimeout(() => {
			flag.value = true
			callback()
			eventBus.emit('changeIsGame')
		}, 10000)
	}
	const end = (isNow?: boolean) => {
		flag.value = false
		loading = false
		clearInterval(timer)
		if (isNow) {
			eventBus.emit('changeIsGame')
		} else {
			setTimeout(() => {
				eventBus.emit('changeIsGame')
			}, 10000)
		}
	}

	onUnmounted(() => {
		flag.value = false
		loading = false
		clearInterval(timer)
		console.log('离开页面，清空定时器')
	})

	return {
		start,
		end,
		flag
	}
}
