import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, fail, paged } from '../envelope'
import { claim, rewardStatus } from '../state'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { RewardItemStatus } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'
import { slotName } from './home'

/** 电子大奖（jackpot）活动参数 */
interface JackpotParams {
	/** 中奖记录组合 */
	records: 'mixed' | 'unclaimed' | 'claimed' | 'empty'
	/** 奖励有效期（天）：未领记录的到期时间 = 中奖时间 + 该天数 */
	validDays: number
}

/**
 * isReceive 状态码映射（SuperJackpot/index.vue）：
 * - claimable → 0（可领取）
 * - claimed → 1（已领取）
 * - expired → 2（已过期）
 */
const STATUS_CODE: Record<RewardItemStatus, number> = { progress: 0, claimable: 0, claimed: 1, expired: 2 }

/** 电子大奖中奖记录基础数据；game 是电子游戏编号（名称按语言现算）或彩种名 Win Go（三语通用） */
const RECORDS = [
	{ orderId: 8001, orderNo: 202609210001, game: 101, multiple: 100, bonusAmount: 20, base: 'claimable' as const, days: 0 },
	{ orderId: 8002, orderNo: 202609210002, game: 103, multiple: 500, bonusAmount: 100, base: 'claimable' as const, days: 1 },
	{ orderId: 8003, orderNo: 202609190003, game: 102, multiple: 1000, bonusAmount: 500, base: 'claimed' as const, days: 2 },
	{ orderId: 8004, orderNo: 202609180004, game: 104, multiple: 100, bonusAmount: 20, base: 'claimed' as const, days: 3 },
	{ orderId: 8005, orderNo: 202609160005, game: 'Win Go', multiple: 500, bonusAmount: 100, base: 'expired' as const, days: 5 },
]

/** 首页滚动榜的游戏：电子游戏编号或彩种名 */
const STAR_GAMES: (number | string)[] = [101, 103, 102, 104, 'Win Go']

/** 游戏编号按当前语言换成名称；彩种名原样返回 */
const gameNameOf = (ctx: MockContext, game: number | string) => (typeof game === 'number' ? slotName(ctx, game) : game)

/** “玩家 + 编号”昵称：编号是非文案字段，前缀随语言切换 */
const starName = (ctx: MockContext, id: number) => pick(ctx, `玩家${id}`, `Player ${id}`, `खिलाड़ी ${id}`)

/** 首页滚动榜：与个人领取状态无关的虚构中奖记录 10 条，按请求语言现算昵称 */
function starRecords(ctx: MockContext) {
	return Array.from({ length: 10 }, (_, index) => ({
		userPhoto: '',
		userName: starName(ctx, 1000 + index * 37),
		gameName: gameNameOf(ctx, STAR_GAMES[index % 5]),
		multiple: [100, 500, 1000][index % 3],
		bonusAmount: [20, 100, 500][index % 3],
		createTime: dayjs()
			.subtract(index * 3, 'hour')
			.format('YYYY-MM-DD HH:mm:ss'),
	}))
}

/** 按 records 参数取记录的基础状态：mixed 用各自默认状态，unclaimed/claimed 统一取该状态、不再有过期项 */
function baseStatusOf(records: JackpotParams['records'], defaultBase: RewardItemStatus): RewardItemStatus {
	switch (records) {
		case 'unclaimed':
			return 'claimable'
		case 'claimed':
			return 'claimed'
		default:
			return defaultBase
	}
}

/** GetGrandAwardConfigList：倍数档位 ×100、×500、×1000 对应的奖励规则 */
const ruleList: MockHandler = () =>
	ok([
		{ multipleName: '100-499', betAmountName: '10-50', awardAmount: 20 },
		{ multipleName: '500-999', betAmountName: '10-50', awardAmount: 100 },
		{ multipleName: '1000-9999', betAmountName: '10-50', awardAmount: 500 },
	])

/** GetGrandAwardPageList：个人中奖记录；按 records 参数决定记录组合，未领记录的到期时间 = 中奖时间 + validDays 天 */
const rewardsRecordPageList: MockHandler = (ctx) => {
	const { records, validDays } = params<JackpotParams>(ctx, 'jackpot')
	if (records === 'empty') return ok(paged([], ctx.body))
	const list = RECORDS.map((item) => {
		const status = rewardStatus(ctx, 'jackpot:' + item.orderId, baseStatusOf(records, item.base))
		const createTime = dayjs().subtract(item.days, 'day')
		return {
			orderId: item.orderId,
			orderNo: item.orderNo,
			gameName: gameNameOf(ctx, item.game),
			multiple: item.multiple,
			bonusAmount: item.bonusAmount,
			imgUrl: '',
			createTime: createTime.format('YYYY-MM-DD HH:mm:ss'),
			expirationFormatTime: status === 'claimable' ? createTime.add(validDays, 'day').format('YYYY-MM-DD HH:mm:ss') : '',
			isReceive: STATUS_CODE[status],
		}
	})
	return ok(paged(list, ctx.body))
}

/** ReceiveGrandAward：按 orderId 领取单条 */
const receiveOne: MockHandler = (ctx) => {
	const orderId = Number(ctx.body.orderId)
	const record = RECORDS.find((item) => item.orderId === orderId)
	if (!record) return fail(pick(ctx, '记录不存在', 'Record not found', 'रिकॉर्ड नहीं मिला'))
	return claim(ctx, 'jackpot:' + orderId, record.bonusAmount)
}

/** ReceiveAllGrandAward：逐条领取所有未领取记录，全部已领取时失败 */
const receiveAll: MockHandler = (ctx) => {
	const { records } = params<JackpotParams>(ctx, 'jackpot')
	const pending = RECORDS.filter((item) => rewardStatus(ctx, 'jackpot:' + item.orderId, baseStatusOf(records, item.base)) === 'claimable')
	if (!pending.length) return fail(pick(ctx, '暂无可领取奖励', 'No rewards available to claim', 'दावा करने के लिए कोई इनाम उपलब्ध नहीं है'))
	let totalReceiveAmount = 0
	pending.forEach((item) => {
		claim(ctx, 'jackpot:' + item.orderId, item.bonusAmount)
		totalReceiveAmount = Number((totalReceiveAmount + item.bonusAmount).toFixed(2))
	})
	return ok({ orderCount: pending.length, totalReceiveAmount })
}

/** 电子大奖（Type 103）的接口假数据 */
export const jackpotRoutes: MockRoutes = {
	[api.GetReWordConfigList]: ruleList,
	[api.GetThirdGameRewardsRecordPageList]: rewardsRecordPageList,
	[api.GetThirdGameAwardRecordPageList]: (ctx) => ok(paged(starRecords(ctx), ctx.body)),
	[api.ReceiveAllGrandAward]: receiveAll,
	[api.ThirdGameReceiveGrandPrizeReward]: receiveOne,
}
