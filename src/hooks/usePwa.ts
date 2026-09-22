/**
 * PWA 模块（项目内唯一的 PWA 落点）
 *
 * 历史背景：原本分散在 4 个文件里：
 *   - hooks/usePwaDownload.ts            (hook 每次调用都加 listener、isInPwaApp 名实反转)
 *   - components/common/use/useManifest.ts (零调用方的死代码)
 *   - hooks/useWebAppDetection.ts        (只服务一个页面、80% ref 无人读)
 *   - utils/pwa.ts                       (PWA + NativeBridge + IndexedDB 混在一起)
 *
 * 全部 PWA 相关现在集中在本文件，按"模块顶层副作用"模型组织：
 *   - 启动一次性事件（beforeinstallprompt / appinstalled）  → IIFE 形式监听
 *   - 静态平台检测                                          → 模块顶层 const
 *   - 持久化状态                                            → useStorage
 *   - 安装动作 / SW 注册 / Manifest 注入                    → 函数 export
 *
 * 兼容：`usePwaDownload()` 旧调用签名通过 deprecated shim 保留。
 */

import { computed, reactive, ref } from 'vue'
import { useEventListener, useMediaQuery, useStorage } from '@vueuse/core'
import { showToast } from 'vant'
import { GetPwaDomainList, getHomePwaSettingPageInfo } from '@/api'
import { decodeFromBase64 } from '@/utils/basic'
import { setKeyToDb } from '@/utils/indexdb-storage'
import { resolveInviteCode } from '@/utils/inviteCode'
import { getStoredPixelId } from '@/utils/point'

// =============================================================================
// 平台检测（模块加载时算一次或响应式）
// =============================================================================

/**
 * 当前是否运行在独立 PWA 窗口（iOS 主屏 / Android TWA / 桌面 Chrome 独立模式）。
 * useMediaQuery 让 display-mode 切换时自动更新；叠加 iOS Safari 私有 navigator.standalone。
 */
const standaloneMatch = useMediaQuery('(display-mode: standalone)')
export const isStandalone = computed(
	() => standaloneMatch.value || navigator.standalone === true,
)

/** iOS / iPadOS（含 iPadOS 13+ 伪装 Mac 的情形）。优于 utils/is.ts 的 UA regex 检测。 */
export const isIOSDevice =
	['iPad', 'iPhone', 'iPod'].includes(navigator.platform)
	|| (navigator.userAgent.includes('Mac') && 'ontouchend' in document)

const IN_APP_BROWSER_KEYWORDS = [
	'wv', 'FBAN', 'FBAV', 'FB_IAB', 'Instagram', 'MicroMessenger', 'Twitter',
]

/** 当前页面是否在内置浏览器里（FB / IG / 微信 / Twitter / Android WebView ...）。 */
export function isInAppBrowser(): boolean {
	const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ''
	return IN_APP_BROWSER_KEYWORDS.some(k => ua.includes(k))
}

/**
 * 当前是否运行在 PWA 窗口（与 isStandalone 一致；提供函数形式给 router 守卫等场景用）。
 *
 * 历史包袱修正：旧 isInPwaApp 实现是 standalone 取反，调用方靠双重否定走对。
 * 本次同步翻转：返回 true 表示**在** PWA 里。调用方注意：原 router `if (isInPwaApp() && ...)`
 * 含义是"不在 PWA 时跳转"，现在要改成 `if (!isInPwaApp() && ...)`。
 */
export const isInPwaApp = () => isStandalone.value

// =============================================================================
// 持久化标记（useStorage 自动同步 + 跨 tab 同步）
// =============================================================================

const webAppAvailable = useStorage('webAppAvailable', false)
export const isInstalled = useStorage('webAppInstalled', false)

// =============================================================================
// PWA 安装提示状态
// =============================================================================

/** Chromium 的 deferred 安装提示事件；未触发或已消费时为 null。 */
export const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

/** 当前是否可以触发 PWA 安装提示（事件已就绪 & 尚未消费）。 */
export const canInstallPWA = ref(false)

