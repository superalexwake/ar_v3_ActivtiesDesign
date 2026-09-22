import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { featureState } from '../state'
import { CHANNELS } from './recharge'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/**
 * 用户返利券状态(对齐 useCoupon.hook.ts 的 USER_COUPON_STATE):
 * 0 未领取(仅到账弹窗池用,后端本身无产生入口) / 1 未使用 / 3 已使用 / 4 已过期。
 * 2 锁定中(下单锁券)本文件不生成演示数据,但"已使用"Tab 按真实页面查询会同时带 2、3 两个状态。
 */
const COUPON_STATE = { UNRECEIVED: 0, UNUSED: 1, USED: 3, EXPIRED: 4 } as const

/** 券适用充值大类:id 直接取自 recharge.ts 导出的 CHANNELS(payID 101–104,四个真实充值渠道),name 随语言现算,与充值页保持同源 */
const categoriesOf = (ctx: MockContext, ids: number[]) =>
	ids.map((id) => {
		const channel = CHANNELS.find((c) => c.payID === id)
		return { id, name: channel ? pick(ctx, channel.zh, channel.en, channel.hd) : String(id) }
	})

/**
 * 用户返利券的语言无关记录。categoryIds 只存原始大类 id,响应时才经 categoriesOf() 现算多语言 name——
 * adapter 每次请求都重读当前语言以支持免刷新切换,若在这里把文案提前拼好存进 featureState 会导致切语言后文案卡在初次值。
 */
interface CouponRecord {
	userRechargeCouponId: number
	couponId: number
	couponNum: string
	rechargeGiftRate: number
	rechargeGiftLimit: number
	bonusMergeMode: number
	minRechargeAmount: number
	couponValidDays: number
	amountofCode: number
	categoryIds: number[]
	couponBusinessType: number
	agentListId: number
	authListId: number
	isFirstRechargeAvailable: boolean
	userRechargeCouponSate: number
	expireTime: string | null
	lockOrderNumber: string | null
}

/** 券种目录记录(无用户维度字段),供代理邀请券两个接口共用同一份数据 */
type CouponTemplate = Omit<CouponRecord, 'userRechargeCouponId' | 'userRechargeCouponSate' | 'expireTime' | 'lockOrderNumber'>

const toCouponItem = (ctx: MockContext, c: CouponTemplate) => {
	const { categoryIds, ...rest } = c
	return { ...rest, rechargeCategorys: categoriesOf(ctx, categoryIds) }
}

/** 未使用且有到期时间的券才现算剩余分钟数;不限期/已使用/已过期/未领取恒为 null,对齐真契约字段含义 */
const toUserCoupon = (ctx: MockContext, c: CouponRecord) => {
	const { categoryIds, ...rest } = c
	const remainingMinutes =
		c.userRechargeCouponSate === COUPON_STATE.UNUSED && c.expireTime
			? Math.max(0, dayjs(c.expireTime).diff(dayjs(), 'minute'))
			: null
	return { ...rest, rechargeCategorys: categoriesOf(ctx, categoryIds), remainingMinutes }
}

/** 券功能的会话数据,经 featureState(ctx, 'coupon', init) 存取 */
interface CouponFeatureState {
	/** 已持有的用户返利券,未使用/已使用/已过期混存,由查询方按 userRechargeCouponSate 过滤 */
	owned: CouponRecord[]
}

/** coupon 活动参数(catalog.json `activities.coupon.params`) */
interface CouponParams {
	/** 未使用张数(0~3),从未使用券候选池按顺序截取 */
	unused: number
	/** 是否包含历史券(1 张已使用 + 1 张已过期,整体开关) */
	history: boolean
}

/** couponArrival 活动参数(catalog.json `activities.couponArrival.params`) */
interface CouponArrivalParams {
	/** 待领张数(1~3),从待领券候选池按顺序截取 */
	count: number
	/** 一键领取的结果 */
	claimResult: 'ok' | 'fail'
}

/** 到账弹窗券的领取键:领取后写入 ctx.state.claimed,重置数据即可再次弹出 */
const ARRIVAL_CLAIM_KEY = 'couponArrival:claimed'

