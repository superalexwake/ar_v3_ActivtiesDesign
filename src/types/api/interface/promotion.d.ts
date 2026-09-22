//getPromotionData
export type ReqPromotionData = {}

/**
 * @description: 推广教程数据
 * @promotionlist 推广列表
 * @rebateratelist 返利等级列表
 * @dianzilist 电子游戏列表
 * @shixunlist 实训列表
 * @tiyulist 体育列表
 * @xiaoyouxilist 小游戏列表
 */
export interface PromotionTutorialData {
	chesslist: RuleList[]
	rebateratelist: RuleList[]
	dianzilist: RuleList[]
	shixunlist: RuleList[]
	tiyulist: RuleList[]
	xiaoyouxilist: RuleList[]
	chesslist: RuleList[]
}
export interface PromotionRebateData {
	lv: number
	lvCount: number
	rechargeAmount: number
	lotteryAmount: number
	remark: string
}
/**
 * @description: 规则列表
 * @rebate_Lv 返利等级
 * @type 类型
 */
export interface RuleList {
	rebate_Lv: number
	type: number
	rebateLevels:rebateLevels[]
}
/**
 * @description: 返佣比例
 * @amount 等级返佣比例
 * @levelId 等级
 */
export interface rebateLevels{
	amount:number
	levelId:number
}

/**
 * @description: 推广列表
 * @lv 等级
 * @lvCount 等级数量
 * @rechargeAmount 充值总额
 * @lotteryAmount 彩票总额
 * @remark 备注
 */
export interface Promotionlist {
	lv: number
	lvCount: number
	rechargeAmount: number
	lotteryAmount: number
	remark: string
}

/**
 * @description: 推广数据
 * @mylink 我的链接
 * @aglink ag链接
 * @mycode 我的代码
 * @children_Lv_1_Count 直属下级数量
 * @children_Lv_Count_X 下X级数量
 * @children_Lv_1_Count_Add 直属下级新增数量
 * @children_Lv_Count_X_Add 下X级新增数量
 * @children_Lv_RebateAmount_Yesterday 昨日返利金额
 * @children_Lv_1_RebateAmount_Yesterday 直属下级昨日返利金额
 * @children_Lv_RebateAmount_Week 本周返利金额
 * @children_Lv_1_RebateAmount_X_Yesterday 下X级昨日返利金额
 * @children_Lv_RebateAmount 返利总金额
 * @children_Lv_1_Count_Add_Yesterday 直属下级昨日新增数量
 * @children_Lv_Count_X_Add_Yesterday 下X级昨日新增数量
 */
export interface PromotionData {
	mylink: string
	aglink: string
	mycode: string
	children_Lv_1_Count: number
	children_Lv_Count_X: number
	children_Lv_1_Count_Add: number
	children_Lv_Count_X_Add: number
	children_Lv_RebateAmount_Yesterday: number
	children_Lv_1_RebateAmount_Yesterday: number
	children_Lv_RebateAmount_Week: number
	children_Lv_1_RebateAmount_X_Yesterday: number
	children_Lv_RebateAmount: number
	children_Lv_1_Count_Add_Yesterday: number
	children_Lv_Count_X_Add_Yesterday: number
}

export interface PromotionMytemData extends MessageData<PromotionMytemList> {
	data: PromotionMytemObj
}
/**
 * @description: 我的团队数据列表
 * @row 行数
 * @userID 用户id
 * @createTime 创建时间
 * @children_1_Total 直属下级数量
 * @lotteryAmount 彩票总额
 * @rebateAmount 返利总额
 * @rechargeAmount 充值总额
 * @nickName 用户昵称
 * @userState 用户状态
 * @lv 代理等级
 */
export interface PromotionMytemList {
	row: number
	userID: number
	createTime: Date
	children_1_Total: number
	lotteryAmount: number
	rebateAmount: number
	rechargeAmount: number
	nickName: string
	userState: number
	lv: number
}

/**
 * @description: 我的团队数据
 * @lotteryAmountSum 彩票总额
 * @rebateAmountSum 返利总额
 * @rechargeAmountSum 充值总额
 */
