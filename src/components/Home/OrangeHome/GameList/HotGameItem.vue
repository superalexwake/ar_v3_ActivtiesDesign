<template>
	<div class="hot_container">
		<div class="popular">
			<div class="list">
				<div  v-for="item in clicksTopList" :key="item.vendorId" @click="onItemClick(item)">
					<div class="item">
						<img :src="item.imgUrl" alt="" :data-img="iconImagesAvatar" />
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
import iconImagesAvatar from '@public/images/avatar.png'
// import { defineAsyncComponent } from 'vue'

import type { PopularList } from '@/types/api'
import {SettingStore} from "@/stores";

interface GameListItemProps {
	clicksTopList: PopularList[]
}

// const HotGames = defineAsyncComponent(() => import('@/svg/home/noticeBarHot.vue'))
defineProps<GameListItemProps>()
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
				font-size: 30px;
				line-height: 30px;
				font-weight: 700;
			}
		}
		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 14px;
      &>div{
        width: 220px;
      }
			.item {
				width: 220px;
				position: relative;
				height: 220px;
				background:  linear-gradient(157deg, #FF9902 0%, #FFD058 100%);
				box-shadow: 0px 8px 16px rgba(208, 208, 237, 0.36), inset 0px -4px 10px #fff6f4;
				border-radius: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 12px;
				img {
					width: 200px;
					height: 200px;
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
				background: #E6E6E6;
				color: #333;
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
					&:first-child{
						background: linear-gradient(90deg, #FF9901 0%, #E57201 100%);
						padding-left: 10px;
					}
					&:last-child{
						text-align: right;
						padding-right: 10px;
					}
				}
				.win-p{
					background: #FA5D5D;
					position: absolute;
					left: 0;
					height: 100%;
				}
			}
		}
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
