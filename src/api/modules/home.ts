import { post } from '@/api/axios'
import api from '@/api/url'
import type {
	ReqAllMessageStates,
	GameListProps,
	ReqOnlineGameList,
	ReqMessageList,
	ReqMessageState,
	ResMessageList,
	ResBannerList,
	ResDailyProfitRank,
	ResSlotGamesList,
	ResGetSafeLogData,
	ReqGetSafeLogData,
	ReqSetSafeInOut,
	ResGetWealthState,
	ThirdGame,
	MessageDataList,
	HomeGameList,
	AllGameList, getThirdAwardsRecord,
	GetAppDownloadConfigListItem
} from '@/types/api'

/**
 * @description: 获取首页数据
 * @param {object} params
 * @return {*}
 */
// export const getHomeData = (params: Home.ReqGetHomeDate): Promise<Home.ResHomeData> => {
// 	return post(api.GetHomeWebSite, params).then((res) => res.data)
// }
export const getHomeData = (): Promise<any> => {
	return post(api.GetHomeWebSite)
}

/**
 * @description: 获取隐私安装列表
*/
export const GetAppDownloadConfigList = (): Promise<CommonObjRes<GetAppDownloadConfigListItem[]>> => {
	return post(api.GetAppDownloadConfigList)
}

/**
 * @description: 获取轮播图列表
 * @param {object} params
 * @return {*}
 */
export const getBannerList = (params = {}): Promise<CommonObjRes<ResBannerList>> => {
	return post(api.GetBannerList, params, { cache: true })
}

/**
 * @description: 获取热门游戏列表
 * @param {*}
 * @return {*}
 */
export const getHotGameList = (): Promise<CommonObjRes<GameListProps>> => {
	return post(api.GetHotGameList, {}, { cache: true })
}

/**
 * @description: 获取点击量排行榜游戏列表
 * @param {object} params
 * @return {*}
 */
export const getClicksTopGameList = () => {
	return post(api.GetClicksTopGameList, {}, { cache: true })
}

/**
 * @description: 获取游戏链接
 * @param {object} params
 * @return {*}
 */
export const getGameUrl = (params: any) => {
	return post(api.GetGameUrl, params)
	// return post(api.GetGameUrl, params, { cache: true }).then((res) => res.data)
}

/**
 * @description: 获取第三方游戏列表
 * @param {object} params
 * @return {*}
 */
export const getThirdGameList = (params: any): Promise<any> => {
	return post(api.GetThirdGameList, Object.assign({isMiniGame:true},params||{}), { cache: true })
}

export const getThirdGameListC = (params: any): Promise<any> => {
	return post(api.GetThirdGameList, Object.assign({isMiniGame:true},params||{}))
}

/**
 * @description: 获取第三方游戏分类
 * @param {object} params
 * @return {*}
 */
export const getThirdGameCategory = (params: ReqOnlineGameList): Promise<CommonObjRes<GameListProps>> => {
	return post(api.GetThirdGameCategory, params, { cache: true })
}

/**
 * @description: 获取站内信列表
 * @param {object} params
 * @return {*}
 */
export const getMessages = (params: ReqMessageList) => {
	return post(api.GetMessageList, params)
}

/**
 * @description: 设置站内信状态
 * @param {ReqMessageState} params
 * @return {*}
 */
export const setMessageState = (params: ReqMessageState): Promise<CommonRes<ResMessageList>> => {
	return post(api.SetOneMessageState, params)
}
/**
 * @description: 设置全部已读
 * @param {ReqAllMessageStates} params
 * @return {*}
 */
export const setAllMessageState = (params: ReqAllMessageStates) => {
	return post(api.SetAllMessageState, params).then((res) => res.data)
}

/**
 * @description: 获取每日盈利排行榜
 * @param {object} params
 * @return {*}
 */
export const getDailyProfitRank = (params = {}): Promise<any> => {
	return post(api.GetDailyProfitRank, params).then((res) => res.data)
}

