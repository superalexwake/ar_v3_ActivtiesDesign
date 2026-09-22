import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged, fail } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { featureState } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** turntable 活动参数,对应 catalog.json 的 activities.turntable.params */
interface TurntableParams {
	/** 活动开关,由 home.ts 读取 */
	enabled: boolean
	/** 剩余抽奖次数 */
	spins: number
	/** 今日充值金额 */
	deposit: number
	/** 下次抽奖结果 */
	result: 'random' | 'cash100' | 'iphone' | 'thanks' | 'unbound'
	/** 是否有抽奖记录 */
	hasRecords: boolean
}

/** 单个奖品配置;rewardType 1 为现金(rewardAmount 即金额),2 为文字/实物奖,与 useTurntable.hook.ts 的 prizes 计算一致 */
interface TurntablePrize {
	/** 奖品键,用于 result 参数匹配,记录里也只存这个语言无关的键 */
	key: string
	rewardType: 1 | 2
	rewardAmount: number
	/** 抽中权重,8 项之和为 100 */
	weight: number
}

/** 8 个奖品:₹1～₹100 六档现金、谢谢参与、iPhone 实物 */
const PRIZES: TurntablePrize[] = [
	{ key: 'cash1', rewardType: 1, rewardAmount: 1, weight: 25 },
	{ key: 'cash5', rewardType: 1, rewardAmount: 5, weight: 20 },
	{ key: 'cash10', rewardType: 1, rewardAmount: 10, weight: 15 },
	{ key: 'cash20', rewardType: 1, rewardAmount: 20, weight: 10 },
	{ key: 'cash50', rewardType: 1, rewardAmount: 50, weight: 6 },
	{ key: 'cash100', rewardType: 1, rewardAmount: 100, weight: 3 },
	{ key: 'thanks', rewardType: 2, rewardAmount: 0, weight: 20 },
	{ key: 'iphone', rewardType: 2, rewardAmount: 0, weight: 1 },
]

/** 充值换抽奖次数的任务档位,字段对应 Turntable/Detail 页 */
const TASK_LIST = [
	{ targetAmount: 100, taskType: 1, rotateNum: 1 },
	{ targetAmount: 500, taskType: 2, rotateNum: 3 },
	{ targetAmount: 1000, taskType: 2, rotateNum: 5 },
]

/** 一条抽奖记录;奖品只存语言无关的键,响应时由 settingText() 转换成展示文案 */
interface TurntableRecordEntry {
	drawTime: string
	rewardType: 1 | 2
	rewardAmount: number
	key: string
}

/** 大转盘的会话数据:剩余次数与抽奖记录,键等于活动 ID */
interface TurntableState {
	spins: number
	records: TurntableRecordEntry[]
}

