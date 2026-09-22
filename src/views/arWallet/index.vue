<template>
	<div class="ar_wallet">
		<NavBar :title="'AR' + $t('wallet')" :placeholder="false" left-arrow @click-left="$router.push('/main')"></NavBar>

		<div v-if="!isLoad">
			<WalletInfo :is-active="isArWalletActive && isActive" :arWallet="arWallet" @goWallet="goWallet('wallet/withdraw')" />

			<div class="tab_list" v-if="isArWalletActive && isActive">
				<div class="item" :class="{ active: active === 0 }" @click="active = 0">{{ $t('recharge') }}</div>
				<div class="item" :class="{ active: active === 1 }" @click="active = 1">{{ $t('withdraw') }}</div>
			</div>
			<!-- recharge -->
			<div v-if="active === 0 && isArWalletActive && isActive">
				<div class="quick_amount">
					<div class="title">{{ $t('selectRechargeAmount') }}</div>
					<div class="amount_list">
						<div
							class="amount"
							:class="{ active: quickIndex === index }"
							v-for="(item, index) in quickList"
							@click="handleQuickMoney(index)"
						>
							₹{{ formatNum(Number(item)) }}
						</div>
					</div>

					<div class="amount_input">
						<span>₹</span>
						<van-field v-model="amount" type="digit" :placeholder="t('enterAmount')">
							<template #button>
								<div class="all_btn" @click="handleAll">{{ $t('all') }}</div>
							</template>
						</van-field>
					</div>
				</div>

				<div class="submit_btn" @click="handleRecharge">{{ $t('recharge') }}</div>
			</div>

			<!-- withdraw -->
			<div v-if="active === 1 && isArWalletActive && isActive">
				<div class="withdraw">
					<div class="amount_input">
						<span>₹</span>
						<van-field v-model="amount" type="digit" :placeholder="t('enterAmount')">
							<template #button>
								<div class="all_btn" @click="handleMaxAmount">{{ $t('maxAmount') }}</div>
							</template>
						</van-field>
					</div>
					<div class="balance">
						{{ $t('accountBlance') }}：{{ withdrawalsInfo?.withdrawalsrule.canWithdrawAmount || 0 }}
					</div>
					<div class="withdraw_amount">
						{{ $t('arWithdraw', [withdrawalsInfo?.withdrawalsrule.amountofCode || 0]) }}
					</div>
					<div class="driverd"></div>
					<div class="tip">
						<div>{{ $t('minAmount') }} {{ withdrawalsInfo?.withdrawalsrule.minPrice || 0 }}</div>
						<div>{{ $t('maxAmount2') }} {{ withdrawalsInfo?.withdrawalsrule.maxPrice || 0 }}</div>
					</div>
				</div>
				<div class="submit_btn" @click="handleWithdraw">{{ $t('withdraw') }}</div>
			</div>

			<div class="active_box" v-if="!isActive || !isArWalletActive">
				<div class="active_txt">
					{{ $t('arbTip2') }}
				</div>
				<div class="submit_btn" @click="goActive">{{ $t('arActive') }}</div>
			</div>
		</div>
		<van-action-sheet v-model:show="rechargeShow" :title="t('recharge')">
			<div class="recharge_content">
				<div>
					<span>{{ $t('rechargeCount') }}</span>
					<span>{{ amount }}ARB</span>
				</div>
				<div>
					<span>{{ $t('award') }}</span>
					<span class="gift">{{ Number(amount) * (currentChanel?.rechargeRifts || 0) }}</span>
				</div>
				<div>
					<span>{{ $t('rechageAmount') }}</span>
					<span>{{ amount }}ARB</span>
				</div>
				<div class="confirm_recharge" @click="recharge">{{ $t('confirmRecharge') }}</div>
			</div>
		</van-action-sheet>

		<!--输入密码弹窗-->
		<van-action-sheet v-model:show="withdrawsVal" :title="$t('safetyVerification')">
			<div class="pwd">
				<van-field
					class="wd_pas"
					v-model="withdrawaPassword"
					:maxlength="32"
					type="password"
					:placeholder="$t('withdrawDialogPh')"
				/>
				<span class="red">{{ $t('withdrawDialogDesc3') }}</span>
				<div class="forgetPwd">
					<span v-if="isOpenForgetPasswordSMSState" @click="forgetPwd">{{ $t('withdrawDialogDesc4') }}</span>
					<div class="service" @click="onservice">{{ $t('withdrawDialogDesc5') }}</div>
				</div>
				<div class="btnD">
					<button @click="() => (withdrawsVal = false)">{{ $t('withdrawDialogDesc6') }}</button>
					<button @click="handleWithdraws">{{ $t('withdrawDialogDesc7') }}</button>
				</div>
			</div>
		</van-action-sheet>

		<Dialog
			class="successW"
			v-model:show="withdrawVisble"
			:isShowHeader="false"
			:cancelText="$t('close')"
			:confirmText="$t('goArWallet')"
			@confirm="
				() => {
					withdrawVisble = false
					goWallet('wallet/withdraw')
					amount = 0
				}
			"
		>
			<template #content>
				<div class="withdrawSuccess">
					<img class="success_img" src="@public/wallet/ar_appeal.png" />
					<div class="t1">AR Pay {{ $t('withdrawAppeal') }}</div>
					<!-- <div class="t2">{{ $t('withdrawAr1') }}</div> -->
					<!-- <div class="t2">{{ $t('withdrawAr2') }}</div> -->
					<div class="t4" v-html="$t('withdrawAr3')"></div>
					<!-- <div class="t3">
						<span style="font-weight: 400">{{ $t('withdrawalA') }}</span> {{ amount }}ARB
					</div> -->
					<!-- <div
						class="go_wallet"
						@click="
							() => {
								withdrawVisble = false
								goWallet()
								amount = 0
							}
						"
					>
						{{ $t('goArWallet') }}
					</div> -->
				</div>
			</template>
		</Dialog>

		<van-popup v-model:show="haveOrderVisible" position="bottom" class="x-popup-order" :close-on-click-overlay="true">
			<div class="close" @click="haveOrderVisible = false"></div>
			<div class="x-row x-column x-row-middle">
				<p class="mb10">{{ $t('haveArpayOrder') }}</p>
				<div class="span">{{ $t('haveArpayOrderTip') }}</div>
				<van-button class="btn x-btn" block @click="handleGoFinish" type="primary">{{ $t('goComplete') }}</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import WalletInfo from './components/walletInfo.vue'
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { AwaitApiResult, getUserDeviceType } from '@/utils'
import { GlobalStore, useCommonStore, useUserStore } from '@/stores'
import { useArwallet } from '@/hooks'
import { ARBWalletActivate, GetRechargeTypes, GetWithdrawals, NewSetWithdrawal, getARPayOrder } from '@/api'
import { ActiveARwallet, RechargeTypesData } from '@/types/api'
import { closeToast, showFailToast, showLoadingToast } from 'vant'
import Dialog from '@/components/common/Dialog.vue'

