import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** arbWithdraw 活动参数（catalog.json `activities.arbWithdraw.params`） */
interface ArbWithdrawParams {
	/** 活动开关；关闭时不返回 arbWithdrawRecommand，页面不弹推荐弹窗，ARB 卡片也没有赠送角标 */
	enabled: boolean
	/** 平台提现赠送比例（%），即账变 126“提现活动奖励”；页面直接拼接 `%` 显示，不做换算 */
	giftPercent: number
	/** ARB 钱包赠送比例（%），同上 */
	arbGiftPercent: number
}

/**
 * 提现方式。withdrawID 是页面的业务编号，页面按编号分支渲染，不能改号：
 * 1 银行卡（银行卡信息 + 金额输入），2 UPI（UPI 账户卡片 + 快捷金额），21 ARB 钱包（顶部大卡片、赠送角标、ARB 提现区）。
 */
interface WithdrawType {
	withdrawID: number
	zh: string
	en: string
	hd: string
	/** 图标（通用图标，不含真实品牌标志） */
	icon: string
	/** 单笔提现范围（₹） */
	minPrice: number
	maxPrice: number
	/** 手续费率（小数），只对 withMinPrice～withMaxPrice 之间的金额收取；0 表示免手续费 */
	fee: number
	withMinPrice: number
	withMaxPrice: number
	/** 快捷金额，逗号分隔；页面只在 UPI 下显示 */
	recommandWithAmount?: string
}

const BANK: WithdrawType = { withdrawID: 1, zh: '银行卡', en: 'Bank Card', hd: 'बैंक कार्ड', icon: 'mock-img/channel-card.svg', minPrice: 200, maxPrice: 50000, fee: 0, withMinPrice: 0, withMaxPrice: 0 }
const UPI: WithdrawType = { withdrawID: 2, zh: 'UPI', en: 'UPI', hd: 'UPI', icon: 'mock-img/channel-scan.svg', minPrice: 110, maxPrice: 20000, fee: 0.02, withMinPrice: 110, withMaxPrice: 999, recommandWithAmount: '500,1000,2000,5000' }
const ARB: WithdrawType = { withdrawID: 21, zh: 'ARB钱包', en: 'ARB Wallet', hd: 'ARB वॉलेट', icon: 'mock-img/channel-ewallet.svg', minPrice: 100, maxPrice: 100000, fee: 0, withMinPrice: 0, withMaxPrice: 0 }

/** 第一项是首次进入时默认选中的方式；银行卡在前，推荐弹窗的“去ARB提现”才有切换效果 */
const TYPES = [BANK, UPI, ARB]

/** 收款人姓名，对应 session.ts 的虚构用户（银行登记格式为全大写） */
const HOLDER = 'PROTOTYPE USER'

/** 虚构的 ARB 钱包地址 */
const ARB_ADDRESS = 'ARB-PROTO-10086'

const typeName = (ctx: MockContext, type: WithdrawType) => pick(ctx, type.zh, type.en, type.hd)

/**
 * 某提现方式下已绑定的收款账户（账号、UPI ID 打码，均为虚构）。
 * bid 各不相同：切换提现方式时页面按 bid 匹配账户，重号会串用；ARB 也要有一条，否则 bid 为 0，提现按钮不可点。
 */
function accountsOf(ctx: MockContext, withdrawID: number) {
	if (withdrawID === BANK.withdrawID) {
		const bankName = pick(ctx, '原型银行', 'Prototype Bank', 'प्रोटोटाइप बैंक')
		return [{ bid: 1001, bankName, beneficiaryName: HOLDER, accountNo: '6200****1024', ifsCode: 'PROT0000001', mobileNo: '91****8888' }]
	}
	if (withdrawID === UPI.withdrawID) return [{ bid: 2001, upiName: HOLDER, upiAccount: 'proto****@upi' }]
	if (withdrawID === ARB.withdrawID) return [{ bid: 2101, accountNo: ARB_ADDRESS }]
	return []
}

