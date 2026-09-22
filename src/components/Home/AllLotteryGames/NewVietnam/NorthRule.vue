<!-- 北部规则 -->
<template>
	<div class="NorthRule__C">
		<div class="NorthRule__C-title">{{ $t('northVieLotteryGameRules') }}</div>
		<div class="NorthRule__C-tips">{{ $t('precautions') }}</div>
		<div class="NorthRule__C-Content" v-for="(item, index) in ruleTop" :key="index">
			<div class="borderTopStyle">
				<span></span>
				<span></span>
			</div>
			<div class="title">{{ item.title }}</div>
			<div class="text">{{ item.sub }}</div>
		</div>
		<div class="table">
			<div class="table-row header-time">
				<div class="table-time-1">{{ $t('winTrxTime') }}</div>
				<div class="table-time-1">18:15</div>
			</div>
			<div class="table-row header-week">
				<div class="table-week-1">{{ $t('weeks') }}</div>
				<div class="table-week-1">{{ $t('northLotteryCities') }}</div>
			</div>
			<div class="table-row" v-for="(item, index) in lotteryAddress" :key="index">
				<div class="table-cell-1">{{ item.week }}</div>
				<div class="table-cell-1">{{ item.addressList }}</div>
			</div>
		</div>
		<div class="NorthRule__C-Content" v-for="(item, index) in ruleMod" :key="index">
			<div class="borderTopStyle">
				<span></span>
				<span></span>
			</div>
			<div class="title">{{ item.title }}</div>
			<div class="text">{{ item.sub }}</div>
			<div class="text" v-if="item.sub1">{{ item.sub1 }}</div>
			<div class="text" v-if="item.sub2">{{ item.sub2 }}</div>
		</div>
		<div class="NorthRule__C-Rule">{{ $t('northernLotteryGameRules') }}</div>
		<div class="NorthRule__C-Struct"><span class="left"></span>{{ $t('colorstructure') }}<span class="right"></span></div>
		<div class="table-rule">
			<div class="table-header">
				<div class="table-header-cell">{{ $t('Lottery') }}</div>
				<div class="table-header-cell">{{ $t('numberofPrizes') }}</div>
				<div class="table-header-cell">{{ $t('Number') }}</div>
			</div>
			<div class="table-row" v-for="(item, index) in lotteryNum" :key="index">
				<div class="table-cell">{{ item.title }}</div>
				<div class="table-cell">{{ item.quantity }}</div>
				<div class="table-cell">{{ item.number }}</div>
			</div>
		</div>
		<div class="table-rule">
			<div class="table-header">
				<div class="table-header-cell">{{ $t('sorthlotteryresult') }}</div>
			</div>
			<div :class="index == 8 ? 'table-box none' : 'table-box'" v-for="(item, index) in lotteryNum" :key="index">
				<div class="table-box-title" v-if="index != 8">{{ item.title }}</div>
				<div class="table-box-number" v-for="(citem, cindex) in item.drawsNumber" :key="cindex">{{ citem }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const ruleTop = reactive([
	{
		title: '01',
		sub: $t('resultsVielottery')
	},
	{
		title: '02',
		sub: $t('systemresult')
	},
	{
		title: '03',
		sub: $t('lotterytime')
	}
])

const ruleMod = reactive([
	{
		title: '04',
		sub: $t('oddsmiscalculated')
	},
	{
		title: '05',
		sub: $t('oddsbettingprincipal')
	},
	{
		title: '06',
		sub: $t('oddsfluctuate')
	},
	{
		title: '07',
		sub: $t('oncebetgenerated')
	},
	{
		title: '08',
		sub: $t('anyreasonCauses')
	},
	{
		title: '09',
		sub: $t('platformcancel'),
		sub1: $t('drawdelayedtoolong'),
		sub2: $t('resultsofthelotterybeenleaked')
	}
])

const lotteryAddress = reactive([
	{
		week: $t('Monday'),
		addressList: $t('Hanoi')
	},
	{
		week: $t('Tuesday'),
		addressList: $t('quangNinh')
	},
	{
		week: $t('Wednesday'),
		addressList: $t('bacninh')
	},
	{
		week: $t('Thursday'),
		addressList: $t('Hanoi')
	},
	{
		week: $t('Friday'),
		addressList: $t('haiphong')
	},
	{
		week: $t('Saturday'),
		addressList: $t('nanning')
	},
	{
		week: $t('Sunday'),
		addressList: $t('taiping')
	}
])
const lotteryNum = reactive([
	{
		title: $t('GrandPrize'),
		quantity: 1,
		number: $t('fivedigits'),
		drawsNumber: ['29818']
	},
	{
		title: $t('FirstPrize'),
		quantity: 1,
		number: $t('fivedigits'),
		drawsNumber: ['69388']
	},
	{
		title: $t('SecondPrize'),
		quantity: 2,
		number: $t('fivedigits'),
		drawsNumber: ['66992', '95797']
	},
	{
		title: $t('ThirdPrize'),
		quantity: 6,
		number: $t('fivedigits'),
		drawsNumber: ['99095', '32620', '51685', '12345', '69548', '69874']
	},
	{
		title: $t('FourPrize'),
		quantity: 4,
		number: $t('fourdigits'),
		drawsNumber: ['6545', '5257', '7896', '3682']
	},
	{
		title: $t('FivePrize'),
		quantity: 6,
		number: $t('fourdigits'),
		drawsNumber: ['4567', '8533', '7632', '7632', '6673', '7855']
	},
	{
		title: $t('SixPrize'),
		quantity: 3,
		number: $t('fourdigits'),
		drawsNumber: ['567', '642', '934']
	},
	{
		title: $t('SevenPrize'),
		quantity: 4,
		number: $t('seconddigits'),
		drawsNumber: ['48', '64', '32', '51']
	},
	{
		title: $t('intotal'),
		quantity: $t('lotteryawards'),
		number: ''
	}
])
</script>
<style lang="scss" scoped>
.NorthRule__C {
	width: 100%;
	background-color: var(--bg_color_L2);
	display: flex;
	flex-direction: column;
	&-title {
		font-size: 36px;
		font-weight: 700;
		color: var(--colorText-26);
		text-align: center;
	}
	&-tips {
		color: var(--text_color_L2);
		font-size: 28px;
		margin-top: 15px;
		margin-bottom: 33px;
		text-align: center;
	}

	&-Content {
		position: relative;
		padding: 43px 18px 25px;
		border: 1px solid var(--bgDark-2,var(--main-color));
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background: var( --darkBg,var(--bg_color_L2));
		margin-bottom: 32px;
		.borderTopStyle {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			span {
				position: absolute;
				top: 0px;
				&:first-of-type,
				&:last-of-type {
					width: 51px;
					height: 51px;
					border-top: 5px solid var(--bgDark-2,var(--main-color));
					&::after {
						content: '';
						position: absolute;
						top: 22px;
						left: 15px;
						width: 10px;
						height: 10px;
						background-color: var(--bgDark-2,var(--main-color));
						html:lang(ar) &{
							right: 15px;
							left: unset;
						}
					}
				}
				&:first-of-type {
					left: -1px;
					border-left: 5px solid var(--bgDark-2,var(--main-color));
					border-top-left-radius: 20px;
					html:lang(ar) &{
						right: -1px;
						left: unset;
					}
					&::after {
						border-radius: 50%;
					}
				}
				&:last-of-type {
					right: 0px;
					border-right: 5px solid var(--bgDark-2,var(--main-color));
					border-top-right-radius: 20px;
					html:lang(ar) &{
						right: unset;
						left: 0;
					}
					&::after {
						border-radius: 50%;
					}
				}
			}
		}
		&::after,
		&::before {
			content: '';
			display: block;
			position: absolute;
			top: -20px;
			width: 20px;
			height: 40px;
			background-color: var(--bgDark-2,var(--main-color));
			clip-path: polygon(50% 0%, 100% 0%, 50% 50%, 100% 100%, 50% 100%, 0% 50%);
			z-index: 5;
		}
		&::after {
			left: calc(50% - 90px);
			transform: translateX(-50%);
		}
		&::before {
			left: calc(50% + 90px);
			transform: translateX(-50%) rotate(180deg);
		}
		.title {
			position: absolute;
			top: -20px;
			left: 50%;
			transform: translateX(-50%);
			width: 160px;
			height: 40px;
			color: #fff;
			font-size: 24px;
			text-align: center;
			line-height: 40px;
			background-color: var(--bgDark-2,var(--main-color));
			clip-path: polygon(7% 0%, 93% 0%, 100% 50%, 93% 100%, 7% 100%, 0% 50%);
		}
		.text {
			margin: 0 20px;
			font-size: 24px;
			color: var(--text_color_L2);
		}
	}
	.table,
	.table-rule {
		display: flex;
		flex-direction: column;
		margin-bottom: 40px;
		background-color: var(--darkBg,var(--bg_color_L2));
		.table-row {
			display: flex;
			text-align: center;
			color: var(--text_color_L2);
			font-size: 26px;
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
			&.header-time {
				height: 100px;
				line-height: 100px;
				background: var(--main-color);
				text-align: center;
				color: var(--darkTextW,var(--bg_color_L2)) !important;
				font-size: 26px;
				border-radius: 0;
			}
			&.header-week {
				height: 66px;
				line-height: 66px;
				background: var(--norm_red-color);
				text-align: center;
				color: var(--darkTextW,var(--bg_color_L2)) !important;
				font-size: 26px;
				border-radius: 0;
			}
			.table-week-1,
			.table-time-1 {
				height: 66px;
				line-height: 66px;
				overflow: hidden;
				flex: 1;
				text-align: center;
			}
		}
		.table-row {
			display: flex;
			align-items: center;
			border: 1px solid var(--bgDark-2,var(--borderColor-5));
			border-top: none;
			margin-bottom: -1px;
			border-radius: 0;
			.table-cell-1 {
				height: 66px;
				line-height: 66px;
				flex: 1;
				border-right: 1px solid var(--bgDark-2,var(--borderColor-5));
			}
			.table-cell-2 {
				flex: 2;
				display: flex;
				flex-wrap: wrap;
				.table-column-1 {
					width: calc(100% / 2);
					height: 68px;
					line-height: 68px;
					border: 1px solid var(--bgDark-2,var(--borderColor-5));
					margin-left: -1px;
					margin-bottom: -1px;
					border-top: none;
					&:nth-child(2n) {
						border-right: none;
					}
				}
			}
		}
	}
	&-Rule {
		text-align: center;
		font-size: 36px;
		color: var(--colorText-26);
	}
	&-Struct {
		display: flex;
		flex-direction: row;
		text-align: center;
		font-size: 30px;
		color: var(--colorText-26);
		justify-content: space-evenly;
		margin-bottom: 30px;
		&::after,
		&::before {
			display: block;
			content: '';
			width: 110px;
			height: 2px;
			background: linear-gradient(90deg, var(--main-color) -2.73%, rgba(255, 113, 114, 0) 91.36%);
			border-radius: 20px;
			margin-top: 20px;
		}
		&::before {
			transform: matrix(-1, 0, 0, 1, 0, 0);
		}
	}
	.table-rule {
		display: flex;
		justify-content: center;
		margin-bottom: 40px;
		box-shadow:var(--BoxShadowColor-9);
		background-color: #fff;
		border-radius: 20px 20px 0 0;
		.table-header {
			border-radius: 20px 20px 0 0;
			height: 76px;
			background-color: var(--main-color);
			color: #fff;
			display: flex;
			align-items: center;
			text-align: center;
			.table-header-cell {
				flex: 1;
			}
		}
		.table-row {
			display: flex;
			.table-cell {
				height: 66px;
				line-height: 66px;
				flex: 1;
				border-right: 1px solid  var(--bgDark-2,var(--borderColor-5));
			}
		}
		.table-box {
			height: 66px;
			line-height: 66px;
			display: flex;
			border: 1px solid  var(--bgDark-2,var(--borderColor-5));
			border-top: none;
			text-align: center;
			&.none {
				display: none;
			}
			&-title {
				width: 180px;
			}
			&-number {
				flex: 1;
				border-left: 1px solid  var(--bgDark-2,var(--borderColor-5));
			}
		}
	}
}
</style>
