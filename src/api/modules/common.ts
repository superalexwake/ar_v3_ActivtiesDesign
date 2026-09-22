/*
 * @Author: Seven
 * @Date: 2023-03-18 10:57:52
 * @LastEditTime: 2023-11-01 18:56:15
 * @LastEditors: Seven
 * @Description:
 */

import { post } from '@/api/axios'
import api from '@/api/url'
import type { SelectTimeType } from '@/types/api/interface/selectType'
import type { WinGo } from '@/types/api'

/**
 * @description: 获取时间列表接口，选择框组件使用
 * @param {*} params
 * @return {*}
 */
export const getDateTimeScopeTypes = async (): Promise<{ typeList: SelectTimeType[] }> => {
	return post(api.GetDateTimeScopeTypes).then((res) => res.data)
}

export enum GameTypeEnum {
	WinGo = '/GetTypeList', // wingo类型
	WinTRX = '/GetTRXtypeList', // wintrx 类型
	K3 = '/GetK3TypeList', // k3 类型
	FiveD = '/Get5DtypeList' // 5D 类型
}
/**
 * @description: 获取类型
 * @param {*} params
 * @return {*}
 */
export const getTypeList = async (type: GameTypeEnum): Promise<CommonObjRes<WinGo.ResWinGoGetTypeList[]>> => {
	return post(type)
}

/**
 * @description: 上传图片
 * @return {*}
 */
export const UploadImages = async (formData: FormData): Promise<any> => {
	return post(api.UploadImage, formData, {}, {
		'Content-Type':'multipart/form-data'
	})
}

/**
 * @description: 上传视频
 * @return {*}
 */
export const UploadVideos = async (formData: FormData): Promise<any> => {
	return post(api.UploadVideo, formData, {}, {
		'Content-Type':'multipart/form-data'
	})
}

