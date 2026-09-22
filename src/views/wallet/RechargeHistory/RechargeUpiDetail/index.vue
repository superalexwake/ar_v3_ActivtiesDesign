<template>
	<div>
		<RechargeDetailHeader
			:state="state"
			:info="info"
			@onClickRight="handleCancelOrder"
			@appeal="handleAppeal"
			@appealAdmin="handleAppealAdmin"
			:key="state"
		/>

		<div style="padding: 20px 16px 0" v-if="isC2CPayState">
			<C2CPayState :state="orderState" :type="orderDetail?.isAppealCompleted || orderDetail?.state === 3 ? 2 : 1" />
		</div>
		<div class="order_info">
			<div class="title">
				<img src="@public/wallet/upi.png" alt="" />
				<span>New UPI {{ $t('recharge') }}</span>
			</div>
			<div class="dir"></div>
			<div class="order_info_box">
				<div class="order_info_item">
					<div class="title">{{ $t('orderAmount') }}</div>
					<span class="amount">{{ currency(orderDetail?.orderAmount) }}</span>
				</div>
				<div class="order_info_item">
					<div class="title">{{ $t('actualAmount') }}</div>
					<span> {{ currency(orderDetail?.finalAmount) }}</span>
				</div>
				<div class="order_info_item">
					<div class="title">{{ $t('award') }}</div>
					<span> {{ currency(orderDetail?.discountAmount) }}</span>
				</div>
				<div class="order_info_item">
					<div class="title">{{ $t('orderTime') }}</div>
					<span class="time">{{ orderDetail?.createTime }}</span>
				</div>
				<div class="order_info_item" v-if="orderDetail?.state === 8">
					<div class="title">{{ $t('c2cTip47') }}</div>
					<span class="time">{{ orderDetail?.lastUpdateTime }}</span>
				</div>
			</div>
			<div class="divider"></div>
			<div class="order_info_box">
				<div class="order_info_item">
					<div class="title">UTR</div>
					<div class="order_num">
						<span>{{ orderDetail?.transactionNo }}</span>
						<img src="@public/wallet/recharge/copy1.png" alt="" @click="copy(orderDetail?.transactionNo || '-')" />
					</div>
				</div>
				<div class="order_info_item">
					<div class="title">{{ $t('orderNo') }}</div>
					<div class="order_num">
						<span>{{ orderDetail?.orderNo }}</span>
						<img src="@public/wallet/recharge/copy1.png" alt="" @click="copy(orderDetail?.orderNo || '-')" />
					</div>
				</div>
				<div class="order_info_item">
					<div class="title">{{ $t('PaymentTime') }}</div>
					<span class="time">{{ orderDetail?.confrimBeginTime }}</span>
				</div>
			</div>
		</div>

		<div class="upi_info">
			<div class="upi_title">{{ $t('information') }}</div>
			<van-divider />
			<div class="order_info_box">
				<div class="order_info_item">
					<div class="title">UPI</div>
					<div class="order_num">
						<span>{{ orderDetail?.sellerAccountNo || '--' }}</span>
						<img src="@public/wallet/recharge/copy1.png" alt="" @click="copy(orderDetail?.sellerAccountNo || '-')" />
					</div>
				</div>
			</div>
		</div>

		<div class="upi_info" v-if="orderDetail?.state !== 8">
			<div class="upi_title">{{ $t('c2cTip50') }}</div>
			<van-divider />
			<img
				:src="imgUrl"
				class="pay_img"
				alt=""
				@click="
					() => {
						showImagePreview({
							images: [imgUrl || ''],
							closeable: true
						})
					}
				"
			/>
		</div>

		<div v-else>
			<div class="upi_info">
				<div class="upi_title tit_img">{{ $t('c2cTip48') }}</div>
				<van-divider />
				<img
					v-for="item in imgList"
					:src="Setting.getOSSUrl + '/' + item.fileUrl"
					class="withdraw_img"
					alt=""
					@click="
						() => {
							showImagePreview({
								images: [Setting.getOSSUrl + '/' + item.fileUrl],
								closeable: true
							})
						}
					"
				/>
			</div>
			<div class="upi_info" v-if="videoUrl">
				<div class="upi_title tit_video">{{ $t('c2cTip49') }}</div>
				<van-divider />
				<video style="width: 100%" controls>
					<source :src="Setting.getOSSUrl + '/' + videoUrl" />
				</video>
			</div>
		</div>

		<!-- <div class="btn_group">
			<div class="appeal" v-if="orderDetail?.state === 7" @click="handleAppeal">{{ $t('appeal') }}</div>
			<div class="appeal_admin" v-if="orderDetail?.state === 3" @click="handleAppealAdmin">{{ $t('AppealsAdmin') }}</div>
			<div
				class="cancel"
				@click="handleCancelOrder"
				v-if="orderDetail?.state === 7 || orderDetail?.state === 3 || orderDetail?.state === 1"
			>
				{{ $t('concelOrder') }}
			</div>
		</div> -->
	</div>
