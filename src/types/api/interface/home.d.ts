import type exp from 'constants'
import type { type } from 'os'
import type { Result } from './axios-types'

export namespace Home {
	export type SwiperProps = {
		bannerUrl: string
		url: string
	}
	export type DailyProfitRankProps = {
		// NickName: string
		// Price: number
		// Time: string
		// TypeName: string
		// UserPhoto: string
		nickName: string
		price: number
		time: string
		typeName: string
		userPhoto: string
	}
	export type ResHomeData = {
		bannerlist: []
		c16list: []
		ddwzgamelist: []
		dmwzgamelist: []
		isopenlotter: {}
		jswzgamelist: []
		k3list: []
		livewlist: []
		new5dwlist: []
		newlist: []
		penarikanlist: []
		realpersonloglist: []
		s16list: []
		sitemsg: {}
		slotslist: []
		sportloglist: []
		trxwigolist: []
		vnmodellist: []
		website: {}
		wlist: []
		wnwzgamelist: []
		wzgamelist: []
	}
	export interface HomeResultData extends Result {
		data: ResHomeData
	}

	export type ReqGetHomeDate = {
		type: number
		asymbol: string
	}
}

//getGameList  重复定义了
// export type GameListProps  = {
// 	slotslist: {
// 		GameId: number
// 		Games: string
// 		Img: string
// 		VendorId: number
// 		ctype: string
// 	}[]
// }
export type ReqGameList = {
	type: number
}

export type ReqOnlineGameList = {
	categoryType: number
}
/**
 * @设置单个消息参数
 * @pageSize 	页面条数
 * @pageNo		页面数
 */
// getMessages
export type ReqMessageList = {
	pageSize: number
	pageNo: number
}
export type ResMessageList = {
	addTime: string
	messageID: number
	messages: string
	state: number
	stateName: string
	title: string
}
/**
 * @设置单个消息参数
 * @uid 		随机数
 * @sign		签名
 * @messageId	消息id
 * @state		1：已读，2：删除
 */
// setMessageState
export type ReqMessageState = {
	//uid: number
	//sign: string
	messageID: number
	state: number
}
/**
 * @设置全部已读
 * @state		1：已读，2：删除
 */
// setAllMessageStates
export type ReqAllMessageStates = {
	state: number //1已读 2删除
	// uid: number
	// sign: string
	// type: number
}

export type ResBannerList = {
	url: string
	bannerUrl: string
}[]

// GetSiteSystemMsg
export type ReqGetSiteSystemMsg = {
	type: number
	asymbol: string
}

export interface MessageDataList {
	title: string
	siteMessage: string
	addtime: Date
}

export interface ResGetSiteSystemMsg {
	website: {
		totalPeople: string
		totalMoney: string
		onlinePeople: string
		webTime: string
		isSlots: number
		androidUrl: string
		iosUrl: string
	}
	sitemsg: {
		siteMessage: string
	}
	newlist: [
		{
			newsID: string
			newsTitle: string
			addTime: string
		}
	]
}

// DailyProfitRank
export type ResDailyProfitRank = {
	[key as keyof ResDailyProfitRank]: [
		{
			type: string
			userPhoto: string
			nickName: string
			betAmount: number
			amount: number
		}
	]
}
//
export type ResSlotGamesList = {
	[key: string]: boolean
}
//
export type siteMesgData = {
	addtime: string
	siteMessage: string
	title: string
}
export interface ResSiteMessageList extends MessageData<any> {
	list: any[]
}

export type ResGetSafeList = {
	addTime: string
	type: number
	dayShareRate: number
	orderNum: string
	safeEarnings: string
	earnings: number
	amount: number
	type?: number
}

export interface ResGetSafeData extends MessageData<ResGetSafeList> {}

export interface ResGetSafeLogData extends MessageData<ResGetSafeList> {
	extend1: number
	extend2: number
	extend3: number
}
/**
 * @description 请求获取保险箱日志数据
 * @pageSize 页面大小
 * @pageNo 页面编号
 * @month 月份
 */
export interface ReqGetSafeLogData {
	pageSize: number
	pageNo: number
	month?: string
}

/**
 * @description 请求设置保险箱转入转出
 * @amount 金额
 */
export interface ReqSetSafeInOut {
	amount: number
}

