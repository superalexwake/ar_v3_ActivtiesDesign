import { fail, ok } from './envelope'
import { pick } from './i18n'
import type { MockContext, MockEnvelope, SessionState } from './types'

/**
 * 会话状态在 sessionStorage 中的键，控制台"重置数据"时删除。
 *
 * @remarks 2026-09-24 由 'proto:state' 升到 v2，避免旧会话残留数据(如 monthHoldings 空数组)干扰，
 * 不做迁移、不兼容旧键。
 */
export const STATE_KEY = 'proto:state:v2'

/** 奖励项状态 */
export type RewardItemStatus = 'progress' | 'claimable' | 'claimed' | 'expired'

/** 初始会话状态：钱包 ₹8888.88；各活动的数据由 featureState() 按参数生成 */
export const INITIAL_STATE: SessionState = {
	balance: 8888.88,
	claimed: {},
	features: {},
	anchors: {},
}

/**
 * 读取会话状态。
 *
 * @returns 可修改的会话状态；不存在或损坏时返回初始状态的副本。
 */
export function readState(): SessionState {
	try {
		const raw = sessionStorage.getItem(STATE_KEY)
		if (raw) return { ...structuredClone(INITIAL_STATE), ...(JSON.parse(raw) as Partial<SessionState>) }
	} catch {
		// 损坏的会话状态按初始状态处理
	}
	return structuredClone(INITIAL_STATE)
}

/**
 * 持久化会话状态。
 *
 * @param state - 处理函数修改后的会话状态。
 */
export function writeState(state: SessionState): void {
	sessionStorage.setItem(STATE_KEY, JSON.stringify(state))
}

/**
 * 读取某个活动自有的会话数据；首次访问时用 init 初始化并写入会话状态。
 *
 * @typeParam T - 该活动的会话数据类型，由调用方在自己的 handlers 文件里定义。
 * @param ctx - 请求上下文。
 * @param key - 活动 ID，如 `pointMall`；控制台按它清除单个活动的会话数据。
 * @param init - 生成初始数据的函数。
 * @returns 可以直接修改的活动会话数据；adapter 在处理后统一持久化。
 */
export function featureState<T>(ctx: MockContext, key: string, init: () => T): T {
	if (!(key in ctx.state.features)) ctx.state.features[key] = init()
	return ctx.state.features[key] as T
}

/**
 * 计算奖励项的状态。
 *
 * @param ctx - 请求上下文。
 * @param key - 已领取记录的键，格式为“活动 ID:记录 ID”，如 `dailyTask:1`；控制台按活动 ID 前缀清除领取记录。
 * @param base - 未领取时该项的状态，由调用方按活动参数给出。
 * @returns 已领取的记录恒为 `claimed`，其余返回 `base`。
 */
export function rewardStatus(ctx: MockContext, key: string, base: RewardItemStatus): RewardItemStatus {
	return ctx.state.claimed[key] ? 'claimed' : base
}

/**
 * 领取一笔奖励：记入已领取并增加钱包余额。
 *
 * @param ctx - 请求上下文。
 * @param key - 已领取记录的键，格式同 {@link rewardStatus}。
 * @param amount - 奖励金额，单位为元。
 * @returns 成功信封；重复领取时返回"奖励已领取"的业务失败信封。
 */
export function claim(ctx: MockContext, key: string, amount: number): MockEnvelope {
	if (ctx.state.claimed[key]) return fail(pick(ctx, '奖励已领取', 'Reward already claimed', 'इनाम पहले ही लिया जा चुका है'))
	ctx.state.claimed[key] = true
	ctx.state.balance = Number((ctx.state.balance + amount).toFixed(2))
	return ok(null)
}
