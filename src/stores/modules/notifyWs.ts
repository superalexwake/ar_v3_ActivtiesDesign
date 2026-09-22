// =============================================================================
// 站内信实时推送（H5）—— 单文件 + 单 store 内核
// 连接订阅(AppSync Events) + 消息契约 + 通知列表 + 分发(B系顶部横幅/通知中心、C系居中模态) + 续连。
// 精简移植自 ar_sass_tenant/adminWs.ts，剥离全部后台业务。
// 纯逻辑、零 .vue 依赖：UI 组件在 UI 层用 DialogQueue registry 按 key 注册，本文件只按 key 入队，
// 避免 store ↔ 组件循环依赖。
// =============================================================================
import { defineStore } from 'pinia'
import { Amplify } from 'aws-amplify'
import { decodeJWT } from 'aws-amplify/auth'
import { events } from 'aws-amplify/data'
import { showFailToast } from 'vant'
import router from '@/router'
import { LOGIN_URL } from '@/config/config'
import { useDialogQueue } from '@/components/DialogQueue/useDialogQueue'
import { createDialogQueueItem } from '@/components/DialogQueue/registry'
import i18n from '@/languages'
import { useFastUpiKycOtp } from '@/hooks/useFastUpiKycOtp.hook'
import { useUserStore } from './user'
import { NOTIFY_C_MODAL_KEY, NOTIFY_CENTER_KEY } from '@/hooks/dialogKeys'

// ============================= 契约（文档 §4/§5） =============================

export const PUSH_BUSINESS_TYPE = 'UserTemplateNotify' as const

/** 点击跳转目标（§5.2）。 */
export type JumpAction = 'none' | 'wallet' | 'withdraw' | 'activity'
/** 展示样式（§5.3）：B1 到账横幅 / B2 待领取toast / C3 高危警示 / C4 提现已退回。 */
export type PushStyle = 'B1' | 'B2' | 'C3' | 'C4'

/** 模板 ID（§5.1，仅列前端关心的）。 */
export const TemplateId = {
	RechargeArrived: 9,
	RewardPending: 10,
	KycInterrupted: 11,
	WithdrawReturned: 12,
} as const

/** 推送消息体 data（§4）。title/message 已由后端按会员语言渲染好。 */
export interface UserTemplateNotifyData {
	templateId: number
	activityCode: number | null
	title: string
	message: string
	jumpAction: JumpAction
	pushStyle: PushStyle
	expireTimestamp?: number
	serverTime?: number
}

/** 单条通知（B 系横幅/通知中心消费）。receivedAt 本地盖（契约无时间戳）。 */
export interface NotifyItem extends UserTemplateNotifyData {
	id: string
	receivedAt: number
}

function isRecord(v: unknown): v is Record<string, unknown> {
	return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}
function tryParseJson(v: unknown): unknown {
	if (typeof v !== 'string') return v
	const s = v.trim()
	if (!s) return v
	try {
		return JSON.parse(s)
	} catch {
		return v
	}
}

function toOptionalNumber(v: unknown): number | undefined {
	if (v == null || (typeof v === 'string' && !v.trim())) return undefined
	const n = Number(v)
	return Number.isFinite(n) ? n : undefined
}

function getRawEvents(raw: unknown): unknown[] {
	const envelope = isRecord(raw) ? raw : null
	const rawEvent = envelope && 'event' in envelope ? envelope.event : raw
	return Array.isArray(rawEvent) ? rawEvent : [rawEvent]
}

function parsePushEventPayload(rawEvent: unknown): UserTemplateNotifyData | null {
	const evt = tryParseJson(rawEvent)
	if (!isRecord(evt)) return null
	const businessType = (evt.businessType ?? evt.BusinessType) as string | undefined
	if (businessType !== PUSH_BUSINESS_TYPE) return null
	const data = tryParseJson(evt.data ?? evt.Data)
	if (!isRecord(data)) return null
	const rawActivityCode = data.activityCode ?? data.ActivityCode
	return {
		templateId: Number(data.templateId ?? data.TemplateId) || 0,
		activityCode: rawActivityCode == null ? null : Number(rawActivityCode),
		title: String(data.title ?? data.Title ?? ''),
		message: String(data.message ?? data.Message ?? ''),
		jumpAction: (data.jumpAction ?? data.JumpAction ?? 'none') as JumpAction,
		pushStyle: (data.pushStyle ?? data.PushStyle ?? 'B2') as PushStyle,
		expireTimestamp: toOptionalNumber(data.expireTimestamp ?? data.ExpireTimestamp),
		serverTime: toOptionalNumber(data.serverTime ?? data.ServerTime),
	}
}

