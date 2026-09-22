/*
 * @Author: Jason s1017349071@163.com
 * @Date: 2023-04-08 17:26:11
 * @LastEditors: Seven
 * @LastEditTime: 2024-01-29 10:09:34
 * @FilePath: \ar_v2_vue\src\api\modules\wallet.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { post } from '@/api/axios'
import api from '@/api/url'
import type {
	ReqchargeRecord,
	chargeRecordList,
	ReqdWithdrawLog,
	withdrawLogList,
	ReqTransactions,
	transactionsList,
	ResBankList,
	ResWithdrawlist,
	ResTransactionsTypes,
	ReqWithdrawals,
	ResWithdrawals,
	ReqNewSetWithdrawal,
	ReqBankList,
	ReqWithdrawalBankCard,
	ReqDeleteBankCard,
	PayTypeName,
	RechargeTypesData,
	BankOrderQuery,
	NewSetRechargesBankOrderData,
	UpRechargesBankOrderQuery,
	ReqSetWithdrawalUsdt,
	resWallet,
	resUserAmount,
	C2CRechargeRecord,
	C2CRechargeCancel,
	reqSetWithdrawalUPI,
	CreateC2CRechargeData,
	CreateC2CRechargeQuery,
	SellerInfo,
	resGetC2CWithdrawOrderDetail,
	SuggessList,
	RechargeUsdtReq,
	ResUserRealName,
	ReqSetWithdrawalCpf,
	UpdateUsdtOrderInfo,
	QrcodeBankInfo,
	ThirdPayInfo
} from '@/types/api'
import {SettingStore} from '@/stores/modules/setting'
//获取主钱包
export const GetBalance = async (): Promise<CommonObjRes<resWallet>> => {
	return post(api.GetBalance)
}
//获取用户余额(回收余额)
export const RecoverBalance = (isSaasApi:boolean=false) => {
	const settingStore = SettingStore()
	return post((settingStore.isSwitchSaasBalance||isSaasApi)?api.RecoverSaasBalance:api.RecoverBalance)
}

//获取所有钱包
export const GetAllwallets = async (isSaasApi:boolean=false): Promise<CommonObjRes<string>> => {
	const settingStore = SettingStore()
	return post((settingStore.isSwitchSaasBalance||isSaasApi)?api.GetSaasAllwallets:api.GetAllwallets)
}
export const GetARGameAndPlatWallets = async (): Promise<CommonObjRes<string>> => {
	return post(api.GetARGameAndPlatWallets)
}

//一键回收钱包
export const GetUserAmount = async (): Promise<CommonObjRes<resUserAmount>> => {
	return post(api.GetUserAmount)
}

//获取充值记录
export const GetRechargeRecord = async (params: ReqchargeRecord): Promise<CommonRes<chargeRecordList>> => {
	return post(api.GetRechargeRecord, params)
}

//获取充值记录
export const GetC2CRechargeRecord = async (params: ReqchargeRecord): Promise<CommonRes<C2CRechargeRecord>> => {
	return post(api.GetC2CRechargeRecord, params)
}

//获取提现记录
export const GetWithdrawLog = async (params: ReqdWithdrawLog): Promise<CommonRes<withdrawLogList>> => {
	return post(api.GetWithdrawLog, params)
}

//获取提现记录(提现页面的底部的5条数据)
export const GetWithdrawLogF = async (params: ReqdWithdrawLog): Promise<CommonRes<withdrawLogList>> => {
	return post(api.GetWithdrawLog, params)
}

//获取提现类别
export const GetWithdrawalTypes = (): Promise<CommonObjRes<ResWithdrawlist>> => {
	return post(api.GetWithdrawalTypes)
}

//获取对应提现方式下的所有银行信息
export const GetWithdrawals = async (params: ReqWithdrawals): Promise<CommonObjRes<ResWithdrawals>> => {
	return post(api.getWithdrawals, params)
}

//提现
export const NewSetWithdrawal = async (params: ReqNewSetWithdrawal) => {
	return post(api.NewSetWithdrawal, params)
}

//获取实名信息
export const GetUserRealName = (): Promise<CommonObjRes<ResUserRealName>> => {
	return post(api.GetUserRealName)
}

//添加pix
export const SetWithdrawalCpf = async (params: ReqSetWithdrawalCpf) => {
	return post(api.SetWithdrawalCpf, params)
}

//获取银行列表
export const GetBankList = async (params: ReqBankList): Promise<CommonObjRes<ResBankList>> => {
	return post(api.GetBankList, params)
}
//添加银行卡
export const SetWithdrawalBankCard = async (params: ReqWithdrawalBankCard) => {
	return post(api.SetWithdrawalBankCard, params)
}
//删除银行卡
export const deleteBankCard = async (params: ReqDeleteBankCard) => {
	return post(api.DeleteBankCard, params)
}

//添加usdt地址
export const SetWithdrawalUsdt = async (params: ReqSetWithdrawalUsdt) => {
	return post(api.SetWithdrawalUsdt, params)
}

//获取交易类型
export const GetTransactionsTypes = (): Promise<CommonObjRes<ResTransactionsTypes>> => {
	return post(api.GetTransactionsTypes)
}

//获取交易记录
export const GetTransactions = async (params: ReqTransactions): Promise<CommonRes<transactionsList>> => {
	return post(api.GetTransactions, params)
}

//根据key获取系统字典值
export const GetSettingByKey = async (params: {}): Promise<CommonObjRes<any>> => {
	return post(api.GetSettingByKey, params)
}

// 获取支付大类列表
export const GetPayTypeName = async (params: {}): Promise<CommonObjRes<PayTypeName>> => {
	return post(api.GetPayTypeName,params)
}

/**
 * @description: 获取充值渠道列表
 * @param {*} Promise
 * @return {*}
 */
