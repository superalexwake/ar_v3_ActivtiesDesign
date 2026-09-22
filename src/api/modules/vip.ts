import { post } from '@/api/axios'
import api from '@/api/url'
import type {
	ResGetVipUsers,
	ResGetPageListVipUserRecord,
	ResGetListVipLevel,
	ResGetListVipUserRewards,
	ResGetVipUserLevelDetail,
	ReqAddReceiveAward,
	ResGetAllVipLevelList
} from '@/types/api'

//获取vip会员信息
export const GetVipUsers = (): Promise<CommonObjRes<ResGetVipUsers>> => {
	return post(api.GetVipUsers)
}

//获取vip操作日志
export const GetPageListVipUserRecord = (params: any): Promise<CommonRes<ResGetPageListVipUserRecord>> => {
	return post(api.GetPageListVipUserRecord, params)
}

//获取vip等级信息
export const GetListVipLevel = (params: any): Promise<CommonObjRes<ResGetListVipLevel>> => {
	return post(api.GetListVipLevel, params)
}

//获取vip会员奖励
export const GetListVipUserRewards = (params: any): Promise<CommonObjRes<ResGetListVipUserRewards>> => {
	return post(api.GetListVipUserRewards, params)
}

//获取vip用户等级详细
export const GetVipUserLevelDetail = (): Promise<CommonObjRes<ResGetVipUserLevelDetail>> => {
	return post(api.GetVipUserLevelDetail)
}

//领取奖励
export const AddReceiveAward = (params: ReqAddReceiveAward): Promise<CommonObjRes<any>> => {
	return post(api.AddReceiveAward, params)
}

//返水详情
export const GetAllVipLevelList = (): Promise<CommonObjRes<ResGetAllVipLevelList>> => {
	return post(api.GetAllVipLevelList)
}
