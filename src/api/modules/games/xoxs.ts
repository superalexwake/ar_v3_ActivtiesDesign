import { post } from '@/api/axios'
import api from '@/api/url'
import type { XOSO } from '@/types/api'
/**
 * @description: 获取越南游戏类型
 * @param {*} Promise
 * @return {*}
 */
export const xosoGetVietnamAreList = (): Promise<XOSO.ResXoxsGetAreList[]> => {
	return post(api.GetVietnamAreList).then((res) => res.data)
}
/**
 * @description: 获取开奖日期，期号
 * @param {} params
 * @return {*}
 */
export const xosoGetDayIssueNoList = (params?: { dateTime: string }): Promise<any> => {
	return post(api.GetDayIssueNolist, params)
}

//GetFXosoIssueNoList
export const GetFXosoIssueNoList = (params?:any): Promise<any> => {
	return post(api.GetFXosoIssueNoList,params)
}

/**
 * @description: 获取游戏玩法赔率列表
 * @param {} params
 * @return {*}
 */
export const xosoGetXosoOdds = (params: XOSO.reqGetXosoOdds): Promise<XOSO.resGetXosoOdds> => {
	return post(api.GetXosoOdds, params).then((res) => res.data)
}
/**
 * @description: xoxs投注
 * @param {xoxs} params
 * @return {*}
 */
export const xosoBetting = (params: XOSO.resXOXSGameBetting): Promise<any> => {
	return post(api.XosoBetting, params).then((res) => res)
}

export const AddFXosoBetting = (params: any): Promise<any> => {
	return post(api.AddFXosoBetting, params).then((res) => res)
}

/**
 * @description: 获取xoso 开奖结果
 * @param {xoxs} params
 * @return {*}
 */
export const xosoGetXosoResult = (params: XOSO.reqGetXosoResultList): Promise<any> => {
	return post(api.GetXosoResult, params)
}
/**
 *  @description: 获取xoso 会员投注记录
 * 	@param {xoxs} params
 *  @return {*}
 */
export const xosoGetXosoUserRecord = (params: XOSO.reqGetXosoRecordList): Promise<any> => {
	return post(api.GetXosoUserRecord, params)
}

//急速彩分页用户投注记录
export const GetFXosoRecordPageList = (params: any): Promise<any> => {
	return post(api.GetFXosoRecordPageList, params)
}

//急速彩分页往期开奖结果
export const GetFXosoResultPageList = (params: any): Promise<any> => {
	return post(api.GetFXosoResultPageList, params)
}

//最近一起开奖结果
export const GetFXosoResult = (params: any): Promise<any> => {
	return post(api.GetFXosoResult, params)
}
/**
 * @description: 获取用户投注XOXS开奖结果
 * @param {WinGo} params
 * @return {*}
 */
export const getXosoWinTheLotteryResult = (
	params: any
): Promise<CommonObjRes<any>> => {
	return post(api.GetListUserResult, params)
}



/**
 * @description： 取消订单
 * @param orderId 订单号
 * @return {*}
 */
export const CancelBetOrder = (params: { orderId: string }) => {
	return post(api.CancelBetOrder, params)
}

/**
 * @description 获取区域玩法配置信息
 * @areaId  区域id
 */
export const getXosoAreGamePlay = (params: { areaId: number }) => {
	return post(api.GetXosoAreGamePlay, params)
}
//
export const GetFXosoAreaPlay = (params: { areaId: number,typeId:number }) => {
	return post(api.GetFXosoAreaPlay, params)
}

//获取用户的中奖结果
export const GetFXosoUserResult = (params: { issueNo:string }) => {
	return post(api.GetFXosoUserResult, params)
}
/**
 * @description 获取xoso玩法及赔率详情
 * @param {XOSO} params
 * @return {*}
 */
export const getXosoAreaOdd = (parmas: { areaId: number; categoryId: number; playId: number }) => {
	return post(api.GetXosoAreaPlayOdd, parmas)
}

export const GetFXosoAreaPlayOdd = (parmas: { areaId: number; categoryId: number; playId: number }) => {
	return post(api.GetFXosoAreaPlayOdd, parmas)
}

//
/**
 * @description 获取xoso基础数据
 * @param {XOSO} params
 * @return {*}
 */
export const getXosoBase = (parmas: { areId?: number }) => {
	return post(api.GetXosoGameBaseData, parmas)
}


