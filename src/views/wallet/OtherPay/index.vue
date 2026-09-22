<template>
	<div class="other_pay">
		<NavBar class="white" :title="$t('payments')" left-arrow @click-left="onClick" />

		<div class="pay_store" v-if="!isUpi">
			<div class="store_item" v-for="item in payList" :key="item.id" @click="handleToPay(item.url)">
				<img :src="item.icon" alt="" />
				<span>{{ item.name }}</span>
			</div>
		</div>

		<PayState v-else :state="C2CPayState" />

		<div class="tip">
			<div>have you paid successfully?</div>
			<div>Paytm,PhonePe,GooglePay,Other Bank</div>
		</div>

		<div class="orderInfo">
			<div class="info_item" v-if="isUpi">
				<span>{{ $t('expiredTimes') }}</span>
				<div>{{ timeText }}</div>
			</div>
			<div class="info_item">
				<span>UPI ID</span>
				<div>
					<span>{{ orderDetail?.upiAccount || orderDetail?.sellerAccountNo || '--' }}</span>
					<svg-icon name="copy" @click="copy(orderDetail?.sellerAccountNo || orderDetail?.upiAccount)" />
				</div>
			</div>
			<div class="info_item" v-if="C2CPayState !== 1">
				<span>UTR</span>
				<div>
					<span>{{ store.localUpiUTR }}</span>
				</div>
			</div>

			<div class="info_item">
				<span>{{ $t('amount') }}</span>
				<div>{{ currency(orderDetail?.orderAmount) || orderDetail?.amount || '--' }}</div>
			</div>

			<div v-if="C2CPayState === 1 || !isUpi">
				<img class="qrcode" :src="codeUrl" id="qrcode" />
				<div class="save_qrcode" @click="htmlToImage('qrcode')">{{ $t('saveTheQRCode') }}</div>
			</div>
			<!-- <img class="qrcode" :src="codeUrl" id="qrcode" />
			<div class="save_qrcode" @click="htmlToImage('qrcode')">{{ $t('saveTheQRCode') }}</div> -->

			<div v-if="C2CPayState === 1">
				<div class="UTR_title">UTR(UPI Ref.ID)</div>
				<van-field
					v-model="store.localUpiUTR"
					class="info_item"
					type="digit"
					placeholder="Please enter a 12-digit UTR"
					:maxlength="12"
				>
					<template #right-icon>
						<svg-icon name="copy" alt="" @click="copy(store.localUpiUTR)" />
					</template>
				</van-field>
			</div>

			<InstructionsVue v-if="C2CPayState === 1" :showType="isUpi ? 771 : 12" :isShowHead="true" />
		</div>

		<div class="c2cupload_box">
			<div class="c2cupload_tip">
				<div>{{ $t('C2Cuploadtip3') }}</div>
				<div>{{ $t('C2Cuploadtip4') }}</div>
			</div>

			<div
				class="upload_img"
				:class="{ noAdd: !!imgUrl }"
				@click="
					() => {
						uploadRef.chooseFile()
					}
				"
			>
				<img v-if="imgUrl" :src="imgUrl" alt="" />
			</div>

			<div class="upload_action">
				<van-uploader
					ref="uploadRef"
					:max-size="5000 * 1024"
					@oversize="() => showToast($t('C2Cuploadtip2'))"
					v-model="fileList"
					accept="image/*"
					:after-read="uploadFile"
					:preview-image="false"
				>
					<div class="upload_btn">
						<svg-icon name="uploadIcon" />
						<!-- <img :src="uploadBtnIcon" /> -->
						<span>{{ C2CPayState === 2 && fileList.length === 0 ? $t('uploadImg') : $t('changeImage') }}</span>
					</div>
				</van-uploader>

				<div class="upload_text">
					{{ $t('C2Cuploadtip1') }}<br />
					{{ $t('C2Cuploadtip2') }}
				</div>
			</div>
		</div>

		<div class="pay_btn" v-if="C2CPayState === 1">
			<div class="cancel_order" @click="handleCancelOrder">{{ $t('concelOrder') }}</div>
			<div class="finish" :class="{ unfinish: store.localUpiUTR.length < 12 }" @click="handleNext">
				{{ isUpi && C2CPayState === 1 ? $t('nextStep') : $t('rechargeDetailDesc6') }}
			</div>
		</div>

		<div class="c2c_btn" v-if="C2CPayState !== 1">
			<div
				class="c2cFinish"
				:class="{ no_finish: !imgUrl }"
				@click="() => {
					if (!imgUrl) return
					handleFinishUpiOrder('c2c', orderDetail?.id as number, [uploadUrl])
				}"
			>
				{{ $t('rechargeDetailDesc6') }}
			</div>
			<div class="backPay" @click="C2CPayState = 1">{{ $t('backPay') }}</div>
		</div>

		<van-action-sheet v-model:show="finishPayShow" @click-overlay="handleClose">
			<div class="actionSheet__content">
				<div class="title">
					<img src="@public/wallet/upi.png" alt="" />
					<span>{{ (currentType === 'upi' ? 'Local UPI ' : 'NEW UPI ') + $t('recharge') }}</span>
				</div>
				<van-divider />
				<div class="sheet_info">
					<div class="info_item sheet_item">
						<span>UPI ID</span>
						<div class="sheet_right">{{ orderDetail?.sellerAccountNo || orderDetail?.upiAccount }}</div>
					</div>
					<div class="info_item sheet_item">
						<span>UTR</span>
						<div class="sheet_right">{{ store.localUpiUTR }}</div>
					</div>
					<div class="info_item sheet_item">
						<span>{{ $t('amount') }}</span>
						<div class="sheet_amount">{{ currency(orderDetail?.orderAmount || orderDetail?.amount) }}</div>
					</div>
				</div>
				<div class="finish_tit">{{ $t('rechargeDetailDesc8') }}</div>
				<div class="finish_tip">{{ $t('rechargeDetailDesc11') }}</div>
				<div class="pay_btn">
					<div class="cancel_order" @click="finishPayShow = false">{{ $t('rechargeDetailDesc7') }}</div>
					<div class="finish" @click="handleFinish((orderDetail?.id || orderDetail?.orderNumber) as number)">
						{{ $t('rechargeDetailDesc8') }}
					</div>
				</div>
			</div>
		</van-action-sheet>

		<van-action-sheet title=" " v-model:show="C2CTipVisble" @click-overlay="C2CTipVisble = false" :closeable="true">
			<div class="c2c_actiosheet">
				<img :src="closeIcon" class="close_img" />
				<div class="text">*Confirm using <span>your own UPI</span> for the transfer</div>
				<div class="text">
					*After a successful transfer, return here and provide the <span>12-digit Ref/UTR No</span>. for the deposit
					into your account.
				</div>

				<div class="video_text">DEMO VIDEO >></div>
				<div class="text2">Sample of UTR(UPI Ref.ID)</div>
				<div class="img_box">
					<img :src="c2cHelpIcon" alt="" class="help_img" />
				</div>
				<div class="close_box">
					<div class="close_btn" @click="C2CTipVisble = false">{{ $t('close') }}</div>
				</div>
			</div>
		</van-action-sheet>

		<Dialog
			v-model:show="dialogShow"
			:showCancelBtn="false"
			:title="$t('UTRError')"
			confirm-text="OK"
			:confirm="(dialogShow = false)"
		>
			<template #content>{{ $t('c2cTip16') }}</template>
		</Dialog>

		<Dialog
			v-model:show="C2COrderTimeOutStatus"
			:showCancelBtn="false"
			:title="$t('C2Ctimeout1')"
			confirm-text="OK"
			@confirm="handleBack"
		>
			<template #content>{{ $t('C2Ctimeout2') }}</template>
		</Dialog>
	</div>
