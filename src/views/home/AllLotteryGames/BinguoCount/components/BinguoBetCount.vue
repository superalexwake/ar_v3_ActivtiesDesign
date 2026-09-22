<template>
	<div class="binguo_bet_count">
		<div class="bingtip_count_title">{{ $t('binguoLastIssue') }}</div>
		<div class="lately">
			<Table
				:column-options="columnOptions"
				:data-source="store.resultSumTrend.slice(0, 8)"
				rowHeight="40px"
				tabWidth="49.6%"
				tabHeight="100%"
				:border="false"
			>
				<template #number="{ item }">
					<div :class="`sum_column ${filterStyle(item.number)}`">{{ item.number }}</div>
				</template>
				<template #avgCount="{ item }">
					<div class="average_column">{{ item.avgCount }}</div>
				</template>
				<template #notOpenCount="{ item }">
					<div class="noaverage_column">{{ item.notOpenCount }}</div>
				</template>
			</Table>
			<Table
				:column-options="columnOptions"
				:data-source="store.resultSumTrend.slice(8, 16)"
				rowHeight="40px"
				tabWidth="49.6%"
				tabHeight="100%"
				:border="false"
			>
				<template #number="{ item }">
					<div :class="`sum_column ${filterStyle(item.number)}`">{{ item.number }}</div>
				</template>
				<template #avgCount="{ item }">
					<div class="average_column">{{ item.avgCount }}</div>
				</template>
				<template #notOpenCount="{ item }">
					<div class="noaverage_column">{{ item.notOpenCount }}</div>
				</template>
			</Table>
		</div>
		<!-- 进度条 -->
		<div class="progress_box">
			<div class="progress">
				<div class="tit">
					<span>{{ $t('small') }}</span>
					<div>
						{{$t('binguoAppeared')}}<span>{{ store.smallAndBigTrend?.smallCount }}</span>
					</div>
				</div>
				<van-progress
					:percentage="((store.smallAndBigTrend?.smallCount as number) / sumCount) * 100"
					stroke-width="10"
					track-color="#0A603E"
					color="#5DBA47"
				/>
			</div>
			<div class="progress">
				<div class="tit">
					<span>{{ $t('binguoHe') }}</span>
					<div>
						{{$t('binguoAppeared')}}<span>{{ store.smallAndBigTrend?.equalCount }}</span>
					</div>
				</div>
				<van-progress
					:percentage="((store.smallAndBigTrend?.equalCount as number) / sumCount) * 100"
					stroke-width="10"
					track-color="#0A603E"
					color="#F9BC36"
				/>
			</div>
			<div class="progress">
				<div class="tit">
					<span>{{ $t('k3Big') }}</span>
					<div>
						{{$t('binguoAppeared')}}<span>{{ store.smallAndBigTrend?.bigCount }}</span>
					</div>
				</div>
				<van-progress
					:percentage="((store.smallAndBigTrend?.bigCount as number) / sumCount) * 100"
					stroke-width="10"
					track-color="#0A603E"
					color="#5DBA47"
				/>
			</div>
		</div>

		<div class="bingtip_count_title">{{ $t('binguoThirdAlike') }}</div>
		<Table
			:column-options="thirdColumnOptions"
			:data-source="store.threeSameTrend"
			rowHeight="40px"
			tabWidth="100%"
			tabHeight="100%"
			:border="false"
			class="binguoCountTable"
		>
			<template #number="{ item }">
				<div class="alike_column">
					<div v-for="ite in (item.number + '').split('')" class="big">
						{{ ite }}
					</div>
				</div>
			</template>
		</Table>

		<div class="bingtip_count_title two_title">{{$t('binguoTwoAlike')}}</div>
		<Table
			:column-options="twoColumnOptions"
			:data-source="store.twoSameTrend"
			rowHeight="40px"
			tabWidth="100%"
			tabHeight="100%"
			:border="false"
			class="binguoCountTable"
		>
			<template #number="{ item }">
				<div class="alike_column">
					<div v-for="ite in (item.number + '').split('')" class="big">
						{{ ite }}
					</div>
				</div>
			</template>
		</Table>

	</div>
</template>
<script setup lang="ts">
import Table, { CustomTabColumn } from '@/components/table/index.vue'
import { useBinguoCount } from '@/hooks/useBinguoCount'
import { deepCopy } from '@/utils';
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n';

const { store, filterStyle } = useBinguoCount()

const {t} = useI18n()
const sumCount = computed(() => {
	if (store.smallAndBigTrend?.bigCount) {
		return store.smallAndBigTrend?.bigCount + store.smallAndBigTrend?.smallCount + store.smallAndBigTrend?.equalCount
	}
	return 0
})

const columnOptions = ref<CustomTabColumn[]>([
	{
		title: t('xosoTxt60'),
		key: 'number',
		isSlot: true,
		cusTdClass: 'sum_column'
	},
	{
		title: t('binguoAvgCount'),
		key: 'avgCount',
		isSlot: true
	},
	{
		title: t('binguoNotOpenCount'),
		key: 'notOpenCount',
		isSlot: true
	}
])

const thirdColumnOptions = ref<CustomTabColumn[]>([
	{
		title: t('numbersMatch'),
		key: 'number',
		isSlot: true,
		cusTdClass: 'sum_column'
	},
	{
		title: t('binguoOpenCount'),
		key: 'openCount',
		isSlot: false
	},
	{
		title: t('binguoAvgCount'),
		key: 'avgCount',
		isSlot: false
	},
	{
		title: t('binguoNotOpenCount'),
		key: 'notOpenCount',
		isSlot: false
	}
])

const twoColumnOptions = computed(() => {
	let arr = deepCopy(thirdColumnOptions.value)
	arr[0].title = t('sameNum')
	return arr
})

</script>
<style lang="scss" scoped>
@import '../style.scss';
.binguo_bet_count {
	padding-bottom: 32px;
	.lately {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}
	.sum_column {
		width: 48px;
		height: 48px;
		border-radius: 8px;
		text-align: center;
		line-height: 48px;
		margin: 8px 0;
	}
	.alike_column {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 10px;
		div {
			width: 48px;
			height: 48px;
			border-radius: 50%;
			line-height: 48px;
		}
	}
	.progress_box {
		margin-bottom: 64px;
	}
	.progress {
		margin-bottom: 30px;
		.tit {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			margin-bottom: 10px;
			span {
				font-size: 30px;
				font-style: normal;
				font-weight: 700;
				line-height: 30px; /* 100% */
			}
			div {
				font-weight: 400;
				span {
					font-weight: 700;
				}
			}
		}
	}
	.two_title {
		padding-top: 60px;
	}

	.average_column,
	.noaverage_column {
		color: #fff;
	}
	:deep(.tab_body) {
		border-bottom: 1px solid #0b462a;
	}
	:deep(.van-progress__pivot) {
		display: none;
	}
}
.binguoCountTable {
	:deep(.default_cell) {
		color: #fff;
	}
}
</style>
