<template>
	<div class="container">
		<div class="amount">{{ promotion.children_Lv_RebateAmount_Yesterday }}</div>
		<div class="amount_txt">{{ $t('heroYesterdaytotalCommission') }}</div>
		<div class="tip">{{ $t('heroUpgradeLevel') }}</div>
		<div class="info_content">
			<div class="info">
				<div class="head">
					
					{{ $t('heroDirectSub') }}</div>

				<div class="line1 r">
					<div>{{ promotion.children_Lv_1_Count_Add_Yesterday }}</div>
					{{ $t('registernum') }}
				</div>
				<div class="line2 r">
					<div>{{ promotion.children_Lv_1_RechargesSumCount }}</div>
					{{ $t('rechargeNumber') }}
				</div>
				<div class="line3 r">
					<div>{{ promotion.children_Lv_1_RechargesSumAmount }}</div>
					{{ $t('rechageAmount') }}
				</div>
				<div class="line1 r">
					<div>{{ promotion?.children_Lv_1_FirstRechargesCount }}</div>
					{{ $t('firstRechargesC') }}
				</div>
			</div>
			<div class="info" >
				<div class="head">
					{{ $t('heroTeamSub') }}</div>
				<div class="line1">
					<div>{{ promotion.children_Lv_Count_X_Add_Yesterday }}</div>
					{{ $t('registernum') }}
				</div>
				<div class="line2">
					<div>{{ promotion.children_Lv_RechargesSumCount }}</div>
					{{ $t('rechargeNumber') }}
				</div>
				<div class="line3">
					<div>{{ promotion.children_Lv_RechargesSumAmount }}</div>
					{{ $t('rechageAmount') }}
				</div>
				<div class="line1">
					<div>{{ promotion?.children_Lv_FirstRechargesCount }}</div>
					{{ $t('firstRechargesC') }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PromotionData } from '@/types/api'

withDefaults(
	defineProps<{
		promotion: PromotionData
	}>(),
	{}
)
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: auto;
	padding-top: 45px;
	background-image: url('@/assets/icons/promotion/promotionbg.png'),var(--main_gradient-color);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover, 100% 100%;
	&::after {
		content: '';
		display: block;
		width: 100%;
		height: 140px;
		position: absolute;
		background-color: var(--bg_color_L1);
		bottom: -2px;
		z-index: 1;
	}

	.amount {
		font-weight: 500;
		font-size: 48px;
		line-height: 48px;
		color: var(--text_color_L4);
		margin-bottom: 16px;
	}

	.amount_txt {
		height: 48px;
		min-width: 256px;
		background: var(--bg_color_L2);
		color: var(--main-color);
		border-radius: 50px;
		line-height: 48px;
		text-align: center;
		font-size: 26px;
		margin-bottom: 10px;
		white-space: nowrap;
		padding: 0 25px;
	}

	.tip {
		font-size: 22px;
		margin-bottom: 20px;
		color: var(--text_color_L4)
	}

	.info_content {
		display: flex;
		width: 700px;
		min-height: 380px;
		background-color: var(--darkBg,var(--bg_color_L2));
		border-radius: 20px;
		overflow: hidden;
		justify-content: space-between;
		position: relative;
		z-index: 10;
		.info {
			flex: 1;
			padding-bottom: 15px;
			.head {
				height: 80px;
				line-height: 80px;
				background-color: var(--sheet_nva_color);
				color: #fff;
				font-size: 26px;
				text-align: center;
				// background-image: url('@icon/promotion/u1.png');
				// background-size: 48px;
				margin-bottom: 15px;;
				background-repeat: no-repeat;
				background-position: 20px center;
				&.u2 {
					border-left:2px solid  var(--darkBg,var(--bg_color_L2)) ;
				}
				svg{
					width: 48px;
					height: 48px;
					
				}
			}
			.line1,
			.line2,
			.line3 {
				color: var(--text_color_L1);
				font-size: 22px;
				text-align: center;
				padding-top: 15px;
				& > div {
					font-size: 28px;
				}
				&.r {
					border-right: 1px solid var(--bg_color_L3);
				}
			}
			.line1 {
				& > div {
					color: var(--text_color_L1);
				}
			}
			.line2 {
				& > div {
					color: var(--norm_green-color);
				}
			}
			.line3 {
				& > div {
					color: var(--norm_secondary-color);
				}
			}
		}
	}
}
</style>
