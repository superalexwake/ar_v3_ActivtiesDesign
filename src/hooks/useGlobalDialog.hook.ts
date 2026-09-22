import ActivityReceiveRewardDialog from '@/components/DialogQueue/dialogs/ActivityReceiveRewardDialog.vue'
import ActivityUnAwardReminderDialog from '@/components/DialogQueue/dialogs/ActivityUnAwardReminderDialog.vue'
import NotifyCModal from '@/components/DialogQueue/notify/NotifyCModal.vue'
import NotifyCenterView from '@/components/DialogQueue/notify/NotifyCenterView.vue'
import NotifyKycOtpModal from '@/components/DialogQueue/notify/NotifyKycOtpModal.vue'
import {
	isDialogCleanRoute,
	pushAnnouncementDialog,
	pushAppDownloadRewardDialog,
	pushCouponArrivalDialog,
	pushFirstRechargeDialog,
	pushInviteRebateDialog,
	pushReBenefitDialog,
	pushRegisterGiftDialog,
	pushReturnAwardsDialog,
	pushSuperJackpotPromptDialog,
	pushTreasureChestDialogs,
	setupSystemDialogQueue
} from '@/components/DialogQueue/producers'
import { registerDialog } from '@/components/DialogQueue/registry'
import { takeRegCoupons } from '@/components/DialogQueue/regCouponStash'
import { clearDialogSessionState, hasShownAnnouncementInSession } from '@/components/DialogQueue/sessionKeys'
import { useDialogQueue } from '@/components/DialogQueue/useDialogQueue'
import SecurityDialog from '@/components/SecurityDialog/index.vue'
import { GetLoadedSetting, GetOldReturnNewRechargeAwardInfo, getSiteMessage } from '@/api'
import { applyActiveFromLoadedSetting, resetRedDot, trackFullLoad } from '@/components/common/use'
import { wsRefresher } from '@/api/axios'
import { useCoupon } from '@/hooks/useCoupon.hook'
import { handleCouponPush } from '@/hooks/useCouponPush.hook'
import router from '@/router'
import { dispatchPush, GlobalStore, SettingStore, useNotifyWsStore } from '@/stores'
import { AwaitApiResult } from '@/utils'
import { isHybridApp } from '@/utils/jsBridge'
import { useDocumentVisibility, useEventListener } from '@vueuse/core'
import { showConfirmDialog } from 'vant'
import { markRaw, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
	ACTIVITY_RECEIVE_REWARD_DIALOG_GROUP,
	ACTIVITY_RECEIVE_REWARD_DIALOG_KEY,
	ACTIVITY_UN_AWARD_REMINDER_DIALOG_GROUP,
	ACTIVITY_UN_AWARD_REMINDER_DIALOG_KEY,
	FAST_UPI_KYC_OTP_DIALOG_GROUP,
	FAST_UPI_KYC_OTP_DIALOG_KEY,
	NOTIFY_C_MODAL_KEY,
	NOTIFY_CENTER_BLOCKED_ROUTES,
	NOTIFY_CENTER_KEY,
	SECURITY_VERIFY_DIALOG_GROUP,
	SECURITY_VERIFY_DIALOG_KEY
} from './dialogKeys'

interface DialogStore {
	rebateAmount: number
	returnAwards: number
	registerGiftAmount: number
	isARPay: boolean
	isLandingPageEnabled: boolean
	landingPageUrl: string
	financePromptText: string
	isFinancePromptTextEnabled: boolean
	downAppRewardBonusAmount: number
	rewardCenter: boolean
	reBenefit: boolean
	reBenefitObj: any | null
	serviceNowTime: null | number | string
	isShowReBenefit: boolean
	isShowTreasureChest: boolean
}

const createDefaultDialogStore = (): DialogStore => ({
	registerGiftAmount: 0,
	rebateAmount: 0,
	returnAwards: 0,
	downAppRewardBonusAmount: 0,
	isARPay: false,
	isLandingPageEnabled: false,
	landingPageUrl: '',
	financePromptText: '',
	isFinancePromptTextEnabled: false,
	rewardCenter: false,
	reBenefit: false,
	reBenefitObj: null,
	serviceNowTime: null,
	isShowReBenefit: false,
	isShowTreasureChest: false
})

const store = reactive<DialogStore>(createDefaultDialogStore())
let hasRegisteredGlobalDialogs = false
let hasBootstrappedGlobalDialog = false
const NOTIFY_WS_RECOVERY_COOLDOWN_MS = 10 * 1000

/** 重置全局弹窗业务状态。 */
const resetDialogStore = () => {
	Object.assign(store, createDefaultDialogStore())
}

/** 清理登录、注册等认证页面不应保留的弹窗状态。 */
export const clearAuthPageDialogState = () => {
	resetDialogStore()
	resetRedDot()
	useDialogQueue().discard()
	clearDialogSessionState()
}

