import dayjs from 'dayjs'
import api from '@/api/url'
import { pick } from '../i18n'
import { fail, ok, paged } from '../envelope'
import { params } from '../scenario'
import { featureState } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** "我"在积分抽奖参与者名单里的手机号（虚构），用于从全部参与者里挑出"我"的记录 */
const SELF_NAME = '9198765432'

/** pointMall 活动的参数，声明见 catalog.json */
interface PointMallParams {
	enabled: boolean
	points: number
	stock: 'normal' | 'partial' | 'all'
	orders: 'default' | 'empty'
	address: boolean
}

/** pointLottery 活动的参数，声明见 catalog.json */
interface PointLotteryParams {
	current: 'few' | 'almost' | 'none'
	drawn: 'won' | 'shipped' | 'lost' | 'absent'
	upcoming: boolean
}

/** 商城商品静态目录：typeId 1 实物、2 虚拟，各 3 个；库存与已兑换数量是会话可变数据，见 PointMallState.products */
interface ProductMeta {
	productID: number
	typeId: number
	zh: string
	en: string
	hd: string
	integral: number
	img: string
	initialStock: number
	initialGrandTotal: number
}

const PRODUCT_CATALOG: ProductMeta[] = [
	{ productID: 3001, typeId: 1, zh: '无线蓝牙耳机', en: 'Wireless Bluetooth Earbuds', hd: 'वायरलेस ब्लूटूथ ईयरबड्स', integral: 500, img: 'mock-img/point-physical.svg', initialStock: 20, initialGrandTotal: 35 },
	{ productID: 3002, typeId: 1, zh: '不锈钢保温杯', en: 'Stainless Steel Tumbler', hd: 'स्टेनलेस स्टील टम्बलर', integral: 200, img: 'mock-img/point-physical.svg', initialStock: 50, initialGrandTotal: 120 },
	{ productID: 3003, typeId: 1, zh: '拉杆行李箱', en: 'Rolling Suitcase', hd: 'रोलिंग सूटकेस', integral: 1000, img: 'mock-img/point-physical.svg', initialStock: 5, initialGrandTotal: 8 },
	{ productID: 3004, typeId: 2, zh: '话费直充 ₹50', en: '₹50 Mobile Top-up', hd: '₹50 मोबाइल टॉप-अप', integral: 300, img: 'mock-img/point-virtual.svg', initialStock: 999, initialGrandTotal: 210 },
	{ productID: 3005, typeId: 2, zh: '购物代金券 ₹100', en: '₹100 Shopping Voucher', hd: '₹100 शॉपिंग वाउचर', integral: 600, img: 'mock-img/point-virtual.svg', initialStock: 200, initialGrandTotal: 76 },
	{ productID: 3006, typeId: 2, zh: 'VIP 经验加速卡', en: 'VIP EXP Booster Card', hd: 'VIP अनुभव बूस्टर कार्ड', integral: 150, img: 'mock-img/point-virtual.svg', initialStock: 999, initialGrandTotal: 430 },
]

/** 库存售罄的商品 ID：控制台"商品售罄"边界场景只清空拉杆行李箱 */
const SUITCASE_PRODUCT_ID = 3003

/** GetProductRules：投注满额兑换积分比例，纯数字字段，无文案，不需要 pick() */
const PRODUCT_RULES = [
	{ lotteryAmount: 100, exchange_Rate: 0.01 },
	{ lotteryAmount: 500, exchange_Rate: 0.012 },
	{ lotteryAmount: 1000, exchange_Rate: 0.015 },
	{ lotteryAmount: 5000, exchange_Rate: 0.02 },
]

/**
 * 积分抽奖静态目录：3 场，覆盖进行中 / 已开奖 / 未开始三种状态。
 * status 与 Treasure.vue 的 getStatus() 一致：'1' 进行中、'0' 已开奖、'2' 未开始。
 * 中奖彩票号由 pointLottery 参数决定（见 winningNumberOf），不是静态数据，不在这里声明。
 */
interface LotteryMeta {
	pointsLotteryID: number
	zh: string
	en: string
	hd: string
	detailZh: string
	detailEn: string
	detailHd: string
	status: '0' | '1' | '2'
	/** 每张彩票消耗的积分 */
	unit: number
	totalNumber: number
	startTime: string
	endTime: string
	issueNumber: string
	img: string
}

