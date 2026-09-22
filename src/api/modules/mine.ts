import { post } from '@/api/axios'
import api from '@/api/url'
import type {
	GameStatesList,
	ReqGetNewMyEmerd,
	getRedpagePageParams,
	ReqSubmitSuggest,
	ReqGetGoogleVerify,
	ReqProtocols,
	ReqAgreement,
	ReqPlayingGuide,
	MyEmerdListData,
	MyEmerdParms,
	ReqService,
	CodeWashAmount,
	ReqCloseGoogleVerify
} from '@/types/api'
// import {setSafeInto} from "@/api";

/**
 * @description: 兑换奖励
 * @param {giftCode:string} params
 * @return {*}
 */
export const ConversionRedpage = async (params: { giftCode: string }): Promise<any> => {
	return post(api.ConversionRedpage, params)
}

/**
 * @description: 保险箱转入
 * @param {giftCode:string} params
 * @return {*}
 */
export const SetSafeIntopage = async (params: { amount: any }): Promise<any> => {
	return post(api.SetSafeInto, params)
}

/**
 * @description: 获取兑换记录列表
 * @param {getRedpagePageParams} params
 * @return {*}
 */
export const getRedpagePageList = async (params: getRedpagePageParams): Promise<any> => {
	return post(api.GetRedpagePageList, params)
}

/**
 * @description: 游戏统计列表
 * @param {*} Promise
 * @return {*}
 */
export const GameStatis = async (params: ReqGetNewMyEmerd): Promise<GameStatesList> => {
	return post(api.GameStatis, params).then((res) => res.data)
}

//关于-隐私政策
export const GetProtocols = (): Promise<CommonObjRes<ReqProtocols>> => {
	return post(api.GetProtocols)
}

//关于-风险披露协议
export const GetAgreement = (): Promise<CommonObjRes<ReqAgreement>> => {
	return post(api.GetAgreement)
}

//获取新手指南
export const GetPlayingGuide = (): Promise<CommonObjRes<ReqPlayingGuide>> => {
	return post(api.GetPlayingGuide)
}

//提交意见反馈	只有结果{code：string，message：string，msg：string}
export const SubmitSuggest = (params: ReqSubmitSuggest) => {
	return post(api.SubmitSuggest, params)
}

// 获取谷歌验证码  返回结果：{code:'string',msg:'string',msgCode:'string',"data":{"secret":"string"}}
export const GetGoogleVerify = (params: ReqGetGoogleVerify) => {
	return post(api.GetGoogleVerify, params).then((res) => res)
}

/**
 * @description: 获取历史投注结果
 * @param {MyEmerdParms} params
 * @return {*}
 */
export const getNewMyEmerdList = async (params: MyEmerdParms): Promise<CommonRes<MyEmerdListData>> => {
	return post(api.GetNewMyEmerdList, params)
}
// 获取客服集合   结果:{code:'string',msg:'string',msgCode:'',data:{typeId:number,typeName:string,}}
export const GetCustomerServiceTypelist = () => {
	return post(api.GetCustomerServiceTypelist)
}
// 获取代理客服
export const GetAgentServiceTypeList = () => {
	return post(api.GetAgentServiceTypeList)
}
// 获取单个客服url 结果:{code:'string',msg:'string',msgCode:'',data:{typeId:number,name:string,url:string}}
export const GetCustomerServiceList = (params: ReqService) => {
	return post(api.GetCustomerServiceList, params)
}
//客服群入口
export const GetCustomerServiceGroup = () => {
	return post(api.GetCustomerServiceGroup)
}

//是否开放积分商城
export const GetPointMallState = () => {
	return post(api.GetPointMallState)
}
//洗码量
export const GetCodeWashAmount = (params: CodeWashAmount) => {
	return post(api.GetCodeWashAmount, params)
}
//一键洗码
export const AddCodeWashRecord = (params: CodeWashAmount) => {
	return post(api.AddCodeWashRecord, params)
}
//获取洗码记录(带分页)
export const GetCodeWashRecordList = (params: CodeWashAmount) => {
	return post(api.GetCodeWashRecordList, params)
}
//获取洗码规则
export const GetCodeWashRule = () => {
	return post(api.GetCodeWashRule)
}

// 绑定谷歌验证码
export const getBindGoogleVerify = (params: ReqCloseGoogleVerify) => {
	return post(api.BindGoogleVerify, params)
}
// 重置谷歌验证码
export const ResetGoogleVerify = (params: ReqCloseGoogleVerify) => {
	return post(api.ResetGoogleVerify, params)
}
// 关闭谷歌验证码
export const getCloseGoogleVerify = (params: ReqCloseGoogleVerify) => {
	return post(api.CloseGoogleVerify, params)
}
// 一键删除
export const delall = () => {
	return post(api.OneKeyMarkAllData)
}
