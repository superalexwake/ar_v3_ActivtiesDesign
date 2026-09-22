<!--
 * @Author: Seven
 * @Date: 2023-06-16 09:55:15
 * @LastEditTime: 2023-08-30 17:00:16
 * @LastEditors: Seven
 * @Description:
-->
<template>
	<div class="video_list">
		<div class="video_item" v-for="item in slitLit" :key="item.vendorCode">
			<div class="video_title">
				<svg-icon  :name="item.vendorCode" />
				<span>{{ _getSlotTitle(item.vendorCode) }}{{ $t('code9306') }}</span>
			</div>
			<div class="video_img_box">
				<div class="video_img" v-for="imgs in item.childList.slice(0,6)" @click="onItemClick(imgs)">
					<img
						v-lazy="imgs.img"
						:key="imgs.gameID + item.vendorCode"
					/>
					<Maintain :item="imgs"/>
				</div>
			</div>
			<div class="all_slot" @click="() => goAll(item)">{{ $t('allGame') }}</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getVideWithChildGame } from '@/api'
import type { ElectronWithChildGame } from '@/types/api'
import { AwaitApiResult, getSlotTitle } from '@/utils'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
const slitLit = ref<ElectronWithChildGame[]>([])
const router = useRouter()
const { onItemClick, homeState } = useHome()

const getVideoList = async () => {
	const res = await AwaitApiResult(getVideWithChildGame())
	if (res) {
		slitLit.value = res.data
	}
}

// 实现一个方法，传入一个字符串，如果没有下划线，直接返回，如果有下划线，将下划线去掉返回前面的字符串
const _getSlotTitle = (_str: string) => {
	const str=getSlotTitle(_str)
	if (str.indexOf('_') === -1) {
		return str
	} else {
		return str.split('_')[0]
	}
}
const goAll = (item: ElectronWithChildGame) => {
	const clickedItem = homeState.allGameList.video.find((i:any)=>i.slotsName === item.vendorCode)
	sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList.video))
	sessionStorage.setItem('gameType', JSON.stringify('video'))
	sessionStorage.setItem('clickedItem', JSON.stringify(clickedItem))
	router.push({
		name: 'AllOnlineGames',
		query: {
			gameType: 'video',
			currentId: item.childList[0].vendorId
		}
	})
}

getVideoList()
</script>
<style lang="scss" scoped>
.video_list {
	.video_item {
		margin-bottom: 46px;
		.video_title {
			display: flex;
			align-items: center;
			img {
				margin-right: 8px;
				height: 40px;
				vertical-align: middle;
			}
			svg {
				height: 40px;
				margin-right: 8px;
				font-size: 56px;
				color: var(--main-color);
			}
			font-size: 30px;
			font-weight: bold;
			color: var(--text_color_L1);
			margin-bottom: 24px;
      span{
        vertical-align: middle;
      }
		}
		.video_img_box {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 18px;
			margin-bottom: 30px;
			.video_img{
				position: relative;
				width: 218px;
				height: 294px;
				img {
					width: 218px;
					height: 294px;
					border-radius: 8px;
				}
			}

		}
		.all_slot {
			margin: auto;
			width: 288px;
			height: 60px;
			background: var(--main_gradient-color);
			box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
			border-radius: 30px;
			line-height: 60px;
			color: #ffffff;
			text-align: center;
			font-size: 24px;
		}
	}
}
</style>
