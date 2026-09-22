import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok } from '../envelope'
import { claim, featureState } from '../state'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockEnvelope, MockHandler, MockRoutes } from '../types'

/** days[].status 契约:1 已领 / 2 已过作废 / 3 今日可领 / 4 未到,与 HoldingCard.vue 的常量对齐 */
const DAY_TAKEN = 1
const DAY_MISSED = 2
const DAY_TODAY = 3
const DAY_LOCKED = 4

/** cardState 契约:1 持卡中 / 2 已完成 / 3 已过期 */
const CARD_HOLDING = 1
const CARD_FINISHED = 2
const CARD_EXPIRED = 3

/** 档位配置;soldOut/todaySoldOut 不在这里,由 stock 参数在输出时派生 */
interface Tier {
	tierId: number
	sellPrice: number
	originalPrice: number
	realtimeRewardAmount: number
	dailyRewardAmount: number
}

/** 周卡 7 天;3 档覆盖正常购买、今日售罄、永久已售罄三种展示,具体哪档售罄由 stock 参数决定 */
const WEEK_TOTAL_DAYS = 7
const WEEK_TIERS: Tier[] = [
	{ tierId: 1, sellPrice: 342, originalPrice: 393, realtimeRewardAmount: 300, dailyRewardAmount: 11 },
	{ tierId: 2, sellPrice: 1140, originalPrice: 1311, realtimeRewardAmount: 1000, dailyRewardAmount: 35 },
	{ tierId: 3, sellPrice: 3462, originalPrice: 3981, realtimeRewardAmount: 3000, dailyRewardAmount: 112 },
]

/** 月卡 30 天;3 档均按 stock 正常展示,mixed 的售罄演示只发生在周卡
 *  tierId 13(至尊档)按前两档的涨幅比例(约 3 倍售价、原价/售价恒 1.15)外推,设计稿这一档截图数值命中了
 *  边界值测试场景(返现 ¥9,999,999.99、原价反而低于售价),不能直接抄,故按已有两档的规律补齐 */
const MONTH_TOTAL_DAYS = 30
const MONTH_TIERS: Tier[] = [
	{ tierId: 11, sellPrice: 999, originalPrice: 1149, realtimeRewardAmount: 200, dailyRewardAmount: 30 },
	{ tierId: 12, sellPrice: 2999, originalPrice: 3449, realtimeRewardAmount: 800, dailyRewardAmount: 80 },
	{ tierId: 13, sellPrice: 8999, originalPrice: 10349, realtimeRewardAmount: 2400, dailyRewardAmount: 220 },
]

/** 周卡 mixed 库存下今日售罄的档位 */
const MIXED_TODAY_SOLDOUT_TIER = 2
/** 周卡 mixed 库存下永久已售罄的档位 */
const MIXED_SOLDOUT_TIER = 3

/** 1031 弹窗的固定差额演示值 */
const RECHARGE_GAP_AMOUNT = 500

/** 记录页 tierName 展示文案,按档位序号分组,不是契约字段 */
const TIER_LABELS: Record<number, [string, string, string]> = {
	1: ['基础档', 'Basic', 'बेसिक'],
	2: ['尊享档', 'Premium', 'प्रीमियम'],
	3: ['至尊档', 'Deluxe', 'डीलक्स'],
	11: ['基础档', 'Basic', 'बेसिक'],
	12: ['尊享档', 'Premium', 'प्रीमियम'],
	13: ['至尊档', 'Deluxe', 'डीलक्स'],
}

