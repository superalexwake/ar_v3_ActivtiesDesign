<template>
	<div class="myCommission__container" ref="containerRef">
		<NavBar :title="$t('commissionDetails')" left-arrow @click-left="onClick" />
		<van-sticky :offset-top="$u.TopHeight" :container="containerRef">
			<div class="ar-searchbar">
				<div class="ar-searchbar-type">
					<ArSelect @click-select="showDataPick = true" :selectName="dateValue || $t('pickDate')"></ArSelect>
				</div>
			</div>
		</van-sticky>
		<!-- 日期选择弹窗 -->
		<van-popup v-model:show="showDataPick" round position="bottom">
			<van-date-picker
				v-model="currentDate"
				:title="$t('pickDate')"
				@cancel="cancelDataPick"
				@confirm="onConfirmDataPick"
				:min-date="minDate"
				:max-date="maxDate"
			/>
		</van-popup>
		<div class="myCommission__container-content" v-if="Promotion?.settlementTime">
			<div class="myCommission__container-content__item" @click="router.push({ name: 'MyCommission-MyCommissionDetail',query:{date:pageQuery.date} })" >
				<div class="myCommission__container-content__item-body">
					<p class="settle">{{ $t('settlementState') }}</p>
					<span class="time">{{Promotion?.settlementTime}}</span>
					<p class="sub">{{$t('tTommission')}}</p>
					<div>
						<span>{{ $t('betPeople') }}</span>
						<span class="amount grey">{{ Promotion?.children_LotteryAmount_Users }} {{ $t('people') }}</span>
					</div>
					<div>
						<span>{{ $t('betMoney') }}</span>
						<span class="amount grey">{{ Promotion?.children_LotteryAmount }}</span>
					</div>
					<!-- <div>
						<span>{{ $t('agencyGrade') }}</span>
						<span class="level">L{{ Promotion?.rebateAmount_Last }}</span>
					</div> -->
					<div>
						<span>{{ $t('commSettlement') }}</span>
						<span class="amount orange fw">{{ Promotion.rebateAmount_Last }}</span>
					</div>
					<div>
						<span> {{$t('date')}} </span>
						<span class="amount grey">{{Promotion?.time}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PromotionReceiveList } from '@/api'
import type { ResPromotionReceiveList } from '@/types/api'
import { fixDateStr, formatTimeDay, dateRange } from '@/utils'
import dayjs from 'dayjs'

const containerRef = ref<HTMLElement>(null as any)
const router = useRouter()

const Promotion = ref<ResPromotionReceiveList|null>();
// 日期选择
const { minDate, maxDate } = dateRange(-1)
const nowDate = dayjs(maxDate).startOf('day')
const { key: dateLabel, value: dateVal } = fixDateStr()
const dateValue = ref(nowDate.format('YYYY-MM-DD'))

const currentDate = ref(dateVal)
const showDataPick = ref(false)
const pageQuery = ref<any>({
	date: nowDate.format('YYYY-MM-DD HH:mm:ss'),
})
const onConfirmDataPick = async ({ selectedOptions }: any) => {
	showDataPick.value = false
	pageQuery.value.date = dayjs(currentDate.value.join('/')).startOf('day').format('YYYY-MM-DD HH:mm:ss')
	const [{ value: year }, { value: month }, { value: day }] = selectedOptions
	dateValue.value = formatTimeDay(year, month, day)
	PromotionReceive()
}

function onClick() {
	router.back()
}
const cancelDataPick = ({ selectedOptions }: any) => {
	showDataPick.value = false
}
const PromotionReceive = async () => {
	try {
		const res = await PromotionReceiveList(pageQuery.value)
		Promotion.value = res;
	} catch (err) {
		console.log(err)
	}
}

onMounted(() => {
	PromotionReceive()
})
</script>

<style lang="scss" scoped>
.myCommission__container {
	padding-inline:  24px;
	padding-block: 0 112px;
	font-family: $font-family;

	:deep(.ar-searchbar__selector) {
		width: 100%;
	}

	.ar-searchbar {
		width: 100%;

		&-type {
			width: 100%;
		}
	}

	&-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 42px;

		&__item {
			//padding: 34px 10px;
			border-radius: 10px;
			font-size: 26px;
			font-weight: 500;
			background: var(--bg_color_L2);
			

			&-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: 10px;
				color: var(--text_color_L1);
				font-weight: 400;
				background: var(--main-color);
				height: 70px;
				line-height: 70px;
				padding: 0 10px;
				border-radius: 10px 10px 0 0;

				span {
					font-weight: 400;
					font-size: 28px;
					color: var(--textW);
				}

				.detail {
					width: 225px;
					height: 42px;
					border: 1px solid var(--main-color);
					border-radius: 20px;
					text-align: center;
					color: var(--main-color);
					font-size: 24px;
					position: relative;
				}

				.detail::after {
					content: '>';
					font-size: 30px;
					position: absolute;
					right: 35px;
					top: -5px;
				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 0.2rem;
				padding: 20px 10px;
				color: var(--text_color_L2);
				font-size: 24px;
				font-weight: 0;

				& > div {
					display: flex;
					justify-content: space-between;
					background-color: var(--bg_color_L3);

					span {
						height: 60px;
						padding: 0 20px;
						color: var(--text_color_L2);
						font-size: 24px;
						line-height: 60px;

						&:first-of-type {
							flex: 0.45;
						}
					}

					.amount {
						color: var(--norm_secondary-color);
						font-size: 30px;

						&.orange {
							color: var(--norm_secondary-color);
						}

						&.grey {
							color: var(--text_color_L1);
						}

						&.fw {
							font-weight: 600;
						}
					}

					.level {
						color: var(--main-color);
						font-size: 30px;
						font-weight: bold;
					}
				}
			}
		}
	}
}

.myCommission__container {
	padding-bottom: 0;
	font-family: 'Inter', sans-serif;

	:deep(.navbar) {
		.navbar__content {
			.navbar__content-right {
				display: flex;
				align-items: center;

				svg {
					width: 44px;
					height: 44px;
					margin-right: 5px;
				}

				span {
					color: var(--text_color_L2);
					font-size: 24px;
				}
			}
		}
	}

	&-msgWrapper {
		display: flex;
		flex-direction: column;
		gap: 24px;
		overflow: hidden;
		overflow-y: scroll;

		&__item {
			/* height: 200px; */
			padding: 20px;
			border-radius: 5px;
			background: var(--bg_color_L2);
			

			&-title {
				display: flex;
				align-items: center;

				svg {
					width: 48px;
					height: 48px;

					&:last-of-type {
						width: 36px;
						height: 36px;
						margin-left: auto;
					}
				}

				span {
					margin-left: 7px;
					font-size: 30px;
					font-weight: 600;
				}
			}

			&-time {
				margin-block: 8px 28px;
				color: var(--text_color_L2);
				font-size: 24px;
				font-weight: 400;
			}

			&-content {
				color: var(--text_color_L2);
				font-size: 24px;
				font-weight: 400;
				word-break: break-word;
			}
		}
	}

	&-empty {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
