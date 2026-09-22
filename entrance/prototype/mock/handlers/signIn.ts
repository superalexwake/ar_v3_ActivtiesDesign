import dayjs from 'dayjs'
import api from '@/api/url'
import { fail, ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** 每日签到（Type 7）的活动参数，取值范围见 catalog.json */
interface SignInParams {
	/** 已签天数（0～7） */
	signedDays: number
	/** 今日是否已签到 */
	todaySigned: boolean
	/** 奖励档位 */
	scheme: 'normal' | 'big'
}

/** 两档 7 天签到奖励金额，下标 0 对应第 1 天 */
const SIGNIN_REWARDS: Record<SignInParams['scheme'], number[]> = {
	normal: [5, 8, 10, 15, 20, 30, 88],
	big: [10, 20, 30, 50, 80, 120, 888],
}

/**
 * 签到日状态映射（rewardStatus() 结果 → isReceive，见 DailySignIn/index.vue 的 signInList 渲染，`issuccessfully` 复用同一值）：
 * claimed → 1（已签到）；progress/claimable/expired → 0（未签到）。
 */
const DAY_RECEIVE_MAP: Record<RewardItemStatus, number> = { progress: 0, claimable: 0, claimed: 1, expired: 0 }

/** 第 day 天的基础状态：不超过已签天数为已领取，今日（第 signedDays+1 天）按 todaySigned 决定，其余待领取 */
function dayBase(p: SignInParams, day: number): RewardItemStatus {
	if (day <= p.signedDays) return 'claimed'
	if (day === p.signedDays + 1 && p.todaySigned) return 'claimed'
	return 'claimable'
}

const dayStatus = (ctx: MockContext, p: SignInParams, day: number) => rewardStatus(ctx, `signIn:${day}`, dayBase(p, day))

const toDay = (ctx: MockContext, p: SignInParams, day: number) => {
	const isReceive = DAY_RECEIVE_MAP[dayStatus(ctx, p, day)]
	const amount = SIGNIN_REWARDS[p.scheme][day - 1]
	return { day, amount, bouns: amount, isReceive, issuccessfully: isReceive, rechargesID: day }
}

/**
 * GetContinuousSignInRecharges：7 天签到面板。
 *
 * @remarks 页面实际读取 `data.signInRechargesList`、`data.signIn`（而非同名类型 DailySignInData 里的 signInlist/signModel）。
 */
const continuousSignInRecharges: MockHandler = (ctx) => {
	const p = params<SignInParams>(ctx, 'signIn')
	const days = Array.from({ length: 7 }, (_, index) => toDay(ctx, p, index + 1))
	const signedDays = days.filter((item) => item.isReceive === 1)
	return ok({
		signInRechargesList: days,
		signIn: { isCycle: 1, signCount: signedDays.length, signInSum: signedDays.reduce((sum, item) => sum + item.bouns, 0) },
	})
}

/** SetContinuousSinIn：签下一个可签到日；今日已签或本周期已签满时返回业务失败 */
const setContinuousSignIn: MockHandler = (ctx) => {
	const p = params<SignInParams>(ctx, 'signIn')
	if (p.todaySigned) return fail(pick(ctx, '今日已签到', 'Already checked in today', 'आज पहले से ही चेक-इन हो चुका है'))
	const nextDay = Array.from({ length: 7 }, (_, index) => index + 1).find((day) => dayStatus(ctx, p, day) === 'claimable')
	if (!nextDay) return fail(pick(ctx, '本周期已签满', 'This cycle is fully checked in', 'यह चक्र पूरी तरह चेक-इन हो चुका है'))
	return claim(ctx, `signIn:${nextDay}`, SIGNIN_REWARDS[p.scheme][nextDay - 1])
}

/** 签到记录 5 条，金额随当前奖励档位变化，与当前签到周期无关的历史流水 */
function signInRecords(p: SignInParams) {
	const table = SIGNIN_REWARDS[p.scheme]
	return Array.from({ length: 5 }, (_, index) => {
		const amount = table[index % table.length]
		const markDayTime = dayjs().subtract(index + 1, 'day').format('YYYY-MM-DD HH:mm:ss')
		return { markDayTime, amount, orderNumber: `SI${dayjs().subtract(index + 1, 'day').format('YYYYMMDD')}${index}`, markType: 1, continuousDayContinue: index + 1 }
	})
}

/** GetContinuousSinInList：签到记录，5 条 */
const continuousSignInList: MockHandler = (ctx) => ok(paged(signInRecords(params<SignInParams>(ctx, 'signIn')), ctx.body))

/** 每日签到（Type 7）的接口假数据 */
export const signInRoutes: MockRoutes = {
	[api.GetContinuousSignInRecharges]: continuousSignInRecharges,
	[api.SetContinuousSinIn]: setContinuousSignIn,
	[api.GetContinuousSinInList]: continuousSignInList,
}