/**
 * @description: 获取游戏列表
 * @param {object} params
 * @return {*}
 */
export const getSlotGamesList = (params = {}): Promise<CommonRes<ResSlotGamesList>> => {
	return post(api.GetSlotGamesList, params, { cache: true })
}

/**
 * @description: 公告列表
 * @param {ReqMessageList} params
 * @return {*}
 */
export const getSiteMessageList = (params: ReqMessageList): Promise<CommonRes<MessageDataList>> => {
	return post(api.GetSiteMessageList, params)
}

/**
 * @description: 获取站内信列表
 * @param { } params
 * @return {*}
 */
// 首页公告
export const getSiteMessage = (): Promise<any> => {
	return post(api.GetSiteMessage) // 发送post请求，获取站内信列表
}

/**
 * @description: 获取保险箱信息
 * @param {*}
 * @return {*}
 */
export const getSafeInfo = (): Promise<any> => {
	return post(api.GetSafeInfo) // 发送post请求，获取保险箱信息
}

/**
 * @description: 获取财富状态
 * @param {}
 * @return {*}
 */
export const getWealthState = (): Promise<ResGetWealthState> => {
	return post(api.GetWealthState).then((res) => res.data) // 发送post请求，获取财富状态
}

/**
 * @description: 获取保险箱余额
 * @param {*}
 * @return {*}
 */
export const getSafeAmount = (): Promise<any> => {
	return post(api.GetSafeAmount) // 发送post请求，获取保险箱余额
}

/**
 * @description: 保险箱转入
 * @param {object} params
 * @return {*}
 */
export const setSafeBack = (params: ReqSetSafeInOut): Promise<any> => {
	return post(api.SetSafeBack, params) // 发送post请求，保险箱转入
}

/**
 * @description: 获取用户保险箱余额
 * @param {*}
 * @return {*}
 */
export const getSafeUserAmount = (): Promise<any> => {
	return post(api.GetSafeUserAmount) // 发送post请求，获取用户保险箱余额
}

/**
 * @description: 保险箱转出
 * @param {object} params
 * @return {*}
 */
export const setSafeInto = (params: ReqSetSafeInOut): Promise<any> => {
	return post(api.SetSafeInto, params) // 发送post请求，保险箱转出
}

/**
 * @description: 获取保险箱记录
 * @param {object} params
 * @return {*}
 */
export const getSafeList = (params: ReqGetSafeLogData): Promise<any> => {
	return post(api.GetSafeList, params) // 发送post请求，获取保险箱记录
}

/**
 * @description: 获取保险箱日志
 * @param {object} params
 * @return {*}
 */
export const getSafeLogList = (params: ReqGetSafeLogData): Promise<ResGetSafeLogData> => {
	return post(api.GetSafeLogList, params).then((res) => res.data) // 发送post请求，获取保险箱日志
}

/**
 * @description: 全部游戏列表
 * @param {object} params
 * @return {*}
 */
export const getThirdGameLists = async (params: { type: number }): Promise<CommonObjRes<ThirdGame[] | GameListProps>> => {
	if (Number(params.type) === 20 || Number(params.type) === 11) {
		return post(api.GetThirdGameList, params, { cache: true })
	}
	if (Number(params.type) === 22) {
		return post(api.GetClicksTopGameList, {}, { cache: true })
	}
	return post(api.GetThirdGameCategory, { categoryType: params.type }, { cache: true })
}

/**
 * @description: 获取游戏大类列表和是否显示
 * @param {object} params
 * @return {*}
 */
export const GetGameCategoryList = async (): Promise<CommonObjRes<HomeGameList>> => {
	return post(api.GetGameCategoryList, {}, { cache: true })
}

/**
 * @description: 获取彩票大类列表和是否显示
 * @param {object} params
 * @return {*}
 */
export const GetLotteryCategoryList = async (): Promise<CommonObjRes<HomeGameList[]>> => {
	return post(api.GetLotteryCategoryList, {}, { cache: true })
}

