<template>
	<van-popup v-model:show="betDialog" position="bottom" round>
		<div class="betting-container">
			<!-- 头部 -->
			<div class="header">
				<div class="header-left">
					<span class="select-text">{{$t('selectMay')}}</span>
					<span class="first-text">{{ playNumberText }}</span>
					<div v-if="!isNaN(playBet as any)" class="circle-button" :class="'ball_' + playBet"></div>
					<div v-else class="playBet_btn" >{{ playBet }}</div>
				</div>
				<div class="bet-return">
					{{$t('moto7', [currency(betMultiple * amount), currency(betMultiple * amount * playRate)])}}
				</div>
			</div>

			<!-- 分割线 -->
			<div class="divider"></div>

			<!-- 金额 -->
			<div class="section">
				<div class="section-title">{{$t('amount')}}</div>
				<div class="balance-options">
					<div
						v-for="value in betScopes"
						:key="value"
						:class="['balance-button', { active: amount === value }]"
						@click="amount = value"
					>
						{{ value }}
					</div>
				</div>
			</div>

			<!-- 数量 -->
			<div class="section">
				<div class="section-title">{{$t('numbers')}}</div>
				<div class="quantity-control">
					<Stepper v-model.number="betMultiple" :min="1" :step="1" :decimal-length="0" />
				</div>
			</div>

			<!-- 快速选择 -->
			<div class="quick-select">
				<div
					v-for="value in betMultiples"
					:key="value"
					:class="['quick-select-button', { active: betMultiple === value }]"
					@click="betMultiple = value"
				>
					{{ value }}
				</div>
			</div>

			<!-- 协议 -->
			<div class="agreement">
				<div class="agreement_left">
					<button class="checkbox" @click="agreed = !agreed">
						<span v-if="agreed" class="check-icon"></span>
					</button>
					<span class="agree-text">{{$t('agree')}}</span>
					<span class="rules-text" @click.stop="showPreSale = true">{{$t('presaleRules')}}</span>
				</div>

				<div class="user_balance">{{t('balance')}}: <span>{{currency(balance)}}</span></div>
			</div>
		</div>
		<!-- 底部 -->
		<div class="footer">
			<van-button class="cancel-button" @click="onClearBet">{{$t('cancel')}}</van-button >
			<van-button class="total-button" @click="betting" :disabled="!agreed">
				{{ t('totalAmount') }} {{ currency(betMultiple * amount || 0) }}
			</van-button >
		</div>
	</van-popup>
	 <!-- 预售规则弹层 begin-->
	 <van-popup v-model:show="showPreSale" :close-on-click-overlay="false" round>
        <BetRule :title="t('presaleRules')" @close="showPreSale = false">
            {{ $t('betPopTXT') }}
        </BetRule>
    </van-popup>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import { useMotorcycleContext } from '../hooks/useMotorcycle'
import { useGlobalContext, useToast } from '@/saasLottery/hooks'
import { useI18n } from 'vue-i18n'
import { currency } from '@/utils'
import { showToast, Stepper } from 'vant'
import { BetRule } from '@/saasLottery/components'

const { balance } = useGlobalContext()
const agreed = ref(true)
const showPreSale = ref(false)
const message = useToast()
const { t } = useI18n()

const { currentPlayType,betDialog, betMultiples, betMultiple, playRate,amount, onBetting, betScopes, onClearBet, playBet } = useMotorcycleContext()

const playNumberText = computed(() => {
	if (currentPlayType.value.includes('First')) {
		return '1st'
	} else if (currentPlayType.value.includes('Second')) {
		return '2nd'
	} else {
		return '3rd'
	}
})
const betting = () => {
	if (!agreed) {
		showToast({ message: t('common.code_141'), type: 'fail' })
		return
	}
	if (betMultiple.value * amount.value > balance.value) {
		return message.error(t('common.code_142'))
	}
	onBetting()
}
</script>

