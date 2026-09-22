import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged, fail } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { claim } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** championship 活动参数,对应 catalog.json 的 activities.championship.params */
interface ChampionshipParams {
	/** 活动开关,由 session.ts 读取 */
	enabled: boolean
	/** 活动页入口卡展示的赛事 */
	entrance: 'signup' | 'running' | 'ended'
	/** 进行中赛事的截止时刻(毫秒),0 表示视为已结束 */
	remain: number
	/** 是否已报名进行中赛事 */
	joined: boolean
	/** 下次报名的结果 */
	joinResult: 'ok' | '803' | '804' | '805' | '807'
}

/** 赛事生命周期:0 报名中、1 进行中、2 已结束(见 useChampionship.hook.ts 的 tabList) */
interface ChampionTaskConfig {
	id: number
	state: 0 | 1 | 2
	sumBonus: number
	startTime: string
	endTime: string
}

/** 报名中的赛事,固定配置 */
const SIGNUP_TASK: ChampionTaskConfig = {
	id: 1,
	state: 0,
	sumBonus: 20000,
	startTime: dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
	endTime: dayjs().add(9, 'day').format('YYYY-MM-DD HH:mm:ss'),
}

/** 已结束的赛事,固定配置 */
const ENDED_TASK: ChampionTaskConfig = {
	id: 3,
	state: 2,
	sumBonus: 30000,
	startTime: dayjs().subtract(10, 'day').format('YYYY-MM-DD HH:mm:ss'),
	endTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
}

/** 进行中赛事的活动 ID */
const RUNNING_ID = 2

/** 按 remain 参数生成进行中赛事;截止时刻由 effectiveState() 统一判断是否已过期 */
function runningTask(p: ChampionshipParams): ChampionTaskConfig {
	const deadline = p.remain === 0 ? Date.now() : p.remain
	return {
		id: RUNNING_ID,
		state: 1,
		sumBonus: 50000,
		startTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
		endTime: dayjs(deadline).format('YYYY-MM-DD HH:mm:ss'),
	}
}

/**
 * 赛事的实际展示状态:进行中赛事的截止时刻已过时改报已结束。
 *
 * @remarks card.vue 在 `state === 1` 且倒计时归零后读取 `countDown.value.current` 会抛错(:79-81),
 * 不能继续把已过期的赛事报成进行中。
 */
function effectiveState(task: ChampionTaskConfig): 0 | 1 | 2 {
	if (task.state === 1 && dayjs(task.endTime).valueOf() <= Date.now()) return 2
	return task.state
}

/** JoinChampionTask 记入 ctx.state.claimed 的键 */
const joinKey = (id: number) => `championship:join:${id}`

/** 某赛事是否已报名;进行中赛事额外受 joined 参数驱动 */
function isJoined(ctx: MockContext, p: ChampionshipParams, taskId: number): boolean {
	if (ctx.state.claimed[joinKey(taskId)]) return true
	return taskId === RUNNING_ID && p.joined
}

function toTaskItem(ctx: MockContext, p: ChampionshipParams, task: ChampionTaskConfig) {
	return {
		id: task.id,
		iconUrl: 'mock-img/banner-championship.svg',
		state: effectiveState(task),
		sumBonus: task.sumBonus,
		startTime: task.startTime,
		endTime: task.endTime,
		isJoin: isJoined(ctx, p, task.id),
	}
}

/** entrance 参数到赛事配置的映射 */
const ENTRANCE_TASK: Record<ChampionshipParams['entrance'], (p: ChampionshipParams) => ChampionTaskConfig> = {
	signup: () => SIGNUP_TASK,
	running: runningTask,
	ended: () => ENDED_TASK,
}

