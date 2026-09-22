import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/**
 * 充值大类/渠道配置。payID 101–104、payTypeID 10101–10104 特意取自定义号段，避开
 * `useRecharge.ts` 里 9/10/11/12/14/15/16/18/19/20/21/22/26 等触发本地银行、UPI、USDT、
 * C2C、ARPay 等专属分支的保留编号，四个渠道都走最简单的通用"三方充值"逻辑
 * （payTypeID ≥ 10000，点击充值提交会调 ThirdPay）。
 */
interface RechargeChannel {
	payID: number
	payTypeID: number
	zh: string
	en: string
	hd: string
	/** 快捷金额档位（元） */
	quickAmounts: number[]
	/** 渠道图标（通用图标，不含真实品牌标志） */
	icon: string
}

export const CHANNELS: RechargeChannel[] = [
	{ payID: 101, payTypeID: 10101, zh: '网银转账', en: 'Net Banking', hd: 'नेट बैंकिंग', quickAmounts: [100, 300, 500, 1000], icon: 'mock-img/channel-netbanking.svg' },
	{ payID: 102, payTypeID: 10102, zh: '钱包支付', en: 'E-Wallet', hd: 'ई-वॉलेट', quickAmounts: [100, 300, 500, 1000], icon: 'mock-img/channel-ewallet.svg' },
	{ payID: 103, payTypeID: 10103, zh: '扫码支付', en: 'Scan to Pay', hd: 'स्कैन करके भुगतान करें', quickAmounts: [100, 200, 500, 1000], icon: 'mock-img/channel-scan.svg' },
	{ payID: 104, payTypeID: 10104, zh: '银行卡支付', en: 'Card Payment', hd: 'कार्ड भुगतान', quickAmounts: [200, 500, 1000, 2000], icon: 'mock-img/channel-card.svg' },
]

/** rechargeGift 活动参数(catalog.json `activities.rechargeGift.params`) */
interface RechargeGiftParams {
	/** 首充赠送比例(%),仅前 3 个渠道生效,第 4 个渠道固定无赠送作对照 */
	giftRate: number
	/** VIP 加赠比例(%),仅前 3 个渠道生效 */
	vipRate: number
	/** 延迟到账天数 */
	delayDays: number
	/** 快捷金额是否附带赠送 */
	quickGift: boolean
	/** 是否返回充值记录 */
	records: boolean
}

/** 第 4 个渠道固定 0,用作"无赠送"对照渠道;其余渠道取 giftRate/vipRate(百分比转小数) */
const giftRateOf = (p: RechargeGiftParams, index: number) => (index < CHANNELS.length - 1 ? p.giftRate / 100 : 0)
const vipRateOf = (p: RechargeGiftParams, index: number) => (index < CHANNELS.length - 1 ? p.vipRate / 100 : 0)

const channelName = (ctx: MockContext, c: RechargeChannel) => pick(ctx, c.zh, c.en, c.hd)

/** 充值记录项,字段对齐 chargeRecordList(src/types/api/interface/wallet.d.ts) */
interface RechargeRecordItem {
	rechargeNumber: string
	addTime: string
	type: number
	price: number
	state: number
	uRate: number
	uGold: number
	payID: number
	payName: string
	groupID: number
	orderAmount: number
}

/** 充值记录:待支付、已完成两条、失败(state 0/1/1/2);页面的状态文案表 rootConfig.RechargeState 只有 0/1/2,其他状态码会让页面报错 */
function buildRechargeRecords(ctx: MockContext): RechargeRecordItem[] {
	const now = dayjs()
	const rows = [
		{ seq: '01', state: 0, minutesAgo: 10, price: 500, channel: CHANNELS[0] },
		{ seq: '02', state: 1, minutesAgo: 60, price: 1000, channel: CHANNELS[1] },
		{ seq: '03', state: 2, minutesAgo: 120, price: 300, channel: CHANNELS[2] },
		{ seq: '04', state: 1, minutesAgo: 180, price: 200, channel: CHANNELS[3] },
	]
	return rows.map((row) => ({
		rechargeNumber: `RC2026090${row.seq}`,
		addTime: now.subtract(row.minutesAgo, 'minute').format('YYYY-MM-DD HH:mm:ss'),
		type: 1,
		price: row.price,
		state: row.state,
		uRate: 1,
		uGold: row.price,
		payID: row.channel.payID,
		payName: channelName(ctx, row.channel),
		groupID: 0,
		orderAmount: row.price,
	}))
}