export interface PromotionMytemObj {
	lotteryAmountSum: number
	rebateAmountSum: number
	rechargeAmountSum: number
}

/**
 * @description: 请求我的团队数据参数
 * @startDate 开始时间
 * @endDate 结束时间
 * @lv 代理等级
 * @myTemId 我的团队id
 */
export interface ReqPromotionMytem {
	startDate: string
	endDate: string
	lv: number
	myTemId: number
}

/**
 * @description: 请求团队日报参数
 * @pageSize 每页条数
 * @pageNo 页码
 * @day 日期
 * @lv 代理等级
 * @userId 用户id
 */
export interface ReqTeamDayReport {
	pageSize: number
	pageNo: number
	day: string
	lv: number
	userId: number
}

/**
 * @description: 团队日报列表数据
 * @userID 用户id
 * @lv 代理等级
 * @rebateAmount 返利金额
 * @nickName 用户昵称
 * @userState 用户状态
 * @searchTime 查询时间
 */
export interface ReqTeamDayReportList {
	userID: number
	lv: number
	rebateAmount: number
	rechargeAmount: number
	lotteryAmount: number
	nickName: string
	userState: number
	searchTime: string
}

export interface ResTeamDayReport extends MessageData<ReqTeamDayReportList> {}

/**
 * @description: 查询佣金明细参数
 * @pageSize 每页条数
 * @pageNo 页码
 * @date 日期
 * @type 游戏类型
 */
export type ReqPromotionReceiveList = {
	date: string
}

/**
 * userID:用户id
 * time:时间
 * type:游戏分类
 * lotteryAmount：投注金额
 * betCount：投注人数
 * rebateAmount:佣金金额
 * lotteryAmount_Lv: 代理等级
 */
interface promotionReceiveList {
	userID: number
	time: string
	type: number
	lotteryAmount: number
	betCount: number
	rebateAmount: number
	lotteryAmount_Lv: number
}

/**
 * @description: 佣金明细
 * @settlementTime 结算时间
 * @children_LotteryAmount_Users 投注人数
 * @children_LotteryAmount 投注金额
 * @children_LotteryAmount 佣金计算
 * @time 日期
 */
export interface ResPromotionReceiveList {
	settlementTime: number
	children_LotteryAmount_Users: number
	children_LotteryAmount: number
	rebateAmount_Last: number
	time:string
	rebateWhereItems:rebateWhereList[]
}
/**
 * @description: 佣金明细
 * @type 1 彩票 2 电子 3 视讯 4 体育 5 小游戏 6 棋牌
 * @children_LotteryAmount_Users 投注人数
 * @children_LotteryAmount 投注金额
 * @rebateAmount 佣金结算
 * @rebateWhereItemDetails 
 */
export interface rebateWhereList {
	type:number,
	children_LotteryAmount_Users:number,
	children_LotteryAmount:number,
	rebateAmount:number,
	rebateWhereItemDetails:rebateWhereDetails[]
	rebateLevel:number
}
/**
 * @description: 佣金明细
 * @levelId  等级
 * @children_LotteryAmount 投注金额
 * @rebateRate 返佣比例
 * @rebateAmount 返佣金额
 */
export interface  rebateWhereDetails{
	levelId:number
	children_LotteryAmount:number,
	rebateRate:number,
	rebateAmount:number,
}

/**
 * @description: 查询我的邀请人(下级)记录参数
 * @level 代理等级
 * @startDate 开始时间
 * @endDate 结束时间
 */
export interface ReqpromotionRecord {
	level: number
	startDate: string
	endDate: string
}

/**
 * @description: 查询我的邀请人(下级)记录返回列表
 * @bindUserID 绑定用户ID
 * @bindUserName 绑定用户名
 * @bindTime 绑定时间
 * @bindInviteCode 绑定邀请码
 */
export interface RespromotionRecord {
	bindUserID: number
	bindUserName: string
	bindTime: string
	bindInviteCode: string
}
