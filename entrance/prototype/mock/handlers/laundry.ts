import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged } from '../envelope'
import { claim } from '../state'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** 洗码返水（laundry）活动参数 */
interface LaundryParams {
	/** 可洗码量（全部），彩票/视讯/电子按固定比例拆分 */
	washable: number
	/** 是否有洗码记录；为 false 时洗码记录与返水统计一并清零 */
	hasRecords: boolean
}

/** 彩票、视讯、电子三类相对全部可洗码量的占比，三者之和为 1（对应默认值 58 : 32.8 : 46） */
const CATEGORY_SHARE: Record<number, number> = { 3: 58 / 136.8, 1: 32.8 / 136.8, 0: 46 / 136.8 }

/** 各分类的返水率；键为 rootConfig.gameTabList 的 codeType（-1 全部、3 彩票、1 视讯、0 电子、4 棋牌未在需求内、兜底 0） */
const CATEGORY_RATE: Record<number, string> = { [-1]: '0.5', 3: '0.3', 1: '0.5', 0: '0.8', 4: '0.2' }

/** 按 codeType 取当前生效的可洗码量：-1 为总量，3/1/0 按固定比例拆分，其余（如棋牌）恒为 0 */
function washableOf(codeType: number, total: number): number {
	if (codeType === -1) return total
	return Number((total * (CATEGORY_SHARE[codeType] ?? 0)).toFixed(2))
}

/** 洗码记录 8 条，字段对应 codeWashReceiveList（Laundry/index.vue、LaundryRecord/index.vue 共用） */
const RECORDS = [
	{ codeType: 3, washVolume: 5000, washRate: 0.3, rebateAmount: 15.0, days: 0 },
	{ codeType: 0, washVolume: 1600, washRate: 0.8, rebateAmount: 12.8, days: 0 },
	{ codeType: 1, washVolume: 1800, washRate: 0.5, rebateAmount: 9.0, days: 1 },
	{ codeType: 3, washVolume: 3000, washRate: 0.3, rebateAmount: 9.0, days: 2 },
	{ codeType: 0, washVolume: 2000, washRate: 0.8, rebateAmount: 16.0, days: 3 },
	{ codeType: 1, washVolume: 1200, washRate: 0.5, rebateAmount: 6.0, days: 4 },
	{ codeType: 3, washVolume: 4000, washRate: 0.3, rebateAmount: 12.0, days: 5 },
	{ codeType: 0, washVolume: 900, washRate: 0.8, rebateAmount: 7.2, days: 6 },
].map((item) => ({ ...item, addTime: dayjs().subtract(item.days, 'day').format('YYYY-MM-DD HH:mm:ss') }))

/** GetCodeWashRule：各 VIP 等级返水比例表，表头三语化 */
function washRulesHtml(ctx: MockContext): string {
	const level = pick(ctx, 'VIP 等级', 'VIP Level', 'VIP स्तर')
	const rate = pick(ctx, '返水比例', 'Rebate Rate', 'रिबेट दर')
	const rows = Array.from({ length: 10 }, (_, lv) => `<tr><td>VIP${lv}</td><td>${(0.1 + lv * 0.1).toFixed(1)}%</td></tr>`).join('')
	return `<table><tr><th>${level}</th><th>${rate}</th></tr>${rows}</table>`
}

/** 今日是否已经洗过码：一键洗码的 claim() 键含日期，每天只能领一次 */
const isWashedToday = (ctx: MockContext) => Boolean(ctx.state.claimed['laundry:' + dayjs().format('YYYY-MM-DD')])

/** GetCodeWashAmount：按 codeType 返回可洗码量、返水率与最近记录预览；今日已洗码时可洗码量归零，无记录参数时记录与返水统计归零 */
const codeWashAmount: MockHandler = (ctx) => {
	const { washable, hasRecords } = params<LaundryParams>(ctx, 'laundry')
	const codeType = Number(ctx.body.codeType ?? -1)
	const amount = isWashedToday(ctx) ? 0 : washableOf(codeType, washable)
	return ok({
		codeWashAmount: amount,
		dayRebate: hasRecords ? 3.5 : 0,
		totalRebate: hasRecords ? 560.2 : 0,
		washRate: CATEGORY_RATE[codeType] ?? CATEGORY_RATE[-1],
		washList: hasRecords ? RECORDS.slice(0, 3) : [],
	})
}

/** GetCodeWashRecordList：按 codeType 过滤的分页记录；无记录参数时返回空列表 */
const recordList: MockHandler = (ctx) => {
	const { hasRecords } = params<LaundryParams>(ctx, 'laundry')
	if (!hasRecords) return ok(paged([], ctx.body))
	const codeType = Number(ctx.body.codeType ?? -1)
	const list = codeType === -1 ? RECORDS : RECORDS.filter((item) => item.codeType === codeType)
	return ok(paged(list, ctx.body))
}

/** AddCodeWashRecord：一键洗码，返水 = 该分类可洗码量 × 该分类费率，用 claim() 记账（键含今天日期，每天限一次） */
const addCodeWashRecord: MockHandler = (ctx) => {
	const { washable } = params<LaundryParams>(ctx, 'laundry')
	const codeType = Number(ctx.body.codeType ?? -1)
	const amount = washableOf(codeType, washable)
	const rate = Number(CATEGORY_RATE[codeType] ?? CATEGORY_RATE[-1])
	const rebateAmount = Number((amount * (rate / 100)).toFixed(2))
	const result = claim(ctx, 'laundry:' + dayjs().format('YYYY-MM-DD'), rebateAmount)
	if (result.code !== 0) return result
	return ok({ rebateAmount })
}

/** 洗码返水（Type 102）的接口假数据 */
export const laundryRoutes: MockRoutes = {
	[api.GetCodeWashAmount]: codeWashAmount,
	[api.AddCodeWashRecord]: addCodeWashRecord,
	[api.GetCodeWashRecordList]: recordList,
	[api.GetCodeWashRule]: (ctx) => ok({ washRules: washRulesHtml(ctx) }),
}
