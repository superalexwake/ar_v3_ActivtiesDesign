<template>
	<div class="register__container" @keydown.enter="handleBtnClick">
		<EmailInput ref="email" :type="type" :email="registerParam.email" @changeN="changeN"></EmailInput>
		<VerifyEmailInput
			v-if="registerData.isOpenRegisterEmail !== '0'"
			v-model:value="registerParam.smsvcode"
			:sendFunc="sendSMS"
			:email="registerParam.email"
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
import { useUserStore, useCommonStore } from '@/stores'
import { AwaitApiResult, getUserAgent } from '@/utils'
import { showFailToast, showSuccessToast } from 'vant'
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import PasswordInput from './PasswordInput.vue'
import VerifyEmailInput from './VerifyEmailInput.vue'
import EmailInput from './EmailInput.vue'
import RegisterCoupon from './RegisterCoupon.vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { validate, validateText } from '@/plugins/validate'
import { useI18n } from 'vue-i18n'
import { captcha, GetEmailVerifyCode } from '@/api'
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
const ispassword = ref(false)
const userStore = useUserStore()
type RegisterData = {
	isRegisterState: string
	registerSMSState: string
	registerStateMsg: string
	/* hasCaptcha: string;*/
	hasRegisterCaptcha: string
	registerEmailState: string
	isOpenRegisterEmail: string
	isInvitecode: string
}

const registerParam = ref<{
	smsvcode: string
	password: string
	rePassword: string
	invitecode: string
	email: string
	registerType: string
	packId?: string
}>({
	smsvcode: '',
	password: '',
	rePassword: '',
	invitecode: '',
	email: '',
	registerType: 'email',
	packId: native.getPackId() || ''
})
const type = ref('register')
if (sessionStorage.getItem('register')) {
	registerParam.value = JSON.parse(sessionStorage.getItem('register') || '')
	sessionStorage.setItem('register', '')
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
watch(
	() => registerParam.value.email,
	(val) => {
		userStore.setCountDown(0) //重置验证码输入框
	},
	{
		flush: 'post'
	}
)

function handleRegister() {
	router.push({ name: 'login' })
}
const sendSMS = async () => {
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
// 去掉邀请码的空格
const onInput = (payload: Event) => {
	const target = payload.target as HTMLInputElement
	console.log('ggg', target.value.replace(/\s/g, ''))
	target.value = target.value.replace(/[\s\n\t\r]/g, '') //去掉所有空格
}

const handleBtnClick = async () => {
	//判断对应的国际区号长度
	//判断是否开放注册
	if (props.registerData.registerEmailState !== '1') {
		return showFailToast({
			message: $t('registerClose'),
			wordBreak: 'break-word'
		})
	}

	//如果开启了验证码就需要校验
	if (props.registerData.isOpenRegisterEmail !== '0') {
		if (!registerParam.value.smsvcode.trim()) {
			return showFailToast({
				message: $t('registerTip6'),
				wordBreak: 'break-word'
			})
		} else if (registerParam.value.smsvcode.trim().length != 6) {
			return showFailToast({
				message: $t('verifyCode6Digits'),
				wordBreak: 'break-word'
			})
		}
	}
	// 邮箱验证
	if (!validate.email1.test(registerParam.value.email)) {
		return showFailToast({
			message: $t(validateText.email),
			wordBreak: 'break-word'
		})
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

const changeN = (value: string) => {
	registerParam.value.email = value
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
		const { smsvcode, password, invitecode, packId } = registerParam.value
		let registerFrom = {
			username: registerParam.value.email,
			smsvcode,
			registerType: registerParam.value.registerType,
			pwd: password,
			invitecode,
			domainurl: process.env.NODE_ENV === 'development' ? 'prototype.invalid' : window.location.hostname,
			phonetype: getUserAgent(),
			captchaId: requestId.value,
			track: data,
			deviceId: localStorage.getItem('arvId') || native.getDeviceId(),
			packId
		}
		userStore
			.register({ ...registerFrom, couponNum: resolveCouponNum() })
			.then(async (res: any) => {
				if (res) {
					setLoading(false)
					const { token, parentUserId } = res?.['data']
					localStorage.setItem('email', registerParam.value.email)
					// 触发提交事件
					emit('submit')
					router.replace('/')
					const userInfo = await userStore.getUserInfo({ signature: token })
					apkParamsUpdate('prediction', 'userId', [parentUserId || ''])
					const { onTriggerRegister } = useTrigger()
					onTriggerRegister(userInfo?.data?.userId)
				}
			})
			.catch((err) => {
				console.log(userStore.countEmailDown)
			})
			.finally(() => {
				setLoading(false)
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
	userStore.setCountEmailDown(0) //界面初始化时清空验证码计时器
	const invitecode = resolveInviteCode()
	if (invitecode) {
		registerParam.value.invitecode = invitecode
		invitationCode.value = true
	}
})
onBeforeRouteLeave((t, f) => {
	if (t.name == 'About-AboutDetail') {
		sessionStorage.setItem('register', JSON.stringify(registerParam.value))
	} else {
		sessionStorage.setItem('register', '')
	}
})

defineExpose({ showPhoneValidate })
</script>

<style lang="scss" scoped>
.register__container {
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
				background-color: var(--bg_color_L2);
				color: var(--text_color_L1);
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
				font-size: 24px;

				span {
					color: var(--norm_red-color);
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