const LOTTERY_CATALOG: LotteryMeta[] = [
	{
		pointsLotteryID: 5001,
		zh: '冲锋衣夹克抽奖',
		en: 'Windbreaker Jacket Draw',
		hd: 'विंडब्रेकर जैकेट ड्रॉ',
		detailZh: '每张彩票消耗积分参与抽奖，开奖后随机抽取 1 位幸运用户获得冲锋衣夹克 1 件。',
		detailEn: 'Each ticket costs points to enter. One lucky winner will be drawn to receive a windbreaker jacket.',
		detailHd: 'भाग लेने के लिए हर टिकट पर अंक खर्च होते हैं। ड्रॉ के बाद एक भाग्यशाली विजेता को विंडब्रेकर जैकेट मिलेगी।',
		status: '1',
		unit: 10,
		totalNumber: 50,
		startTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
		endTime: dayjs().add(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
		issueNumber: 'QF20260919001',
		img: 'mock-img/point-lottery.svg',
	},
	{
		pointsLotteryID: 5002,
		zh: '智能手表抽奖',
		en: 'Smart Watch Draw',
		hd: 'स्मार्ट वॉच ड्रॉ',
		detailZh: '每张彩票消耗积分参与抽奖，开奖后随机抽取 1 位幸运用户获得智能手表 1 台。',
		detailEn: 'Each ticket costs points to enter. One lucky winner will be drawn to receive a smart watch.',
		detailHd: 'भाग लेने के लिए हर टिकट पर अंक खर्च होते हैं। ड्रॉ के बाद एक भाग्यशाली विजेता को स्मार्ट वॉच मिलेगी।',
		status: '0',
		unit: 20,
		totalNumber: 40,
		startTime: dayjs().subtract(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
		endTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
		issueNumber: 'QF20260911001',
		img: 'mock-img/point-lottery.svg',
	},
	{
		pointsLotteryID: 5003,
		zh: '黄金饰品抽奖',
		en: 'Gold Jewelry Draw',
		hd: 'सोने के आभूषण ड्रॉ',
		detailZh: '每张彩票消耗积分参与抽奖，开奖后随机抽取 1 位幸运用户获得黄金饰品 1 份。',
		detailEn: 'Each ticket costs points to enter. One lucky winner will be drawn to receive a gold jewelry set.',
		detailHd: 'भाग लेने के लिए हर टिकट पर अंक खर्च होते हैं। ड्रॉ के बाद एक भाग्यशाली विजेता को सोने के आभूषण मिलेंगे।',
		status: '2',
		unit: 50,
		totalNumber: 20,
		startTime: dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
		endTime: dayjs().add(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
		issueNumber: 'QF20260928001',
		img: 'mock-img/point-lottery.svg',
	},
]

/** 商品订单：state 0 待发货、1 已发货、2 已完成、3 已取消，对应 OrderDetail/index.vue 的 statusText() */
interface MallOrder {
	orderId: number
	orderNumber: string
	/** 与商品 typeId 一致：1 实物（可取消）、2 虚拟；OrderDetail 的 OrderCancel 在 orderType 为 2 时隐藏取消按钮 */
	orderType: number
	productID: number
	/** 下单时总积分（单价 × 数量），取消时原额退回 */
	integral: number
	counts: number
	state: number
	addTime: string
	upTime: string
}

/** 收货地址，字段与前端 UserAddress（src/types/api）一致 */
interface MallAddress {
	addressId: number
	name: string
	phone: string
	area: string
	address: string
	defaultAddress: boolean
}

/** 积分抽奖参与记录：一次 JoinPointsLottery 为一条；userName 为 SELF_NAME 时代表"我" */
interface LotteryEntry {
	id: number
	pointsLotteryID: number
	userName: string
	addTime: string
	tickets: string[]
	/** 中奖后是否已领取实物：0 未领取、1 已领取；仅 userName 为 SELF_NAME 且中奖时有意义 */
	shippingStatus: number
}

/**
 * 积分明细：type 0 彩票投注返积分、3 积分商城消费（兑换商品或参与抽奖）、5 取消兑换退还。
 * integral 恒为正数（消费与收入的正负号、颜色由 Record/index.vue 按 type 自行渲染，不在数值里体现）。
 */
interface IntegralLog {
	addTime: string
	integral: number
	orderNumber: string
	type: number
	productID?: number
	pointsLotteryID?: number
}

/** pointMall 功能的会话数据 */
interface PointMallState {
	/** 积分余额，初始值取自 points 参数；session.ts 的 GetUserInfo 会读取这里的 points 作为 userInfo.integral 返回，商城页面顶部显示的积分因此随兑换商品、参与积分抽奖同步增减 */
	points: number
	products: { productID: number; stock: number; grandTotal: number }[]
	orders: MallOrder[]
	/** 商城自己的单一收货地址（无地址簿概念，只有 Get/Update）；未设置时为 null */
	productAddress: MallAddress | null
	logs: IntegralLog[]
}

/** pointLottery 功能的会话数据 */
interface PointLotteryState {
	lotteryEntries: LotteryEntry[]
	/** 各场次的中奖彩票号，键为 pointsLotteryID；空字符串表示尚未开奖 */
	winningNumbers: Record<number, string>
	lotteryAddresses: MallAddress[]
}

/**
 * 生成连续编号的彩票号。
 *
 * @param lotteryId - 抽奖活动 ID。
 * @param from - 起始序号（从 1 开始）。
 * @param count - 生成数量。
 * @returns 形如 `5001-000001` 的彩票号数组。
 */
function makeTickets(lotteryId: number, from: number, count: number): string[] {
	return Array.from({ length: count }, (_, i) => `${lotteryId}-${String(from + i).padStart(6, '0')}`)
}

const nextOrderId = (orders: MallOrder[]): number => Math.max(9000, ...orders.map((o) => o.orderId)) + 1
const nextAddressId = (list: MallAddress[]): number => Math.max(0, ...list.map((a) => a.addressId)) + 1
const nextEntryId = (entries: LotteryEntry[]): number => Math.max(6000, ...entries.map((e) => e.id)) + 1

/**
 * 读取或初始化积分商城的会话数据。
 *
 * @remarks 导出供 session.ts 的 GetUserInfo 读取 `points` 作为 `integral` 返回，
 * 使积分商城页面顶部显示的积分余额随兑换商品、参与积分抽奖联动变化；参与积分抽奖时
 * pointLottery 的处理函数也会跨活动写这里的 `points`、`logs`。
 * @param ctx - 请求上下文。
 * @returns 可直接修改的会话数据；adapter 会在处理后统一持久化。
 */
export function pointMallState(ctx: MockContext): PointMallState {
	return featureState(ctx, 'pointMall', () => {
		const p = params<PointMallParams>(ctx, 'pointMall')
		const products = PRODUCT_CATALOG.map((meta) => ({
			productID: meta.productID,
			stock: p.stock === 'all' || (p.stock === 'partial' && meta.productID === SUITCASE_PRODUCT_ID) ? 0 : meta.initialStock,
			grandTotal: meta.initialGrandTotal,
		}))
		const productAddress: MallAddress | null = !p.address
			? null
			: { addressId: 1, name: '张伟', phone: '9876543210', area: '91', address: '孟买市安得里区示例路 88 号', defaultAddress: true }
		if (p.orders === 'empty') return { points: p.points, products, orders: [], productAddress, logs: [] }

		const t9001 = dayjs().subtract(5, 'day')
		const no9001 = `PM${t9001.format('YYYYMMDDHHmmss')}9001`
		const t9002 = dayjs().subtract(1, 'day')
		const no9002 = `PM${t9002.format('YYYYMMDDHHmmss')}9002`
		return {
			points: p.points,
			products,
			orders: [
				{
					orderId: 9002,
					orderNumber: no9002,
					orderType: 1,
					productID: 3002,
					integral: 200,
					counts: 1,
					state: 0,
					addTime: t9002.format('YYYY-MM-DD HH:mm:ss'),
					upTime: t9002.format('YYYY-MM-DD HH:mm:ss'),
				},
				{
					orderId: 9001,
					orderNumber: no9001,
					orderType: 2,
					productID: 3006,
					integral: 150,
					counts: 1,
					state: 2,
					addTime: t9001.format('YYYY-MM-DD HH:mm:ss'),
					upTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
				},
			],
			productAddress,
			logs: [
				{ type: 3, integral: 200, addTime: t9002.format('YYYY-MM-DD HH:mm:ss'), orderNumber: no9002, productID: 3002 },
				{ type: 0, integral: 60, addTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'), orderNumber: '' },
				{ type: 3, integral: 150, addTime: t9001.format('YYYY-MM-DD HH:mm:ss'), orderNumber: no9001, productID: 3006 },
				{ type: 0, integral: 90, addTime: dayjs().subtract(6, 'day').format('YYYY-MM-DD HH:mm:ss'), orderNumber: '' },
			],
		}
	})
}

/**
 * 读取或初始化积分抽奖的会话数据：场次 5001（进行中）的其他人参与份数、场次 5002（已开奖）"我"的参与与中奖结果，
 * 均由 pointLottery 参数生成；收货地址簿固定两条种子数据，随本活动一起重置。
 *
 * @param ctx - 请求上下文。
 * @returns 可直接修改的会话数据；adapter 会在处理后统一持久化。
 */
function pointLotteryState(ctx: MockContext): PointLotteryState {
	return featureState(ctx, 'pointLottery', () => {
		const p = params<PointLotteryParams>(ctx, 'pointLottery')
		const entries: LotteryEntry[] = []
		let nextId = 6001
		const addEntry = (pointsLotteryID: number, userName: string, daysAgo: number, tickets: string[], shippingStatus = 0) => {
			entries.push({
				id: nextId++,
				pointsLotteryID,
				userName,
				addTime: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD HH:mm:ss'),
				tickets,
				shippingStatus,
			})
		}

		if (p.current !== 'none') {
			const sold = p.current === 'almost' ? 49 : 6
			const mine = Math.ceil(sold / 2)
			addEntry(5001, '9876543210', 3, makeTickets(5001, 1, mine))
			if (sold > mine) addEntry(5001, '9123456780', 2, makeTickets(5001, mine + 1, sold - mine))
		}

		addEntry(5002, '9876543210', 9, makeTickets(5002, 1, 20))
		addEntry(5002, '9123456780', 8, makeTickets(5002, 21, 18))
		if (p.drawn !== 'absent') addEntry(5002, SELF_NAME, 7, makeTickets(5002, 39, 2), p.drawn === 'shipped' ? 1 : 0)

		return {
			lotteryEntries: entries,
			winningNumbers: {
				5001: '',
				5002: p.drawn === 'won' || p.drawn === 'shipped' ? '5002-000039' : '5002-000001',
				5003: '',
			},
			lotteryAddresses: [
				{ addressId: 1, name: '张伟', phone: '9876543210', area: '91', address: '孟买市安得里区示例路 88 号', defaultAddress: true },
				{ addressId: 2, name: '李娜', phone: '9123456780', area: '91', address: '德里市卡罗尔巴格示例街 12 号', defaultAddress: false },
			],
		}
	})
}

/**
 * 按 pointLottery 参数过滤当前可见的抽奖场次：`current` 为 `none` 时隐藏场次 5001，`drawn` 为 `absent` 时隐藏已开奖场次 5002，`upcoming` 为假时隐藏场次 5003。
 *
 * @param ctx - 请求上下文。
 * @returns 当前可见的抽奖活动静态信息。
 */
function visibleLotteries(ctx: MockContext): LotteryMeta[] {
	const p = params<PointLotteryParams>(ctx, 'pointLottery')
	return LOTTERY_CATALOG.filter((meta) => {
		if (meta.pointsLotteryID === 5001) return p.current !== 'none'
		if (meta.pointsLotteryID === 5002) return p.drawn !== 'absent'
		if (meta.pointsLotteryID === 5003) return p.upcoming
		return true
	})
}

/**
 * 读取某场抽奖当前的中奖彩票号。
 *
 * @param ctx - 请求上下文。
 * @param pointsLotteryID - 抽奖活动 ID。
 * @returns 中奖彩票号；尚未开奖时为空字符串。
 */
function winningNumberOf(ctx: MockContext, pointsLotteryID: number): string {
	return pointLotteryState(ctx).winningNumbers[pointsLotteryID] ?? ''
}

/**
 * 组装单个商品的返回字段（ProductItem.vue / Redeem.vue 读取）。
 *
 * @param ctx - 请求上下文。
 * @param meta - 商品静态信息。
 * @param mutable - 该商品的可变库存与已兑换数量。
 * @returns 商品字段。
 */
function toProduct(ctx: MockContext, meta: ProductMeta, mutable: { stock: number; grandTotal: number }) {
	return {
		productID: meta.productID,
		typeId: meta.typeId,
		productName: pick(ctx, meta.zh, meta.en, meta.hd),
		productImg: meta.img,
		integral: meta.integral,
		stock: mutable.stock,
		grandTotal: mutable.grandTotal,
	}
}

/**
 * 组装单条商品订单的返回字段（MyOrders 与 OrderDetail 共用）。
 *
 * @param ctx - 请求上下文。
 * @param order - 订单会话数据。
 * @returns OrderItem 字段，另附 orderId / orderType 供 MyOrders 点击跳转详情使用。
 */
function toOrderItem(ctx: MockContext, order: MallOrder) {
	const meta = PRODUCT_CATALOG.find((m) => m.productID === order.productID)
	return {
		orderId: order.orderId,
		orderNumber: order.orderNumber,
		orderType: order.orderType,
		productImg: meta?.img ?? '',
		productName: meta ? pick(ctx, meta.zh, meta.en, meta.hd) : '',
		integral: order.integral,
		counts: order.counts,
		state: order.state,
		addTime: order.addTime,
	}
}

/**
 * 组装单场积分抽奖的返回字段（列表与详情共用）。
 *
 * @param ctx - 请求上下文。
 * @param meta - 抽奖活动静态信息。
 * @param entries - 全部会话参与记录，用于聚合出 users 名单与 redeemedNumber。
 * @returns PointItem 字段。
 */
function toLotteryItem(ctx: MockContext, meta: LotteryMeta, entries: LotteryEntry[]) {
	const rows = entries.filter((e) => e.pointsLotteryID === meta.pointsLotteryID)
	const byUser = new Map<string, LotteryEntry[]>()
	rows.forEach((e) => byUser.set(e.userName, [...(byUser.get(e.userName) ?? []), e]))
	const users = [...byUser.entries()].map(([userName, list]) => ({
		userName,
		orderInfoList: list.map((e) => ({ addTime: e.addTime, ticketsInfoList: e.tickets.map((t) => ({ ticketNumber: t })) })),
	}))
	const redeemedNumber = rows.reduce((sum, e) => sum + e.tickets.length, 0)
	return {
		pointsLotteryID: meta.pointsLotteryID,
		name: pick(ctx, meta.zh, meta.en, meta.hd),
		status: meta.status,
		unit: meta.unit,
		totalNumber: meta.totalNumber,
		redeemedNumber,
		startTime: meta.startTime,
		endTime: meta.endTime,
		issueNumber: meta.issueNumber,
		winningNumber: winningNumberOf(ctx, meta.pointsLotteryID),
		details: pick(ctx, meta.detailZh, meta.detailEn, meta.detailHd),
		img_One: meta.img,
		img_Two: '',
		img_Three: '',
		img_Four: '',
		img_Five: '',
		users,
	}
}

/**
 * 计算"我"某一条抽奖参与记录相对该活动的状态。
 *
 * @param ctx - 请求上下文。
 * @param entry - 参与记录。
 * @param meta - 对应抽奖活动的静态信息。
 * @returns 0 进行中（未开奖）、1 已开奖未中奖、2 已中奖，对应 MyLottery/index.vue 的 getStatus()。
 */
function myOrderStatus(ctx: MockContext, entry: LotteryEntry, meta: LotteryMeta): number {
	if (meta.status !== '0') return 0
	return entry.tickets.includes(winningNumberOf(ctx, meta.pointsLotteryID)) ? 2 : 1
}

/**
 * 组装"我的抽奖"单条记录。
 *
 * @param ctx - 请求上下文。
 * @param entry - 我的参与记录。
 * @param allEntries - 全部会话参与记录，用于同时组装 lotteryInfo 里的完整参与者名单。
 * @returns MyPointItem 字段。
 */
function toMyPointItem(ctx: MockContext, entry: LotteryEntry, allEntries: LotteryEntry[]) {
	const meta = LOTTERY_CATALOG.find((m) => m.pointsLotteryID === entry.pointsLotteryID)!
	return {
		userID: 10086,
		userName: SELF_NAME,
		orderInfo: { orderStatus: myOrderStatus(ctx, entry, meta), pointsLotteryOrdersID: entry.id, shippingStatus: entry.shippingStatus },
		lotteryInfo: toLotteryItem(ctx, meta, allEntries),
		ticketsInfo: entry.tickets.map((t) => ({ ticketNumber: t })),
	}
}

/** 按商品 ID 取当前语言下的商品名，供积分明细拼接备注文案 */
function productName(ctx: MockContext, productID?: number): string {
	const meta = PRODUCT_CATALOG.find((m) => m.productID === productID)
	return meta ? pick(ctx, meta.zh, meta.en, meta.hd) : ''
}

/** 按抽奖活动 ID 取当前语言下的活动名，供积分明细拼接备注文案 */
function lotteryName(ctx: MockContext, pointsLotteryID?: number): string {
	const meta = LOTTERY_CATALOG.find((m) => m.pointsLotteryID === pointsLotteryID)
	return meta ? pick(ctx, meta.zh, meta.en, meta.hd) : ''
}

/**
 * 组装积分明细单条的备注文案。
 *
 * @param ctx - 请求上下文。
 * @param log - 积分明细记录。
 * @returns Record/index.vue 展示的备注文案。
 */
function logRemark(ctx: MockContext, log: IntegralLog): string {
	if (log.type === 3 && log.productID !== undefined) return pick(ctx, '积分兑换：', 'Redeemed: ', 'अंक विनिमय: ') + productName(ctx, log.productID)
	if (log.type === 3 && log.pointsLotteryID !== undefined) return pick(ctx, '参与积分抽奖：', 'Joined lottery: ', 'लॉटरी में भाग लिया: ') + lotteryName(ctx, log.pointsLotteryID)
	if (log.type === 5) return pick(ctx, '取消兑换退还：', 'Cancel refund: ', 'विनिमय रद्द वापसी: ') + productName(ctx, log.productID)
	return pick(ctx, '彩票投注返积分', 'Points earned from lottery bets', 'लॉटरी दांव से अर्जित अंक')
}

/** GetBannerTypeList：商品分类 + 积分抽奖入口；typeID 为 '1000' 时前端会把 typeName 替换成"我的宝藏" */
const getBannerTypeList: MockHandler = (ctx) =>
	ok({
		bannerList: [],
		productTypeList: [
			{ typeID: 1, typeName: pick(ctx, '实物商品', 'Physical Goods', 'भौतिक सामान') },
			{ typeID: 2, typeName: pick(ctx, '虚拟商品', 'Virtual Goods', 'वर्चुअल सामान') },
			{ typeID: '1000', typeName: '' },
		],
	})

/** GetProductList：按 typeId 筛选商品（分页），typeId 未传或非法时返回全部 */
const getProductList: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	const typeId = Number(ctx.body.typeId)
	const items = PRODUCT_CATALOG.filter((meta) => !typeId || meta.typeId === typeId).map((meta) =>
		toProduct(ctx, meta, s.products.find((p) => p.productID === meta.productID)!)
	)
	return ok(paged(items, ctx.body))
}

/** GetPointsLotteryList：按 status 筛选积分抽奖（分页），-1 或未传为全部 */
const getPointsLotteryList: MockHandler = (ctx) => {
	const entries = pointLotteryState(ctx).lotteryEntries
	const status = ctx.body.status
	const metas = status === undefined || Number(status) === -1 ? visibleLotteries(ctx) : visibleLotteries(ctx).filter((m) => m.status === String(status))
	return ok(paged(metas.map((meta) => toLotteryItem(ctx, meta, entries)), ctx.body))
}

/** GetPointsLotteryDetails：按 pointLotteryID 取单场详情，包装成单条分页数据供 List 组件读取 */
const getPointsLotteryDetails: MockHandler = (ctx) => {
	const meta = visibleLotteries(ctx).find((m) => m.pointsLotteryID === Number(ctx.body.pointLotteryID))
	const items = meta ? [toLotteryItem(ctx, meta, pointLotteryState(ctx).lotteryEntries)] : []
	return ok(paged(items, ctx.body))
}

/** JoinPointsLottery：参与积分抽奖，扣积分、生成彩票号；活动不存在/未在进行中/份数不足/积分不足时返回业务失败 */
const joinPointsLottery: MockHandler = (ctx) => {
	const meta = visibleLotteries(ctx).find((m) => m.pointsLotteryID === Number(ctx.body.pointsLotteryID))
	if (!meta) return fail(pick(ctx, '抽奖活动不存在', 'Lottery draw not found', 'लॉटरी ड्रॉ नहीं मिला'))
	if (meta.status !== '1') return fail(pick(ctx, '活动未在进行中', 'This draw is not open for entries', 'यह ड्रॉ अभी उपलब्ध नहीं है'))
	const s = pointLotteryState(ctx)
	const counts = Math.max(1, Number(ctx.body.counts) || 1)
	const sold = s.lotteryEntries.filter((e) => e.pointsLotteryID === meta.pointsLotteryID).reduce((sum, e) => sum + e.tickets.length, 0)
	if (sold + counts > meta.totalNumber) return fail(pick(ctx, '剩余份数不足', 'Not enough tickets left', 'पर्याप्त टिकट शेष नहीं हैं'))
	const cost = meta.unit * counts
	const wallet = pointMallState(ctx)
	if (wallet.points < cost) return fail(pick(ctx, '积分不足', 'Insufficient points', 'पर्याप्त अंक नहीं हैं'))
	wallet.points -= cost
	const tickets = makeTickets(meta.pointsLotteryID, sold + 1, counts)
	s.lotteryEntries.push({
		id: nextEntryId(s.lotteryEntries),
		pointsLotteryID: meta.pointsLotteryID,
		userName: SELF_NAME,
		addTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
		tickets,
		shippingStatus: 0,
	})
	wallet.logs.unshift({ type: 3, integral: cost, addTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), orderNumber: '', pointsLotteryID: meta.pointsLotteryID })
	return ok(tickets.map((t) => ({ ticketNumber: t })))
}

/** GetPointsLotteryOrderList："我参与的"积分抽奖（分页），按 orderStatus 筛选，-1 或未传为全部 */
const getPointsLotteryOrderList: MockHandler = (ctx) => {
	const s = pointLotteryState(ctx)
	const status = ctx.body.orderStatus
	const items = s.lotteryEntries
		.filter((e) => e.userName === SELF_NAME)
		.map((entry) => toMyPointItem(ctx, entry, s.lotteryEntries))
		.filter((item) => status === undefined || Number(status) === -1 || item.orderInfo.orderStatus === Number(status))
	return ok(paged(items, ctx.body))
}

/** GetPrize：领取中奖实物；订单不存在/未中奖/已领取时返回业务失败 */
const getPrize: MockHandler = (ctx) => {
	const s = pointLotteryState(ctx)
	const orderId = Number(ctx.body.orderId)
	const entry = s.lotteryEntries.find((e) => e.id === orderId && e.userName === SELF_NAME)
	if (!entry) return fail(pick(ctx, '抽奖订单不存在', 'Entry not found', 'प्रविष्टि नहीं मिली'))
	const meta = LOTTERY_CATALOG.find((m) => m.pointsLotteryID === entry.pointsLotteryID)
	if (!meta || myOrderStatus(ctx, entry, meta) !== 2) return fail(pick(ctx, '未中奖，无法领取', 'This entry did not win', 'यह प्रविष्टि विजेता नहीं है'))
	if (entry.shippingStatus > 0) return fail(pick(ctx, '奖品已领取', 'Prize already claimed', 'पुरस्कार पहले ही प्राप्त हो चुका है'))
	entry.shippingStatus = 1
	return ok(null)
}

/** GetProductOrderList：商品订单列表（分页） */
const getProductOrderList: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	return ok(paged(s.orders.map((order) => toOrderItem(ctx, order)), ctx.body))
}

/** GetProductOrderDetails：按 orderId（找不到时退化为 orderNumber）取订单详情，附 upTime */
const getProductOrderDetails: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	const orderId = Number(ctx.body.orderId)
	const order = s.orders.find((o) => o.orderId === orderId) ?? s.orders.find((o) => o.orderNumber === ctx.body.orderNumber)
	if (!order) return fail(pick(ctx, '订单不存在', 'Order not found', 'ऑर्डर नहीं मिला'))
	return ok({ ...toOrderItem(ctx, order), upTime: order.upTime })
}