/**
 * @description 响应获取保险箱余额
 * @balance 余额
 * @safeEarnings 保险箱收益
 * @dayShareRate 日分红率
 */
export interface ResGetSafeAmount {
	balance: number
	safeEarnings: string
	dayShareRate: number
}

/**
 * @description 响应获取财富状态
 * @state 状态
 * @shareTime 分享时间
 * @dayShareRate 日分红率
 * @safeAmount 保险箱余额
 */
export interface ResGetWealthState {
	state: string
	shareTime: number
	dayShareRate: number
	safeAmount: number
}

/**
 * @description 响应获取保险箱信息
 * @state 状态
 * @shareTime 分享时间
 * @dayShareRate 日分红率
 * @safeAmount 保险箱余额
 * @safeEarnings 保险箱收益
 * @safeTotalAmount 保险箱总额
 * @shareAmount 分享金额
 */
export interface ResGetSafeInfo {
	state: string
	shareTime: number
	dayShareRate: number
	safeAmount: string
	safeEarnings: string
	safeTotalAmount: string
	shareAmount: number
}

/**
 * @description WinGo相关接口
 */
export namespace WinGo {
	/**
	 * @获取游戏列表
	 * @typeID 类型id
	 * @typeName 类型名称
	 * @intervalM 开奖周期，单位分钟
	 * @scope 投注金额格式
	 * @sort 排序规则
	 * @gamePresentation 玩法介绍
	 */
	export interface ResWinGoGetTypeList {
		typeID: number
		typeName: string
		intervalM: number
		scope: string
		sort: number
		gamePresentation: string
	}
	/**
	 * @获取当期信息参数
	 * @typeId 彩票游戏类型
	 */
	export interface reqWinGoGetGameIssue {
		typeId: number
	}
	/**
	 * @获取当期信息列表
	 * @issueNumber 期号
	 * @openIssueNumber 开奖号码
	 * @startTime 开始时间
	 * @serviceTime 服务器时间
	 * @endTime 结束时间
	 * @type 玩法
	 * @intervalM 开奖周期
	 */
	export interface resWinGoGetGameIssue {
		issueNumber: string
		openIssueNumber: string
		startTime: Date
		serviceTime: Date
		endTime: Date
		type: number
		intervalM: number
	}
	/**
	 * @获取游戏记录参数
	 * @pageSize 每页数据量大小
	 * @pageNo 当前页
	 * @typeId 彩票游戏 类型
	 */
	export interface reqGetNoaverageEmerdList {
		pageSize: number
		pageNo: number
		typeId: number
	}
	/**
	 * @获取游戏记录返回参数
	 * @issueNumber 期号
	 * @number 尾数
	 * @colour 颜色
	 * @premium 开奖结果
	 * @rowId 行号
	 * @day 日期
	 * @time 时间
	 * @blockName 区块名称
	 * @number 号码
	 * @blockNumber 区块号码
	 * @issue 期号
	 */
	export type GetNoaverageEmerdList = {
		issueNumber: string
		number: string
		colour: string
		premium: string
		rowId?: number
		day?: boolean
		time?: string
		blockName?: string
		number?: string | number
		blockNumber?: string | number
		issue?: string
	}
	/**
	 * @description WinGo获取不平均Emerd列表响应参数
	 * @list 不平均Emerd列表
	 * @extends MessageData
	 */
	export interface resGetNoaverageEmerdList extends MessageData<GetNoaverageEmerdList> {}
	/**
	 * @获取我的游戏游戏记录返回参数
	 * @issueNumber 期号
	 * @gameType 彩票投注类型
	 * @orderNumber 投注订单号
	 * @amount 投注金额
	 * @betCount 份数
	 * @number 尾数
	 * @selectType 选择类型
	 * @colour 颜色
	 * @premium 开奖结果
	 * @realAmount 真实下注金额
	 * @fee 手续费
	 * @figure 数字
	 * @state 状态
	 * @profitAmount 盈利金额
	 * @addTime 下注日期
	 * @sumCount 总数
	 * @oneList 第一列表
	 * @towList 第二列表
	 * @threeList 第三列表
	 * @gameType 游戏类型
	 */
	export type GetMyEmerdList = {
		issueNumber: string
		gameType: null
		orderNumber: string
		amount: number
		betCount: number
		number: string
		selectType: string
		colour: string
		premium: string
		realAmount: number
		fee: number
		figure: null
		state: number
		profitAmount: number
		addTime: Date
		sumCount?: number
		oneList?: any
		towList?: any
		threeList?: any
		gameType?: number
	}
	/**
	 * @description WinGo获取我的Emerd列表响应参数
	 * @extends MessageData
	 */
	export interface reswinGoGetMyEmerdList extends MessageData<GetMyEmerdList> {}
	/**
	 * @description WinGo获取Emerd列表响应参数
	 * @list Emerd列表
	 * @type 类型
	 * @typeName 类型名称
	 * @type_Number 类型编号
	 * @number_0 数字0
	 * @number_1 数字1
	 * @number_2 数字2
	 * @number_3 数字3
	 * @number_4 数字4
	 * @number_5 数字5
	 * @number_6 数字6
	 * @number_7 数字7
	 * @number_8 数字8
	 * @number_9 数字9
	 */
	export interface resWinGoGetEmerdList {
		list: {
			type: number
			typeName: string
			type_Number: number
			number_0: number
			number_1: number
			number_2: number
			number_3: number
			number_4: number
			number_5: number
			number_6: number
			number_7: number
			number_8: number
			number_9: number
		}[]
	}
	/**
	 * @description WinGo游戏投注请求参数
	 * @typeId 类型id
	 * @issuenumber 期号
	 * @amount 投注金额
	 * @betCount 投注数量
	 * @gameType 游戏类型
	 * @selectType 选择类型
	 */
	export interface reqWinGoGameBetting {
		typeId: number
		issuenumber: string
		amount: number
		betCount: number
		gameType: number
		selectType: number
	}
	/**
	 * @description WinGo游戏投注响应参数
	 * @typeId 类型id
	 * @issuenumber 期号
	 * @amount 投注金额
	 * @betCount 投注数量
	 * @gameType 游戏类型
	 * @selectType <|END_interrupt|>

	/**
	 * @description 长龙助手列表
	 * @issueNumber 期号
	 * @startTime 开始时间
	 * @endTime 结束时间
	 * @type 类型
	 * @lotteryName 彩种名称
	 * @issue 期数
	 * @gameType 游戏类型
	 * @remark 备注
	 * @gameResult 游戏结果
	 * @intervalM 间隔时间
	 * @scope 范围
	 * @bettingGameType 投注游戏类型
	 */
	export interface changLongList {
		issueNumber: string
		startTime: number
		endTime: Date
		type: number
		lotteryName: string
		issue: number
		gameType: number
		remark: string
		gameResult: string
		intervalM: number
		scope: string
		bettingGameType: number
	}

