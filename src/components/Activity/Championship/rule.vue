<template>
	<van-collapse v-model="activeNames" class="rule">
		<van-collapse-item name="1">
			<template #title>
				<div class="title">{{ $t('cpsTip5').toLocaleUpperCase() }}</div>
			</template>
			<div class="con">
				<h1>
					<span>{{ $t('cpsTip11') }}</span>
				</h1>
				<div v-html="$t('cpsTip12', [getSlotTitle(data.vendorCode), data.startTime, data.endTime])"></div>

				<h1>
					<span>{{ $t('awardAmount') }}</span>
				</h1>
				<div>
					{{ $t('cpsTip13') }}<span>{{ currency(data.sumBonus || 0) }}</span>
				</div>

				<h1>
					<span>{{ $t('cpsTip14') }}</span>
				</h1>
				<div>
					<div v-html="$t('cpsTip15', [getSlotTitle(data.vendorCode)])"></div>
					<div class="condition">
						<p v-if="data.conditionsBetAmount > 0">
							{{ $t('betAmounts') }} <span>{{ currency(data.conditionsBetAmount || 0) }}</span>
						</p>
						<p v-if="data.conditionsRechargeAmount > 0">
							{{ $t('rechageAmount') }} <span>{{ currency(data.conditionsRechargeAmount || 0) }}</span>
						</p>
						<p v-if="data.conditionsBindType">
							{{ $t('toBind') }} <span>{{ type[data.conditionsBindType] }}</span>
						</p>
						<template
							v-if="data.conditionsBetAmount == 0 && data.conditionsRechargeAmount == 0 && !data.conditionsBindType"
						>
							{{ $t('cpsTip10') }}
						</template>
					</div>
				</div>

				<h1>
					<span>{{ $t('binguoPaimin') }}</span>
				</h1>
				<div class="ranking">
					<div class="top">
						<span>{{ $t('binguoPaimin') }}</span>
						<span>{{ $t('k3WarningTip4') }}</span>
					</div>
					<div class="info" v-for="(item, index) in data.rankingAwardsList" :key="index">
						<span>{{ setRank(item.startRanking, item.endRanking) }}</span>
						<span>{{ currency(item.awardsAmount || 0) }}</span>
					</div>
					<Empty v-if="data.rankingAwardsList.length == 0" />
				</div>

				<h1>
					<span>{{ $t('cpsTip16') }}</span>
				</h1>
				<div>
					<p>{{ $t('cpsTip17') }}</p>
					<p>{{ $t('cpsTip18') }}</p>
				</div>
				<h1>
					<span>{{ $t('cpsTip19') }}</span>
				</h1>
				<p>
					<span>{{ getSlotTitle(data.vendorCode) }}</span>
				</p>
			</div>
		</van-collapse-item>
	</van-collapse>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { currency, getSlotTitle } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useChampionship } from '@/hooks'
import Empty from '@/components/Empty/index.vue'
withDefaults(
	defineProps<{
		data?: any
	}>(),
	{}
)
const { t } = useI18n()
const activeNames = ref(['0'])
const { type } = useChampionship()
function setRank(start: number, end: number) {
	if (start == end) return t('cpsTip20', [start])
	else return t('cpsTip21', [start, end])
}
</script>
<style lang="scss" scoped>
.rule {
	margin-top: 40px;
	:deep(.van-cell) {
		background-color: var(--main-color);
		.van-cell__right-icon {
			color: var(--text_color_L4);
		}
	}
	.title {
		color: var(--text_color_L4);
		font-size: 30px;
		font-weight: 700;
		letter-spacing: 1.2px;
		text-align: center;
	}

	:deep(.van-collapse-item__wrapper) {
		margin-top: 15px;
	}

	.con {
		color: var(--text_color_L2);
		font-size: 24px;

		@mixin titleS {
			content: '';
			display: block;
			position: absolute;
			top: 0px;
			width: 20px;
			height: 46px;
			background-color: var(--light-main-color, var(--bg_color_L3));
			clip-path: polygon(50% 0%, 90% 0%, 40% 50%, 90% 100%, 50% 100%, 0% 50%);
			z-index: 5;
		}

		h1 {
			position: relative;
			margin-bottom: 10px;

			> span {
				width: 93%;
				margin: 0 auto;
				padding: 5px 0;
				color: #fff;
				font-size: 24px;
				text-align: center;
				background-color: var(--light-main-color, var(--bg_color_L3));
				clip-path: polygon(2% 0%, 98% 0%, 100% 50%, 98% 100%, 2% 100%, 0% 50%);
				display: block;
			}

			&::before {
				@include titleS;
				left: calc((100% - 93%) - 30px);
				transform: translateX(-50%);
			}

			&::after {
				@include titleS;
				left: calc(93% + 30px);
				transform: translateX(-50%) rotate(180deg);
			}
		}

		> div,
		> p {
			margin-bottom: 30px;
			span,
			:deep(span) {
				color: var(--norm_red-color);
			}
		}

		p {
			position: relative;
			padding-left: 20px;
			margin-bottom: 10px;
			color: var(--text_color_L1);

			&::after {
				position: absolute;
				content: '';
				width: 10px;
				height: 10px;
				transform: rotate(45deg);
				background: var(--main-color);
				left: 0px;
				top: 14px;
			}
		}

		.condition {
			border: 1px solid var(--Dividing-line_color);
			border-radius: 10px;
			padding: 20px 30px;
		}

		.ranking {
			border-radius: 10px;
			overflow: hidden;
			> div {
				display: flex;
				padding: 15px 0;

				> span {
					width: 50%;
					text-align: center;
					word-break: break-all;
				}

				&.top {
					background: var(--sheet_nva_color);

					> span {
						color: #fff;
					}
				}

				&.info {
					border-bottom: 1px solid var(--borderColor-5);
					border-left: 1px solid var(--borderColor-5);
					border-right: 1px solid var(--borderColor-5);
					font-size: 28px;

					> span:first-of-type {
						color: var(--text_color_L2);
					}
					&:nth-child(odd) {
						background-color: var(--sheet_detail_bg_color);
					}
					> span:last-of-type {
						font-weight: 500;
					}
				}
			}
		}
	}
}
</style>