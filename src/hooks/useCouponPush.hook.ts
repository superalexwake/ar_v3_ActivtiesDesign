import { pushCouponArrivalDialog } from '@/components/DialogQueue/producers'
import { useCoupon } from '@/hooks/useCoupon.hook'
import type { UserTemplateNotifyData } from '@/stores'

// 人工发券按后台「发放方式」拆两模板：14 自动领取(券已入袋 State=1) / 15 弹窗领取(待领取 State=0)。
// 只收 15：14 的券已入袋，回查未领取接口必为空数组，交回默认分发落 B 系横幅+通知中心才是正确展示。
const TEMPLATE_MANUAL_COUPON_PENDING = 15

// 券数据不随推送下发（券有状态与时效，报文快照可能已被领取或过期），故到达后实时回源
const openCouponArrival = async () => {
	const coupons = await useCoupon().fetchUnclaimed()
	if (coupons.length) await pushCouponArrivalDialog(coupons)
}

/**
 * 人工发券推送的前置处理。
 *
 * @remarks
 * 返回 true 表示本条已被消费、调用方不得再走默认分发；返回 false 则原样交回 dispatchPush。
 * 内部为 fire-and-forget：回查失败已由 AwaitApiResult 收口提示，且用户下次进首页有 openAll 兜底。
 */
export function handleCouponPush(data: UserTemplateNotifyData): boolean {
	if (data.templateId !== TEMPLATE_MANUAL_COUPON_PENDING) return false
	void openCouponArrival()
	return true
}
