<template>
	<div class="originalmainContainer">
		<div class="backSvg" @click="G0_back"></div>
		<div class="originalmainContainer_title">HotGames</div>
	</div>

	<!-- Games images containers starts from here -->
	<div class="GameContainer">
		<div class="GameContainer_games">
			<div v-for="(item,index) in hotData" :key="index" @click="goGame(item)">
				<img  :src="item.imgUrl"  />
				<Maintain :item="item" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoading } from '@/components/common/use'
import { showDialog } from 'vant'
import { getAllGameList } from '@/api'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AwaitApiResult, getUserAgent, partyUrl } from '@/utils'
import { useGame } from '@/hooks'
const { goGame } = useGame()
const { t } = useI18n()
const router = useRouter()
const { start, end, flag } = useLoading()
const hotData = ref([])
const getGameList = async () => {
	const res = await AwaitApiResult(getAllGameList())
	if (res) {
		const { clicksVideoTopList, clicksTopList, platformList } = res.data.popular
		hotData.value = [ ...platformList,...clicksTopList, ...clicksVideoTopList];
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

.WinningContainer {
	display: flex;
	padding: 20px;
	align-items: center;
	background: linear-gradient(180deg, #f5f6ff -2.72%, rgba(245, 246, 255, 0) 219.64%);
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
</style>
