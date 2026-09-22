<template>
	<div class="c2cUpi" :class="{ noUpi: !acitveUpi }" @click="goPath(acitveUpi)">
		<template v-if="acitveUpi">
			<div class="title">
				<svg-icon :name="acitveUpi.bankCode||'upi'"></svg-icon>
				<span>{{ capitalize(acitveUpi.bankCode)||acitveUpi.upiName }}</span></div>
			<div class="name">{{ acitveUpi.upiAccount }}</div>
			<van-icon name="arrow" class="right-icon" size="12" />
		</template>
		<template v-else>{{ $t('addUpi') }} </template>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { capitalize } from '@/utils'
const route = useRoute()
const router = useRouter()

const props = defineProps({
	withdrawalslist: {
		type: Array,
		default: () => []
	},
	withdrawalType:{
		type: Number,
		default: 2
	},
	bid: {
		default: -0
	},
	bankCode: {
		type: String,
		default: ''
	}
})

const acitveUpi = <any>computed(() => {
	return (
		props.withdrawalslist.find((item: any) => {
			return item.bid == props.bid
		})
	)
})
/**
 * @description: 跳转路径 普通upi 和快捷upi
 * @param bid
 */
const goPath = (data: any={}) => {
	const name = props.withdrawalType == 2 ? 'Withdraw-Upi' : 'Withdraw-FastUpi'
	router.replace({ name: name, query: {
			bid:data?.bid||'',
			fromV: route.name as string,
			bankCode: props.bankCode||''
	} })
}
</script>

<style style lang="scss" scoped>
.c2cUpi {
	height: 160px;
	background: var(--bg_color_L2);
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 36px 20px;
	text-align: left;
	position: relative;
	margin-bottom: 25px;

	&.noUpi {
		background-image: url('@/assets/icons/wallet/withdraw/add.png');
		background-size: 88px;
		background-repeat: no-repeat;
		background-position: center 18px;
		color: var(--text_color_L3);
		text-align: center;
		padding: 110px 0 0 0;
	}

	.title {
		display: flex;
		align-items: center;
		height: 40px;
		line-height: 40px;
		font-size: 28px;
		color: var(--text_color_L1);
		svg{
			font-size: 46px;
			margin-right: 10px;
		}
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
