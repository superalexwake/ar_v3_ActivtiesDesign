<template>
	<template v-if="!isMatching">
		<div class="c2cDetail__C">
			<div class="header" :class="['bgc' + stateHeader.background]">
				<NavBar title="" left-arrow @click-left="onBack" backgroundColor="transparent" />
				<div class="head" :class="['hicon' + stateHeader.icon]">
					<div class="title">
						{{ stateHeader.title }} <span v-if="[1, 13].includes(OrderDetail.state)">{{ formatTime }}</span>
					</div>
					<div class="tip1">{{ stateHeader.tip1 }}</div>
					<div v-if="stateHeader.tip2" class="tip2">{{ stateHeader.tip2 }}</div>
					<template v-if="accountArry">
						<div>{{ $t('c2cTip23') }}</div>
					</template>
				</div>
				<div v-if="accountArry" class="accountArry">
					<div class="account btn" @click="account(OrderDetail.orderNo)">{{ $t('confirmTheAccount') }}</div>
					<div v-if="appealArry" class="appeal btn" @click="appeal(OrderDetail.orderNo)">{{ $t('appeal') }}</div>
					<div v-if="OrderDetail.state == 3" class="appeal btn" @click="admin()">{{ $t('AppealsAdmin') }}</div>
					<div v-if="OrderDetail.state == 1" class="wrong btn" @click="toWrong()">{{ $t('c2cState14') }}</div>
				</div>
			</div>
			<div class="con">
				<!-- 进度条 -->
				<Progress :state="OrderDetail?.state" :isAppealCompleted="OrderDetail?.isAppealCompleted"></Progress>
				<div class="order">
					<div class="order-h">New UPI {{ $t('withdraw') }}</div>
					<div class="order-q y">
						<span>{{ $t('orderAmount') }}</span>{{ currency(OrderDetail.orderAmount) }}
					</div>
					<div class="order-q y" v-if="[4,14].includes(OrderDetail.state)">
						<span>{{ $t('actualAmount') }}</span>{{ currency(OrderDetail.realAmount) }}
					</div>
					<div v-if="!ifShowDicA" class="order-q orange">
						<span>{{ $t('award') }}</span>{{ currency(OrderDetail.discountAmount) }}
					</div>
					<div class="order-t">
						<span>{{ $t('orderTime') }}</span>{{ OrderDetail.createTime }}
					</div>
					<div class="order-t" v-if="OrderDetail.state == 14">
						<span>{{ $t('c2cTip47') }}</span>{{ OrderDetail.lastUpdateTime }}
					</div>
					<div class="line"></div>
					<div v-if="!is10" class="order-id" @click="copy(OrderDetail.transactionNo)">
						<span>UTR</span>{{ OrderDetail.transactionNo }}
					</div>
					<div class="order-id" @click="copy(OrderDetail.orderNo)">
						<span>{{ $t('orderNo') }}</span>{{ OrderDetail.orderNo }}
					</div>
					<div v-if="!is10" class="order-tl">
						<span>{{ $t('PaymentTime') }}</span>{{ OrderDetail.rechargeFinishTime }}
					</div>
				</div>
				<div v-if="!is10" class="upi">
					<div class="upi-h">{{ $t('information') }}</div>
					<div class="upi-id" @click="copy(OrderDetail.sellerAccountNo)">
						<span>UPI</span>{{ OrderDetail.sellerAccountNo }}
					</div>
				</div>
				<div class="upi img" v-if="[5, 1, 9, 3, 4, 6].includes(OrderDetail.state) && OrderDetail?.rechargeOssUrls">
					<div class="upi-h">
						{{ $t('c2cTip50') }}
					</div>
					<div class="imgBox">
						<div class="imgD" v-for="(item, index) in getOssUrls(OrderDetail?.rechargeOssUrls)" :key="index"
							:style="`background-image: url('${item?.fileUrl}');`" @click="showBigImg(item?.fileUrl)"></div>
					</div>
				</div>
				<div class="img" v-if="OrderDetail?.state == 14 && OrderDetail?.ossUrls">
					<h1>
						{{ $t('c2cTip48') }}
					</h1>
					<div class="imgBox">
						<div class="imgD" v-for="(item, index) in getOssUrls(OrderDetail?.ossUrls, 1)" :key="index"
							:style="`background-image: url('${item?.fileUrl}');`" @click="showBigImg(item?.fileUrl)"></div>
					</div>
				</div>
				<div class="img video" v-if="OrderDetail?.state == 14 && getOssUrls(OrderDetail?.ossUrls, 2)">
					<h1>
						{{ $t('c2cTip49') }}
					</h1>
					<video class="v"  controls>
						<source :src="getOssUrls(OrderDetail?.ossUrls, 2)[0]?.fileUrl" type="video/ogg"/>
						<source :src="getOssUrls(OrderDetail?.ossUrls, 2)[0]?.fileUrl" type="video/mp4"/>
						<source :src="getOssUrls(OrderDetail?.ossUrls, 2)[0]?.fileUrl" type="video/webm"/>
					</video>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<c2cDetailOther v-model:orderNo="order" v-model:OrderDetail="OrderDetail" v-if="OrderDetail.orderNo != ''" />
	</template>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, onBeforeUnmount, watch } from 'vue'
