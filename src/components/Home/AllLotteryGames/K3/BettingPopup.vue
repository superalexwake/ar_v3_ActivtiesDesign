<template>
	<!-- 投注内容 begin -->
	<van-popup
		v-model:show="showPopup"
		position="bottom"
		style="box-shadow: 0px -18px 40px rgba(37, 37, 60, 0.26)"
		:round="true"
		:overlay="false"
		:close-on-click-overlay="false"
		:lock-scroll="false"
	>
		<div class="Betting__Popup-body">
			<div v-if="actNav === 0 && betnumList.length" class="Betting__Popup-type1">
				<p class="title">{{ $t('betPopDesc1') }}</p>
				<div class="list">
					<div :class="item % 2 === 0 ? 'green' : 'red num' + item" v-for="(item, index) in betnumList" :key="index">
						{{ betnumName(item) }}
					</div>
				</div>
			</div>
			<template v-if="actNav === 1">
				<div v-if="betnumList.length" class="Betting__Popup-type2">
					<p class="title">{{ $t('betPopDesc2') }}</p>
					<div class="list">
						<div v-for="(item, index) in betnumList" :key="index" class="Betting__Popup-type2-d">
							{{ betnumName(item) }}
						</div>
					</div>
				</div>
				<div v-if="numTowList.length" class="Betting__Popup-type2">
					<p class="title">{{ $t('betPopDesc3') }}</p>
					<div class="list">
						<div
							v-for="(item, index) in numTowList"
							:key="index"
							class="Betting__Popup-type2-o"
							v-html="changeHtml(item)"
						></div>
					</div>
				</div>
			</template>
			<template v-if="actNav === 2">
				<div v-if="betnumList.length" class="Betting__Popup-type2">
					<p class="title">{{ $t('betPopDesc4') }}</p>
					<div class="list">
						<div v-for="(item, index) in betnumList" :key="index" class="Betting__Popup-type2-d">
							{{ betnumName(item) }}
						</div>
					</div>
				</div>
				<p class="title" v-if="numChack">{{ $t('betPopDesc5') }}</p>
				<div v-if="numChack" class="Betting__Popup-type2-r">{{ $t('k3bet3Desc4') }}</div>
			</template>
			<template v-if="actNav === 3">
				<div v-if="numOne.length > 2" class="Betting__Popup-type2">
					<p class="title">{{ $t('betPopDesc6') }}</p>
					<div class="list">
						<div v-for="(item, index) in numOne" :key="index" class="Betting__Popup-type2-d">
							{{ betnumName(item) }}
						</div>
					</div>
				</div>
				<p class="title" v-if="numChack">{{ $t('betPopDesc7') }}</p>
				<div v-if="numChack" class="Betting__Popup-type2-r">{{ $t('betPopDesc7') }}</div>
				<div v-if="numTow.length > 1" class="Betting__Popup-type2">
					<p class="title">{{ $t('betPopDesc8') }}</p>
					<div class="list">
						<div v-for="(item, index) in numTow" :key="index" class="Betting__Popup-type2-d">
							{{ betnumName(item) }}
						</div>
					</div>
				</div>
			</template>
			<div class="Betting__Popup-body-line">
				{{ t('amount') }}
				<div class="Betting__Popup-body-line-list">
					<div
						v-for="(item, index) in betTypeList"
						:key="index"
						class="Betting__Popup-body-line-item"
						:class="{ bgcolor: selectInfo.coin == item }"
						@click="changeCoin(item)"
					>
						{{ item }}
					</div>
				</div>
			</div>
			<div class="Betting__Popup-body-line">
				{{ t('numbers') }}
				<div class="Betting__Popup-body-line-btnL">
					<div class="Betting__Popup-btn" :class="{ bgcolor: selectInfo.count > 0 }" @click="Stepper(1)">-</div>
					<van-field
						class="Betting__Popup-input"
						v-model="selectInfo.count"
						type="digit"
						:maxlength="4"
						@input="changeStep"
					/>
					<div class="Betting__Popup-btn bgcolor" @click="Stepper(2)">+</div>
				</div>
			</div>
			<div class="Betting__Popup-body-line">
				<div></div>
				<div class="Betting__Popup-body-line-list">
					<div
						v-for="(item, index) in multipleList"
						:key="index"
						class="Betting__Popup-body-line-item"
						@click="TaskCount(item)"
						:class="{ bgcolor: selectInfo.count == item }"
					>
						X{{ item }}
					</div>
				</div>
			</div>
			<div class="Betting__Popup-body-line">
				<span
					class="Betting__Popup-agree"
					:class="{ active: isCheckPreSale }"
					@click="isCheckPreSale = !isCheckPreSale"
					>{{ t('agree') }}</span
				><span @click="isShowPreSale = true" class="Betting__Popup-preSaleShow">{{ t('presaleRules') }}</span>
			</div>
		</div>
		<div class="Betting__Popup-foot">
			<div class="Betting__Popup-foot-c" @click="emits('clearBetting')">{{ t('cancel') }}</div>
			<div
				class="Betting__Popup-foot-s bgcolor"
				:class="{ disabled: !canSubmit }"
				v-throttle-click="{ handler: submitBetting, wait: 2000 }"
			>
				{{ t('totalAmount') }} {{ currency(selectInfo.allCoin || 0) }}
			</div>
		</div>
	</van-popup>

	<!-- 规则弹层 begin-->
	<van-popup v-model:show="isShowPreSale" :close-on-click-overlay="false" round>
		<div class="Betting__Popup-PreSale">
			<div class="Betting__Popup-PreSale-head">{{ t('presaleRules') }}</div>
			<div class="Betting__Popup-PreSale-body">
				{{ $t('betPopTXT') }}
			</div>
			<div class="Betting__Popup-PreSale-foot">
				<div class="Betting__Popup-PreSale-foot-btn" @click="knowPreSale">{{ t('iKonw') }}</div>
			</div>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showFailToast, showToast } from 'vant'