</template>
<script lang="ts" setup>
import InstructionsVue from '@/components/Wallet/Recharge/Instructions.vue'
import Dialog from '@/components/common/Dialog.vue'
import type { SellerInfo, UpiOrderInfo } from '@/types/api'
import { copy, currency, formatTime, AwaitApiResult } from '@/utils'
import uploadIcon from '@icon/common/upload_icon.png'
import closeIcon from '@public/common/close.png'
import switchIcon from '@public/common/switch.png'
import c2cHelpIcon from '@public/wallet/recharge/C2Chelp.png'
import googlePayIcon from '@public/wallet/recharge/google_pay.png'
import otherBankIcon from '@public/wallet/recharge/other_bank.png'
import paytmIcon from '@public/wallet/recharge/paytm.png'
import phonePeIcon from '@public/wallet/recharge/phone_pe.png'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useRecharge } from '@/hooks/useRecharge'
import { onUnmounted } from 'vue'
import PayState from './components/PayState.vue'
import { UploadImages } from '@/api'
import { showToast } from 'vant'

const {
	store,
	getUpiOrderInfo,
	handleFinishUpiOrder,
	getC2COrderInfo,
	handeCancelOrder,
	createQrCode,
	htmlToImage,
	getDownTime,
	C2COrderTimeOutStatus
} = useRecharge()

