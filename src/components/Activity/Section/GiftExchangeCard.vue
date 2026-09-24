<template>
	<div class="gift-exchange-card">
		<div class="gift-exchange-card__head">
			<span class="gift-exchange-card__title">{{ $t('giftExchange') }}</span>
			<span class="gift-exchange-card__record" @click="$emit('view-record')">{{ $t('giftExchangeViewRecord') }} &gt;</span>
		</div>
		<div class="gift-exchange-card__field">
			<input
				v-model="code"
				type="text"
				inputmode="numeric"
				maxlength="8"
				autocomplete="off"
				:placeholder="$t('giftExchangeCodePlaceholder')"
				@input="hasError = false"
			/>
			<button class="gift-exchange-card__submit" :disabled="submitting" @click="onSubmit">{{ $t('activityTip7') }}</button>
		</div>
		<div v-if="hasError" class="gift-exchange-card__error">
			<svg-icon name="periodCardWarn" />
			<span>{{ errorMsg || $t('giftExchangeCodeError') }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showSuccessToast } from 'vant'
import { ConversionRedpage } from '@/api'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

defineEmits<{
	(e: 'view-record'): void
}>()

const { t } = useI18n()
const code = ref('')
const hasError = ref(false)
/** 兑换失败时展示的提示文案,取自接口返回的 msg(见下方 onSubmit);没有则回退到本地通用文案 */
const errorMsg = ref('')
const submitting = ref(false)

/**
 * 提交兑换码。
 *
 * @remarks 与 src/views/main/RedeemGift/index.vue 共用同一个 ConversionRedpage 接口与假数据；
 * 该接口失败走 code:1（AGENTS.md 规则18 的「无 catch」例外），故直接 await 原始 Promise 即可，
 * 不需要 AwaitApiResult（避免请求拦截器再弹一次通用失败提示，和本卡片内的错误行重复）。
 * 卡片内只展示统一的一行错误提示，不按 msgCode 区分文案（原页面的 dialog 展示留给独立兑换页）。
 */
const onSubmit = async () => {
	if (submitting.value) return
	const value = code.value.trim()
	if (!value) {
		hasError.value = true
		errorMsg.value = ''
		return
	}
	if (!(await requireLoginAction())) return
	submitting.value = true
	try {
		const res: any = await ConversionRedpage({ giftCode: value })
		if (res?.code === 0) {
			showSuccessToast(t('redeemDialogDesc1'))
			code.value = ''
			hasError.value = false
			errorMsg.value = ''
		} else {
			hasError.value = true
			errorMsg.value = res?.msg || ''
		}
	} finally {
		submitting.value = false
	}
}
</script>

<style lang="scss" scoped>
.gift-exchange-card {
	margin: 40px 24px 0;
	padding: 35px 24px 24px;
	background: #FFFFFF;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__title {
		font-size: 30px;
		font-weight: 700;
		color: #1E2637;
	}

	&__record {
		font-size: 26px;
		color: #F95959;
	}

	&__field {
		display: flex;
		align-items: center;
		margin-top: 42px;
		height: 80px;
		background: #F4F4F4;
		border-radius: 12px;

		input {
			flex: 1;
			min-width: 0;
			height: 100%;
			padding: 0 24px;
			background: transparent;
			border: none;
			font-size: 28px;
			color: #1E2637;

			&::placeholder {
				color: #768096;
			}
		}
	}

	&__submit {
		flex-shrink: 0;
		margin-right: 20px;
		min-width: 150px;
		height: 72px;
		padding: 0 24px;
		border: none;
		border-radius: 36px;
		background: linear-gradient(90deg, #FE6868 0%, #FF8A87 100%);
		color: #fff;
		font-size: 26px;

		&:disabled {
			opacity: 0.7;
		}
	}

	&__error {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 20px;
		color: #F95959;
		font-size: 24px;

		svg {
			width: 28px;
			height: 28px;
			flex-shrink: 0;
		}
	}
}
</style>
