<template>
	<div class="register__container" @keydown.enter="handleBtnClick">
		<PhoneInput
			v-if="loginType == 'mobile'"
			v-model:show-validate="showPhoneValidate"
			v-model:number="registerParam.number"
			:number-type="registerParam.numberType"
			:type="type"
			@changeT="changeT"
			@changeN="changeN"
			typeP="register"
		/>
		<span v-if="showtips && loginType == 'mobile'" class="red">{{ $t('regTip1') }}</span>
		<p v-if="showtips && loginType == 'mobile'" class="red">{{ truncateNumber }}</p>
		<template v-if="loginType == 'mobile'">
			<VerifyInput
				v-if="userStore.isOpenRegisterSMS"
				v-model:value="registerParam.smsvcode"
				:sendFunc="sendSMS"
				:number="registerParam.number"
				:numberType="registerParam.numberType"
			/>
		</template>
		<template v-else>
			<div class="emailTitle">{{ $t('addCardMsg6') }}</div>
			<input v-model="registerParam.email" type="text" class="emailInput" :placeholder="$t('addCardMsg6')" />
			<VerifyEmailInput
				v-if="userStore.isOpenRegisterEmail"
				v-model:value="registerParam.smsvcode"
				:sendFunc="sendSMS"
				:email="registerParam.email"
			/>
		</template>
		<div class="register__container-invitation">
			<div class="register__container-invitation__label">
				<span>{{ $t('invitationCode') }}</span>
			</div>
			<div class="register__container-invitation__input">
				<input
					type="text"
					auto-complete="new-password"
					autocomplete="off"
					name="userNumber"
					v-model.trim="registerParam.invitecode"
					:placeholder="setInvitecodeTip"
					:disabled="invitationCode"
					maxlength="20"
					@input="onInput"
				/>
			</div>
		</div>
		<div class="title">{{ $t('loginPSW') }}</div>
		<PasswordInput v-model:value="registerParam.password" :label="$t('setPsw')" />
		<div v-show="ispassword" class="register__container-tips">
			<span>{{ $t('pswRule') }}</span>
		</div>
		<PasswordInput v-model:value="registerParam.rePassword" :label="$t('comfirmPsw')" />
		<div v-show="isTips" class="register__container-tips">
			<span>{{ $t('unmatchedInput') }}</span>
		</div>
		<van-checkbox class="register__container-remember" v-model="userStore.userForm.termAndPolicy" checked-color="#F7D349"
			>{{ $t('readNagree') }} <span @click.stop="goPath()">{{ $t('desPrivacy') }}</span></van-checkbox
		>

		<div class="register__container-button" @click="handleBtnClick">
			{{ $t('register') }}
		</div>
		<div class="register__container-button goLogin" @click="goLogin">
			{{ $t('haveAcountAleady') + $t('loginNow') }}
		</div>
		<slide-captcha ref="captchaRef" refresh-color="#FFFFFF" :show-refresh="true" @finish="handleFinish" @refresh="generate" />
	</div>
</template>

<script setup lang="ts">
import SlideCaptcha from './SlideCaptcha.vue'
import VerifyEmailInput from './VerifyEmailInput.vue'
import { useUserStore } from '@/stores'
import { AwaitApiResult, getUserAgent, maxlength } from '@/utils'
import { showFailToast, showSuccessToast } from 'vant'
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import PasswordInput from './PasswordInput.vue'
import PhoneInput from './PhoneInput.vue'
import VerifyInput from './VerifyInput.vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { validate, validateText } from '@/plugins/validate'
import { useI18n } from 'vue-i18n'
import { GetEmailVerifyCode, captcha, getSmsVerCode } from '@/api'
import { SettingStore } from '@/stores'
import { CodeType } from '@/hooks'
import { native } from '@/utils/bridges'
import { resolveInviteCode } from '@/utils/inviteCode'
import { resolveCouponNum } from '@/utils/couponNum'
const { t: $t } = useI18n()
const props = defineProps({
	loginType: {
		type: String,
		default: ''
	},
	registerData: {
		type: Object
	}
})
const settingS = SettingStore()
const dollarSign = computed(() => settingS.getDollarSign)
const userStore = useUserStore()
const ispassword = ref(false)
const registerParam = ref<{
	number: string
	numberType: string
	smsvcode: string
	password: string
	rePassword: string
	invitecode: string
	registerType: string
	email: string
	packId?: string
}>({
	number: '',
	numberType: '',
	smsvcode: '',
	password: '',
	rePassword: '',
	invitecode: '',
	registerType: 'mobile',
	email: '',
	packId: native.getPackId() || ''
})
const type = ref('register')
registerParam.value.number = ''
if (sessionStorage.getItem('register_a')) {
	registerParam.value = JSON.parse(sessionStorage.getItem('register_a') || '')
	sessionStorage.setItem('register_a', '')
}
const router = useRouter()
const showPhoneValidate = ref(false)
const isTips = ref(false)
const invitationCode = ref(Boolean(resolveInviteCode()))
const setInvitecodeTip = computed(() => {
	const registerData = props.registerData || {}
	if (registerData.isInvitecode == '1') {
		return $t('plsEnterInvitationCode')
	} else {
		return $t('notNecessary')
	}
})
const showtips = settingS.isOpenRegisterPhoneFirstZeroSwitch //注册提示

