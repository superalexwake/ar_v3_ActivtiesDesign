import { post } from '@/api/axios'
import api from '@/api/url'
import type { WinGo } from '@/types/api'
/**
 * @description: 获取wingo游戏列表
 * @param {*} Promise
 * @return {*}
 */
export const winGoGetTypeList = (): Promise<any> => {
	return post(api.WinGoGetTypeList).then((res) => res)
}
/**
 * @description: 获取WinGo 游戏最新期号
 * @param {WinGo} params
 * @return {*}
 */
export const winGoGetGameIssue = (params: WinGo.reqWinGoGetGameIssue): Promise<WinGo.resWinGoGetGameIssue> => {
	return post(api.WinGoGetGameIssue, params).then((res) => res.data)
}
/**
 * @description: 获取WinGo开奖结果（带分页）
 * @param {WinGo} params
 * @return {*}
 */
export const winGoGetNoaverageEmerdList = (params: WinGo.reqGetNoaverageEmerdList): Promise<WinGo.resGetNoaverageEmerdList> => {
	return post(api.WinGoGetNoaverageEmerdList, params).then((res) => res.data)
}
/**
 * @description: 我的WinGo游戏记录
 * @param {WinGo} params
 * @return {*}
 */
export const winGoGetMyEmerdList = (params: WinGo.reqGetNoaverageEmerdList): Promise<WinGo.reswinGoGetMyEmerdList> => {
	return post(api.WinGoGetMyEmerdList, params).then((res) => res.data)
}
/**
 * @description: 开奖结果趋势图
 * @param {typeId} params
 * @return {*}
 */
export const winGoGetEmerdList = (params: { typeId: number }): Promise<WinGo.resWinGoGetEmerdList> => {
	return post(api.WinGoGetEmerdList, params).then((res) => res.data)
}
/**
 * @description: WinGo投注
 * @param {WinGo} params
 * @return {*}
 */
export const winGoGameBetting = (params: WinGo.reqWinGoGameBetting): Promise<any> => {
	return post(api.WinGoGameBetting, params)
}
/**
 * @description: 用户投注中奖结果
 * @param {WinGo} params
 * @return {*}
 */
export const winGoGetWinTheLotteryResult = (
	params: WinGo.reqWinGoGetWinTheLotteryResult
): Promise<WinGo.resWinGoGetWinTheLotteryResult[]> => {
	return post(api.WinGoGetWinTheLotteryResult, params).then((res) => res.data)
}
/**
 * @description: 长龙助手，包含WinGo，K3，5D
 * @param {*} Promise
 * @return {*}
 */
export const getLongDragon = (data:any): Promise<CommonObjRes<WinGo.resGetLongDragon>> => {
	return post(api.GetLongDragon,data)
}
/**
 * @description:
 * @return {*}
 */
export const getLastFiveIssueNumberResult = (params: { typeId: number }): Promise<CommonObjRes<{ number: string }>> => {
	return post(api.GetLastFiveIssueNumberResult, params)
}
/**
 * @description: 获取wingo游戏规则
 * @param {*} Promise
 * @return {*}
 */
export const GetRuleByTypeId = (params: { typeId: number }): Promise<any> => {
	return post(api.GetRuleByTypeId, params).then((res) => res)
}
