import dayjs from 'dayjs'
import api from '@/api/url'
import { ok } from '../envelope'
import { params } from '../scenario'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** 新会员礼包（Type 116/117）的活动参数，取值范围见 catalog.json */
interface MemberPackageParams {
	/** 首充负盈利页面状态（116）：apply 申请、none 无按钮、pending 申请中、approved 已返回、waiting 待申请、notStarted 活动未开始（按钮为申请）、rejected 已拒绝 */
	applyState: 'apply' | 'none' | 'pending' | 'approved' | 'waiting' | 'notStarted' | 'rejected'
	/** 未满足条件时是否自动发放 */
	autoDistribute: boolean
	/** 返利记录展示模式（117） */
	records: 'mixed' | 'claimable' | 'apply' | 'review' | 'empty'
}

/** applyState → firstDepositConfig.rewardState，见 MemberPackage/index.vue 的 textMap/states */
const REWARD_STATE: Record<MemberPackageParams['applyState'], number> = {
	none: 0,
	apply: 4,
	notStarted: 4,
	pending: 1,
	approved: 2,
	rejected: 3,
	waiting: 5,
}

/**
 * 活动详情里的三档“玩游戏送彩金”配置（对应 V1 新会员礼包配置的档位 1/2/3：注册满 N 天 + 累计存款 + 若干条“总有效投注 → 赠送彩金”）。
 * 档位数、每档阶梯数都不固定，前端按数组长度渲染。
 */
const GIFT_PACK_CONFIGS = [
	{
		registerDays: 3,
		grandTotalDeposit: 200,
		configAwardList: [
			{ totalValidBet: 1000, giveAwayBonus: 10 },
			{ totalValidBet: 5000, giveAwayBonus: 20 },
			{ totalValidBet: 20000, giveAwayBonus: 30 },
			{ totalValidBet: 50000, giveAwayBonus: 50 },
			{ totalValidBet: 80000, giveAwayBonus: 80 },
		],
	},
	{
		registerDays: 7,
		grandTotalDeposit: 1000,
		configAwardList: [
			{ totalValidBet: 5000, giveAwayBonus: 20 },
			{ totalValidBet: 20000, giveAwayBonus: 30 },
			{ totalValidBet: 50000, giveAwayBonus: 50 },
			{ totalValidBet: 100000, giveAwayBonus: 100 },
			{ totalValidBet: 200000, giveAwayBonus: 200 },
		],
	},
	{
		registerDays: 15,
		grandTotalDeposit: 2000,
		configAwardList: [
			{ totalValidBet: 1000, giveAwayBonus: 25 },
			{ totalValidBet: 50000, giveAwayBonus: 50 },
			{ totalValidBet: 100000, giveAwayBonus: 100 },
			{ totalValidBet: 200000, giveAwayBonus: 200 },
			{ totalValidBet: 500000, giveAwayBonus: 500 },
		],
	},
]

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

/** GetGiftPackUserRewardRecord：116 既有配置和 117 历史返利记录 */
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
	// “申请”点过后记入已申请键，页面变成“申请中”
	const applied = p.applyState === 'apply' && rewardStatus(ctx, 'memberPackage:apply', 'progress') === 'claimed'
	return ok({
		// firstDepositConfig 不能为 null：MemberPackage/index.vue 未判空直接读 rewardState
		firstDepositConfig: {
			activityStartDate: p.applyState === 'notStarted' ? '' : dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
			bonusLimit: 288,
			firstDeposiSendBonust: 5,
			firstDepositTimeLiness: '3',
			rewardState: applied ? REWARD_STATE.pending : REWARD_STATE[p.applyState],
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