/** 未使用券候选池:第 3 张为"今天到期"的券,用来看最早到期的展示效果 */
function unusedPool(now: dayjs.Dayjs): CouponRecord[] {
	return [
		{
			userRechargeCouponId: 9001,
			couponId: 9001,
			couponNum: 'CP2026RECH01',
			rechargeGiftRate: 0.15,
			rechargeGiftLimit: 300,
			bonusMergeMode: 1,
			minRechargeAmount: 1000,
			couponValidDays: 15,
			amountofCode: 1,
			categoryIds: [101, 102, 103],
			couponBusinessType: 4,
			agentListId: 0,
			authListId: 0,
			isFirstRechargeAvailable: true,
			userRechargeCouponSate: COUPON_STATE.UNUSED,
			expireTime: now.add(15, 'day').format('YYYY-MM-DD HH:mm:ss'),
			lockOrderNumber: null
		},
		{
			userRechargeCouponId: 9002,
			couponId: 9002,
			couponNum: 'CP2026RECH02',
			rechargeGiftRate: 0.08,
			rechargeGiftLimit: 0,
			bonusMergeMode: 1,
			minRechargeAmount: 0,
			couponValidDays: 0,
			amountofCode: 1,
			categoryIds: [103, 104],
			couponBusinessType: 4,
			agentListId: 0,
			authListId: 0,
			isFirstRechargeAvailable: false,
			userRechargeCouponSate: COUPON_STATE.UNUSED,
			expireTime: null,
			lockOrderNumber: null
		},
		{
			userRechargeCouponId: 9005,
			couponId: 9005,
			couponNum: 'CP2026TODAY5',
			rechargeGiftRate: 0.06,
			rechargeGiftLimit: 80,
			bonusMergeMode: 1,
			minRechargeAmount: 200,
			couponValidDays: 1,
			amountofCode: 1,
			categoryIds: [102, 104],
			couponBusinessType: 4,
			agentListId: 0,
			authListId: 0,
			isFirstRechargeAvailable: false,
			userRechargeCouponSate: COUPON_STATE.UNUSED,
			expireTime: now.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
			lockOrderNumber: null
		}
	]
}

/** 历史券候选池:已使用 + 已过期各一张,由 history 参数整体开关 */
function historyPool(now: dayjs.Dayjs): CouponRecord[] {
	return [
		{
			userRechargeCouponId: 9003,
			couponId: 9003,
			couponNum: 'CP2025USED03',
			rechargeGiftRate: 0.05,
			rechargeGiftLimit: 100,
			bonusMergeMode: 1,
			minRechargeAmount: 200,
			couponValidDays: 30,
			amountofCode: 1,
			categoryIds: [101, 102, 103, 104],
			couponBusinessType: 4,
			agentListId: 0,
			authListId: 0,
			isFirstRechargeAvailable: false,
			userRechargeCouponSate: COUPON_STATE.USED,
			expireTime: now.add(20, 'day').format('YYYY-MM-DD HH:mm:ss'),
			lockOrderNumber: 'RC20260901000123'
		},
		{
			userRechargeCouponId: 9004,
			couponId: 9004,
			couponNum: 'CP2025EXP04',
			rechargeGiftRate: 0.1,
			rechargeGiftLimit: 50,
			bonusMergeMode: 1,
			minRechargeAmount: 100,
			couponValidDays: 7,
			amountofCode: 1,
			categoryIds: [101],
			couponBusinessType: 4,
			agentListId: 0,
			authListId: 0,
			isFirstRechargeAvailable: false,
			userRechargeCouponSate: COUPON_STATE.EXPIRED,
			expireTime: now.subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
			lockOrderNumber: null
		}
	]
}

/** 已持有券种子数据:按 unused/history 参数从候选池截取 */
function buildOwnedSeed(p: CouponParams): CouponRecord[] {
	const now = dayjs()
	return [...unusedPool(now).slice(0, p.unused), ...(p.history ? historyPool(now) : [])]
}

