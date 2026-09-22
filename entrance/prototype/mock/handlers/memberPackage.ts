import dayjs from 'dayjs'
import api from '@/api/url'
import { ok } from '../envelope'
import { params } from '../scenario'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** 新会员礼包（Type 116/117）的活动参数，取值范围见 catalog.json */
interface MemberPackageParams {
	/** 首充负盈利申请状态（116） */
	applyState: 'none' | 'apply' | 'pending' | 'approved' | 'rejected'
	/** 未满足条件时是否自动发放 */
	autoDistribute: boolean
	/** 返利记录展示模式（117） */
	records: 'mixed' | 'claimable' | 'apply' | 'review' | 'empty'
	/** 活动是否已开始 */
	started: boolean
}

/** applyState → firstDepositConfig.rewardState，见 MemberPackage/index.vue 的 textMap/states */
const REWARD_STATE: Record<MemberPackageParams['applyState'], number> = {
	none: 0,
	apply: 4,
	pending: 1,
	approved: 2,
	rejected: 3,
}

interface RecordConfig {
	id: number
	registerDays: number
	actualGrandTotalDeposit: number
	actualTotalValidBet: number
	giveAwayBonus: number
}

/** 注册第 1、2、3 天的返利记录基础数据，状态按 records 参数生成 */
const RECORDS: RecordConfig[] = [
	{ id: 1, registerDays: 1, actualGrandTotalDeposit: 100, actualTotalValidBet: 200, giveAwayBonus: 50 },
	{ id: 2, registerDays: 2, actualGrandTotalDeposit: 300, actualTotalValidBet: 600, giveAwayBonus: 80 },
	{ id: 3, registerDays: 3, actualGrandTotalDeposit: 0, actualTotalValidBet: 0, giveAwayBonus: 120 },
]

/** mixed 场景下三条记录的基础状态：已领取、待领取、未达标各一条 */
const MIXED_BASE: RewardItemStatus[] = ['claimed', 'claimable', 'progress']

/**
 * 已领取/待领取/未达标的状态映射（rewardStatus() 结果 → state/operateState，见 MemberPackage/index.vue 的 states）：
 * progress → 0/0（未达标，禁用态“待申请”）；claimable → 3/2（待领取）；claimed/expired → 4/2（已领取）。
 */
const RECORD_STATE: Record<RewardItemStatus, { state: number; operateState: number }> = {
	progress: { state: 0, operateState: 0 },
	claimable: { state: 3, operateState: 2 },
	claimed: { state: 4, operateState: 2 },
	expired: { state: 4, operateState: 2 },
}

/** 审核中（state 1）、已驳回（state 2）轮流展示，见 states[1]/states[2] */
const REVIEW_STATES = [
	{ state: 1, operateState: 2 },
	{ state: 2, operateState: 2 },
]

/**
 * 按 records 参数生成一条返利记录的状态。
 *
 * @remarks 只有 mixed、claimable 两种场景经 rewardStatus() 记录真实领取，apply、review 为静态展示态。
 */
function recordState(ctx: MockContext, mode: Exclude<MemberPackageParams['records'], 'empty'>, id: number, index: number) {
	if (mode === 'apply') return { state: 0, operateState: 2 }
	if (mode === 'review') return REVIEW_STATES[index % REVIEW_STATES.length]
	const base = mode === 'claimable' ? 'claimable' : MIXED_BASE[index]
	return RECORD_STATE[rewardStatus(ctx, `memberPackage:${id}`, base)]
}

/** 礼包规则表 3 档，供 MemberPackage/Rules 页的 RulesTable 展示 */
const GIFT_PACK_CONFIGS = [
	{ registerDays: 1, grandTotalDeposit: 100, configAwardList: [{ totalValidBet: 200, giveAwayBonus: 20 }] },
	{ registerDays: 2, grandTotalDeposit: 300, configAwardList: [{ totalValidBet: 500, giveAwayBonus: 50 }] },
	{ registerDays: 3, grandTotalDeposit: 500, configAwardList: [{ totalValidBet: 1000, giveAwayBonus: 100 }] },
]

/** GetGiftPackUserRewardRecord：首存配置 + 礼包规则 + 返利记录 */
const giftPackUserRewardRecord: MockHandler = (ctx) => {
	const p = params<MemberPackageParams>(ctx, 'memberPackage')
	const mode = p.records
	const records =
		mode === 'empty'
			? []
			: RECORDS.map((record, index) => ({
					id: record.id,
					registerDays: record.registerDays,
					actualGrandTotalDeposit: record.actualGrandTotalDeposit,
					actualTotalValidBet: record.actualTotalValidBet,
					giveAwayBonus: record.giveAwayBonus,
					...recordState(ctx, mode, record.id, index),
				}))
	return ok({
		// firstDepositConfig 不能为 null：MemberPackage/index.vue:81 未判空直接读 rewardState
		firstDepositConfig: {
			activityStartDate: p.started ? dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss') : '',
			bonusLimit: 500,
			firstDeposiSendBonust: 100,
			firstDepositTimeLiness: '3',
			rewardState: REWARD_STATE[p.applyState],
			isAutomaticDistribution: p.autoDistribute,
		},
		giftPackConfigAwardList: GIFT_PACK_CONFIGS,
		newUserRewardRecordList: records,
	})
}

/** ApplyReceiveGiftPackUserReward：optType 2 领取金额（读取 body.orderId）；optType 1 仅提交申请，不发放金额 */
const applyReceiveGiftPackUserReward: MockHandler = (ctx) => {
	if (Number(ctx.body.optType) !== 2) return ok(null)
	const record = RECORDS.find((item) => item.id === Number(ctx.body.orderId))
	if (!record) return ok(null)
	return claim(ctx, `memberPackage:${record.id}`, record.giveAwayBonus)
}

/** ApplyFirstCharge：申请首充负盈利礼包，记一个不发钱的已申请键 */
const applyFirstCharge: MockHandler = (ctx) => claim(ctx, 'memberPackage:apply', 0)

/** 新会员礼包（Type 116/117）的接口假数据 */
export const memberPackageRoutes: MockRoutes = {
	[api.GetGiftPackUserRewardRecord]: giftPackUserRewardRecord,
	[api.ApplyReceiveGiftPackUserReward]: applyReceiveGiftPackUserReward,
	[api.ApplyFirstCharge]: applyFirstCharge,
}
