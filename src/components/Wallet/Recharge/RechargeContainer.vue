<template>
	<div class="Recharge__content">
		<!--  选择通道  -->
		<div
			class="Recharge__content-quickInfo boxStyle"
			v-if="!isLocakBank && !isArpay && !isRsnpay && !isHaveOrder && currentPayId !== 10"
		>
			<div class="Recharge__content-quickInfo__title">
				<div class="title">
					<svg-icon name="quickpay2"></svg-icon>
					<p>{{ $t('RCTXT1') }}</p>
				</div>
			</div>
			<div class="rechargeTypes_list" :class="{ numberPay: isNumberPay }">
				<div
					class="Recharge__content-quickInfo__item"
					v-for="(item, index) in store.rechargeTypes"
					:class="{ item_active: currentPayTypeId === item.payTypeID }"
					:key="item.payTypeID"
					@click="handleSelectPayType(index)"
				>
					<div v-if="currentPayId !== 11" class="other">
						<div>{{ item.payName }}</div>
						<div>{{ $t('RCTXT2') }}{{ item.miniPrice }} - {{ formatNum(item.maxPrice) }}</div>
						<div class="bouns" v-if="item.rechargeRifts > 0">
							{{ $t('bonus') }}: {{ bouns(item.rechargeRifts * 100) }}%<span v-if="item.delayedRewardDays > 0"> {{ item.delayedRewardDays }} {{ $t('days') }}</span>
						</div>
						<div class="feeRate" v-if="Number(item.serviceFeeRate) > 0">
							{{ $t('feeRate') }}: {{ bouns(Number(item.serviceFeeRate) * 100) }}%
						</div>
					</div>
					<div class="usdt_icon" v-else>
						<img src="@icon/wallet/usdt.png" alt="" />
						<div>
							<div>{{ item.payName }}</div>
							<div>{{ $t('RCTXT2') }}{{ item.miniPrice }} - {{ formatNum(item.maxPrice) }}</div>
							<div class="bouns" v-if="item.rechargeRifts > 0">
								{{ $t('bonus') }}: {{ bouns(item.rechargeRifts * 100) }}%<span v-if="item.delayedRewardDays > 0"> {{ item.delayedRewardDays }} {{ $t('days') }}</span>
							</div>
							<div class="feeRate" v-if="Number(item.serviceFeeRate) > 0">
								{{ $t('feeRate') }}: {{ bouns(Number(item.serviceFeeRate) * 100) }}%
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			class="other_bank"
			v-if="isOtherRecharge && store.thirdPayBankList.length > 0 && currentOtherThirdBankList.length > 0"
		>
			<div class="select_bank_tit"><svg-icon name="bank"></svg-icon>{{ $t('selectBank') }}</div>
			<div class="bank_name" @click="showOtherSelect = true">
				{{ store.selectOtherBank?.bankName }}
				<van-icon name="arrow" class="right_arrow" />
			</div>
		</div>
		<!-- 孟加拉的转账类型选择 -->
		<div v-if="dollarSign === '৳' && !isHaveOrder && currentPayId === 9" class="transfer boxStyle">
			<div class="title">
				<svg-icon name="transf_amount" />
				{{ $t('transferType') }}
			</div>
			<div class="transfer_list">
				<div class="item" :class="{ transfer_active: transfer === 1 }" @click="transfer = 1">
					<img src="@public/wallet/recharge/banktobank.png" alt="" />
					{{ $t('banktobank') }}
				</div>
				<div class="item" :class="{ transfer_active: transfer === 2 }" @click="transfer = 2">
					<img src="@public/wallet/recharge/wallettobank.png" alt="" />
					{{ $t('wallettobank') }}
				</div>
			</div>
		</div>

		<!-- 银行列表 -->
		<div class="bank_list" v-if="isLocakBank && isSplitLocalEWallet && IsShowRechargeBankList && !isHaveOrder">
			<div
				v-for="(item, index) in dollarSign === '৳' ? getTransferBankList : store.bankList"
				class="bank_item"
				:class="{ bank_item_active: store.currentBankIndex === index }"
				@click="handleSelectBank(index)"
			>
				<img v-lazy="item.bankLogo" alt="" :data-img="slotWalletIcon" />
				{{ item.bankName }}
			</div>
		</div>
		<NoActivate page-type="wallet/recharge" v-if="!isArWalletActive && isArpay" />
		<!-- <div class="toActive" @click="goActive('wallet/recharge', 'RSN')" v-if="store.rsnInfo.walletActivationStatus === 0 && isRsnpay">
			{{$t('RNSActive')}}
		</div> -->
		<!-- 充值金额选择 -->
		<div class="Recharge__content-paymoney boxStyle" v-if="showRechargeMoneyBox">
			<div class="Recharge__content-paymoney__title">
				<svg-icon name="saveWallet" v-if="!isNumberPay"></svg-icon>
				<img :src="getWalletIcon(numberKeyObj[currentPayId].icon)" alt="" v-else />
				<p v-if="!isNumberPay">{{ isArpay ? $t('arbRecharge') : isRsnpay ? $t('rsnRecharge') : $t('rechageAmount') }}</p>
				<p v-else>{{ numberKeyObj[currentPayId]?.selectText || '' }}</p>
			</div>
			<div class="Recharge__content-paymoney__money-list">
				<div
					class="Recharge__content-paymoney__money-list__item"
					:class="store.currentQuickIndex === index ? activeClass : ''"
					v-for="(item, index) in store.quickList"
					:key="index"
					@click="handleQuickSelect(index)"
				>
					<div class="amount" :class="{ arAmount: isArpay }">
						<img v-if="isNumberPay" :src="getWalletIcon(numberKeyObj[currentPayId].icon)" alt="" class="usdt" />
						<span v-if="!isNumberPay && !isArpay">{{ dollarSign }}</span>
						{{ isArpay ? '₹' + formatNum(Number(item.rechargeAmount)) : formatNum(Number(item.rechargeAmount)) }}
					</div>
					<div v-if="item.giftAmount > 0" class="ar_gift">
						{{ $t('k3WarningTip4') }} + {{ dollarSign }}
						<span>{{ formatNum(Number(item.giftAmount)) }}</span>
					</div>
				</div>
			</div>
			<RechargeDetail />
			<div class="Recharge__content-paymoney__money-input" :class="{ radius: isNumberPay }" v-if="isNumberPay">
				<div class="place-div" :class="numberKeyObj[currentPayId].icon"></div>
				<van-field
					v-model.number="store.numberPayAmount"
					type="number"
					autocomplete="new-password"
					:placeholder="numberKeyObj[currentPayId].placeholder"
					class="amount-input"
					@input="handleInput($event)"
				/>
				<div class="place-right" @click="handleClearInput()">
					<img src="@public/wallet/recharge/clean.png" alt="" />
				</div>
			</div>
			
			<template v-if="currentPayId != 6">
				<div class="Recharge__content-paymoney__money-input" :class="{ radius: isNumberPay }">
					<div class="place-div">{{ dollarSign }}</div>
					<van-field
						v-if="isNumberPay"
						:disabled="isNumberPay"
						v-model.number="store.numberExchangeRate"
						type="number"
						autocomplete="new-password"
						:placeholder="$t('enterAmount')"
						class="amount-input"
						@input="handleInput($event)"
					/>
					<van-field
						v-else
						v-model.number="store.amount"
						type="digit"
						autocomplete="new-password"
						:placeholder="placeholder"
						class="amount-input"
						@input="handleInput($event)"
					/>
					<div class="unit" v-if="currentPayId === 20">
						{{ getC2CunitAmount }}
					</div>
					<div class="place-right" @click="handleClearInput()" v-if="!isNumberPay && !isArpay">
						<img src="@public/wallet/recharge/clean.png" alt="" />
					</div>
					<div class="ar_all" v-if="isArpay" @click="handleAll">{{ $t('withdrawStatem1') }}</div>
				</div>
			</template>
			<div v-if="store.validateAmount" class="recharge_tip">{{ store.validateAmount }}</div>
		</div>

		<div class="Recharge__content-waitPay boxStyle" v-show="isHaveOrder">
			<img src="@icon/wallet/tip.png" alt="" />
			<div class="wait_text">{{ $t('RCTXT3') }}</div>
			<div class="Recharge__content-waitPay__countdown" ref="countdownRef" v-if="!isArpay && !isArUpiPay">
				<span>3</span>
				<span>0</span>
				<span>:</span>
				<span>0</span>
				<span>0</span>
			</div>
			<div class="go_pay" @click="checkCanPay">
				{{ $t('RCTXT4') }}
			</div>
		</div>
		<div class="Recharge__content-fixed" v-if="!isHaveOrder || isOtherRecharge">
			<div class="Recharge__content-fixed-box">
				<div>
					<p>{{ $t('rechargeMethod') }}:</p>
					<h2>{{ store.currentPayType?.payName }}</h2>
				</div>
				<div
					class="Recharge__container-rechageBtn"
					:class="store.rechargeSubmitBtnStatus ? 'rechage_active' : ''"
					v-throttle-click="{ handler: handleRecharge, wait: 2000 }"
				>
					{{ $t('recharge') }} {{ currency(store.amount) }}
				</div>
			</div>
		</div>
		<van-popup v-model:show="showOtherSelect" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'bankName', value: 'bankCode', children: 'children' }"
				:columns="currentOtherThirdBankList"
				@cancel="showOtherSelect = false"
				@confirm="confirmOtherSelectBank"
			/>
		</van-popup>
	</div>
	<van-dialog v-model:show="showAmountError" :show-confirm-button="false" :width="327">
		<div class="showAmountError">
			<div class="title1">{{ $t('arb1') }}</div>
			<div class="title2">{{ $t('arb2') }}</div>
			<div class="title2 red">{{ $t('arb3', [arWallet?.withdrawalRewardRatio || 0]) }}</div>
			<div class="button">
				<div class="clance" @click="showAmountError = false">{{ $t('cancel') }}</div>
				<div class="goBuy" @click="handleWallet">{{ $t('arb4') }}</div>
			</div>
		</div>
	</van-dialog>
	<van-dialog
		class="arupiAmount-dialog"
		v-model:show="showArupiAmount"
		:closeOnClickOverlay="false"
		:show-confirm-button="false"
		:width="327"
	>
		<div class="arupiAmount">
			<div class="title1">{{ $t('recommendedA') }}</div>
			<div class="title2">{{ $t('arupiPayTip') }}</div>
			<ul>
				<li
					v-for="item of arupiAmountList"
					:class="{ active: arupiAmount === item }"
					:key="item"
					@click="
						() => {
							arupiAmount = item
						}
					"
				>
					{{ currency(item) }}
				</li>
			</ul>
			<div class="button column">
				<div
					class="goBuy"
					v-throttle-click="{
						handler: () => {
							store.amount = arupiAmount
							amountType = 3
							showArupiAmount = false
							handleRecharge()
						},
						wait: 2000
					}"
				>
					{{ $t('recharge') }} {{ $t('recommendedA') }}
				</div>
				<div
					class="clance"
					v-throttle-click="{
						handler: () => {
							amountType = 3
							showArupiAmount = false
							handleRecharge()
						},
						wait: 2000
					}"
				>
					{{ $t('c2cRechargeUpiSheet4') }} {{ currency(store.amount) }}
				</div>
			</div>
		</div>
	</van-dialog>
	<van-dialog
		class="arupiAmount-dialog"
		:closeOnClickOverlay="false"
		v-model:show="cancelOrder"
		:show-confirm-button="false"
		:width="327"
	>
		<div class="arupiAmount">
			<div class="title1">{{ $t('tips') }}</div>
			<div class="title2">{{ $t('arupiOrderTip') }}</div>

			<div class="button">
				<div class="goBuy" @click="onCancelRechargeOrder">{{ $t('confirmCancel') }}</div>
				<div class="clance" @click="cancelOrder = false">{{ $t('cancel') }}</div>
			</div>
		</div>
	</van-dialog>
	<van-dialog
		class="arupiAmount-dialog"
		:closeOnClickOverlay="false"
		v-model:show="store.arupiGoingOrder"
		:show-confirm-button="false"
		:width="327"
	>
		<div class="arupiAmount">
			<div class="title1 arupi-header">{{ $t('orderNotCompleted') }}</div>
			<div class="title2" v-if="store.goingOrder?.paymentPageExpire == 0 && store.goingOrder?.utrSubmitSuccess == 0">
				{{ $t('arupiOrderTip2') }}
			</div>
			<div
				class="title2"
				v-else-if="
					store.goingOrder?.paymentPageExpire == 1 &&
					store.goingOrder?.utrSubmitSuccess == 0 &&
					store.goingOrder?.kycConfirmOrderStatus == 4
				"
			>
				{{ $t('arupiOrderTip3') }}
			</div>
			<div
				class="title2"
				v-else-if="
					store.goingOrder?.paymentPageExpire == 1 &&
					store.goingOrder?.utrSubmitSuccess == 0 &&
					store.goingOrder?.kycConfirmOrderStatus == 0
				"
			>
				{{ $t('arupiOrderTip4') }}
			</div>
			<div class="title1">{{ $t('rechageAmount') }}：{{ currency(store.goingOrder?.orderAmount) }}</div>
			<div class="button column">
				<div
					class="goBuy"
					v-if="store.goingOrder?.paymentPageExpire == 0 && store.goingOrder?.utrSubmitSuccess == 0"
					@click="goArapiPayToOrderDetail('arupi')"
				>
					<h3>{{ $t('c2cRechargeUpiSheet4') }}</h3>
					<p>{{ $t('continuePurchase') }}</p>
				</div>
				<div
					class="goBuy"
					v-else-if="
						store.goingOrder?.paymentPageExpire == 1 &&
						store.goingOrder?.utrSubmitSuccess == 0 &&
						store.goingOrder?.kycConfirmOrderStatus == 4
					"
					@click="goToOrderAppeal(store.goingOrder)"
				>
					<h3>{{ $t('Appeal') }}</h3>
				</div>
				<div
					class="goBuy"
					v-else-if="
						store.goingOrder?.paymentPageExpire == 1 &&
						store.goingOrder?.utrSubmitSuccess == 0 &&
						store.goingOrder?.kycConfirmOrderStatus == 0
					"
					@click="
						gotoBanklist({
							rechargeNumber: store.goingOrder?.merchantOrderNo
						})
					"
				>
					<h3>{{ $t('arupiBank') }}</h3>
				</div>
				<div
					class="clance"
					v-if="store.goingOrder?.paymentPageExpire == 0 && store.goingOrder?.utrSubmitSuccess == 0"
					@click="router.push({ name: 'arupi', query: { type: 4 } })"
				>
					<h3>{{ $t('subutr') }}</h3>
					<p>{{ $t('transferredOrder') }}</p>
				</div>
			</div>
			<p class="text">
				{{ $t('utrpay') }} <span @click="openReason">{{ $t('concelOrder') }}</span>
			</p>
		</div>
	</van-dialog>
	<van-popup position="bottom" v-model:show="store.reasonShow" :z-index="3000">
		<div class="reason pr16 pb16 pl16 pt16">
			<div class="title mb16 x-row x-row-middle-center">{{ $t('cancelOrder') }}</div>
			<van-radio-group icon-size="16px" v-model="from.checked" checked-color="#EE4D4D" @change="getChecked">
				<van-radio :name="index" class="item" v-for="(item, index) in reasonList" :key="index">{{
					item.reason
				}}</van-radio>
				<!-- <van-radio name="2" class="item">UPI账号错误</van-radio>
						<van-radio name="3" class="item">银行系统维护</van-radio>
						<van-radio name="4" class="item">其他</van-radio> -->
			</van-radio-group>
			<div class="pl25 mt10">
				<textarea class="row" v-model="from.text" rows="4" :placeholder="$t('sellTip18')" @input="getText" />
			</div>
			<div class="btn x-row x-row-middle-center" @click="confirmPay">{{ $t('confirmCancel') }}</div>
		</div>
	</van-popup>
	<van-dialog
		class="arupiAmount-dialog"
		:closeOnClickOverlay="false"
		v-model:show="confirmShow"
		:show-confirm-button="false"
		:width="327"
	>
		<div class="arupiAmount">
			<div class="title1">{{ $t('cancelDeal') }}</div>
			<div class="title2">{{ $t('paymeConfirm') }}</div>
			<div class="button">
				<div class="clance" @click="router.push({ name: 'arupi', query: { type: 4 } })">{{ $t('payme') }}</div>
				<div class="goBuy" @click="submitCancel">{{ $t('confirmCancel') }}</div>
			</div>
		</div>
	</van-dialog>
