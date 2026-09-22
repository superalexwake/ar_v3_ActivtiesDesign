<template>
	<template v-if="apkStore.apk.value != ApkType.FullApk">
		<div v-if="showBonus" class="btn pwa-btn" :class="{ 'btn--raised': isTurntable }" @click="onDown">
			<img class="icon" :src="settingS.getWebIco" />
			<div class="bonus-con">
				<div class="bonus">{{ bonusText }}</div>
				<div class="text">{{ $t('addToDesktop') }}</div>
			</div>
		</div>
		<div v-else class="btn pwa-btn" :class="{ 'btn--raised': isTurntable }" @click="onDown">
			<img class="icon" :src="settingS.getWebIco" />
			<div class="text">{{ $t('addToDesktop') }}</div>
		</div>
	</template>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import { useHome } from '@/hooks'
import { useApkState, ApkType } from '@/stores/apk'
import { computed } from 'vue'
import { currency } from '@/utils'

const apkStore = useApkState()

const { t: $t } = useI18n()
const settingS = SettingStore()
const { onDown } = useHome()

const isTurntable = computed(() => {
	return settingS.getIsOpenInvitedWheel
})
// 显示下载奖励金额
const bonusNum = computed(() => {
	return settingS?.downAppBonusAmount ?? 0
})
const rechargeAmount = computed(() => {
	return settingS?.downAppRechargeAmount ?? 0
})
// 是否显示彩金
const showBonus = computed(() => {
	return settingS.isShowDownAppBonusAmountSwitch && bonusNum.value > 0
})
const formatAmountWithoutCurrency = (amount: number) => {
	return currency(amount, ' ', 0).trim()
}
const bonusText = computed(() => {
	const bonusAmount = currency(bonusNum.value, settingS.getDollarSign || '', 0)

	if (rechargeAmount.value > 0) {
		return $t('downAppRechargeReward', [formatAmountWithoutCurrency(rechargeAmount.value), bonusAmount])
	}

	return $t('getMoney', [bonusAmount])
})
</script>
<style lang="scss" scoped>
.btn {
	position: fixed;
	left: 50%;
	bottom: 180px;
	transform: translateX(-50%);
	width: 368px;
	height: 80px;
	background: var(--downBg, var(--main_gradient-color2));
	border-radius: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	z-index: 2;
	padding: 0 20px;

	&--raised {
		bottom: 236px;
	}

	.icon {
		width: 48px;
		height: 48px;
	}

	.text {
		color: #fff;
		font-size: 24px;
		font-style: normal;
		font-weight: 700;
		line-height: 40px;
		word-wrap: break-word;
		width: fit-content;
		text-align: center;
	}
	.bonus-con {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		flex: 1;
		min-width: 0;
		text-align: center;
		.text {
			font-weight: 500;
			margin-top: 0;
			font-size: 22px;
			line-height: 1;
		}
		.bonus {
			font-size: 22px;
			font-style: normal;
			font-weight: 600;
			color: #fff;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
		}
	}
}
</style>
