<template>
	<div class="Betting__C">
		<div v-show="isShowMark" class="Betting__C-mark">
			<div>{{ props.currentInfo.time3 || '0' }}</div>
			<div>{{ props.currentInfo.time4 || '0' }}</div>
		</div>
		<div class="Betting__C-head">
			<div class="Betting__C-head-g" @click="betting(11, '#5CBA47', 0)">{{ $t('greenColor') }}</div>
			<div class="Betting__C-head-p" @click="betting(12, '#9831E9', 0)">{{ $t('purpleColor') }}</div>
			<div class="Betting__C-head-r" @click="betting(10, '#FB4E4E', 0)">{{ $t('redColor') }}</div>
		</div>
		<div class="Betting__C-numC">
			<div
				v-for="(item, index) in 10"
				:key="index"
				:class="[randomNum == item ? 'active' : '', 'Betting__C-numC-item' + index]"
				@click="betting(index, 'color' + index, 1)"
			></div>
		</div>
		<div class="Betting__C-multiple">
			<div class="Betting__C-multiple-l" @click="random">{{ $t('randomBet') }}</div>
			<div
				v-for="(item, index) in multipleList"
				:key="index"
				class="Betting__C-multiple-r"
				@click="TaskCount(item)"
				:class="{ active: selectInfo.count == item }"
			>
				X{{ item }}
			</div>
		</div>
		<div class="Betting__C-foot">
			<div class="Betting__C-foot-b" @click="betting(13, '#ffc511', 2)">{{ $t('big') }}</div>
			<div class="Betting__C-foot-s" @click="betting(14, '#5CBA47', 2)">{{ $t('small') }}</div>
		</div>
		<BettingPopup
			:currentGame="currentGame"
			:selectInfo="selectInfo"
			:bettingPopupShow="bettingPopupShow"
			:betTypeList="betTypeList"
			:multipleList="multipleList"
			@clearBetting="clearBetting"
			@submitBetting="submitBettingData"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BettingPopup from '@/components/common/BettingPopup.vue'
import { AwaitApiResult } from '@/utils'
import { showToast } from 'vant'
import i18n from '@/languages'
const t = i18n.global.t

const emit = defineEmits<{
	(e: 'betting', val: string): void
	(e: 'changeBettingP', val: boolean): void
}>()
const props = defineProps({
	currentInfo: {
		// 当期游戏期号，以及倒计时时间等参数。
		type: Object,
		default: () => ({})
	},
	ProhibitBuyTime: {
		// 倒计时判断时间，单位秒，判断倒数几秒展示倒计时框
		type: Number,
		default: 5
	},
	currentGame: {
		// 当前选中游戏
		type: Object,
		default: () => ({})
	},
	bettingApiFun: {
		type: Function,
		required: true
	}
})
const multipleList = computed(() => {
	return props.currentGame.betMultiple.split('|')
})
const bettingPopupShow = ref(false)
const selectCon = ref('')
const selectInfo = ref<{
	coin: number
	count: number
	allCoin: number
	gametype: number
	typeid: number
	issuenumber: string
	selecttype: string | number
}>({
	coin: 0, //下注金额
	count: multipleList.value[0], //下注倍数
	allCoin: 0, //下注总额
	gametype: 0, //类型 0 颜色 1数字 2大小
	typeid: 1, //台号1Min 3Min 5Min 10Min
	issuenumber: '2020', //期号
	selecttype: 1 //下注内容
})
watch(
	() => multipleList,
	() => {
		selectInfo.value.count = multipleList.value[0]
	},
	{ deep: true, immediate: true }
)
const randomIntv = ref<NodeJS.Timeout | null>(null)
// 随机投注参数
const randomNum = ref(0)
//随机投注加锁
const randomLock = ref(false)
// 是否展示倒计时弹窗，如果展示，就关闭投注页面
const isShowMark = computed(() => {
	if (props.currentInfo.passTime < props.ProhibitBuyTime) {
		clearBetting()
	}
	return props.currentInfo.passTime < props.ProhibitBuyTime
})
// 当前游戏id
const TypeID = computed(() => {
	return props.currentGame.typeID
})
// 解析后端返回参数，展示每份金额列表
const betTypeList = computed(() => {
	return props.currentGame.scope ? props.currentGame.scope.split('|').map((sc: string): number => Number(sc)) : []
})

// 购买份数切换
const TaskCount = (item: number) => {
	selectInfo.value.count = item
	setAllCoin()
}
// 计算总金额
const setAllCoin = () => {
	selectInfo.value.allCoin = selectInfo.value.coin * selectInfo.value.count
}

