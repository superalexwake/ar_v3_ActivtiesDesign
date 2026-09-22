import { post } from '@/api/axios'
import api from '@/api/url'
import type { RechargeCouponItem, UserCouponState, UserRechargeCouponItem } from '@/types/api'

/**
 * 指定状态的返利券列表（券包各 Tab）。couponStates 必填且至少 1 个元素，缺失会被模型校验拦成 code=7 且无 msgCode/data。
 * data 双形态：新版为分页对象、旧版为券数组——后端分支合入 master 前两种都可能收到，解包见 useCoupon.hook。
 * 不传 pageSize 时后端默认只回 20 条且不报错（静默截断）。
 */
export const GetCurrentCoupon = (params: {
	couponStates: UserCouponState[]
	pageNo?: number
	pageSize?: number
}): Promise<CommonObjRes<MessageData<UserRechargeCouponItem> | UserRechargeCouponItem[]>> => {
	return post(api.GetCurrentCoupon, params)
}

/** 当前用户未领取的返利券（弹窗数据源 / 未领角标） */
export const GetCurrentUnReceivedCoupon = (): Promise<CommonObjRes<UserRechargeCouponItem[]>> => {
	return post(api.GetCurrentUnReceivedCoupon)
}

/** 一键领取全部未领取返利券，data 为实际领取张数 */
export const ReceiveCoupon = (): Promise<CommonObjRes<number>> => {
	return post(api.ReceiveCoupon)
}

/** 指定充值大类下可用的返利券 */
export const GetRechargeCategoryUsableCoupon = (params: { payId: number }): Promise<CommonObjRes<UserRechargeCouponItem[]>> => {
	return post(api.GetRechargeCategoryUsableCoupon, params)
}

/** 按券码查券种信息（注册落地页展示），data 为 null 表示不展示 */
export const GetInvitationNoAuthCouponByNumber = (params: {
	couponNum: string
}): Promise<CommonObjRes<RechargeCouponItem | null>> => {
	return post(api.GetInvitationNoAuthCouponByNumber, params)
}

/** 代理可推广的邀请链接返利券（代理选券生成带 couponNum 的链接） */
export const GetProxyUserInvitationCoupon = (): Promise<CommonObjRes<RechargeCouponItem[]>> => {
	return post(api.GetProxyUserInvitationCoupon)
}

/** 用户最高可奖励比率，小数原值（0.12=12%）；0 表示无可享奖励 */
export const GetUserMaxGiftRate = (): Promise<CommonObjRes<number>> => {
	return post(api.GetUserMaxGiftRate)
}
