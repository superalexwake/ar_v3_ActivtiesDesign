<template>
	<div class="Maincontainer">
		<div class="firstContainer">
			<div class="insideFirstContainer">
				<div class="firstBox" @click="goOtherPage('DailyTasks')"></div>
				<div v-if="name=='ar068'" class="secondBox" @click="goOtherPage('SuperJackpot')"></div>
				<div v-else class="secondBox" @click="goOtherPage('InvitationBonus')"></div>
			</div>
			<div class="titleActivity">
				<div class="firstTitle" @click="goOtherPage('DailyTasks')">
					{{ $t('activity') }}<span>{{ $t('Richrewardactivities') }}.</span>
				</div>
				<div v-if="name=='ar068'" class="secondTitle" @click="goOtherPage('SuperJackpot')">
					{{ $t('superjackpot') }}<span>{{ $t('gogame1') }}</span>
				</div>
				<div v-else class="secondTitle" @click="goOtherPage('InvitationBonus')">
					{{ $t('invite') }}<span>{{ $t('Invfrndstorvvehugerewards') }}.</span>
				</div>
			</div>
		</div>
	</div>
	<template v-for="(item,key) in categoryList">
	<div class="OriginalContainer" v-if="item.categoryCode == 'Lottery'">
		<div class="insideOriginal">
			<div class="lotteryIcon">
			</div>
			<div class="title">{{ $t('Lotterygames') }}</div>
		</div>

		<div class="arrows" v-if="slotGamesData.length>3">
			<div class="left" @click="handleLset('left')" />
			<div class="right" @click="handleLset('right')" />
		</div>
	</div>
	<div class="OriginalImages" v-if="item.categoryCode == 'Lottery'">
		<div class="OriginalImages_imgs">
			<Swipe class="my_swipe" ref="lotteryRef" :lazy-render="false" :show-indicators="false">
				<SwipeItem v-for="(item, index) in chunk(LotteryGameData, 3)" :key="index">
					<img v-for="(item1, index1) in item" :key="index1" :src="item1.categoryImg" class="img" @click="isAlowGame(item1, goLottery)" />
				</SwipeItem>
			</Swipe>
		</div>
	</div>
	<!-- Original games start from here  -->
	<div class="OriginalContainer" v-if="item.categoryCode == 'Flash'">
		<div class="insideOriginal">
			<div class="icon">
				<span><img src="./imgs/HotGamesHome.png" /></span>
			</div>
			<div class="title">{{ $t('code9308Flash') }}</div>
			<div class="All" @click="goOtherPage('Original')">
				{{ $t('all') }}<span>{{ originalGamesData.length }}</span>
			</div>
		</div>

		<div class="arrows" v-if="slotGamesData.length>3">
			<div class="left" @click="handleOffset('left')" />
			<div class="right" @click="handleOffset('right')" />
		</div>
	</div>

	<div class="OriginalImages" v-if="item.categoryCode == 'Flash'">
		<div class="OriginalImages_imgs" v-if="originalGamesData">
			<Swipe class="my_swipe" ref="swipeRef" :lazy-render="false" :show-indicators="false">
				<SwipeItem v-for="(item, index) in chunk(originalGamesData, 3)" :key="index">

					<div v-for="(item1, index1) in item" class="img"  :key="index1" @click="isAlowGame(item1, goGame)">
						<img  :src="item1.img"  />
						<Maintain :item="item1" />
					</div>
				</SwipeItem>
			</Swipe>
		</div>
	</div>

	<!-- Hot games start from Here  -->

	<div class="OriginalContainer" v-if="item.categoryCode == 'Popular'">
		<div class="insideOriginal">
			<div class="icon">
				<span><img src="./imgs/Fire.png" /></span>
			</div>
			<div class="title">{{ $t('Hotgames') }}</div>
			<div class="All" @click="goOtherPage('HotGames')">
				{{ $t('all') }}<span>{{ hotData.length }}</span>
			</div>
		</div>

		<div class="arrows" v-if="hotData.length>6">
			<div class="left" @click="handleHotset('left')" />
			<div class="right" @click="handleHotset('right')" />
		</div>
	</div>

	<div class="hotImages" v-if="item.categoryCode == 'Popular'">
		<div class="hotImages_hotGames">
			<Swipe class="my-swipeHot" ref="swipeHot" :lazy-render="false" :show-indicators="false">
				<SwipeItem v-for="(item, index) in chunk(hotData, 6)" :key="index">
					<div v-for="(item1, index1) in item" :key="index1" @click="isAlowGame(item1, goGame)">
						<img :src="item1.imgUrl" alt="" />
						<Maintain :item="item1" />
					</div>
				</SwipeItem>
			</Swipe>
		</div>
	</div>

	<!-- casino Starts from here -->
	<div class="OriginalContainer" v-if="item.categoryCode == 'Sport'">
			<div class="insideOriginal">
				<div class="icon">
					<span><img src="./imgs/sport.png" /></span>
				</div>
				<div class="title">{{ $t('sport') }}</div>
				<div class="All" @click="goOtherPage('eSports')">
					{{ $t('all') }}<span>{{ sportData.length }}</span>
				</div>
			</div>
			<div class="arrows" v-if="sportData.length>6">
				<div class="left" @click="handleSportset('left')" />
				<div class="right" @click="handleSportset('right')" />
			</div>
		</div>
	<div class="hotImages" v-if="item.categoryCode == 'Sport'">
			<div class="hotImages_hotGames">
				<Swipe class="my-swipeHot" ref="swipeSport" :lazy-render="false" :show-indicators="false">
					<SwipeItem v-for="(item, index) in chunk(sportData, 6)" :key="index">
						<div :key="index1" v-for="(item1, index1) in item" @click="isAlowGame(item1, goGame)">
							<img

								:src="item1.vendorImg"

								alt=""

							/>
							<Maintain :item="item1" />
						</div>
					</SwipeItem>
				</Swipe>
			</div>
		</div>
	<div class="OriginalContainer" v-if="item.categoryCode == 'Video'">
		<div class="insideOriginal">
			<div class="icon">
				<span><img src="./imgs/Live.png" /></span>
			</div>
			<div class="title">{{ $t('live') }}</div>
			<div class="All" @click="goOtherPage('Casino')">
				{{ $t('all') }}<span>{{ casinoData.length }}</span>
			</div>
		</div>
		<div class="arrows" v-if="casinoData.length>6">
			<div class="left" @click="handleCasinoset('left')" />
			<div class="right" @click="handleCasinoset('right')" />
		</div>
	</div>
	<div class="hotImages" v-if="item.categoryCode == 'Video'">
		<div class="hotImages_hotGames">
			<Swipe class="my-swipeHot" ref="swipeCasino" :lazy-render="false" :show-indicators="false">
				<SwipeItem v-for="(item, index) in chunk(casinoData, 6)" :key="index">
					<div v-for="(item1, index1) in item" :key="index1" @click="isAlowGame(item1, goGame)">
						<img

							:src="item1.vendorImg"

							alt=""

						/>
						<Maintain :item="item1" />
					</div>
				</SwipeItem>
			</Swipe>
		</div>
	</div>
	<!-- Slots starts from here  -->
	<div class="OriginalContainer" v-if="item.categoryCode == 'Slot'">
		<div class="insideOriginal">
			<div class="icon">
				<span><img src="./imgs/Joystick.png" /></span>
			</div>
			<div class="title">{{ $t('code9304Slot') }}</div>
			<div class="All" @click="goOtherPage('Slots')">
				{{ $t('all') }}<span>{{ slotGamesData.length }}</span>
			</div>
		</div>
		<div class="arrows" v-if="slotGamesData.length>6">
			<div class="left"  @click="handleSlotsset('left')"/>
			<div class="right" @click="handleSlotsset('right')" />
		</div>
	</div>

	<div class="SlotImages" v-if="item.categoryCode == 'Slot'">
		<div class="SlotImages_images">
			<Swipe class="my-swipeSlots" ref="swipeSlots" :lazy-render="false" :show-indicators="false">
				<SwipeItem v-for="(item, index) in chunk(slotGamesData, 6)" :key="index">
					<div class="flex_container">
						<div v-for="(item1, index1) in item"
							 :key="index1"
							 @click="gotoSlot(item1)"
						>
							<img

								:src="item1.vendorImg"
								alt=""

							/>
							<Maintain :item="item1" />
						</div>
					</div>
				</SwipeItem>
			</Swipe>
		</div>
	</div>

	</template>