// 下注
// 游戏内容，颜色，游戏类型 0颜色，1数字，2大小
const betting = (con: any, color: any, type: any) => {
	selectInfo.value.gametype = type //选择的是 颜色1 数字2 大小3
	selectInfo.value.selecttype = con //选择游戏内容
	selectInfo.value.issuenumber = props.currentInfo.gameNo //期号
	selectInfo.value.typeid = TypeID.value //几分钟的游戏
	selectInfo.value.coin = betTypeList.value[0]
	selectCon.value = con
	bettingPopupShow.value = true
}

// 随机买数字
const random = () => {
	if (randomLock.value) return
	randomLock.value = true
	if (!randomIntv.value) {
		randomIntv.value = setInterval(function () {
			randomNum.value = Math.floor(Math.random() * 11)
		}, 50)
	}
	setTimeout(function () {
		if (randomNum.value > 9) randomNum.value = 9
		clearInterval(randomIntv.value as NodeJS.Timeout)
		randomLock.value = false
		randomIntv.value = null
		betting(randomNum.value, 'color' + randomNum.value, 1)
	}, 5000)
}
// 关闭投注弹窗，并清理相关数据。
const clearBetting = () => {
	if (!bettingPopupShow.value) return
	bettingPopupShow.value = false
	selectInfo.value.coin = betTypeList.value[0]
	selectInfo.value.count = multipleList.value[0]
	setAllCoin()
	emit('changeBettingP', bettingPopupShow.value)
}
// 提交投注参数。
const submitBettingData = async () => {
	const res = await AwaitApiResult<any>(
		props.bettingApiFun({
			typeId: selectInfo.value.typeid,
			issuenumber: selectInfo.value.issuenumber,
			amount: selectInfo.value.coin,
			betCount: Number(selectInfo.value.count),
			gameType: selectInfo.value.gametype,
			selectType: selectInfo.value.selecttype
		})
	)
	if (res?.code === 0) {
		showToast(t('code' + res.msgCode))
		emit('betting', selectInfo.value.issuenumber)
		clearBetting()
	}
}
defineExpose({
	bettingPopupShow
})
</script>
<style lang="scss" scoped>
.Betting__C {
	height: 571px;
	width: calc(100% - 52px);
	margin: 22px auto 0;
	background: var(--darkBg,var(--bg_color_L2));
	box-shadow: var(--boxShadowColor-35);
	border-radius: 20px;
	padding: 14px 20px 19px 14px;
	position: relative;

	&-mark {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.60);
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		color: var(--main-color);
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		html:lang(ar) &{
			left: unset;
			right: 0;
			direction: ltr;
		}
		& > div {
			display: inline-block;
			border-radius: 30px;
			padding: 0 30px;
			background-color: var(--bg_color_L3);
			font-weight: 700;
			font-size: 280px;

			& + div {
				margin-left: 78px;
			}
		}
	}

	&-head {
		height: 70px;
		display: flex;
		justify-content: space-between;

		& > div {
			width: calc((100% - 60px) / 3);
			height: 70px;
			line-height: 70px;
			font-weight: 500;
			font-size: 28px;
			color: #fff;
			text-align: center;
		}

		&-g {
			background: var(--norm_green-color);
			border-radius: 0px 20px 0px 20px;
			box-shadow: var(--boxShadowColor-48);
		}

		&-p {
			background: var(--norm_Purple-color);
			box-shadow: var(--boxShadowColor-49);
			border-radius: 10px;
		}

		&-r {
			background: var(--norm_red-color);
			border-radius: 20px 0 20px 0;
			box-shadow: var(--boxShadowColor-red);
		}
	}

	&-numC {
		height: 260px;
		margin-top: 26px;
		background: var(--bg_color_L1);
		border-radius: 20px;
		padding: 13px 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		& > div {
			width: 110px;
			height: 50%;
			border-radius: 50%;
			font-weight: 400;
			text-align: center;
			background-repeat: no-repeat;
			background-size: 110px;
			background-position: center;

			&.active {
				transform: scale(0.9);
			}

			$list: 0 1 2 3 4 5 6 7 8 9;

			@each $i in $list {
				&.Betting__C-numC-item#{$i} {
					background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/n#{$i}.png');
				}
			}
		}
	}

	&-multiple {
		margin-top: 22px;
		height: 68px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&-l {
			width: 160px;
			height: 68px;
			line-height: 68px;
			text-align: center;
			border: 2px solid var(--darkLight,var(--norm_red-color));
			border-radius: 16px;
			font-size: 28px;
			color: var(--darkLight,var(--norm_red-color));
		}

		&-r {
			height: 60px;
			width: 74px;
			line-height: 60px;
			font-size: 24px;
			color: var(--darkTextW,var(--text_color_L2));
			background: var(--bgDark-4,var(--bg_color_L1));
			border-radius: 16px;
			text-align: center;

			&.active {
				background: var(--norm_green-color);
				color: #fff;
			}
		}
	}

	&-foot {
		height: 72px;
		display: flex;
		margin-top: 20px;
		justify-content: center;

		&-b,
		&-s {
			width: 310px;
			height: 72px;
			line-height: 72px;
			text-align: center;
			font-size: 32px;
			color: #fff;
		}

		&-b {
			background-color: var(--norm_secondary-color);
			border-radius: 40px 0px 0px 40px;
		}

		&-s {
			background: var(--norm_bule-color);
			border-radius: 0 40px 40px 0;
		}
	}

	.bgcolor {
		color: var(--text_color_L1) !important;
	}

	&-popup {
		&-head {
			height: 190px;
			position: relative;
			padding-top: 30px;

			&::after {
				content: '';
				position: absolute;
				width: 50%;
				left: 0;
				bottom: 0;
				height: 59px;
				background-image: linear-gradient(9deg, var(--bg_color_L2) 50%, transparent 50%);
				html:lang(ar) &{
					left: unset;
					right: 0;
				}
			}

			&::before {
				content: '';
				position: absolute;
				right: 0;
				bottom: 0;
				width: 50%;
				height: 59px;
				background-image: linear-gradient(-9deg, var(--bg_color_L2) 50%, transparent 50%);
				html:lang(ar) &{
					left: 0;
					right: unset;
				}
			}

			&-title {
				height: 44px;
				font-weight: 700;
				font-size: 36px;
				text-align: center;
				color: var(--text_color_L1);
			}

			&-selectName {
				width: 560px;
				height: 50px;
				margin: 16px auto 0;
				background: var(--bg_color_L2);
				border-radius: 10px;
				text-align: center;
				font-weight: 500;
				font-size: 26px;

				& > span {
					line-height: 50px;

					& + span {
						margin-left: 28px;
					}
				}
			}
		}

		&-body {
			height: 390px;
			padding: 57px 26px 40px 26px;

			&-line {
				font-size: 32px;
				color: var(--colorText-3);
				height: 56px;
				line-height: 56px;
				display: flex;
				justify-content: space-between;

				&-list {
					display: flex;
					justify-content: space-between;
				}

				&-item {
					padding: 0 16px;
					background: var(--gray-color-1);

					& + div {
						margin-left: 12px;
					}
				}

				& + div {
					margin-top: 30px;
				}

				&-btnL {
					justify-content: center;
					display: flex;
				}

				&:last-child {
					justify-content: flex-start;
				}
			}
		}

		&-foot {
			height: 72px;
			display: flex;
			text-align: center;
			line-height: 72px;
			font-size: 28px;
			color: var(--text_color_L1);

			&-c {
				flex: 1;
				background: var(--bgcolor-1);
				color: var(--text_color_L2);
			}

			&-s {
				flex: 2;
			}
		}

		&-12,
		&-1,
		&-3,
		&-7,
		&-9 {
			.bgcolor {
				background-color: var(--norm_green-color);
			}

			.Betting__C-popup-head {
				background: var(--linearGradien-1);
			}
		}

		&-10,
		&-2,
		&-4,
		&-6,
		&-8 {
			.bgcolor {
				background-color: var(--norm_red-color);
			}

			.Betting__C-popup-head {
				background: var(--main-color);
			}
		}

		&-0 {
			.bgcolor {
				background-color: var(--norm_red-color);
			}

			.Betting__C-popup-head {
				background: var(--linearGradien-5);
			}
		}

		&-5 {
			.bgcolor {
				background-color: var(--norm_red-color);
			}

			.Betting__C-popup-head {
				background: linear-gradient(to bottom right, var(--norm_red-color) 50%, #eb43dd 0);
			}
		}

		&-11 {
			.bgcolor {
				background-color: var(--norm_Purple-color);
			}

			.Betting__C-popup-head {
				background: var(--norm_Purple-color);
			}
		}

		&-13 {
			.bgcolor {
				background-color: var(--norm_secondary-color);
			}

			.Betting__C-popup-head {
				background: var(--linearGradien-8);
			}
		}

		&-14 {
			.bgcolor {
				background-color: var(--norm_bule-color);
			}

			.Betting__C-popup-head {
				background: var(--linearGradien-9);
			}
		}

		&-btn {
			width: 56px;
			height: 56px;
			pointer-events: none;
			text-align: center;
			font-size: 50px;
			padding: 0;
			color: var(--gray-color-1);
			flex: none;
		}

		.bgcolor {
			pointer-events: all;
			color: var(--text_color_L1);
		}

		&-input {
			border: 1px solid var(--gray-color-1);
			padding: 2px 20px;
			width: 158px;

			:deep(.van-field__control) {
				text-align: center;
				font-size: 28px;
				line-height: 54px;
			}
		}
	}
}
</style>
