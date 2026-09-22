<template>
	<div class="card-panel">
		<HoldingCard
			v-for="holding in holdingOrders"
			:key="holding.orderNo"
			:holding="holding"
			:total-days="totalDays"
			:card-type="cardType"
			:server-time="serverTime"
			:submitting="submitting"
			@claim="emit('claim', $event)"
			@expire="emit('expire')"
		/>

		<div class="panel-title">{{ t('periodCardPick', 'Choose a tier · Buy now') }}</div>

		<div class="tier-card" v-for="tier in tiers" :key="tier.tierId">
			<div class="tier-face"></div>
			<img class="tier-gift" src="@/assets/icons/activity/DailyTask/period_card_gift.png" alt="" />

			<div class="tier-badge">
				<img class="badge-coin" src="@/assets/icons/activity/DailyTask/period_card_coin.png" alt="" />
				<div class="badge-price">{{ money(tier.sellPrice) }}</div>
			</div>

			<div class="tier-benefit realtime">
				{{ t('periodCardInstant', 'Instant cashback') }}
				<b>{{ money(tier.realtimeRewardAmount) }}</b>
			</div>
			<div class="tier-benefit daily">
				{{ t('periodCardDaily', 'Daily') }}
				<b>{{ money(tier.dailyRewardAmount) }}</b>
				× {{ totalDays }} {{ t('days') }}
			</div>

			<div class="tier-buy" :class="{ disabled: isTierDisabled(tier) }" @click="onBuy(tier)">
				<div class="buy-main">{{ tierBuyText(tier) }}</div>
				<div class="buy-origin" v-if="tier.originalPrice">
					{{ t('periodCardOrigin', 'Original') }} {{ money(tier.originalPrice) }}
				</div>
			</div>
		</div>

		<div class="panel-empty" v-if="!tiers.length">
			{{ t('periodCardNoTier', 'No tiers available in this category') }}
		</div>

		<van-dialog v-model:show="showConfirm" :show-confirm-button="false" className="noOverHidden">
			<div class="buy-dialog" v-if="pendingTier">
				<div class="dlg-hero"></div>
				<div class="dlg-title">{{ cardTitle }} {{ money(pendingTier.sellPrice) }}</div>
				<div class="dlg-line">
					{{ t('periodCardConfirmInstant') }}
					<b>{{ money(pendingTier.realtimeRewardAmount) }}</b>
				</div>
				<div class="dlg-line">
					{{ t('periodCardConfirmDaily') }}
					<b>{{ money(pendingTier.dailyRewardAmount) }}</b>
					× {{ totalDays }} {{ t('days') }}
				</div>
				<div class="dlg-total">{{ t('periodCardTotalReward') }}: <b>{{ money(totalReward) }}</b></div>
				<div class="dlg-warn">{{ t('periodCardExpireWarn') }}</div>
				<div class="dlg-btns">
					<div class="dlg-btn cancel" @click="showConfirm = false">{{ t('cancel') }}</div>
					<div class="dlg-btn ok" @click="onConfirmBuy">{{ t('periodCardConfirmBuy') }}</div>
				</div>
				<div class="dlg-close" @click="showConfirm = false">
					<img src="@public/activity/DailyTask/close.png" />
				</div>
			</div>
		</van-dialog>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HoldingCard from './HoldingCard.vue'
import { currencyTrim as money } from '@/utils'

const props = defineProps({
	tiers: { type: Array as () => any[], default: () => [] },
	holdingOrders: { type: Array as () => any[], default: () => [] },
	totalDays: { type: Number, default: 7 },
	// 1 周卡 / 2 月卡;透传给 HoldingCard 决定天数格标签样式
	cardType: { type: Number, default: 1 },
	serverTime: { type: String, default: '' },
	submitting: { type: Boolean, default: false },
	disabledTierIds: { type: Array as () => number[], default: () => [] }
})
const emit = defineEmits<{ buy: [tier: any]; claim: [holding: any]; expire: [] }>()

const { t } = useI18n()

const showConfirm = ref(false)
const pendingTier = ref<any>(null)

const cardTitle = computed(() => t(props.totalDays === 7 ? 'periodCardBuyWeekTitle' : 'periodCardBuyMonthTitle'))

