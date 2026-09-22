<template>
	<div class="binguo_detail">
		<div class="bingtip_count_title">{{$t('binguoLast50')}}</div>

		<div class="result1">
			<div class="column_list" v-for="item in last50Result">
				<div v-for="ite in item" :class="`item ${filterStyle(ite)}`">{{ ite }}</div>
			</div>
		</div>

		<div class="bingtip_count_title">{{ $t('binguoLast50Record') }}</div>
		<div class="record_list">
			<div class="record_item" v-for="item in last50Record">
				<div v-for="ite in item" class="item">
					<div v-if="ite" :class="`${filterStyle(ite)}`">{{ ite }}</div>
					<div v-else></div>
				</div>
			</div>
		</div>

		<div class="bingtip_count_title">{{ $t('binguoRecordResult') }}</div>
		<Table
			:column-options="columnOptions"
			:data-source="last50RecordResult"
			rowHeight="30px"
			tabWidth="100%"
			hBgColor="linear-gradient(180deg, #0A603E 0%, #168055 100%)"
			tabHeight="100%"
			:border="true"
			hColor="#FFF880"
		>
			<template #issueNo_head>
				<div class="issueNo_head">
					<span class="issue_text">{{$t('betNumber')}}</span>
					<span class="issue_number">{{ $t('binguoNumber') }}</span>
				</div>
			</template>
			<template #num1_head>
				<div class="ball">1</div>
			</template>
			<template #num2_head>
				<div class="ball">2</div>
			</template>
			<template #num3_head>
				<div class="ball">3</div>
			</template>
			<template #num4_head>
				<div class="ball">4</div>
			</template>
			<template #num5_head>
				<div class="ball">5</div>
			</template>
			<template #num6_head>
				<div class="ball">6</div>
			</template>

			<template #issueNo="{ item }">
				<div class="issueNo_column">
					{{ item.issueNo }}
				</div>
			</template>

			<template #sum="{ item }">
				<div :class="`sum_column ${filterStyle(item.sum)}`">
					{{ item.sum }}
				</div>
			</template>

			<template #num1="{ item }">
				<div :class="`num_column num_column${item['num1']}`">
					<div v-for=" in item['num1']"></div>
				</div>
			</template>
			<template #num2="{ item }">
				<div :class="`num_column num_column${item['num2']}`">
					<div v-for=" in item['num2']"></div>
				</div>
			</template>
			<template #num3="{ item }">
				<div :class="`num_column num_column${item['num3']}`">
					<div v-for=" in item['num3']"></div>
				</div>
			</template>
			<template #num4="{ item }">
				<div :class="`num_column num_column${item['num4']}`">
					<div v-for=" in item['num4']"></div>
				</div>
			</template>
			<template #num5="{ item }">
				<div :class="`num_column num_column${item['num5']}`">
					<div v-for=" in item['num5']"></div>
				</div>
			</template>
			<template #num6="{ item }">
				<div :class="`num_column num_column${item['num6']}`">
					<div v-for=" in item['num6']"></div>
				</div>
			</template>
		</Table>
	</div>
</template>
<script setup lang="ts">
import Table, { CustomTabColumn } from '@/components/table/index.vue'
import { ref } from 'vue'
import { useBinguoCount } from '../../../../../hooks/useBinguoCount'
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
const columnOptions = ref<CustomTabColumn[]>([
	{
		title: t('betNumber'),
		key: 'issueNo',
		isSlotHeader: true,
		isSlot: true,
		width: '28%'
	},
	{
		title: '1',
		key: 'num1',
		isSlotHeader: true,
		isSlot: true,
		width: '10%'
	},
	{
		title: '2',
		key: 'num2',
		isSlotHeader: true,
		isSlot: true,
		width: '10%'
	},
	{
		title: '3',
		key: 'num3',
		isSlotHeader: true,
		isSlot: true,
		width: '10%'
	},
	{
		title: '4',
		key: 'num4',
		isSlotHeader: true,
		isSlot: true,
		width: '10%'
	},
	{
		title: '5',
		key: 'num5',
		isSlotHeader: true,
		isSlot: true,
		width: '10%'
	},
	{
		title: '6',
		key: 'num6',
		isSlotHeader: true,
		isSlot: true,
		width: '10%'
	},
	{
		title: t('gameRecordTotal'),
		key: 'sum',
		isSlot: true,
		width: '10%'
	}
])

