<template>
	<div class="Recharge__container-intro">
		<div class="Recharge__container-intro__title" v-if="isShowHead">
			<div class="img"><svg-icon name="shuoming"></svg-icon></div>
			<p>{{ $t('rechargeInstruction') }}</p>
		</div>
		<div class="Recharge__container-intro__lists">
			<div class="item" v-if="showFormula">
				<p>{{ $t('actualCredit') }} = {{ $t('rechageAmount') }} + {{ $t('k3WarningTip4') }} − {{ $t('fee') }}</p>
			</div>
			<div class="item" v-if="[1, 3, 6].includes(withdrawType)">
				<p v-html="$t('instructionDes', [currency(withdrawalsrule?.amountofCode)])"></p>
				<p>
					{{ $t('instructionTxt6') }}
					<span class="red">{{ withdrawalsrule?.startTime }}-{{ withdrawalsrule?.endTime }}</span>
				</p>
				<p>
					{{ $t('instructionTxt7') }}<span class="red">{{ withdrawalsrule?.withdrawRemainingCount }}</span>
				</p>
				<p>
					{{ $t('instructionTxt8')
					}}<span class="red">{{ currency(withdrawalsrule?.minPrice) }}-{{ currency(withdrawalsrule?.maxPrice) }}</span>
				</p>
			</div>
			<!-- c2c -->
			<div class="item" v-if="getType === 'c2c'">
				<p>{{ $t('c2cMBAInteger', [rechargeInfo?.c2cUnitAmount]) }}</p>
				<p v-if="rechargeInfo?.rechargeRifts > 0">{{ $t('c2cNEWUPIW', [accMul(rechargeInfo?.rechargeRifts, 100)]) }}</p>
				<p>
					{{ $t('c2cTUAR')
					}}<span class="red">{{ currency(rechargeInfo?.miniPrice) }}-{{ currency(rechargeInfo?.maxPrice) }}</span>
				</p>
				<p v-html="$t('c2cInstructions1')"></p>
			</div>
			<!-- 专属 -->
			<div class="item" v-if="getType === 'exclusive'">
				<p>Số tiền nhận được：{{ (store.amount as number || 0) * Number(VIR) }}</p>
				<p>Phí: {{(1-VIR) * 100}}%</p>
				<p>*Số tiền nạp phải là bội số nguyên của 1000</p>
				<p>
					Lưu ý: nếu tạo lệnh nạp sai với mệnh giá thấp hơn thẻ cào thì hệ thống sẽ tự động cộng vào số tiền mà quý
					khách đã tạo lệnh,chúng tôi không có trách nhiệm bổ sung số tiền chênh lệch.Xin cảm ơn!
				</p>
			</div>
			<!-- 一般三方和本地银行充值 -->
			<div class="item" v-if="getType === 'bank'">			
				<p>{{ $t('instructionTxt2') }}</p>
				<p>{{ $t('instructionTxt3') }}</p>
				<p>{{ $t('instructionTxt4') }}</p>
				<p v-if="showType === 18">{{ $t('rechargeBankDetailTip') }}</p>
				<p>{{ $t('instructionTxt5') }}</p>
			</div>

			<div class="item" v-if="getType === 'c2cDetail'">
				<!-- <p>{{ $t('c2cInstructions2') }}</p> -->
				<p>{{ $t('c2cInstructions3') }}</p>
			</div>

			<div class="item" v-if="getType === 'numberCurrency'">
				<p>
					{{
						$t('instructionsDesc1', [
							(rechargeInfo?.miniPrice || 1) + (showType === 16 ? 'TRX' : 'USDT'),
							(rechargeInfo?.miniPrice || 1) + (showType === 16 ? 'TRX' : 'USDT')
						])
					}}
				</p>
				<p>{{ $t('instructionsDesc2') }}</p>
				<p>{{ $t('instructionsDesc3') }}</p>
				<p>{{ $t('instructionsDesc4') }}</p>
				<p>{{ $t('instructionsDesc5') }}</p>
			</div>

			<div class="item" v-if="getType === 'upi'">
				<p>{{ $t('upiInstructions1') }}</p>
				<p>{{ $t('upiInstructions2') }}</p>
			</div>

			<div class="item" v-if="withdrawType === 3">
				<!-- <p>{{ $t('instructionTxt9') }}</p> -->
				<p>{{ $t('instructionTxt10') }}</p>
				<p>{{ $t('instructionTxt11') }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency, accMul } from '@/utils'
import type { withdrawalsruleList } from '@/types/api'
import { computed } from 'vue'
import { useRecharge } from '@/hooks/useRecharge'
const props = withDefaults(
	defineProps<{
		withdrawalsrule?: withdrawalsruleList //当前提现方式下的提现规则
		showType?: number // 99 kbz 和 wave 方式的充值说明
		withdrawMoney?: number
		withdrawType?: number
		isShowHead?: boolean
		rechargeInfo?: any
		showFormula?: boolean
	}>(),
	{
		showType: 0,
		withdrawMoney: 0,
		withdrawType: -1,
		isShowHead: false,
		showFormula: false
	}
)

const { store } = useRecharge()
const VIR = import.meta.env.VITE_BASE_VIR;
const getType = computed(() => {
	if (props.showType === 9 || props.showType === 18 || props.showType === 10) return 'bank'
	if (props.showType === 20) return 'c2c'
	if (props.showType === 12) return 'upi'
	if (props.showType === 6  && VIR) return 'exclusive'
	if (props.showType === 11 || props.showType === 16 || props.showType === 19) return 'numberCurrency'
	if (props.showType === 771) return 'c2cDetail'
	if (props.withdrawType !== -1) return ''
	return 'bank'
})

</script>

<style lang="scss" scoped>
.Recharge__container-intro {
	background: var(--darkBg,var(--bg_color_L2));
	//box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 25px 20px;
	//margin-top: 30px;

	&__title {
		font-weight: 600;
		font-size: 30px;
		margin-bottom: 25px;
		display: flex;
		color: var(--darkTextW, var(--text_color_L1));

		.svg-icon {
			width: 48px;
			height: 48px;
			margin-right: 12px;
		}
	}

	&__lists {
		border: 1px solid var(--bgDark-2, var(--Dividing-line_color));
		border-radius: 20px;
		padding: 14px 17px 36px 30px;

		.item {
			margin-top: 20px;

			p {
				text-align: left;
				position: relative;
				padding-left: 25px;
				font-weight: 400;
				font-size: 24px;
				color: var(--text_color_L2);
				line-height: 40px;
				margin: 15px 0;

				span.red {
					color: var(--norm_red-color);
				}
			}

			p::after {
				position: absolute;
				content: '';
				width: 10px;
				height: 10px;
				transform: rotate(45deg);
				background: var(--main-color);
				left: -5px;
				top: 14px;
				html:lang(ar) &{
					left: unset;
					right: -5px;
				}
			}
		}
	}
}

.red {
	color: var(--main-color) !important;
}
</style>
