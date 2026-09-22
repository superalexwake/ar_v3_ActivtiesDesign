<template>
	<div class="c2cWithdraw__C">
		<div class="head">
			<svg-icon name="saveWallet" />
			{{ $t('enterA') }}</div>
<!--		<div class="Withdraw__content-paymoney" v-if="quickList.length > 0">-->
<!--			<div class="Withdraw__content-paymoney__money-list">-->
<!--				<div-->
<!--					class="Withdraw__content-paymoney__money-list__item"-->
<!--					:class="currentQuickIndex === index ? 'active' : ''"-->
<!--					v-for="(item, index) in quickList"-->
<!--					:key="index"-->
<!--					@click="handleQuickSelect(index)"-->
<!--				>-->
<!--					<div class="amount" >-->
<!--						{{formatNum(Number(item))}}-->
<!--					</div>-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->
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
            <div class="all" @click="allAmount">{{ $t('all') }}</div>
		</div>
		<div class="verify" v-if="validateTxt">
			{{ validateTxt }}
		</div>
		<div class="can-withdraw">
			{{ $t('wfDesc1') }} {{ currency(withdrawalsrule.canWithdrawAmount || 0) }}

		</div>
		<div class="c2cWithdraw__C-tip">
			<div class="c2cWithdraw__C-tip-l">
				<div>{{ $t('wfDesc2') }}</div>
			</div>
			<div class="c2cWithdraw__C-tip-r">
				<div>{{ currency(actualAmount) }}</div>
			</div>
		</div>
		<slot></slot>
	</div>
	<div class="c2cWithdraw__T">
		<div class="c2cWithdraw__T-h"><svg-icon name="shuoming"></svg-icon>{{ $t('withdrawalInstructions') }}</div>
		<InstructionsW :withdrawType="withdrawType" :withdrawalsrule="withdrawalsrule" :name="withdrawalTypeslist.find((item) => item.withdrawID == 21)?.name || ''" />
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SettingStore } from '@/stores'
import InstructionsW from '@/components/Wallet/Withdraw/InstructionsW.vue'
import { useWithdraw } from '@/hooks'

const { withdrawalsrule, withdrawalTypeslist,setc2cAmount } = useWithdraw()
const { t } = useI18n()
const amount = ref<number>(0)
const dollarSign = computed(() => SettingStore().getDollarSign)
const withdrawType = 21
const actualAmount = computed(() => {
	if (!Number(amount.value)) return 0
    return Number(amount.value)
});
const quickList=computed(()=>{
	const item=withdrawalTypeslist.value.find((item) => item.withdrawID == withdrawType);
	if (!item) return[];
	if (!item.recommandWithAmount)return []
	return  item.recommandWithAmount?.split(',').map((item) => {
		return Number(item)
	})
});
const currentQuickIndex=ref<any>(null)
const handleQuickSelect=(index:number)=>{
	currentQuickIndex.value=index;
	const number=quickList.value[index];
	amount.value=number;
	setc2cAmount(number)
}
/**
 * @description: 将超过1000的数字转换为1K
 */
const formatNum = (num: number): string => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	} else {
		return num + '';
	}
};
const allAmount = () => {
    const allAmount = Math.floor(withdrawalsrule.value.canWithdrawAmount)
	const maxPrice = Math.floor(withdrawalsrule.value.maxPrice)
	amount.value = allAmount > maxPrice ? maxPrice : allAmount
}
const changeAmount = (number: number) => {
    setc2cAmount(number)
}
const validateTxt = computed(() => {
	if (actualAmount.value != 0) {
		if (actualAmount.value > withdrawalsrule.value.canWithdrawAmount) {
			return t('cashBalanceInsufficient')
		} else if (actualAmount.value > withdrawalsrule.value.maxPrice || actualAmount.value < withdrawalsrule.value.minPrice) {
			return t('wordWithdrawal', [currency(withdrawalsrule.value.minPrice), currency(withdrawalsrule.value.maxPrice)])
		}
	}
	return ''
})
defineExpose({
	validateTxt
})
</script>
<style lang="scss" scoped>

.c2cWithdraw__C,
.c2cWithdraw__T {
	background: var(--bg_color_L2);
	border-radius: 20px;
	padding: 36px 20px;
    &-h{
        margin-bottom: 20px;
    }
}

.c2cWithdraw__C {
	.Withdraw__content{
		&-paymoney {
			&__title {
				display: flex;
				align-items: center;
				font-weight: 600;
				font-size: 30px;
				margin-bottom: 26px;
				color: var(--darkTextW, var(--text_color_L1));

				.svg-icon,img {
					width: 48px;
					height: 48px;
					margin-right: 23px;
				}
			}

			&__money-list {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 20px;

				&__item {
					margin-bottom: 20px;
					margin-right: 20px;
					width: calc((100% - 60px) / 4);
					border: 1px solid var(--Dividing-line_color);
					padding: 12px 0;
					border-radius: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 10px;
					color: var(--main-color);
					background-color: var(--bg_color_L2);

					.amount {
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;
						font-size: 32px;
						gap: 10px;
						span {
							position: absolute;
							left: 8px;
							color: var(--text_color_L3);
							font-size: 32px;
							html:lang(ar) &{
								right: 16px;
								left: unset;
							}
						}

						.usdt {
							width: 36px;
							height: 36px;
						}

						.unit {
							width: 20px;
							height: 40px;
							margin-top: -20px;
						}
					}

					&.active {
						background: var(--main_gradient-color);
						border-radius: 10px;
						color: var(--text_color_L4);
						border: none;
						span {
							color: #fff;
						}
					}
				}

				&__item:nth-child(4n) {
					margin-right: 0;
				}
			}

		}
	}
	.head{
		color: var(--text_color_L1);
		font-size: 32px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 20px;
		svg{
			width: 42px;
			height: 42px;
		}
	}
	&-input {
		height: 88px;
		background: #f2f2f2;
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
			border-right: 1px solid #bdbdbd;
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
        .all{
            color: var(--main-color);
            font-size: 28px;
            width: fit-content;
            flex: none;
        }
	}

	.can-withdraw {
		height: 40px;
		margin-top: 10px;
		display: flex;
		color: var(--norm_red-color);
		justify-content: space-between;
		align-items: center;
		padding-left: 25px;

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
		// margin-top: 30px;
		border-radius: 20px;
		padding: 20px 28px;
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
		height: 48px;
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
		border: 1px solid #d6d6d6;
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
				background-color: #ff8e8a;
				border-radius: 2px;
				transform: rotate(45deg);
				left: 0;
				top: 14px;
			}

			& span {
				color: var(--norm_red-color);
			}

			& + div {
				margin-top: 10px;
			}
		}
	}
}
</style>