</template>
<script lang="ts" setup>
import { AwaitApiResult, copy, currency } from '@/utils'
import RechargeDetailHeader from '@/components/Wallet/Recharge/RechargeDetailHeader.vue'
import { C2CRechargeAppeal, getC2CRechargeDetail } from '@/api'
import type { SellerInfo } from '@/types/api'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { onUnmounted } from 'vue'
import { showImagePreview, showToast } from 'vant'
import { SettingStore } from '@/stores'
import C2CPayState from '@/views/wallet/OtherPay/components/PayState.vue'

const router = useRouter()

const orderState = ref(3)
const orderDetail = ref<SellerInfo>()
const state = ref(-1)
const info = ref()
const timer = ref<NodeJS.Timeout>()
const Setting = SettingStore()

const isC2CPayState = computed(() => {
	if (orderDetail.value?.isAppealCompleted) {
		return true
	}
	let arr = [4, 3, 7, 1]
	if (arr.includes(orderDetail.value?.state as number)) {
		return true
	}
	return false
})

const imgUrl = computed(() => {
	if (orderDetail.value?.ossUrls) {
		console.log(JSON.parse(orderDetail.value?.ossUrls as string)[0].fileUrl, Setting.getOSSUrl)
		return Setting.getOSSUrl + '/' + JSON.parse((orderDetail.value?.ossUrls as string) || '[]')[0].fileUrl || ''
	}
	return
})

const imgList = computed(() => {
	if (orderDetail.value?.withdrawOssUrls) {
		return JSON.parse(orderDetail.value?.withdrawOssUrls as string).filter(
			(item: { fileType: number }) => item.fileType === 1
		)
	}
	return []
})

const videoUrl = computed(() => {
	if (orderDetail.value?.withdrawOssUrls) {
		return JSON.parse(orderDetail.value?.withdrawOssUrls as string).filter(
			(item: { fileType: number }) => item.fileType === 2
		)[0]?.fileUrl
	}
	return []
})

/**
 * @description: 获取订单详情
 * @param {*} orderNo
 * @return {*}
 */
const getOrderDetail = async (orderNo: number) => {
	const res = await AwaitApiResult<ObjResNull<SellerInfo>>(getC2CRechargeDetail({ orderId: orderNo }))
	if (res) {
		orderDetail.value = res.data
		info.value = res.data
		state.value = res.data.state as number
		if (orderDetail.value.state === 4) {
			orderState.value = 4
		}
		if (orderDetail.value.state === 5 && orderDetail.value.isAppealCompleted) {
			orderState.value = 4
		}
		if (state.value !== 1) {
			timer.value && clearInterval(timer.value)
		}
		if (state.value === 3 || state.value === 7) {
			getTawk()
		}
	}
}
const handleCancelOrder = () => {
	router.push({
		name: 'CancelRecharge',
		query: {
			orderNo: orderDetail.value?.id
		}
	})
}

/**
 * @description: 我要申诉
 * @return {*}
 */
const handleAppeal = async () => {
	try {
		await AwaitApiResult(C2CRechargeAppeal({ orderId: orderDetail.value?.id as number }))
		await getOrderDetail(orderDetail.value?.id as number)
		showToast({
			message: '申诉成功',
			type: 'success'
		})
		handleAppealAdmin()
		state.value = orderDetail.value?.state as number
	} catch {}
}

const handleAppealAdmin = () => {
	// @ts-ignore
	;(Tawk_API as any).toggle() // 唤起客服
	// @ts-ignore
	window.Tawk_API.setAttributes(
		{
			order: orderDetail.value?.id,
			store: 'recharge'
		},
		function (error: any) {
			console.log('error', error)
		}
	)
}

const getTawk = () => {
	// 加载tawk.to聊天小工具的Widget代码
	let tawkSrc = 'https://embed.tawk.to/6452138631ebfa0fe7fbb175/1hb0ug9qm'
	if (!document.getElementById('tawk-chatjs')) {
		let s1 = document.createElement('script')
		s1.id = 'tawk-chatjs'
		s1.async = true
		s1.src = tawkSrc
		document.head.appendChild(s1)
	}
}

