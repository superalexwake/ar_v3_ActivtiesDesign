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
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>

        <svg-icon v-if="index !== 2" :name="item.name === route.name? `p3_${item.name}_a` : `p3_${item.name}`"/>
			<div class="promotionBg" v-if="index == 2">
        		<svg-icon :name="item.name === route.name? `p3_${item.name}` : `p3_${item.name}`"/>
			</div>
			<span v-else>
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
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>

        <svg-icon v-if="index !== 2" :name="item.name === route.name? `p3_${item.name}_a` : `p3_${item.name}`"/>
			<div class="turntableBg" v-if="item.name === 'turntable'"></div>
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
import { useRouter, useRoute } from 'vue-router'
import {useTabBar, newTabBars} from './constTabbars'
import { currency } from '@/utils'
import { useActive } from '@/components/common/use'

const {isTurntable,getInvitedWheelImgUrl,getInvitedWheelTotalPrizeAmount,handleClick} = useTabBar()
const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const router = useRouter()
const route = useRoute()

const tabBars = [
	{
		name: 'promotion'
	},
	{
		name: 'activity'
	},
	{
		name: 'home'
	},
	{
		name: 'wallet'
	},
	{
		name: 'main'
	}
]


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
	background: #08081C;
	z-index: 100;

	&-item {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 8.78px;
		color: var(--text_color_L2);

		.reddot {
			position: absolute;
			bottom: 66px;
			left: calc(50% + 12px);
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: #FA5B5B;
			z-index: 5;
		}

		&:nth-of-type(3) {

			.promotionBg {
				background: var(--main_gradient-color2);
				width: 120px;
				height: 76px;
				border-radius: 38px;
				z-index: 2;
				display: flex;
				align-items: center;
				justify-content: center;
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
				width: 183px;
			}
		}

		svg {
			display: block;
			width: 40px;
			height: 40px;
		}
		span{
			line-height: 28px;
			height: 28px;
			width: 100%;
			text-align: center;
			overflow: hidden;
		}

		&.active {
			color: var(--text_color_L1);
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

