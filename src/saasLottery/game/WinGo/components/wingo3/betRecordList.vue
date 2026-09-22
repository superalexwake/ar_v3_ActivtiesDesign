<template>
	<div class="wingo-record-list">
		<div class="list">
			<div v-for="(item, index) in mayrecord" :key="index">
				<div class="list-item" @click.stop.prevent="Emerd(index)">
					<div class="list-item-l">
						<div :class="['list-item-l-' + formatBet(item.betContent).toLocaleLowerCase()]">
							{{ formatBet2(item.betContent) }}
						</div>
					</div>
					<div class="list-item-m">
						<div class="list-item-m-top">
							{{ item.issueNumber }}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								:class="{ r: index == showIndexRe }"
								width="9"
								height="8"
								viewBox="0 0 9 8"
								fill="none"
							>
								<path
									d="M5.21907 7.57895C4.89494 8.14035 4.08463 8.14035 3.7605 7.57895L0.114077 1.26316C-0.210049 0.701754 0.195109 -5.66721e-08 0.843362 0L8.13621 6.37561e-07C8.78446 6.94233e-07 9.18962 0.701755 8.86549 1.26316L5.21907 7.57895Z"
									fill="#323536"
								/>
							</svg>
						</div>
						<div class="list-item-m-bottom">{{ fromTime(item.betTime) }}</div>
					</div>
					<div v-if="item.state != 2" class="list-item-r" :class="{ success: item.state }">
						<div :class="{ success: item.state }">
							{{ item.state ? t('success') : t('fail') }}
						</div>
						<span>{{ `${item.state ? '+' : ''}${currency(item.state ? item.winLoseAmount + item.amount : item.winLoseAmount)}` }}</span>
					</div>
				</div>
				<div v-if="index == showIndexRe" class="list-detail">
					<div class="list-detail-text">{{ t('detailMay') }}</div>
					<div class="list-detail-line">
						<span>{{ t('orderNoMay') }}</span>
						<div class="list-detail-copy" @click="copy(item.orderNo)">
							{{ item.orderNo }}
							<svg class="copy_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
								<path
									d="M6.5 6.2158V3.90625C6.5 3.1296 7.1296 2.5 7.90625 2.5H20.0938C20.8704 2.5 21.5 3.1296 21.5 3.90625V16.0938C21.5 16.8704 20.8704 17.5 20.0938 17.5H17.7582"
									stroke="#666666"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M16.0938 6.5H3.90625C3.1296 6.5 2.5 7.1296 2.5 7.90625V20.0938C2.5 20.8704 3.1296 21.5 3.90625 21.5H16.0938C16.8704 21.5 17.5 20.8704 17.5 20.0938V7.90625C17.5 7.1296 16.8704 6.5 16.0938 6.5Z"
									stroke="#666666"
									stroke-width="2"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('issueMay') }}</span>
						<div>{{ item.issueNumber }}</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('amountMay') }}</span>
						<div>{{ currency(item.amount) }}</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('numMay') }}</span>
						<div>{{ item.betMultiple }}</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('afterTaxAmount') }}</span>
						<div class="red">{{ currency(item.realAmount) }}</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('tax') }}</span>
						<div>{{ currency(item.fee) }}</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('resultMay') }}</span>
						<div v-if="item.number">
							<div class="list-inlineB">{{ item.number }}</div>
							<div class="list-inlineB" :class="[cssTextColor(Number(item.number))]">
								{{ changeTextColor(Number(item.number)) }}
							</div>
							<div class="list-inlineB violet" v-if="item.number == 0 || item.number == 5">
								{{ t('purpleColor') }}
							</div>
							<div class="list-inlineB" :class="[Number(item.number) > 4 ? 'big' : 'small']">
								{{ Number(item.number) > 4 ? t('betBig') : t('betSmall') }}
							</div>
						</div>
						<div v-else>--</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('selectMay') }}</span>
						<div>
							{{ item.playType == 'Num' ? formatBet(item.betContent) : changeTextSelect(item.betContent) }}
						</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('statusMay') }}</span>
						<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
							{{ item.state ? t('success') : t('fail') }}
						</div>
						<div v-else>{{ t('k3RecordDesc9') }}</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('winOrLose') }}</span>
						<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
							{{ `${item.state ? '+' : ''} ${currency(item.state ? item.winLoseAmount + item.amount : item.winLoseAmount)}` }}
						</div>
						<div v-else>--</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('createTime') }}</span>
						<div>{{ fromTime(item.betTime, 'YYYY-MM-DD HH:mm:ss') }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { currency, copy, fromTime } from '@/saasLottery/utils'

const { t } = useI18n()
defineProps<{ mayrecord: any[] }>()

// 展开的行索引
const showIndexRe = ref(-1)

// 投注内容映射（大/小）
const betMap = {
	Big: { name: t('betBig'), code: 'Big' },
	Small: { name: t('betSmall'), code: 'Small' },
}
// 点击展开/收起详情
const Emerd = (index: number) => {
	showIndexRe.value = showIndexRe.value === index ? -1 : index
}
// 行左侧标记文字（取 betContent 第二段）
const formatBet = (betContent: string) => {
	if (!betContent) return ''
	return betContent?.split('_')[1]
}
const formatBet2 = (betContent: string) => {
	if (!betContent) return ''
	if (betContent?.split('_')[0] === 'Color') return ' '
	if (['Big', 'Small'].includes(betContent?.split('_')[1])) {
		return betMap[betContent?.split('_')[1]]?.name
	}
	return betContent?.split('_')[1]
}
// 详情「选择」文字转换
const changeTextSelect = (text: String) => {
	switch (text) {
		case 'BigSmall_Small': return t('small')
		case 'BigSmall_Big': return t('big')
		case 'Color_Green': return t('green')
		case 'Color_Violet': return t('purpleColor')
		case 'Color_Red': return t('redColor')
		default: return text
	}
}
// 开奖号码颜色文字
const changeTextColor = (num: number) => (num % 2 === 1 ? t('betGreen') : t('betRed'))
// 开奖号码颜色 class
const cssTextColor = (num: number) => (num % 2 === 1 ? 'green' : 'red')
</script>

<style lang="scss" scoped>
.wingo-record-list {
	// 与旧版独立记录页对齐：列表卡片背景 + 左右内缩
	background: var(--darkBg, var(--bg_color_L2));
	padding: 0 24px;
	.list {
		& > div {
			// 条目间分隔线（旧版有），最后一条去掉
			border-bottom: 1px solid var(--bg_color_L3);
			&:last-child {
				border-bottom: none;
			}
		}
		&-item {
			height: 132px;
			display: flex;
			align-items: center;

			&-l {
				height: 82px;
				width: 92px;
				line-height: 82px;
				text-align: center;
				border-radius: 20px;
				color: #fff;
				font-size: 48px;
				margin-right: 22px;
				flex: none;
				overflow: hidden;
				& > div {
					height: 100%;
					width: 100%;
				}
				&-red,
				&-2,
				&-4,
				&-6,
				&-8 {
					background-color: var(--norm_red-color);
				}

				&-violet {
					background-color: var(--norm_Purple-color);
				}

				&-green,
				&-1,
				&-3,
				&-7,
				&-9 {
					background-color: var(--norm_green-color);
				}

				&-0 {
					background-image: linear-gradient(
						to bottom right,
						var(--norm_red-color) 50%,
						var(--norm_Purple-color) 0
					) !important;
				}

				&-5 {
					background-image: linear-gradient(
						to bottom right,
						var(--norm_green-color) 50%,
						var(--norm_Purple-color) 0
					) !important;
				}

				&-small {
					background: var(--norm_bule-color);
					font-size: 22px;
				}

				&-big {
					background: var(--norm_secondary-color);
					font-size: 22px;
				}
			}

			&-m {
				flex: none;
				height: fit-content;
				&-top {
					height: 42px;
					line-height: 42px;
					font-size: 28px;
					font-weight: 500;
					color: var(--darkTextW, var(--text_color_L1));
					display: flex;
					gap: 10px;
					align-items: center;
					svg {
						width: 9px;
						height: 9px;
						&.r {
							transform: rotateZ(180deg);
						}
					}
				}

				&-bottom {
					height: 36px;
					line-height: 36px;
					font-size: 24px;
					color: #929292;
				}
			}

			&-r {
				flex: 1;
				font-size: 24px;
				height: fit-content;
				display: flex;
				align-items: flex-end;
				justify-content: center;
				flex-direction: column;
				color: var(--norm_red-color);

				span {
					word-wrap: break-word;
					word-break: break-all;
					height: 36px;
					line-height: 48px;
				}

				div {
					color: var(--norm_red-color);
					border: 1px solid var(--norm_red-color);
					border-radius: 10px;
					width: 150px;
					text-align: center;
					height: 48px;
					line-height: 48px;
					font-size: 22px;
					margin-bottom: 6px;
				}

				&.success {
					color: #13c164;
					div {
						color: var(--norm_green-color);
						border-color: var(--norm_green-color);
					}
				}
			}
		}

		&-inlineB {
			display: inline-block;

			& + div {
				margin-left: 16px;
			}

			&.big {
				color: #f8b460;
			}

			&.small {
				color: #609dec;
			}

			&.green {
				color: #13c164;
			}

			&.red {
				color: #f23f3f;
			}

			&.violet {
				color: #a043e8;
			}
		}

		&-detail {
			display: flex;
			flex-direction: column;
			&-text {
				font-size: 28px;
				color: var(--darkTextW, var(--text_color_L1));
				font-weight: 500;
				line-height: 39px;
				padding-bottom: 12px;
			}

			&-copy {
				svg {
					width: 40px;
					height: 40px;
				}
			}

			&-line {
				height: auto;
				line-height: 50px;
				padding: 0 5px;
				background-color: var(--bgDark-3, var(--bg_color_L3));
				color: var(--text_color_L2);
				font-size: 28px;
				border-radius: 10px;
				margin-bottom: 16px;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				& > span {
					color: var(--text_color_L1);
				}

				& > div {
					display: flex;
					align-items: center;
				}

				img {
					width: 30px;
					height: 30px;
					margin-left: 5px;
				}

				.red {
					color: var(--norm_red-color);
				}

				.green {
					color: var(--norm_green-color);
				}
			}
		}
	}
}
</style>