/** 注册全局 DialogQueue 组件映射。 */
const registerGlobalDialogs = () => {
	if (hasRegisteredGlobalDialogs) return
	hasRegisteredGlobalDialogs = true

	registerDialog({
		key: ACTIVITY_RECEIVE_REWARD_DIALOG_KEY,
		component: markRaw(ActivityReceiveRewardDialog),
		defaultPolicy: {
			presentation: 'center',
			priority: 900,
			group: ACTIVITY_RECEIVE_REWARD_DIALOG_GROUP,
			force: true,
			closeOnClickOverlay: false
		}
	})
	registerDialog({
		key: ACTIVITY_UN_AWARD_REMINDER_DIALOG_KEY,
		component: markRaw(ActivityUnAwardReminderDialog),
		defaultPolicy: {
			presentation: 'center',
			priority: 900,
			group: ACTIVITY_UN_AWARD_REMINDER_DIALOG_GROUP,
			force: true,
			closeOnClickOverlay: false,
			allowedRoutes: ['activity']
		}
	})
	registerDialog({
		key: NOTIFY_C_MODAL_KEY,
		component: markRaw(NotifyCModal),
		defaultPolicy: { presentation: 'center', priority: 1000 }
	})
	registerDialog({
		key: NOTIFY_CENTER_KEY,
		component: markRaw(NotifyCenterView),
		// 三方游戏页 / 彩票玩法页不打扰玩家：只入列表不展示，退出这些页面后自动补弹。
		defaultPolicy: {
			presentation: 'top',
			priority: 0,
			blockedRoutes: NOTIFY_CENTER_BLOCKED_ROUTES
		}
	})
	registerDialog({
		key: FAST_UPI_KYC_OTP_DIALOG_KEY,
		component: markRaw(NotifyKycOtpModal),
		defaultPolicy: {
			presentation: 'center',
			priority: 1200,
			group: FAST_UPI_KYC_OTP_DIALOG_GROUP,
			force: true,
			closeOnClickOverlay: false
		}
	})
	registerDialog({
		key: SECURITY_VERIFY_DIALOG_KEY,
		component: markRaw(SecurityDialog),
		defaultPolicy: {
			presentation: 'center',
			priority: 1300,
			group: SECURITY_VERIFY_DIALOG_GROUP,
			force: true,
			closeOnClickOverlay: false
		}
	})
}

/** 初始化站内信 WS 与 DialogQueue 分发器。 */
const setupNotifyWebSocket = () => {
	const ws = useNotifyWsStore()
	ws.setSubscriptionRefresher(wsRefresher)
	// 券弹窗是 .vue 组件，notifyWs 恪守零 .vue 依赖，故在 UI 层前置拦截；未命中的一律原样交回既有分发
	ws.setMessageHandler((data) => {
		if (handleCouponPush(data)) return
		dispatchPush(data)
	})
	if (GlobalStore().getToken) void ws.connect()
}

/** 回前台兜底恢复站内信 WS，覆盖后台挂起后连接假活的场景。 */
const setupNotifyWsVisibilityRecovery = (): (() => void) => {
	const visibility = useDocumentVisibility()
	const ws = useNotifyWsStore()
	let inactiveAt = visibility.value === 'hidden' ? Date.now() : 0
	let lastRecoverAt = 0
	const markInactive = () => {
		inactiveAt = Date.now()
	}
	const recover = (reason: string) => {
		if (!inactiveAt) return
		inactiveAt = 0

		const now = Date.now()
		if (now - lastRecoverAt < NOTIFY_WS_RECOVERY_COOLDOWN_MS) return
		if (!GlobalStore().getToken) return

		lastRecoverAt = now
		void ws.refreshAndReconnect(reason)
	}

	const stopVisibilityWatch = watch(visibility, (value) => {
		if (value === 'hidden') {
			markInactive()
			return
		}
		if (value === 'visible') recover('visibility:visible')
	})
	const stopVisibilityEvent = useEventListener(document, 'visibilitychange', () => {
		if (document.visibilityState === 'hidden') {
			markInactive()
			return
		}
		recover('visibilitychange:visible')
	})

	return () => {
		stopVisibilityWatch()
		stopVisibilityEvent()
	}
}