	/**
	 * @description 长龙助手列表响应参数
	 * @list 长龙助手列表
	 * @serviceTime 服务器时间
	 */
	export interface resGetLongDragon {
		list: changLongList[]
		serviceTime: number
	}
	export interface resolvelist {
		type: number
		list: number[]
	}

	export interface reqWinGoGetWinTheLotteryResult {
		issueNumber: string[]
	}
	export interface resGetWinsUserAmount {
		amount: number
		uRate: number
		uGold: number
	}
	export interface resWinGoGetWinTheLotteryResult {
		issueNumber: string
		typeID: number
		typeName: string
		state: number
		premium: string
		number: string
		colour: string
		winAmount: number
	}
	export interface resWinGoGameBetting {
		typeId: number
		issuenumber: string
		amount: number
		betCount: number
		gameType: number
		selectType: number
	}
}
/**
 * K3游戏相关接口
 */
export namespace K3 {
	/**
	 * @K3投注
	 * @typeId 游戏ID
	 * @issuenumber 游戏期号
	 * @amount 投注金额
	 * @betCount 份数
	 * @gameType 1数字 2大小 3奇偶
	 * @selectType 投注内容
	 */
	export interface reqK3GameBetting {
		typeId: number
		issuenumber: string
		amount: number
		betCount: number
		gameType: string
		selectType: string
	}
	/**
	 * @获取K3开奖结果
	 * @issueNumber 期号
	 * @gameType 尾数
	 * @sumCount 总和
	 * @premium 开奖结果
	 * @Premiums 开奖结果列表
	 * @AllEqual
	 */
	export interface GetK3NoaverageEmerdList {
		issueNumber: string
		gameType: number
		sumCount: number
		premium: string
		Premiums?: any
		AllEqual?: any
	}

