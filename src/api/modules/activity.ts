import { post } from '@/api/axios'
import api from '@/api/url'
import type {
	ReqActivityList,
	UpdateUserAddressType,
	ReqDailySignIn,
	ReqProductList,
	ReqBannerTypeList,
	ReqIntegralLogList,
	ReqProductOrderList,
	ReqProductOrderDetails,
	ReqProductOrder,
	ActivityList,
	TaskList,
	DailySignInData,
	ProductListData,
	BannerTypeList,
	ReqCheckInList,
	UserAddress,
	ProductRules,
	ReqActivityDetailList,
	ResActivityDetailList,
	GetChampionTaskList
} from '@/types/api'
import {PointListData, ReqPointList} from "@/types/api";

/**
 * @description: 获取活动列表
 */
export const GetActivityList = (params: ReqActivityList): Promise<CommonObjRes<ActivityList>> => {
	return post(api.GetActivityList, params, {cache: true})
}
/**
 * @description：获取活动详情
 */
export const GetActivityDetail = (params: ReqActivityDetailList): Promise<CommonObjRes<ResActivityDetailList>> => {
	return post(api.GetActivityDetails, params)
}
/**
 * @description: 获取邀请人任务
 */
export const GetDailyTaskList = (params: any): Promise<CommonObjRes<TaskList>> => {
	return post(api.GetDailyTaskList, params).then((res) => res.data)
}
/**
 * @description: 获取签到内容金额
 */
export const GetDailySignIn = (params: ReqDailySignIn): Promise<CommonObjRes<DailySignInData>> => {
	return post(api.GetContinuousSignInRecharges)
}
export const GetUrlAddress = () => {
	return post(api.GetUrlAddress)
}
/**
 * @description: 连续在线签到
 * {"data":null,"code":0,"msg":"success","msgCode":0}
 */
export const SetContinuousSinIn = (params: any): Promise<any> => {
	return post(api.SetContinuousSinIn, params)
}
/**
 * @description: 获取签到记录
 */
export const getCheckInList = (params: any): Promise<CommonObjRes<ReqCheckInList>> => {
	return post(api.GetContinuousSinInList, params, {
		noLoading: true
	})
}
/**
 * @description: 获取查询页商品集合（带分页）
 */
export const GetProductList = (params: ReqProductList): Promise<CommonObjRes<ProductListData>> => {
	return post(api.GetProductList, params, { noLoading: true })
}

export const GetBannerTypeList = (params: ReqBannerTypeList = {}): Promise<CommonObjRes<BannerTypeList>> => {
	return post(api.GetBannerTypeList, params)
}

export const GetIntegralLogList = (params: ReqIntegralLogList) => {
	return post(api.GetIntegralLogList, params)
}

export const GetProductOrderList = (params: ReqProductOrderList) => {
	return post(api.GetProductOrderList, params)
}

export const GetProductOrderDetails = (params: ReqProductOrderDetails) => {
	return post(api.GetProductOrderDetails, params)
}

export const SetProductOrder = (params: ReqProductOrder) => {
	return post(api.SetProductOrder, params)
}

export const CancelOrderData = (params: any) => {
	return post(api.CancelOrderData, params)
}

/**
 * @description: 获取用户地址
 */
export const GetUserAddress = async (params:any): Promise<CommonObjRes<UserAddress>> => {
	return post(api.GetUserAddress,params)
}

/**
 * @description: 更新用户地址
 */
export const UpdateUserAddress = async (params: UpdateUserAddressType) => {
	return post(api.UpdateUserAddress, params)
}

/**
 * @description: 获取积分规则
 */
export const GetProductRules = async (): Promise<CommonObjRes<ProductRules[]>> => {
	return post(api.GetProductRules)
}


/**
 * @description: 获取积分抽奖（带分页）
 */
export const GetPointsLotteryList = (params: ReqPointList): Promise<CommonObjRes<PointListData>> => {
	return post(api.GetPointsLotteryList, params, { noLoading: true })
}

/**
 * @description: 获取积分抽奖详情
 */
