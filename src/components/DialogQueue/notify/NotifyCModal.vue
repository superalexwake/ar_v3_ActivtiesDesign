<template>
	<!-- C 系居中模态（C4 提现退回、二次验证提醒）。KYC 断链 OTP 已拆到 NotifyKycOtpModal。 -->
	<div class="ntf-c" :class="[`ntf-c--${variant}`, { 'ntf-c--no-chip': !hasChip }]">
		<!-- 警示图标 100px：实心圆 + 白色感叹号（路径取自 Figma icon_hint，圆色按变体） -->
		<svg class="ntf-c__icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M49.7917 91.4583C72.8035 91.4583 91.4583 72.8035 91.4583 49.7917C91.4583 26.7798 72.8035 8.125 49.7917 8.125C26.7798 8.125 8.125 26.7798 8.125 49.7917C8.125 72.8035 26.7798 91.4583 49.7917 91.4583Z"
				:fill="cfg.iconColor"
			/>
			<path
				d="M50 74.1641C53.1066 74.1641 55.625 71.6456 55.625 68.5391C55.625 65.4325 53.1066 62.9141 50 62.9141C46.8934 62.9141 44.375 65.4325 44.375 68.5391C44.375 71.6456 46.8934 74.1641 50 74.1641Z"
				fill="#fff"
			/>
			<path
				d="M45.1195 27.6142C45.0544 26.1901 46.1914 25 47.6169 25H52.3831C53.8086 25 54.9456 26.1901 54.8805 27.6142L53.626 55.0571C53.5954 55.7245 53.0454 56.25 52.3773 56.25H47.6227C46.9546 56.25 46.4046 55.7245 46.374 55.0571L45.1195 27.6142Z"
				fill="#fff"
			/>
		</svg>

		<div class="ntf-c__main">
			<div class="ntf-c__text">
				<div class="ntf-c__headline">
					<p class="ntf-c__title">{{ title }}</p>
					<p class="ntf-c__msg" v-html="displayMessageHtml"></p>
				</div>
				<p v-if="displaySecondaryMessage" class="ntf-c__submsg" v-html="displaySecondaryMessageHtml"></p>
			</div>
		</div>

		<div class="ntf-c__actions">
			<div v-if="hasChip" class="ntf-c__chip" :class="`ntf-c__chip--${cfg.chip}`">
				<svg class="ntf-c__chip-clock" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12.2941 2.44706V0.903529C12.2941 0.404524 12.6986 0 13.1976 0H18.92C19.419 0 19.8235 0.404524 19.8235 0.90353V2.44706C26.4118 4.14118 31.1176 9.97647 31.1176 16.9412C31.1176 25.2235 24.3412 32 16.0588 32C7.77647 32 1 25.2235 1 16.9412C1 9.97647 5.70588 3.95294 12.2941 2.44706ZM16.0588 28.2353C22.2706 28.2353 27.3529 23.1529 27.3529 16.9412C27.3529 10.7294 22.2706 5.64706 16.0588 5.64706C9.84706 5.64706 4.76471 10.7294 4.76471 16.9412C4.76471 23.1529 9.84706 28.2353 16.0588 28.2353ZM19.6353 10.7294C20.363 10.0017 21.5429 10.0017 22.2706 10.7294C22.9983 11.4571 22.9983 12.637 22.2706 13.3647L18.1294 17.5059C17.4017 18.2336 16.2218 18.2336 15.4941 17.5059C14.7664 16.7782 14.7664 15.5983 15.4941 14.8706L19.6353 10.7294Z"
						:fill="cfg.chipColor"
					/>
				</svg>
				<span class="ntf-c__chip-text">{{ chipText }}</span>
			</div>

			<button type="button" class="ntf-c__btn ntf-c__btn--ghost" @click="onSecondary">
				{{ $t(secondaryAction.label) }}
			</button>
			<button type="button" class="ntf-c__btn ntf-c__btn--primary" @click="onPrimary">
				{{ $t(primaryAction.label) }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { jumpBy, type JumpAction } from '@/stores/modules/notifyWs'
import { formatNotifyMessageHtml } from '@/utils'

type CVariant = 'important' | 'returned'
type CAction =
	| { label: string; act: 'close' | 'confirm' | 'cancel' }
	| { label: string; act: 'jump'; to: JumpAction }
type CActionSlot = 'secondary' | 'primary'
interface CConfig {
	iconColor: string
	chip: '' | 'info'
	chipColor: string
	chipTextKey?: string
	secondary: CAction
	primary: CAction
}

const props = withDefaults(
	defineProps<{
		variant: CVariant
		title: string
		message: string
		secondaryMessage?: string
		activityCode?: number | null
		dialogId?: string
		actions?: Partial<Record<CActionSlot, CAction>>
		showChip?: boolean
	}>(),
	{ activityCode: null, showChip: true },
)
const emit = defineEmits<{
	(e: 'close'): void
	(e: 'confirm'): void
	(e: 'cancel'): void
}>()
const { t } = useI18n()

// 双按钮动作硬编码到模板（契约只下发单 jumpAction，按设计固定每个变体的主/次动作，文档 open item⑥）
const CONFIG: Record<CVariant, CConfig> = {
	important: {
		iconColor: 'var(--norm_red-color)',
		chip: 'info',
		chipColor: 'var(--norm_secondary-color)',
		chipTextKey: 'notifyStayingMinutes',
		secondary: { label: 'notifyCancel', act: 'close' },
		primary: { label: 'notifySubmit', act: 'close' },
	},
	returned: {
		iconColor: 'var(--norm_secondary-color)',
		chip: '',
		chipColor: '',
		secondary: { label: 'notifyViewWallet', act: 'jump', to: 'wallet' },
		primary: { label: 'notifyWithdrawAgain', act: 'jump', to: 'withdraw' },
	},
}

const cfg = computed(() => CONFIG[props.variant])
const hasChip = computed(() => Boolean(props.showChip && cfg.value.chip))
const secondaryAction = computed(() => props.actions?.secondary || cfg.value.secondary)
const primaryAction = computed(() => props.actions?.primary || cfg.value.primary)

function splitSecondaryMessage(variant: CVariant, message: string) {
	const trimmed = message.trim()
	if (variant === 'returned') {
		const idx = trimmed.search(/\bPlease resubmit\b/i)
		if (idx > 0) {
			return {
				main: trimmed.slice(0, idx).trim(),
				secondary: trimmed.slice(idx).trim(),
			}
		}
	}
	if (variant === 'important') {
		const idx = trimmed.search(/\bIf you miss\b/i)
		if (idx > 0) {
			return {
				main: trimmed.slice(0, idx).trim(),
				secondary: trimmed.slice(idx).trim(),
			}
		}
	}
	return { main: trimmed, secondary: '' }
}

const displayMessage = computed(() => splitSecondaryMessage(props.variant, props.message || ''))
const explicitSecondaryMessage = computed(() => (props.secondaryMessage || '').trim())
const displaySecondaryMessage = computed(() => {
	if (explicitSecondaryMessage.value) return explicitSecondaryMessage.value
	if (props.variant === 'returned') return displayMessage.value.secondary || t('notifyWithdrawReturnedTip')
	return displayMessage.value.secondary
})
const displayMessageHtml = computed(() => formatNotifyMessageHtml(displayMessage.value.main))
const displaySecondaryMessageHtml = computed(() => formatNotifyMessageHtml(displaySecondaryMessage.value))

const chipText = computed(() => {
	if (cfg.value.chip === 'info' && cfg.value.chipTextKey) return t(cfg.value.chipTextKey)
	return ''
})

function runAction(a: CAction) {
	if (a.act === 'jump') {
		jumpBy(a.to, props.activityCode)
		emit('close')
		return
	}
	if (a.act === 'confirm') {
		emit('confirm')
		return
	}
	if (a.act === 'cancel') {
		emit('cancel')
		return
	}
	emit('close')
}
const onSecondary = () => runAction(secondaryAction.value)
const onPrimary = () => runAction(primaryAction.value)
</script>

<style scoped lang="scss">
// 像素值取自 Figma 750 设计宽（与项目既有 DialogQueue 弹窗同尺度）
.ntf-c {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 660px;
	max-width: calc(100vw - 90px);
	box-sizing: border-box;
	padding: 48px 40px;
	background: var(--bg_color_L2);
	border-radius: 24px;
	box-shadow: var(--BoxShadowColor-9, 0 8px 40px rgba(0, 0, 0, 0.12));

	&--important {
		min-height: 778px;
	}
	&--returned {
		min-height: 812px;
	}

	&__icon {
		width: 100px;
		height: 100px;
		flex-shrink: 0;
	}

	&__main {
		display: flex;
		align-items: center;
		flex: 1;
		min-height: 0;
		width: 100%;
	}

	&__text {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
	}
	&__headline {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
	}
	&__title {
		margin: 0;
		width: 100%;
		text-align: center;
		color: var(--text_color_L1);
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		font-size: 40px;
		line-height: normal;
	}
	&__msg {
		margin: 0;
		width: 100%;
		color: var(--text_color_L1);
		font-family: 'Poppins', sans-serif;
		font-weight: 400;
		font-size: 26px;
		line-height: normal;
		white-space: pre-line;
		word-break: break-word;
	}
	&__msg :deep(.notify-message-highlight),
	&__submsg :deep(.notify-message-highlight) {
		color: var(--main-color);
		font-weight: 600;
	}
	&__submsg {
		margin: 0;
		width: 100%;
		color: var(--text_color_L2);
		font-family: 'Poppins', sans-serif;
		font-weight: 400;
		font-size: 26px;
		line-height: normal;
		word-break: break-word;
	}

	&__actions {
		display: grid;
		flex-shrink: 0;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: 80px;
		gap: 24px;
		width: 100%;
		height: 80px;
	}
	&--important &__actions {
		grid-template-rows: 80px 80px;
		height: 184px;
	}
	&--no-chip &__actions {
		grid-template-rows: 80px;
		height: 80px;
	}

	&__chip {
		display: flex;
		align-items: center;
		justify-content: center;
		grid-column: 1 / span 2;
		gap: 8px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 1px solid;
		border-radius: 12px;
		&--info {
			background: var(--bg_color_L3);
			border-color: var(--norm_secondary-color);
		}
	}
	&__chip-clock {
		width: 32px;
		height: 32px;
		flex-shrink: 0;
	}
	&__chip-text {
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 28px;
		.ntf-c__chip--info & {
			color: var(--norm_secondary-color);
		}
	}

	&__btn {
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 28px;
		white-space: nowrap;
		cursor: pointer;
		&--ghost {
			background: transparent;
			border: 1px solid var(--main-color);
			border-radius: 74px;
			color: var(--main-color);
		}
		&--primary {
			border-radius: 80px;
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
		}
	}
}
</style>
