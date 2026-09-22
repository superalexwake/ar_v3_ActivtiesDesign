import { computed, onBeforeUnmount, ref } from 'vue'
import { useCountDown } from '@vant/use'
import { AwaitApiResult } from '@/utils'
import {
	GetEmailVerifyCode,
	getSmsVerCode,
	setWithdrawalUPISendOtp,
	setWithdrawalUPISendOtpByBid,
	setWithdrawalUPISendOtpByWithdrawId
} from '@/api'
import { showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { GlobalStore } from '@/stores'

export enum CodeType {
	/**
	 * @name 注册验证
	 */
	Registr = 1,
	/**
	 * @name 忘记密码
	 */
	resetPassword,
	/**
	 * @name 绑定邮箱或手机号
	 */
	bindEmailMmobile,
	/**
	 * @name 手机号或邮箱换绑
	 */
	resetEmailMmobile,

	/**
	 * @name 开启谷歌验证码
	 */
	openGoogle,

	/**
	 * @name 以下为添加体现方式专用
	 */
	addBankCard,
	addUSDT,
	addEWallet,
	addPIX,
	addWave,
	addKBZ,
	addNewUPI=13,
	addNewUPI_N=15,

	/**
	 * @name C2C充值验证
	 */
	c2cRecharge
}

interface CodeOptions {
	time: number
	codeType?: CodeType
}

// 获取验证码 目前只针对体现
export function useCode({ time, codeType }: CodeOptions) {
	const loading = ref<boolean>(false)
	const { t } = useI18n()
	const isCount = ref(false)
	const globalStore = GlobalStore()
	const userInfo = computed(() => globalStore.getUserInfo)
	const { start, pause, reset, current } = useCountDown({
		time: time * 1000,
		onFinish: () => {
			isCount.value = false
		}
	})
	const seconds = computed(() => Math.ceil(current.value.total / 1000));
	// 发送邮箱验证码
	const getEmailCode = async (value?: string) => {
		const email = value || userInfo.value.verifyMethods?.email
		if (!email) return
		const res = await AwaitApiResult(
			GetEmailVerifyCode({
				email,
				emailType: codeType
			})
		)
		if (res) {
			reset()
			start()
			isCount.value = true
			showSuccessToast(t('sendSuccess'))
		}
	}
	// 发送短信验证码
	const getSMSCode = async (mobile?: string) => {
		const phone = mobile || userInfo.value.verifyMethods?.mobile
		if (!phone) return
		const res = await AwaitApiResult(getSmsVerCode({ phone, codeType }))
		if (res) {
			reset()
			start()
			isCount.value = true
			showSuccessToast(t('sendSuccess'))
		}
	}
	// 发送otp验证码
	const getOTPCode = async (data:any) => {
		const res = await AwaitApiResult(setWithdrawalUPISendOtp(data))
		if (res) {
			reset()
			start()
			isCount.value = true
			showSuccessToast(t('sendSuccess'))
		}
	}
	//  提现otp验证
	const getWithdrawalOTPCode = async (data:any) => {
		const res = await AwaitApiResult(setWithdrawalUPISendOtpByBid(data))
		if (res) {
			reset()
			start()
			isCount.value = true
			showSuccessToast(t('sendSuccess'))
		}
	}
    const getWithdrawalUsendOtpByWithdrawId=async (data:any)=>{
		const res = await AwaitApiResult(setWithdrawalUPISendOtpByWithdrawId(data))
		if (res) {
			reset()
			start()
			isCount.value = true
			showSuccessToast(t('sendSuccess'))
		}
	}
	onBeforeUnmount(() => {
		isCount.value = false
		pause()
		reset()
	})

	return {
		loading,
		isCount,
		seconds,
		getSMSCode,
		getEmailCode,
		getOTPCode,
		getWithdrawalOTPCode,
		getWithdrawalUsendOtpByWithdrawId
	}
}
