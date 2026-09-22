<script setup lang="ts">
import {currency} from "@/utils";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

defineProps({
	listData: {
		type: Array,
		default: () => []
	}
});

const isWinStatus = (item: any) => {
	if (item.orderStatus === 0) {
		return t('bettingResultState1')
	}
	if (item.winAmount > 0) {
		return t('bettingResultState2')
	} else {
		return t('bettingResultState3')
	}
};

const playNumberText = (item: any) => {
	let playType = item?.betContent.split('_')[0]
	if (playType.includes('First')) {
		return '1st'
	} else if (playType.includes('Second')) {
		return '2nd'
	} else {
		return '3rd'
	}
}


const playTypeText = (item: any) => {
	let playType = item.betContent.split('_')[1]
	if (!isNaN(playType)) {
		return playType
	} else {
		return playType
	}
}

const getCircleClass = (num: number) => {
	const classes = [
		'red',
		'blue-purple',
		'orange',
		'green',
		'light-blue',
		'purple',
		'brown',
		'teal',
		'medium-blue',
		'orange-red'
	]
	return classes[num - 1]
}

</script>

<template>
	<div
		class="moto-items"
		v-for="item in listData"
		:key="item.orderNumber"
	>
		<div class="moto-card">
			<div class="moto-card-header ar-1px-b">
				<h1>
					<h2>{{ item.gameName }}</h2>
					<span :class="[item.winAmount > 0 ? 'color40C592' : 'colorE98613']">
                        {{ isWinStatus(item) }}
					  </span>
				</h1>
				<p>{{ item.betTime }}</p>
			</div>
			<div class="moto-card-info">
				<ul>
					<li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("type") }}</h2>
                        </span>
						<span>{{ item.gameCode }}</span>
					</li>

					<li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betNumber") }}</h2>
                        </span>
						<span>{{ item.issueNumber }}</span>
					</li>
					<li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("orderNo") }}</h2>
                        </span>
						<span>{{ item.orderNo }}</span>
					</li>
					<li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betPick") }}</h2>
                        </span>
						<div class="moto_select">
							<span class="position-text">{{ playNumberText(item) }}</span>
							<div class="circle blue small-circle">{{ playTypeText(item)[0] }}</div>
						</div>
					</li>
					<li>
                        <span>
                          <svg-icon name="round"/>
                          <h2>{{ $t("betAmount") }}</h2>
                        </span>
						<span>{{ currency(item.betAmount) }}</span>
					</li>
				</ul>
			</div>
		</div>
		<img src="@icon/main/moonBar.png"/>
		<div class="moto-note">
			<div class="moto-note-result">
				<div class="lottery_reslut">
					<div class="tt_1">
						<svg-icon name="round"/>
						{{ $t("betResult") }}
					</div>
					<div v-if="item.orderStatus !== 0" class="moto_result">
						<span class="position-text">1st</span>
						<div v-for="num in item.openResult.split(',')" :key="num"
							 :class="['circle', getCircleClass(num)]">
							{{ num }}
						</div>
					</div>
					<h2 v-else>
						<svg-icon name="round"/>
						- -
					</h2>
				</div>
			</div>
			<div class="moto-note-box">
				<div>
					<div class="moto-note-box-para">
						<h3>{{ currency(item.validBetAmount) }}</h3>
						<span>{{ $t("actualAmount") }}</span>
					</div>
				</div>
				<div>
					<div class="moto-note-box-para">
						<h3>{{ currency(item.winAmount) }}</h3>
						<span>{{ $t("lotteryAmount") }}</span>
					</div>
				</div>
				<div>
					<div class="moto-note-box-para">
						<h3>{{ currency(item.waterAmount) }}</h3>
						<span>{{ $t("serviceCharge") }}</span>
					</div>
				</div>

				<div>

					<div class="moto-note-box-para">
						<h4
							:class="item.winLossAmount> 0 && item.orderStatus !== 0
                              ? 'h4_green'
                              : 'h4_red'
                          "
						>
							{{
								currency(item.winLossAmount)
							}}
						</h4>
						<span>{{ $t("profitNloss") }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">

.circle {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--bg_color_L2, #fff);
	font-size: 24px;
}

.red {
	background-color: #fd5358;
}

.blue-purple {
	background-color: #7b8eff;
}

.orange {
	background-color: #fbb84d;
}

.green {
	background-color: #3ac967;
}

.light-blue {
	background-color: #54b0fd;
}

.medium-blue {
	background-color: #7fadd1;
}

.teal {
	background-color: #2ad4c5;
}

.orange-red {
	background-color: #fd8654;
}

.brown {
	background-color: #b7805f;
}

.purple {
	background-color: #c36fff;
}

.blue {
	background-color: var(--main-color);
}

.colorE98613 {
	color: #e98613 !important;
}

.color40C592 {
	color: #40c592 !important;
}

.moto-items {
	margin-bottom: 24px;

	img {
		display: block;
		width: 100%;
		height: 44px;
	}

	.moto-card {
		background: var(--bg_color_L2);
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		padding: 26px 24px 26px;

		.moto-card-header {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding-bottom: 12px;

			h1 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				h2 {
					font-weight: bold;
					font-size: 30px;
					color: var(--text_color_L1);
					padding-bottom: 8px;
				}

				span {
					font-size: 28px;
					color: #e98613;
				}
			}

			p {
				font-size: 22px;
				color: var(--text_color_L2);
			}
		}
	}

	.moto-card-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 25px;

		ul {
			width: 100%;
			display: flex;
			flex-direction: column;

			li {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 24px;
				color: var(--text_color_L2);
				padding-bottom: 10px;
				position: relative;
				gap: 10px;

				&:first-child {
					&::after {
						display: none;
					}
				}

				svg {
					z-index: 10;
					width: 20px;
					height: 20px;
				}

				&::after {
					content: "";
					position: absolute;
					border-left: 1px dashed var(--darkLight, var(--main-color));
					height: 100%;
					top: -50%;
					left: 9px;
					z-index: 1;

					html:lang(ar) & {
						left: unset;
						right: 8px;
					}
				}

				&:last-of-type {
					padding-bottom: 0 !important;
				}

				span {
					display: flex;
					gap: 10px;
					color: var(--text_color_L1);

					&:last-child {
						max-width: 436px;
						word-break: break-all;
					}
				}

				h2 {
					width: fit-content;
					flex: none;
					display: flex;
					gap: 10px;
				}

				h3 {
					display: inline-block;
					text-align: center;
					width: 100px;
					height: 50px;
					line-height: 50px;
					color: var(--text_color_L1);
					border-radius: 10px;
					margin-left: 12px;
					background: var(--norm_green-color);
				}

				div {
					color: var(--main-color);
					height: 50px;
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					text-align: center;
					font-weight: bold;
					font-size: 30px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					& > div {
						margin-right: 10px;
					}

					& > div:last-child {
						margin-right: 0;
					}
				}
			}
		}

		.moto_select {
			display: flex;
			align-items: center;
			gap: 10px;

			.position-text {
				font-size: 24px;
				color: var(--text_color_L2);
			}

			.small-circle {
				width: 30px;
				height: 30px;
				font-size: 20px;
				text-align: center;
				justify-content: center;
				color: var(--text_color_L4);
			}
		}
	}

	.moto-note {
		background: var(--bg_color_L2);

		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		padding: 0 24px 26px;

		.moto-note-result {
			display: flex;
			justify-content: flex-start;
			align-items: stretch;
			padding-top: 10px;

			.tt_1 {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				gap: 10px;

				svg {
					width: 20px;
					height: 20px;
				}

				margin-bottom: 20px;
			}

			.moto_result {
				display: flex;
				align-items: center;
				gap: 6px;
			}
		}

		.moto-note-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20px 0 0 0;
			flex-wrap: wrap;

			.moto-note-box-para {
				font-size: 24px;
				display: flex;
				flex-direction: column;
				align-items: center;

				h3 {
					font-size: 28px;
					color: var(--text_color_L2);
				}

				h4 {
					font-size: 28px;
					color: var(--norm_green-color);
				}

				.h4_green {
					color: var(--norm_green-color);
				}

				.h4_red {
					color: var(--norm_red-color);
				}
			}

			& > div {
				width: 48%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 10px 0;
				background: var(--bg_color_L3);
				border-radius: 10px;
				height: 120px;

				span {
					font-size: 24px;
					color: var(--text_color_L2);
					display: inline-block;
					margin-top: 12px;
				}
			}
		}
	}

}
</style>
