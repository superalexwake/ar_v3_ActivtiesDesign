<template>
	<div class="cancel_recharge">
		<NavBar :title="$t('concelOrder')" left-arrow @click-left="onClick" />

		<div class="info">
			<div class="info_item">
				<div>UPI ID</div>
				<span class="user_name">{{ orderDetail?.sellerAccountNo }}</span>
			</div>
			<div class="info_item">
				<div>{{ $t('amount') }}</div>
				<span class="money">₹ {{ orderDetail?.orderAmount }}</span>
			</div>
			<van-divider />
			<div class="info_item">
				<div class="order_num">{{ orderDetail?.orderNo }}</div>
				<span class="time">{{ orderDetail?.createTime }}</span>
			</div>
		</div>

		<div class="cancel_content">
			<div class="title">{{ $t('cancelReason') }}</div>
			<div
				class="cancel_radio"
				v-for="item in cancel_radio"
				:key="item.id"
				:class="{ radio_active: currentRadio === item.id }"
				@click="
					() => {
						currentRadio = item.id
						if (currentRadio !== 4) {
							remark = ''
						}
					}
				"
			>
				<span class="radio_title">{{ item.reasonText }}</span>
				<textarea
					v-if="item.id === 4"
					class="textarea_input"
					v-model="remark"
					:placeholder="$t('enterOtherReason')"
					:disabled="currentRadio !== 4"
				></textarea>
			</div>
		</div>

		<div class="tip">{{ $t('c2cTip15') }}</div>

		<div class="cancel_btn" @click="cancelOrderShow = true">{{ $t('confirmCancel') }}</div>

		<Dialog
			v-model:show="cancelOrderShow"
			@confirm="handleCancelRecharge"
			:show-cancel-btn="true"
			:confirmText="$t('confirmCancel')"
			:cancelText="$t('cancel')"
			:title="$t('cancelDeal')"
		>
			<template #content>
				<div class="cancen_model_cnt">{{ $t('orderDesc2') }}</div>
			</template>
		</Dialog>
	</div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import Dialog from '@/components/common/Dialog.vue'
import { AwaitApiResult } from '@/utils'
import { GetC2CCancelReason, cancelC2CRechargeCancel, getC2CRechargeDetail } from '@/api'
import type { C2CRechargeCancel, SellerInfo } from '@/types/api'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useEventBus } from '@/components/common/use'
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
const { t } = useI18n()

const eventBus = useEventBus()

const remark = ref('')
const cancelOrderShow = ref(false)
const currentRadio = ref(-1)
const orderDetail = ref<SellerInfo>()
const router = useRouter()

const cancel_radio = reactive<any[]>([])

const onClick = () => {
	router.back()
}

/**
 * @description: 取消订单弹窗确认取消
 * @return {*}
 */
const handleCancelRecharge = async (): Promise<void> => {
	await cancelRecharge()
	cancelOrderShow.value = false
}

const getCcancelReason = computed(() => {
	if (currentRadio.value === 4) {
		return remark.value
	}
	return cancel_radio.find((item) => item.id === currentRadio.value)?.reasonText as string
})

/**
 * @description: 调用取消订单接口
 * @return {*}
 */
const cancelRecharge = async (): Promise<void> => {
	let query: C2CRechargeCancel = {
		orderId: orderDetail.value?.id as number,
		cancelReason: getCcancelReason.value
	}
	const res = await AwaitApiResult(cancelC2CRechargeCancel(query))
	if (res) {
		showSuccessToast(t('code244'))
		eventBus.emit('changeKeepAliveKey')
		window.history.replaceState(null, '', window.location.href)
		router.replace({
			name: 'RechargeHistory',
			query: {
				type: 1
			}
		})
	}
}

/**
 * @description: 获取订单详情
 * @param {*} orderNo
 * @return {*}
 */
const getOrderDetail = async (orderNo: number) => {
	const res = await AwaitApiResult<ObjResNull<SellerInfo>>(getC2CRechargeDetail({ orderId: orderNo }))
	if (res) {
		orderDetail.value = res.data
	}
}

const getCancel = async () => {
	const res = await AwaitApiResult(GetC2CCancelReason({ type: 0 }))
	if (res) {
		cancel_radio.unshift(...res.data)
	}
}

onMounted(async () => {
	const orderNo = Number(router.currentRoute.value.query.orderNo)
	await getOrderDetail(orderNo)
	await getCancel()
})
</script>
<style lang="scss" scoped>
.cancel_recharge {
	padding: 0 24px;

	.info {
		padding: 42px 20px 20px;
		background: var(--bg_color_L2);
		border-radius: 10px;
		margin-bottom: 40px;

		.info_item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 33px;

			div {
				font-size: 26px;
				color: var(--norm_red-color);
			}

			span {
				font-size: 26px;
			}

			.user_name {
				color: var(--text_color_L2);
			}

			.money {
				color: var(--norm_secondary-color);
			}

			.order_num,
			.time {
				color: var(--gray-color-1);
			}
		}
	}

	.cancel_content {
		padding: 28px 20px 10px;
		background: var(--bg_color_L2);
		box-shadow:var(--BoxShadowColor-9);
		border-radius: 20px;
		margin-bottom: 48px;

		.title {
			font-size: 28px;
			line-height: 34px;
			color: var(--text_color_L1);
			margin-bottom: 30px;
			// text-indent: 16px;
			position: relative;
		}

		.title::before {
			content: '';
			display: inline-block;
			width: 6px;
			height: 30px;
			background: var(--main-color);
			margin-right: 16px;
			vertical-align: top;
		}

		.cancel_radio {
			margin-bottom: 30px;

			span {
				font-size: 24px;
				line-height: 40px;
				letter-spacing: 0.04em;
				color: var(--text_color_L2);
			}

			.radio_title::before {
				content: '';
				display: inline-block;
				width: 24px;
				height: 24px;
				border: 1px solid var(--text_color_L2);
				margin-right: 20px;
				vertical-align: middle;
				border-radius: 50%;
				box-sizing: border-box;
			}

			.textarea_input {
				width: 590px;
				padding: 26px 24px;
				background: none;
				border: 1px solid var(--Dividing-line_color);
				border-radius: 10px;
				font-size: 24px;
				line-height: 40px;
				color: var(--colorText-58);
				margin-left: 44px;
				margin-top: 14px;
			}
		}

		.radio_active {
			.radio_title::before {
				border: none;
				background: var(--main-color);
			}
		}
	}

	.tip {
		font-size: 24px;
		line-height: 40px;
		color: var(--text_color_L2);
	}

	.tip::before {
		content: '';
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-right: 24px;
		vertical-align: middle;
		background: var(--colorText-26);
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.cancel_btn {
		cursor: pointer;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 70px;
		line-height: 70px;
		text-align: center;
		font-size: 30px;
		color: var(--textW);
		background: var(--main-color);
	}

	.cancen_model_cnt {
		font-size: 24px;
		text-align: center;
		color: var(--text_color_L2);
	}
}
</style>