/** 待领取券候选池:按 couponArrival.count 参数从头截取,不落会话数据(见 pendingCoupons) */
const PENDING_POOL: CouponRecord[] = [
	{
		userRechargeCouponId: 9101,
		couponId: 9101,
		couponNum: 'CP2026GIFT01',
		rechargeGiftRate: 0.12,
		rechargeGiftLimit: 500,
		bonusMergeMode: 1,
		minRechargeAmount: 300,
		couponValidDays: 10,
		amountofCode: 1,
		categoryIds: [101, 102, 103, 104],
		couponBusinessType: 4,
		agentListId: 0,
		authListId: 0,
		isFirstRechargeAvailable: false,
		userRechargeCouponSate: COUPON_STATE.UNRECEIVED,
		expireTime: null,
		lockOrderNumber: null
	},
	{
		userRechargeCouponId: 9102,
		couponId: 9102,
		couponNum: 'CP2026GIFT02',
		rechargeGiftRate: 0.2,
		rechargeGiftLimit: 1000,
		bonusMergeMode: 1,
		minRechargeAmount: 2000,
		couponValidDays: 5,
		amountofCode: 1,
		categoryIds: [102],
		couponBusinessType: 4,
		agentListId: 0,
		authListId: 0,
		isFirstRechargeAvailable: false,
		userRechargeCouponSate: COUPON_STATE.UNRECEIVED,
		expireTime: null,
		lockOrderNumber: null
	},
	{
		userRechargeCouponId: 9103,
		couponId: 9103,
		couponNum: 'CP2026GIFT03',
		rechargeGiftRate: 0.1,
		rechargeGiftLimit: 400,
		bonusMergeMode: 1,
		minRechargeAmount: 500,
		couponValidDays: 7,
		amountofCode: 1,
		categoryIds: [101, 104],
		couponBusinessType: 4,
		agentListId: 0,
		authListId: 0,
		isFirstRechargeAvailable: false,
		userRechargeCouponSate: COUPON_STATE.UNRECEIVED,
		expireTime: null,
		lockOrderNumber: null
	}
]

/**
 * 待领取券:场景 popup 为 'coupon-arrival' 且本会话尚未领取时,按 couponArrival.count 从候选池取前 N 张,其余情况为空。
 * 每次请求按当前场景现算,不存进会话数据,切换场景后无需重置即可生效。
 */
function pendingCoupons(ctx: MockContext): CouponRecord[] {
	if (ctx.scenario.popup !== 'coupon-arrival' || ctx.state.claimed[ARRIVAL_CLAIM_KEY]) return []
	return PENDING_POOL.slice(0, params<CouponArrivalParams>(ctx, 'couponArrival').count)
}

/** 代理邀请链接返利券目录,GetProxyUserInvitationCoupon/GetInvitationNoAuthCouponByNumber 共用同一份数据 */
const INVITATION_COUPONS: CouponTemplate[] = [
	{
		couponId: 9201,
		couponNum: 'INVT2026ABCD',
		rechargeGiftRate: 0.06,
		rechargeGiftLimit: 150,
		bonusMergeMode: 1,
		minRechargeAmount: 100,
		couponValidDays: 30,
		amountofCode: 1,
		categoryIds: [101, 103],
		couponBusinessType: 1,
		agentListId: 0,
		authListId: 0,
		isFirstRechargeAvailable: true
	},
	{
		couponId: 9202,
		couponNum: 'INVT2026EFGH',
		rechargeGiftRate: 0.03,
		rechargeGiftLimit: 0,
		bonusMergeMode: 1,
		minRechargeAmount: 0,
		couponValidDays: 0,
		amountofCode: 1,
		categoryIds: [104],
		couponBusinessType: 1,
		agentListId: 0,
		authListId: 0,
		isFirstRechargeAvailable: false
	}
]

/** 券功能的会话数据,首次访问时按参数生成已持有券种子,此后只由 ReceiveCoupon 修改 */
const couponFeature = (ctx: MockContext) =>
	featureState<CouponFeatureState>(ctx, 'coupon', () => ({ owned: buildOwnedSeed(params<CouponParams>(ctx, 'coupon')) }))

/** GetCurrentCoupon:指定状态返利券列表(couponStates 必填),按 userRechargeCouponSate 过滤会话已持有券后分页 */
const getCurrentCoupon: MockHandler = (ctx) => {
	const states = Array.isArray(ctx.body.couponStates) ? (ctx.body.couponStates as number[]) : []
	const list = couponFeature(ctx).owned.filter((c) => states.includes(c.userRechargeCouponSate))
	return ok(paged(list.map((c) => toUserCoupon(ctx, c)), ctx.body))
}

