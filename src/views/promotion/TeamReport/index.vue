<template>
	<div class="TeamReport__C">
		<NavBar class="white" :title="$t('subordinateD')" left-arrow @click-left="onClick" />
		<div class="TeamReport__C-head">
			<div class="TeamReport__C-head-fixed">
				<SearchBar :placeholder="$t('searchSubUID')" v-model:value="userId" @handleSearch="handleChangeUserId" />
				<div class="TeamReport__C-head-line2">
					<div @click="showLevel = true">
						<span v-if="lvName" class="default">{{ lvName }}</span>
						<span v-else>{{ $t('subGrade') }}</span>
						<van-icon name="arrow-down" />
					</div>
					<div @click="showDataPick = true">
						<span v-if="showDate" class="default">{{ showDate }}</span>
						<span v-else>{{ $t('pickDate') }}</span>
						<van-icon name="arrow-down" />
					</div>
				</div>
			</div>
		</div>
		<div class="TeamReport__C-body">
			<div class="header-container">
				<div>
					<div class="num">{{ dataList.recahrgeCount }}</div>
					<div>{{ $t('rechargeNumber') }}</div>
				</div>
				<div>
					<div class="num">{{ dataList.recahrgeAmountSum }}</div>
					<div>{{ $t('rechageAmount') }}</div>
				</div>
				<div>
					<div class="num">{{dataList.betCountSum }}</div>
					<div>{{ $t('numberbettors')}}</div>
				</div>
				<div>
					<div class="num">{{dataList.betAmountSum }}</div>
					<div> {{$t('betAmount')}} </div>
				</div>
				<div>
					<div class="num">{{dataList.firstRecahrgeCount }}</div>
					<div>{{ $t('firstRechargesC') }}</div>
				</div>
				<div>
					<div class="num">{{dataList.firstRecahrgeAmountSum }}</div>
					<div>{{ $t('firstDepositAmount')}}</div>
				</div>
			</div>
			<List
				:api="getTeamDayReport"
				v-model:list="reportList"
				v-model:page-query="pageQuery"
				ref="listRef"
				:isAutoLoad="true"
				@pageChange="setdata"
			>
				<template #content>
					<div v-for="(item, index) in reportList" :key="index" class="TeamReport__C-body-item">
						<div class="TeamReport__C-body-item-head">
							<div class="title">UID:{{ item.userID }}</div>
							<svg-icon @click.stop="copy(item.userID.toString())" name="copy" />
							<!-- <div class="TeamReport__C-body-item-head-btn" @click="goDetail(item)">{{ $t('viewDetail') }}</div> -->
						</div>
						<div class="TeamReport__C-body-item-detail">
							<div class="TeamReport__C-body-item-detail-lv">
								{{ $t('friendsGrade') }}<span>{{ item.lv }}</span>
							</div>
							<div class="TeamReport__C-body-item-detail-commission">
								{{ $t('rechageAmount') }}<span>{{ item.rechargeAmount }}</span>
							</div>
							<div class="TeamReport__C-body-item-detail-commission" v-show="item.lotteryAmount">
								{{ $t('betAmounts') }}<span>{{ item.lotteryAmount }}</span>
							</div>
							<div class="TeamReport__C-body-item-detail-commission">
								{{ $t('commissionAmount') }}<span>{{ item.rebateAmount }}</span>
							</div>
							<div class="TeamReport__C-body-item-detail-time">
								{{ $t('time') }}<span>{{ item.searchTime }}</span>
							</div>
						</div>
					</div>
				</template>
			</List>
		</div>
		<van-popup v-model:show="showDataPick" round position="bottom">
			<van-date-picker
				v-model="currentDate"
				@cancel="showDataPick = false"
				@confirm="closeDatePicker"
				:title="$t('pickDate')"
				:min-date="minDate"
				:max-date="maxDate"
			/>
		</van-popup>
		<van-popup v-model:show="showLevel" round position="bottom">
			<van-picker
				:columns-field-names="customFieldName"
				:columns="selectList"
				@cancel="showLevel = false"
				@confirm="onItemClickTime"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, unref } from 'vue'
import { getTeamDayReport } from '@/api'
import { useRouter } from 'vue-router'
import { dateRange, copy, formatTimeDay } from '@/utils'
import type { ReqTeamDayReportList } from '@/types/api'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import List from '@/components/common/ListSimply.vue'
import SearchBar from '@/components/SearchBar/index.vue'

import { useKeepPage } from '@/hooks/useKeepPage'
useKeepPage(['TeamReport-TeamReportDetail'])

const { t } = useI18n()
const router = useRouter()
const listRef = ref()

// 静态变量
const selectList = ref([
	{
		name: t('all'),
		code: -1
	},
	{
		name: t('teamReportLeval1'),
		code: 1
	},
	{
		name: t('teamReportLeval2'),
		code: 2
	},
	{
		name: t('teamReportLeval3'),
		code: 3
	},
	{
		name: t('teamReportLeval4'),
		code: 4
	},
	{
		name: t('teamReportLeval5'),
		code: 5
	},
	{
		name: t('teamReportLeval6'),
		code: 6
	}
])
const customFieldName = {
	text: 'name',
	value: 'code'
}
interface dataTs {
	betCountSum: number;
	betAmountSum: number;
	firstRecahrgeCount: number;
    firstRecahrgeAmountSum: number;
	recahrgeCount: number;
    recahrgeAmountSum: number;
    rebateAmountSum: number;
}
let dataList = reactive<dataTs>({
	betCountSum:0,	//充值人数
	betAmountSum: 0, //充值金额
	firstRecahrgeCount:0, //首充人数
	firstRecahrgeAmountSum:0, //首充金额
	recahrgeCount:0, //下注人数
	recahrgeAmountSum:0, //下注金额
	rebateAmountSum:0, //返佣总金额
})
// const recahrgeAmountSum = ref(0)
// const recahrgeCount = ref(0)
// const firstRecahrgeCount = ref(0)
// 状态
const showDataPick = ref(false)
const showLevel = ref(false)
/**
 * 请求参数.begin
 */
