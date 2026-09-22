<template>
	<div class="totalSavings__container">
		<div class="totalSavings__container-header">
			<div class="totalSavings__container-header-box ar-1px-b">
				<div class="balance_info">
					<div class="totalSavings__container-header__title">
						<span>{{ $t('totalBalance') }}</span>
					</div>
					<p class="totalSavings__container-header__subtitle">
						<span>{{ currency(money) }}</span>
						<svg-icon name="refreshBalance" v-throttle-click="{ handler: onGetWallet, wait: 3000 }" />
					</p>
				</div>
				<div v-if="isARPay && isTurntable" class="comminWallet" @click="goPath('wallet')">{{ $t('comminWallet') }}</div>
			</div>
		</div>
		<div class="totalSavings__container-content">
			<div v-if="isARPay" @click="handleArWallet" class="totalSavings__container-content-item">
				<div>
					<svg-icon name="wallets" />
					<span>AR{{ $t('wallet') }}</span>
				</div>
			</div>
			<div v-else @click="goPath('wallet')" class="totalSavings__container-content-item">
				<div>
					<svg-icon name="wallets" />
					<span>{{ $t('wallet') }}</span>
				</div>
			</div>
			<div @click="goPath('Recharge')" class="totalSavings__container-content-item">
				<div>
					<svg-icon name="rechargeIcon" />
					<span>{{ $t('recharge') }}</span>
				</div>
			</div>
			<div @click="goPath('Withdraw')" class="totalSavings__container-content-item">
				<div>
					<svg-icon name="widthdrawBlue" />
					<span>{{ $t('withdraw') }}</span>
				</div>
			</div>
			<div @click="goPath('vip')" class="totalSavings__container-content-item">
				<div>
					<svg-icon name="VipIcon" />
					<span>VIP</span>
				</div>
			</div>
		</div>
	</div>
	<!--激活绑定验证-->
	<ActiveVerifyDialog :isVisible="isPop" @onConfirm="confirm" @onCancel="isPop = false" />
</template>

<script setup lang="ts">
import type { UserInfo } from '@/types/api'
import { ARBWalletActivate } from '@/api'
import { currency } from '@/utils'
import { useRouter } from 'vue-router'
import { SettingStore, useWalletStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useArwallet, useGlobalDialog } from '@/hooks'
const { downAppTip } = useGlobalDialog()
const router = useRouter()
const walletStore = useWalletStore()
const setting = SettingStore()
const { t: $t } = useI18n()
const isPop = ref(false)
const props = withDefaults(
	defineProps<{
		userInfo: UserInfo
	}>(),
	{}
)
import { showFailToast, showLoadingToast } from 'vant'
import ActiveVerifyDialog from '@/components/common/ActiveVerify.vue'
const { goWallet, isArWalletActive, goActive, getInfo, activeBind } = useArwallet()

const isTurntable = computed(() => {
	return setting.getIsOpenInvitedWheel
})

const isARPay = ref(false)
const goPath = async (name: string) => {
	if (name == 'Recharge' || name == 'Withdraw') {
		const d = await downAppTip(name)
	} else {
		router.push({
			name
		})
	}
}

/*确认按钮即绑定*/
const confirm = (query: any) => {
	console.log('进来数据', query)
	activeBind(query, 'main')
	isPop.value = false
}

/*去激活验证*/
const goBind = async () => {
	showLoadingToast({
		message: $t('loading') + '...',
		forbidClick: true
	})
	const query = { returnUrl: 'https://' + window.location.host + '/#/main' }
	const res = await ARBWalletActivate(query)
	if (res?.code === 1) {
		if (res?.msgCode === 1010) {
			isPop.value = true
		}
		return showFailToast(res?.msg)
	} else if (res?.code === 0) {
		const { walletActivationPageUrl, memberId, merchantCode, timestamp } = res?.data || {}
		window.location.href =
			walletActivationPageUrl + '&memberId=' + memberId + '&merchantCode=' + merchantCode + '&timestamp=' + timestamp
	}
}

const handleArWallet = async () => {
	if (isARPay.value) {
		await getInfo()
	} else {
		return
	}
	if (isArWalletActive.value) {
		goWallet('main')
	} else {
		// goActive("main");
		goBind()
	}
}

const money = computed(() => walletStore.getAmount)
async function onGetWallet() {
	if (setting.getIsSwitchSaasBalance) {
		walletStore.GetARGameAndPlatWallets(true)
	} else {
		walletStore.resetData(true, true)
	}
	// 参数1，是否弹提示，参数2，是否可以回收余额
}
onMounted(async () => {
	if (setting.getIsSwitchSaasBalance) {
		walletStore.GetARGameAndPlatWallets()
	}
	isARPay.value = sessionStorage.getItem('ar_pay') === '1'
})
</script>

<style lang="scss" scoped>
.totalSavings__container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0;
	width: 100%;
	height: 315px;
	border-radius: 20px;
	background: var(--light-bg_white, var(--bg_color_L3));

	&-content {
		display: flex;
		align-items: center;
		width: 100%;
		padding-block: 26px;
	}

	&-header {
		width: 100%;
		padding: 28px 39px 0 27px;

		&-box {
			padding-bottom: 20px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			/* border-bottom: 1px solid #e6e8e8; */
		}

		&__title {
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;

			span {
				font-weight: 400;
				font-size: 28px;
				color: var(--text_color_L2);
			}

			img {
				width: 40px;
				height: 40px;
			}
		}

		&__subtitle {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			column-gap: 24px;
			width: 100%;
			margin-top: 15px;
			font-size: 36px;
			font-weight: bold;
			color: var(--text_color_L1);

			/* span {
				margin: 0 15px;
			} */

			img {
				width: 38px;
			}
		}
		.comminWallet {
			color: #fff;
			font-size: 28px;
			font-weight: 500;
			padding: 14px 24px;
			background: var(--main-color);
			text-wrap: nowrap;
			border-radius: 60px;
		}
	}

	&-content {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		width: 100%;
		padding: 30px 20px;

		&-item {
			// width: 25%;
			position: relative;
			display: flex;
			justify-content: center;

			div {
				display: flex;
				flex-direction: column;
				align-items: center;

				svg {
					min-width: 60px;
					min-height: 60px;
				}

				span {
					margin: 10px 0;
					font-size: 28px;
					color: var(--text_color_L1);
					text-align: center;
				}
			}
		}
	}
}
</style>