/** GetCurrentUnReceivedCoupon:未领取返利券(弹窗数据源/未领角标),见 pendingCoupons 的场景门槛 */
const getCurrentUnReceivedCoupon: MockHandler = (ctx) => ok(pendingCoupons(ctx).map((c) => toUserCoupon(ctx, c)))

/**
 * ReceiveCoupon:一键领取全部未领取返利券。
 *
 * @remarks 领取结果由 couponArrival.claimResult 决定;失败时不落领取键,弹窗下次仍会弹出。成功时按
 * couponValidDays 起算到期时间转入 owned——先移除已持有券里相同 userRechargeCouponId 的旧记录再写入,
 * 弹窗允许重复领取(重置数据只清 couponArrival 自己的领取键),避免同号券在券包里出现两张。
 */
const receiveCoupon: MockHandler = (ctx) => {
	const pending = pendingCoupons(ctx)
	if (pending.length === 0) return ok(0)

	const { claimResult } = params<CouponArrivalParams>(ctx, 'couponArrival')
	if (claimResult === 'fail')
		return fail(pick(ctx, '领取失败,请稍后重试', 'Failed to claim, please try again later', 'दावा करने में विफल, कृपया बाद में फिर कोशिश करें'))

	ctx.state.claimed[ARRIVAL_CLAIM_KEY] = true
	const now = dayjs()
	const feature = couponFeature(ctx)
	const claimedIds = new Set(pending.map((c) => c.userRechargeCouponId))
	feature.owned = [
		...pending.map((c) => ({
			...c,
			userRechargeCouponSate: COUPON_STATE.UNUSED,
			expireTime: c.couponValidDays > 0 ? now.add(c.couponValidDays, 'day').format('YYYY-MM-DD HH:mm:ss') : null
		})),
		...feature.owned.filter((c) => !claimedIds.has(c.userRechargeCouponId))
	]
	return ok(pending.length)
}

/** GetRechargeCategoryUsableCoupon:指定充值大类可用券,仅未使用且大类命中 payId 的券(payId 即 recharge.ts CHANNELS 的 payID) */
const getRechargeCategoryUsableCoupon: MockHandler = (ctx) => {
	const payId = Number(ctx.body.payId)
	const list = couponFeature(ctx).owned.filter(
		(c) => c.userRechargeCouponSate === COUPON_STATE.UNUSED && c.categoryIds.includes(payId)
	)
	return ok(list.map((c) => toUserCoupon(ctx, c)))
}

/** GetInvitationNoAuthCouponByNumber:按券码查券种信息(注册落地页,未登录可访问),查无此码返回 null */
const getInvitationNoAuthCouponByNumber: MockHandler = (ctx) => {
	const found = INVITATION_COUPONS.find((c) => c.couponNum === ctx.body.couponNum)
	return ok(found ? toCouponItem(ctx, found) : null)
}

/** GetProxyUserInvitationCoupon:代理可推广的邀请链接返利券,供生成带券码的邀请链接选券 */
const getProxyUserInvitationCoupon: MockHandler = (ctx) => ok(INVITATION_COUPONS.map((c) => toCouponItem(ctx, c)))

/** GetUserMaxGiftRate:用户当前最高可享赠送比率(充值按钮营销气泡),取未使用券里的最大值,无则 0 */
const getUserMaxGiftRate: MockHandler = (ctx) => {
	const owned = couponFeature(ctx).owned
	const rates = owned.filter((c) => c.userRechargeCouponSate === COUPON_STATE.UNUSED).map((c) => c.rechargeGiftRate)
	return ok(rates.length ? Math.max(...rates) : 0)
}

/** 充值优惠券与返利券的接口假数据 */
export const couponRoutes: MockRoutes = {
	[api.GetCurrentCoupon]: getCurrentCoupon,
	[api.GetCurrentUnReceivedCoupon]: getCurrentUnReceivedCoupon,
	[api.ReceiveCoupon]: receiveCoupon,
	[api.GetRechargeCategoryUsableCoupon]: getRechargeCategoryUsableCoupon,
	[api.GetInvitationNoAuthCouponByNumber]: getInvitationNoAuthCouponByNumber,
	[api.GetProxyUserInvitationCoupon]: getProxyUserInvitationCoupon,
	[api.GetUserMaxGiftRate]: getUserMaxGiftRate
}
