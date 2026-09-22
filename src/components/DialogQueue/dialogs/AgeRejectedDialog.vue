<template>
	<div class="age-rejected-dialog">
		<div>
			<span>{{ $t('brazildialog4') }}</span>
		</div>
		<div class="dialog-footer">
			<div class="btn-cancel dialog-btn no-btn" @click="emit('close')">{{ $t('confirm') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	(e: 'close'): void
}>()
</script>

<style scoped lang="scss">
.age-rejected-dialog {
	height: 380px;
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

	.dialog-footer {
		margin-top: 40px;

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
			border: 1px solid var(--main-color);
			color: var(--main-color);
		}
	}
}
</style>
