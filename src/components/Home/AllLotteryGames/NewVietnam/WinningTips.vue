<template>
	<div class="WinningTip__C" v-show="tipList.length" @click="clickMark">
		<div class="WinningTip__C-body" :class="{ isL }">
			<div v-if="isL" class="WinningTip__C-body-l1 isL">{{ $t('k3WarningTip1') }}</div>
			<div v-if="!isL" class="WinningTip__C-body-l1">{{ $t('k3WarningTip2') }}</div>
			<div v-if="isL" class="notwinning"></div>
			<div v-if="!isL" class="WinningTip__C-body-l2">
				{{ $t('code' + tip.bettingParentTypeNameCode) }}/{{ $t('code' + tip.bettingTypeNameCode) }}
			</div>
			<div v-if="!isL" class="WinningTip__C-body-l5">
				<div class="WinningTip__C-body-l5-content">
					<div class="ball" v-for="(item, index) in tip.openingResult" :key="index">
						<div class="balltext">{{ item }}</div>
					</div>
				</div>
			</div>
			<div class="WinningTip__C-body-l3">
				<div v-if="isL" class="isLose">{{ $t('winTips4') }}</div>
				<template v-if="!isL">
					<div class="head">{{ $t('winTips5') }}</div>
					<div class="bonus">{{ currency(tip.winningAmount) }}</div>
				</template>
				<div class="gameDetail">{{ $t(`code${tip.typeCode}`) }}</div>
				<div class="gameDetail">{{ $t('winTips6') }}{{ tip.issueNo }}</div>
			</div>
			<div class="WinningTip__C-body-l4">
				<div class="acitveBtn" :class="{ active: isThreeS }" @click.stop="clickThreeS"></div>
				{{ $t('autoShutOff3s') }}
			</div>
			<div class="closeBtn" @click="closeBtn"></div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { currency } from '@/utils'
import { computed, ref, watch } from 'vue'

const isL = computed(() => (tipList.value[0] ? tipList.value[0].winningAmount == 0 : false))
const tip = computed(() => tipList.value[0] || {})
const isThreeS = ref<Boolean>(false)
const tipList = ref<any[]>([])

let timer = ref<any>()

const clickMark = () => {
	clearTimeout(timer.value)
	tipList.value.shift()
	if (isThreeS.value && tipList.value.length) {
		timer.value = setTimeout(() => {
			clickMark()
		}, 1000 * 3)
	}
}

watch(
	() => tipList.value.length,
	(length) => {
		if (length) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}
)

// 三秒禁用
const clickThreeS = () => {
	isThreeS.value = !isThreeS.value
	console.log('clickThreeS')
	if (!isThreeS.value) {
		clearTimeout(timer.value)
	} else {
		timer.value = setTimeout(() => {
			clickMark()
		}, 1000 * 3)
	}
}
// 父组件直接调用
const showMark = (list: any) => {
	tipList.value.push(list)
	console.log('tipList.value', tipList.value)
	if (isThreeS.value) {
		timer.value = setTimeout(() => {
			clickMark()
		}, 1000 * 3)
	}
}
const closeBtn = () => {
	tipList.value = []
}

