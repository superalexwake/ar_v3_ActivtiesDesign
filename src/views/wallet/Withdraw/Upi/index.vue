<template>
	<div class="upi_C">
		<NavBar :title="$t('paymentMethod')" left-arrow @click-left="onBack" />
		<div class="upi_C-list">
			<template v-if="upiList.length">
				<div v-for="(item, index) in upiList" :key="index" class="upi_C-item">
					<div class="header">
						<div class="header-title">
							<svg-icon :name="item.bankCode"></svg-icon>
							<span>{{ capitalize(item.bankCode) }}</span>
						</div>
					</div>
					<div class="upi-body">
						<div class="upi-body-name">{{ $t('accountName') }}: {{ item.upiName }}</div>
						<div class="upi-body-id">UPI ID: {{ item.upiAccount }}</div>
						<div class="upi-select" @click="activeUpiClick(item)">
							<div class="select-btn" :class="{ isSelect: item.bid == selectUpi }"></div>
							<span>{{ item.bid == selectUpi ? $t('currentPayment') : $t('currentChange') }}</span>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<Empty>
					<template #text>
						<span>{{ $t('noPaymentMethodsYet') }}</span>
					</template>
				</Empty>
			</template>
		</div>
		<div class="upi_C-addbtn" v-throttle-click="{ handler: AddUPI, wait: 1000 }">{{ $t('upiAddPaymentMethod') }}</div>
	</div>
</template>
<script setup lang="ts">
import { GetWithdrawals } from '@/api'
import { AwaitApiResult, capitalize } from '@/utils'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Empty from '@/components/Empty/index.vue'
const router = useRouter()
const route = useRoute()
const upiList = ref<any[]>([]) // 收款方式列表
const selectUpi = ref<any>(null) // 选中的upi
const onBack = () => {
	const hasSelectUpi = upiList.value.find((item) => {
		return item.bid == selectUpi.value
	})
	const bid = hasSelectUpi ? selectUpi.value : 0
	router.replace({
		name: 'Withdraw',
		query: {
			bid,
			type: 2,
		}
	})
}
const loading = ref(false)
/**
 * @description: 请求数据
 * @return {*}
 */
const onLoad = async () => {
	const res = await AwaitApiResult(GetWithdrawals({ withdrawid: 2 }))
	if (res) {
		const list = res.data?.withdrawalslist || []
		upiList.value = list
	}
}
const activeUpiClick = (item: any) => {
	router.replace({
		name: 'Withdraw',
		query: {
			bid: item.bid,
			type: 2,
		}
	})
}
/**
 * @description: 查询是否有绑定银行卡，未绑定银行卡则跳转绑定银行卡页面
 * @return {*}
 */
const AddUPI = async () => {
	router.replace({
		name: 'Withdraw-AddUpi',
		query: {
			bid: selectUpi.value
		}
	})
}

onMounted(() => {
	selectUpi.value = route.query.bid || 0
	onLoad()
})
</script>
<style lang="scss" scoped>
.upi_C {
	padding: 0 24px 100px 24px;
	height: 100vh;
	position: relative;
	overflow: hidden;
	&-list {
		overflow: auto;
		height: 100%;
		padding-bottom: 70px;
		padding-top: 20px;
	}
	&-item {
		height: fit-content;
		border-radius: 20px;
		background-color: var(--bg_color_L2);
		overflow: hidden;

		.header {
			height: 68px;
			line-height: 68px;
			position: relative;
			background: linear-gradient(101deg, #2184dc 1.06%, #0242cf 99.4%);
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #fff;
			padding: 0 20px;
			svg {
				font-size: 40px;
				margin-right: 10px;
			}
			&-title {
				font-weight: 700;
				font-size: 32px;
			}
		}
		.select-btn {
			width: 40px;
			height: 40px;
			border: 1px solid var(--text_color_L2);
			border-radius: 50%;

			&.isSelect {
				background-image: url('@icon/wallet/selectupi.png');
				background-size: 40px;
				background-repeat: no-repeat;
				background-position: center;
				border: 0;
			}
		}
		.upi-body {
			padding: 30px 20px 30px 20px;

			.upi-body-name {
				height: 32px;
				line-height: 32px;
				font-size: 26px;
				color: var(--text_color_L2);
			}
			.upi-select {
				margin-top: 10px;
				display: flex;
				align-items: center;
				color: var(--text_color_L2);
				span {
					margin-left: 20px;
				}
			}
			.upi-body-id {
				height: 36px;
				line-height: 36px;
				font-size: 26px;
				color: var(--text_color_L2);
				margin-top: 20px;
			}
		}

		& + div {
			margin-top: 20px;
		}
	}

	&-addbtn {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 70px;
		line-height: 70px;
		width: 100%;
		font-weight: 700;
		font-size: 30px;
		background: var(--main-color);
		color: var(--text_color_L4);
		text-align: center;
	}
}
</style>