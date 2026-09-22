import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, fail, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { featureState } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** inviteWheel 活动参数,对应 catalog.json 的 activities.inviteWheel.params */
interface InviteWheelParams {
	/** 活动开关,由 home.ts 读取 */
	enabled: boolean
	/** 剩余抽奖次数 */
	spins: number
	/** 已攒金额,单位为元 */
	amount: number
	/** 提现门槛,单位为元 */
	target: number
	/** 剩余时间的截止时刻(毫秒),0 表示不倒计时 */
	remain: number
	/** 是否首次进入每日礼包 */
	firstGift: boolean
}

/** 邀请转盘的会话数据:剩余次数、已攒金额(分)与倒计时截止时刻,键等于活动 ID */
interface InviteWheelState {
	spins: number
	amountCents: number
	/** 截止时刻(毫秒),0 表示不倒计时 */
	deadline: number
}

/** 首次进入的每日礼包金额,数组第一项对应弹窗里立即揭晓的那一格 */
const FIRST_GIFT_AMOUNTS = [5, 3, 2, 8]

/** 近期他人中奖滚动记录的语言无关部分,昵称的"玩家"前缀按语言生成 */
const WHEEL_RECORD_BASE = Array.from({ length: 6 }, (_, index) => ({
	userId: 20000 + index,
	numberSuffix: (9000 + index * 123) % 10000,
	prizeAmount: [1.2, 2.5, 3.8, 1.5, 4.2, 2.1][index],
	createTime: dayjs()
		.subtract(index * 2, 'hour')
		.valueOf(),
}))

/** GetInvitedWheelInfo.lastWheelRecordList,字段对应 turntable/index.vue 的 recordList */
function wheelRecords(ctx: MockContext) {
	return WHEEL_RECORD_BASE.map((item) => ({
		userId: item.userId,
		userName: `${pick(ctx, '玩家', 'Player', 'खिलाड़ी')}${item.numberSuffix}`,
		invitedWheelAmount: 0,
		prizeAmount: item.prizeAmount,
		createTime: item.createTime,
	}))
}

/** GetUserInvitedWheelWithdrawList,字段对应 withdrawHistory/index.vue;第 3 条为审核不通过,原因三语化 */
function withdrawHistory(ctx: MockContext) {
	return [
		{ orderNo: '2609200001', auditState: 2, withdrawAmount: 100, withdrawCategoryName: 'UPI', createTime: dayjs().subtract(5, 'day').valueOf(), reason: '' },
		{ orderNo: '2609150002', auditState: 2, withdrawAmount: 100, withdrawCategoryName: 'UPI', createTime: dayjs().subtract(10, 'day').valueOf(), reason: '' },
		{
			orderNo: '2609100003',
			auditState: 3,
			withdrawAmount: 100,
			withdrawCategoryName: 'UPI',
			createTime: dayjs().subtract(15, 'day').valueOf(),
			reason: pick(ctx, '银行卡信息有误', 'Bank card information is incorrect', 'बैंक कार्ड की जानकारी गलत है'),
		},
	]
}

/** 邀请转盘规则富文本,3 段说明 */
function rulesHtml(ctx: MockContext): string {
	return pick(
		ctx,
		'<p>1. 每邀请 1 位好友完成首次充值，可获得 1 次转盘抽奖机会。</p>' +
			'<p>2. 每次抽奖随机获得 ₹1～₹5 奖金，累计满 ₹100 即可提现到钱包。</p>' +
			'<p>3. 活动最终解释权归平台所有，如遇异常将撤销相应奖励。</p>',
		'<p>1. Invite 1 friend to complete their first deposit to earn 1 wheel spin.</p>' +
			'<p>2. Each spin randomly wins ₹1–₹5; withdraw to your wallet once you reach ₹100.</p>' +
			'<p>3. The platform reserves final interpretation rights and may revoke rewards for abnormal activity.</p>',
		'<p>1. किसी एक मित्र को आमंत्रित करके उसका पहला रिचार्ज पूरा कराने पर आपको व्हील घुमाने का 1 मौका मिलता है।</p>' +
			'<p>2. हर स्पिन में यादृच्छिक रूप से ₹1–₹5 मिलते हैं, ₹100 पूरे होने पर वॉलेट में निकाल सकते हैं।</p>' +
			'<p>3. अंतिम व्याख्या का अधिकार प्लेटफ़ॉर्म के पास सुरक्षित है, असामान्य गतिविधि की स्थिति में इनाम रद्द किए जा सकते हैं।</p>'
	)
}