import { AwaitApiResult, currency } from '@/utils'
import { useI18n } from 'vue-i18n'
import { k3GameBetting } from '@/api'
const { t } = useI18n()

const emits = defineEmits<{
	(e: 'update:bettingPopupShow', val: boolean): void
	(e: 'update:selectInfo', val: any): void
	(e: 'clearBetting'): void
	(e: 'submitBetting', val: string): void
}>()
// 是否展示预售规则
const isShowPreSale = ref(false)
// 是否同意预售规则
const isCheckPreSale = ref(true)
// 份数快捷选项按钮
// 份数快捷选项按钮
const multipleList = computed(() => {
	return props.currentGame.betMultiple.split('|')
})
const props = withDefaults(
	defineProps<{
		currentInfo: any
		currentGame: any
		bettingPopupShow: any
		betTypeList: any
		betnumList: any[]
		numTow: any[]
		numOne: any[]
		actNav: number
		numTowList: any[]
		numChack: any
	}>(),
	{}
)
watch(
	() => props.bettingPopupShow,
	() => {
		selectInfo.value.coin = Number(props.betTypeList[0])
		selectInfo.value.count = multipleList.value[0]
	}
)
const selectInfo = ref<{
	coin: number
	count: number
	allCoin: number
	gametype: number
	typeid: number
	issuenumber: string
	selecttype: string
}>({
	coin: 0, //下注金额
	count: multipleList.value[0], //下注倍数
	allCoin: 0, //下注总额
	gametype: 0, //类型 0 颜色 1数字 2大小
	typeid: 1, //台号1Min 3Min 5Min 10Min
	issuenumber: '', //期号
	selecttype: '1' //下注内容
})
watch(
	() => multipleList,
	() => {
		selectInfo.value.count = multipleList.value[0]
	},
	{ deep: true, immediate: true }
)

let showPopup = computed({
	get(): boolean {
		setAllCoin()
		return props.bettingPopupShow || false
	},
	set(val: boolean) {
		emits('update:bettingPopupShow', val)
	}
})
const canSubmit = computed(() => Number(selectInfo.value.count) >= 1)

