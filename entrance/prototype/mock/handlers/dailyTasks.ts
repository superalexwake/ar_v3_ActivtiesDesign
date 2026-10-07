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
	/** 已结束(status 4,任务页整卡置灰的终态);为 true 时 status 恒为 4,不受 base/mix 影响 */
	ended?: boolean
}

/** 已结束任务的展示 status,与 DailyTasks/index.vue 的 changeStatus/changeHeadStatus 新增分支对齐 */
const ENDED_STATUS = 4

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
	{
		configId: 6,
		taskId: 'B6',
		taskTitle: ['体育游戏头组合', 'Sports Combo', 'खेल संयोजन'],
		taskDescribe: ['单日累计投注满 ₹1000.00', 'Place bets totaling ₹1000.00 in a single day', 'एक दिन में कुल ₹1000.00 की शर्त लगाएं'],
		taskTarget: 1000,
		schedule: 1000,
		taskAwardAmount: 18,
		base: 'claimed',
		ended: true,
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
	{
		configId: 104,
		taskId: 'D17',
		taskTitle: ['体育游戏头组合', 'Sports Combo', 'खेल संयोजन'],
		taskDescribe: ['本周电子游戏投注满 ₹2000.00', 'Bet ₹2000.00 on slot games this week', 'इस सप्ताह स्लॉट गेम में ₹2000.00 की शर्त लगाएं'],
		taskTarget: 2000,
		schedule: 2000,
		taskAwardAmount: 35,
		base: 'claimed',
		ended: true,
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
	status: task.ended ? ENDED_STATUS : TASK_STATUS[rewardStatus(ctx, `${prefix}:${task.configId}`, effectiveBase(mix, task.base))],
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
	return ok(DAILY_TASKS.filter((task) => !task.ended && TASK_STATUS[rewardStatus(ctx, `dailyTask:${task.configId}`, effectiveBase(mix, task.base))] === 2).length)
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
	days: number
	dailyAmount: number
	receivedDays: number
}

/**
 * GetNewbieGiftPackage:新手礼包，对应后台 任务管理＞新手任务＞新手礼包（领取天数 × 每天金额）。
 * @remarks totalNumber = 领取天数，amount = 天数 × 每天金额（卡上显示合计）；receivedNumber：未完成 0、待领取取 receivedDays；已领取后接口不再返回（卡片消失）。
 * DailyTasks/index.vue 领取成功弹窗按 amount/totalNumber 计算到账金额（即每天金额），与 ReceiveAward 实际 claim() 的金额保持一致。
 */
const newbieGiftPackage: MockHandler = (ctx) => {
	const { state, days, dailyAmount, receivedDays } = params<NewbieGiftParams>(ctx, 'newbieGift')
	if (state === 'none') return ok(null)
	const totalNumber = Math.max(1, Math.round(days))
	const amount = Math.round(totalNumber * dailyAmount * 100) / 100
	const finalState = rewardStatus(ctx, `newbieGift:${NEWBIE_ID}`, state)
	// 领完整张卡消失：已领取后接口不再返回，新手任务页不再显示这张卡
	if (finalState === 'claimed') return ok(null)
	return ok({
		id: NEWBIE_ID,
		title: pick(ctx, '新手礼包', 'Newbie Gift', 'नौसिखिया उपहार'),
		description: pick(
			ctx,
			`连续领取 ${totalNumber} 天，每天可领 ₹${dailyAmount.toFixed(2)} 彩金`,
			`Claim for ${totalNumber} days, ₹${dailyAmount.toFixed(2)} bonus every day`,
			`${totalNumber} दिन तक हर दिन ₹${dailyAmount.toFixed(2)} बोनस पाएं`
		),
		receivedNumber: finalState === 'claimed' ? totalNumber : state === 'progress' ? 0 : Math.min(Math.max(0, Math.round(receivedDays)), totalNumber - 1),
		totalNumber,
		amount,
		status: NEWBIE_STATUS[finalState],
	})
}

/** ReceiveAward:领取新手礼包（当天一份 = 每天金额）,读取 body.id;奖励中心 113 类型复用同一接口与 ID */
const receiveAward: MockHandler = (ctx) => {
	const { dailyAmount } = params<NewbieGiftParams>(ctx, 'newbieGift')
	return claim(ctx, `newbieGift:${Number(ctx.body.id) || NEWBIE_ID}`, dailyAmount)
}

/** 新手任务三项（绑定手机/邮箱、绑定银行卡、下载APP充值奖励）的奖励领取键前缀，按活动 ID `newbieTasks` 清理 */
const NEWBIE_TASK_KEY = 'newbieTasks'

interface NewbieTasksParams {
	state: 'todo' | 'claimed'
	appState: 'todo' | 'claimable' | 'claimed'
	regType: 'phone' | 'mail'
	phoneOn: boolean
	mailOn: boolean
	phoneAmount: number
	mailAmount: number
	cardAmount: number
	appThreshold: number
	appAmount: number
	showAppGift: boolean
}

/**
 * GetNewbieTaskList:新手任务三项（新手礼包另走 GetNewbieGiftPackage）。
 * @remarks 绑定手机/邮箱、绑定银行卡：系统自动发放，玩家只做「前往绑定」，到账后接口不再返回该卡（卡片从新手任务消失），没有待领取、没有领取按钮，status 恒为 0。
 * 下载APP充值：手动领取，status 0 未达标（前往完成→跳充值页）、1 达标可领取、2 已领取（领取后卡片保留，显示已领取）。
 * 对应 V1：
 * - 绑定手机/邮箱：一张卡、一个标题一段描述（文案由后台下发），下面分「手机奖励」「邮箱奖励」两行；注册时用过的那项标「已绑定」置灰，按钮去绑没用过的那项；只有没用过的那项能领，绑定后到账整张卡消失；某项奖励开关关闭则不显示那一行，没用过的那项关闭则整张卡不返回。
 * - 绑定银行卡：首次绑卡赠送金额一个，绑定成功自动到账。
 * - 下载APP充值：下载APP后「单笔」充值达门槛才变可领取；进度不累计，卡上不显示进度数字；「显示赠送金额」关闭时不显示金额行。
 * - 每张卡只有一个标题和一段描述，完成条件（如下载APP的充值门槛）写进描述里，不再单独一行。
 */
const newbieTaskList: MockHandler = (ctx) => {
	const p = params<NewbieTasksParams>(ctx, 'newbieTasks')
	// 演示「已到账」：绑定类的卡已自动到账，接口不再返回，卡片消失；下载APP卡是手动领取，状态单独由 appState 控制
	const autoDone = p.state === 'claimed'
	const appBase: RewardItemStatus = p.appState === 'claimable' ? 'claimable' : p.appState === 'claimed' ? 'claimed' : 'progress'
	const appStatus = NEWBIE_STATUS[rewardStatus(ctx, `${NEWBIE_TASK_KEY}:downloadApp`, appBase)]
	// 手机号注册→还没绑的是邮箱；邮箱注册→还没绑的是手机。注册时用过的那项算「已绑定」
	const bindEmail = p.regType === 'phone'
	const unusedOn = bindEmail ? p.mailOn : p.phoneOn
	const phoneRow = { label: pick(ctx, '手机奖励', 'Phone reward', 'फ़ोन इनाम'), amount: p.phoneAmount, bound: bindEmail }
	const mailRow = { label: pick(ctx, '邮箱奖励', 'Email reward', 'ईमेल इनाम'), amount: p.mailAmount, bound: !bindEmail }
	// 后台某项奖励关了就不显示那一行；没绑的那项关了则这张卡没有可做的事，整张卡不返回
	const contactRewards = [p.phoneOn && phoneRow, p.mailOn && mailRow].filter(Boolean)
	const tasks = [
		!autoDone && unusedOn && {
			key: 'bindContact',
			bindType: bindEmail ? 'email' : 'phone',
			// 标题和描述由后台「任务管理＞新手任务」配置下发，这里是示例文案
			title: pick(ctx, '绑定手机/邮箱有奖', 'Bind phone/email and win', 'फ़ोन/ईमेल बाइंड करें और जीतें'),
			description: pick(ctx, '首次绑定手机、邮箱各送一份彩金，绑定成功自动到账', 'Get a bonus for binding your phone and email for the first time, credited automatically', 'पहली बार फ़ोन और ईमेल बाइंड करने पर बोनस, अपने आप जमा'),
			status: 0,
			progress: null,
			rewards: contactRewards
		},
		!autoDone && {
			key: 'bindCard',
			title: pick(ctx, '绑定银行卡有奖', 'Bind bank card and win', 'बैंक कार्ड बाइंड करें और जीतें'),
			description: pick(ctx, '首次绑定银行卡送彩金，绑定成功自动到账', 'Get a bonus for binding a bank card for the first time, credited automatically', 'पहली बार बैंक कार्ड बाइंड करने पर बोनस, अपने आप जमा'),
			status: 0,
			progress: null,
			rewards: [{ label: '', amount: p.cardAmount }]
		},
		{
			key: 'downloadApp',
			title: pick(ctx, '下载APP充值奖励', 'Download APP recharge reward', 'ऐप डाउनलोड रिचार्ज इनाम'),
			description: pick(ctx, `下载APP后单笔充值满₹${p.appThreshold}，达标后手动领取`, `Recharge ₹${p.appThreshold} or more in a single payment after downloading the APP, then claim manually`, `ऐप डाउनलोड के बाद एक बार में ₹${p.appThreshold} या अधिक रिचार्ज करें, फिर खुद क्लेम करें`),
			status: appStatus,
			threshold: p.appThreshold,
			progress: null,
			rewards: p.showAppGift ? [{ label: '', amount: p.appAmount }] : []
		}
	].filter(Boolean)
	return ok(tasks)
}

/** ReceiveNewbieTask:领取新手任务奖励（仅下载APP充值手动领取），读取 body.key */
const receiveNewbieTask: MockHandler = (ctx) => {
	const p = params<NewbieTasksParams>(ctx, 'newbieTasks')
	return claim(ctx, `${NEWBIE_TASK_KEY}:${String(ctx.body.key)}`, p.appAmount)
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
	[api.GetNewbieTaskList]: newbieTaskList,
	[api.ReceiveNewbieTask]: receiveNewbieTask,
}
