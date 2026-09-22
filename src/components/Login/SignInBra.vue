<template>
	<div class="signIn__container">
		<PhoneInput
			v-if="loginType == 'mobile'"
			v-model:show-validate="showPhoneValidate"
			ref="phone"
			:type="type"
			:number-type="userStore.getUserForm.numberType"
			:number="userStore.userForm.number"
			@changeT="changeT"
			@changeN="changeN"
			:title="$t('loginByTel')"
		/>
		<template v-else>
			<EmailInput ref="email" :type="type" :email="userStore.userForm.email" @changeN="changeM"></EmailInput>
<!--			<div class="emailTitle">{{ t('addCardMsg6') }}</div>-->
<!--			<input v-model="userStore.userForm.email" type="text" class="emailInput" :placeholder="t('addCardMsg6')" />-->
		</template>
		<PasswordInput v-model:value="userStore.userForm.password" :label="$t('registerTip2')" />
		<div>
			<van-checkbox v-model="userStore.userForm.rememberpwd" checked-color="#F7D349"
			>{{ $t('rememberPSW') }}</van-checkbox
			>
		</div>
		<div v-if="isShowForgetPwdBtn" class="signIn__container-forgetPSW">
			<span @click="forgetPwd">{{ $t('forgetPSW') }}?</span>
		</div>
		<div class="signIn__container-button">
			<button @click="handleBtnClickS">{{ $t('login') }}</button>
		</div>

		<slide-captcha
			ref="captchaRef"
			refresh-color="#FFFFFF"
			:show-refresh="true"
			:text="t('slideCaptchaText')"
			@finish="handleFinish"
			@refresh="generate"
		/>
		<!--10锁定密码弹窗-->
		<RpwdPopup
			v-if="SMSLock && dialogShow"
			v-model:show="dialogShow"
			:phoneNumber="userStore.getUserForm.number"
			:phoneNumberType="userStore.getUserForm.numberType"
			:passwordErrorMaxNum="passwordErrorMaxNum"
			:email="userStore.getUserForm.email"
			:loginType="loginType"
		/>
		<Dialog v-else v-model:show="dialogShow" :show-cancel-btn="true" :title="$t('idlockTitle')">
			<template #header>
				<img src="@icon/common/warn.png" alt="" />
			</template>
			<template #content>
				<div class="idlockTip">{{ $t('idlockTip1', [passwordErrorMaxNum]) }} <br />{{ $t('idlockTip2') }}</div>
			</template>
			<template #footer>
				<button class="dialogBtn" @click="dialogShow = false">
					{{ $t('cancel') }}
				</button>
				<button class="dialogBtn" @click="gosever">
					{{ $t('contactServicer') }}
				</button>
			</template>
		</Dialog>

		<!-- 验证弹窗 -->
		<VerifyPopup :showPopup="show" @onConfirm="onConfirm" @onBack="back"></VerifyPopup>
	</div>
</template>

