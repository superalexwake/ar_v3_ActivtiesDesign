<template>
	<div class="Wallet__C">
		<div class="Wallet__C-balance">
			<div class="Wallet__C-balance-l1">
				<div v-throttle-click="{ handler: getWinsUserAmount, wait: 2000 }">{{ currency(Amount) }}</div>
			</div>
			<div class="Wallet__C-balance-l2">
				<svg-icon name="lottyWallet"></svg-icon>
				<div>{{ $t('walletBalance') }}</div>
			</div>
			<div class="Wallet__C-balance-l3">
				<div @click="goPath('Withdraw')">{{ $t('withdraw') }}</div>
				<div @click="goPath('Recharge')">{{ $t('recharge') }}</div>
			</div>
		</div>	
	</div>
</template>

<script setup lang="ts">
import { AwaitApiResult, currency } from '@/utils'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { GetBalance } from '@/api'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import type { WinGo } from '@/types/api'
const { t } = useI18n()
// 钱包金额
const Amount = ref(0)
/**
 * @description:
 * @param {*} isShowT
 * @return {*}
 */
const getWinsUserAmount = async (isShowT: boolean = true) => {
	const res = await AwaitApiResult<ObjResNull<WinGo.resGetWinsUserAmount>>(GetBalance())
	if (res) {
		Amount.value = res?.data.amount || 0
		isShowT && showToast(t('refreshSuccess'))
	}
}
// 路由
const router = useRouter()
// 跳转路由
const goPath = (name: string) => {
	router.push({ name })
}
onMounted(() => {
	getWinsUserAmount(false)
})
defineExpose({
	getWinsUserAmount
})
</script>
<style lang="scss" scoped>
.Wallet__C {
	padding: 36px 26px 0 26px;
	position: relative;

	&::before {
		content: '';
		display: block;
		width: 100%;
		height: 575px;
		background: var(--light-main_gradient-color,var(--bg_color_L2));
		border-radius: 0 0 115px 115px;
		position: absolute;
		
		z-index: 0;
		top: 0;
		left: 0;
		html:lang(ar) &{
			left: unset;
			right: 0;
		}
	}

	&-balance {
		min-height: 268px;
		background-color: var(--bg_color_L3);
		background-image: url('@icon/home/walletbg.png');
		background-repeat: no-repeat;
		background-size: contain;
		border-radius: 40px;
		padding: 35px 41px 30px 41px;
		position: relative;
		z-index: 0;

		&-l1 {
			min-height: 44px;
			line-height: 44px;
			text-align: center;
			font-weight: 700;
			font-size: 36px;
			color: var(--darkTextW,var(--text_color_L1));
			overflow: hidden;

			& > div {
				position: relative;
				word-break: break-all;
				pointer-events: none;
				width: fit-content;
				margin: auto;

				&::after {
					
					content: '';
					display: block;
					position: absolute;
					right: -100px;
					top: 0;
					width: 36px;
					height: 36px;
					background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/refireshIcon.png');
					background-position: center;
					background-repeat: no-repeat;
					background-size: 36px;
					pointer-events: auto;
				}
			}
		}

		&-l2 {
			height: 40px;
			display: flex;
			justify-content: center;
			margin-top: 14px;
			font-size: 26px;
			color: var(--text_color_L1);
			& > svg {
				width: 40px;
				height: 40px;
				margin-right: 10px;
			}
		}

		&-l3 {
			display: flex;
			justify-content: space-between;
			margin-top: 35px;

			& > div {
				width: 260px;
				height: 70px;
				line-height: 70px;
				background: var(--norm_red-color);
				border-radius: 40px;
				font-weight: 600;
				font-size: 30px;
				color: #fff;
				
				text-align: center;

				& + div {
					background: var(--norm_green-color);
				}
			}
		}
	}
}
</style>