	/**
	 * @description K3游戏不定位开奖结果响应参数
	 */
	export interface resGetK3NoaverageEmerdList extends MessageData<GetK3NoaverageEmerdList> {
		list: GetK3NoaverageEmerdList[]
	}
	/**
	 * @获取K3赔率列表
	 * @playType 玩法类型
	 * @playBet 下注类型
	 * @playRate 玩法赔率
	 * @playRate_Original 玩法初始赔率
	 */
	export interface resGetK3OddsList {
		playType: number
		playBet: string
		playRate: number
		playRate_Original: number
	}
	/**
	 * @获取K3开奖信息列表
	 * @issueNumber 期号
	 * @gameType 尾数
	 * @sumCount 总和
	 * @premium 开奖结果
	 */
	export interface resGetK3OneEmerd {
		issueNumber: string
		gameType: number
		sumCount: number
		premium: string
	}

	/**
	 * @description K3游戏个人投注记录响应参数
	 * @issueNumber 期号
	 * @amount 投注金额
	 * @gameType 游戏类型
	 * @betCount 投注数量
	 * @realAmount 实际投注金额
	 * @selectType 选择类型
	 * @profitAmount 盈利金额
	 * @premium 开奖结果
	 * @orderNumber 订单号
	 * @fee 手续费
	 * @addTime 添加时间
	 * @state 状态
	 * @oneList 一号位列表
	 * @threeList 三号位列表
	 * @towList 二号位列表
	 */
	export interface resGetMyK3EmerdList {
		issueNumber: string
		amount: number
		gameType: string
		betCount: number
		realAmount: number
		selectType: string
		profitAmount: number
		premium: string
		orderNumber: string
		fee: number
		addTime: Date
		state: number
		oneList?: string[]
		threeList?: string[]
		towList?: any
		towListArr?:any
	}
	/**
	 * @获取K3我的投注结果
	 * @issueNumber 期号
	 * @typeID 游戏id
	 * @typeName 游戏名称
	 * @state 状态
	 * @premium 开奖结果
	 * @winAmount 盈利金额
	 * @bigSmall 大小
	 * @oddEven 单双
	 * @sumCount 下注总数
	 */
	export interface resGetK3TheLotteryResult {
		issueNumber: string
		typeID: number
		typeName: string
		state: number
		premium: string
		winAmount: number
		bigSmall: number
		oddEven: number
		sumCount: number
	}
}

export namespace FD {
	/**
	 * @ 获取5D游戏类型
	 * @typeID 类型id
	 * @typeName 类型名称
	 * @intervalM 开奖周期，单位分钟
	 * @scope 投注金额格式：1000|10000|100000|10000000
	 * @sort 排序规则
	 * @gamePresentation 玩法介绍
	 */
	export type resGet5DtypeList = {
		typeID: number
		typeName: string
		intervalM: number
		scope: string
		sort: number
		gamePresentation: string
	}[]

	/**
	 * @ 获取5D游戏最新一期期号
	 * @issueNumber
	 * @openIssueNumber 类型id
	 * @startTime 开始时间
	 * @serviceTime 服务器时间
	 * @endTime 结束时间
	 * @type
	 * @intervalM 开奖周期，单位分钟
	 */
	export interface resGetGame5DIssue {
		issueNumber: string
		openIssueNumber: null
		startTime: Date
		serviceTime: Date
		endTime: Date
		type: number
		intervalM: number
	}

	/**
	 * @ 获取5D游戏最新的一期已开奖结果
	 * @issueNumber 期号
	 * @sumCount  总数量
	 * @premium  开奖结果
	 */
	export interface resGet5DOneEmerd {
		issueNumber: string
		sumCount: number
		premium: string
	}

	/**
	 * @ 获取5D赔率列表
	 * @playID
	 * @playType
	 * @playBet
	 * @playResult
	 * @playRate
	 * @playRate_Original
	 */
	export interface resGet5DOddsList {
		playID: number
		playType: number
		playBet: string
		playResult: string
		playRate: number
		playRate_Original: number
	}

