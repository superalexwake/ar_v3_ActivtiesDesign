import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim, featureState } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** redeemGift 活动参数(catalog.json `activities.redeemGift.params`) */
interface RedeemGiftParams {
	/** 兑换结果 */
	result: 'cash' | 'coupon' | '230' | '231' | '235' | '246'
	/** 到账金额(现金结果时使用) */
	amount: number
	/** 是否返回初始兑换记录 */
	hasRecords: boolean
}

/** 兑换得到的充值券快照,字段对应 RedpageCouponInfo（src/types/api/interface/user.d.ts），仅用于展示，不写入充值优惠券钱包 */
interface RedeemCouponInfo {
	couponId: number
	couponNumber: string | null
	couponName: string | null
	rechargeGiftRate: number
	rechargeGiftLimit: number
	minRechargeAmount: number
	amountofCode: number
	couponValidDays: number
	isFirstRechargeAvailable: boolean
	bonusMergeMode: number
	state: number | null
	expireTime: string | null
	useTime: string | null
	rechargeAmount: number | null
	giftAmount: number | null
}

/** 兑换记录项，字段对应 RedpageRecordItem（src/types/api/interface/user.d.ts） */
interface RedeemRecord {
	rewardType: number
	redId: number
	redNumber: string | null
	receiveTime: string
	amount: number
	agentId: number
	remark: string | null
	coupon: RedeemCouponInfo | null
}

/** 兑换码错误/已领取过/红包已领完/今日已达上限,四个失败结果对应的 msgCode 与提示文案 */
const FAIL_RESULTS: Record<'230' | '231' | '235' | '246', { msgCode: number; text: readonly [string, string, string] }> = {
	'230': { msgCode: 230, text: ['兑换码错误', 'Invalid redeem code', 'अमान्य रिडीम कोड'] },
	'231': { msgCode: 231, text: ['该红包已领取过', 'This red packet has already been claimed', 'यह रेड पैकेट पहले ही प्राप्त किया जा चुका है'] },
	'235': { msgCode: 235, text: ['红包已被领完', 'This red packet has been fully claimed', 'यह रेड पैकेट पूरी तरह से बांटा जा चुका है'] },
	'246': { msgCode: 246, text: ['今日领取次数已达上限', "Today's claim limit has been reached", 'आज की प्राप्ति सीमा पूरी हो चुकी है'] },
}

/** 兑换得到充值券时的固定档位展示,数值与具体兑换码无关，仅用于演示券卡片 */
const buildCouponReward = (seq: number): RedeemCouponInfo => {
	const id = 9300 + seq
	return {
		couponId: id,
		couponNumber: `RD${id}`,
		couponName: null,
		rechargeGiftRate: 0.1,
		rechargeGiftLimit: 200,
		minRechargeAmount: 500,
		amountofCode: 1,
		couponValidDays: 15,
		isFirstRechargeAvailable: false,
		bonusMergeMode: 1,
		state: 1, // 1 = 未使用，对齐 USER_COUPON_STATE.UNUSED
		expireTime: dayjs().add(15, 'day').format('YYYY-MM-DD HH:mm:ss'),
		useTime: null,
		rechargeAmount: null,
		giftAmount: null,
	}
}

/** 初始兑换记录:1 条现金 + 1 条充值券,hasRecords 为假时为空 */
function seedRecords(hasRecords: boolean): RedeemRecord[] {
	if (!hasRecords) return []
	const now = dayjs()
	return [
		{
			rewardType: 2,
			redId: 501,
			redNumber: 'WELCOME2026',
			receiveTime: now.subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
			amount: 0,
			agentId: 0,
			remark: null,
			coupon: buildCouponReward(0),
		},
		{
			rewardType: 1,
			redId: 500,
			redNumber: 'CASH2026',
			receiveTime: now.subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
			amount: 18.88,
			agentId: 0,
			remark: null,
			coupon: null,
		},
	]
}

/** 红包兑换的会话数据：兑换记录列表，按 hasRecords 参数生成初始记录，兑换成功后按会话追加 */
const redeemState = (ctx: MockContext) =>
	featureState<{ records: RedeemRecord[] }>(ctx, 'redeemGift', () => ({
		records: seedRecords(params<RedeemGiftParams>(ctx, 'redeemGift').hasRecords),
	}))

/**
 * ConversionRedpage：兑换码兑奖。
 *
 * @remarks 任意非空兑换码都按 redeemGift.result 参数返回对应结果：`cash`/`coupon` 成功入账并追加一条
 * 兑换记录；其余四个枚举值返回失败信封，`code: 1` 让页面走 resolve 分支自行分流（页面按 msgCode 查语言包，
 * 不读这里的 msg 文案）。领取键 `redeemGift:<序号>` 按当前记录数递增，恒为新键，只用于复用 claim() 的余额
 * 入账逻辑并满足领取键前缀约定，不做防重复领取。
 */
const conversionRedpage: MockHandler = (ctx) => {
	const code = String(ctx.body.giftCode ?? '').trim()
	if (!code) return fail(pick(ctx, '兑换码错误', 'Invalid redeem code', 'अमान्य रिडीम कोड'), { code: 1, msgCode: 230 })

	const p = params<RedeemGiftParams>(ctx, 'redeemGift')
	if (p.result !== 'cash' && p.result !== 'coupon') {
		const { msgCode, text } = FAIL_RESULTS[p.result]
		return fail(pick(ctx, ...text), { code: 1, msgCode })
	}

	const feature = redeemState(ctx)
	const key = `redeemGift:${feature.records.length}`
	const amount = p.result === 'cash' ? p.amount : 0
	const result = claim(ctx, key, amount)
	if (result.code !== 0) return result

	feature.records.unshift({
		rewardType: p.result === 'cash' ? 1 : 2,
		redId: 1000 + feature.records.length,
		redNumber: code,
		receiveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		amount,
		agentId: 0,
		remark: null,
		coupon: p.result === 'coupon' ? buildCouponReward(feature.records.length) : null,
	})
	return result
}

/** GetRedpagePageList：兑换记录分页列表，含刚兑换成功的那条 */
const getRedpagePageList: MockHandler = (ctx) => ok(paged(redeemState(ctx).records, ctx.body))

/** 红包兑换的接口假数据 */
export const redeemGiftRoutes: MockRoutes = {
	[api.ConversionRedpage]: conversionRedpage,
	[api.GetRedpagePageList]: getRedpagePageList,
}
