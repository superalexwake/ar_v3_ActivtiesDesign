<template>
	<div class="activity-banner">
		<div class="activity-banner__row1">
			<img class="activity-banner__logo" :src="logoImg" alt="" />
			<div v-if="isLogin && showRewardCenter" class="activity-banner__detail-link" @click="$emit('bonus')">
				<span>{{ $t('rewardDetails') }}</span>
				<van-icon name="arrow" />
			</div>
		</div>
		<!--
			第二行(固定高度,三种状态都占同一个位置,避免下面的「活动｜任务」切换卡片跳动):
			1) 已登录且未命中隐藏名单:显示粉色卡片,内含"今日奖金/总奖金"两列金额
			2) 已登录但命中隐藏名单(activityBonusHiddenUsers):金额保留占位(visibility:hidden)
			3) 未登录:换成红色实心「前往登录」按钮,点击行为与「奖励明细」一致,交给外层同一个 @bonus 处理登录态判断
		-->
		<div class="activity-banner__row2">
			<div v-if="isLogin" class="activity-bonus-card" :class="{ 'is-hidden': !showAmounts }">
				<div class="activity-bonus-card__col">
					<p>{{ $t('todayRewards') }}</p>
					<h3>{{ formatBonusAmount(todayRewards) }}</h3>
				</div>
				<div class="activity-bonus-card__col">
					<p>{{ $t('totalRewards') }}</p>
					<h3>{{ formatBonusAmount(totalRewards) }}</h3>
				</div>
			</div>
			<div v-else class="activity-banner__login-btn" @click="$emit('bonus')">
				{{ $t('activityGoLoginBtn') }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

/**
 * 头部"今日奖金/总奖金"专用的金额格式化：固定「₹ 」前缀(带空格)、千分位逗号、两位小数。
 *
 * @remarks 不复用全局 `currency()`——它的货币符号位置和取值按 `sessionStorage`/当前语言分支切换，
 * 这里的设计稿要求固定样式，自己实现一份不依赖那两个全局状态，改动范围也不必牵扯共享工具函数。
 */
const formatBonusAmount = (value: number) => {
	const amount = Number(value) || 0
	const [intPart, decimalPart] = Math.abs(amount).toFixed(2).split('.')
	const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return `${amount < 0 ? '-' : ''}₹ ${grouped}.${decimalPart}`
}
</script>

<style lang="scss" scoped>
.activity-banner{
	color: #1E2637;
	font-style: normal;
	background: #FFFFFF;
	padding: 16px 32px 16px;
	&__row1{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	&__logo{
		display: block;
		width: auto;
		height: 40px;
		// logo 素材本身就是红色版,头部改白底后不再需要转白滤镜
	}
	&__detail-link{
		display: flex;
		align-items: center;
		gap: 6px;
		color: #F95959;
		font-size: 28px;
		line-height: 40px;
		.van-icon{
			font-size: 24px;
		}
	}
	&__row2{
		margin-top: 20px;
		// 固定最小高度(粉色卡片上下padding24*2+标签行高32+标签到金额6+金额行高36=122),已登录/未登录两种内容切换时不改变头部总高度
		min-height: 122px;
		display: flex;
		align-items: center;
	}
	&__login-btn{
		width: 320px;
		height: 80px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #F95959;
		color: #fff;
		font-size: 28px;
		font-weight: 500;
		border-radius: 12px;
	}
	.activity-bonus-card{
		display: flex;
		width: 100%;
		background: #F6E1E6;
		border-radius: 16px;
		padding: 24px 0;
		&.is-hidden{
			visibility: hidden;
		}
		&__col{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			flex: 1;
			padding: 0 24px;
			&:first-child{
				border-right: 1px solid #F3E0E5;
			}
			p{
				font-weight: 400;
				font-size: 26px;
				line-height: 32px;
				margin-bottom: 6px;
				color: #544E54;
			}
			h3{
				font-weight: 700;
				font-size: 32px;
				line-height: 36px;
				color: #F95959;
			}
		}
	}
}
</style>
