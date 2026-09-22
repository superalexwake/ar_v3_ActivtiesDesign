<script setup lang="ts">
import { useBinguo } from '@/hooks/useBinguo.hook'
import { ref, watch } from 'vue'
import Dialog from '@/components/common/Dialog.vue'
import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import ruleDice1 from '@public/home/AllLotteryGames/binguo/rule_dice_1.png'
import ruleDice2 from '@public/home/AllLotteryGames/binguo/rule_dice_2.png'
import ruleDice3 from '@public/home/AllLotteryGames/binguo/rule_dice_3.png'
import ruleDice4 from '@public/home/AllLotteryGames/binguo/rule_dice_4.png'
import ruleDice5 from '@public/home/AllLotteryGames/binguo/rule_dice_5.png'
import ruleDice6 from '@public/home/AllLotteryGames/binguo/rule_dice_6.png'

const { t } = useI18n()
const { betSizeList, betNumberList, isShowBetMoney, handleBet, store, alikeList, handleAlike, oddObject, formatNum } = useBinguo()

const ruleTipText = {
	sum: {
		dice: '1,3,6',
		tip1: t('result'),
		tip2: t('binguoRuleTipText1')
	},
	third: {
		dice: '6,6,6',
		tip1: t('numbersMatch'),
		tip2: t('binguoRuleTipText2')
	},
	two: {
		dice: '6,6',
		tip1: t('sameNum'),
		tip2: t('binguoRuleTipText3')
	},
	one: {
		dice: '1,2,3,5,4,6',
		tip1: t('same'),
		tip2: t('binguoRuleTipText4')
	}
}

const ruleDiceIconMap: Record<string, string> = {
	'1': ruleDice1,
	'2': ruleDice2,
	'3': ruleDice3,
	'4': ruleDice4,
	'5': ruleDice5,
	'6': ruleDice6
}

const getRuleDiceIcon = (value: string | number) => {
	return ruleDiceIconMap[String(value)] || ''
}

const ruleVisble = ref(false)
const ruleTip_value = ref()

const ruleTipInit = () => {
	const ruleTip = document.querySelectorAll('.rule_tip')
	for (let i = 0; i < ruleTip.length; i++) {
		ruleTip[i].addEventListener('click', () => {
			ruleVisble.value = true
			if (i === 0) {
				ruleTip_value.value = ruleTipText.sum
			}
			if (i === 1) {
				ruleTip_value.value = ruleTipText.third
			}
			if (i === 2) {
				ruleTip_value.value = ruleTipText.two
			}
			if (i === 3) {
				ruleTip_value.value = ruleTipText.one
			}
		})
	}
}

watch(
	() => store.value.binguoType,
	(val) => {
		if (val === 2) {
			nextTick(() => {
				ruleTipInit()
			})
		}
	},
	{
		deep: true,
		immediate: true
	}
)
</script>

