<template>
	<div class="homeNav">
		<div class="title">
			<div>
				<b />{{ $t('lottery') }}
				<div class="allMore" @click="gol2('lottery')">{{ $t('More')+' ' + (homeState.allGameList?.lottery.length || '0') }}</div>
			</div>
			<div class="right_btn">
				<svg-icon name="p3a_l" @click="handleOffset('left')" />
				<svg-icon name="p3a_r" @click="handleOffset('right')" />
			</div>
		</div>
		<div class="tip">{{ $t('lotteryText1') }}</div>
		<Swipe
			class="my-swipe"
			ref="swipeRef"
			:autoplay="3000"
			@change="swipeChange"
			:lazy-render="false"
			:show-indicators="false"
		>
			<SwipeItem v-for="(item, x) in picList" :key="x">
				<div class="picContainer">
					<img v-for="(game, i) in item" v-lazy="game.categoryImg" alt="" :key="i" @click="isAlowGame(game, onItemClick)"/>
				</div>
			</SwipeItem>
		</Swipe>
	</div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks';
import router from '@/router';
import { splitIntoGroups } from '@/utils';
import { computed, ref } from 'vue';
import { Swipe, SwipeItem } from 'vant'

const { homeState, gol2, isAlowGame,isSassLotteryGame,openThirdGame } = useHome();
const swipeRef = ref();
const picList = computed(()=>{
    return splitIntoGroups(homeState.allGameList?.lottery || [], 3);
})
const lotteryRoutes = [
	{
		value: 1,
		path: 'WinGo'
	},
	{
		value: 3,
		path: '5D'
	},
	{
		value: 2,
		path: 'K3'
	},
	{
		value: 4,
		path: 'WinTrx'
	},
	{
		value: 5,
		path: 'XoSo'
	},
	{
		value: 6,
		path: 'XoSo'
	},
	{
		value: 7,
		path: 'Binguo'
	},
	{
		value: 8,
		path: '4D'
	}
]

/**
 * @description: 点击前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	if (isSassLotteryGame(item)){
		return openThirdGame({...item,vendorCode:'ARLottery'})
	}
	router.push({
		name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
		query: {id:item.id}
	})
}

/**
 * @description: 左右滚动游戏
 * @param {*} type
 * @return {*}
 */
 const handleOffset = (type: string): void => {
	if (type === 'left') {
		swipeRef.value?.prev()
	} else {
		swipeRef.value?.next()
	}
}
</script>
<style scoped lang="scss">
.title {
	height: 42px;
	display: flex;
	align-items: center;
	font-size: 30px;
	font-weight: 500;
	margin-bottom: 10px;
	justify-content: space-between;
	&>div {
		display: flex;
		align-items: center;
		gap: 12px
	}
	b {
		display: block;
		height: 26px;
		width: 8px;
		border-radius: 4px;
		background-color: var(--main-color);
	}
	.right_btn {
		svg {
			width: 58px;
			height: 32px;
		}
	}
	.allMore {
		height: 32px;
		padding: 0 14px;
		width: fit-content;
		line-height: 32px;
		color: var(--main-color);
		font-size: 20px;
		background: var(--bg_color_L2);
		border-radius: 8px;
	}
}
.tip {
	font-size: 20px;
	color: var(--text_color_L2);
	margin-bottom: 24px;
}
.picContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    img,.b {
        width: 220px;
		height: 300px;
    }
	
}
</style>