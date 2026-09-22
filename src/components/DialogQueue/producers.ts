import { defineAsyncComponent, watch } from 'vue'
import { GlobalStore, SettingStore } from '@/stores'
import { GetTreasureChestPopupItems } from '@/api'
import { AwaitApiResult } from '@/utils'
import { native } from '@/utils/bridges'
import { useActive } from '@/components/common/use'
import router from '@/router'
import { createLoginRedirectQuery } from '@/router/navigation'
import eventRewardsLoginGiftUrl from '@public/common/eventRewardsLogin/gift.png?url'
import type { LastestAppVersionInfo } from '@/types/appUpdate'
import type { DialogQueueItem } from './types'
import { createRequiredDialogQueueItem, registerDialog } from './registry'
import { condition, createPipe, dismissForToday } from './pipe'
import {
	hasShownAnnouncementInSession,
	hasShownSuperJackpotPromptInSession,
	markAnnouncementShown,
	markSuperJackpotPromptShown
} from './sessionKeys'
import AgeGateDialog from './dialogs/AgeGateDialog.vue'
import AgeRejectedDialog from './dialogs/AgeRejectedDialog.vue'
import AppForceUpdateDialog from './dialogs/AppForceUpdateDialog.vue'
import AnnouncementDialog from './dialogs/AnnouncementDialog.vue'
import SuperJackpotPromptDialog from './dialogs/SuperJackpotPromptDialog.vue'
import FirstRechargeQueueDialog from './dialogs/FirstRechargeQueueDialog.vue'
import RewardAmountDialog, { type RewardAmountDialogProps } from './dialogs/RewardAmountDialog.vue'
import CouponArrivalDialog, { type CouponArrivalDialogProps } from './dialogs/CouponArrivalDialog.vue'
import TreasureChestQueueDialog, {
	type TreasureChestDialogChest,
	type TreasureChestQueueDialogProps
} from './dialogs/TreasureChestQueueDialog.vue'
import { useDialogQueue } from './useDialogQueue'

const EventRewardsLoginDialog = defineAsyncComponent(() => import('./dialogs/EventRewardsLoginDialog.vue'))
const RewardCenterDialog = defineAsyncComponent(() => import('@/components/Activity/Bonus/index.vue'))
const ReBenefitDialog = defineAsyncComponent(() => import('@/components/Activity/ReBenefits/index.vue'))

// =============================================================================
// 常量
// =============================================================================

const AGE_GATE_PROJECTS = ['ar003', 'ar038', 'ar019', 'ar074', 'ar082', 'ar040', 'ar002', 'ar080']

const APP_UPDATE_TYPE = {
	NONE: 0,
	FORCE: 1,
	SUGGEST: 2
} as const

const DIALOG_CLEAN_ROUTE_NAMES = ['login', 'register']
const DIALOG_CLEAN_ROUTE_PATHS = ['/login', '/register']

/** 首页：所有 home-* 弹窗默认只在这条路由展示。 */
const HOME_ROUTES = ['home']
/** 宝箱奖励：登录后只在首页触发和展示。 */
const TREASURE_CHEST_ROUTES = ['home']
const TREASURE_CHEST_DIALOG_KEY = 'home-treasure-chest'
/** Tab 底栏四页：FirstRecharge 在这四个 tab 上都允许出现。 */
const TAB_ROUTES = ['home', 'activity', 'promotion', 'main']
let isTreasureChestLoading = false

// =============================================================================
// Props 类型
// =============================================================================

export interface AnnouncementNotice {
	title: string
	siteMessage: string
	addtime?: Date | string
}

interface AgeGateDialogProps extends Record<string, unknown> {
	projectName: string
}

interface AppUpdateDialogProps extends Record<string, unknown> {
	/** APK 下载地址（原始，无 query） */
	url: string
	/** 最新版本号，组件 download() 时拼到 url 后面作为 ?version=<v> */
	version?: string
	/** 强制更新模式 */
	forced?: boolean
}

interface AnnouncementDialogProps extends Record<string, unknown> {
	notices: AnnouncementNotice[]
}

