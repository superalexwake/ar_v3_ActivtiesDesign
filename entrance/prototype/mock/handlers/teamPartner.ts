import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged } from '../envelope'
import { params } from '../scenario'
import type { MockHandler, MockRoutes } from '../types'

/** 合伙人奖励活动参数，声明见 catalog.json */
interface TeamPartnerParams {
	/** 邀请人数 */
	invited: number
	/** 累计奖金 */
	totalAmount: number
	/** 返佣档位：首存/二存/三存、仅首存、无流水条件 */
	tiers: 'three' | 'first' | 'noBet'
	/** 邀请明细：8 条三种状态 / 无 */
	detail: 'mixed' | 'empty'
}

/** 3 档存款返佣规则，type 1/2/3 对应首存/二存/三存，字段对应 useAgent.hook.ts 的 firstItem/secondItem/thirdItem */
const REWARD_ITEMS = [
	{ type: 1, rechargeAmount: 100, betAmount: 500, rewardAmount: 20 },
	{ type: 1, rechargeAmount: 500, betAmount: 2500, rewardAmount: 100 },
	{ type: 1, rechargeAmount: 1000, betAmount: 5000, rewardAmount: 200 },
	{ type: 2, rechargeAmount: 100, betAmount: 500, rewardAmount: 15 },
	{ type: 2, rechargeAmount: 500, betAmount: 2500, rewardAmount: 80 },
	{ type: 2, rechargeAmount: 1000, betAmount: 5000, rewardAmount: 160 },
	{ type: 3, rechargeAmount: 100, betAmount: 500, rewardAmount: 10 },
	{ type: 3, rechargeAmount: 500, betAmount: 2500, rewardAmount: 60 },
	{ type: 3, rechargeAmount: 1000, betAmount: 5000, rewardAmount: 120 },
]

/**
 * 按返佣档位裁剪存款返佣规则。
 *
 * @param tiers - 仅首存时只保留 type 1 档；无流水条件时把 betAmount 置为 -1（页面按 ≥0 判断是否显示流水条件）。
 */
function rewardItemsOf(tiers: TeamPartnerParams['tiers']) {
	const items = tiers === 'first' ? REWARD_ITEMS.filter((item) => item.type === 1) : REWARD_ITEMS
	return tiers === 'noBet' ? items.map((item) => ({ ...item, betAmount: -1 })) : items
}

/** 邀请明细 8 条，字段对应 Invitation/index.vue 实际读取（该文件顶部导入的 MyEmerdListData 类型是无关误引用，不作为字段依据）；
 * status：0/1 进行中（展示 turnover 流水），2 已获得奖励，3 奖励已过期 */
const DETAIL_LIST = [
	{ nickName: '玩家8821', userId: 300021, days: 1, firstAmount: 100, secondAmount: -1, thirdAmount: -1, status: 0, turnover: 320 },
	{ nickName: '玩家4432', userId: 300020, days: 2, firstAmount: 500, secondAmount: 100, thirdAmount: -1, status: 0, turnover: 1800 },
	{ nickName: '玩家1209', userId: 300019, days: 3, firstAmount: 100, secondAmount: -1, thirdAmount: -1, status: 2, turnover: 0 },
	{ nickName: '玩家6650', userId: 300018, days: 4, firstAmount: 1000, secondAmount: 500, thirdAmount: 100, status: 2, turnover: 0 },
	{ nickName: '玩家3387', userId: 300017, days: 6, firstAmount: 100, secondAmount: -1, thirdAmount: -1, status: 3, turnover: 0 },
	{ nickName: '玩家9924', userId: 300016, days: 8, firstAmount: 500, secondAmount: -1, thirdAmount: -1, status: 0, turnover: 900 },
	{ nickName: '玩家2761', userId: 300015, days: 10, firstAmount: 1000, secondAmount: 500, thirdAmount: -1, status: 2, turnover: 0 },
	{ nickName: '玩家5598', userId: 300014, days: 15, firstAmount: 100, secondAmount: -1, thirdAmount: -1, status: 0, turnover: 260 },
].map(({ days, ...item }) => ({ ...item, registerTime: dayjs().subtract(days, 'day').format('YYYY-MM-DD HH:mm:ss') }))

/** GetPartnerRewards：合伙人概况，整体赋给 useAgent.hook.ts 的 store.config */
const partnerRewards: MockHandler = (ctx) => {
	const { invited, totalAmount, tiers } = params<TeamPartnerParams>(ctx, 'teamPartner')
	return ok({
		configAmount: 6800,
		effectiveQuantity: Math.round(invited * 0.77),
		invitationCode: '888888',
		numberOfInvitations: invited,
		totalAmount,
		days: 7,
		items: rewardItemsOf(tiers),
	})
}

/** 合伙人奖励（Type 122）的接口假数据 */
export const teamPartnerRoutes: MockRoutes = {
	[api.GetPartnerRewards]: partnerRewards,
	[api.GetPartnerRewardsDeatilList]: (ctx) => {
		const { detail } = params<TeamPartnerParams>(ctx, 'teamPartner')
		return ok(paged(detail === 'empty' ? [] : DETAIL_LIST, ctx.body))
	},
	[api.GetUrlAddress]: () => ok({ url: 'https://prototype.invalid/#/register?r_code=888888' }),
}
