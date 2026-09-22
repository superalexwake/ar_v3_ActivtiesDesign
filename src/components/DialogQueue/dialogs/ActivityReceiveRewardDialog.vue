<template>
	<div class="activity-receive-reward">
		<img class="activity-receive-reward__media" src="@icon/public/succeed.png" alt="" />
		<div class="activity-receive-reward__title">{{ $t('awardsReceived') }}</div>
		<div class="activity-receive-reward__amount">
			<img src="@public/activity/DailyTask/amountIcon.png" alt="" />
			<span>{{ currency(amount) }}</span>
		</div>
		<button type="button" class="activity-receive-reward__button" @click="emit('confirm')">
			{{ $t('confirm') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'

defineProps<{
	amount: number | string
}>()
const emit = defineEmits<{
	(e: 'confirm'): void
}>()
</script>

<style scoped lang="scss">
.activity-receive-reward {
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

	&__title {
		margin: 30px 0 20px;
		color: var(--text_color_L1);
		font-size: 36px;
		line-height: 1.25;
		font-weight: 700;
	}

	&__amount {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--norm_secondary-color);
		font-size: 28px;
		line-height: 1.4;

		img {
			width: 30px;
			height: 30px;
			margin-right: 10px;
		}
	}

	&__button {
		width: 420px;
		max-width: calc(100% - 80px);
		height: 80px;
		margin-top: 40px;
		border: 0;
		border-radius: 80px;
		background: var(--GradiantBlue, var(--main_gradient-color));
		color: var(--text_color_L4);
		font-size: 32px;
		font-weight: 700;
		line-height: 80px;
		text-align: center;
	}
}
</style>
