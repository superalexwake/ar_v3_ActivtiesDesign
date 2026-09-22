import { ref } from 'vue'
import { native } from '@/utils/bridges'

/**
 * 启动遮罩（StartPage）控制 hook。
 *
 * 历史包袱：原本每个 entrance/<arXXX>/App.vue 都拷了同一段
 *   - `const isStart = ref(false)` + 一段 if/else 读 sessionStorage + `setTimeout` 撤
 * 现在统一收编到这里。
 *
 * 行为：
 *   1. **fullapk 内自动跳过** —— 完整 apk 自带原生 splash screen，再来一层 H5 启动图
 *      会让用户看到"两次启动页"，体验割裂。其它套壳形态（embeddedApk / 普通 hybrid webview /
 *      纯 H5）没有原生 splash，仍需要这个 H5 启动遮罩盖加载期的闪烁。
 *   2. **同一 session 只显示一次** —— 用 sessionStorage 标记，避免路由内刷新重弹。
 *   3. **timeout 默认 2000ms** —— 跟旧代码一致。需要时调用方传参覆盖。
 *
 * 用法：
 * ```ts
 * // entrance/arXXX/App.vue
 * const { isStart } = useStartPage()
 * // 模板里 <StartPage v-if="isStart" />
 * ```
 *
 * @param timeoutMs 启动遮罩展示时长（ms），默认 2000
 */
const STORAGE_KEY = 'webStartPageShown'
const DEFAULT_TIMEOUT = 2000

export function useStartPage(timeoutMs: number = DEFAULT_TIMEOUT) {
	const isStart = ref(false)

	// fullapk 自带原生 splash，跳过 H5 启动遮罩避免二次启动
	if (native.isFullapk()) return { isStart }

	// 同一 session 已经显示过，跳过
	if (sessionStorage.getItem(STORAGE_KEY) === '1') return { isStart }

	sessionStorage.setItem(STORAGE_KEY, '1')
	isStart.value = true

	setTimeout(() => {
		isStart.value = false
	}, timeoutMs)

	return { isStart }
}