const router = useRouter()
const finishPayShow = ref(false)
const orderDetail = ref<Partial<SellerInfo & UpiOrderInfo>>()
const dialogShow = ref(false)
const timer2 = ref()
const timeText = ref('')
const C2CTipVisble = ref(false)
const C2CPayState = ref(1)
const fileList = ref([])
const imgUrl = ref('')
const uploadRef = ref()
const codeUrl = ref('')
const payList = [
	{
		name: 'Paytm',
		icon: paytmIcon,
		id: 1,
		url: 'paytmmp://upi'
	},
	{
		name: 'PhonePe',
		icon: phonePeIcon,
		id: 2,
		url: 'phonepe://pay'
	},
	{
		name: 'GooglePay',
		icon: googlePayIcon,
		id: 3,
		url: 'gpay://upi'
	},
	{
		name: 'Other Bank',
		icon: otherBankIcon,
		id: 4,
		url: 'upi://pay'
	}
]
const uploadUrl = ref({
	fileType: 1,
	fileUrl: ''
})

const isUpi = computed(() => {
	return router.currentRoute.value.query.type === 'C2C'
})

const handleToPay = (url: string) => {
	window.open(url, '_blank')
}

const uploadBtnIcon = computed(() => {
	if (C2CPayState.value === 2) return uploadIcon
	if (C2CPayState.value === 3) return switchIcon
	return uploadIcon
})

const uploadFile = async (file: any) => {
	fileList.value = []
	const formData = new FormData()
	formData.append('files', file.file)
	const result = await AwaitApiResult(UploadImages(formData))
	imgUrl.value = result.data[0].ossHttp + '/' + result.data[0].src
	uploadUrl.value.fileUrl = result.data[0].src
}

const handleBack = () => {
	C2COrderTimeOutStatus.value = false
	router.back()
}

const handleClose = () => {
	finishPayShow.value = false
}

const checkUtr = () => {
	if (store.localUpiUTR.length < 12) {
		return
	} else {
		finishPayShow.value = true
	}
}

const onClick = () => {
	router.back()
}

const currentType = computed(() => router.currentRoute.value.query.type)

const handleNext = () => {
	if (isUpi.value && C2CPayState.value === 1) {
		if (store.localUpiUTR.length < 12) return
		C2CPayState.value = 2
	} else {
		checkUtr()
	}
}

/**
 * @description: 点击完成订单
 * @return {*}
 */
const handleFinish = async (id: number) => {
	if (store.localUpiUTR.length !== 12) {
		dialogShow.value = true
		return
	}
	await handleFinishUpiOrder(router.currentRoute.value.query.type as string, id, uploadUrl.value.fileUrl)
	finishPayShow.value = false
}

/**
 * @description: 跳转到取消订单页面
 * @return {*}
 */
const handleCancelOrder = () => {
	if (router.currentRoute.value.query.type === 'upi') {
		handeCancelOrder(orderDetail.value?.orderNumber + '')
	} else {
		router.push({
			name: 'CancelRecharge',
			query: {
				orderNo: orderDetail.value?.id
			}
		})
	}
}

const getOrderStatus = async () => {
	await getC2COrderInfo()
	orderDetail.value = store.C2COrderInfo
	store.isC2COrder = false
	if (!orderDetail.value) {
		C2COrderTimeOutStatus.value = true
		clearInterval(timer2.value)
		return
	}
	let countdownTimestamp = getDownTime(orderDetail.value.serviceTime as string, orderDetail.value.endTime as string)
	timer2.value = setInterval(() => {
		countdownTimestamp -= 1000
		if (countdownTimestamp < 0) {
			C2COrderTimeOutStatus.value = true
			clearInterval(timer2.value)
		}
		timeText.value = formatTime(countdownTimestamp, 'mm:ss')
	}, 1000)
}

