import { post } from '@/api/axios'
import api from '@/api/url'
import type { RequestConfig } from '@/types/api'

/**
 * @description: 0 - 待审核 1 - 审核中 2 - 通过 3 - 不通过
 */
export type AuditStateEnum = 0 | 1 | 2 | 3;

export interface GetPageListInvitedWheelWithdrawRecordRsp  {

    /*
    * 订单号
    */
    orderNo?: string;
    /*
    * 用户ID
    */
    userId?: number;
    /*
    * 是否提现到主钱包
    */
    isCashToMainWallet?: boolean;
    /*
    * 提交提现时的提现大类Id
    */
    withdrawCategoryId?: number;
    /*
    * 提现大类名称
    */
    withdrawCategoryName?: string;
    /*
    * 邀请转盘轮次
    */
    invitedWheelRoundNum?: number;
    /*
    * 
    */
    auditState?: AuditStateEnum;
    /*
    * 审核人员
    */
    auditUser?: string;
    /*
    * 原因
    */
    reason?: string;
    /*
    * 当前轮次邀请人数
    */
    invitedUserCount?: number;
    /*
    * 总邀请人数
    */
    totalInvitedUserCount?: number;
    /*
    * 提款金额
    */
    withdrawAmount?: number;
    /*
    * 创建时间
    */
    createTime?: number;
   }

   export interface FirstInvitedWheelData  {

    /*
    * 金额
    */
    amount?: number;
    /*
    * 是否选中金额
    */
    isSelected?: boolean;
   }

   export interface UserInvitedWheelInfoRsp  {

    /*
    * 是否开启邀请轮盘
    */
    isOpenInvitedWheel?: boolean;
    /*
    * 是否首次旋转转盘
    */
    isFirstInvitedWheel?: boolean;
    /*
    * 会员邀请轮盘次数
    */
    userInvitedWheelCount?: number;
    /*
    * 用户轮盘获取的金额
    */
    userInvitedWheelAmount?: number;
    /*
    * 总奖金额
    */
    invitedWheelTotalPrizeAmount?: number;
    /*
    * 过期时间(毫秒级，时间戳差值)
    */
    expiredTime?: number;
    /*
    * 轮盘盘面显示金额
    */
    diskDisplayAmount?: number[];
    /*
    * 未中奖金额
    */
    noWinningRandomAmount?: number[];
    /*
    * 上次抽奖记录
    */
    lastWheelRecordList?: UserWheelRecordRsp[];
    invitedWheelAmountofcodeAmount?: number;
   }

   export interface UserWheelRecordRsp  {

    /*
    * 会员ID
    */
    userId?: number;
    /*
    * 会员名称
    */
    userName?: string;
    /*
    * 轮盘金额
    */
    invitedWheelAmount?: number;
    /*
    * 中奖金额
    */
    prizeAmount?: number;
    /*
    * 中奖时间
    */
    createTime?: number;
   }

/**
 * @description: 获取邀请转盘信息
 * @return {*}
 */
export const getInvitedWheelInfo = async (config?: RequestConfig): Promise<CommonObjRes<UserInvitedWheelInfoRsp>> => {
    return post(api.GetInvitedWheelInfo, {}, config)
}

/**
 * @description: 邀请转盘抽奖
 * @return {*}
 */
export const spinInvitedWheel = async (): Promise<CommonObjRes<UserWheelRecordRsp>> => {
    return post(api.SpinInvitedWheel)
}

// GetInvitedWheelRules
/**
 * @description: 获取邀请转盘抽奖规则
 * @return {*}
 */
export const getInvitedWheelRules = async (): Promise<CommonObjRes<any>> => {
    return post(api.GetInvitedWheelRules)
}

// GetUserInvitedWheelWithdrawList
/**
 * @description: 分页获取用户提现记录列表
 * @param {object} params
 * @return {*}
 */
export const getUserInvitedWheelWithdrawList = async (params: { pageNo: number, pageSize: number }): Promise<CommonObjRes<GetPageListInvitedWheelWithdrawRecordRsp[]>> => {
    return post(api.GetUserInvitedWheelWithdrawList, params)
}

// SubmitInvitedWheelWithdraw
/**
 * @description: 提交邀请转盘提现
 * @param {object} params
 * @return {*}
 */
export const sumitInvitedWheelWithdraw = async (params: {amount: number}): Promise<CommonObjRes<any>> => {
    return post(api.SubmitInvitedWheelWithdraw, params)
}
