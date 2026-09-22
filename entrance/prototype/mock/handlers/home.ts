import dayjs from 'dayjs'
import api from '@/api/url'
import { ok, paged } from '../envelope'
import { pick } from '../i18n'
import { params } from '../scenario'
import type { MockContext, MockHandler, MockRoutes } from '../types'
import { bannerUrl } from './activityCenter'

/** 首页（home）的参数，声明见 catalog.json */
interface HomeParams {
	/** 登录后弹出公告（GetSitePopMsgList 返回 2 条公告，否则为空数组） */
	announcement: boolean
	/** 滚动公告有内容（GetSiteMessageList 返回 2 条公告，否则为空列表） */
	noticeBar: boolean
}

/** 首页虚构电子游戏，键为 slotsTypeID；游戏名是专名，印地语沿用英文名 */
const SLOT_GAMES: Record<number, { zh: string; en: string }> = {
	101: { zh: '幸运老虎机', en: 'Lucky Slots' },
	102: { zh: '黄金水果', en: 'Golden Fruits' },
	103: { zh: '财神到', en: 'God of Wealth' },
	104: { zh: '龙年大吉', en: 'Dragon Fortune' },
}

/** 中奖滚动条与今日盈利榜的虚构玩家：打码昵称后缀、游戏大类、投注额、中奖额 */
const WINNERS = [
	{ masked: '8****1', type: 'slot', betAmount: 100, amount: 2680.5 },
	{ masked: '6****2', type: 'slot', betAmount: 50, amount: 980.2 },
	{ masked: '3****9', type: 'lottery', betAmount: 20, amount: 356.8 },
] as const

/** 读取某个活动的开关参数 enabled */
const isEnabled = (ctx: MockContext, activity: string) => params<{ enabled: boolean }>(ctx, activity).enabled

/**
 * 虚构电子游戏的名称，首页游戏列表、大奖预告和电子大奖页共用，保证三处同名。
 *
 * @param ctx - 请求上下文，提供当前语言。
 * @param id - 游戏编号（slotsTypeID，101～104）。
 * @returns 当前语言下的游戏名；印地语沿用英文名。
 */
export const slotName = (ctx: MockContext, id: number) => pick(ctx, SLOT_GAMES[id].zh, SLOT_GAMES[id].en, SLOT_GAMES[id].en)

/** 虚构的打码玩家昵称，如“玩家8****1” */
const player = (ctx: MockContext, masked: string) => pick(ctx, '玩家', 'Player', 'खिलाड़ी') + masked

const typeName = (ctx: MockContext, type: 'slot' | 'lottery') =>
	type === 'slot' ? pick(ctx, '电子', 'Slots', 'स्लॉट') : pick(ctx, '彩票', 'Lottery', 'लॉटरी')

/** 首页公告，公告弹窗与滚动公告共用 */
const notices = (ctx: MockContext) => {
	const addtime = dayjs().format('YYYY-MM-DD HH:mm:ss')
	return [
		{
			title: pick(ctx, '系统公告', 'System Notice', 'सिस्टम सूचना'),
			siteMessage: pick(
				ctx,
				'系统已完成例行维护，功能一切正常。',
				'Routine maintenance is complete and all features are working normally.',
				'नियमित रखरखाव पूरा हो गया है और सभी सुविधाएँ सामान्य रूप से काम कर रही हैं।'
			),
			addtime,
		},
		{
			title: pick(ctx, '活动公告', 'Event Notice', 'इवेंट सूचना'),
			siteMessage: pick(
				ctx,
				'新一期活动已上线，快去活动页查看吧。',
				'New events are live. Check them out on the Activity page!',
				'नए इवेंट लाइव हैं। इन्हें गतिविधि पेज पर देखें!'
			),
			addtime,
		},
	]
}

