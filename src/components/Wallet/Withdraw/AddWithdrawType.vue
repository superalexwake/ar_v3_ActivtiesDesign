<template>
	<div v-if="canAdd" class="addWithdrawType">
		<div class="addWithdrawType-top" @click="onAddBankCard">
			<img src="@public/wallet/withdraw/add.png" />
			<span>{{ hintText || hintStr }}</span>
		</div>
		<div class="addWithdrawType-text" v-if="isShowhintTextO">{{ hintTextO || payStr }}</div>
	</div>
	<div v-else class="canNotAdd" @click="gotoServer">
		<svg-icon name="customer_b" class="forgetbg"/>
		{{ $t('contactServicer') + $t('titleAddUSDTAddr') }}
	</div>
</template>
<script setup lang="ts">
import { useWalletStore } from '@/stores'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter,useRoute } from 'vue-router'
import { useServer } from '@/hooks/useServe.hook'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const walletStore = useWalletStore()
const hintStr = t('addAddr')
let payStr = t('paymentMethodRequired')
const { getSelfCustomerServiceLink } = useServer({ServerType: 2})

const canAdd = computed(() => {
	if ([3, 10].includes(props.type) && walletStore.getADDUSTD == 0) {
		return false
	}
	return true
})
const gotoServer = () => {
	getSelfCustomerServiceLink('addUSTD')
	// router.push({ name: 'CustomerService' })
}
const props = withDefaults(
	defineProps<{
		isShowhintTextO?: boolean
		hintTextO?: string
		type?: any
	}>(),
	{
		isShowhintTextO: false,
		hintTextO: '',
		type: ''
	}
)

function onAddBankCard() {
	const map: any = {
		1: 'Withdraw-AddBankCard',
		2: 'Withdraw-AddUpi',
		3: 'Withdraw-AddUSDT',
		4: 'Withdraw-AddType4',//没用到
		5: 'Withdraw-AddPIX',
		6: 'Withdraw-AddWave',
		8: 'Withdraw-AddKbz',
		10: 'Withdraw-AddUSDT',
	}
	router.replace({
		name: map[props.type],
		query: {
			fromV: route.name as string
		}
	})
}

const hintText = computed(() => {
	const map: any = {
		1: t('titleAddBankCard'),
		2: t('addUpi'),
		3: t('addAddr'),
		4:t('addWallet'),
		5: t('upiAddPaymentMethod'),
		6: t('addWaveType'),
		8: t('upiAddPaymentMethod'),
		10: t('addAddr')
	}
	return map[props.type]
})
</script>

<style lang="scss" scoped>
.addWithdrawType {
	&-top {
		background: var(--darkBg,var(--bg_color_L2));
		border-radius: 10px;
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		//padding-top: 20px;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 20px;

		img {
			width: 88px;
			height: 88px;
		}

		span {
			color: var(--text_color_L3);
			font-size: 28px;
		}
	}

	&-text {
		color: var(--norm_red-color);
		font-weight: 400;
		font-size: 22px;
		margin-bottom: 20px;
	}
}
.canNotAdd {
	height: 200px;
	background-color: var(--darkBg,var(--bg_color_L2));
	margin-bottom: 20px;
	font-size: 28px;
	color: var(--text_color_L3);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
	text-align: center;
	border-radius: 20px;
	padding-top: 33px;
	.forgetbg {
		width: 80px;
		height: 80px;
	}
}
</style>