/** ChampionEntrance:活动中心入口卡片,按 entrance 参数展示对应赛事 */
const championEntrance: MockHandler = (ctx) => {
	const p = params<ChampionshipParams>(ctx, 'championship')
	const task = ENTRANCE_TASK[p.entrance](p)
	return { ...ok(toTaskItem(ctx, p, task)), serviceNowTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
}

/** GetChampionTaskList:按 body.state 过滤的赛事列表,3 场赛事恒存在 */
const championTaskList: MockHandler = (ctx) => {
	const p = params<ChampionshipParams>(ctx, 'championship')
	const state = Number(ctx.body.state)
	const tasks = [SIGNUP_TASK, runningTask(p), ENDED_TASK].map((task) => toTaskItem(ctx, p, task)).filter((task) => task.state === state)
	return { ...ok(paged(tasks, ctx.body)), serviceNowTime: dayjs().format('YYYY-MM-DD HH:mm:ss') }
}

/** 报名失败的 4 种结果;msgCode 与 data 形状均由 Championship/index.vue 的 switch 分支决定 */
function joinFailure(ctx: MockContext, result: '803' | '804' | '805' | '807') {
	if (result === '803') {
		return fail(pick(ctx, '打码不足', 'Wagering requirement not met', 'वेजरिंग शर्त पूरी नहीं हुई'), { msgCode: 803, data: '₹100' })
	}
	if (result === '804') {
		return fail(pick(ctx, '充值不足', 'Recharge requirement not met', 'रिचार्ज शर्त पूरी नहीं हुई'), { msgCode: 804, data: '₹500' })
	}
	if (result === '805') {
		return fail(pick(ctx, '绑定不足', 'Binding requirement not met', 'बाइंडिंग शर्त पूरी नहीं हुई'), { msgCode: 805, data: 2 })
	}
	return fail(pick(ctx, '需在指定游戏内投注', 'Bet in the specified games to join', 'शामिल होने के लिए निर्दिष्ट गेम में दांव लगाएं'), {
		msgCode: 807,
		data: { a: 'Win Go', b: 'K3', c: '₹100' },
	})
}

/** JoinChampionTask:报名赛事,读取 body.championId;按 joinResult 参数决定成败,仅记录报名状态不发放金额 */
const joinChampionTask: MockHandler = (ctx) => {
	const p = params<ChampionshipParams>(ctx, 'championship')
	if (p.joinResult !== 'ok') return joinFailure(ctx, p.joinResult)
	return claim(ctx, joinKey(Number(ctx.body.championId)), 0)
}

/** 名次奖金档位,详情页规则与 Top10 榜单共用 */
const RANKING_AWARDS = [
	{ startRanking: 1, endRanking: 1, awardsAmount: 5000 },
	{ startRanking: 2, endRanking: 3, awardsAmount: 2000 },
	{ startRanking: 4, endRanking: 10, awardsAmount: 500 },
]

/** GetChampionTaskDetail:赛事详情,读取 body.championId;已报名时补充 userJoinInfo */
const championTaskDetail: MockHandler = (ctx) => {
	const p = params<ChampionshipParams>(ctx, 'championship')
	const championId = Number(ctx.body.championId)
	const configs: Record<number, ChampionTaskConfig> = { 1: SIGNUP_TASK, [RUNNING_ID]: runningTask(p), 3: ENDED_TASK }
	const task = configs[championId] ?? SIGNUP_TASK
	const item = toTaskItem(ctx, p, task)
	return {
		...ok({
			...item,
			// 使用站内彩票而非三方游戏,避免额外依赖 GetThirdGameList
			vendorCode: 'ARLottery',
			subGameNames: ['Win_Go', 'K3', '5D'],
			conditionsBetAmount: 100,
			conditionsRechargeAmount: 0,
			conditionsBindType: 0,
			rankingAwardsList: RANKING_AWARDS,
			userJoinInfo: item.isJoin ? { ranking: 5, sumBetAmount: 1280, awardsAmount: 0 } : null,
		}),
		serviceNowTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
	}
}

/** 虚构昵称,格式与 home.ts 中奖滚动条的"玩家N****N"保持一致 */
const fakeNickname = (ctx: MockContext, rank: number) => `${pick(ctx, '玩家', 'Player', 'खिलाड़ी')}${((rank * 3) % 9) + 1}****${((rank * 17) % 90) + 10}`

/** GetTop10ChampionTaskDataUserList:虚构 10 名用户榜单 */
const top10ChampionTaskDataUserList: MockHandler = (ctx) =>
	ok(
		Array.from({ length: 10 }, (_, index) => {
			const ranking = index + 1
			return {
				ranking,
				userName: fakeNickname(ctx, ranking),
				sumBetAmount: Number((20000 - index * 1500).toFixed(2)),
				awardsAmount: RANKING_AWARDS.find((item) => ranking >= item.startRanking && ranking <= item.endRanking)?.awardsAmount ?? 0,
			}
		})
	)

/** 我的赛事 2 条:一条已结算、一条未获奖 */
const MY_CHAMPION_TASKS = [
	{ id: 3, ranking: 4, sumBonus: 500, bonusState: 1 },
	{ id: 2, ranking: 12, sumBonus: 0, bonusState: 2 },
]

/** GetMyChampionTaskList:我参加过的赛事 */
const myChampionTaskList: MockHandler = (ctx) => ok(paged(MY_CHAMPION_TASKS, ctx.body))

/** 锦标赛(Type 114)的接口假数据 */
export const championshipRoutes: MockRoutes = {
	[api.ChampionEntrance]: championEntrance,
	[api.GetChampionTaskList]: championTaskList,
	[api.JoinChampionTask]: joinChampionTask,
	[api.GetChampionTaskDetail]: championTaskDetail,
	[api.GetTop10ChampionTaskDataUserList]: top10ChampionTaskDataUserList,
	[api.GetMyChampionTaskList]: myChampionTaskList,
}
