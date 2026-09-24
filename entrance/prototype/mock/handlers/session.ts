import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim, featureState } from '../state'
import type { MockContext, MockHandler, MockRoutes, PopupKey } from '../types'
import type { ActivityCenterParams } from './activityCenter'
import { pointMallState } from './pointMall'

/** 回归奖励（returnAward）的参数，声明见 catalog.json */
interface ReturnAwardParams {
	/** 奖励金额（₹） */
	amount: number
	/** 领取结果；fail 返回“活动已结束” */
	claimResult: 'ok' | 'fail'
}

/** 下载APP并充值（appDownload）的参数，声明见 catalog.json */
interface AppDownloadParams {
	/** 奖励金额（₹） */
	amount: number
	/** 站点开启下载奖励，由 home.ts 写入 GetHomeSettings；页面要求它与金额同时满足才弹窗 */
	siteSwitch: boolean
	/** 领取结果 */
	claimResult: 'ok' | 'fail'
}

/** 回归新充值奖励（reBenefit）的参数，声明见 catalog.json */
interface ReBenefitParams {
	/** 赠送比例（%） */
	rate: number
	/** 封顶金额（₹） */
	limit: number
	/** 已充值得奖 */
	finished: boolean
	/** 已得奖金（₹），只在 finished 为真时下发 */
	reward: number
	/** 活动截止时刻（毫秒时间戳）；0 表示活动已结束 */
	remain: number
}

/** 注册彩金（registerGift）的参数，声明见 catalog.json */
interface RegisterGiftParams {
	/** 彩金金额（₹） */
	amount: number
	/** 流水倍数，写入 userInfo.channelAmountofCode，弹窗文案“N 倍流水即可出款”读取它 */
	turnover: number
	/** 领取结果 */
	claimResult: 'ok' | 'fail'
}

/** 活动会话数据（featureState 键 activityCenter）：用户已完成的一次性提示 */
interface ActivityCenterState {
	/** 已点过新手引导气泡（SaveUserGuidelines） */
	guideDone: boolean
	/** 已关闭过未领奖励提醒弹窗（SaveUserDayRequest） */
	reminderDone: boolean
}

/** 接口里的时间格式 */
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/** 首页弹窗奖励的领取键；回归奖励、下载奖励的键同时决定奖励中心对应行（activityCenter.ts）的已领取状态 */
const RETURN_AWARD_KEY = 'returnAward:1'
const APP_DOWNLOAD_KEY = 'appDownload:1'
const REGISTER_GIFT_KEY = 'registerGift:1'

/** 原型的虚构登录用户，字段与 UserInfo（src/types/api/interface/store/store.d.ts）一致；随参数、会话、语言变化的字段由 userInfoOf() 补齐 */
const FAKE_USER = {
	sign: 'prototype-token',
	userId: 10086,
	userPhoto: '',
	userName: '91****8888',
	amountofCode: 0,
	isWithdraw: 1,
	isGoogle: '0',
	message: '',
	withdrawCount: 0,
	userLoginDate: '2026-09-21 10:00:00',
	startTime: '',
	endTime: '',
	fee: 0,
	unRead: 3,
	facebookAppID: '',
	googleAppID: '',
	twitterAppID: '',
	keyCode: 0,
	uRate: 0,
	trxRate: 0,
	uGold: 0,
	isTaskState: '1',
	isvalidator: 0,
	isRePwd: '1',
	isOpenWashCode: '1',
	isOpenJackpotReward: '1',
	googleVerify: 0,
	groupDataShowAuth: [],
	isShowWalletTotalCT: '1',
	isShowRechargeBankList: '0',
	isOpenOfficialRechargeInputDialog: '0',
	regType: 1,
	verifyMethods: { email: '', google: '0', mobile: '91****8888' },
	bindReward: 0,
	isPopupCommissionSwitch: '0',
	isPartnerReward: '1',
	isOpenRechargeCoupon: '1',
	isAllowWithdraw: 1,
	allowNoRechargeGame: '1',
	userRechargeTimes: 3,
	canDirectToGame: true,
}