watch(
	() => registerParam.value.number,
	(val) => {
		userStore.setCountDown(0) //重置验证码输入框
	},
	{
		flush: 'post'
	}
)
watch(
	() => userStore.userForm.numberType,
	(val) => {
		!registerParam.value.numberType && (registerParam.value.numberType = val)
	},
	{
		flush: 'post'
	}
)
const sendSMS = async () => {
	if (props.loginType == 'email') {
		sendEmailSMS()
		return
	}
	if (!maxlength(registerParam.value.numberType, registerParam.value.number.trim().length)) {
		userStore.setCountDown(0)
		return showFailToast({
			message: $t('wrongTel'),
			wordBreak: 'break-word'
		})
	}
	// if (registerParam.value.number.trim().length == 0) return
	const res = await AwaitApiResult(
		getSmsVerCode({
			phone: registerParam.value.numberType.replace('+', '') + registerParam.value.number,
			codeType: CodeType.Registr
		})
	)
	if (!res) {
		//当手机号发送验证码失败时，重新启用发送验证码功能
		setTimeout(() => {
			userStore.setCountDown(0)
		}, 500)
	} else {
		showSuccessToast($t('sendSuccess'))
	}
}

const sendEmailSMS = async () => {
	if (!validate.email1.test(registerParam.value.email)) {
		userStore.setCountEmailDown(0)
		return showFailToast({
			message: $t(validateText.email),
			wordBreak: 'break-word'
		})
	}
	const res = await AwaitApiResult(
		GetEmailVerifyCode({
			email: registerParam.value.email,
			emailType: CodeType.Registr
		})
	)
	if (!res) {
		userStore.setCountEmailDown(0)
	} else {
		showSuccessToast($t('sendSuccess'))
	}
}
const truncateNumber = computed(() => {
	let digits = $t('regTip2').match(/\d+/) // 提取字符串中的数字部分
	if ('+' + registerParam.value.numberType) {
	}
	const dictionary = settingS.getAreaPhoneLenList.find((item: any) => item?.area == '+' + registerParam.value.numberType)?.len
	let length = 9
	//长度有区间
	if (dictionary?.indexOf('-') != -1) {
		length = dictionary?.toString().split('-')[0]
	} else {
		length = dictionary
	}
	if (digits) {
		return digits[0].substr(0, length) // 使用substr截取指定长度的数字字符串
	} else {
		return ''
	}
})
// 去掉邀请码的空格
const onInput = (payload: Event) => {
	const target = payload.target as HTMLInputElement
	target.value = target.value.replace(/[\s\n\t\r]/g, '') //去掉所有空格
}