onMounted(async () => {
	let type = router.currentRoute.value.query.type
	timer2.value = null
	let url = ''
	if (type === 'upi') {
		await getUpiOrderInfo()
		orderDetail.value = store.upiOrderInfo
		url = 'upi://pay?pa=' + orderDetail.value?.upiAccount + '&am=' + orderDetail.value?.amount + '&cu=INR'
		console.log(url)
	} else {
		C2CTipVisble.value = true
		// await getC2COrderInfo()
		// orderDetail.value = store.C2COrderInfo
		// store.isC2COrder = false
		await getOrderStatus()
		url = 'upi://pay?pa=' + orderDetail.value?.sellerAccountNo + '&am=' + orderDetail.value?.orderAmount + '&cu=INR'
	}
	const code = await createQrCode(url)
	codeUrl.value = code as string
	createQrCode(url)
	// const orderNo = Number(router.currentRoute.value.query.orderNo) || -1
	// getOrderDetail(orderNo)
})

onBeforeUnmount(() => {
	// 取消定时器
	clearInterval(timer2.value)
})

onUnmounted(() => {
	sessionStorage.removeItem('upiOrderInfo')
	clearInterval(timer2.value)
})
</script>
<style lang="scss" scoped>
.other_pay {
	width: 100%;
	min-height: 100vh;
	position: relative;
	padding: 0 24px 140px;

	.pay_store {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-gap: 12px;
		margin-bottom: 20px;

		.store_item {
			width: 100%;
			height: 130x;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: var(--bg_color_L2);
			border-radius: 10px;
			padding: 12px 0;

			img {
				width: 70px;
				height: 70px;
			}

			span {
				font-size: 24px;
				line-height: 40px;
				color: var(--text_color_L2);
			}
		}
	}

	.tip {
		text-align: center;

		div:first-child {
			font-size: 24px;
			line-height: 34px;
			margin-bottom: 6px;
			color: var(--main-color);
		}

		div:last-child {
			font-size: 24px;
			line-height: 40px;
			color: var(--text_color_L2);
			margin-bottom: 18px;
		}
	}

	.orderInfo {
		margin-bottom: 30px;
		.qrcode {
			display: block;
			width: 280px;
			height: 280px;
			margin: 24px auto 28px;
		}

		.save_qrcode {
			width: 480px;
			height: 60px;
			border: 1px solid var(--main-color);
			border-radius: 10px;
			line-height: 60px;
			text-align: center;
			color: var(--main-color);
			margin: 0 auto 30px;
		}

		.UTR_title {
			color: var(--text_color_L1);
			font-size: 32px;
			line-height: 40px;
			margin-bottom: 12px;
		}
	}

	.info_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--bg_color_L2);
		border-radius: 10px;
		padding: 15px 20px;
		margin-bottom: 10px;

		span {
			font-size: 24px;
			line-height: 40px;
			color: var(--main-color);
		}

		div {
			color: var(--norm_secondary-color);
			font-size: 30px;
			line-height: 36px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			span {
				color: var(--text_color_L2);
				font-size: 26px;
				line-height: 36px;
			}

			svg {
				color: var(--text_color_L2);
				min-width: 32px;
				min-height: 32px;
				margin-inline-start: 20px;
			}
		}

		.utr_tit {
			color: var(--gray-color-1);
			font-size: 24px;
		}

		.utr_img {
			width: 32px;
			height: 32px;
		}
	}

	.pay_btn {
		width: 100%;
		height: 120px;
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-wrap: nowrap;

		div {
			height: 100%;
			line-height: 120px;
			text-align: center;
			box-sizing: border-box;
			cursor: pointer;
		}

		.cancel_order {
			width: 330px;
			border: 1px solid var(--main-color);
			color: var(--main-color);
			font-size: 34px;
		}

		.finish {
			width: calc(100% - 330px);
			background: var(--main-color);
			color: var(--textW);
			font-weight: 700;
			font-size: 34px;
		}

		.unfinish {
			background: #bfc1d2;
		}
	}

	.actionSheet__content {
		padding: 42px 20px;

		.title {
			display: flex;
			flex-direction: row;
			align-items: center;

			img {
				width: 100px;
				height: 42px;
				margin-right: 24px;
			}

			span {
				color: var(--text_color_L1);
				font-weight: 600;
				font-size: 32px;
			}
		}

		.sheet_info {
			margin-bottom: 50px;

			.sheet_item {
				padding: 0;
				margin-bottom: 30px;
				box-shadow: none;

				.sheet_right {
					color: var(--text_color_L2);
					font-size: 26px;
				}

				.sheet_amount {
					color: var(--norm_secondary-color);
				}
			}
		}

		.finish_tit {
			font-size: 36px;
			color: var(--darkTextW, var(--text_color_L1));
			margin-bottom: 30px;
		}

		.finish_tip {
			color: var(--text_color_L2);
			font-size: 26px;
			margin-bottom: 124px;
		}
	}

	.c2c_actiosheet {
		padding: 40px 24px;
		position: relative;
		.text {
			color: var(--darkTextW, var(--text_color_L1));
			font-size: 28px;
			font-style: normal;
			font-weight: 700;
			line-height: 40px; /* 100% */
			letter-spacing: 0.28px;
			margin-bottom: 30px;
			span {
				color: var(--rechargeBgColor-1);
				font-size: 28px;
			}
		}
		.img_box {
			height: 1000px;
			overflow: auto;
			padding-bottom: 100px;
		}
		.video_text {
			color: var(--rechargeBgColor-1);
			font-size: 32px;
			font-weight: 700;
			letter-spacing: 0.32px;
			margin-top: 20px;
			margin-bottom: 50px;
		}
		.help_img {
			width: 100%;
		}
		.close_img {
			position: absolute;
			top: -20px;
			left: 50px;
			width: 60px;
			height: 60px;
			margin-left: -30px;
		}
		.close_btn {
			background: var(--main_gradient-color2);
			width: 674px;
			height: 70px;
			color: var(--textW);
			font-size: 30px;
			font-style: normal;
			font-weight: 700;
			line-height: 40px; /* 133.333% */
			letter-spacing: 1.2px;
			border-radius: 35px;
			text-align: center;
			line-height: 70px;
		}
		.text2 {
			margin-bottom: 20px;
			color: var(--text_color_L1);
			font-size: 28px;
		}
	}
	.close_box {
		height: 140px;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--textW);
	}

	.c2cupload_box {
		.c2cupload_tip {
			padding: 30px 20px;
			height: 160px;
			border: 1px solid var(--bgDark-2, var(--Dividing-line_color));
			color: var(--text_color_L2);
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 24px; /* 100% */
			border-radius: 20px;
			margin-bottom: 20px;
			background: var(--darkBg);
			div {
				margin: 14px;
			}
		}
		.upload_img {
			width: 270px;
			height: 480px;
			margin: 0 auto 25px;
			background: url('@/assets/icons/common/upload_add.png') no-repeat center center;
			background-color: var(--bgDark-3, var(--bg_color_L2));
			border-radius: 10px;
			background-size: 88px 88px;

			img {
				width: 270px;
				height: 480px;
				border-radius: 10px;
				object-fit: contain;
			}
		}
		.noAdd {
			background: var(--bg_color_L2);
		}
		.upload_action {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-bottom: 50px;
			.upload_btn {
				width: 480px;
				height: 60px;
				border: 1px solid var(--main-color);
				border-radius: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 26px;
				color: var(--main-color);
				font-size: 26px;
				svg {
					width: 42px;
					height: 42px;
					margin-right: 10px;
				}
			}
			.upload_text {
				text-align: center;
				color: var(--text_color_L2);
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
				line-height: 34px; /* 100% */
			}
		}
	}

	.c2c_btn {
		width: 674px;
		div {
			border-radius: 35px;
			height: 70px;
			text-align: center;
			line-height: 70px;
			font-size: 30px;
			color: var(--textW);
		}
		.c2cFinish {
			background: var(--main_gradient-color2);
		}
		.no_finish {
			background: var(--main_gradient-color);
		}
		.backPay {
			margin-top: 44px;
			border: 1px solid var(--main-color);
			color: var(--main-color);
		}
	}
}
</style>