</template>

<script setup lang="ts">
import { currency, bouns } from '@/utils'
import { getWalletIcon } from '@/utils/assetIcons'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SettingStore } from '@/stores'
import { useRecharge } from '@/hooks/useRecharge'
import { useI18n } from 'vue-i18n'
import { useArwallet } from '@/hooks'
import NoActivate from '../Withdraw/Ar/noActivate.vue'
import RechargeDetail from './RechargeDetail.vue'
import { showConfirmDialog, showFailToast } from 'vant'
import { arbApiLine } from '@/api/arupi/line'
const countdownRef = ref<HTMLElement>() // 倒计时dom

const {
	store,
	currentPayId,
	isLocakBank,
	isArpay,
	isNumberPay,
	isHaveOrder,
	currentPayTypeId,
	placeholder,
	showArupiAmount,
	arupiAmountList,
	arupiAmount,
	cancelOrder,
	amountType,
	onCancelRechargeOrder,
	handleSelectPayType,
	goArapiPayToOrderDetail,
	numberKeyObj,
	handleQuickSelect,
	handleInput,
	getC2CunitAmount,
	handleClearInput,
	formatNum,
	setCountdownRef,
	getElwallett,
	isSplitLocalEWallet,
	handleSelectBank,
	IsShowRechargeBankList,
	showOtherSelect,
	confirmOtherSelectBank,
	isOtherRecharge,
	currentOtherThirdBankList,
	getTransferBankList,
	transfer,
	handleRecharge,
	onJumpArUpi,
	goToOrderAppeal,
	gotoBanklist,
	showAmountError,
	isRsnpay,
	isArUpiPay,
	reasonList,
	from,
	getCancellationReasonList
} = useRecharge()
const { t } = useI18n()
const { arWallet, isArWalletActive, goWallet } = useArwallet()
const router = useRouter()
const dollarSign = computed(() => SettingStore().getDollarSign)
const activeClass = computed(() => (isArpay.value ? 'arActive' : 'active'))
const confirmShow = ref(false)
const openReason = async () => {
	try {
		await getCancellationReasonList()
	} catch (e) {
	} finally {
		store.reasonShow = true
	}
}
const getText = (_e: any) => {
	if (_e.target.value) {
		from.checked = -1
	}
}
const getChecked = (_e: number) => {
	if (_e > -1) {
		from.text = ''
	}
}
const confirmPay = () => {
	const isEx = store.goingOrder?.paymentPageExpire == 0 && store.goingOrder?.utrSubmitSuccess == 0
	if (!isEx) {
		submitCancel()
		return
	}
	confirmShow.value = true
	store.reasonShow = false
}
const submitCancel = async () => {
	const { checked, text } = from
	if (checked === -1 && !text) {
		return showFailToast(t('addCancelDes'))
	}
	store.reasonShow = false
	if (!store.goingOrder) return
	await onCancelRechargeOrder(store.goingOrder?.paymentPageExpire == 0 && store.goingOrder?.utrSubmitSuccess == 0)
}
watch(
	() => store.goingOrder,
	() => {
		if (!store.goingOrder) {
			confirmShow.value = false
		}
	}
)
onMounted(() => {
	setCountdownRef(countdownRef.value as HTMLElement)
	arbApiLine.remeasure() // 进入充值页预热重测(带 30s 冷却),预选最快 arupi 线路
})

