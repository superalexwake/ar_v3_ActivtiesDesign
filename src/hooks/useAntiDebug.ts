import { onBeforeUnmount, onMounted, watch } from 'vue'
import { getUserDeviceType, isMobile, isPC } from '@/utils'

type AntiDebugSettingStore = {
	getIsOpenBrowserConsoleDebug?: boolean
	isOpenBrowserConsoleDebug?: boolean
}

type RealMobileResult = {
	result: boolean
	message: string
	details: {
		userAgent: string
		platform: string
		touchPoints: number
		deviceMemory: number
		cores: number
		dpr: number
		viewport: string
		glRenderer: string
		reasons: string[]
	}
}

const DEVTOOLS_THRESHOLD = 150
const DELAY_THRESHOLD = 400

let activeCleanup: (() => void) | null = null

function getUrlParams() {
	const params = new URLSearchParams(window.location.search)
	const hashQueryIndex = window.location.hash.indexOf('?')

	if (hashQueryIndex >= 0) {
		const hashParams = new URLSearchParams(window.location.hash.slice(hashQueryIndex + 1))
		hashParams.forEach((value, key) => {
			params.set(key, value)
		})
	}

	return params
}

function isFrontendDebugBypassed() {
	const params = getUrlParams()
	return params.get('check') === '0'
}

function shouldBypassAntiDebug() {
	return import.meta.env.DEV || isFrontendDebugBypassed()
}

function getBrowserConsoleDebug(settingStore: AntiDebugSettingStore) {
	const getterValue = settingStore?.getIsOpenBrowserConsoleDebug
	if (typeof getterValue === 'boolean') return getterValue

	const stateValue = settingStore?.isOpenBrowserConsoleDebug
	if (typeof stateValue === 'boolean') return stateValue

	return true
}

function detectRealMobileEnvironment(): RealMobileResult {
	const ua = navigator.userAgent || ''
	const platform = navigator.platform || ''
	const hasTouch = 'ontouchstart' in window
	const touchPoints = navigator.maxTouchPoints || 0
	const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0
	const cores = navigator.hardwareConcurrency || 0
	const dpr = window.devicePixelRatio || 1
	const width = window.innerWidth
	const height = window.innerHeight
	let glRenderer = 'unknown'

	try {
		const gl = document.createElement('canvas').getContext('webgl')
		const dbgInfo = gl?.getExtension('WEBGL_debug_renderer_info')
		if (dbgInfo) {
			glRenderer = gl?.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL)
		} else if (gl) {
			glRenderer = gl.getParameter(gl.RENDERER)
		}
	} catch (e) {}

	const reasons: string[] = []
	const isMobileUA = /Android|iPhone|iPad|iPod/i.test(ua)
	if (!isMobileUA) reasons.push('UA is not mobile')

	const isDesktopPlatform = /Win|Mac|Linux/i.test(platform)
	if (isDesktopPlatform) reasons.push(`Desktop platform: ${platform}`)

	if (!hasTouch && touchPoints === 0) reasons.push('No touch capability')

	if (cores >= 8 || deviceMemory >= 12) {
		reasons.push(`High hardware capability: ${cores} cores / ${deviceMemory}GB`)
	}

	if (/Intel|NVIDIA|Radeon/i.test(glRenderer)) {
		reasons.push(`Desktop WebGL renderer: ${glRenderer}`)
	} else if (/Mali|Adreno|Apple|PowerVR/i.test(glRenderer)) {
		reasons.push(`Mobile WebGL renderer: ${glRenderer}`)
	} else {
		reasons.push(`WebGL renderer: ${glRenderer}`)
	}

	const isEmulatedByDevTools = window.outerWidth === 0 && window.outerHeight === 0
	if (isEmulatedByDevTools) reasons.push('outerWidth/outerHeight is zero')

	const score =
		(isMobileUA ? 1 : 0) +
		(!isDesktopPlatform ? 1 : 0) +
		(hasTouch || touchPoints > 0 ? 1 : 0) +
		(!/Intel|NVIDIA|Radeon/i.test(glRenderer) ? 1 : 0)

	const result = score >= 3 && !isEmulatedByDevTools

	return {
		result,
		message: result ? 'Real mobile environment' : 'Desktop browser or DevTools emulation',
		details: {
			userAgent: ua,
			platform,
			touchPoints,
			deviceMemory,
			cores,
			dpr,
			viewport: `${width}x${height}`,
			glRenderer,
			reasons
		}
	}
}

function detectEnvironment() {
	const ua = navigator.userAgent.toLowerCase()
	const isMobileUA = /mobile|android|iphone|ipad|ipod/i.test(ua)
	const isDesktopBrowser = ua.includes('chrome/') || ua.includes('firefox/') || ua.includes('safari/') || ua.includes('edge/')
	const isPCEnvironment = window.screen.width >= 1024 || window.screen.height >= 768
	const hasTouch = 'ontouchstart' in window
	const hasMaxTouchPoints = navigator.maxTouchPoints > 0
	const isTouchMismatch = hasTouch && !hasMaxTouchPoints
	const abnormalDPR = !Number.isInteger(window.devicePixelRatio)
	const lowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4

	return isPCEnvironment && isDesktopBrowser && isMobileUA && (isTouchMismatch || abnormalDPR || lowConcurrency)
}