<style scoped lang="scss">
.betting-container {
	width: 100%;
	margin: 0 auto;
	padding: 24px;
	background: var(--bg_color_L2, #fff);
	:deep( .van-stepper__plus){
		background: var(--bg_color_L3, #fff);
	}
	:deep( .van-stepper__minus){
		background: var(--bg_color_L3, #fff);
	}
	:deep( .van-stepper__input){
		background: var(--bg_color_L3);
		color: var(--text_color_L1);
	}
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 16px;

	.select-text {
		font-size: 36px;
		font-weight: bold;
		color: var(--text_color_L2, #646c7b);
	}

	.first-text {
		font-size: 36px;
		font-weight: bold;
		color: var(--main-color);
	}

	.circle-button {
		width: 64px;
		height: 64px;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}

	$balls: 10;
	@for $i from 1 through $balls {
		.ball_#{$i} {
			background-image: url('../assets/images/ball_#{$i}.png');
		}
	}

  .playBet_btn {
    width: 150px;
    height: 64px;
    border-radius: 10px;
    background: var(--main_gradient-color);
    box-shadow: 0px 2px 0px 0px #BFD6F4;
    position: relative;
    color: var(--text_color_L4, #FFF);
    font-size: 32px;
    font-weight: 500;
    text-align: center;
    line-height: 64px;
  }
  .playBet_btn::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url('../assets/images/btn_bg.png') no-repeat center;
    background-size: 100% 100%;
  }
}

.bet-return {
	text-align: right;
	font-size: 24px;
	color: var(--Secondary_red_color, #fd565c);
	font-weight: 500;
}

.divider {
	height: 1px;
	border-bottom: 1px dashed var(--Dividing_line_color, #e2e2e2);
	margin: 24px 0;
}

.section {
	margin-bottom: 32px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.section-title {
	color: var(--text_color_L1, #04060a);
	font-size: 32px;
	font-weight: 400;
}

.balance-options {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.balance-button {
	width: 120px;
	height: 60px;
	font-size: 28px;
	font-weight: 400;
	border-radius: 10px;
	background: var(--bg_color_L3);
	color: #646c7b;
	border: none;
	margin-right: 16px;
	text-align: center;
	line-height: 60px;
}
.balance-button:last-child {
	margin-right: 0;
}

.balance-button.active {
	background: var(--main-color);
	color: white;
}

.quantity-control {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 8px;
}

.quantity-button {
	width: 56px;
	height: 56px;
	border-radius: 8px;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.minus {
	background-color: var(--bg_color_L1);
}

.plus {
	background-color: var(--main-color);
}

.minus-icon {
	width: 32px;
	height: 4px;
	background-color: #adafb8;
}

.plus-icon {
	position: relative;
	width: 32px;
	height: 4px;
	background-color: white;
}

.plus-icon::after {
	content: '';
	position: absolute;
	width: 4px;
	height: 32px;
	background-color: white;
	top: -14px;
	left: 14px;
}

.quantity-display {
	width: 158px;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30px;
	font-weight: bold;
	border-radius: 10px;
	background: var(--bg_color_L1, #f6f6f6);
}

.quick-select {
	display: flex;
	flex-direction: row;
	justify-content: end;
	margin-bottom: 32px;
}

.quick-select-button {
	width: 76px;
	height: 60px;
	font-size: 28px;
	font-weight: 400;
	border-radius: 10px;
	background: var(--bg_color_L3);
	color: var(--text_color_L2);
	border: none;
	margin-right: 16px;
	text-align: center;
	line-height: 60px;
}
.quick-select-button:last-child {
	margin-right: 0;
}

.quick-select-button.active {
	background-color: var(--main-color);
	color: white;
}

.agreement {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.agreement_left {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.user_balance {
		font-size: 24px;
		color: var(--text_color_L1);
		span {
			color: var(--main-color);
			font-weight: bold;
		}
	}
	/* margin-bottom: 32px; */
}

.checkbox {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 2px solid var(--main-color);
	background-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.checkbox:has(.check-icon) {
	background-color: var(--main-color);
}

.check-icon {
	position: relative;
	width: 24px;
	height: 12px;
	border-left: 3px solid white;
	border-bottom: 3px solid white;
	transform: rotate(-45deg);
	top: -3px;
}

.agree-text {
	font-size: 24px;
	color: var(--text_color_L2);
}

.rules-text {
	font-size: 24px;
	color: var(--Secondary_red_color);
}

.footer {
	height: 120px;
	display: flex;
	background: var(--bg_color_L2);

  :deep(.van-button) {
            border: none;
            border-radius: 0;
        }
}

.cancel-button {
	width: 250px;
	  height: 120px;
	font-size: 36px;
	font-weight: bold;
	color: var(--main-color);
	background: var(--Secondary_moto_Color8);
	border: none;
}

.total-button {
	flex: 1;
	font-size: 36px;
	height: 120px;
	font-weight: bold;
	color: var(--text_color_L4);
	background: var(--main_gradient-color);
	border: none;
}
</style>