/**
 * 活动页入口红点：页面把 1 画成圆点、大于 1 画成数字。
 * 2026-09-24 对齐设计稿角标示例值：count 档下活动奖励=5、超级大奖=4，其余入口仍为 1。
 */
const RED_DOT: Record<ActivityCenterParams['redDot'], { award: number; superJackpot: number; other: number }> = {
	count: { award: 5, superJackpot: 4, other: 1 },
	dot: { award: 1, superJackpot: 1, other: 1 },
	none: { award: 0, superJackpot: 0, other: 0 },
}

/** 活动开关编码：'1' 开启、'0' 关闭；useActive.ts 的 translateBoolean 只认 '1' */
const flag = (on: boolean) => (on ? '1' : '0')

/** 读取某个活动的开关参数 enabled */
const isEnabled = (ctx: MockContext, activity: string) => params<{ enabled: boolean }>(ctx, activity).enabled

/**
 * 锦标赛入口是否对用户可见(2026-09-23 拍板:锦标赛全站默认隐藏)：既要 championship 活动自己的开关打开，
 * 也要活动页「显示锦标赛」开关(activityCenter.showChampionship)打开；后者默认 false，所以锦标赛在两处
 * 开关都保持默认时不可见——isOpenChampion 字段是"我的"页锦标赛入口、活动页赛事卡数据拉取共用的唯一开关，
 * 这里统一收口，不用在各个消费它的前端文件里分别判断。
 */
const isChampionshipVisible = (ctx: MockContext) =>
	isEnabled(ctx, 'championship') && params<ActivityCenterParams>(ctx, 'activityCenter').showChampionship

const nickName = (ctx: MockContext) => pick(ctx, '原型用户', 'Prototype User', 'प्रोटोटाइप यूज़र')

const now = () => dayjs().format(TIME_FORMAT)

const centerState = (ctx: MockContext) =>
	featureState<ActivityCenterState>(ctx, 'activityCenter', () => ({ guideDone: false, reminderDone: false }))

/** 首页弹窗待弹出：本次启动由控制台触发了该弹窗，且对应活动还没有领取记录 */
const pending = (ctx: MockContext, popup: PopupKey, claimKey: string) => ctx.scenario.popup === popup && !ctx.state.claimed[claimKey]

/**
 * 活动开关与活动页顶部数据，GetActiveSetting、GetLoadedSetting 共用。
 *
 * @param ctx - 请求上下文。
 * @returns 活动开关、红点计数、引导与提醒、今日/累计奖励；不含 activityRedDot（只有 GetLoadedSetting 返回）。
 */
function activeSetting(ctx: MockContext) {
	const center = params<ActivityCenterParams>(ctx, 'activityCenter')
	const { other } = RED_DOT[center.redDot]
	const state = centerState(ctx)
	return {
		isTaskState: flag(isEnabled(ctx, 'invitationBonus')),
		isOpenJackpotReward: flag(isEnabled(ctx, 'jackpot')),
		isOpenWashCode: flag(isEnabled(ctx, 'laundry')),
		isOpenActivityAward: flag(isEnabled(ctx, 'dailyTask')),
		newMemberGiftPackageSwitch: flag(isEnabled(ctx, 'memberPackage')),
		isOpenChampion: flag(isChampionshipVisible(ctx)),
		unJackpotCount: other,
		unWeeklyAwardCount: other,
		// 接口 false 表示未完成引导，页面取反后显示气泡
		isFinishUserGuidelines: !center.guide || state.guideDone,
		isFirstUserDayRequest: center.reminder && !state.reminderDone,
		newbieGiftPackCount: other,
		todayRewards: center.todayRewards,
		totalRewards: center.totalRewards,
	}
}

/**
 * 活动页入口红点聚合（GetLoadedSetting.activityRedDot）。
 *
 * @param ctx - 请求上下文。
 * @returns 各入口计数与 totalCount（底部导航“活动”的红点）；今日已签到或本周期已签满时签到入口为 0。
 */
