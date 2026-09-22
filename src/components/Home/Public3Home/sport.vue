<template>
	<div class="homeNav">
		<div class="title">
			<div>
				<b />{{ $t('sport') }}
				<div class="allMore" @click="gol2('sport')">{{ $t('More')+' ' + (homeState.allGameList?.sport.length || '0') }}</div>
			</div>
			<div class="right_btn">
				<svg-icon name="p3a_l" @click="handleOffset('left')" />
				<svg-icon name="p3a_r" @click="handleOffset('right')" />
			</div>
		</div>
		<div class="tip">{{ $t('sportText') }}</div>
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
					<div  v-for="(game, i) in item" :key="i" @click="onItemClick(game)">
						<img v-lazy="game.vendorImg" alt="" />
						<Maintain :item="game"/>
					</div>
				</div>
			</SwipeItem>
		</Swipe>
	</div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { computed, ref } from 'vue'

const { homeState, gol2, onItemClick } = useHome()
import { Swipe, SwipeItem } from 'vant'
import { splitIntoGroups } from '@/utils';
const swipeRef = ref();
const picList = computed(() => {
	return splitIntoGroups(homeState.allGameList?.sport || [], 3);
})
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
	flex-wrap: nowrap;
	gap: 12px;
	&>div{
		position: relative;
		width: 220px;
		height: 300px;
		img{
			width: 220px;
			height: 300px;
		}
	}

}
</style>