const handleAll = () => {
	store.amount = 1000
	store.currentQuickIndex = -1
}

const showRechargeMoneyBox = computed(() => {
	if (isArpay.value || isRsnpay.value) {
		if (isArWalletActive.value || store.rsnInfo.walletActivationStatus === 1) {
			return true
		} else {
			return false
		}
	} else {
		return !isHaveOrder.value
	}
})

/**
 * 检查是否能支付
 */
const checkCanPay = async () => {
	let payTypeID = currentPayId.value === 18 ? getElwallett() : store.currentPayType.payTypeID
	if (currentPayId.value === 21) {
		if (store.isArPayOrder?.includes('&GroupID=')) {
			const url = new URL(store.isArPayOrder?.replaceAll('/#', ''))
			const groupid = url.searchParams.get('GroupID')
			const group = Number(groupid)
			if ((group & 512) === 512) {
				await goWallet()
				return
			}
		}
		window.location.href = store.isArPayOrder as unknown as string
		return
	}
	if (currentPayId.value === 26) {
		// window.location.href = store.isArUpiPayOrder as unknown as string
		onJumpArUpi(store.isArUpiPayOrder || '')
		return
	}
	if (currentPayId.value === 12) {
		return router.push({
			name: 'OtherPay',
			query: {
				type: 'upi'
			}
		})
	}
	if (currentPayId.value === 19) {
		return router.push({
			name: 'RechargeUsdt',
			query: {
				amount: store.numberPayAmount
			}
		})
	}
	router.push({
		name: 'RechargeDetail',
		query: {
			currentPayId: currentPayId.value,
			payTypeId: payTypeID,
			amount: store.amount
		}
	})
}
const handleWallet = () => {
	goWallet('wallet/recharge')
}
</script>

