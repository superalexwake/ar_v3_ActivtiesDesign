<template>
	<div class="rechargeh__container">
		<NavBar class="white" :title="$t('withdrawRecords')" left-arrow @click-left="onClick" />
		<div class="rechargeh__container_header">
			<van-tabs
				class="onlineGames__container-tabBar"
				v-model:active="active"
				type="card"
				ref="tabsRef"
				ellipsis
				:swipe-threshold="3"
			>
				<van-tab v-for="(item, index) in withdrawalTypeslist" :key="index">
					<template v-if="item.withdrawID === -1" #title>
						<div class="tabDiv">
							<svg-icon name="all" />
							{{ item.name }}
						</div>
					</template>
					<template v-else #title>
						<div class="tabDiv">
							<img v-if="active == index" :src="item.withAfterImgUrl" />
							<img v-else :src="item.withBeforeImgUrl" />
							{{ item.name }}
						</div>
					</template>
				</van-tab>
			</van-tabs>

			<div v-if="isC2c" class="c2cType">
				<div :class="{ active: pageQuery.type == 1 }" @click="setC2cType(1)">{{ $t('inTransaction') }}</div>
				<div :class="{ active: pageQuery.type == 2 }" @click="setC2cType(2)">{{ $t('completed') }}</div>
			</div>

			<div class="ar">
				<div class="ar-searchbar">
					<ArSelect @click-select="onClickSelectS" :selectName="typeLable"></ArSelect>
					<!--日期选择组件-->
					<Calendar ref="calendar" @confirm="onConfirmDateC" />
				</div>
			</div>
		</div>

		<van-popup v-model:show="showPicker" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'key', value: 'value', children: 'children' }"
				:columns="pickeColums"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</van-popup>
		<!-- 提现记录 -->
		<List
			v-model:list="WithdrawLogList"
			v-model:page-query="pageQuery"
			:api="ListApi"
			:distance="100"
			ref="listRef"
			:is-auto-load="isAutoLoad"
			@list-change="onWithdrawLogListChange"
		>
			<template #content>
				<div class="rechargeh__container-content" :class="{ isC2c, empty: WithdrawLogList.length === 0 }">
					<c2cList v-if="isC2c" :list="WithdrawLogList" />
					<div v-else class="rechargeh__container-content__item" v-for="(item, index) in WithdrawLogList" :key="index">
						<!-- <div class="rechargeh__container-content__item-header ar-1px-b" @click="onToDetail(item.state)"> -->
						<div class="rechargeh__container-content__item-header ar-1px-b">
							<span>{{ $t('withdraw') }}</span>
							<!-- <span>{{ item.withdrawName }}</span> -->
							<span :class="{ stateR: item.state === 0, stateG: item.state === 1, stateReject: item.state === 2 }">
								{{ getArrayKey(rootConfig.WithdrawState, item.state) }}
								<!-- <van-icon name="arrow" /> -->
							</span>
						</div>
						<div class="rechargeh__container-content__item-body">
							<div>
								<span>{{ $t('amount') }}</span>
								<span>{{ currency(item.price) }}</span>
							</div>
							<div>
								<span>{{ $t('type') }}</span>
								<span>{{ item.withdrawName }}</span>
							</div>
							<div>
								<span>{{ $t('time') }}</span>
								<span>{{ item.addTime }}</span>
							</div>
							<div>
								<span>{{ $t('orderNo') }}</span>
								<span>{{ item.withdrawNumber }}</span>
								<svg-icon @click="copy(item.withdrawNumber.toString())" name="copy" />
							</div>
							<div v-if="item.tranRefId">
								<span>UTR</span>
								<span>{{ item.tranRefId }}</span>
							</div>
							<div>
								<span>{{ $t('remarksContent') }}</span>
								<span class="contact-link" v-if="[27].includes(item.type)">
									<a href="https://direct.lc.chat/15861567/6" target="_blank">{{$t('contactServicer')}}</a>
								</span>
							</div>
							<div>
								<!-- <span>{{ $t('remarksContent') }}</span> -->
								<textarea
									v-show="item?.remark && item?.remark.trim() != ''"
									class="textarea"
									name="remark"
									cols="30"
									rows="10"
									:readonly="true"
									v-model="item.remark"
								></textarea>
							</div>
							<div v-if="[0, 3].includes(item.state)">
								<van-button
									size="small"
									:disabled="isUrged(item.withdrawNumber)"
									@click="onUrgeOrder(item.withdrawNumber)"
									type="primary"
									block
								>{{ $t('urgeOrder') }}</van-button>
							</div>
							<div v-if="item.needKycConnect&&item.state===3&&item.type==27">
								<van-button size="small"  @click="onOtp(item)" type="danger"  block>{{ $t('verifyOpt') }}</van-button>
							</div>
						</div>
					</div>
				</div>
			</template>
		</List>
	</div>