	// 获取5D开奖结果（带分页）
	export type resGet5DEmerdList = {
		type: number
		typeName: string
		type_Number: number
		number_0: number
		number_1: number
		number_2: number
		number_3: number
		number_4: number
		number_5: number
		number_6: number
		number_7: number
		number_8: number
		number_9: number
	}[]

	/**
	 * @ 我的5D比赛记录（带分页）
	 * @issueNumber 期号
	 * @gameType 彩票投注类型 如：A1 B2 C3 D4 E5 SUM6 7大 8小 9奇数 10偶数 11数字
	 * @orderNumber 投注订单号
	 * @amount 投注金额
	 * @betCount 份数
	 * @number 尾数
	 * @selectType 选择类型
	 * @colour 颜色
	 * @premium 开奖结果
	 * @realAmount 真实下注金额
	 * @serviceCharge 手续费
	 * @figure 数字
	 * @state 状态0未压中 1已压中 2待开奖
	 * @profitAmount 盈利金额
	 * @addTime 下注日期
	 */
	export type resGetMy5DEmerdList = {
		issueNumber: string
		gameType: number
		orderNumber: string
		amount: number
		betCount: number
		number: string
		selectType: string
		colour: string
		premium: string
		realAmount: number
		serviceCharge: number
		figure: number
		state: number
		profitAmount: number
		addTime: string
	}[]
	/**
	 * @ 获取用户投注中奖结果
	 * @issueNumber 期号
	 * @typeID 彩种类型ID
	 * @typeName 彩种名称
	 * @state 状态0未压中 1已压中 2待开奖
	 * @premium 开奖结果
	 * @winAmount 盈利金额
	 * @sumCount 和值
	 */
	export type resGetD5TheLotteryResult = {
		issueNumber: string
		typeID: number
		typeName: string
		state: number
		premium: string
		winAmount: number
		sumCount: number
	}[]
	/**
	 * @5D投注请求参数
	 * @typeId 游戏ID
	 * @issuenumber 游戏期号
	 * @amount 投注金额
	 * @betCount 份数
	 * @gameType 投注类型
	 * @selectType 投注内容
	 */
	export interface reqGame5DBetting {
		typeId: number
		issuenumber: string
		amount: number
		betCount: number
		gameType: number
		selectType: string
	}
	/**
	 * @5D投注列表
	 * @typeId 游戏ID
	 * @issuenumber 游戏期号
	 * @amount 投注金额
	 * @betCount 份数
	 * @gameType 投注类型
	 * @selectType 投注内容
	 */
	export interface resGame5DBetting {
		typeId: number
		issuenumber: string
		amount: number
		betCount: number
		gameType: number
		selectType: string
	}
	/**
	 * @ 获取5D开奖结果参数
	 * @pageSize 页面数
	 * @pageNo 第几页
	 * @typeId 彩票游戏类型
	 */
	export interface reqGetNoaverage5DEmerdList {
		pageSize: number
		pageNo: number
		typeId: number
	}
	/**
	 * @ 获取5D开奖结果结果
	 * @issueNumber 游戏期号
	 * @sumCount 总数
	 * @premium 开奖结果
	 */
	export interface resGetNoaverage5DEmerdList {
		issueNumber: string
		sumCount: number
		premium: string
	}
	/**
	 * @ 获取5D 趋势图参数
	 * @typeId 彩票 游戏类型
	 * @typeNumber 号码位置 1~5
	 */
	export interface reqGet5DEmerdList {
		typeId: number
		typeNumber: number
	}
	/**
	 * @ 获取5D 趋势图列表
	 * @type 彩票 游戏类型
	 * @typeName 彩票游戏名称
	 * @type_Number 类型号码
	 * @number_0 0号
	 * @number_1 1号
	 * @number_2 2号
	 * @number_3 3号
	 * @number_4 4号
	 * @number_5 5号
	 * @number_6 6号
	 * @number_7 7号
	 * @number_8 8号
	 * @number_9 9号
	 */
	export interface resGet5DEmerdList {
		type: number
		typeName: string
		type_Number: number
		number_0: number
		number_1: number
		number_2: number
		number_3: number
		number_4: number
		number_5: number
		number_6: number
		number_7: number
		number_8: number
		number_9: number
	}

