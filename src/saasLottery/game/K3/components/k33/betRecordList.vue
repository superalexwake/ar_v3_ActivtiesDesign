<template>
	<div class="k3-record-list">
		<div class="list">
			<div v-for="(item, index) in mayrecord" :key="index">
				<div class="list-item" @click.stop.prevent="Emerd(index)">
					<div :class="['list-item-l', betColorClass(item)]">
						<div :class="['list-item-l-color']">
							{{ formatBet(item) }}
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
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13 12V6H34V29H28" stroke="#929292" stroke-width="2" stroke-linejoin="round" />
								<rect x="6" y="12" width="22" height="22" stroke="#929292" stroke-width="2" stroke-linejoin="round" />
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
					<!-- K3 特有的结果渲染：开奖骰子点数图（number1~number6 CSS 精灵图） -->
					<div class="list-detail-line">
						<span>{{ t('resultMay') }}</span>
						<div class="list-premium" v-if="item.number">
							<div v-for="(num, index) in item.premium" :key="index" :class="'number' + num"></div>
						</div>
						<div v-else>--</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('selectMay') }}</span>
						<div :class="{ 'list-detail-row': formatSelect(item)?.length > 1 }" class="itemEnd">
							<span class="list-detail-bet" v-for="text of formatSelect(item)">
								{{ text }}
							</span>
						</div>
					</div>
					<div class="list-detail-line">
						<span>{{ t('statusMay') }}</span>
						<div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
							{{ item.state ? t('success') : t('fail') }}
						</div>
						<div v-else>{{ t('notOpen') }}</div>
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
						<div>{{ fromTime(item.betTime) }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { currency } from '@/utils'
import { copy, fromTime } from '@/saasLottery/utils'

const { t } = useI18n()
defineProps<{ mayrecord: any[] }>()

// 展开的行索引
const showIndexRe = ref(-1)

// 玩法文案映射：和值大小/和值奇偶/总和/围骰/组合/单式/大小/奇偶
const betMap = {
	SumOddEven: { name: `${t('common.even')}${t('common.odd')}`, code: 'SumOddEven' },
	SumBigSmall: { name: `${t('common.big')} ${t('common.small')}`, code: 'SumBigSmall' },
	SumNum: { name: t('totalBet'), code: 'SumNum' },
	NumSame2: { name: t('sameNum'), code: 'NumSame2' },
	NumSame2Mult: { name: t('sameNum'), code: 'NumSame2Mult' },
	NumSame3: { name: t('k3RecordDesc4'), code: 'NumSame3' },
	NumSame3All: { name: t('k3bet3Desc4'), code: 'NumSame3All' },
	NumDiff3: { name: t('trendTXT1'), code: 'NumDiff3' },
	NumNear3All: { name: t('trendTXT2'), code: 'NumNear3All' },
	NumDiff2: { name: t('k3RecordDesc8'), code: 'NumDiff2' },
	Odd: { name: t('betOdd'), code: 'Odd' },
	Even: { name: t('betEven'), code: 'Even' },
	Big: { name: t('betBig'), code: 'Big' },
	Small: { name: t('betSmall'), code: 'Small' },
}

// 指定号码类(紫色):值为单注的号码段数,二不同选 2 个号、三不同选 3 个号仍是一注
const PURE_NUM: Record<string, number> = { NumSame2: 1, NumSame3: 1, NumDiff2: 2, NumDiff3: 3 }

const parseBet = (betContent: string) => {
	const content = betContent.split(',')
	const [playType, ...bets] = content[0].split('_')
	const types = content.map((s: string) => s.split('_')[0])
	return {
		playType,
		playBet: bets[0],
		bets,
		types,
		isPureNum: types.every((t: string) => PURE_NUM[t] !== undefined),
		// 二同一不同(NumSame2Mult)一条 betContent 即一注,显号码拼接;含逗号才多注
		single: content.length === 1 && (playType === 'NumSame2Mult' || bets.length === (PURE_NUM[playType] ?? 1))
	}
}

// NumSame2Mult_22_3 → [22,3];对子/豹子与其单号奇偶一致
const betNums = (betContent: string): number[] =>
	betContent.split(',').flatMap((s: string) => s.split('_').slice(1)).filter((v: string) => /^\d+$/.test(v)).map(Number)

const multiColor = (nums: number[]): string => {
	const hasOdd = nums.some((n: number) => n % 2 === 1)
	const hasEven = nums.some((n: number) => n % 2 === 0)
	if (hasOdd && hasEven) return 'betClMultiMixed'
	return hasOdd ? 'betClMultiOdd' : 'betClMultiEven'
}

const formatBet = (item: Record<string, any>) => {
	if (!item?.betContent) return ''
	const { playBet, bets, single } = parseBet(item.betContent)
	if (!single) return t('betMulti')
	if (['Big', 'Small', 'Even', 'Odd'].includes(playBet)) return betMap[playBet]?.name
	return bets.join('')
}
// 左侧色块背景色：按玩法而非数字文本判断
const betColorClass = (item: Record<string, any>) => {
	if (!item?.betContent) return ''
	const { playType, playBet, types, isPureNum, single } = parseBet(item.betContent)
	if (isPureNum) return 'betClSame'
	if (types.includes('NumSame2Mult')) return 'betClMultiMixed' // 二同一不同(单注或混合)→ 红绿
	// 纯和值多选按奇偶;跨类混合 → 红绿混色
	if (!single) return types.every((t: string) => t === 'SumNum') ? multiColor(betNums(item.betContent)) : 'betClMultiMixed'
	if (['Big', 'Small', 'Even', 'Odd'].includes(playBet)) return `betCl${playBet}`
	if (playType === 'SumNum') return Number(playBet) % 2 === 0 ? 'betClEvenNum' : 'betClOddNum'
	// 任意三同(AAA)/三连号(ABC)→ 红
	return 'betClCombo'
}

const formatSelect = (item: Record<string, any>) => {
	if (!item) return ''
	const list: string[] = []
	const content = item.betContent.split(',')
	content.forEach((item: string) => {
		const [key, ...other] = item.split('_')
		if (['Big', 'Small', 'Even', 'Odd'].includes(String(other))) {
			list.push(`${betMap[key]?.name} | ${betMap[other.join(',')]?.name}`)
		} else {
			list.push(`${betMap[key]?.name} | ${other.join(',')}`)
		}
	})
	return list
}
// 点击展开/收起详情
const Emerd = (index: number) => {
	showIndexRe.value = showIndexRe.value === index ? -1 : index
}
</script>

<style lang="scss" scoped>
.k3-record-list {
	padding: 0 20px 24px;
	background: var(--darkBg, var(--bg_color_L2));
	color: var(--darkTextW, var(--text_color_L1));

	.list {
		&-premium {
			display: flex;
			align-items: center;
			gap: 10px;
			div {
				width: 32px;
				height: 32px;
				background-size: cover;
			}
			// K3 骰子点数图：独立页不加载游戏视图 k33/index.vue，需自带这套 .number{n} 背景图
			.number1 { background: url('@game/K3/assets/k33/AllGames/n1.png'); background-size: cover; }
			.number2 { background: url('@game/K3/assets/k33/AllGames/n2.png'); background-size: cover; }
			.number3 { background: url('@game/K3/assets/k33/AllGames/n3.png'); background-size: cover; }
			.number4 { background: url('@game/K3/assets/k33/AllGames/n4.png'); background-size: cover; }
			.number5 { background: url('@game/K3/assets/k33/AllGames/n5.png'); background-size: cover; }
			.number6 { background: url('@game/K3/assets/k33/AllGames/n6.png'); background-size: cover; }
		}

		&-item {
			height: 132px;
			display: flex;
			align-items: center;

			&-l {
				height: 72px;
				width: 72px;
				line-height: normal;
				text-align: center;
				border-radius: 20px;
				color: #fff;
				font-size: 48px;
				margin-right: 22px;
				flex: none;
				background-color: var(--main-color);
				font-size: 24px;
				display: flex;
				justify-content: center;
				align-items: center;
				word-wrap: break-word;
				word-break: break-all;
				&.betClBig {
					background-color: var(--norm_secondary-color);
				}

				&.betClSmall {
					background-color: var(--norm_bule-color);
				}

				&.betClOdd {
					background: var(--norm_red-color);
				}

				&.betClEven {
					background: var(--norm_green-color);
				}
				&-num {
					font-size: 24px;
				}
				// same 类（22、33、444）
				&.betClSame {
					background: var(--norm_Purple-color);
				}
				// 数字：奇数红、偶数绿
				&.betClOddNum {
					background: var(--norm_red-color);
				}
				&.betClEvenNum {
					background: var(--norm_green-color);
				}
				// 组合类（Combo、AAA、连号）
				&.betClCombo {
					background: var(--norm_red-color);
					font-size: 20px;
					font-weight: 400;
				}
				&.betClMultiOdd {
					background: var(--norm_red-color);
					font-size: 20px;
					font-weight: 400;
				}
				&.betClMultiEven {
					background: var(--norm_green-color);
					font-size: 20px;
					font-weight: 400;
				}
				&.betClMultiMixed {
					background: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_green-color) 50%);
					font-size: 20px;
					font-weight: 400;
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
					color: var(--text_color_L1);
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
					border-radius: 8px;
					width: 150px;
					text-align: center;
					height: 48px;
					line-height: 48px;
					font-size: 24px;
					min-width: 116px;
				}
				&.success {
					span {
						color: var(--norm_green-color);
					}
				}

				.success {
					color: var(--norm_green-color);
					border: 1px solid var(--norm_green-color);
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
			&-row {
				flex-direction: column;

				&.itemEnd {
					align-items: end;
				}
			}
			&-bet {
				line-height: 44px;
				text-align: right;
			}
			&-text {
				font-size: 28px;
				color: var(--text_color_L2);
				font-weight: 500;
				line-height: 39px;
				padding-bottom: 10px;
			}
			&-copy {
				color: var(--text_color_L2);
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
				font-size: 24px;
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
				.red {
					color: #f23f3f;
				}

				.green {
					color: #13c164;
				}
			}
		}
	}
}
</style>
