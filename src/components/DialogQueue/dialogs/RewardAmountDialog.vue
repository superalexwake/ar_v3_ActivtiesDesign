<template>
	<div class="reward-amount-dialog">
		<img class="reward-amount-dialog__media" src="@icon/public/succeed.png" alt="" />
		<p v-if="captionKey" class="reward-amount-dialog__caption">{{ $t(captionKey) }}</p>
		<div class="reward-amount-dialog__title">{{ $t(titleKey) }}</div>
		<p v-if="descriptionKey" class="reward-amount-dialog__description">
			{{ $t(descriptionKey, descriptionArgs || []) }}
		</p>
		<div class="reward-amount-dialog__amount">
			<span v-if="amountLabelKey" class="reward-amount-dialog__amount-label">{{ $t(amountLabelKey) }}</span>
			<span>{{ currency(amount) }}</span>
		</div>
		<button
			type="button"
			class="reward-amount-dialog__button"
			:disabled="loading"
			@click="confirm"
		>
			{{ $t(confirmKey) }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { getReceiveDownAppReward, getReceiveReturnAwards, getRegisterGift } from '@/api'
import { AwaitApiResult, currency } from '@/utils'

// 导出给 producers.ts 共享，避免类型双份维护
export type RewardAction = 'none' | 'returnAwards' | 'registerGift' | 'appDownload'

export interface RewardAmountDialogProps {
	titleKey: string
	amount: number
	captionKey?: string
	descriptionKey?: string
	descriptionArgs?: Array<string | number>
	amountLabelKey?: string
	confirmKey?: string
	action?: RewardAction
}

const props = withDefaults(defineProps<RewardAmountDialogProps>(), {
	confirmKey: 'receive',
	action: 'none',
})
const emit = defineEmits<{
	(e: 'confirm'): void
}>()
const { t } = useI18n()
const loading = ref(false)

const actionMap = {
	returnAwards: getReceiveReturnAwards,
	registerGift: getRegisterGift,
	appDownload: getReceiveDownAppReward,
}

async function confirm() {
	if (loading.value) return
	if (props.action === 'none') {
		emit('confirm')
		return
	}

	const action = actionMap[props.action]
	if (!action) {
		emit('confirm')
		return
	}

	loading.value = true
	const res = await AwaitApiResult(action())
	loading.value = false
	if (!res) return

	showSuccessToast(t('receiveSuccess'))
	emit('confirm')
}
</script>

<style scoped lang="scss">
.reward-amount-dialog {
	width: min(620px, calc(100vw - 48px));
	border-radius: 20px;
	background: var(--bg_color_L2);
	color: var(--text_color_L1);
	padding: 20px 0;
	text-align: center;

	&__media {
		display: block;
		width: 280px;
		height: 162px;
		object-fit: contain;
		margin: -56px auto 0;
	}

	&__caption {
		margin: 0 0 24px 0;
		color: var(--text_color_L2);
		font-size: 24px;
		line-height: 1.45;
		word-break: break-word;
	}

	&__title {
		margin: 30px 0 20px;
		color: var(--text_color_L1);
		font-size: 36px;
		line-height: 1.25;
		font-weight: 700;
		word-break: break-word;
	}

	&__description {
		margin: 0 0 24px 0;
		color: var(--text_color_L2);
		font-size: 24px;
		line-height: 1.45;
		word-break: break-word;
	}

	&__amount {
		min-height: 72px;
		margin-top: 26px;
		display: flex;
		// 标签是 flex item，i18n 文案尾部空格会被行盒裁掉（zh 等语言压根没空格），靠 gap 撑开
		gap: 8px;
		align-items: center;
		justify-content: center;
		color: var(--norm_secondary-color);
		word-break: break-word;
	}

	&__amount-label {
		color: var(--text_color_L2);
		font-size: 24px;
		font-weight: 400;
	}

	&__button {
		width: min(420px, 100%);
		height: 80px;
		margin-top: 40px;
		border: 0;
		border-radius: 999px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 32px;
		font-weight: 700;
	}

	&__button:disabled {
		opacity: 0.7;
	}
}
</style>
