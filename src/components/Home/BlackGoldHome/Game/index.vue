<template>
	<GameMenu :all-game-list="store.allGameList" @click-menu="handleMenuChange" />
	<GamesList v-if="store.currentGame" :gameData="store.currentGame" />
</template>
<script setup lang="ts">
import GameMenu from './gameMenu.vue'
import GamesList from '@/components/Home/BlackGoldHome/AllGames/GameList.vue'
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'
interface AllGame {
	isAll: boolean
	img: string
	isShow: boolean
	gameList: any[]
	gameType: string
	title: string
}

const { getGameType, homeState, getAllGame } = useHome()

const { t } = useI18n()
const store = reactive<{ allGameList: AllGame[]; currentGame?: AllGame }>({
	allGameList: [],
	currentGame: undefined
})

const handleMenuChange = (val: any) => {
	const el: any = document.querySelector('#gameList')
	const offsetTop = el?.offsetTop || 0
	sessionStorage.setItem('clickMenu', val.type)
	store.currentGame = val.gameMenu
	window.scrollTo({
		top: offsetTop - 100,
		behavior: 'smooth'
	})
}

/**
 * @description: 获取首页游戏大类列表
 * @return {*}
 */
const getGameTypeList = async () => {
	await getGameType()

	store.allGameList = homeState.gameTypeList
		.filter((item) => item.categoryCode !== 'BigAward')
		.map((item) => ({
			isAll: false,
			img: item.categoryImg,
			isShow: item.state === 1,
			gameList: [],
			gameType: item.categoryCode.toLocaleLowerCase(),
			title: t('code' + item.typeNameCode)
		}))
}
/**
 * @description: 获取首页游戏内容，并和大类列表进行匹配
 * @return {*}
 */
const getGameList = async () => {
	await getGameTypeList()
	await getAllGame()
	const gamelist = homeState.allGameList as any
	store.allGameList = store.allGameList.map((item) => {
		if (item.gameType === 'popular') {
			item.gameList = [...gamelist[item.gameType].platformList, ...gamelist[item.gameType].clicksTopList]
		} else {
			item.gameList = gamelist[item.gameType]
		}
		if (!item.gameList) {
			item.isShow = false
		}
		return item
	})
	let clickMenu = sessionStorage.getItem('clickMenu') || ''
	if (clickMenu) {
		// store.currentMenu = clickMenu
		store.currentGame = store.allGameList.find((item) => item.gameType === clickMenu)
	} else {
		// currentMenu.value = store.allGameList[0].gameType
		let item = store.allGameList.find((item) => item.gameType === 'lottery')
		if (!item) {
			item = store.allGameList[0]
		}
		store.currentGame = item
	}
	sessionStorage.setItem('allGameList', JSON.stringify(store.allGameList))
}

onMounted(() => {
	getGameList()
})
</script>
<style scoped lang="scss"></style>
