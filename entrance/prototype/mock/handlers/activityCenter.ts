import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import { rewardStatus } from '../state'
import type { RewardItemStatus } from '../state'
import type { MockContext, MockHandler, MockRoutes } from '../types'

/** 活动页（activityCenter）的参数，声明见 catalog.json；除 banners 外都由 session.ts 的 GetLoadedSetting、GetActiveSetting 读取 */
export interface ActivityCenterParams {
	/** 今日奖励（₹） */
	todayRewards: number
	/** 累计奖励（₹） */
	totalRewards: number
	/** 入口红点：count 活动奖励 5、超级大奖 4、其余 1；dot 全部为 1；none 全部为 0 */
	redDot: 'count' | 'dot' | 'none'
	/** 显示新手引导气泡 */
	guide: boolean
	/** 进活动页弹出未领奖励提醒 */
	reminder: boolean
	/** 活动 Banner：six 6 张，empty 无 */
	banners: 'six' | 'empty'
	/**
	 * 活动页顶部图标行「推荐位」方案(2026-09-22 拍板:图标行不再写死 6 个固定入口,改为从下方活动列表里
	 * recommend=true 的条目筛选+排序而来)。控制台没有多选清单控件(PARAM_TYPES 只有
	 * boolean/number/select/countdown),故退一步用 3 组预设代替逐条勾选。
	 */
	recommendPreset: 'default' | 'top3' | 'none'
	/**
	 * 显示锦标赛(2026-09-24 拍板改为默认打开，对齐设计稿 `活动.png` 默认列表第一张即电子锦标赛)：
	 * 关闭时该条目从下方活动列表隐藏(HOT 标签、倒计时/最高奖金数据仍保留在假数据里，只是 hidden=true，
	 * 不是删除)；打开后原样出现(HOT、倒计时、最高奖金都在)。卡名"电子锦标赛"对齐 2026-09-23 设计稿口径。
	 */
	showChampionship: boolean
	/**
	 * 显示活动奖励(2026-09-24 更新语义：默认关闭，"活动奖励"本身不是真实活动，是"切到任务页签"的
	 * 顶部图标入口，默认只出现在顶部图标行；打开本开关后额外把它作为一张卡片显示在下方活动列表里)。
	 */
	showActivityAward: boolean
}

/** 奖励中心（rewardCenter）的参数，声明见 catalog.json */
interface RewardCenterParams {
	/** 奖励中心入口，由 home.ts 写入 GetHomeSettings.isShowRewardCenter */
	enabled: boolean
	/** 奖励记录：all 9 条，empty 无 */
	records: 'all' | 'empty'
}

/** 奖励中心的一条记录；响应里去掉 base、claimKey，补上 createTime、receiveState */
interface BonusRecord {
	activityId: number
	/** 活动类型编号，页面按它显示活动名与跳转目标 */
	rewardType: number
	/** 1 = 点击跳转对应页面；0 = 点击直接领取 */
	recordType: number
	receiveTaskId: number
	amount: number
	/** 未领取时的状态 */
	base: RewardItemStatus
	maxRewardableAmount?: number
	maxRewardableRate?: number
	/** 直接领取类记录的领取键，与对应活动的领取接口一致；跳转类记录不会被领取，没有这个键 */
	claimKey?: string
}

/**
 * GetRewardCenterList 状态映射（rewardStatus() 结果 → receiveState，见 useBonusPack.hook.ts 的 rewardStateMap）：
 * progress/claimable → 0（未领取）；claimed → 1（已领取）；expired → 2（已过期）。
 */
const RECEIVE_STATE_MAP: Record<RewardItemStatus, number> = { progress: 0, claimable: 0, claimed: 1, expired: 2 }

/**
 * 活动 Banner 占位图地址，按当前语言取对应版本。
 *
 * @param ctx - 请求上下文，提供当前语言。
 * @param name - 图片名，如 `sign-in` 对应 `mock-img/banner-sign-in.svg`。
 * @returns 中文返回原文件，英语、印地语返回同名的 `.en.svg`、`.hd.svg`。
 */
export const bannerUrl = (ctx: MockContext, name: string): string =>
	`mock-img/banner-${name}${ctx.lang === 'zh' ? '' : '.' + ctx.lang}.svg`

/**
 * 图标行「推荐位」用的活动识别码，只给需要在图标行复用现成 80×80 图标 + 走红点/开关参数的活动用；
 * 没有 activityCode 的活动(电子锦标赛/积分商城/国庆充值活动)如果被勾成 recommend，前端用一张
 * 通用活动图标兜底，见 ActivityEntryGrid.vue 的 `.ageneric`。
 */
