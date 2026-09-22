<template>
    <div class="allGame">
		<div class="nei_title">
			<img :src="itemTitle[activeType]?.icon" alt="">
			<span>{{itemTitle[activeType]?.lable}}</span>
		</div>
		<div :class="activeType === 'Lottery' ? 'b' : 'nei'">
			<div v-for="(item, index) in listData" :key="index"  @click="activeType === 'Chess' ? goChess(item) : (activeType === 'Lottery' ? onLotteryItemClick(item) : onItemClick(item))" >
				<img
					 v-lazy="item.img"
					/>
				<Maintain :item="item" />
			</div>
		</div>
    </div>
</template>
<script setup lang="ts">
import iconHomePopular from '@icon/home/Popular.png'
import iconHomeMiniGame from '@icon/home/MiniGame.png'
import iconHomeCasino from '@icon/home/Casino.png'
import iconHomeSlots from '@icon/home/Slots.png'
import iconHomeSports from '@icon/home/Sports.png'
import iconHomePVC from '@icon/home/PVC.png'
import iconHomeFishing from '@icon/home/Fishing.png'
import iconHomeLottery from '@icon/home/Lottery.png'

import {useRouter} from "vue-router";
import { computed, inject } from 'vue';
// 使用 inject 接收父组件传递的实例
const useHomeHook: any = inject('useHomeHook');
const { homeState, isSassLotteryGame, openThirdGame,onItemClick,gol2chess} = useHomeHook;
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter()

// onMounted(() => {
// 	console.log("游戏类型",props.activeType)
// })

// 定义 props 接收父组件的 activeType
const props = defineProps<{
	activeType: string;
}>();

const listData = computed(() => {
	return homeState.allGameList[props.activeType.toLocaleLowerCase()] || [];
})

/*有二级目录的游戏*/
const goChess = (item: string) => {
	gol2chess(item,homeState.allGameList?.chess)
}

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
]
const onLotteryItemClick = (item: any) => {
	if (isSassLotteryGame(item)) {
		return openThirdGame({ ...item, vendorCode: 'ARLottery' })
	}
	router.push({
		name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
		query: { id: item.id }
	})
}
const itemTitle= {
	Popular: {lable: t('popularTitle'), icon:iconHomePopular},
	Flash: {lable: t('code9308'), icon: iconHomeMiniGame},
	Video: {lable: t('live'), icon: iconHomeCasino},
	Slot: {lable: t('electronicGame'), icon: iconHomeSlots},
	Sport: {lable: t('sport'), icon: iconHomeSports},
	Chess: {lable: t('chess'), icon: iconHomePVC},
	Fish: {lable: t('fishing'), icon: iconHomeFishing},
	Lottery: {lable: t('lottery'), icon: iconHomeLottery},
}

</script>
<style lang="scss" scoped>
    .allGame {
		padding:40px 24px;
		background:linear-gradient(180deg, #231C21 42.3%, rgba(35, 28, 33, 0.00) 100%);
		border-radius: 24px;
		.nei_title{
			color: var(--text_color_L1, #FDE4BC);
			font-family: "Alibaba PuHuiTi 3.0";
			font-size: 28px;
			font-style: normal;
			font-weight: 600;
			display: flex;
			align-items: center;
			margin-bottom: 24px;
			img{
				width: 40px;
				height:40px;
				margin-right: 16px;
			}
		}
		.nei{
			display: flex;
			flex-wrap: wrap;
			gap: 16px;
			&>div {
				position: relative;
				width: 222px;
				height: 300px;
				img{
					width: 100%;
					height: 100%;
				}
			}
		}
		.b{
			display: flex;
			flex-wrap: wrap;
			gap: 24px;

			&>div {
				position: relative;
				width: 339px;
				height: 200px;
				img{
					width: 100%;
					height: 100%;
				}
			}
		}
    }
</style>