/*
 * @Author: Jason s1017349071@163.com
 * @Date: 2023-04-08 17:26:11
 * @LastEditors: Jason s1017349071@163.com
 * @LastEditTime: 2023-08-28 11:34:10
 * @FilePath: \ar_v2_vue\src\types\api\interface\store\user.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { ResMessageList } from '@/types/api'

export interface UserState {
	currentView: string
	userForm: UserForm
	numberTypes: string[]
	countDown: number
	countEmailDown: number
	remember: boolean
	messageDetail: ResMessageList
	rPwdForm: {
		number: string
		email: string
		verify: string
		numberType: string
		password: string
		rePassword: string
	}
	ARIP: string
	isShowSMS: boolean
	isRegisterState: boolean
	isAddBankCardSMS: boolean
	isOpenForgetPasswordSMSState: boolean
	isOpenForgetPasswordEmailState: boolean
	isOpenCaptcha: boolean
	isOpenRegisterCaptcha:boolean
	isOpenRegisterEmailState: boolean
	isOpenRegisterSMSState: boolean
	isOpenAddWithdrawEmailState: boolean
	isOpenAddWithdrawSMSState: boolean
	isOpenAddBankCardOpenEmail: boolean
	state:any
	isOpenExternalAccount: boolean,
	isOpenRegisterSMS:boolean
	isOpenRegisterEmail:boolean
}

interface UserForm {
	number: string
	verify: string
	password: string
	rePassword: string
	invitation: string
	packId?: string
	numberType: string
	email: string
	remember: boolean
	termAndPolicy: boolean
	vCode?: string
	logintype: string
	rememberpwd:boolean
}
