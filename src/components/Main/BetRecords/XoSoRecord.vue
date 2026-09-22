<!-- xoso下注记录 -->
<template>
	<div class="bet-container-lottery-items" v-for="item in listData" :key="item.orderNumber">
		<div class="bet-container-lottery-card">
			<div class="bet-container-lottery-card-header ar-1px-b">
				<h1>
					<h2>{{ getTitle(typeValue) }}</h2>
					<span :class="statusClass(item.status)">{{ stateText[item.status] }}</span>
				</h1>
				<p>{{ item.createTime }}</p>
			</div>
			<div class="bet-container-lottery-card-info" :class="`type${typeValue}`">
				<ul>
					<li>
						<h2><svg-icon name="round"/>{{ $t('type') }}</h2>
						<span>{{ $t('code' + item.bettingTypeNameCode) }}</span>
					</li>
					<li>
						<h2><svg-icon name="round"/>{{ $t('betNumber') }}</h2>
						<span>{{ item.issueNo }}</span>
					</li>
					<li>
						<h2><svg-icon name="round"/>{{ $t('area') }}</h2>
						<span v-if="typeValue == 'XOSO'"> {{ $t('code' + item.areNameCode) }} </span>
						<span v-else-if="typeValue == 'FXOSO'"> {{ $t('code' + item.typeCode) }} </span>
					</li>
					<li v-if="typeValue == 'XOSO'">
						<h2><svg-icon name="round"/>{{ $t('city') }}</h2>
						<span> {{ $t('code' + item.nameCode) }} </span>
					</li>

					<li>
						<h2><svg-icon name="round"/>{{ $t('orderNo') }}</h2>
						<span>{{ item.orderNo }}</span>
					</li>
					<li>
						<h2><svg-icon name="round"/>{{ $t('betAmount') }}</h2>
						<span>{{ currency(item.amount) }}</span>
					</li>
				</ul>
			</div>
		</div>
		<img src="@icon/main/moonBar.png" />
		<div class="bet">
			<div class="li betNum">
				<div class="lab">
					{{ $t('bettingnumber') }}<span class="txt" v-if="item.bettingFormat === 1">({{ $t('selectNo') }})</span>
					<span class="txt" v-if="item.bettingFormat === 2">({{ $t('xosoTxt80') }})</span>
					<span class="txt" v-if="item.bettingFormat === 3">({{ $t('xosoTxt81') }})</span>
					<!-- 选择号码 -->
					<div class="betList select" v-if="item.bettingFormat == 1">
						<span
							:class="{ active: winLottery(item.winningNum).includes(citem) }"
							v-for="(citem, cindex) in betBast(item.bettingContent)"
							:key="cindex"
						>
							{{ citem }}
						</span>
					</div>
					<div class="betList select" v-else>
						<span
							:class="{ active: winLottery(item.winningNum).includes(citem) }"
							v-for="(citem, cindex) in item.bettingContent.split(',')"
							:key="cindex"
						>
							{{ getRep(citem) }}
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="bet-container-lottery-note-box">
			<div>
				<div class="bet-container-lottery-note-box-para">
					<h3>{{ currency(item.realBettingAmount) }}</h3>
					<span>{{ $t('actualAmount') }}</span>
				</div>
			</div>
			<div>
				<div class="bet-container-lottery-note-box-para">
					<h3>{{ currency(item.winningAmount) }}</h3>
					<span>{{ $t('lotteryAmount') }}</span>
				</div>
			</div>
			<!-- <div>
				<div class="bet-container-lottery-note-box-para">
					<h3>{{ currency(item.serviceCharge) }}</h3>
					<span>{{ $t('serviceCharge') }}</span>
				</div>
			</div> -->
			<div class="last">
				<div class="bet-container-lottery-note-box-para">
					<h4 :class="item.winningAmount - item.amount > 0 && item.status !== 2 ? 'h4_green' : 'h4_red'">
						{{ item.status === 3 || item.status === 2 ? currency(item.winningAmount - item.amount) : '-' }}
					</h4>
					<span>{{ $t('profitNloss') }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
const props = withDefaults(
	defineProps<{
		listData: any
		typeValue: any
	}>(),
	{
		listData: {
			type: Array,
			default: () => []
		},
		typeValue: {
			type: Number,
			default: 0
		}
	}
)
const stateText = ref({
	1: $t('bettingResultState1'),
	2: $t('bettingResultState3'),
	3: $t('hasWon'),
	4: $t('xosoTxt74'),
	5: $t('xosoTxt75'),
	6: $t('xosoTxt76')
})
const getTitle = (x: number): string => {
	let title = ''
	switch (x) {
		case 1:
			title = 'WIN GO'
			break
		case 13:
			title = 'TRX Hash'
			break
		case 5:
			title = '5D Lotre'
			break
		case 9:
			title = 'K3 Lotre'
			break
		default:
			title = x.toString()
	}
	return title
}
const statusClass = (status: any): string => {
	if (status == '3') {
		return 'color40C592'
	}
}
// 获取本地大类,二类
// 获取游戏大类
let gameCategoryList = JSON.parse(localStorage.getItem('gameCategoryList'))
const parentType = (type: number) => {
	let item = gameCategoryList.find((item: any) => item.categoryId == type)
	// switch (type) {
	// 	case 1:
	// 		return t('xosoTab1')
	// 		break
	// 	case 2:
	// 		return t('xosoTab2')
	// 		break
	// 	case 3:
	// 		return t('xosoTab3')
	// 		break
	// 	case 4:
	// 		return t('xosoTab4')
	// 		break
	// 	case 5:
	// 		return t('xosoTab5')
	// 		break
	// 	case 6:
	// 		return t('xosoTab6')
	// 		break
	// 	case 7:
	// 		return t('xosoTab7')
	// 		break
	// 	case 8:
	// 		return t('xosoTab8')
	// 		break
	// }
	return item
}
// 获取游戏大类 根据大类获取二级
const gameType = (type: number, second: number) => {
	let parent = parentType(type)
	let item = parent.gamePlayList.find((item: any) => item.betType === second)
	return item?.playNameCode
}
// 拆解数据
const betBast = (cont: any) => {
	const bast = betList(cont) //拆解数据
	const list = betCont(bast) //组合复式数据
	return list
}

const betList = (cont: any) => {
	let list = []
	if (cont.includes(',')) {
		let arr = cont.split(',')
		let item = {}
		for (let i = 0; arr.length > i; i++) {
			item = arr[i].split('|')
			list.push(item)
		}
		return list
	}
	return cont
}

const betCont = (list: any): any => {
	let arr1 = list[0]
	let arr2 = list[1]
	let arr3 = []
	for (let i = 0; arr1.length > i; i++) {
		for (let j = 0; arr2.length > j; j++) {
			arr3.push(arr1[i] + arr2[j])
		}
	}
	let arr4 = list.slice(2)
	if (arr4.length > 0) {
		return betCont([arr3, ...arr4])
	} else {
		return arr3
	}
}
// 处理中奖标红数据
const winLottery = (cont: any) => {
	if (cont != null) {
		let list = cont.split(',')
		if (list.length > 0) {
			return list
		}
	}
	return []
}

// betCont('1|3|5,0|2|4',2);

// 字符替换 将| 替换成，
const getRep = (cont: any) => {
	return cont.replace(/\|/g, ',')
}
</script>
<style lang="scss" scoped>
.bet-container-lottery-items {
	margin-bottom: 24px;

	img {
		display: block;
		width: 100%;
		height: 44px;
	}
}

.bet-container-lottery-card {
	background: var(--darkBg,var(--bg_color_L2));
	width: 100%;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	padding: 26px 24px 26px;
}

.bet-container-lottery-card-header {
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
			color: var(--darkTextW,var(--text_color_L1));
			padding-bottom: 8px;
		}

		span {
			font-size: 28px;

			&.color40C592 {
				color: #40c592;
			}

			color: #e98613;
		}
	}

	p {
		font-size: 22px;
		color: var(--text_color_L2);
	}
}