export const GetPointsLotteryDetails = (params: {pointLotteryID:number}): Promise<CommonObjRes<PointListData>> => {
	return post(api.GetPointsLotteryDetails, params, { noLoading: true })
}
/**
 * @description: 获取我参与的积分抽奖 （带分页）
 */
export const GetPointsLotteryOrderList = (params: ReqPointList): Promise<CommonObjRes<PointListData>> => {
	return post(api.GetPointsLotteryOrderList, params, { noLoading: true })
}
/**
 * @description: 参与积分抽奖
 * @pointsLotteryID 抽奖ID
 * @count 数量
 */
export const JoinPointsLottery = (params: {pointsLotteryID:number,counts:number}): Promise<CommonObjRes<PointListData>> => {
	return post(api.JoinPointsLottery, params, { noLoading: true })
}

/**
 * @description: 领取积分抽奖
 * @pointsLotteryID 抽奖ID
 * @extends UserAddress
 */
export const GetPrize = (params: {orderId:number,userAddressId:number}): Promise<CommonObjRes<PointListData>> => {
	return post(api.GetPrize, params)
}


/**
 * @description: 更新积分抽奖用户地址
 */
export const UpdatePointLotteryUserAddress = (params: UpdateUserAddressType): Promise<CommonObjRes<PointListData>> => {
	return post(api.UpdatePointLotteryUserAddress, params)
}

/**
 * @description: 添加积分抽奖用户地址
 */
export const AddPointsLotteryUserAddress = (params: UpdateUserAddressType): Promise<CommonObjRes<PointListData>> => {
	return post(api.AddPointsLotteryUserAddress, params)
}

/**
 * @description: 删除积分抽奖用户地址
 */
export const DeletePointsLotteryUserAddress = (params: {addressId:number}): Promise<CommonObjRes<PointListData>> => {
	return post(api.DeletePointsLotteryUserAddress, params)
}

/**
 * @description: 设置默认地址
 */
export const SetDefaultPointsLotteryUserAddress = (params: {addressId:number}) => {
	return post(api.SetDefaultPointsLotteryUserAddress, params)
}


/**
 * @description:  获取用户抽奖地址
 */
export const GetPointLotteryUserAddress = (): Promise<CommonObjRes<UserAddress>> => {
	return post(api.GetPointLotteryUserAddress)
}
/**
 * @description:  一键领取超级大奖
 */
export const ReceiveAllGrandAward = ()=>{
	return post(api.ReceiveAllGrandAward)
}

/**
 * @description: 获取首充奖励
 */
export const ReceiveFirstRechargeReward = async (params: any): Promise<CommonObjRes<ProductRules[]>> => {
	return post(api.ReceiveFirstRechargeReward, params)
}

/**
 * @description: 是否展示首充弹窗
 */
export const GetFirstRechargeList = async (params: any): Promise<CommonObjRes<ProductRules[]>> => {
	return post(api.GetFirstRechargeList, params)
}

/**
 * @description: 获取活动开关配置信息
 */
export const GetActiveSetting = async () => {
	return post(api.GetActiveSetting)
}

/**
 * @description: 获取每周奖励列表
 */
export const GetWeeklyAwardList = async () => {
	return post(api.GetWeeklyAwardList)
}

/**
 * @description: 领取符合条件的每周奖励任务
 */
export const ReceiveWeeklyAward = async (params: any) => {
	return post(api.ReceiveWeeklyAward, params)
}

/**
 * @description: 每周奖励任务领取记录
 */
export const GetWeeklyAwardRecordList = async(params: any)=> {
	return post(api.GetWeeklyAwardRecordList, params)
}
/**
 * @description: 完成任务获取宝箱奖励
 */
export const GetTreasureChestPopupItems = async()=> {
	return post(api.GetTreasureChestPopupItems)
}
/**
 * @description: 点击领取宝箱奖励
 */
export const OpenTreasureChest = async(params: any)=> {
	return post(api.OpenTreasureChest, params)
}

/**
 * @description: 保存每周活动奖励每日访问弹窗。
 */

export const SaveUserDayRequest = async() => {
	return post(api.SaveUserDayRequest)
}

/**
 * @description: 保存新手活动任务新手指引完成情况。
 */

