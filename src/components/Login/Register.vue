<template>
	<div class="register__container" @keydown.enter="handleBtnClick">
		<PhoneInput
			v-model:show-validate="showPhoneValidate"
			v-model:number="registerParam.number"
			:number-type="registerParam.numberType"
			:type="type"
			@changeT="changeT"
			@changeN="changeN"
			typeP="register"
		/>
		<div class="tip">
			<span v-if="showtips" class="red">{{ $t('regTip1') }}</span>
			<p v-if="showtips" class="red">{{ $t('regTip2') }}</p>
			<!--{{ truncateNumber }} -->
		</div>
		<VerifyInput
			v-if="registerData.isOpenRegisterSMS !== '0'"
			v-model:value="registerParam.smsvcode"
			:sendFunc="sendSMS"
			:number="registerParam.number"
			:numberType="registerParam.numberType"
		/>

		<PasswordInput v-model:value="registerParam.password" :label="$t('setPsw')" />

		<div v-show="ispassword" class="register__container-tip">
			<div class="tipbg"></div>
			<span>{{ $t('pswRule') }}</span>
		</div>
		<PasswordInput v-model:value="registerParam.rePassword" :label="$t('comfirmPsw')" />
		<div v-show="isTips" class="register__container-tips">
			<span>{{ $t('unmatchedInput') }}</span>
		</div>
		<div class="register__container-invitation">
			<div class="register__container-invitation__label">
				<svg-icon name="invitation" />
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

		<RegisterCoupon />

		<div class="register__container-remember">
			<van-checkbox v-model="userStore.userForm.termAndPolicy"
				>{{ $t('readNagree') }} <span @click.stop="goPath()">{{ $t('desPrivacy') }}</span></van-checkbox
			>
		</div>

		<div class="register__container-button">
			<button @click="handleBtnClick">{{ $t('register') }}</button>
			<button class="login" @click="handleRegister">
				<div class="account">{{ $t('iHaveAcount') }}</div>
				<div class="loginin">{{ $t('goLogin') }}</div>
			</button>
		</div>
		<slide-captcha ref="captchaRef" refresh-color="#FFFFFF" :show-refresh="true" @finish="handleFinish" @refresh="generate" />
	</div>
</template>

<script setup lang="ts">
import SlideCaptcha from './SlideCaptcha.vue'
import { useCommonStore, useUserStore } from '@/stores'
import { AwaitApiResult, getUserAgent, maxlength } from '@/utils'
import { showFailToast, showSuccessToast } from 'vant'
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import PasswordInput from './PasswordInput.vue'
import PhoneInput from './PhoneInput.vue'
import VerifyInput from './VerifyInput.vue'
import RegisterCoupon from './RegisterCoupon.vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { validate } from '@/plugins/validate'
import { useI18n } from 'vue-i18n'
import { captcha, getSmsVerCode } from '@/api'
import { SettingStore } from '@/stores'
import { CodeType, useTrigger } from '@/hooks'
import { apkParamsUpdate } from '@/utils/jsBridge'
import { native } from '@/utils/bridges'
import { resolveInviteCode } from '@/utils/inviteCode'
import { resolveCouponNum } from '@/utils/couponNum'

const { t: $t } = useI18n()
const props = withDefaults(
	defineProps<{
		registerData: RegisterData
	}>(),
	{}
)
// 对父组件增加提交事件
const emit = defineEmits<{
	(e: 'submit'): void
}>()
const settingS = SettingStore()
const userStore = useUserStore()
const ispassword = ref(false)
type RegisterData = {
	isRegisterState: string
	registerSMSState: string
	registerStateMsg: string
	/*hasCaptcha: string;*/
	hasRegisterCaptcha: string
	registerMobileState: string
	isOpenRegisterSMS: string
	isInvitecode: string
}