const { $state } = useUserStore()

const { t } = useI18n()
const router = useRouter()
const active = ref(0)
const quickList = ref(['100', '1000', '10000', '100000', '1000', '1000000'])
const quickIndex = ref(-1)
const amount = ref()
const rechargeShow = ref(false)
const withdrawsVal = ref(false)
const withdrawVisble = ref(false)
const withdrawaPassword = ref()
const chanelInfo = ref<RechargeTypesData>()
const globalStore = GlobalStore()
const userInfo = globalStore.getUserInfo
const isActive = ref(false)
const isLoad = ref(false)
const commonStore = useCommonStore()
const withdrawalsInfo = ref()
const arOrderUrl = ref()
const haveOrderVisible = ref(false)

commonStore.$subscribe((mutation, state) => {
	isLoad.value = state.isLoading
	commonStore.setLoading(isLoad.value)
})

const { isArWalletActive, arWallet, getInfo, goWallet } = useArwallet()

const isOpenForgetPasswordSMSState = computed(() => $state.isOpenForgetPasswordSMSState)
const currentChanel = computed(() => chanelInfo.value?.rechargetypelist[0])

const getRechargeInfo = async () => {
	const typeDev = await getUserDeviceType()
	const res: ObjResNull<RechargeTypesData> = await AwaitApiResult(
		GetRechargeTypes({
			payid: 21,
			deviceType: typeDev
		})
	)
	if (res) {
		quickList.value = res.data.rechargetypelist[0].scope.split('|')
		chanelInfo.value = res.data
	}

	getArpayOrderInfo()
}