/** CancelOrderData：取消待发货订单并退回积分；订单不存在、虚拟商品订单或状态不是待发货时返回业务失败 */
const cancelOrderData: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	const order = s.orders.find((o) => o.orderNumber === ctx.body.orderNumber)
	if (!order) return fail(pick(ctx, '订单不存在', 'Order not found', 'ऑर्डर नहीं मिला'))
	if (order.orderType === 2) return fail(pick(ctx, '虚拟商品订单不可取消', 'Virtual goods orders cannot be canceled', 'वर्चुअल सामान के ऑर्डर रद्द नहीं किए जा सकते'))
	if (order.state !== 0) return fail(pick(ctx, '订单状态不支持取消', 'This order cannot be canceled', 'यह ऑर्डर रद्द नहीं किया जा सकता'))
	order.state = 3
	order.upTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
	s.points += order.integral
	s.logs.unshift({ type: 5, integral: order.integral, addTime: order.upTime, orderNumber: order.orderNumber, productID: order.productID })
	return ok(null)
}

/** SetProductOrder：兑换商品下单，扣积分、生成订单并保存本次填写的收货地址；商品不存在/库存不足/积分不足时返回业务失败 */
const setProductOrder: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	const meta = PRODUCT_CATALOG.find((m) => m.productID === Number(ctx.body.productid))
	if (!meta) return fail(pick(ctx, '商品不存在', 'Product not found', 'उत्पाद नहीं मिला'))
	const mutable = s.products.find((p) => p.productID === meta.productID)!
	const counts = Math.max(1, Number(ctx.body.counts) || 1)
	if (mutable.stock < counts) return fail(pick(ctx, '库存不足', 'Not enough stock', 'पर्याप्त स्टॉक नहीं है'))
	const cost = meta.integral * counts
	if (s.points < cost) return fail(pick(ctx, '积分不足', 'Insufficient points', 'पर्याप्त अंक नहीं हैं'))
	s.points -= cost
	mutable.stock -= counts
	mutable.grandTotal += counts
	s.productAddress = {
		addressId: 1,
		name: String(ctx.body.name ?? ''),
		phone: String(ctx.body.phone ?? ''),
		area: String(ctx.body.area ?? ''),
		address: String(ctx.body.address ?? ''),
		defaultAddress: true,
	}
	const now = dayjs()
	const orderId = nextOrderId(s.orders)
	s.orders.unshift({
		orderId,
		orderNumber: `PM${now.format('YYYYMMDDHHmmss')}${orderId}`,
		orderType: meta.typeId,
		productID: meta.productID,
		integral: cost,
		counts,
		// 虚拟商品无需发货，直接完成（与种子数据里已完成的虚拟订单 9001 状态一致）；实物商品维持待发货
		state: meta.typeId === 2 ? 2 : 0,
		addTime: now.format('YYYY-MM-DD HH:mm:ss'),
		upTime: now.format('YYYY-MM-DD HH:mm:ss'),
	})
	s.logs.unshift({ type: 3, integral: cost, addTime: now.format('YYYY-MM-DD HH:mm:ss'), orderNumber: s.orders[0].orderNumber, productID: meta.productID })
	return ok(null)
}

