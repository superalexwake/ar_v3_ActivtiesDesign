<template>
	<div class="body-container">
		<div class="MyGameRecordList__C">
			<template v-for="(item, index) in mayrecord" :key="index">
				<div class="MyGameRecordList__C-item" @click="Emerd(index)">
					<div
						class="MyGameRecordList__C-item-l"
						:class="filterGameType(Number(item.gameType), item.selectType).className"
					>
						{{ computeSelectType(item.selectType) }}
					</div>
					<div class="MyGameRecordList__C_left">
						<div class="MyGameRecordList__C-item-m">
							<div class="MyGameRecordList__C-item-m-top">
								{{ item.issueNumber }}
							</div>
							<div class="MyGameRecordList__C-item-m-bottom">{{ item.addTime }}</div>
						</div>
						<div class="MyGameRecordList__C-item-r" :class="filterStateText(item.state, 2)">
							<div :class="filterStateText(item.state, 2)">
								{{ filterStateText(item.state, 1) }}
							</div>
							<span v-if="item.premium">{{ currency(item.profitAmount) }}</span>
						</div>
					</div>
				</div>
				<div v-if="index == showIndexRe" class="MyGameRecordList__C-detail">
					<div class="detail_title">{{$t('details')}}</div>
					<div class="detail_item">
						<div class="item_title">{{$t('orderNoMay')}}</div>
						<div class="item_result">
							{{ item.orderNumber }}
							<svg
								@click="copy(item.orderNumber)"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M6.5 6.2158V3.90625C6.5 3.1296 7.1296 2.5 7.90625 2.5H20.0938C20.8704 2.5 21.5 3.1296 21.5 3.90625V16.0938C21.5 16.8704 20.8704 17.5 20.0938 17.5H17.7582"
									stroke="#87C7AF"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M16.0938 6.5H3.90625C3.1296 6.5 2.5 7.1296 2.5 7.90625V20.0938C2.5 20.8704 3.1296 21.5 3.90625 21.5H16.0938C16.8704 21.5 17.5 20.8704 17.5 20.0938V7.90625C17.5 7.1296 16.8704 6.5 16.0938 6.5Z"
									fill="#87C7AF"
									stroke="#87C7AF"
									stroke-width="2"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</div>

					<div class="detail_item">
						<div class="item_title">{{$t('issueMay')}}</div>
						<div class="item_result">
							{{ item.issueNumber }}
							<svg
								@click="copy(item.issueNumber)"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M6.5 6.2158V3.90625C6.5 3.1296 7.1296 2.5 7.90625 2.5H20.0938C20.8704 2.5 21.5 3.1296 21.5 3.90625V16.0938C21.5 16.8704 20.8704 17.5 20.0938 17.5H17.7582"
									stroke="#87C7AF"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M16.0938 6.5H3.90625C3.1296 6.5 2.5 7.1296 2.5 7.90625V20.0938C2.5 20.8704 3.1296 21.5 3.90625 21.5H16.0938C16.8704 21.5 17.5 20.8704 17.5 20.0938V7.90625C17.5 7.1296 16.8704 6.5 16.0938 6.5Z"
									fill="#87C7AF"
									stroke="#87C7AF"
									stroke-width="2"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</div>

					<div class="detail_item">
						<div class="item_title">{{ $t('gamePlay') }}</div>
						<div class="item_result">
							{{ filterGameType(Number(item.gameType), item.selectType).playerName }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('amountMay')}}</div>
						<div class="item_result">
							{{ item.amount }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('multiple')}}</div>
						<div class="item_result">
							{{ item.figure }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('afterTaxAmount')}}</div>
						<div class="item_result">
							{{ item.realAmount }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('tax')}}</div>
						<div class="item_result">
							{{ item.serviceCharge || '-' }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('winTips3')}}</div>
						<div class="item_result">
							<div class="draw_num" :class="`${item.sumCount ? filterGameType(Number(item.gameType), item.selectType).className: ''}`">
								{{ item.sumCount || '-' }}
							</div>
							<div
								v-if="item.premium"
								class="draw_result"
								v-for="ite in item.premium.split('')"
							>
								{{ ite }}
							</div>
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{ $t('betting') }}</div>
						<div
							class="item_result item_bet"
							v-if="item.gameType === '2' || item.gameType === '1'"
							:class="`${filterGameType(Number(item.gameType), item.selectType).className}`"
						>
							{{ item.selectType }}
						</div>
						<div v-else class="item_result">
							<div
								class="item_result item_bet item_alike"
								:class="`${filterGameType(Number(item.gameType), item.selectType).className}`"
								v-for="ite in item.selectType.split('')"
							>
								{{ ite }}
							</div>
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('statusMay')}}</div>
						<div class="item_result" :class="filterStateText(item.state, 2)">
							{{ filterStateText(item.state, 1) }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('winOrLose')}}</div>
						<div class="item_result">
							{{ item.profitAmount ? currency(item.profitAmount) : '-' }}
						</div>
					</div>
					<div class="detail_item">
						<div class="item_title">{{$t('createTime')}}</div>
						<div class="item_result">
							{{ item.addTime }}
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useBinguoCount } from '@/hooks/useBinguoCount'
import { BinguoRecordList } from '@/types/api/interface/binguo'
import { currency, copy } from '@/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { filterGameType } = useBinguoCount()
withDefaults(defineProps<{ mayrecord: BinguoRecordList[] }>(), {})
// 展示详情
const showIndexRe = ref(-1)

// 点击展示详情
const Emerd = (index: number) => {
	if (showIndexRe.value == index) {
		showIndexRe.value = -1
	} else {
		showIndexRe.value = index
	}
}

const filterStateText = (state: number, type: number) => {
	if (type == 1) {
		switch (state) {
			case 0:
				return t('bettingResultState3')
			case 1:
				return t('hasWon')
			case 2:
				return t('bettingResultState1')
			case 3:
				return t('xosoTxt76')
			default:
				return ''
		}
	} else {
		switch (state) {
			case 0:
				return 'fail'
			case 1:
				return 'success'
			case 2:
				return 'wait'
			case 3:
				return 'ing'
			default:
				return 'ing'
		}
	}
}

const computeSelectType = (text: string) => {
	switch (text) {
		case 'Big':
			return t('big')
		case 'Drawn':
			return t('binguoHe')
		case 'Small':
			return t('small')

		default:
			return text
	}
}
</script>
<style lang="scss" scoped>
@import 'RecordList.scss';
</style>
