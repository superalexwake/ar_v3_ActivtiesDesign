<!--
 * @Author: Seven
 * @Date: 2023-06-16 09:55:15
 * @LastEditTime: 2023-08-30 17:00:16
 * @LastEditors: Seven
 * @Description:
-->
<template>
	<div class="slot_list">
		<ElectronicWinRate />
		<div class="slot_item" v-for="item in homeState.slotsGame" :key="item.vendorCode">
			<div class="slot_title">
				<svg-icon :name="item.vendorCode"  />
				{{ getSlotTitle(item.vendorCode) }} {{ $t('electric') }}
			</div>
			<div class="slot_img_box">
				<div  class="slot_img" v-for="imgs in item.childList.slice(0, 6)" @click="onItemClick(imgs)">
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
import type { ElectronWithChildGame } from '@/types/api'
import { useRouter } from 'vue-router'
import ElectronicWinRate from '@/components/Home/RedHome/GameList/ElectronicWinRate.vue'
import { useHome } from '@/hooks'
import {getSlotTitle} from '@/utils'
const router = useRouter()
const { getSlotList, homeState, onItemClick,checkMaintain } = useHome()

const goAll = (item: ElectronWithChildGame) => {
	if (checkMaintain(item))return;
	const clickItem = homeState.allGameList.slot.find((i:any)=>i.slotsName === item.vendorCode)
	sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList.slot))
	sessionStorage.setItem('gameType', JSON.stringify('slot'))
	sessionStorage.setItem('clickedItem', JSON.stringify(clickItem))
	router.push({
		name: 'AllOnlineGames',
	})
}

getSlotList()
</script>
<style lang="scss" scoped>
.slot_list {
	.slot_item {
		margin-bottom: 46px;

		.slot_title {
			display: flex;
			flex-direction: row;
			align-items: center;
			svg {
				height: 48px;
				font-size: 68px;
				vertical-align: middle;
				color: var(--main-color);
			}
			font-size: 30px;
			font-weight: bold;
			color: var(--darkTextW, var(--text_color_L1));
			margin-bottom: 16px;
		}
		.slot_img_box {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-gap: 18px;
			margin-bottom: 30px;
			.slot_img{
				position: relative;
				width: 218px;
				height: 294px;
			}
			img {
				width: 218px;
				height: 294px;
				border-radius: 8px;
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
			color: #FFFFFF;
			text-align: center;
			font-size: 24px;
		}
	}
}
</style>
