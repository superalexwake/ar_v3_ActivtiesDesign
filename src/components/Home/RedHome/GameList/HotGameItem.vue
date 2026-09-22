<template>
	<div class="hot_container">
		<div class="platform" v-if="platformData?.length > 0 && !isAll">
			<div class="title" v-if="!isAll">
				<GameRecIcon class="gameRec" />
				<span>{{ $t('platRecom') }}</span>
			</div>
			<div class="list">
				<div  v-for="item in platformData" :key="item.vendorId" @click="onItemClick(item)">
					<div class="item">
						<HotBadge class="hot_bage" />
						<img :src="item.imgUrl" alt="" :data-img="defaultImgAvatar" />
						<Maintain :size="true" :item="item"/>
					</div>
					<div class="win-odds" v-if="store.isShowHotGameWinOdds">
						<span>{{$t('winOdds')}}</span>
						<span>{{item.winOdds}}%</span>
						<div class="win-p" :style="{width:`${Math.min(item.winOdds,100)}%`}"/>
					</div>
				</div>
			</div>
		</div>

		<div class="popular" v-if="platformData?.length > 0" :class="{ pupularAll: isAll }">
			<div class="title" v-if="!isAll">
				<HotGames class="hotGames" />
				<span>{{ $t('hot') }}</span>
			</div>
			<div class="list">
				<div  v-for="item in clicksTopData" :key="item.vendorId" @click="onItemClick(item)">
					<div class="item">
						<img :src="item.imgUrl" alt="" :data-img="defaultImgAvatar" />
						<Maintain  :size="true" :item="item"/>
					</div>
					<div class="win-odds" v-if="store.isShowHotGameWinOdds">
						<span>{{$t('winOdds')}}</span>
						<span>{{item.winOdds}}%</span>
						<div class="win-p" :style="{width:`${Math.min(item.winOdds,100)}%`}"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'
import type { PopularList } from '@/types/api'
import {SettingStore} from "@/stores";
import { useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
const { defaultImgAvatar } = useAssets()
const { homeState } = useHome()
const gameData = computed<any>(() => JSON.parse(JSON.stringify(homeState.allGameList || {})))
interface GameListItemProps {
	platformList: PopularList[]
	clicksTopList: PopularList[]
	isAll: boolean
}

const HotBadge = defineAsyncComponent(() => import('@/svg/home/gameHot.vue'))
const GameRecIcon = defineAsyncComponent(() => import('@/svg/home/gameRec.vue'))

const HotGames = defineAsyncComponent(() => import('@/svg/home/noticeBarHot.vue'))
const {platformList, clicksTopList} = defineProps<GameListItemProps>()
let platformData = platformList
let clicksTopData = clicksTopList
if (!platformList) {
	platformData = gameData.value.popular.platformList
	clicksTopData = gameData.value.popular.clicksTopList
}
const emit = defineEmits(['onItemClick'])
const store=SettingStore()
/**
 * @description: 点击游戏前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	emit('onItemClick',  item)
}
</script>

<style lang="scss" scoped>
.hot_container {
	.platform,
	.popular {
		margin-bottom: 26px;
		.title {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-bottom: 16px;
			span {
				font-size: 24px;
				line-height: 30px;
			}
		}
		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 14px;
			&>div{
				width: 166px;
				//width: 222px;
			}
			.item {
				position: relative;
				width: 166px;
				height: 166px;
				//width: 220px;
				//height: 300px;
				background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);
				box-shadow: var(--BoxShadowColor-9), var(--BoxShadowColor-20);
				border-radius: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 12px;
				img {
					width: 150px;
					height: 150px;
					//width: 100%;
					//height: 100%;
					//object-fit: cover;
					border-radius: 16px;
				}
				.hot_bage {
					position: absolute;
					right: -6px;
					top: -8px;
					width: 38px;
					height: 36px;
				}
			}
			.win-odds{
				display: flex;
				height: 36px;
				background: var(--bg_color_L2);
				color: var(--text_color_L1);
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
					line-height: 40px;
					color: var(--darkTextW, var(--text_color_L1));
					&:first-child{
						padding-left: 10px;
					}
					&:last-child{
						text-align: right;
						padding-right: 10px;
					}
				}
				.win-p{
					background: var(--darkLight,var(--main-color));
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
	}
	.pupularAll {
		.list>div{
			width: 222px;
		}
		.list .item {
			width: 222px;
			min-height: 300px;
			height:auto;
			img {
				width: 222px;
				height: 300px;
			}
		}
		//.list>div{
		//	width: 216px;
		//}
		//.list .item {
		//
		//	width: 216px;
		//	height: 216px;
		//
		//	img {
		//		width: 200px;
		//		height: 200px;
		//	}
		//}
	}
	.look_all {
		width: 100%;
		height: 80px;
		border: 1px solid var(--main-color);
		border-radius: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--bg_color_L2);
		font-size: 26px;
		color: var(--main-color);
		img {
			width: 48px;
			height: 48px;
			margin-right: 14px;
		}
	}
}
.gameRec,
.hotGames {
	width: 36px;
	height: 36px;
	margin-right: 12px;
}
:deep(.hotGames) {
	g {
		path {
			fill: var(--colorText-26);
		}
	}
}
</style>