export const GetRechargeTypes = async (params: {
	payid: number
	payTypeId?: number
	deviceType?:number
}): Promise<CommonObjRes<RechargeTypesData>> => {
	return post(api.GetRechargeTypes, params)
}

/**
 * @description: 获取银行下单信息
 * @param {object} params
 * @return {*}
 */
export const NewSetRechargesBankOrder = async (params: BankOrderQuery): Promise<CommonObjRes<NewSetRechargesBankOrderData>> => {
	return post(api.NewSetRechargesBankOrder, params)
}

/**
 * @description: 取消本地银行订单
 * @param {object} params
 * @return {*}
 */
export const UpRechargesBankOrder = async (params: { orderNo: string }): Promise<any> => {
	return post(api.UpRechargesBankOrder, params)
}

/**
 * @description: 完成充值
 * @param {UpRechargesBankOrderQuery} params
 * @return {*}
 */
export const UpdateRechargesUpiOrder = async (params: UpRechargesBankOrderQuery): Promise<any> => {
	return post(api.UpdateRechargesUpiOrder, params)
}

/**
 * @description: 获取银行订单信息
 * @return {*}
 */
export const GetBankOrder = async (params: { payTypeId: number }): Promise<CommonObjRes<NewSetRechargesBankOrderData>> => {
	return post(api.GetBankOrder, params)
}

/**
 * @description: 查询订单状态
 * @param params
 * @returns
 */
export const GetBankOrderInfo = async (params: { rechargeNumber: string }): Promise<any> => {
	return post(api.GetBankOrderInfo, params)
}

/*
 * @description: 取消C2C充值订单
 * @param params
 * @returns
 */
export const cancelC2CRechargeCancel = async (params: C2CRechargeCancel): Promise<any> => {
	return post(api.C2CRechargeCancel, params)
}

/**
 * @description: 生成C2C充值订单
 * @param params
 * @returns
 */
export const createC2CRecharge = async (params: CreateC2CRechargeQuery): Promise<any> => {
	return post(api.C2CRecharge, params)
}

/**
 * @description: 获取C2C充值订单详情
 * @param params
 * @returns
 */
export const getC2CRechargeDetail = async (params: { orderId: number }): Promise<CommonObjRes<SellerInfo>> => {
	return post(api.C2CRechargeGetOrderDetail, params)
}

/**
 * @description: 确认C2C充值订单
 * @param params
 * @returns
 */
export const C2CRechargeConfirm = async (params: { orderId: number; transactionNo: string, ossUrls: any }): Promise<any> => {
	return post(api.C2CRechargeConfirm, params)
}

/**
 * @description: 获取C2C充值订单
 * @param params
 * @returns
 */
export const C2CRechargeGetPayingDetail = async (): Promise<CommonObjRes<SellerInfo> | undefined> => {
	return post(api.C2CRechargeGetPayingDetail)
}

/**
 * @description: 获取C2C充值金额列表
 * @param params
 * @returns
 */
export const GetC2CRechargeAwardAmountList = async (params: { amount: number }): Promise<CommonObjRes<SuggessList[]>> => {
	return post(api.GetC2CRechargeAwardAmountList, params)
}

/**
 * @description: C2C充值申诉
 * @param params
 * @returns
 */
export const C2CRechargeAppeal = async (params: { orderId: number }): Promise<any> => {
	return post(api.C2CRechargeAppeal, params)
}

/**
 * @description: C2C充值取消原因
 * @param params
 * @returns
 */
export const GetC2CCancelReason = async (params: { type: number }): Promise<any> => {
	return post(api.GetC2CCancelReason, params)
}

