import { ref } from 'vue'
import { showNotify } from 'vant'
import { native } from '@/utils/bridges'

interface JGWebConfig {
	pushType: number
	apiKey: string
	apiSecret: string
}

interface MTpushInitOptions {
	appkey: string
	user_str: string
	swUrl?: string
	debugMode?: boolean
	success?: (data: unknown) => void
	fail?: (err: unknown) => void
	canGetInfo?: (data: unknown) => void
}

interface MTpushInterfaceType {
	init: (options: MTpushInitOptions) => void
	getRegistrationID: () => string
	onMsgReceive: (callback: (res: { type: number; data: { messages: Array<{ msg_id: string; title: string; content: string; extras: Record<string, string> }> } }) => void) => void
	onMsgClick: (callback: (data: { extras?: Record<string, string>; title?: string; content?: string }) => void) => void
	onMsgDisplay: (callback: (data: unknown) => void) => void
}

declare global {
	interface Window {
		MTpushInterface: MTpushInterfaceType
	}
}

const isJPushInitialized = ref(false)
const jgToken = ref('')
const isJPushReady = ref(false)
let jgWebConfig: JGWebConfig | null = null
let jgTokenResolve: ((token: string) => void) | null = null
/** 等待极光 token 就绪，超时返回空字符串 */
const waitForJGToken = (timeoutMs = 10000): Promise<string> => {
	if (jgToken.value) return Promise.resolve(jgToken.value)
	return new Promise<string>((resolve) => {
		jgTokenResolve = resolve
		setTimeout(() => {
			jgTokenResolve = null
			resolve('')
		}, timeoutMs)
	})
}

const getLoginToken = () => localStorage.getItem('token') || ''

const getUserId = (): string => {
	try {
		const userInfo = localStorage.getItem('userInfo')
		if (userInfo) {
			return JSON.parse(userInfo).userId || ''
		}
	} catch { /* ignore */ }
	return ''
}

/** 动态加载极光 Web SDK script */
const loadJPushSDK = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (window.MTpushInterface) {
			resolve()
			return
		}
		const script = document.createElement('script')
		script.src = '/jiguang-scope/webSdk.jiguang.min.3.3.5.js'
		script.onload = () => resolve()
		script.onerror = (err) => reject(err)
		document.head.appendChild(script)
	})
}


export const useJPush = (config?: JGWebConfig) => {
	if (!jgWebConfig && config) {
		jgWebConfig = config
	}

	const initJPush = async () => {
		console.log('[JPush] initJPush called, initialized:', isJPushInitialized.value, ', loginToken:', !!getLoginToken(), ', apiKey:', !!jgWebConfig?.apiKey, ', isAndroid:', native.isAndroid())
		if (native.isAndroid()) return
		if (isJPushInitialized.value) return
		if (!getLoginToken()) return
		if (!jgWebConfig?.apiKey) return

		try {
			await loadJPushSDK()

			if (!window.MTpushInterface) {
				console.warn('[JPush] SDK 加载失败，MTpushInterface 不存在')
				return
			}

			const appkey = jgWebConfig.apiKey

			const userId = getUserId()
			if (!userId) {
				console.warn('[JPush] 未获取到 userId，跳过初始化')
				return
			}

			window.MTpushInterface.init({
				appkey,
				user_str: userId,
				swUrl: '/jg_sw.js',
				debugMode: false,
				success() {
					console.log('[JPush] 初始化成功')
					isJPushInitialized.value = true
				},
				fail(err) {
					console.warn('[JPush] 初始化失败:', err)
				},
				canGetInfo() {
					const rid = window.MTpushInterface.getRegistrationID()
					if (rid) {
						jgToken.value = rid
						isJPushReady.value = true
						if (jgTokenResolve) {
							jgTokenResolve(rid)
							jgTokenResolve = null
						}
					}
				}
			})

			listenJPushMessage()
		} catch (err) {
			console.warn('[JPush] 加载 SDK 失败:', err)
		}
	}

	/** 监听前台推送消息，复用 Firebase 的通知展示 UI */
	const listenJPushMessage = () => {
		if (!window.MTpushInterface) return

		window.MTpushInterface.onMsgReceive((res) => {
			console.log('[JPush] 收到消息:', res)

			// 兼容两种数据结构：
			// 1. messages 数组: res.data.messages[].{title, content, extras}
			// 2. 扁平结构: res.data.{title, body, data, image}
			const messages = res?.data?.messages
			if (messages && messages.length > 0) {
				for (const msg of messages) {
					const { title, content, extras } = msg
					if (title && content) {
						showNotify({
							type: 'primary',
							color: 'var(--text_color_L4)',
							background: 'var(--main_gradient-color)',
							message: `${title}：\n${content}`,
							className: 'firebase-notify-with-img',
							duration: 3000
						})
						const image = extras?.image || ''
						if (image) {
							document.documentElement.style.setProperty('--notify-icon', `url(${image})`)
						}
					}
				}
			} else {
				const { title, body, data: extras, image: topImage } = res?.data || {}
				if (title && body) {
					const image = topImage || extras?.image || ''
					if (image) {
						document.documentElement.style.setProperty('--notify-icon', `url(${image})`)
					}
					showNotify({
						type: 'primary',
						color: 'var(--text_color_L4)',
						background: 'var(--main_gradient-color)',
						message: `${title}：\n${body}`,
						className: 'firebase-notify-with-img',
						duration: 3000
					})
				}
			}
		})

		window.MTpushInterface.onMsgClick((data) => {
			console.log('[JPush] 通知点击:', data)
			// 兼容 extras 和扁平 data 结构
			const targetLink = data?.extras?.targetLink || (data as any)?.data?.targetLink
			if (targetLink) {
				window.location.href = /^https?:\/\//.test(targetLink) ? targetLink : `https://${targetLink}`
			}
		})
	}

	return {
		initJPush,
		waitForJGToken,
		jgToken,
		isJPushReady
	}
}
