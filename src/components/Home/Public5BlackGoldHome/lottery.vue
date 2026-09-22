<script setup lang="ts">
import { useHome } from '@/hooks'
import router from '@/router'
import { computed } from 'vue'

const { homeState, isAlowGame, isSassLotteryGame, openThirdGame } = useHome();
const picList = computed(() => {
	return homeState?.allGameList?.lottery || []
})
const lotteryRoutes = [
	{
		value: 1,
		path: 'WinGo'
	},
	{
		value: 2,
		path: 'K3'
	},
	{
		value: 3,
		path: '5D'
	},
	{
		value: 4,
		path: 'WinTrx'
	},
	{
		value: 9,
		path: 'MotoRace'
	},
	{
		value: 10,
		path: 'VideoWinGo'
	}
	// {
	// 	value: 7,
	// 	path: 'Binguo'
	// },
	// {
	// 	value: 8,
	// 	path: '4D'
	// }
]

/**
 * @description: 点击前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	if (isSassLotteryGame(item)) {
		return openThirdGame({ ...item, vendorCode: 'ARLottery' })
	}
	router.push({
		name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
		query: { id: item.id }
	})
}

</script>

<template>
	<div class="lottery">
		<div class="h">
			<div class="t">{{ $t('lottery') }}</div>
		</div>
		<div class="b">
			<img v-for="(i, k) in picList" :key="k" :src="i.categoryImg" @click="isAlowGame(i, onItemClick)" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.lottery {
	padding:40px 24px;
	background:linear-gradient(180deg, #231C21 42.3%, rgba(35, 28, 33, 0.00) 100%);
	border-radius: 24px;
	.h {
		padding-inline-start:55px;
		background-image: url('@/assets/p5BlackGoldStyle/icons/home/ball_8.png');
		background-size: 40px;
		background-repeat: no-repeat;
		background-position-y: center;

		.t {
			color: var(--text_color_L1, #FDE4BC);
			font-size: 28px;
			font-style: normal;
			font-weight: 600;
			height: 40px;
		}
	}

	.b {
		margin-top: 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 24px;

		&>img {
			width: 339px;
			height: 200px;
		}
	}
}
</style>