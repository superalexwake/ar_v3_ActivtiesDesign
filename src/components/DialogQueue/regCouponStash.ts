// =============================================================================
// 注册直发券暂存（模块级）单一定义点。
// 零依赖叶子模块：stores（register/loginout）与 useGlobalDialog 都从这里取，避免循环引用。
// =============================================================================

import type { RechargeCouponItem } from '@/types/api'

let pendingRegCoupons: RechargeCouponItem[] = []

// couponArrivalPipe 只校验数组长度不校验结构，字段缺失会渲染出信息残缺的券卡，故在入口拦掉
const isRenderable = (item: unknown): item is RechargeCouponItem => {
	const coupon = item as RechargeCouponItem | null
	return (
		!!coupon &&
		typeof coupon.rechargeGiftRate === 'number' &&
		typeof coupon.rechargeGiftLimit === 'number' &&
		typeof coupon.minRechargeAmount === 'number' &&
		typeof coupon.couponValidDays === 'number'
	)
}

/** 暂存注册响应直发的券；非数组或字段残缺一律归零，交由 openAll 回落查询。 */
export function stashRegCoupons(list: unknown) {
	pendingRegCoupons = Array.isArray(list) ? list.filter(isRenderable) : []
}

/** 取出并清空注册直发券；取后即清，保证只弹一次。 */
export function takeRegCoupons(): RechargeCouponItem[] {
	const list = pendingRegCoupons
	pendingRegCoupons = []
	return list
}

/** 登出时清理，防止换账号后弹到上一用户的券。 */
export function clearRegCoupons() {
	pendingRegCoupons = []
}