/**
 * @description: 添加UPI账号接口
 * @param {reqSetWithdrawalUPI} params
 * @return {*}
 */
export const SetWithdrawalNewUPI = async (params: reqSetWithdrawalUPI): Promise<any> => {
	return post(api.SetWithdrawalUPI, params)
}

export const GetNewUPIBindMobileNo = async (): Promise<any> => {
	return post(api.GetNewUPIBindMobileNo)
}


/**
 * @description: 获取c2c提现记录
 * @param {any} params
 * @return {*}
 */
export const GetC2CWithdrawRecord = async (params: any) => {
	return post(api.GetC2CWithdrawRecord, params)
}
/**
 * @description: 根据订单号查询c2c订单详情
 * @param {object} params
 * @return {*}
 */
export const GetC2CWithdrawOrderDetail = async (params: {
	orderNo: string
}): Promise<CommonObjRes<resGetC2CWithdrawOrderDetail>> => {
	return post(api.GetC2CWithdrawOrderDetail, params)
}

/**
 * @description: c2c提现确认到账
 * @param {object} params
 * @return {*}
 */
export const C2CWithdrawConfirm = async (params: { orderNo: string }): Promise<any> => {
	return post(api.C2CWithdrawConfirm, params)
}

/**
 * @description: c2c提现继续匹配
 * @param {object} params
 * @return {*}
 */
export const C2CWithdrawRematch = async (params: { orderNo: string }): Promise<any> => {
	return post(api.C2CWithdrawRematch, params)
}

//金额错误
export const C2CWithdrawOrderAmountError = async (params:any): Promise<any> => {
	return post(api.C2CWithdrawOrderAmountError, params)
}

//
/**
 * @description: c2c提现更改订单金额
 * @param {object} params
 * @return {*}
 */
export const ChangeC2CWithdrawOrderAmount = async (params: { orderNo: string; orderAmount: number }): Promise<any> => {
	return post(api.ChangeC2CWithdrawOrderAmount, params)
}
/**
 * @description: c2c更改金额推荐金额
 * @return {*}
 */
export const GetC2CWithdrawRecommendedAmount = async (): Promise<any> => {
	return post(api.GetC2CWithdrawRecommendedAmount)
}

/**
 * @description: c2c提现取消订单
 * @param {object} params
 * @return {*}
 */
export const C2CWithdrawalCancel = async (params: { orderNo: string; cancelReason: string; reamrk: string }): Promise<any> => {
	return post(api.C2CWithdrawalCancel, params)
}

/**
 * @description: c2c提现申诉
 * @param {object} params
 * @return {*}
 */
export const C2CWithdrawAppeal = async (params: { orderNo: string }): Promise<any> => {
	return post(api.C2CWithdrawAppeal, params)
}

/**
 * @description: 获取可以绑定UPI的银行卡列表
 * @param {*} Promise
 * @return {*}
 */
export const GetNewUPICanBindCardList = async (): Promise<any> => {
	return post(api.GetNewUPICanBindCardList)
}

//添加usdt地址
export const SetWithdrawalWallet = async (params: any) => {
	return post(api.SetWithdrawalWallet, params)
}

//USDT充值
export const RechargesUsdtOrder = async (params: RechargeUsdtReq) => {
	return post(api.RechargesUsdtOrder, params)
}

// 获取USDT充值订单
export const GetUsdtOrder = async (params: { type: number }) => {
	return post(api.GetUsdtOrder, params)
}

/**
 * @description: UPT充值下单
 */
export const RechargesUpiOrder = async (params: { amount: number }) => {
	return post(api.RechargesUpiOrder, params)
}

/**
 * @description: 获取UPI充值订单详情
 */
export const GetUpiOrder = async (params: { type: number }) => {
	return post(api.GetUpiOrder, params)
}

/**
 * @description: 更新USDT订单
 * @param {UpdateUsdtOrderInfo} params
 * @return {*}
 */
export const UpdateRechargesUsdtOrder = async (params: UpdateUsdtOrderInfo) => {
	return post(api.UpdateRechargesUsdtOrder, params)
}

/**
 * @description: PIX是否首次充值
 */
export const CheckFirstPixRecharge = async () => {
	return post(api.CheckFirstPixRecharge)
}

/**
 * @description: 获取钱包会员信息
 */
export const getARBWalletMemberInfo = async (params: {
	ip: string | null
}) => {
	return post(api.ARBWalletMemberInfo, params)
}


/**
 * @description: 激活钱包
 */
export const ARBWalletActivate = async (params: {
	returnUrl: string,
}) => {
	return post(api.ARBWalletActivate, params)
}

/**
 * @description: 进入钱包
 */
export const ARBWalletEnter = async (params: {
	returnUrl: string,
}) => {
	return post(api.ARBWalletEnter, params)
}

