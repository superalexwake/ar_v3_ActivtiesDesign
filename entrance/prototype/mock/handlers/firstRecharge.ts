import api from '@/api/url'
import { ok } from '../envelope'
import { params } from '../scenario'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockHandler, MockRoutes } from '../types'

/** 首充奖励（Type 14）的活动参数，取值范围见 catalog.json */
interface FirstRechargeParams {
	/** 活动是否开启 */
	enabled: boolean
	/** 首充金额档位；'0' 表示未首充 */
	deposit: '0' | '100' | '500' | '1000' | '5000'
	/** 已达档位是否已领取 */
	claimed: boolean
}

/**
 * 首充档位状态映射（rewardStatus() 结果 → canReceive/isFinshed，见 listItem.vue 的 getClass/getText）：
 * progress → 未达标（不可领取）；claimable → 可领取；claimed → 已领取；expired → 活动已过期。
 */
const TIER_FLAGS: Record<RewardItemStatus, { canReceive: boolean; isFinshed: boolean }> = {
	progress: { canReceive: false, isFinshed: false },
	claimable: { canReceive: true, isFinshed: false },
	claimed: { canReceive: true, isFinshed: true },
	expired: { canReceive: false, isFinshed: true },
}

interface TierConfig {
	id: number
	rechargeAmount: number
	rewardAmount: number
}

/** 4 档首充奖励，门槛与首充金额档位一一对应 */
const TIERS: TierConfig[] = [
	{ id: 1, rechargeAmount: 100, rewardAmount: 20 },
	{ id: 2, rechargeAmount: 500, rewardAmount: 88 },
	{ id: 3, rechargeAmount: 1000, rewardAmount: 188 },
	{ id: 4, rechargeAmount: 5000, rewardAmount: 888 },
]

/** GetFirstRechargeList：首充档位列表，返回数组（与 useActive.ts 的 getFirstRechargeList 一致，非分页结构）；活动关闭时返回空数组 */
const firstRechargeList: MockHandler = (ctx) => {
	const p = params<FirstRechargeParams>(ctx, 'firstRecharge')
	if (!p.enabled) return ok([])
	const deposit = Number(p.deposit)
	return ok(
		TIERS.map((tier) => {
			const reached = deposit >= tier.rechargeAmount
			const base: RewardItemStatus = !reached ? 'progress' : p.claimed ? 'claimed' : 'claimable'
			return {
				id: tier.id,
				rechargeAmount: tier.rechargeAmount,
				rewardAmount: tier.rewardAmount,
				...TIER_FLAGS[rewardStatus(ctx, `firstRecharge:${tier.id}`, base)],
			}
		})
	)
}

/** ReceiveFirstRechargeReward：领取首充奖励，读取 body.taskId */
const receiveFirstRechargeReward: MockHandler = (ctx) => {
	const tier = TIERS.find((item) => item.id === Number(ctx.body.taskId))
	if (!tier) return ok(null)
	return claim(ctx, `firstRecharge:${tier.id}`, tier.rewardAmount)
}

/** 首充奖励（Type 14）的接口假数据 */
export const firstRechargeRoutes: MockRoutes = {
	[api.GetFirstRechargeList]: firstRechargeList,
	[api.ReceiveFirstRechargeReward]: receiveFirstRechargeReward,
}