/**
 * 旧版兼容 shim：`const { PWA } = usePwaDownload()` 仍可用。
 * 内部字段已迁到模块顶层 ref，PWA 对象只是 facade。
 */
export const PWA = reactive<{
	canIUse: boolean
	download: (() => Promise<'accepted' | 'dismissed' | 'unavailable'>) | null
}>({
	canIUse: false,
	download: null,
})

// =============================================================================
// 唯一一处 beforeinstallprompt / appinstalled 监听
// -----------------------------------------------------------------------------
// 旧代码：usePwaDownload + useManifest + useWebAppDetection 三处各自监听，
// 触发时序敏感、多次注册泄漏。现在统一到这里一次。
// 模块作用域 useEventListener 没有 effectScope 可绑就不挂 cleanup，正好对应"应用全生命周期常驻"。
// =============================================================================

useEventListener(window, 'beforeinstallprompt', e => {
	e.preventDefault()
	deferredPrompt.value = e
	canInstallPWA.value = true
	PWA.canIUse = true
	webAppAvailable.value = true
}, { once: true })

useEventListener(window, 'appinstalled', () => {
	canInstallPWA.value = false
	PWA.canIUse = false
	deferredPrompt.value = null
	isInstalled.value = true
}, { once: true })

// =============================================================================
// 安装动作
// =============================================================================

/**
 * 触发 PWA 安装提示。
 *
 * @returns
 *   - `'accepted'`    用户接受了安装
 *   - `'dismissed'`   用户拒绝
 *   - `'unavailable'` 当前不可用（事件未就绪 / 已消费）
 */
export async function installPWA(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
	const evt = deferredPrompt.value
	if (!evt) return 'unavailable'

	await evt.prompt()
	const { outcome } = await evt.userChoice

	if (outcome === 'accepted') {
		canInstallPWA.value = false
		PWA.canIUse = false
	}
	// accepted / dismissed 都只能消费一次
	deferredPrompt.value = null
	return outcome
}

PWA.download = installPWA

// =============================================================================
// 重定向到 Chrome
// =============================================================================

/**
 * 若在内置浏览器（FB / 微信 ...）里打开，尝试跳到系统 Chrome 重新打开当前页。
 * 不在内置浏览器、或平台不识别时静默返回。
 */
export function redirectToChromeIfNeeded() {
	if (!isInAppBrowser()) return
	const stripped = window.location.href.replace(/^https?:\/\//, '')

	if (/Android/.test(navigator.userAgent)) {
		window.location.href =
			`intent://${stripped}#Intent;scheme=https;package=com.android.chrome;end`
		return
	}
	if (isIOSDevice) {
		window.location.href = `googlechrome://${stripped}`
	}
}

// =============================================================================
// 假应用商店配置（installApp 页面用）
// =============================================================================

export interface PwaJumpDomain {
	jumpDomain?: string
	apkUrl?: string
	isRecommended?: boolean
	[key: string]: unknown
}

/** 假应用商店展示数据；由 checkPwaApp 或 installApp 写入，模板只读。 */
export const pwaStore = reactive({
	id: 0,
	logo: '',
	icon: '',
	appName: '',
	appIntroduction: '',
	score: '',
	scoreCount: '',
	downloadCount: '',
	appPics: '',
	aboutApp: '',
	pwaJumpDomainList: [] as PwaJumpDomain[],
})

export function updateWebAppInfo(data: Partial<typeof pwaStore>) {
	Object.assign(pwaStore, data)
}

/**
 * 拉取后端 PWA 引导页配置；router 守卫用它判断是否要重定向到 /installApp。
 *
 * @returns `1` = 有配置（已 updateWebAppInfo）；`false` = 没配置或失败
 */
export async function checkPwaApp(): Promise<1 | false> {
	// @ts-ignore window._domain 是站点级注入对象
	const domain = window._domain || {}
	if (!domain.pwaDomain) return false
	try {
		const result = await getHomePwaSettingPageInfo({
			domainUrl: window.location.origin,
			deviceCode: '',
		})
		if (result.code == 0 && result.data) {
			updateWebAppInfo(result.data)
			return 1
		}
	} catch {
		return false
	}
	return false
}

// =============================================================================
// Service Worker 注册 + Native 参数读取
// =============================================================================

interface NativeAppParams {
	[key: string]: any
}

/** 应用启动时调一次：注册 SW，获取 native bridge 参数。 */
export const greatPwa = () => {
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/ar-sw.js')
				.then((registration) => {
					console.log('Service Worker registered with scope:', registration.scope)
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error)
				})
		})
	}
	getAppParamsFromNative()
}

