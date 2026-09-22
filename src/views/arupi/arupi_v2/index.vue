<template>
	<div class="x-order pt10 pr15 pl15">
		<NavBar title="ArUpiPay" :placeholder="false" left-arrow @click-left="onClick">
			<template #right>
				<div class="sever x-row x-row-between x-row-middle-center" @click="handleOpen">
					{{ $t('customerService') }}
				</div>
			</template>
		</NavBar>
		<div v-if="pageData.type === 0">
			<div class="order_info">
				<div class="item">
					<span class="amount">
						{{ getFormatAmount((pageData.info.amount || 0) -pageData.info.randomAmount) }}
						<div class="amount-copy">
							<svg-icon @click="copy(pageData.info.amount)" name="copy" />
						</div>
						<div class="discount" v-if="pageData.info.randomAmount && pageData.info.randomAmount>0">
								{{$t('discountB')}} {{getFormatAmount(pageData.info.randomAmount || 0)}}
						</div>
					</span>
					<div class="timeout">
						<span> {{ formatUpiTime(pageData.info.paymentExpireTime || 0) }}</span>
					</div>
				</div>
			</div>
			<div>
				<div class="x-title">
					<span></span>
					<p>{{ $t('choosePay') }}</p>
				</div>
				<div class="x-order-pay x-row x-flex-warp">
					<div
						class="item"
						:class="{ active: handleToPayType === item.name, [item.name]: true }"
						v-for="(item, index) in payList"
						:key="index"
						@click="item.name === 'Paytm' ? handleToPaytmmp() : handleToPay(item)"
					>
						<div class="x-row x-row-middle-center">
							<img class="img" :src="item.icon" />
							<p class="name">{{ item.name }}</p>
						</div>
						<p>
							{{ item.desc }}
						</p>
					</div>
				</div>
			</div>
			<div :class="{ order_active: handleToPayType === 'PhonePe' }">
				<div>
					<div class="x-title">
						<span></span>
						<p>{{ $t('scanPay') }}</p>
					</div>
					<div class="qrcode mb8">
						<div>
							<div class="qrimg">
								<van-image :src="qrcode" class="qrc" id="canvasDom">
									<template v-slot:loading>
										<van-loading type="spinner" size="20" />
									</template>
								</van-image>
							</div>
							<div class="utr-copy" v-if="showCopy">
								<span>{{ maskEmail(pageData.info.upiId) }}</span>
								<svg-icon @click="copy(pageData.info.upiId)" name="copy" class="copy-icon" />
							</div>
							<h3 class="x-tc mt8">1.{{ $t('scanPayTip') }}</h3>
							<p class="x-tc mt8 mb16">2.{{ $t('deviceQR') }}.</p>
							<p class="x-tc mt8 mb16">3. We support all upi</p>
						</div>
					</div>
				</div>
			</div>
			<div class="x-title mt8">
				<span></span>
				<p>{{ $t('importantReminder') }}：</p>
			</div>
			<div class="transfro_tip">
				<p>1.{{ $t('sameLink') }}</p>
				<p>2.{{ $t('paytmUp') }}</p>
			</div>
		</div>

		<!-- 取消和提交 -->
		<div class="x-order-food" v-if="[0, 4].includes(pageData.type) && !isUtr">
			<div
				class="cancel"
				@click="
					() => {
						if (handleToPayType) {
							handleToPayType = ''
							return
						}
						confirmShow = true
					}
				"
			>
				{{ handleToPayType === 'Paytm' ? $t('withdrawDialogDesc6') : $t('cancel') }}
			</div>
			<div class="submit" :class="isUtr ? 'active' : 'active'" @click="submit">{{ $t('submit') }}</div>
		</div>
		<div v-if="pageData.type == 1" class="x-row x-column x-row-middle x-tc expired">
			<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M36 6.96774C19.9659 6.96774 6.96774 19.9659 6.96774 36C6.96774 52.0341 19.9659 65.0323 36 65.0323C52.0341 65.0323 65.0323 52.0341 65.0323 36C65.0323 19.9659 52.0341 6.96774 36 6.96774ZM0 36C0 16.1177 16.1177 0 36 0C55.8822 0 72 16.1177 72 36C72 55.8822 55.8822 72 36 72C16.1177 72 0 55.8822 0 36ZM36 40.9268L23.6834 53.2435L18.7564 48.3165L31.0731 35.9999L18.7565 23.6834L23.6835 18.7564L36 31.073L48.3165 18.7564L53.2435 23.6834L40.9269 35.9999L53.2436 48.3165L48.3166 53.2435L36 40.9268Z"
					fill="var(--main-color)"
				/>
			</svg>
			<p class="mt16 txt">{{ $t('PaymentExpired') }}</p>
			<van-button round block type="primary" class="x-btn btn mt40" @click="onClick">
				{{ $t('returnMerchant') }}
			</van-button>
		</div>
		<div v-if="pageData.type == 3" class="x-row x-column x-row-middle x-tc submit-complete">
			<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M36 6.96774C19.9659 6.96774 6.96774 19.9659 6.96774 36C6.96774 52.0341 19.9659 65.0323 36 65.0323C52.0341 65.0323 65.0323 52.0341 65.0323 36C65.0323 19.9659 52.0341 6.96774 36 6.96774ZM0 36C0 16.1177 16.1177 0 36 0C55.8822 0 72 16.1177 72 36C72 55.8822 55.8822 72 36 72C16.1177 72 0 55.8822 0 36Z"
					fill="#F6B02C"
				/>
				<path d="M48.5108 48.7305L35.1348 37V16" stroke="#F6B02C" stroke-width="7" />
			</svg>
			<p class="weight">{{ $t('submitSuccessfully') }}</p>
			<p>{{ $t('untilConfirm') }}</p>
			<van-button round block type="primary" class="x-btn btn mt40" @click="onClick"> {{ $t('complete') }} </van-button>
		</div>
		<van-popup position="bottom" v-model:show="show">
			<div class="x-order-reason pr16 pb16 pl16 pt16">
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
				<div class="btn x-row x-row-middle-center" @click="submitCancel">{{ $t('confirmCancel') }}</div>
			</div>
		</van-popup>
		<van-dialog
			class="arupi-dialog"
			:closeOnClickOverlay="false"
			v-model:show="arupiTips"
			:show-confirm-button="false"
			:width="327"
		>
			<div class="arupi">
				<div class="title1">{{ $t('tips') }}</div>
				<div class="title2">
					{{ $t('safetyTip') }}
				</div>
				<p>{{ arupiTime }}S</p>
			</div>
		</van-dialog>
		<van-dialog
			class="arupi-dialog"
			:closeOnClickOverlay="false"
			v-model:show="confirmShow"
			:show-confirm-button="false"
			:width="327"
		>
			<div class="arupi">
				<div class="title1">{{ $t('cancelDeal') }}</div>
				<div class="title2">{{ $t('paymeConfirm') }}</div>
				<div class="button">
					<div
						class="clance"
						@click="
							() => {
								from.checked = -1
								from.text = ''
								show = true
								confirmShow = false
							}
						"
					>
						{{ $t('confirmCancel') }}
					</div>
					<div class="goBuy" @click="submit">{{ $t('payme') }}</div>
				</div>
			</div>
		</van-dialog>
	</div>
