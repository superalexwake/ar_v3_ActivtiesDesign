<template>
	<div>
		<div class="homeNav">
			<div class="title">
				<div><b />{{ $t('popularTitle') }}</div>
			</div>
			<div class="tip">{{ $t('popularText1') }}</div>
			<div class="picContainer">
				<div v-for="(game, i) in picList1" :key="i" @click="onItemClick(game)" class="popular">
					<div class="item">
						<img  v-lazy="game.imgUrl" alt="" />
						<Maintain :item="game"/>
					</div>
					<div class="win-odds">
						<span>{{ $t('winOdds') }}</span>
						<span>{{ game.winOdds }}%</span>
						<div class="win-p" :style="{ width: `${Math.min(game.winOdds, 100)}%` }" />
					</div>
				</div>
			</div>
		</div>
		<div class="homeNav">
		<div class="title">
			<div>
				<b />{{ $t('popular') }}
			</div>
			<div class="right_btn">
				<svg-icon name="p3a_l" @click="handleOffset('left')" />
				<svg-icon name="p3a_r" @click="handleOffset('right')" />
			</div>
		</div>
		<div class="tip">{{ $t('popularText') }}</div>
		<Swipe
			class="my-swipe"
			ref="swipeRef"
			:autoplay="3000"
				:lazy-render="false"
			:show-indicators="false"
		>
			<SwipeItem v-for="(item, x) in picList2" :key="x">
				<div class="picContainer">
					<div v-for="(game, i) in item" @click="onItemClick(game)">
						<img v-lazy="game.imgUrl" alt="" :key="i" />
						<Maintain :item="game"/>
					</div>
				</div>
			</SwipeItem>
		</Swipe>
	</div>
	</div>
</template>
<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import { useHome } from '@/hooks'
import { splitIntoGroups } from '@/utils';
import { computed, ref } from 'vue'
import Maintain from '@/components/common/Maintain.vue'

const { homeState, onItemClick } = useHome()
const swipeRef = ref()
const picList1 = computed(() => {
	return homeState.allGameList?.popular.platformList || []
})
const picList2 = computed(() => {
	return splitIntoGroups(homeState.allGameList?.popular.clicksTopList || [], 3)
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
	.popular {
		width: calc((100% - 24px) / 3);
		height: 350px;
		.item{
			position: relative;
			margin-bottom:8px;
			img {
				width: 100%;
				height: 100%;
			} 
		}
		.win-odds{
			display: flex;
			height: 36px;
			background:rgba(158, 162, 168, 0.25);
			color: #FFF;
			width: 100%;
			border-radius: 10px;
			font-size: 22px;
			overflow: hidden;
			margin-top: 6px;
			margin-bottom: 10px;
			position: relative;
			span{
				position: relative;
				z-index: 1;
				display: block;
				height: 100%;
				flex: 1;
				line-height:36px;
				color: #001534;
				&:first-child{
					padding-left: 10px;
				}
				&:last-child{
					text-align: right;
					padding-right: 10px;
				}
			}
			.win-p{
				border-radius: 10px 0px 0px 10px;
				background: var(--main_gradient-color, linear-gradient(90deg, #21D9CC 0%, #BED921 100%));
				box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.05);
				position: absolute;
				left: 0;
				height: 100%;
				html:lang(ar) &{
					left: unset;
					right: 0;
				}
			}
		}
	}
	&>div{
		position: relative;
		width: calc((100% - 24px) / 3);
		height: 300px;
		img{
			width: 100%;
			height: 100%;
		}
	}


}
.homeNav + .homeNav{
	margin-top: 40px;
}
</style>
