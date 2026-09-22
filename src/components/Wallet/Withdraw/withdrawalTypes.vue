<template>
	<div class="withdrawWay">
		<div
			v-if="hasShowUPI"
			class="c2c"
			:class="{ active: data_NewSetWithdrawal.type == 20 }"
			@click="onselectWithdrawalType({ withdrawID: 20 })"
		>
			<img v-if="data_NewSetWithdrawal.type != hasShowUPI.withdrawID" :src="hasShowUPI.withBeforeImgUrl" />
			<img v-else :src="hasShowUPI.withAfterImgUrl" />
			<div>
				<div>{{ hasShowUPI.name }}</div>
				<template v-if="c2cAward > 0"> {{ $t('c2cEGReward', [c2cAward ? accMul(c2cAward, 100) : 0]) }}</template>
			</div>
		</div>
		<div
			v-if="hasShowAr"
			class="c2c Ar"
			:class="{ active: data_NewSetWithdrawal.type == 21 }"
			@click="onselectWithdrawalType({ withdrawID: 21 })"
		>
			<div class="gift" v-if="maxRechargeRifts > 0||ArRechargeRifts>0">
				<span>{{maxRechargeRifts>0?`${maxRechargeRifts}%`:'' }}{{ArRechargeRifts>0?`+${ArRechargeRifts}%`:'' }}</span>
			</div>
			<img v-if="data_NewSetWithdrawal.type != hasShowAr.withdrawID" :src="hasShowAr.withBeforeImgUrl" />
			<img v-else :src="hasShowAr.withAfterImgUrl" />
			<div>
				<div>{{ hasShowAr.name }}</div>
				<p>
					{{ hasShowAr.withdrawTip||$t('withdrawTip5') }}
				</p>
			</div>
		</div>
		<div
			v-if="hasShowRsn"
			class="c2c Ar"
			:class="{ active: data_NewSetWithdrawal.type == 22 }"
			@click="onselectWithdrawalType({ withdrawID: 22 })"
		>
			<img v-if="data_NewSetWithdrawal.type != hasShowRsn.withdrawID" :src="hasShowRsn.withBeforeImgUrl" />
			<img v-else :src="hasShowRsn.withAfterImgUrl" />
			<div>
				<div>{{ hasShowRsn.name }}</div>
			</div>
		</div>
		<template v-for="item in withdrawalTypeslist" :key="item.withdrawID">
			<div
				v-if="![20,21,22].includes(item.withdrawID)"
				:class="{ select: data_NewSetWithdrawal.type == item.withdrawID }"
				@click="onselectWithdrawalType(item)"
			>
				<div>
					<img v-if="data_NewSetWithdrawal.type != item.withdrawID" :src="item.withBeforeImgUrl" />
					<img v-else :src="item.withAfterImgUrl" />
				</div>
				<span>{{ item.name }}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {accMul, bouns} from '@/utils'
import type { ResWithdrawlist, ReqNewSetWithdrawal } from '@/types/api'

const props = withDefaults(
	defineProps<{
		data_NewSetWithdrawal: ReqNewSetWithdrawal //提现参数
		withdrawalTypeslist: Array<ResWithdrawlist> //该提款方式下的银行列表
		c2cAward: number
		maxRechargeRifts:number
		ArRechargeRifts:number
	}>(),
	{}
)
const hasShowUPI = computed(() => {
	return props.withdrawalTypeslist.find((item) =>  item.withdrawID == 20)
})

const hasShowAr = computed(() => {
	return props.withdrawalTypeslist.find((item) =>  item.withdrawID == 21)
})
const hasShowRsn = computed(() => {
	return props.withdrawalTypeslist.find((item) =>  item.withdrawID == 22)
})
const emits = defineEmits<{
	(e: 'onSelectWithdrawalType', item: ResWithdrawlist): void
}>()

function onselectWithdrawalType(item: any) {
	emits('onSelectWithdrawalType', item)
}
</script>
<style lang="scss" scoped>
.withdrawWay {
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	justify-content: flex-start;
	margin: 25px 0;

	.c2c {
		position: relative;
		min-height: 120px;
		width: 100%;
		border-radius: 20px;
		display: flex;
		align-items: center;
		padding-left: 18px;
		background-color: var(--bg_color_L2);
		.gift {
			width: 121px;
			height: 64px;
			position: absolute;
			right: 4px;
			top: 0;
			background: url('@icon/wallet/gift.png') no-repeat center center;
			background-size: 86px 70px;
			display: flex;
			justify-content: center;
			span {
				display: block;
				color: #fff;
				font-size: 22px;
				text-align: center;
				padding-top: 18px;
				transform: scale(.8);
			}
		}
		& > img {
			height: 80px;
			margin-right: 20px;
		}

		& > div {
			color: var(--text_color_L2);
			text-align: left;
			font-size: 24px;
			line-height: 44px;

			& > div {
				font-size: 30px;
				color: var(--text_color_L1);
			}
		}

		&.active {
			background: var(--main_gradient-color);

			& > div {
				color: var(--text_color_L4);

				& > div {
					color: var(--text_color_L4);
				}
			}
		}
	}

	> div:not(.c2c) {
		border-radius: 10px;
		background: var(--bgDark-2, var(--bg_color_L2));
		width: 31%;
		height: 160px;
		padding: 20px 20px;
		flex-direction: column;
		display: flex;
		justify-content: space-between;

		img {
			width: auto;
			height: 70px;
		}

		> div {
			flex-direction: row;
			display: flex;
			justify-content: center;
		}
	}

	> div.select {
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		span {
			line-height: 24px;
		}
	}

}
</style>