/** GetUserAddress：商城收货地址只有一份，忽略 orderId/orderType，未设置时返回 null（不是业务失败，避免误报错误提示） */
const getUserAddress: MockHandler = (ctx) => ok(pointMallState(ctx).productAddress)

/** UpdateUserAddress：新增或更新商城收货地址（无地址簿，视为覆盖） */
const updateUserAddress: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	s.productAddress = {
		addressId: 1,
		name: String(ctx.body.userName ?? ''),
		phone: String(ctx.body.phoneNumber ?? ''),
		area: String(ctx.body.area ?? ''),
		address: String(ctx.body.address ?? ''),
		defaultAddress: true,
	}
	return ok(s.productAddress)
}

/** GetPointLotteryUserAddress：积分抽奖收货地址簿（数组，不分页） */
const getPointLotteryUserAddress: MockHandler = (ctx) => ok(pointLotteryState(ctx).lotteryAddresses)

/** AddPointsLotteryUserAddress：新增积分抽奖收货地址；首条自动设为默认 */
const addPointsLotteryUserAddress: MockHandler = (ctx) => {
	const s = pointLotteryState(ctx)
	s.lotteryAddresses.push({
		addressId: nextAddressId(s.lotteryAddresses),
		name: String(ctx.body.name ?? ''),
		phone: String(ctx.body.phone ?? ''),
		area: String(ctx.body.area ?? ''),
		address: String(ctx.body.address ?? ''),
		defaultAddress: s.lotteryAddresses.length === 0,
	})
	return ok(null)
}