/** 两张卡的标题、规则说明,按 cardType 区分 */
const CARD_TITLES: Record<1 | 2, [string, string, string]> = {
	1: ['周卡特惠', 'Weekly Card Deal', 'साप्ताहिक कार्ड ऑफर'],
	2: ['月卡特惠', 'Monthly Card Deal', 'मासिक कार्ड ऑफर'],
}
const CARD_RULES: Record<1 | 2, [string, string, string]> = {
	1: [
		'<p>购买周卡后立即获得一笔现金返现,此后连续 7 天每天可领取一份奖励,当天未领将作废。</p>',
		'<p>Buy the weekly card for an instant cashback, then claim one daily reward for 7 days in a row. A day not claimed in time is forfeited.</p>',
		'<p>साप्ताहिक कार्ड खरीदने पर तुरंत नकद कैशबैक मिलता है, फिर लगातार 7 दिनों तक हर दिन एक इनाम लिया जा सकता है। समय पर न लिया गया दिन रद्द हो जाता है।</p>',
	],
	2: [
		'<p>购买月卡后立即获得一笔现金返现,此后连续 30 天每天可领取一份奖励,当天未领将作废。</p>',
		'<p>Buy the monthly card for an instant cashback, then claim one daily reward for 30 days in a row. A day not claimed in time is forfeited.</p>',
		'<p>मासिक कार्ड खरीदने पर तुरंत नकद कैशबैक मिलता है, फिर लगातार 30 दिनों तक हर दिन एक इनाम लिया जा सकता है। समय पर न लिया गया दिन रद्द हो जाता है।</p>',
	],
}

/** BuyPeriodCard/TakeDailyReward 失败提示;UI 主要靠 msgCode 查语言包,这里的 msg 仅作兜底展示 */
const FAIL_MESSAGES: Record<number, [string, string, string]> = {
	15: ['条件不满足', 'Condition not met', 'शर्त पूरी नहीं हुई'],
	142: ['余额不足', 'Insufficient balance', 'अपर्याप्त शेष राशि'],
	1031: ['未达到充值门槛', 'Recharge requirement not met', 'रिचार्ज की शर्त पूरी नहीं हुई'],
	1032: ['该档今日已售罄', 'This tier is sold out today', 'यह टियर आज बिक चुका है'],
	146: ['奖励已领取', 'Reward already claimed', 'इनाम पहले ही लिया जा चुका है'],
}

/** 构造 `{ code:-2, msgCode, data }` 业务失败信封,失败分支的弹窗都靠 msgCode 分流 */
const failEnvelope = (ctx: MockContext, code: number, data: unknown = null): MockEnvelope => {
	const [zh, en, hd] = FAIL_MESSAGES[code] ?? ['操作失败', 'Operation failed', 'कार्रवाई विफल']
	return fail(pick(ctx, zh, en, hd), { msgCode: code, data })
}

interface DayCell {
	dayIndex: number
	status: number
	amount: number
}

/** 持卡订单;tierId/buyTime 供本文件内部换算 tierName 和记录用,不属于 Holding 契约字段,UI 不会读取 */
interface HoldingOrder {
	orderNo: string
	tierId: number
	cardState: number
	canTakeToday: boolean
	realtimeTaken: boolean
	realtimeRewardAmount: number
	dailyRewardAmount: number
	totalRewardAmount: number
	takeDayCount: number
	totalDays: number
	buyTime: string
	days: DayCell[]
}

interface HoldingSpec {
	orderNo: string
	tier: Tier
	totalDays: number
	cardState: number
	/** 已领的每日奖励(status 1) */
	takenDays: number[]
	/** 已过期未领(status 2) */
	missedDays: number[]
	/** 今日可领(status 3);null 表示没有 */
	todayIndex: number | null
	realtimeTaken: boolean
	canTakeToday: boolean
	buyDaysAgo: number
}

/** 按状态流转生成一张持卡;amount 字段每天均为 dailyRewardAmount */
const buildHolding = (spec: HoldingSpec): HoldingOrder => {
	const days: DayCell[] = Array.from({ length: spec.totalDays }, (_, index) => {
		const dayIndex = index + 1
		const status = spec.takenDays.includes(dayIndex)
			? DAY_TAKEN
			: spec.missedDays.includes(dayIndex)
				? DAY_MISSED
				: dayIndex === spec.todayIndex
					? DAY_TODAY
					: DAY_LOCKED
		return { dayIndex, status, amount: spec.tier.dailyRewardAmount }
	})
	const totalRewardAmount = Number(
		((spec.realtimeTaken ? spec.tier.realtimeRewardAmount : 0) + spec.takenDays.length * spec.tier.dailyRewardAmount).toFixed(2)
	)
	return {
		orderNo: spec.orderNo,
		tierId: spec.tier.tierId,
		cardState: spec.cardState,
		canTakeToday: spec.canTakeToday,
		realtimeTaken: spec.realtimeTaken,
		realtimeRewardAmount: spec.tier.realtimeRewardAmount,
		dailyRewardAmount: spec.tier.dailyRewardAmount,
		totalRewardAmount,
		takeDayCount: spec.takenDays.length,
		totalDays: spec.totalDays,
		buyTime: dayjs().subtract(spec.buyDaysAgo, 'day').format('YYYY-MM-DD HH:mm:ss'),
		days,
	}
}

