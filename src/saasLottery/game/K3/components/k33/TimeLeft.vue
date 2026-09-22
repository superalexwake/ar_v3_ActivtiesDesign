<template>
	<div class="K3TL__C">
		<div class="K3TL__C-l1">
			<div class="left">
				<div>{{ $t('k3Number') }}</div>
				<div class="K3TL__C-rule" @click="showRule">
					<svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
						<path
							d="M9.0484 25.8284L9.04089 25.8359L9.03366 25.8437C8.47797 26.4402 7.97942 26.8014 7.56631 26.9797C7.15908 27.1556 6.87147 27.141 6.67169 27.055C6.46753 26.967 6.24252 26.7559 6.06263 26.3149C5.88195 25.8718 5.76602 25.2377 5.76602 24.3993V9.38602C5.76602 6.69019 6.09509 5.23943 6.86083 4.42092C7.61326 3.61665 8.94055 3.26602 11.4593 3.26602H21.5393C24.0584 3.26602 25.3852 3.61676 26.1358 4.42054C26.8997 5.23844 27.226 6.68864 27.2193 9.38453V9.38602V24.386C27.2193 25.2248 27.1041 25.8592 26.9242 26.3024C26.7451 26.7438 26.5211 26.9543 26.3182 27.0418C26.1198 27.1275 25.8328 27.1424 25.4244 26.9663C25.0105 26.7878 24.5102 26.4264 23.9512 25.8299C23.2918 25.1224 22.4328 24.7733 21.5701 24.8202C20.7074 24.8672 19.8916 25.3075 19.3127 26.0793L19.3123 26.0799L17.9676 27.8772C17.9673 27.8776 17.967 27.878 17.9667 27.8785C17.5231 28.4638 16.9844 28.7094 16.4927 28.7094C16.001 28.7094 15.4623 28.4638 15.0187 27.8785C15.0184 27.878 15.0181 27.8776 15.0177 27.8772L13.6733 26.0802C13.6732 26.0801 13.6732 26.08 13.6731 26.0799C12.5033 24.515 10.4028 24.3993 9.05577 25.8211L9.0484 25.8284ZM8.93935 14.666C8.93935 15.7307 9.80798 16.5993 10.8727 16.5993C11.9374 16.5993 12.806 15.7307 12.806 14.666C12.806 13.6013 11.9374 12.7327 10.8727 12.7327C9.80798 12.7327 8.93935 13.6013 8.93935 14.666ZM8.93935 9.33268C8.93935 10.3974 9.80798 11.266 10.8727 11.266C11.9374 11.266 12.806 10.3974 12.806 9.33268C12.806 8.26798 11.9374 7.39935 10.8727 7.39935C9.80798 7.39935 8.93935 8.26798 8.93935 9.33268ZM14.806 16.266H22.1393C23.0174 16.266 23.7393 15.5441 23.7393 14.666C23.7393 13.788 23.0174 13.066 22.1393 13.066H14.806C13.928 13.066 13.206 13.788 13.206 14.666C13.206 15.5441 13.928 16.266 14.806 16.266ZM14.806 10.9327H22.1393C23.0174 10.9327 23.7393 10.2107 23.7393 9.33268C23.7393 8.45465 23.0174 7.73268 22.1393 7.73268H14.806C13.928 7.73268 13.206 8.45465 13.206 9.33268C13.206 10.2107 13.928 10.9327 14.806 10.9327Z"
							stroke="currentColor"
							stroke-width="1.2"
						/>
					</svg>
					{{ $t('winTrxIndicate') }}
				</div>
			</div>
			<div>{{ $t('k3TimeLeftToBuy') }}</div>
		</div>
		<div class="K3TL__C-l2">
			<div class="periodNo">{{ issue }}</div>
			<div class="K3TL__C-time">
				<div v-for="t in countdownTime">{{ t}}</div>
				<!-- <div>{{ currentInfo.time2 }}</div>
				<div notime>:</div>
				<div>{{ currentInfo.time3 }}</div>
				<div>{{ currentInfo.time4 }}</div> -->
			</div>
		</div>
		<div class="K3TL__C-l3">
			<div class="box">
				<div v-for="(item, index) in prizeNumList" :key="index" :class="['num' + item]"></div>
			</div>
		</div>
	</div>
	<!-- 规则弹层 begin-->
	<!-- <rule :howPlayShow="howPlayShow" :gamePresentation="currentGame.gamePresentation" @close="howPlayShow = false" /> -->
