<template>
	<div class="transRecord__container">
		<NavBar :title="$t('transactionrecord')" left-arrow @click-left="onClick" />
		<div style="height: 65px">
			<div class="ar">
				<div class="ar-searchbar">
					<ArSelect @click-select="onClickSelectS" :selectName="typeLable"></ArSelect>
					<ArSelect @click-select="showDataPick = true" :selectName="pageQuery.date || $t('pickDate')"> </ArSelect>
				</div>
			</div>
		</div>

		<!-- 配合弹窗层使用 -->
		<van-popup v-model:show="showPicker" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'typeName', value: 'type', children: 'children' }"
				:columns="transMoneyTypes"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</van-popup>

		<!-- 日期选择 -->
		<van-popup v-model:show="showDataPick" round position="bottom">
			<van-date-picker
				v-model="currentDate"
				:title="$t('pickDate')"
				@cancel="cancelDataPick"
				@confirm="onConfirmDataPick"
				:filter="filterDate"
				@change="changeDataPick"
				:min-date="minDate"
				:max-date="maxDate"
			/>
		</van-popup>

		<List
			:distance="100"
			:api="GetTransactions"
			v-model:list="TransactionsList"
			v-on:update:list="getChange"
			ref="listRef"
			v-model:pageQuery="pageQuery"
		>
			<template #content>
				<div class="transRecord__container-content">
					<div class="transRecord__container-content__item" v-for="(item, index) in TransactionsList" :key="index">
						<div class="transRecord__container-content__card">
							<div class="transRecord__container-content__card-top">
								<h3>{{ item.typeName }}</h3>
							</div>
							<div class="transRecord__container-content__card-mid">
								<div class="line">
									<div class="left">{{ $t('detail') }}</div>

									<div class="right">{{ getArrayKeyTN(transMoneyTypes, item.type) }}</div>
								</div>
								<div class="line">
									<div class="left">{{ $t('time') }}</div>
									<div class="right">{{ item.addTime }}</div>
								</div>
								<div class="line">
									<div class="left">{{ $t('amount') }}</div>
									<div class="right" :class="item.typeColor" :style="`color:${setColor(item.type)}`">{{ currency(item.amount) }}</div>
								</div>
							</div>
							<div class="transRecord__container-content__card-bot">
								<textarea
									class="textarea"
									name="remark"
									cols="30"
									rows="10"
									:readonly="true"
									:value="[21,22,26].includes(item.type)?'':item.remark"
								></textarea>
							</div>
						</div>
					</div>
				</div>
			</template>
		</List>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, fixDateStr, dateRange, getArrayKeyTN, currency } from '@/utils'
import { GetTransactions, GetTransactionsTypes } from '@/api'
import type { ResTransactionsTypes, transactionsList, ReqTransactions } from '@/types/api'
import List from '@/components/common/List.vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
const { t } = useI18n()

const router = useRouter()
function onClick() {
	router.back()
}

const transMoneyTypes = ref<ResTransactionsTypes[]>([]) //交易类型列表
const TransactionsList = ref<transactionsList[]>([]) //交易数据列表
const listRef = ref()
const pageQuery = reactive<ReqTransactions>({
	date: '',
	type: -1
})

//#region 下拉框部分
const showPicker = ref(false)
const typeLable = ref('')
const dropdownClickS = ref(false) //判断状态下拉框是否被点击

//选择状态
const onConfirm = async ({ selectedOptions }: any) => {
	showPicker.value = false
	typeLable.value = selectedOptions[0].typeName
	pageQuery.type = selectedOptions[0].type
	listRef.value.resetRefresh()
}

//状态下拉框点击事件
function onClickSelectS() {
	showPicker.value = true
	dropdownClickS.value = true
}

// 日期选择
const { key: dateLabel, value: dateVal } = fixDateStr()
const currentDate = ref(dateVal)
const { minDate, maxDate } = dateRange(0)
const showDataPick = ref(false)

const cancelDataPick = ({ selectedOptions }: any) => {
	showDataPick.value = false
}