<template>
	<div class="main_desk">
		<div class="rule_tip" v-if="store.binguoType === 2">{{ $t('xosoTxt60') }}</div>

		<div class="bet_size">
			<div class="size_item" v-for="item in betSizeList" @click.stop="handleBet(item)">
				<div class="head">
					<span>{{ isShowBetMoney && item.bet_amount ? formatNum(item.bet_amount as number) : '' }}</span>
					<span>{{ item.beishu + 'x' || '' }}</span>
				</div>
				<div :class="`value value_${item.type}`">{{ item.value }}</div>
				<div class="range">{{ item.range }}</div>
				<div class="hot" v-if="item.hot && isShowBetMoney"></div>
			</div>
		</div>

		<div class="bet_number" :class="{ betAll: store.binguoType === 2 }">
			<div v-for="item in betNumberList" :key="item.value" class="item" @click="handleBet(item)">
				<div>{{ isShowBetMoney && item.bet_amount ? formatNum(item.bet_amount as number) : '' }}</div>
				<div>{{ item.value }}</div>
				<div>{{ item.beishu }}X</div>
				<div class="hot" :class="{ hot2: store.binguoType === 2 }" v-if="item.hot && isShowBetMoney"></div>
			</div>
		</div>

		<div v-if="store.binguoType === 2" class="alike_box">
			<div class="rule_tip">
				{{ $t('trendTXT4') }} {{ $t('odds') }}{{ oddObject.third.amount1 }}x {{ $t('k3bet3Desc4') }} {{ $t('odds')
				}}{{ oddObject.third.amount2 }}x
			</div>

			<div class="alike">
				<div class="alike_item" v-for="item in alikeList" @click="handleAlike(item.value, 3)">
					<div class="amount">{{ isShowBetMoney && item.amount1 ? formatNum(item.amount1) : '' }}</div>
					<div class="third_list">
						<div class="ball" v-for=" in 3">
							<span class="ball2">
								{{ item.value }}
							</span>
							<span class="ball_hot2" v-if="item.hot1"></span>
						</div>
					</div>
				</div>
			</div>

			<div class="rule_tip">{{ $t('trendTXT3') + $t('odds') }} {{ oddObject.two }}x</div>

			<div class="alike two_alike">
				<div class="alike_item" v-for="item in alikeList.slice(0, 6)" @click="handleAlike(item.value, 2)">
					<div class="amount">{{ isShowBetMoney && item.amount2 ? formatNum(item.amount2) : '' }}</div>
					<div class="third_list">
						<div class="ball" v-for=" in 2">
							<span class="ball2">
								{{ item.value }}
							</span>
							<span class="ball_hot2" v-if="item.hot2"></span>
						</div>
					</div>
				</div>
			</div>

			<div class="rule_tip">
				{{ $t('binguoRuleTip1') }}{{ oddObject.one.amount1 }}x {{ $t('binguoRuleTip2') }}{{ oddObject.one.amount2 }}x
				{{ $t('binguoRuleTip3') }} {{ oddObject.one.amount3 }}x
			</div>

			<div class="alike one_alike">
				<div class="alike_item" v-for="item in alikeList.slice(0, 6)" @click="handleAlike(item.value, 1)">
					<div class="amount">{{ isShowBetMoney && item.amount3 ? formatNum(item.amount3) : '' }}</div>
					<div class="ball_hot"></div>
					<div class="third_list">
						<span class="ball">
							<span class="ball2">
								{{ item.value }}
							</span>
							<span class="ball_hot2" v-if="item.hot3"></span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<Dialog
			v-model:show="ruleVisble"
			:showCloseIcon="true"
			:clickOutSide="true"
			:show-cancel-btn="false"
			:showFooter="false"
			:isShowHeader="false"
		>
			<template #title>
				<div class="rule_tip_header">
					<img
						v-for="item in ruleTip_value?.dice.split(',')"
						:src="getRuleDiceIcon(item)"
						alt=""
					/>
				</div>
			</template>
			<template #content>
				<div class="rule_tip_dialog">
					<div class="rule_tip_tit">{{ ruleTip_value?.tip1 }}</div>
					<div class="rule_tip_text">{{ ruleTip_value?.tip2 }}</div>
				</div>
			</template>
			<template #footer> </template>
		</Dialog>
	</div>
