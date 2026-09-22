import http from '../axios'
import { IResponse,Pay } from './types'
import { AxiosResponse } from 'axios';
/**
 * 收银台 确认支付 接口
 */
export function confirmAutoPayment(data: Pay.confirmPaymentRqs) {
	return http.post<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/payWithoutUtr', data)
}
/**
 * 收银台 确认支付 接口
 */
export function confirmPayment(data: Pay.confirmPaymentRqs) {
    return http.post<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/subUtr', data)
}
/**
 * 订单状态查询
 */
export function getOrderStatus(data: {token:string}) {
    return http.post<AxiosResponse,IResponse<Pay.orderStatusRes>>('/ar-wallet/v4/apiCenter/status', data)
}
/**
 * 获取支付页面(收银台)信息接口
 */
export function paymentDetails(token: string): Promise<IResponse<Pay.paymentDetailsRes>> {
    return http.get<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/fetchThirdPartyRechargePageInfoEncryption')
}
//取消支付订单
export function cancelPayment(data:{reason:string,token:string}):Promise<IResponse>  {
    return http.post<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/noPay', data)
}

//取消支付订单
export function testOrder() {
    return http.post<AxiosResponse,IResponse>('/ar-wallet/apiCenter/testOrder')
}

/**
 * 客服
 */
export function CustomerService(params:{antCustomer:string}): Promise<IResponse<any>> {
    return http.get<AxiosResponse,IResponse>('/ar-wallet/signUp/getCurrentCustomerServiceSystem',{
		params,
	})
}

/**
 * 提交申诉
 */
export function SubmitRechargeAppeal(data:{token: any,appealReason:string,images:string,video:string} ): Promise<IResponse> {
    return http.post<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/submitRechargeAppeal',data)
}
/**
 * 查询是否提交过申诉
 */
export function RechargeAppealExist(data:{token: any} ): Promise<IResponse> {
    return http.post<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/rechargeAppealExist',data)
}
/**
 *获取kyc银行列表
 */
export function GetAppealKycBankList(data:{token:any,source:number}): Promise<IResponse<any>> {
    return http.post<AxiosResponse, IResponse<Kyc.kycBankList>>('/ar-wallet/v4/apiCenter/getBanks/forBuyAppeal',data)
}

/**
 *发送kyc短信
 */
export function KycSendMsg(data:{phoneNumber:string,type:number,bankCode:any,token:any}): Promise<IResponse<any>> {
    return http.post<AxiosResponse, IResponse>('/ar-wallet/v4/apiCenter/sendOtp',data)
}

/**
 *验证kyc
 */
export function KycVerify(data:{bankCode:any,phoneNumber:string,otp:string,token:any,type:number,response:string,utr:string,images:string}): Promise<IResponse<any>> {
    return http.post<AxiosResponse, IResponse>('/ar-wallet/v4/apiCenter/verifyOtp',data)
}
/**
 *验证kyc
 */
export function KycVerifyV2(data:{bankCode:any,phoneNumber:string,otp:string,token:any,type:number,response:string,utr:string,images:string}): Promise<IResponse<any>> {
	return http.post<AxiosResponse, IResponse>('/ar-wallet/v4/apiCenter/confirmPayment',data)
}
/**
 *验证kyc
 */
export function getStayTime(data: {token:any}): Promise<IResponse<any>> {
    return http.post<AxiosResponse, IResponse>('/ar-wallet/v4/apiCenter/onPaymentPageExit',data)
}

/**
 *验证kyc
 */
export function cancellationReasonList(data: {token:any}): Promise<IResponse<any>> {
	return http.post<AxiosResponse, IResponse>('/ar-wallet/v4/apiCenter/cancellationReasonList',data)
}

/**
 * 唤醒支付调用
 */
export function subForWakeUp(data: {bankCode:any}): Promise<IResponse<any>> {
	return http.post<AxiosResponse, IResponse>('/ar-wallet/v4/apiCenter/subForWakeUp',data)
}