/** GetBalance：充值页顶部余额条；`useWalletStore().resetData` 读取 `res.data.amount` */
const getBalance: MockHandler = (ctx) => ok({ amount: ctx.state.balance })

/** GetPayTypeName：充值大类 Tab 列表；`maxRechargeRifts`/`vipRechargeRate` 对应 RechargeMenu.vue 卡片角标 */
const getPayTypeName: MockHandler = (ctx) => {
	const p = params<RechargeGiftParams>(ctx, 'rechargeGift')
	return ok({
		typelist: CHANNELS.map((c, index) => ({
			payID: c.payID,
			payTypeID: c.payTypeID,
			payName: channelName(ctx, c),
			typeName: channelName(ctx, c),
			payNameUrl: c.icon,
			payNameUrl2: c.icon,
			minPrice: c.quickAmounts[0],
			maxPrice: c.quickAmounts[c.quickAmounts.length - 1] * 10,
			scope: '',
			paySysName: c.en,
			maxRechargeRifts: giftRateOf(p, index),
			vipRechargeRate: vipRateOf(p, index),
		})),
	})
}

/** GetRechargeTypes：选中大类下的具体渠道；quickConfigList 的 giftAmount 是各快捷金额对应的首充赠送额 */
const getRechargeTypes: MockHandler = (ctx) => {
	const requestedIndex = CHANNELS.findIndex((c) => c.payID === Number(ctx.body.payid))
	const index = requestedIndex === -1 ? 0 : requestedIndex
	const channel = CHANNELS[index]
	const p = params<RechargeGiftParams>(ctx, 'rechargeGift')
	const giftRate = giftRateOf(p, index)
	const quickConfigList = channel.quickAmounts.map((rechargeAmount) => ({
		rechargeAmount,
		giftAmount: p.quickGift ? Number((rechargeAmount * giftRate).toFixed(2)) : 0,
	}))
	return ok({
		rechargetypelist: [
			{
				delayedRewardDays: p.delayDays,
				paySysName: channel.en,
				payTypeID: channel.payTypeID,
				payID: channel.payID,
				payName: channelName(ctx, channel),
				miniPrice: channel.quickAmounts[0],
				maxPrice: channel.quickAmounts[channel.quickAmounts.length - 1] * 10,
				scope: '',
				paySendUrl: '',
				parameters: '',
				startTime: '',
				endTime: '',
				rechargeRifts: giftRate,
				c2cUnitAmount: 0,
				quickConfigList,
				serviceFeeRate: 0,
				newRechargeRiftRate: giftRate,
			},
		],
		banklist: [],
		localUsdtlist: [],
		thirdPayBankList: [],
	})
}

/** GetRechargeRecord：充值页内嵌的最近充值记录 */
const getRechargeRecord: MockHandler = (ctx) => {
	const { records } = params<RechargeGiftParams>(ctx, 'rechargeGift')
	return ok(paged(records ? buildRechargeRecords(ctx) : [], ctx.body))
}

/** ThirdPay：实际提交充值（payTypeID ≥ 10000 均走这里），原型环境不做真实支付 */
const thirdPay: MockHandler = (ctx) =>
	fail(pick(ctx, '原型环境不支持真实充值', 'Real recharge is not supported in this prototype', 'इस प्रोटोटाइप में असली रिचार्ज समर्थित नहीं है'))

/** 充值页（首充赠送展示）的接口假数据 */
export const rechargeRoutes: MockRoutes = {
	[api.GetBalance]: getBalance,
	[api.GetPayTypeName]: getPayTypeName,
	[api.GetRechargeTypes]: getRechargeTypes,
	[api.GetRechargeRecord]: getRechargeRecord,
	[api.ThirdPay]: thirdPay,
}
