import { post } from "@/api/axios"
import api from '@/api/url'
import { BinguoBetParams } from "@/types/api/interface/binguo"



/**
 * @description: 获取Bingo开奖结果（带分页）
 * @param {WinGo} params
 * @return {*}
 */
export const GetMyBingo18HistoryBetting = (params: any): Promise<any> => {
	return post(api.GetMyBingo18HistoryBetting, params)
}

/**
 * @description: 获取binguo配置
 */
export const GetBinguoGameConfig = (): Promise<any> => {
	return post(api.GetBinguoGameConfig)
}

/**
 * @description: 获取赔率
 */
export const GetBingo18OddsList = (): Promise<any> => {
	return post(api.GetBingo18OddsList)
}

/**
 * @description: 获取当前期号
 */
export const GetGameBingo18Issue = (): Promise<any> => {
	return post(api.GetGameBingo18Issue)
}

/**
 * @description: 获取当前开奖结果
 */
export const GetBingo18LastGameResult = (): Promise<any> => {
	return post(api.GetBingo18LastGameResult)
}

/**
 * @description: 获取当前投注金额
 */
export const GetBingo18BetAmount = (params: {issueNumber: string}): Promise<any> => {
	return post(api.GetBingo18BetAmount, params)
}

/**
 * @description: 投注
 */
export const Bingo18Betting = (params: BinguoBetParams): Promise<any> => {
	return post(api.Bingo18Betting, params)
}

/**
 * @description: 获取过去50期开奖结果
 */
export const GetBingo18Last50Result = (): Promise<any> => {
	return post(api.GetBingo18Last50Result)
}

/**
 * @description: 趋势开奖统计
 */
export const GetTrendstatistics = (): Promise<any> => {
	return post(api.GetTrendstatistics)
}

/**
 * @description: 排行榜
 */
export const GetLotteryRankList = (): Promise<any> => {
	return post(api.GetLotteryRankList)
}

/**
 * @description: 7天数据统计
 */
export const GetLotteryResult7Day = (): Promise<any> => {
	return post(api.GetLotteryResult7Day)
}

/**
* @description: 用户排行
*/
export const GetUserRankList = (uid: number): Promise<any> => {
 return post(api.GetUserRankList, {uid})
}

