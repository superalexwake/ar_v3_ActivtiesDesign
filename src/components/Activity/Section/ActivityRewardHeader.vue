<template>
	<div class="activity-banner">
		<img class="activity-banner__logo" :src="logoImg" alt="" />
		<!--
			今日奖金/总奖金:未登录(或命中隐藏名单)时不展示数值,但保留占位(visibility:hidden)而不是整段
			移出文档流,这样下面的「奖励明细/前往登录」胶囊按钮在两种状态下都落在同一个垂直位置。
		-->
		<ul class="activity-bonus" :class="{ 'is-hidden': !showAmounts }">
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
import { computed } from 'vue'
import { currency } from '@/utils'
import logoImg from '@/assets/icons/images/logo.png'

const props = defineProps<{
	todayRewards: number
	totalRewards: number
	isActivityBonusHidden: boolean
	isLogin: boolean
	showRewardCenter: boolean
}>()

defineEmits<{
	(e: 'bonus'): void
}>()

const showAmounts = computed(() => props.isLogin && !props.isActivityBonusHidden)
</script>

<style lang="scss" scoped>
.activity-banner{
	color: #fff;
	font-size: 24px;
	font-style: normal;
	background: #F95959;
	padding-top: 56px;
	padding-bottom: 30px;
	.activity-banner__logo{
		display: block;
		width: 218px;
		height: auto;
		margin: 0 auto 34px;
		// 现有 logo 素材是红色版,强制转白以贴合头部实底红色背景
		filter: brightness(0) invert(1);
	}
	.activity-bonus{
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 0 100px;
		margin-bottom: 30px;
		&.is-hidden{
			visibility: hidden;
		}
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
		background: #FFFFFF;
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
