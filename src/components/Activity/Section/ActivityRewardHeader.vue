<template>
	<div class="activity-banner">
		<ul v-if="isLogin && !isActivityBonusHidden" class="activity-bonus">
			<li>
				<p>{{ $t('todayRewards') }}</p>
				<h3>{{ currency(todayRewards) }}</h3>
			</li>
			<li>
				<p>{{ $t('totalRewards') }}</p>
				<h3>{{ currency(totalRewards) }}</h3>
			</li>
		</ul>
		<div v-if="showRewardCenter" class="bonus-button" @click="$emit('bonus')">
			{{ isLogin ? $t('bonusDetails') : $t('goLogin') }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'

defineProps<{
	todayRewards: number
	totalRewards: number
	isActivityBonusHidden: boolean
	isLogin: boolean
	showRewardCenter: boolean
}>()

defineEmits<{
	(e: 'bonus'): void
}>()
</script>

<style lang="scss" scoped>
.activity-banner{
	color: #fff;
	font-size: 24px;
	font-style: normal;
	background: var(--light-main_gradient-color,var(--bg_color_L2));
	padding-top: 30px;
	padding-bottom: 30px;
	.activity-bonus{
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0 100px;
		margin-bottom: 30px;
		li{
			display: flex;
			flex-direction: column;
			align-items: center;
			flex:1;
			&:first-child{
				border-right: 2px solid var(--Dividing-line_color, #FFF);
			}
			p{
				font-weight: 400;
				font-size: 24px;
				margin-bottom: 10px;
			}
			h3{
				font-weight: 700;
				font-size: 36px;
			}
		}
	}
	.bonus-button{
		margin: 0 auto;
		display: flex;
		width: 280px;
		height: 80px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		border-radius: 80px;
		background: var(--bg_color_L1, #FFF);
		color: var(--main-color);
		border: 1px solid var(--main-color);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 30px;
		font-style: normal;
		font-weight: 500;
		line-height: 80px;
	}
}
</style>