/**
 * 解析订阅回调原始负载 → UserTemplateNotifyData[]。
 * 兼容 AWS data frame: { event: [stringified JSON] }，以及旧实现的单对象/单字符串格式。
 */
export function parsePushEvents(raw: unknown): UserTemplateNotifyData[] {
	return getRawEvents(raw).reduce<UserTemplateNotifyData[]>((list, rawEvent) => {
		const item = parsePushEventPayload(rawEvent)
		if (item) list.push(item)
		return list
	}, [])
}

// ============================= AppSync 适配器 =============================
// 把 aws-amplify 细节收敛在此（依赖倒置，便于替换/测试）。
const APPSYNC_REGION = 'ap-south-1'

interface ParsedWsConfig {
	endpoint: string
	token: string
}
interface AppSyncChannel {
	subscribe(observer: { next(v: unknown): void; error(e: unknown): void }): { unsubscribe(): void }
	close(): void | Promise<void>
}
interface AppSyncEventsApi {
	closeAll?: () => Promise<void>
}

function notifyWsWarn(message: string, payload?: Record<string, unknown>): void {
	if (!import.meta.env.DEV) return
	console.warn(`[notifyWs] ${message}`, payload ?? '')
}

function parseWebSocketUrl(webSocketUrl: string): ParsedWsConfig | null {
	if (!webSocketUrl) return null
	try {
		const u = new URL(webSocketUrl)
		return { endpoint: `${u.origin}/event`, token: u.searchParams.get('Token') ?? '' }
	} catch {
		return null
	}
}
function configureAppSync(endpoint: string, token: string) {
	Amplify.configure(
		{ API: { Events: { endpoint, region: APPSYNC_REGION, defaultAuthMode: 'oidc' } } },
		{
			Auth: {
				tokenProvider: {
					async getTokens() {
						return { accessToken: decodeJWT(token) }
					},
				},
			} as never,
		},
	)
}
async function connectAppSyncChannel(channelPath: string): Promise<AppSyncChannel> {
	return (await events.connect(channelPath)) as unknown as AppSyncChannel
}
async function closeAllAppSyncChannels(): Promise<boolean> {
	const closeAll = (events as unknown as AppSyncEventsApi).closeAll
	if (typeof closeAll !== 'function') return false
	await closeAll()
	return true
}

// ============================= 跳转 =============================
const ROUTE_NAME: Record<Exclude<JumpAction, 'none'>, string> = {
	wallet: 'wallet',
	withdraw: 'Withdraw',
	activity: 'activity',
}
// activity 类推送：按 activityCode 进入「具体活动页」而非活动列表。
// 路由 name 与 useBonusPack 的 mapParam 对齐（同一套活动路由），新增活动两处一起加。
const ACTIVITY_ROUTE_BY_CODE: Record<number, string> = {
	119: 'Turntable', // 大转盘
	130: 'turntable', // 邀请转盘
	7: 'DailySignIn', // 每日签到
	118: 'DailyTasks', // 每日奖励
	107: 'DailyTasks', // 每周奖励
}

/** 按 jumpAction 跳转；none/未知不跳。activity 类优先按 activityCode 进具体活动页，否则回活动列表（activityCode 透传 query）。 */
export function jumpBy(action: JumpAction, activityCode?: number | null): void {
	if (!action || action === 'none') return
	if (action === 'activity' && activityCode != null) {
		const specific = ACTIVITY_ROUTE_BY_CODE[activityCode]
		if (specific) {
			void router.push({ name: specific }).catch(() => {})
			return
		}
	}
	const name = ROUTE_NAME[action]
	if (!name) return
	const query = activityCode != null ? { activityCode: String(activityCode) } : undefined
	void router.push({ name, query }).catch(() => {})
}

