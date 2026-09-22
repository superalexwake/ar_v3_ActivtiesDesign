<template>
	<div class="Recharge__box">
		<div class="Recharge__container">
			<NavBar class="white" :title="$t('recharge')" :placeholder="false" left-arrow @click-left="onClick">
				<template #right>
					<div class="title" @click="handleRechargeRecord">{{ $t('rechargeRecords') }}</div>
				</template>
			</NavBar>
			<!-- 余额组件 -->
			<BalanceAssets />

			<!-- 支付方式选择菜单 -->
			<RechargeMenu />

			<RechargeContainer />
			<!-- <div
				v-if="!isHaveOrder || isOtherRecharge"
				class="Recharge__container-rechageBtn"
				:class="store.rechargeSubmitBtnStatus ? 'rechage_active' : ''"
				v-throttle-click="{ handler: handleRecharge, wait: 2000 }"
			>
				{{ $t('recharge') }}
			</div> -->
			<Instructions
				v-if="currentPayId && !hiddenBox"
				:show-type="currentPayId"
				:isShowHead="true"
				:rechargeInfo="store.currentPayType"
				:show-formula="showRechargeDetail"
			/>

			<RechargeRecord ref="recordRef" v-if="currentPayId && !hiddenBox" :payID="currentPayId" :key="currentPayId" />
		</div>
		<!-- <RechargeUpiSheet /> -->

		<Dialog
			v-model:show="dialogShow"
			@confirm="handleContinueRecharge"
			:show-cancel-btn="true"
			confirmText="OK"
			:title="$t('c2cLapseOfAmount')"
		>
			<template #content>
				<div class="cancen_model_cnt">{{ $t('c2cPCAAmount') }}</div>
			</template>
		</Dialog>

		<van-dialog
			v-model:show="store.rechargeDialogVisible"
			:confirm-button-text="$t('confirm')"
		>
			<div class="promptHeader">{{ $t('prompt') }}</div>
			<div class="promptTip" v-if="[14].includes(currentPayId)">
				<p>{{$t('payNameTip')}}</p>
				<p>{{$t('payPrivacy')}}</p>
			</div>
			<div class="promptContent">
				<div class="input_item" v-for="(item, index) in store.bank_local">
					<div>{{ item.split(',')[0] }}</div>
					<input
						class="input_bank"
						:maxlength="index === 0 ? 50 : 30"
						v-model.trim="store.bankInfo[item.split(',')[1]]"
						:placeholder="`${$t('requiredFaild')} ${item.split(',')[0]}`"
						@input="validateBankForm(store.bankInfo[item.split(',')[1]], index, item.split(',')[1])"
					/>
				</div>
				<div v-if="dollarSign === '৳'" class="tip">{{ $t('rechargeBankVailte2') }}</div>
				<div v-else-if="[9,10].includes(currentPayId)" class="tip">{{ currentPayId === 9 || currentPayId === 10 ? $t('rechargeBankVailte1') : $t('rechargeBankVailte') }}</div>
				<div v-else-if="[14].includes(currentPayId)" class="promptBox">
					<h3>{{$t('payNameErrorHint')}}</h3>
					<p>1.{{$t('payOrderFail')}}</p>
					<p>2.{{$t('payCallbackFail')}}</p>
					<p>3.{{$t('payManualDelay')}}</p>
					<p>4.{{$t('payRecheck')}}</p>
				</div>
				<div class="footer_btn">
					<div @click="localBankRecharge" v-if="(store.isRechargeInputDialog && ![19,14].includes(currentPayId)) || [10, 18].includes(currentPayId)">{{ $t('confirm') }}</div>
					<div @click="otherRecharge" v-else-if="[14].includes(currentPayId)">{{ $t('confirm') }}</div>
					<div @click="store.rechargeDialogVisible = false">{{ $t('cancel') }}</div>
				</div>
			</div>
			<template #footer>
			</template>
		</van-dialog>
		<Dialog
			v-model:show="C2CforbiddenShow"
			:title="$t('C2Cforbidden', [RemainingLimitTime])"
			img-url="forbhidden"
			:showCancelBtn="false"
			@confirm="C2CforbiddenShow = false"
			:cancel-text="$t('close')"
			:confirm-text="$t('sure')"
		>
			<template #content>
				<div class="forbidden_tip">{{ $t('C2Cforbidden1', [RemainingLimitTime]) }}</div>
				<div class="forbidden1">{{ $t('C2Cforbidden2', [ErrorCount]) }}</div>
				<div class="forbidden2">{{ $t('C2Cforbidden3', [RemainingLimitTime]) }}</div>
				<div class="forbidden3">{{ $t('C2Cforbidden4') }}</div>
			</template>
		</Dialog>

		<Dialog
			v-model:show="isFirstPixRecharge"
			@confirm="handlePix()"
			:show-cancel-btn="false"
			:confirmText="$t('confirm')"
			:cancelText="$t('cancel')"
			:title="$t('safetyTips')"
		>
			<template #content>
				<div class="cancen_model_cnt">{{ $t('safetyTips1') }}</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import {onBeforeRouteLeave, useRoute, useRouter} from 'vue-router'
