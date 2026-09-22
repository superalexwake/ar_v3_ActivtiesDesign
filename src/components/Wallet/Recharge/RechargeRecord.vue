<template>
	<div class="record__main">
		<div class="record__main-title">
			<svg-icon name="historyHead"></svg-icon>
			<span>{{ store.currentPayId === 20 ? 'C2C' + $t('rechargeRecords') : $t('rechargeRecords') }}</span>
		</div>
		<Empty v-if="RechargeRList.length < 1" class="mgt40" />
		<div v-if="RechargeRList.length > 0">
			<div class="record__main-info" v-for="item in RechargeRList" :key="item.rechargeNumber+item.state" @click="handleGoDetail(item)">
				<div class="record__main-info__title flex_between">
					<div class="recharge_text">{{ $t('recharge') }}</div>
					<div class="flex_between">
						<div :class="{ danger: item.state === 0, success: item.state === 1, rechargeFail: item.state === 2, cancel: item.state === 6 }" v-if="store.currentPayId !== 20">
							{{  $t(getArrayKey(rootConfig.RechargeState, item.state)) }}
						</div>
						<img src="@public/wallet/recharge/left_arrow.png" alt="" v-if="item.state !== 2" />
					</div>
				</div>

				<div class="record__main-info__money item flex_between" v-if="store.currentPayId !== 20">
					<span>{{ $t('orderAmountLabel') }}</span>
					<span>{{ currency(item?.orderAmount ?? item?.price) }}</span>
				</div>
				<div class="record__main-info__money item flex_between" v-else>
					<span>{{ $t('amount') }}</span>
					<span>{{ currency(item?.orderAmount) }}</span>
				</div>
				<!-- 实际到账（点击展开订单明细），C2C 无手续费/奖金字段故不展示 -->
				<RechargeOrderDetail v-if="store.currentPayId !== 20" :item="item" />
				<div class="record__main-info__type item flex_between" v-if="store.currentPayId !== 20">
					<span>{{ $t('type') }}</span>
					<span>{{ item?.payName }}</span>
				</div>
				<div class="record__main-info__type item flex_between" v-else>
					<span>UTR</span>
					<div>
						<span>{{ item.transactionNo || '-' }}</span>
						<svg-icon name="copy" alt="" @click.stop="copy(item.transactionNo)" />
					</div>
				</div>
				<div class="record__main-info__time item flex_between" v-if="store.currentPayId !== 20">
					<span>{{ $t('time') }}</span>
					<span>{{ item.addTime }}</span>
				</div>
				<div class="record__main-info__time item flex_between" v-else>
					<span>{{ $t('time') }}</span>
					<span>{{ item.createTime }}</span>
				</div>
				<div class="record__main-info__orderNumber item flex_between" v-if="[0,2].includes(item.state)&&arUpiPayTypeList.includes(item.payTypeId)&&(item.groupID & 16384) ===  16384">
					<span>{{ $t('remarksContent') }}</span>
					<div>
						<span style="color:red;">{{  $t('arupiRemark') }}</span>
					</div>
				</div>
				<div class="record__main-info__orderNumber item flex_between" v-if="store.currentPayId !== 20">
					<span>{{ $t('orderNo') }}</span>
					<div>
						<span>{{ item?.rechargeNumber }}</span>
						<svg-icon name="copy" alt="" @click.stop="copy(item.rechargeNumber)" />
					</div>
				</div>
				<div class="record__main-info__orderNumber item flex_between" v-else>
					<span>{{ $t('orderNo') }}</span>
					<div>
						<span>{{ item.orderNo }}</span>
						<svg-icon name-="copy" alt="" @click.stop="copy(item.orderNo)" />
					</div>
				</div>
				<div class="record__main-info__orderNumber item flex_between" v-if="[0,2].includes(item.state)&&arUpiPayTypeList.includes(item.payTypeId)&&(item.groupID & 16384) ===  16384">
					<span>{{ $t('remarksContent') }}</span>
					<div>
						<span>{{  $t('arupiRemark') }}</span>
					</div>
				</div>
				<template v-if="[0,2].includes(item.state)">
					<div class="report" style="margin-bottom: 10px" v-if="showUtr(item)"  @click.stop="openPopup(item)">
						{{ $t('submitUtr') }}
					</div>
					<div class="report report-b" v-if="(item.groupID & 16384) ===  16384 ||[21].includes(item.payID)" @click.stop="handleOpen">
						{{$t('contactServicer')}}
					</div>
					<div class="report report-b" v-if="showBank(item)" @click.stop="gotoBanklist(item)">
						{{showBankText(item)}}
					</div>

					<div class="report" v-if="showeRportUtr(item)" @click.stop="goToOrderAppeal(item)">
						{{ [32,544,4096].includes(item.groupID) ?$t('appeal') : $t('compDetails') }}
					</div>
					<div class="report" v-else-if="!arUpiPayTypeList.includes(item.payTypeId) && isCenterServer" @click.stop="goToTictek(item, isC2C)">{{ $t('report') }}</div>
				</template>
			</div>
			<div class="record__main-more" v-if="isShowMore" @click.stop="handleGoRecord">
				{{ $t('allRecords') }}
			</div>
		</div>
		<van-popup
			v-model:show="showBottom"
			position="bottom"
			:style="{ height: '30%' }"
		>


			<div class="rechargeh__header">
				<van-button round size="small" @click="()=>{showBottom=false;utr=''}">{{$t('cancel')}}</van-button>
				<span>{{$t('submitUtr')}}</span>
				<van-button round size="small" :loading="loading" :loading-text="$t('submit')" type = "primary" @click="onUpiSubmitUtr">{{$t('submit')}}</van-button>
			</div>
			<div class="record__main-info" >
				<div class="record__main-info__money item flex_between">
					<span>{{ $t("utr") }}</span>
					<van-field
						v-model="utr"
						placeholder="Input 12 digits here"
						:clearable="true"
						:maxlength="12"
						type="digit"
						autocomplete="off"
					></van-field>
				</div>
				<div class="record__main-info__money item flex_between">
					<span>{{ $t("amount") }}</span>
					<span class="price">{{ currency(order.price) }}</span>
				</div>

				<div class="record__main-info__money item flex_between">
					<span>{{ $t("type") }}</span>
					<span>{{ order?.payName }}</span>
				</div>
				<div class="record__main-info__money item flex_between">
					<span>{{ $t("time") }}</span>
					<span>{{ order.addTime }}</span>
				</div>
				<div class="record__main-info__orderNumber item flex_between">
					<span>{{ $t('orderNo') }}</span>
					<div>
						<span>{{ order.rechargeNumber }}</span>
					</div>
				</div>


			</div>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import type { chargeRecordList } from '@/types/api'