</template>
<script lang="ts" setup>
import { formatUpiTime, getFormatAmount, copy, isOpenExternalUrl, openExternalUrl } from '@/utils'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { onMounted, ref, nextTick, reactive, watch, computed, shallowRef } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useIntervalFn, useThrottleFn } from '@vueuse/core'
import { useOrderStatus, useCustomService, useArupiEvent } from '@/hooks'
import { useI18n } from 'vue-i18n'
import { paymentDetails, confirmPayment, cancelPayment, cancellationReasonList, confirmAutoPayment, subForWakeUp } from '@/api'
import { Pay } from '@/api/arupi/types'
import { aesDecryptECB } from '@/views/arupi/crypto'
import { isHybridApp, openBrowser } from '@/utils/jsBridge'
import paytmIcon from '@public/arupi/icon/Paytm.svg?url'
import phonePeIcon from '@public/arupi/icon/PhonePe.svg?url'

const { t } = useI18n()
const show = ref(false)
const router = useRouter()
const route = useRoute()
const { handleOpen } = useCustomService({ type: 3 })
const { startFun, stopFun, pageData: orderData } = useOrderStatus()
const { pageView, pageLeve, pageClick } = useArupiEvent()
const arupiTips = ref(false)
const arupiTime = ref(3)
const arupiTimer = ref()
const from = reactive({
	checked: -1,
	text: ''
})
const confirmShow = ref(false)
const reasonList = ref<any[]>([])

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
const onPaste = async () => {
	if (navigator.clipboard && navigator.clipboard.readText) {
		try {
			const text = await navigator.clipboard.readText()
			utrVal.value = text || ''
		} catch (err) {
			utrVal.value = document?.getSelection?.()?.toString() ?? ''
		}
	} else {
		utrVal.value = document?.getSelection?.()?.toString() ?? ''
	}
}
const payList = computed(() => [
	{
		name: 'Paytm',
		icon: paytmIcon,
		id: 1,
		url: 'paytmmp://cash_wallet',
		desc: 'Wake up support'
	},
	{
		name: 'PhonePe',
		icon: phonePeIcon,
		id: 2,
		url: 'phonepe://pay',
		desc: pageData.info.isPhonepeWakeUp === 1 ? 'Wake up support' : 'Pay for oneself'
	}
])