import { GetC2CWithdrawOrderDetail, C2CWithdrawConfirm, C2CWithdrawAppeal } from '@/api'
import { AwaitApiResult, copy, currency } from '@/utils'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import c2cDetailOther from '@/components/Wallet/Withdraw/c2cDetailOther.vue'
import Progress from '@/components/Wallet/Withdraw/progress.vue'
import { SettingStore } from '@/stores'
import { showImagePreview } from 'vant'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const settingS = SettingStore()
const HeadMap = {
	0: {
		title: t('c2cState0'),
		tip1: t('c2cTip1'),
		tip2: t('tipPlaWaitPaciently'),
		icon: '0',
		background: 0
	},
	1: {
		title: t('c2cState1'),
		tip1: t('c2cTip2'),
		tip2: t('c2cTip3'),
		icon: '0',
		background: 1
	},
	2: {
		title: t('c2cState8'),
		tip1: t('c2cTip4'),
		tip2: t('tipPlaWaitPaciently'),
		icon: '6',
		background: 8
	},
	3: {
		title: t('c2cState3'),
		tip1: t('c2cTip5'),
		tip2: t('c2cTip6'),
		icon: '1',
		background: 3
	},
	4: {
		title: t('completed'),
		tip1: t('c2cTip7'),
		tip2: t('c2cTip8'),
		icon: '2',
		background: 4
	},
	5: {
		title: t('c2cTip9'),
		tip1: t('c2cTip10'),
		tip2: t('c2cTip11'),
		icon: '3',
		background: 5
	},
	6: {
		title: t('cancelled'),
		tip1: '*****', // 后端接口返回取消原因
		tip2: '',
		icon: '4',
		background: 6
	},
	7: {
		title: t('c2cTip12'),
		tip1: t('c2cTip1'), //后端接口返回原因
		tip2: '',
		icon: '5',
		background: 7
	},
	8: {
		title: t('withdrawState1'),
		tip1: t('c2cTip4'),
		tip2: t('tipPlaWaitPaciently'),
		icon: '6',
		background: 8
	},
	9: {
		title: t('rechargeState1'),
		tip1: t('c2cTip13'),
		tip2: t('c2cTip14'),
		icon: '7',
		background: 9
	},
	10: {
		title: t('c2cState10'),
		tip1: t('c2cTip21'),
		tip2: t('c2cTip22'),
		icon: '8',
		background: 10
	},
	11: {
		title: t('c2cState11'),
		tip1: t('c2cWTip1'),
		tip2: t('c2cWTip2'),
		tip3: t('c2cWTip3'),
		icon: '8',
		background: 11
	},
	12: {
		//提现超时-暂时显示成匹配中
		title: t('c2cState11'),
		tip1: t('c2cTip21'),
		tip2: t('c2cTip22'),
		icon: '8',
		background: 10
	},
	13: {
		title: t('c2cState13'),
		tip1: t('c2cTip24'),
		icon: '0',
		background: 11
	},
	14: {
		title: t('c2cState14'),
		tip1: t('c2cTip46'),
		tip2: t('c2cTip33'),
		icon: '14',
		background: 11
	}
}

const countDownTime = ref(0)
const formatTime = ref('00:00')
const timer = ref<NodeJS.Timeout | null>(null)
const timer0 = ref<NodeJS.Timeout | null>(null) //审核中的计时器
const OrderDetail = ref<any>({
	id: 0,
	orderNo: '',
	type: 0,
	withdrawName: '',
	createTime: '',
	orderAmount: 0,
	realAmount: 0,
	discountAmount: 0,
	serviceAmount: 0,
	state: Number(route.query?.state || 0),
	cancelReasonId: 0,
	reasonText: '',
	remark: '',
	transactionNo: '',
	sellerAccountNo: '',
	rechargeFinishTime: ''
})
const order = ref<string>('')
const stateHeader = computed(() => {
	return HeadMap[OrderDetail.value.state]
})
const is10 = computed(() => Boolean(OrderDetail.value.state == 10))
const appealArry = computed(() => {
	return [9].includes(OrderDetail.value.state)
})
const accountArry = computed(() => {
	return [1, 9, 3].includes(OrderDetail.value.state)
})
//是不是匹配中或者匹配超时或提现超时
const isMatching = computed(() => {
	return [2, 11, 12].includes(OrderDetail.value.state)
})

