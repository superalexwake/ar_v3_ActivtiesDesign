/** 首页弹窗键，对应 useGlobalDialog 首屏奖励弹窗 */
export type PopupKey =
	| 'first-recharge'
	| 'return-award'
	| 'app-download-reward'
	| 're-benefit'
	| 'coupon-arrival'
	| 'treasure-chest'
	| 'register-gift'

/** 原型支持的语言，与 `src/languages/languages.ts` 的 key 一致 */
export type ProtoLang = 'zh' | 'en' | 'hd'

/** 参数取值 */
export type ParamValue = boolean | number | string

/** 参数类型；countdown 是“从应用时刻起算的剩余秒数” */
export type ParamType = 'boolean' | 'number' | 'select' | 'countdown'

/** select 参数的一个选项 */
export interface ParamOption {
	/** 选项值，同一参数内唯一；handler 按它分支 */
	value: string
	/** 控制台显示文字 */
	label: string
}

/** 一个可调参数，声明在 catalog.json 的 `activities[id].params` */
export interface ParamDef {
	/** 参数名，/^[a-z][A-Za-z0-9]{0,31}$/，同一活动内唯一；活动开关一律叫 enabled */
	name: string
	/** 控制台显示名（中文） */
	label: string
	/** 参数类型 */
	type: ParamType
	/** 默认值：boolean→布尔；number→有限数；select→某个 options[].value；countdown→秒数（非负整数，0 表示关闭） */
	default: ParamValue
	/** 仅 select 必填：至少 2 项 */
	options?: ParamOption[]
	/** 仅 number / countdown：闭区间下限，缺省 0 */
	min?: number
	/** 仅 number / countdown：闭区间上限，缺省 999999999 */
	max?: number
	/** 仅 number：输入步长，缺省 1；金额写 0.01 */
	step?: number
	/** 仅展示：单位，如 ₹、%、天、次、人、张 */
	unit?: string
	/** 仅展示：驱动的接口字段，如 "GetTaskList.efficientPeople"，面板以灰字显示在控件下方 */
	drives?: string
}

/** 边界场景：一键设置多个参数，然后打开页面或弹窗 */
export interface PresetDef {
	/** 按钮文字，同一活动内唯一 */
	label: string
	/** 与默认值不同的参数；没写的参数取默认值（不是保留当前值）；countdown 写秒数 */
	values: Record<string, ParamValue>
	/** 预期画面，一句话，显示在按钮下方 */
	note?: string
	/** 应用后打开的 H5 路由（可带查询串）；与 popup 互斥；都不写时按当前清单项的默认方式打开 */
	route?: string
	/** 应用后触发的首页弹窗 */
	popup?: PopupKey
}

/** 动作：不改参数，只打开页面或弹窗 */
export interface ActionDef {
	/** 按钮文字 */
	label: string
	/** H5 路由；与 popup 二选一 */
	route?: string
	/** 首页弹窗键；与 route 二选一 */
	popup?: PopupKey
}

/** 一个活动的控制项声明 */
export interface ActivityControls {
	/** 面板顶部说明，1～2 句 */
	note?: string
	/** 参数，按面板显示顺序排列 */
	params: ParamDef[]
	/** 边界场景 */
	presets?: PresetDef[]
	/** 动作 */
	actions?: ActionDef[]
}

/** 控制台清单项 */
export interface CatalogItem {
	/** 显示标题 */
	title: string
	/** 活动类型编号（Type N）；入口页与其他活动没有 */
	type?: number
	/** 打开方式：H5 路由、首页弹窗、独立 HTML 原型、无页面 */
	kind: 'route' | 'popup' | 'html' | 'none'
	/** route 为 H5 路由，html 为原型页面路径 */
	target?: string
	/** kind 为 popup 时触发的首页弹窗 */
	popup?: PopupKey
	/** 说明，显示在清单悬停提示与面板头部 */
	note?: string
	/** 控制项所属活动 ID，即 Catalog.activities 的键；没有控制项的项不写 */
	activity?: string
}