const handleBtnClick = async () => {
	console.log(props.loginType)
	// 防止重复点击请求方法
	//判断对应的国际区号长度
	if (props.loginType == 'mobile' && !maxlength(registerParam.value.numberType, registerParam.value.number.trim().length)) {
		return showFailToast({
			message: $t('wrongTel'),
			wordBreak: 'break-word'
		})
	} else if (props.loginType == 'email' && !validate.email1.test(registerParam.value.email)) {
		return showFailToast({
			message: $t(validateText.email),
			wordBreak: 'break-word'
		})
	}
	// if (props.loginType == 'mobile'&&registerParam.value.number.charAt(0) === '0' && registerParam.value.numberType =='62') {
	if (
		props.loginType == 'mobile' &&
		registerParam.value.number.charAt(0) === '0' &&
		settingS.isOpenRegisterPhoneFirstZeroSwitch
	) {
		return showFailToast({
			message: $t('registerNumberTip'),
			wordBreak: 'break-word'
		})
	}
	//判断是否开放注册
	// if (loginStore.value.registerMobileState) {
	// 	return showFailToast({
	// 		message: $t('registerClose'),
	// 		wordBreak: 'break-word'
	// 	})
	// }
	//手机号
	if (props.loginType == 'mobile' && (!registerParam.value.number.trim() || showPhoneValidate.value)) {
		showPhoneValidate.value = true
		return
	}

	//如果开启了验证码就需要校验
	if (
		(userStore.isOpenRegisterSMS && props.loginType == 'mobile') ||
		(userStore.isOpenRegisterEmail && props.loginType !== 'mobile')
	) {
		if (!registerParam.value.smsvcode.trim()) {
			return showFailToast({
				message: props.loginType == 'mobile' ? $t('registerTip1') : $t('registerTip6'),
				wordBreak: 'break-word'
			})
		} else if (registerParam.value.smsvcode.trim().length != 6) {
			return showFailToast({
				message: $t('verifyCodeDigits'),
				wordBreak: 'break-word'
			})
		}
	}

	//密码
	if (!registerParam.value.password.trim()) {
		return showFailToast({
			message: $t('registerTip2'),
			wordBreak: 'break-word'
		})
	}

	if (!validate.passReg3.test(registerParam.value.password)) {
		ispassword.value = true
		return
	}

	//确认密码
	if (!registerParam.value.rePassword.trim()) {
		return showFailToast({
			message: $t('registerTip3'),
			wordBreak: 'break-word'
		})
	}

	if (registerParam.value.rePassword !== registerParam.value.password) {
		isTips.value = true
		return
	} else {
		isTips.value = false
	}

	if (!userStore.userForm.termAndPolicy) {
		return showFailToast({
			message: $t('registerDesc1'),
			wordBreak: 'break-word'
		})
	}

	if (userStore.isOpenRegisterCaptcha) {
		generate()
	} else {
		handleFinish('')
	}
}

const changeT = (value: string) => {
	registerParam.value.numberType = value
}

const changeN = (value: string) => {
	registerParam.value.number = value
}

const goPath = () => {
	useStorage('toPath', 'ResetPassword')
	router.push({ name: 'About-AboutDetail' })
}
const goLogin = () => {
	router.push({ name: 'login' })
}
const captchaRef = ref()
const requestId = ref('')
const handleFinish = async (data: any) => {
	nextTick(async () => {
		captchaRef.value.startRequestVerify()
		const { number, numberType, smsvcode, password, invitecode, email, packId } = registerParam.value
		let registerFrom = {
			username: props.loginType == 'mobile' ? numberType.replace('+', '') + number : email,
			smsvcode,
			registerType: props.loginType,
			pwd: password,
			invitecode,
			packId,
			domainurl: process.env.NODE_ENV === 'development' ? 'prototype.invalid' : window.location.hostname,
			phonetype: getUserAgent(),
			regtype: dollarSign.value == '$' || dollarSign.value == '₽' ? 1 : '',
			captchaId: requestId.value,
			track: data,
			deviceId: localStorage.getItem('arvId') || native.getDeviceId()
		}
		userStore
			.register({ ...registerFrom, couponNum: resolveCouponNum() })
			.then(async (res: any) => {
				if (res) {
					const { token } = res?.['data']
					if (props.loginType == 'mobile') {
						localStorage.setItem('numberType', numberType.replace('+', ''))
						localStorage.setItem('number', number)
					} else {
						localStorage.setItem('email', email)
					}
					router.replace('/')
					await userStore.getUserInfo({ signature: token })
				}
			})
			.catch((err) => {
				console.log(userStore.countDown)
			})
			.finally(() => {
				captchaRef.value.setShowHiden(false)
			})
	})
}
const generate = async () => {
	nextTick(async () => {
		captchaRef.value.startRequestGenerate()
		const res = await AwaitApiResult(captcha())
		if (res) {
			requestId.value = res.data.captchaId
			captchaRef.value.endRequestGenerate(res.data.backgroundImage, res.data.sliderImage)
		} else {
			captchaRef.value.endRequestGenerate(null, null)
		}
	})
}
onMounted(async () => {
	!registerParam.value.numberType && (registerParam.value.numberType = userStore.userForm.numberType)
	userStore.setCountDown(0) //界面初始化时清空验证码计时器
	userStore.setCountEmailDown(0) //界面初始化时清空验证码计时器
	const invitecode = resolveInviteCode()
	if (invitecode) {
		registerParam.value.invitecode = invitecode
		invitationCode.value = true
	}
	//userStore.getIp()
})
onBeforeRouteLeave((t, f) => {
	if (t.name == 'About-AboutDetail') {
		sessionStorage.setItem('register_a', JSON.stringify(registerParam.value))
	} else {
		sessionStorage.setItem('register_a', '')
	}
})