<script setup lang="ts">
import VerifyPopup from '@/components/Main/VerifyPopup/index.vue'
import SlideCaptcha from './SlideCaptcha.vue'
import Dialog from '@/components/common/Dialog.vue'
import RpwdPopup from '@/components/Login/RpwdPopup.vue'
import { useUserStore, useCommonStore } from '@/stores'
import { ref, onMounted, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import PasswordInput from './PasswordInput.vue'
import PhoneInput from './PhoneInput.vue'
import { useEventListener } from '@vueuse/core'
import { showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { AllBlur, AwaitApiResult } from '@/utils'
import { captcha } from '@/api'
import { validate, validateText } from '@/plugins/validate'
import { useIsOpen } from '../common/use'
import EmailInput from "@/components/Login/EmailInput.vue";
const props = defineProps({
	loginType: {
		type: String,
		default: ''
	}
})

const router = useRouter()
const { t } = useI18n()
const type = ref('login')
const { setLoading } = useCommonStore()
const userStore = useUserStore()
const dialogShow = ref(false) // 是否展示10次的提示弹窗
const showPhoneValidate = ref(false)
const passwordErrorMaxNum = ref(10)
const phone = ref()
let isClock = false;
// 是否忘记密码的开关
const SMSLock = computed(()=> {
	if(props.loginType == 'mobile') return userStore.isOpenForgetPasswordSMSState;
	if(props.loginType == 'email') return userStore.isOpenForgetPasswordEmailState;
})
const isShowForgetPwdBtn=computed(()=> {
	if(props.loginType == 'mobile') return userStore.isOpenForgetPasswordSMSState;
	if(props.loginType == 'email') return userStore.isOpenForgetPasswordEmailState;
})
async function handleBtnClickS() {
	if(isClock) return;
	isClock = true;
	if (AllBlur()) await new Promise((resolve) => setTimeout(resolve, 1000))
	isClock = false;
	userStore.userForm.logintype = props.loginType;
	if (props.loginType != 'mobile') {
		// 邮箱验证
		if (!validate.email1.test(userStore.userForm.email)) {
			return showFailToast({
				message: t(validateText.email),
				wordBreak: 'break-word'
			})
		}
	}
	if (props.loginType == 'mobile') {
		if (!userStore.userForm.number || userStore.userForm.number.toString().trim() === '') {
			showPhoneValidate.value = true
			return
		}
	}

	if (!userStore.userForm.password || userStore.userForm.password.toString().trim() === '') {
		return showFailToast({
			message: t('registerTip2'),
			wordBreak: 'break-word'
		})
	}

	userStore.userForm.numberType = userStore.getUserForm.numberType.replace('+', '')
	if (userStore.userForm.remember && userStore.userForm.password.toString().trim() !== '') {
		localStorage.setItem('remember', userStore.userForm.password)
	} else {
		localStorage.setItem('remember', '')
	}
	if (userStore.isOpenCaptcha) {
		generate()
	} else {
		setLoading(true)
		console.log('userStore.userForm', userStore.userForm)
		await userStore
			.signIn(userStore.userForm)
			.then((res) => {
				userStore.userForm.vCode = ''
				console.log('res', res)
			})
			.catch((err) => {
				console.log('登陆错误', err)
				if (err.code === 1) {
					passwordErrorMaxNum.value = err.data?.passwordErrorMaxNum || 10
				}
				if (err.msgCode === 33) {
					nextTick(() => (show.value = true))
				} else {
					showtenDialog(err.msgCode || 0)
				}
			})
			.finally(() => {
				captchaRef.value.setShowHiden(false)
				setLoading(false)
			})
	}
}
function forgetPwd() {
	router.push({ name: 'rpwd' })
	userStore.setCurrentView('ResetPassword')
}
const changeT = (value: string) => {
	userStore.getUserForm.numberType = value
}

const changeN = (value: string) => {
	userStore.getUserForm.number = value
}
const changeM = (value: string) => {
	userStore.getUserForm.email = value
}
const captchaRef = ref()
const requestId = ref('')

const gosever = () => {
	dialogShow.value = false
	router.push({ name: 'CustomerService' })
}
useEventListener(window, 'keydown', (event) => {
	if (event.key == 'Enter') {
		handleBtnClickS()
	}
})

onMounted(async () => {
	//如果记住了密码,则获取存储的密码
	const userForm = userStore.getUserForm
	if (localStorage.getItem('remember') != null && localStorage.getItem('remember')?.toString().trim() != '') {
		userForm.password = localStorage.getItem('remember') as string
	} else {
		userForm.password = ''
	}
	userStore.setUserForm({
		...userForm
	})
})
let watch_number = watch(
	() => userStore.userForm.number,
	(val) => {
		userStore.setCountDown(0) //重置验证码输入框
	},
	{
		flush: 'post'
	}
)

const handleFinish = async (data: any) => {
	nextTick(async () => {
		captchaRef.value.startRequestVerify()
		setLoading(true)
		userStore
			.signIn(Object.assign(userStore.userForm, { captchaId: requestId.value, track: data }))
			.then((res) => {
				console.log('res', res)
			})
			.catch((err) => {
				console.log('登陆错误', err)
				showtenDialog(err.msgCode || 0)
			})
			.finally(() => {
				captchaRef.value.setShowHiden(false)
				setLoading(false)
			})
	})
}
const generate = () => {
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
const showtenDialog = (msgCode: number) => {
	if (msgCode != 122) return
	dialogShow.value = true
}
// 离开页面时，取消监听
onBeforeUnmount(() => {
	watch_number()
	if (!userStore.getUserForm.remember) {
		userStore.getUserForm.password = ''
	}
})

// 谷歌验证器逻辑
const show = ref(false)
const onConfirm = (e:string) => {
	userStore.userForm.vCode = e
	handleBtnClickS()
}
const back = () => {
	show.value = false
	userStore.userForm.vCode = ''
}

defineExpose({ showPhoneValidate })
</script>

<style lang="scss" scoped>
.signIn__container {
	&-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-top:30px;

		button {
			width: 100%;
			height: 80px;
			color: #001534;
			font-size: 30px;
			border: none;
			font-weight: 500;
			background-color: #F7D349;
			border-radius: 16px;

			&.disable-btn {
				background: linear-gradient(180deg, #cfd1df 0%, #c8cada 100%);
				box-shadow: 0px 4px 0px #b6bad0;
			}
		}
		.register {
			width: 580px;
			height: 80px;
			color: #ff7172;
			font-size: 36px;
			background: #f7f8ff;
			border-radius: 80px;
			border: 1px solid #ff7172;
			box-shadow: none;
			text-shadow: none;
			margin-top: 40px;
		}
		span {
			margin-top: 140px;
			color: #ff7172;
			font-size: 24px;
		}
	}

	&-forgetPSW {
		color: #F00;
		font-size: 24px;
		text-align: right;
		margin-bottom: 38px;
	}

	.signIn_footer {
		display: flex;
		margin-top: 58px;
		color: #ff7172;
		font-size: 24px;
		justify-content: center;
		//gap: 72px;
		.forgetcon,
		.customcon {
			width: 50%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.forgetbg {
			width: 80px;
			height: 80px;
			background-image: url('@/assets/icons/login/newlogin/forgetpassword.png');
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;
		}
		.custombg {
			width: 80px;
			height: 80px;
			background-image: url('@/assets/icons/login/newlogin/customer.png');
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;
		}
		.font24 {
			font-size: 24px;
			font-weight: 400;
			color: #666;
			text-align: center;
		}
	}

	.idlockTip {
		height: 70px;
		font-size: 24px;
		line-height: 35px;
		text-align: center;
		color: rgba(255, 255, 255, 0.6);
	}

	.dialogBtn {
		width: 200px;
		height: 60px;
		background: #fa2367;
		border-radius: 30px;
		border: 0;
		margin-top: 60px;

		&:first-child {
			background: #646464;
		}
	}
	.emailTitle {
		font-size: 30px;
		color: #fff;
	}
	.emailInput {
		height: 88px;
		width: calc(100% - -2px);
		padding: 25px 35px;
		font-size: 28px;
		border: none;
		color: #ffffff;
		margin: 24px 0;
		border-radius: 12px;
		background: var(--bg_color_L2);
		&::placeholder {
			color:#80849C;
			font-size: 28px;
		}
	}
}
:deep(.dialog__container-img img) {
	width: 88px;
	height: 88px;
}
:deep(.dialog__container-footer) {
	flex-wrap: wrap;
	flex-direction: column-reverse;
	height: fit-content;
}
</style>