/** 控制台清单，即 catalog.json 的内容 */
export interface Catalog {
	/** 清单分组，按显示顺序排列 */
	groups: {
		/** 分组标题 */
		title: string
		/** 分组内的清单项 */
		items: CatalogItem[]
	}[]
	/** 活动 ID（/^[a-z][A-Za-z0-9]{0,31}$/）→ 控制项声明 */
	activities: Record<string, ActivityControls>
}

/**
 * 演示场景。
 *
 * @remarks 由控制台写入 localStorage['proto:scenario']，H5 每次启动时读取一次。
 */
export interface Scenario {
	/** 是否已登录；为 false 时启动阶段清除登录态 */
	loggedIn: boolean
	/** 本次启动要触发的首页弹窗；null 表示不触发 */
	popup: PopupKey | null
	/** 每个接口的模拟延迟，单位毫秒 */
	latencyMs: number
	/** 各活动参数的覆盖值，键为活动 ID；只有在控制台应用过的活动才有条目。countdown 存截止时刻的毫秒时间戳，0 表示关闭 */
	activities: Record<string, Record<string, ParamValue>>
	/** 最近一次从控制台打开的清单项所属活动 ID；没有时为 null。只用于每日任务页选默认 Tab */
	focus: string | null
}

/**
 * 会话状态。
 *
 * @remarks 保存在 sessionStorage['proto:state']，同一标签页内刷新保留，新标签页从初始值开始。
 */
export interface SessionState {
	/** 钱包余额，单位为元 */
	balance: number
	/** 已领取的奖励记录，键为“活动 ID:记录 ID” */
	claimed: Record<string, true>
	/** 各活动自有的会话数据，键为活动 ID，由 featureState() 按需初始化 */
	features: Record<string, unknown>
	/** 从未应用过的 countdown 参数的截止时刻（毫秒），键为“活动 ID.参数名” */
	anchors: Record<string, number>
}

/** 处理函数的上下文 */
export interface MockContext {
	/** 接口路径，已去掉域名和 /api/webapi、/api 前缀，如 '/GetActivityList' */
	path: string
	/** 请求体与查询参数合并后的对象；都没有时为空对象 */
	body: Record<string, unknown>
	/** 当前场景 */
	scenario: Readonly<Scenario>
	/** 会话状态；处理函数可以修改，adapter 在处理后持久化 */
	state: SessionState
	/** 当前 H5 语言 */
	lang: ProtoLang
	/** 各活动当前生效的参数，活动 ID → 参数名 → 值；由 adapter 注入，handler 通过 params() 读取 */
	params: Record<string, Record<string, ParamValue>>
}

/**
 * 业务信封，与 src/api/axios.ts 响应拦截器的约定一致。
 *
 * @typeParam T - 业务数据类型。
 */
export interface MockEnvelope<T = unknown> {
	/** 业务码：0 成功，-2 业务失败（拦截器弹提示），1 业务失败（页面只处理成功分支、没有 catch 的接口用），-1 系统错误 */
	code: number
	/** 提示文案 */
	msg: string
	/** 业务数据 */
	data: T
	/** 消息码：成功信封带 0；业务失败时页面需要分流的失败码也放这里 */
	msgCode?: number
	/** 服务器当前时间，格式 `YYYY-MM-DD HH:mm:ss`；只有页面读取它的接口才返回 */
	serviceNowTime?: string
}

/**
 * 接口处理函数。
 *
 * @param ctx - 本次请求的上下文。
 * @returns 业务信封。
 */
export type MockHandler = (ctx: MockContext) => MockEnvelope

/** 路由表：键为接口路径（取自 `@/api/url` 的常量） */
export type MockRoutes = Record<string, MockHandler>

/** 暴露给控制台读取的 mock 运行信息 */
export interface ProtoMockInfo {
	/** 未覆盖的接口路径，按首次出现顺序去重 */
	unhandled: string[]
	/** 本次启动生效的场景 */
	scenario: Scenario
	/** 默认场景，控制台"重置数据"时写回 */
	defaultScenario: Scenario
	/** 各活动当前生效的参数，同 MockContext.params；countdown 为截止时刻毫秒时间戳，控制台据此显示剩余时间 */
	params: Record<string, Record<string, ParamValue>>
}

declare global {
	interface Window {
		/** mock 运行信息，控制台通过同源 iframe 读取 */
		__protoMock: ProtoMockInfo
	}
}