export type RecommendActivityCode = 'taskReward' | 'invitationBonus' | 'laundry' | 'superJackpot' | 'newMemberPackage' | 'bigWheel' | 'firstRecharge'

/**
 * "top3"预设的候选顺序：与下方活动列表展示顺序一致；积分商城(1011)、国庆充值活动(1006)不参与推荐(与
 * "default"预设口径一致，这两条从来不在推荐候选里)；活动奖励(1007)、电子锦标赛(1004)各自受各自的显示开关
 * 控制——开关关闭时对应候选从这份顺序表里被过滤掉，不占 top3 的名额。
 */
const TOP3_CANDIDATE_ORDER = [1007, 1004, 1002, 1008, 1003, 1005, 1009, 1010]

/**
 * 图标行(推荐位)在"default"预设下的固定 6 个 + 顺序(2026-09-24 三次拍板对齐设计稿：活动奖励→邀请奖励→
 * 洗码量→超级大奖→新会员礼包→大转盘，共 6 个，不含首充返利)。数值即展示顺序，前端 navList 按它排序。
 * "推荐"标签(卡片上显示的 tag)与图标行membership 不再是同一份名单——首充返利(1002)卡片仍要显示"推荐"
 * 标签(与下方活动列表口径一致)，但不占图标行的第 7 个位置，故拆成 iconSet/tagSet 两份。
 */
const DEFAULT_ICON_ORDER: Record<number, number> = { 1007: 1, 1008: 2, 1009: 3, 1010: 4, 1005: 5, 1003: 6 }

/**
 * 图标行(推荐位)完全由这里算出的 iconSet 驱动(2026-09-23 二次拍板：去掉上一轮"活动奖励固定排
 * 第一位"的前端写死逻辑)。控制台没有多选清单控件，用 3 组预设(按 bannerID)代替逐条勾选。
 *
 * @param showChampionship - 电子锦标赛(1004)默认从活动列表里隐藏(见 `showChampionship` 参数)。
 * @param showActivityAward - 活动奖励(1007)默认从活动列表里隐藏(见 `showActivityAward` 参数)；
 * 2026-09-24 起该开关只影响"活动奖励"是否作为卡片出现在下方活动列表，不再影响图标行(图标行的活动奖励
 * 图标始终按 iconSet 展示，与 RECOMMEND_ICON_META.taskReward 的 enabled() 各自把关)。
 * @returns iconSet：决定哪些活动出现在顶部图标行；tagSet：决定哪些活动的卡片显示"推荐"标签。
 * "top3"/"none"两种预设下两者相同(与旧版行为一致)；仅"default"预设下二者不同。
 */
const recommendSetFor = (
	preset: ActivityCenterParams['recommendPreset'],
	showChampionship: boolean,
	showActivityAward: boolean
): { iconSet: Set<number>; tagSet: Set<number> } => {
	switch (preset) {
		case 'default': {
			// 推荐标签名单(卡片"推荐"角标):活动奖励(1007)、首充返利(1002)、邀请奖励(1008)、
			// 大转盘(1003)、新会员礼包(1005)、洗码返水(1009)、超级奖池(1010)
			const tagSet = new Set([1007, 1002, 1008, 1003, 1005, 1009, 1010])
			// 图标行名单(固定 6 个，不含首充返利 1002):见 DEFAULT_ICON_ORDER
			const iconSet = new Set(Object.keys(DEFAULT_ICON_ORDER).map(Number))
			return { iconSet, tagSet }
		}
		case 'top3': {
			const visible = TOP3_CANDIDATE_ORDER.filter((id) => {
				if (id === 1007) return showActivityAward
				if (id === 1004) return showChampionship
				return true
			})
			const set = new Set(visible.slice(0, 3))
			return { iconSet: set, tagSet: set }
		}
		case 'none':
		default:
			return { iconSet: new Set(), tagSet: new Set() }
	}
}

/**
 * 活动列表默认(未打开任何显示开关时)只展示这 4 张卡:电子锦标赛(1004,受 showChampionship 单独控制)、
 * 首充返利(1002)、邀请奖励(1008)、积分商城(1011)。以下条目 2026-09-24 起默认从活动列表隐藏，但假数据
 * 不删除，仍可通过顶部图标行(iconSet)或活动详情直接访问：大转盘(1003)、新会员礼包(1005)、
 * 国庆充值活动(1006)、洗码返水(1009)、超级奖池(1010)。活动奖励(1007)本身不是真实活动(点击只是切到
 * 任务页签)，是否作为列表卡片出现单独由 showActivityAward 控制，默认关闭。
 */