// ============================= 运行时句柄 / 常量 =============================
// 连接相关
const K_URL = 'ar_ws_url'
const K_CHANNELS = 'ar_ws_channels'
const K_EXPIRE = 'ar_ws_token_expire_at'
const CLOSE_TIMEOUT_MS = 1500
let channel: AppSyncChannel | null = null
let subscription: { unsubscribe(): void } | null = null
let connectionTask: Promise<unknown> = Promise.resolve()
let refresher: WsRefresher | null = null
let messageHandler: WsMessageHandler | null = null
let isRefreshing = false
// 通知列表相关
const AUTO_DISMISS_MS = 3000 // info 横幅自动消失（决策⑧：默认 3s）
const DEDUPE_WINDOW_MS = 3000 // 去重窗口（§7.3）
let ntfSeq = 0
const ntfTimers = new Map<string, ReturnType<typeof setTimeout>>()

function readLS<T>(key: string, fallback: T): T {
	try {
		const v = localStorage.getItem(key)
		return v == null ? fallback : (JSON.parse(v) as T)
	} catch {
		return fallback
	}
}
function isEmptyStorageValue(val: unknown): boolean {
	return val == null || val === '' || val === 0 || (Array.isArray(val) && val.length === 0)
}
function writeLS(key: string, val: unknown) {
	try {
		if (isEmptyStorageValue(val)) localStorage.removeItem(key)
		else localStorage.setItem(key, JSON.stringify(val))
	} catch {
		/* ignore */
	}
}
function clearNtfTimers() {
	ntfTimers.forEach((t) => clearTimeout(t))
	ntfTimers.clear()
}
function getErrorCode(error: unknown): number {
	if (!isRecord(error)) return 0
	const n = Number(error.code ?? error.msgCode)
	return Number.isFinite(n) ? n : 0
}
function getHttpStatus(error: unknown): number {
	if (!isRecord(error) || !isRecord(error.response)) return 0
	const n = Number(error.response.status)
	return Number.isFinite(n) ? n : 0
}
function isAuthInvalidError(error: unknown): boolean {
	const code = getErrorCode(error)
	return code === 4 || code === 22 || getHttpStatus(error) === 401
}
async function handleAuthInvalid(error: unknown): Promise<void> {
	const code = getErrorCode(error)
	showFailToast(i18n.global.t(code === 22 ? 'common.tokenExpired' : 'tokenExpired'))
	await useUserStore().logoutLocal({ path: LOGIN_URL })
}
async function validateBusinessSession(): Promise<boolean> {
	const token = localStorage.getItem('token') || ''
	if (!token) return false
	try {
		return Boolean(await useUserStore().getUserInfo({ signature: token }))
	} catch (error) {
		if (isAuthInvalidError(error)) await handleAuthInvalid(error)
		return false
	}
}
function runConnectionTask<T>(task: () => Promise<T>): Promise<T> {
	const next = connectionTask.then(task, task)
	connectionTask = next.catch(() => {})
	return next
}
async function waitCloseTask<T>(task: Promise<T>, reason: string, target: string): Promise<T | null> {
	let timer: ReturnType<typeof setTimeout> | null = null
	const guarded = task.catch((error) => {
		notifyWsWarn('close:error', { reason, target, error })
		return null
	})
	const timeout = new Promise<null>((resolve) => {
		timer = setTimeout(() => {
			notifyWsWarn('close:timeout', { reason, target, timeout: CLOSE_TIMEOUT_MS })
			resolve(null)
		}, CLOSE_TIMEOUT_MS)
	})
	return Promise.race([guarded, timeout]).finally(() => {
		if (timer) clearTimeout(timer)
	})
}
async function closeCurrentConnection(forceCloseSocket = false, reason = 'unknown'): Promise<void> {
	const currentSub = subscription
	const currentChannel = channel
	subscription = null
	channel = null
	try {
		currentSub?.unsubscribe()
	} catch (error) {
		notifyWsWarn('close:unsubscribe:error', { reason, error })
	}
	const didCloseAll = forceCloseSocket ? await waitCloseTask(closeAllAppSyncChannels(), reason, 'closeAll') : false
	if (!forceCloseSocket || !didCloseAll) {
		await waitCloseTask(Promise.resolve(currentChannel?.close()), reason, 'channel')
	}
}
// ============================= 单 store =============================
// 订阅信息 + 通知列表 合为一个 store；底层 socket 状态交给 Amplify Events 管理。