const pct = (value: number) => `<b style="color: var(--main-color)">${value}%</b>`

/** arbWithdrawRecommand：页面据此弹出“ARPAY奖金指南”（popupContent 按 v-html 渲染），ARB 卡片角标显示 `giftPercent%+arbGiftPercent%`；比例为 0 的一条不写进弹窗正文 */
function arbRecommend(ctx: MockContext, p: ArbWithdrawParams) {
	const gift = pct(p.giftPercent)
	const arb = pct(p.arbGiftPercent)
	const items = [
		p.giftPercent > 0 &&
			pick(
				ctx,
				`平台提现奖励${gift}，提现成功后自动发放到账户余额，可在“交易记录”的“提现活动奖励”中查看`,
				`${gift} platform withdrawal bonus, credited to your balance once the withdrawal succeeds (see "Withdrawal Event Reward" in Transaction history)`,
				`${gift} प्लेटफ़ॉर्म निकासी बोनस, निकासी सफल होने पर आपके बैलेंस में जमा होगा ("लेन-देन रिकॉर्ड" में "निकासी इवेंट इनाम" देखें)`
			),
		p.arbGiftPercent > 0 && pick(ctx, `ARB钱包赠送${arb}`, `${arb} ARB Wallet bonus`, `${arb} ARB वॉलेट बोनस`),
	].filter(Boolean)
	const intro = pick(
		ctx,
		'使用ARB钱包提现，每笔提现额外获得：',
		'Withdraw with the ARB Wallet and get extra on every withdrawal:',
		'ARB वॉलेट से निकासी करें और हर निकासी पर अतिरिक्त पाएँ:'
	)
	return {
		giftPercent: p.giftPercent,
		arbGiftPercent: p.arbGiftPercent,
		popupContent: `<p>${intro}</p>` + items.map((item, i) => `<p>${i + 1}. ${item}</p>`).join(''),
	}
}

/** GetWithdrawalTypes：提现方式列表（提现页与提现记录页的 Tab 共用）；不开启保险箱引导弹窗，免得与推荐弹窗叠在一起 */
const getWithdrawalTypes: MockHandler = (ctx) =>
	ok({
		withdrawlist: TYPES.map((type) => ({
			withdrawID: type.withdrawID,
			name: typeName(ctx, type),
			withBeforeImgUrl: type.icon,
			withAfterImgUrl: type.icon,
			recommandWithAmount: type.recommandWithAmount,
		})),
		isOpenSafeGuide: false,
	})

/** getWithdrawals：所选提现方式的已绑定账户与提现规则；可用余额、可提现余额都取会话钱包余额 */
const getWithdrawals: MockHandler = (ctx) => {
	const withdrawID = Number(ctx.body.withdrawid)
	// 提现页只请求 TYPES 里的方式；其他子页请求未开放的方式时按第一种的规则兜底，避免规则字段缺失
	const { minPrice, maxPrice, fee, withMinPrice, withMaxPrice } = TYPES.find((type) => type.withdrawID === withdrawID) ?? TYPES[0]
	const p = params<ArbWithdrawParams>(ctx, 'arbWithdraw')
	return ok({
		withdrawalslist: accountsOf(ctx, withdrawID),
		withdrawalsrule: {
			amount: ctx.state.balance,
			canWithdrawAmount: ctx.state.balance,
			// 剩余打码量；大于 0 时页面提示“打码量不足”并禁止提现
			amountofCode: 0,
			withdrawRemainingCount: 3,
			startTime: '00:00',
			endTime: '23:59',
			minPrice,
			maxPrice,
			fee,
			withMinPrice,
			withMaxPrice,
			// 每种方式都带上：页面在每次切换方式后重读它，只给一种方式会让 ARB 角标在切换后消失
			...(p.enabled ? { arbWithdrawRecommand: arbRecommend(ctx, p) } : {}),
		},
	})
}

