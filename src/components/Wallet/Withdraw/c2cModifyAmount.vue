<template>
	<van-popup v-model:show="show" round position="bottom">
		<div class="modifyAmount">
			<h1>{{ $t('c2cWTip8') }}</h1>
			<div class="selectAmount">
				<h2>{{ $t('recommendedA') }}</h2>
				<div class="select">
					<div
						:class="{ active: activeIndex == index }"
						v-for="(item, index) in amountList"
						:key="index"
						@click="onSelectA(index, item)"
					>
						<span>{{ currency(item) }}</span>
						<p>
							{{ $t('award') }} <span>{{ currency(award(item), dollarSign, 0) }}</span>
						</p>
					</div>
				</div>
			</div>
			<div class="inputAmount">
				<h2>{{ $t('c2cWTip9') }}</h2>
				<div class="input">
					<div class="place-div">
						{{ dollarSign }}
					</div>
					<van-field v-model.number="amount" center type="digit" :placeholder="$t('enterAmount')" class="inp" />
					<span>00</span>
				</div>
				<div class="balance">
					<span>{{ $t('wfDesc1') }}{{ currency(withdrawalsrule?.canWithdrawAmount || 0) }} </span>
					<input type="button" :value="$t('all')" @click="onGetAllAmount" />
				</div>
				<div class="info">
					<div>
						<span>{{ $t('wfDesc2') }}</span>
						<span class="yellow">{{ currency(actualAmount) }}</span>
					</div>
					<div>
						<span>{{ $t('actualDeductionAmount') }}</span>
						<span class="yellow">{{ currency(actualAmount - discount) }}</span>
					</div>
					<div>
						<span>{{ $t('savedForYou') }}</span>
						<span class="yellow">{{ currency(discount) }}</span>
					</div>
				</div>
				<div class="modify" @click="onModify">
					{{ $t('replaceWith') }} <span>{{ dollarSign }} {{ amount * 100 }}</span>
				</div>
			</div>
		</div>
	</van-popup>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { AwaitApiResult, currency } from '@/utils'
