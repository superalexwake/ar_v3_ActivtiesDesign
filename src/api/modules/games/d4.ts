import { post } from '@/api/axios'
import api from '@/api/url'
import { D4 } from '@/types/api'

/**
 * @description: 4D游戏配置
 * @param {*} Promise
 * @return {*}
 */
export const get4DGameConfig = (): Promise<CommonObjRes<D4.GameConfigRes>> => {
	return post(api.Get4DGameConfig).then((res) => res)
}

/**
 * @description: 4D期号
 * @param {*} Promise
 * @return {*}
 */
export const getGame4DIssue = (): Promise<CommonObjRes<D4.GameIssueRes>> => {
	return post(api.GetGame4DIssue).then((res) => res)
}

/**
 * @description: 4D期号
 * @param {*} Promise
 * @return {*}
 */
export const d4GameBetting = (params: { betOrders:D4.GameBettingReq }): Promise<any> => {
	return post(api.D4GameBetting,params).then((res) => res)
}

//赔率
export const get4DOddsList = (): Promise<any> => {
	return post(api.Get4DOddsList).then((res) => res)
}

//彩种列表
export const getGameTypeList = (): Promise<any> => {
	return post(api.GetGameTypeList).then((res) => res)
}

//我的投注记录
export const getMy4DHistoryBetting = (params:any): Promise<any> => {
	return post(api.GetMy4DHistoryBetting,params).then((res) => res)
}

//所有彩种最新一期开奖结果
export const get4DGameResult = (): Promise<any> => {
	return post(api.Get4DGameResult).then((res) => res)
}

//开奖结果
export const get4DGameResultByType = (params:any): Promise<any> => {
	return post(api.Get4DGameResultByType,params).then((res) => res)
}

//4D撤单
export const d4GameCancelOrder = (params:any): Promise<any> => {
	return post(api.D4GameCancelOrder,params).then((res) => res)
}