const LIST_HIDDEN_BY_DEFAULT = new Set([1003, 1005, 1006, 1009, 1010])

/**
 * 活动页的活动列表；顺序、名称、标签对齐设计稿 `活动.png` + 2026-09-24 三次拍板的最终口径：
 * 默认(未打开任何开关时)下方滚动列表只展示 4 张卡，顺序为 电子锦标赛(HOT，带倒计时/最高奖金框，
 * showChampionship 默认已打开) → 首充返利(推荐) → 邀请奖励(NEW) → 积分商城(无标签)。活动奖励
 * (点击切任务页签，未登录也能点)本身不算一张真实活动卡，默认不出现在列表，只受 `showActivityAward`
 * 参数单独控制是否额外出现在列表；大转盘/新会员礼包/国庆充值活动/洗码返水/超级奖池等条目默认也不在
 * 列表里出现(数据仍在，见 `LIST_HIDDEN_BY_DEFAULT`)，但仍可能出现在顶部图标行。「每日签到」仍不放
 * 回来(它属于任务页签)。卡名"电子锦标赛""首充返利"按 2026-09-23 设计稿口径改名，之前分别叫
 * "锦标赛""首充奖励"。
 *
 * @remarks 卡片上显示的"推荐"标签就是 recommend 字段本身(2026-09-23 拍板)：勾了 recommend 才会
 * 同时"上图标行"+"显示推荐标签"，两件事不再分开配置——所以这里不再有独立的 tag:'recommend' 字面量，
 * 改成从 specialTag(只表示 HOT/NEW 这类跟 recommend 无关的固定标签) 和 recommend 一起推出最终 tag：
 * `specialTag ?? (recommend ? 'recommend' : null)`。specialTag 与 recommend 同时命中时(如"邀请奖励"
 * 默认 NEW+推荐都成立)按这条规则 specialTag 优先显示，因为卡片同一时间只有一个标签位——这是我这轮加的
 * 取舍规则，不是已有约定，已在回报里单独标注待确认。
 * 1007(活动奖励)、1008(邀请奖励)、1009(洗码返水)、1010(超级奖池)、1011(积分商城)没有现成的大图
 * banner 素材，复用 1006 同款通用活动图(image: 'activity')占位。
 * category(充值/游戏/新人)是活动页筛选用的固定枚举，不走 pick() 本地化——展示文案由
 * ActivityFilterTabs.vue 按枚举值统一走 $t()。
 */