// 数据模型
const { minDate, maxDate } = dateRange(-1)
const nowDate = dayjs(maxDate).startOf('day')
interface PageQuery {
	lv: number
	day: string
	userId: number | null
}
const pageQuery = reactive<PageQuery>({
	lv: selectList.value[0].code,
	day: nowDate.format('YYYY-MM-DD HH:mm:ss'),
	userId: null
})
const currentDate = ref([nowDate.format('YYYY'), nowDate.format('MM'), nowDate.format('DD')])
function closeDatePicker() {
	const unrefVal = unref(currentDate)
	const [year, month, day] = unrefVal
	pageQuery.userId = userId.value ? parseInt(userId.value) : null
	pageQuery.day = formatTimeDay(year, month, day) + ' 00:00:00'
	listRef.value?.resetRefresh()
	showDataPick.value = false
}

const userId = ref('')
function handleChangeUserId() {
	pageQuery.userId = userId.value ? parseInt(userId.value) : null
	listRef.value?.resetRefresh()
}

const setdata = (data: any) => {
	dataList = data.data
	// recahrgeAmountSum.value = data.data.recahrgeAmountSum
	// firstRecahrgeCount.value = data.data.firstRecahrgeCount
}
const onItemClickTime = ({ selectedOptions }: any) => {
	pageQuery.lv = selectedOptions[0].code
	showLevel.value = false
	listRef.value?.resetRefresh()
}
/**
 * 请求参数.end
 */

// 数据
const reportList = ref<ReqTeamDayReportList[]>([])

// 中间状态
const showDate = computed(() => {
	return dayjs(pageQuery.day).format('YYYY-MM-DD')
})
const lvName = computed(() => {
	const item = selectList.value.find((item) => item.code === pageQuery.lv)
	if (item) return item.name
	return ''
})

const onClick = () => {
	router.go(-1)
}
</script>

<style lang="scss" scoped>
.TeamReport__C {
	padding: 0 24px;

	&-head {
		height: 180px;

		&-fixed {
			position: fixed;
			top: 70px;
			width: 100%;
			left: 50%;
			transform: translateX(-50%);
			max-width: 750px;
			background-color: var(--bg_color_L1);
			z-index: 9;
			padding: 10px 24px 10px 24px;
		}

		&-line2 {
			height: 80px;
			width: 100%;
			display: flex;
			justify-content: space-between;
			color: var(--text_color_L2);
			font-size: 28px;
			margin-top: 20px;

			& > div {
				
				border-radius: 10px;
				line-height: 80px;
				width: calc(100% - 10px);
				padding: 0 20px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: var(--bg_color_L2);

				& + div {
					margin-left: 20px;
				}
			}

			.default {
				color: var(--text_color_L1);
			}
		}
	}

	&-body {
		margin-top: 40px;
		color: var(--text_color_L2);

		&-item {
			background: var(--darkBg,var(--bg_color_L2));
			box-shadow:var(--BoxShadowColor-9);
			border-radius: 10px;
			padding: 0 20px;

			&-head {
				height: 70px;
				padding-top: 10px;
				border-bottom: 1px solid var(--Dividing-line_color);
				display: flex;
				align-items: center;
				font-size: 32px;
				color: var(--darkTextW,var(--text_color_L1));

				// &-btn {
				// 	width: 225px;
				// 	height: 42px;
				// 	line-height: 42px;
				// 	border: 1px solid var(--main-color);
				// 	border-radius: 20px;
				// 	font-size: 24px;
				// 	color: var(--main-color);
				// 	text-align: center;
				// }
				.title {
					min-width: 200px;
				}

				img {
					width: 30px;
				}
			}

			&-detail {
				padding: 22px 0;
				color: 666;
				font-size: 26px;

				& > div {
					height: 30px;
					display: flex;
					justify-content: space-between;
					align-items: center;


					& + div {
						margin-top: 22px;
					}
				}
				&-time {
					span {
						font-size: 24px;
						color: var(--text_color_L3);
					}
				}

				&-commission {
					span {
						color: var(--norm_secondary-color);
					}
				}
			}

			& + div {
				margin-top: 24px;
			}
		}
		.header-container {
			min-height: 200px;
			background-color: var(--bg_color_L3);
			color: var(--text_color_L1);
			font-size: 24px;
			display: flex;
			padding: 40px 0;
			margin-bottom: 30px;
			border-radius: 20px;
			flex-wrap: wrap;
			gap: 48px 0;
			& > div {
				width: 50%;
				text-align: center;
				color: var(--text_color_L1);
				&:nth-of-type(odd){
					&::before {
						display: none;
					}
				}
				&>div {
					&:last-of-type{
						color: var(--text_color_L2)
					}
				}
				& + div {
					position: relative;
					margin-bottom: 10px;
					&::before {
						content: '';
						display: block;
						position: absolute;
						border-right: 1px solid var(--text_color_L3);
						height: 100%;
						width: 0;
						left: 0;
						top: 0;
					}
				}
			}
			.num {
				height: 42px;
				font-size: 36px;
				font-weight: 700;
				margin-bottom: 6px;
			}
		}
	}
}
</style>
