<template>
	<!-- 规则弹层 begin-->
	<van-popup v-model:show="showPopup" :close-on-click-overlay="false" position="bottom" round>
		<div class="RpwdPopup">
			<div class="RpwdPopup-head">{{ $t('idlockTitle') }}</div>
			<div class="RpwdPopup-topTip">{{ $t('idlockTip1', [passwordErrorMaxNum]) }}<br />{{ $t('idlockTip3') }}</div>
			<VerifyInput
				v-model:value="formData.smsvcode"
				:number="phoneNumber"
				:sendFunc="sendSMS"
				:numberType="phoneNumberType"
				type-p="lock"
			/>
			<PasswordInput v-model:value="formData.password" :label="$t('newPSWRest')" />
			<div v-show="ispassword" class="RpwdPopup-tip">
				<div class="tipbg"></div>
				<span>{{ $t('pswRule') }}</span>
			</div>
			<PasswordInput v-model:value="formData.rePassword" :label="$t('newPSWconfirm')" />
			<div class="RpwdPopup-errorTip">
				<span v-if="isTips">{{ $t('unmatchedInput') }}</span>
			</div>
			<div class="gotuserver van-hairline--surround" @click="goSever">
				<svg-icon name="customer1" />{{ $t('contactServicer') }}
			</div>
			<div class="errorTip">{{ $t('wrongTel') }}<br />{{ $t('rpwdPopupTip') }}</div>
			<div class="RpwdPopup-foot">
				<button class="dialogBtn" @click="rsetPwd">
					{{ $t('confirm') }}
				</button>
				<button class="dialogBtn" @click="emit('update:show', false)">
					{{ $t('cancel') }}
				</button>
			</div>
		</div>
	</van-popup>
</template>
<script setup lang="ts">
import VerifyInput from './VerifyInput.vue'
import PasswordInput from './PasswordInput.vue'
import { computed, ref } from 'vue'
import { AwaitApiResult } from '@/utils'
import { ForgetPassword, getSmsVerCode } from '@/api'
import { showFailToast, showSuccessToast } from 'vant'
import { useUserStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { validate } from '@/plugins/validate'
import { CodeType } from '@/hooks'
import { useServer } from '@/hooks/useServe.hook'
const { t: $t } = useI18n()
const { getSelfCustomerServiceLink } = useServer({ServerType: 2})
const ispassword = ref(false)
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	gamePresentation: {
		// 当前选中游戏
		type: String,
		default: ''
	},
	phoneNumber: {
		type: String,
		default: ''
	},
	phoneNumberType: {
		type: String,
		default: ''
	},
	passwordErrorMaxNum: {
		default: 10
	}
})
const userStore = useUserStore()
const isTips = ref(false)
const formData = ref({
	smsvcode: '',
	password: '',
	rePassword: ''
})
const showPopup = computed({
	get(): boolean {
		return props.show || false
	},
	set(val: boolean) {
		if (!val) {
			emit('update:show', false)
		}
	}
})
const sendSMS = async () => {
	if (!props.phoneNumber) return
	const res = await AwaitApiResult(
		getSmsVerCode({
			phone: props.phoneNumberType + props.phoneNumber,
			codeType: CodeType.resetPassword
		})
	)
	if (!res) {
		//当手机号发送验证码失败时，重新启用发送验证码功能·
		setTimeout(() => {
			userStore.setCountDown(0)
		}, 500)
	} else {
		showSuccessToast($t('sendSuccess'))
	}
}
const rsetPwd = async () => {
	//验证码

	if (!formData.value.smsvcode.trim()) {
		return showFailToast({
			message: $t('registerTip1'),
			wordBreak: 'break-word'
		})
	}
	if (formData.value.smsvcode.trim().length != 6) {
		return showFailToast({
			message: $t('verifyCode6Digits'),
			wordBreak: 'break-word'
		})
	}

	//密码
	if (!formData.value.password.trim()) {
		return showFailToast({
			message: $t('registerTip2'),
			wordBreak: 'break-word'
		})
	}
	if (!validate.passReg3.test(formData.value.password)) {
		ispassword.value = true
		return
	}

	//确认密码
	if (!formData.value.rePassword.trim()) {
		return showFailToast({
			message: $t('registerTip3'),
			wordBreak: 'break-word'
		})
	}

	if (formData.value.password !== formData.value.rePassword) {
		isTips.value = true
		return
	} else {
		isTips.value = false
	}
	const { password, smsvcode } = formData.value

	let data = {
		username: props.phoneNumberType + props.phoneNumber,
		password,
		type: 'mobile',
		smsvcode
	}
	const res = await AwaitApiResult(ForgetPassword(data))
	if (res) {
		showSuccessToast($t('rpdsucceed'))
		await userStore.logoutLocal('/login')
		emit('update:show', false)
	}
}
const goSever = () => {
	getSelfCustomerServiceLink()
}
const emit = defineEmits<{
	(e: 'update:show', val: boolean): void
}>()
</script>
<style lang="scss" scoped>
.RpwdPopup {
	width: 100%;
	height: 100%;
	padding: 34px 40px 44px 40px;
	background-color: var(--bg_color_L2);
	&-head {
		height: 40px;
		line-height: 40px;
		font-weight: 700;
		font-size: 32px;
		color: var(--text_color_L1);
		text-align: center;
	}

	&-topTip {
		min-height: 140px;
		border: 1px solid var(--text_color_L3);
		border-radius: 12px;
		line-height: 36px;
		padding: 34px 0;
		text-align: center;
		margin-top: 12px;
		margin-bottom: 30px;
		word-wrap: break-word;
		white-space: normal;
		color: var(--norm_red-color);
	}

	&-foot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		.dialogBtn {
			width: 580px;
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

			& > img {
				width: 48px;
				height: 48px;
				margin-right: 10px;
			}

			&:first-of-type {
				color: var(--text_color_L4);
				background: var(--main_gradient-color);
			}
		}
	}

	&-errorTip {
		height: 36px;
		line-height: 36px;
		color: var(--norm_red-color);
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
	.gotuserver {
		width: 510px;
		height: 68px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 28px auto 30px;
		color: var(--main-color);
		border: 1px solid var(--main-color);
		border-radius: 40px;
		&:after{
			border: 0;
		}

		svg {
			width: 48px;
			height: 48px;
			margin-right: 4px;
		}
	}

	.errorTip {
		text-align: center;
		line-height: 36px;
		margin-bottom: 30px;
		min-height: 36px;
		width: 100%;
		color: var(--norm_red-color);
		word-wrap: break-word;
		white-space: normal;
	}
	:deep(input) {
		background-color: var(--bg_color_L1);
	}
}
</style>