// RewardAmountDialogProps 从 dialog 组件直接 import；这里只补"作为 props 走 DialogQueueItem 时"
// 需要的索引签名约束（DialogQueueItem 泛型要求 Record<string, unknown>）。
type RewardAmountDialogItemProps = RewardAmountDialogProps & Record<string, unknown>
type CouponArrivalDialogItemProps = CouponArrivalDialogProps & Record<string, unknown>
type TreasureChestDialogItemProps = TreasureChestQueueDialogProps & Record<string, unknown>
interface PushTreasureChestDialogOptions {
	/** 用户主动点击通知触发时允许在当前页面直接展示，不受首页自动弹窗路由限制。 */
	allowNonHome?: boolean
}

// =============================================================================
// 注册内置弹窗（优先级与互斥分组都集中在这里）
// =============================================================================

function registerBuiltInDialogs() {
	registerDialog({
		key: 'system-age-rejected',
		component: AgeRejectedDialog,
		defaultPolicy: {
			priority: 28900,
			group: 'system-age',
			force: true,
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<AgeGateDialogProps>({
		key: 'system-age-gate',
		component: AgeGateDialog,
		defaultPolicy: {
			priority: 29000,
			group: 'system-age',
			force: true,
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	// 应用更新弹窗：只注册一次，强制 / 建议模式通过 push 时的 policy override 切换
	// （差异：force / priority 两项；group 一致避免互斥冲突）
	// 两种模式都禁止点遮罩关闭：建议模式只能点"忽略/稍后"按钮关，强制模式只能点确认下载
	registerDialog<AppUpdateDialogProps>({
		key: 'system-app-update',
		component: AppForceUpdateDialog,
		defaultPolicy: {
			priority: 17000,
			group: 'system-app-update',
			force: false,
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<AnnouncementDialogProps>({
		key: 'home-announcement',
		component: AnnouncementDialog,
		defaultPolicy: {
			priority: 16000,
			group: 'home-announcement',
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog({
		key: 'home-super-jackpot-prompt',
		component: SuperJackpotPromptDialog,
		defaultPolicy: {
			priority: 14500,
			group: 'home-super-jackpot',
			force: true,
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog({
		key: 'home-first-recharge',
		component: FirstRechargeQueueDialog,
		defaultPolicy: {
			priority: 15500,
			group: 'home-first-recharge',
			closeOnClickOverlay: false,
			presentation: 'center',
			// 常驻：close / overlay 关闭只标记 _userClosed 不出队；
			// 在 TAB_ROUTES 范围内切到下一个 tab 页且队列里没其它可见弹窗时自动再弹。
			persistent: true,
			allowedRoutes: TAB_ROUTES
		}
	})
	registerDialog<RewardAmountDialogItemProps>({
		key: 'home-invite-rebate',
		component: RewardAmountDialog,
		defaultPolicy: {
			priority: 15000,
			group: 'home-invite-rebate',
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<RewardAmountDialogItemProps>({
		key: 'home-return-awards',
		component: RewardAmountDialog,
		defaultPolicy: {
			priority: 14000,
			group: 'home-return-awards',
			closeOnClickOverlay: true,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<CouponArrivalDialogItemProps>({
		key: 'home-coupon-arrival',
		component: CouponArrivalDialog,
		defaultPolicy: {
			// 全队列最末（低于 reward-center / re-benefit 的 11000）：领取后要跳个人中心，
			// 排最后才不会把其它营销弹窗挤成 _routeHidden。见 pushCouponArrivalDialog 的 onClose。
			priority: 10000,
			group: 'home-coupon-arrival',
			force: true,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<RewardAmountDialogItemProps>({
		key: 'home-register-gift',
		component: RewardAmountDialog,
		defaultPolicy: {
			priority: 13500,
			group: 'home-register-gift',
			closeOnClickOverlay: true,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<RewardAmountDialogItemProps>({
		key: 'home-app-download-reward',
		component: RewardAmountDialog,
		defaultPolicy: {
			priority: 13000,
			group: 'home-app-download-reward',
			closeOnClickOverlay: true,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
	registerDialog<TreasureChestDialogItemProps>({
		key: TREASURE_CHEST_DIALOG_KEY,
		component: TreasureChestQueueDialog,
		defaultPolicy: {
			priority: 12500,
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: TREASURE_CHEST_ROUTES
		}
	})
	registerDialog({
		key: 'home-event-rewards-login',
		component: EventRewardsLoginDialog,
		defaultPolicy: {
			priority: 12000,
			group: 'home-event-rewards-login',
			closeOnClickOverlay: false,
			presentation: 'bottom',
			preloadImage: [eventRewardsLoginGiftUrl]
		}
	})
	registerDialog({
		key: 'home-reward-center',
		component: RewardCenterDialog,
		defaultPolicy: {
			priority: 11000,
			group: 'home-reward-center',
			closeOnClickOverlay: false,
			presentation: 'center'
		}
	})
	registerDialog({
		key: 'home-re-benefit',
		component: ReBenefitDialog,
		defaultPolicy: {
			priority: 11500,
			group: 'home-re-benefit',
			closeOnClickOverlay: false,
			presentation: 'center',
			allowedRoutes: HOME_ROUTES
		}
	})
}

registerBuiltInDialogs()

// =============================================================================
// 路由 / 会话辅助
// =============================================================================

export function isDialogCleanRoute(routeName = router.currentRoute.value.name, routePath = router.currentRoute.value.path) {
	return (
		DIALOG_CLEAN_ROUTE_NAMES.includes(String(routeName || '')) || DIALOG_CLEAN_ROUTE_PATHS.includes(String(routePath || ''))
	)
}

function normalizeAnnouncementNotices(notices: AnnouncementNotice[] = []) {
	return notices.filter((item) => item?.title && item?.siteMessage)
}

function compareVersion(current: string, latest: string) {
	const currentParts = current.split('.').map((part) => Number.parseInt(part, 10))
	const latestParts = latest.split('.').map((part) => Number.parseInt(part, 10))
	const length = Math.max(currentParts.length, latestParts.length)

	for (let i = 0; i < length; i += 1) {
		const currentValue = Number.isFinite(currentParts[i]) ? currentParts[i] : 0
		const latestValue = Number.isFinite(latestParts[i]) ? latestParts[i] : 0

		if (currentValue < latestValue) return -1
		if (currentValue > latestValue) return 1
	}

	return 0
}

// =============================================================================
// 共享中间件
// -----------------------------------------------------------------------------
// 注意：去重 / 同分组互斥 / policy.preloadImage 已经做在 queue.push 里，
// 这里的 pipe 只做"业务级前置守卫"和"onClose 兜底"。
// =============================================================================

/** 路由守卫：login/register 等清理路由不弹任何东西。 */
const routeGuard = condition(() => !isDialogCleanRoute())

/** 金额守卫：item.props.amount 必须 > 0；用于 invite/return/register/appDownload。 */
const amountGuard = condition((item) => Number((item.props as { amount?: number } | undefined)?.amount) > 0)

// 领奖接口（getReceiveReturnAwards / getRegisterGift / getReceiveDownAppReward）一律在
// RewardAmountDialog 内部点 confirm 时调用，producer 不做兜底——点遮罩静默关闭就是用户主动放弃，
// 后端如有"未领取状态需归零"的诉求，由对应的 receive 接口在下一次 push 入口前做处理。

// =============================================================================
// Item builders
// =============================================================================

function createAgeRejectedItem(): DialogQueueItem {
	return createRequiredDialogQueueItem('system-age-rejected')
}

function createAgeGateItem(projectName: string): DialogQueueItem {
	const queue = useDialogQueue()

	return createRequiredDialogQueueItem<AgeGateDialogProps>('system-age-gate', {
		props: { projectName },
		onClose(reason) {
			if (reason === 'cancel') queue.push(createAgeRejectedItem())
		}
	})
}

function createAnnouncementItem(notices: AnnouncementNotice[]): DialogQueueItem {
	return createRequiredDialogQueueItem<AnnouncementDialogProps>('home-announcement', {
		props: { notices },
		onClose() {
			markAnnouncementShown()
		}
	})
}

function createSuperJackpotPromptItem(): DialogQueueItem {
	return createRequiredDialogQueueItem('home-super-jackpot-prompt', {
		onClose(reason) {
			if (reason !== 'confirm') return
			markSuperJackpotPromptShown()
			router.push({ name: 'SuperJackpot' })
		}
	})
}

function createEventRewardsLoginItem(): DialogQueueItem {
	return createRequiredDialogQueueItem('home-event-rewards-login', {
		id: 'home-event-rewards-login',
		onClose(reason) {
			if (reason !== 'confirm') return
			const query = createLoginRedirectQuery(router.currentRoute.value.fullPath)
			router.push({
				name: 'login',
				...(query ? { query } : {})
			})
		}
	})
}

function createTreasureChestItem(chest: TreasureChestDialogChest, index: number, allowNonHome = false): DialogQueueItem {
	const rewardConfigId = String(chest.rewardConfigId ?? index)
	const taskType = String(chest.taskType ?? '')

	return createRequiredDialogQueueItem<TreasureChestDialogItemProps>(TREASURE_CHEST_DIALOG_KEY, {
		id: `home-treasure-chest-${rewardConfigId}-${taskType}-${index}`,
		props: { chest },
		...(allowNonHome && {
			policy: { allowedRoutes: [] }
		})
	})
}

function isVisibleTreasureChest(item: unknown): item is TreasureChestDialogChest {
	if (!item || typeof item !== 'object') return false
	const chest = item as Partial<TreasureChestDialogChest>
	return chest.isShow === 1 && chest.rewardConfigId != null && chest.taskType != null
}

// =============================================================================
// 每个弹窗一条 pipe（声明在模块顶层，整 app 内复用）
// =============================================================================

const ageGatePipe = createPipe(
	routeGuard,
	condition(() => AGE_GATE_PROJECTS.includes(window.CONFIG?.tenant)),
	condition(() => localStorage.getItem('is18') !== '1')
)

const latestAppVersionPipe = createPipe(routeGuard)

const announcementPipe = createPipe(
	routeGuard,
	condition((item) => {
		const props = item.props as AnnouncementDialogProps | undefined
		return !!props?.notices?.length
	}),
	condition(() => !hasShownAnnouncementInSession())
)

const superJackpotPipe = createPipe(
	routeGuard,
	condition(() => !hasShownSuperJackpotPromptInSession())
)

// FirstRecharge：
//   - dismissForToday 中间件：今日已 dismiss 过 → 不入队；同时包 onClose 在 reason='dismiss-today' 时自动落盘
//   - condition 拉一次列表，空 / 已 finished 直接不弹（避免组件 mount 后再自杀的"闪一下"）
//   存储 key 'dialog:firstSave' 与历史 useLocalStorage('firstSave') 隔离，老用户首次会再弹一次，这是有意为之
//   —— 上一版本是直接写 'firstSave'，老数据被新结构覆盖会更乱。
const firstRechargePipe = createPipe(
	routeGuard,
	dismissForToday('dialog:firstSave').middleware,
	condition(async () => {
		const { getFirstRechargeList } = useActive()
		const list: unknown = await getFirstRechargeList()
		if (!Array.isArray(list) || !list.length) return false
		if (list.some((item: { isFinshed?: boolean }) => item?.isFinshed)) return false
		return true
	})
)

const inviteRebatePipe = createPipe(routeGuard, amountGuard)

const returnAwardsPipe = createPipe(routeGuard, amountGuard)

const registerGiftPipe = createPipe(routeGuard, amountGuard)

// condition 前置拦空数组：避免弹窗 mount 后发现没数据再自杀，用户看到闪一下。
const couponArrivalPipe = createPipe(
	routeGuard,
	condition((item) => ((item.props as CouponArrivalDialogProps | undefined)?.coupons?.length ?? 0) > 0)
)

const appDownloadRewardPipe = createPipe(routeGuard, amountGuard)

const treasureChestPipe = createPipe(
	routeGuard,
	condition(() => Boolean(localStorage.getItem('token')))
)

const eventRewardsLoginPipe = createPipe(
	routeGuard,
	condition(() => !GlobalStore().token)
)

const manualAuthDialogPipe = createPipe(
	routeGuard,
	condition(() => Boolean(GlobalStore().token))
)

// =============================================================================
// Producers
// =============================================================================

export function pushAgeGateDialog() {
	const projectName = SettingStore().projectName
	return ageGatePipe.push(createAgeGateItem(projectName))
}

export function pushLatestAppVersionDialog(info: LastestAppVersionInfo | null | undefined) {
	// 这里的判定全部基于外部传入的 info（不在 item.props 上），用早期 return 比一长串 condition() 更直观。
	// pipe 仅做路由守卫。
	if (!info) return Promise.resolve(false)
	if (!native.isFullapk()) return Promise.resolve(false)

	const latestVersion = info.latestAppVersion?.trim()
	const currentVersion = native.getVersions()?.trim()
	const downloadUrl = info.appDownloadUrl?.trim()
	const updateType = Number(info.updateType)

	if (!latestVersion || !currentVersion || !downloadUrl) return Promise.resolve(false)
	if (compareVersion(currentVersion, latestVersion) >= 0) return Promise.resolve(false)
	if (updateType !== APP_UPDATE_TYPE.FORCE && updateType !== APP_UPDATE_TYPE.SUGGEST) {
		return Promise.resolve(false)
	}

	const forced = updateType === APP_UPDATE_TYPE.FORCE

	// 建议更新模式：今日已 dismiss 过则不再 push（forced 不受此限，紧急升级必弹）
	const dismissKey = `app_update_dismissed_${latestVersion}`
	const today = new Date().toDateString()
	if (!forced && localStorage.getItem(dismissKey) === today) {
		return Promise.resolve(false)
	}

	// URL 的 ?version=<v> 拼接挪到组件 download() 里做，producer 只传原始 url + version
	const item = createRequiredDialogQueueItem<AppUpdateDialogProps>('system-app-update', {
		id: `system-app-update-${latestVersion}`,
		props: { url: downloadUrl, version: latestVersion, forced },
		// 强制更新模式覆盖默认 policy：不可关、提到高优先级
		...(forced && {
			policy: {
				priority: 28000,
				force: true,
				closeOnClickOverlay: false
			}
		}),
		onClose(reason) {
			// 组件 cancel 按钮 emit 'dismiss-today' → Host 用此 reason 关闭 → 这里写盘
			// 下次 push 同版本时上面的 pre-check 会拦下来，跨 session 也持久（toDateString 跨日自动失效）
			if (reason === 'dismiss-today') {
				try {
					localStorage.setItem(dismissKey, today)
				} catch {
					// 隐私模式 setItem 抛 QuotaExceededError，吞掉
				}
			}
		}
	})

	return latestAppVersionPipe.push(item)
}

export function pushAnnouncementDialog(notices: AnnouncementNotice[]) {
	const normalizedNotices = normalizeAnnouncementNotices(notices)
	return announcementPipe.push(createAnnouncementItem(normalizedNotices))
}

export function pushSuperJackpotPromptDialog() {
	return superJackpotPipe.push(createSuperJackpotPromptItem())
}

export function pushEventRewardsLoginDialog() {
	return eventRewardsLoginPipe.push(createEventRewardsLoginItem())
}

export function pushRewardCenterDialog() {
	return manualAuthDialogPipe.push(createRequiredDialogQueueItem('home-reward-center'))
}

export function pushReBenefitDialog() {
	return manualAuthDialogPipe.push(createRequiredDialogQueueItem('home-re-benefit'))
}

export function pushFirstRechargeDialog() {
	return firstRechargePipe.push(createRequiredDialogQueueItem('home-first-recharge'))
}

export function pushInviteRebateDialog(amount: number) {
	return inviteRebatePipe.push(
		createRequiredDialogQueueItem<RewardAmountDialogItemProps>('home-invite-rebate', {
			props: {
				titleKey: 'inviteTips',
				descriptionKey: 'inviteAmount',
				amountLabelKey: 'commissionAmount',
				amount,
				action: 'none'
			}
		})
	)
}

export function pushReturnAwardsDialog(amount: number) {
	return returnAwardsPipe.push(
		createRequiredDialogQueueItem<RewardAmountDialogItemProps>('home-return-awards', {
			props: {
				captionKey: 'oldPromptTip',
				titleKey: 'oldPrompt',
				descriptionKey: 'oldPromptGift',
				amount,
				action: 'returnAwards'
			}
		})
	)
}

export function pushRegisterGiftDialog(amount: number, channelAmount?: string | number) {
	return registerGiftPipe.push(
		createRequiredDialogQueueItem<RewardAmountDialogItemProps>('home-register-gift', {
			props: {
				captionKey: 'newRegisterTip',
				titleKey: 'newRegisterPrompt',
				descriptionKey: 'newRegisterGift',
				descriptionArgs: [channelAmount || ''],
				amount,
				action: 'registerGift'
			}
		})
	)
}

export function pushCouponArrivalDialog(coupons: CouponArrivalDialogProps['coupons']) {
	return couponArrivalPipe.push(
		createRequiredDialogQueueItem<CouponArrivalDialogItemProps>('home-coupon-arrival', {
			props: { coupons },
			// 仅领取成功跳个人中心看券；失败走 close 不跳，避免把出错的用户甩去别的页
			onClose(reason) {
				if (reason !== 'confirm') return
				router.push({ name: 'main' })
			}
		})
	)
}

export function pushAppDownloadRewardDialog(amount: number) {
	return appDownloadRewardPipe.push(
		createRequiredDialogQueueItem<RewardAmountDialogItemProps>('home-app-download-reward', {
			props: {
				captionKey: 'downReceiveText1',
				titleKey: 'downReceiveText2',
				descriptionKey: 'downReceiveText3',
				amount,
				action: 'appDownload'
			}
		})
	)
}

export async function pushTreasureChestDialogs(options: PushTreasureChestDialogOptions = {}) {
	if (isDialogCleanRoute()) return false
	if (!options.allowNonHome && !TREASURE_CHEST_ROUTES.includes(String(router.currentRoute.value.name || ''))) return false

	const queue = useDialogQueue()
	if (isTreasureChestLoading) return false
	if (queue.items.some((item) => item.key === TREASURE_CHEST_DIALOG_KEY)) return false

	isTreasureChestLoading = true
	try {
		const result = await AwaitApiResult(GetTreasureChestPopupItems())
		const list = Array.isArray(result?.data) ? result.data.filter(isVisibleTreasureChest) : []
		if (!list.length) return false

		let pushedCount = 0
		for (let index = 0; index < list.length; index += 1) {
			if (await treasureChestPipe.push(createTreasureChestItem(list[index], index, Boolean(options.allowNonHome))))
				pushedCount += 1
		}

		return pushedCount > 0
	} finally {
		isTreasureChestLoading = false
	}
}

// =============================================================================
// 系统弹窗装挂
// =============================================================================

/**
 * 在 app 挂载后调用一次：装挂系统弹窗的触发器。
 *
 * 包含：
 *   - watch projectName                            → 年龄拦截
 *   - watch latestAppVersionInfo + 路由            → 强制/建议更新
 *   - 首次调用一次 + 监听 capacitor appStateChange → AppLock
 *
 * "常驻"类弹窗（policy.persistent=true，如 FirstRecharge）的路由触发不在这里：
 * 由 DialogQueueHost.vue 监听路由变化并调 registry.triggerPersistentDialogs()，
 * 无需在这里手写 watcher。
 *
 * 返回 cleanup 函数，需要在卸载时调用。
 */
export function setupSystemDialogQueue() {
	const setting = SettingStore()
	const user = GlobalStore()

	const stopAgeGate = watch(
		() => setting.projectName,
		(val) => {
			// projectName 未就绪时不推年龄门，否则弹窗拿不到站点配置
			!!val && pushAgeGateDialog()
		},
		{ immediate: true }
	)

	const stopAppUpdate = watch(
		() => [setting.getLastestAppVersionInfo, router.currentRoute.value.name, router.currentRoute.value.path] as const,
		([info]) => {
			pushLatestAppVersionDialog(info)
		}
	)

	const stopTreasureChest = watch(
		() => [router.currentRoute.value.name, user.token] as const,
		([routeName, token]) => {
			if (!TREASURE_CHEST_ROUTES.includes(String(routeName || ''))) return
			if (!token && !localStorage.getItem('token')) return
			pushTreasureChestDialogs()
		},
		{ immediate: true }
	)

	return () => {
		stopAgeGate()
		stopAppUpdate()
		stopTreasureChest()
	}
}
