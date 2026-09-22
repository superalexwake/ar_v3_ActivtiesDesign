<template>
	<!-- 实际到账（点击展开订单明细）：手续费、奖金、VIP奖励、优惠券彩金任一有值才展示 -->
	<div class="order-detail" v-if="hasDetail" @click.stop="expanded = !expanded">
		<div class="order-detail__head">
			<span>{{ $t('actualCredit') }}</span>
			<span class="order-detail__toggle">
				<span class="order-detail__credit">{{ currency(actualCredit) }}</span>
				<van-icon :name="expanded ? 'arrow-up' : 'arrow-down'" />
			</span>
		</div>
		<div class="order-detail__body" v-if="expanded">
			<div class="order-detail__row">
				<span class="order-detail__label label--pay">{{ $t('youpay') }}</span>
				<span class="order-detail__track"></span>
				<span class="order-detail__val">{{ currency(item.paidAmount) }}</span>
			</div>
			<div class="order-detail__row" v-if="bonusAmount > 0">
				<span class="order-detail__label label--reward">{{ $t('bonus') }}</span>
				<span class="order-detail__track"></span>
				<span class="order-detail__val green">+{{ currency(bonusAmount) }}</span>
			</div>
			<div class="order-detail__row" v-if="Number(item.vipBonusAmount) > 0">
				<span class="order-detail__label label--reward">{{ $t('code8133') }}</span>
				<span class="order-detail__track"></span>
				<span class="order-detail__val green">+{{ currency(item.vipBonusAmount) }}</span>
			</div>
			<div class="order-detail__row" v-if="couponBonusAmount > 0">
				<span class="order-detail__label label--reward">{{ $t('couponRechargeName') }}</span>
				<span class="order-detail__track"></span>
				<span class="order-detail__val green">+{{ currency(couponBonusAmount) }}</span>
			</div>
			<div class="order-detail__row" v-if="Number(item.serviceFee) > 0">
				<span class="order-detail__label label--fee">{{ $t('fee') }}</span>
				<span class="order-detail__track"></span>
				<span class="order-detail__val red">−{{ currency(item.serviceFee) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { currency } from '@/utils'

const props = defineProps<{ item: any }>()

const expanded = ref(false)

// 奖金 = 通道奖励 + 充值等级奖励 + 快捷金额奖励（三笔合并展示为一行）
const bonusAmount = computed(
	() =>
		(Number(props.item?.channelBonusAmount) || 0) +
		(Number(props.item?.rechargeLevelBonusAmount) || 0) +
		(Number(props.item?.quickBonusAmount) || 0)
)

const couponBonusAmount = computed(() => Number(props.item?.couponBonusAmount) || 0)

// 实际上分优先取后端订单实际总上分金额：付款上分+充值奖励+充值等级+vip等级+返利券；
// 旧接口未下发该字段时回退为按明细自算「实付+奖金+VIP+券−手续费」
const actualCredit = computed(() =>
	props.item?.orderTotalActualAmount == null
		? (Number(props.item?.paidAmount) || 0) +
		  bonusAmount.value +
		  (Number(props.item?.vipBonusAmount) || 0) +
		  couponBonusAmount.value -
		  (Number(props.item?.serviceFee) || 0)
		: Number(props.item.orderTotalActualAmount) || 0
)

const hasFeeConfig = computed(() => props.item?.serviceFee !== undefined)

const hasDetail = computed(
	() =>
		hasFeeConfig.value &&
		(Number(props.item?.serviceFee) > 0 ||
			bonusAmount.value > 0 ||
			Number(props.item?.vipBonusAmount) > 0 ||
			couponBonusAmount.value > 0)
)
</script>

<style lang="scss" scoped>
.order-detail {
	padding: 20px;
	margin-bottom: 22px;
	background: var(--bg_color_L1, #f5f6ff);
	border-radius: 12px;
	cursor: pointer;

	&__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26px;
		color: var(--text_color_L2);
	}

	&__toggle {
		display: inline-flex;
		align-items: center;
		gap: 8px;

		.van-icon {
			color: var(--text_color_L3);
			font-size: 24px;
		}
	}

	// 实际到账合计：绿色
	&__credit {
		color: var(--norm_green-color, #2aab79);
		font-weight: 600;
	}

	&__body {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
		margin-top: 10px;
		padding-top: 12px;
		border-top: 1px solid var(--bg_color_L3, #ededed);
	}

	&__row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 8px 0;
	}

	&__label {
		flex: none;
		min-width: 200px;
		padding: 10px 20px;
		border-radius: 40px;
		font-size: 22px;
		text-align: left;

		&.label--pay {
			color: var(--text_color_L2, #303a4c);
		}

		&.label--reward {
			color: var(--main-color, #f74747);
		}

		&.label--fee {
			color: var(--norm_red-color, #fb5b5b);
		}
	}

	// 中间滑轨 + 右端圆点
	&__track {
		flex: 1;
		height: 2px;
		background: var(--bg_color_L3, #ededed);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: var(--bg_color_L3, #ededed);
		}
	}

	&__val {
		flex: none;
		color: var(--text_color_L2, #303a4c);
		font-size: 24px;

		&.green {
			color: var(--norm_green-color, #2aab79);
			font-weight: 600;
		}

		&.red {
			color: var(--norm_red-color, #fb5b5b);
			font-weight: 600;
		}
	}
}
</style>