const handleToPayType = ref('')
const text = shallowRef('')
const qrcode = useQRCode(text, {
	margin: 0,
	width: 185,
	errorCorrectionLevel: 'H',
	quality: 1
})
const pageData = reactive<{
	info: Pay.paymentDetailsRes
	type: number
}>({
	info: {
		merchantCode: '',
		merchantName: '',
		paymentExpireTime: 0,
		amount: 0,
		merchantOrder: '',
		platformOrder: '',
		buyOrderNo: '',
		sellOrderNo: '',
		chOrderNo: '',
		createTime: '',
		memberId: '',
		externalMemberId: '',
		returnUrl: '',
		orderStatus: '',
		upiId: '',
		utr: '',
		hideUpiCopyButton: 1,
		randomCode: '',
		randomAmount:0
	},
	type: 0
})
const utr = computed(() => (pageData.info.utr ? pageData.info.utr : orderData.info.utr))
const isUtr = computed(() => (pageData.info.utr || orderData.info.utr ? true : false))
const utrVal = ref('')
watch(utr, (newVal) => {
	utrVal.value = newVal
})

const { pause, resume } = useIntervalFn(
	() => {
		// 每次定时任务 控制时间递减
		if (pageData.info.paymentExpireTime <= 0) {
			// 停止递减：停止定时器
			getInfo()
			stopFun()
			pause()
		} else {
			pageData.info.paymentExpireTime -= 1
		}
	},
	1000,
	{
		// 首次是否自动启动定时任务：true（默认值，自动启动），false，不需要自动启动
		immediate: false,
		// 是否延时执行定时任务（false(默认值)，不延时；true表示延时）
		immediateCallback: false
	}
)
const getCancellationReasonList = async () => {
	const { code, data } = await cancellationReasonList({})
	if (code === '1') {
		reasonList.value = data
	}
}
const realAmount=computed(()=>{
	if (!pageData.info.amount)return 0;
	return pageData.info.amount-pageData.info.randomAmount
})
const getInfo = async () => {
	// load.show();
	const type = route.query.type
	const { code, data } = await paymentDetails()
	if (code === '1') {
		pageData.type = type ? 4 : 0
		const source = aesDecryptECB(data)
		pageData.info = source
		if (source.orderStatus === '2') {
			router.replace('/Payment')
		} else if (source.orderStatus === '3') {
			router.replace('/Fail')
		}
		await nextTick()
		text.value =
			'upi://pay?pa=' +
			source.upiId +
			'&am=' +
			realAmount.value +
			'&cu=INR' +
			'&tn=' +
			source.tid +
			'&notes=' +
			source.tid +
			'&transactionDescription=' +
			source.tid +
			'&tid=' +
			source.tid +
			'&tr=' +
			source.tid

		resume()
		startFun('', 0)
		startFun('', 1)
	} else {
		pageData.type = 1
		show.value = false
	}
	// load.hide()
}
const handleToInput = () => {
	pageData.type = 0
	confirmShow.value = false
}
function testPhonePeNativeDeeplink() {
	const {  upiId, tid } = pageData.info //订单倒计时
	try {
		const deeplinkData = {
			contact: {
				type: 'VPA',
				vpa: upiId,
				cbsName: '',
				nickName: ''
			},
			p2pPaymentCheckoutParams: {
				"checkoutType": "DEFAULT", //PhonePe 启用 默认的转账流程
				"disableViewHistory": false, // 禁用查看历史
				"initialAmount": realAmount.value*100, // ₹100 (金额以分为单位)
				"isByDefaultKnownContact": false, // 是否是默认已知联系人
				"note": tid,
				"shouldShowMaskedNumber": false, // 是否显示掩码号码
				"shouldShowUnsavedContactBanner": true, // 是否显示未保存联系人横幅
				"showKeyboard": false // 是否显示键盘
			}
		}

		// 编码为Base64
		const base64Data = btoa(JSON.stringify(deeplinkData))

		subForWakeUp({ bankCode: 'phonepe' })

		// 生成深度链接
		const deeplinkUrl = `phonepe://native?data=${base64Data}&id=p2ppayment`
		if (isOpenExternalUrl()) {
			openExternalUrl(deeplinkUrl)
		} else if (isHybridApp()) {
			openBrowser('recharge', {
				url: deeplinkUrl,
				recharegeName: 'Arupi'
			})
		} else {
			window.location.href = deeplinkUrl
		}
	} catch (error) {
		console.error('PhonePe Deeplink 测试出错:', error)
	}
}
const handleToPay = (item: Record<string, any>) => {
	let url = item.url
	handleToPayType.value = item.name
	if (item.url.startsWith('paytmmp://cash_wallet')) {
		url += `?featuretype=money_transfer&pa=${pageData.info.upiId}&am=${realAmount.value}&cu=INR&tn=${
			pageData.info?.tid || ''
		}` //
		pageClick(1)
		if (isOpenExternalUrl()) {
			openExternalUrl(url)
		} else if (isHybridApp()) {
			openBrowser('recharge', {
				url: url,
				recharegeName: 'Arupi'
			})
		} else {
			window.location.href = url
		}
		subForWakeUp({ bankCode: 'paytm' })
	} else {
		if (pageData.info.isPhonepeWakeUp === 1) {
			testPhonePeNativeDeeplink()
		}
		pageClick(2)
	}
}
const handleToPaytmmp = () => {
	arupiTips.value = true
	clearInterval(arupiTimer.value)
	arupiTimer.value = null
	arupiTime.value = 3
	arupiTimer.value = setInterval(() => {
		arupiTime.value -= 1
	}, 1000)
	setTimeout(() => {
		clearInterval(arupiTimer.value)
		arupiTimer.value = null
		arupiTips.value = false
		handleToPay(payList.value[0])
	}, 3000)
}
const submit = useThrottleFn(async () => {
	const res = await confirmAutoPayment({})
	if (res.code === '1') {
		pageData.type = 3
		confirmShow.value = false
		showSuccessToast(t('SubmittedS'))
		setTimeout(() => {
			onClick()
		}, 1000)
	} else {
		showFailToast(res.msg)
	}
}, 3000)

