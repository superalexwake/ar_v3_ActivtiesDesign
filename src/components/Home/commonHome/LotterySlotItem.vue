<template>
	<div class="lottery_container">
		<div class="lotterySlotItem" v-for="item in gameList" :key="item.id" @click="isAlowGame(item, onItemClick)" v-show="item.state == 1">
			<div class="lottery">
				<div class="lottery_bg" :data-code="item.categoryCode" />
				<img class="lottery_logo" v-lazy="item.categoryImg" />
				<span>{{ formatString(item.categoryCode) }}</span>
				<h4>
					<div>{{ getHint(item.categoryCode)[0] }}</div>
					<div>{{ getHint(item.categoryCode)[1] }}</div>
				</h4>
			</div>
			<div class="win_info">
				<div :id="item.id + 'win'">
					<div
						class="win_item"
						v-for="(suc) in winList[formatString(item.categoryCode)]"
					>
						<div class="left">
							<img v-lazy="getAvatarUrl(suc.userPhoto)" alt="" :data-img="defaultAvatar" />
							<span>{{ suc.nickName }}</span>
						</div>
						<div class="right">{{ $t('winningAmount') }}{{ currency(suc.amount || 0) }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { currency } from '@/utils'
import type { HomeGameList } from '@/types/api'
import { computed, reactive, ref, toRef, watch,nextTick,onUnmounted } from 'vue'
import autoAnimate from '@formkit/auto-animate'
import { useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
const { t } = useI18n()
const router = useRouter()
const {homeState, isAlowGame,isSassLotteryGame,openThirdGame} = useHome()
const { getAvatarUrl, defaultAvatar } = useAssets()
const props = withDefaults(
	defineProps<{
		gameList: HomeGameList[]
	}>(),
	{}
)
const winList = reactive<any>({
	'Win Go': [],
	'K3 Lotre': [],
	 XOSO: [],
	'5D Lotre': [],
	'Trx Win': [],
	'MotoRace':[]
})
const timer = ref(null as unknown as NodeJS.Timeout)
const winLists = computed(() => homeState.winInfoList)

/**
 * @description: 过滤彩票游戏名字
 * @param {*} string
 * @return {*}
 */
const formatString = (string: string) => {
	if (string) {
		let newStr = string
		switch (newStr) {
			case 'Trx Win Go':
				newStr = 'Trx Win'
				break
			case 'K3':
			case '5D':
				newStr = newStr + ' Lotre'
				break
			case 'FXOSO':
				newStr = t('FXOSO')
			default:
				newStr = newStr
		}
		return newStr
	}
	return ''
}

/**
 * @description: 获取彩票游戏名字
 * @param {*} string
 * @return {*}
 */
const getHint = (string: string) => {
	if (string) {
		let newStr: string[] = []
		switch (string) {
			case 'Win Go':
			case 'Trx Win Go':
				newStr = [t('lotteryHintStr1'), t('lotteryHintStr2')]
				break
			case '5D':
			case 'K3':
				// 				newStr = `猜猜 数字
				// 高/低/奇数/偶数`
				newStr = [t('lotteryHintStr3'), t('lotteryHintStr4')]
				break
			case 'XOSO':
			case 'FXOSO':
				newStr = [t('lotteryHintStr5'), t('lotteryHintStr6')]
				break
			case 'Bingo18':
				newStr = [t('lotteryHintStr5'), t('lotteryHintStr6')]
				break
			case '4D':
				newStr = [t('lotteryHintStr7'), t('lotteryHintStr6')]
				break
			case 'MotoRace':
				newStr = [t('moto8'),t('moto9')]
				break
			case 'VideoWinGo':
				newStr = [t('VideoWinGoTip'), t('VideoWinGoTip2')]
				break
			default:
				newStr = []
		}
		return newStr
	}
	return ''
}

const lotteryRoutes = [
	{
		value: 1,
		path: 'WinGo'
	},
	{
		value: 3,
		path: '5D'
	},
	{
		value: 2,
		path: 'K3'
	},
	{
		value: 4,
		path: 'WinTrx'
	},
	{
		value: 5,
		path: 'XoSo'
	},
	{
		value: 6,
		path: 'XoSo'
	},
	{
		value: 7,
		path: 'Binguo'
	},
	{
		value: 8,
		path: '4D'
	}
]

/**
 * @description: 点击前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	if (isSassLotteryGame(item)){
		return openThirdGame({...item,vendorCode:'ARLottery'})
	}
	router.push({
		name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
		query: {id:item.id}
	})
	// console.log('游戏', lotteryRoutes)
}
/**
 * @description: 获取中奖信息
 * @return {*}
 */
const getWin = async () => {
	const data = homeState.winInfoList
	winList['5D Lotre'] = data.filter((item)=>item.showType==7)
	winList['K3 Lotre'] = data.filter((item)=>item.showType==9)
	winList['XOSO'] = data.filter((item)=>item.showType==10)
	winList['Trx Win'] = data.filter((item)=>item.showType==8)
	winList['Win Go'] = data.filter((item)=>item.showType==11)
	winList['MotoRace'] = data.filter((item)=>item.showType==11).sort(() => Math.random() - 0.5) //Jay 产品定的目前获取wingo的随机排序
	setTimeout(() => {
		setAnmation()
	}, 1000)
}

const setAnmation = () => {
	let autoAnimateRef: any = {}
	nextTick(() => {
		Object.keys(winList).map((item) => {
			let currentLottery = props.gameList.find((v) => formatString(v.categoryCode) === item)
			let element = document.getElementById(currentLottery?.id + 'win') as HTMLElement
			if (winList[item].length > 0 && element) {
				autoAnimateRef[item] = toRef(element)
				autoAnimate(autoAnimateRef[item].value)
			}
		})
		if (timer.value) {
			clearInterval(timer.value)
		} else {
			timer.value = setInterval(() => {
				Object.values(winList).forEach((item: any) => {
					if (item.length > 0) {
						item.unshift(item.pop())
					}
				})
			}, 3000)
		}
	})
}

onUnmounted(() => {
	if (timer.value) {
		clearInterval(timer.value)
	}
})

watch(
	[() => props.gameList, () => winLists.value],
	([val, val2]) => {
		if (val.length > 0) getWin()
	},
	{
		immediate: true
	}
)
</script>

<style lang="scss" scoped>
.lotterySlotItem {
	position: relative;
	width: 100%;
	height: 293px;
	text-align: end;
	margin-bottom: 64px;
	background: #f4f5f8;
	box-shadow: 0px 4px 8px rgba(197, 197, 218, 0.26);
	border-radius: 26px;
	.lottery {
		width: 100%;
		height: 209px;
		position: relative;
		.lottery_bg {
			width: 100%;
			height: 209px;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}
		.lottery_logo {
			width: 200px;
			height: 150px;
			position: absolute;
			right: -10px;
			top: -26px;
		}
		span {
			position: absolute;
			top: 35px;
			left: 30px;
			color: #fff;
			white-space: break-spaces;
			font-weight: 700;
			font-size: 42px;
		}

		h4 {
			color: #f4f5f8;
			font-weight: 400;
			font-size: 22px;
			position: absolute;
			bottom: 20px;
			left: 30px;
			white-space: pre-wrap;
			text-align: left;
			line-height: 35px;
		}
	}
}
@each $code in ('Win Go', '5D', 'K3', 'Trx Win Go', 'XOSO', 'FXOSO', 'Bingo18', '4D', 'MotoRace', 'VideoWinGo') {
	.lottery_bg[data-code="#{$code}"] {
		background-image: url('@public/home/lottery/#{$code}_bg.png');
	}
}
.win_info {
	height: 84px;
	overflow: hidden;
	.win_item {
		background: #f4f5f8;
		color: #000000;
		font-size: 24px;
		height: 84px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			margin-left: 30px;
			display: flex;
			flex-direction: row;
			align-items: center;
			img {
				width: 60px;
				height: 60px;
				margin-right: 22px;
				border-radius: 50%;
			}
		}
		.right {
			margin-right: 24px;
		}
	}
}
</style>
