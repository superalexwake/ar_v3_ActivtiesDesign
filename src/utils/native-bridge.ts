/**
 * Native Bridge 包装（web 端）。
 *
 * 从旧 `utils/pwa.ts` 原样搬出，**行为零变化**：
 *   - `isOpenExternalUrl()` / `isOpenInternalUrl()` 探测 NativeBridge 能力
 *   - `openExternalUrl(url)`                       通过 NativeBridge 打开外链；失败 toast
 *   - `openInternalUrl(params)`                    通过 NativeBridge 打开内嵌页，自动注入 CSS 变量颜色
 *
 * 跟 `utils/bridges/JSBridgesUtil.ts` 的 `openExternalUrl` 是**不同实现**：
 *   - JSBridgesUtil: URL 格式校验 + 非 hybrid 环境用 window.open fallback
 *   - 本文件: 无校验、无 fallback、错误 toast；保持原有调用方语义
 *
 * 调用方（共 9 文件 37 处）一律通过 `@/utils` barrel 引入，迁移时签名保持不变。
 */

import { showToast } from 'vant'

interface AppParams {
	[key: string]: any
}

// 探测 NativeBridge 能力 ---------------------------------------------------

export function isOpenExternalUrl() {
	try {
		if (window.NativeBridge?.openExternalUrl) {
			return true
		}
	} catch (e) {
		console.error('🍎检查是否为原生WebView失败:', e)
	}
	return false
}

export function isOpenInternalUrl() {
	try {
		if (window.NativeBridge?.openExternalPage) {
			return true
		}
	} catch (e) {
		console.error('🍎检查是否为原生WebView失败:', e)
	}
	return false
}

// 调用 NativeBridge -------------------------------------------------------

export function openInternalUrl(parms: AppParams) {
	const rootStyle = getComputedStyle(document.documentElement)
	const navColor = rootStyle.getPropertyValue('--bg_color_L2').trim();
	const bodyColor = rootStyle.getPropertyValue('--bg_color_L1').trim()

	const mainFontColor = rootStyle.getPropertyValue('--text_color_L1').trim()
	window.NativeBridge?.openExternalPage(
		JSON.stringify({
			...parms,
			backgroundColor: navColor,
			fontColor: mainFontColor,
			bodyColor: bodyColor
		})
	)
}

export function openExternalUrl(url: string) {
	try {
		if (window.NativeBridge?.openExternalUrl) {
			window.NativeBridge.openExternalUrl(url)
		}
	} catch (e) {
		showToast({
			message: (e instanceof Error ? e.message : 'open external url failed'),
			duration: 2000,
			type: 'fail',
		})
		console.error('🍎打开外部链接失败:', e)
	}
}
