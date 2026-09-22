<template>
	<div
		class="cuTable"
		:style="{
			...(scroll && {
				overflowX: 'auto'
			}),
			...(!scroll && {
				overflow: 'hidden'
			})
		}"
	>
		<div class="t-table_border">
			<table class="t-table_th_round">
				<tr class="tab_header">
					<th
						v-for="(item, index) in columnOptions"
						:style="{ width: item.width || (100 / columnOptions.length + '%') }"
						:key="index + 'p'"
						:class="`th_${item.key}_${index} default_header_cell ${border ? '' : 'noBorder'}`"
					>
						<div class="tab_default_cell" v-if="!item.isSlotHeader">{{ item.title }}</div>
						<slot v-else :name="item.key + '_head'" :item="item"></slot>
					</th>
				</tr>
				<tr
					class="tab_body"
					v-show="dataSource && dataSource.length > 0"
					v-for="(item, index) in dataSource"
					:key="index + 'p1'"
				>
					<td
						v-for="(ite, idx) in columnOptions"
						:key="idx + 'p2'"
						:class="`td_${ite.key} default_cell ${ite.cusTdClass || ''} ${border ? '' : 'noBorder'}`"
						:style="{ width: ite.width }"
					>
						<div class="tab_default_cell">
							<span v-if="!ite.isSlot">{{ item[ite.key] }}</span>
							<slot :name="ite.key" :item="item"></slot>
						</div>
					</td>
				</tr>

				<tr v-if="dataSource.length === 0">
					<td :colspan="columnOptions.length">
						<slot name="empty">
							<div style="color: #666; font-size: 14px; padding: 6px; text-align: center">暂无数据</div>
						</slot>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { ref, watch } from 'vue'

interface CustomTabProps {
	dataSource: any[]
	columnOptions: CustomTabColumn[]
	headerClass?: string
	bodyClass?: string
	isLockHeader?: boolean | false
	border?: boolean | true
	scroll?: boolean | true
	borderColor?: string | '#0B462A'
	hBgColor?: string
	hColor?: string | '#F9BC36'
	align?: string
	rowHeight?: string
	rowBgColor?: string | '#09613E'
	tabWidth?: string
	tabHeight?: string
}

export interface CustomTabColumn {
	title: string
	key: string
	width?: string
	align?: string
	isSlotHeader?: boolean | false
	isSlot?: boolean
	isLockColumn?: boolean | false
	cusTdClass?: string
}

const list = ref<any[]>([])

const props = withDefaults(defineProps<CustomTabProps>(), {
	align: 'center',
	hBgColor: 'linear-gradient(180deg, #0A603E 0%, #168055 100%)',
	hColor: '#F9BC36',
	border: true,
	scroll: true,
	borderColor: '#0B462A',
	rowHeight: 'auto',
	rowBgColor: '#09613E',
	tabWidth: '100%',
	tabHeight: '600px'
})

const { rowBgColor, align, hBgColor, rowHeight } = props

const initData = () => {
	list.value = JSON.parse(JSON.stringify(props.dataSource))
}

const lockElement = () => {
	props.columnOptions.forEach((item, index) => {
		if (item.isLockColumn) {
			let th = document.querySelector(`.th_${item.key}_${index}`) as HTMLElement
			let td = document.querySelectorAll(`.td_${item.key}`) as NodeListOf<HTMLElement>
			th.style.position = 'sticky'
			th.style.top = '-2px'
			th.style.left = '0'
			th.style.zIndex = '11'
			td.forEach((el) => {
				el.style.position = 'sticky'
				el.style.left = '0'
				el.style.zIndex = '10'
			})
		}
	})
}

onMounted(() => {
	lockElement()
}),
	watch(
		() => props.dataSource,
		(newVal, oldVal) => {
			if (newVal !== oldVal) {
				initData()
				lockElement()
			}
		},
		{ deep: true }
	)
</script>
<style lang="scss" scoped>
.cuTable {
	width: v-bind(tabWidth);
	overflow: auto;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
	margin: auto;
	height: v-bind(tabHeight);
	// background-color: #09613e;
}
table {
	max-height: 1200px;
	margin: auto;
	border-spacing: 0;
	position: relative;
}

.t-table_border {
	table {
		width: 100%;
		margin: auto;
		border-spacing: 0;
	}
	.tab_header {
		width: 100%;
		position: sticky;
		top: -1px;
		z-index: 12;
		height: 60px;
		transform: translate3d(0, 0, 0);
		height: 100px;
	}

	.tab_body {
			height: v-bind(rowHeight);
	}

	table tr > th {
		text-align: center;
		border: 1px solid var(--LotteryBingoTextColor);
		padding: 4px;
		text-align: center;
		vertical-align: middle;
	}
	table tr > th:nth-child(2n) {
		border-right: none;
		border-left: none;
	}
	table tr > th:last-child(2n) {
		border-right: 1px solid var(--LotteryBingoTextColor);
	}

	table tr > th:first-child {
		border-left: none;
	}

	table tr > td {
		text-align: center;
		border: 1px solid var(--LotteryBingoTextColor);
		border-top: none;
		padding: 4px;
		text-align: center;
		vertical-align: middle;
	}
	table tr > td:nth-child(2n) {
		border-right: none;
		border-left: none;
	}

	table tr > td:last-child {
		// border-right: none;
	}

	table tr > td:first-child {
		border-left: none;
	}
}
.default_cell {
	text-align: v-bind(align);
	background: v-bind(rowBgColor);
	height: 100%;
	box-sizing: border-box;
}
.default_header_cell {
	text-align: v-bind(align);
	color: v-bind(hColor);
	background: v-bind(hBgColor);
	height: 100%;
}
.tab_default_cell {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
.bodyClass {
	color: var(--textW);
}
.noBorder {
	border: none !important;
}
</style>
