import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged } from '../envelope'
import { claim, rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/**
 * 每日/每周任务状态映射(rewardStatus() 结果 → status,注释见 DailyTasks/index.vue 的 changeStatus):
 * progress → 1(未完成);claimable → 2(未领取);claimed/expired → 3(已领取)。
 */
const TASK_STATUS: Record<RewardItemStatus, number> = { progress: 1, claimable: 2, claimed: 3, expired: 3 }

/**
 * 新手礼包状态映射(rewardStatus() 结果 → status,注释见 DailyTasks/index.vue 的 newStatus):
 * progress → 0(未完成);claimable → 1(待领取);claimed/expired → 2(已领取)。
 */
const NEWBIE_STATUS: Record<RewardItemStatus, number> = { progress: 0, claimable: 1, claimed: 2, expired: 2 }

/** 任务状态参数取值;mixed 用各任务自带的 base,其余三个覆盖全部任务,empty 让列表整体为空 */
type MixMode = 'mixed' | 'claimable' | 'claimed' | 'progress' | 'empty'

interface TaskConfig {
	configId: number
	/** 对应 useActive.ts 的 ActiveTaskMap 键,决定图标与跳转目标 */
	taskId: string
	taskTitle: [string, string, string]
	taskDescribe: [string, string, string]
	taskTarget: number
	schedule: number
	taskAwardAmount: number
	base: RewardItemStatus
}

/** 每日任务 5 条:充值、投注、邀请、签到、彩票局数 */
const DAILY_TASKS: TaskConfig[] = [
	{
		configId: 1,
		taskId: 'A1',
		taskTitle: ['充值任务', 'Recharge Task', 'रिचार्ज कार्य'],
		taskDescribe: ['单日累计充值满 ₹500.00', 'Recharge a total of ₹500.00 in a single day', 'एक दिन में कुल ₹500.00 रिचार्ज करें'],
		taskTarget: 500,
		schedule: 500,
		taskAwardAmount: 10,
		base: 'claimable',
	},
	{
		configId: 2,
		taskId: 'B5',
		taskTitle: ['投注任务', 'Betting Task', 'सट्टा कार्य'],
		taskDescribe: ['单日累计投注满 ₹1000.00', 'Place bets totaling ₹1000.00 in a single day', 'एक दिन में कुल ₹1000.00 की शर्त लगाएं'],
		taskTarget: 1000,
		schedule: 1000,
		taskAwardAmount: 15,
		base: 'claimable',
	},
	{
		configId: 3,
		taskId: 'C15',
		taskTitle: ['邀请任务', 'Invite Task', 'आमंत्रण कार्य'],
		taskDescribe: ['成功邀请 1 位好友注册', 'Successfully invite 1 friend to register', 'सफलतापूर्वक 1 मित्र को पंजीकरण के लिए आमंत्रित करें'],
		taskTarget: 1,
		schedule: 0,
		taskAwardAmount: 20,
		base: 'progress',
	},
	{
		configId: 4,
		taskId: 'D16',
		taskTitle: ['签到任务', 'Sign-in Task', 'साइन-इन कार्य'],
		taskDescribe: ['完成每日签到 1 次', 'Complete daily sign-in once', 'दैनिक साइन-इन 1 बार पूरा करें'],
		taskTarget: 1,
		schedule: 1,
		taskAwardAmount: 5,
		base: 'claimed',
	},
	{
		configId: 5,
		taskId: 'B6',
		taskTitle: ['彩票任务', 'Lottery Task', 'लॉटरी कार्य'],
		taskDescribe: ['完成 3 局彩票投注', 'Complete 3 lottery bets', '3 लॉटरी दांव पूरे करें'],
		taskTarget: 3,
		schedule: 1,
		taskAwardAmount: 12,
		base: 'progress',
	},
]

/** 每周任务 3 条,金额落在 ₹5~₹66 区间内 */
const WEEKLY_TASKS: TaskConfig[] = [
	{
		configId: 101,
		taskId: 'A3',
		taskTitle: ['提现任务', 'Withdrawal Task', 'निकासी कार्य'],
		taskDescribe: ['本周累计提现满 ₹2000.00', 'Withdraw a total of ₹2000.00 this week', 'इस सप्ताह कुल ₹2000.00 निकालें'],
		taskTarget: 2000,
		schedule: 2000,
		taskAwardAmount: 20,
		base: 'claimable',
	},
	{
		configId: 102,
		taskId: 'B7',
		taskTitle: ['电子任务', 'Slots Task', 'स्लॉट कार्य'],
		taskDescribe: ['本周电子游戏投注满 ₹2000.00', 'Bet ₹2000.00 on slot games this week', 'इस सप्ताह स्लॉट गेम में ₹2000.00 की शर्त लगाएं'],
		taskTarget: 2000,
		schedule: 800,
		taskAwardAmount: 35,
		base: 'progress',
	},
	{
		configId: 103,
		taskId: 'D17',
		taskTitle: ['大奖任务', 'Jackpot Task', 'जैकपॉट कार्य'],
		taskDescribe: ['本周领取超级大奖 1 次', 'Claim the super jackpot once this week', 'इस सप्ताह एक बार सुपर जैकपॉट प्राप्त करें'],
		taskTarget: 1,
		schedule: 1,
		taskAwardAmount: 66,
		base: 'claimed',
	},
]

/** mixed 用任务自带的 base,其余取值强制覆盖全部任务(empty 由调用方在取列表前短路) */
const effectiveBase = (mix: MixMode, base: RewardItemStatus): RewardItemStatus => (mix === 'claimable' || mix === 'claimed' || mix === 'progress' ? mix : base)

const toTaskItem = (ctx: MockContext, prefix: 'dailyTask' | 'weeklyTask', task: TaskConfig, mix: MixMode) => ({
	configId: task.configId,
	taskId: task.taskId,
	taskTitle: pick(ctx, ...task.taskTitle),
	taskDescribe: pick(ctx, ...task.taskDescribe),
	taskTarget: task.taskTarget,
	schedule: task.schedule,
	scheduleTwo: 0,
	targetTwo: 0,
	receiveType: 1,
	taskAwardAmount: task.taskAwardAmount,
	isReceiveButtonHidden: false,
	status: TASK_STATUS[rewardStatus(ctx, `${prefix}:${task.configId}`, effectiveBase(mix, task.base))],
})

interface DailyTaskParams {
	mix: MixMode
}
interface WeeklyTaskParams {
	mix: MixMode
}

/** GetDailyAwardList:每日任务列表 */
const dailyAwardList: MockHandler = (ctx) => {
	const { mix } = params<DailyTaskParams>(ctx, 'dailyTask')
	return ok(mix === 'empty' ? [] : DAILY_TASKS.map((task) => toTaskItem(ctx, 'dailyTask', task, mix)))
}

/** GetWeeklyAwardList:每周任务列表 */
const weeklyAwardList: MockHandler = (ctx) => {
	const { mix } = params<WeeklyTaskParams>(ctx, 'weeklyTask')
	return ok(mix === 'empty' ? [] : WEEKLY_TASKS.map((task) => toTaskItem(ctx, 'weeklyTask', task, mix)))
}

/** GetDailyAwardCount:每日任务可领取(status=2)条数 */
const dailyAwardCount: MockHandler = (ctx) => {
	const { mix } = params<DailyTaskParams>(ctx, 'dailyTask')
	if (mix === 'empty') return ok(0)
	return ok(DAILY_TASKS.filter((task) => TASK_STATUS[rewardStatus(ctx, `dailyTask:${task.configId}`, effectiveBase(mix, task.base))] === 2).length)
}

/** ReceiveDailyAward:领取每日任务,读取 body.dailyAwardId(与 useBonusPack 的 convertData 一致) */
const receiveDailyAward: MockHandler = (ctx) => {
	const task = DAILY_TASKS.find((item) => item.configId === Number(ctx.body.dailyAwardId))
	if (!task) return ok(null)
	return claim(ctx, `dailyTask:${task.configId}`, task.taskAwardAmount)
}

/** ReceiveWeeklyAward:领取每周任务,读取 body.weeklyAwardId(与 useBonusPack 的 convertData 一致) */
const receiveWeeklyAward: MockHandler = (ctx) => {
	const task = WEEKLY_TASKS.find((item) => item.configId === Number(ctx.body.weeklyAwardId))
	if (!task) return ok(null)
	return claim(ctx, `weeklyTask:${task.configId}`, task.taskAwardAmount)
}

const toRecord = (ctx: MockContext, task: TaskConfig, daysAgo: number) => ({
	taskTitle: pick(ctx, ...task.taskTitle),
	taskTarget: task.taskTarget,
	awardAmount: task.taskAwardAmount,
	createDate: dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD HH:mm:ss'),
})

/** GetDailyAwardRecordList:每日任务领取记录,5 条(与每日任务一一对应) */
const dailyAwardRecordList: MockHandler = (ctx) => ok(paged(DAILY_TASKS.map((task, index) => toRecord(ctx, task, index + 1)), ctx.body))

/** GetWeeklyAwardRecordList:每周任务领取记录,3 条,与每日记录合计 8 条 */
const weeklyAwardRecordList: MockHandler = (ctx) => ok(paged(WEEKLY_TASKS.map((task, index) => toRecord(ctx, task, index + 1)), ctx.body))

/** 新手礼包固定 ID,奖励中心 113 类型复用同一 ID */
const NEWBIE_ID = 301

interface NewbieGiftParams {
	state: 'progress' | 'claimable' | 'claimed' | 'none'
	amount: number
}

/**
 * GetNewbieGiftPackage:新手礼包。
 * @remarks totalNumber 取 1(单次即领);未完成时 receivedNumber 归零,其余情况与 totalNumber 一致。
 * DailyTasks/index.vue 领取成功弹窗按 amount/totalNumber 计算到账金额,与这里 ReceiveAward 实际 claim() 的金额保持一致。
 */
const newbieGiftPackage: MockHandler = (ctx) => {
	const { state, amount } = params<NewbieGiftParams>(ctx, 'newbieGift')
	if (state === 'none') return ok(null)
	const totalNumber = 1
	return ok({
		id: NEWBIE_ID,
		title: pick(ctx, '新手礼包', 'Newbie Gift', 'नौसिखिया उपहार'),
		description: pick(
			ctx,
			`完成 ${totalNumber} 项新手任务，即可领取 ₹${amount.toFixed(2)} 彩金`,
			`Complete ${totalNumber} newbie task to claim a ₹${amount.toFixed(2)} bonus`,
			`₹${amount.toFixed(2)} बोनस पाने के लिए ${totalNumber} नौसिखिया कार्य पूरा करें`
		),
		receivedNumber: state === 'progress' ? 0 : totalNumber,
		totalNumber,
		amount,
		status: NEWBIE_STATUS[rewardStatus(ctx, `newbieGift:${NEWBIE_ID}`, state)],
	})
}

/** ReceiveAward:领取新手礼包,读取 body.id;奖励中心 113 类型复用同一接口与 ID */
const receiveAward: MockHandler = (ctx) => {
	const { amount } = params<NewbieGiftParams>(ctx, 'newbieGift')
	return claim(ctx, `newbieGift:${Number(ctx.body.id) || NEWBIE_ID}`, amount)
}

/** 每日奖励、每周奖励、新手礼包(Type 118/107/113)的接口假数据 */
export const dailyTasksRoutes: MockRoutes = {
	[api.GetDailyAwardList]: dailyAwardList,
	[api.ReceiveDailyAward]: receiveDailyAward,
	[api.GetDailyAwardRecordList]: dailyAwardRecordList,
	[api.GetDailyAwardCount]: dailyAwardCount,
	[api.GetWeeklyAwardList]: weeklyAwardList,
	[api.ReceiveWeeklyAward]: receiveWeeklyAward,
	[api.GetWeeklyAwardRecordList]: weeklyAwardRecordList,
	[api.GetNewbieGiftPackage]: newbieGiftPackage,
	[api.ReceiveAward]: receiveAward,
}