/** 订阅信息（来自登录 LoginRsp 或 RefreshToken 响应）。 */
export interface NotifyWsSubscription {
	webSocketUrl: string
	channels: string[]
	tokenExpireAt: number
}
/** WS 连接材料刷新器：仅在 tokenExpireAt 到期时调用，返回新订阅信息（axios 层用 refreshToken 注入）。 */
export type WsRefresher = () => Promise<NotifyWsSubscription | null>
type WsMessageHandler = (data: UserTemplateNotifyData) => void

export interface NotifyWsState {
	// 连接
	webSocketUrl: string
	channels: string[]
	tokenExpireAt: number
	// 通知列表
	list: NotifyItem[]
}

export const useNotifyWsStore = defineStore('notifyWs', {
	state: (): NotifyWsState => ({
		webSocketUrl: readLS(K_URL, ''),
		channels: readLS<string[]>(K_CHANNELS, []),
		tokenExpireAt: readLS(K_EXPIRE, 0),
		list: [],
	}),
	getters: {
		isExpired: (s): boolean => s.tokenExpireAt > 0 && Date.now() >= s.tokenExpireAt,
		count: (s): number => s.list.length,
	},
	actions: {
		// ---- 注入 ----
		setSubscriptionRefresher(fn: WsRefresher | null) {
			refresher = fn
		},
		setMessageHandler(fn: WsMessageHandler | null) {
			messageHandler = fn
		},
		// ---- 连接 ----
		/** 写连接信息并持久化。空 url 视为未配置（降级，不连接，§2.2）。 */
		bootstrap(sub: Partial<NotifyWsSubscription>) {
			if (sub.webSocketUrl !== undefined) {
				this.webSocketUrl = String(sub.webSocketUrl || '')
				writeLS(K_URL, this.webSocketUrl)
			}
			if (sub.channels !== undefined) {
				this.channels = Array.isArray(sub.channels) ? sub.channels : []
				writeLS(K_CHANNELS, this.channels)
			}
			if (sub.tokenExpireAt !== undefined) {
				this.tokenExpireAt = Number(sub.tokenExpireAt) || 0
				writeLS(K_EXPIRE, this.tokenExpireAt)
			}
		},
		async connect(sub?: Partial<NotifyWsSubscription>, reason = 'connect'): Promise<boolean> {
			return runConnectionTask(async () => {
				const hasIncomingSubscription = Boolean(sub)
				if (!localStorage.getItem('token')) {
					this.bootstrap({ webSocketUrl: '', channels: [], tokenExpireAt: 0 })
					this.clearList()
					await closeCurrentConnection(true, `${reason}:no-token`)
					return false
				}
				if (hasIncomingSubscription) {
					this.bootstrap({ webSocketUrl: '', channels: [], tokenExpireAt: 0 })
					this.clearList()
					await closeCurrentConnection(true, `${reason}:incoming-subscription`)
					this.bootstrap({
						webSocketUrl: sub.webSocketUrl ?? '',
						channels: sub.channels ?? [],
						tokenExpireAt: sub.tokenExpireAt ?? 0
					})
				}
				const parsed = parseWebSocketUrl(this.webSocketUrl)
				const channelPath = this.channels[0]
				if (!parsed || !parsed.token || !channelPath) {
					return false
				}
				if (this.isExpired) {
					void this.refreshAndReconnect('connect:expired')
					return false
				}
				try {
					if (!hasIncomingSubscription) await closeCurrentConnection(false, `${reason}:replace-current`)
					configureAppSync(parsed.endpoint, parsed.token)
					const ch = await connectAppSyncChannel(channelPath)
					const nextSubscription = ch.subscribe({
						next: (value) => {
							parsePushEvents(value).forEach((data) => messageHandler?.(data))
						},
						error: (error) => {
							notifyWsWarn('subscription:error', { error })
							void this.refreshAndReconnect('subscription:error')
						}
					})
					channel = ch
					subscription = nextSubscription
					return true
				} catch (error) {
					notifyWsWarn('connect:error', { reason, error })
					void this.refreshAndReconnect('connect:error')
					return false
				}
			})
		},
		async replaceSession(sub: NotifyWsSubscription): Promise<boolean> {
			return this.connect(sub, 'session:replace')
		},
		async refreshAndReconnect(reason = 'unknown'): Promise<boolean> {
			if (isRefreshing) return false
			isRefreshing = true
			try {
				if (!(await validateBusinessSession())) {
					return false
				}
				if (this.isExpired) {
					if (!refresher) {
						return false
					}
					const sub = await refresher()
					if (!sub) {
						await this.reset('refresh:missing-subscription')
						return false
					}
					return await this.replaceSession(sub)
				}
				return await this.connect()
			} catch (error) {
				notifyWsWarn('refresh:error', { reason, error })
				return false
			} finally {
				isRefreshing = false
			}
		},
		/** 登出：断连 + 清缓存 + 清列表。 */
		async reset(reason = 'reset') {
			return runConnectionTask(async () => {
				this.bootstrap({ webSocketUrl: '', channels: [], tokenExpireAt: 0 })
				this.clearList()
				await closeCurrentConnection(true, reason)
			})
		},
		// ---- 通知列表 ----
		add(data: UserTemplateNotifyData) {
			const now = Date.now()
			const dup = this.list.some(
				(i) =>
					i.templateId === data.templateId &&
					i.activityCode === data.activityCode &&
					i.message === data.message &&
					now - i.receivedAt < DEDUPE_WINDOW_MS,
			)
			if (dup) return
			const item: NotifyItem = { ...data, id: `ntf-${now}-${++ntfSeq}`, receivedAt: now }
			this.list.unshift(item)
			// 进入聚合态（通知中心）：常驻，取消自动消失。
			// 单条的自动消失计时不在这里起——消息到达时横幅未必显示得出来（队首被高优先级
			// 弹窗占着、或被路由黑名单挡在游戏页），那样计时会空烧掉，等障碍消失已无货可弹。
			// 改由 NotifyCenterView 在真正展示时调 startAutoDismiss。
			if (this.list.length >= 2) clearNtfTimers()
		},
		/** 横幅真正展示后才起 3s 自动消失；"待领取"需点 Claim，常驻不计时。 */
		startAutoDismiss(id: string) {
			if (ntfTimers.has(id) || this.list.length !== 1) return
			const item = this.list.find((i) => i.id === id)
			if (!item || item.templateId === TemplateId.RewardPending) return
			ntfTimers.set(
				id,
				setTimeout(() => this.remove(id), AUTO_DISMISS_MS),
			)
		},
		remove(id: string) {
			const t = ntfTimers.get(id)
			if (t) {
				clearTimeout(t)
				ntfTimers.delete(id)
			}
			this.list = this.list.filter((i) => i.id !== id)
		},
		clearList() {
			clearNtfTimers()
			this.list = []
		},
	},
})