// 份数加减
const Stepper = (e: number) => {
	switch (e) {
		case 1:
			if (selectInfo.value.count > 1) {
				selectInfo.value.count--
				setAllCoin()
			}
			break
		case 2:
			selectInfo.value.count++
			setAllCoin()
			break
		default:
	}
}
// 输入框设置数量
const changeStep = (e: any) => {
	if (e > 0) {
		selectInfo.value.count = parseInt(e)
		setAllCoin()
	}
}
// 购买份数切换
const TaskCount = (item: number) => {
	selectInfo.value.count = item
	setAllCoin()
}
// 购买金额切换
const changeCoin = (item: any) => {
	selectInfo.value.coin = item
	setAllCoin()
}
// 知道预售规则
const knowPreSale = () => {
	isShowPreSale.value = false
	isCheckPreSale.value = true
}
// 点击提交金额
const submitBetting = async () => {
	if (!isCheckPreSale.value) {
		showToast(t('agreePresaleRules'))
		return
	}
	let { coin, count, selecttype } = selectInfo.value
	if (count == 0) {
		return showFailToast(t('bteNoCount'))
	}
	let betType: any = null
	let betnumList = props.betnumList
	if (props.actNav === 0 && props.betnumList.length) {
		betType = getBetType(props.betnumList)
		betnumList.sort()
		for (let i = 0; betnumList.length > i; i++) {
			if (betnumList[i] == 'A') {
				betnumList[i] = 'H'
			}
			if (betnumList[i] == 'B') {
				betnumList[i] = 'L'
			}
			if (betnumList[i] == 'C') {
				betnumList[i] = 'O'
			}
			if (betnumList[i] == 'D') {
				betnumList[i] = 'E'
			}
		}
		selecttype = betnumList.join(',')
	} else if (props.actNav == 1) {
		let betTypeList = []
		let list1 = ''
		let list2 = ''
		if (betnumList.length > 0) {
			let list = []
			for (let i = 0; betnumList.length > i; i++) {
				let item = '|' + betnumList[i] + '|'
				list.push(item)
			}
			list2 = list.join(',')
			betTypeList.push(6)
		}
		if (props.numTowList.length > 0) {
			let oneList: any[] = []
			let towList: any = []
			for (let i = 0; props.numOne.length > i; i++) {
				let item = ':' + props.numOne[i] + ':'
				oneList.push(item)
				oneList = oneList.sort()
			}
			for (let i = 0; props.numTow.length > i; i++) {
				let item = ':' + props.numTow[i] + ':'
				towList.push(item)
				towList = towList.sort()
			}
			list1 = towList.join(',') + ',' + oneList.join(',')
			betTypeList.push(5)
		}
		betTypeList = betTypeList.sort((a, b) => a - b)
		betType = betTypeList.join(',')

		if (list1) {
			selecttype = list1
		}
		if (list2) {
			selecttype = list2
		}
		if (list1 && list2) {
			selecttype = list1 + ',' + list2
		}
	} else if (props.actNav == 2) {
		let betTypeList = []
		let list1 = ''
		let list2 = ''
		if (betnumList.length > 0) {
			let list: any[] = []
			for (let i = 0; betnumList.length > i; i++) {
				let item = '|' + betnumList[i] + '|'
				list.push(item)
				list = list.sort()
			}
			list1 = list.join(',')
			betTypeList.push(7)
		}
		if (props.numChack) {
			list2 = '|AAA|'
			betTypeList.push(8)
		}
		betTypeList = betTypeList.sort((a, b) => a - b)
		betType = betTypeList.join(',')
		if (list1) {
			selecttype = list1
		}
		if (list2) {
			selecttype = list2
		}
		if (list1 && list2) {
			selecttype = list1 + ',' + list2
		}
	} else if (props.actNav == 3) {
		let betTypeList = []
		let list1 = ''
		let list2 = ''
		let list3 = ''
		// 三个不同
		if (props.numOne.length > 2) {
			let list: any[] = []
			for (let i = 0; props.numOne.length > i; i++) {
				let item = '|' + props.numOne[i] + '|'
				list.push(item)
				list = list.sort()
			}
			list1 = list.join(',')
			betTypeList.push(9)
		}
		// 三连号
		if (props.numChack) {
			list2 = '|ABC|'
			betTypeList.push(10)
		}
		// 两个不同
		if (props.numTow.length > 1) {
			let list: any[] = []
			for (let i = 0; props.numTow.length > i; i++) {
				let item = '.' + props.numTow[i] + '.'
				list.push(item)
				list = list.sort()
			}
			list3 = list.join(',')
			betTypeList.push(4)
		}
		betTypeList = betTypeList.sort((a, b) => a - b)
		betType = betTypeList.join(',')

		if (list3) {
			selecttype = list3
		}
		if (list1) {
			selecttype = list1
		}
		if (list2) {
			selecttype = list2
		}
		if (list1 && list2) {
			selecttype = list1 + ',' + list2
		}
		if (list3 && list1) {
			selecttype = list3 + ',' + list1
		}
		if (list3 && list2) {
			selecttype = list3 + ',' + list2
		}
		if (list3 && list1 && list2) {
			selecttype = list3 + ',' + list1 + ',' + list2
		}
	}
	const res = await AwaitApiResult(
		k3GameBetting({
			amount: coin, //下注金额
			betCount: Number(count), //投注份数
			gameType: betType,
			selectType: selecttype,
			typeId: props.currentGame.typeID,
			issuenumber: props.currentInfo.gameNo
		})
	)
	if (res?.code === 0) {
		showToast(t('code' + res?.msgCode))
		emits('submitBetting', props.currentInfo.gameNo)
	} else {
		emits('clearBetting')
	}
}
const getBetType = (list: any) => {
	let betType = []
	for (let i = 0; list.length > i; i++) {
		if (
			list[i] == '3' ||
			list[i] == '4' ||
			list[i] == '5' ||
			list[i] == '6' ||
			list[i] == '7' ||
			list[i] == '8' ||
			list[i] == '9' ||
			list[i] == '10' ||
			list[i] == '11' ||
			list[i] == '12' ||
			list[i] == '13' ||
			list[i] == '14' ||
			list[i] == '15' ||
			list[i] == '16' ||
			list[i] == '17' ||
			list[i] == '18'
		) {
			betType.push(1)
			continue
		}
		if (list[i] == 'A' || list[i] == 'B') {
			betType.push(2)
			continue
		}
		if (list[i] == 'C' || list[i] == 'D') {
			betType.push(3)
			continue
		}
	}
	betType = betType.sort(function (a, b) {
		return a - b
	})
	return [...new Set(betType)].join(',')
}
// 计算总金额
const setAllCoin = () => {
	const length =
		props.betnumList.length +
		getnumTowListLength() +
		(props.numChack ? 1 : 0) +
		getCombinationCount(props.numOne, 3) +
		getCombinationCount(props.numTow)
	selectInfo.value.allCoin = selectInfo.value.coin * selectInfo.value.count * length
}
/**
 * @description: 计算选择1对独特数字的数组解析转换
 * @return {*}
 */
