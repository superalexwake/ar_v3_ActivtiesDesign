<template>
	<div class="type4_C">
		<NavBar :title="Type4name + $t('paymentMethod')" left-arrow @click-left="onBack" />
		<div class="type4_C-list">
			<template v-if="upiList.length">
				<div v-for="(item, index) in upiList" :key="index" class="type4_C-item">
					<div class="header" :class="`${item.walletName}`">
						<div class="header-title">{{ item.bankName }}</div>
						<div
							class="select-btn"
							:class="{ isSelect: item.bid == selectUpi }"
							@click="activeUpiClick(item.bid)"
						>
							<svg v-if="item.bid == selectUpi" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M60 30C60 46.5686 46.5686 60 30 60C13.4314 60 0 46.5686 0 30C0 13.4314 13.4314 0 30 0C46.5686 0 60 13.4314 60 30ZM14.4 34.2149L19.3014 29.0266C20.9353 30.363 24.2029 33.2714 27.4705 37.2807C27.5276 37.3507 27.7006 36.9707 28.0345 36.2374C29.4965 33.0269 34.0423 23.0442 45.4425 14.4053C45.5467 14.3263 45.5229 15.1444 45.4865 16.397C45.4534 17.5342 45.41 19.0295 45.4425 20.5367C45.5024 23.3195 45.9093 26.1966 45.9093 26.1966C45.9093 26.1966 39.374 27.8474 28.1707 46.0063C28.1442 46.0494 27.8296 45.6959 27.2806 45.0789C25.2645 42.8134 20.0868 36.9951 14.4 34.2149Z" fill="var(--main-color)"/>
							</svg>
						</div>
					</div>
					<div class="type4-body">
						<div class="type4-body-id">{{ item.mobileNo }}</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="noData" v-throttle-click="{ handler: AddUPI, wait: 1000 }">{{ $t('upiAddPaymentMethod') }}</div>
			</template>
		</div>
	</div>
</template>
<script setup lang="ts">
import { GetWithdrawals } from '@/api'
import { AwaitApiResult } from '@/utils'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const Type4name = router.currentRoute.value.query.Type4name as string
const upiList = ref<any[]>([]) // 收款方式列表
const selectUpi = ref<any>(null) // 选中的upi
const onBack = () => {
	const hasSelectUpi = upiList.value.find((item) => {
		item.bid == selectUpi.value
	})
	const bid = hasSelectUpi ? selectUpi.value : 0
	router.replace({ name: 'Withdraw', query: { bid, type: 22 } })
}

const activeUpiClick = (bid: any) => {
	router.replace({ name: 'Withdraw', query: { bid, type: 22 } })
}
/**
 * @description: 查询是否有绑定银行卡，未绑定银行卡则跳转绑定银行卡页面
 * @return {*}
 */
const AddUPI = async () => {
	router.replace({ name: 'Withdraw-AddRsnPay', query: { Type4name: Type4name } })
}

/**
 * @description: 请求数据
 * @return {*}
 */
const onLoad = async () => {
	const res = await AwaitApiResult(GetWithdrawals({ withdrawid: 22 }))
	if (res) {
		upiList.value = res.data?.withdrawalslist || []
	}
}

onMounted(() => {
	selectUpi.value = route.query.bid || 0
	onLoad()
})
</script>
<style lang="scss" scoped>
.type4_C {
	padding: 0 24px 100px 24px;
	height: 100vh;
	position: relative;

	&-item {
		height: fit-content;
		border-radius: 10px;
		background-color: var(--darkBg,var(--bg_color_L2));
		padding: 20px 14px 44px 14px;

		.header {
			height: 68px;
			line-height: 68px;
			position: relative;
			padding-inline-start: 86px;
			background-image: url('@icon/wallet/withdrawType/4.png');
			background-size: 60px;
			background-repeat: no-repeat;
			background-position: 8px center;
			padding-bottom: 8px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&-title {
				font-weight: 700;
				font-size: 32px;
				color: var(--text_color_L1);
			}

			.select-btn {
				width: 60px;
				height: 60px;
				border: 1px solid var(--text_color_L2);
				border-radius: 50%;
				svg {
					width: 60px;
					height: 60px;
				}
				&.isSelect {
					border: 0;
				}
			}

			&::after {
				content: '';
				display: block;
				width: calc(100% - 48px);
				height: 0;
				position: absolute;
				right: 0;
				bottom: 0;
				border-bottom: 1px solid var(--Dividing-line_color);
			}
		}

		.type4-body {
			padding: 34px 8px 20px 8px;

			.type4-body-name {
				height: 32px;
				line-height: 32px;
				font-size: 26px;
				color: var(--text_color_L2);

				& + div {
					margin-top: 30px;
				}
			}

			.type4-body-id {
				height: 36px;
				line-height: 36px;
				font-size: 26px;
				color: var(--text_color_L2);
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
		color: var(--textW);
		text-align: center;
	}

	&-list {
		overflow-y: auto;
		height: calc(100% - 80px);
		scrollbar-width: none;
		-ms-overflow-style: none;
		padding-top: 20px;
		&::-webkit-scrollbar {
			width: 0px;
			background: transparent;
		}

		.noData {
			background-image: url('@/assets/icons/wallet/withdraw/add.png');
			background-position: center top;
			background-size: 88px;
			background-repeat: no-repeat;
			padding: 100px 0 20px 0;
			color: var(--text_color_L3);
			text-align: center;
			background-color: var(--darkBg,var(--bg_color_L2));
			border-radius: 10px;
		}
	}
}
</style>