const banners = (ctx: MockContext) => {
	const { recommendPreset, showChampionship, showActivityAward } = params<ActivityCenterParams>(ctx, 'activityCenter')
	const { iconSet, tagSet } = recommendSetFor(recommendPreset, showChampionship, showActivityAward)
	return [
		// 活动奖励(HOT/倒计时等无关):始终在返回结果里(供顶部图标行使用)，是否作为下方列表卡片出现由
		// showActivityAward 控制 hidden 字段(默认 hidden=true，不是真的删除)；不是真的可进入活动，
		// 是"切到任务页签"的快捷方式；前端按 bannerID===1007 特判，点击不导航、只切 Tab，也不需要登录
		{ bannerID: 1007, bannerTitle: pick(ctx, '活动奖励', 'Activity Rewards', 'गतिविधि पुरस्कार'), jumpType: 0, contents: '', image: 'activity', category: 'game', specialTag: null, activityCode: 'taskReward' },
		// 电子锦标赛(HOT、倒计时、最高奖金数据都留着):始终在返回结果里，hidden 字段由 showChampionship 开关控制(默认打开)
		{ bannerID: 1004, bannerTitle: pick(ctx, '电子锦标赛', 'e-Tournament', 'ई-टूर्नामेंट'), jumpType: 2, contents: '/activity/Championship', image: 'championship', category: 'game', specialTag: 'hot', activityCode: null },
		{ bannerID: 1002, bannerTitle: pick(ctx, '首充返利', 'First Deposit Rebate', 'पहला डिपॉज़िट वापसी'), jumpType: 2, contents: '/activity/FirstRecharge', image: 'first-recharge', category: 'recharge', specialTag: null, activityCode: 'firstRecharge' },
		{ bannerID: 1008, bannerTitle: pick(ctx, '邀请奖励', 'Invitation Bonus', 'आमंत्रण बोनस'), jumpType: 2, contents: '/main/InvitationBonus', image: 'activity', category: 'game', specialTag: 'new', activityCode: 'invitationBonus' },
		{ bannerID: 1011, bannerTitle: pick(ctx, '积分商城', 'Points Mall', 'पॉइंट्स मॉल'), jumpType: 2, contents: '/activity/PointMall', image: 'activity', category: 'game', specialTag: null, activityCode: null },
		{ bannerID: 1003, bannerTitle: pick(ctx, '大转盘', 'Spin Wheel', 'स्पिन व्हील'), jumpType: 2, contents: '/activity/Turntable', image: 'turntable', category: 'game', specialTag: null, activityCode: 'bigWheel' },
		{ bannerID: 1005, bannerTitle: pick(ctx, '新会员礼包', 'New Member Gift Pack', 'नए सदस्य उपहार पैक'), jumpType: 2, contents: '/activity/MemberPackage', image: 'member-package', category: 'newUser', specialTag: null, activityCode: 'newMemberPackage' },
		{ bannerID: 1006, bannerTitle: pick(ctx, '国庆充值活动', 'National Day Deposit Event', 'राष्ट्रीय दिवस डिपॉज़िट इवेंट'), jumpType: 0, contents: '', image: 'activity', category: 'recharge', specialTag: null, activityCode: null },
		{ bannerID: 1009, bannerTitle: pick(ctx, '洗码返水', 'Betting Rebate', 'बेटिंग रिबेट'), jumpType: 2, contents: '/main/Laundry', image: 'activity', category: 'game', specialTag: null, activityCode: 'laundry' },
		{ bannerID: 1010, bannerTitle: pick(ctx, '超级奖池', 'Super Jackpot', 'सुपर जैकपॉट'), jumpType: 2, contents: '/main/SuperJackpot', image: 'activity', category: 'game', specialTag: null, activityCode: 'superJackpot' },
	]
		// 不再整条过滤掉 1004/1007:两者数据始终保留在返回结果里，是否作为下方列表卡片出现改由 hidden 字段控制，
		// 顶部图标行(iconSet)与它们是否 hidden 无关(图标行可以出现，即使对应活动此刻在列表里是隐藏的)
		.map(({ image, activityCode, specialTag, ...item }) => {
			const recommend = iconSet.has(item.bannerID)
			const hidden =
				item.bannerID === 1007 ? !showActivityAward
				: item.bannerID === 1004 ? !showChampionship
				: LIST_HIDDEN_BY_DEFAULT.has(item.bannerID)
			return {
				...item,
				bannerUrl: bannerUrl(ctx, image),
				jumpLinkType: 0,
				visibility: 0,
				activityCode,
				recommend,
				hidden,
				tag: specialTag ?? (tagSet.has(item.bannerID) ? 'recommend' : null),
			}
		})
}

/** 1006 国庆充值活动的图文详情，3 段正文 */
const nationalDayHtml = (ctx: MockContext) =>
	pick(
		ctx,
		'<p>国庆假期充值即享超值加成，单笔充值最高可得 188% 彩金奖励，活动期间不限充值次数。</p>' +
			'<p>组队邀请好友注册、每日签到均可叠加额外彩金，奖池每日更新，先到先得。</p>' +
			'<p>本活动最终解释权归平台所有，请理性游戏，量力而行。</p>',
		'<p>Enjoy extra bonuses on deposits during the National Day holiday. A single deposit can earn up to a 188% bonus, with no limit on the number of deposits during the event.</p>' +
			'<p>Inviting friends to sign up and daily check-ins both stack extra bonuses. The prize pool refreshes every day, first come, first served.</p>' +
			'<p>The platform reserves the right of final interpretation of this event. Please play responsibly and within your means.</p>',
		'<p>राष्ट्रीय दिवस की छुट्टियों में डिपॉज़िट पर अतिरिक्त बोनस पाएँ। एक बार के डिपॉज़िट पर 188% तक बोनस मिल सकता है, और इवेंट के दौरान डिपॉज़िट की संख्या पर कोई सीमा नहीं है।</p>' +
			'<p>दोस्तों को साइन अप के लिए आमंत्रित करने और दैनिक चेक-इन से अतिरिक्त बोनस जुड़ते हैं। इनाम पूल रोज़ अपडेट होता है, पहले आओ, पहले पाओ।</p>' +
			'<p>इस इवेंट की अंतिम व्याख्या का अधिकार प्लेटफ़ॉर्म के पास सुरक्षित है। कृपया ज़िम्मेदारी से और अपनी क्षमता के अनुसार खेलें।</p>'
	)