// ============================= 分发 =============================
// 按 pushStyle/templateId 路由：C 系 → DialogQueue 居中模态；其余 → 顶部通知中心。

function isKycInterruptedNotify(d: UserTemplateNotifyData): boolean {
	return d.templateId === TemplateId.KycInterrupted || d.pushStyle === 'C3'
}

function getCVariant(d: UserTemplateNotifyData): 'returned' | null {
	if (d.templateId === TemplateId.WithdrawReturned) return 'returned'
	if (d.pushStyle === 'C4') return 'returned'
	return null
}

/** 单条推送分发入口（注入给 store 作 messageHandler）。 */
export function dispatchPush(data: UserTemplateNotifyData): void {
	if (isKycInterruptedNotify(data)) {
		const { openNeedKycOrderDialog } = useFastUpiKycOtp()
		void openNeedKycOrderDialog({ source: 'ws' })
		return
	}
	const variant = getCVariant(data)
	if (variant) {
		const item = createDialogQueueItem(NOTIFY_C_MODAL_KEY, {
			id: `ntf-c-${data.templateId}-${Date.now()}`,
			props: {
				variant,
				title: data.title,
				message: data.message,
				activityCode: data.activityCode,
			},
			policy: { presentation: 'center', priority: 1000 },
		})
		if (item) void useDialogQueue().push(item)
		return
	}
	// B 系 → 通知中心列表；并确保顶部"通知中心"队列项在队（单队列项持有列表视图，复用 DialogQueue）
	useNotifyWsStore().add(data)
	const queue = useDialogQueue()
	if (!queue.has(NOTIFY_CENTER_KEY)) {
		const centerItem = createDialogQueueItem(NOTIFY_CENTER_KEY, {
			policy: { presentation: 'top', priority: 0 },
		})
		if (centerItem) void queue.push(centerItem)
	}
}

/** 一次性把分发器接到 store（在 UI 入口调用）。 */
export function setupNotifyWs() {
	useNotifyWsStore().setMessageHandler(dispatchPush)
}
