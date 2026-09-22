<template>
	<div class="hot_container">
		<div class="title"><img src="@icon/home/tuijian.png" alt="" />{{ $t('platRecom') }}</div>
		<div class="popular">
			<div class="list">
				<div v-for="item in clicksTopList[0]" :key="item.vendorId" @click="onItemClick(item)">
					<div class="item">
						<img :src="item.imgUrl" alt="" :data-img="iconImagesAvatar" />
						<Maintain :item="item"/>
					</div>
					<div class="win-odds" v-if="store.isShowHotGameWinOdds">
						<span>{{ $t('winOdds') }}</span>
						<span>{{ item.winOdds }}%</span>
						<div class="win-p" :style="{ width: `${Math.min(item.winOdds, 100)}%` }" />
					</div>
				</div>
			</div>
		</div>
		<div class="title"><img src="@icon/home/hot_icon.png" alt="" />{{ $t('hot') }}</div>
		<div class="popular">
			<div class="list">
				<div v-for="item in clicksTopList[1]" :key="item.vendorId" @click="onItemClick(item)">
					<div class="item">
						<img :src="item.imgUrl" alt="" :data-img="iconImagesAvatar" />
						<Maintain :item="item"/>
					</div>
					<div class="win-odds" v-if="store.isShowHotGameWinOdds">
						<span>{{ $t('winOdds') }}</span>
						<span>{{ item.winOdds }}%</span>
						<div class="win-p" :style="{ width: `${Math.min(item.winOdds, 100)}%` }" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import iconImagesAvatar from '@public/images/avatar.png'
// import { defineAsyncComponent } from 'vue'

import type { PopularList } from '@/types/api'
import { SettingStore } from '@/stores'

interface GameListItemProps {
	clicksTopList: [PopularList[], PopularList[]]
}

// const HotGames = defineAsyncComponent(() => import('@/svg/home/noticeBarHot.vue'))
defineProps<GameListItemProps>()
const emit = defineEmits(['onItemClick'])
const store = SettingStore()
/**
 * @description: 点击游戏前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	emit('onItemClick',  item )
}
</script>

<style lang="scss" scoped>
.hot_container {
	.platform,
	.popular {
		margin-bottom: 26px;

		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 14px;
			& > div {
				width: 220px;
			}
			.item {
				width: 220px;
				position: relative;
				//height: 220px;
				background: linear-gradient(118.23deg, #ff8e89 26.37%, #ffc3a2 89.18%);
				border-radius: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 12px;
				img {
					width: 200px;
					//height: 200px;
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
			.win-odds {
				display: flex;
				height: 36px;
				background: #e6e6e6;
				color: #333;
				width: 100%;
				border-radius: 10px;
				font-size: 22px;
				overflow: hidden;
				margin-top: 6px;
				margin-bottom: 10px;
				position: relative;
				span {
					position: relative;
					z-index: 1;
					display: block;
					height: 100%;
					flex: 1;
					line-height: 40px;
					&:first-child {
						padding-left: 10px;
					}
					&:last-child {
						text-align: right;
						padding-right: 10px;
					}
				}
				.win-p {
					background: #fa5d5d;
					position: absolute;
					left: 0;
					height: 100%;
				}
			}
		}
	}
	.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
		img {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}
			font-size: 30px;
			line-height: 30px;
			font-weight: 700;
	}
}
.gameRec,
.hotGames {
	width: 48px;
	height: 48px;
	margin-right: 12px;
}
:deep(.hotGames) {
	g {
		path {
			fill: #fe6868;
		}
	}
}
</style>
