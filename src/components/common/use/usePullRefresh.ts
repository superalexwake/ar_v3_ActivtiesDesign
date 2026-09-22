import { onMounted, onUnmounted, ref } from 'vue'
import PullToRefresh from 'pulltorefreshjs'
import { Locale } from 'vant'
import { randomGuid } from '@/utils/util'

export default function usePullRefresh(callback: Function) {
	const elementRef = ref<HTMLElement>()
	onMounted(() => {
		const id = 'refresh' + randomGuid()
		if (elementRef.value) {
			elementRef.value.setAttribute('id', id)
		}
		// 放在nextTick里面无法确保设置id完成了
		setTimeout(() => {
			const messages = Locale.messages()
			PullToRefresh.init({
				mainElement: '#' + id,
				triggerElement: 'body',
				onRefresh() {
					callback()
				},
				instructionsReleaseToRefresh: messages.vanPullRefresh.loosing,
				instructionsPullToRefresh: messages.vanPullRefresh.pulling,
				instructionsRefreshing: messages.loading
			})
		}, 200)
	})
	onUnmounted(() => {
		PullToRefresh.destroyAll()
	})
	return {
		elementRef
	}
}