/** 读取邀请转盘的会话数据,首次访问按参数生成初始次数、金额与截止时刻 */
function inviteWheelFeature(ctx: MockContext, p: InviteWheelParams): InviteWheelState {
	return featureState(ctx, 'inviteWheel', () => ({ spins: p.spins, amountCents: Math.round(p.amount * 100), deadline: p.remain }))
}

/**
 * GetInvitedWheelInfo:转盘配置与提现进度。
 *
 * @remarks 已攒金额按 target 参数封顶;截止时刻已过时返回金额清零、`expiredTime: 0`,
 * 避免 useTurntable.ts 的倒计时归零后再次触发 `getTurntableInfo()` 形成重拉循环(:636-644)。
 * `serviceNowTime` 用斜杠格式,配合页面直接 `new Date()` 解析(没有做 iOS 需要的 `-`→`/` 兼容替换)。
 */
const info: MockHandler = (ctx) => {
	const p = params<InviteWheelParams>(ctx, 'inviteWheel')
	const state = inviteWheelFeature(ctx, p)
	const expired = state.deadline !== 0 && state.deadline <= Date.now()
	const amount = expired ? 0 : Math.min(state.amountCents / 100, p.target)
	return {
		...ok({
			isOpenInvitedWheel: true,
			isFirstInvitedWheel: p.firstGift,
			userInvitedWheelCount: state.spins,
			userInvitedWheelAmount: Number(amount.toFixed(2)),
			invitedWheelTotalPrizeAmount: p.target,
			invitedWheelAmountofcodeAmount: 0,
			expiredTime: expired ? 0 : state.deadline,
			diskDisplayAmount: [1, 2, 5, 10, 20, 50, 100, 200],
			noWinningRandomAmount: [1, 3],
			lastWheelRecordList: wheelRecords(ctx),
		}),
		serviceNowTime: dayjs().format('YYYY/MM/DD HH:mm:ss'),
	}
}

/** 首次进入礼包:4 个礼盒,第一个随响应立即揭晓,其余 3 个供 popuerGift.vue 依次揭晓 */
function openFirstGiftBoxes(state: InviteWheelState) {
	state.amountCents += Math.round(FIRST_GIFT_AMOUNTS[0] * 100)
	const firstInvitedWheelDatas = FIRST_GIFT_AMOUNTS.map((amount, index) => ({ amount, isSelected: index === 0 }))
	return ok({ isFirstInvitedWheel: true, isWin: true, prizeAmount: FIRST_GIFT_AMOUNTS[0], firstInvitedWheelDatas })
}

/** SpinInvitedWheel:首次礼包与常规抽奖共用此接口,由 firstGift 参数区分 */
const spin: MockHandler = (ctx) => {
	const p = params<InviteWheelParams>(ctx, 'inviteWheel')
	const state = inviteWheelFeature(ctx, p)
	if (p.firstGift) return openFirstGiftBoxes(state)
	if (state.spins <= 0) return fail(pick(ctx, '抽奖次数不足', 'Not enough spins left', 'बचे हुए स्पिन पर्याप्त नहीं हैं'))
	state.spins -= 1
	const gainCents = 100 + Math.floor(Math.random() * 401)
	state.amountCents += gainCents
	return ok({ isFirstInvitedWheel: false, isWin: true, prizeAmount: Number((gainCents / 100).toFixed(2)) })
}

/** SubmitInvitedWheelWithdraw:未达 target 门槛返回失败;否则发放 target 金额并清零进度 */
const submitWithdraw: MockHandler = (ctx) => {
	const p = params<InviteWheelParams>(ctx, 'inviteWheel')
	const state = inviteWheelFeature(ctx, p)
	if (state.amountCents < p.target * 100) return fail(pick(ctx, '未达到提现金额', 'Withdrawal amount not reached', 'निकासी राशि अभी पूरी नहीं हुई'))
	ctx.state.balance = Number((ctx.state.balance + p.target).toFixed(2))
	state.amountCents = 0
	return ok(null)
}

/** 邀请转盘(Type 130)的接口假数据 */
export const inviteWheelRoutes: MockRoutes = {
	[api.GetInvitedWheelInfo]: info,
	[api.SpinInvitedWheel]: spin,
	[api.GetInvitedWheelRules]: (ctx) => ok(rulesHtml(ctx)),
	[api.GetUserInvitedWheelWithdrawList]: (ctx) => ok(paged(withdrawHistory(ctx), ctx.body)),
	[api.SubmitInvitedWheelWithdraw]: submitWithdraw,
}
