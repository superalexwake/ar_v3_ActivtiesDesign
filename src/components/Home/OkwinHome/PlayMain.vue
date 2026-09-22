<script setup lang="ts">
import {useHome} from "@/hooks";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import Maintain from '@/components/common/Maintain.vue'
import game800 from '@public/home/okwinHome/800.png'
import game100 from '@public/home/okwinHome/100.png'
import Lottery_WinGo from '@public/home/okwinHome/Lottery_WinGo.png'
import game51 from '@public/home/okwinHome/51.png'
import game109 from '@public/home/okwinHome/109.png'
import game223 from '@public/home/okwinHome/223.png'
import game42 from '@public/home/okwinHome/42.png'
import game103 from '@public/home/okwinHome/103.png'
import game98 from '@public/home/okwinHome/98.png'
import SMG_10000Wishes from '@public/home/okwinHome/SMG_10000Wishes.png'
import SMG_wildfireWins from '@public/home/okwinHome/SMG_wildfireWins.png'
import SMG_777Surge from '@public/home/okwinHome/SMG_777Surge.png'
import game9014 from '@public/home/okwinHome/9014.png'
import game9013 from '@public/home/okwinHome/9013.png'
import game14025 from '@public/home/okwinHome/14025.png'
import popularMenuIcon from '@public/home/okwinHome/popular_icon.png'
import flashMenuIcon from '@public/home/okwinHome/flash_icon.png'
import slotMenuIcon from '@public/home/okwinHome/slot_icon.png'
import lotteryMenuIcon from '@public/home/okwinHome/lottery_icon.png'
import fishMenuIcon from '@public/home/okwinHome/fish_icon.png'
import videoMenuIcon from '@public/home/okwinHome/video_icon.png'
import sportMenuIcon from '@public/home/okwinHome/sport_icon.png'
import chessMenuIcon from '@public/home/okwinHome/chess_icon.png'

const menuIcons: Record<string, string> = {
	popular: popularMenuIcon,
	flash: flashMenuIcon,
	slot: slotMenuIcon,
	lottery: lotteryMenuIcon,
	fish: fishMenuIcon,
	video: videoMenuIcon,
	sport: sportMenuIcon,
	chess: chessMenuIcon,
}

const {getAllGame, homeState, onItemClick, isAlowGame,isSassLotteryGame,openThirdGame,checkMaintain} = useHome()
const router = useRouter()
const props = defineProps({
	currentMenu: {
		type: String,
		default: 'popular'
	},
  currentTitle: {
    type: String,
    default: 'hot'
  }
})
const gameList = ref<any>({})
const currentGame = computed(() => gameList.value[props.currentMenu])
const popular = [
	{
		title: 'aviator',
		gameCode: '800',
		imgUrl: game800,
		vendorCode: 'TB_Chess',
		vendorID:23
	},
	{
		title: 'mines',
		gameCode: '100',
		imgUrl: game100,
		vendorCode: 'TB_Chess',
		vendorID:23
	},
	{
		title: 'winGo',
		gameCode: 'winGo',
		imgUrl: Lottery_WinGo
	},
	{
		title: 'moneyComing',
		gameCode: '51',
		imgUrl: game51,
		vendorCode: 'JILI',
		vendorID:18
	},
	{
		title: 'fortuneGems',
		gameCode: '109',
		imgUrl: game109,
		vendorCode: 'JILI',
		vendorID:18
	},
	{
		title: 'fortuneGems2',
		gameCode: '223',
		imgUrl: game223,
		vendorCode: 'JILI',
		vendorID:18
	},
	{
		title: 'ganeshaGold',
		gameCode: '42',
		imgUrl: game42,
		vendorCode: 'PG',
		vendorID:5
	},
	{
		title: 'cryptoGold',
		gameCode: '103',
		imgUrl: game103,
		vendorCode: 'PG',
		vendorID:5
	},
	{
		title: 'fortuneOX',
		gameCode: '98',
		imgUrl: game98,
		vendorCode: 'PG',
		vendorID:5
	},
	{
		title: '10000Wishes',
		gameCode: 'SMG_10000Wishes',
		imgUrl: SMG_10000Wishes,
		vendorCode: 'MG',
		vendorID:4
	},
	{
		title: 'wildfireWins',
		gameCode: 'SMG_wildfireWins',
		imgUrl: SMG_wildfireWins,
		vendorCode: 'MG',
		vendorID:4
	},
	{
		title: '777Surge',
		gameCode: 'SMG_777Surge',
		imgUrl: SMG_777Surge,
		vendorCode: 'MG',
		vendorID:4
	},
	{
		title: 'mines',
		gameCode: '9014',
		imgUrl: game9014,
		vendorCode: 'JDB',
		vendorID:6
	},
	{
		title: 'galaxyBurst',
		gameCode: '9013',
		imgUrl: game9013,
		vendorCode: 'JDB',
		vendorID:6
	},
	{
		title: 'luckyRacing',
		gameCode: '14025',
		imgUrl: game14025,
		vendorCode: 'JDB',
		vendorID:6
	}
]