import Instructions from '@/components/Wallet/Recharge/Instructions.vue'
import RechargeMenu from '@/components/Wallet/Recharge/RechargeMenu.vue'
import RechargeContainer from '@/components/Wallet/Recharge/RechargeContainer.vue'
import BalanceAssets from '@/components/Wallet/BalanceAssets.vue'
import RechargeRecord from '@/components/Wallet/Recharge/RechargeRecord.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SettingStore, useWalletStore } from '@/stores'
import { useRecharge } from '@/hooks/useRecharge'
import { useEventBus } from '@/components/common/use'
import Dialog from '@/components/common/Dialog.vue'
import {useArupiEvent, useArwallet} from '@/hooks'

const {
	store,
	C2CforbiddenShow,
	ErrorCount,
	RemainingLimitTime,
	currentPayId,
	showRechargeDetail,
	validateBankForm,
	localBankRecharge,
	getRechargeTypeName,
	getAmountList,
	stratPollingQuick,
	otherRecharge,
	isFirstPixRecharge,
	isArpay,
	needPixInfo,
	isRsnpay,
	recordRef,
	isArUpiPay
	// qrcodeBankRecharge
} = useRecharge()
const {pageView,pageLeve}=useArupiEvent()
const { isArWalletActive } = useArwallet()

const router = useRouter()
const route = useRoute()
const walletStore = useWalletStore()
const eventBus = useEventBus()
const dialogShow = ref(false)
const dollarSign = computed(() => SettingStore().getDollarSign)

const hiddenBox = computed(() => {
	if (isArpay.value || isRsnpay.value) {
		if (!isArWalletActive.value || store.rsnInfo.walletActivationStatus === 1 ) {
			return true
		} else {
			return false
		}
	}
	return false
})

const handleRechargeRecord = () => {
	eventBus.emit('changeKeepAliveKey')
	router.push({ name: 'RechargeHistory' })
}

function onClick() {
	if (router.currentRoute.value.query?.type === 'Add') {
		router.go(-2)
	} else {
		router.push({
			name:'main'
		})
	}
}

const handlePix = () => {
	isFirstPixRecharge.value = false
	if (needPixInfo.value) {
		router.push({
			name: 'Withdraw-AddPIX',
			query: {
				fromV: 'Recharge'
			}
		})
	}
}

const handleContinueRecharge = () => {
	getAmountList()
	dialogShow.value = false
	console.log('继续充值')
}
watch(()=>store.currentPayType,()=>{
	if (isArUpiPay.value) {
		pageView('recharge',store.currentPayType.payTypeID)
		stratPollingQuick()
	}else {
		stratPollingQuick(true)
	}
})
onMounted(async () => {
	// 券包「去使用」带入适用大类，仅决定首次默认选中 Tab；URL 属外部输入，空串经 Number 会变 0，须连同非法值一并滤除
	const couponPayIds = String(route.query.couponPayIds ?? '')
		.split(',')
		.map(Number)
		.filter((id) => Number.isFinite(id) && id > 0)
	getRechargeTypeName(false, couponPayIds)
})
onBeforeUnmount(()=>{
	stratPollingQuick(true)
})
onBeforeRouteLeave(()=>{
	stratPollingQuick(true)
	if (!isArUpiPay.value) {
		return
	};
	pageLeve('recharge',store.currentPayType.payTypeID)
})
</script>

<style lang="scss" scoped>
::v-deep(.van-action-sheet) {
	max-height: 90%;
}

::v-deep(.van-action-sheet__header) {
	background: linear-gradient(180deg, #ff6c6b 0%, #ff4a4a 68.59%);
	color: var(--textW);
}

::v-deep(.van-action-sheet__close) {
	top: 1.5%;
}

#third_content {
	height: 90vh;
}