/** GetActivityList：活动页 Banner 列表，分页；banners 为 empty 时返回空列表，页面显示空态 */
const activityList: MockHandler = (ctx) =>
	ok(paged(params<ActivityCenterParams>(ctx, 'activityCenter').banners === 'empty' ? [] : banners(ctx), ctx.body))

/** GetActivityDetails：标题与封面取对应 Banner；1006 返回 3 段图文正文，其余 ID 返回通用说明 */
const activityDetail: MockHandler = (ctx) => {
	const bannerId = Number(ctx.body.bannerId)
	const banner = banners(ctx).find((item) => item.bannerID === bannerId)
	return ok({
		title: banner?.bannerTitle ?? pick(ctx, '活动详情', 'Event Details', 'इवेंट विवरण'),
		coverUrl: banner?.bannerUrl ?? bannerUrl(ctx, 'activity'),
		jumpType: 0,
		contents: '',
		img:
			bannerId === 1006
				? nationalDayHtml(ctx)
				: pick(
						ctx,
						'<p>活动详情内容以实际活动页面为准，当前为原型演示数据。</p>',
						'<p>Event details are subject to the actual event page. This is prototype demo data.</p>',
						'<p>इवेंट का विवरण वास्तविक इवेंट पेज के अनुसार मान्य होगा। यह प्रोटोटाइप डेमो डेटा है।</p>'
					),
	})
}

/**
 * 奖励中心 9 条记录：118/107/20/29/30/103 为跳转类（103 跳转 SuperJackpot，与 useBonusPack 的 mapParam 一致）；
 * 113/115/131 为直接领取，金额取对应活动的 amount 参数，与各自领取接口的入账金额一致。
 */
function bonusRecords(ctx: MockContext): BonusRecord[] {
	const amountOf = (activity: string) => params<{ amount: number }>(ctx, activity).amount
	return [
		{ activityId: 1, rewardType: 118, recordType: 1, receiveTaskId: 1001, amount: 0, base: 'claimable', maxRewardableAmount: 66 },
		{ activityId: 2, rewardType: 107, recordType: 1, receiveTaskId: 1002, amount: 0, base: 'progress', maxRewardableAmount: 66 },
		{ activityId: 3, rewardType: 20, recordType: 1, receiveTaskId: 1003, amount: 0, base: 'claimed', maxRewardableAmount: 500 },
		{ activityId: 4, rewardType: 29, recordType: 1, receiveTaskId: 1004, amount: 0, base: 'progress', maxRewardableRate: 0.1 },
		{ activityId: 5, rewardType: 30, recordType: 1, receiveTaskId: 1005, amount: 0, base: 'expired', maxRewardableRate: 0.05 },
		{ activityId: 6, rewardType: 103, recordType: 1, receiveTaskId: 1006, amount: 0, base: 'progress', maxRewardableAmount: 5000 },
		{ activityId: 7, rewardType: 113, recordType: 0, receiveTaskId: 301, amount: amountOf('newbieGift'), base: 'claimable', claimKey: 'newbieGift:301' },
		{ activityId: 8, rewardType: 115, recordType: 0, receiveTaskId: 9001, amount: amountOf('returnAward'), base: 'claimable', claimKey: 'returnAward:1' },
		{ activityId: 9, rewardType: 131, recordType: 0, receiveTaskId: 9002, amount: amountOf('appDownload'), base: 'claimed', claimKey: 'appDownload:1' },
	]
}

/** GetRewardCenterList：按请求中的 receiveState（0/1/2）过滤；records 为 empty 时三个状态都为空 */
const rewardCenterList: MockHandler = (ctx) => {
	if (params<RewardCenterParams>(ctx, 'rewardCenter').records === 'empty') return ok(paged([], ctx.body))
	const records = bonusRecords(ctx).map(({ base, claimKey, ...record }, index) => ({
		...record,
		createTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
		receiveState: RECEIVE_STATE_MAP[claimKey ? rewardStatus(ctx, claimKey, base) : base],
	}))
	const receiveState = Number(ctx.body.receiveState)
	const filtered = [0, 1, 2].includes(receiveState) ? records.filter((item) => item.receiveState === receiveState) : records
	return ok(paged(filtered, ctx.body))
}

/** 活动页、奖励中心的接口假数据 */
export const activityCenterRoutes: MockRoutes = {
	[api.GetActivityList]: activityList,
	[api.GetActivityDetails]: activityDetail,
	[api.GetRewardCenterList]: rewardCenterList,
}
