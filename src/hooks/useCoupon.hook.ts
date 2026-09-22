import {
	GetCurrentCoupon,
	GetCurrentUnReceivedCoupon,
	GetInvitationNoAuthCouponByNumber,
	GetRechargeCategoryUsableCoupon,
	ReceiveCoupon,
	GetProxyUserInvitationCoupon,
	GetUserMaxGiftRate
} from '@/api'
import type { RechargeCouponItem, UserCouponState, UserRechargeCouponItem } from '@/types/api'
import { AwaitApiResult } from '@/utils'

/** 用户券状态值收口，避免页面内联数字（对齐真契约 couponState） */
// 带券充值下单开关：下单时是否把选中券的 UserRechargeCouponId 传给后端（会锁券）。
// 带券下单恒开：dev + 生产都把选中券 UserRechargeCouponId 传后端。⚠️前提=后端核销任务已上线，否则券会锁死无赠金(对接文档§9-1)。
// 注意：优惠券彩金的「展示 + 算进实际上分」是前端预估（同 bonus/VIP 口径），不受此开关控制。
export const COUPON_RECHARGE_ORDER_ENABLED = true

export const USER_COUPON_STATE = {
	UNRECEIVED: 0,
	UNUSED: 1,
	LOCKED: 2,
	USED: 3,
	EXPIRED: 4
} as const

/** U 类充值大类 payId（契约 PayCategoryEnum）：11 USDT / 17 USDT法币 / 19 本地USDT。TRX(16) 非 USDT，不计入 */
export const USDT_PAY_CATEGORIES = [11, 17, 19]
/** UPI 充值大类 payId：12 UPI / 26 AR UPI（依 useRecharge 的 isUpi/isArUpiPay 口径，待后端契约枚举复核） */
export const UPI_PAY_CATEGORIES = [12, 26]

/** 券适用大类 payId 列表（元素双形态归一：新契约 {id,name} 对象与旧接口裸 payId 数字并存期，畸形元素滤除） */
export const categoryIdsOf = (c: UserRechargeCouponItem): number[] =>
	(Array.isArray(c.rechargeCategorys) ? c.rechargeCategorys : [])
		.map((cat) => (typeof cat === 'number' ? cat : cat?.id))
		.filter((id): id is number => Number.isFinite(id))

// 无专用字段，由适用大类推导：全部落在目标大类才算专享。空数组=未配大类，不成立
// 元素双形态兼容：新契约 {id,name} 对象（GetCurrentCoupon 已切）与旧接口裸 payId 数字并存期
const isCategoryOnly = (c: UserRechargeCouponItem, ids: number[]) =>
	Array.isArray(c.rechargeCategorys) &&
	c.rechargeCategorys.length > 0 &&
	c.rechargeCategorys.every((cat) => ids.includes(typeof cat === 'number' ? cat : cat?.id))

/** 券是否 USDT 大类专享 */
export const isUsdtOnly = (c: UserRechargeCouponItem) => isCategoryOnly(c, USDT_PAY_CATEGORIES)
/** 券是否 UPI 大类专享 */
export const isUpiOnly = (c: UserRechargeCouponItem) => isCategoryOnly(c, UPI_PAY_CATEGORIES)

/**
 * 券本单预估彩金：未达门槛为 0；金额 × 赠送比率后按赠送上限封顶（上限 0=不限）。
 *
 * @remarks 前端展示性试算，与 bonus/VIP 同口径，真实结算以后端核销为准（BonusMergeMode 互斥尚未参与）。
 * `amount` 须为法币口径（U 类通道已按汇率换算），与后端门槛同口径。
 */
export const estimateCouponBonus = (c: UserRechargeCouponItem, amount: number): number => {
	if (c.minRechargeAmount > 0 && amount < c.minRechargeAmount) return 0
	const raw = amount * (Number(c.rechargeGiftRate) || 0)
	return c.rechargeGiftLimit > 0 ? Math.min(raw, Number(c.rechargeGiftLimit)) : raw
}

/**
 * 券数据的唯一入口。组件只认本 hook，不直接 import @/api。
 * AwaitApiResult 失败时内部已弹提示并返回 null，调用方只需判空。
 */
export function useCoupon() {
	/** 未领取券（弹窗数据源 / 未领角标）。失败或无券一律返回 []。 */
	const fetchUnclaimed = async (): Promise<UserRechargeCouponItem[]> => {
		const res = await AwaitApiResult(GetCurrentUnReceivedCoupon())
		return Array.isArray(res?.data) ? res.data : []
	}

	/** 一键领取全部未领取券，返回实际领取张数（0 = 无券可领 / 失败）。 */
	const claim = async (): Promise<number> => {
		const res = await AwaitApiResult(ReceiveCoupon())
		return Number(res?.data) || 0
	}

	/**
	 * 券包分页数据源，交给 List.vue 驱动滚动加载。
	 * 必须返回原始 promise —— List 内部自行调 AwaitApiResult，此处若先 await 会切断它的错误链。
	 * 后端 data 双形态：新版分页对象原样透传，旧版数组归一为单页，保证 List 读到的 list/pageNo/totalPage 恒存在。
	 */
	const fetchCouponPage = (params: {
		couponStates: UserCouponState[]
		pageNo?: number
		pageSize?: number
	}): Promise<CommonObjRes<MessageData<UserRechargeCouponItem>>> =>
		GetCurrentCoupon(params).then((res) => {
			const data = res?.data
			return (
				Array.isArray(data) ? { ...res, data: { list: data, pageNo: 1, totalPage: 1, totalCount: data.length } } : res
			) as CommonObjRes<MessageData<UserRechargeCouponItem>>
		})

	/** 指定充值大类可用券（充值页展示）。失败返回 []。 */
	const fetchCategoryUsable = async (payId: number): Promise<UserRechargeCouponItem[]> => {
		const res = await AwaitApiResult(GetRechargeCategoryUsableCoupon({ payId }))
		return Array.isArray(res?.data) ? res.data : []
	}

	// 落地页访客未登录，401/失败静默返回 null，不打扰注册流程（后端放开 AllowAnonymous 后即正常展示）
	const fetchCouponByNumber = async (couponNum: string): Promise<RechargeCouponItem | null> => {
		try {
			const res = await GetInvitationNoAuthCouponByNumber({ couponNum })
			return res?.data ?? null
		} catch {
			return null
		}
	}

	/** 代理可推广的邀请链接返利券（推广页选券）。失败返回 []。 */
	const fetchProxyInvitation = async (): Promise<RechargeCouponItem[]> => {
		const res = await AwaitApiResult(GetProxyUserInvitationCoupon())
		return Array.isArray(res?.data) ? res.data : []
	}

	// 气泡是被动营销装饰，失败不该弹提示打扰用户，故绕开 AwaitApiResult 静默兜 0（同 fetchCouponByNumber 口径）
	const fetchMaxGiftRate = async (): Promise<number> => {
		try {
			const res = await GetUserMaxGiftRate()
			return Number(res?.data) || 0
		} catch {
			return 0
		}
	}

	return {
		fetchUnclaimed,
		claim,
		fetchCouponPage,
		fetchCategoryUsable,
		fetchCouponByNumber,
		fetchProxyInvitation,
		fetchMaxGiftRate
	}
}
