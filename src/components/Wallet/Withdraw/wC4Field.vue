<template>
	<div class="WC4__C">
		<div class="WC4__C-input">
			<div class="place-div">
				{{ dollarSign }}
			</div>
			<van-field
				v-model.number="amount"
				type="digit"
				:placeholder="$t('plsEnterQuantity')"
				class="amount-input"
				@update:model-value="changeAmount"
			/>
		</div>
		<div class="verify" v-if="validateTxt">
			{{ validateTxt }}
		</div>
		<div class="can-withdraw">
			{{ $t('wfDesc1') }} {{ currency(rule.canWithdrawAmount || 0) }}
			<div @click="allAmount">{{ $t('all') }}</div>
		</div>
		<div class="amount">
			<div>{{ $t('wfDesc2') }}</div>
			<div class="num">{{ currency(dz) }}</div>
		</div>
		<slot></slot>

		<InstructionsW :withdrawType="withdrawType" :withdrawalsrule="rule" :award="award" :name="name" />
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import type { withdrawalsruleList } from '@/types/api'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import InstructionsW from '@/components/Wallet/Withdraw/InstructionsW.vue'

const { t } = useI18n()
const amount = ref<number>(0)
const dollarSign = computed(() => SettingStore().getDollarSign)
const withdrawType = 4
const props = withDefaults(
	defineProps<{
		rule: withdrawalsruleList //当前提现方式下的提现规则
		award: any
		name: string
		wtype: number,
		verify100:boolean
	}>(),
	{}
)

const emits = defineEmits<{
	(e: 'setc2cAmount', val: number): void
}>()

watch(()=>props.wtype,
(n)=>{
	console.log('1232')
	amount.value = 0;
})
// 到账项目
const dz = computed(()=>{
	if(!amount.value) return 0;
	const { withMinPrice=0, withMaxPrice=0, fee } = props.rule;
	if(fee > 0 && withMinPrice <= amount.value && amount.value <= withMaxPrice) {
		return amount.value - (amount.value * fee)
	}
	return amount.value
})
const allAmount = () => {
	const allAmount = props.rule.canWithdrawAmount
	const maxPrice = props.rule.maxPrice
	amount.value = allAmount > maxPrice ? maxPrice : allAmount
}
const changeAmount = (number: number) => {
	emits('setc2cAmount', number)
}
//提示文本
const validateTxt = computed(() => {
	if (amount.value != 0) {
		if (props.verify100&&amount.value % 100 !== 0) {
			return t('withdrawAmount')
		}
		if (amount.value > props.rule.canWithdrawAmount) {
			return t('cashBalanceInsufficient')
		} else if (amount.value > props.rule.maxPrice || amount.value < props.rule.minPrice) {
			return t('wordWithdrawal', [currency(props.rule.minPrice), currency(props.rule.maxPrice)])
		}
	}
	return ''
})

onMounted(() => {})
</script>
<style lang="scss" scoped>
.WC4__C {
	background: var(--darkBg,var(--bg_color_L2));
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 36px 20px;
}

.WC4__C {
	&-input {
		height: 88px;
		background: var(--bg_color_L1);
		border-radius: 60px;
		padding: 0 40px;
		display: flex;
		align-items: center;

		.place-div {
			height: fit-content;
			color: var(--main-color);
			font-weight: 900;
			font-size: 42px;
			padding-right: 22px;
			border-right: 1px solid var(--darkLight2,var(--gray-color-1));
			flex: none;
		}

		.amount-input {
			background-color: transparent !important;
			:deep(input) {
				color: var(--main-color);
				font-weight: 700;
				font-size: 28px;

				&::placeholder {
					font-weight: 400;
				}
			}
		}

		.unit {
			font-size: 28px;
			color: var(--text_color_L2);
			width: fit-content;
			flex: none;
		}
	}

	.can-withdraw {
		height: 40px;
		margin-top: 10px;
		display: flex;
		color: var(--main-color);
		justify-content: space-between;
		align-items: center;
		padding-left: 40px;

		& > div {
			border: 1px solid var(--main-color);
			border-radius: 10px;
			height: 34px;
			line-height: 30px;
			font-size: 22px;
			padding: 0 50px;
		}
	}

	.amount {
		display: flex;
		justify-content: space-between;
		padding-left: 40px;

		.num {
			color: var(--main-color);
		}
	}

	.verify {
		color: var(--norm_red-color);
		font-size: 22px;
		letter-spacing: 0.04em;
		//background-size: cover;
		height: 40px;
		text-align: left;
		margin: 10px 40px;
		align-items: center;
		display: flex;

		img {
			width: 30px;
			height: 30px;
			margin-right: 10px;
		}
	}

	&-b {
		margin-top: 26px;
		padding: 34px 30px;
		border: 1px solid var(--Dividing-line_color);
		border-radius: 20px;
		text-align: left;

		& > div {
			position: relative;
			min-height: 40px;
			line-height: 40px;
			color: var(--text_color_L2);
			font-size: 24px;
			padding-left: 26px;

			&::before {
				position: absolute;
				content: '';
				display: block;
				width: 10px;
				height: 10px;
				background-color: var(--colorText-26);
				border-radius: 2px;
				transform: rotate(45deg);
				left: 0;
				top: 14px;
			}

			& span {
				color: var(--main-color);
			}

			& + div {
				margin-top: 10px;
			}
		}
	}
}

.Recharge__container-intro {
	margin-top: 40px;
}
</style>