</template>

<script setup lang="ts">
// Hook imported
import { useGames } from '@/hooks/useGoGames.hook'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { SwipeInstance } from 'vant'
import { Swipe, SwipeItem } from 'vant'
import { useGame, useHome } from '@/hooks'
import { requireLoginAction } from '@/hooks/useLoginIntercept'
const { goGame } = useGame()
const { isAlowGame,openThirdGame,isSassLotteryGame,checkMaintain } = useHome()
const { t } = useI18n()
const router = useRouter()
const swipeRef = ref<SwipeInstance | null>(null)
const swipeHot = ref<SwipeInstance | null>(null)
const swipeCasino = ref<SwipeInstance | null>(null)
const swipeSlots = ref<SwipeInstance | null>(null)
const lotteryRef = ref<SwipeInstance | null>(null)
const swipeSport=ref<SwipeInstance | null>(null)

const name=import.meta.env.VITE_BASE_PROJECTNAME;
// used hook to get the games from the api
const { gameData, gameTypeList } = useGames()
// Original games Data
const originalGamesData = computed(() => gameData.Original)
// Hot games Data
const hotData = computed(() => gameData.HotGames)
// Casino games Data
const casinoData = computed(() => gameData.Casino)
// Slot games Data
const slotGamesData = computed(() => gameData.Slot)
const sportData = computed(() => gameData.Sport)
// Lottery games Data
const LotteryGameData = computed(() => gameData.Lottery?.filter((item)=>item.state===1)||[])
// 排序
const categoryList = computed(()=> {
	const map = ['Lottery','Flash','Popular','Video','Slot','Sport'];
	return gameTypeList.value.filter((item)=> map.includes(item.categoryCode))
})
const lotteryMap = {
	1: {
		title: t('lotteryHintStr1'),
		describe: t('lotteryHintStr2'),
		RouterName: 'AllLotteryGames-WinGo'
	},
	2: {
		title: t('lotteryHintStr1'),
		describe: t('lotteryHintStr2'),
		RouterName: 'AllLotteryGames-K3'
	},
	3: {
		title: t('lotteryHintStr1'),
		describe: t('lotteryHintStr4'),
		RouterName: 'AllLotteryGames-5D'
	},
	4: {
		title: t('lotteryHintStr1'),
		describe: t('lotteryHintStr2'),
		RouterName: 'AllLotteryGames-WinTrx'
	},
	5: {
		title: t('vietnamOfficialLottery'),
		describe: t('lotteryHintStr6'),
		RouterName: 'AllLotteryGames-XoSo'
	},
	6: {
		title: t('vietnamOfficialLottery'),
		describe: t('lotteryHintStr6'),
		RouterName: 'AllLotteryGames-XoSo'
	},
	7: {
		title: t('vietnamOfficialLottery'),
		describe: t('lotteryHintStr6'),
		RouterName: 'AllLotteryGames-Binguo'
	},
	8: {
		title: t('lotteryHintStr1'),
		describe: t('lotteryHintStr2'),
		RouterName: 'AllLotteryGames-4D'
	},
	9: {
		title: t('lotteryHintStr1'),
		describe: t('lotteryHintStr2'),
		RouterName: 'MotoRace'
	}
}

