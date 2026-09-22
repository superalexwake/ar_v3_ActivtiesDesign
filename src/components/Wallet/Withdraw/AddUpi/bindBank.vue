<template>
	<div class="bind-bank-tip">
		<div><van-icon name="warning-o" size="14" />{{ $t('tips') }}</div>
		<div>{{ $t('bcTip1') }}</div>
		<div>{{ $t('bcTip2') }}</div>
	</div>
	<div class="bind-bank-body">
		<div class="bind-bank-card" v-for="(item, index) in cardList" :key="index">
			<div class="bind-bank-card-h">{{ item.bankName }}</div>
			<div class="bind-bank-card-n">
				<span>{{ $t('name') }}</span
				>{{ item.beneficiaryName }}
			</div>
			<div class="bind-bank-card-id">
				<span>{{ $t('cardNo') }}</span
				>{{ item.accountNo }}
			</div>
			<div v-if="item.ifsCode" class="bind-bank-card-ifsc">
				<span>{{ $t('IFSCCode') }}</span
				>{{ item.ifsCode }}
			</div>
			<div class="bind-bank-card-b" :class="{ isSelect: item.bid == selectBC }" @click="bindBankCard(item)">
				{{ $t('toBind') }}
			</div>
		</div>
	</div>
	<div class="bind-bank-sumbit" :class="{ disable: selectBC === null }" @click="bindSumbit">{{ $t('confirmBinding') }}</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AwaitApiResult } from '@/utils'
import { GetNewUPICanBindCardList } from '@/api'
const selectBC = ref<number | null>(null)
const cardList = ref<any>([])
const emits = defineEmits<{
	(e: 'bindSumbit', val: any): void
	(e: 'submitupi', val: any): void
	(e: 'setStep', val: any): void
}>()
/**
 * @description: 获取银行卡列表
 * @return {*}
 */
const getCardList = async () => {
	const res = await AwaitApiResult(GetNewUPICanBindCardList())
	cardList.value = res?.data || []
}

/**
 * @description: 点击绑定银行卡
 * @param {*} item
 * @return {*}
 */
const bindBankCard = (item: any) => {
	selectBC.value = item.bid
}

const bindSumbit = () => {
	const card = cardList.value.find((item: any) => item.bid == selectBC.value)
	emits('bindSumbit', { relationId: card.bid })
}
onMounted(() => {
	getCardList()
})
</script>
<style lang="scss" scoped>
.bind-bank-tip {
	min-height: 222px;
	background: var(--bg_color_L2);
	box-shadow:var(--BoxShadowColor-9);
	border-radius: 20px;
	padding: 36px 26px;
	margin-bottom: 30px;

	& > div {
		min-height: 40px;
		line-height: 42px;
		padding-left: 38px;
		font-size: 24px;
		color: var(--text_color_L2);
		position: relative;

		&:before {
			content: '';
			display: block;
			width: 10px;
			height: 10px;
			border-radius: 2px;
			background: var(--colorText-26);
			position: absolute;
			top: 50%;
			transform: translateY(-50%) rotate(45deg);
			left: 0;
		}

		&:first-child {
			color: var(--main-color);
			padding-left: 0;
			display: flex;
			align-items: center;

			&::before {
				content: none;
			}

			i {
				margin-right: 14px;
			}
		}

		& + div {
			margin-top: 14px;
		}
	}
}

.bind-bank-card {
	padding: 30px 20px;
	background: var(--bg_color_L2);
	
	border-radius: 10px;

	&-h {
		height: 58px;
		padding: 0 0 14px 64px;
		font-weight: 700;
		font-size: 32px;
		line-height: 52px;
		color: var(--text_color_L1);
		position: relative;
		background-image: url('@/assets/icons/wallet/withdraw/c2c/bank.png');
		background-size: 48px;
		background-position: left top;
		background-repeat: no-repeat;

		&::after {
			content: '';
			position: absolute;
			right: 0;
			bottom: 0;
			display: block;
			width: calc(100% - 60px);
			height: 0;
			border-bottom: 1px solid var(--saveTextColor-3);
		}
	}

	&-n,
	&-id,
	&-ifsc {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		color: var(--text_color_L2);
		margin-top: 40px;
		font-size: 26px;
	}

	&-b {
		height: 66px;
		line-height: 66px;
		border: 1px solid var(--main-color);
		border-radius: 10px;
		margin-top: 56px;
		position: relative;
		font-size: 28px;
		color: var(--text_color_L1);
		padding-left: 30px;

		&::after {
			content: '';
			position: absolute;
			display: block;
			width: 54px;
			height: 50px;
			border: 1px solid var(--text_color_L2);
			border-radius: 10px;
			right: 20px;
			top: 50%;
			transform: translateY(-50%);
		}

		&.isSelect {
			pointer-events: none;

			&::after {
				width: 56px;
				height: 52px;
				background-image: url('@/assets/icons/wallet/withdraw/c2c/seleteBank.png');
				background-size: 56px 52px;
				background-repeat: no-repeat;
				border: 0;
			}
		}
	}

	& + div {
		margin-top: 20px;
	}
}

.bind-bank-body {
	padding-bottom: 80px;
}

.bind-bank-sumbit {
	height: 70px;
	line-height: 70px;
	width: 100%;
	max-width: 750px;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	background-color: var(--main-color);
	color: var(--text_color_L4);
	font-size: 30px;
	text-align: center;

	&.disable {
		background: var(--button_dis_color);
		pointer-events: none;
	}
}

@media screen and (max-width: 500px) {
	.bind-bank-sumbit {
		max-width: none;
	}
}
</style>