.Recharge__box {
	position: relative;
	width: 100%;
	font-family: 'Inter', sans-serif;
	overflow: hidden;
	padding-bottom: 120px;

	.Recharge__container {
		position: relative;
		width: 100%;
		padding: 0 24px 24px 24px;

		.title {
			font-weight: 400;
			font-size: 26px;
		}
		&-balanceAssets {
			width: 100%;
			height: 260px;
			background-image: url('@icon/main/TotalAssetsBg.png');
			background-repeat: no-repeat;
			background-size: 100%;
			background-position: center;
			border-radius: 20px;
			color: var(--textW);
			padding: 29px 25px 0 25px;
			position: relative;

			&__header {
				display: flex;
				justify-content: space-between;
				height: 40px;

				&__left {
					font-weight: 400;
					font-size: 26px;

					img {
						margin-right: 16px;
					}
				}

				&__left {
					display: flex;
					align-items: center;

					img {
						width: 36px;
						height: 36px;
						margin-right: 16px;
					}
				}
			}

			&__main {
				height: 55px;
				display: flex;
				align-items: center;
				margin: 16px 28px 28px 0;
				font-weight: 700;
				font-size: 48px;
				text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.12);

				img {
					width: 44px;
					height: 28px;
					margin-left: 18px;
				}
			}

			&__tip {
				img {
					width: 50px;
					height: 32px;
					position: absolute;
					bottom: 26px;
					left: 29px;
				}
			}
		}

		&-paymoney {
			background: var(--bg_color_L2);
			border-radius: 20px;
			margin-top: 20px;
			padding: 30px 22px 32px 20px;

			&__title {
				display: flex;
				font-weight: 600;
				font-size: 36px;
				margin-bottom: 26px;

				img {
					width: 48px;
					height: 48px;
					margin-right: 23px;
				}
			}

			&__money-list {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 20px;

				&__item {
					margin-bottom: 20px;
					margin-right: 30px;
					width: 200px;
					height: 70px;
					color: #ff5a58;
					border: 1px solid #dfdede;
					display: flex;
					align-items: center;
					justify-content: center;

					&.active {
						background: var(--main_gradient-color);
						border-radius: 10px;
						color: var(--textW);
						border: none;
					}
				}
			}

			&__money-input {
				display: flex;
				position: relative;

				.inp {
					height: 88px;
					flex: 1;
					background: #f2f2f2;
					border-radius: 60px;
					position: relative;
					padding-left: 112px;
					padding-right: 80px;
					color: var(--main-color);
					border: none;
					font-weight: 700;
				}

				.place-div {
					position: absolute;
					height: 88px;
					width: 90px;
					/* display: flex;
				align-items: center;
				justify-content: center; */

					img {
						width: 28px;
						height: 46px;
						margin-top: 21px;
						margin-left: 40px;
					}

					.place-icon {
						width: 28px;
						height: 46px;
						position: relative;
					}
				}

				.place-div::after {
					position: absolute;
					content: '';
					height: 40px;
					display: inline-block;
					margin: 0 10px 2px;
					vertical-align: middle;
					border-right: 2px solid #bdbdbd;
					top: 26px;
					right: -10px;
				}

				.place-right {
					position: absolute;
					right: 24px;
					top: 24px;
					display: flex;
					align-content: center;
					justify-content: center;

					img {
						width: 40px;
						height: 40px;
					}
				}
			}
		}

		&-rechageBtn {
			// position: fixed;
			// bottom: 0;
			// left: 50%;
			// transform: translateX(-50%);
			font-size: 30px;
			z-index: 88;
			background: var(--button_dis_color);
			width: 100%;
			max-width: 750px;
			height: 70px;
			line-height: 70px;
			color: var(--textW);
			text-align: center;
			border-radius: 50px;
			margin-bottom: 30px;
		}
	}
	.forbidden_tip {
		color: #f95959;
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: 36px; /* 150% */
		margin-bottom: 40px;
		text-align: center;
	}
	.forbidden1,
	.forbidden2 {
		width: 100%;
		color: var(--text_color_L2);
		font-size: 22px;
		font-style: normal;
		font-weight: 400;
		line-height: 22px; /* 100% */
		padding: 10px 0;
		text-align: center;
	}
	.forbidden3 {
		width: 100%;
		color: var(--text_color_L2);
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		line-height: 36px; /* 150% */
		padding-top: 40px;
		margin-bottom: 40px;
		text-align: center;
	}

	.rechage_active {
		background: var(--main-color);
		color: var(--text_color_L4);
	}
}

@media screen and (max-width: 500px) {
	.Recharge__box {
		position: relative;
		width: 100%;
		font-family: 'Inter', sans-serif;
		overflow: hidden;

		.Recharge__container {
			&-rechageBtn {
				max-width: none;
			}
		}
	}
}

.cancen_model_cnt {
	font-size: 24px;
	text-align: center;
	color: var(--text_color_L2);
}

