<template>
	<div class="originalmainContainer">
		<div class="backSvg" @click="G0_back"></div>
		<div class="originalmainContainer_title">{{ $t('code9308Flash') }}</div>
	</div>

	<!-- Games images containers starts from here -->
	<div class="GameContainer">
		<div class="GameContainer_games">
			<div v-for="(item,index) in originalData" :key="index" @click="goGame(item)">
				<img  :src="item.img"  />
				<Maintain :item="item" />
			</div>
		</div>
		<LuckyWinners />
	</div>

	<!-- Today's Profit Ranking -->
	<div class="WinningContainer">
		{{ $t('homename1') }}
	</div>
	<div class="Winningdata">
		<div class="profitRanking">
			<ProfitRanking />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import ProfitRanking from '@/components/Home/goGame/ProfitRanking.vue'
import { getAllGameList } from '@/api'
import { onMounted, ref } from 'vue'
import { AwaitApiResult } from '@/utils'
import { useGame } from '@/hooks'
const { goGame } = useGame()
const router = useRouter()
const originalData = ref([])
const getGameList = async () => {
	const res = await AwaitApiResult(getAllGameList())
	if (res) {
		originalData.value = res.data.flash;
		console.log('originalData.value', originalData.value)
	}
}
const G0_back = () => {
	router.push('/')
}

onMounted(()=>{
	getGameList()
})
</script>

<style lang="scss" scoped>
.originalmainContainer {
	display: flex;
	height: 72px;
	flex-direction: row;
	align-items: center;
	padding: 0 16px;
	background: var(--bg_color_L2);
	.backSvg {
		background-image: url('@icon/goGame/backButton.svg');
		background-repeat: no-repeat;
		background-position: center;
		width: 84px;
		height: 100%;
	}

	&_title {
		display: flex;
		padding: 10px;
		align-items: center;
		justify-content: center;
		font-family: Inter;
		font-size: 36px;
		font-style: italic;
		font-weight: 700;
		letter-spacing: -0.36px;
		background: var(--Text-effects, linear-gradient(180deg, #F5F6FF -2.72%, rgba(245, 246, 255, 0.00) 219.64%));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
}

.GameContainer {
	height: auto;
	padding: 20px;
	&_games {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		height: auto;
		gap: 16px;
		& > div {
			position: relative;
			width: calc((100% - 32px) / 3);
			height: auto;
			img{
				width: 100%;
				height: auto;
			}
		}
	}
}
.luckyWinners__container{
	margin-top: 40px;
}

.WinningContainer {
	display: flex;
	padding: 20px;
	align-items: center;
	background: var(--Text-effects, linear-gradient(180deg, #F5F6FF -2.72%, rgba(245, 246, 255, 0.00) 219.64%));

	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	letter-spacing: -0.36px;
	font-family: Inter;
	font-size: 36px;
	font-style: italic;
	font-weight: 700;
	margin-top: -15px;
	&::before {
		content: '';
		display: block;
		flex: none;
		width: 25px;
		height: 26px;
		background-image: url('@/assets/icons/home/Group20225.svg');
		background-position: left;
		background-repeat: no-repeat;
	}
}
.Winningdata {
	padding: 17px;
}
.profitRanking {
	padding: 7px;
	border-radius: 12px;
	background: var(--bg_color_L2);
	backdrop-filter: blur(82px);
}
</style>