/**
 * @description: 获取是否有充值订单
 * @return {*}
 */
const getArpayOrderInfo = async () => {
	const res = await AwaitApiResult(getARPayOrder())
	if (res.code === 0) {
		arOrderUrl.value = res.data
	}
}

/**
 * @description: 获取提现配置
 * @return {*}
 */
const getWithdrawType = async () => {
	const res = await AwaitApiResult(GetWithdrawals({ withdrawid: 21 }))
	if (res.code === 0) {
		withdrawalsInfo.value = res.data
	}
}

const handleQuickMoney = (index: number) => {
	quickIndex.value = index
	amount.value = quickList.value[index]
}

const handleAll = () => {
	amount.value = arWallet.value?.balance
}

/**
 * @description: 点击提现按钮，进行金额、打码量验证
 * @return {*}
 */
const handleWithdraw = () => {
	if (
		Number(amount.value) < withdrawalsInfo.value.withdrawalsrule?.minPrice ||
		Number(amount.value) > withdrawalsInfo.value.withdrawalsrule?.maxPrice
	) {
		showFailToast(t('c2cState14'))
		amount.value = undefined
	} else if (userInfo.amount < Number(amount.value)) {
		showFailToast(t('amountError'))
		amount.value = undefined
	} else {
		withdrawsVal.value = true
	}
}

/**
 * @description: 发起提现，调用接口
 * @return {*}
 */
const handleWithdraws = async () => {
	let query = {
		amount: Number(amount.value),
		pwd: withdrawaPassword.value,
		type: 21,
		bid: withdrawalsInfo.value.withdrawalslist[0].bid
	}
	const res = await AwaitApiResult(NewSetWithdrawal(query))

	if (res.code === 0) {
		withdrawsVal.value = false
		withdrawVisble.value = true
	}
}

/**
 * @description: 验证通过，点击按钮充值跳转
 * @return {*}
 */
const recharge = async () => {
	let str = '&returnUrl=' + encodeURIComponent('https://' + window.location.host + '/#/main')
	let url =
		currentChanel.value?.paySendUrl +
		'?tyid=' +
		currentChanel.value?.payTypeID +
		'&amount=' +
		amount.value +
		'&uid=' +
		userInfo.userId +
		'&sign=' +
		encodeURIComponent(userInfo.sign) +
		str

	window.location.href = encodeURI(url)
}
//进入重置密码页面
function forgetPwd() {
	router.push({ name: 'rpwd' })
}

const goActive = async () => {
	showLoadingToast({
		message: t('loading') + '...',
		forbidClick: true
	})
	const query = {
		returnUrl: 'https://' + window.location.host + '/#/main'
	}

	const res = await AwaitApiResult<ObjResNull<ActiveARwallet>>(ARBWalletActivate(query))
	if (res?.code === 0) {
		let url =
			res?.data?.walletActivationPageUrl +
			'?memberId=' +
			res.data.memberId +
			'&merchantCode=' +
			res.data.merchantCode +
			'&timestamp=' +
			res.data.timestamp
		window.location.href = url
	}
	closeToast()
}

//联系客服
function onservice() {
	router.push({
		name: 'CustomerService'
	})
}

/**
 * @description: 点击充值按钮，进行验证
 */
const handleRecharge = () => {
	if (arOrderUrl.value) {
		haveOrderVisible.value = true
		return
	}
	if ((arWallet.value?.balance as number) >= Number(amount.value)) {
		rechargeShow.value = true
	} else {
		showFailToast(t('amountError'))
	}
}

/**
 * @description: 继续充值
 */
const handleGoFinish = () => {
	window.location.href = arOrderUrl.value
	haveOrderVisible.value = true
}

/**
 * @description: 将超过1000的数字转换为1K
 */
const formatNum = (num: number): string => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
	} else {
		return num + ''
	}
}

watch(
	() => active.value,
	(val) => {
		amount.value = undefined
		if (val === 1) {
			getWithdrawType()
		} else {
			getArpayOrderInfo()
		}
	}
)