const ifShowDicA = computed(() => {
	return [5, 6, 7, 14].includes(OrderDetail.value.state)
})
watch(() => OrderDetail.value.state,
	(newVal) => {
		setData()
	}, {
	deep: true
})
const onBack = () => {
	router.back()
}

function getOssUrls(list: string, type?: number) {
	if (!list) return
	let newList;
	if (type) {
		newList = JSON.parse(list).filter((item: any) => item.fileType == type)
	} else {
		newList = JSON.parse(list)
	}
	if (newList.length == 0) return false
	return newList.map((x: any) => {
		x.fileUrl = settingS.ossUrl + '/' + x.fileUrl
		return x
	})
}

/**
 * @description: 获取订单详情
 * @param {*} orderNo
 * @return {*}
 */
const getOrderDetail = async (orderNo: string) => {
	const res = await AwaitApiResult(GetC2CWithdrawOrderDetail({ orderNo }))
	if (res) {
		OrderDetail.value = res.data
		// OrderDetail.value.state = 1
	}
}

function setData() {
	if ([1, 13].includes(OrderDetail.value.state)) {
		const startTime = OrderDetail.value?.serviceTime.replace(/-/g, '/')
		if (OrderDetail.value.state == 1) {
			const endTime = OrderDetail.value.confrimEndTime.replace(/-/g, '/')
			countDownTime.value = new Date(endTime).getTime() - new Date(startTime).getTime()
		} else if (OrderDetail.value.state == 13) {
			const matchOutTime = OrderDetail.value.matchOutTime.replace(/-/g, '/') //超时时间
			countDownTime.value = new Date(matchOutTime).getTime() - new Date(startTime).getTime()
		}
		clearInterval(timer.value as NodeJS.Timeout)
		startTimer()
	} else {
		clearInterval(timer.value as NodeJS.Timeout)
	}
	if (OrderDetail.value.state === 7 || OrderDetail.value.state === 6) {
		HeadMap[OrderDetail.value.state].tip1 = OrderDetail.value.reasonText || ''
		HeadMap[OrderDetail.value.state].tip2 = OrderDetail.value.remark || ''
	}

	//如果是审核中，每10秒轮询一次
	if (OrderDetail.value.state === 0) {
		clearInterval(timer0.value as NodeJS.Timeout)
		startTimer0()
	} else {
		clearInterval(timer0.value as NodeJS.Timeout)
	}
	if (OrderDetail.value.state === 3) {
		getTawk()
	}
}

/**
 * @description: c2c提现确认到账
 * @param {object} params
 * @return {*}
 */
const account = async (orderNo: string) => {
	const res = await AwaitApiResult(C2CWithdrawConfirm({ orderNo }))
	getOrderDetail(orderNo)
}

/**
 * @description: c2c提现申诉接口
 * @return {*}
 */
const appeal = async (orderNo: string) => {
	const res = await AwaitApiResult(C2CWithdrawAppeal({ orderNo }))
	getOrderDetail(orderNo)
}

