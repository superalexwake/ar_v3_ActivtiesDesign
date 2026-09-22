<template>
	<div class="FDB__C">
		<div v-show="isShowMark" class="FDB__C-mark">
			<div>{{ props.currentInfo.time3 || '0' }}</div>
			<div>{{ props.currentInfo.time4 || '0' }}</div>
		</div>
		<BettingBody
			:betTypeNameMap="betTypeNameMap"
			:betType="betType"
			:BettingH="BettingH"
			:onTabID="onTabID"
			:OddsList="OddsList"
			:numberChack="numberChack"
			@changeType="changeType"
			@numberTab="numberTab"
			@onTab="onTab"
		/>
		<Popup
			:currentInfo="currentInfo"
			:currentGame="currentGame"
			:bettingPopupShow="bettingPopupShow"
			:betTypeList="betTypeList"
			:selectInfo="selectInfo"
			@computedCoin="computedCoin"
			@clearBetting="clearBetting"
			@submitBetting="submitBettingData"
		>
			<BettingBody
				:betTypeNameMap="betTypeNameMap"
				:betType="betType"
				:BettingH="BettingH"
				:onTabID="onTabID"
				:OddsList="OddsList"
				:numberChack="numberChack"
				@changeType="changeType"
				@numberTab="numberTab"
				@onTab="onTab"
			/>
		</Popup>
	</div>
</template>

<script setup lang="ts">
import { game5DBetting, get5DOddsList } from '@/api'
import type { FD } from '@/types/api'
import { AwaitApiResult, AwaitWrap } from '@/utils'
import { showFailToast, showToast } from 'vant'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import BettingBody from './BetCom.vue'
import Popup from './BettingPopup.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const BetRef = ref()
const emit = defineEmits<{
	(e: 'betting', val: string): void
	(e: 'changeBettingP', val: boolean): void
}>()
// 是否展示彈窗
const bettingPopupShow = ref(false)
watch(
	() => bettingPopupShow.value,
	(value) => {
		if (value) {
			selectInfo.value.coin = betTypeList.value[0]
		}
	}
)
// 选中投注类型
const betType = ref(0)
// 投注列表
const betTypeNameMap = ref(['A', 'B', 'C', 'D', 'E', 'SUM'])
// 赔率列表
const OddsList = ref<FD.resGet5DOddsList[]>([
	{
		playID: 1,
		playType: 1,
		playBet: '0-9',
		playResult: '0-9',
		playRate: 9,
		playRate_Original: 9
	},
	{
		playID: 2,
		playType: 2,
		playBet: 'H',
		playResult: 'H',
		playRate: 2,
		playRate_Original: 2
	},
	{
		playID: 3,
		playType: 2,
		playBet: 'L',
		playResult: 'L',
		playRate: 2,
		playRate_Original: 2
	},
	{
		playID: 4,
		playType: 3,
		playBet: 'O',
		playResult: 'O',
		playRate: 2,
		playRate_Original: 2
	},
	{
		playID: 5,
		playType: 3,
		playBet: 'E',
		playResult: 'E',
		playRate: 2,
		playRate_Original: 2
	}
])
// 头部id
const onTabID = ref<number>(0)
// 选中参数
const numList = ref<any[]>([])
// 数字是否选中
const numberChack = ref<boolean[]>([false, false, false, false, false, false, false, false])
// 投注头部列表
const BettingH = computed(() => {
	return [
		{ id: 1, name: t('k3Big'), rate: OddsList.value[1].playRate || OddsList.value[1].playRate_Original },
		{ id: 2, name: t('k3Small'), rate: OddsList.value[2].playRate || OddsList.value[2].playRate_Original },
		{ id: 3, name: t('k3Odd'), rate: OddsList.value[3].playRate || OddsList.value[3].playRate_Original },
		{ id: 4, name: t('k3Even'), rate: OddsList.value[4].playRate || OddsList.value[4].playRate_Original }
	]
})
const selectInfo = ref<any>({
	coin: 0, //下注金额
	count: 1, //下注倍数
	allCoin: 0, //下注总额
	gametype: 0, //类型 1A，2B，3C，4D，5E，6SUM
	typeid: 1, //台号1Min 3Min 5Min 10Min
	issuenumber: '2020', //期号
	selecttype: '' //下注内容
})
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
// 切换投注类型
const changeType = (value: number) => {
	betType.value = value
	if (value == 5) {
		numberNoChack()
	}
}
const Get5DOddsList = async () => {
	const [err, res] = await AwaitWrap(get5DOddsList())
	if (res) {
		OddsList.value = res
	}
}
// 购买大小，奇偶
const onTab = (id: number) => {
	//name high，low，odd，even，id 1,2,3,4
	numberNoChack() //清空数字选中
	if (onTabID.value == id) {
		onTabID.value = 0
		bettingPopupShow.value = true
	} else {
		onTabID.value = id
		bettingPopupShow.value = true
	}
	computedCoin()
}
// 购买数字
const numberTab = (num: number) => {
	onTabID.value = 0
	if (numberChack.value[num]) {
		numberChack.value[num] = false
		const hasIndex = numList.value.indexOf(num)
		if (hasIndex > -1) {
			//大于0 代表存在，
			numList.value.splice(hasIndex, 1) //存在就删除
		}
		bettingPopupShow.value = true
	} else {
		numList.value.push(num)
		numberChack.value[num] = true
		bettingPopupShow.value = true
	}
	computedCoin()
}