/** 周卡月卡状态;两张卡共用同一组取值 */
type CardStatus = 'hidden' | 'buyable' | 'realtime' | 'today' | 'taken' | 'finished' | 'expired'
/** 档位库存展示模式 */
type StockMode = 'normal' | 'mixed' | 'none'
/** 购买结果;字符串形态的失败码,'ok' 表示成功 */
type BuyResult = 'ok' | '1031' | '142' | '1032' | '15'

interface PeriodCardParams {
	weekCard: CardStatus
	monthCard: CardStatus
	day: number
	missedDays: number
	stock: StockMode
	buyResult: BuyResult
}

/** 闭区间 [a, b] 的整数数组;a > b 时为空 */
const range = (a: number, b: number): number[] => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)

/**
 * 按周卡月卡状态生成一张持卡;hidden/buyable 不持卡,返回 null。
 * @remarks today/taken 由 day、missedDays 派生(周卡按 totalDays 截断);finished/expired 是与两者无关的固定终态。
 */
const buildHoldingForStatus = (status: CardStatus, orderNo: string, tier: Tier, totalDays: number, day: number, missedDays: number): HoldingOrder | null => {
	if (status === 'hidden' || status === 'buyable') return null
	if (status === 'realtime') {
		return buildHolding({ orderNo, tier, totalDays, cardState: CARD_HOLDING, takenDays: [], missedDays: [], todayIndex: null, realtimeTaken: false, canTakeToday: true, buyDaysAgo: 0 })
	}
	if (status === 'finished') {
		return buildHolding({ orderNo, tier, totalDays, cardState: CARD_FINISHED, takenDays: range(1, totalDays), missedDays: [], todayIndex: null, realtimeTaken: true, canTakeToday: false, buyDaysAgo: totalDays })
	}
	if (status === 'expired') {
		const taken = Math.max(1, totalDays - 3)
		return buildHolding({
			orderNo,
			tier,
			totalDays,
			cardState: CARD_EXPIRED,
			takenDays: range(1, taken),
			missedDays: range(taken + 1, totalDays),
			todayIndex: null,
			realtimeTaken: true,
			canTakeToday: false,
			buyDaysAgo: totalDays + 1,
		})
	}
	// today | taken:当天之前的格按 missedDays 从当天倒数切成"已领"与"已过期"两段
	const clampedDay = Math.min(day, totalDays)
	const missedCount = Math.min(missedDays, clampedDay - 1)
	const missedStart = clampedDay - missedCount
	const takenBefore = range(1, missedStart - 1)
	const missedBefore = range(missedStart, clampedDay - 1)
	const isTaken = status === 'taken'
	return buildHolding({
		orderNo,
		tier,
		totalDays,
		cardState: CARD_HOLDING,
		takenDays: isTaken ? [...takenBefore, clampedDay] : takenBefore,
		missedDays: missedBefore,
		todayIndex: isTaken ? null : clampedDay,
		realtimeTaken: true,
		canTakeToday: !isTaken,
		buyDaysAgo: clampedDay - 1,
	})
}

/** 周卡月卡的会话数据;xxxHidden 记录初始化时是否为"不返回",与 holdings 是否为空独立判断 */
interface PeriodCardState {
	weekHoldings: HoldingOrder[]
	weekHidden: boolean
	monthHoldings: HoldingOrder[]
	monthHidden: boolean
}

