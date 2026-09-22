<template>
	<div class="age-gate-dialog">
		<div>
			<span>{{ $t('loginTips', [projectName]) }}</span>
			<div class="tip_txt">{{ $t('brazildialog1') }}</div>
		</div>
		<div class="dialog-footer">
			<div class="btn-cnf dialog-btn" @click="confirmAge">{{ $t('brazildialog2') }}</div>
			<div class="btn-cancel dialog-btn" @click="emit('cancel')">{{ $t('brazildialog3') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	projectName: string
}

defineProps<Props>()

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'cancel'): void
}>()

function confirmAge() {
	localStorage.setItem('is18', '1')
	emit('confirm')
}
</script>

<style scoped lang="scss">
.age-gate-dialog {
	height: 500px;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	text-align: center;
	padding: 40px;
	background: var(--bg_color_L2);

	span:nth-child(1) {
		display: block;
		font-size: 40px;
		color: var(--text_color_L1);
		margin: 40px 0 14px;
		font-weight: 600;
	}

	.tip_txt {
		font-size: 26px;
		color: var(--text_color_L2);
		margin-bottom: 58px;
	}

	.dialog-footer {
		.dialog-btn {
			margin: 0 auto 24px;
			width: 550px;
			height: 80px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 12px;
			font-size: 28px;
			font-weight: 500;
		}

		.btn-cnf {
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
		}

		.btn-cancel {
			border: 1px solid var(--main-color);
			color: var(--main-color);
		}
	}
}
</style>