	/**
	 * @desc 我的5D比赛记录（带分页）响应参数
	 * @issueNumber 期号
	 * @gameType 彩票投注类型 如：A1 B2 C3 D4 E5 SUM6 7大 8小 9奇数 10偶数 11数字
	 * @orderNumber 投注订单号
	 * @amount 投注金额
	 * @betCount 份数
	 * @number 尾数
	 * @selectType 选择类型
	 * @colour 颜色
	 * @premium 开奖结果
	 * @realAmount 真实下注金额
	 * @serviceCharge 手续费
	 * @figure 数字
	 * @state 状态0未压中 1已压中 2待开奖
	 * @profitAmount 盈利金额
	 * @addTime 下注日期
	 */
	export interface resGetMy5DEmerdList {
		issueNumber: string
		gameType: number
		orderNumber: string
		amount: number
		betCount: number
		number: string
		selectType: string
		colour: string
		premium: string
		realAmount: number
		serviceCharge: number
		figure: number
		state: number
		profitAmount: number
		addTime: Date
	}

	/**
	 * @desc 获取用户投注中奖结果响应参数
	 * @issueNumber 期号
	 * @typeID 彩种类型ID
	 * @typeName 彩种名称
	 * @state 状态0未压中 1已压中 2待开奖
	 * @premium 开奖结果
	 * @winAmount 盈利金额
	 * @sumCount 和值
	 */
	export interface resGetD5TheLotteryResult {
		issueNumber: string
		typeID: number
		typeName: string
		state: number
		premium: string
		winAmount: number
		sumCount: number
	}
}
export namespace XOSO {
	/**
	 * @获取越南游戏类型
	 * @areId 区域编码
	 * @areName 区域名称
	 */
	export interface ResXoxsGetAreList {
		areId: number
		areName: string
	}
	/**
	 * @根据区域获取开奖日期
	 * @areId 区域编码
	 */
	export interface ReqXosoGetDayNoList {
		areId: number
	}
	/**
	 * @根据区域获取开奖日期
	 * @day  日期
	 * @week 星期几
	 * @areIssueNos 期号信息
	 */
	export interface ResXosoGetDayNoList {
		day: string
		week: string
		areIssueNos: areIssueNo[]
	}
	/**
	 * @期号信息
	 * @day  城市编号
	 * @week 城市
	 * @areIssueNos 期号
	 */
	export interface areIssueNo {
		code: string
		city: string
		issueNo: string
	}
	/**
	 *	@获取游戏玩法赔率列表
	 *	@areId 区域id
	 */
	export interface reqGetXosoOdds {
		areId: number
	}
	/**
	 *	@获取游戏玩法赔率列表
	 *	@are  区域id
	 *	@areStr
	 *
	 */
	export interface resGetXosoOdds {
		are: number
		areStr: string
		lotteryType: string
		lotteryTypeStr: string
		bettingAmount: string
		bettingMultiple: string
		oddsAmount: string
		oddsType: number
	}
	/**
	 *	@获取游戏玩法赔率列表
	 *	@are 区域id
	 *	@issueNo 期号
	 *	@xosoBettingData 投注详情
	 */
	export interface resXOXSGameBetting {
		areId: number
		issueNo: string
		xosoBettingData: xosoBettingData[]
	}
	/**
	 *	@投注详情列表
	 *	@bettingType 投注类型
	 *	@bettingFormat 投注形式 单选/复选
	 *	@bettingContent 投注内容
	 *	@totalBetting 总注数
	 *	@initialAmount 初始金额
	 *	@initialAmount 投注倍数
	 */
	export interface xosoBettingData {
		bettingType: number
		bettingFormat: number
		bettingContent: string
		totalBetting: number
		initialAmount: number
		bettingMultiple: number
	}
	/**
	 *	@获取游戏玩法赔率列表
	 *	@are 区域id
	 *	@pageSize  每页数据量的大小
	 *	@pageNo 当期页
	 *	@cityCode 城市编码
	 */
	export interface reqGetXosoResultList {
		areId: number
		pageSize: number
		pageNo: number
		cityCode: string
	}
	/**
	 *	@获取开奖结果
	 *  @areId 		区域id
	 *  @cityCode	城市编码
	 *  @city		城市
	 *  @issueNumber	期号
	 *  @openingTime	开奖时间
	 *  @results		开奖结果
	 */
	export interface resGetXosoResultList {
		areId: number
		cityCode: string
		city: string
		issueNumber: string
		openingTime: string
		results: string
	}
	export interface resGetXosoResultList extends MessageData<GetXosoResultList> {}
	/**
	 * 	@获取会员投注记录
	 *	@areId    区域id
	 *  @pageSize 每页数据量大小
	 * 	@pageNo	 当前页
	 *  @cityCode 城市编码
	 */
	export interface reqGetXosoRecordList {
		areId: number
		pageSize: number
		pageNo: number
		cityCode: string
	}
	/**
	 *		@获取开奖结果
	 *	@orderNo  投注订单号
	 *  @issueNo  期号
	 *  @bettingFormat  投注形式
	 * 	@bettingContent 投注内容
	 *  @totalBetting 总投注数
	 *  @amount 投注金额
	 * 	@serviceCharge 手续费
	 * 	@rebateAmount 返奖金额
	 * 	@winningAmount 中奖金额
	 * 	@initialAmount 初始金额
	 * 	@bettingMultiple 投注倍数
	 * 	@status  状态 1,等待开奖 2，结算中 3，未压中 4，已压中
	 *  @createTime 订单创建时间
	 * 	@cityCode   开奖城市编码
	 *  @city	   开奖城市
	 *  @are		   区域
	 * 	@result	   结果列表
	 */
	export interface GetXosoRecordList {
		orderNo: string
		issueNo: string
		bettingFormat: number
		bettingContent: string
		totalBetting: number
		amount: number
		serviceCharge: number
		rebateAmount: string
		winningAmount: number
		initialAmount: number
		bettingMultiple: number
		status: number
		createTime: string
		cityCode: string
		city: string
		are: number
		results: results[]
	}
	export interface resGetXosoRecordList extends MessageData<GetXosoRecordList> {}
	/**
	 *  @结果列表
	 *	@issueNo    期号
	 *  @resultType 奖励类型
	 * 	@result	   开奖结果
	 **/
	export interface rusults {
		issueNo: string
		resultType: number
		result: string
	}
	/**
	 *  @获取投注中奖信息
	 *	@issueNo    期号
	 **/
	export interface reqXOXOGoGetWinTheLotteryResult {
		issueNo: string
	}
	/**
	 *  @获取投注中奖信息
	 *	@orderNo    订单号
	 *	@city	   开奖城市
	 * 	@cityCode   城市code
	 * 	@bettingMultiple	投注倍数
	 * 	@bettingType 	投注类型
	 * 	@bettingFormat	投注形式
	 * 	@winningAmount	中奖金额
	 * 	@status			状态	1未结算 2已结算	3结算中
	 * 	@result			特等奖号码
	 * 	@winningNum		中奖号码
	 **/
	export interface resWinGoGetWinTheLotteryResult {
		orderNo: string
		city: string
		cityCode: string
		bettingMultiple: string
		bettingType: string
		bettingFormat: number
		winningAmount: string
		status: number
		result: string
		winningNum: number
	}
}
/**
 * @请求投注历史结果参数
 * @type 		类型
 * @gameType	游戏类型
 * @startDate	开始时间
 * @endDate		结束时间
 */
