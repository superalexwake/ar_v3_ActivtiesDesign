<template>
	<div class="MyGameRecordList__C">
		<template v-for="(item, index) in mayrecord" :key="index">
			<div class="MyGameRecordList__C-item" @click.stop.prevent="Emerd(index)">
				<div class="MyGameRecordList__C-item-l" :class="['MyGameRecordList__C-item-l-' + colorClass(item.selectType)]">
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
					{{ $t('orderNoMay') }}
					<div @click="copy(item.orderNumber)">
						{{ item.orderNumber }}
						<svg-icon name="copy"/>
					</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('issueMay') }}
					<div>{{ item.issueNumber }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('amountMay') }}
					<div>{{ currency(item.amount) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('numMay') }}
					<div>{{ item.betCount }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('afterTaxAmount') }}
					<div class="red">{{ currency(item.realAmount) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('tax') }}
					<div>{{ currency(item.fee) }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('resultMay') }}
					<div class="numList" v-if="item.premium">
						<div v-for="(num, index) in item.premium" :key="index">{{ num }}</div>
					</div>
					<div v-else>--</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('selectMay') }}
					<div class="line1">
						<div>{{ gameText(item.gameType) }}</div>
						<div class="num" v-for="(selectItem, index) in item.selectType.split('|')" :key="index">
							{{ SelectText(selectItem) }}
						</div>
					</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('statusMay') }}
					<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
						{{ item.state ? $t('success') : $t('fail') }}
					</div>
					<div v-else>{{ $t('unsettled') }}</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('winOrLose') }}
					<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
						{{ `${item.state ? '+' : '-'} ${currency(item.profitAmount)}` }}
					</div>
					<div v-else>--</div>
				</div>
				<div class="MyGameRecordList__C-detail-line">
					{{ $t('createTime') }}
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
// 详情展开index
const showIndexRe = ref(-1)
/**
 * 游戏名字映射
 * @param index 映射参数
 */
const gameText = (index: number) => {
	return ['', 'A', 'B', 'C', 'D', 'E'][index]
}
/**
 * 映射縂投注名稱
 * @param name 映射名称
 */
const SelectText = (name: any) => {
	switch (name) {
		case 'L':
			return t('k3Small')
		case 'O':
			return t('k3Odd')
		case 'E':
			return t('k3Even')
		case 'H':
			return t('k3Big')
		default:
			return name
	}
}
/**
 * 展开详情时间
 * @param index 展示哪一行
 */
const Emerd = (index: number) => {
	if (showIndexRe.value == index) {
		showIndexRe.value = -1
	} else {
		showIndexRe.value = index
	}
}
// 转换文字
const changeText = (SelectType: String) => {
	switch (SelectType) {
		case 'E':
			return 'Even'
		case 'O':
			return 'Odd'
		case 'H':
			return 'Big'
		case 'L':
			return 'Small'
		default:
			// 多选（含 |）显示 Multi；单个号码原样
			return String(SelectType).includes('|') ? 'Multi' : SelectType
	}
}
// 色块背景：按玩法取色，取值与投注区一致
const colorClass = (selectType: string) => {
	const betMap: Record<string, string> = { H: 'big', L: 'small', O: 'odd', E: 'even' }
	if (betMap[selectType]) return betMap[selectType]
	// 多选号码：全奇红/全偶绿/混合红绿对角线
	if (selectType.includes('|')) {
		const nums = selectType.split('|').filter((v) => /^\d+$/.test(v)).map(Number)
		const hasOdd = nums.some((n) => n % 2 === 1)
		const hasEven = nums.some((n) => n % 2 === 0)
		if (hasOdd && hasEven) return 'multiMixed'
		return hasOdd ? 'multiOdd' : 'multiEven'
	}
	if (/^\d+$/.test(selectType)) return Number(selectType) % 2 === 0 ? 'evenNum' : 'oddNum'
	return ''
}

</script>
<style lang="scss" scoped>
@import '../MyGameRecord.scss';
// 大小沿用 MyGameRecord.scss 的 -big/-small（橙/蓝）
.MyGameRecordList__C-item-l {
	// 不设默认背景：--main-color 会同特异性覆盖 @import 的 -big/-small 色块
	&-odd,
	&-even {
		font-size: 24px;
	}
	&-odd,
	&-oddNum {
		background-color: var(--norm_red-color);
	}
	&-even,
	&-evenNum {
		background-color: var(--norm_green-color);
	}
	&-multiOdd,
	&-multiEven,
	&-multiMixed {
		font-size: 24px;
	}
	&-multiOdd {
		background-color: var(--norm_red-color);
	}
	&-multiEven {
		background-color: var(--norm_green-color);
	}
	&-multiMixed {
		background-image: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_green-color) 50%);
	}
}

.MyGameRecordList__C-detail-line .line1 {
	width: auto;
}
</style>
