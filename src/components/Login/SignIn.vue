<template>
	<div class="signIn__container">
		<PhoneInput v-model:show-validate="showPhoneValidate" ref="phone" :type="type"
			:number-type="userStore.getUserForm.numberType" :number="userStore.userForm.number" @changeT="changeT"
			@changeN="changeN" />
		<PasswordInput v-model:value="userStore.userForm.password" :label="$t('password')" :maxlength="32" />
		<div class="signIn__container-rememberRow">
			<van-checkbox v-model="userStore.userForm.rememberpwd">{{ $t('rememberPSW') }}</van-checkbox>
			<span
				v-if="userStore.isOpenForgetPasswordSMSState || userStore.isOpenForgetPasswordEmailState"
				class="signIn__container-forget"
				@click="forgetPwd"
			>{{ $t('forgetPSW') }}?</span>
		</div>
		<div class="signIn__container-button">
			<button :class="[userStore.userForm.number != '' ? 'active' : '']" @click="handleBtnClickS">{{ $t('login')}}</button>
			<button class="register" @click="handleRegister">{{ $t('register') }}</button>
		</div>

		<slide-captcha ref="captchaRef" refresh-color="#FFFFFF" :show-refresh="true" :text="t('slideCaptchaText')"
			@finish="handleFinish" @refresh="generate" />
		<!--10锁定密码弹窗-->
		<RpwdPopup v-if="userStore.isOpenForgetPasswordSMSState && dialogShow" v-model:show="dialogShow"
			:phoneNumber="userStore.getUserForm.number" :phoneNumberType="userStore.getUserForm.numberType"
			:passwordErrorMaxNum="passwordErrorMaxNum" />
		<Dialog v-else v-model:show="dialogShow" :show-cancel-btn="true" :title="$t('idlockTitle')">
			<template #content>
				<div class="idlockTip">{{ $t('idlockTip1', [passwordErrorMaxNum]) }} <br />{{ $t('idlockTip2') }}</div>
			</template>
			<template #footer>
				<button class="dialogBtn" @click="dialogShow = false">
					{{ $t('cancel') }}
				</button>
				<button class="dialogBtn" @click="gosever">
					<img src="@icon/main/iconservr.png" />
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
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import PasswordInput from './PasswordInput.vue'
import PhoneInput from './PhoneInput.vue'
import { useEventListener } from '@vueuse/core'
import { showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { AllBlur, AwaitApiResult } from '@/utils'
import { captcha } from '@/api'
import { useServer } from '@/hooks/useServe.hook'

// 是否忘记密码的开关
const router = useRouter()

const { t } = useI18n()
const type = ref('login')
const { setLoading } = useCommonStore()
const userStore = useUserStore()
const dialogShow = ref(false) // 是否展示10次的提示弹窗
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
const showPhoneValidate = ref(false)
const passwordErrorMaxNum = ref(10)
const phone = ref()
let isClock = false;

async function handleBtnClickS() {
	if (isClock) return;
	isClock = true;
	if (AllBlur()) await new Promise(resolve => setTimeout(resolve, 1000));
	isClock = false;
	if (!userStore.userForm.number || userStore.userForm.number.toString().trim() === '') {
		showPhoneValidate.value = true
		return
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
	if (userStore.isOpenCaptcha && !googleCharLock.value) {
		generate()
	} else {
		setLoading(true)
		await userStore.signIn(userStore.userForm)
			.then((res) => {
				userStore.userForm.vCode = ''
				console.log('res', res)

			})
			.catch((err) => {
				console.log('登陆错误1', err)
				googleCharLock.value = false;
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
				captchaRef.value?.setShowHiden(false) // 登录成功跳页后组件已卸载, ref 为 null
				setLoading(false)
			})
	}
}
const handleRegister = () => {
	router.push({ name: 'register' })
}
function forgetPwd() {
	router.push({ name: 'rpwd' })
	userStore.setCurrentView('ResetPassword')
}
const changeT = (value: string) => {
	userStore.getUserForm.numberType = value
}
const googleCharLock = ref(false)
const changeN = (value: string) => {
	userStore.getUserForm.number = value
}
const captchaRef = ref()
const requestId = ref('')

const gosever = () => {
	dialogShow.value = false
	getSelfCustomerServiceLink()
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
				if (err.code === 1) {
					passwordErrorMaxNum.value = err.data?.passwordErrorMaxNum || 10
				}
				if (err.msgCode === 33) {
					nextTick(() => (show.value = true))
					googleCharLock.value = true;
				} else {
					showtenDialog(err.msgCode || 0)
				}
			})
			.finally(() => {
				captchaRef.value?.setShowHiden(false) // 登录成功跳页后组件已卸载, ref 为 null
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
const onConfirm = (e: string) => {
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

	&-remember {
		:deep(.van-checkbox) {
			display: inline-flex;

			.van-checkbox__icon {
				width: 42px;
				height: 42px;
				display: flex;
				align-items: center;
			}

			.van-checkbox__label {
				font-size: 24px;
				line-height: 42px
			}

		}


	}
	&-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-top: 57px;

		button {
			width: 580px;
			height: 80px;
			color: var(--text_color_L2);
			font-size: 36px;
			font-weight: 700;
			letter-spacing: 4px;
			border-radius: 80px;
			border: none;
			background:  var(--button_dis_color);
		}
		.active {
			background: var(--main_gradient-color);
			color: var(--text_color_L4)
		}
		.register {
			width: 580px;
			height: 80px;
			color: var(--main-color);
			font-size: 36px;
			background: transparent;
			border-radius: 80px;
			border: 1px solid var(--main-color);
			box-shadow: none;
			text-shadow: none;
			margin-top: 40px;
		}
		span {
			margin-top: 140px;
			color: var(--main-color);
			font-size: 24px;
		}
	}

	&-rememberRow {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&-forget {
		flex-shrink: 0;
		color: var(--main-color);
		font-size: 24px;
		line-height: 42px;
	}

	.idlockTip {
		min-height: 70px;
		font-size: 24px;
		line-height: 35px;
		text-align: center;
		color: var(--text_color_L2);
		margin-bottom: 60px;
		word-wrap: break-word;
		white-space: normal;
	}

	.dialogBtn {
		min-width: 500px;
		height: 80px;
		color: var(--main-color);
		font-size: 32px;
		text-align: center;
		border-radius: 9rem;
		border: 1px solid var(--main-color);
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;

		&>img {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}

		&:last-of-type {
			width: fit-content;
			color: var(--text_color_L4);
			background: var(--main_gradient-color);
		}
	}

	:deep(.dialog__container-footer) {
		flex-wrap: wrap;
		flex-direction: column-reverse;
		height: fit-content;
	}
}
</style>