/** 按当前参数生成初始会话数据 */
const initState = (ctx: MockContext): PeriodCardState => {
	const p = params<PeriodCardParams>(ctx, 'periodCard')
	const weekHolding = buildHoldingForStatus(p.weekCard, 'PC-WEEK-INIT', WEEK_TIERS[0], WEEK_TOTAL_DAYS, p.day, p.missedDays)
	const monthHolding = buildHoldingForStatus(p.monthCard, 'PC-MONTH-INIT', MONTH_TIERS[0], MONTH_TOTAL_DAYS, p.day, p.missedDays)
	return {
		weekHoldings: weekHolding ? [weekHolding] : [],
		weekHidden: p.weekCard === 'hidden',
		monthHoldings: monthHolding ? [monthHolding] : [],
		monthHidden: p.monthCard === 'hidden',
	}
}

const readState = (ctx: MockContext) => featureState(ctx, 'periodCard', () => initState(ctx))

/** 距站点当天 0 点的秒数;倒计时以此为起点,归零后前端会重拉,故不能返回 0 或负数 */
const secondsToMidnight = () => dayjs().endOf('day').diff(dayjs(), 'second')

/** 档位的售罄展示只在周卡 mixed 库存下命中,月卡与 normal/none 均为可买 */
const toTierOut = (tier: Tier, cardType: 1 | 2, stock: StockMode) => ({
	...tier,
	soldOut: stock === 'mixed' && cardType === 1 && tier.tierId === MIXED_SOLDOUT_TIER,
	todaySoldOut: stock === 'mixed' && cardType === 1 && tier.tierId === MIXED_TODAY_SOLDOUT_TIER,
})

const toHoldingOut = (holding: HoldingOrder) => ({
	orderNo: holding.orderNo,
	cardState: holding.cardState,
	canTakeToday: holding.canTakeToday,
	realtimeTaken: holding.realtimeTaken,
	realtimeRewardAmount: holding.realtimeRewardAmount,
	dailyRewardAmount: holding.dailyRewardAmount,
	totalRewardAmount: holding.totalRewardAmount,
	takeDayCount: holding.takeDayCount,
	totalDays: holding.totalDays,
	nextTakeSeconds: secondsToMidnight(),
	days: holding.days,
})

/** 组装 GetPeriodCardInfo 里的一张卡;stock 为 none 时该卡不出档位 */
const buildCardOut = (ctx: MockContext, cardType: 1 | 2, totalDays: number, tiers: Tier[], holdings: HoldingOrder[], stock: StockMode) => ({
	cardType,
	title: pick(ctx, ...CARD_TITLES[cardType]),
	ruleContent: pick(ctx, ...CARD_RULES[cardType]),
	bannerUrl: '',
	totalDays,
	tiers: stock === 'none' ? [] : tiers.map((tier) => toTierOut(tier, cardType, stock)),
	holdingOrders: holdings.map(toHoldingOut),
})

