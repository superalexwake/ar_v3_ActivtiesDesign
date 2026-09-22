import { ref } from 'vue'
import { showNotify } from 'vant'
import { native } from "@/utils/bridges";
import { updateFirebaseToken } from '@/api/modules/eventTrack';
import i18n from '@/languages'
import { getFBMsgSubscribe } from '@/api';
import { useJPush } from '@/hooks/useJPush';
const { t } = i18n.global


const eventNameMap = {
	notification_receive: 'NOTIFICATION_RECEIVE',
	notification_click: 'NOTIFICATION_CLICK',
	notification_dismiss: 'NOTIFICATION_DISMISS',
	notification_display: 'NOTIFICATION_DISPLAY',
	notification_open: 'NOTIFICATION_OPEN',
	notification_engagement: 'NOTIFICATION_ENGAGEMENT',
};

const isInitialized = ref(false)
const messaging = ref<any>(null)
const analytics = ref<any>(null)
const isLoading = ref(false)
const isReady = ref(false)
let getTokenFn: any = () => null;
let onMessageFn: any = () => null;
let logEventFn: any = () => null;
let deleteTokenFn: any = () => null;
let firebaseConfig: any;
let jgConfigCache: any = null;
let scope: any = null;


const getLoginToken = () => {
	return localStorage.getItem('token') || '';
}

