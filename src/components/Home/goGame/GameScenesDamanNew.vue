<template>
	<div class="gameScenes-daman">
		<div class="game-menu">
<!--			<img src="./imgs/Home.png" />-->
			<svg-icon name="menuHome"  />
			<div class="menu">{{ $t('home') }}</div>
		</div>
		<div class="game-menu" @click="goOtherPage('Lottery')">
			<svg-icon name="menuLottery"  />
			<div class="menu">{{ $t('code9301') }}</div>
		</div>
		<div class="game-menu" @click="goOtherPage('Original')">
			<svg-icon name="menuOriginals"  />
			<div class="menu">{{ $t('originals') }}</div>
		</div>

		<div class="game-menu" @click="goOtherPage('Slots')">
			<svg-icon name="menuSlots"  />
			<div class="menu">{{ $t('code9304Slot') }}</div>
		</div>

		<div class="game-menu" @click="WinApi">
			<svg-icon name="menuMore"  />
			<div class="menu">{{ $t('More') }}</div>
		</div>
	</div>
	<!-- Slide window open from here -->

	<div class="half-window" :class="{ isWindowOpen }">
		<div class="crossBtn" @click="slideWindow"></div>
		<div class="halfWindow">
			<div class="half-window-menu">
				<div class="menuTitle">{{ $t('Menu') }}</div>
				<div class="menuIcon" @click="goOtherPage('CustomerService')"></div>
			</div>
			<!-- Menu div ends here  -->
			<div class="title">{{ $t('hot') }}</div>
			<div class="containerWinGO" v-if="showChanglong">
				<div class="bottomContainer">
					<div class="title">
						{{ $t('wingoLng') }} <br /><span>{{ $t('lotteryResultFive') }}</span>
					</div>
					<div class="clickBtn"   @click="goChangLong">{{ $t('dragonEntry') }} >></div>
				</div>
			</div>
			<!-- First container finsish here  -->

			<div class="containerTour">
				<div class="bottomContainerTour">
					<div class="titleTour">
						{{ $t('eTournament') }}<br /><span>{{ $t('Partinturnmentevnts') }}</span>
					</div>
					<div class="clickBtnTour" @click="goOtherPage('Championship')">{{ $t('dragonEntry') }} >></div>
				</div>
			</div>

			<!-- Second container finish here -->
			<div class="title">{{ $t('Games') }}</div>
			<div class="mainContainer">
				<div class="imgCont"><img src="./imgs/PhysicalEducation.png" alt="" height="40px" /></div>
				<div class="titleCont">
					<span>{{ $t('PhysicalEducation') }}</span>
				</div>
				<div class="endCont" @click="goOtherPage('eSports') ">
					<span>{{ $t('all') }}</span
					><span class="number">{{ eSportData.length }} >></span>
				</div>
			</div>

			<!-- Second list menu -->
			<div class="mainContainer">
				<div class="imgCont"><img src="./imgs/LiveVideo.png" alt="" height="40px" /></div>
				<div class="titleCont">
					<span>{{ $t('LiveVideo') }}</span>
				</div>
				<div class="endCont" @click="goOtherPage('Casino')">
					<span>{{ $t('all') }}</span
					><span class="number">{{ casinoData.length }} >></span>
				</div>
			</div>
			<!-- 3rd list menu -->
			<div class="mainContainer">
				<div class="imgCont"><img src="./imgs/Chess&Cards.png" alt="" height="40px" /></div>
				<div class="titleCont">
					<span>{{ $t('ChessandCards') }}</span>
				</div>
				<!-- <div class="endCont" @click="goDetail(chessData)"> -->
					<div class="endCont" @click="goOtherPage('Chess')">
					<span>{{ $t('all') }}</span
					><span class="number">{{ chessData.length }} >></span>
				</div>
			</div>

			<!-- Fourth menu list -->
			<div class="mainContainer">
				<div class="imgCont"><img src="./imgs/Fishing.png" alt="image" height="40px" /></div>
				<div class="titleCont">
					<span>{{ $t('fishing') }}</span>
				</div>
				<div class="endCont" @click="goOtherPage('Fishing')">
					<span>{{ $t('all') }}</span
					><span class="number">{{ FishingData.length }} >></span>
				</div>
			</div>

			<div class="title">{{ $t('activities') }}</div>
			<div class="mainActivities">
				<div class="activityImage">
					<svg width="281" height="31" viewBox="0 0 281 31" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M-6.45605 22.2741C-6.45605 17.4549 -2.54933 13.5481 2.26987 13.5481H140.517H176.339H195.303H197.043C199.521 13.5481 200.76 13.5481 201.909 13.2997C203.835 12.8832 205.614 11.9569 207.06 10.6176C207.922 9.8187 208.632 8.80383 210.053 6.77407C211.473 4.74432 212.184 3.72945 213.046 2.9305C214.492 1.59123 216.271 0.664934 218.197 0.248453C219.346 0 220.585 0 223.062 0H273.044C277.232 0 279.326 0 281.018 0.562915C284.306 1.65742 286.887 4.23774 287.981 7.5262C288.544 9.21749 288.544 11.3117 288.544 15.5C288.544 19.6883 288.544 21.7825 287.981 23.4738C286.887 26.7623 284.306 29.3426 281.018 30.4371C279.326 31 277.232 31 273.044 31H2.26987C-2.54933 31 -6.45605 27.0933 -6.45605 22.2741Z" />
					</svg>
				</div>
				<div class="activityText">
					{{ $t('superjackpot') }}
					<div class="btnActivity" @click="goOtherPage('SuperJackpot')">{{ $t('dragonEntry') }} >></div>
				</div>
			</div>
			<div class="mainActivities2">
				<div class="activityImage2">
					<svg width="281" height="31" viewBox="0 0 281 31" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M-6.45605 22.2741C-6.45605 17.4549 -2.54933 13.5481 2.26987 13.5481H140.517H176.339H195.303H197.043C199.521 13.5481 200.76 13.5481 201.909 13.2997C203.835 12.8832 205.614 11.9569 207.06 10.6176C207.922 9.8187 208.632 8.80383 210.053 6.77407C211.473 4.74432 212.184 3.72945 213.046 2.9305C214.492 1.59123 216.271 0.664934 218.197 0.248453C219.346 0 220.585 0 223.062 0H273.044C277.232 0 279.326 0 281.018 0.562915C284.306 1.65742 286.887 4.23774 287.981 7.5262C288.544 9.21749 288.544 11.3117 288.544 15.5C288.544 19.6883 288.544 21.7825 287.981 23.4738C286.887 26.7623 284.306 29.3426 281.018 30.4371C279.326 31 277.232 31 273.044 31H2.26987C-2.54933 31 -6.45605 27.0933 -6.45605 22.2741Z" />
					</svg>
				</div>
				<div class="activityText2">
					{{ $t('Activityaward') }}
					<div class="btnActivity2" @click="goOtherPage('DailyTasks')">{{ $t('dragonEntry') }} >></div>
				</div>
			</div>
		</div>
	</div>
	<!-- New window menu -->
</template>

<script setup lang="ts">
import {ref } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult } from '@/utils'
import { getAllGameList } from '@/api'
import { useHome } from '@/hooks'
import { requireLoginAction } from '@/hooks/useLoginIntercept'

const {showChanglong,goChangLong}=useHome()
// Original games Data
const FishingData = ref([])
const eSportData = ref([])
const casinoData = ref([])
const chessData = ref([])

const getGameList = async () => {
	const res = await AwaitApiResult(getAllGameList())
	if (res) {
		FishingData.value = res.data.fish
		eSportData.value = res.data.sport
		casinoData.value = res.data.video
		chessData.value = res.data.chess
		// console.log('FishingData.value', FishingData.value)
	}
}

const isWindowOpen = ref(false)
const router = useRouter()
const slideWindow = () => {
	isWindowOpen.value = !isWindowOpen.value
	// console.log('isWindowOpen', isWindowOpen.value)
}

const WinApi = () => {
	slideWindow()
	getGameList()
}
const goOtherPage = async (name: string) => {
	if (name === 'SuperJackpot' && !(await requireLoginAction())) return
	router.push({
		name
	})
}


</script>

<style lang="scss" scoped>
@import './slider.scss';
</style>
