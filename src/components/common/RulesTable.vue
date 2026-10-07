<template>
	<div v-for="(config, index) in giftPackConfigList" :key="index">
        <table class="table-container" >
			<thead class="table-title">
				<th>{{ $t('activeObject') }}</th>
				<th>{{ $t('totalValidBets') }}</th>
				<th>{{ $t('giftBonus') }}</th>
			</thead>
			<tbody>
				<tr v-for="(award, awardIndex) in config.configAwardList" class="table-content">
					<td v-if="awardIndex===0" :rowspan="config.configAwardList.length" v-html="$t('registrationDepositTip',[config.registerDays,currency(config.grandTotalDeposit)])"></td>
					<td>{{ currency(award.totalValidBet) }}+</td>
					<td>{{ currency(award.giveAwayBonus)}}</td>
				</tr>
			</tbody>
		</table>
		<div class="first-list-item space"  v-if="config.configAwardList.length">
			<div class="head">
				<div class="title">{{$t('forexample')}}:</div>
			</div>
			<div class="description" v-html="$t('registrationExample',[config.registerDays,currency(config.grandTotalDeposit),currency(getExample(config.configAwardList).totalValidBet),currency(getExample(config.configAwardList).giveAwayBonus)])">

			</div>
		</div>
    </div>

</template>
<script setup lang="ts">
import {currency} from '@/utils'
defineProps({
	giftPackConfigList: {
		type: Array,
		default: []
	}
})
// 例子取中间一档（5 档取第 3 档）；档位数不固定
const getExample=(config:any[])=>{
	if (!config.length)return {}
	return config[Math.floor((config.length-1)/2)]
}
</script>
<style lang="scss" scoped>
.member-package-rule {
	:deep(.number) {
		color: var(--norm_red-color);
	}

	.first-list-item {
		padding: 20px;
		border-radius: 20px;
		background: var(--darkBg,var(--bg_color_L2));

		&.space {
			margin-top: 0.3rem;

			.head {
				justify-content: start !important;

				.title {
					color: var(--text_color_L1);
				}
			}
		}

		.head {
			display: flex;
			justify-content: center;
			margin-bottom: 14px;

			.title {
				color: var(--colorText-26);
				font-size: 30px;
				line-height: 36px;
			}
		}

		.description {
			font-size: 22px;
			color: var(--text_color_L2);
			margin-bottom: 20px;
		}
	}

	&-bonus {
		.table-head {
			padding-top: 0.5rem;
			color: var(--darkTextW, var(--text_color_L1));
			
		}

		&-title {
			display: flex;
			justify-content: center;
			color: var(--colorText-26);
			font-size: 30px;
			line-height: 36px;
			margin-top: 0.5rem;
			
		}
	}

	.table-container {
		width: 100%;
		background: var(--darkBg,var(--bg_color_L2));
		border-radius: 16px;
		overflow: hidden;
		margin-top: 0.2rem;
		

		.table-title {
			height: 80px;
			line-height: 80px;
			background: var(--sheet_nva_color);
			color: #fff;
		

			& > th {
				border: 1px solid var(--borderColor-5);
				font-size: 24px;
				text-align: center;
				width: 33.3%;
				border-right: 1px solid var(--Dividing-line_color);
			}
		}

		tbody {
			tr {
				height: 70px;
				line-height: 35px;
				font-size: 24px;
				text-align: center;
				color: var(--text_color_L1);


				&:nth-child(even) {
					background: var(--bg_color_L3);
				}

				td {
					text-align: center;
					vertical-align: middle;
					border-right: 1px solid var(--Dividing-line_color);
					text-align: center;
					vertical-align: middle;
					color: var(--text_color_L2);

					
				}
			}
		}
	}
}
</style>
