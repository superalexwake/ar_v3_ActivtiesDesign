import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockHandler, MockRoutes } from '../types'

/** vip 活动参数，声明见 catalog.json */
interface VipParams {
	/** 当前等级 */
	level: number
	/** 经验值 */
	exp: number
	/** 升级礼包（rewardType 1）状态，仅作用于当前等级 */
	upgradeReward: 'claimable' | 'claimed'
	/** 每月奖励（rewardType 2）状态，仅作用于当前等级 */
	monthlyReward: 'claimable' | 'claimed'
}

/**
 * GetListVipUserRewards 的 status 映射（MyWelfare.vue）：
 * - claimable → 1（按钮可点击领取）
 * - progress / claimed / expired → 2（按钮禁用，文案"已领取"）
 */
const STATUS_CODE: Record<RewardItemStatus, 1 | 2> = { progress: 2, claimable: 1, claimed: 2, expired: 2 }

/** GetVipUserLevelDetail：VIP1～VIP10 十级轮播卡片；小于当前等级为已达成，等于为当前，大于为未解锁 */
const levelDetailList: MockHandler = (ctx) => {
	const { level, exp } = params<VipParams>(ctx, 'vip')
	return ok(
		Array.from({ length: 10 }, (_, index) => {
			const id = index + 1
			return {
				id,
				vipName: 'VIP' + id,
				status: id <= level ? 2 : 1,
				upgradeStatus: id < level ? 2 : 1,
				upgrade: id * 1000,
				amount: id * 2000,
				currentExp: exp,
				relegationExp: id === level ? 3000 : 0,
				relegation: id === level ? 5000 : 0,
				deductExp: id === level ? 500 : 0,
			}
		})
	)
}

/** GetAllVipLevelList：VIP1～VIP10 分游戏类型返水比例（小数，页面用 accMul(rate,100) 转成百分比） */
const ALL_LEVEL_REBATE = Array.from({ length: 10 }, (_, index) => {
	const id = index + 1
	return {
		id,
		electronic: Number((id * 0.001).toFixed(4)),
		realPerson: Number((id * 0.0012).toFixed(4)),
		lottery: Number((id * 0.0015).toFixed(4)),
		chess: Number((id * 0.0008).toFixed(4)),
	}
})

/** VIP 操作日志基础数据，覆盖 RecordVsrule.vue 识别的 type 1～8；等级、天数等标识性 remark 保留原文，仅 type 4 的自然语言 remark 需要按语言现算 */
const VIP_LOG_BASE = [
	{ type: 1, remark: '', awardAmount: 200, bonusPoints: 1000, experience: 0, days: 1 },
	{ type: 2, remark: '', awardAmount: 100, bonusPoints: 500, experience: 0, days: 3 },
	{ type: 3, remark: '', awardAmount: 0, bonusPoints: 0, experience: 500, days: 5 },
	{ type: 4, remark: '', awardAmount: 0, bonusPoints: 0, experience: -200, days: 6 },
	{ type: 5, remark: 'VIP4', awardAmount: 0, bonusPoints: 0, experience: 0, days: 8 },
	{ type: 6, remark: '', awardAmount: 0, bonusPoints: 0, experience: 3000, days: 10 },
	{ type: 7, remark: '10', awardAmount: 0, bonusPoints: 0, experience: 0, days: 15 },
	{ type: 8, remark: '5', awardAmount: 0, bonusPoints: 0, experience: 0, days: 20 },
]

/** GetPageListVipUserRecord：VIP 操作日志分页；type 4（连续未登录降级）的 remark 是自然语言，按当前语言现算 */
const vipLog: MockHandler = (ctx) => {
	const list = VIP_LOG_BASE.map(({ days, type, remark, ...item }) => ({
		...item,
		type,
		remark: type === 4 ? pick(ctx, '连续 7 天未登录', 'Not logged in for 7 consecutive days', 'लगातार 7 दिनों से लॉगिन नहीं किया') : remark,
		createTime: dayjs().subtract(days, 'day').format('YYYY-MM-DD HH:mm:ss'),
	}))
	return ok(paged(list, ctx.body))
}

/** GetListVipLevel：某一等级的福利目录（升级礼包、每月奖励、多倍积分、尊享返水），随等级线性放大 */
const listVipLevel: MockHandler = (ctx) => {
	const level = Number(ctx.body.vipLevel) || 1
	return ok([
		{ id: 1, balance: level * 20, integral: level * 100 },
		{ id: 2, balance: level * 10, integral: level * 50 },
		{ id: 3, rate: Number((level * 0.5).toFixed(1)) },
		{ id: 5, rate: Number((level * 0.1).toFixed(2)) },
	])
}

/**
 * GetListVipUserRewards：某一等级下"我的福利"领取状态。
 *
 * @remarks 低于当前等级视为已领取，高于当前等级为未达成；当前等级的升级礼包（rewardType 1）、
 * 每月奖励（rewardType 2）状态由 catalog.json 的 upgradeReward、monthlyReward 决定，其余奖励类型固定为可领取。
 */
const listVipUserRewards: MockHandler = (ctx) => {
	const { level: current, upgradeReward, monthlyReward } = params<VipParams>(ctx, 'vip')
	const currentLevelReward: Partial<Record<number, RewardItemStatus>> = { 1: upgradeReward, 2: monthlyReward }
	const level = Number(ctx.body.vipLevel) || 1
	const rewardTypes = [1, 2, 3, 5] as const
	const list = rewardTypes.map((rewardType) => {
		const id = level * 10 + rewardType
		const base: RewardItemStatus = level < current ? 'claimed' : level > current ? 'progress' : (currentLevelReward[rewardType] ?? 'claimable')
		const status = STATUS_CODE[rewardStatus(ctx, 'vip:' + id + ':' + rewardType, base)]
		const isCash = rewardType <= 2
		return {
			id,
			rewardType,
			status,
			balance: isCash ? level * (rewardType === 1 ? 20 : 10) : 0,
			integral: isCash ? level * (rewardType === 1 ? 100 : 50) : 0,
			rate: isCash ? 0 : Number((level * (rewardType === 3 ? 0.5 : 0.1)).toFixed(2)),
		}
	})
	return ok(list)
}

/** AddReceiveAward：按 receiveId+rewardType 领取，键为 vip:<receiveId>:<rewardType> */
const addReceiveAward: MockHandler = (ctx) => {
	const receiveId = Number(ctx.body.receiveId)
	const rewardType = Number(ctx.body.rewardType)
	const vipLevel = Number(ctx.body.vipLevel)
	const balance = rewardType === 1 ? vipLevel * 20 : vipLevel * 10
	const integral = rewardType === 1 ? vipLevel * 100 : vipLevel * 50
	const result = claim(ctx, 'vip:' + receiveId + ':' + rewardType, balance)
	if (result.code !== 0) return result
	return ok({ integral, balance })
}

/** VIP 升级礼包与每月奖励（Type 29/30）的接口假数据 */
export const vipRoutes: MockRoutes = {
	[api.GetListVipUserRewards]: listVipUserRewards,
	[api.AddReceiveAward]: addReceiveAward,
	[api.GetListVipLevel]: listVipLevel,
	[api.GetVipUserLevelDetail]: levelDetailList,
	[api.GetAllVipLevelList]: () => ok(ALL_LEVEL_REBATE),
	[api.GetPageListVipUserRecord]: vipLog,
}