/**
 * @description: 获取所有游戏列表
 * @param {object} params
 * @return {*}
 */
export const getAllGameList = async (): Promise<CommonObjRes<AllGameList>> => {
	return post(api.GetAllGameList, {}, { cache: true })
}

/**
 * @description: 获取app下载开关
 * @param {object} params
 * @return {*}
 */
export const IsCanAppDownload = async (): Promise<CommonObjRes<boolean>> => {
	return post(api.IsCanAppDownload)
}

/**
 * @description: 获取首页显示设置
 * @param {object} params
 * @return {*}
 */
export const GetHomeSettings = async (): Promise<CommonObjRes<any>> => {
	return post(api.GetHomeSettings)
}


//获取电子奖励配置
export const GetReWordConfigList = (): Promise<any> => {
	return post(api.GetReWordConfigList)
}
//获取电子大奖奖励记录列表
export const GetThirdGameAwardRecordPageList = (params: getThirdAwardsRecord): Promise<any> => {
	return post(api.GetThirdGameAwardRecordPageList, params)
}

/**
 * @description: 获取电子分类列表
 * @return {*}
 */
export const GetElectronWithChildGame = async (): Promise<any> => {
	return post(api.GetElectronWithChildGame,{}, { cache: true })
}

/**
 * @description: 获取视讯列表含子游戏
 * @param {object} params
 * @return {*}
 */
export const getVideWithChildGame = (): Promise<CommonObjRes<any[]>> => {
	return post(api.GetVideWithChildGame)
}
/**
 * @description: 获取热门彩票
 * @param {object} params
 * @return {*}
 */
export const GetHotLotteryList = (): Promise<CommonObjRes<any[]>> => {
	return post(api.GetHotLotteryList)
}

/**
 * @description: 获取彩票类型
 * @param {object} params
 * @return {*}
 */
export const getLotteryGameTypeList = (): Promise<CommonObjRes<any[]>> => {
	return post(api.GetLotteryGameTypeList)
}
/**
 * @description: 客服中心链接
 * @param {object} params
 * @return {*}
 */
export const GetSelfCustomerServiceLink = async (webSite:string): Promise<CommonObjRes<any>> => {
	return post(api.GetSelfCustomerServiceLink, {webSite})
}

/**
 * @description: 允许未充值用户进行游戏
 * @param {object} params
 * @return {*}
 */
export const GetAllowBetSetting = async (): Promise<CommonObjRes<any>> => {
	return post(api.GetAllowBetSetting)
}

/**
 * @description: 三方sass 余额触发回收
 * @param {object} params
 * @return {*}
 */
export const hotifyARGameRecover = async (): Promise<CommonObjRes<any>> => {
	return post(api.NotifyARGameRecover)
}

/**
 * @description: 内嵌余额获取
 * @param {object} params
 * @return {*}
 */
export const getBalanceByARGame = async (): Promise<CommonObjRes<any>> => {
	return post(api.GetBalanceByARGame)
}


/**
 * @description: 转账信息
 * @param {object} params
 * @return {*}
 */
export const getTransfer = async (): Promise<CommonObjRes<any>> => {
	return post(api.Transfer)
}

/**
 * @description: FCM订阅消息
 * @param {object} params
 * @return {*}
 */
export const getFBMsgSubscribe = async (params:{fireBaseToken: string;isSubscribe: boolean }): Promise<CommonObjRes<any>> => {
	return post(api.FBMsgSubscribe, params)
}


/**
 * @description: 更新在线状态
 * @param {object} params
 * @return {*}
 */
export const updateOnlineStatus = async (): Promise<CommonObjRes<any>> => {
	return post(api.UpdateOnlineStatus)
}

// /webapi/GetPwaDomainList
export const GetPwaDomainList = async (): Promise<CommonObjRes<any>> => {
	return post(api.GetPwaDomainList)
}
export const getHomePwaSettingPageInfo= async (params:any): Promise<CommonObjRes<any>> => {
	return post(api.HomePwaSettingPageInfo,params)
}