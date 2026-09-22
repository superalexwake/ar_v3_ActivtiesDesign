<template>
	<div v-if="visible" class="withDialog">
		<Dialog
			v-model:show="successDialog"
			@confirm="handleSuccess"
			:showCancelBtn="false"
			:confirm-text="t('confirm')"
			:title="t('success')"
		>
			<template #header>
				<img src="@icon/public/succeed.png" alt="" />
			</template>
			<template #content>
				<div>{{ t('t583') }}</div>
			</template>

		</Dialog>

		<Dialog
			v-model:show="cashOutDialog"
			class="cashOutDialog"
			:isShowHeader="false"
			:title="t('t586')"
			:confirmText="t('confirm')"
			:cancel-text="t('cancel')"
			@confirm="withdrawOut"
		>
			<template #content>
				<div class="cash_balance">
					<div
						class="add"
						v-html="$t('t587', [currency(turntableState.turntableInfo?.invitedWheelTotalPrizeAmount || 0)])"
					></div>
					<div class="play_code">
					{{$t('t588', [turntableState.turntableInfo?.invitedWheelAmountofcodeAmount ? turntableState.turntableInfo?.invitedWheelAmountofcodeAmount : 0])}}
					</div>
				</div>
			</template>

			<template #footer>
        <div class="foot_btn">
          <div class="subBtn2 btn" @click="emit('update:visible', false)">{{ $t('cancel') }}</div>
          <div class="subBtn btn" @click="withdrawOut">{{ $t('confirm') }}</div>
        </div>
      </template>
		</Dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { sumitInvitedWheelWithdraw } from '@/api'
import { AwaitApiResult, currency } from '@/utils'
import { useTurntables } from '@/hooks'
import Dialog from '@/components/common/Dialog.vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	}
})
const isOpen = ref(false)
const { turntableState, cashOutDialog, userInvitedWheelAmount } = useTurntables()
const successDialog = ref(false)

const handleSuccess = () => {
	successDialog.value = false
	emit('update:visible', false)
	setTimeout(() => {
		emit('withdrawSuccess')
	}, 300)
}

const emit = defineEmits(['update:visible', 'withdrawSuccess'])

watch(
	() => props.visible,
	(newVal) => {
		cashOutDialog.value = newVal

		isOpen.value = newVal
	},
	{ immediate: true }
)

const withdrawOut = useDebounceFn(async () => {
	const { code } = await AwaitApiResult(sumitInvitedWheelWithdraw({ amount: userInvitedWheelAmount.value }))

	if (code === 0) {
		successDialog.value = true
		cashOutDialog.value = false
	} else {
		// useToast().error('Withdraw failed')
		emit('update:visible', false)
	}
}, 500)
</script>

<style lang="scss" scoped>
.withDialog {
	.success_txt {
		width: 400px;
		margin: 0 auto;
		color: var(--text_color_L2, #848694);
		text-align: center;
		font-size: 28px;
		font-weight: 400;
		line-height: 36px; /* 128.571% */
	}
}

.success-tips {
	margin: -240px auto 0;
	.ar_icon {
		width: 581px;
		height: 279px;

		svg {
			width: 100%;
			height: 100%;
		}
	}
	.text {
		font-size: 36px;
	}
}
.foot_btn {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	grid-gap: 24px;
	.btn {
		width: 287px;
		height: 88px;
		justify-content: center;
		align-items: center;
		font-size: 28px;
		line-height: 88px;
		text-align: center;
	}
	.subBtn2 {
		border-radius: 50px;
		border: 2px solid var(--main-color, #F95959);
		color: var(--main-color);
	}
	.subBtn {
		border-radius: 50px;
		background: var(--main_gradient-color, linear-gradient(180deg, #F95959 0%, #F95959 100%));
		color: var(--text_color_L4, #FFF);
		font-size: 28px;
		font-weight: 600;
	}
}

.cashOutDialog {
	:deep(.dialog-content) {
		padding: 24px 24px 24px;
	}
}
.cash_balance {
	text-align: center;
	padding: 14px 0;
	.add {
		color: var(--text_color_L1, #383a4c);
		font-size: 32px;
		font-weight: 400;
		line-height: 28px; /* 87.5% */
		margin-bottom: 24px;
		span {
			color: var(--norm_orange_color, #f6af0b);
			font-size: 32px;
			font-weight: 600;
			line-height: 28px;
		}
	}
	.play_code {
		color: var(--text_color_L2, #848694);
		font-size: 28px;
		font-weight: 400;
		line-height: 36px; /* 128.571% */
	}
}
</style>
