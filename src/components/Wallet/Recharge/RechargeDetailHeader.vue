<template>
	<div class="upi_detail_header" :class="getState?.className">
		<NavBar title="" left-arrow @click-left="onClick" @click-right="handleClickRight">
			<template #right>
				<div v-if="state === 3">{{ $t('concelOrder') }}</div>
			</template>
		</NavBar>
		<div class="info">
			<div class="state_txt">
				{{ getState?.text }}
				<ConutDownTimer
					v-if="info?.state === 1"
					:start-time="info?.endTime"
					:end-time="info?.serviceTime"
					class-name="state_txt"
					:key="info?.id"
				/>
			</div>
			<div class="tip">
				<div>{{ getState?.tip }}</div>
				<div>{{ getState?.tip2 }}</div>
			</div>
		</div>

		<img :src="getState?.icon" class="state_img" alt="" />

		<div class="btn_group">
			<div class="appeal" v-if="getStateValue === 7" @click="() => {
				emit('appeal')
			}">
				<img src="@public/wallet/recharge/detail/appeal.png" alt="">
				{{ $t('appeal') }}</div>
			<div class="appeal_admin" v-if="getStateValue === 3"  @click="() => {
				emit('appealAdmin')
			}">{{ $t('AppealsAdmin') }}</div>
			<div
				class="cancel"
				@click="() => {
					emit('onClickRight')
				}"
				v-if="getStateValue === 7 || getStateValue === 3 || getStateValue === 1"
			>
				<img src="@public/common/close.png" alt="">
				{{ $t('concelOrder') }}
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import router from '@/router'

import { computed, ref, watch } from 'vue'
import ConutDownTimer from '@/components/Wallet/Recharge/CountDownTimer.vue'
import { useI18n } from 'vue-i18n'
import waitIcon from '@public/wallet/recharge/wait.png'
import successIcon from '@public/wallet/recharge/success.png'
import failIcon from '@public/wallet/recharge/fail.png'
import timeoutIcon from '@public/wallet/recharge/timeout.png'
import cancelIcon from '@public/wallet/recharge/cancel.png'
import appealIcon from '@public/wallet/recharge/appeal.png'
import amountErrorIcon from '@public/wallet/recharge/amount_error.png'
const { t } = useI18n()

const props = withDefaults(
	defineProps<{
		state: number
		info: any,
	}>(),
	{}
)

const emit = defineEmits(['onClickRight', 'appeal', 'appealAdmin'])

const getState = computed(() => {
	return state.value.find((item) => item.state === props.state)
})

const getStateValue = computed(() => {
	return state.value.find((item) => item.state === props.state)?.state
})

const state = ref([
	{
		state: 1,
		text: t('rechargeState0'),
		tip: t('rdhTip1'),
		tip2: t('tipPlaWaitPaciently'),
		icon: waitIcon,
		className: 'wait'
	},
	{
		state: 4,
		text: t('completed'),
		tip: t('c2cTip7'),
		tip2: t('c2cTip8'),
		icon: successIcon,
		className: 'success'
	},
	{
		state: 5,
		text: t('rechargeState4'),
		tip: t('rdhTip2'),
		tip2: t('rdhTip3'),
		icon: failIcon,
		className: 'fail'
	},
	{
		state: 7,
		text: t('rechargeState1'),
		tip: t('rdhTip4'),
		tip2: t('rdhTip5'),
		icon: timeoutIcon,
		className: 'timeout'
	},
	{
		state: 6,
		text: t('cancelled'),
		tip: '',
		icon: cancelIcon,
		className: 'cancel'
	},
	{
		state: 3,
		text: t('c2cState3'),
		tip: t('c2cTip5'),
		tip2: t('c2cTip6'),
		icon: appealIcon,
		className: 'appeal'
	},
	{
		state: 8,
		text: t('c2cState14'),
		tip: t('amountError1'),
		tip2: t('c2cTip33'),
		icon: amountErrorIcon,
		className: 'appeal'
	},
])

const handleClickRight = () => {
	emit('onClickRight')
	console.log('handleClickRight')
}

const onClick = () => {
	router.go(-1)
}

watch(
	() => props.info,
	(val) => {
		if (props.state === 6) {
			state.value[4].tip = val?.cancelReason
		}
	},
	{
		immediate: true
	}
)
</script>
<style lang="scss" scoped>
.upi_detail_header {
	position: relative;
	z-index: 1;
	min-height: 384px;
	color: #fff;
	position: relative;
	padding-bottom: 30px;

	::v-deep(.navbar-fixed) {
		background-color: transparent !important;
		position: absolute;

		// .navbar__content-left .van-icon {
		// 	color: #fff;
		// }

		.navbar__content-right {
			font-size: 28px;
		}
	}

	.info {
		padding: 60px 0 28px 24px;
		width: 74%;

		.state_txt {
			font-style: normal;
			font-weight: 700;
			font-size: 36px;
			line-height: 50px;
			margin-bottom: 24px;
		}

		.tip {

			font-weight: 400;
			font-size: 26px;
			line-height: 30px;
		}
	}

	.state_img {
		width: 160px;
		height: 160px;
		position: absolute;
		right: 14px;
		top: 142px;
	}
}

.wait {
	background: var(--main-color);
}

.timeout {
	background: var(--norm_secondary-color);
}

.cancel {
	background: var(--norm_red-color);
}

.appeal {
	background: var(--main-color);
}

.success {
	background: #34be8b;
}

.fail {
	background: var(--main-color);
}

.btn_group {
	width: 100%;
	height: 70px;
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
	align-items: center;
	z-index: 100;
	padding: 0 20px;
	div {
		width: 340px;
		background: transparent !important;
		font-size: 28px;
		color: #fff;
		height: 70px;
		border: 1px solid #fff;
		border-radius: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20px;
	}

	.appeal,
	.appeal_admin {
		border-radius: 80px;
		text-align: center;
		img {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}
	}

	.cancel {
		line-height: 70px;
		font-weight: 400;

		img {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}
	}
}

</style>
