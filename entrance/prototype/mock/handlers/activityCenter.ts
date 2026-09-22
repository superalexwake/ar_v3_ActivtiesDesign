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
	/** 入口红点：count 活动奖励 2、其余 1；dot 全部为 1；none 全部为 0 */
	redDot: 'count' | 'dot' | 'none'
	/** 显示新手引导气泡 */
	guide: boolean
	/** 进活动页弹出未领奖励提醒 */
	reminder: boolean
	/** 活动 Banner：six 6 张，empty 无 */
	banners: 'six' | 'empty'
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
 * 活动页的 6 个 Banner；bannerID 从 1001 开始，1～3 被 Section/index.vue 的 getActivityRouteName 占用。
 *
 * @remarks category(充值/游戏/新人)、tag(HOT/推荐/NEW/无)是活动页筛选与标签用的固定枚举，不走 pick()
 * 本地化——展示文案由 ActivityFilterTabs.vue / ActivityBannerList.vue 按枚举值统一走 $t()，与筛选 Tab
 * 自身的文案同一套体系，避免和 mock 层的 pick() 两处维护同一份译文。
 */
const banners = (ctx: MockContext) =>
	[
		{ bannerID: 1001, bannerTitle: pick(ctx, '每日签到', 'Daily Check-in', 'दैनिक चेक-इन'), jumpType: 2, contents: '/activity/DailySignIn', image: 'sign-in', category: 'game', tag: null },
		{ bannerID: 1002, bannerTitle: pick(ctx, '首充奖励', 'First Deposit Bonus', 'पहला डिपॉज़िट बोनस'), jumpType: 2, contents: '/activity/FirstRecharge', image: 'first-recharge', category: 'recharge', tag: 'recommend' },
		{ bannerID: 1003, bannerTitle: pick(ctx, '大转盘', 'Spin Wheel', 'स्पिन व्हील'), jumpType: 2, contents: '/activity/Turntable', image: 'turntable', category: 'game', tag: null },
		{ bannerID: 1004, bannerTitle: pick(ctx, '锦标赛', 'Tournament', 'चैंपियनशिप'), jumpType: 2, contents: '/activity/Championship', image: 'championship', category: 'game', tag: 'hot' },
		{ bannerID: 1005, bannerTitle: pick(ctx, '新会员礼包', 'New Member Gift Pack', 'नए सदस्य उपहार पैक'), jumpType: 2, contents: '/activity/MemberPackage', image: 'member-package', category: 'newUser', tag: 'new' },
		{ bannerID: 1006, bannerTitle: pick(ctx, '国庆充值活动', 'National Day Deposit Event', 'राष्ट्रीय दिवस डिपॉज़िट इवेंट'), jumpType: 0, contents: '', image: 'activity', category: 'recharge', tag: null },
	].map(({ image, ...item }) => ({ ...item, bannerUrl: bannerUrl(ctx, image), jumpLinkType: 0, visibility: 0 }))

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
