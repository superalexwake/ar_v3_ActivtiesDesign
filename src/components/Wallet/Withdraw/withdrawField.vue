<template>
	<div v-show="[1,2,27, 6, 8, 5].includes(data.type)" class="explain">
		<div class="Withdraw__content-paymoney" v-if="quickList.length > 0&&data.type===2&&withdrawalslist.length>0">
			<div class="Withdraw__content-paymoney__title">
				<svg-icon name="saveWallet"  ></svg-icon>
				<p >{{ $t('withdrawalA') }}</p>
			</div>
			<div class="Withdraw__content-paymoney__money-list">
				<div
					class="Withdraw__content-paymoney__money-list__item"
					:class="currentQuickIndex === index ? 'active' : ''"
					v-for="(item, index) in quickList"
					:key="index"
					@click="handleQuickSelect(index)"
				>
					<div class="amount" >
						{{formatNum(Number(item))}}
					</div>
				</div>
			</div>
		</div>
		<div class="input">
			<div class="place-div">
				{{ dollarSign }}
			</div>
			<input
				:placeholder="$t('enterAmount')"
				@input="changeQuickInput()"
				class="inp"
				v-model="amount"
				@keypress="onValidatePress($event)"
			/>
		</div>
		<div class="verify" v-if="showValidate">
			{{ validateTxt }}
		</div>
		<div class="balance bank">
			<div>
				<span
					>{{ $t('wfDesc1') }}
					<h6 class="yellow">{{ currency(withdrawalsrule.canWithdrawAmount || 0) }}</h6>
				</span>
				<input type="button" :value="$t('all')" @click="onGetAllAmount" />
			</div>
			<div>
				<span>{{ $t('wfDesc2') }}</span>
				<div class="rightD">
					<span class="yellow">{{ currency(dz) }}</span>
				</div>
			</div>
		</div>
	</div>

	<div v-show="[3, 10].includes(data.type)" class="explain usdt">
		<div class="head">
			<img :src="getWalletWithdrawTypeIcon(data.type)" />
			<h1 v-if="data.type == 3">{{ $t('selectUSDTNum') }}</h1>
			<h1 v-if="data.type == 10">{{ $t('selectUSDTAmount') }}</h1>
		</div>
		<div class="input">
			<div class="place-div">
				{{ dollarSign }}
			</div>
			<input
				type="number"
				:placeholder="$t('enterWithdrawAmount')"
				@input="calculatedCount"
				class="inp"
				v-model="amount"
				@keypress="onValidatePress1($event)"
			/>
		</div>
		<div class="verify" v-if="showValidate">
			{{ validateTxt }}
		</div>
		<div class="verify" v-if="showValidateUB">{{ $t('wfDesc4') }}</div>
		<div v-if="[3].includes(data.type)" class="input">
			<input
				type="number"
				:placeholder="$t('enterUSDTAmount')"
				@input="calculatedAmount"
				class="inp"
				v-model="usdtCountC"
				@keypress="onValidatePress1($event)"
				@focus="onDelDecimal"
			/>
			<div class="place-div">
				<div class="place-icon">
					<img src="@icon/wallet/withdrawType/3.png" />
				</div>
			</div>
		</div>

		<div class="balance usdt">
			<div>
				<span
					>{{ $t('wfDesc5') }}
					<h6 class="yellow">{{ currency(withdrawalsrule.canWithdrawAmount || 0) }}</h6>
				</span>
				<input type="button" :value="$t('all')" @click="onGetAllAmount" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, toRef, computed } from 'vue'
import { currency } from '@/utils'
import { getWalletWithdrawTypeIcon } from '@/utils/assetIcons'
import type { ReqNewSetWithdrawal, withdrawalsruleList } from '@/types/api'
import { SettingStore } from '@/stores'

import { useI18n } from 'vue-i18n'
import { useWithdraw } from '@/hooks'

const { t } = useI18n()
const dollarSign = computed(() => SettingStore().getDollarSign)
const props = withDefaults(
	defineProps<{
		data_NewSetWithdrawal: ReqNewSetWithdrawal //提现参数
		withdrawalsrule: withdrawalsruleList //当前提现方式下的提现规则
		withdrawalslist:any[],
		verify100:boolean
	}>(),
	{}
)