const getnumTowListLength = () => {
	const length = props.numTowList.length
	if (!length) return length
	return props.numTowList[0].split('|')[1].split(',').length * length
}
/**
 * @description: 计算数组排列组合的数量方法
 * @param {*} arr
 * @param {*} nu
 * @return {*}
 */
const getCombinationCount = (arr: any[], nu: number = 2) => {
	if (props.actNav != 3) {
		return 0
	}
	function factorial(num: number) {
		let result = 1
		for (let i = 2; i <= num; i++) {
			result *= i
		}
		return result
	}
	const n = arr.length
	if (n < nu) {
		return 0 // 数组长度小于 2，无法组成不重复组合
	}
	return factorial(n) / (factorial(nu) * factorial(n - nu))
}
// 映射縂投注名稱
const betnumName = (name: any) => {
	switch (name) {
		case 'A':
			return t('betBig')
		case 'B':
			return t('betSmall')
		case 'C':
			return t('betOdd')
		case 'D':
			return t('betEven')
		default:
			return name
	}
}
// 渲染html
const changeHtml = (item: string) => {
	let list = item.split('|')
	let html = ''
	list.forEach((item) => {
		html += `<div>${item}</div>`
	})
	return html
}
defineExpose({
	setAllCoin
})
</script>

<style lang="scss" scoped>
.Betting__Popup {
	&-body {
		.title {
			margin-bottom: 10px;
			font-size: 32px;
			color: var(--text_color_L1)
		}
		.list {
			display: flex;
			flex-wrap: wrap;
		}
	}
	&-type1 {
		align-items: center;
		margin-bottom: 20px;
		.list {
			& > div {
				width: 48px;
				height: 48px;
				line-height: 48px;
				text-align: center;
				background: #b5b5b5;
				border-radius: 48px;
				font-size: 24px;
				color: #fff;
				margin: 4px;
				&.red {
					background-color: var(--norm_red-color);
				}
				&.green {
					background-color: var(--norm_green-color);
				}
				&.numA,
				&.numB,
				&.numC,
				&.numD {
					background-color: var(--norm_secondary-color);
					border-radius: 8px;
					width: 80px;
				}
				&.numB {
					background-color: var(--norm_bule-color);
				}
				&.numC {
					background-color: var(--norm_red-color);
				}
				&.numD {
					background-color: var(--norm_red-color);
				}
			}
		}
	}

	&-type2 {
		align-items: center;
		margin-bottom: 20px;
		font-size: 32px;
		color: var(--colorText-3);
		&::last-child {
			margin-bottom: 36px;
		}

		&-d {
			height: 44px;
			background: var(--norm_Purple-color);
			border-radius: 8px;
			color: var(--text_color_L1);
			line-height: 44px;
			text-align: center;
			margin: 2px 4px;
			font-size: 24px;
			padding: 0 18px;
		}

		&-o {
			height: 44px;
			display: flex;
			align-items: center;
			background: var(--norm_red-color);
			border-radius: 8px;
			text-align: center;
			overflow: hidden;
			font-size: 24px;

			& + div {
				margin-left: 10px;
			}

			:deep(div) {
				height: 100%;
				line-height: 44px;
				padding: 0 10px;
				flex: none;
				color: var(--text_color_L1);

				&:last-child {
					background-color: var(--norm_green-color);
				}
			}
		}

		&-r {
			width: max-content;
			height: 44px;
			line-height: 44px;
			padding: 0 42px;
			background: var(--norm_red-color);
			border-radius: 8px;
			font-size: 24px;
			color: var(--text_color_L1);
			margin-bottom: 16px;
		}
	}

	&-body {
		padding: 38px 26px 40px 26px;

		&-line {
			font-size: 32px;
			color: var(--text_color_L1);
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
				background: var(--bg_color_L3);
				color: var(--text_color_L2);
				border-radius: 6px;

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
			background: var(--bg_color_L3);
			color: var(--text_color_L2);
		}

		&-s {
			flex: 2;
			background: var(--main-color);
			color: var(--text_color_L1);

			&.disabled {
				opacity: 0.6;
				pointer-events: none;
			}
		}
	}

	&-btn {
		width: 56px;
		height: 56px;
		pointer-events: none;
		text-align: center;
		font-size: 50px;
		padding: 0;
		background: var(--bg_color_L3);
		color: var(--button_dis_color);
		flex: none;
		border-radius: 6px;
		
	}

	&-input {
		padding: 2px 20px;
		width: 158px;
		margin: 0 12px;
		background-color: var(--bg_color_L1);
		color: var(--text_color_L1);

		:deep(.van-field__control) {
			text-align: center;
			font-size: 28px;
			line-height: 54px;
		}
		&::after {
			content: none;
		}
	}

	&-agree {
		padding-left: 60px;
		background-image: url('@/assets/icons/home/AllLotteryGames/WinGo/agree-b.png');
		background-repeat: no-repeat;
		background-position: left center;
		background-size: 48px;
		font-size: 24px;
		color: var(--colorText-3);
		html:lang(ar) &{
			background-position: right center;
		}
		&.active {
			background-image: url('@icon/common/agree-a.png');
		}
	}

	&-preSaleShow {
		margin-left: 26px;
		font-size: 24px;
		color: var(--norm_red-color);
	}

	&-PreSale {
		width: 528px;

		&-head {
			height: 90px;
			line-height: 90px;
			color: var(--text_color_L4);
			font-size: 30px;
			text-align: center;
			background: var(--main_gradient-color);
		}

		&-body {
			max-height: 600px;
			overflow-y: auto;
			padding: 30px;
			font-size: 24px;
			line-height: 60px;
			color: var(--text_color_L1);

			:deep(p) {
				margin-bottom: 15px;
				line-height: 40px;
			}
		}

		&-foot {
			height: 140px;
			display: flex;
			justify-content: center;
			align-items: center;

			&-btn {
				width: 60%;
				background: var(--main_gradient-color);
				border-radius: 40px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				font-size: 28px;
				color: var(--text_color_L4);
			}
		}
	}
}

.bgcolor {
	pointer-events: all;
	color: var(--text_color_L4);
	background: var(--main-color);
}
</style>
