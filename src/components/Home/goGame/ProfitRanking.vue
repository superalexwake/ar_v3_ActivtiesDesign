<template>
	<div class="mainContainer">
		<div class="mainContainer_profitContainer" v-for="(item, index) in homeState.rankList.slice(0, 9)" :key="index">
			<!-- Rank 1 -->
			<div class="mainContainer_profitContainer_medal" v-if="index == 0">
				<span><img src="./imgs/First.png" /></span>
			</div>
			<!-- Rank 2 -->
			<div class="mainContainer_profitContainer_medal" v-else-if="index == 1">
				<span><img src="./imgs/Second.png" /></span>
			</div>
			<!-- Rank 3 -->
			<div class="mainContainer_profitContainer_medal" v-else-if="index == 2">
				<span><img src="./imgs/Third.png" /></span>
			</div>
			<!-- Rank All -->
			<div class="mainContainer_profitContainer_medal" v-else>
				<span class="numberMedal">{{ index + 1 }}</span>
			</div>
			<div class="mainContainer_profitContainer_img"><img v-lazy="getAvatarUrl(item.userPhoto)" /></div>
			<div class="mainContainer_profitContainer_title">{{ desensitizeString(item['nickName']) }}</div>
			<div class="mainContainer_profitContainer_amount">{{ currency(item['price'] || 0) }}</div>
			<div class="mainContainer_profitContainer_bg">
				<svg xmlns="http://www.w3.org/2000/svg" width="219" height="121" viewBox="0 0 219 121" fill="none">
					<g filter="url(#filter0_b_2662_26708)">
						<path d="M45.5192 0.460938H203.298C211.73 0.460938 218.565 7.29628 218.565 15.7281V105.423C218.565 113.855 211.73 120.69 203.298 120.69H0.0534668L23.1907 60.5754L45.5192 0.460938Z"/>
					</g>
					<defs>
						<filter id="filter0_b_2662_26708" x="-7.58012" y="-7.17265" width="233.779" height="135.494" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
							<feFlood flood-opacity="0" result="BackgroundImageFix"/>
							<feGaussianBlur in="BackgroundImageFix" stdDeviation="3.81679"/>
							<feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_2662_26708"/>
							<feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_2662_26708" result="shape"/>
						</filter>
					</defs>
				</svg>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import {useHome, useWinner} from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
const { getAvatarUrl } = useAssets()
const {homeState} = useHome()
const { desensitizeString } = useWinner()
</script>

<style lang="scss" scoped>
@mixin flex-display {
	display: flex;
	align-items: center;
	justify-content: center;
}
.mainContainer {
	height: auto;
	margin: 10px;

	&_profitContainer {
		@include flex-display;
		position: relative;
		flex-direction: row;
		height: 126px;
		border-radius: 10px;
		background: var(--bg_color_L3);
		margin-top: 10px;

		&_medal {
			display: flex;
			width: 90px;
			height: 104px;
			margin-left: 15px;
			img {
				width: 72px;
				height: 100px;
			}

			span {
				margin-top: -10px;
				width: 72px;
				height: 72px;
			}
			.numberMedal {
				@include flex-display;
				width: 72px;
				height: 72px;
				background: url('./imgs/MedalNumber.png') no-repeat center center;
				margin-top: 15px;
				color: #7b8fae;
				font-family: Jost;
				font-size: 36px;
				font-weight: 600;
			}
		}
		&_img {
			@include flex-display;
			margin-left: 20px;
			width: 88px;
			height: 88px;
			border-radius: 50%;
			border: 3px solid rgba(215, 143, 67, 0.1);
			img {
				padding: 5px;
				width: 88px;
				height: 88px;
				border-radius: 50%;
			}
		}
		&_title {
			@include flex-display;
			height: 100px;
			padding: 15px;
			color: var(--text_color_L1,#dce0e6);
			font-family: Inter;
			font-size: 26px;
			font-weight: 500;
			letter-spacing: -0.52px;
		}
		&_amount {
			position: relative;
			padding: 15px;
			z-index: 1;
			@include flex-display;
			width: 100%;
			justify-content: flex-end;
			color: var(--Red-400, #fea800);
			font-size: 28px;
			font-weight: 500;
			font-family: Inter;
		}
		&_bg{
			width: 240px;
			height: 130px;
			position: absolute;
			top:-2px;
			right:-4px;
			z-index: 0;
			svg{
				width: 100%;
				height: 100%;
				fill: var(--bg_color_L1);
			}
		}
	}
}
</style>