/** 全局弹窗、系统队列和站内信连接的统一入口。 */
export const useGlobalDialog = () => {
	const route = useRoute()
	const { t } = useI18n()
	const user = GlobalStore()
	const setting = SettingStore()

	const pushSiteMessages = async () => {
		const res = await AwaitApiResult(getSiteMessage())
		if (!res) return
		const notices = Array.isArray(res.data) ? res.data : []
		await pushAnnouncementDialog(notices)
	}

	/** 首屏奖励弹窗编排。入队顺序须与 priority 降序一致，否则先入队的低优先级项会被后到的顶掉。 */
	const pushRewardDialogs = async (token: string | null) => {
		const promptShow = hasShownAnnouncementInSession()
		let isPrizeReward = false
		let needFirstRechargePopup = false
		if (token) {
			const result = await trackFullLoad(AwaitApiResult(GetLoadedSetting()))
			if (!result) return
			const data = result.data || {}
			needFirstRechargePopup = data?.needPopupFirstRecharge || false
			isPrizeReward = data?.isExistGrandAward || false
			store.rebateAmount = data?.children_Lv_RebateAmount_Yesterday || 0
			store.returnAwards = data?.returnAwards || 0
			store.registerGiftAmount = data?.registerGiftAmount || 0
			store.downAppRewardBonusAmount = data?.downAppRewardBonusAmount || 0
			store.isARPay = data?.isARPay
			store.isLandingPageEnabled = data?.isLandingPageEnabled
			store.landingPageUrl = data?.landingPageUrl
			store.financePromptText = data?.financePromptText
			store.isFinancePromptTextEnabled = data?.isFinancePromptTextEnabled
			store.reBenefit = data?.returnNewRechargeAwards !== null
			store.reBenefitObj = data?.returnNewRechargeAwards || null
			store.serviceNowTime = result?.serviceNowTime || 0
			applyActiveFromLoadedSetting(data, true)
			sessionStorage.setItem('ar_pay', `${data?.isARPay ? 1 : 0}`)
			if (route.name == 'home' && !promptShow) {
				await pushSiteMessages()
			}
		}
		if (needFirstRechargePopup) {
			await pushFirstRechargeDialog()
		}
		if (user.getUserInfo.isPopupCommissionSwitch == '1' && !promptShow && store.rebateAmount > 0 && token) {
			await pushInviteRebateDialog(store.rebateAmount)
		}
		if (isPrizeReward) {
			await pushSuperJackpotPromptDialog()
		}
		if (store.returnAwards > 0) {
			await pushReturnAwardsDialog(store.returnAwards)
		}
		if (store.registerGiftAmount > 0) {
			await pushRegisterGiftDialog(store.registerGiftAmount, user.getUserInfo.channelAmountofCode)
		}
		if (setting.isOpenDownAppRewardSwitch && store.downAppRewardBonusAmount > 0 && token) {
			await pushAppDownloadRewardDialog(store.downAppRewardBonusAmount)
		}
		if (token) {
			await pushTreasureChestDialogs()
		}
		if (store.reBenefitObj) {
			await pushReBenefitDialog()
		}
	}

	const openAll = async () => {
		resetDialogStore()
		const token = localStorage.getItem('token')
		// 券源独立于 GetLoadedSetting，先取，不受 pushRewardDialogs 中途 return 连累（BR-02 登录即弹）；
		// 但必须垫最后入队：queue.current 是无展示锁的实时 computed，后到的高优先级弹窗会顶掉已在展示的券。
		// 注册直发券已随注册响应到达，优先用它省一次查询；无则回落查未领取券。
		const regCoupons = takeRegCoupons()
		const coupons = regCoupons.length ? regCoupons : token ? await useCoupon().fetchUnclaimed() : []
		await pushRewardDialogs(token)
		if (coupons.length) await pushCouponArrivalDialog(coupons)
	}

	const onReturnReBenefit = async () => {
		if (!store.reBenefitObj?.id) return null
		const result = await AwaitApiResult(GetOldReturnNewRechargeAwardInfo({ recordId: store.reBenefitObj.id }))
		const data = result?.data || null
		store.reBenefit = data !== null
		store.reBenefitObj = data || null
		store.serviceNowTime = result?.serviceNowTime || 0
		return data
	}

	const downAppTip = async (link: any) => {
		if (isHybridApp() || !store.isFinancePromptTextEnabled) {
			return router.push({
				name: link
			})
		}
		void showConfirmDialog({
			title: t('tips'),
			message: store.financePromptText
		}).catch(() => {})
	}

	const bootstrapGlobalDialog = () => {
		if (hasBootstrappedGlobalDialog) return
		hasBootstrappedGlobalDialog = true

		let stopSystemDialogQueue: (() => void) | null = null
		const stopNotifyWsVisibilityRecovery = setupNotifyWsVisibilityRecovery()
		const clearDialogStateForAuthRoute = () => {
			if (!isDialogCleanRoute(route.name, route.path)) return
			clearAuthPageDialogState()
		}

		onMounted(() => {
			stopSystemDialogQueue = setupSystemDialogQueue()
			setupNotifyWebSocket()
			void openAll()
		})

		onBeforeUnmount(() => {
			stopSystemDialogQueue?.()
			stopNotifyWsVisibilityRecovery()
			hasBootstrappedGlobalDialog = false
		})

		watch(() => [route.name, route.path], clearDialogStateForAuthRoute, { immediate: true })
	}

	registerGlobalDialogs()
	bootstrapGlobalDialog()

	return {
		store,
		openAll,
		downAppTip,
		onReturnReBenefit,
		clearAuthPageDialogState
	}
}