function activityRedDot(ctx: MockContext) {
	const { award, superJackpot, other } = RED_DOT[params<ActivityCenterParams>(ctx, 'activityCenter').redDot]
	const signIn = params<{ signedDays: number; todaySigned: boolean }>(ctx, 'signIn')
	const counts = {
		activityAwardCount: award,
		invitationBonusCount: other,
		bettingRebateCount: other,
		superJackpotCount: superJackpot,
		firstGiftCount: other,
		invitedWheelCount: other,
		attendanceBonusCount: signIn.todaySigned || signIn.signedDays >= 7 ? 0 : other,
	}
	return { ...counts, totalCount: Object.values(counts).reduce((sum, count) => sum + count, 0) }
}

/** 首充弹窗：控制台触发、活动开启、参数未领取，且会话里没有领过任何首充档位 */
function needFirstRechargePopup(ctx: MockContext): boolean {
	const firstRecharge = params<{ enabled: boolean; claimed: boolean }>(ctx, 'firstRecharge')
	if (ctx.scenario.popup !== 'first-recharge' || !firstRecharge.enabled || firstRecharge.claimed) return false
	return !Object.keys(ctx.state.claimed).some((key) => key.startsWith('firstRecharge:'))
}

/**
 * 回归新充值奖励；GetLoadedSetting.returnNewRechargeAwards 与 GetOldReturnNewRechargeAwardInfo 返回同一对象、同一时间窗。
 *
 * @param ctx - 请求上下文。
 * @returns 控制台触发了该弹窗且截止时刻未到时返回奖励对象，时间窗为截止前 24 小时至截止；否则返回 null（页面按 null 判定没有活动，不再倒计时）。
 */
function reBenefitAward(ctx: MockContext) {
	const p = params<ReBenefitParams>(ctx, 'reBenefit')
	if (ctx.scenario.popup !== 're-benefit' || p.remain <= Date.now()) return null
	return {
		id: 9001,
		isFinish: p.finished,
		bonusAmountRate: p.rate,
		bonusAmountLimit: p.limit,
		rewardAmount: p.finished ? p.reward : 0,
		activeStartTime: dayjs(p.remain).subtract(24, 'hour').format(TIME_FORMAT),
		activeEndTime: dayjs(p.remain).format(TIME_FORMAT),
	}
}

/** GetLoadedSetting：弹窗开关 + 活动开关 + 活动页红点，首页启动时调用 */
const loadedSetting: MockHandler = (ctx) => ({
	...ok({
		...activeSetting(ctx),
		activityRedDot: activityRedDot(ctx),
		needPopupFirstRecharge: needFirstRechargePopup(ctx),
		returnAwards: pending(ctx, 'return-award', RETURN_AWARD_KEY) ? params<ReturnAwardParams>(ctx, 'returnAward').amount : 0,
		downAppRewardBonusAmount: pending(ctx, 'app-download-reward', APP_DOWNLOAD_KEY) ? params<AppDownloadParams>(ctx, 'appDownload').amount : 0,
		// useGlobalDialog 用 `!== null` 判断是否有活动，未触发时必须显式返回 null
		returnNewRechargeAwards: reBenefitAward(ctx),
		isExistGrandAward: params<{ homePrompt: boolean }>(ctx, 'jackpot').homePrompt,
		registerGiftAmount: pending(ctx, 'register-gift', REGISTER_GIFT_KEY) ? params<RegisterGiftParams>(ctx, 'registerGift').amount : 0,
		children_Lv_RebateAmount_Yesterday: 0,
		isARPay: false,
		isLandingPageEnabled: false,
		landingPageUrl: '',
		financePromptText: '',
		isFinancePromptTextEnabled: false,
	}),
	serviceNowTime: now(),
})

/** ReceiveReturnAwards：领取回归奖励（首页弹窗与奖励中心 115 行共用） */
const receiveReturnAward: MockHandler = (ctx) => {
	const { amount, claimResult } = params<ReturnAwardParams>(ctx, 'returnAward')
	if (claimResult === 'fail') return fail(pick(ctx, '活动已结束', 'This event has ended', 'यह इवेंट समाप्त हो गया है'))
	return claim(ctx, RETURN_AWARD_KEY, amount)
}