//usdt数量
const usdtCount = ref(0)
const usdtCountC = computed({
	get(): any {
		return usdtCount.value != 0 ? usdtCount.value : ''
	},
	set(val: any) {
		usdtCount.value = val
	}
})
const data = toRef(props, 'data_NewSetWithdrawal')
const amount = computed({
	get(): any {
		return data.value.amount != 0 ? data.value.amount : ''
	},
	set(val: any) {
		data.value.amount = val
	}
})
const {  withdrawalTypeslist } = useWithdraw()
const quickList=computed(()=>{
	const item=withdrawalTypeslist.value.find((item) => item.withdrawID == 2);
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
//银行卡方式下，验证可提现余额不足提示文本状态
const showValidate = computed(() => {
	if (data.value.amount != 0) {
		if (props.verify100&&data.value.amount % 100 !== 0) {
			return true
		}
		if (data.value.amount > props.withdrawalsrule.canWithdrawAmount) return true
		if (data.value.amount > props.withdrawalsrule.maxPrice || data.value.amount < props.withdrawalsrule.minPrice) return true
		if (props.withdrawalsrule.amountofCode > 0) return true
	}
	return false
})

//提示文本
const validateTxt = computed(() => {
	if (data.value.amount != 0) {
		if (props.verify100&&data.value.amount % 100 !== 0) {
			return t('withdrawAmount')
		}
		if (props.withdrawalsrule.amountofCode > 0) {
			return t('code128')
		} else if (data.value.amount > props.withdrawalsrule.canWithdrawAmount) {
			return t('cashBalanceInsufficient')
		} else if (data.value.amount > props.withdrawalsrule.maxPrice || data.value.amount < props.withdrawalsrule.minPrice) {
			return t('wordWithdrawal', [currency(props.withdrawalsrule.minPrice), currency(props.withdrawalsrule.maxPrice)])
		}
		// 判断amount是否是整百

	}
})

//usdt方式下，验证可提现usdt数量不足提示文本状态
const showValidateUB = computed(() => {
	if (data.value.type === 3 && data.value.amount != 0 && Number(data.value.amount) < 10) {
		return true
	} else {
		return false
	}
})

function onValidatePress(oEvent: any) {
	if (oEvent.keyCode != 46 && (oEvent.keyCode < 48 || oEvent.keyCode > 57)) oEvent.returnValue = false
}

function onValidatePress1(oEvent: any) {
	if (oEvent.keyCode < 48 || oEvent.keyCode > 57) oEvent.returnValue = false
}

//控制金额的输入
function changeQuickInput() {
	data.value.amount = Number(
		data.value.amount
			.toString()
			.replace(/[^\d.]/g, '')
			.replace(/^\./g, '')
			.replace(/\.{2,}/g, '.')
			.replace('.', '$#$')
			.replace(/\./g, '')
			.replace('$#$', '.')
	)
	if (data.value.amount.toString().length > 11) {
		data.value.amount = Number(data.value.amount.toString().slice(0, 11))
	}
}

//点全部按钮，填充全部金额到金额输入框
function onGetAllAmount() {
	data.value.amount = Math.floor(props.withdrawalsrule.canWithdrawAmount)
	if (data.value.type === 3) {
		calculatedCount()
	}
}

function onDelDecimal() {
	usdtCount.value = Math.floor(usdtCount.value)
}
//输入金额计算数量
function calculatedCount() {
	data.value.amount = Number(
		data.value.amount
			.toString()
			.replace(/[^\d.]/g, '')
			.replace(/\.{2,}/g, '.')
			.replace('.', '$#$')
			.replace(/\./g, '')
			.replace('$#$', '.')
			.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
			.replace(/^\./g, '')
	)

	if (data.value.amount.toString().length > 11) {
		data.value.amount = Number(data.value.amount.toString().slice(0, 11))
	}

	if (data.value.amount > 0) {
		let countN = Number(data.value.amount) / props.withdrawalsrule.uRate
		usdtCount.value = Math.floor(countN * 100) / 100
	} else {
		usdtCount.value = 0
	}
}

//输入数量计算金额
function calculatedAmount() {
	if (usdtCount.value.toString().length > 11) {
		usdtCount.value = Number(usdtCount.value.toString().slice(0, 11))
	}
	if (usdtCount.value > 0) {
		let amountN = usdtCount.value * props.withdrawalsrule.uRate
		data.value.amount = Math.floor(Math.floor(amountN * 100) / 100)
	} else {
		data.value.amount = 0
	}
}

// 到账项目
const dz = computed(()=>{
	if(!data.value.amount) return 0;
	const { withMinPrice=0, withMaxPrice=0, fee } = props.withdrawalsrule;
	if(fee > 0 && withMinPrice <= data.value.amount && data.value.amount <= withMaxPrice) {
		return data.value.amount - (data.value.amount * fee)
	}
	return data.value.amount
})
defineExpose({
	usdtCount,
	data,
	showValidate,
	showValidateUB
})
</script>
<style lang="scss" scoped>
input {
	outline: none;
}

h6 {
	display: inline;
}

span.yellow,
h6.yellow {
	color: var(--norm_secondary-color);
}

span.red,
h6.red {
	color: var(--norm_red-color);
}

.explain {
	background: var(--darkBg,var(--bg_color_L2));
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px 20px 0 0;
	padding: 25px 20px 0;

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

	.input {
		justify-content: space-between;
		background: var(--bg_color_L1);
		border-radius: 60px;
		height: 88px;
		padding: 20px;
		display: flex;
		align-items: center;
		margin-bottom: 20px;

		span {
			color: var(--main-color);
			letter-spacing: 0.04em;
			font-weight: 900;
			font-size: 42px;
			line-height: 42px;
			width: 90px;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				height: 40px;
				display: inline-block;
				margin: 0 10px 2px;
				vertical-align: middle;
				border-right: 2px solid var(--darkLight2,var(--gray-color-1));
				top: 2px;
				right: -10px;
			}
		}

		.place-div {
			position: absolute;
			height: 88px;
			width: 60px;

			color: var(--main-color);
			font-weight: 900;
			font-size: 42px;
			line-height: 88px;

			&::after {
				position: absolute;
				content: '';
				height: 40px;
				display: inline-block;
				margin: 0 10px 2px;
				vertical-align: middle;
				border-right: 2px solid var(--darkLight2,var(--gray-color-1));
				top: 26px;
				right: -30px;
				html:lang(ar) &{
					left: -30px;
					right: auto;
				}
			}
		}

		img {
			width: auto;
			height: 45px;
			margin-top: 20px;
			//margin-left: 10px;
		}

		input {
			width: 70%;
			height: 30px;
			background: none;
			border: none;
			//color: var(--gray-color-1);
			color: var(--main-color);
			letter-spacing: 0.04em;
			font-weight: 700;
			//font-size: 30px;
			line-height: 30px;
			margin-inline-start: 100px;
			padding-left: 20px;
			padding-bottom: 0px;

			&::placeholder {
				color: var(--gray-color-1);
				line-height: 30px;
				font-size: 28px;
				font-weight: 400;
			}
		}
	}

	.balance {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		align-items: center;
		font-weight: 400;
		font-size: 22px;

		flex-direction: column;
		margin-left: 5px;

		> div {
			display: flex;
			justify-content: space-between;
			width: 100%;
			margin: 5px 0;
			align-items: center;

			span {
				text-align: left;
				//margin-left: 40px;
			}

			input {
				border: 1px solid var(--main-color);
				border-radius: 10px;
				width: 146px;
				height: 36px;
				line-height: 22px;
				background: none;
				color: var(--main-color);
			}

			.rightD {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 30px;
				font-family: 'Roboto';
				font-style: normal;
				font-weight: 400;

				img {
					width: 32px;
					height: auto;
					margin-right: 10px;
				}
			}
		}

		&.bank {
			color: var(--text_color_L2);

			// >div:nth-of-type(1) {
			// 	span {
			// 		margin-left: 30px;
			// 		color: var(--main-color);
			// 	}
			// }
		}

		&.usdt {
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
}

.explain.usdt {
	.head {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20px;

		img {
			width: 48px;
			height: auto;
			margin-right: 20px;
		}

		h1 {
			color: var(--text_color_L1);
			font-weight: 400;
			font-size: 32px;
		}
	}

	.input {
		border-radius: 10px;
	}
}
</style>