const submitCancel = async () => {
	const { checked, text } = from
	if (checked === -1 && !text) {
		return showFailToast(t('addCancelDes'))
	}
	const res = await cancelPayment({
		reason: checked > -1 ? reasonList.value[checked]?.reason : from.text,
		reasonId: checked > -1 ? reasonList.value[checked]?.id : null
	})
	if (res.code === '1') {
		show.value = false
		showSuccessToast(t('cancelSuccess'))
		setTimeout(() => {
			router.push({
				name: 'Recharge'
			})
		}, 1000)
	}
}
const maskEmail = (email: string): string => {
	const [localPart, domain] = email.split('@')
	return '*'.repeat(localPart.length) + '@' + domain
}
const showCopy = computed(() => {
	if (pageData.info.amount < 2000) return false
	return pageData.info.hideUpiCopyButton == 0
})
function onClick() {
	// if (pageData.type === 0&&!isUtr.value) {
	//   show.value = true;
	//   return
	// }
	router.push({
		name: 'Recharge'
	})
}
onMounted(() => {
	getInfo()
	getCancellationReasonList()
	setTimeout(() => {
		pageView('order')
	}, 1500)
})
onBeforeRouteLeave(() => {
	pageLeve('order')
})
</script>
<style lang="scss" scoped>
.x-order {
	padding-bottom: 160px;
	:deep(.van-action-sheet) {
		max-height: 90%;
	}
	:deep(.swiper-pagination) {
		.swiper-pagination-bullet {
			width: 16px;
			height: 16px;
			background: #d9d9d9;
			&-active {
				width: 44px;
				height: 16px;
				border-radius: 54px;
				background: #000;
			}
		}
	}
	.arupi {
		padding: 20px;
		.title1 {
			padding-top: 40px;
			font-size: 28px;
			font-weight: 600;
			text-align: center;
			margin-bottom: 20px;
			color: var(--text_color_L1);
		}
		.title2 {
			font-size: 28px;
			text-align: center;
			line-height: 36px;
			color: var(--text_color_L2);
			margin-bottom: 20px;
			padding: 20px;
		}
		p {
			font-size: 34px;
			font-weight: 600;
			text-align: center;
			color: var(--main-color);
			margin-bottom: 20px;
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
				border-radius: 20px;
				font-size: 30px;
				text-align: center;
				&.clance {
					border: 1px solid var(--bg_color_L3);
					color: var(--text_color_L1);
				}
				&.goBuy {
					background: var(--main-color);
					color: #fff;
				}
			}
		}
	}
	.sever {
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		border-radius: 32px;
		padding: 10px 8px;
		font-size: 24px;
		gap: 8px;
	}
	.transfro_tip {
		color: var(--text_color_L1);
		font-size: 28px;
		font-style: normal;
		font-weight: 400;
		line-height: 40px;
	}
	.order_active {
		border-radius: 16px;
		border: 6px solid var(--main-color);
		padding: 24px 32px;
		//background: #F7F2FF;
	}
	.order_info {
		display: flex;
		padding: 24px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		border-radius: 16px;
		background: var(--bg_color_L3);
		margin-bottom: 32px;
		.item {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--text_color_L1);
			.timeout {
				font-size: 28px;
				color: var(--text_color_L1);
				span {
					font-weight: 600;
					color: var(--ext_color_L1);
				}
			}
			.discount{
				min-width: 160px;
				height: 48px;
				border-radius: 16px;
				line-height: 48px;
				background: rgba(238, 77, 77, 0.20);
				color: #EE4D4D;
				text-align: center;
				font-family: "PingFang SC";
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
			}
			.amount {
				display: flex;
				align-items: center;
				font-weight: 700;
				font-size: 48px;
				color: var(--ext_color_L1);
			}
			.amount-copy {
				display: flex;
				padding: 12px;
				justify-content: center;
				align-items: center;
			}
			.upi {
				color: #e22323;
				.copy-icon {
					display: inline-block;
					font-size: 20px;
					border-radius: 42px;
					background: var(--main_gradient-color);
					color: var(--text_color_L4);
					width: 80px;
					line-height: 36px;
					height: 36px;
					font-style: normal;
					font-weight: 400;
					text-align: center;
				}
			}
		}
	}

	.qrcode {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: var(--text_color_L1);
		background: var(--bg_color_L3);
		padding: 24px;
		border-radius: 16px;
		font-size: 28px;
		font-weight: 400;
		border: 2px solid var(--Dividing-line_color);
		.qrimg {
			margin: 0 auto;
			width: 420px;
			height: 420px;
			border-radius: 16px;
			background: #f0f1f5;
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 420px;
				height: 420px;
			}
		}
	}
	.qrcode-copy {
		position: absolute;
		right: 0px;
		top: 0px;
		display: flex;
		padding: 12px;
		justify-content: center;
		align-items: center;
		gap: 16px;
		background: var(--main_gradient-color);
		border-radius: 0px 16px;
		cursor: pointer;
	}
	.utr-copy {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
		font-size: 36px;
		margin: 30px 0;
		span {
			color: var(--text_color_L2);
		}
	}
	&-pay {
		width: 100%;
		.item {
			width: calc(50% - 16px);
			text-align: center;
			padding: 16px;
			border-radius: 10px;
			margin-right: 16px;
			margin-bottom: 16px;
			&:nth-child(2n) {
				margin-right: 0;
			}
			&.Paytm {
				background-image: url('@/assets/icons/arupi/icon/Paytm_bg.png');
				background-size: 100%;
				background-position: center;
				background-repeat: no-repeat;
				animation: glow 2s infinite;
			}
			&.PhonePe {
				background-image: url('@/assets/icons/arupi/icon/PhonePe_bg.png');
				background-size: 100%;
				background-position: center;
				background-repeat: no-repeat;
			}
			&.active.Paytm {
				background-image: url('@/assets/icons/arupi/icon/Paytm_bg_active.png');
			}
			&.active.PhonePe {
				background-image: url('@/assets/icons/arupi/icon/PhonePe_bg_active.png');
			}
			&.active {
				color: var(--text_color_L4);

				p {
					color: var(--text_color_L4);
				}
			}
			&:nth-child(2n) {
				margin-right: 0;
			}
			.img {
				background: var(--bg_color_L2);
				border-radius: 56px;
				width: 56px;
				height: 56px;
				display: block;
				margin-right: 10px;
			}
			.name {
				color: var(--text_color_L2);
				font-size: 28px;
			}
			& > p {
				margin-top: 4px;
				color: var(--text_color_L1);
				font-weight: 600;
			}
		}
	}

	&-utr {
		@keyframes shake-11f51816 {
			0% {
				transform: translate(0.02667rem, 0.02667rem) rotate(0deg);
			}

			10% {
				transform: translate(-0.02667rem, -0.05333rem) rotate(-1deg);
			}

			20% {
				transform: translate(-0.08rem) rotate(1deg);
			}

			30% {
				transform: translate(0.08rem, 0.05333rem) rotate(0deg);
			}

			40% {
				transform: translate(0.02667rem, -0.02667rem) rotate(1deg);
			}

			50% {
				transform: translate(-0.02667rem, 0.05333rem) rotate(-1deg);
			}

			60% {
				transform: translate(-0.08rem, 0.02667rem) rotate(0deg);
			}

			70% {
				transform: translate(0.08rem, 0.02667rem) rotate(-1deg);
			}

			80% {
				transform: translate(-0.02667rem, -0.02667rem) rotate(1deg);
			}

			90% {
				transform: translate(0.02667rem, 0.05333rem) rotate(0deg);
			}

			to {
				transform: translate(0.02667rem, -0.05333rem) rotate(-1deg);
			}
		}
		@keyframes glow-11f51816 {
			0% {
				box-shadow: 0 0 0.13333rem rgba(239, 68, 216, 0.126);
			}

			50% {
				box-shadow: 0 0 0.53333rem rgba(231, 29, 177, 0.8);
			}

			to {
				box-shadow: 0 0 0.13333rem rgba(242, 2, 230, 0.2);
			}
		}
		p {
			color: #e22323;
			font-family: Roboto;
			font-size: 28px;
			font-style: normal;
			font-weight: 500;
			line-height: 40px;
			margin-bottom: 20px;
		}
		.box {
			position: relative;
			width: 100%;
			.inp {
				background: var(--bg_color_L3);
				width: 100%;
				border: 2px solid var(--Dividing-line_color);
				border-radius: 42px;
				font-size: 28px;
				outline: none;
				// shake-11f51816 1.8s infinite,
				animation: glow-11f51816 1.8s infinite;
				padding: 12px 32px;
			}

			:deep(.van-field__body) {
				input {
					border: none;
					line-height: 50px;
				}

				input::placeholder {
					color: var(--text_color_L2);
					font-size: 28px;
				}
			}

			.copy {
				border-radius: 42px;
				background: var(--main_gradient-color);
				color: var(--text_color_L4);
				margin: 10px;
				min-width: 160px;
				height: 64px;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}

	&-explain {
		background: var(--bg_color_L2);
		padding: 20px;
		border-radius: 16px;

		.title {
			font-size: 32px;
			font-weight: 600;
			letter-spacing: -0.64px;
			color: var(--darkTextW, var(--text_color_L1));
		}

		.box {
			p {
				position: relative;
				color: var(--text_color_L2);
				font-size: 28px;
				line-height: 40px;
			}
		}
	}
	.expired {
		margin-top: 120px;
		.txt {
			font-size: 32px;
			color: var(--text_color_L2);
		}
	}
	.submit-complete {
		margin-top: 120px;
		svg {
			margin-bottom: 16px;
		}
		p {
			font-size: 32px;
			color: var(--text_color_L1);
			line-height: 40px;
			&.weight {
				font-weight: 600;
			}
		}
	}
	&-food {
		position: fixed;
		z-index: 1000;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 0);
		width: 10rem;
		max-width: 800px;
		background: var(--bg_color_L2);
		display: flex;
		justify-content: space-between;
		padding: 16px 32px;
		gap: 16px;
		div {
			flex: 2.5;
			height: 80px;
			line-height: 80px;
			text-align: center;
			border-radius: 16px;
			background: var(--button_dis_color);
			color: var(--text_color_L1);
			font-size: 32px;
			font-weight: 500;
			margin-top: 32px;
			&.cancel {
				border-radius: 16px;
				border: 2px solid var(--bg_color_L2);
				background: var(--bg_color_L3);
				color: var(--text_color_L1);
				font-size: 28px;
				flex: 1;
				font-weight: 500;
			}
			&.active {
				background: var(--main_gradient-color);
				color: var(--text_color_L4);
			}
		}
	}
	&-reason {
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
	.x-title {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-bottom: 16px;
		span {
			display: inline-block;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: var(--main-color);
			margin-right: 8px;
		}
		p {
			color: var(--text_color_L1);
			font-family: Roboto;
			font-size: 32px;
			font-style: normal;
			font-weight: 600;
			line-height: normal;
		}
	}
}
.x-btn {
	width: 460px;
	border-radius: 42px;
	background: var(--main_gradient-color);
	color: var(--text_color_L4);
}
@keyframes glow {
	0% {
		box-shadow: 0 0 0 0 rgba(0, 207, 248, 0);
	}
	5% {
		box-shadow: 0 0 0 10px rgba(0, 207, 248, 0.9);
	}
	10% {
		box-shadow: 0 0 0 15px rgba(0, 207, 248, 0.6);
	}
	15% {
		box-shadow: 0 0 0 20px rgba(0, 207, 248, 0.4);
	}
	20% {
		box-shadow: 0 0 0 25px rgba(0, 207, 248, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(0, 207, 248, 0);
	}
}
</style>
