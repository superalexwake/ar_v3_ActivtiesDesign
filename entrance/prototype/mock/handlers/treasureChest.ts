import api from '@/api/url'
import { fail, ok } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim } from '../state'
import type { MockHandler, MockRoutes } from '../types'

/** treasureChest 活动参数(catalog.json `activities.treasureChest.params`) */
interface TreasureChestParams {
	/** 宝箱个数(1~3) */
	count: number
	/** 任务名 */
	task: 'signIn' | 'recharge' | 'bet'
	/** 金额是否按区间展示(标题显示 ₹1~₹100,开出金额仍取 amount) */
	range: boolean
	/** 开出金额 */
	amount: number
	/** 开箱结果 */
	openResult: 'ok' | 'fail'
}

/** 任务名文案,对应 taskTitle */
const TASK_LABELS: Record<TreasureChestParams['task'], readonly [string, string, string]> = {
	signIn: ['签到', 'Check-in', 'चेक-इन'],
	recharge: ['充值', 'Recharge', 'रिचार्ज'],
	bet: ['投注', 'Bet', 'सट्टा'],
}

/** OpenTreasureChest 参数里的任务类型,与 taskTitle 的任务名概念无关,固定为签到类任务 */
const CHEST_TASK_TYPE = 1
/** 宝箱候选 rewardConfigId 池,按 count 从头截取,确保多个宝箱互不相同 */
const REWARD_CONFIG_IDS = [8001, 8002, 8003]
/** 区间展示时的固定金额区间(₹) */
const RANGE_MIN_AMOUNT = 1
const RANGE_MAX_AMOUNT = 100

const claimKeyOf = (rewardConfigId: number) => `treasureChest:${rewardConfigId}`

/**
 * GetTreasureChestPopupItems：宝箱弹窗数据源（见 producers.ts 的 pushTreasureChestDialogs）。
 *
 * @remarks 场景 `popup` 为 `treasure-chest` 时,按 count 参数返回若干个尚未领取的待开宝箱(rewardConfigId
 * 各不相同),字段对应 `TreasureChestQueueDialog.vue` 的 `TreasureChestDialogChest`；其余情况返回空数组。
 */
const getTreasureChestPopupItems: MockHandler = (ctx) => {
	if (ctx.scenario.popup !== 'treasure-chest') return ok([])
	const p = params<TreasureChestParams>(ctx, 'treasureChest')
	const [zh, en, hd] = TASK_LABELS[p.task]
	const taskTitle = pick(ctx, zh, en, hd)
	const pendingIds = REWARD_CONFIG_IDS.slice(0, p.count).filter((id) => !ctx.state.claimed[claimKeyOf(id)])
	return ok(
		pendingIds.map((rewardConfigId) => ({
			rewardConfigId,
			taskType: CHEST_TASK_TYPE,
			taskTitle,
			...(p.range ? { minRewardAmount: RANGE_MIN_AMOUNT, maxRewardAmount: RANGE_MAX_AMOUNT } : { rewardAmount: p.amount }),
			isShow: 1,
		}))
	)
}

/**
 * OpenTreasureChest：开箱领奖。
 *
 * @remarks openResult 为 fail 时直接返回失败信封(弹窗关闭并提示)；否则按请求携带的 rewardConfigId 走
 * 统一 claim()，重复开箱同一个宝箱同样返回失败信封。
 */
const openTreasureChest: MockHandler = (ctx) => {
	const p = params<TreasureChestParams>(ctx, 'treasureChest')
	if (p.openResult === 'fail')
		return fail(pick(ctx, '开箱失败,请稍后重试', 'Failed to open, please try again later', 'खोलने में विफल, कृपया बाद में फिर कोशिश करें'))
	const rewardConfigId = Number(ctx.body.rewardConfigId)
	return claim(ctx, claimKeyOf(rewardConfigId), p.amount)
}

/** 宝箱的接口假数据 */
export const treasureChestRoutes: MockRoutes = {
	[api.GetTreasureChestPopupItems]: getTreasureChestPopupItems,
	[api.OpenTreasureChest]: openTreasureChest,
}
