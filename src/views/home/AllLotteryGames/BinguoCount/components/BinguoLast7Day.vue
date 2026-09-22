<template>
	<div class="last7Day_container">
    <div class="bingtip_count_title">{{$t('binguoLast7Result')}}</div>
		<Table :column-options="columnOptions" :data-source="store.last7Day" rowHeight="40px" tab-height="1200px">
			<template #issueEndTime="{ item }">
				<div class="column_time">{{ item.issueEndTime }}</div>
			</template>
			<template #time_index_0="{ item }">
				<div class="result" v-if="item.time_index_0">
					<div class="quan">
						<div v-for="ite in item.time_index_0?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_0?.resultSum)">{{ item.time_index_0?.resultSum }}</div>
				</div>
			</template>
			<template #time_index_1="{ item }">
				<div class="result" v-if="item.time_index_1">
					<div class="quan">
						<div v-for="ite in item.time_index_1?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_1?.resultSum)">{{ item.time_index_1?.resultSum }}</div>
				</div>
			</template>
			<template #time_index_2="{ item }">
				<div class="result" v-if="item.time_index_2">
					<div class="quan">
						<div v-for="ite in item.time_index_2?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_2?.resultSum)">{{ item.time_index_2?.resultSum }}</div>
				</div>
			</template>
			<template #time_index_3="{ item }">
				<div class="result" v-if="item.time_index_3">
					<div class="quan">
						<div v-for="ite in item.time_index_3?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_3?.resultSum)">{{ item.time_index_3?.resultSum }}</div>
				</div>
			</template>
			<template #time_index_4="{ item }">
				<div class="result" v-if="item.time_index_4">
					<div class="quan">
						<div v-for="ite in item.time_index_4?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_4?.resultSum)">{{ item.time_index_4?.resultSum }}</div>
				</div>
			</template>
			<template #time_index_5="{ item }">
				<div class="result" v-if="item.time_index_5">
					<div class="quan">
						<div v-for="ite in item.time_index_5?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_5?.resultSum)">{{ item.time_index_5?.resultSum }}</div>
				</div>
			</template>
			<template #time_index_6="{ item }">
				<div class="result" v-if="item.time_index_6">
					<div class="quan">
						<div v-for="ite in item.time_index_6?.result.split('')">{{ ite }}</div>
					</div>
					<div class="result_sum" :class="filterStyle(item.time_index_6?.resultSum)">{{ item.time_index_6?.resultSum }}</div>
				</div>
			</template>
		</Table>
	</div>
</template>
<script setup lang="ts">
import Table from '@/components/table/index.vue'
import { useBinguoCount } from '@/hooks/useBinguoCount'

const { store, columnOptions, filterStyle } = useBinguoCount()
</script>
<style lang="scss" scoped>
@import '../style.scss';

.last7Day_container {
  padding-bottom: 30px;
}
.result {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
	.quan {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
    margin-bottom: 4px;
		div {
			width: 26px;
			height: 26px;
			border-radius: 50%;
			border: 1px solid #87c7af;
			color: #fff;
			text-align: center;
			font-size: 22px;
			font-style: normal;
			font-weight: 400;
			line-height: 22px; /* 100% */
		}
   
	}
  .result_sum {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }
}
</style>
