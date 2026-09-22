import type { ActivityControls, MockContext, ParamDef, ParamValue, PopupKey, Scenario, SessionState } from './types'

/** 场景在 localStorage 中的键，控制台使用同一个键 */
export const SCENARIO_KEY = 'proto:scenario'

const POPUPS: PopupKey[] = [
	'first-recharge',
	'return-award',
	'app-download-reward',
	're-benefit',
	'coupon-arrival',
	'treasure-chest',
	'register-gift',
]

/** number / countdown 参数缺省的闭区间上限 */
const DEFAULT_MAX = 999999999

/** 默认场景：已登录、不弹窗、延迟 200 毫秒、所有活动取 catalog.json 默认值 */
export const DEFAULT_SCENARIO: Scenario = {
	loggedIn: true,
	popup: null,
	latencyMs: 200,
	activities: {},
	focus: null,
}

/**
 * 读取并校验场景。
 *
 * @remarks localStorage 中的内容可能被手工或 AI 改坏；任一字段不合法（含旧结构）时整体回退默认场景并打印警告，不做迁移。
 * @returns 合法的场景。
 */
export function readScenario(): Scenario {
	const raw = localStorage.getItem(SCENARIO_KEY)
	if (!raw) return DEFAULT_SCENARIO
	try {
		const value: unknown = JSON.parse(raw)
		if (isScenario(value)) return value
	} catch {
		// JSON 损坏与字段不合法一样回退默认场景
	}
	console.warn('[mock] 场景数据不合法，已使用默认场景')
	return DEFAULT_SCENARIO
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const isLeaf = (value: unknown): boolean =>
	typeof value === 'boolean' || typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value))

function isScenario(value: unknown): value is Scenario {
	if (!isRecord(value) || 'switches' in value || 'rewardState' in value) return false
	const { loggedIn, popup, latencyMs, activities, focus } = value
	return (
		typeof loggedIn === 'boolean' &&
		(popup === null || POPUPS.includes(popup as PopupKey)) &&
		typeof latencyMs === 'number' &&
		latencyMs >= 0 &&
		isRecord(activities) &&
		Object.values(activities).every((item) => isRecord(item) && Object.values(item).every(isLeaf)) &&
		(focus === null || typeof focus === 'string')
	)
}

/** 覆盖值是否符合参数声明；类型未知时一律不合法 */
function isValidValue(def: ParamDef, value: ParamValue): boolean {
	switch (def.type) {
		case 'boolean':
			return typeof value === 'boolean'
		case 'number':
			return typeof value === 'number' && Number.isFinite(value) && value >= (def.min ?? 0) && value <= (def.max ?? DEFAULT_MAX)
		case 'select':
			return Boolean(def.options?.some((option) => option.value === value))
		case 'countdown':
			return typeof value === 'number' && Number.isFinite(value) && value >= 0
	}
	return false
}

/**
 * 解析一个参数的有效值。
 *
 * @remarks countdown 的覆盖值是截止时刻；没有覆盖值时按会话锚点起算，锚点在本标签页会话内保持不变。
 */
function resolveParam(id: string, def: ParamDef, applied: Record<string, ParamValue> | undefined, state: SessionState): ParamValue {
	const value = applied?.[def.name]
	if (value !== undefined && isValidValue(def, value)) return value
	if (value !== undefined) console.warn(`[mock] 参数不合法，已用默认值：${id}.${def.name}`)
	if (def.type !== 'countdown' || def.default === 0) return def.default
	const key = `${id}.${def.name}`
	state.anchors[key] ??= Date.now() + Number(def.default) * 1000
	return state.anchors[key]
}

/**
 * 把场景覆盖值与 catalog.json 默认值合并成每个活动的有效参数。
 *
 * @param defs - catalog.json 的 activities。
 * @param scenario - 本次启动的场景。
 * @param state - 会话状态；为从未应用过的 countdown 参数写入 anchors。
 * @returns 活动 ID → 参数名 → 有效值。countdown 为截止时刻毫秒时间戳，0 表示关闭。
 */
export function resolveParams(
	defs: Record<string, ActivityControls>,
	scenario: Scenario,
	state: SessionState
): Record<string, Record<string, ParamValue>> {
	return Object.fromEntries(
		Object.entries(defs).map(([id, controls]) => [
			id,
			Object.fromEntries(controls.params.map((def) => [def.name, resolveParam(id, def, scenario.activities[id], state)])),
		])
	)
}

/**
 * 读取某个活动当前生效的参数。
 *
 * @typeParam T - 该活动的参数类型，由各 handlers 文件按 catalog.json 声明自行定义。
 * @param ctx - 请求上下文。
 * @param activity - 活动 ID。
 * @returns 已校验、已补默认值的参数（只读）。
 * @throws 活动未在 catalog.json 声明时抛错；adapter 转成 `code -1` 并打印接口路径。
 */
export function params<T>(ctx: MockContext, activity: string): Readonly<T> {
	const value = ctx.params[activity]
	if (!value) throw new Error('活动未在 catalog.json 声明：' + activity)
	return value as unknown as Readonly<T>
}