onMounted(async () => {
	try {
		commonStore.setLoading(true)
		let type = router.currentRoute.value.query.type
		if (type === '1') {
			isActive.value = false
		} else {
			await getInfo()
			isActive.value = true
		}
		if (isArWalletActive.value) {
			await getRechargeInfo()
		}
	} catch (error) {
		// console.log(error)
	} finally {
		commonStore.setLoading(false)
	}
})

const handleMaxAmount = () => {
	if (withdrawalsInfo.value.withdrawalsrule?.canWithdrawAmount === 0) {
		amount.value = 0
	} else {
		let maxAmout =
			withdrawalsInfo.value.withdrawalsrule?.canWithdrawAmount >= withdrawalsInfo.value.withdrawalsrule?.maxPrice
				? withdrawalsInfo.value.withdrawalsrule?.maxPrice
				: withdrawalsInfo.value.withdrawalsrule?.canWithdrawAmount

		amount.value = maxAmout
	}
}
</script>

<style scoped lang="scss">
/* Add some style here */
::v-deep(.x-popup-order) {
	border-radius: 40px 40px 0 0;
	padding: 160px 0 0;
	.close {
		position: absolute;
		top: 15px;
		right: 15px;
		height: 20px;
		width: 20px;
		background: url(@/assets/icons/common/close.png) no-repeat center center;
		background-size: cover;
	}
	p {
		color: var(--colorText-67);
		font-size: 48px;
		font-weight: 600;
		margin-bottom: 32px;
		text-align: center;
	}
	.span {
		color: var(--colorText-67);
		font-size: 28px;
		padding: 0 30px;
		text-align: center;
	}
	.btn {
		margin: 160px auto 0;
		height: 112px;
		font-size: 28px;
		color: var(--colorText-67);
		background-color: var(--borderColor-24);
		border: none;
	}
}
.ar_wallet {
	padding: 0 30px;
	min-height: 100vh;
	background-color: var(--textW);
	.tab_list {
		width: 80%;
		margin: auto;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 48px;
		.item {
			color: var(--borderColor-23);
			font-size: 36px;
			height: 48px;
			font-weight: 400;
		}
		.active {
			color: var(--colorText-67);
			font-weight: 600;
		}
		.active::after {
			content: '';
			display: block;
			width: 100%;
			height: 6px;
			background: var(--colorText-67);
			margin: 10px 0;
			border-radius: 6px;
		}
	}
	.quick_amount {
		padding: 32px;
		background: var(--colorText-67);
		border-radius: 16px;
		margin-bottom: 48px;
		.title {
			font-size: 24px;
			color: var(--colorText-67);
			margin-bottom: 30px;
		}
		.amount_list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 30px;
			margin-bottom: 30px;
			.amount {
				height: 112px;
				font-size: 32px;
				color: var(--colorText-67);
				text-align: center;
				line-height: 112px;
				border-radius: 8px;
				border: 1px solid var(--bgColor-17);
			}
			.active {
				border: 2px solid var(--borderColor-23);
				background: var(--borderColor-23);
				transition: all 0.3s ease-in-out;
			}
		}
	}
	.amount_input {
		display: flex;
		height: 96px;
		border-radius: 8px;
		background: var(--gray-color-1);
		align-items: center;
		span {
			padding: 0 24px;
			position: relative;
		}
		span::after {
			content: '';
			position: absolute;
			display: block;
			width: 1px;
			height: 40px;
			background: var(--bgColor-17);
			right: 0;
			top: -4px;
		}

		.all_btn {
			color: var(--colorText-67);
			font-size: 24px;
			font-weight: 400;
		}
	}
	:deep(.van-cell) {
		background: transparent;
	}
	:deep(.van-cell__value) {
		input::placeholder {
			color: var(--text_color_L3);
		}
	}
	.submit_btn {
		cursor: pointer;
		height: 96px;
		border-radius: 16px;
		background: var(--borderColor-24);
		text-align: center;
		line-height: 96px;
		color: var(--colorText-67);
		font-size: 32px;
	}
	.withdraw {
		padding: 32px;
		background: var(--colorText-67);
		border-radius: 16px;
		margin-bottom: 48px;
	}
	.driverd {
		border-bottom: 1px solid var(--borderColor-24);
		margin-block: 30px;
	}
	.tip {
		color: var(--colorText-68);
		font-size: 24px;
		line-height: 36px;
		font-weight: 400;
	}
	.balance {
		margin-top: 30px;
		color: var(--colorText-67);
		font-size: 24px;
		font-weight: 400;
		margin-bottom: 4px;
	}
	.withdraw_amount {
		color: var(--colorText-26);
		font-size: 24px;
		font-weight: 400;
	}
	.recharge_content {
		background-color: var(--textW);
		padding-bottom: 200px;
		div {
			margin: auto;
			width: 90%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24px;
			span {
				font-size: 28px;
				color: var(--colorText-67);
				font-weight: 400;
			}
			.gift {
				color: var(--norm_green-color);
			}
		}
		.confirm_recharge {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			background: var(--borderColor-24);
			display: flex;
			height: 112px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: var(--colorText-67);
			font-size: 32px;
			font-weight: 500;
			margin: 0;
		}
	}
}