onMounted(() => {
	state.value = Number(router.currentRoute.value.query.state)
	const orderNo = Number(router.currentRoute.value.query.orderNo) || -1
	getOrderDetail(orderNo)
	if (state.value === 1) {
		timer.value = setInterval(() => {
			getOrderDetail(orderNo)
		}, 5000)
	} else {
		clearInterval(timer.value as NodeJS.Timeout)
	}
	if (state.value === 3 || state.value === 7) {
		getTawk()
	}
})

onUnmounted(() => {
	timer.value && clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
.order_info {
	position: relative;
	z-index: 2;
	width: 704px;
	background: var(--bg_color_L2);

	border-radius: 10px;
	margin: 30px auto 36px;
	padding: 30px 20px;

	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;

		img {
			width: 100px;
			height: 41px;
			margin-right: 26px;
		}

		span {
			font-weight: 700;
			font-size: 32px;
			line-height: 40px;
			color: var(--text_color_L1);
		}
	}

	.dir {
		width: 620px;
		margin-left: 48px;
		height: 1px;
		background-color: var(--saveTextColor-3);
	}
}

.upi_info {
	width: 704px;
	background: var(--bg_color_L2);

	border-radius: 10px;
	margin: 0 auto 36px;
	padding: 30px 20px;

	.upi_title {
		font-size: 28px;
		line-height: 34px;
		color: var(--text_color_L1);
		margin-bottom: 20px;
		// text-indent: 16px;
		position: relative;
		&.tit_img,
		&.tit_video {
			line-height: 48px;
			font-size: 32px;
			font-weight: 600;
		}
		&.tit_img::before {
			content: '';
			width: 48px;
			height: 48px;
			background-color: transparent;
			background-image: url('@assets/icons/wallet/withdraw/c2c/uploadImg1.png');
			background-repeat: no-repeat;
			background-size: cover;
			margin-right: 10px;
		}
		&.tit_video::before {
			content: '';
			width: 48px;
			height: 48px;
			background-image: url('@assets/icons/wallet/withdraw/c2c/uploadVideo.png');
			background-repeat: no-repeat;
			background-size: cover;
			margin-right: 10px;
		}
	}

	.upi_title::before {
		content: '';
		display: inline-block;
		width: 6px;
		height: 30px;
		background: var(--main-color);
		margin-right: 8px;
		vertical-align: top;
	}
}

.order_info_box {
	margin-top: 34px;

	.order_info_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;

		.title {
			font-size: 26px;
			line-height: 20px;
			color: var(--text_color_L2);
		}

		span {
			font-size: 26px;
			line-height: 20px;
			color: var(--text_color_L1);
		}

		.amount {
			color: var(--norm_secondary-color);
		}

		.time {
			color: var(--text_color_L2);
		}

		.order_num {
			display: flex;
			color: var(--text_color_L2);
			flex-direction: row;
			align-items: center;

			span {
				margin-right: 20px;
			}

			img {
				width: 32px;
				height: 32px;
			}
		}
	}
}

.btn_group {
	margin-top: 60px;

	div {
		margin: 0 auto 44px;
	}

	.appeal,
	.appeal_admin {
		background: var(--main_gradient-color2);
		border-radius: 80px;
		color: var(--text_color_L4);
		width: 674px;
		height: 70px;
		line-height: 70px;
		text-align: center;
		font-weight: 700;
		font-size: 30px;
	}

	.cancel {
		width: 674px;
		height: 70px;
		line-height: 70px;
		border: 1px solid var(--main-color);
		border-radius: 80px;
		font-weight: 400;
		font-size: 30px;
		color: var(--main-color);
		text-align: center;
	}
}

.divider {
	width: 100%;
	height: 1px;
	margin: 40px 0 50px;
	position: relative;
	// border-top: 1px dashed var(--gray-color-1);
	background-image: linear-gradient(to right, #c2c2c2 0%, #c2c2c2 40%, transparent 8%);
	background-size: 40px 1px;
	background-repeat: repeat-x;
}

.divider:before,
.divider:after {
	content: '';
	width: 42px;
	height: 42px;
	border-radius: 50%;
	background-color: var(--bg_color_L1);
	position: absolute;
}

.divider:before {
	left: -40px;
	top: -21px;
	html:lang(ar) & {
		right: -40px;
		left: unset;
	}
}

.divider:after {
	right: -40px;
	top: -21px;
	html:lang(ar) & {
		right: unset;
		left: -40px;
	}
}
.pay_img {
	width: 100%;
	height: auto;
	object-fit: fill;
}
.withdraw_img {
	width: 33%;
	height: auto;
	object-fit: fill;
}
</style>
