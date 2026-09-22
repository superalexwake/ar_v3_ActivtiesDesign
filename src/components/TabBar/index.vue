<template>
	<div class="tabbar__container" v-if="!isTurntable">
		<div
			class="tabbar__container-item"
			v-for="(item, index) in tabBars"
			:class="{
				active: item.name === route.name
			}"
			:key="item + '' + index"
			@click="handleClick(item.name)"
		>
			<svg-icon :name="item.name" />
			<div class="promotionBg" v-if="item.name === 'promotion'"></div>
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
			<span>
				{{ $t(item.name) }}
			</span>
		</div>
	</div>
	<div class="tabbar__container" v-else>
		<div
			class="tabbar__container-item"
			v-for="(item, index) in newTabBars"
			:class="{
				active: item.name === route.name
			}"
			:key="item + '' + index"
			@click="handleClick(item.name)"
		>
			<svg-icon :name="item.name === 'promotion' ? 'promotion2' : item.name" />
			<div class="turntableBg" v-if="item.name === 'turntable'"></div>
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>
			<span  v-if="item.name === 'turntable'" class="turntable-text">
				<!-- {{ $t('invitedWheel') }} -->
				 {{ $t('getMoney', [currency(getInvitedWheelTotalPrizeAmount, '', 0)]) }}
			</span>
			<span v-else>
				{{ $t(item.name) }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { currency } from '@/utils'
import { useRoute } from 'vue-router'
import { useTabBar,newTabBars} from './constTabbars'
import { useActive } from '@/components/common/use'

const tabBars = [
	{
		name: 'home'
	},
	{
		name: 'activity'
	},
	{
		name: 'promotion'
	},
	{
		name: 'wallet'
	},
	{
		name: 'main'
	}
]

const {isTurntable,getInvitedWheelImgUrl,getInvitedWheelTotalPrizeAmount,handleClick} = useTabBar()
const { ActiveSotre } = useActive()
// 活动中心红点(共享单例):底部 Activity 聚合红点(纯点)
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const route = useRoute()

</script>

<style scoped lang="scss">
.tabbar__container {
	position: fixed;
	bottom: 0;
	left: 50%;
	display: flex;
	align-items: flex-end;
	width: 750px;
	transform: translateX(-50%);
	height: 130px;
	padding-block: 0 10px;
	font-size: 22px;
	background: url('@icon/public/tabBarBg.png') no-repeat center center / cover;
	z-index: 100;

	&-item {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 8.78px;
		color: var(--text4,var(--text_color_L2));

		.reddot {
			position: absolute;
			bottom: 70px;
			left: calc(50% + 14px);
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: #FA5B5B;
			z-index: 5;
		}

		&:nth-of-type(3) {
			position: relative;

			:deep(svg) {
				position: relative;
				top: -30px;
				width: 56.28px;
				height: 48.75px;
				z-index: 3;

				path {
					fill: #fff !important;
				}
			}

			.promotionBg {
				position: absolute;
				left: 50%;
				bottom: 40px;
				transform: translate(-50%, 0);
				background: var(--bg_color_L2);
				width: 110px;
				height: 110px;
				border-radius: 50%;
				z-index: 2;

				&::after {
					content: '';
					position: absolute;
					left: 50%;
					top: 50%;
					width: calc(110px - 8px);
					height: calc(110px - 8px);
					border-radius: 50%;
					transform: translate(-50%, -50%);
					background: var(--main_gradient-color2);
				}
			}
			.turntableBg {
				position: absolute;
				left: 50%;
				bottom: 6px;
				transform: translate(-50%, 0);
				background-image: v-bind(getInvitedWheelImgUrl);
				background-repeat: no-repeat;
				background-size: cover;
				width: 153px;
				height: 153px;
				// border-radius: 50%;
				z-index: 2;
			}
			.turntable-text {
				display: inline-block;
				position: absolute;
				left: 50%;
				transform: translate(-50%, 0);
				bottom: 16px;
				z-index: 3;
				font-size: 26px;
				font-weight: 600;
				color: var(--main-color);
				min-width: 183px;
			}
		}

		svg {
			display: block;
			width: 43.32px;
			height: 44.54px;
		}
		span{
			line-height: 28px;
			height: 28px;
			width: 100%;
			text-align: center;
			overflow: hidden;
		}

		&.active {
			color: var(--main-color) !important;
		}
	}
}

@media screen and (max-width: 500px) {
	.tabbar__container {
		width: 100%;
		left: 0;
		transform: translateX(0);
		html:lang(ar) &{
			left: unset;
			right: 0;
		}
	}
}
</style>