<style lang="scss" scoped>
:deep(.van-cell:after) {
	border: none;
}
.boxStyle {
	background: var(--darkBg, var(--bg_color_L2));
	border-radius: 20px;
	margin-top: 20px;
	padding: 30px 22px 32px 20px;
	margin-bottom: 30px;
}
.reason {
	.title {
		color: var(--text_color_L1);
	}
	textarea {
		background: var(--bg_color_L3);
		color: var(--text_color_L2);
		border: none;
		border-radius: 16px;
	}
	.row {
		width: 100%;
		padding: 20px;
	}
	.btn {
		height: 80px;
		line-height: 80px;
		border-radius: 16px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 32px;
		font-weight: 500;
		margin-top: 32px;
	}
}
.Recharge__content {
	&-fixed {
		&-box {
			max-width: 750px;
			margin: 0 auto;
			background: var(--darkBg, var(--bg_color_L2));
			padding: 20px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: var(--darkTextW, var(--text_color_L1));
		}
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;

		p {
			font-size: 24px;
			font-weight: 400;
			margin-bottom: 6px;
		}
		h2 {
			font-size: 26px;
			font-weight: 600;
			margin-bottom: 0;
		}
	}
	&-paymoney {
		&__title {
			display: flex;
			font-weight: 600;
			font-size: 36px;
			margin-bottom: 26px;
			color: var(--darkTextW, var(--text_color_L1));

			.svg-icon,
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
				width: calc((100% - 60px) / 3);
				border: 1px solid var(--Dividing-line_color);
				padding: 12px 0;
				border-radius: 10px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 10px;
				color: var(--main-color);
				background-color: var(--bg_color_L2);

				.amount {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					font-size: 32px;
					gap: 10px;
					span {
						position: absolute;
						left: 8px;
						color: var(--text_color_L3);
						font-size: 32px;
						html:lang(ar) & {
							right: 16px;
							left: unset;
						}
					}

					.usdt {
						width: 36px;
						height: 36px;
					}

					.unit {
						width: 20px;
						height: 40px;
						margin-top: -20px;
					}
				}
				.arAmount {
					font-weight: 700;
				}
				.ar_gift {
					font-size: 20px;
					span {
						color: #ff5a58;
					}
				}

				&.active {
					background: var(--main_gradient-color);
					border-radius: 10px;
					color: var(--text_color_L4);
					border: none;
					span {
						color: #fff;
					}
				}
				&.arActive {
					background: var(--main_gradient-color);
					color: var(--text_color_L4);
					border: 1px solid var(--bg_color_L3);
					span {
						color: var(--text_color_L4);
					}
				}
			}

			&__item:nth-child(3n) {
				margin-right: 0;
			}
		}

		& .recharge_tip {
			margin-top: 10px;
			color: var(--norm_red-color);
			font-size: 22px;
		}

		&__money-input {
			position: relative;
			height: 88px;
			width: 100%;
			display: flex;
			background: var(--bg_color_L1);
			border-radius: 44px;

			&.radius {
				border-radius: 10px;
			}

			.unit {
				position: absolute;
				right: 80px;
				top: 26px;
				font-size: 28px;
				color: var(--text_color_L2);
				width: fit-content;
				flex: none;
				html:lang(ar) & {
					right: unset;
					left: 80px;
				}
			}

			.place-div {
				position: absolute;
				height: 88px;
				width: 60px;

				color: var(--main-color);
				font-weight: 900;
				font-size: 42px;
				line-height: 88px;
				html:lang(ar) & {
					right: 10px;
				}

				&::before {
					content: '';
					height: 40px;
					position: absolute;
					border-left: 1px solid #bdbdbd;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					html:lang(ar) & {
						right: unset;
						left: 0;
					}
				}

				&.usdt {
					background: url('@icon/wallet/usdt.png') no-repeat center;
					background-size: 48px;
				}
				&.trx {
					background: url('@icon/wallet/trx.png') no-repeat center;
					background-size: 48px;
				}
			}
			.amount-input {
				background-color: transparent;
				margin-left: 100px;
				:deep(input) {
					color: var(--main-color);
					font-weight: 700;

					&::placeholder {
						font-weight: 400;
					}
				}
			}
			.inp {
				width: 70%;
				height: 88px;
				background: none;
				border: none;
				//color: #A6A6A6;
				color: var(--main-color);
				letter-spacing: 0.04em;
				font-weight: 700;
				font-size: 30px;
				line-height: 88px;
				margin-left: 100px;
				padding-left: 20px;
				padding-bottom: 0px;

				&:focus {
					outline: none;
				}
			}

			.place-div {
				height: 88px;
				width: 90px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--main-color);
				img {
					width: 28px;
					height: 46px;
				}

				.place-icon {
					width: 28px;
					height: 46px;
					position: relative;

					.usdt {
						width: 48px;
						height: 48px;
						margin-left: -10px;
					}
				}
			}

			.place-div::after {
				position: absolute;
				content: '';
				height: 40px;
				display: inline-block;
				margin: 0 10px 2px;
				vertical-align: middle;
				border-right: 2px solid var(--text_color_L3);
				top: 26px;
				right: -10px;
				html:lang(ar) & {
					right: unset;
					left: -10px;
				}
			}
			.ar_all {
				width: 100px;
				line-height: 88px;
				color: var(--main-color);
				font-size: 28px;
				margin-right: 40px;
			}
			.place-right {
				position: absolute;
				right: 24px;
				top: 24px;
				display: flex;
				align-content: center;
				justify-content: center;
				html:lang(ar) & {
					right: unset;
					left: 24px;
				}
				img {
					width: 40px;
					height: 40px;
				}
			}

			+ .Recharge__content-paymoney__money-input {
				margin-top: 20px;
			}
		}
	}

	&-quickInfo {
		margin-bottom: 40px;
		&__title {
			width: 100%;
			display: flex;
			margin-bottom: 26px;
			align-items: center;

			.title {
				display: flex;
				font-weight: 400;
				font-size: 32px;
				color: var(--darkTextW, var(--text_color_L1));

				.svg-icon {
					width: 48px;
					height: 48px;
					margin-right: 23px;
				}
			}
		}

		.item_active {
			background: var(--main_gradient-color);

			div {
				color: var(--text_color_L4);
			}
		}
		.rechargeTypes_list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-column-gap: 20px;
		}
		.numberPay {
			grid-template-columns: repeat(1, 1fr);
		}
		&__item {
			background: var(--bg_color_L3);
			max-width: 98%;
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			margin-bottom: 20px;

			div {
				font-size: 28px;
				color: var(--text_color_L2);
			}

			.other {
				padding-left: 26px;
				display: flex;
				flex-direction: column;
				height: 100%;
				padding: 20px 26px;
				line-height: 1.5;

				.bouns {
					font-size: 24px;
				}
			}

			// 手续费率
			.feeRate {
				font-size: 24px;
				color: var(--norm_red-color);
			}

			.usdt_icon {
				padding: 20px 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				line-height: 1.5;

				img {
					margin-left: 26px;
					width: 80px;
					height: 80px;
					margin-right: 26px;
				}
			}
		}
	}

	&-history {
		&__title {
			display: flex;
			font-weight: 600;
			font-size: 36px;
			margin-bottom: 56px;

			img {
				width: 48px;
				height: 48px;
				margin-right: 23px;
			}
		}

		&__item {
			padding-bottom: 24px;
			border-bottom: 1px solid #daddf0;
			margin-bottom: 26px;

			.info1 {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				margin-bottom: 22px;

				.left {
					display: flex;
					align-items: flex-end;

					span {
						margin-right: 18px;
					}

					span:nth-child(1) {
						width: 160px;
						height: 40px;
						background: #ff8581;
						border-radius: 10px;
						color: #fff;
						line-height: 40px;
						text-align: center;
					}

					span:nth-child(2),
					span:nth-child(3) {
						font-weight: 400;
						font-size: 24px;
						line-height: 28px;
						color: #aeb0c6;
					}
				}

				.right {
					font-weight: 500;
					font-size: 28px;
					line-height: 34px;
				}

				.danger {
					color: #f65c5c;
				}

				.success {
					color: #49ce9b;
				}

				.cancle {
					color: var(--text_color_L2);
				}
			}

			.info2 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.orderCode {
					display: flex;
					font-weight: 400;
					font-size: 24px;
					line-height: 28px;
					color: var(--text_color_L2);

					img {
						margin-left: 50px;
						width: 32px;
						height: 32px;
					}
				}

				.money {
					font-weight: 500;
					font-size: 28px;
					line-height: 34px;
					color: var(--text_color_L1);
				}
			}
		}

		&__item:last-child {
			border: none;
			margin-bottom: 0;
		}
	}

	&-waitPay {
		padding-bottom: 40px;

		img {
			display: block;
			width: 80px;
			height: 80px;
			margin: 0 auto 14px;
		}

		& .wait_text {
			height: 68px;
			line-height: 34px;
			text-align: center;
			font-size: 28px;
			color: var(--text_color_L1);
			margin-bottom: 20px;
		}

		&__countdown {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 12px;
			width: 100%;
			margin-bottom: 30px;

			span {
				display: inline-block;
				width: 60px;
				height: 80px;
				color: var(--norm_red-color);
				font-size: 48px;
				line-height: 80px;
				border-radius: 10px;
				background: var(--bg_color_L3);
				text-align: center;

				&:nth-of-type(3) {
					width: 40px;
				}
			}
		}

		& .go_pay {
			width: 474px;
			height: 70px;
			margin: 0 auto;
			background: var(--main_gradient-color);
			border-radius: 80px;
			color: #fff;
			font-size: 30px;
			text-align: center;
			line-height: 70px;
		}
	}
	.other_bank {
		margin-bottom: 40px;
		.select_bank_tit {
			color: var(--text_color_L1);
			line-height: 48px;
			margin-bottom: 20px;

			.svg-icon {
				width: 48px;
				height: 48px;
				margin-right: 23px;
			}
		}
		.bank_name {
			background: var(--main_gradient-color);
			height: 80px;
			line-height: 80px;
			color: var(--text_color_L4);
			padding-left: 20px;
			font-size: 28px;
			border-radius: 12px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.right_arrow {
				margin-right: 20px;
			}
		}
	}

	.transfer {
		.title {
			display: flex;
			align-items: center;
			margin-bottom: 22px;
			img,
			svg {
				width: 48px;
				height: 48px;
				margin-right: 18px;
			}
			color: var(--text_color_L1);
			font-weight: 600;
			font-size: 36px;
		}
		.transfer_list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.item {
				width: 320px;
				height: 120px;
				background: #e1e1e1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-radius: 16px;
				font-size: 28px;
				color: var(--text_color_L2);
				img {
					width: 126px;
					height: 42px;
					margin-bottom: 8px;
				}
			}
			.transfer_active {
				background: var(--main_gradient-color);
				color: #fff;
			}
		}
	}
}
.bank_list {
	width: 100%;
	.bank_item {
		height: 88px;
		border-radius: 10px;
		margin-bottom: 16px;
		line-height: 88px;
		font-size: 30px;
		font-style: normal;
		font-weight: 400;
		padding-left: 20px;
		background-color: var(--bgDark-3, var(--bg_color_L2));
		display: flex;
		align-items: center;
		color: var(--text_color_L1);
		img {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}
	}
	.bank_item_active {
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-weight: 700;
	}
}
.Recharge__container-rechageBtn {
	font-size: 30px;
	z-index: 88;
	background: var(--button_dis_color);
	min-width: 156px;
	height: 88px;
	line-height: 88px;
	color: var(--text_color_L2);
	text-align: center;
	border-radius: 10px;
	padding: 0 10px;
}
.rechage_active {
	background: var(--main_gradient-color);
	color: var(--text_color_L4);
}
.showAmountError {
	padding: 60px 30px 30px 30px;
	width: 100%;
	.title1 {
		font-size: 48px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 20px;
	}
	.title2 {
		font-size: 28px;
		text-align: center;
		line-height: 36px;
		&.red {
			color: var(--main_gradient-color);
		}
	}
	.button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 20px;
		& > div {
			width: calc((100% - 20px) / 2);
			height: 96px;
			line-height: 96px;
			border-radius: 50px;
			font-size: 30px;
			text-align: center;
			&.clance {
				border: 1px solid var(--main-color);
				color: var(--main-color);
			}
			&.goBuy {
				background: var(--main-color);
				color: #fff;
			}
		}
	}
}

