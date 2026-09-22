<template>
	<!-- 充值详情：仅在已选择/输入金额时显示 -->
	<div v-if="rechargeAmount > 0" class="recharge-detail">
		<!-- 优惠券选择面板 -->
		<RechargeCouponPanel />
		<!-- 头部：实际上分（红色尖角标签 + 红色总额，浅紫底） -->
		<div class="recharge-detail__head">
			<span class="recharge-detail__head-tag">{{ $t('actualCredit') }}</span>
			<span class="recharge-detail__head-value">{{ currency(actualCredit) }}</span>
		</div>
		<!-- 明细 -->
		<div class="recharge-detail__body">
			<div class="recharge-detail__row">
				<span class="recharge-detail__row-label recharge-detail__row-label--pay">{{ $t('youpay') }}</span>
				<span class="recharge-detail__row-track"></span>
				<span class="recharge-detail__row-value">{{ currency(rechargeAmount) }}</span>
			</div>
			<div class="recharge-detail__row" v-if="bonusAmount > 0">
				<span class="recharge-detail__row-label recharge-detail__row-label--reward">{{ $t('bonus') }}</span>
				<span class="recharge-detail__row-track"></span>
				<span class="recharge-detail__row-value reward">+{{ currency(bonusAmount) }}</span>
			</div>
			<div class="recharge-detail__row" v-if="vipRewardAmount > 0">
				<span class="recharge-detail__row-label recharge-detail__row-label--reward">{{ $t('code8133') }}</span>
				<span class="recharge-detail__row-track"></span>
				<span class="recharge-detail__row-value reward">+{{ currency(vipRewardAmount) }}</span>
			</div>
			<!-- 优惠券彩金：VIP 奖励下方、手续费上方；标题「优惠券彩金」专用文案待审批，暂用券名 key 占位 -->
			<div class="recharge-detail__row" v-if="couponBonus > 0">
				<span class="recharge-detail__row-label recharge-detail__row-label--reward">{{ $t('couponRechargeName') }}</span>
				<span class="recharge-detail__row-track"></span>
				<span class="recharge-detail__row-value reward">+{{ currency(couponBonus) }}</span>
			</div>
			<div class="recharge-detail__row" v-if="handlingFee > 0">
				<span class="recharge-detail__row-label recharge-detail__row-label--fee">{{ $t('fee') }}</span>
				<span class="recharge-detail__row-track"></span>
				<span class="recharge-detail__row-value fee">−{{ currency(handlingFee) }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRecharge } from '@/hooks/useRecharge'
import { estimateCouponBonus } from '@/hooks/useCoupon.hook'
import { currency } from '@/utils'
import RechargeCouponPanel from './RechargeCouponPanel.vue'

// 充值金额（法币口径，普通渠道用 amount / 数字货币用 numberExchangeRate）统一取自 hook
const { store, rechargeDetailAmount: rechargeAmount } = useRecharge()

// 当前充值大类（maxRechargeRifts/vipRechargeRate 在此，未在类型声明用 any 取）
const category = computed<any>(() => store.rechargeType[store.currentMenu] || {})

// 渠道优惠 = 充值金额 × 当前渠道优惠费率 newRechargeRiftRate（取当前选中渠道，非大类统一值）
const rewardAmount = computed(() => rechargeAmount.value * (Number((store.currentPayType as any)?.newRechargeRiftRate) || 0))

// VIP奖励 = 充值金额 × VIP加成费率 vipRechargeRate（大类"4%"）
const vipRewardAmount = computed(() => rechargeAmount.value * (Number(category.value.vipRechargeRate) || 0))

// 快捷充值奖金 = 当前选中快捷档位的固定赠送 giftAmount（法币，仅选中预设档位时有，手输金额无）
const quickGiftAmount = computed(() =>
	store.currentQuickIndex >= 0 ? Number((store.quickList[store.currentQuickIndex] as any)?.giftAmount) || 0 : 0
)