const formatDuration = (duration: number) => {
	const hours = Math.floor(duration / 3600000)
	const minutes = Math.floor((duration - hours * 3600000) / 60000)
	const seconds = Math.floor((duration - hours * 3600000 - minutes * 60000) / 1000)
	return `${hours ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
}

const min5 = ref(5)

function startTimer() {
	timer.value = setInterval(() => {
		min5.value--
		if (countDownTime.value > 0) {
			countDownTime.value -= 1000 // 每次减少1秒
			formatTime.value = formatDuration(countDownTime.value) // 格式化时间
		} else {
			formatTime.value = '00:00'
		}
		if (min5.value == 0) {
			getOrderDetail(order.value)
			min5.value = 5
		}
	}, 1000)
}

//审核中状态计时器
function startTimer0() {
	timer0.value = setInterval(() => {
		getOrderDetail(order.value)
	}, 5000)
}

const admin = () => {
	// @ts-ignore
	; (Tawk_API as any).toggle()
	// @ts-ignore
	window.Tawk_API.setAttributes({
		'order' : order.value,
		'store': 'withdraw'
	}, function(error){});
}
const getTawk = () => {
	// 加载tawk.to聊天小工具的Widget代码
	let tawkSrc = 'https://embed.tawk.to/6452138631ebfa0fe7fbb175/1hb0ug9qm'
	if (!document.getElementById('tawk-chatjs')) {
		var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
		s1.async = true;
		s1.src = tawkSrc;
		s1.charset = 'UTF-8';
		s1.setAttribute('crossorigin', '*');
		s1.id = 'tawk-chatjs'
		s0.parentNode.insertBefore(s1, s0);
	}
}
function toWrong() {
	router.push({
		name: 'Withdraw-c2cWrongAmount',
		query: { orderNo: order.value }
	})
}
function showBigImg(url: string) {
	showImagePreview({
		images: [url],
		closeable: true,
	});
}
onMounted(() => {
	order.value = localStorage.getItem('c2cOrderNo') || route.query?.order?.toString() || '' //这样改是为了获取到修改金额后返回的新订单号
	getOrderDetail(order.value)
})
onUnmounted(() => { })
onBeforeUnmount(() => {
	clearInterval(timer.value as NodeJS.Timeout)
	clearInterval(timer0.value as NodeJS.Timeout)
})
</script>
<style lang="scss" scoped>
.c2cDetail__C {
	height: 100vh;
	overflow: auto;

	.header {
		padding: 0 24px 30px;

		$list: (
			0: linear-gradient(90deg, #598ff9 0%, #75a4ff 100%),
			1: linear-gradient(90deg, #f95959 0%, #ff9e91 100%),
			2: linear-gradient(90deg, #fff 0%, #fff 100%),
			3: linear-gradient(90deg, #f95959 0%, #f95959 100%),
			4: linear-gradient(90deg, #34be8b 0%, #34be8b 100%),
			5: linear-gradient(90deg, #ff696a 0%, #ff696a 100%),
			6: linear-gradient(90deg, #b2b2b2 0%, #b2b2b2 100%),
			7: linear-gradient(90deg, #ff5858 0%, #ff5858 100%),
			8: linear-gradient(90deg, #ff8616 0%, #f5a50a 100%),
			9: linear-gradient(90deg, #f6a50b 0%, #f6a50b 100%),
			10: linear-gradient(90deg, #333 0%, #333 100%),
			11: linear-gradient(90deg, #F95959 0%, #F95959 100%),
		);

	@each $key, $color in $list {
		&.bgc#{$key} {
			background-image: $color;
		}
	}

	.head {
		min-height: 160px;
		color: var(--textW);
		background-repeat: no-repeat;
		background-size: 160px;
		background-repeat: no-repeat;
		background-position: right 0 center;
		html:lang(ar) & {
			background-position: left 0 center;
		}

		$list: (
			0: url('@/assets/icons/wallet/withdraw/c2c/hicon0.png'),
			1: url('@/assets/icons/wallet/withdraw/c2c/hicon1.png'),
			2: url('@/assets/icons/wallet/withdraw/c2c/hicon2.png'),
			3: url('@/assets/icons/wallet/withdraw/c2c/hicon3.png'),
			4: url('@/assets/icons/wallet/withdraw/c2c/hicon4.png'),
			5: url('@/assets/icons/wallet/withdraw/c2c/hicon5.png'),
			6: url('@/assets/icons/wallet/withdraw/c2c/hicon6.png'),
			7: url('@/assets/icons/wallet/withdraw/c2c/hicon7.png'),
			8: url('@/assets/icons/wallet/withdraw/c2c/hicon8.png'),
			14: url('@/assets/icons/wallet/withdraw/c2c/hicon14.png')
		);

	@each $key, $img in $list {
		&.hicon#{$key} {
			background-image: $img;
		}
	}


	.title {
		height: 50px;
		font-weight: 700;
		font-size: 36px;
		line-height: 50px;
		margin-bottom: 24px;
	}

	.tip1,
	.tip2 {
		min-height: 30px;
		font-weight: 400;
		font-size: 26px;
		line-height: 30px;

		&+div {
			margin-top: 20px;
		}
	}

	&>div {
		width: calc(100% - 170px);
	}
}

.accountArry {
	margin-top: 60px;
	display: flex;
	justify-content: space-between;

	.btn {
		width: 48%;
		min-height: 70px;
		border: 1px solid var(--textW);
		border-radius: 30px;
		color: var(--textW);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28px;
		font-weight: 700;

		&::before {
			content: '';
			width: 48px;
			height: 48px;
			background-size: 48px 48px;
			background-repeat: no-repeat;
			background-position: center;
			margin-right: 10px;
		}

		&.account::before {
			background-image: url('@/assets/icons/wallet/withdraw/c2c/confirmA.png');
		}

		&.appeal::before {
			background-image: url('@/assets/icons/wallet/withdraw/c2c/appeal.png');
		}

		&.wrong::before {
			background-image: url('@/assets/icons/wallet/withdraw/c2c/wrong.png');
		}

	}
}

}

.con {
	padding: 0 24px 30px;
	.order {
		background: var(--bg_color_L2);
		border-radius: 10px;
		padding: 30px 20px;
		font-size: 26px;
		margin-top: 42px;

		&>div {
			display: flex;
			justify-content: space-between;

			&+div {
				margin-top: 30px;

				span {
					color: var(--text_color_L2);
				}
			}
		}

		&-h {
			height: 70px;
			font-weight: 700;
			font-size: 32px;
			line-height: 40px;
			padding: 0 0 18px 106px;
			color: var(--text_color_L1);
			background-image: url('@/assets/icons/wallet/withdraw/c2c/upi.png');
			background-repeat: no-repeat;
			background-size: 100px 42px;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				right: 0;
				bottom: 0;
				display: block;
				width: calc(100% - 40px);
				height: 0;
				border-bottom: 1px solid var(--saveTextColor-3);
			}
		}

		&-q {
			color: var(--text_color_L1);

			&.y {
				color: var(--norm_secondary-color);
			}

			&.orange {
				color: var(--main-color);
			}
		}

		&-id {
			background-image: url('@icon/public/copy.png');
			background-repeat: no-repeat;
			background-size: 32px;
			background-position: right center;
			padding-right: 40px;
			html:lang(ar) & {
				background-position: left center;
			}
		}

		&-t {
			color: var(--text_color_L2);
		}

		&-tl {
			color: 888;
		}

		.line {
			height: 42px;
			background-image: url('@/assets/icons/wallet/withdraw/c2c/upiline.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position: top;
			background-color: var(--bg_color_L2);
			width: calc(100% + 28px);
			position: relative;
			left: -14px;
			html:lang(ar) &{
				left: unset;
				right: -14px;
			}

			&::after,
			&::before {
				content: '';
				position: absolute;
				width: 42px;
				height: 42px;
				background-color: var(--bg_color_L2);
				border-radius: 50%;
				top: 0;
			}

			&::before {
				left: -21px;
				html:lang(ar) &{
					left: unset;
					right: -21px;
				}
			}

			&::after {
				right: -21px;
				html:lang(ar) &{
                    right: unset;
                    left: -21px;
                }
			}
		}
	}

	.upi {
		padding: 30px 20px 76px 20px;
		margin-top: 36px;
		background: var(--bg_color_L2);
		box-shadow:var(--BoxShadowColor-9);
		border-radius: 10px;
		margin-bottom: 60px;

		&-h {
			color: var(--text_color_L1);
			font-size: 28px;
			padding: 0 0 30px 16px;
			border-bottom: 1px solid var(--gray-color-1);
			position: relative;
			margin-bottom: 32px;

			&::before {
				content: '';
				display: block;
				width: 6px;
				height: 30px;
				background-color: var(--main-color);
				position: absolute;
				left: -3px;
				top: 4px;
				html:lang(ar) &{
					left: unset;
					right: -3px;
				}
			}
		}

		&-id {
			display: flex;
			justify-content: space-between;
			background-image: url('@icon/public/copy.png');
			background-repeat: no-repeat;
			background-size: 32px;
			background-position: right center;
			padding-right: 40px;
			font-size: 26px;
			html:lang(ar) & {
				background-position: left center;
			}
		}
	}

	.img {
		margin-top: 30px;

		h1 {
			display: flex;
			font-size: 32px;
			color: var(--text_color_L1);
			margin-bottom: 10px;

			&::before {
				content: '';
				width: 48px;
				height: 48px;
				background: url('@/assets/icons/wallet/withdraw/c2c/uploadImg1.png') no-repeat center;
				background-size: cover;
				margin-right: 10px;
			}
		}

		.imgBox {
			display: flex;
			gap: 15px;
			justify-content: left;

			.imgD {
				width: calc(100% / 3);
				height: 428px;
				background-repeat: no-repeat;
				background-position: top left;
				background-size: contain;
				html:lang(ar) & {
					background-position: top right;
				}
			}
		}
	}

	.video {
		h1 {
			&::before {
				background: url('@/assets/icons/wallet/withdraw/c2c/uploadVideo.png') no-repeat center;
				background-size: cover;
			}
		}

		.v {
				width: 100%;
				height: 427px;
			}
	}
}

}
</style>
