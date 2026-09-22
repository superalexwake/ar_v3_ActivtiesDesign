<template>
	<div class="gameList">
		<van-skeleton :loading="loading">
			<template #template>
				<div class="slidebar_ske">
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
			</template>
			<van-sidebar v-model="active" class="mySideBar" @change="onChange">
				<van-sidebar-item v-for="(item, index) in siderList" :key="index" :id="'gameType-' + item.key">
					<template #title>
						<div :class="{ whiteColor: index === active }" v-if="item.isShow">
							<img :src="getGameIcon(item.key, index)">
							<template v-if="item.title.includes('Mini')">
								Mini<br />games
							</template>
							<template v-else>
								{{ item.title }}
							</template>
						</div>
					</template>
				</van-sidebar-item>
			</van-sidebar>
		</van-skeleton>

		<!-- 首页右侧游戏渲染组件 -->
		<GameListGrid v-show="siderList[active]" :currentGame="currentGame" ref="gameListGridRef" />
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import GameListGrid from './GameListGrid.vue'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'
import popularIcon from '@icon/home/popular.png'
import popularActiveIcon from '@icon/home/icon-popular.png'
import slotIcon from '@icon/home/slot.png'
import slotActiveIcon from '@icon/home/icon-slot.png'
import sportIcon from '@icon/home/sport.png'
import sportActiveIcon from '@icon/home/icon-sport.png'
import videoIcon from '@icon/home/video.png'
import videoActiveIcon from '@icon/home/icon-video.png'
import chessIcon from '@icon/home/chess.png'
import chessActiveIcon from '@icon/home/icon-chess.png'
import fishIcon from '@icon/home/fish.png'
import fishActiveIcon from '@icon/home/icon-fish.png'
import flashIcon from '@icon/home/flash.png'
import flashActiveIcon from '@icon/home/icon-flash.png'
import lotteryIcon from '@icon/home/lottery.png'
import lotteryActiveIcon from '@icon/home/icon-lottery.png'

const { t } = useI18n()

const active = ref(0)

const loading = ref(false)

const siderList = reactive<any[]>([])

const currentGame = computed(() => {
	return siderList[active.value]?.key ? siderList[active.value]?.key : ''
})

const {getGameType, homeState} = useHome()

const gameIconMap: Record<string, string> = {
	popular: popularIcon,
	'icon-popular': popularActiveIcon,
	slot: slotIcon,
	'icon-slot': slotActiveIcon,
	sport: sportIcon,
	'icon-sport': sportActiveIcon,
	video: videoIcon,
	'icon-video': videoActiveIcon,
	chess: chessIcon,
	'icon-chess': chessActiveIcon,
	fish: fishIcon,
	'icon-fish': fishActiveIcon,
	flash: flashIcon,
	'icon-flash': flashActiveIcon,
	lottery: lotteryIcon,
	'icon-lottery': lotteryActiveIcon
}

const getGameIcon = (key: string, index: number) => {
	const iconKey = index === active.value ? `icon-${key}` : key
	return gameIconMap[iconKey] || ''
}

const getGameTypeList = async () => {
	await getGameType()
	if (homeState.gameTypeList.length > 0) {
		homeState.gameTypeList.forEach((item) => {
			if (item.state !== 1 || item.categoryCode ==="BigAward") return
			siderList.push({
				isShow: item.state === 1,
				title:t('code' + item.typeNameCode),
				img: item.categoryImg,
				key: item.categoryCode.toLocaleLowerCase()
			})
		})
		sessionStorage.setItem('gameMenu', JSON.stringify(siderList))
	}
}

// 点击左侧游戏类型
const onChange = (e: any) => {
	sessionStorage.setItem('clickedGameType', siderList[e].key)
}

const init = async () => {
	loading.value = true
	await getGameTypeList()
	const clickedGameType = sessionStorage.getItem('clickedGameType' || null)
	if (clickedGameType !== null) {
		const index = siderList.findIndex((item) => item.key === clickedGameType)
		if (index >= 0) {
			active.value = index
			nextTick(() => {
				onChange(index)
				const clickedElement = document.getElementById('gameType-' + clickedGameType)
				setTimeout(() => {
					if (clickedElement) {
						clickedElement.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center'
						})
					}
				}, 0)
			})
		}
	}
	loading.value = false
}

init()

</script>

<style lang="scss" scoped>
.gameList {
	display: flex;
	min-height: 1176px;
	margin: 30px 0 40px;
	.whiteColor {
		background: linear-gradient(180deg, #FFC43A 32.69%, #FFF59C 49.97%, #FFE319 57.09%, #FC9714 67.31%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 2px 1px #FFC43A, 0 4px 4px rgba(0, 28, 13, 0.65);
		-webkit-text-stroke-width: 0.5px;
		text-transform: uppercase;
		font-family: 'Poppins';
		font-size: 22px;
		font-weight: 700;
	}

	.mySideBar {
		flex-shrink: 0;
		flex-grow: 1;
		color:var(--main-color);
		.van-sidebar-item {
			display: flex;
			justify-content: center;
			align-items: center;
			width:115px;
			height:135px;
			margin-bottom: 16px;
			border-radius: 16px;
			padding: 0;
			background: #BCECCE;
			font-family: 'Poppins';
			font-size: 20px;
			font-style: normal;
			font-weight: 700;
			text-transform: uppercase;
			img{
				//width: 80px;
				height:62px;
			}

			&--select {
				background: var(--main_gradient-color2);
				text-align: center;
				font-family: 'Poppins';
				font-size: 22px;
				font-style: normal;
				font-weight: 700;
				//line-height: normal;
				&::before {
					display: none;
				}
			}

			.van-badge__wrapper {
				display: block !important;
				& > div {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 20px;
					text-align: center;
					line-height: 28px;
				}
			}
		}
	}
}
::v-deep(.van-badge__wrapper) {
	display: block;
}
.slidebar_ske {
	display: flex;
	flex-direction: column;
	div {
		width: 115px;
		height: 135px;
		margin-bottom: 16px;
	}
}
</style>