const DevToolsDetector = (() => {
	const listeners = new Set<(detected: boolean) => void>()
	let running = false
	let lastTime = performance.now()
	let rafId: number | null = null

	function checkDevTools() {
		const widthDiff = window.outerWidth - window.innerWidth
		const heightDiff = window.outerHeight - window.innerHeight
		const sizeSuspicious = widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD
		const isMobileUA = /mobile|android|iphone|ipad/i.test(navigator.userAgent)
		const isMobileEmulation = detectEnvironment() || isMobileUA
		const now = performance.now()
		const delta = now - lastTime
		lastTime = now
		const delaySuspicious = delta > DELAY_THRESHOLD
		const detected = isMobileEmulation || sizeSuspicious || delaySuspicious

		listeners.forEach(cb => cb(detected))
		if (running && !detected) rafId = requestAnimationFrame(checkDevTools)
	}

	function keyListener(e: KeyboardEvent) {
		if (
			e.key === 'F12' ||
			(e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'U', 'S'].includes(e.key.toUpperCase())) ||
			(e.metaKey && e.altKey && ['I', 'J', 'C', 'U', 'S'].includes(e.key.toUpperCase())) ||
			(e.ctrlKey && e.key === 'F12') ||
			(e.ctrlKey && e.shiftKey && e.key === 'F12')
		) {
			listeners.forEach(cb => cb(true))
		}
	}

	function contextMenuListener(e: MouseEvent) {
		const target = e.target as HTMLElement
		const text = target?.innerText?.toLowerCase() || ''
		const title = target?.title?.toLowerCase() || ''
		if (
			text.includes('inspect') ||
			title.includes('inspect') ||
			text.includes('view page source') ||
			title.includes('source') ||
			text.includes('developer tools') ||
			title.includes('developer tools')
		) {
			listeners.forEach(cb => cb(true))
		}
	}

	return {
		addListener(cb: (detected: boolean) => void) {
			listeners.add(cb)
		},
		removeListener(cb: (detected: boolean) => void) {
			listeners.delete(cb)
		},
		launch() {
			if (running) return
			running = true
			lastTime = performance.now()
			rafId = requestAnimationFrame(checkDevTools)
			window.addEventListener('keydown', keyListener)
			document.addEventListener('contextmenu', contextMenuListener)
		},
		stop() {
			running = false
			if (rafId !== null) {
				cancelAnimationFrame(rafId)
				rafId = null
			}
			window.removeEventListener('keydown', keyListener)
			document.removeEventListener('contextmenu', contextMenuListener)
		},
		isRunning() {
			return running
		}
	}
})()

function handleDevToolsDetected() {
	if (shouldBypassAntiDebug()) return
	console.warn('DevTools detected')
	document.body.innerHTML = `
		<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100vh;color:#fff;background:#111;font-family:sans-serif;text-align:center;">
			<div>
				<h2>Debug mode is disabled.</h2>
				<p>Please close developer tools and refresh the page.</p>
			</div>
		</div>
	`
}

async function shouldEnableAntiDebug() {
	if (shouldBypassAntiDebug()) return false

	const deviceType = await getUserDeviceType()
	const realMachine = detectRealMobileEnvironment()

	return (
		(isMobile && deviceType === 3 && !realMachine.result) ||
		(isPC && deviceType === 0 && !realMachine.result)
	)
}

function startAntiDebug() {
	if (activeCleanup) return

	let devToolsTriggered = false
	const onDetected = (isDetected: boolean) => {
		if (isDetected && !devToolsTriggered) {
			devToolsTriggered = true
			handleDevToolsDetected()
		}
	}
	const handleVisibility = () => {
		if (document.hidden) {
			DevToolsDetector.stop()
		} else if (!DevToolsDetector.isRunning()) {
			setTimeout(() => {
				if (!activeCleanup || shouldBypassAntiDebug()) return
				DevToolsDetector.launch()
			}, 1000)
		}
	}

	DevToolsDetector.addListener(onDetected)
	DevToolsDetector.launch()
	document.addEventListener('visibilitychange', handleVisibility)

	activeCleanup = () => {
		document.removeEventListener('visibilitychange', handleVisibility)
		DevToolsDetector.removeListener(onDetected)
		DevToolsDetector.stop()
		activeCleanup = null
	}
}

function stopAntiDebug() {
	if (activeCleanup) {
		activeCleanup()
		return
	}
	DevToolsDetector.stop()
}

export function useAntiDebug(settingStore: AntiDebugSettingStore) {
	let disposed = false

	const applyAntiDebugState = async () => {
		if (disposed || shouldBypassAntiDebug() || getBrowserConsoleDebug(settingStore)) {
			stopAntiDebug()
			return
		}

		if (await shouldEnableAntiDebug()) {
			startAntiDebug()
		} else {
			stopAntiDebug()
		}
	}
	const handleUrlChange = () => {
		void applyAntiDebugState()
	}

	const stopWatch = watch(
		() => getBrowserConsoleDebug(settingStore),
		() => {
			void applyAntiDebugState()
		}
	)

	onMounted(() => {
		window.addEventListener('hashchange', handleUrlChange)
		window.addEventListener('popstate', handleUrlChange)
		void applyAntiDebugState()
	})

	onBeforeUnmount(() => {
		disposed = true
		window.removeEventListener('hashchange', handleUrlChange)
		window.removeEventListener('popstate', handleUrlChange)
		stopWatch()
		stopAntiDebug()
	})

	return {
		refresh: applyAntiDebugState,
		stop: stopAntiDebug
	}
}
