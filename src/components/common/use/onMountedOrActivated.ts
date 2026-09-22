import { onMounted, nextTick, onActivated } from 'vue'

export function onMountedOrActivated(hook: () => void) {
	let mounted: boolean

	onMounted(async () => {
		hook()
		await nextTick(() => {
			mounted = true
		})
	})

	onActivated(() => {
		if (mounted) {
			hook()
		}
	})
}
