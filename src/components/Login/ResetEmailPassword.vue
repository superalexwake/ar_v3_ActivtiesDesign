<template>
	<div class="register__container">
		<EmailInput ref="email" :type="type" :email="rpwd.email" @changeN="changeN"></EmailInput>
		<PasswordInput v-model:value="rpwd.password" :label="$t('newPSWRest')" />
		<div v-show="ispassword" class="register__container-tip">
			<div class="tipbg"></div>
			<span>{{ $t('pswRule') }}</span>
		</div>
		<PasswordInput v-model:value="rpwd.rePassword" :label="$t('newPSWconfirm')" />
		<div v-show="isTips" class="register__container-tips">
			<span>{{ $t('unmatchedInput') }}</span>
		</div>
		<VerifyEmailInput v-model:value="rpwd.smsvcode" :sendFunc="sendSMS" :email="rpwd.email" />
		<div class="register__container-remember">
			<van-checkbox v-model="userStore.userForm.termAndPolicy"
				>{{ $t('readNagree') }} <span @click.stop="goPath()">{{ $t('desPrivacy') }}</span></van-checkbox
			>
		</div>

		<div class="register__container-button">
			<button @click="handleBtnClickR">{{ $t('reset') }}</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ForgetPassword, GetEmailVerifyCode } from '@/api'
import { useUserStore } from '@/stores'
import { AwaitApiResult } from '@/utils'
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import PasswordInput from './PasswordInput.vue'
import EmailInput from './EmailInput.vue'
import VerifyEmailInput from './VerifyEmailInput.vue'
import { showFailToast, showSuccessToast } from 'vant'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'
import { validate, validateText } from '@/plugins/validate'
import { useIsOpen } from '@/components/common/use'
import { CodeType } from '@/hooks'
// 是否开启短信验证码
const { registerState } = useIsOpen()
registerState()
const type = ref('reset')
const { t: $t } = useI18n()
const userStore = useUserStore()
const router = useRouter()
const showPhoneValidate = ref(false)
const isTips = ref(false)
const ispassword = ref(false)
const rpwd = ref({
	numberType: userStore.userForm.numberType,
	number: '',
	email: '',
	password: '',
	rePassword: '',
	smsvcode: ''
})
if (sessionStorage.getItem('rpwd')) {
	rpwd.value = JSON.parse(sessionStorage.getItem('rpwd') || '')
	sessionStorage.setItem('rpwd', '')
}
watch(
	() => userStore.rPwdForm.numberType,
	(val) => {
		!rpwd.value.numberType && (rpwd.value.numberType = val)
	},
	{
		flush: 'post'
	}
)
const sendSMS = async () => {
	if (!validate.email1.test(rpwd.value.email)) {
		userStore.setCountEmailDown(0)
		return showFailToast({
			message: $t(validateText.email),
			wordBreak: 'break-word'
		})
	}
	const res = await AwaitApiResult(
		GetEmailVerifyCode({
			email: rpwd.value.email,
			emailType: CodeType.resetPassword
		})
	)
	if (!res) {
		//当手机号发送验证码失败时，重新启用发送验证码功能
		setTimeout(() => {
			userStore.setCountEmailDown(0)
		}, 500)
	} else {
		showSuccessToast($t('sendSuccess'))
	}
}
async function handleBtnClickR() {
	// 邮箱验证
	if (!validate.email1.test(rpwd.value.email)) {
		return showFailToast({
			message: $t(validateText.email),
			wordBreak: 'break-word'
		})
	}

	//验证码
	if (userStore.isOpenForgetPasswordEmailState) {
		if (!rpwd.value.smsvcode.trim()) {
			return showFailToast({
				message: $t('registerTip6'),
				wordBreak: 'break-word'
			})
		} else if (rpwd.value.smsvcode.trim().length != 6) {
			return showFailToast({
				message: $t('verifyCode6Digits'),
				wordBreak: 'break-word'
			})
		}
	}
	//密码
	if (!rpwd.value.password.trim()) {
		return showFailToast({
			message: $t('registerTip2'),
			wordBreak: 'break-word'
		})
	}
	if (!validate.passReg3.test(rpwd.value.password)) {
		ispassword.value = true
		return
	}

	//确认密码
	if (!rpwd.value.rePassword.trim()) {
		return showFailToast({
			message: $t('registerTip3'),
			wordBreak: 'break-word'
		})
	}

	if (rpwd.value.password !== rpwd.value.rePassword) {
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
	const { email, password, smsvcode } = rpwd.value

	let data = {
		username: email.trim(),
		password,
		type: 'email',
		smsvcode
	}
	const res = await AwaitApiResult(ForgetPassword(data))
	if (res) {
		await userStore.logoutLocal('/login')
		showSuccessToast($t('rpdsucceed'))
	}
}
useEventListener(window, 'keydown', (event) => {
	if (event.key == 'Enter') {
		handleBtnClickR()
	}
})

const goPath = () => {
	router.push({ name: 'About-AboutDetail' })
}

const changeN = (value: string) => {
	rpwd.value.email = value
}
onMounted(() => {
	userStore.setCountEmailDown(0)
})
let watch_email = watch(
	() => rpwd.value.email,
	(val) => {
		userStore.setCountEmailDown(0) //重置验证码输入框
	},
	{
		flush: 'post'
	}
)
// // 离开页面时，取消监听
onBeforeUnmount(() => {
	watch_email()
})
onBeforeRouteLeave((t, f) => {
	if (t.name == 'About-AboutDetail') {
		sessionStorage.setItem('rpwd', JSON.stringify(rpwd.value))
	} else {
		sessionStorage.setItem('rpwd', '')
	}
})
defineExpose({ showPhoneValidate })
</script>

<style lang="scss" scoped>
.register__container {
	&-remember {
		margin-top: 63px;

		:deep(.van-checkbox) {
			display: inline-flex;

			.van-checkbox__label {
				font-size: 24px;
				line-height: 42px;

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

			&.disable-btn {
				background:  var(--button_dis_color);
			}
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
</style>
