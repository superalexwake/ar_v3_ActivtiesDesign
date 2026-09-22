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
			<svg-icon v-if="item.name != 'promotion'" :name="item.name" />
			<svg v-else xmlns="http://www.w3.org/2000/svg" width="130" height="108" viewBox="0 0 130 108" fill="none">
				<g clip-path="url(#clip0_1_9417)">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M107.494 0C110.5 0 113.181 1.53134 114.725 4.11045L128.862 28.1284C130.569 31.1105 130.325 41.1851 128.212 43.8448L74.8312 103.325C70.5249 108.645 62.6437 109.531 57.1999 105.26C56.4687 104.696 55.8187 104.051 55.2499 103.325L1.78745 43.8448C-0.406302 41.1851 -0.650052 31.0299 1.13745 28.1284L15.2749 4.11045C16.8187 1.53134 19.5812 0 22.5062 0H107.494Z" fill="#3B3B3B"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M98.6375 15.3135C100.994 15.3135 103.106 16.4418 104.244 18.3762L115.294 36.2687C116.675 38.4448 116.431 41.2657 114.725 43.2L72.9625 90.8329C69.55 94.7821 63.4562 95.4269 59.2312 92.2836C58.6625 91.8806 58.175 91.3971 57.6875 90.8329L16.0875 43.2C14.3812 41.1851 14.2187 38.4448 15.5187 36.2687L26.5687 18.3762C27.7062 16.5224 29.9 15.3135 32.175 15.3135H98.6375ZM77.7562 52.6299L67.6 67.1374C67.1125 67.8627 65.2437 68.0239 64.5125 67.4597C64.35 67.3791 64.2687 67.218 64.1062 67.1374L53.1375 52.6299C51.5937 50.5344 48.5062 50.0508 46.3125 51.5821C44.1187 53.0329 43.6312 55.9344 45.175 58.0299L56.1437 72.5374C60.3687 77.6956 63.05 79.7911 65.8937 79.7911C69.0625 79.7911 71.7437 76.2448 74.75 72.5374L85.7187 58.0299C87.2625 55.9344 86.775 53.0329 84.5812 51.5821C82.3875 50.0508 79.3 50.5344 77.7562 52.6299Z" fill="url(#paint0_linear_1_9417)"/>
				</g>
				<defs>
				<linearGradient id="paint0_linear_1_9417" x1="65.4231" y1="15.3135" x2="65.4231" y2="94.2758" gradientUnits="userSpaceOnUse">
				<stop stop-color="#FAE59F"/>
				<stop offset="1" stop-color="#C4933F"/>
				</linearGradient>
				<clipPath id="clip0_1_9417">
				<rect width="130" height="108" fill="white"/>
				</clipPath>
				</defs>
			</svg>
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
			<span v-if="item.name === 'activity' && redDot.totalCount > 0" class="reddot"></span>

		<!-- <svg-icon :name="item.name === 'promotion' ? 'promotion2' : item.name" /> -->
        <svg-icon v-if="index !== 2" :name="item.name === 'promotion' ? 'promotion2' : item.name"/>
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

const router = useRouter()
const {isTurntable,getInvitedWheelImgUrl,getInvitedWheelTotalPrizeAmount,handleClick} = useTabBar()
const { ActiveSotre } = useActive()
const redDot = computed(() => ActiveSotre.value.activityRedDot)

const route = useRoute()

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
	background: var(--bg_color_L2);
	z-index: 100;
	border-radius: 50px 50px 0 0;

	&-item {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 8.78px;
		color: #BFBFBF;

		.reddot {
			position: absolute;
			bottom: 82px;
			left: calc(50% + 20px);
			width: 14px;
			height: 14px;
			border-radius: 50%;
			background: #FA5B5B;
			z-index: 5;
		}

		&:nth-of-type(3) {
			position: relative;

			:deep(svg) {
				position: absolute;
				bottom: 25px;
				width: 140px;
				height: 140px;
				z-index: 3;
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
			width: 56px;
			height: 56px;
		}

		span{
			line-height: 28px;
			height: 28px;
			width: 100%;
			text-align: center;
			overflow: hidden;
		}

		&.active:not(:nth-of-type(3)) {
			color: #DDB96B;

			:deep(svg) {

				path {
					fill: url('#paint0_linear_226_233');
				}
			}
		}
	}
}

@media screen and (max-width: 500px) {
	.tabbar__container {
		width: 100%;
		left: 0;
		transform: translateX(0);
	}
}
</style>
