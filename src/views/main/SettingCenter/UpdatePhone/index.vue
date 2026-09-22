<template>
	<div class="updateP-container">
		<NavBar :title="title"  class="white" left-arrow @click-left="clickLeft" />
		<div v-show="showPhone">
			<PhoneInput
				v-model:show-validate="showPhoneValidate"
				:typeP="typeP"
				:number="param.PhoneNumber"
				:number-type="param.numberType"
				@changeT="changeT"
				@changeN="changeN"
			/>
		</div>
		<VerifyInput
			v-model:value="smsvCode"
			:typeP="typeP"
			:isShowVerifyT="isShowVerifyT"
			:sendFunc="sendSMS"
			:number="param.PhoneNumber"
			:numberType="param.numberType"
			v-if="isShowSMS"
		/>
		<div v-show="isShowVerify" class="updateP-container-tips">
			<span>{{ $t('tipVerifyCodeRequired') }}</span>
		</div>
		<div class="updateP-container-button">
			<button @click="onNext" v-show="showNextB">{{ $t('nextStep') }}</button>
			<button @click="onSave" v-show="showSaveB">{{ $t('complete') }}</button>
		</div>
		<Dialog
			v-model:show="DialogShow"
			@confirm="onLaundy"
			:show-cancel-btn="false"
			confirmText="confirm"
			:picname="succeedIcon"
			:title="$t('bindsuccess')"
		>
			<template #content>
				<div v-if="userInfo?.bindReward > 0" class="Laundry-Con">
					<div class="Laundry-Con_tip">
						<div class="reward">{{ $t('award') }}</div>
						<div class="money">{{ currency(userInfo?.bindReward) }}</div>
					</div>
				</div>
			</template>
		</Dialog>
	</div>
</template>
<!--修改手机号逻辑---判断是否有手机号---手机号获取验证码---提交修改手机号
绑定手机号逻辑---判断时候有手机号---输入手机号，获取验证码---绑定手机号-->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { GlobalStore, useUserStore } from '@/stores'
import VerifyInput from '@/components/Login/VerifyInput.vue'
import PhoneInput from '@/components/Login/PhoneInput.vue'
import { AwaitApiResult, currency, maxlength } from '@/utils'
import succeedIcon from '@icon/public/succeed.png'
import { ref, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSmsVerCode, verifyPhoneCode, bindPhone } from '@/api'
import { showFailToast, showSuccessToast } from 'vant'
import { useIsOpen } from '@/components/common/use'
import Dialog from '@/components/common/HomeDialog.vue'
import type { UserInfo } from '@/types/api'
import { CodeType } from '@/hooks'
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const globalStore = GlobalStore()
const userInfo = globalStore.getUserInfo as UserInfo
const showPhone = ref(false)
showPhone.value = userInfo?.verifyMethods?.mobile == ''
const DialogShow = ref(false)
const showNextB = ref(false)
showNextB.value = userInfo?.verifyMethods?.mobile != ''
const showSaveB = ref(false)
showSaveB.value = userInfo?.verifyMethods?.mobile == ''
const isShowVerifyT = ref(true)
const isShowVerify = ref(false)
const smsvCode = ref('')
const showPhoneValidate = ref(false)
const title = ref('')
title.value = userInfo?.verifyMethods?.mobile != '' ? t('safetyVerification') : t('bindPhone')
const typeP = ref('')
typeP.value = userInfo?.verifyMethods?.mobile != '' ? 'updatePhone' : 'bindPhone'
const picname = ref('succeed')
const clickLeft = () => {
	router.go(-1)
}

// 是否开启短信验证码
const { isShowSMS, registerState } = useIsOpen()
registerState()

//输入验证码后点击下一步
async function onNext() {
	// 验证码验证
	if (!smsvCode.value.trim()) {
		return showFailToast({
			message: t('noVerifyCodeFound'),
			wordBreak: 'break-word'
		})
	}

	const res = await AwaitApiResult(
		verifyPhoneCode({
			userName:
				userInfo?.verifyMethods?.mobile ||
				(localStorage.getItem('numberType') as string) + localStorage.getItem('number'),
			smsvCode: smsvCode.value
		})
	)
	if (res) {
		title.value = t('bindPhone') //切换页面标题
		typeP.value = 'bindPhone'
		showNextB.value = false //隐藏下一步按钮
		isShowVerify.value = false //隐藏没有输入验证码的提示文本

		showPhone.value = true //显示手机号码输入框
		isShowVerifyT.value = false //隐藏验证码上方的标题
		showSaveB.value = true //显示保存按钮

		//userStore.userForm.verify = ''
		smsvCode.value = '' //第一步完成后清空验证码输入框
		param.PhoneNumber = ''
		userStore.setCountDown(0) //清空计时器
	}
	isShowVerify.value = false
}

const param = reactive({
	PhoneNumber: '',
	numberType: localStorage.getItem('numberType') as string
})
//保存
async function onSave() {
	// 验证码验证
	if (!smsvCode.value.trim()) {
		return showFailToast({
			message: t('noVerifyCodeFound'),
			wordBreak: 'break-word'
		})
	}
	if (!maxlength(param.numberType, param.PhoneNumber.trim().length)) {
		return showFailToast({
			message: t('wrongTel'),
			wordBreak: 'break-word'
		})
	}
	const res = await AwaitApiResult(bindPhone({ phone: param.numberType + param.PhoneNumber, smsvCode: smsvCode.value }))
	if (res) {
		if (userInfo?.verifyMethods?.mobile != '') {
			showSuccessToast(t('rpdsucceed'))
			router.push({ name: 'main' })
		} else {
			DialogShow.value = true
		}
	}
}

const changeT = (value: string) => {
	param.numberType = value
}

const changeN = (value: string) => {
	param.PhoneNumber = value
}

//发验证码
const sendSMS = async () => {
	// //第一次取登录时存的手机号，第二次取输入的手机号
	let phone = !showPhone.value ? userInfo?.verifyMethods?.mobile : param.numberType.replace('+', '') + param.PhoneNumber
	const numLength = phone.length
	if (numLength < 10 || numLength > 14) {
		return showFailToast({
			message: t('wrongTel'),
			wordBreak: 'break-word'
		})
		userStore.setCountDown(0)
	}
	const res = await AwaitApiResult(
		getSmsVerCode({
			phone: phone,
			codeType: showPhone.value ? CodeType.bindEmailMmobile : CodeType.resetEmailMmobile //getArrayKey(rootConfig.smsCodes, 'sms_verifycode')
		})
	)

	if (res) {
		showSuccessToast(t('sendSuccess'))
	} else {
		return -1
	}
}
const onLaundy = () => {
	router.push({ name: 'main' })
	DialogShow.value = false
}
onMounted(() => {
	userStore.setCountDown(0) //界面初始化时清空验证码计时器
})
</script>

<style lang="scss" scoped>
.updateP-container {
	height: 100%;
	padding-inline: 40px;
	overflow-y: scroll;
	white-space: nowrap;
	-webkit-overflow-scrolling: touch;

	position: relative;
	margin-top: 100px;
	overflow: hidden;

	&-label {
		img {
			width: 27px;
			height: 27px;
			margin-right: 6px;
		}
	}

	&-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-top: 133px;

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
		}
	}

	&-tips {
		margin-top: 24px;
		padding-left: 17px;
		color: var(--main-color);
		font-size: 24px;
	}
}
.Laundry-Con_tip {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	.reward {
		color: var(--text_color_L2);
		font-size: 30px;
	}
	.money {
		color: var(--main-color);
		font-size: 30px;
	}
}
</style>
