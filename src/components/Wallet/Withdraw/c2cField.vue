<template>
	<div class="c2cWithdraw__C">
		<div class="c2cWithdraw__C-input">
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
			<div class="unit">{{ c2crule.c2cUnitAmount?.toString().substring(1) || '00' }}</div>
		</div>
		<div class="verify" v-if="validateTxt">
			{{ validateTxt }}
		</div>
		<div class="can-withdraw">
			{{ $t('wfDesc1') }} {{ currency(c2crule.canWithdrawAmount || 0) }}
			<div @click="allAmount">{{ $t('all') }}</div>
		</div>
		<div class="c2cWithdraw__C-tip">
			<div class="c2cWithdraw__C-tip-l">
				<div>{{ $t('wfDesc2') }}</div>
				<div>{{ $t('savedForYou') }}</div>
			</div>
			<div class="c2cWithdraw__C-tip-r">
				<div>{{ currency(actualAmount) }}</div>
				<div>{{ currency(discount) }}</div>
			</div>
		</div>
		<slot></slot>
	</div>
	<div class="c2cWithdraw__T">
		<div class="c2cWithdraw__T-h"><svg-icon name="shuoming"> </svg-icon>  {{ $t('withdrawalInstructions') }}</div>
		<InstructionsW :withdrawType="withdrawType" :withdrawalsrule="c2crule" :award="c2cAward" :name="c2cName" />
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import type { withdrawalsruleList } from '@/types/api'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import InstructionsW from '@/components/Wallet/Withdraw/InstructionsW.vue'

const { t } = useI18n()
const amount = ref<number>(0)
const dollarSign = computed(() => SettingStore().getDollarSign)
const props = withDefaults(
	defineProps<{
		c2crule: withdrawalsruleList //当前提现方式下的提现规则
		c2cAward: any
		c2cName: string
	}>(),
	{}
)
const emits = defineEmits<{
	(e: 'setc2cAmount', val: number): void
}>()

const withdrawType = 20

const actualAmount = computed(() => {
	if (!Number(amount.value)) return 0
	return Number(amount.value) * (props.c2crule.c2cUnitAmount || 100)
})
const discount = computed(() => {
	return actualAmount.value * props.c2cAward
})
const allAmount = () => {
	const allAmount = Math.floor(props.c2crule.canWithdrawAmount / 100)
	const maxPrice = Math.floor(props.c2crule.maxPrice / 100)
	amount.value = allAmount > maxPrice ? maxPrice : allAmount
}
const changeAmount = (number: number) => {
	emits('setc2cAmount', number * (props.c2crule.c2cUnitAmount || 100))
}
//提示文本
const validateTxt = computed(() => {
	if (actualAmount.value != 0) {
		if (actualAmount.value > props.c2crule.canWithdrawAmount) {
			console.log('1', actualAmount.value, props.c2crule.canWithdrawAmount)
			return t('cashBalanceInsufficient')
		} else if (actualAmount.value > props.c2crule.maxPrice || actualAmount.value < props.c2crule.minPrice) {
			console.log('0')
			return t('wordWithdrawal', [currency(props.c2crule.minPrice), currency(props.c2crule.maxPrice)])
		}
	}
	return ''
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
.c2cWithdraw__C,
.c2cWithdraw__T {
	background: var(--bg_color_L2);
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 36px 20px;
}

.c2cWithdraw__C {
	&-input {
		height: 88px;
		background: var(--walletBgColor-1);
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
			border-right: 1px solid var(--gray-color-1);
			flex: none;
		}

		.amount-input {
			background-color: transparent;

			:deep(input) {
				color: var(--main-color);
				font-weight: 700;

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

	&-tip {
		margin-top: 30px;
		border: 1px solid var(--Dividing-line_color);
		border-radius: 20px;
		padding: 34px 28px;
		display: flex;
		justify-content: space-between;

		&-l,
		&-r {
			width: fit-content;
			height: fit-content;
			flex: none;
			text-align: left;
			font-size: 24px;

			& > div {
				height: 40px;
				line-height: 40px;

				& + div {
					margin-top: 20px;
				}
			}
		}

		&-l {
			& > div {
				position: relative;
				padding-left: 40px;

				&::before {
					content: '';
					display: block;
					width: 10px;
					height: 10px;
					border-radius: 2px;
					position: absolute;
					top: 14px;
					left: 0;
					background: var(--colorText-26);
					transform: rotate(45deg);
				}
			}
		}

		&-r {
			color: var(--norm_secondary-color);
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
}

.c2cWithdraw__T {
	margin-top: 48px;
	text-align: left;

	&-h {
		line-height: 48px;
		font-size: 30px;
		color: var(--text_color_L1);
		font-weight: 600;
		.svg-icon{
			width: 48px;
			height: 48px;
		}
	}

	&-b {
		margin-top: 26px;
		padding: 34px 30px;
		border: 1px solid var(--Dividing-line_color);
		border-radius: 20px;
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
</style>
