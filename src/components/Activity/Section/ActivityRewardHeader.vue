<template>
	<div class="activity-banner">
		<div class="activity-banner__row1">
			<img class="activity-banner__logo" :src="logoImg" alt="" />
			<div v-if="showRewardCenter" class="activity-banner__detail-link" @click="$emit('bonus')">
				<span>{{ $t('rewardDetails') }}</span>
				<van-icon name="arrow" />
			</div>
		</div>
		<!--
			第二行(固定高度,三种状态都占同一个位置,避免下面的「活动｜任务」切换卡片跳动):
			1) 已登录且未命中隐藏名单:显示"今日奖金/总奖金"两列金额
			2) 已登录但命中隐藏名单(activityBonusHiddenUsers):金额保留占位(visibility:hidden)
			3) 未登录:换成"前往登录"提示,点击行为与「奖励明细」一致,交给外层同一个 @bonus 处理登录态判断
		-->
		<div class="activity-banner__row2">
			<ul v-if="isLogin" class="activity-bonus" :class="{ 'is-hidden': !showAmounts }">
				<li>
					<p>{{ $t('todayRewards') }}</p>
					<h3>{{ formatBonusAmount(todayRewards) }}</h3>
				</li>
				<li>
					<p>{{ $t('totalRewards') }}</p>
					<h3>{{ formatBonusAmount(totalRewards) }}</h3>
				</li>
			</ul>
			<div v-else class="activity-banner__login" @click="$emit('bonus')">
				{{ $t('goLogin') }}
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
	color: #fff;
	font-style: normal;
	background: #F95959;
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
		// 现有 logo 素材是红色版,强制转白以贴合头部实底红色背景
		filter: brightness(0) invert(1);
	}
	&__detail-link{
		display: flex;
		align-items: center;
		gap: 6px;
		color: #fff;
		font-size: 28px;
		line-height: 40px;
		.van-icon{
			font-size: 24px;
		}
	}
	&__row2{
		margin-top: 20px;
		// 固定最小高度(标签行高32+标签到金额6+金额行高36=74),已登录/未登录两种内容切换时不改变头部总高度
		min-height: 74px;
		display: flex;
		align-items: center;
	}
	&__login{
		width: 100%;
		text-align: center;
		color: #fff;
		font-size: 28px;
		font-weight: 500;
	}
	.activity-bonus{
		display: flex;
		width: 100%;
		&.is-hidden{
			visibility: hidden;
		}
		li{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			flex: 1;
			padding-left: 32px;
			&:first-child{
				border-right: 1px solid rgba(255, 255, 255, 0.35);
			}
			p{
				font-weight: 400;
				font-size: 26px;
				line-height: 32px;
				margin-bottom: 6px;
			}
			h3{
				font-weight: 700;
				font-size: 32px;
				line-height: 36px;
				color: #FFE45C;
			}
		}
	}
}
</style>