/** 提现记录，覆盖页面状态表 rootConfig.WithdrawState 的 0 申请中、3 出款中、1 已完成、2 未通过；UTR 只在银行、UPI 出款成功后才有 */
const WITHDRAW_LOG = [
	{ seq: '05', type: BANK, state: 0, minutesAgo: 12, price: 1000 },
	{ seq: '04', type: UPI, state: 3, minutesAgo: 70, price: 500 },
	{ seq: '03', type: ARB, state: 1, minutesAgo: 26 * 60, price: 2000 },
	{ seq: '02', type: BANK, state: 1, minutesAgo: 50 * 60, price: 3000, tranRefId: '426719083514' },
	{ seq: '01', type: UPI, state: 2, minutesAgo: 74 * 60, price: 800 },
]

/** GetWithdrawLog：提现页底部最近 5 条与提现记录页共用；按请求的 type（提现方式）、state 筛选，-1 表示全部 */
const getWithdrawLog: MockHandler = (ctx) => {
	const type = Number(ctx.body.type ?? -1)
	const state = Number(ctx.body.state ?? -1)
	const rows = WITHDRAW_LOG.filter((row) => (type === -1 || row.type.withdrawID === type) && (state === -1 || row.state === state))
	const list = rows.map((row) => {
		const time = dayjs().subtract(row.minutesAgo, 'minute')
		return {
			withdrawNumber: `WD${time.format('YYYYMMDDHHmm')}${row.seq}`,
			type: row.type.withdrawID,
			withdrawName: typeName(ctx, row.type),
			price: row.price,
			addTime: time.format('YYYY-MM-DD HH:mm:ss'),
			state: row.state,
			tranRefId: row.tranRefId,
			remark:
				row.state === 2
					? pick(ctx, '收款账户信息有误，请核对后重新提交', 'Payee account details are incorrect, please check and resubmit', 'प्राप्तकर्ता खाते का विवरण गलत है, कृपया जाँचकर फिर से सबमिट करें')
					: '',
		}
	})
	return ok(paged(list, ctx.body))
}

/** NewSetWithdrawal：输入交易密码后提交提现（银行卡、UPI、ARB 共用），原型环境不做真实出款 */
const newSetWithdrawal: MockHandler = (ctx) =>
	fail(pick(ctx, '原型环境不支持真实提现', 'Real withdrawal is not supported in this prototype', 'इस प्रोटोटाइप में असली निकासी समर्थित नहीं है'))

/** ARBWalletMemberInfo：ARB 提现区读取钱包状态；已激活（walletActivationStatus 1）才显示 ARB 余额与提现输入，否则显示激活引导 */
const arbWalletMemberInfo: MockHandler = () => ok({ walletActivationStatus: 1, balance: 1250.5, walletAddress: ARB_ADDRESS })

/**
 * ARBWalletEnter：ARB 提现区的“进入钱包”。原型没有真实钱包，返回失败，页面就不会跳到空地址；
 * 页面随后立即 closeToast()，失败提示只会一闪而过。
 */
const arbWalletEnter: MockHandler = (ctx) =>
	fail(pick(ctx, '原型环境不支持进入 ARB 钱包', 'The ARB wallet cannot be opened in this prototype', 'इस प्रोटोटाइप में ARB वॉलेट नहीं खोला जा सकता'))

/**
 * 提现页的接口假数据，含提现活动奖励（arbWithdraw，账变 126）的“推荐 ARB 提现”弹窗与赠送角标。
 *
 * @remarks GetWithdrawLog、GetWithdrawalTypes 同时供提现记录页使用；ARB 钱包两个接口与充值页 ARPay 共用。
 */
export const withdrawRoutes: MockRoutes = {
	[api.GetWithdrawalTypes]: getWithdrawalTypes,
	[api.getWithdrawals]: getWithdrawals,
	[api.GetWithdrawLog]: getWithdrawLog,
	[api.NewSetWithdrawal]: newSetWithdrawal,
	[api.ARBWalletMemberInfo]: arbWalletMemberInfo,
	[api.ARBWalletEnter]: arbWalletEnter,
}
