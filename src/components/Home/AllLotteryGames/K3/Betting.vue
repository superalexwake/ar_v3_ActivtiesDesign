<template>
	<div class="K3B__C">
		<div v-show="isShowMark" class="K3B__C-mark">
			<div>{{ props.currentInfo.time3 || '0' }}</div>
			<div>{{ props.currentInfo.time4 || '0' }}</div>
		</div>
		<div class="K3B__C-nav">
			<div v-for="(item, index) in navList" :key="index" :class="{ active: actNav == index }" @click="changeType(index)">
				{{ item.name }}
			</div>
		</div>
		<component
			ref="BetRef"
			:is="componentList[navList[actNav].comp]"
			:OddsList="OddsList"
			:numList="numList"
			:numTow="numTow"
			:numOne="numOne"
			:numChack="numChack"
			:betnumList="betnumList"
			@selectNum="selectNum"
			@showP="(value: boolean) => bettingPopupShow = value"
			@upAll="upAll"
			@cNumChack="numChack = !numChack"
			@onQuestion="onQuestion"
		>
		</component>
		<BettingPopup
			ref="betPopupRef"
			:currentInfo="props.currentInfo"
			:bettingPopupShow="bettingPopupShow"
			:numTow="numTow"
			:numOne="numOne"
			:betTypeList="betTypeList"
			:numTowList="numTowList"
			:currentGame="currentGame"
			:actNav="actNav"
			:betnumList="betnumList"
			:numChack="numChack"
			@clearBetting="clearBetting"
			@submitBetting="submitBettingData"
		/>
		<!-- 玩法提示 -->
		<van-popup
			class="qpopup"
			v-model:show="showQuestion"
			:close-on-click-overlay="false"
			closeable
			close-icon="close"
			close-icon-position="bottom-left"
			round
		>
			<div class="qpopup-box">
				<div class="qpopup-box-list">
					<div :class="'num num' + item" v-for="(item, index) in questionList" :key="index"></div>
				</div>
				<div class="qpopup-box-txt">
					{{ questionText }}
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import bt1 from '@/components/Home/AllLotteryGames/K3/Betting1.vue'
import bt2 from '@/components/Home/AllLotteryGames/K3/Betting2.vue'
import bt3 from '@/components/Home/AllLotteryGames/K3/Betting3.vue'
import bt4 from '@/components/Home/AllLotteryGames/K3/Betting4.vue'
import BettingPopup from './BettingPopup.vue'
import { AwaitApiResult } from '@/utils'
import { getK3OddsList } from '@/api'
import { useI18n } from 'vue-i18n'
import type { K3 } from '@/types/api'

const { t } = useI18n()
/**动态组件列表 */
const componentList = {
	bt1,
	bt2,
	bt3,
	bt4
}
const betPopupRef = ref()
const BetRef = ref()
const emit = defineEmits<{
	(e: 'betting', val: string): void
	(e: 'changeBettingP', val: boolean): void
}>()
// 總賭注列表
const OddsList = ref<K3.resGetK3OddsList[]>([])
// 選中導航
const actNav = ref(0)
// 導航列表
const navList = ref<{ name: string; comp: string }[]>([
	{ name: t('totalBet'), comp: 'bt1' },
	{ name: t('sameNum'), comp: 'bt2' },
	{ name: t('numbersMatch'), comp: 'bt3' },
	{ name: t('numbersUnmatch'), comp: 'bt4' }
])
// 投注2列表
const numList = ref<{ num: number; chack: boolean; chackOne: boolean; chackTow: boolean }[]>([
	{
		num: 1,
		chack: false,
		chackOne: false,
		chackTow: false
	},
	{
		num: 2,
		chack: false,
		chackOne: false,
		chackTow: false
	},
	{
		num: 3,
		chack: false,
		chackOne: false,
		chackTow: false
	},
	{
		num: 4,
		chack: false,
		chackOne: false,
		chackTow: false
	},
	{
		num: 5,
		chack: false,
		chackOne: false,
		chackTow: false
	},
	{
		num: 6,
		chack: false,
		chackOne: false,
		chackTow: false
	}
])
//选中的数字，总投注和2个相同的数字|选择2个匹配
const betnumList = ref<any[]>([])
const numTow = ref<any[]>([])
const numOne = ref<any[]>([])
const numChack = ref<boolean>(false)
const numTowList = ref<any[]>([])
// 是否展示彈窗
const bettingPopupShow = ref(false)
// 是否展示倒计时弹窗，如果展示，就关闭投注页面
const isShowMark = computed(() => {
	if (props.currentInfo.passTime < props.ProhibitBuyTime) {
		clearBetting()
	}
	return props.currentInfo.passTime < props.ProhibitBuyTime
})
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
	}
})
// 解析后端返回参数，展示每份金额列表
const betTypeList = computed(() => {
	return props.currentGame.scope ? props.currentGame.scope.split('|').map((sc: string): number => Number(sc)) : []
})

