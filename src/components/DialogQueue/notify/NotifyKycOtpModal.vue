<script setup lang="ts">
import { useTimestamp } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { showFailToast } from 'vant'
import { useCode, useFastUpiKycOtp } from '@/hooks'
import { capitalize, currency } from '@/utils'
import type { FastUpiKycOtpExpiredHandler, FastUpiKycOtpTarget, FastUpiOtpSubmit } from '@/hooks/useFastUpiKycOtp.hook'

interface Props {
	target: FastUpiKycOtpTarget
	submit?: FastUpiOtpSubmit
	onExpired?: FastUpiKycOtpExpiredHandler
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'close'): void
	(e: 'confirm'): void
}>()

const { t } = useI18n()
const { verifyKycOtp } = useFastUpiKycOtp()
const code = ref('')
const pin = ref('')
const loading = ref(false)
const expiredHandled = ref(false)
const currentTimestamp = useTimestamp({ interval: 1000 })
const countdownBase = ref({
	localTime: Date.now(),
	serverTime: props.target.serverTime
})
const { getOTPCode, getWithdrawalOTPCode, getWithdrawalUsendOtpByWithdrawId, isCount, seconds } = useCode({ time: 60 })

const isSlice = computed(() => props.target.bankCode === 'slice')
const amountText = computed(() => (props.target.amount ? currency(props.target.amount) : ''))
const showOrderNo = computed(() => props.target.mode !== 'addPayment' && Boolean(props.target.orderNo))
const hasBusinessCountdown = computed(() =>
	props.target.mode !== 'addPayment' && Boolean(props.target.expireTimestamp && props.target.serverTime)
)
const firstTip = computed(() => {
	if (hasBusinessCountdown.value) return t('kycCountdownVerifyTitle')
	return `${props.target.amount !== 0 ? t('paymentTips') : t('currentPaymentTips')}!`
})
const serverNow = computed(() => {
	const baseServerTime = countdownBase.value.serverTime
	if (!baseServerTime) return currentTimestamp.value
	return baseServerTime + currentTimestamp.value - countdownBase.value.localTime
})
const remainingMilliseconds = computed(() => {
	if (!hasBusinessCountdown.value || !props.target.expireTimestamp) return 0
	return Math.max(0, props.target.expireTimestamp - serverNow.value)
})
const countdownText = computed(() => {
	const totalSeconds = Math.ceil(remainingMilliseconds.value / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const resetInput = () => {
	code.value = ''
	pin.value = ''
}

watch(
	() => [props.target.serverTime, props.target.expireTimestamp],
	() => {
		expiredHandled.value = false
		countdownBase.value = {
			localTime: Date.now(),
			serverTime: props.target.serverTime
		}
	},
	{ immediate: true }
)

const onExpired = async () => {
	if (expiredHandled.value) return
	expiredHandled.value = true
	resetInput()
	emit('close')
	await nextTick()
	await props.onExpired?.(props.target)
}

watch(
	remainingMilliseconds,
	(value) => {
		if (!hasBusinessCountdown.value || value > 0) return
		void onExpired()
	},
	{ immediate: true }
)

const onSend = async () => {
	if (props.target.withdrawId) {
		await getWithdrawalUsendOtpByWithdrawId({
			withdrawId: props.target.withdrawId,
			categoryId: 27
		})
		return
	}
	if (props.target.bid) {
		await getWithdrawalOTPCode({
			categoryId: 27,
			bid: props.target.bid
		})
		return
	}
	await getOTPCode({
		categoryId: 27,
		mobileNo: props.target.mobile,
		accountNo: props.target.upi,
		bankCode: props.target.bankCode
	})
}

const onClose = () => {
	resetInput()
	emit('close')
}

const onConfirm = async () => {
	if (loading.value || !code.value) return
	if (isSlice.value && !pin.value) {
		showFailToast(t('enterPin'))
		return
	}
	try {
		loading.value = true
		const submit = props.submit || verifyKycOtp
		const res = await submit(props.target, code.value, pin.value)
		if (!res) return
		resetInput()
		emit('confirm')
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="ntf-kyc-otp">
		<div class="ntf-kyc-otp__header">
			<span class="ntf-kyc-otp__header-line ntf-kyc-otp__header-line--left"></span>
			<h5>{{ t('verifyOpt') }}</h5>
			<span class="ntf-kyc-otp__header-line ntf-kyc-otp__header-line--right"></span>
		</div>

		<div class="ntf-kyc-otp__content">
			<div class="ntf-kyc-otp__hit">
				<p>{{ firstTip }}</p>
				<p v-if="showOrderNo">
					{{ t('orderNo') }}:
					<span class="ntf-kyc-otp__hit-value">{{ target.orderNo }}</span>
				</p>
				<p>
					{{ t('paymentMethod') }}:
					<span class="ntf-kyc-otp__hit-value">{{ capitalize(target.bankCode) }}</span>
				</p>
				<p>
					UPI ID:
					<span class="ntf-kyc-otp__hit-value">{{ target.upi }}</span>
				</p>
				<p v-if="amountText">
					{{ t('withdrawalA') }}:
					<span class="ntf-kyc-otp__hit-value">{{ amountText }}</span>
				</p>
			</div>

			<div v-if="hasBusinessCountdown" class="ntf-kyc-otp__countdown">
				{{ t('notifyCountdown', { time: countdownText }) }}
			</div>

			<div class="ntf-kyc-otp__title">{{ t('phoneN') }}</div>
			<van-field center type="digit" :placeholder="t('phoneN')" :disabled="true" :model-value="target.mobile" />

			<div v-if="isSlice" class="ntf-kyc-otp__title">{{ t('pin') }}</div>
			<van-field
				v-if="isSlice"
				v-model="pin"
				center
				type="digit"
				:maxlength="4"
				:min="0"
				:max="9999"
				:placeholder="t('enterPin')"
			/>

			<div class="ntf-kyc-otp__title">{{ t('VerificationCode') }}</div>
			<van-field v-model="code" center type="digit" :placeholder="t('phEnterVerificationCode')" :maxlength="6">
				<template #button>
					<van-button class="ntf-kyc-otp__code" :disabled="isCount" size="small" type="primary" @click="onSend">
						{{ isCount ? `${seconds}S` : t('send') }}
					</van-button>
				</template>
			</van-field>

			<div class="ntf-kyc-otp__actions">
				<van-button type="primary" :disabled="!code" :loading="loading" @click="onConfirm">{{ t('submit') }}</van-button>
				<van-button @click="onClose">{{ t('cancel') }}</van-button>
			</div>
		</div>

		<div class="ntf-kyc-otp__footer">
			<span @click="onClose">
				<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
					<path
						d="M30 57C44.9117 57 57 44.9117 57 30C57 15.0883 44.9117 3 30 3C15.0883 3 3 15.0883 3 30C3 44.9117 15.0883 57 30 57Z"
						stroke="white"
						stroke-width="4"
						stroke-linejoin="round"
					/>
					<path d="M43 17L17 43" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M17 17L43 43" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.ntf-kyc-otp {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	width: 700px;
	max-width: calc(100vw - 48px);
	background: var(--main-color);
	border-radius: 20px;
	overflow: initial;
	padding-bottom: 20px;

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 32px 0 16px;

		h5 {
			font-family: 'Poppins';
			font-weight: 700;
			font-size: 38px;
			color: #fff;
		}
	}

	&__header-line {
		display: inline-block;
		width: 110px;
		height: 2px;
		border-radius: 20px;
		background: linear-gradient(90deg, var(--main-color) -2.73%, rgba(255, 255, 255, 0) 91.36%);

		&--left {
			transform: matrix(-1, 0, 0, 1, 0, 0);
		}
	}

	&__content {
		width: 660px;
		padding: 20px 25px;
		background: var(--bg_color_L2);
		border-radius: 20px;
	}

	&__hit {
		margin-bottom: 10px;
		border-radius: 12px;
		color: var(--text_color_L1);
		font-size: 26px;
		line-height: 36px;

		p {
			margin: 10px 0;
			&:first-child {
				font-weight: 500;
				font-size: 28px;
				color: var(--text_color_L1);
				padding: 0 10px;
				text-align: center;
			}
		}
	}

	&__hit-value {
		color: var(--norm_red-color);
		font-weight: 600;
	}

	&__title {
		margin-bottom: 20px;
		color: var(--text_color_L1);
		font-size: 28px;
		font-weight: 400;
	}

	&__countdown {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 56px;
		margin-bottom: 24px;
		padding: 8px 24px;
		border-radius: 40px;
		background: var(--main_gradient-color);
		color: #fff;
		font-size: 28px;
		font-weight: 600;
		line-height: 34px;
	}

	&__code {
		width: 190px;
		height: 60px;
		border: none;
		border-radius: 50px;
		background: var(--main_gradient-color);
	}

	&__actions {
		.van-button {
			display: block;
			width: 100%;
			height: 70px;
			border-radius: 50px;

			&:last-child {
				margin-top: 28px;
			}
		}

		.van-button--primary {
			border: none;
			background: var(--main_gradient-color);
		}

		.van-button--default {
			border-color: var(--main-color);
			color: var(--main-color);
			background-color: transparent;
		}
	}

	&__footer {
		position: absolute;
		bottom: -100px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 26px;

		span {
			display: block;
			width: 60px;
			height: 60px;
		}

		svg {
			width: 100%;
			height: 100%;
		}
	}

	:deep(.van-field__button) {
		display: flex;
		align-items: center;
	}
}

:deep(.van-cell) {
	margin-bottom: 20px;
	padding: 8px 10px;
	border-radius: 40px;
	background: var(--bg_color_L1);
}
</style>
