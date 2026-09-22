<!--
 * @Author: Seven
 * @Date: 2024-03-19 14:03:49
 * @LastEditTime: 2024-03-19 14:48:27
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="gameListGrid__container" :class="{ all_container: isAll }">
		<!-- 热门 -->
		<HotGameItem v-if="getType === 1"
		:platformList="currentGame.gameList[0]"
			:clicksTopList="getClicksTopList" @onItemClick="onItemClick" :isAll="isAll" />
		<!-- 体育、棋牌、真人 -->
		<div class="otherGame" v-if="getType === 2" :class="{ all_other: isAll }">
			<OtherGameItem
				v-for="(item, index) in currentGame.gameList"
				:key="index"
				:info="item"
				:gameType="currentGame.gameType"
				:isAll="isAll"
				@click="handleOpenGame(item,currentGame.gameType)"
			/>
		</div>
		<!-- 电子 -->
		<ElectronicWinRate v-if="getType === 4"/>
		<ElectronicItem v-if="getType === 4" :gameData="currentGame" :isAll="isAll" @onItemClick="handleOpenGame" />
		<!-- 彩票 -->
		<LotterySlotItem v-if="getType === 3" :gameData="currentGame" :isAll="isAll" />
		<!-- 小游戏、捕鱼 -->
		<OnlineGamesItem v-if="getType === 5" :gameData="currentGame" :isAll="isAll" @onItemClick="onItemClick" />

		<button @click="goAll" class="look_all" v-if="!isAll">
			<img src="@icon/home/all.png" alt="" />
			{{ $t('viewAll') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import HotGameItem from './HotGameItem.vue'
import OnlineGamesItem from './OnlineGamesItem.vue'
import LotterySlotItem from './LotterySlotItem.vue'
import OtherGameItem from './OtherGameItem.vue'
import ElectronicItem from './ElectronicItem.vue'
import ElectronicWinRate from './ElectronicWinRate.vue'
import { useHome } from '@/hooks'

const props = defineProps({
	currentGame: {
		type: Object as PropType<{
			isAll: boolean
			img: string
			isShow: boolean
			gameList: any[]
			gameType: string
			title: string
		}>,
		default: () => {}
	},
	isAll: {
		type: Boolean,
		default: false
	}
})
const router = useRouter()
const { onItemClick, homeState,checkMaintain } = useHome()
const gameData = computed<any>(() => homeState.allGameList)

const getType = computed(() => {
	if (props.currentGame.gameType === 'popular') return 1
	let otherList = ['sport', 'chess', 'video']
	if (otherList.includes(props.currentGame.gameType as string)) return 2
	if (props.currentGame.gameType === 'lottery') return 3
	if (props.currentGame.gameType === 'slot') return 4
	if (props.currentGame.gameType === 'flash' || props.currentGame.gameType === 'fish') return 5
	return -1
})

const goAll = () => {
	sessionStorage.setItem('slotGamesList', JSON.stringify(props.currentGame.gameList))
	sessionStorage.setItem('gameType', JSON.stringify(props.currentGame))
	sessionStorage.setItem('clickedItem', JSON.stringify(props.currentGame.gameList[0]))
	router.push({
		name: 'AllGames',
		query: {
			type: props.currentGame.gameType
		}
	})
}

const getClicksTopList = computed(() => {
	if (props.currentGame.gameList.length < 1) return []
	return props.currentGame.gameList[1].length > 9 && !props.isAll
		? props.currentGame.gameList[1].slice(0, 9)
		: props.currentGame.gameList[1]
})

const handleOpenGame = async (item: any, key: string) => {
	let otherList = ['chess', 'slot']
	if (otherList.includes(key)) {
		if (checkMaintain(item)) return;
		sessionStorage.setItem('slotGamesList', JSON.stringify(gameData.value[props.currentGame.gameType]))
		sessionStorage.setItem('gameType', JSON.stringify(props.currentGame.gameType))
		sessionStorage.setItem('clickedItem', JSON.stringify(item))
		router.push({
			name: 'AllOnlineGames'
		})
	} else {
		onItemClick(item)
	}
}


onMounted(() => {})
</script>

<style lang="scss" scoped>
.gameListGrid__container {
	position: sticky;
	top: 92px+92px;
	display: inline-flex;
	flex-direction: column;
	width: 553.89px;
	height: min-content;
	padding-left: 20px;

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
					fill: #fe6868;
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
	border: 1px solid #f95959;
	border-radius: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f7f8ff;
	font-size: 26px;
	color: #f95959;

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

</style>