const {t} = useI18n()

const goAll = () => {
	router.push({
		name: 'AllGames',
		query: {
			type: props.currentMenu
		}
	})
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

const goLottery = (x: any) => {
	if (isSassLotteryGame(x)){
		return openThirdGame({...x,vendorCode:'ARLottery'})
	}
	router.push({
		name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === x.id)].path,
		query: {id:x.id}
	})
}

const handleGame = (item: any) => {
	if (props.currentMenu === 'popular' && item.title === 'winGo') {
		isAlowGame({...item, id: 1,gameCode:"WinGo_30S",},  goLottery)
		return
	}
	if (props.currentMenu === 'lottery') {
		isAlowGame(item, goLottery)
	} else if (['chess', 'slot'].includes(props.currentMenu)) {
		if (checkMaintain(item)) return;
		sessionStorage.setItem('slotGamesList', JSON.stringify(currentGame.value))
		sessionStorage.setItem('gameType', JSON.stringify(props.currentMenu))
		sessionStorage.setItem('clickedItem', JSON.stringify(item))
		router.push({
			name: 'AllOnlineGames'
		})
	} else {
		onItemClick(item)
	}
}

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

onMounted(async () => {
	await getAllGame()
	gameList.value = homeState.allGameList
	gameList.value.popular = popular
})

</script>

<template>
	<div id="ok_game_main">
		<div class="title">
			<div class="left">
				<img class="game_icon" :src="menuIcons[currentMenu]" alt=""/>
				<span>{{ $t(currentTitle) }}</span>
			</div>
			<div class="more" v-if="currentMenu !== 'popular'" @click="goAll">View all</div>
		</div>
		<div class="game_list" v-if="currentMenu !== 'lottery'">
			<div class="game_item" v-for="item in currentGame" :key="item.gameCode" @click="handleGame(item)">
				<img :src="item.imgUrl || item.img || item.categoryImg || item.vendorImg" alt=""/>
				<Maintain :item="item"/>
			</div>
		</div>
		<div class="lottery_list" v-else>
			<div class="lotteryItem" v-for="item in currentGame" :key="item.id" @click="handleGame(item)">
				<img v-lazy="item.categoryImg" />
				<span>{{ formatString(item.categoryCode) }}</span>
				<h4>
					<div>{{ getHint(item.categoryCode)[0] }}</div>
					<div>{{ getHint(item.categoryCode)[1] }}</div>
				</h4>
			</div>
		</div>

	</div>
</template>

<style scoped lang="scss">
#ok_game_main {
	position: relative;
	z-index: 2;
	margin-bottom: 50px;

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;

		.left {
			display: flex;
			align-items: center;

			.game_icon {
				width: 64px;
				height: 64px;
				margin-right: 12px;
			}

			span {
				color: #1E2637;
				line-height: 64px;
				font-size: 32px;
				font-weight: 700;
			}
		}

		.more {
			width: 140px;
			height: 56px;
			text-align: center;
			line-height: 56px;
			border-radius: 16px;
			border: 1px solid #FB5B5B;
			color: #FB5B5B;
			font-size: 28px;
			font-weight: 500;
		}
	}
}

.game_list {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 18px;

	.game_item {
		position: relative;
		width: 220px;
		height: 300px;
		border-radius: 16px;
		overflow: hidden;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}

.lottery_list {
	.lotteryItem {
		position: relative;
		width: 100%;
		height: 170px;
		text-align: end;
		background: linear-gradient(110deg, #ff8e89 -5%, #ffc3a2 73%);
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
			color: #fff;
			white-space: break-spaces;
			font-weight: 700;
			font-size: 35px;
		}

		h4 {
			color: #fff;
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
}

</style>