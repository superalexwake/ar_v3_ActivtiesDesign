import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, fail } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockHandler, MockRoutes } from '../types'

/**
 * isFinshed / isReceive 状态码映射（InvitationBonus/index.vue 的 btnText）：
 * - progress → 未达成，按钮显示"未完成"
 * - claimable → 已达成未领取，按钮可点击
 * - claimed / expired → 已达成且视为已领取，按钮显示"已领取"（页面没有单独的过期态）
 */
const STATUS_CODE: Record<RewardItemStatus, { isFinshed: boolean; isReceive: 0 | 1 }> = {
	progress: { isFinshed: false, isReceive: 0 },
	claimable: { isFinshed: true, isReceive: 0 },
	claimed: { isFinshed: true, isReceive: 1 },
	expired: { isFinshed: true, isReceive: 1 },
}

/** 邀请奖励活动参数，声明见 catalog.json */
interface InvitationBonusParams {
	/** 有效邀请人数 */
	invited: number
	/** 已领档数：已达成的档位里，按顺序数前 N 个视为提前已领取 */
	claimedTiers: number
	/** 有邀请明细 */
	hasRecords: boolean
}

/** 4 档邀请任务：邀请 1/3/5/10 人，奖励 ₹10/₹38/₹88/₹200 */
const TASKS = [
	{ taskID: 1, taskPeople: 1, rechargeAmount: 100, taskAmount: 10 },
	{ taskID: 2, taskPeople: 3, rechargeAmount: 100, taskAmount: 38 },
	{ taskID: 3, taskPeople: 5, rechargeAmount: 100, taskAmount: 88 },
	{ taskID: 4, taskPeople: 10, rechargeAmount: 100, taskAmount: 200 },
]

/** 邀请明细 8 条，字段对应 InvitationBonus/Record/index.vue */
const INVITE_RECORDS = Array.from({ length: 8 }, (_, index) => ({
	userName: `玩家${(6000 + index * 71) % 10000}`,
	userID: 400001 + index,
	createTime: dayjs()
		.subtract(index + 1, 'day')
		.format('YYYY-MM-DD HH:mm:ss'),
	rechargeAmount_All: [500, 200, 1000, 100, 300, 150, 800, 100][index],
}))

/**
 * GetTaskList：4 档任务进度。
 *
 * @remarks taskList 不能为空——index.vue 靠 taskList[0] 取活动起止日期；没有邀请进度时用 invited 0 表达，而不是返回空列表。
 * 已达成的档位按顺序数前 claimedTiers 个视为已提前领取，其余已达成档位为可领取。
 */
const taskList: MockHandler = (ctx) => {
	const { invited, claimedTiers } = params<InvitationBonusParams>(ctx, 'invitationBonus')
	const beginDate = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss')
	const endDate = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
	const list = TASKS.map((task, index) => {
		const achieved = invited >= task.taskPeople
		const base: RewardItemStatus = !achieved ? 'progress' : index < claimedTiers ? 'claimed' : 'claimable'
		const { isFinshed, isReceive } = STATUS_CODE[rewardStatus(ctx, 'invitationBonus:' + task.taskID, base)]
		return {
			...task,
			beginDate,
			endDate,
			efficientPeople: invited,
			rechargePeople: Math.min(invited, task.taskPeople),
			taskRechargePeople: task.taskPeople,
			isFinshed,
			isReceive,
		}
	})
	return ok({ taskList: list })
}

/** SetTaskOrder：按 taskId 领取 */
const setTaskOrder: MockHandler = (ctx) => {
	const taskId = Number(ctx.body.taskId)
	const task = TASKS.find((item) => item.taskID === taskId)
	if (!task) return fail(pick(ctx, '任务不存在', 'Task not found', 'कार्य मौजूद नहीं है'))
	return claim(ctx, 'invitationBonus:' + taskId, task.taskAmount)
}

/** 邀请奖励（Type 20）的接口假数据 */
export const invitationBonusRoutes: MockRoutes = {
	[api.GetTaskList]: taskList,
	[api.SetTaskOrder]: setTaskOrder,
	[api.GetCurrentActivityLevel1People]: (ctx) => {
		const { hasRecords } = params<InvitationBonusParams>(ctx, 'invitationBonus')
		const onFirstPage = (Number(ctx.body.pageNo) || 1) === 1
		return ok({ data: hasRecords && onFirstPage ? INVITE_RECORDS : [], totalPage: 1 })
	},
	[api.GetCurrentActivityTasks]: () => ok({ taskList: TASKS.map(({ taskPeople, rechargeAmount, taskAmount }) => ({ taskPeople, rechargeAmount, taskAmount })) }),
}
