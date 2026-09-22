<template>
	<div class="super-jackpot-dialog">
		<div class="super-jackpot-dialog__media">
			<img src="@icon/public/superjackpotHome.png" alt="" />
		</div>
		<div class="super-jackpot-dialog__title">{{ $t('congratulations') }}</div>
		<div class="super-jackpot-dialog__body">
			<div class="super-jackpot-dialog__headline">{{ $t('getSuper') }}</div>
			<div class="super-jackpot-dialog__message">{{ $t('getRewards') }}</div>
		</div>
		<button type="button" class="super-jackpot-dialog__button" @click="emit('confirm')">OK</button>
	</div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	(e: 'confirm'): void
}>()
</script>

<style scoped lang="scss">
.super-jackpot-dialog {
	width: min(600px, calc(100vw - 48px));
	min-height: 500px;
	border-radius: 20px;
	background: var(--bg_color_L2);
	color: var(--text_color_L1);
	padding: 40px 20px;
	text-align: center;

	&__media {
		width: 280px;
		height: 180px;
		margin: -80px auto 0;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	&__title {
		margin-top: 26px;
		font-size: 36px;
		line-height: 1.25;
		font-weight: 700;
	}

	&__body {
		margin-top: 22px;
		min-height: 118px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: var(--text_color_L1);
	}

	&__headline {
		font-size: 36px;
		line-height: 1.35;
		font-weight: 700;
		word-break: break-word;
	}

	&__message {
		margin-top: 32px;
		font-size: 24px;
		line-height: 1.5;
		word-break: break-word;
	}

	&__button {
		width: min(326px, 100%);
		height: 80px;
		margin-top: 150px;
		border: 0;
		border-radius: 999px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 32px;
		font-weight: 700;
	}
}
</style>
