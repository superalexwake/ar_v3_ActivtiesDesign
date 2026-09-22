<template>
	<div class="arCard">
		<div class="left">
			<img :src="currentType?.withBeforeImgUrl" />
			<div>
				<div class="tip" v-if="rsnInfo?.walletActivationStatus === 0">{{ $t('rnsNoActive') }}</div>
				<template v-else>
					<div class="tit">
						{{ $t('RSNTip') }}
					</div>
					<div class="wallet_amount"><em>{{ $t('balance') }}:</em>{{ rsnInfo?.balance || 0 }} <em>rsn</em>
					</div>
				</template>
			</div>
		</div>
		<div class="right" @click="handleWallet">{{ rsnInfo.walletActivationStatus === 0 ? $t('RNSActive') :
			$t('comminWallet') }}</div>
	</div>
</template>

<script setup lang="ts">
import { useArwallet } from '@/hooks'
import { onMounted } from 'vue';
const { goActive, goWallet } = useArwallet()
const props = defineProps({
	withdrawalslist: {
		type: Array,
		default: () => []
	},
	currentType: {
		type: Object,
		default: { withBeforeImgUrl: '' }
	},
	rsnInfo: {
		type: Object,
		default: {
			balance: 0,
			walletActivationStatus: 0,
			walletAddress: ''
		}
	},
	bid: {
		default: -0
	},
	withdrawType: {
		default: 4
	},
	name: {
		default: ''
	}
})
const emits = defineEmits<{
	(e: 'getRnsTypeInfo'): void
}>()

const handleWallet = () => {
	if (props.rsnInfo.walletActivationStatus === 0) {
		goActive('wallet/recharge', 'RSN')
	} else {
		goWallet('wallet/recharge', 'RSN')
	}
}
onMounted(() => {
	// console.log('RSN======================')
	emits('getRnsTypeInfo')
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/withdraw';

.wallet_amount {
	color: var(--text_color_L1);
	font-size: 28px;
	font-weight: 700;
	vertical-align: bottom;

	em {
		color: var(--text_color_L1);
		font-size: 24px;
		font-weight: normal;
	}
}
</style>
