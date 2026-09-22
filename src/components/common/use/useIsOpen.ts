/*
 * @Author: Jason s1017349071@163.com
 * @Date: 2023-04-24 11:45:11
 * @LastEditors: xiaogui ni
 * @LastEditTime: 2023-08-28 11:23:49
 * @FilePath: \ar_v2_vue\src\components\common\use\useIsOpen.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GetPointMallState, RegisterState } from '@/api'
import type { ResRegisterState } from '@/types/api'
import { AwaitApiResult } from '@/utils'
import { ref } from 'vue'

// 查询是否开启积分商城
const isShowPointMall = ref(false)
export function useIsOpen() {
	// 是否开启短信验证码
	const isShowSMS = ref(false)
	// 是否开启注册
	const isRegisterState = ref(false)
	// 提现银行卡开关
	const isOpenAddWithdrawSMSState = ref(false)
	// 提现邮箱开关
	const isOpenAddWithdrawEmailState = ref(false)
	// 忘记密码SMS开关
	const isSmSForgetPasswordSMSState = ref(false)
	// 忘记密码EMAIL开关
	const IsOpenForgetPasswordEmailState = ref(false)
	// 开启登陆的滑块验证
	const hasOpenCaptcha = ref(false)
	//开启注册的滑块验证
	const hasOpenRegisterCaptcha = ref(false)
	// 是否开启谷歌验证码
	const isGoogleVerifySms = ref(false)
	// 是否开启谷歌邮箱验证
	const isGoogleVerifyEmail = ref(false)
	// 是否开启邮箱注册
	const isregisterEmailState = ref(false)
	// 是否开启手机注册
	const isregisterMobileState = ref(false)
	// 是否开启其他登陆
	const isOpenExternalAccountState = ref(false)
	// 是否开启邀请码必填开关
	const isInvitecodeState = ref(false)
	async function registerState() {
		const res: ObjResNull<ResRegisterState> = await AwaitApiResult(RegisterState())
		if (res) {
			const {
				registerSMSState,
				registerState,
				IsOpenForgetPasswordSMS,
				IsOpenForgetPasswordEmail,
				isOpenCaptcha = '0',
				isOpenRegisterCaptcha = '0',
				isOpenGoogleVerifySms,
				isOpenGoogleVerifyEmail,
				registerEmailState,
				registerMobileState,
				isOpenAddWithdrawSMS,
				isOpenAddWithdrawEmail,
				isOpenExternalAccount,
				isInvitecode
			} = res.data
			// 重置手机号和短信注册是同一个开关
			isShowSMS.value = Number(registerSMSState) !== 0
			isRegisterState.value = Number(registerState) !== 0
			isSmSForgetPasswordSMSState.value = Boolean(IsOpenForgetPasswordSMS === '1')
			IsOpenForgetPasswordEmailState.value = Boolean(IsOpenForgetPasswordEmail === '1')
			isGoogleVerifySms.value = Number(isOpenGoogleVerifySms) !== 0
			isGoogleVerifyEmail.value = Number(isOpenGoogleVerifyEmail) !== 0
			isregisterEmailState.value = Boolean(registerEmailState === '1')
			isregisterMobileState.value = Boolean(registerMobileState === '1')
			isOpenAddWithdrawSMSState.value = Number(isOpenAddWithdrawSMS) !== 0
			isOpenAddWithdrawEmailState.value = Number(isOpenAddWithdrawEmail) !== 0
			hasOpenCaptcha.value = Boolean(isOpenCaptcha === '1')
			hasOpenRegisterCaptcha.value = Boolean(isOpenRegisterCaptcha === '1')
			isOpenExternalAccountState.value = Boolean(isOpenExternalAccount === '1')
			isInvitecodeState.value = Boolean(isInvitecode === '1')
		}
	}
	async function getPointMallState() {
		const res = await AwaitApiResult(GetPointMallState())
		if (res) {
			isShowPointMall.value = res.data.state == 1
		}
	}

	return {
		registerState,
		isShowSMS,
		isRegisterState,
		isOpenAddWithdrawSMSState,
		isOpenAddWithdrawEmailState,
		isSmSForgetPasswordSMSState,
		IsOpenForgetPasswordEmailState,
		getPointMallState,
		isShowPointMall,
		hasOpenCaptcha,
		hasOpenRegisterCaptcha,
		isGoogleVerifySms,
		isGoogleVerifyEmail,
		isregisterEmailState,
		isregisterMobileState,
		isOpenExternalAccountState,
		isInvitecodeState
	}
}