/** GetHomeSettings：首页与站点级配置，字段对应 src/stores/modules/setting.ts 的 getHomeSetting() 解构 */
const homeSettings: MockHandler = (ctx) => {
	const turntable = isEnabled(ctx, 'turntable')
	const jackpot = params<{ validDays: number; maxAmount: number }>(ctx, 'jackpot')
	return ok({
		areaPhoneLenList: [{ area: '+91', len: 10 }],
		arbApiUrl: [],
		headLogo: '',
		isShowAppDownloadUp: false,
		isShowAppDownloadDown: false,
		isShowLotteryDragon: false,
		jackportMaxReswadAmount: jackpot.maxAmount,
		projectName: pick(ctx, '活动原型', 'Activity Prototype', 'गतिविधि प्रोटोटाइप'),
		projectLogo: '',
		// 后端原始格式是竖线分隔字符串，useLanguage.hook.ts 用 String#replace/#split 解析，不能传数组
		languages: 'zh|en|hd',
		webIco: '',
		dollarSign: '₹',
		upperOrLower: '',
		defaultCurrentLanguage: 'zh',
		isSplitLocalEWallet: false,
		isOpenLoginChangeLanguage: '0',
		electronicWinRateExternalLink: '',
		electronicWinRateImgUrl: '',
		isShowElectronicWinRateExternalLink: false,
		isShowHotGameWinOdds: false,
		isShowAppHandCodeWashingSwitch: params<{ manualButton: boolean }>(ctx, 'laundry').manualButton,
		// SuperJackpot 页文案按这个值拼“奖励有效期为 N 天”
		rewardValidityTime: jackpot.validDays,
		ossUrl: '',
		bigTurntableLink: '',
		bigTurntableImgUrl: '',
		homeBigTurntableLink: '',
		homeBigTurntableImgUrl: '',
		lotteryDragonIcon: '',
		telegramExternalLink: '',
		telegramImgUrl: '',
		// setting.ts 用 || false 直接判真假，不走 translateBoolean，这里传原始布尔值
		isOpenTurntable: turntable,
		isPartnerReward: isEnabled(ctx, 'teamPartner'),
		eventRegionConfigList: [],
		isSelfCustomerService: false,
		webSiteUrl: '',
		firstDepositRewardCodeAmount: '',
		isOpenRegisterPhoneFirstZeroSwitch: false,
		isShowDownAppBonusAmountSwitch: false,
		isOpenAdjustEvent: false,
		firebaseConfig: {},
		jgConfig: {},
		isOpenArLottery: false,
		isSwitchSaasBalance: false,
		arUpiInputUtrSwitch: false,
		isOpenInvitedWheel: isEnabled(ctx, 'inviteWheel'),
		isOpenDownAppRewardSwitch: params<{ siteSwitch: boolean }>(ctx, 'appDownload').siteSwitch,
		invitedWheelImgUrl: '',
		invitedWheelTotalPrizeAmount: 0,
		isShowRewardCenter: isEnabled(ctx, 'rewardCenter'),
		downAppBonusAmount: 0,
		downAppRechargeAmount: 0,
		bonusCenterImgUrl: '',
		isOpenBrowserConsoleDebug: true,
		needKycValidIsOpen: false,
		homeBigTurntableSwitch: turntable,
		needFastKycValidIsOpen: false,
		lastestAppVersionInfo: null,
	})
}

/** GetBannerList：首页顶部轮播图，图片按当前语言取对应版本 */
const bannerList: MockHandler = (ctx) =>
	ok([
		{ bannerUrl: bannerUrl(ctx, 'activity'), url: '' },
		{ bannerUrl: bannerUrl(ctx, 'activity'), url: '' },
	])

/** GetDailyProfitRank：中奖信息滚动条 + 今日盈利排行榜，字段对应 useHome.hook.ts 的 getWinInfoDetail() */
const dailyProfitRank: MockHandler = (ctx) => {
	const now = dayjs()
	const winners = WINNERS.map((item) => ({ ...item, nickName: player(ctx, item.masked), typeName: typeName(ctx, item.type) }))
	return ok({
		dataList: winners.map((item) => ({
			type: item.type,
			typeName: item.typeName,
			userPhoto: '',
			nickName: item.nickName,
			betAmount: item.betAmount,
			amount: item.amount,
			winTime: now.format('YYYY-MM-DD HH:mm:ss'),
			showType: 1,
			imgUrl: '',
			entryType: 'other',
			vendorCode: '',
			vendorId: 0,
			gameID: '',
			gameNameEn: '',
			state: 1,
			isMaintain: 0,
			isGameSaasMaintain: 0,
			typeId: null,
		})),
		penarikanList: winners.map((item) => ({
			nickName: item.nickName,
			price: item.amount,
			time: now.format('HH:mm:ss'),
			typeName: item.typeName,
			userPhoto: '',
		})),
	})
}

/** GetPwaDomainList：PWA 备用域名列表，必须是数组——usePwa.ts 对结果直接调用 Array#map */
const pwaDomainList: MockHandler = () => ok(['https://mock-pwa1.prototype.invalid', 'https://mock-pwa2.prototype.invalid'])

/**
 * GetSitePopMsgList（路由常量名为 api.GetSiteMessage）：登录后的公告弹窗，返回数组而非分页结构。
 *
 * @remarks 默认关闭：公告在弹窗队列里优先级最高，打开后会挡在控制台触发的其他奖励弹窗前面；
 * `announcementPipe` 对空数组有 `!!props?.notices?.length` 中间件短路，不会入队，也不会抛错。
 */
const sitePopMsgList: MockHandler = (ctx) => ok(params<HomeParams>(ctx, 'home').announcement ? notices(ctx) : [])

/** GetSiteMessageList：首页滚动公告栏与公告列表页，分页结构 */
const siteMessageList: MockHandler = (ctx) => ok(paged(params<HomeParams>(ctx, 'home').noticeBar ? notices(ctx) : [], ctx.body))

/**
 * GetGameCategoryList：首页游戏分类 Tab，列表顺序即展示顺序。
 *
 * @remarks `typeNameCode` 必须是 `src/languages/modules/zh.ts` 里 `code<N>` 使用的数字文案编码
 * （而非 categoryCode 本身），index.vue 用 `t('code' + item.typeNameCode)` 取标题文案。
 */