export const SaveUserGuidelines = async() => {
	return post(api.SaveUserGuidelines)
}

/**
 * @description: 获取当前活动任务详情
 */

export const GetCurrentActivityTasks = async() => {
	return post(api.GetCurrentActivityTasks)
}

/**
 * @description: 邀请记录
 */

export const GetCurrentActivityLevel1People = async(params: any) => {
	return post(api.GetCurrentActivityLevel1People, params)
}

 // 获取新手礼包
export const getNewbieGiftPackage = async() => {
	return post(api.GetNewbieGiftPackage)
}

 // 领取新手礼包
 export const receiveAward = async(params: any) : Promise<any> => {
	return post(api.ReceiveAward,params).then((res) => res)
}

//每日奖励未领取数量
export const GetDailyAwardCount = async() => {
	return post(api.GetDailyAwardCount)
}

//周卡月卡活动信息:一次返回周卡与月卡两个活动的配置、档位与我的持卡
export const GetPeriodCardInfo = async() => {
	return post(api.GetPeriodCardInfo)
}

//购买周卡月卡;失败分支由 msgCode 区分(1031 充值门槛 / 1032 今日售罄 / 142 余额不足)
export const BuyPeriodCard = async(params: { TierId: number }) => {
	return post(api.BuyPeriodCard, params)
}

//领取周卡月卡的每日奖励,OrderNo 取自 HoldingOrders[].OrderNo
export const TakeDailyReward = async(params: { OrderNo: string }) => {
	return post(api.TakeDailyReward, params)
}

//我的周卡月卡购买记录,最近 100 单,BuyTime 倒序
export const GetMyPeriodCardRecords = async() => {
	return post(api.GetMyPeriodCardRecords)
}

//活动中心 Tab 排序:固定 5 个元素,TabSort 越大越靠前
export const GetActivityCenterTabSort = async() => {
	return post(api.GetActivityCenterTabSort)
}

//每日任务列表
export const GetDailyAwardList = async() => {
	return post(api.GetDailyAwardList)
}

//领取每日任务
export const ReceiveDailyAward = async(params: any)=> {
	return post(api.ReceiveDailyAward,params)
}

//每日任务领取记录
export const GetDailyAwardRecordList = async(params: any) => {
	return post(api.GetDailyAwardRecordList,params)
}
//赛事列表
export const getChampionTaskList = async (params:any) => {
	return post(api.GetChampionTaskList,params)
}

//竞标赛入口
export const championEntrance = async () => {
	return post(api.ChampionEntrance)
}

//参加锦标赛
export const joinChampionTask = async (params:any) => {
	return post(api.JoinChampionTask,params)
}

//获取赛事详细信
export const getChampionTaskDetail = async (params:any) => {
	return post(api.GetChampionTaskDetail,params)
}

//赛事前10名会员
export const getTop10ChampionTaskDataUserList = async (params:any) => {
	return post(api.GetTop10ChampionTaskDataUserList,params)
}

//我的锦标赛列表
export const getMyChampionTaskList = async (params:any) => {
	return post(api.GetMyChampionTaskList,params)
}
export const getNowdayRechargeAmount=async ()=>{
	return post(api.GetNowdayRechargeAmount)
}
// 大转盘
export const getTurnTableUserRotateNum=async ()=>{
	return post(api.GetTurnTableUserRotateNum)
}
export const getTurnTableInfo=async ()=>{
	return post(api.GetTurnTableInfo)
}
export const getTurnTableRecord=async (params:any)=>{
	return post(api.GetTurnTableRecord,params)
}
export const getTurnTableDraw=async ()=>{
	return post(api.GetTurnTableDraw)
}
export const getGiftPackUserRewardRecord=async ()=>{

	return post(api.GetGiftPackUserRewardRecord)
}
export const getReceiveGiftPackUserReward=async (params:any)=>{
	return post(api.ApplyReceiveGiftPackUserReward,params)
}
export const applyFirstCharge=async (params:any)=>{
	return post(api.ApplyFirstCharge,params)
}
export const getRewardCenterList = (params: any): Promise<any> => {
	return post(api.GetRewardCenterList, params )
}
