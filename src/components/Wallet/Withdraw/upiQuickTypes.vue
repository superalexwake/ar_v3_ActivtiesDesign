<template>
	<div class="quickWay">
		<div class="quickWay-title">
			<svg-icon name="bankCard"></svg-icon>
			<p>{{ $t('paymentMethods') }}</p>
		</div>
		<div class="quickWay-list">
			<div
				v-for="item in bankList"
				class="quickWay-item"
				:class="{ select: bankCode == item.bankCode }"
				@click="onselectWithdrawalType(item)"
				:key="item.bankCode"
			>
				<img :src="item.logoUrl" alt="" />

				<span>{{ item.bankName }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ResWithdrawlist } from '@/types/api'

withDefaults(
	defineProps<{
		bankList: Array<any> //提现参数
		bankCode: string
	}>(),
	{}
)
const emits = defineEmits<{
	(e: 'onSelectWithdrawalType', item: ResWithdrawlist): void
}>()

function onselectWithdrawalType(item: any) {
	emits('onSelectWithdrawalType', item.bankCode)
}
</script>
<style lang="scss" scoped>
.quickWay {
	background: var(--darkBg, var(--bg_color_L2));
	border-radius: 20px;
	padding: 20px;
	margin-bottom: 20px;
	&-title {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 30px;
		margin-bottom: 26px;
		color: var(--darkTextW, var(--text_color_L1));
		.svg-icon,
		img {
			width: 48px;
			height: 48px;
			margin-right: 23px;
		}
	}
	&-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		flex-wrap: wrap;
		gap: 10px;
	}

	&-item {
		border-radius: 10px;
		background: var(--bgDark-2, var(--bg_color_L2));
		width: 100%;
		height: 90px;
		padding: 20px 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--Dividing-line_color);
		img {
			width: 60px;
			font-size: 40px;
			margin-right: 20px;
		}
		&.select {
			background: var(--main-color);
			color: var(--text_color_L4);
			border: none;
			span {
				line-height: 24px;
			}
		}
	}
}
</style>