/** UpdatePointLotteryUserAddress：按 userAddressId 更新积分抽奖收货地址 */
const updatePointLotteryUserAddress: MockHandler = (ctx) => {
	const s = pointLotteryState(ctx)
	const item = s.lotteryAddresses.find((a) => a.addressId === Number(ctx.body.userAddressId))
	if (!item) return fail(pick(ctx, '地址不存在', 'Address not found', 'पता नहीं मिला'))
	item.name = String(ctx.body.name ?? item.name)
	item.phone = String(ctx.body.phone ?? item.phone)
	item.area = String(ctx.body.area ?? item.area)
	item.address = String(ctx.body.address ?? item.address)
	return ok(null)
}

/** SetDefaultPointsLotteryUserAddress：将某地址设为默认，其余取消默认 */
const setDefaultPointsLotteryUserAddress: MockHandler = (ctx) => {
	const s = pointLotteryState(ctx)
	const addressId = Number(ctx.body.addressId)
	if (!s.lotteryAddresses.some((a) => a.addressId === addressId)) return fail(pick(ctx, '地址不存在', 'Address not found', 'पता नहीं मिला'))
	s.lotteryAddresses.forEach((a) => (a.defaultAddress = a.addressId === addressId))
	return ok(null)
}

/** DeletePointsLotteryUserAddress：删除积分抽奖收货地址（默认地址的重新指定由前端 usePointLottery.hook.ts 的 getAddress() 兜底） */
const deletePointsLotteryUserAddress: MockHandler = (ctx) => {
	const s = pointLotteryState(ctx)
	const addressId = Number(ctx.body.addressId)
	const index = s.lotteryAddresses.findIndex((a) => a.addressId === addressId)
	if (index === -1) return fail(pick(ctx, '地址不存在', 'Address not found', 'पता नहीं मिला'))
	s.lotteryAddresses.splice(index, 1)
	return ok(null)
}

