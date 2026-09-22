import { post } from '@/api/axios'
import api from '@/api/url'
import type { WinGo } from '@/types/api'
/**
 * @description: 获取TrxWin游戏类型
 * @param {*} Promise
 * @return {*}
 */
export const winTxrGetTRXtypeList = (): Promise<any> => {
	return post(api.WinTxrGetTRXtypeList).then((res) => res)
}
/**
 * @description: 获取TrxWin游戏最新一期（待开奖、已开奖）期号
 * @param {WinGo} params
 * @return {*}
 */
export const winTxrGetTRXGameIssue = (params: WinGo.reqWinGoGetGameIssue): Promise<WinGo.resWinGoGetGameIssue> => {
	return post(api.WinTxrGetTRXGameIssue, params).then((res) => res.data)
}
/**
 * @description: TrxWin游戏投注
 * @param {WinGo} params
 * @return {*}
 */
export const winTxrGameTRXBetting = (params: WinGo.resWinGoGameBetting): Promise<any> => {
	return post(api.WinTxrGameTRXBetting, params).then((res) => res)
}

/**
 * @description: 获取TrxWin 开奖结果
 * @param {WinGo} params
 * @return {*}
 */
export const winTxrGetTRXNoaverageEmerdList = (
	params: WinGo.reqGetNoaverageEmerdList
): Promise<WinGo.resGetNoaverageEmerdList> => {
	return post(api.WinTxrGetTRXNoaverageEmerdList, params).then((res) => res.data)
}
/**
 * @description: 我的TrxWin比赛记录（带分页）
 * @param {WinGo} params
 * @return {*}
 */
export const winTxrGetMyEmerdList = (params: WinGo.reqGetNoaverageEmerdList): Promise<WinGo.reswinGoGetMyEmerdList> => {
	return post(api.WinTxrGetTRXMyEmerdList, params).then((res) => res.data)
}
/**
 * @description: Trx开奖结果，图表趋势
 * @param {object} params
 * @return {*}
 */
export const winTxrGetEmerdList = (params: { typeId: number }): Promise<WinGo.resWinGoGetEmerdList> => {
	return post(api.WinTxrGetEmerdList, params).then((res) => res.data)
}
/**
 * @description: 获取用户投注Trx开奖结果
 * @param {WinGo} params
 * @return {*}
 */
export const getTrxWinTheLotteryResult = (
	params: WinGo.reqWinGoGetWinTheLotteryResult
): Promise<CommonObjRes<WinGo.resWinGoGetWinTheLotteryResult[]>> => {
	return post(api.GetTrxWinTheLotteryResult, params)
}
/**
 * @description: 获取wintrx游戏规则
 * @param {*} Promise
 * @return {*}
 */
export const GetTRXRuleByTypeId = (params: { typeId: number }): Promise<any> => {
	return post(api.GetTRXRuleByTypeId, params).then((res) => res)
}