/** 默认的 6 条抽奖记录,时间由近到远 */
function defaultRecords(): TurntableRecordEntry[] {
	return [
		{ drawTime: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'), rewardType: 1, rewardAmount: 10, key: 'cash10' },
		{ drawTime: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'), rewardType: 2, rewardAmount: 0, key: 'thanks' },
		{ drawTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'), rewardType: 1, rewardAmount: 1, key: 'cash1' },
		{ drawTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'), rewardType: 1, rewardAmount: 5, key: 'cash5' },
		{ drawTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'), rewardType: 2, rewardAmount: 0, key: 'thanks' },
		{ drawTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'), rewardType: 1, rewardAmount: 20, key: 'cash20' },
	]
}

/** 读取大转盘的会话数据,首次访问按参数生成初始次数与记录 */
function turntableFeature(ctx: MockContext, p: TurntableParams): TurntableState {
	return featureState(ctx, 'turntable', () => ({ spins: p.spins, records: p.hasRecords ? defaultRecords() : [] }))
}

/** 奖品或记录的展示文案;谢谢参与三语化,iPhone 16 作为专有名词保留原文 */
function settingText(ctx: MockContext, item: { rewardType: 1 | 2; rewardAmount: number; key: string }): string {
	if (item.rewardType === 1) return String(item.rewardAmount)
	if (item.key === 'iphone') return 'iPhone 16'
	return pick(ctx, '谢谢参与', 'Thank you for participating', 'भाग लेने के लिए धन्यवाद')
}

/** 按权重从奖品表中抽取一项 */
function pickWeighted(prizes: TurntablePrize[]): TurntablePrize {
	const total = prizes.reduce((sum, item) => sum + item.weight, 0)
	let roll = Math.random() * total
	for (const prize of prizes) {
		if (roll < prize.weight) return prize
		roll -= prize.weight
	}
	return prizes[prizes.length - 1]
}

/** 按 result 参数决定本次抽奖结果;random 时按权重抽取 */
function resolvePrize(result: TurntableParams['result']): TurntablePrize {
	if (result === 'random') return pickWeighted(PRIZES)
	return PRIZES.find((item) => item.key === result) ?? pickWeighted(PRIZES)
}

/** GetTurnTableInfo:转盘配置、VIP 参与门槛、充值换次数任务 */
const info: MockHandler = (ctx) =>
	ok({
		rewardList: PRIZES.map((prize) => ({ rewardType: prize.rewardType, rewardSetting: settingText(ctx, prize), prizePicturesUrl: '' })),
		vipRating: '0,1,2,3,4,5,6,7,8,9',
		taskList: TASK_LIST,
		bindingType: 2,
	})

/** GetTurnTableUserRotateNum:今日总次数与剩余次数;sumRotateNum 恒不小于 3 */
const rotateNum: MockHandler = (ctx) => {
	const p = params<TurntableParams>(ctx, 'turntable')
	const state = turntableFeature(ctx, p)
	return ok({ sumRotateNum: Math.max(3, p.spins), surplusRotateNum: state.spins })
}

/**
 * TurnTableDraw:扣次数、按权重或指定结果抽奖,现金奖加到余额并插入记录。
 *
 * @remarks 页面 `await` 结果后没有 catch(useTurntable.hook.ts:114-130),次数不足与未绑定提现方式都必须用 `code: 1`,
 * 否则信封会被拦截器 reject 成未捕获的 Promise 异常。
 */
const draw: MockHandler = (ctx) => {
	const p = params<TurntableParams>(ctx, 'turntable')
	const state = turntableFeature(ctx, p)
	if (p.result === 'unbound') {
		return fail(pick(ctx, '绑定 UPI 后可抽奖', 'Bind a UPI method to spin', 'स्पिन करने के लिए UPI बाइंड करें'), {
			code: 1,
			msgCode: 904,
			data: { bindingType: 2 },
		})
	}
	if (state.spins <= 0) return fail(pick(ctx, '您的抽奖次数已用完', 'You have used up all your spins', 'आपके सभी स्पिन इस्तेमाल हो चुके हैं'), { code: 1, msgCode: 905 })
	state.spins -= 1
	const prize = resolvePrize(p.result)
	if (prize.rewardType === 1) ctx.state.balance = Number((ctx.state.balance + prize.rewardAmount).toFixed(2))
	state.records = [
		{ drawTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), rewardType: prize.rewardType, rewardAmount: prize.rewardAmount, key: prize.key },
		...state.records,
	].slice(0, 6)
	return ok({ rewardType: prize.rewardType, rewardSetting: settingText(ctx, prize), rewardAmount: prize.rewardAmount, surplusRotateNum: state.spins })
}

/** 大转盘(Type 119)的接口假数据 */
export const turntableRoutes: MockRoutes = {
	[api.GetTurnTableInfo]: info,
	[api.GetTurnTableUserRotateNum]: rotateNum,
	[api.GetTurnTableDraw]: draw,
	[api.GetTurnTableRecord]: (ctx) => {
		const p = params<TurntableParams>(ctx, 'turntable')
		const state = turntableFeature(ctx, p)
		const records = state.records.map((record) => ({
			drawTime: record.drawTime,
			rewardType: record.rewardType,
			rewardAmount: record.rewardAmount,
			rewardSetting: settingText(ctx, record),
		}))
		return ok(paged(records, ctx.body))
	},
	[api.GetNowdayRechargeAmount]: (ctx) => ok(params<TurntableParams>(ctx, 'turntable').deposit),
}
