import {request,jsonRequest} from '../request';
import {GetGameInfoRspApiResponse,GetGameListRsp, GetBetLimitRsp,GetWinLossResultRsp,GetRecordPageRspListPageBaseResponse,GetTrendStatisticsRsp, GetGameIntroduceRsp,GetHistoryIssuePageRspListPageBaseResponse} from "@/saasLottery/api";

/*
 * 获取游戏详情 赔率快捷投注
 */
export  function getLotteryGameInfo(data:Record<string, any>){
    return request.get<GetGameInfoRspApiResponse>('/Lottery/GetGameInfo',data)
}

/*
 * 获取游戏当前期号 oss存储
 */
export  function getLotteryIssue({lotteryCode,gameCode}:Record<string, any>){
    return jsonRequest.get(`/${lotteryCode}/${gameCode}.json`)
}

/*
 * 获取游戏当前限红
 */
export function getLotteryBetLimit(gameCode:string){
    return request.get<GetBetLimitRsp[]>('/Lottery/GetBetLimit',{gameCode})
}

/*
 * 获取游戏说明
 */
export function getGameIntroduce(gameCode:string){
    return request.get<GetGameIntroduceRsp>('/Lottery/GetGameIntroduce',{gameCode})
}

/*
 * 获取游戏投注记录
 */
export function getLotteryRecord(data:Record<string, any>){
    return request.get<GetRecordPageRspListPageBaseResponse>('/Lottery/GetRecordPage',data)
}

/*
 * 获取游戏开奖历史
 */
export function getLotteryHistoryIssue(data:Record<string, any>){
    return request.get<GetHistoryIssuePageRspListPageBaseResponse>('/Lottery/GetHistoryIssuePage',data)
}

/*
 * 获取游戏开奖历史 oss 方式
 */
export function getLotteryOssHistoryIssue({lotteryCode,gameCode}:Record<string, any>){
    return  jsonRequest.get<GetHistoryIssuePageRspListPageBaseResponse>(`/${lotteryCode}/${gameCode}/GetHistoryIssuePage.json`)
}

/*
 * 获取游戏数据分析
 */
export function getLotteryTrendStatistics(data:Record<string, any>){
    return request.get<GetTrendStatisticsRsp[]>('/Lottery/GetTrendStatistics',data)
}


/*
 * 获取游戏数据分析
 */
export function getLotteryWinLossResult(data:Record<string, any>){
    return request.get<GetWinLossResultRsp>('/Lottery/GetWinLossResult',data)
}
/*
 * 获取游戏列表
 */
export function getLotteryGameList(){
    return request.get<GetGameListRsp[]>('/Lottery/GetGameList')
}


/*跟投策略列表*/
export function getFollowBetList(data:Record<string, any>){
	return request.get('/Lottery/GetFollowPlanList',data)
}

/*新增跟投策略*/
export function addFollowBet(data:Record<string, any>){
	return request.post('/Lottery/AddFollowRecord',data)
}

/*停止跟投策略*/
export function stopFollowBet(data:Record<string, any>){
	return request.post('/Lottery/StopFollowRecord',data)
}

/*获取跟投历史策略记录*/
export function getFollowHistory(data:Record<string, any>){
	return request.get('/Lottery/GetHistoryFollowRecordPageList',data)
}

/*游戏规则接口*/
export function getFollowGameRule(data:Record<string, any>){
	return request.get('/Lottery/GetFollowRule',data)
}

/*获取当前跟投策略数据*/
export function getBetStrategy(data:Record<string, any>){
	return request.get('/Lottery/GetFollowRecord',data)
}

/*获取当前跟投策略数据*/
export function getWingoLiveUrl(data:Record<string, any>){
	return request.get('/Lottery/GetWingoLiveUrl',data)
}

/*长龙*/
export function getDragonList(data:Record<string, any>){
	return request.get('/Lottery/GetDragonList',data)
}