const totalReward = computed(() => {
	const tier = pendingTier.value
	if (!tier) return 0
	return tier.totalRewardAmount ?? Number(tier.realtimeRewardAmount) + Number(tier.dailyRewardAmount) * props.totalDays
})

const isTierDisabled = (tier: any) =>
	props.disabledTierIds.includes(tier.tierId) || tier.soldOut || tier.todaySoldOut

// 无货是终态、今日售罄明天会恢复,两者同真时报终态更贴合玩家决策
// 持卡中是整排档位置灰的原因,不写出来玩家只会看到一排灰掉的「立即购买」
const tierBuyText = (tier: any) =>
	tier.soldOut ? t('periodCardSoldOut')
		: props.disabledTierIds.includes(tier.tierId) ? t('ongoing')
			: tier.todaySoldOut ? t('periodCardSoldOutTitle')
				: `${t('periodCardBuy')} ${money(tier.sellPrice)}`

const onBuy = (tier: any) => {
	if (isTierDisabled(tier)) return
	pendingTier.value = tier
	showConfirm.value = true
}

const onConfirmBuy = () => {
	showConfirm.value = false
	emit('buy', pendingTier.value)
}
</script>

<style lang="scss" scoped>
// 主色打底才能跟换肤;红站还原原稿 #ff867a→#f95959
$buy-tint: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%);

.card-panel {
	.panel-title {
		display: flex;
		align-items: center;
		margin-bottom: 24px;
		font-size: 30px;
		font-weight: 600;
		color: var(--text_color_L1);

		&::before {
			content: '';
			width: 6px;
			height: 30px;
			margin-right: 14px;
			border-radius: 3px;
			background: var(--main-color);
		}
	}

	// 以下 .tier-* 的百分比与比例取自设计稿 702×283 坐标系
	.tier-card {
		position: relative;
		z-index: 0; // 兜住下面三层的负层级,否则它们穿到卡片外
		width: 100%;
		aspect-ratio: 702/283;
		margin-bottom: 24px;

		// 叠白必须等值:渐变式叠白会与主题深浅走向相消,框退回纯色(红站 #FB9B9B→#FFC2BB)
		&::before {
			content: '';
			position: absolute;
			z-index: -3;
			left: 0;
			right: 0;
			bottom: 0;
			height: 83.04%;
			border-radius: 20px;
			background-color: var(--main-color);
			background-image: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), var(--main_gradient-color);
		}
	}

	// 异形靠 mask 取形,颜色必须由 background-color 供给才能跟主题
	.tier-face {
		position: absolute;
		z-index: -1; // 外框 -3 < 礼盒 -2 < 卡面 -1 < 内容,三层都须显式声明
		left: 1.85%;
		top: 8.62%;
		width: 96.3%;
		height: 86.93%;
		background-color: var(--bg_color_L2);
		mask: url('@/assets/icons/activity/DailyTask/period_card_face.svg') no-repeat;
		mask-size: 100% 100%;
	}

	.tier-gift {
		position: absolute;
		z-index: -2;
		left: 7.61%;
		top: 0;
		width: 20.48%;
		// 必须 drop-shadow:box-shadow 沿 img 矩形边框走,透明 PNG 会露出方框
		filter: drop-shadow(0 0 5px var(--main-color)) drop-shadow(0 0 12px var(--main-color));
	}

	.tier-badge {
		position: absolute;
		left: 3.85%;
		top: 38.83%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 19.8%;
		height: 51.94%;
		border-radius: 20px;
		background: rgba(197, 200, 205, 0.2);

		.badge-coin {
			width: 56.12%; // 78/139,金币切图原始宽占徽章比例
			margin-bottom: 12px;
		}
		.badge-price {
			font-size: 22px;
			line-height: 28px;
			font-weight: 600;
			white-space: nowrap;
			color: var(--main-color);
		}
	}

	.tier-benefit {
		position: absolute;
		left: 23.65%;
		width: 76.35%;
		text-align: center;
		color: var(--text_color_L1);

		b {
			font-weight: 700;
			color: var(--main-color);
		}

		&.realtime {
			top: 27.52%;
			font-size: 30px;
			// 两行 top 差仅 46px,放任 normal 行高会贴到下一行
			line-height: 34px;
		}
		&.daily {
			top: 43.77%;
			font-size: 22px;
		}
	}

	.tier-buy {
		position: absolute;
		left: 26.5%;
		right: 4.56%;
		top: 61.44%;
		bottom: 11%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 80px;
		// 设计稿「立即购买」按钮不分进行中/已售罄/可买,统一这一种深棕色
		// (量出来正好等于黑 60% 叠主色 + 原有顶部高光,之前这层只用在 disabled 态、可买态是纯主色红,
		// 现在两者合一,状态只靠按钮文案区分,不再靠颜色区分)
		background-color: var(--main-color);
		background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), $buy-tint;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.18);
		color: var(--text_color_L2);

		// 只锁购买动作:整卡发灰会读成活动已下架;颜色已统一,disabled 态只保留不可点
		&.disabled {
			pointer-events: none;
		}

		// 26/6/28 三段与设计稿按钮内容区 60 高咬合
		.buy-main {
			font-size: 24px;
			line-height: 26px;
			font-weight: 700;
		}
		.buy-origin {
			font-size: 20px;
			line-height: 28px;
			text-decoration: line-through;
			color: inherit;
		}
	}

	.panel-empty {
		padding: 60px 0;
		text-align: center;
		font-size: 26px;
		color: var(--text_color_L3);
	}
}

