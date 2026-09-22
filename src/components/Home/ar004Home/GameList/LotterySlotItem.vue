<!--
 * @Author: Seven
 * @Date: 2024-03-19 14:04:34
 * @LastEditTime: 2024-03-19 14:04:35
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="lottery_container" :class="{ all_lottery: isAll }">
		<div class="lotterySlotItem" v-for="item in gameData.gameList" :key="item.id" @click="isAlowGame(item, onItemClick)">
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
import { useHome } from '@/hooks'
const { t } = useI18n()

const { isAlowGame,homeState,isSassLotteryGame,openThirdGame,} = useHome()

const router = useRouter()
withDefaults(
	defineProps<{
		gameData: {
			gameList: any[]
			isShow: boolean
			title: string
			img: string
			gameType: string
		}
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

// const lotteryRoutes = ['WinGo', '5D', 'K3', 'WinTrx']
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
}
</script>

<style lang="scss" scoped>

.lotterySlotItem {
	position: relative;
	width: 100%;
	height: 170px;
	text-align: end;
	background:var(--main_gradient-color2);
	box-shadow: var(--BoxShadowColor-20), var(--BoxShadowColor-25);
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
		color: var(--text_color_black, var(--text_color_L4));
		white-space: break-spaces;
		font-weight: 700;
		font-size: 35px;
		html:lang(ar) &{
			left: unset;
			right: 30px;
		}
	}

	h4 {
		color: var(--text_color_black, var(--text_color_L4));
		font-weight: 400;
		font-size: 22px;
		position: absolute;
		bottom: 20px;
		left: 30px;
		white-space: pre-wrap;
		text-align: left;
		line-height: 35px;
		html:lang(ar) &{
			left: unset;
			right: 30px;
		}
	}
}
</style>
