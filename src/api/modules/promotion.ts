import { post } from '@/api/axios'
import api from '@/api/url'
import type {
	PromotionTutorialData,
	PromotionData,
	ReqTeamDayReport,
	ReqPromotionMytem,
	ReqPromotionReceiveList,
	ResPromotionReceiveList,
	PromotionMytemList,
	ReqpromotionRecord,
	RespromotionRecord,
	ReqTeamDayReportList,
	ReqService,
	PromotionRebateData
} from '@/types/api'

/**
 * @description: 推广首页接口
 * @param {*} Promise
 * @return {*}
 */
export const getPromotionData = (): Promise<PromotionData> => {
	return post(api.NewPromotion).then((res) => res.data)
}

/**
 * @description: 推广首页接口
 * @param {*} Promise
 * @return {*}
 */
export const getPromotion = (): Promise<CommonRes<PromotionData>> => {
	return post(api.NewPromotion)
}
/**
 *
 * @param params 佣金明细
 * @returns
 */
export const PromotionReceiveList = async (params?: ReqPromotionReceiveList): Promise<ResPromotionReceiveList> => {
	return post(api.GetCommissionDetails, params).then((res) => res.data)
}

/**
 * @description: 获取我的邀请
 * @param {ReqPromotionMytem} params
 * @return {*}
 */

export const getPromotionMytem = async (params: ReqPromotionMytem): Promise<CommonRes<PromotionMytemList>> => {
	return post(api.PromotionMytem, params)
}
/**
 * @description: 获取推广规则 教程
 * @param {*} Promise
 * @return {*}
 */
export const promotionTutorial = async (): Promise<PromotionTutorialData> => {
	return post(api.PromotionTutorial).then((res) => res.data)
}

/**
 * @description: 获取推广地址
 * @param {*} params
 * @return {*}
 */
export const getUrlAddress = async (): Promise<{ datacode: number; url: string }> => {
	return post(api.GetUrlAddress).then((res) => res.data)
}

/**
 * @description: 获取我的团队
 * @param {*} params
 * @returns
 */
export const getTeamDayReport = (params: ReqTeamDayReport): Promise<CommonRes<ReqTeamDayReportList>> => {
	// return post(api.GetTeamDayReport, params).then((res) => res.data)
	return post(api.GetTeamDayReport, params)
}

//GetPromotionRecord
/**
 * @ 我的邀请人(下级)记录
 * @param params
 * @returns
 */
export const GetPromotionRecord = async (params: ReqpromotionRecord): Promise<CommonRes<RespromotionRecord>> => {
	return post(api.GetPromotionRecord, params)
}

// 获取单个客服url 结果:{code:'string',msg:'string',msgCode:'',data:{typeId:number,name:string,url:string}}
export const GetAgentServiceList = (params: ReqService) => {
	return post(api.GetAgentServiceList, params)
}
/**
 * @description: 获取推广规则 教程
 * @param {*} Promise
 * @return {*}
 */
export const GetTotalRebateRules = async (): Promise<PromotionRebateData[]> => {
	return post(api.GetTotalRebateRules).then((res) => res.data)
}

/**
 * @description: 合伙人奖励
 * @param {*} Promise
 * @return {*}
 */
export const GetPartnerRewards = async () => {
	return post(api.GetPartnerRewards)
}
/**
 * @description: 合伙人奖励 邀请记录
 * @param {*} Promise
 * @return {*}
 */
export const GetPartnerRewardsDeatilList = async (data:any) => {
	return post(api.GetPartnerRewardsDeatilList,data)
}