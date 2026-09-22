<template>
	<div class="balanceAssets">
		<div class="balanceAssets__header">
			<div class="balanceAssets__header__left">
				<img src="@icon/wallet/balance.png" />
				<!-- 可用余额 -->
				{{ $t('vailableBalance') }}
			</div>
		</div>
		<div class="balanceAssets__main">
			<p>{{ currency(data.amount) }}</p>
			<img src="@public/wallet/recharge/refresh.png" alt="" @click="GetWithdrawalsV" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCommonStore, useWalletStore } from '@/stores'
import { currency, AwaitApiResult } from '@/utils'
import type { withdrawalsruleList, ReqNewSetWithdrawal } from '@/types/api'
import {  RecoverBalance } from '@/api'
import { computed, toRef,onMounted } from 'vue'
import {showSuccessToast} from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const walletStore = useWalletStore();
const { setLoading } = useCommonStore()
const props = withDefaults(
	defineProps<{
		data_NewSetWithdrawal: ReqNewSetWithdrawal //提现参数
		withdrawalsrule: withdrawalsruleList //当前提现方式下的提现规则
	}>(),
	{}
)
const data = toRef(props, 'withdrawalsrule')
//重新获取可用余额
async function GetWithdrawalsV() {
	setLoading(true)
	const res = await AwaitApiResult(RecoverBalance())
	if (res) {
		data.value.amount = res.data.amount
		showSuccessToast(t('refreshSuccess'))
	}
	setLoading(false)
}
onMounted(async () => {
	const res = await AwaitApiResult(RecoverBalance())
	if (res) {
		data.value.amount = res.data.amount
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
	background-position: center;
	border-radius: 20px;
	color: var(--text_color_L4);
	padding: 29px 25px 0 25px;
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
		margin: 16px 28px 28px 0;
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