defineExpose({ showPhoneValidate })
</script>

<style lang="scss" scoped>
.register__container {
	.tip {
		margin-top: -50px;
		margin-bottom: 10px;
	}
	.pwdTip {
		margin-bottom: 20px;
		white-space: initial;
	}
	&-tip {
		color: #fa2367;
	}
	&-invitation {
		padding: 0 2px;

		&__label,
		&__input {
			display: flex;
			align-items: center;
		}

		&__label {
			margin-bottom: 24px;
			color: #fff;
			font-size: 30px;

			&-icon {
				width: 48px;
				height: 48px;
				margin-right: 12px;
			}
		}

		&__input {
			input {
				width: 100%;
				height: 88px;
				padding: 27px 26px;
				font-size: 28px;
				border: none;
				border-radius: 12px;
				background: var(--bg_color_L2);
				color: var(--text_color_L1);
				&::placeholder {
					color: var(--text_color_L3);
				}
			}
		}
	}

	&-remember {
		margin-top: 16px;
		display: flex;
		align-items: center;
		color: #fff;
		font-size: 24px;
		position: relative;
		&.active {
			&::before {
				height: 16px;
				width: 16px;
				background-color: #001534;
				border: 6px solid #f7d349;
			}
		}
		.login {
			border: 1px solid #ff7172;
			text-shadow: none;
			background: #ffffff;
			box-shadow: none;
			margin-top: 40px;
		}
		.account {
			font-size: 24px;
			color: #666;
			font-weight: 400;
		}
		.loginin {
			font-size: 30px;
			color: #f00;
			font-weight: 700;
			margin-left: 17px;
		}
		span {
			color: #f00;
			font-size: 24px;
		}
	}

	&-button {
		width: 100%;
		height: 88px;
		line-height: 88px;
		background-color: #f7d349;
		color: #001534;
		font-size: 30px;
		text-align: center;
		margin-top: 68px;
		&.goLogin {
			border: 1px solid #f7d349;
			background-color: #081c37;
			color: #f7d349;
			margin-top: 18px;
		}
	}

	&-back {
		width: 100%;
		height: 88px;
		line-height: 88px;
		color: #fff;
		border-radius: 4px;
		border: 1px solid rgba(250, 35, 103, 1);
		font-size: 30px;
		text-align: center;
		margin-top: 18px;
	}

	&-tips {
		margin-bottom: 12px;
		padding-left: 17px;
		color: #ee3625;
		font-size: 24px;
		white-space: normal;
	}

	.title {
		margin: 30px 0 24px 0;
		font-weight: bold;
		color: #ffffff;
		font-size: 30px;
	}

	.emailTitle {
		font-size: 30px;
		color: #fff;
	}
	.emailInput {
		height: 88px;
		width: calc(100% - -2px);
		padding: 25px 30px;
		font-size: 28px;
		border: none;
		background: var(--bg_color_L2);
		color: var(--text_color_L1);
		margin: 24px 0;
		border-radius: 12px;
		&::placeholder {
			color: var(--text_color_L3);
			font-size: 28px;
		}
	}
	.phoneInput__container {
		margin-bottom: 30px;
	}
	:deep() {
		.phoneInput__container-label svg {
			display: none;
		}
	}
	:deep() {
		.verifyInput__container-label,
		.passwordInput__container-label {
			display: none;
		}
	}
}

.red {
	color: #f00 !important;
}
</style>
