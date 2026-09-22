<template>
	<div class="gameListGrid__container" :class="{ all_container: isAll }">
		<van-skeleton :loading="loading" v-if="currentGame === 'popular'">
			<template #template>
				<div class="skeleton_hot">
					<div class="hot_tit"></div>
					<div class="hot_list">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<div class="hot_tit"></div>
					<div class="hot_list">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			</template>
			<!-- 热门 -->
			<HotGameItem
				:platformList="getPlatformList"
				:clicksTopList="getClicksTopList"
				@onItemClick="onItemClick"
				:isAll="isAll"
			/>
		</van-skeleton>

		<van-skeleton :loading="loading" v-if="getType === 2">
			<template #template>
				<div class="skeleton_other">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</template>
			<!-- 体育、棋牌、真人 -->
			<div class="otherGame">
				<OtherGameItem
					v-for="(item, index) in gameData[currentGame]"
					:key="index"
					:info="item"
					:gameType="currentGame"
					:isAll="isAll"
					@click="handleOpenGame(item, currentGame)"
				/>
			</div>
		</van-skeleton>

		<van-skeleton :loading="loading" v-if="getType === 4">
			<template #template>
				<div class="skeleton_slot">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</template>
			<!-- 电子 -->
			<ElectronicWinRate v-if="!isAll" />
			<ElectronicItem v-if="isHome" :gameData="gameData[currentGame]" :isAll="isAll" @handleOpenGame="handleOpenGame" />
			<Slot v-else />
		</van-skeleton>

		<van-skeleton :loading="loading" v-if="getType === 3">
			<template #template>
				<div class="skeleton_other">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</template>
			<!-- 彩票 -->
			<LotterySlotItem :gameData="gameData[currentGame]" :isAll="isAll" />
		</van-skeleton>

		<!-- 小游戏、捕鱼 -->
		<van-skeleton :loading="loading" v-if="getType === 5">
			<template #template>
				<div class="skeleton_flash">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</template>
			<OnlineGamesItem
				:gameData="gameData[currentGame]"
				:gameType="currentGame"
				:isAll="isAll"
				@onItemClick="onItemClick"
			/>
		</van-skeleton>

		<button @click="goAll" class="look_all" v-if="!isAll">
			<img src="@icon/home/all.png" alt="" />
			{{ $t('viewAll') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import HotGameItem from './HotGameItem.vue'
import OnlineGamesItem from './OnlineGamesItem.vue'
import LotterySlotItem from './LotterySlotItem.vue'
import OtherGameItem from './OtherGameItem.vue'
import ElectronicItem from './ElectronicItem.vue'
import ElectronicWinRate from './ElectronicWinRate.vue'
import Slot from '@/components/Home/Electronic/Slot/index.vue'
import { useHome } from '@/hooks'

const props = defineProps({
	currentGame: {
		type: String,
		default: ''
	},
	isAll: {
		type: Boolean,
		default: false
	}
})
const router = useRouter()
const loading = ref(true)
const isHome = computed(() => router.currentRoute.value.name !== 'AllGames')
const { onItemClick, getAllGame, homeState,checkMaintain } = useHome()

const gameData = computed<any>(() => JSON.parse(JSON.stringify(homeState.allGameList || {})))

const getType = computed(() => {
	if (props.currentGame === 'popular') return 1
	let otherList = ['sport', 'chess', 'video']
	if (otherList.includes(props.currentGame as string)) return 2
	if (props.currentGame === 'lottery') return 3
	if (props.currentGame === 'slot') return 4
	if (props.currentGame === 'flash' || props.currentGame === 'fish') return 5
	return -1
})

const getGameList = async () => {
	await getAllGame()
    gameData.value['popular'] =  [homeState.allGameList?.popular.platformList, homeState.allGameList?.popular.clicksTopList]
    loading.value = false
}

const goAll = () => {
	router.push({
		name: 'AllGames',
		query: {
			type: props.currentGame
		}
	})
}

const getPlatformList = computed(() => {
	return gameData.value[props.currentGame].length < 1 ? [] : gameData.value[props.currentGame][0]||[]
})

const getClicksTopList = computed(() => {
	if (gameData.value[props.currentGame].length < 1) return []
	if (props.isAll) {
		return gameData.value[props.currentGame][1] || []
	}
	return gameData.value[props.currentGame][1]?.slice(0, 9)||[]
})

const handleOpenGame = async (item: any, key: string) => {
	let otherList = ['chess', 'slot']
	if (otherList.includes(key)) {
		if (checkMaintain(item)) return
		sessionStorage.setItem('slotGamesList', JSON.stringify(gameData.value[props.currentGame]))
		sessionStorage.setItem('gameType', JSON.stringify(props.currentGame))
		sessionStorage.setItem('clickedItem', JSON.stringify(item))
		router.push({
			name: 'AllOnlineGames'
		})
	} else {
		onItemClick(item)
	}
}

getGameList()
</script>

<style lang="scss" scoped>
.gameListGrid__container {
	position: sticky;
	top: 92px+92px;
	display: inline-flex;
	flex-direction: column;
	width:570px;
	height: min-content;
	//padding-left: 10px;
	&-gameRec {
		display: flex;
		align-items: center;
		margin-bottom: 16.63px;
		font-size: 24px;
		font-weight: 700;
		svg {
			width: 36.29px;
			height: 36.29px;
			margin-right: 8.36px;
		}

		:deep(.hotGames) {
			g {
				path {
					fill: var(--colorText-26);
				}
			}
		}
	}

	&-wrapper {
		display: grid;
		gap: 15px 20px;
		padding-left: 10px;

		&__item {
			position: relative;
			width: 246px;
			height: 160px;

			img {
				width: 100%;
				height: 100%;
			}

			.hotBadge {
				position: absolute;
				top: -8px;
				right: -8px;
				width: 38.74px;
				height: 36.01px;
			}

			&.hot {
				width: 166.31px;
				height: 166.31px;
			}
		}
	}
}

.look_all {
	width: 100%;
	height: 80px;
	border: 1px solid var(--main-color);
	border-radius: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--bg_color_L2);
	font-size: 26px;
	color: var(--main-color);
	img {
		width: 48px;
		height: 48px;
		margin-right: 14px;
	}
}
.all_container {
	width: 100%;
	padding-left: 0;
}
.skeleton_hot {
	width: 100%;
	height: 100%;
	margin-right: 12px;
	.hot_tit {
		width: 100%;
		height: 36px;
		margin-bottom: 16px;
	}
	.hot_list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 14px;
		margin-bottom: 26px;
		div {
			width: 166px;
			height: 166px;
			background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);
			box-shadow: var(--BoxShadowColor-9), var(--BoxShadowColor-20);
			border-radius: 16px;
			margin-bottom: 12px;
		}
	}
}

.skeleton_other {
	width: 100%;
	display: flex;
	flex-direction: column;
	div {
		width: 100%;
		height: 200px;
		border-radius: 40px;
		background: var(--main_gradient-color2);
		box-shadow: var(--BoxShadowColor-20), var(--BoxShadowColor-25);
		margin-bottom: 20px;
	}
}

.skeleton_slot {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 16px;
	div {
		width: 252px;
		height: 320px;
		background: var(--main_gradient-color2);
		box-shadow: var(--BoxShadowColor-9), var(--BoxShadowColor-20);
		border-radius: 20px;
	}
}

.skeleton_flash {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 34px;
	margin-bottom: 30px;
	div {
		width: 244px;
		height: 244px;
		background: var(--main_gradient-color2);
		box-shadow: var(--BoxShadowColor-9), var(--BoxShadowColor-20);
		border-radius: 20px;
	}
}

.otherGame {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap:0 18px;
	//grid-gap:16px 14px;
	//margin-bottom: 26px;
}

::v-deep(.van-skeleton) {
	padding: 0;
}
</style>
