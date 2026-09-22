import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, fail, paged } from '../envelope'
import { featureState } from '../state'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** 保险箱收益（strongBox）活动参数 */
interface StrongBoxParams {
	/** 保险箱入口开关 */
	enabled: boolean
	/** 保险箱余额（会话初始值），转入转出后按会话变化 */
	balance: number
	/** 已产生收益 */
	earnings: number
	/** 转入需完成的打码量，大于 0 时转入按钮禁用并提示 */
	codeLock: number
	/** 新版收益模式：日利率按 /48 展示，转出份数不可编辑 */
	newMode: boolean
}

/** 保险箱自有会话数据：余额随转入转出变化，初始值取自参数 */
interface StrongBoxData {
	/** 保险箱余额 */
	balance: number
}

/** 日利率（小数），GetSafeInfo/GetSafeAmount/记录卡片按 *100 换算成 0.1% 展示 */
const DAY_RATE = 0.001

/** 累计收益，对应 StrongBox/index.vue 的"累计收益"(cumulativeRevenue)；不随控制台参数变化 */
const CUMULATIVE_EARNINGS = 128.6

/** 每份金额；转入弹窗按 shareAmount 的倍数（2/5/10…）转入 */
const SHARE_AMOUNT = 100

/** 布尔值转接口约定的 '1'/'0' */
const flag = (value: boolean) => (value ? '1' : '0')

/** 保险箱流水 8 条，字段对应 ResGetSafeList；type 18 为转入，其余（19）为转出；不随控制台参数变化 */
const RECORDS = [
	{ type: 18, amount: 1000, earnings: 1.0, orderNum: 'SF20260920001', days: 0 },
	{ type: 19, amount: 500, earnings: 0, orderNum: 'SF20260919002', days: 1 },
	{ type: 18, amount: 2000, earnings: 2.0, orderNum: 'SF20260918003', days: 2 },
	{ type: 18, amount: 500, earnings: 0.5, orderNum: 'SF20260916004', days: 4 },
	{ type: 19, amount: 800, earnings: 0, orderNum: 'SF20260914005', days: 6 },
	{ type: 18, amount: 1500, earnings: 1.5, orderNum: 'SF20260910006', days: 10 },
	{ type: 19, amount: 300, earnings: 0, orderNum: 'SF20260905007', days: 15 },
	{ type: 18, amount: 1000, earnings: 1.0, orderNum: 'SF20260901008', days: 20 },
].map((item) => ({ ...item, dayShareRate: DAY_RATE, safeEarnings: item.earnings.toFixed(2), addTime: dayjs().subtract(item.days, 'day').format('YYYY-MM-DD HH:mm:ss') }))

/** 本月转入/转出/收益合计，对应 GetSafeLogList 的 extend1(收益)、extend2(转入)、extend3(转出) */
const MONTH_SUMMARY = {
	extend1: RECORDS.reduce((sum, item) => sum + item.earnings, 0),
	extend2: RECORDS.filter((item) => item.type === 18).reduce((sum, item) => sum + item.amount, 0),
	extend3: RECORDS.filter((item) => item.type !== 18).reduce((sum, item) => sum + item.amount, 0),
}

/** 读取保险箱自有会话数据；首次访问按参数的余额初始化，转入转出后在会话内变化 */
function boxData(ctx: MockContext): StrongBoxData {
	return featureState<StrongBoxData>(ctx, 'strongBox', () => ({ balance: params<StrongBoxParams>(ctx, 'strongBox').balance }))
}

/** GetSafeInfo：保险箱总览；沿用经典份额模式的固定日利率，金额随参数与会话变化 */
const safeInfo: MockHandler = (ctx) => {
	const { earnings, newMode } = params<StrongBoxParams>(ctx, 'strongBox')
	return ok({
		dayShareRate: DAY_RATE,
		safeAmount: boxData(ctx).balance,
		safeEarnings: earnings,
		maxSafeAmount: 50000,
		safeTotalAmount: CUMULATIVE_EARNINGS,
		shareAmount: SHARE_AMOUNT,
		shareTime: 1,
		userDayShareRate: DAY_RATE,
		safeBoxCodeAmount: 0,
		willSafeEarnings: '0',
		isOpenNewSetting: flag(newMode),
	})
}

/** GetSafeAmount：转出弹窗的可转出余额，等于当前保险箱余额 */
const safeAmount: MockHandler = (ctx) => {
	const { earnings } = params<StrongBoxParams>(ctx, 'strongBox')
	return ok({ balance: boxData(ctx).balance, dayShareRate: DAY_RATE, safeEarnings: earnings })
}

/** GetSafeUserAmount：转入弹窗的可转入余额，等于当前钱包余额；打码量门槛取自参数 */
const safeUserAmount: MockHandler = (ctx) => ok({ balance: ctx.state.balance, amountOfCode: params<StrongBoxParams>(ctx, 'strongBox').codeLock })

/** SetSafeInto：转入，把请求金额从钱包余额移到保险箱余额 */
const setSafeInto: MockHandler = (ctx) => {
	const amount = Number(ctx.body.amount)
	if (!(amount > 0)) return fail(pick(ctx, '转入金额不正确', 'Invalid deposit amount', 'जमा राशि अमान्य है'))
	if (amount > ctx.state.balance) return fail(pick(ctx, '钱包余额不足', 'Insufficient wallet balance', 'वॉलेट बैलेंस अपर्याप्त है'))
	const box = boxData(ctx)
	ctx.state.balance = Number((ctx.state.balance - amount).toFixed(2))
	box.balance = Number((box.balance + amount).toFixed(2))
	return ok(null)
}

/** SetSafeBack：转出，把请求金额从保险箱余额移回钱包余额 */
const setSafeBack: MockHandler = (ctx) => {
	const amount = Number(ctx.body.amount)
	if (!(amount > 0)) return fail(pick(ctx, '转出金额不正确', 'Invalid withdrawal amount', 'निकासी राशि अमान्य है'))
	const box = boxData(ctx)
	if (amount > box.balance) return fail(pick(ctx, '保险箱余额不足', 'Insufficient vault balance', 'तिजोरी बैलेंस अपर्याप्त है'))
	box.balance = Number((box.balance - amount).toFixed(2))
	ctx.state.balance = Number((ctx.state.balance + amount).toFixed(2))
	return ok(null)
}

/** GetSafeLogList：StrongBoxRecord 页分页流水，附带当月转入/转出/收益合计 */
const safeLogList: MockHandler = (ctx) => ok({ ...paged(RECORDS, ctx.body), ...MONTH_SUMMARY })

/** GetWealthState：入口开关与保险箱概要，供我的页入口卡片展示 */
const wealthState: MockHandler = (ctx) => {
	const { enabled, newMode } = params<StrongBoxParams>(ctx, 'strongBox')
	return ok({ state: flag(enabled), shareTime: 1, dayShareRate: 0.1, safeAmount: boxData(ctx).balance, isOpenNewSetting: flag(newMode) })
}

/** 保险箱（Type 17）的接口假数据 */
export const strongBoxRoutes: MockRoutes = {
	[api.GetSafeInfo]: safeInfo,
	[api.GetSafeAmount]: safeAmount,
	[api.GetSafeUserAmount]: safeUserAmount,
	[api.SetSafeInto]: setSafeInto,
	[api.SetSafeBack]: setSafeBack,
	[api.GetSafeList]: (ctx) => ok(paged(RECORDS, ctx.body)),
	[api.GetSafeLogList]: safeLogList,
	[api.GetWealthState]: wealthState,
	[api.RecoverBalance]: (ctx) => ok({ amount: ctx.state.balance }),
}