//选择日期
const onConfirmDataPick = async ({ selectedOptions }: any) => {
	showDataPick.value = false
	pageQuery.date = `${currentDate.value[0]}-${currentDate.value[1]}-${currentDate.value[2]} 00:00:00`;

	listRef.value.resetRefresh()
}

const changeDataPick = ({ selectedOptions }: any) => {
	//console.log('changeDataPick')
}

// 日期范围控制
const filterDate = (type: any, options: any) => {
	return options
}

//#endregion

//获取交易状态列表
async function getTransactionsTypes() {
	const res = await AwaitApiResult(GetTransactionsTypes()) //res?.data
	if (res) {
		transMoneyTypes.value = res.data.typeList.map((item: any) => {
			item.typeName = t(`code${item.typeNameCode}`)
			return item
		})
		transMoneyTypes.value.unshift({ type: -1, typeName: t('all') })

		console.log('vvvvv: ', transMoneyTypes.value)
		typeLable.value = transMoneyTypes.value[0].typeName
	}
}

let codeList0 = [8000, 8005, 8018, 8021, 8023, 8100]
let codeList1 = [
	8001, 8002, 8003, 8004, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017, 8019, 8020, 8022, 8024, 8029,
	8030, 8031, 8101, 8102, 8103, 8104, 8105, 8107
]
//给交易记录数据做国际化翻译
const getChange = (obj: any) => {
	//TransactionsList.value = obj
	TransactionsList.value = obj.map((item: any) => {
		if (['8125'].includes(item.typeNameCode)) {
			item.typeName = t(`code${item.typeNameCode}`) + ' ' + item.remark
		}else{
			item.typeName = t(`code${item.typeNameCode}`);
		}
		let typeColor: any
		if (codeList0.includes(item.typeNameCode * 1)) typeColor = 'red'
		else if (codeList1.includes(item.typeNameCode * 1)) typeColor = 'green'

		return {
			...item,
			typeColor
		}
	})
}

function setColor(type:number){
	if([109].includes(type)) return 'red'
	else if([111,112,110,108,114].includes(type)) return 'green'
	return ''
}

onMounted(async () => {
	await getTransactionsTypes()
	// listRef.value.resetRefresh()
})
</script>

<style lang="scss" scoped>
.transRecord__container {
	padding-inline: 24px;
	padding-block: 0 112px;
	font-family: $font-family;

	.ar{
		padding-top: 20px;
		background: var(--bg_color_L1);
	}
	&-content {
		&__card {
			background: var(--bg_color_L2);
			border-radius: 10px;
			margin-bottom: 26px;
		}

		&__card-top {
			background: var(--light-main_gradient-color,var(--bg_color_L3));
			height: 88px;
			display: flex;
			align-items: center;
			border-radius: 10px 10px 0 0;
			padding-left: 20px;

			h3 {
				font-family: 'Inter';
				font-style: normal;
				font-weight: 700;
				font-size: 30px;
				color: var(--text_white,var(--text_color_L1));
			}
		}

		&__card-mid {
			padding: 20px 10px;

			.line {
				position: relative;
				background-color: var(--bg_color_L1);
				height: 60px;
				padding: 16px 20px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24px;
				margin-bottom: 10px;
				border-radius: 6px;

				.left {
					color: var(--text_color_L2);
					z-index: 1;
				}

				.right {
					color: var(--text_color_L2);
				}

				.red {
					color: var(--norm_red-color);
				}

				.green {
					color: var(--norm_green-color);
				}
			}

			.line:last-child {
				.right {
					font-size: 36px;
				}
			}
		}

		&__card-bot {
			padding: 0 10px;
			display: flex;

			.textarea {
				flex: 1;
				height: 120px;
				border: 1px solid var(--bg_color_L3);
				border-radius: 10px;
				padding-top: 20px;
				padding-left: 21px;
				resize: none;
				margin-bottom: 22px;
				font-size: 22px;
				background-color: var(--bg_color_L2);
				color: var(--text_color_L2);
			}

			.textarea::placeholder {
				color: var(--text_color_L2);
				font-size: 22px;
			}
		}
	}

	&-empty {
		margin-top: 50px;
	}
}
</style>