import { SettingStore } from '@/stores'
import { onMounted } from 'vue'
import { useVModels } from '@vueuse/core'
import {
	ChangeC2CWithdrawOrderAmount,
	GetC2CWithdrawRecommendedAmount,
	GetWithdrawals
} from '@/api/modules/wallet'
import { showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
const props = defineProps({
	showPopup: {
		type: Boolean,
		default: false
	},
	orderNo: {
		type: String,
		default: ''
	}
})
const show = computed({
	get(): boolean {
		return props.showPopup || false
	},
	set(val: boolean) {
		if (!val) {
			emit('close')
		}
	}
})

const { t } = useI18n()
const emit = defineEmits(['update:orderNo', 'close', 'refresh'])
const { orderNo } = useVModels(props, emit)
const dollarSign = computed(() => SettingStore().getDollarSign)
const amount = ref(0)
// C2C 提现奖励比例已停止拉取（不再调用 GetSettingByKey），恒为 0；相关展示位自带判空会自动隐藏
const c2cAward = ref(0)
const activeIndex = ref(-1)

//获取推荐金额
const amountList = ref()
async function getC2CWithdrawRecommendedAmount() {
	const res = await AwaitApiResult(GetC2CWithdrawRecommendedAmount())
	if (res) {
		amountList.value = res.data
	}
}
function onSelectA(index: number, item: number) {
	activeIndex.value = index
	amount.value = item / 100
}

//获取c2c提现方式的详细信息
const withdrawalsrule = ref()
async function getWithdrawalsV() {
	const res = await AwaitApiResult(GetWithdrawals({ withdrawid: 20 }))
	if (res) {
		withdrawalsrule.value = res.data.withdrawalsrule
	}
}

//更换金额
async function onModify() {
	if (amount.value <= 0) {
		showFailToast(t('c2cWTip10'))
		return
	}
	const res = await AwaitApiResult(ChangeC2CWithdrawOrderAmount({ orderNo: orderNo.value, orderAmount: amount.value * 100 }))
	if (res) {
		orderNo.value = res.data
		localStorage.setItem('c2cOrderNo', res.data)
		emit('refresh', amount.value)
		show.value = false
	}
}

function onGetAllAmount() {
	const allAmount = Math.floor(withdrawalsrule.value.canWithdrawAmount / 100)
	const maxPrice = Math.floor(withdrawalsrule.value.maxPrice / 100)
	amount.value = allAmount > maxPrice ? maxPrice : allAmount
}
const actualAmount = computed(() => {
	if (!Number(amount.value)) return 0
	return Number(amount.value) * (withdrawalsrule.value?.c2cUnitAmount || 100)
})
const discount = computed(() => {
	return actualAmount.value * c2cAward.value
})
function award(amount: number) {
	return amount * c2cAward.value
}
onMounted(() => {
	getC2CWithdrawRecommendedAmount()
	getWithdrawalsV()
})
</script>
<style lang="scss" scoped>
.modifyAmount {
	padding: 30px 20px;

	h1 {
		color: var(--text_color_L1);
		font-size: 36px;
		text-align: center;
		font-weight: 700;
	}

	.selectAmount {
		margin-top: 30px;

		h2 {
			display: flex;
			align-items: center;
			color: var(--text_color_L1);
			font-size: 28px;

			&::before {
				content: '';
				display: block;
				margin-right: 15px;
				width: 8px;
				height: 26px;
				background: var(--main-color);
			}
		}

		.select {
			margin-top: 20px;
			display: flex;
			flex-wrap: wrap;
			gap: 20px;

			> div {
				width: calc((100% - 60px) / 3);
				border-radius: 10px;
				border: 0.5px var(--text_color_L2) solid;
				min-height: 110px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 10px;

				> span {
					font-size: 32px;
				}

				p {
					span {
						color: var(--colorText-26);
					}
				}
			}
			.active {
				background: var(--main_gradient-color);
				box-shadow: 0px -4px 10px 2px #fff0ec inset;
				color: #fff;;
				border: none;
				p {
					span {
						color: #fff;;
					}
				}
			}
		}
	}

	.inputAmount {
		h2 {
			color: var(--text_color_L1);
			font-size: 28px;
			margin: 30px 0 20px;
		}

		.input {
			justify-content: space-between;
			background: var(--walletBgColor-1);
			border-radius: 60px;
			height: 88px;
			padding: 20px;
			display: flex;
			align-items: center;
			margin-bottom: 20px;

			span {
				color: var(--text_color_L2);
				font-size: 50px;
				font-weight: 700;
				width: 90px;
			}

			.place-div {
				position: absolute;
				height: 88px;
				width: 60px;

				color: var(--main-color);
				font-weight: 900;
				font-size: 42px;
				line-height: 88px;
				html:lang(ar) &{
					right: 15px;
				}
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

			.inp {
				width: 70%;
				min-height: 30px;
				background: none;
				border: none;
				color: var(--main-color);
				letter-spacing: 0.04em;
				font-weight: 700;
				font-size: 40px;
				margin-left: 100px;
				padding-left: 20px;

				&::placeholder {
					color: var(--gray-color-1);
					font-size: 28px;
					font-weight: 400;
				}
			}
		}

		.balance {
			display: flex;
			justify-content: space-between;
			margin: 20px 0;
			align-items: center;
			margin-left: 20px;

			span {
				color: var(--main-color);
				font-size: 22px;
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
		}
	}

	.info {
		border-radius: 20px;
		border: 0.5px var(--Dividing-line_color) solid;
		padding: 15px 30px;

		> div {
			position: relative;
			padding-left: 25px;
			margin: 15px 0;
			color: var(--text_color_L2);
			display: flex;
			justify-content: space-between;

			&::after {
				position: absolute;
				content: '';
				width: 10px;
				height: 10px;
				transform: rotate(45deg);
				background: var(--main-color);
				left: -5px;
				top: 14px;
				html:lang(ar) &{
					right: -5px;
					left: auto;
				}
			}

			> span:nth-of-type(2) {
				color: var(--norm_secondary-color);
			}
		}
	}

	.modify {
		border-radius: 120px;
		border: 0.5px var(--main-color) solid;
		min-height: 88px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
		margin-top: 30px;
		span {
			color: var(--main-color);
			font-size: 32px;
		}
	}
}
input:focus {
	outline: none;
}
</style>
