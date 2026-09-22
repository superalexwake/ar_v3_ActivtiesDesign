<template>
	<div class="cancelW">
		<NavBar title="取消订单" left-arrow 
		@click-left="onBack" backgroundColor="transparent" />
		<div class="orderInfo">
			<div>
				<span>{{ $t('withdrawalA') }}</span
				><span class="b">{{ currency(orderAmount) }}</span>
			</div>
			<div>
				<span>UPI {{ $t('account') }}</span
				><span>{{ sellerAccountNo }}</span>
			</div>

			<div>
				<span>{{ formatTime(createTime, 'yyyy-MM-dd') }}</span
				><span class="copy" @click="copy(orderNo)">{{ orderNo }}</span>
			</div>
		</div>
		<div class="reason">
			<h2>{{ $t('cancelReason') }}</h2>
			<van-radio-group v-model="checked" shape="dot" checked-color="#ee0a24">
				<van-radio v-for="(item, index) in reasonList" :key="index" :name="item.id.toString()">{{
					item.reasonText
				}}</van-radio>
				<van-radio name="0">{{ $t('other') }}</van-radio>
			</van-radio-group>
			<van-field
				class="textarea"
				:disabled="checked != '0'"
				v-model="reamrk"
				rows="3"
				autosize
				type="textarea"
				maxlength="150"
				:placeholder="$t('enterOtherReason')"
			/>
		</div>
		<div class="cancel" @click="onCancel">{{ $t('confirmCancel') }}</div>
		<van-dialog v-model:show="isCDialogShow" :show-confirm-button="false" z-index="100" :closeOnClickOverlay="true">
			<img src="@public/wallet/recharge/tip.png" class="fail" />
			<div class="van-dialog__content-title">{{ $t('cancelW') }}</div>
			<div class="van-dialog__content-note">
				<span>{{ $t('c2cWTip11') }}</span>
			</div>
			<div class="van-dialog__content-btn" @click="onC">{{ $t('confirmCancel') }}</div>
			<img class="close" src="@public/main/close.png" @click="isCDialogShow=false" />
		</van-dialog>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { currency, formatTime, copy, AwaitApiResult } from '@/utils'
import { useI18n } from 'vue-i18n'
import { C2CWithdrawalCancel, GetC2CCancelReason } from '@/api/modules/wallet'
import { computed } from 'vue'
import { showFailToast } from 'vant'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const reasonList = ref()
const checked = ref('0')
const isCDialogShow = ref(false)
const reamrk = ref('')
const cancelReason = computed(() => {
	if (checked.value == '0') {
		return reamrk.value
	} else {
		return reasonList.value.find((e: any) => e.id == checked.value)?.reasonText
	}
})

const onBack = () => {
	router.go(-1)
}
const orderAmount = ref('')
const sellerAccountNo = ref('')
const createTime = ref('')
const orderNo = ref('')

async function getC2CCancelReason() {
	const res = await AwaitApiResult(GetC2CCancelReason({ type: 1 }))
	if (res) {
		reasonList.value = res.data
	}
}
async function onC() {
	const res = await AwaitApiResult(
		C2CWithdrawalCancel({ orderNo: orderNo.value, cancelReason: cancelReason.value, reamrk: '' })
	)
	if (res) {
		isCDialogShow.value = false
		onBack()
	}
}
async function onCancel() {
	if (checked.value == '0' && reamrk.value.trim().length == 0) {
		showFailToast(t('enterOtherReason'))
		return
	}
	isCDialogShow.value = true
}
onMounted(() => {
	orderAmount.value = route.query?.orderAmount?.toString() || ''
	sellerAccountNo.value = route.query?.sellerAccountNo?.toString() || ''
	createTime.value = route.query?.createTime?.toString() || ''
	orderNo.value = route.query?.orderNo?.toString() || ''
	getC2CCancelReason()
})
</script>
<style lang="scss" scoped>
.cancelW {
	padding: 20px;

	:deep(.navbar-fixed) {
		.navbar__content-title {
			color: var(--text_color_L1);
			font-size: 36px;
		}

		.navbar__content-left .van-icon {
			color: var(--text_color_L1);
		}
	}

	.orderInfo {
		color: var(--textW);;
		border-radius: 10px;
		padding: 20px;

		> div {
			margin: 20px 0;
			display: flex;
			justify-content: space-between;
			color: var(--text_color_L2);
			font-size: 26px;

			.b {
				color: var(--text_color_L1);
				font-size: 30px;
			}

			.copy {
				background-image: url('@/assets/icons/wallet/withdraw/c2c/copy-icon.png');
				background-repeat: no-repeat;
				background-size: 32px;
				background-position: right center;
				padding-right: 40px;
				color: var(--text_color_L2);
				font-size: 24px;
			}
		}

		> div:last-of-type {
			padding-top: 20px;
			border-top: 1px var(--gray-color-1) solid;
		}
	}

	.reason {
		margin-top: 30px;
		color: var(--textW);;
		border-radius: 10px;
		padding: 20px;

		h2 {
			display: flex;
			align-items: center;
			font-weight: 600;
			color: var(--text_color_L1);
			font-size: 28px;

			&::before {
				content: '';
				display: block;
				margin-right: 15px;
				width: 8px;
				height: 26px;
				background: var(--main-color);
			}
		}

		.van-radio-group {
			margin-top: 20px;

			.van-radio {
				margin: 30px 0;
			}
		}

		.textarea {
			margin-left: 50px;
			border: 1px solid var(--text_color_L2);
			width: 85%;
		}
	}

	.cancel {
		position: fixed;
		bottom: 0;
		left: -5px;
		background: var(--main-color);
		min-height: 120px;
		width: 100%;
		line-height: 120px;
		text-align: center;
		color: var(--textW);;
		font-size: 30px;
		html:lang(ar) &{
			left: unset;
			right: -5px;	
		}
	}
	:deep(.van-dialog) {
		overflow: visible;

		.van-dialog__content {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-block: 200px;
			height: 480px;
		}
	}

	.van-dialog {
		&__content {
			img {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);

				&.close {
					bottom: -68px;
					width: 55px;
				}
			}

			img.succeed {
				top: -38px;
				width: 280px;
			}

			img.fail {
				top: 3.2px;
				width: 160px;
			}

			&-title {
				margin-bottom: 30px;
				color: var(--text_color_L1);
				font-weight: 700;
				font-size: 36px;
				line-height: 36px;
				font-family: 'Poppins';
			}

			&-note {
				margin-bottom: 40px;
				display: flex;
				flex-direction: column;
				font-size: 24px;
				text-align: center;

				> span:nth-of-type(1) {
					color: var(--text_color_L2);
					margin-bottom: 20px;
				}

				> span:nth-of-type(2) {
					color: var(--main-color);
					font-size: 32px;
					font-weight: 700;
				}
			}

			&-btn {
				//padding: 15.8px 150px;
				height: 80px;
				width: 400px;
				line-height: 80px;
				color: var(--text_color_L4);
				font-size: 32px;
				font-weight: 700;
				border-radius: 144px;
				background: var(--main_gradient-color);
				text-align: center;
			}
			.close{
				margin-top: 30px;
			}
		}
	}
}
</style>
