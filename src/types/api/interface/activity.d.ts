// GetActivityList
/**
 * 活动列表请求类型
 * @pageNo 页码
 * @pageSize 页面大小
 */
export type ReqActivityList = {
	pageNo: number
	pageSize: number
}
/**
 * 活动详情请求参数
 * @actid 活动id
 */
export type ReqActivityDetailList = {
	bannerId: number
}
/**
 * 活动详情
 * @title 标题
 * @coverUrl 封面图片
 * @img 内容标题
 * @jumpType 活动分类
 */
export type ResActivityDetailList = {
	title: string
	coverUrl: string
	img: string
	jumpType: number
}
/**
 * 每日任务列表请求类型
 * @pageSize 页面大小
 * @pageNo 页码
 */
export type ReqDailyTaskList = {
	pageSize: number
	pageNo: number
}

/**
 * 每日签到请求类型
 * @uid 用户id
 * @sign 签名
 */
export type ReqDailySignIn = {
	uid: number
	sign: string
}

/**
 * 连续签到请求类型
 * @uid 用户id
 * @sign 签名
 */
export type ReqContinuousSinIn = {
	uid: number
	sign: string
}

/**
 * 签到列表请求类型
 * @markDayTime 标记日期
 * @amount 数量
 * @orderNumber 订单号
 * @markType 标记类型
 * @list 列表
 * @pageNo 页码
 * @totalPage 总页数
 * @totalCount 总数
 * @pageSize 页面大小
 */
export type ReqCheckInList = {
	markDayTime: string
	amount: number
	orderNumber: string
	markType: number
	list: any
	pageNo: number
	totalPage: number
	totalCount: number
	pageSize: number
	continuousDayContinue: number
}

/**
 * 商品列表请求类型
 * @typeid 类型id
 * @pageNo 页码
 * @pageSize 页面大小
 */
export type ReqProductList = {
	typeid: number
	pageNo: number
	pageSize: number
}
/**
 * 商品列表返回类型
 * @typeid 类型id
 * @pageNo 页码
 * @list 商品列表
 */
export type ProductListData = {
	pageNo: number
	totalPage: number
	totalCount: number
	list: Product
}
/**
 * 轮播图商品信息
 * @bannerList 轮播图商品信息列表
 * @productTypeList 类型列表
 */
export type BannerTypeList = {
	bannerList: BannerListItem
	productTypeList: ProductTypeListItem
}

/**
 * banner类型列表请求类型
 */
export type ReqBannerTypeList = {}

/**
 * 积分日志列表请求类型
 * @pageNo 页码
 * @pageSize 页面大小
 * @type 类型
 * @startDate 开始日期
 * @endDate 结束日期
 */
export type ReqIntegralLogList = {
	// pageNo: number
	// pageSize: number
	type: number
	startDate?: string
	endDate?: string
}

/**
 * 商品订单列表请求类型
 * @uid 用户id
 * @sign 签名
 * @pageno 页码
 * @pagesize 页面大小
 */
export type ReqProductOrderList = {
	uid: number
	sign: string
	pageno: number
	pagesize: number
}

/**
 * 商品订单详情请求类型
 * @uid 用户id
 * @sign 签名
 * @ordernumber 订单号
 */
export type ReqProductOrderDetails = {
	// uid: number
	// sign: string
	orderNumber: string
	orderType:number
	orderId:number
}

/**
 * 请求商品订单类型
 * @uid 用户id
 * @sign 签名
 * @address 地址
 * @phone 电话
 * @counts 数量
 * @productid 商品id
 */
export type ReqProductOrder = {
	address: string
	phone: string
	counts: number
	productid: number
}
/**
 * 积分兑换下单
 * @counts 订单数量
 * @productid 产品ID
 * @address 地址
 * @name 名称
 * @phone 电话
 * @area 区号
 */
export type ReqProductOrder = {
	counts: number
	productid: number
	address: string
	name: string
	phone: number
	area: number
}

/**
 * 活动列表数据类型
 * @activitylist 活动列表
 * @list 活动列表
 * @pageno 页码
 * @totalpage 总页数
 * @totalCount 总数量
 */
export type ActivityListData = {
	list: ActivityList[]
	pageNo: number
	totalPage: number
	totalCount: number
}

/**
 * 每日任务列表数据类型
 * @list 列表
 * @addTime 添加时间
 * @messageId 消息id
 * @messages 消息
 * @state 状态
 * @stateName 状态名称
 * @title 标题
 */
export type DailyTaskListData = {
	list: Array
	addTime: string
	messageId: number
	messages: string
	state: number
	stateName: string
	title: string
}

/**
 * 活动列表类型
 * @ActivityID 活动id
 * @CountUrl 计数url
 * @CoverUrl 封面url
 * @EventAddress 事件地址
 * @bannerID banner id
 * @bannerUrl banner url
 * @bannerTitle banner标题
 */
export type ActivityList = {
	ActivityID: number
	CountUrl: string
	CoverUrl: string
	EventAddress: string
	bannerID: number
	bannerUrl: string
	bannerTitle: string
	jumpType: number
	jumpLinkType?: number
	visibility?: number
	contents?: string
}

/**
 * @orderNUmber 订单号
 * @productName 商品名称
 * @remark 订单备注
 * @state 0 已下单 1配送中 2已完成 3已取消
 * @counts 数量
 * @addTime 时间
 * @productImg 商品图片
 * @integral 兑换积分
 */
export interface ProductRules {
	lotteryAmount: number
	exchange_Rate: number
}

/**
 * @address 地址
 * @name 名称
 * @phone 电话
 * @area 区域
 */
export interface UserAddress {
	address: string // 地址
	name: string // 名称
	phone: string // 电话
	area: string // 区域
	defaultAddress:boolean //默认地址
	addressId:number // 地址id
}

/**
 * 更新用户地址类型
 * @address 地址
 * @area 区域
 * // 积分兑换
 * @phoneNumber 电话号码
 * @userName 用户名
 * 以下积分抽奖使用
 * @phone 电话号码
 * @name 用户名
 */
export interface UpdateUserAddressType {
	address: string
	area: string
	phoneNumber?: string
	userName?: string
	phone?:string
	name?:string
}

/**
 * 积分抽奖列表
 * @status 状态
 */
export interface ReqPointList{
	status: number
	pageNo: number
	pageSize: number
}

export interface PointUsers{
	userName:string
	orderInfoList:{addTime:string,ticketsInfoList:{ticketNumber:string}[]}[]
	tickets:string[]
	addTime:string
	showAll:boolean
	isWin:boolean
}
export interface PointItem {
	details: string
	img_Five: string
	img_Four: string
	img_One:string
	img_Three: string
	img_Two: string
	name: string
	pointsLotteryID: number
	redeemedNumber: number
	status: string
	totalNumber: number
	startTime:string
	unit: number
	winningNumber:string;
	issueNumber:string
	endTime:string
	users:PointUsers[]
}
export interface lotteryOrderInfo{
	orderStatus:number
	pointsLotteryOrdersID:number
	shippingStatus:number
}
export interface MyPointItem {
	userID: number,
	userName: string,
	orderInfo:lotteryOrderInfo
	lotteryInfo: PointItem,
	ticketsInfo: {ticketNumber:string}[]
}

/**
 * 积分抽奖返回类型
 */
export interface PointListData{
	data:{
		pageNo: number
		totalPage: number
		totalCount: number
		list: PointItem[]
	}
}
/**
 * 积分抽奖返回类型
 */
export interface MyPointListData{
	data:{
		pageNo: number
		totalPage: number
		totalCount: number
		list: MyPointItem[]
	}
}