import {arUpiPayTypeList, copy, currency, getArrayKey, AwaitApiResult} from '@/utils'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import { computed, h, onBeforeUnmount, ref } from 'vue'
import Empty from '@/components/Empty/index.vue'
import ConutDownTimer from '@/components/Wallet/Recharge/CountDownTimer.vue'
import RechargeOrderDetail from '@/components/Wallet/Recharge/RechargeOrderDetail.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useEventBus } from '@/components/common/use'
import { useRecharge } from '@/hooks/useRecharge'
import { useServer } from '@/hooks/useServe.hook'
import {useCustomService} from "@/hooks";
import {showDialog, showFailToast, showSuccessToast,} from "vant";
import {arUpiSubmitUtr} from "@/api";
import {useI18n} from "vue-i18n";

const eventBus = useEventBus()
const { t } = useI18n();
const { store, historyToDetail, getRecordList, RechargeRList, goToOrderAppeal ,gotoBanklist} = useRecharge()
const {handleOpen}=useCustomService({type: 3})
const showBottom=ref(false); //底部弹窗
const order=ref({})
const utr=ref();
const loading=ref(false)
// const RechargeRList = ref<(chargeRecordList & C2CRechargeRecord)[]>([])
const isShowMore = computed(() => RechargeRList.value.length >= 5)
const router = useRouter()
const { goToTictek, isCenterServer } = useServer({ServerType: 2})
const openPopup = (item: any) => {
	if (((item.groupID & 2048) === 2048)&&((item.groupID & 1024) === 1024)){
		return showDialog({
			title: t('tips'),
			message: ()=>h('p',[
				h('span', t('submitUtrtip')+' '),
				h('span',{
					style:{color:'red'},
					onClick: handleOpen,

				}, t('pServer')),
			]),
			theme: 'round-button',
		})
	}
	order.value = item;
	showBottom.value = true;
};
const onUpiSubmitUtr=async ()=>{
	if (!utr.value || `${utr.value}`.length < 12) {
		return showFailToast('UTR format is incorrect!')
	}
	if (loading.value) return;
	try {
		loading.value = true;
		const data=await AwaitApiResult(arUpiSubmitUtr({
			orderNumber: order.value.rechargeNumber,
			utr:utr.value
		}));

		if (data){
			showSuccessToast(t('submitSuccess'))
			showBottom.value = false;
			utr.value='';
			getRecordList()
		}
	}catch (e) {

	}finally {
		loading.value = false;
	}


}
const showBank=(item:any)=>{
	if(!arUpiPayTypeList.includes(item.payTypeId)) return  false;
	if((item.groupID & 1) === 1) return  true;
	if((item.groupID & 2) === 2) return  true;
	if((item.groupID & 4) === 4) return  true;
}
const showBankText=(item:any)=>{
	if((item.groupID & 1) === 1) return  t('arupiBank');
	if((item.groupID & 2) === 2) return  t('arupiKycTip');
	if((item.groupID & 4) === 4) return  t('arupiKyc');
}
const showUtr=(item:any)=>{
	if(!arUpiPayTypeList.includes(item.payTypeId)) return  false;
	if((item.groupID & 2048) === 2048) return  true;
	if((item.groupID & 8192) === 8192) return  true;
	return false
}
const showeRportUtr=(item:any)=>{
	if(!arUpiPayTypeList.includes(item.payTypeId)) return  false;
	if((item.groupID & 32) === 32) return  true;
	if((item.groupID & 64) === 64) return  true;
	if((item.groupID & 4096) === 4096&&!((item.groupID & 16384) ===  16384)) return  true;
	return false

}
const getStateColorAndText = (item: C2CRechargeRecord) => {
	let className = ''
	switch (item.state) {
		case 0:
			className = 'recharge'
			break
		case 1:
			className = 'check'
			break
		case 2:
			className = 'timeout'
			break
		case 3:
			className = 'representation'
			break
		case 4:
			className = 'success'
			break
		case 5:
			className = 'fail'
			break
		case 6:
			className = 'cancel'
			break
		default:
			className = '#FFB800'
			break
	}
	return className
}