const { filterStyle, last50Result, last50Record, last50RecordResult } = useBinguoCount()
</script>
<style lang="scss" scoped>
@import '../style.scss';

.binguo_detail {
	padding-bottom: 58px;
	.result1 {
		height: 360px;
		background: #0a603e;
		display: flex;
		flex-direction: row;
		padding: 20px 24px;
		border-radius: 12px;
		margin-bottom: 40px;
		.column_list {
			width: 52px;
			display: flex;
			margin-right: 15px;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			.item {
				position: relative;
				width: 52px;
				height: 52px;
				border-radius: 8px;
				text-align: center;
				line-height: 52px;
			}
			.item::after {
				content: '';
				position: absolute;
				bottom: -15px;
				left: 50%;
				width: 1px;
				height: 15px;
				border-radius: 8px;
				background: #5dba47;
				z-index: 1;
			}
			.item:last-child {
				&::after {
					content: '';
					position: absolute;
					width: 0;
					height: 0;
				}
			}
		}
		.column_list:nth-child(odd) {
			.item:first-child {
				z-index: 2;
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: -15px;
					width: 15px;
					height: 1px;
					border-radius: 8px;
					background: #5dba47;
					z-index: 1;
				}
			}
			.item:last-child {
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					right: -15px;
					width: 15px;
					height: 1px;
					border-radius: 8px;
					background: #5dba47;
					z-index: 1;
				}
			}
		}
		.column_list:last-child {
			.item:first-child {
				&::before {
					content: '';
					position: absolute;
					top: 50%;
					right: -15px;
					width: 15px;
					height: 1px;
					border-radius: 8px;
					background: #5dba47;
					z-index: 1;
				}
			}
		}
	}
	.record_list {
		display: grid;
		background: #0a603e;
		grid-template-columns: repeat(10, 1fr);
		border-radius: 10px;
		margin-bottom: 40px;
		.record_item {
			display: flex;
			flex-direction: column;
			align-items: center;
			border-right: 1px solid #0b462a;
			.item {
				width: 100%;
				position: relative;
				height: 70px;
				border-bottom: 1px solid #0b462a;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				div {
					width: 54px;
					height: 54px;
					border-radius: 10px;
					text-align: center;
					line-height: 54px;
				}
			}
			.item:last-child {
				border-bottom: none;
			}
		}
	}
	.issueNo_column {
		color: #fff;
		font-size: 22px;
	}
	.sum_column {
		width: 48px;
		height: 48px;
		border-radius: 10px;
		line-height: 48px;
	}
	.num_column {
		width: 64px;
		height: 40px;
		border-radius: 8px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		div {
			width: 16px;
			height: 16px;
			border-radius: 50%;
			margin: 0 2px;
			background: #0B462A;
		}
	}
	.num_column1 {
		background-color: #87c7af;
	}
	.num_column2 {
    background-color: #5DBA47;
  }
	.num_column3 {
    background-color: #0B462A;
  }
	.issueNo_head {
		width: 180px;
		height: 100px;
		position: relative;
		color: #f9bc36;
		font-size: 26px;
		// background: linear-gradient(to bottom left, transparent 49%, #0B462A 51%, #0B462A 50%, transparent 52%);
		.issue_text {
			position: absolute;
			left: 55%;
			top: 10px;
		}
		.issue_number {
			position: absolute;
			left: 10%;
			top: 50px;
		}
	}
	.issueNo_head::before {
		content: '';
		position: absolute;
		top: 50px;
		left: -10px;
		width: 214px;
		height: 1px;
		background-color: #0b462a;
		transform: rotate(28deg); /*这里需要自己调整，根据线的位置*/
		transform-origin: top;
	}
}
.ball {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background: linear-gradient(164deg, #febc59 14.91%, #ff820b 89.16%);
	box-shadow: 0px 2px 4px 0px #fff880 inset;
	text-align: center;
	line-height: 50px;
	color: #0f6946;
	font-size: 32px;
	font-style: normal;
	font-weight: 700;
	position: relative;
	z-index: 2;
	margin: auto;
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
	z-index: 1;
}

</style>
