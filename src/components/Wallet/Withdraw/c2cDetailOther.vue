<template>
	<div class="c2cDetail__CO">
		<div class="top">
			<NavBar :title="stateHeader.title" left-arrow @click-left="onBack" backgroundColor="transparent" />
			<!-- 进度条 -->
			<Progress :state="OrderDetail?.state"></Progress>
			<div class="container">
				<div class="time" v-if="isMatching">
					<p>{{ stateHeader.title }}</p>
					<div>
						<span>{{ formatTime_1 }}</span>
					</div>
				</div>

				<div class="time2" v-if="!isMatching" >{{ $t('c2cState2') }}</div>
			</div>
			<div class="head">
				<div class="tip2">{{ stateHeader.tip2 }}</div>
				<div class="tip2">
					{{ stateHeader.tip3 }}<span v-if="isMatching">{{ OrderDetail.matchTimeMinutes || 5 }}{{ $t('minute') }}</span>
				</div>
			</div>
			<div class="operate" v-if="!isMatching">
				<div class="CancelW" @click="toCancelW">{{ $t('concelOrder') }}</div>
				<div class="uAmount" @click="onContinue">{{ $t('continueM') }}</div>
			</div>
		</div>
		<div class="order" :class="['bgc' + stateHeader.background]">
			<div class="order-q">
				<span>{{ $t('withdrawalA') }}</span
				><span class="y">{{ currency(OrderDetail.orderAmount) }}</span>
			</div>
			<div class="order-q">
				<span>UPI {{ $t('account') }}</span
				><span class="b">{{ OrderDetail.sellerAccountNo }}</span>
			</div>
			<div class="order-id" @click="copy(OrderDetail.orderNo)">
				<span>{{ formatTime(OrderDetail.createTime, 'yyyy-MM-dd') }}</span
				>{{ OrderDetail.orderNo }}
			</div>
			<div class="line"></div>
			<div class="tip">{{ $t('c2cWTip4') }}</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { C2CWithdrawRematch, GetC2CWithdrawOrderDetail } from '@/api/modules/wallet'
import { AwaitApiResult, copy, currency, formatTime } from '@/utils'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVModels } from '@vueuse/core'
import Progress from '@/components/Wallet/Withdraw/progress.vue'

const router = useRouter()
const { t } = useI18n()
const props = withDefaults(
	defineProps<{
		OrderDetail: any
		orderNo: string
	}>(),
	{}
)

const emit = defineEmits(['update:OrderDetail', 'update:orderNo'])
const { OrderDetail, orderNo } = useVModels(props, emit)

const HeadMap = {
	2: {
		title: t('c2cState11'),
		tip1: t('c2cWTip1'),
		tip2: t('c2cWTip6'),
		tip3: t('c2cTip31')
	},
	11: {
		title: t('c2cState11'),
		tip1: t('c2cWTip1'),
		tip2: t('c2cWTip2'),
		tip3: t('c2cWTip3')
	},
	12: {
		title: t('c2cState11'),
		tip1: t('c2cWTip1'),
		tip2: t('c2cWTip2'),
		tip3: t('c2cWTip3')
	}
}
const stateHeader = computed(() => {
	return HeadMap[OrderDetail.value.state]
})