defineExpose({
	showMark
})
</script>
<style lang="scss" scoped>
.WinningTip__C {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 99;
	background-color: var(--bgcolor-32);
	top: 0;
	left: 0;
	html:lang(ar) &{
		left: unset;
		right: 0;
	}
	&-body {
		position: absolute;
		width: 580px;
		height: 880px;
		background-image: url('@/assets/icons/common/newmissingviebg.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		padding-top: 240px;

		&.isL {
			background-image: url('@/assets/icons/common/newmissingbg.png');
		}

		img {
			width: 111px;
			height: 111px;
			margin-top: 30px;
			text-align: center;
		}
		.notwinning {
			width: 120px;
			height: 120px;
			background: url('@/assets/icons/home/AllLotteryGames/NewVietnam/notwinning.png');
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			margin: 0 auto;
			margin-top: 40px;
			margin-bottom: 80px;
		}
		&-l1 {
			font-weight: 700;
			font-size: 36px;
			line-height: 1.2;
			text-align: center;
			color: #fff;
			min-height: 73px;
			padding: 0 16px;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			&.isL{
				color: var(--text_color_L2);
			}
		}

		&-l2 {
			height: 44px;
			line-height: 44px;
			display: flex;
			color: #fff;
			font-size: 22px;
			align-items: center;
			justify-content: center;
			margin-bottom: 10px;

			& > div {
				height: 44px;
				background: var(--norm_red-color);
				border-radius: 10px;
				padding: 0 24px;

				&:first-child {
					margin-left: 24px;
				}

				&.WinningNum {
					width: 40px;
					height: 40px;
					line-height: 40px;
					margin: 0 14px;
					padding: 0;
					text-align: center;
					border-radius: 50%;
					background: var(--norm_red-color);
					color: #fff;
					font-size: 28px;
				}
			}

			&.type0 {
				& > div {
					background-image: var(--linearGradien-5);
				}
			}

			&.type5 {
				& > div {
					background-image: var(--linearGradien-6);
				}
			}

			&.type1,
			&.type3,
			&.type7,
			&.type9 {
				& > div {
					background-color: var(--norm_red-color);
				}
			}

			&.type2,
			&.type4,
			&.type6,
			&.type8 {
				& > div {
					background-color: var(--norm_red-color);
				}
			}
		}

		&-l5 {
			height: 100px;
			margin-top: 70px;
			margin-bottom: 40px;
			padding: 0 40px;
			&-content {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.ball {
					width: 70px;
					height: 60px;
					line-height: 60px;
					text-align: center;
					font-size: 26px;
					font-weight: 700;
					color: var(--norm_red-color);
					background: url('@/assets/icons/svg/resultanbg.svg') no-repeat center center;
					background-size: cover;
				}
				.balltext {
					background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);
					background-clip: text;
					color: transparent;
				}
			}
		}

		&-l3 {
			height: 130px;

			.isLose {
				font-weight: 700;
				font-size: 32px;
				line-height: 58px;
				color: var(--text_color_L2);
				text-align: center;
				margin-bottom: 26px;
				padding-top: 30px;
			}

			.head {
				height: 30px;
				line-height: 30px;
				font-weight: 700;
				font-size: 26px;
				color: var(--main-color);
				text-align: center;
				margin-bottom: 8px;
			}

			.bonus {
				height: 48px;
				line-height: 48px;
				font-weight: 700;
				font-size: 40px;
				color: var(--main-color);
				text-align: center;
				margin-bottom: 10px;
			}

			.gameDetail {
				height: 28px;
				line-height: 28px;
				font-size: 22px;
				text-align: left;
				padding-left: 110px;
				color: var(--text_color_L2);
				margin-top: 10px;
			}
		}

		&-l4 {
			height: 48px;
			line-height: 48px;
			font-size: 24px;
			color: #fff;
			position: absolute;
			left: 56px;
			bottom: 28px;
			display: flex;
			align-items: center;
			html:lang(ar) &{
				left: unset;
				right: 56px;
			}
			.acitveBtn {
				height: 42px;
				width: 42px;
				border-radius: 50%;
				background: var(--winTips);
				border: 1px solid #fff;
				margin-right: 14px;
				position: relative;

				&.active {
					&::before {
						content: '';
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translateX(-50%) translateY(-50%);
						height: 18px;
						width: 24px;
						display: block;
						background-image: url('@/assets/icons/common/vector.png');
						background-repeat: no-repeat;
						background-size: 24px 18px;
						background-position: center;
					}
				}
			}
		}
	}

	.closeBtn {
		width: 60px;
		height: 60px;
		background-image: url('@/assets/icons/common/close.png');
		background-repeat: no-repeat;
		background-size: 60px;
		background-position: center;
		position: absolute;
		left: 50%;
		transform: translateX(-50%) translateY(100%);
		bottom: -20px;
	}
}
</style>