/**首页公告弹窗样式 */
:deep() .van-dialog {
	width: 700px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	background: var(--main_gradient-color);
	padding: 0 24px 24px;

	&__content {
		position: relative;
		width: 100%;
		.promptHeader {
			text-align: center;
			height: 88px;
			line-height: 88px;
			color: var(--text_color_L4);
			font-weight: 700;
			font-size: 36px;
			position: relative;
		}
		.promptHeader::before {
			content: '';
			position: absolute;
			left: 0;
			top: 40px;
			display: inline-block;
			width: 110px;
			height: 2px;
			margin-right: 10px;
			background: linear-gradient(-90deg, #FFF -2.73%, rgba(255, 255, 255, 0.00) 91.36%);
			html:lang(ar) &{
				left: 20px;
				right: unset;
			}
		}
		.qrcodeHeader{
			background: none;
		}
		.qrcodeHeader::before{
			width: 80px;
			height: 2px;
			background: linear-gradient(90deg, #FFFFFF -2.73%, rgba(255, 255, 255, 0) 91.36%);
			transform: rotate(180deg);
			margin-bottom: 10px;
    		margin-right: 100px;
		}
		.promptHeader::after {
			content: '';
			position: absolute;
			right: 0;
			top: 40px;
			display: inline-block;
			width: 110px;
			height: 2px;
			margin-left: 10px;
			background: linear-gradient(90deg, #FFF -2.73%, rgba(255, 255, 255, 0.00) 91.36%);
			html:lang(ar) &{
				left: unset;
				right: 20px;
			}
		}
		.qrcodeHeader::after{
			width: 80px;
			height: 2px;
			background: linear-gradient(90deg, #FFFFFF -2.73%, rgba(255, 255, 255, 0) 91.36%);
			margin-bottom: 10px;
    		margin-left: 100px;
		}
		.promptContent {
			padding: 30px 20px;
		}
	}
	&.qrcodeDialog{
		background: linear-gradient(180deg, #FF6C6B 0%, #FF4A4A 74.07%);
		padding: 0 20px 20px;
		.promptContent{
			height: 600px;
			background: #fff;
			box-shadow: 0px 4px 4px 0px #E53636;
			border-radius: 20px;
		}
		.qrcodeFooter{
			width: 100%;
			padding: 40px 0;
			div {
				height: 70px;
				border-radius: 70px;
				text-align: center;
				line-height: 70px;
			}
			div:nth-child(1) {
				background-color: #f13f39;
				color: #fff;
				margin-bottom: 30px;
			}
			div:nth-child(2) {
				color: #f13f39;
				border: 1px solid #f13f39;
				
			}
		}
	}
}
.promptTip{
	margin-bottom: 20px;
	width: 100%;
	color: var(--text_color_L4);
	font-size: 24px;
	font-style: normal;
	font-weight: 500;
	line-height: 33px; /* 150% */
	p{
		margin-bottom: 10px;
	}
}
.promptBox{
	width: 100%;
	padding: 24px;
	margin: auto;
	border-radius: 20px;
	border: 2px solid var(--main-color);
	h3{
		color: var(--text_color_L1);
		font-size: 28px;
		font-weight: 600;
	}
	p{
		color: var(--main-color);
		font-size: 24px;
		font-style: normal;
		font-weight: 400;
		margin-bottom: 10px;
	}
}
.promptContent {
	width: 100%;
	padding: 24px;
	margin: auto;
	border-radius: 20px;
	background: var(--bg_color_L2);
	.input_item {
		margin-bottom: 40px;
		div {
			color: var(--text_color_L1);
			font-size: 28px;
			font-family: Inter;
			font-weight: 500;
			line-height: 36px;
			margin-bottom: 10px;
		}
		input {
			width: 100%;
			background: var(--bg_color_L1);
			height: 80px;
			color: var(--text_color_L1);
			font-size: 24px;
			line-height: 80px;
			padding: 22px;
			border: none;
			border-radius: 10px;
		}
		input::placeholder {
			color: #b0b0b0;
			font-size: 24px;
			line-height: 80px;
		}
	}
	.tip {
		color: var(--norm_red-color);
		font-size: 22px;
		font-style: normal;
		font-weight: 400;
	}
}
.footer_btn {
	padding-top: 36px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	margin-bottom: 34px;
	div {
		width: 100%;
		height: 70px;
		border-radius: 70px;
		text-align: center;
		line-height: 70px;
	}
	div:nth-child(1) {
		background: var(--main_gradient-color);
		color: #fff;
		margin-bottom: 24px;
	}
	div:nth-child(2) {
		color: var(--main-color);
		border: 1px solid var(--main-color);
	}
}
:deep(.arupiAmount-dialog){
	background: var(--bg_color_L3)!important;
}
</style>