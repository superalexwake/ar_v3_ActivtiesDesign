<template>
	<div class="WinningTip__C" v-show="tipList.length" @click="clickMark">
		<div class="WinningTip__C-body" :class="{ isL }">
			<div v-if="isL" class="WinningTip__C-body-l1" :class="{ isL }">{{ $t('k3WarningTip1') }}</div>
			<div v-else class="WinningTip__C-body-l1">{{ $t('k3WarningTip2') }}</div>
			<div class="WinningTip__C-body-l2">
				<div class="line1">
					<div v-for="(n, i) in tip.list" :class="['n' + n]"></div>
				</div>
				<div class="line2">
					<div>{{ tip.sum > 10 ? $t('big') : $t('small') }}</div>
					<div class="yuan">{{ tip.sum }}</div>
					<div>{{ tip.sum % 2 ? $t('k3Odd') : $t('k3Even') }}</div>
				</div>
			</div>
			<div class="WinningTip__C-body-l3">
				<div v-if="isL" class="isLose">{{ $t('k3WarningTip3') }}</div>
				<template v-else>
					<div class="head">{{ $t('k3WarningTip4') }}</div>
					<div class="bonus">{{ currency(Number(tip.winAmount)) }}</div>
				</template>
				<div class="gameDetail">
					{{ $t('k3WarningTip5') }}
					{{ tip.typeName }}
					<p>{{ tip.issueNumber }}</p>
				</div>
			</div>
			<div class="WinningTip__C-body-l4">
				<div class="acitveBtn" :class="{ active: isThreeS }" @click.stop="clickThreeS"></div>
				{{ $t('autoShutOff3s') }}
			</div>
			<div class="closeBtn" @click="closeBtn"></div>
			<van-icon name="arrow" color="#fff" size="30px" class="arrowBtn" @click.stop="clickMark" v-show="tipList.length>1" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import { computed, ref } from 'vue'

const isL = computed(() => (tipList.value[0] ? tipList.value[0].state == 0 : false))
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

// 三秒禁用
const clickThreeS = () => {
	isThreeS.value = !isThreeS.value
	if (!isThreeS.value) {
		clearTimeout(timer.value)
	} else {
		timer.value = setTimeout(() => {
			clickMark()
		}, 1000 * 3)
	}
}
// 父组件直接调用
const showMark = (item: any) => {
	item.list = item.premium.split('')
	item.sum = Number(item.list[0]) + Number(item.list[1]) + Number(item.list[2])
	tipList.value.push(item)
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
	background-color: rgba(0, 0, 0, 0.50);;
	top: 0;
	left: 0;
	html:lang(ar) &{
		right: 0;
		left: unset;
	}
	&-body {
		position: absolute;
		width: 580px;
		height: 820px;
		background-image: url('@/assets/icons/common/missningBg.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		padding-top: 250px;

		&.isL {
			background-image: url('@/assets/icons/common/missningLBg.png');
      .WinningTip__C-body-l1,
      .WinningTip__C-body-l2,
      .WinningTip__C-body-l3,
      .WinningTip__C-body-l4
      {
        color: #587BA4;
      }
			.WinningTip__C-body-l2{
				.line2 {
					&>div{
						background: #6889B1;
					}
				}
			}
		}

		&-l1 {
			font-weight: 700;
			font-size: 36px;
			line-height: 1.2;
			text-align: center;
			color: #fff;
			min-height: 92px;
			padding: 0 16px;
			display: flex;
			align-items: flex-start;
			justify-content: center;
		}

		&-l2 {
			height: 100px;
			color: #fff;
			font-size: 22px;
			margin-bottom: 48px;

			.line1 {
				height: 40px;
				width: 188px;
				margin: auto;
				display: flex;
				justify-content: space-between;
				align-items: center;

				& > div {
					width: 40px;
					height: 40px;
					background-repeat: no-repeat;
					background-size: 40px;
					background-position: center;
				}

				$list: 1 2 3 4 5 6;

				@each $i in $list {
					.n#{$i} {
						background-image: url('@icon/AllGames/n#{$i}.png');
					}
				}
			}

			.line2 {
				height: 44px;
				width: 268px;
				margin: 12px auto 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				& > div {
					height: 44px;
					line-height: 44px;
					background: #FDAC32;
					border-radius: 10px;
					width: 100px;
					text-align: center;
					color: #fff;
					&.yuan {
						width: 40px;
						height: 40px;
						line-height: 40px;
						margin: 0 14px;
						border-radius: 50%;
					}
				}
			}
		}

		&-l3 {
			height: 130px;

			.isLose {
				font-weight: 700;
				font-size: 48px;
				line-height: 58px;
				color: var(--text_color_L2);
				text-align: center;
				margin-bottom: 16px;
				padding-top: 10px;
			}

			.head {
				height: 30px;
				line-height: 30px;
				font-weight: 700;
				font-size: 26px;
				color: #FB5B5B;
				text-align: center;
				margin-bottom: 8px;
			}

			.bonus {
				height: 48px;
				line-height: 48px;
				font-weight: 700;
				font-size: 40px;
				color: #FB5B5B;
				text-align: center;
				margin-bottom: 8px;
			}

			.gameDetail {
				height: 28px;
				line-height: 28px;
				font-size: 22px;
				text-align: center;
				color: var(--text_color_L2);
			}
		}

		&-l4 {
			height: 48px;
			line-height: 48px;
			font-size: 24px;
			color: #fff;
			position: absolute;
			left: 56px;
			bottom: 56px;
			display: flex;
			align-items: center;
			html:lang(ar) &{
				right: 56px;
				left: unset;
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
	.arrowBtn{
		position: absolute;
		right:-28px;
		top: 60%;
		z-index: 500;
	}
}
</style>
