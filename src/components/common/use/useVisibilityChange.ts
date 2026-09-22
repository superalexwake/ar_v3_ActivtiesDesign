import { GlobalStore } from '@/stores'
import { onBeforeUnmount, onMounted } from 'vue'

export function useVisibilityChange() {
	const globalStore = GlobalStore()

	const visibilitychange = () => {
		if (document.visibilityState === 'visible') {
			globalStore.setvisibility()
		} else {
			globalStore.setvisibility(0)
			// 预留离开当前页签处理
		}
	}
	onMounted(() => {
		document.addEventListener('visibilitychange', visibilitychange)
	})
	onBeforeUnmount(() => {
		document.removeEventListener('visibilitychange', visibilitychange)
	})
}
