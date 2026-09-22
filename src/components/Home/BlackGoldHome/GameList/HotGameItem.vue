<template>
	<div class="hot_container" :class="{ hot_all: isAll }">


		<div class="popular" v-if="gameList.length > 0" :class="{ pupularAll: isAll }">
			<div class="title" v-if="!isAll">
				<HotGames class="hotGames" />
				<span>{{ $t('hot') }}</span>
			</div>
			<div class="list">

				<div  v-for="item in gameList" :key="item.vendorId" @click="onItemClick(item)">
					<div class="item">
						<img :src="item.imgUrl" alt="" :data-img="defaultImgAvatar" />
						<Maintain :item="item" :size="true" />
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
import { defineAsyncComponent } from 'vue'
import type { PopularList } from '@/types/api'
import {SettingStore} from "@/stores";
import { useAssets } from '@/hooks/useAssets'
const { defaultImgAvatar } = useAssets()

interface GameListItemProps {
	gameList: PopularList[]
	isAll: boolean
}

const HotGames = defineAsyncComponent(() => import('@/svg/home/noticeBarHot.vue'))
defineProps<GameListItemProps>()
const emit = defineEmits(['onItemClick'])
const store=SettingStore()
/**
 * @description: 点击游戏前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	emit('onItemClick', item)
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
			}
			.item {
				position: relative;
				height: 166px;
				background:#3A3A3A;
				border-radius: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 12px;
				img {
					width: 150px;
					height: 150px;
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

						padding-left: 10px;
						color: #fff;
					}
					&:last-child{
						text-align: right;
						padding-right: 10px;
					}
				}
				.win-p{
					background: linear-gradient(180deg, #F6E3A3 0%, #D2A753 100%);
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
			width: 216px;
		}
		.list .item {

			width: 216px;
			height: 216px;

			img {
				width: 200px;
				height: 200px;
			}
		}
	}
	.look_all {
		width: 100%;
		height: 80px;
		border: 1px solid #f95959;
		border-radius: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f7f8ff;
		font-size: 26px;
		color: #f95959;
		img {
			width: 48px;
			height: 48px;
			margin-right: 14px;
		}
	}
}
.hot_all {
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
			fill: #fe6868;
		}
	}
}
</style>