export interface MyEmerdParms {
	type: number
	gameType: string
	startDate: string
	endDate: string
}
/**
 * @返回投注历史结果列表
 * @betID 		投注id
 * @orderNumber	订单号
 * @userID		用户id
 * @issueNumber	期号
 * @typeID		类型id
 * @amount		金额
 * @betCount	投注金额
 * @gameType	游戏类型
 * @selectType	选中类型
 * @realAmount	真实金额
 * @serviceCharge 手续费
 * @figure		 数字
 * @state		 状态
 * @profitAmount 盈利金额
 * @winAmount	 赢取金额
 * @addTime		  下注时间
 * @settlementTime 结算时间
 * @fee			 费率
 * @premium		 开奖结果
 * @number		 开奖号码
 * @colour		 颜色
 */
export interface MyEmerdListData {
	betID: string
	orderNumber: string
	userID: number
	issueNumber: string
	typeID: number
	amount: number
	betCount: number
	gameType: number
	selectType: string
	realAmount: number
	serviceCharge: number
	figure: null
	state: number
	profitAmount: number
	winAmount: number
	addTime: Date
	settlementTime: Date
	fee: number
	premium: string
	number: string
	colour: string
	orderNo: string
	issueNo: string
	bettingType: number
	bettingTypeStr: string
	bettingFormat: number
	bettingFormatStr: string
	bettingContent: string
	totalBetting: number
	amount: number
	serviceCharge: number
	rebateAmount: number
	winningAmount: number
	initialAmount: number
	bettingMultiple: number
	status: number
	createTime: string
	cityCode: string
	city: string
	are: number
	results: recordlist[]
}
export interface recordlist {
	issueNo: string
	resultType: number
	result: string
}
export interface ThirdGame {
	gameID: string
	gameNameEn: string
	img: string
	vendorId: number
	state: number
}

