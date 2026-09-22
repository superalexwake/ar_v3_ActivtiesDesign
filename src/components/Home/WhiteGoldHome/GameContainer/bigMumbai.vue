<template>
	<div class="game_container">
		<van-skeleton :loading="loading">
			<template #template>
				<div class="slidebar_title">
					<div></div>
				</div>
			</template>
			<div class="game_title">{{ currentTitle }}</div>
		</van-skeleton>

		<van-tabs
			v-if="getType === 3"
			:swipe-threshold="4"
			class="lottery_tabbar"
			v-model:active="currentLottery"
			type="card"
			background="transparent"
			ref="tabsRef"
		>
			<van-tab v-for="(item, index) in gameList.lottery" :key="index">
				<template #title>
					<span>{{ item.categoryCode }}</span>
				</template>
			</van-tab>
		</van-tabs>

		<div class="driver"></div>
		<van-skeleton :loading="loading" v-if="getType === 2">
			<template #template>
				<div class="slidebar_other">
					<div v-for=" in 4"></div>
				</div>
			</template>
			<ElectronicWinRate v-if="['slot'].includes(currentMenu)"></ElectronicWinRate>
			<OtherGameItem :gameList="gameList[currentMenu]" :game-type="currentMenu" @onItemClick="onItemClick" />
		</van-skeleton>

		<van-skeleton :loading="loading" v-if="getType === 1">
			<template #template>
				<div class="slidebar_hot">
					<div v-for=" in 9"></div>
				</div>
			</template>
			<HotGameItem :gameList="gameList[currentMenu]" :game-type="currentMenu" @onItemClick="onItemClick" />
		</van-skeleton>

		<van-skeleton :loading="loading" v-if="getType === 3">
			<template #template>
				<div class="slidebar_lottery">
					<div v-for=" in 6"></div>
				</div>
			</template>
			<LotteryItem :current-lottery="gameList[currentMenu][currentLottery].categoryCode" @onItemClick="onItemClick" />
		</van-skeleton>
		<!-- <OtherGameItem :gameList="gameList[currentMenu]" :game-type="currentMenu" v-if="getType === 2" /> -->
	</div>
</template>
<script setup lang="ts">
import { getAllGameList } from '@/api'
import { useHomeStore } from '@/stores'
import type { AllGameList } from '@/types/api'
import {AwaitApiResult, deepCopy} from '@/utils'
import { computed, reactive, ref } from 'vue'
import OtherGameItem from '@/components/Home/WhiteGoldHome/GameList/OtherGameItem.vue'
import HotGameItem from '@/components/Home/WhiteGoldHome/GameList/HotGameItem.vue'
import LotteryItem from '@/components/Home/WhiteGoldHome/GameList/LotteryBigMumbaitem.vue'
import ElectronicWinRate from '@/components/Home/WhiteGoldHome/GameList/ElectronicWinRate.vue'
import { useRouter } from 'vue-router'
import { GlobalStore } from '@/stores'
import { useHome } from '@/hooks'


const { isAlowGame,openThirdGame,checkMaintain } = useHome()

const homeStore = useHomeStore()
const loading = ref(false)
const currentTitle = computed(() => homeStore.getCurrentTitle)
const currentMenu = computed(() => homeStore.getCurrentMenu)
const gameList = reactive<any>({})
const router = useRouter()
const currentLottery = ref(0)

const getType = computed(() => {
	let hot = ['popular', 'flash', 'fish']
	if (hot.includes(currentMenu.value)) return 1
	let otherList = ['sport', 'chess', 'video', 'slot']
	if (otherList.includes(currentMenu.value)) return 2
	if (currentMenu.value === 'lottery') return 3
	return -1
})

const getGameList = async () => {
	loading.value = true
	const res = await AwaitApiResult<ObjResNull<AllGameList>>(getAllGameList())
	const otherList = ['slot', 'video', 'chess', 'sport', 'lottery']
	if (res) {
		const gamelist = deepCopy(res.data)
		for (const [key, value] of Object.entries(gamelist)) {
			let k = key.toLocaleLowerCase()
			if (otherList.includes(k)) {
				gameList[k] = value.filter((suc: any) => suc.state === 1)
			} else if (k === 'popular') {
				gameList[k] = [...gamelist[k].platformList, ...gamelist[k].clicksTopList]
			} else {
				gameList[k] = value
			}
		}
		gameList.lottery.unshift({
			categoryCode: 'All'
		})

		sessionStorage.setItem('gameData', JSON.stringify(gameList))
	}
	loading.value = false
}
const onItemClick = (info: any) =>{
	isAlowGame(info, onItemHandle)
}
const onItemHandle = (info: any) => {

	const globalStore = GlobalStore()
	if(!globalStore.token) {
		router.push({ name: 'login' })
		return;
	}
	let { item, key } = info
	let otherList = ['chess', 'slot']
	if (otherList.includes(key)) {
		if (checkMaintain(item)) return
		sessionStorage.setItem('slotGamesList', JSON.stringify(gameList[key]))
		sessionStorage.setItem('gameType', JSON.stringify(currentMenu.value))
		sessionStorage.setItem('clickedItem', JSON.stringify(item))
		router.push({
			name: 'AllOnlineGames'
		})
	} else {
		openThirdGame(item)
	}
}

getGameList()
</script>
<style lang="scss" scoped>
.game_container {
	padding-top: 30px;
	border-top: 2px solid #e5e8f5;
	margin-bottom: 30px;
	.game_title {
		text-align: center;
		font-size: 30px;
		font-style: normal;
		font-weight: 400;
		margin-bottom: 24px;
	}
	.driver {
		width: 100%;
		height: 3px;
		position: relative;
		background-color: #FB716C;
		margin-bottom: 30px;
	}
	.driver::before,
	.driver::after {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #FB716C;
	}

	.driver::before {
		left: -8px;
		top: -6px;
		html:lang(ar) &{
			left: unset;
			right: -8px;
		}
	}

	.driver::after {
		right: -8px;
		top: -6px;
		html:lang(ar) &{
			left: -8px;
			right: unset;
		}
	}
}
.slidebar_other {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 24px;
	div {
		width: 340px;
		height: 346px;
		border-radius: 48px;
		background: #e9f3ff;
	}
}
.slidebar_hot {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
	div {
		width: 218px;
		height: 218px;
		background: #e9f3ff;
	}
}
.slidebar_lottery {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
	div {
		width: 218px;
		height: 218px;
		border-radius: 38px;
		background: #e9f3ff;
	}
}
.slidebar_title {
	width: 120px;
	height: 42px;
	background: #f0f0f5;
	margin: auto;
	margin-bottom: 24px;
}
::v-deep(.van-skeleton) {
	padding: 0;
}

.lottery_tabbar {
	border-radius: 54px;
	background: #FFF;
	border-color: transparent;
	margin-bottom: 30px;
	height: 80px;

}
:deep(.van-tabs__nav--card) {
	height: 80px;
	border: none;
	background: linear-gradient(180deg, #f0f0f5 0%, #e5e8f5 100%);
	.van-tab--card {
		border: none;
		font-size: 20px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		color: #707070 !important;
	}
	.van-tab--active {
		color: #171717 !important;
		background-color: transparent;
	}
}
</style>
