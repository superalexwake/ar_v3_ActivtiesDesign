<template>
	<div class="Recharge__container-intro">
		<div class="br">
		<template v-if="withdrawType == 21">
			<p>{{ $t('arWTip1',[name]) }}</p>
			<p>{{ $t('arWTip2',[name]) }}</p>
		</template>
		<template v-if="[1, 2, 3, 4, 5, 6, 8, 10, 20,21,27].includes(withdrawType)">
			<p v-html="$t('instructionDes', [currency(withdrawalsrule?.amountofCode)])"></p>
			<p>
				{{ $t('instructionTxt6') }}
				<span class="red">{{ withdrawalsrule?.startTime }}-{{ withdrawalsrule?.endTime }}</span>
			</p>
			<p>
				{{ $t('instructionTxt7') }}<span class="red">{{ withdrawalsrule?.withdrawRemainingCount }}</span>
			</p>
			<p>
				{{ $t('instructionTxt8') }}
				<span class="red">{{ currency(withdrawalsrule?.minPrice) }}-{{ currency(withdrawalsrule?.maxPrice) }}</span>
			</p>
		</template>
		<template v-if="[3, 10].includes(withdrawType)">
			<p>{{ $t('instructionTxt10') }}</p>
			<p>{{ $t('instructionTxt11') }}</p>
		</template>
		<template v-if="withdrawType == 4">
			<div v-if="Number(award)">
				<p v-html="$t('c2cFTip1', [name, award * 100 || 0])"></p>
			</div>
		</template>
		<template v-if="withdrawType == 20">
			<div v-if="Number(award)">
				<p v-html="$t('c2cFTip1', [name, award * 100 || 0])"></p>
			</div>
			<div>
				<p v-html="$t('c2cFTip4')"></p>
			</div>
			<div>
				<p v-html="$t('c2cFTip2', [withdrawalsrule?.c2cUnitAmount || 100])"></p>
			</div>
			<div>
				<p v-html="$t('c2cFTip3')"></p>
			</div>
		</template>
		<template v-if="withdrawType != 21">
			<template v-if="withdrawalsrule?.fee">
				<p v-if="withdrawalsrule?.withMinPrice + withdrawalsrule?.withMaxPrice" v-html="$t('sxf',[currency(withdrawalsrule?.withMinPrice),currency(withdrawalsrule?.withMaxPrice)])"></p>
				<p v-html="$t('sxf1',[(Math.floor(withdrawalsrule.fee * 10000 / 100).toFixed(2))])"></p>
			</template>
			<p>{{ $t('withdrwsTip5') }}</p> 
			<p>{{ $t('withdrwsTip6') }}</p>
		</template>
	</div>
	</div>
</template>

<script setup lang="ts">
import type { withdrawalsruleList } from '@/types/api'
import { currency } from '@/utils'

withDefaults(
	defineProps<{
		withdrawalsrule: withdrawalsruleList //当前提现方式下的提现规则
		withdrawType?: any
		award?: any
		name?: any
	}>(),
	{}
)
</script>

<style lang="scss" scoped>
.Recharge__container-intro {
	background: var(--darkBg,var(--bg_color_L2));
	border-radius: 0 0 20px 20px;
	padding: 25px 20px;

	.br{
		border: 1px solid var( --bgDark-2,var(--Dividing-line_color));
		border-radius: 20px;
		padding: 20px;
	}

	p {
		text-align: left;
		position: relative;
		padding-inline-start: 40px;
		font-weight: 400;
		font-size: 24px;
		color: var(--text_color_L2);
		line-height: 40px;
		margin: 15px 0;
		:deep(span) {
			color: var(--main-color);
			&.red {
				color: var(--norm_red-color);
			}
		}
	}

	p::after {
		position: absolute;
		content: '';
		width: 10px;
		height: 10px;
		transform: rotate(45deg);
		background: var(--main-color);
		inset-inline-start: 15px;
		top: 14px;
	}
}
</style>