const gameCategoryList: MockHandler = () =>
	ok([
		{ state: 1, categoryCode: 'Popular', typeNameCode: '9302', categoryImg: '' },
		{ state: 1, categoryCode: 'Slot', typeNameCode: '9304', categoryImg: '' },
		{ state: 1, categoryCode: 'Lottery', typeNameCode: '9301', categoryImg: '' },
	])

/** GetAllGameList：各分类下的游戏数据；键需与 GetGameCategoryList 的 categoryCode 小写形式一致 */
const allGameList: MockHandler = (ctx) =>
	ok({
		popular: {
			platformList: [
				{ vendorId: '1', gameCode: 'slot-1', imgUrl: '', winOdds: 96 },
				{ vendorId: '2', gameCode: 'slot-2', imgUrl: '', winOdds: 94 },
				{ vendorId: '3', gameCode: 'slot-3', imgUrl: '', winOdds: 92 },
			],
			clicksTopList: [
				{ vendorId: '4', gameCode: 'slot-4', imgUrl: '', winOdds: 98 },
				{ vendorId: '5', gameCode: 'slot-5', imgUrl: '', winOdds: 90 },
				{ vendorId: '6', gameCode: 'slot-6', imgUrl: '', winOdds: 88 },
			],
			featureGame: [],
		},
		slot: [101, 102, 103, 104].map((id) => ({ slotsTypeID: id, slotsName: slotName(ctx, id), state: 1, vendorImg: '' })),
		lottery: [
			{ id: 1, categoryImg: '', categoryCode: 'Win Go' },
			{ id: 2, categoryImg: '', categoryCode: '5D' },
			{ id: 3, categoryImg: '', categoryCode: 'K3' },
			{ id: 4, categoryImg: '', categoryCode: 'XOSO' },
		],
		// 首页“电子大奖”预告轮播（bigaward.vue），数值与 jackpot.ts 的中奖记录一致，让首页预告和 SuperJackpot 详情页对得上
		awardrecordlist: [
			{ gameName: slotName(ctx, 101), imgUrl: '', multiple: 100, bonusAmount: 20, userName: player(ctx, '5****3') },
			{ gameName: slotName(ctx, 103), imgUrl: '', multiple: 500, bonusAmount: 100, userName: player(ctx, '2****7') },
			{ gameName: slotName(ctx, 102), imgUrl: '', multiple: 1000, bonusAmount: 500, userName: player(ctx, '9****4') },
			{ gameName: slotName(ctx, 104), imgUrl: '', multiple: 100, bonusAmount: 20, userName: player(ctx, '4****6') },
			{ gameName: 'Win Go', imgUrl: '', multiple: 500, bonusAmount: 100, userName: player(ctx, '7****2') },
		],
	})

/** NewPromotion：推广首页数据，字段对应 src/views/promotion/index.vue 的默认值兜底结构 */
const newPromotion: MockHandler = () =>
	ok({
		mylink: 'https://prototype.invalid/#/register?r_code=888888',
		aglink: '',
		mycode: '888888',
		children_Lv_1_Count: 5,
		children_Lv_Count_X: 12,
		children_Lv_1_Count_Add: 1,
		children_Lv_Count_X_Add: 2,
		children_Lv_1_Count_Add_Yesterday: 1,
		children_Lv_Count_X_Add_Yesterday: 2,
		children_Lv_RebateAmount_Yesterday: 66.5,
		children_Lv_1_RebateAmount_Yesterday: 30.2,
		children_Lv_RebateAmount_Week: 320.8,
		children_Lv_1_RebateAmount_X_Yesterday: 15.6,
		children_Lv_RebateAmount: 980.35,
	})

/** GetSaasAllwallets：钱包页三方游戏余额汇总，字段对应 src/stores/modules/wallet.ts 的 getAllwalletsBalance() */
const saasAllWallets: MockHandler = () =>
	ok({
		thidGameBalanceList: [
			{ vendorCode: 'Lottery', balance: 500.0 },
			{ vendorCode: 'PG', balance: 300.0 },
		],
	})

/** 首页、TabBar 页面与站点配置的接口假数据 */
export const homeRoutes: MockRoutes = {
	[api.GetHomeSettings]: homeSettings,
	[api.GetBannerList]: bannerList,
	[api.GetGameCategoryList]: gameCategoryList,
	[api.GetAllGameList]: allGameList,
	[api.GetDailyProfitRank]: dailyProfitRank,
	[api.GetPwaDomainList]: pwaDomainList,
	[api.GetSiteMessage]: sitePopMsgList,
	[api.GetSiteMessageList]: siteMessageList,
	[api.NewPromotion]: newPromotion,
	[api.GetSaasAllwallets]: saasAllWallets,
	[api.NotifyARGameRecover]: () => ok(null),
}
