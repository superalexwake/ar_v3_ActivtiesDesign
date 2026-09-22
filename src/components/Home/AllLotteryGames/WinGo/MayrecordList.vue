<template>
	<div class="MyGameRecordList__C">
		<template v-for="(item, index) in mayrecord" :key="index">
			<div class="MyGameRecordList__C-item" @click.stop.prevent="Emerd(index)">
				<div class="MyGameRecordList__C-item-l" :class="['MyGameRecordList__C-item-l-' + item.selectType]">
					{{ changeText(item.selectType) }}
				</div>
				<div class="MyGameRecordList__C-item-m">
					<div class="MyGameRecordList__C-item-m-top">
						{{ item.issueNumber }}
					</div>
					<div class="MyGameRecordList__C-item-m-bottom">{{ item.addTime }}</div>
				</div>
				<div v-if="item.profitAmount" class="MyGameRecordList__C-item-r" :class="{ success: item.state }">
					<div v-if="item.profitAmount" :class="{ success: item.state }">
						{{ item.state ? $t('success') : $t('fail') }}
					</div>
					<span>{{ `${item.state ? '+' : '-'}${currency(item.profitAmount)}` }}</span>
				</div>
			</div>
			<div v-if="index == showIndexRe" class="MyGameRecordList__C-detail">
				<div class="MyGameRecordList__C-detail-text">{{ $t('detailMay') }}</div>
				<div class="MyGameRecordList__C-detail-line" v-if="item.orderNumber">
					<span>{{ $t('orderNoMay') }}</span>
					<div @click="copy(item.orderNumber)">
						{{ item.orderNumber }}
						<svg-icon name="copy" />
					</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('issueMay') }}</span>
					<div>{{ item.issueNumber }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('amountMay') }}</span>
					<div>{{ currency(item.amount) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('numMay') }}</span>
					<div>{{ item.betCount }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('afterTaxAmount') }}</span>
					<div class="red">{{ currency(item.realAmount) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('tax') }}</span>
					<div>{{ currency(item.fee) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('resultMay') }}</span>
					<div v-if="item.number">
						<div class="MyGameRecordList__C-inlineB">{{ item.number }}</div>
						<div class="MyGameRecordList__C-inlineB" :class="[cssTextColor(Number(item.number))]">
							{{ changeTextColor(Number(item.number)) }}
						</div>
						<div class="MyGameRecordList__C-inlineB purpleColor" v-if="item.number == 0 || item.number == 5">
							{{ $t('purpleColor') }}
						</div>
						<div class="MyGameRecordList__C-inlineB" :class="[Number(item.number) > 4 ? 'big' : 'small']">
							{{ Number(item.number) > 4 ? $t('big') : $t('small') }}
						</div>
					</div>
					<div v-else>--</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('selectMay') }}</span>
					<div>{{ changeTextSelect(item.selectType) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('statusMay') }}</span>
					<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
						{{ item.state ? $t('success') : $t('fail') }}
					</div>
					<div v-else>{{ $t('k3RecordDesc9') }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('winOrLose') }}</span>
					<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
						{{ `${item.state ? '+' : '-'} ${currency(item.profitAmount)}` }}
					</div>
					<div v-else>--</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					<span>{{ $t('createTime') }}</span>
					<div>{{ item.addTime }}</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { currency, copy } from '@/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{ mayrecord: any[] }>(), {})
// 展示详情
const showIndexRe = ref(-1)
// 转换文字
const changeText = (SelectType: String) => {
	switch (SelectType) {
		case 'big':
			return 'big'
		case 'green':
		case 'red':
		case 'violet':
			return ''
		default:
			return SelectType
	}
}
// 转换颜色文字
const changeTextColor = (num: number) => {
	const m = num % 2
	switch (m) {
		case 1:
			return t('greenColor')
		default:
			return t('redColor')
	}
}
// 转换class名
const cssTextColor = (num: number) => {
	const m = num % 2
	switch (m) {
		case 1:
			return 'greenColor'
		default:
			return 'redColor'
	}
}
// 转换选择文字
const changeTextSelect = (text: String) => {
	switch (text) {
		case 'small':
			return t('small')
		case 'big':
			return t('big')
		case 'green':
			return t('green')
		case 'violet':
			return t('purpleColor')
		case 'red':
			return t('redColor')
		default:
			return text
	}
}
// 点击展示详情
const Emerd = (index: number) => {
	if (showIndexRe.value == index) {
		showIndexRe.value = -1
	} else {
		showIndexRe.value = index
	}
}
</script>
<style lang="scss" scoped>
@import '../MyGameRecord.scss';
</style>