.arupiAmount {
	.arupi-header.title1 {
		background: var(--main-color);
		color: var(--text_color_L4);
		padding: 20px 0;
		margin: 0 -24px;
	}
	.title1 {
		font-size: 28px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 20px;
		color: var(--text_color_L1);
	}
	.title2 {
		padding-top: 20px;
		font-size: 28px;
		text-align: center;
		line-height: 36px;
		color: var(--text_color_L1);
		margin-bottom: 20px;
	}
	ul {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		flex-wrap: wrap;
		gap: 10px 20px;
		li {
			border: 1px solid var(--Dividing-line_color);
			padding: 12px 0;
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: var(--main-color);
			background-color: var(--bg_color_L3);
			font-size: 28px;
			&.active {
				background: var(--main_gradient-color);
				color: var(--text_color_L4);
				font-weight: 700;
				border: none;
			}
		}
	}
	.button {
		display: flex;
		justify-content: space-between;
		&.column {
			flex-direction: column;
			div {
				width: 100%;
				margin-top: 20px;
			}
		}
		& > div {
			width: calc((100% - 20px) / 2);
			height: 86px;
			border-radius: 20px;
			font-size: 30px;
			text-align: center;
			display: flex;
			justify-content: center;
			flex-direction: column;
			&.clance {
				border: 1px solid var(--main-color);
				color: var(--main-color);
				h3 {
					font-weight: bold;
				}
				p {
					line-height: 38px;
					font-size: 24px;
				}
			}
			&.goBuy {
				background: var(--main-color);
				color: #fff;
				h3 {
					font-weight: bold;
				}
				p {
					line-height: 38px;
					font-size: 24px;
				}
			}
		}
	}
	.text {
		font-size: 24px;
		color: var(--text_color_L2);
		text-align: center;
		margin-top: 20px;
		span {
			color: var(--main-color);
			padding: 0 12px;
		}
	}
}
.toActive {
	background: var(--main-color);
	border-radius: 10px;
	color: var(--text_color_L4);
	padding: 20px 0;
	text-align: center;
	font-size: 28px;
	font-weight: 500;
}
</style>