// 关闭钮悬在弹窗外沿,需放开 van-dialog 默认的 overflow:hidden
:deep() .van-dialog.noOverHidden {
	overflow: inherit;
	border-radius: 20px;
}

.buy-dialog {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100px 40px 48px;
	// 行框贴紧字号:默认 normal 在中文下约 1.4 倍,四行累计撑高 51px,弹窗就收不到设计稿的 556
	line-height: 1;
	// 折行后盒子撑满,align-items 就管不到盒内文字
	text-align: center;

	// 走背景图而非 <img>:本仓 svg 经模板 src 引入会被当组件解析,拿到 [object Object]
	.dlg-hero {
		position: absolute;
		left: 50%;
		top: -95px;
		transform: translateX(-50%);
		width: 280px;
		height: 180px;
		background-image: url('@/assets/icons/activity/DailyTask/period_card_hero.svg');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	// 以下字号与间距按设计稿实测值,勿凭观感改动
	.dlg-title {
		margin-bottom: 26px;
		font-size: 36px;
		font-weight: 400;
		color: var(--text_color_L1);
	}
	.dlg-line {
		margin-bottom: 26px;
		font-size: 24px;
		color: var(--text_color_L2);

		b {
			font-weight: 400;
			color: var(--main-color);
		}
		// 不能用 :last-of-type:它按标签匹配,会被后面同为 div 的 .dlg-btns / .dlg-close 抢走
		& + .dlg-line {
			margin-bottom: 26px;
		}
	}
	.dlg-total {
		margin-bottom: 26px;
		font-size: 36px;
		font-weight: 400;
		color:  var(--norm_red-color);

		b {
			font-weight: inherit; // b 默认 700,不继承会比标签细一档
			color: var(--main-color);
		}
	}
	.dlg-warn {
		margin-bottom: 32px;
		font-size: 22px;
		line-height: 34px;
		color: var(--text_color_L3);
	}
	.dlg-btns {
		display: flex;
		gap: 24px;
		width: 100%;
	}
	.dlg-btn {
		flex: 1;
		// 长语种文案必折行,line-height 撑高只容得下一行
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 76px;
		line-height: 1.25;
		text-align: center;
		border-radius: 76px;
		font-size: 28px;
		font-weight: 500;

		// 设计稿的取消键是灰紫填充,bg_color_L3 压在白弹窗上几乎看不出是个按钮
		&.cancel {
			background: var(--button_dis_color);
			color: var(--text_color_L1);
		}
		// 设计稿是均匀红,主渐变横向左红右粉会让按钮右半发浅
		&.ok {
			background-color: var(--main-color);
			background-image: $buy-tint;
			color: #fff;
			text-shadow: 0 4px 2px rgba(0, 0, 0, 0.25);
		}
	}
	// 脱流悬在弹窗外沿下方:留在流内会把弹窗撑高 70px,吃掉设计稿的 556
	.dlg-close {
		position: absolute;
		left: 50%;
		bottom: -82px;
		transform: translateX(-50%);

		img {
			width: 60px;
			height: 60px;
		}
	}
}
</style>