// 充值等级奖金 = 充值金额 × 等级赠送比例 giftRatio，上限 maxBonusAmount（取当前选中渠道的 userRechargeLevelGift）
const levelGiftAmount = computed(() => {
	const levelGift = store.currentPayType?.userRechargeLevelGift
	if (!levelGift) return 0
	const ratio = Number(levelGift.giftRatio) || 0
	const maxBonus = Number(levelGift.maxBonusAmount) || 0
	return Math.min(rechargeAmount.value * ratio, maxBonus)
})

// 奖金 = 充值等级 + 渠道优惠 + 快捷档位赠送（三笔合并展示为一行）
const bonusAmount = computed(() => levelGiftAmount.value + rewardAmount.value + quickGiftAmount.value)

// 手续费 = 充值金额 × 手续费率 serviceFeeRate
// 注意：serviceFeeRate 在当前充值渠道 currentPayType（rechargetypelist）上，不在大类 rechargeType 上
const handlingFee = computed(() => rechargeAmount.value * (Number(store.currentPayType?.serviceFeeRate) || 0))

// TODO(核销上线对齐)：BonusMergeMode 互斥(取高/优先券)的真实结算以后端为准，此处暂按叠加展示
const couponBonus = computed(() =>
	store.selectedCoupon ? estimateCouponBonus(store.selectedCoupon, rechargeAmount.value) : 0
)

// 实际上分 = 充值金额 + 奖金 + VIP奖励 + 优惠券彩金 − 手续费
const actualCredit = computed(
	() => rechargeAmount.value + bonusAmount.value + vipRewardAmount.value + couponBonus.value - handlingFee.value
)
</script>

<style lang="scss" scoped>
.recharge-detail {
	background: var(--bg_color_L2, #fff);
	border-radius: 20px;
	margin: 20px 0;

	// 头部：浅底药丸（两端椭圆）+ 红色斜边标签 + 总额
	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 68px;
		background: var(--bg_color_L1, #f5f6ff);
		border-radius: 34px; // 两端椭圆（药丸）
		overflow: hidden;
		padding-right: 24px;

		&-tag {
			height: 100%;
			display: flex;
			align-items: center;
			padding: 0 48px 0 30px; // 右侧多留出斜边空间
			background: var(--main_gradient-color, linear-gradient(90deg, #fe6868 15.38%, #ff8e8a 98.73%));
			color: #fff;
			font-weight: 600;
			font-size: 28px;
			// 右侧单斜边，露出后面的浅底
			clip-path: polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%);
		}

		// 实际到账合计：绿色
		&-value {
			color: var(--norm_green-color, #2aab79);
			font-weight: 700;
			font-size: 30px;
		}
	}

	&__body {
		padding-top: 8px;
	}

	&__row {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 14px 0;

		// 左侧胶囊标签
		&-label {
			flex: none;
			min-width: 230px;
			padding: 12px 22px;
			border-radius: 53px;
			font-size: 24px;
			text-align: left;

			// You pay：中性浅紫底 + 深色字
			&--pay {
				background: var(--bg_color_L1, #f5f6ff);
				color: var(--text_color_L2, #303a4c);
			}

			// 奖励类：主题底 + 主题红字
			&--reward {
				background: var(--bg_color_L3);
				color: var(--main-color, #f74747);
			}

			// 手续费：主题底 + 红字
			&--fee {
				background: var(--bg_color_L3);
				color: var(--norm_red-color, #fb5b5b);
			}
		}

		// 中间滑轨 + 右端圆点
		&-track {
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
				width: 14px;
				height: 14px;
				border-radius: 50%;
				background: var(--bg_color_L3, #ededed);
			}
		}

		&-value {
			flex: none;
			color: var(--text_color_L2, #303a4c); // You pay：与其标签同色、常规字重
			font-size: 26px;
			font-weight: 400;

			// 奖励类数值：绿色
			&.reward {
				color: var(--norm_green-color, #2aab79);
				font-weight: 600;
			}

			// 手续费数值：红
			&.fee {
				color: var(--norm_red-color, #fb5b5b);
				font-weight: 600;
			}
		}
	}
}
</style>