/** GetPeriodCardInfo:周卡月卡活动信息,数组顺序固定为 [周卡, 月卡];"不返回"的卡整个从数组中省略 */
const getPeriodCardInfo: MockHandler = (ctx) => {
	const state = readState(ctx)
	const { stock } = params<PeriodCardParams>(ctx, 'periodCard')
	const cards = [
		state.weekHidden ? null : buildCardOut(ctx, 1, WEEK_TOTAL_DAYS, WEEK_TIERS, state.weekHoldings, stock),
		state.monthHidden ? null : buildCardOut(ctx, 2, MONTH_TOTAL_DAYS, MONTH_TIERS, state.monthHoldings, stock),
	].filter((card): card is NonNullable<typeof card> => card !== null)
	return { ...ok(cards), serviceNowTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
}

const findTier = (tierId: number): { tier: Tier; cardType: 1 | 2 } | null => {
	const week = WEEK_TIERS.find((tier) => tier.tierId === tierId)
	if (week) return { tier: week, cardType: 1 }
	const month = MONTH_TIERS.find((tier) => tier.tierId === tierId)
	return month ? { tier: month, cardType: 2 } : null
}

/**
 * BuyPeriodCard:购买周卡月卡。
 * @remarks 判断顺序:档位不存在 → 该卡型已持卡(15,不受 buyResult 影响)→ buyResult 强制的失败 → 余额不足(142)→ 成功扣款生成持卡。
 */
const buyPeriodCard: MockHandler = (ctx) => {
	const state = readState(ctx)
	const { buyResult } = params<PeriodCardParams>(ctx, 'periodCard')
	const tierId = Number(ctx.body.TierId)
	const found = findTier(tierId)
	if (!found) return { code: -2, msg: pick(ctx, '档位不存在', 'Tier not found', 'टियर मौजूद नहीं है'), data: null }
	const { tier, cardType } = found
	const holdings = cardType === 1 ? state.weekHoldings : state.monthHoldings
	if (holdings.length) return failEnvelope(ctx, 15)
	if (buyResult === '1031') return failEnvelope(ctx, 1031, { rechargeGapAmount: RECHARGE_GAP_AMOUNT })
	if (buyResult === '142') return failEnvelope(ctx, 142)
	if (buyResult === '1032') return failEnvelope(ctx, 1032)
	if (buyResult === '15') return failEnvelope(ctx, 15)
	if (ctx.state.balance < tier.sellPrice) return failEnvelope(ctx, 142)
	ctx.state.balance = Number((ctx.state.balance - tier.sellPrice).toFixed(2))
	const totalDays = cardType === 1 ? WEEK_TOTAL_DAYS : MONTH_TOTAL_DAYS
	holdings.push(
		buildHolding({
			orderNo: `PC${dayjs().format('YYYYMMDDHHmmss')}${tierId}`,
			tier,
			totalDays,
			cardState: CARD_HOLDING,
			takenDays: [],
			missedDays: [],
			todayIndex: null,
			realtimeTaken: false,
			canTakeToday: true,
			buyDaysAgo: 0,
		})
	)
	return ok({ realtimeRewardAmount: tier.realtimeRewardAmount })
}

/**
 * TakeDailyReward:领取周卡月卡的每日奖励。
 * @remarks 实时返现未领时优先发实时(不推进 takeDayCount),否则发当日每日奖励;金额记账走 claim(),键为 `periodCard:<OrderNo>:<日期>`。
 */
const takeDailyReward: MockHandler = (ctx) => {
	const state = readState(ctx)
	const orderNo = String(ctx.body.OrderNo)
	const order = [...state.weekHoldings, ...state.monthHoldings].find((item) => item.orderNo === orderNo)
	if (!order || !(order.cardState === CARD_HOLDING && order.canTakeToday)) return failEnvelope(ctx, 146)

	const rewardType = order.realtimeTaken ? 2 : 1
	const amount = order.realtimeTaken ? order.dailyRewardAmount : order.realtimeRewardAmount
	const result = claim(ctx, `periodCard:${order.orderNo}:${dayjs().format('YYYY-MM-DD')}`, amount)
	if (result.code !== 0) return failEnvelope(ctx, 146)

	order.totalRewardAmount = Number((order.totalRewardAmount + amount).toFixed(2))
	if (rewardType === 1) {
		order.realtimeTaken = true
	} else {
		const todayCell = order.days.find((day) => day.status === DAY_TODAY)
		if (todayCell) todayCell.status = DAY_TAKEN
		order.takeDayCount += 1
	}
	order.canTakeToday = false
	if (order.takeDayCount >= order.totalDays) order.cardState = CARD_FINISHED
	return ok({ rewardAmount: amount, rewardType })
}

const toRecord = (ctx: MockContext, cardType: 1 | 2, holding: HoldingOrder) => {
	const [zh, en, hd] = TIER_LABELS[holding.tierId] ?? ['', '', '']
	return {
		cardType,
		tierName: pick(ctx, zh, en, hd),
		cardState: holding.cardState,
		takeDayCount: holding.takeDayCount,
		totalDays: holding.totalDays,
		buyTime: holding.buyTime,
		totalRewardAmount: holding.totalRewardAmount,
	}
}

/** 固定的历史记录,确保记录列表始终覆盖 cardState 已完成(2)与已过期(3) */
const buildStaticRecords = (ctx: MockContext) => [
	{
		cardType: 1 as const,
		tierName: pick(ctx, '基础档', 'Basic', 'बेसिक'),
		cardState: CARD_FINISHED,
		takeDayCount: WEEK_TOTAL_DAYS,
		totalDays: WEEK_TOTAL_DAYS,
		buyTime: dayjs().subtract(20, 'day').format('YYYY-MM-DD HH:mm:ss'),
		totalRewardAmount: 377,
	},
	{
		cardType: 2 as const,
		tierName: pick(ctx, '尊享档', 'Premium', 'प्रीमियम'),
		cardState: CARD_EXPIRED,
		takeDayCount: 10,
		totalDays: MONTH_TOTAL_DAYS,
		buyTime: dayjs().subtract(45, 'day').format('YYYY-MM-DD HH:mm:ss'),
		totalRewardAmount: 1600,
	},
]

/** GetMyPeriodCardRecords:我的购买记录,一次性返回、不分页,周卡月卡混在同一数组里 */
const getMyPeriodCardRecords: MockHandler = (ctx) => {
	const state = readState(ctx)
	const live = [...state.weekHoldings.map((holding) => toRecord(ctx, 1, holding)), ...state.monthHoldings.map((holding) => toRecord(ctx, 2, holding))]
	return ok([...live, ...buildStaticRecords(ctx)])
}

// 任务页子页签固定顺序(2026-09-22 拍板):每日任务、每周任务、每日签到、购买周卡、购买月卡、新手礼包
// 每日签到不走契约(无 GetActivityCenterTabSort 对应键),排序值只在 DailyTasks/index.vue 的页面级默认里维护,这里只需保证其余五档权重与之对齐
/** 契约默认的 Tab 排序值 */
const DEFAULT_TAB_SORT: Record<string, number> = {
	DailyTask: 100,
	WeeklyTask: 95,
	WeekCard: 85,
	MonthCard: 80,
	GiftPack: 75,
}

/** 落 Tab 规则:focus 命中的活动 → 该活动对应的 tabKey */
const FOCUS_TAB_KEY: Record<string, string> = {
	newbieGift: 'GiftPack',
	dailyTask: 'DailyTask',
	weeklyTask: 'WeeklyTask',
}

/**
 * GetActivityCenterTabSort:DailyTasks 页 5 个 Tab 的排序。
 * @remarks 从控制台清单打开活动(`ctx.scenario.focus`)时,把对应 Tab 的排序提到 200 让页面默认落在那个 Tab;
 * `periodCard` 提权 WeekCard;周卡为"不返回",或周卡未持有(可购买)而月卡持有时,改提权 MonthCard;其余情况原样返回契约默认值。
 */
const getActivityCenterTabSort: MockHandler = (ctx) => {
	const sort = { ...DEFAULT_TAB_SORT }
	const focus = ctx.scenario.focus
	const focusKey = focus ? FOCUS_TAB_KEY[focus] : undefined
	if (focusKey) {
		sort[focusKey] = 200
	} else if (focus === 'periodCard') {
		const { weekCard, monthCard } = params<PeriodCardParams>(ctx, 'periodCard')
		const held = (state: string) => state !== 'hidden' && state !== 'buyable'
		const monthFirst = weekCard === 'hidden' || (!held(weekCard) && held(monthCard))
		sort[monthFirst ? 'MonthCard' : 'WeekCard'] = 200
	}
	return ok(Object.entries(sort).map(([tabKey, tabSort]) => ({ tabKey, tabSort })))
}

/** 周卡月卡(购买、领取、我的记录、活动中心 Tab 排序)的接口假数据 */
export const periodCardRoutes: MockRoutes = {
	[api.GetPeriodCardInfo]: getPeriodCardInfo,
	[api.BuyPeriodCard]: buyPeriodCard,
	[api.TakeDailyReward]: takeDailyReward,
	[api.GetMyPeriodCardRecords]: getMyPeriodCardRecords,
	[api.GetActivityCenterTabSort]: getActivityCenterTabSort,
}
