<template>
	<van-action-sheet :show="store.rechangeUpiShow" @click-overlay="handleClose">
		<div class="actionSheet__content">
			<img src="@public/wallet/recharge/coin.png" alt="" class="unit_logo" />
			<div class="recharge_amount">{{ currency((store.amount as number) * store.currentPayType.c2cUnitAmount) }}</div>
			<div class="text1">{{ $t('rechageAmount') }}</div>
			<div class="text2">
				<img src="@icon/wallet/tip.png" alt="" />
				<span>{{ $t('c2cRechargeUpiSheet1') }}</span>
			</div>

			<div class="recharge_box" v-if="store.C2CQuickList.length">
				<div class="title">{{ $t('c2cRechargeUpiSheet2') }}</div>
				<div class="recharge_num">
					<div
						class="money_item"
						v-for="(item, index) in store.C2CQuickList"
						:key="item.id"
						@click="handleClick(item, index)"
					>
						<div class="amount">{{ currency(item.amount) }}</div>
						<div class="gift">
							{{ $t('award') }} <span>₹ {{ item.c2CRechargeAwardAmount }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="text3" v-if="store.C2CQuickList.length">{{ $t('c2cRechargeUpiSheet3') }}</div>
			<div class="text4">
				{{ $t('c2cRechargeUpiSheet4')
				}}<span>{{ currency((store.amount as number) * store.currentPayType.c2cUnitAmount) }}</span>
			</div>

			<div class="btn" @click="handleContainerRecharge">
				{{ $t('c2cRechargeUpiSheet4') }}
				<span> {{ currency((store.amount as number) * store.currentPayType.c2cUnitAmount) }}</span>
			</div>
		</div>
	</van-action-sheet>
</template>
<script lang="ts" setup>
import { useRecharge } from '@/hooks/useRecharge'
import type { SuggessList } from '@/types/api'
import { currency } from '@/utils'
import { onMounted } from 'vue'

const { store, C2CRecharge, otherRecharge } = useRecharge()

const handleContainerRecharge = () => {
	otherRecharge()
}

const handleClick = (item: SuggessList, index: number) => {
	store.amount = store.C2CQuickList[index].amount / store.currentPayType.c2cUnitAmount
	C2CRecharge()
}

onMounted(() => {
	// getAmountList(100)
})

const handleClose = () => {
	store.rechangeUpiShow = false
}
</script>
<style lang="scss" scoped>
.actionSheet__content {
	padding: 32px 24px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.unit_logo {
		width: 110px;
		height: 110px;
		margin-bottom: 30px;
	}

	.recharge_amount {
		color: var(--main-color);
		font-weight: 500;
		font-size: 48px;
		line-height: 36px;
		margin-bottom: 24px;
	}

	.text1 {
		font-size: 24px;
		color: var(--text_color_L2);
		margin-bottom: 20px;
	}

	.text2 {
		display: flex;
		align-items: center;
		margin-bottom: 56px;

		img {
			width: 30px;
			height: 30px;
			margin-right: 13px;
		}

		span {
			font-size: 24px;
			line-height: 36px;
			color: var(--main-color);
		}
	}

	.recharge_box {
		width: 100%;

		.title {
			text-align: left;
			font-size: 28px;
			line-height: 34px;
			color: var(--text_color_L1);
			margin-bottom: 20px;
			// text-indent: 16px;
			position: relative;
		}

		.title::before {
			content: '';
			display: inline-block;
			width: 8px;
			height: 26px;
			background: var(--main-color);
			margin-right: 12px;
			vertical-align: middle;
		}

		.recharge_num {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 20px;
			margin-bottom: 34px;

			.money_item {
				width: 220px;
				height: 110px;
				border: 1px solid var(--text_color_L2);
				border-radius: 10px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.amount {
					font-size: 32px;
					color: var(--text_color_L1);
					margin-bottom: 6px;
				}

				.gift {
					font-size: 24px;
					color: var(--text_color_L2);

					span {
						color: var(--colorText-26);
					}
				}
			}

			.money_item_active {
				background: var(--main_gradient-color);
				box-shadow: var(--BoxShadowColor-9), inset 0px -4px 10px 2px #fff0ec;

				.amount {
					color: #fff;
				}

				.gift {
					color: #fff;

					span {
						color: #fff;
					}
				}
			}
		}
	}

	.text3,
	.text4 {
		width: 100%;
		font-size: 24px;
		text-align: left;
		color: var(--text_color_L2);
		margin-bottom: 16px;

		span {
			color: var(--main-color);
		}
	}

	.text4 {
		margin-bottom: 50px;
	}

	.btn {
		width: 100%;
		height: 88px;
		line-height: 88px;
		border: 1px solid var(--main-color);
		border-radius: 120px;
		font-size: 32px;
		color: var(--main-color);
		display: flex;
		justify-content: center;
		align-items: center;

		span {
			font-size: 32px;
			color: var(--main-color);
			font-weight: bold;
		}
	}
}
</style>
