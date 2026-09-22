import { post } from '@/api/axios'
import api from '@/api/url'
import type { FD } from '@/types/api'
/**
 * @description: 获取5D游戏类型
 * @param {*} Promise
 * @return {*}
 */
export const get5DtypeList = (): Promise<any> => {
	return post(api.Get5DtypeList).then((res) => res)
}
/**
 * @description: 获取5D游戏最新一期期号
 * @param {object} params
 * @return {*}
 */
export const getGame5DIssue = (params: { typeId: number }): Promise<FD.resGetGame5DIssue> => {
	return post(api.GetGame5DIssue, params).then((res) => res.data)
}
/**
 * @description: 获取5D游戏最新的一期已开奖结果
 * @param {object} params
 * @return {*}
 */
export const get5DOneEmerd = (params: { typeId: number }): Promise<FD.resGet5DOneEmerd> => {
	return post(api.Get5DOneEmerd, params).then((res) => res.data)
}
/**
 * @description: 获取5D赔率列表
 * @param {*} Promise
 * @return {*}
 */
export const get5DOddsList = (): Promise<FD.resGet5DOddsList[]> => {
	return post(api.Get5DOddsList).then((res) => res.data)
}
/**
 * @description: 5D投注
 * @param {FD} params
 * @return {*}
 */
export const game5DBetting = (params: FD.reqGame5DBetting): Promise<any> => {
	return post(api.Game5DBetting, params)
}
/**
 * @description:  获取5D开奖结果（带分页）
 * @param {FD} params
 * @return {*}
 */
export const getNoaverage5DEmerdList = (
	params: FD.reqGetNoaverage5DEmerdList
): Promise<CommonRes<FD.resGetNoaverage5DEmerdList>> => {
	return post(api.GetNoaverage5DEmerdList, params)
}

/**
 * @description: 5D开奖结果 图表趋势
 * @param {FD} params
 * @return {*}
 */
export const get5DEmerdList = (params: FD.reqGet5DEmerdList): Promise<CommonObjRes<FD.resGet5DEmerdList[]>> => {
	return post(api.Get5DEmerdList, params)
}
/**
 * @description: 我的5D比赛记录（带分页）
 * @param {FD} params
 * @return {*}
 */
export const getMy5DEmerdList = (params: FD.reqGetNoaverage5DEmerdList): Promise<CommonRes<FD.resGetMy5DEmerdList>> => {
	return post(api.GetMy5DEmerdList, params)
}

/**
 * @description: 获取用户投注中奖结果
 * @param {object} params
 * @return {*}
 */
export const getD5TheLotteryResult = (params: { issueNumber: string }): Promise<CommonObjRes<FD.resGetD5TheLotteryResult>> => {
	return post(api.GetD5TheLotteryResult, params)
}

/**
 * @description: 获取w5D游戏规则
 * @param {*} Promise
 * @return {*}
 */
export const Get5DRuleByTypeId = (params: { typeId: number }): Promise<any> => {
	return post(api.Get5DRuleByTypeId, params).then((res) => res)
}