export const useFireBase = (data: any, jgConfig?: any) => {
	if (!firebaseConfig && data && Object.keys(data).length > 0) {
		data.apiSecret = "";
		data.msgSenderId = data.messagingSenderId;
		firebaseConfig = data;
	}
	if (!jgConfigCache && (jgConfig?.webConfig || jgConfig?.appConfig)) {
		const decodeBase64 = (str: string): string => {
			try { return atob(str) } catch { return str }
		}
		const decodeConfig = (cfg: Record<string, any> | undefined) => {
			if (!cfg) return undefined
			return {
				...cfg,
				...(cfg.apiKey ? { apiKey: decodeBase64(cfg.apiKey) } : {}),
				...(cfg.apiSecret ? { apiSecret: decodeBase64(cfg.apiSecret) } : {}),
				...(cfg.packageName ? { packageName: decodeBase64(cfg.packageName) } : {}),
				...(cfg.googleServiceConfig ? { googleServiceConfig: decodeBase64(cfg.googleServiceConfig) } : {}),
			}
		}
		jgConfigCache = {
			webConfig: decodeConfig(jgConfig.webConfig),
			appConfig: decodeConfig(jgConfig.appConfig),
		}
	}

	// 初始化极光推送（独立于 Firebase）
	// App 端极光的初始化和上报统一在 uploadToken 中处理
	const initJPushIfNeeded = () => {
		if (!getLoginToken()) return
		if (native.isAndroid()) return
		// Web 端：通过 JS SDK 初始化极光
		if (!jgConfigCache?.webConfig) return
		const { initJPush } = useJPush(jgConfigCache.webConfig)
		initJPush()
	}

	// 初始化 Firebase（有配置才初始化）
	const initFirebaseOnly = async () => {
		if (isInitialized.value) return
		if (!firebaseConfig?.projectId) return

		if (native.isAndroid()) {
			try {
				console.log('[Firebase] Android 环境，使用 FcmPlugin 初始化')
				requestPermission();
				const token = await native.getFcmToken(firebaseConfig);
				if (!token) {
					console.warn('[Firebase] get token failed:', token);
					return false;
				}
				if (token) {
					await getFBMsgSubscribe({ fireBaseToken: token, isSubscribe: true })
					updateFirebaseToken({
						fireBaseToken: token
					}).catch((err) => {
						console.log('[Firebase] 上传 token 失败或者取消:', err)
					})
				}
				// 标记初始化中
				isInitialized.value = true
				isReady.value = true
				messaging.value = true

			} catch (err) {
				console.log('[Firebase] 原生初始化失败:', err)
			}

			getTokenFn = native.getFcmToken
			onMessageFn = native.globalFirebaseTokenListener
			logEventFn = () => { }

		} else {
			if ('serviceWorker' in navigator) {
				try {
					scope = await navigator.serviceWorker.register(`/firebase-scope/firebase-messaging-sw.js`, { scope: '/firebase-scope/' });
					console.log('[Firebase SW] Service Worker registered');
				} catch (err) {
					console.error('[Firebase SW] Service Worker registration failed:', err);
				} finally {
					console.log("firebase-messaging-sw.js注册结束---");
				}
			}
			try {
				if (!window?.Notification) {
					return console.warn('[Firebase] 当前浏览器不支持 Notification API')
				}

				requestPermission();

				const [
					{ initializeApp, SDK_VERSION, getApps },
					{ getMessaging, getToken, onMessage, deleteToken },
					{ getAnalytics, logEvent }
				] = await Promise.all([
					import('firebase/app'),
					import('firebase/messaging'),
					import('firebase/analytics')
				])

				console.warn(`[Firebase] 使用 Firebase SDK 版本: ${SDK_VERSION}`);

				// 标记初始化中
				isInitialized.value = true
				getTokenFn = getToken
				onMessageFn = onMessage
				// logEventFn = logEvent
				deleteTokenFn = deleteToken

				const temp_config: any = firebaseConfig
				delete temp_config?.apiSecret
				delete temp_config?.measurementApiSecret
				// delete temp_config?.measurementId
				delete temp_config?.keyPair
				// console.error('[Firebase] 初始化配置:', temp_config)


				// let app;
				// if (!getApps().length) {
				const app = initializeApp(firebaseConfig)
				// } else {
				// 	app = getApps()[0]
				// }

				messaging.value = getMessaging(app)
				analytics.value = getAnalytics(app)
			} catch (err) {
				console.error('[Firebase] h5/pwa初始化失败:', err)
			}
			listenForeground()
			setupServiceWorkerListener()
			checkNotificationParams()
		}
	}

	const initFirebase = async () => {
		if (!getLoginToken()) return;
		console.log('[Push] initFirebase called, hasFirebaseConfig:', !!firebaseConfig?.projectId, ', hasJgWebConfig:', !!jgConfigCache?.webConfig, ', hasJgAppConfig:', !!jgConfigCache?.appConfig)
		// 两者独立初始化：有配置就初始化
		initJPushIfNeeded()
		await initFirebaseOnly()
	}


	// 设置 Service Worker 消息监听
	const setupServiceWorkerListener = () => {
		const initialized_name = "mp_firebase_initialized";
		// session记录初始化完成只上报一次
		const val = sessionStorage.getItem(initialized_name);
		if (val && Number.isNaN(Number(val))) {
			sessionStorage.setItem(initialized_name, Date.now().toString());
		}

		// 超过一小时重新上报一次
		if (!sessionStorage.getItem(initialized_name) || (val && Number(val) + 3600 * 1000 < Date.now())) {
			// logEventFn(analytics.value, initialized_name, {tag:"worker，前台的的初始化事件"});
			logEventFn(analytics.value, initialized_name, {});
			sessionStorage.setItem(initialized_name, Date.now().toString());
		}

		// 1️⃣ 聚焦时检查 URL 参数（针对新开窗口）
		window.addEventListener('focus', () => {
			if (location.search.includes('fromNotification=true')) {
				const urlParams = new URLSearchParams(window.location.search)
				const messageId = urlParams.get('messageId')
				const campaignId: string | null = urlParams.get('campaignId')
				// logEventFn(analytics.value, 'mp_notification_open', {tag:"window监听focus，worker前台的聚焦打开事件"});
				logEventFn(analytics.value, 'mp_notification_open', { messageId, campaignId });
			}
		});
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker?.addEventListener('message', (event) => {
				try {
					const { type, data } = event.data || {};
					switch (type) {
						case eventNameMap.notification_click:
							logEventFn(analytics.value, 'mp_notification_click', data);
							handleNotificationClick(data);
							break;
						case eventNameMap.notification_receive:
							logEventFn(analytics.value, 'mp_notification_receive', data);
							break;
						case eventNameMap.notification_display:
							logEventFn(analytics.value, 'mp_notification_display', data);
							break;
						case eventNameMap.notification_open:
							logEventFn(analytics.value, 'mp_notification_open', data);
							break;
						case eventNameMap.notification_dismiss:
							logEventFn(analytics.value, 'mp_notification_dismiss', data);
							break;
					}
				} catch (err) {
					console.error('[Firebase] Service Worker 消息处理失败:', err)
				}
			});
		}
	}



	// 检查 URL 参数（处理从通知直接打开的情况）
	const checkNotificationParams = () => {
		const urlParams = new URLSearchParams(window.location.search)
		const messageId = urlParams.get('messageId')
		const openPage: any = urlParams.get('openPage')
		const targetLink = urlParams.get('targetLink')

		if (messageId) {
			logEventFn(analytics.value, 'mp_notification_receive', { messageId, openPage, targetLink })
			logEventFn(analytics.value, 'mp_notification_display', { messageId, openPage, targetLink })
			logEventFn(analytics.value, 'mp_notification_click', { messageId, openPage, targetLink })
			logEventFn(analytics.value, 'mp_notification_open', { messageId, openPage, targetLink })
			if (targetLink) {
				window.open(targetLink, '_blank')
				return;
			}
			// if (openPage && router) {
			// 	const path = pathPages[openPage]?.path || '/';
			// 	router.push({ path: "/" }).finally(() => router.push({ path }))
			// }
		}
	}

	// 处理通知点击
	const handleNotificationClick = (data: any) => {
		const { targetLink } = data
		// 发送点击统计
		logEventFn(analytics.value, 'mp_notification_open', data)
		// 处理页面跳转
		if (targetLink) {
			window.location.href = targetLink && /^https?:\/\//.test(targetLink) ? targetLink : targetLink ? "https://" + targetLink : '';
		}
	}

	// 检查用户是否已授权通知权限或点击拒绝
	const isChooseAuth = () => {
		if (native.isAndroid()) {
			return native.hasPermi();
		} else {
			return window?.Notification?.permission === 'granted' || window?.Notification?.permission === 'denied';
		}
	}

	// 请求通知权限
	const requestPermission = async () => {
		if (native.isAndroid()) {
			native.requestNotifyPermission();
		} else {
			if (!window?.Notification) {
				console.warn('[Firebase] 当前环境不支持通知');
				return
			}
			if (window?.Notification.permission === 'granted') {
				console.log('[Firebase] 用户已授权通知权限')
				return
			}
			const permission = await window?.Notification.requestPermission()
			if (permission !== 'granted') {
				console.warn('[Firebase] 用户未授权通知权限')
				showNotify({
					type: 'warning',
					message: t("refuse_firebase_notify")
				})
				return
			}
		}
	}

	// 获取 Firebase Token（Web 端）
	const getFirebaseToken = async (): Promise<string> => {
		if (!firebaseConfig?.projectId) return ''
		if (!isInitialized.value || !messaging.value || !getTokenFn) {
			await initFirebaseOnly()
		}
		if (!scope) {
			scope = await navigator.serviceWorker.register(
				`/firebase-scope/firebase-messaging-sw.js`,
				{ scope: '/firebase-scope/' }
			);
		}
		if (window?.Notification?.permission != 'granted') {
			console.warn('[Firebase] 当前用户还未授权或拒绝通知权限');
			return ''
		}
		try {
			return await getTokenFn(messaging.value, {
				vapidKey: "",
				serviceWorkerRegistration: scope
			}) || ''
		} catch (e) {
			console.warn('[Firebase] 获取 FCM token 失败:', e)
			return ''
		}
	}

	// 等待极光 Token 就绪
	const getJGTokenAsync = (): Promise<string> => {
		if (!jgConfigCache?.webConfig) return Promise.resolve('')
		const { waitForJGToken } = useJPush(jgConfigCache.webConfig)
		return waitForJGToken()
	}

	// 上报token到后台（合并 Firebase + 极光，只调一次接口）
	const uploadToken = async () => {
		if (!getLoginToken()) return;
		try {
			if (native.isAndroid()) {
					// 并行获取 Firebase Token 和极光 Token
					const [fbToken, appJgToken] = await Promise.all([
						native.getFcmToken(firebaseConfig).catch(() => ''),
						jgConfigCache?.appConfig
							? native.getJgToken(jgConfigCache.appConfig).catch(() => '')
							: Promise.resolve('')
					])

					if (fbToken) {
						await getFBMsgSubscribe({ fireBaseToken: fbToken, isSubscribe: true })
					}

					const tokenParams: { fireBaseToken?: string; jgToken?: string } = {}
					if (fbToken) tokenParams.fireBaseToken = fbToken
					if (appJgToken) tokenParams.jgToken = appJgToken

					if (tokenParams.fireBaseToken || tokenParams.jgToken) {
						await updateFirebaseToken(tokenParams)
					}

					isReady.value = true
					return true

			} else {
				isLoading.value = true

				// 并行获取两个 Token
				const [fbToken, currentJgToken] = await Promise.all([
					getFirebaseToken(),
					getJGTokenAsync()
				])

				// 合并上报，只调一次接口
				const tokenParams: { fireBaseToken?: string; jgToken?: string } = {}
				if (fbToken) tokenParams.fireBaseToken = fbToken
				if (currentJgToken) tokenParams.jgToken = currentJgToken

				if (fbToken) {
					await getFBMsgSubscribe({ fireBaseToken: fbToken, isSubscribe: true })
				}
				if (tokenParams.fireBaseToken || tokenParams.jgToken) {
					await updateFirebaseToken(tokenParams)
				}

				isReady.value = true
				return true
			}
		} catch (err) {
			console.log(err);
			if ((err as any)?.code != "ERR_CANCELED") {
				console.log('[Push] get token failed:', err)
			}
			return false
		} finally {
			isLoading.value = false
		}
	}

	const listenForeground = async () => {
		console.log("!messaging.value || !onMessageFn", !messaging.value, !onMessageFn);

		if (!messaging.value || !onMessageFn) {
			console.log('[Firebase] cannot listen for foreground messages yet')
			return
		}
		if (await native.isAndroid()) {
			console.log('[Firebase] Android environment, using FcmPlugin to listen for foreground messages');
		} else {
			onMessageFn(messaging.value, (payload: any) => {
				console.log('[Firebase] onMessageFn received foreground message:', payload)
				// 记录h5和pwa的消息接收事件
				logEventFn(
					analytics.value,
					'mp_notification_receive',
					{ ...payload.data }
				)

				const { title, body, image } = payload.notification || payload.data || {}
				const { targetLink: link } = payload.data || {};
				const targetLink = link && /^https?:\/\//.test(link) ? link : link ? "https://" + link : '';
				if (navigator.serviceWorker?.controller) {
					console.log("[Firebase] onMessageFn through Service Worker display notification");
					navigator.serviceWorker.controller.postMessage({
						type: 'SHOW_NOTIFICATION',
						payload: {
							title,
							body,
							image,
							targetLink, // 点击时跳转到指定页面	
						},
						data: {
							targetLink,
							...payload.data
						}
					})
				}

				if (title && body) {
					showNotify({
						type: 'primary',
						color: 'var(--text_color_L4)',
						background: 'var(--main_gradient-color)',
						message: `${title}：\n${body}`,
						className: 'firebase-notify-with-img',
						duration: 3000
					})
					document.documentElement.style.setProperty('--notify-icon', `url(${image})`)
				}
			})
		}
	}
	if (firebaseConfig?.projectId || jgConfigCache?.webConfig) {
		initFirebase()
	}
	return {
		initFirebase,
		requestPermission,
		listenForeground,
		isLoading,
		isChooseAuth,
		uploadToken,
		isReady,
	}
}