.wd_pas {
	width: 90%;
	margin: auto;
	background: var(--bgColor-6) !important;
}
.pwd {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.service {
		color: var(--colorText-72);
		font-weight: 500;
	}

	&-head {
		padding: 30px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 90%;

		img {
			width: 48px;
			height: 48px;
			margin-right: 5px;
		}

		h1 {
			color: var(--text_color_L1);
			font-weight: 600;
			font-size: 32px;
		}

		h2 {
			color: var(--text_color_L1);
			font-weight: 500;
			font-size: 32px;
		}
	}
	input {
		border-radius: 16px;
		height: 96px;
		//padding: 27px 26px;
		font-size: 28px;
		color: var(--text_color_L2);
	}
	:deep(.van-cell__value) {
		input::placeholder {
			color: var(--text_color_L3);
		}
	}

	input {
		padding-left: 20px;
	}

	> span {
		text-align: left;
		width: 90%;
		margin-top: 20px;
	}

	.forgetPwd {
		width: 90%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-top: 40px;

		span {
			color: var(--text_color_L1);
			font-weight: 400;
			font-size: 28px;
		}

		button {
			border: 1px solid var(--text_color_L2);
			border-radius: 10px;
			width: 195px;
			height: 50px;
			background: none;
		}
	}

	.btnD {
		width: 100%;
		margin-top: 60px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		button {
			flex: 1;
			height: 120px;
			font-size: 34px;

			&:nth-of-type(1) {
				background: var(--borderColor-24);
				color: var(--colorText-67);
				border: none;
			}

			&:nth-of-type(2) {
				background: var(--borderColor-24);
				color: var(--colorText-67);
				border: none;
			}
		}
	}
}

.active_box {
	.active_txt {
		text-align: center;
		color: var(--colorText-67);
		font-size: 24px;
		line-height: 36px;
		margin-bottom: 48px;
	}
}
.successW {
	:deep(.dialog__container-footer button) {
		color: var(--text_color_L1);
		border-radius: 8px;
		border: 1px solid var(--borderColor-24);
		background: var(--bgColor-6);
		&:last-of-type {
			background: var(--borderColor-24);
			box-shadow: none;
			text-shadow: none;
			border: none;
		}
	}
}

.withdrawSuccess {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: var(--colorText-67);
	.success_img {
		width: 104px;
		height: 122px;
		margin-bottom: 32px;
	}
	.t1 {
		text-align: center;
		font-size: 48px;
		font-weight: 600;
		margin-bottom: 32px;
	}
	.t2,
	.t3 {
		text-align: center;
		font-size: 28px;
		margin-bottom: 16px;
	}
	.t3 {
		font-weight: 700;
		margin-bottom: 48px;
	}
	.t4 {
		margin-bottom: 60px;
		line-height: 36px;
		text-align: center;
		color: var(--colorText-71);
		font-size: 28px;
		font-weight: 400;
		:deep(span) {
			color: var(--colorText-72);
			font-weight: 500;
		}
	}
	.go_wallet {
		width: 460px;
		height: 96px;
		text-align: center;
		line-height: 96px;
		border-radius: 16px;
		border: 1px solid var(--borderColor-24);
		background: var(--bgColor-6);
		font-size: 32px;
	}
}
</style>