</template>
<script setup lang="ts">
import { computed, } from 'vue'
const prizeNumList = computed(() => {
	return [...(props.premium ?? [])]
})
const emit = defineEmits(["showRule"]);
const props = defineProps({
	issue: {
		type: String,
		default: 'loading'
	},
	countdownTime: {
		type: Array,
		default: []
	},
	premium: {
		type: String,
		default: '666'
	},
	currentGame: {
		// 当前选中游戏
		type: Object,
		default: () => ({})
	}
})
const showRule = () => {
	emit("showRule");
}
</script>
<style lang="scss" scoped>
.K3TL__C {
	&-rule {
		height: 46px;
		width: 220px;
		display: flex;
		font-size: 22px;
		text-align: center;
		border: 1px solid var(--main-color);
		border-radius: 60px;
		justify-content: center;
		align-items: center;
		color: var(--main-color);
		margin-left: 30px;
		gap:3px;
		svg {
			color: var(--main-color);
			width: 32px;
			height: 32px;
		}
	}

	&-l1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 46px;
		color: var(--text_color_L2);
		font-size: 24px;

		.left {
			display: flex;
			align-items: center;
			height: 46px;
		}

		& > div:not(.left) {
			align-self: flex-start;
		}
	}

	&-l2 {
		height: 60px;
		line-height: 60px;
		display: flex;
		justify-content: space-between;
		font-weight: 700;
		font-size: 36px;
		color: var(--text_color_L1);
		.periodNo{
			font-weight: normal;
		}
	}

	&-l3 {
		height: 232px;
		margin-top: 36px;
		background: #00B977;
		border-radius: 14px;
		position: relative;
		padding: 20px;

		&::after,
		&::before {
			content: '';
			display: block;
			width: 10px;
			height: 52px;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			z-index: 0;
			background-color: #008B59;
		}

		&::before {
			border-radius: 10px 0px 0px 10px;
			left: -10px;
		}

		&::after {
			border-radius: 0px 10px 10px 0px;
			right: -10px;
		}

		.box {
			background: #003c26;
			border-radius: 10px;
			height: 100%;
			width: 100%;
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px;

			&::after,
			&::before {
				position: absolute;
				width: 0;
				height: 0;
				border-top: 14px solid transparent;
				border-bottom: 14px solid transparent;
				content: '';
				z-index: 3;
			}

			&::before {
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-right: 40px solid transparent;
				border-left: 40px solid #00B575;
			}

			&::after {
				right: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 40px solid transparent;
				border-right: 40px solid #00B575;
			}

			& > div {
				width: calc((100% - 30px) / 3);
				height: 172px;
				background-color: #727272;
				border-radius: 10px;
				position: relative;
				background-position: center;
				background-size: 70%;
				background-repeat: no-repeat;

				&::before {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 100%;
					content: '';
					z-index: 2;
					box-shadow: inset 0 -10px 10px 0 rgba(0, 0, 0, 0.3), inset 0 10px 10px 0 rgba(0, 0, 0, 0.3);
				}
			}
		}

		$list: 1 2 3 4 5 6;

		@each $i in $list {
			.num#{$i} {
				background-image: url('../../assets/k33/AllGames/num#{$i}.png');
			}
		}

		& > div,
		& > p {
			width: 110px;
			height: 110px;
			line-height: 110px;
			text-align: center;
			font-weight: 700;
			font-size: 48px;
			background-position: center;
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
	}

	&-time {
		height: 60px;
		line-height: 60px;
		bottom: 22px;
		right: 24px;
		display: flex;
		html:lang(ar) & {
			direction: ltr;
		}
		:nth-child(3){
				background-color: transparent;
			}
		& > div {
			background: var(--bg_color_L3);
			border-radius: 4px;
			font-weight: 700;
			font-size: 36px;
			text-align: center;
			padding: 0 8px;
			width: 40px;
			color: var(--main-color);

			& + div {
				margin-left: 9px;
			}
		}
	}
}
</style>
