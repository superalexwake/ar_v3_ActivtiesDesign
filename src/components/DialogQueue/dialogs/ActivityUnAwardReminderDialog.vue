<template>
	<div class="activity-un-award-reminder">
		<img class="activity-un-award-reminder__media" src="@public/activity/DailyTask/present.png" alt="" />
		<div class="activity-un-award-reminder__title">
			{{ $t('activityTip5') }} <span>{{ count }}</span>
		</div>
		<div class="activity-un-award-reminder__desc">
			{{ $t('activityTip6') }}
		</div>
		<button type="button" class="activity-un-award-reminder__button" @click="emit('confirm')">
			{{ $t('activityTip7') }}
		</button>
		<button type="button" class="activity-un-award-reminder__close" @click="emit('close')">
			<img src="@public/activity/DailyTask/close.png" alt="" />
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	/** 活动页每日、每周、新手礼包的未领取总数。 */
	count: number
}>()

const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'close'): void
}>()
</script>

<style scoped lang="scss">
.activity-un-award-reminder {
	width: min(620px, calc(100vw - 48px));
	padding: 20px 0;
	position: relative;
	border-radius: 20px;
	background: var(--bg_color_L2);
	color: var(--text_color_L1);
	text-align: center;

	&__media {
		width: 345px;
		height: 345px;
		position: relative;
		margin-top: -160px;
		object-fit: contain;
	}

	&__title {
		margin-bottom: 10px;
		padding: 0 12px;
		color: var(--text_color_L1);
		font-size: 30px;
		line-height: 1.35;

		span {
			color: var(--norm_red-color);
			font-size: 36px;
			font-weight: 700;
		}
	}

	&__desc {
		padding: 0 20px;
		color: var(--text_color_L2);
		font-size: 24px;
		line-height: 1.45;
	}

	&__button {
		width: 420px;
		max-width: calc(100% - 80px);
		height: 80px;
		margin-top: 80px;
		border: 0;
		border-radius: 80px;
		background: var(--GradiantBlue, var(--main_gradient-color));
		color: var(--text_color_L4);
		font-size: 32px;
		font-weight: 700;
		line-height: 80px;
		text-align: center;
	}

	&__close {
		position: absolute;
		left: 50%;
		bottom: -80px;
		width: 60px;
		height: 60px;
		padding: 0;
		border: 0;
		background: transparent;
		transform: translateX(-50%);

		img {
			display: block;
			width: 60px;
			height: 60px;
		}
	}
}
</style>
