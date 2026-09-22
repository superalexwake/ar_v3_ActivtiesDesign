import { showLoadingToast, type LoadingProps } from 'vant'
import type { ExtractPropTypes } from 'vue'
// import { isExpired } from './isExpired'

/* 全局请求 loading */
let loadingInstance: ExtractPropTypes<LoadingProps> & { close: () => void }

const startLoading = async () => {
	loadingInstance = showLoadingToast({
		duration: 3500,
		forbidClick: true,
		loadingType: 'spinner',
		overlay: true,
		message: '加载中'
	})
	// await isExpired()
}
const endLoading = () => {
	loadingInstance.close()
}

// 声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
// 调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export const showFullScreenLoading = () => {
	if (needLoadingRequestCount === 0) {
		startLoading()
	}
	needLoadingRequestCount++
}

export const tryHideFullScreenLoading = () => {
	if (needLoadingRequestCount <= 0) return
	needLoadingRequestCount--
	if (needLoadingRequestCount === 0) {
		endLoading()
	}
}