export interface ThirdGameQuery {
	type: number
	gameNameEn: string
}

export interface HomeGameList {
	id: number
	categoryCode: string
	categoryName: string
	state: number
	sort: number
	typeNameCode: string
	categoryImg: string
	isShow: boolean
	title: string
	img: string
	vendorId: string
	gameCode: string
	imgUrl: string
	vendorImg: string
	gameID: number
	key:string
	slotsName:string
	gameNameEn:string
	slotsTypeID:number
	[key:string]:any
}

interface VideoListType {
	sort: number
	vendorCode: string
	childList:HomeGameList[]
}

export interface AllGameList {
	popular: Popular
	sport: Chess[]
	video: Chess[]
	slot: Chess[]
	chess: Chess[]
	fish: Fish[]
	flash: Fish[]
}

export interface Chess {
	slotsTypeID: number
	slotsName: string
	state: number
}

export interface Fish {
	gameID: string
	gameNameEn: string
	img: string
	vendorId: number
}

export interface FeatureGame {
	gameID: string
	gameNameEn: string
	img: string
	imgUrl2: string
	vendorCode: string
	vendorId: number
	customGameType: number
	isGameSaasMaintain: number
	isMaintain: number
	typeId: number
}

export interface Popular {
	platformList: PopularList[]
	clicksTopList: PopularList[]
	featureGame: FeatureGame[]
}

export interface PopularList {
	vendorId: string
	gameCode: string
	imgUrl: string
	winOdds:number
}

// 4D
export namespace D4 {
 /**
  * @description: 游戏配置
  * @betAmount 投注金额
  * @betMultiplier 投注倍数
  * @betType 投注类型 1.大万 2.小万 3.一等奖 4.二等奖 5.三等奖 6.特别奖 7.鼓励奖
  * @gameType 玩法 1.四位直选 2.四位全包 3.位包字 4.四四位来回 5.四位R选
  */
	export interface GameConfigRes {
		betAmount: number[]
		betMultiplier: number[]
		betType: number[]
		gameType:number[]
	}
 /**
  * @description: 游戏期号
  * @issueNumber 期号
  * @sort 排序号
  * @type 类型
  * @typeImg 彩票图标路径
  * @typeName 名称
  */
	export interface GameIssueRes {
		date:string
		week:string
		games:gamesList[]
		
	}[]
	export interface gamesList{
		issueNumber:string
		sort:number
		type:number
		typeImg:string
		typeName:string
		stopTime:string
	}
	
 /**
  * @description: 投注
  * @type 彩种
  * @gameType 玩法
  * @betType 投注类型
  * @betContent 投注内容
  * @betMethod 投注方式
  * @betNumber 购买数量
  * @multiple 倍数
  * @amount 金额
  * @issueNumber 期号
  */
	export interface GameBettingReq{
		type:number[],
		gameType:number,
		betType:number[]
		betContent:string|number[]
		betMethod:number
		betNumber:number
		multiple:number
		amount:number
		issueNumber:string[]
	}
	

}

// 电子游戏厂商及子游戏接口
export interface ElectronWithChildGame {
	vendorCode: string
	childList: ChildList[]
}

export interface ChildList {
	gameID: string
	gameNameEn: string
	img: string
	vendorId: number
}

export interface GetAppDownloadConfigListItem {
	appName: string;
    downAppURL: string;
    imgUrl: string;
}