/** GetIntegralLogList：积分明细（分页），按 type 与日期区间筛选 */
const getIntegralLogList: MockHandler = (ctx) => {
	const s = pointMallState(ctx)
	const type = ctx.body.type
	const startDate = ctx.body.startDate
	const endDate = ctx.body.endDate
	const items = s.logs
		.filter((log) => type === undefined || Number(type) === -1 || log.type === Number(type))
		.filter((log) => !startDate || log.addTime >= String(startDate))
		.filter((log) => !endDate || log.addTime <= String(endDate))
		.map((log) => ({ addTime: log.addTime, integral: log.integral, orderNumber: log.orderNumber, type: log.type, remarks: logRemark(ctx, log) }))
	return ok(paged(items, ctx.body))
}

/** 积分商城与积分抽奖的接口假数据 */
export const pointMallRoutes: MockRoutes = {
	[api.GetPointMallState]: (ctx) => ok({ state: params<PointMallParams>(ctx, 'pointMall').enabled ? 1 : 0 }),
	[api.GetBannerTypeList]: getBannerTypeList,
	[api.GetPointsLotteryList]: getPointsLotteryList,
	[api.GetPointsLotteryDetails]: getPointsLotteryDetails,
	[api.JoinPointsLottery]: joinPointsLottery,
	[api.GetPointsLotteryOrderList]: getPointsLotteryOrderList,
	[api.GetPrize]: getPrize,
	[api.GetProductList]: getProductList,
	[api.GetProductRules]: () => ok(PRODUCT_RULES),
	[api.GetProductOrderList]: getProductOrderList,
	[api.GetProductOrderDetails]: getProductOrderDetails,
	[api.CancelOrderData]: cancelOrderData,
	[api.SetProductOrder]: setProductOrder,
	[api.GetUserAddress]: getUserAddress,
	[api.UpdateUserAddress]: updateUserAddress,
	[api.GetPointLotteryUserAddress]: getPointLotteryUserAddress,
	[api.AddPointsLotteryUserAddress]: addPointsLotteryUserAddress,
	[api.UpdatePointLotteryUserAddress]: updatePointLotteryUserAddress,
	[api.SetDefaultPointsLotteryUserAddress]: setDefaultPointsLotteryUserAddress,
	[api.DeletePointsLotteryUserAddress]: deletePointsLotteryUserAddress,
	[api.GetIntegralLogList]: getIntegralLogList,
}