</template>

<script setup lang="ts">
import c2cList from '@/components/Wallet/Withdraw/c2cRecordList.vue'
import { ref, reactive, onMounted, watch, nextTick, onUnmounted, onBeforeUnmount ,h} from 'vue'
import { useRouter } from 'vue-router'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import { copy, getArrayKey, AwaitApiResult, currency } from '@/utils'
import { GetC2CWithdrawRecord, GetWithdrawLog, GetWithdrawalTypes } from '@/api'
import { useCommonStore } from '@/stores'
import { FAST_UPI_KYC_OTP_EXPIRED_EVENT, useFastUpiKycOtp, useStorage } from '@/hooks'
import { useEventBus } from '@/components/common/use'
import type { withdrawLogList, ReqdWithdrawLog } from '@/types/api'
import Calendar from '@/components/common/Calendar.vue'
import List from '@/components/common/ListSimply.vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { showDialog } from 'vant'

const { t } = useI18n()
const { setLoading } = useCommonStore()
const isAutoLoad = ref(false)
const router = useRouter()
const eventBus = useEventBus()
function onClick() {
	router.back()
}
const WithdrawLogList = ref<withdrawLogList[]>([])
const { normalizeWithdrawLogTiming, openKycOtpByWithdrawOrder } = useFastUpiKycOtp()
const onWithdrawLogListChange = (result: any) => {
	if (isC2c.value) return
	WithdrawLogList.value = normalizeWithdrawLogTiming(WithdrawLogList.value, result?.data || {})
}
const listRef = ref()
const refreshWithdrawHistory = () => {
	if (router.currentRoute.value.name !== 'WithdrawHistory') return
	listRef.value?.resetRefresh()
}
eventBus.on(FAST_UPI_KYC_OTP_EXPIRED_EVENT, refreshWithdrawHistory)
//#region 下拉框部分
// const isAutoLoad = ref(false)
const showPicker = ref(false)
const typeLable = ref('')
const dropdownClickS = ref(false) //判断状态下拉框是否被点击
const onOtp=(item:any)=>{
	void openKycOtpByWithdrawOrder({
		...item,
		...(item.upiAccountInfo || {}),
		withdrawID: item.withdrawID,
		price: item.price,
	}, {
		source: 'history',
		showSuccess: true,
		onVerified: refreshWithdrawHistory,
	})
}
const { localStore } = useStorage()
const urgeTick = ref(0)
const urgeKey = (orderNo: any) => `urge_order_${orderNo}`
const isUrged = (orderNo: any) => {
	urgeTick.value
	return !!localStore.get(urgeKey(orderNo))
}
const onUrgeOrder = (orderNo: any) => {
	if (isUrged(orderNo)) return
	localStore.set(urgeKey(orderNo), 1, 600)
	urgeTick.value++
	showDialog({
		message: t('urgeOrderSuccess')
	})
}
//选择状态
const onConfirm = async ({ selectedOptions }: any) => {
	showPicker.value = false
	typeLable.value = selectedOptions[0].key
	pageQuery.state = selectedOptions[0].value
	listRef.value?.resetRefresh()
}
const ListApi = ref(GetWithdrawLog)

const pickeColums = ref()
//#region 获取所有提现类别
let withdrawalTypeslist = ref<any>([])
const isC2c = ref(false)
const active = ref(-1)
const timer = ref<NodeJS.Timeout | null>(null)
const unwatch = watch(active, (val, oldVal) => {
	typeLable.value = rootConfig.RechargeState[0].key
	pageQuery.state = rootConfig.RechargeState[0].value
	pageQuery.type = withdrawalTypeslist.value[val].withdrawID
	if (pageQuery.type == 20) {
		pickeColums.value = [
			{
				key: t('withdrawStatem1'),
				value: -1
			},
			{
				key: t('c2cState0'),
				value: 0
			},
			{
				key: t('c2cState1'),
				value: 1
			},
			{
				key: t('c2cState2'),
				value: 2
			},
			{
				key: t('c2cState3'),
				value: 3
			},
			{
				key: t('c2cState4'),
				value: 4
			},
			{
				key: t('c2cTip9'),
				value: 5
			},
			{
				key: t('c2cState6'),
				value: 6
			},
			{
				key: t('c2cState7'),
				value: 7
			},
			{
				key: t('c2cState8'),
				value: 8
			},
			{
				key: t('c2cState9'),
				value: 9
			}
		]
		typeLable.value = rootConfig.C2cState[0].key
		pageQuery.state = rootConfig.C2cState[0].value
		pageQuery.category = -1
		ListApi.value = GetC2CWithdrawRecord
		isC2c.value = true
		pageQuery.type = -1
	} else {
		clearInterval(timer.value as NodeJS.Timeout)
		pickeColums.value = rootConfig.WithdrawState
		delete pageQuery.category
		isC2c.value = false
		ListApi.value = GetWithdrawLog
	}

	nextTick(() => {
		listRef.value?.resetRefresh()
	})
})