/**
 * @description: 进入详情
 * @param {*} item
 * @return {*}
 */
const handleGoDetail = async (item: Partial<chargeRecordList & C2CRechargeRecord>) => {
	historyToDetail(
		(item.payID || item.category) as number,
		item.type as number,
		item.price as number,
		item.state as number,
		item.id
	)
}

const handleGoRecord = () => {
	eventBus.emit('changeKeepAliveKey')
	router.push({
		name: 'RechargeHistory'
	})
}

onMounted(() => {
	eventBus.on('getRecordList', () => {
		getRecordList()
	});
	getRecordList()
})
onBeforeUnmount(()=>{
	eventBus.off('getRecordList')
})
defineExpose({
	getRecordList
})
</script>

<style lang="scss" scoped>
.record__main {
	margin: 20px 0;

	&-title {
		display: flex;
		align-items: center;
		height: 50px;
		margin-bottom: 38px;

		.svg-icon {
			width: 48px;
			height: 48px;
			margin-right: 14px;
		}

		span {
			font-weight: 600;
			font-size: 32px;
			color: var(--darkTextW,var(--text_color_L1));
		}
	}

	&-info {
		padding: 24px 20px 30px;
		background-color: var(--darkBg, var(--bg_color_L2));
		border-radius: 10px;
		margin-bottom: 20px;

		&__title {
			padding-bottom: 24px;
			border-bottom: 1px solid var(--Dividing-line_color);
			margin-bottom: 20px;
			color: var(--darkTextW, var(--text_color_L1));

			.recharge_text {
				width: 150px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				color: #fff;
				background: var(--norm_green-color);
				border-radius: 10px;
				font-size: 28px;
			}

			div {
				font-size: 26px;

				.success {
					color: var(--norm_green-color);
				}
				.danger{
					color: var(--norm_secondary-color);
				}
				.rechargeFail{
					color:  var(--norm_red-color);
				}

				.timeout {
					color: #f6a50b;
				}

				.check {
					color: #59c042;
				}

				.representation {
					color: var(--main-color);
				}

				.recharge {
					color: #598ff9;
				}

				.cancel {
					color: var(--text_color_L2);
				}

				.fail {
					color: var(--main-color);
				}

				img {
					width: 36px;
					height: 36px;
				}
			}
		}

		&__money {
			span:first-child {
				font-size: 26px;
				color: var(--text_color_L2);
			}

			span:last-child {
				font-size: 30px;
				color: var(--norm_secondary-color);
			}
		}

		&__type,
		&__time {
			span:last-child {
				font-size: 26px;
				color: var(--text_color_L2);
			}

			div {
				font-size: 24px;
				color: #aeb0c6;

				img {
					width: 32px;
					height: 32px;
					margin-left: 12px;
				}
			}
		}

		&__orderNumber {
			div {
				font-size: 24px;
				color: #aeb0c6;

				img {
					width: 32px;
					height: 32px;
					margin-left: 12px;
				}
			}
		}

		.item {
			margin-bottom: 24px;

			span:first-child {
				font-size: 26px;
				color: var(--text_color_L2);
			}
		}

		.item:last-child {
			margin-bottom: 0;
		}
		.report {
			height: 64px;
			line-height: 64px;
			color: #fff;
			background-color: var(--main-color);
			border-radius: 66px;
			text-align: center;
			font-size: 30px;
			font-weight: 500;
			&.report-b {
				margin-bottom: 10px;
			}
		}
	}

	&-more {
		width: 660px;
		height: 70px;
		border: 1px solid var(--main-color);
		border-radius: 80px;
		margin: 30px auto;
		text-align: center;
		line-height: 70px;
		font-size: 30px;
		color: var(--text_color_L4);
		background: var(--main_gradient-color);
	}
	.rechargeh__header{
		display: flex;
		padding:20px;
		justify-content: space-between;
		align-items: center;
		span{
			font-size: 28px;
			color: var(--text_color_L1);
		}
	}
	.van-field{
		background: var(--bg_color_L1);
		border-radius: 50px;
		margin-left:20px;
	}
}

.flex_between {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
</style>