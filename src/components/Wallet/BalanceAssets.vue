<template>
	<div class="balanceAssets">
		<div class="balanceAssets__header">
			<div class="balanceAssets__header__left">
				<img src="@icon/wallet/balance.png" />
				{{ $t('balance') }}
			</div>
		</div>
		<div class="balanceAssets__main">
			<p>{{ currency(walletStore.getAmount) }}</p>
			<img src="@public/wallet/recharge/refresh.png" alt=""
				 v-throttle-click="{ handler: onGetWallet, wait:3000 }"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { SettingStore, useWalletStore } from '@/stores'
import { currency } from '@/utils'
import { onMounted } from 'vue'
const walletStore = useWalletStore();
const  setting=SettingStore()
async function onGetWallet() {
	if (setting.getIsSwitchSaasBalance){
		walletStore.GetARGameAndPlatWallets(true);
	}else {
		walletStore.resetData(false,false);
	}
	// 参数1，是否弹提示，参数2，是否可以回收余额
}
onMounted(()=>{
	if (setting.getIsSwitchSaasBalance){
		walletStore.GetARGameAndPlatWallets(false);
	}else {
		walletStore.resetData(true,false);
	}
})
</script>

<style lang="scss" scoped>
.balanceAssets {
	width: 100%;
	height: 260px;
	background-image: url('@icon/wallet/TotalAssetsBg.png');
	background-repeat: no-repeat;
	background-size: 100%;
	background-position: top;
	border-radius: 20px;
	color: var(--text_color_L4);
	padding: 24px ;
	position: relative;
	html:lang(ar) &{
		background-image: url('@icon/wallet/ar-TotalAssetsBg.png');
	}
	&__header {
		display: flex;
		justify-content: space-between;
		height: 40px;

		&__left {
			font-weight: 400;
			font-size: 26px;

			img {
				margin-right: 16px;
			}
		}

		&__left {
			display: flex;
			align-items: center;

			img {
				width: 30px;
				height: 30px;
				margin-right: 16px;
			}
		}
	}

	&__main {
		height: 55px;
		display: flex;
		align-items: center;
		margin-top: 10px;
		font-weight: 700;
		font-size: 48px;

		p {
			margin-left: 20px;
		}

		img {
			width: 44px;
			height: 28px;
			margin-left: 18px;
		}
	}

	&__tip {
		img {
			width: 50px;
			height: 32px;
			position: absolute;
			bottom: 26px;
			left: 29px;
			html:lang(ar) &{
				left: unset;
				right: 29px;
			}
		}
	}
}
</style>
