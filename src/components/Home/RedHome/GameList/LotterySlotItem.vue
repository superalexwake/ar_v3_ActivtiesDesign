<template>
	<div class="lottery_container">
		<div class="lotterySlotItem" v-for="item in gameData" :key="item.id" @click="isAlowGame(item, onItemClick)">
			<img v-lazy="item.categoryImg" />
			<span>{{ formatString(item.categoryCode) }}</span>
			<h4>
				<div>{{ getHint(item.categoryCode)[0] }}</div>
				<div>{{ getHint(item.categoryCode)[1] }}</div>
			</h4>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks';
const {isAlowGame,openThirdGame,isSassLotteryGame } = useHome();
const { t } = useI18n()

const router = useRouter()
withDefaults(
	defineProps<{
		gameData: any[]
		isAll: boolean
	}>(),
	{}
)

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
				newStr = [t('VideoWinGoTip'),t('VideoWinGoTip2')]
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
</script>

<style lang="scss" scoped>
.lotterySlotItem {
	position: relative;
	width: 100%;
	height: 170px;
	text-align: end;
	background:var(--bg_color_L3);
	margin-bottom: 20px;
	border-radius: 40px;

	img {
		// width: 100%;
		height: 100%;
	}

	span {
		position: absolute;
		top: 20px;
		left: 30px;
		color: var(--text_color_L1);
		white-space: break-spaces;
		font-weight: 700;
		font-size: 35px;
	}

	h4 {
		color: var(--text_color_L2);
		font-weight: 400;
		font-size: 22px;
		position: absolute;
		bottom: 20px;
		left: 30px;
		white-space: pre-wrap;
		text-align: left;
		line-height: 35px;
		opacity: .7;
	}
}
</style>