// 关闭投注弹窗，并清理相关数据。
const clearBetting = () => {
	bettingPopupShow.value = false
	clearData()
}
/**
 * 清理数据
 */
const clearData = () => {
	BetRef.value.clearList && BetRef.value.clearList()
	betnumList.value = []
	numTow.value = []
	numOne.value = []
	numChack.value = false
	numTowList.value = []
	numList.value = [
		{
			num: 1,
			chack: false,
			chackOne: false,
			chackTow: false
		},
		{
			num: 2,
			chack: false,
			chackOne: false,
			chackTow: false
		},
		{
			num: 3,
			chack: false,
			chackOne: false,
			chackTow: false
		},
		{
			num: 4,
			chack: false,
			chackOne: false,
			chackTow: false
		},
		{
			num: 5,
			chack: false,
			chackOne: false,
			chackTow: false
		},
		{
			num: 6,
			chack: false,
			chackOne: false,
			chackTow: false
		}
	]
}
// 獲取賠率
const GetK3OddsList = async () => {
	const res = await AwaitApiResult<ObjResNull<K3.resGetK3OddsList[]>>(getK3OddsList())
	OddsList.value = res?.data || []
}
// 更新所有金額
const upAll = () => {
	betPopupRef.value.setAllCoin()
}
// 切換投注類型
const changeType = (index: number) => {
	actNav.value = index
	bettingPopupShow.value = false
	clearData()
}
// 計算選兩色,子組件調用
const selectNum = () => {
	let list = []
	for (let i = 0; numTow.value.length > i; i++) {
		let item = numTow.value[i]
		let arr = []
		for (let j = 0; numOne.value.length > j; j++) {
			arr.push(numOne.value[j])
		}
		if (arr.length > 0) {
			let con = arr.sort().join(',')
			list.push(item + '|' + con)
		}
	}
	numTowList.value = list.sort()
}
// 提交投注参数。
const submitBettingData = async (issuenumber: string) => {
	emit('betting', issuenumber)
	bettingPopupShow.value = false
	clearData()
}
// 玩法提示框
const showQuestion = ref(false)
const questionList = ref<Array<number>>([])
const questionText = ref('')
const onQuestion = (e: string, arr: Array<number>) => {
	questionText.value = e
	questionList.value = arr
	showQuestion.value = true
}

onMounted(() => {
	GetK3OddsList()
})
defineExpose({
	bettingPopupShow
})
</script>
<style lang="scss" scoped>
.K3B__C {
	width: calc(100% - 52px);
	margin: auto;
	background: var(--bg_color_L2);
	border-radius: 0 0 20px 20px;
	padding: 0 20px 19px 20px;
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
			right: o;
			left: unset;
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

	&-nav {
		height: 80px;
		display: flex;
		font-size: 22px;
		color: var(--text_color_L2);
		overflow: hidden;
		justify-content: space-between;
		& > div {
			line-height: 80px;
			text-align: center;
			width: calc(25% - 3px);
			background: var(--bg_color_L3);
			border-radius: 10px 10px 0 0;
			&.active {
				background: var(--main-color);
				color: var(--text_color_L4);
			}
		}
	}
}
:deep(.van-popup) {
	overflow-y: visible;
	.van-icon-close {
		font-size: 60px;
		bottom: -75px;
		left: 50%;
		transform: translate(-50%, 0);
	}
}
.qpopup {
	&-box {
		max-width: 8rem;
		padding: 60px 58px 78px;
		&-list {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;
			.num {
				height: 90px;
				width: 90px;
				background-color: var(--colorText-2);
				margin: 0 20px;
				&.num1 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n1.png') no-repeat center center;
					background-size: cover;
				}
				&.num2 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n2.png') no-repeat center center;
					background-size: cover;
				}
				&.num3 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n3.png') no-repeat center center;
					background-size: cover;
				}
				&.num4 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n4.png') no-repeat center center;
					background-size: cover;
				}
				&.num5 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n5.png') no-repeat center center;
					background-size: cover;
				}
				&.num6 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n6.png') no-repeat center center;
					background-size: cover;
				}
				&.num7 {
					background: url('@/assets/icons/home/AllLotteryGames/K3/n7.png') no-repeat center center;
					background-size: cover;
				}
			}
		}
		&-txt {
			text-align: center;
			font-size: 24px;
			color: var(--text_color_L2);
		}
	}
}
</style>