/** ReceiveDownAppReward：领取下载 APP 奖励（首页弹窗与奖励中心 131 行共用） */
const receiveAppDownload: MockHandler = (ctx) => {
	const { amount, claimResult } = params<AppDownloadParams>(ctx, 'appDownload')
	if (claimResult === 'fail') {
		return fail(pick(ctx, '请先下载 APP 并完成充值', 'Please download the app and make a deposit first', 'कृपया पहले ऐप डाउनलोड करें और डिपॉज़िट करें'))
	}
	return claim(ctx, APP_DOWNLOAD_KEY, amount)
}

/** ReceiveRegisterGift：领取注册彩金 */
const receiveRegisterGift: MockHandler = (ctx) => {
	const { amount, claimResult } = params<RegisterGiftParams>(ctx, 'registerGift')
	if (claimResult === 'fail') {
		return fail(pick(ctx, '领取失败，请稍后再试', 'Failed to claim, please try again later', 'दावा विफल रहा, कृपया बाद में पुनः प्रयास करें'))
	}
	return claim(ctx, REGISTER_GIFT_KEY, amount)
}

/**
 * 当前登录用户信息；GetUserInfo 与 H5 启动时写入 localStorage 的 userInfo 种子同源。
 *
 * @param ctx - 请求上下文；启动种子由 mock/index.ts 构造（没有请求路径与请求体）。
 * @returns 虚构用户信息：余额取会话钱包余额，积分取积分商城会话积分（与兑换、抽奖扣分联动），
 *   积分商城与锦标赛入口、未使用优惠券张数、注册彩金流水倍数取对应活动的参数，昵称与语言取当前 H5 语言。
 */
export function userInfoOf(ctx: MockContext) {
	return {
		...FAKE_USER,
		nickName: nickName(ctx),
		amount: ctx.state.balance,
		integral: pointMallState(ctx).points,
		isOpenPointMall: flag(isEnabled(ctx, 'pointMall')),
		isOpenChampion: flag(isChampionshipVisible(ctx)),
		unUsedRechargeCouponCount: params<{ unused: number }>(ctx, 'coupon').unused,
		// 不在 UserInfo 类型声明中，注册彩金弹窗文案读取（pushRegisterGiftDialog）
		channelAmountofCode: params<RegisterGiftParams>(ctx, 'registerGift').turnover,
		useLanguage: ctx.lang,
	}
}

/** GetVipUsers：我的页与 VIP 页顶部信息；settlementDate 是距下次结算的天数，非时间戳 */
const getVipUsers: MockHandler = (ctx) => {
	const { level, exp, settleDays } = params<{ level: number; exp: number; settleDays: number }>(ctx, 'vip')
	return ok({ userId: FAKE_USER.userId, vipLevel: level, nickName: nickName(ctx), exp, settlementDate: settleDays })
}

/** 登录、刷新 token 共用的假 token；tokenRefresher.ts 的 persistTokens 只读这三项，故不含 webSocketUrl */
const fakeTokens = { token: 'prototype-token', tokenHeader: 'Bearer ', refreshToken: 'prototype-refresh' }

/** 启动、会话、首页弹窗与活动页引导的接口假数据 */
export const sessionRoutes: MockRoutes = {
	[api.GetLoadedSetting]: loadedSetting,
	[api.GetActiveSetting]: (ctx) => ok(activeSetting(ctx)),
	[api.ReceiveReturnAwards]: receiveReturnAward,
	[api.ReceiveRegisterGift]: receiveRegisterGift,
	[api.ReceiveDownAppReward]: receiveAppDownload,
	[api.GetOldReturnNewRechargeAwardInfo]: (ctx) => ({ ...ok(reBenefitAward(ctx)), serviceNowTime: now() }),
	[api.SaveUserGuidelines]: (ctx) => {
		centerState(ctx).guideDone = true
		return ok(null)
	},
	[api.SaveUserDayRequest]: (ctx) => {
		centerState(ctx).reminderDone = true
		return ok(null)
	},
	[api.GetUserInfo]: (ctx) => ok(userInfoOf(ctx)),
	[api.GetVipUsers]: getVipUsers,
	[api.SetUserLanguage]: () => ok(null),
	[api.Login]: () => ok(fakeTokens),
	[api.RefreshToken]: () => ok(fakeTokens),
	[api.LoginOff]: () => ok(null),
}
