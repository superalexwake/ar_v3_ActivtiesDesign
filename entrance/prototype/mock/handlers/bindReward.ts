import api from '@/api/url'
import { ok } from '../envelope'
import { params } from '../scenario'
import { claim, featureState } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** bindReward 活动参数（catalog.json `activities.bindReward.params`） */
interface BindRewardParams {
	/** 活动开关：关闭时 userInfo.bindReward 为 0，安全中心待绑定的一行显示“去绑定” */
	enabled: boolean
	/** 绑定奖励金额（元） */
	amount: number
	/** 注册方式：phone 手机注册（安全中心显示“绑定邮箱”）；email 邮箱注册（显示“绑定手机”） */
	regType: 'phone' | 'email'
	/** 注册方式之外的那一项（手机注册则为邮箱，反之为手机）是否已绑定 */
	bound: boolean
}

/** 绑定奖励的会话数据：待绑定的那一项绑定后置为 true */
interface BindRewardState {
	/** 待绑定的那一项是否已绑定 */
	bound: boolean
}

/** 已绑定时展示的虚构手机号与邮箱（打码后的样子） */
const FAKE_MOBILE = '91****8888'
const FAKE_EMAIL = 'pro***@example.com'

/** 首次绑定发放奖励的领取键 */
const CLAIM_KEY = 'bindReward:1'

const bindParams = (ctx: MockContext) => params<BindRewardParams>(ctx, 'bindReward')

const bindState = (ctx: MockContext) =>
	featureState<BindRewardState>(ctx, 'bindReward', () => ({ bound: bindParams(ctx).bound }))

/**
 * 用户信息里与绑定奖励相关的字段，由 session.ts 的 userInfoOf 合并。
 *
 * @param ctx - 请求上下文。
 * @returns `regType`（1 手机注册、2 邮箱注册）、`verifyMethods`（未绑定的一项为空字符串）与 `bindReward`（活动关闭时为 0）。
 */
export function bindInfo(ctx: MockContext) {
	const p = bindParams(ctx)
	const bound = bindState(ctx).bound
	const byPhone = p.regType === 'phone'
	return {
		regType: byPhone ? 1 : 2,
		verifyMethods: {
			email: !byPhone || bound ? FAKE_EMAIL : '',
			google: '0',
			mobile: byPhone || bound ? FAKE_MOBILE : '',
		},
		bindReward: p.enabled ? p.amount : 0,
	}
}

/** BindPhone / BindEmail：任意号码与验证码都绑定成功；首次绑定且活动开启时把奖励加到钱包余额 */
const bind: MockHandler = (ctx) => {
	bindState(ctx).bound = true
	const p = bindParams(ctx)
	if (p.enabled && p.amount > 0 && !ctx.state.claimed[CLAIM_KEY]) claim(ctx, CLAIM_KEY, p.amount)
	return ok(null)
}

/** 绑定手机号 / 邮箱送彩金（账变 104 / 106）的接口假数据：发送与校验验证码一律成功 */
export const bindRewardRoutes: MockRoutes = {
	[api.SmsVerifyCode]: () => ok(null),
	[api.VerifyPhoneCode]: () => ok(null),
	[api.EmailVerifyCode]: () => ok(null),
	[api.VerifyEmailCode]: () => ok(null),
	[api.BindPhone]: bind,
	[api.bindEmail]: bind,
}