</template>
<style scoped lang="scss">
.main_desk {
	width: 100%;
	padding-top: 10px;
	overflow: hidden;
	display: flex;
		flex-direction: column;
		justify-content: center;
	.alike_box {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.rule_tip {
		display: inline-block;
		white-space: wrap;
		color: #5dba47;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px; /* 100% */
		margin-bottom: 24px;
		position: relative;
		margin: 0 auto 24px;
		pointer-events: none;
		max-width: 600px;
		text-align: center;
	}
	.rule_tip::after {
		content: '';
		position: absolute;
		display: block;
		right: -34px;
		top: -6px;
		width: 32px;
		height: 32px;
		background: url('@/assets/icons/home/AllLotteryGames/binguo/rule_tip.png') no-repeat center center;
		background-size: 32px 32px;
		pointer-events: auto;
	}
	.bet_size {
		display: grid;
		grid-gap: 6px;
		grid-template-columns: repeat(3, 1fr);
		margin-bottom: 10px;
		.size_item {
			height: 190px;
			border-radius: 10px;
			border: 4px solid #158054;
			background-color: #0a603e;
			color: #fff;
			position: relative;
			z-index: 1;
			.hot {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 36px;
				height: 36px;
				background: url('@/assets/icons/home/AllLotteryGames/binguo/hot_top.png') no-repeat right bottom;
				background-size: 36px 36px;
			}
			.head {
				display: flex;
				justify-content: space-between;
				padding: 10px;
				color: #acf8da;
				font-size: 22px;
				font-style: normal;
				font-weight: 400;
				line-height: 22px; /* 100% */
				margin-bottom: 10px;
			}
			.value {
				text-shadow: 0px 4px 2px rgba(10, 69, 41, 0.5);
				font-size: 60px;
				font-style: normal;
				font-weight: 700;
				line-height: 60px; /* 100% */
				text-align: center;
				margin-bottom: 10px;
				position: relative;
				z-index: 2;
			}
			.value_2 {
				color: #f9bc36;
			}
			.value_3 {
				color: rgba(11, 70, 42, 1);
			}
			.range {
				font-size: 28px;
				font-style: normal;
				font-weight: 500;
				line-height: 28px; /* 100% */
				text-align: center;
			}
		}
		.size_item::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 180px;
			height: 100%;
			background: radial-gradient(rgba(146, 233, 125, 0.355) 10%, rgba(10, 96, 62, 0.313) 70%);
			filter: blur(10px);
			border-radius: 50%;
			z-index: 0;
		}
	}
	.bet_number {
		display: grid;
		grid-gap: 6px;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		margin-bottom: 24px;
		.item {
			width: 170px;
			height: 152px;
			flex-shrink: 0;
			border-radius: 10px;
			border: 2px solid #ffe4a6;
			background: radial-gradient(50% 50% at 50% 50%, #ffeaab 0%, #f8c67d 100%);
			box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
			display: flex;
			flex-direction: column;
			text-align: center;
			color: #0b462a;
			position: relative;
			margin-bottom: 10px;

			.hot {
				position: absolute;
				right: 0;
				top: 0;
				width: 36px;
				height: 36px;
				background: url('@/assets/icons/home/AllLotteryGames/binguo/hot_top.png') no-repeat right top;
				background-size: 36px 36px;
			}
			.hot2 {
				position: absolute;
				right: -10px;
				top: -14px;
				width: 36px;
				height: 36px;
				background: url('@/assets/icons/home/AllLotteryGames/binguo/hot_top.png') no-repeat right top;
				background-size: 36px 36px;
			}

			div:nth-child(1) {
				height: 26px;
				padding-top: 10px;
				color: #0f6946;
				font-size: 26px;
				font-style: normal;
				font-weight: 400;
				line-height: 26px; /* 100% */
				margin-bottom: 16px;
			}

			div:nth-child(2) {
				font-size: 48px;
				font-style: normal;
				font-weight: 700;
				line-height: 48px; /* 100% */
			}
			div:nth-child(3) {
				font-size: 22px;
				font-style: normal;
				font-weight: 400;
				line-height: 22px; /* 100% */
			}
		}
	}
	.betAll {
		grid-gap: 4px;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(2, 1fr);
		.item {
			width: 84px;
			height: 120px;
		}
	}
	.alike {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 160px;
		background: #0f6946;
		border-radius: 12px;
		padding: 6px;
		margin-bottom: 24px;
		.alike_item {
			width: 100px;
			height: 140px;
			border-radius: 6px;
			font-size: 22px;
			.amount {
				height: 22px;
				margin-bottom: 8px;
				color: #0b462a;
				text-align: center;
				font-style: normal;
				font-weight: 400;
				line-height: 22px; /* 100% */
				padding-top: 4px;
			}
			.third_list {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;

				div {
					width: 42px !important;
					height: 42px !important;
					line-height: 42px;
					font-size: 30px;
					.ball2 {
						width: 42px !important;
						height: 42px !important;
						font-size: 30px;
						line-height: 42px;
					}
				}
			}
		}
		.alike_item:nth-child(2n) {
			background: #0a4529;
			.amount {
				color: #21855e;
			}
		}
	}
	.two_alike,
	.one_alike {
		.alike_item {
			width: 116px;
		}
	}

	.two_alike > .alike_item > .third_list {
		display: block;
		div {
			position: relative;
			width: 46px;
			height: 46px;
			font-size: 36px;
			line-height: 46px;
			z-index: 4;
			.ball_hot2 {
				top: -40%;
				height: 52% !important;
			}
			.ball2 {
				width: 46px !important;
				height: 46px !important;
				font-size: 30px;
				line-height: 46px;
			}
		}
		div:first-child {
			margin-left: 22px;
		}
		div:last-child {
			float: right;
			margin-right: 26px;
		}
	}

	.one_alike {
		.alike_item {
			position: relative;
			// .ball_hot {
			// 	position: absolute;
			// 	top: 10%;
			// 	left: 50%;
			// 	width: 42px;
			// 	height: 32px;
			// 	margin-left: -21px;
			// 	background: url('@/assets/icons/home/AllLotteryGames/binguo/hot_bg.png') no-repeat center;
			// 	background-size: 100% auto;
			// 	background-position: center top;
			// 	z-index: 2;
			// }
			.third_list {
				div {
					position: relative;
					width: 70px;
					height: 70px;
					line-height: 70px;
					font-size: 48px;
				}
			}
		}
	}

	.ball {
		width: 70px;
		height: 70px;
		margin: 2px;
		position: relative;
		.ball2 {
			width: 70px;
			height: 70px;
			position: absolute;
			z-index: 10;
			display: block;
			border-radius: 50%;
			background: linear-gradient(164deg, #febc59 14.91%, #ff820b 89.16%);
			box-shadow: 0px 2px 4px 0px #fff880 inset;
			text-align: center;
			line-height: 70px;
			color: #0f6946;
			font-size: 48px;
			font-style: normal;
			font-weight: 700;
		}
	}
	.ball::after {
		content: '';
		position: absolute;
		top: 24%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		background: radial-gradient(rgba(255, 255, 255, 0.673) 20%, rgba(10, 96, 62, 0.313) 90%);
		filter: blur(4px);
		border-radius: 50%;
	}
	.ball_hot2 {
		top: -32%;
		left: 50%;
		width: 58%;
		height: 46%;
		margin-left: -29%;
		background: url('@/assets/icons/home/AllLotteryGames/binguo/hot_bg.png') no-repeat center top;
		background-size: 100% auto;
		position: absolute;
		z-index: 1;
	}
}

.rule_tip_header {
	margin: auto;
	width: 304px;
	height: 186px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-wrap: wrap;
	margin-bottom: 30px;
	img {
		width: 88px;
		height: 88px;
		margin-bottom: 10px;
	}
}
.rule_tip_dialog {
	padding: 0 60px;

	.rule_tip_tit {
		color: #f9bc36;
		font-size: 36px;
		font-style: normal;
		font-weight: 700;
		line-height: 36px; /* 100% */
		text-align: center;
		margin-bottom: 25px;
	}
	.rule_tip_text {
		color: #f9bc36;
		text-align: center;
		font-size: 26px;
		font-style: normal;
		font-weight: 400;
		line-height: 42px; /* 92.308% */
	}
}
</style>
