<template>
	<div class="pay_state_step">
		<div class="item" :class="{appeal: type ===  2}" v-for="(item, index) in setpList" :key="index">
			<img :src="item.img" alt="" />
			<span>{{ item.title }}</span>
		</div>
	</div>
</template>
<script lang="ts" setup>

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import setup1Icon from '@public/wallet/recharge/setup1.png'
import setup2Icon from '@public/wallet/recharge/setup2.png'
import setup2ActiveIcon from '@public/wallet/recharge/setup2_active.png'
import setup3Icon from '@public/wallet/recharge/setup3.png'
import setup3ActiveIcon from '@public/wallet/recharge/setup3_active.png'
import setup4Icon from '@public/wallet/recharge/setup4.png'
import setup4ActiveIcon from '@public/wallet/recharge/setup4_active.png'
import appealStateIcon from '@public/wallet/recharge/appeal_state.png'

const { t } = useI18n()

const props = defineProps({
	state: {
		type: Number,
		default: 1
	},
	type: {
		type: Number,
		default: 1
	}
})

const setpList = computed(() => {
	if (props.type === 1) {
		return [
			{
				img: setup1Icon,
				title: t('transfer')
			},
			{
				img: props.state >= 2 ? setup2ActiveIcon : setup2Icon,
				title: t('uploadproof')
			},
			{
				img: props.state >= 3 ? setup3ActiveIcon : setup3Icon,
				title: t('waitConfirm')
			},
			{
				img: props.state === 4 ? setup4ActiveIcon : setup4Icon,
				title: t('completed')
			}
		]
	} else {
		return [
			{
				img: appealStateIcon,
				title: t('c2cTip32')
			},
			{
				img: props.state >= 3 ? setup3ActiveIcon : setup3Icon,
				title: t('amountError2')
			},
			{
				img: props.state === 4 ? setup4ActiveIcon : setup4Icon,
				title: t('completed')
			}
		]
	}
})
</script>
<style lang="scss" scoped>
.pay_state_step {
	display: flex;
	justify-content: space-between;
	.item {
		width: 130px;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		img {
			width: 50px;
			height: 50px;
			margin-bottom: 14px;
		}
		span {
			font-size: 22px;
			color: var(--text_color_L1);
			white-space: wrap;
			text-align: center;
		}
	}
	.item::after {
		content: '';
		display: block;
		width: 90px;
		height: 1px;
		background: var(--text_color_L2);
		position: absolute;
		top: 25px;
		right: -60%;
	}
	.appeal {
		width: 140px;
	}
	.appeal::after  {
		width: 122%;
		right: -110%;
	}
	.item:last-child {
		&::after {
			width: 0;
		}
	}
}
</style>
