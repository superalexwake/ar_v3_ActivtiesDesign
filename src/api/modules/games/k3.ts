import { post } from '@/api/axios'
import api from '@/api/url'
import type { K3, WinGo } from '@/types/api'
/**
 * @description: 获取K3游戏列表
 * @param {*} Promise
 * @return {*}
 */
export const getK3TypeList = (): Promise<any> => {
	return post(api.GetK3TypeList).then((res) => res)
}
/**
 * @description: 获取K3最新一期期号
 * @param {WinGo} params
 * @return {*}
 */
export const getGameK3Issue = (params: WinGo.reqWinGoGetGameIssue): Promise<WinGo.resWinGoGetGameIssue> => {
	return post(api.GetGameK3Issue, params).then((res) => res.data)
}
/**
 * @description: 获取K3最新一条开奖信息
 * @param {object} params
 * @return {*}
 */
export const getK3OneEmerd = (params: { typeId: number }): Promise<CommonObjRes<K3.resGetK3OneEmerd>> => {
	return post(api.GetK3OneEmerd, params)
}
/**
 * @description: 获取K3赔率列表
 * @param {*} Promise
 * @return {*}
 */
export const getK3OddsList = (): Promise<CommonObjRes<K3.resGetK3OddsList[]>> => {
	return post(api.GetK3OddsList)
}
/**
 * @description: K3投注
 * @param {K3} params
 * @return {*}
 */
export const k3GameBetting = (params: K3.reqK3GameBetting): Promise<any> => {
	return post(api.K3GameBetting, params).then((res) => res)
}
/**
 * @description: 获取K3开奖结果
 * @param {WinGo} params
 * @return {*}
 */
export const getK3NoaverageEmerdList = (params: WinGo.reqGetNoaverageEmerdList): Promise<K3.resGetK3NoaverageEmerdList> => {
	return post(api.GetK3NoaverageEmerdList, params).then((res) => res.data)
}
/**
 * @description: 获取K3我的投注结果（带分页）
 * @param {WinGo} params
 * @return {*}
 */
export const getMyK3EmerdList = (params: WinGo.reqGetNoaverageEmerdList): Promise<CommonRes<K3.resGetMyK3EmerdList>> => {
	return post(api.GetMyK3EmerdList, params)
}
/**
 * @description: 获取用户投注中奖结果
 * @param {object} params
 * @return {*}
 */
export const getK3TheLotteryResult = (params: { issueNumber: string }): Promise<CommonObjRes<K3.resGetK3TheLotteryResult>> => {
	return post(api.GetK3TheLotteryResult, params)
}

/**
 * @description: 获取wK3游戏规则
 * @param {*} Promise
 * @return {*}
 */
export const GetK3RuleByTypeId = (params: { typeId: number }): Promise<any> => {
	return post(api.GetK3RuleByTypeId, params).then((res) => res)
}
