<template>
	<div class="wC4Id" :class="{ noUpi: !withdrawalslist.length }" @click="goPath(acitveUpi.bid)" v-if="[4, 23, 24].includes(withdrawType)">
		<template v-if="withdrawalslist.length">
			<div class="title" :class="`${acitveUpi.walletName}`">{{ acitveUpi.walletName }}</div>
			<div class="name">{{ acitveUpi.mobileNO }}</div>
			<van-icon name="arrow" class="right-icon" size="12" />
		</template>
		<template v-else>{{ $t('addto') }} </template>
	</div>
	<div class="wC4Id rnsData" :class="{ noUpi: !withdrawalslist.length }" @click="goPath(rnsData.bid)" v-else>
		<template v-if="withdrawalslist.length">
			<div class="title">{{ rnsData.bankName }}</div>
			<div class="name">{{ rnsData.mobileNo }}</div>
		</template>
		<template v-else>{{ $t('addto') }} </template>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()

const props = defineProps({
	withdrawalslist: {
		type: Array,
		default: () => []
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

const acitveUpi = <any>computed(() => {
	return (
		props.withdrawalslist.find((item: any) => {
			return item.bid == props.bid
		}) || {}
	)
})

const rnsData = <any>computed(() => {
	return (
		props.withdrawalslist.length > 0 ?props.withdrawalslist[0] : {}
	)
})

const goPath = (bid: any) => {
	if (props.withdrawType === 22) {
		if (!props.bid) {
			router.replace({ name: 'Withdraw-AddRsnPay', query: { Type4name: props.name } })
		}
		
	} else {
		if([23,24].includes(props.withdrawType) && props.withdrawalslist.length) return;
		router.replace({ name: 'Withdraw-Type4', query: { bid, fromV: route.name as string, Type4name: props.name, withdrawType: props.withdrawType } })
	}
	
}

onMounted(() => {})
</script>

<style style lang="scss" scoped>
.wC4Id {
	height: 160px;
	background: var(--darkBg,var(--bg_color_L2));
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 36px 20px;
	text-align: left;
	position: relative;
	margin-bottom: 25px;
	&.rnsData{
		display: flex;
		padding: 20px 20px;
		.title{
			height: 124px;	
			background-position: center top;
			padding-top: 70px;
			background-size: 60px auto;
			padding-left: 0;
			border-right: 1px solid var(--Dividing-line_color);
			margin-right: 20px;
			padding-right: 20px;
		}
		.name {
			height: 90px;
			line-height: 90px;
		}
	}

	&.noUpi {
		display: block;
		background-image: url('@/assets/icons/wallet/withdraw/add.png');
		background-size: 88px;
		background-repeat: no-repeat;
		background-position: center 18px;
		color: var(--text_color_L3);
		text-align: center;
		padding: 110px 0 0 0;
	}

	.title {
		height: 40px;
		line-height: 40px;
		padding-left: 52px;
		font-size: 28px;
		color: var(--darkTextW,var(--text_color_L1));
		background-size: 40px;
		background-repeat: no-repeat;
		background-position: left center;
		background-image: url('@icon/wallet/withdrawType/4.png');
		// &.KBZPay {
		// 	background-image: url('@/assets/icons/wallet/withdraw/withdrawType/KBZpay.png');
		// }
		// &.WavePay {
		// 	background-image: url('@/assets/icons/wallet/withdraw/withdrawType/WavePay.png');
		// }
	}

	.name {
		height: 36px;
		line-height: 36px;
		color: var(--text_color_L2);
		font-size: 26px;
		margin-top: 16px;
	}

	.right-icon {
		position: absolute;
		right: 36px;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