function startTimer() {
	timer.value = setInterval(() => {
		listRef.value?.resetRefresh()
	}, 10000)
}

watch(
	() => WithdrawLogList.value,
	(newList) => {
		//c2c状态是匹配中就每10秒查询一次
		if (isC2c.value && newList.findIndex((item) => item.state === 11 || item.state === 12) != -1) {
			clearInterval(timer.value as NodeJS.Timeout)
			startTimer()
		} else {
			clearInterval(timer.value as NodeJS.Timeout)
		}
	}
)
async function getWithdrawalTypes() {
	setLoading(true)
	const res = await AwaitApiResult(GetWithdrawalTypes())
	if (res) {
		let newList = res?.data.withdrawlist
		newList.unshift({ withdrawID: -1, name: t('all'), isAdd: 0 })
		withdrawalTypeslist.value = newList
	}
	setLoading(false)
}
//#endregion

onMounted(async () => {
	setTimeout(() => {
		typeLable.value = t('all')
		pickeColums.value = rootConfig.WithdrawState
	})
	//获取提现类别
	await getWithdrawalTypes()
})

// 销毁时清除监听
onUnmounted(() => {
	eventBus.off(FAST_UPI_KYC_OTP_EXPIRED_EVENT, refreshWithdrawHistory)
	unwatch()
})

onBeforeUnmount(() => {
	clearInterval(timer.value as NodeJS.Timeout)
})

//状态下拉框点击事件
function onClickSelectS() {
	showPicker.value = true
	dropdownClickS.value = true
}

//选择日期
const calendar = ref()
async function onConfirmDateC() {
	let newEndDate = calendar.value.endDateValue !== '' ? `${calendar.value.endDateValue} 23:59:59` : ''
	pageQuery.startDate = dayjs(calendar.value.startDateValue).format('YYYY-MM-DD HH:mm:ss')
	pageQuery.endDate = dayjs(newEndDate).format('YYYY-MM-DD HH:mm:ss')
	listRef.value?.resetRefresh()
}

//#endregion


// const isFirst = ref(true)
//查询提现记录接口参数
const pageQuery = reactive<ReqdWithdrawLog>({
	startDate: '',
	endDate: '',
	state: rootConfig.RechargeState[0].value,
	type: -1
})
const setC2cType = (index: number) => {
	pageQuery.type = index
	if (index == 1) {
		pickeColums.value = [
			{
				key: t('withdrawStatem1'),
				value: -1
			},
			{
				key: t('c2cState0'),
				value: 0
			},
			{
				key: t('c2cState1'),
				value: 1
			},
			{
				key: t('c2cState2'),
				value: 2
			},
			{
				key: t('c2cState3'),
				value: 3
			},
			{
				key: t('c2cState8'),
				value: 8
			},
			{
				key: t('c2cState9'),
				value: 9
			}
		]
	} else {
		pickeColums.value = [
			{
				key: t('withdrawStatem1'),
				value: -1
			},
			{
				key: t('c2cState4'),
				value: 4
			},
			{
				key: t('c2cTip9'),
				value: 5
			},
			{
				key: t('c2cState6'),
				value: 6
			},
			{
				key: t('c2cState7'),
				value: 7
			}
		]
	}
	typeLable.value = rootConfig.C2cState[0].key
	pageQuery.state = rootConfig.C2cState[0].value
	listRef.value?.resetRefresh()
}
//进入详情页面
function onToDetail(paramValue: number) {
	router.push({
		name: 'WithdrawHistory-WithdrawHistoryDetail',
		state: { paramValue }
	})
}
</script>
<style>
:root {
	--van-tabs-card-height: auto;
}
</style>
<style lang="scss" scoped>
.f24 {
	font-size: 24px;
}