function getAppParamsFromNative(): void {
	try {
		if (!window.NativeBridge?.getInfoString) {
			console.log('🍎NativeBridge 未定义')
			return
		}
		const jsonStr = window.NativeBridge.getInfoString()
		const params: NativeAppParams = JSON.parse(jsonStr)
		console.log('🍎从原生获取参数:', params)
		window.gtag?.('event', params.apkType)
		void setKeyToDb('apkInfo', params)

		// Lazy 取 Pinia store：避免模块加载时 Pinia 还没装就崩
		// （旧 utils/pwa.ts 顶层 `const apkStore = useApkState()` 是个时序定时炸弹）
		void import('@/stores/apk').then(({ useApkState }) => {
			useApkState().setApk(params.apkType || 'native')
		})
	} catch (e) {
		console.error('🍎获取原生参数失败:', e)
	}
}

// =============================================================================
// PWA Manifest 注入
// =============================================================================

/** 注入 PWA manifest（含 fb pixel / 邀请码透传给 start_url）。 */
export function injectManifestBlob(name: string) {
	const baseUrl = location.origin
	const invitationCode = resolveInviteCode()
	// 修复历史 bug：旧代码这里写的是 `| ''`（位运算）—— 三个值都假时拼成 `&fb_dynamic_pixel=0`
	const queryFbDynamicPixel = getStoredPixelId()

	const manifest = {
		name,
		short_name: name,
		start_url: baseUrl
			+ `/?pwa=1&fb_dynamic_pixel=${queryFbDynamicPixel}&invitationCode=${invitationCode}`,
		display: 'standalone',
		icons: [
			{ src: baseUrl + '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
			{ src: baseUrl + '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
		],
	}
	const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' })
	const blobURL = URL.createObjectURL(blob)
	const link = document.createElement('link')
	link.rel = 'manifest'
	link.href = blobURL
	document.head.appendChild(link)
	void fetchPwaDomainList()
}

/** 注入完 manifest 后拉一次备用域名列表，写进 IndexedDB / 通过 postMessage 同步给父窗口。 */
async function fetchPwaDomainList() {
	const { code, data }: any = await GetPwaDomainList()
	if (code != 0) return
	const list = data.map((item: string) => {
		const isLink = item.startsWith('http')
		return { jumpDomain: isLink ? item : decodeFromBase64(item) }
	})
	console.log('🍎获取PWA域名列表:', list)
	if (list.length === 0) return
	await setKeyToDb('domainInfo', { landingDomainList: list })
	if (isExternalDomainEmbed()) {
		window.parent.postMessage({ type: 'upDomainList', params: list }, '*')
	}
}

/**
 * 旧名 `isInIframe`，跟 iframe 无关；判定的是"是否被嵌入到外域第三方页面"
 * （URL 上挂 unTopWindow=true 且 domainType != google）。
 */
function isExternalDomainEmbed() {
	const url = new URL(window.location.href)
	return url.searchParams.get('unTopWindow') === 'true'
		&& url.searchParams.get('domainType') !== 'google'
}

// =============================================================================
// 兼容 shim：保留 `const { PWA } = usePwaDownload()` 旧调用
// =============================================================================

/**
 * @deprecated 直接 `import { PWA, isStandalone, canInstallPWA, installPWA } from '@/hooks/usePwa'`。
 *   保留是为了兼容存量 `const { PWA } = usePwaDownload()` 调用。
 */
export const usePwaDownload = () => ({
	PWA,
	deferredPrompt,
	isShowDwa: computed(() => !isStandalone.value),
})