//计算总金额
const computedCoin = () => {
	nextTick(() => {
		if (numList.value.length > 0) {
			selectInfo.value.allCoin = selectInfo.value.coin * selectInfo.value.count * numList.value.length
		} else if (onTabID.value) {
			selectInfo.value.allCoin = selectInfo.value.coin * selectInfo.value.count
		} else {
			selectInfo.value.allCoin = 0
		}
	})
}
/**
 * 清空数字选中
 */
const numberNoChack = () => {
	numList.value = []
	for (let i = 0; numberChack.value.length > i; i++) {
		numberChack.value[i] = false
	}
	computedCoin()
}
// 关闭投注弹窗，并清理相关数据。
const clearBetting = () => {
	selectInfo.value.count = props.currentGame.betMultiple?.split('|')[0] || 1
	bettingPopupShow.value = false
	clearData()
}
/**
 * 清理参数
 */
const clearData = () => {
	numList.value = []
	numberChack.value = [false, false, false, false, false, false, false, false]
	onTabID.value = 0
}
// 提交投注参数。
const submitBettingData = async () => {
	if (selectInfo.value.count == 0) {
		return showFailToast(t('bteNoCount'))
	}
	let selecttype
	if (numList.value.length > 0) {
		selecttype = numList.value.join('|')
	} else {
		switch (onTabID.value) {
			case 1:
				selecttype = 'H'
				break
			case 2:
				selecttype = 'L'
				break
			case 3:
				selecttype = 'O'
				break
			case 4:
				selecttype = 'E'
				break
			default:
		}
	}
	if (!selecttype) {
		return showFailToast(t('pleaseBet'))
	}
	const params = {
		issuenumber: props.currentInfo.gameNo,
		typeId: props.currentGame.typeID,
		amount: selectInfo.value.coin,
		betCount: Number(selectInfo.value.count),
		gameType: betType.value + 1,
		selectType: selecttype
	}
	const res = await AwaitApiResult(game5DBetting(params))
	if (res?.code === 0) {
		showToast(t('code' + res?.msgCode))
		bettingPopupShow.value = false
		clearData()
		emit('betting', props.currentInfo.gameNo)
	}
}
onMounted(() => {
	Get5DOddsList()
})
defineExpose({
	bettingPopupShow
})
</script>
<style lang="scss" scoped>
.FDB__C {
	width: calc(100% - 52px);
	margin: auto;
	background-color: var(--darkBg, var(--bg_color_L2));
	padding: 26px 26px 0 26px;
	position: relative;
	&-mark {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
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
}
</style>