const registerParam = ref<{
	number: string
	numberType: string
	smsvcode: string
	password: string
	rePassword: string
	invitecode: string
	registerType: string
	packId?: string
}>({
	number: '',
	numberType: userStore.rPwdForm.numberType,
	smsvcode: '',
	password: '',
	rePassword: '',
	invitecode: '',
	registerType: 'mobile',
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
	if (props.registerData.isInvitecode == '1') {
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
	() => userStore.rPwdForm.numberType,
	(val) => {
		!registerParam.value.numberType && (registerParam.value.numberType = val)
	},
	{
		flush: 'post'
	}
)
function handleRegister() {
	router.push({ name: 'login' })
}
const sendSMS = async () => {
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
	// 防止重复点击请求方法
	//判断对应的国际区号长度
	if (!maxlength(registerParam.value.numberType, registerParam.value.number.trim().length)) {
		return showFailToast({
			message: $t('wrongTel'),
			wordBreak: 'break-word'
		})
	}
	//phone number validation
	if (
		registerParam.value.number.charAt(0) === '0' &&
		settingS.isOpenRegisterPhoneFirstZeroSwitch
		// !["92",'62'].includes(registerParam.value.numberType)
	) {
		return showFailToast({
			message: $t('registerNumberTip'),
			wordBreak: 'break-word'
		})
	}

	//判断是否开放注册
	if (props.registerData.registerMobileState !== '1') {
		return showFailToast({
			message: $t('registerClose'),
			wordBreak: 'break-word'
		})
	}
	//手机号
	if (!registerParam.value.number.trim() || showPhoneValidate.value) {
		showPhoneValidate.value = true
		return
	}

	//如果开启了验证码就需要校验
	if (props.registerData.isOpenRegisterSMS !== '0') {
		if (!registerParam.value.smsvcode.trim()) {
			return showFailToast({
				message: $t('registerTip1'),
				wordBreak: 'break-word'
			})
		} else if (registerParam.value.smsvcode.trim().length != 6) {
			return showFailToast({
				message: $t('verifyCode6Digits'),
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

	if (props.registerData.hasRegisterCaptcha === '1') {
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
const captchaRef = ref()
const requestId = ref('')
const { setLoading } = useCommonStore()
const handleFinish = async (data: any) => {
	nextTick(async () => {
		setLoading(true)
		captchaRef.value.startRequestVerify()
		const { number, numberType, smsvcode, password, invitecode, packId } = registerParam.value
		let registerFrom = {
			username: numberType.replace('+', '') + number,
			smsvcode,
			registerType: registerParam.value.registerType,
			pwd: password,
			invitecode,
			packId,
			domainurl: process.env.NODE_ENV === 'development' ? 'prototype.invalid' : window.location.hostname,
			phonetype: getUserAgent(),
			captchaId: requestId.value,
			track: data,
			deviceId: localStorage.getItem('arvId') || native.getDeviceId()
		}

		userStore
			.register({ ...registerFrom, couponNum: resolveCouponNum() })
			.then(async (res: any) => {
				if (res) {
					setLoading(false)
					const { token, parentUserId } = res?.['data']
					localStorage.setItem('numberType', numberType.replace('+', ''))
					localStorage.setItem('number', number)
					// 触发提交事件
					emit('submit')
					router.replace('/')
					const userInfo = await userStore.getUserInfo({ signature: token })
					apkParamsUpdate('prediction', 'userId', [parentUserId])
					const { onTriggerRegister } = useTrigger()
					onTriggerRegister(userInfo?.data?.userId)
				}
			})
			.catch((err) => {
				console.log(userStore.countDown)
			})
			.finally(() => {
				setLoading(false)
				captchaRef.value?.setShowHiden(false)
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
	userStore.setCountDown(0) //界面初始化时清空验证码计时器
	const invitecode = resolveInviteCode()
	if (invitecode) {
		registerParam.value.invitecode = invitecode
		invitationCode.value = true
	}
	//  userStore.getIp();
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

	&-invitation {
		padding: 0 2px;

		&__label,
		&__input {
			display: flex;
			align-items: center;
		}

		&__label {
			margin-bottom: 24px;

			color: var(--text_color_L1);
			font-size: 30px;
			svg {
				width: 48px;
				height: 48px;
				color: var(--main-color);
			}
		}

		&__input {
			input {
				width: 99%;
				height: 88px;
				padding: 27px 26px;
				font-size: 28px;
				border: none;
				border-radius: 20px;
				color: var(--text_color_L1);
				background-color: var(--bg_color_L2);
			}
		}
	}

	&-remember {
		margin-top: 63px;
		display: flex;
		align-items: center;

		:deep(.van-checkbox) {
			display: inline-flex;
			.van-checkbox__label {
				color: var(--text_color_L2);
				font-size: 24px;
				span {
					color: var(--textBlueLight, var(--norm_red-color));
					font-size: 24px;
				}
			}
		}
	}

	&-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-block: 63px 100px;

		button {
			width: 580px;
			height: 80px;
			color: var(--text_color_L4);
			font-size: 36px;
			font-weight: 700;
			letter-spacing: 4px;
			border-radius: 80px;
			border: none;
			background: var(--main_gradient-color);
			display: flex;
			align-items: center;
			justify-content: center;

			&.disable-btn {
				background: var(--main_gradient-color);
				box-shadow: var(--BoxShadowColor-3);
			}
		}
		.login {
			border: 1px solid var(--main-color);
			text-shadow: none;
			background: transparent;
			box-shadow: none;
			margin-top: 40px;
		}
		.account {
			font-size: 24px;
			color: var(--text_color_L2);
			font-weight: 400;
		}
		.loginin {
			font-size: 30px;
			color: var(--main-color);
			font-weight: 700;
			margin-left: 17px;
		}
		span {
			margin-top: 24px;
			color: var(--main-color);
			font-size: 24px;
		}
	}

	&-tips {
		margin-top: -20px;
		margin-bottom: 12px;
		padding-left: 17px;
		color: var(--norm_red-color);
		font-size: 24px;
	}
	&-tip {
		margin-top: 24px;
		padding-left: 17px;
		color: var(--norm_red-color);
		font-size: 24px;
		display: flex;
		flex-direction: row;
		.tipbg {
			width: 32px;
			height: 32px;
			background-image: url('@icon/wallet/hint.png');
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}
	}
}

.red {
	color: var(--main-color) !important;
}
</style>