.bet-container-lottery-card-info {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	margin-top: 25px;
	min-height: 300px;
	&.typeFXOSO{
		min-height: 250px;
	}

	img {
		width: 20px;
		height: 290px;
		margin-right: 26px;
		&.typeFXOSO{
			height: 240px;
		}
	}

	&-chessimg {
		height: 307px !important;
	}

	ul {
		width: calc(100% - 30px);
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;

		li {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24px;
			color: var(--text_color_L3);
			padding-bottom: 20px;
			position: relative;
			width: 100%;
			height: fit-content;
            position: relative;
			&:first-child{
				&::after{
					display: none;
				}
			}
			&::after{
				content: "";
				position: absolute;
				border-left: 1px dashed var(--darkLight,var(--main-color));
				height: 8px;
				top: -11px;
				left: 11px;
				html:lang(ar) &{
					left: unset;
					right: 8px;
				}
			}
			&:last-of-type {
				padding-bottom: 0 !important;
				align-items: flex-start;

				h2 {
					flex: none;
					width: fit-content;
				}

				p {
					height: fit-content;
					text-align: right;
				}
			}

			span {
				color: #595959;
				&.success {
					color: var(--norm_green-color);
				}
				&.fail {
					color: var(--norm_red-color);
				}
			}
			h2 {
				svg {
					margin-right: 10px;
				}
			}

			h3 {
				display: inline-block;
				text-align: center;
				width: 100px;
				height: 50px;
				line-height: 50px;
				color: var(--textW);
				border-radius: 10px;
				margin-left: 12px;
				background: var(--norm_green-color);
			}

			p {
				color: var(--main-color);
				height: 50px;
				display: inline-block;
				line-height: 50px;
				text-align: center;
				border-radius: 50px;
				font-weight: bold;
				font-size: 30px;
				width: 80%;
				word-wrap: break-word;
			}

			.betcontent {
				word-wrap: break-word;
			}
		}
	}
}
.bet {
	background-color: var(--darkBg, var(--bg_color_L2));
	.li {
		display: flex;
		justify-content: space-between;
		min-height: 50px;
		line-height: 50px;
		padding-left: 24px;
		&.betNum {
			flex-direction: column;
			flex-wrap: wrap;
			.lab {
				color: var(--text_color_L1);
				font-size: 28px;
				.txt {
					font-size: 28px;
					color: var(--text_color_L2);
				}
				.betList {
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					&.select {
						max-height: 425px;
						overflow-y: auto;
					}
					& > span {
						display: inline-block;
						text-align: center;
						height: 48px;
						line-height: 48px;
						width: 48px;
						color: var(--text_color_L1);
						background-color: var(--bg_color_L3);
						border-radius: 48px;
						font-size: 24px;
						margin-right: 15px;
						margin-bottom: 15px;
						&.active {
							background-color: var(--main_gradient-color);
							color: var(--textW);
						}
					}
					& > span {
						width: auto;
						padding: 0 12px;
						border-radius: 12px;
					}
				}
				width: 100%;
				&::after {
					top: 20px;
				}
				&::before {
					top: 38px;
					height: 97%;
				}
			}
		}
		.lab {
			color: var(--text_color_L2);
			position: relative;
		}
		.sub {
			color: var(--text_color_L1);
			font-size: 24px;
			& > img {
				width: 30px;
				vertical-align: -5px;
			}
			&.success {
				color: var(--bgcolor-22);
			}
			&.fail {
				color: var(--main-color);
			}
		}
	}
}
.bet-container-lottery-note {
	&-box {
		background-color: var(--darkBg, var(--bg_color_L2));
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px;
		flex-wrap: wrap;

		&-para {
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
			&.last {
				width: 100%;
			}

			span {
				font-size: 24px;
				color: var(--text_color_L2);
				display: inline-block;
				margin-top: 12px;
			}
		}
	}
}
</style>