const onBack = () => {
	router.go(-1)
}
const formatTime_1 = ref('00:00')
const countDownTime = ref(0)
const timer11 = ref<NodeJS.Timeout | null>(null) //匹配中或提现超时的定时器
//是不是匹配中或提现超时
const isMatching = computed(() => {
	return [11, 12].includes(OrderDetail.value.state)
})
watch(
	() => OrderDetail.value,
	(newList) => {
		setTime(newList)
	},{
		immediate:true
	}
)
function setTime(data: any) {
	if (!isMatching.value) {
		return false
	}
	const startTime = data.auditEndTime.replace(/-/g, '/')
	const endTime = data.serviceTime.replace(/-/g, '/')
	countDownTime.value = new Date(endTime).getTime() - new Date(startTime).getTime()
	clearInterval(timer11.value as NodeJS.Timeout)
	startTimer()
}
const formatDuration = (duration: number) => {
	const hours = Math.floor(duration / 3600000)
	const minutes = Math.floor((duration - hours * 3600000) / 60000)
	const seconds = Math.floor((duration - hours * 3600000 - minutes * 60000) / 1000)
	console.log('hours', hours)
	return `${hours ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
}
const min10 = ref(5)
function startTimer() {
	timer11.value = setInterval(() => {
		min10.value--
		countDownTime.value += 1000 // 每次+1秒
		formatTime_1.value = formatDuration(countDownTime.value) // 格式化时间
		if (min10.value == 0) {
			getOrderDetail(OrderDetail.value.orderNo)
			min10.value = 5
		}
	}, 1000)
}
const getOrderDetail = async (orderNo: string) => {
	const res = await AwaitApiResult(GetC2CWithdrawOrderDetail({ orderNo }))
	if (res) {
		if (res.data.state == 2) {
			clearInterval(timer11.value as NodeJS.Timeout)
		}
		OrderDetail.value = res.data
	}
}

//继续匹配
async function onContinue() {
	const res = await AwaitApiResult(C2CWithdrawRematch({ orderNo: OrderDetail.value.orderNo }))
	if (res) {
		getOrderDetail(OrderDetail.value.orderNo)
	}
}

function toCancelW() {
	router.push({
		name: 'Withdraw-c2cCancelWithdrawal',
		query: {
			orderAmount: OrderDetail.value.orderAmount,
			sellerAccountNo: OrderDetail.value.sellerAccountNo,
			createTime: OrderDetail.value.createTime,
			orderNo: OrderDetail.value.orderNo
		}
	})
}

onBeforeUnmount(() => {
	clearInterval(timer11.value as NodeJS.Timeout)
})

</script>
<style lang="scss" scoped>
.c2cDetail__CO {
	height: 100vh;
	overflow: auto;

	> div {
		padding: 0 24px;
	}

	.top {
		background: url('@/assets/icons/wallet/withdraw/c2c/bg11.png') center bottom,
			linear-gradient(180deg, #fb5c5b 0%, #ffcfba 100%);
		background-size: contain, 100% auto;
		background-repeat: no-repeat;
		padding-bottom: 100px;
		min-height: 1100px;

		.head {
			color: #fff;

			.tip1,
			.tip2 {
				min-height: 30px;
				font-weight: 400;
				font-size: 26px;
				line-height: 30px;
				text-align: center;

				span {
					font-size: 30px;
					font-weight: 700;
					margin-left: 10px;
				}

				& + div {
					margin-top: 20px;
				}
			}

			.tip1 {
				font-weight: 500;
				font-size: 36px;
			}
		}
		.container {
			min-height: 600px;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.time,
		.time2 {
			margin: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 20px;
			border-radius: 50%;
			text-align: center;
			box-shadow: 0px 20px 40px
				rgba(
					$color: (
						#ff3434
					),
					$alpha: 0.5
				);

			> p {
				color: var(--text_color_L2);
				font-size: 30px;
			}

			> div {
				color: var(--main-color);
				font-size: 80px;
				font-weight: 500;
			}
		}
		.time {
			width: 395px;
			height: 395px;
			border: 28px solid #ffcfba;
			background-color: #fff;

			animation: changeSize 1s ease-in-out infinite;
			position: relative;
			&::before {
				content: '';
				display: block;
				position: absolute;
				width: calc(100% + 160px);
				height: calc(100% + 160px);
				box-shadow: inset 0px 0px 60px #fff;
				left: 50%;
				top: 50%;
				border-radius: 50%;
				opacity: 1;
				transform: translateX(-50%) translateY(-50%);
				animation: boxshow 1s ease-in-out infinite;
			}
		}
		.time2 {
			width: 450px;
			height: 450px;
			border: 28px solid #F1F1F1;
			color: #fff;;
			font-size: 48px;
			font-weight: 700;
			background-image: linear-gradient(180deg, #B4B4B4 0%, #DEDEDE 100%);
		}

		.operate {
			display: flex;
			justify-content: space-between;
			gap: 20px;
			margin-top: 50px;

			> div {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: var(--text_color_L1);
				font-weight: 500;
				gap: 20px;
				width: 50%;
			}

			.uAmount,
			.CancelW {
				&::before {
					content: '';
					width: 80px;
					height: 80px;
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
			}

			.uAmount {
				&::before {
					background-image: url('@/assets/icons/wallet/withdraw/c2c/uAmount.png');
				}
			}

			.CancelW {
				&::before {
					background-image: url('@/assets/icons/wallet/withdraw/c2c/CancelW.png');
				}
			}
		}
	}

	.order {
		background: var(--bg_color_L2);
		border-radius: 10px;
		padding: 30px 20px 80px;
		font-size: 26px;
		width: 95%;
		margin: -50px auto 50px;

		& > div {
			display: flex;
			justify-content: space-between;
			color: var(--text_color_L2);

			& + div {
				margin-top: 30px;
			}
		}

		&-q {
			.y {
				color: var(--norm_secondary-color);
			}

			.b {
				color: var(--text_color_L2);
			}
		}

		&-id {
			background-image: url('@/assets/icons/wallet/withdraw/c2c/copy-icon.png');
			background-repeat: no-repeat;
			background-size: 32px;
			background-position: right center;
			padding-right: 40px;
			color: var(--text_color_L2);
			font-size: 24px;
		}

		.line {
			height: 42px;
			background-image: url('@/assets/icons/wallet/withdraw/c2c/upiline.png');
			background-size: cover;
			background-repeat: no-repeat;
			background-position: top;
			background-color: #F6F6F6;
			width: calc(100% + 28px);
			position: relative;
			left: -14px;

			&::after,
			&::before {
				content: '';
				position: absolute;
				width: 42px;
				height: 42px;
				background-color: #F6F6F6;
				border-radius: 50%;
				top: 0;
			}

			&::before {
				left: -21px;
			}

			&::after {
				right: -21px;
			}
		}

		.tip {
			background-image: url('@/assets/icons/wallet/hint.png');
			background-repeat: no-repeat;
			background-size: 32px;
			background-position: left top;
			padding-left: 40px;
			color: var(--main-color);
			font-size: 22px;
			line-height: 35px;
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
			//padding: 200px;
			//width: 622px;
			height: 480px;
		}
	}

	.van-dialog {
		&__content {
			img {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);

				&:last-of-type {
					bottom: -48px;
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
				margin-bottom: 14.4px;
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
		}
	}
}
/* 定义动画的关键帧 */
@keyframes changeSize {
	0% {
		width: 395px;
		height: 395px;
	}
	50% {
		width: 450px;
		height: 450px;
	}
	100% {
		width: 395px;
		height: 395px;
	}
}
/* 定义动画的关键帧 */
@keyframes boxshow {
	0% {
		width: calc(100% + 90px);
		height: calc(100% + 90px);
		opacity: 1;
	}
	70% {
		width: calc(100% + 230px);
		height: calc(100% + 230px);
		opacity: 0;
	}
	100% {
		width: calc(100% + 90px);
		height: calc(100% + 90px);
		opacity: 0;
	}
}
</style>