const goLottery = (item:any) => {
	const id=item.id;
	if(isSassLotteryGame(item)){
		return openThirdGame({...item,vendorCode:'ARLottery'})
	};
	const info:any=lotteryMap[id];
	let query
	if (id == 6 || id == 5) {
		query = {
			id
		}
	}
	router.push({
		name: info.RouterName,
		query
	})
}

const handleOffset = (type: string): void => {
	if (type === 'left') {
		swipeRef.value[0]?.prev()
	} else {
		swipeRef.value[0]?.next()
	}
}

const handleHotset = (type: string): void => {
	if (type === 'left') {
		swipeHot.value[0]?.prev()
	} else {
		swipeHot.value[0]?.next()
	}
}

const handleCasinoset = (type: string): void => {
	if (type === 'left') {
		swipeCasino.value[0]?.prev()
	} else {
		swipeCasino.value[0]?.next()
	}
}
const handleSportset = (type: string): void => {
	if (type === 'left') {
		sportData.value[0]?.prev()
	} else {
		sportData.value[0]?.next()
	}
}

const handleLset =(type: string): void => {
	if (type === 'left') {
		lotteryRef.value[0]?.prev()
	} else {
		lotteryRef.value[0]?.next()
	}
}

const handleSlotsset = (type: string): void => {
	if(!swipeSlots.value) return;
	if (type === 'left') {
		swipeSlots.value[0]?.prev()
	} else {
		swipeSlots.value[0]?.next()
	}

}
const goOtherPage = async (name: string) => {
	if (name === 'SuperJackpot' && !(await requireLoginAction())) return
	router.push({
		name
	})
}

// 实现将数组内的数据按照个数分割成多个数组
const chunk = (arr: any[], size: number) => {
	const result = []
	for (let x = 0; x < Math.ceil(arr.length / size); x++) {
		const start = x * size
		const end = start + size
		result.push(arr.slice(start, end))
	}
	return result
}

const gotoSlot = (value: any) => {
	if (checkMaintain(value)) return;
	sessionStorage.setItem('slotGamesList', JSON.stringify(gameData.Slot))
	sessionStorage.setItem('clickedItem', JSON.stringify(value))
	sessionStorage.setItem('gameType', JSON.stringify('slot'))
	router.push({
		name: 'AllOnlineGames',
		query: {
			game: 'slot',
			currentId: value.slotsName
		}
	})
}

</script>

<style lang="scss" scoped>
@import './home.scss';
</style>
