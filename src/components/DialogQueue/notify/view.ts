// B 系展示辅助：templateId/activityCode → 图标；receivedAt → 相对时间。两组件（横幅/通知中心）共用。
import coin from '@/assets/icons/notify/coin.png'
import gift from '@/assets/icons/notify/gift.png'
import bell from '@/assets/icons/notify/bell.png'
import wheel from '@/assets/icons/notify/wheel.png'
import { TemplateId, type NotifyItem } from '@/stores/modules/notifyWs'

const WHEEL_ACTIVITIES = new Set([119, 130]) // 大转盘 / 邀请转盘

/** 到账=金币、待领取(转盘类=转盘 / 其它=礼物)、默认=铃铛。后续可按 activityCode 细化。 */
export function iconFor(item: Pick<NotifyItem, 'templateId' | 'activityCode'>): string {
	if (item.templateId === TemplateId.RechargeArrived) return coin
	if (item.templateId === TemplateId.RewardPending) {
		return item.activityCode != null && WHEEL_ACTIVITIES.has(item.activityCode) ? wheel : gift
	}
	return bell
}

/** 相对时间：刚刚 / n 分钟前 / n 小时前 / n 天前。 */
export function relativeTime(
	ts: number,
	t: (key: string, named?: Record<string, unknown>) => string,
): string {
	const min = Math.floor(Math.max(0, Date.now() - ts) / 60000)
	if (min < 1) return t('notifyJustNow')
	if (min < 60) return t('notifyMinutesAgo', { n: min })
	const hr = Math.floor(min / 60)
	if (hr < 24) return t('notifyHoursAgo', { n: hr })
	return t('notifyDaysAgo', { n: Math.floor(hr / 24) })
}