/**
 * @description: 获取是否有AR钱包订单，返回Url进行判断
 */
export const getARPayOrder = async () => {
	return post(api.GetARPayUrl)
}
/**
 * @description: 三方支付查询接口
 */
export const ThirdPay = async (params: ThirdPayInfo) => {
	return post(api.ThirdPay, params)
}


/**
 * @description: 银行卡扫码支付
 */
export const NewSetBankQRCodeOrder = async (params: QrcodeBankInfo) => {
	return post(api.NewSetBankQRCodeOrder, params)
}

/**
 * @description: ARpay充值
 */
export const CreateRechargeOrder = async (params: ThirdPayInfo) => {
	return post(api.CreateRechargeOrder, params)
}

/**
 * @description: 获取RSN会员信息
 */
export const getRNSWalletInfo = async () => {
	return post(api.RSNWalletMemberInfo)
}
/**
 * @description: 激活RSN钱包RSN会员信息
 */
export const activeRSNWallet = async (params:{returnUrl: string}) => {
	return post(api.RSNActivateNet, params)
}
/**
 * @description: 进入RSN钱包
 */
export const enterRSNWallet = async (params:{returnUrl: string}) => {
	return post(api.RSNEnterNet, params)
}
/**
 * @description: rsnpay充值
 */
export const getRSNOrderPay = async () => {
	return post(api.GetRSNPayUrl)
}

/**
 * @description: ArUpiOrderPay充值订单
 */
export const getArUpiOrderPay = async (params: any) => {
	return post(api.GetArUpiPayUrl, params)
}
/**
 * @description: 申诉
 */
export const getOrderAppeal = async (params:{returnUrl: string}) => {
	return post(api.CreateRechargeOrderAppeal, params)
}
/**
 * @description: 取消订单
 */
export const cancelRechargeOrder = async (params:any) => {
	return post(api.CancelRechargeOrder, params)
}

/**
 * @description: 获取arpayupi订单
 */
export const getArUpiOnGoingOrder = async (params:any) => {
	return post(api.GetArUpiOnGoingOrder, params)
}

/**
 * @description: 充值上报
 */
export const getArBruiedPage = async (params:any) => {
	return post(api.GetArBruiedPage, params)
}

/**
 * @description: 提交utr
 */
export const arUpiSubmitUtr = async (params:any) => {
	return post(api.ArUpiSubmitUtr, params)
}

/**
 * @description: 
 */
export const arUpiGetBankListToken = async (params:any) => {
	return post(api.ArUpiGetBankListToken, params)
}

/**
 * @description: 获取随机通道
 */
export const GetRechargeChannel = async (params:any) => {
	return post(api.GetRechargeChannel, params)
}
/**
 * @description: 发送 OTP
 * @param params
 */
export const setWithdrawalUPISendOtp= async (params:any) => {
	return post(api.SetWithdrawalUPISendOtp, params)
}

/**
 * @description: 提现发送 OTP
 * @param params
 */
export const setWithdrawalUPISendOtpByBid= async (params:any) => {
	return post(api.SetWithdrawalUPISendOtpByBid, params)
}
/**
 * @description: 提现验证 OTP
 * @param params
 */
export const setWithdrawalUPIVerifyOtp= async (params:any) => {
	return post(api.SetWithdrawalUPIVerifyOtp, params)
}

/**
 * @description: 提现记录发送 OTP
 * @param params
 */
export const setWithdrawalUPISendOtpByWithdrawId= async (params:any) => {
	return post(api.SetWithdrawalUPISendOtpByWithdrawId, params)
}
/**
 * @description: 提现记录验证 OTP
 * @param params
 */
export const setWithdrawalUPIVerifyOtpByWithdrawId= async (params:any) => {
	return post(api.SetWithdrawalUPIVerifyOtpByWithdrawId, params)
}
/**
 * @description: 查询需要otp验证的订单
 * @param params
 */
export const GetListNeedKycConnectWithdrawOrder= async (params:any) => {
	return post(api.GetListNeedKycConnectWithdrawOrder, params)
}
/**
 * @description: 检测upiid是否存在
 * @param params
 */
export const checkUpiIdExists=async (params:any)=>{
	return post(api.CheckUpiIdExists, params)
}
/**
 * @description: 检测upiid是否存在
 * @param params
 */
export const checkUpiIdFastExists=async (params:any)=>{
	return post(api.CheckUpiIdFastExists, params)
}
/**
 * @description: 添加快捷UPI账号接口
 * @param {reqSetWithdrawalUPI} params
 * @return {*}
 */
export const SetWithdrawalFastUPI = async (params: reqSetWithdrawalUPI): Promise<any> => {
	return post(api.SetWithdrawalFastUPI, params)
}