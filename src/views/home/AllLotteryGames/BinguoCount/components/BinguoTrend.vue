<template>
	<div class="trend_container">
		<div class="trend_header">
			<div class="trend_header_title">
				{{ $t('binguoLately') }}<span>7</span>{{ $t('days') }}<br />
				{{ $t('binguoQian') }}<span>100</span>{{ $t('binguoMin') + $t('binguoPaimin') }}
			</div>

			<img src="@public/home/AllLotteryGames/binguo/trend1.png" class="trend1" alt="" />
			<img src="@public/home/AllLotteryGames/binguo/trend2.png" class="trend2" alt="" />
		</div>

		<div class="trend_table">
			<div class="trend_tip">
				<div class="tip_text">
					{{ !store.isTrend ? $t('binguoNotBoard') : $t('binguoMyLead') }} <br v-if="!store.isTrend" />
					{{ !store.isTrend ? $t('binguoGoPlay') : '' }}
				</div>

				<div class="trend_go" @click="goBet">
					{{ store.isTrend ? store.userRank : 'GO' }}
					<span v-if="store.isTrend">{{ $t('binguoMin') }}</span>
				</div>
			</div>

			<Table
				:column-options="columnOptions"
				:data-source="store.trendList"
				rowHeight="50px"
				tabWidth="100%"
				hBgColor="linear-gradient(180deg, #13AB62 0%, #0F6946 100%)"
				tabHeight="100%"
				:border="false"
				hColor="#FFF880"
			>
				<template #rankID="{ item }">
					<div class="rankID_column" :class="`${item.rankID < 4 ? 'top_' + item.rankID : 'rank_text'}`">
						{{ item.rankID > 3 ? item.rankID : '' }}
					</div>
				</template>
				<template #userName="{ item }">
					<div class="custom_column">
						{{ item.userName }}
					</div>
				</template>
				<template #winAmount="{ item }">
					<div class="custom_column winmount_column">
						{{ currency(item.winAmount) }}
					</div>
				</template>
			</Table>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useBinguoCount } from '@/hooks/useBinguoCount'
import Table, { CustomTabColumn } from '@/components/table/index.vue'
import { currency } from '@/utils'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { store } = useBinguoCount()
const { t } = useI18n()

const columnOptions = ref<CustomTabColumn[]>([
	{
		title: 'Top',
		key: 'rankID',
		isSlot: true,
		width: '20%',
		cusTdClass: 'rankID_column'
	},
	{
		title: t('account'),
		key: 'userName',
		width: '38%',
		isSlot: true
	},
	{
		title: t('winningAmount'),
		width: '42%',
		key: 'winAmount',
		isSlot: true
	}
])

const router = useRouter()

const goBet = () => {
	if (!store.isTrend) router.back()
}
</script>
<style lang="scss" scoped>
.trend_container {
	padding-top: 45px;
	.trend_header {
		width: 100%;
		height: 246px;
		position: relative;
		.trend_header_title {
			padding-left: 24px;
			color: #5dba47;
			font-size: 36px;
			font-style: normal;
			font-weight: 700;
			line-height: 36px; /* 100% */
			span {
				color: #fffbbb;
				font-size: 36px;
				font-style: normal;
				font-weight: 700;
				line-height: 50px;
			}
		}
		.trend_header_title::before {
			content: '';
			position: absolute;
			top: 2%;
			left: 0;
			width: 6px;
			height: 36px;
			border-radius: 30px;
			background: #feb320;
		}

		.trend1 {
			width: 241px;
			height: 215px;
			position: absolute;
			right: 78px;
			top: -35px;
			z-index: 2;
		}
		.trend2 {
			width: auto;
			height: 250px;
			position: absolute;
			right: -24px;
			top: 140px;
			z-index: 1;
		}
	}
	.trend_table {
		position: relative;
		.trend_tip {
			position: relative;
			z-index: 3;
			width: 100%;
			height: 220px;
			background: url('@/assets/icons/home/AllLotteryGames/binguo/trend3.png') no-repeat center;
			background-size: auto 218px;
			font-size: 32px;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			white-space: wrap;
			.tip_text {
				width: 400px;
				text-align: center;
			}
			.trend_go {
				position: absolute;
				right: 12px;
				top: 50%;
				width: 144px;
				height: 150px;
				margin-top: -75px;
				background: url('@/assets/icons/home/AllLotteryGames/binguo/trend_go.png') no-repeat center;
				background-size: 144px 150px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 64px;
				color: #d10000;
				vertical-align: baseline;
				span {
					margin-top: 22px;
					font-size: 24px;
				}
			}
		}
	}
}
$list: 1 2 3;
.rankID_column {
	width: 100px;
	height: 80px;
	background-size: 80px 80px;
	background-repeat: no-repeat;
	background-position: center;

	@each $i in $list {
		&.top_#{$i} {
			background-image: url('@/assets/icons/home/AllLotteryGames/binguo/top_#{$i}.png');
		}
	}
	&.rank_text {
		background: linear-gradient(180deg, #fff 0%, #ffa854 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.01);
		font-size: 36px;
		font-style: normal;
		font-weight: 900;
		line-height: 80px; /* 100% */
	}
}

.custom_column {
	color: #fff;
	font-size: 28px;
}
.winmount_column {
	background: linear-gradient(270deg, #5ece49 0%, #34c089 100%);
	height: 50px;
	padding: 0 38px;
	line-height: 50px;
	text-align: center;
	border-radius: 58px;
	min-width: 250px;
}
:deep(.tab_body):nth-child(odd) {
	background-color: #038d5a !important;
}
:deep(.tab_body):nth-child(even) {
	background-color: #007e50 !important;
}
:deep(.default_cell) {
	background: none;
}
:deep(.cuTable) {
	margin-top: -8px;
	width: calc(100% + 48px);
	margin-left: -24px;
}
</style>