.rechargeh__container {
	padding-inline: 24px;
	padding-block: 0 112px;
	font-family: $font-family;

	:deep(.navbar__content-left > .van-icon) {
		font-size: 40px;
	}

	:deep(.ar) {
		position: relative;
		top: 0;
		padding: 0;
		margin-bottom: 29px;
	}

	:deep(.van-tabs) {
		//position: fixed;
		//top: 90px;
		left: 50%;
		width: 100%;
		max-width: 750px;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
		margin-bottom: 29px;
		transform: translateX(-50%);

		.van-tabs__nav{
			background: transparent;
		}
		.van-tabs__nav--card {
			margin: 0;
			display: flex;
			justify-content: space-between;
			border: none;

			.van-tab--card {
				min-width: 190px;
				height: 80px;
				color: var(--text_color_L2) !important;
				border-radius: 10px;
				background: var(--bgDark-2, var(--bg_color_L2));
				border: none;

				.tabDiv {
					display: flex;
					height: 80px;
					width: 100%;
					//line-height: 100px;
					align-items: center;
					justify-content: space-between;
					font-size: 24px;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					img,svg {
						width: 42px;
						margin-right: 10px;
						position: relative;
						top: -2px;
					}
					svg {
						height: 42px;
					}
				}

				&.van-tab--active {
					color: var(--text_color_L4) !important;
					background: var(--main_gradient-color);
				}

				& + div {
					margin-left: 10px;
				}
			}
		}
	}

	&_header {
		position: fixed;
		max-width: 750px;
		width: 100%;
		left: 50%;
		transform: translateX(-50%);
		padding: 0 24px;
		padding-top: 20px;
		background: var(--bg_color_L1);
		z-index: 99;
		:deep(.ar) {
			margin-bottom: 0;
			.ar-searchbar{
				margin-bottom: 0;
				justify-content: normal;
			}
		}

		.vantab-minw {
			min-width: 190px;
		}
	}

	.top {
		height: 240px;
	}

	.c2cType {
		height: 88px;
		line-height: 88px;
		background-color: var(--textW);
		margin: 0px auto 30px auto;
		border-radius: 10px;
		display: flex;
		text-align: center;
		color: var(--text_color_L2);
		font-size: 24px;
		width: calc(100% - 48px);

		& > div {
			width: 50%;

			&.active {
				background: var(--main_gradient-color2);
				border-radius: 10px;
				color: var(--textW);
				font-size: 26px;
				
			}
		}
	}

	&-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 30px;
		margin-top: 220px;

		&.isC2c {
			margin-top: 380px;
		}
		&__item {
			display: flex;
			flex-direction: column;
			gap: 16px;
			padding: 24px 10px;
			border-radius: 10px;
			background-color: var(--darkBg,var(--bg_color_L2));

			&-header {
				display: flex;
				align-items: center;
				gap: 10px;
				padding-bottom: 10px;

				span {
					//width: 150px;
					min-width: 150px;
					height: 50px;
					font-size: 28px;
					text-align: center;
					line-height: 50px;
					color: #fff;

					&:first-of-type {
						margin-left: 10px;
						background: var(--darkLight,var(--norm_red-color));
						border: 1px solid var(--darkLight,var(--norm_red-color));
						border-radius: 10px;
					}

					&:nth-of-type(2) {
						text-align: left;
						 //color: #ff7172;
						// border: 1px solid #ff7172;
					}

					&:last-of-type {
						margin-left: auto;
						text-align: right;
						color: var(--main-color);
					}

					&.stateR {
						color: var(--norm_bule-color)
					}
					&.stateReject{
						color: var(--norm_red-color)
					}

					&.stateG {
						color: var(--norm_green-color);
					}

					&.inactive {
						// background: #ff7172;
					}
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 10px;
				font-size: 24px;
				color: var(--text_color_L2);

				& > div:last-of-type {
					justify-content: space-between;
				}

				& > div {
					display: flex;
					align-items: center;

					//background-color: #F6F6F6;
					&:first-of-type {
						span {
							&:last-of-type {
								color: var(--norm_secondary-color);
							}
						}
					}

					&:last-of-type {
						span {
							&:last-of-type {
								//color: var(--norm_secondary-color);
								color: var(--text_color_L2);
							}
						}
					}

					span {
						//height: 40px;
						padding: 0 20px;
						//line-height: 60px;
						margin: 5px 0;

						&:first-of-type {
							// flex: 0.45;
							// background: var(--bgColor-6);
							clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
						}

						&:last-of-type {
							// flex: 0.55;
							//text-align: right;
							max-width: 70%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						&:nth-of-type(2) {
							margin-left: auto;
							text-align: right;
						}
					}

					img {
						width: 30px;
					}
				}
			}
		}
	}

	&-empty {
		margin-top: 50px;
	}

	.textarea {
		flex: 1;
		height: 120px;
		border: 1px solid var(--Dividing-line_color);
		border-radius: 10px;
		padding-top: 20px;
		padding-left: 21px;
		resize: none;
		margin-bottom: 22px;
		font-size: 22px;
		background: var(--bg_color_L1);
		color: var(--text_color_L2);
	}

	.textarea::placeholder {
		color: var(--text_color_L2);
		font-size: 22px;
	}
	.contact-link a{
		color: #4781ff;
		text-decoration: underline;
	}
}

@media screen and (max-width: 500px) {
	.rechargeh__container {
		:deep(.van-tabs) {
			max-width: none;
		}
	}
}
</style>
