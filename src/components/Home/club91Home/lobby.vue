<template>
	<div class="lobby">
		<lobbyItem :listData="popList" :isMore="false" @item-click="onItemClick">
			<template #head>
				<div class="title pop">{{ $t('popularTitle') }}</div>
			</template>
		</lobbyItem>
		<div class="lottery" v-if="lottertList.length">
			<div class="h">
				<div class="t">{{ $t('lottery') }}</div>
				<div class="d">{{ $t('flashText') }}</div>
			</div>
			<div class="b">
				<img v-for="(i, k) in lottertList" :key="k" :src="i.categoryImg" @click="isAlowGame(i, golottery)" />
			</div>
		</div>
		<lobbyItem v-if="miniList.length" :listData="miniList" @more-click="moreClick('Flash')" @item-click="onItemClick">
			<template #head>
				<div class="miniGame"></div>
			</template>
		</lobbyItem>
		<lobbyItem
			v-if="slotList.length"
			:listData="slotList"
			@more-click="moreClick('Slot')"
			@item-click="goleve2($event, 'slot')"
		>
			<template #head>
				<div class="title slot">{{ $t('electronicGame') }}</div>
			</template>
		</lobbyItem>
		<lobbyItem
			v-if="chessList.length"
			:listData="chessList"
			@more-click="moreClick('Chess')"
			@item-click="goleve2($event, 'chess')"
		>
			<template #head>
				<div class="title chess">{{ $t('chess') }}</div>
			</template>
		</lobbyItem>
		<lobbyItem v-if="fishList.length" :listData="fishList" @more-click="moreClick('Fish')" @item-click="onItemClick">
			<template #head>
				<div class="title fishing">{{ $t('fishing') }}</div>
			</template>
		</lobbyItem>
		<lobbyItem v-if="liveList.length" :listData="liveList" @more-click="moreClick('Video')" @item-click="onItemClick">
			<template #head>
				<div class="title live">{{ $t('live') }}</div>
			</template>
		</lobbyItem>
		<lobbyItem v-if="sportList.length" :listData="sportList" @more-click="moreClick('Sport')" @item-click="onItemClick">
			<template #head>
				<div class="title sport">{{ $t('sport') }}</div>
			</template>
		</lobbyItem>
		<bigaward />
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import lobbyItem from './lobbyItem.vue'
import bigaward from './bigaward.vue'
// 使用 inject 接收父组件传递的实例
const useHomeHook: any = inject('useHomeHook')
const { homeState, isAlowGame, onItemClick, isSassLotteryGame, openThirdGame, checkMaintain } = useHomeHook

// 定义 Emits
const emit = defineEmits<{
	(e: 'change-type', item: any): void
}>()
const router = useRouter()
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
const lottertList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Lottery') === -1) {
		return []
	}
	return homeState.allGameList?.lottery || []
})
const miniList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Flash') === -1) {
		return []
	}
	return homeState.allGameList?.flash || []
})

const popList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Popular') === -1) {
		return []
	}
	return (
		homeState.allGameList?.popular?.platformList.map((i: any) => {
			i.img = i.imgUrl
			return i
		}) || []
	)
})

const slotList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Slot') === -1) {
		return []
	}
	return (
		homeState.allGameList?.slot.map((i: any) => {
			i.img = i.vendorImg
			return i
		}) || []
	)
})
const chessList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Chess') === -1) {
		return []
	}
	return (
		homeState.allGameList?.chess.map((i: any) => {
			i.img = i.vendorImg
			return i
		}) || []
	)
})

const fishList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Fish') === -1) {
		return []
	}
	return homeState.allGameList?.fish || []
})

const liveList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Video') === -1) {
		return []
	}
	return (
		homeState.allGameList?.video.map((i: any) => {
			i.img = i.vendorImg
			return i
		}) || []
	)
})
const sportList = computed(() => {
	if (homeState.gameTypeList.findIndex((item: any) => item.categoryCode === 'Sport') === -1) {
		return []
	}
	return (
		homeState.allGameList?.sport.map((i: any) => {
			i.img = i.vendorImg
			return i
		}) || []
	)
})
/**
 * @description: 点击前往游戏页面
 * @return {*}
 */
const golottery = (item: any) => {
	if (isSassLotteryGame(item)) {
		return openThirdGame({ ...item, vendorCode: 'ARLottery' })
	}
	router.push({
		name: 'AllLotteryGames-' + lotteryRoutes[lotteryRoutes.findIndex((v) => v.value === item.id)].path,
		query: { id: item.id }
	})
}
const moreClick = (value) => {
	emit('change-type', value) // 向父组件发送事件和数据
}
const goleve2 = (value: any, type: string) => {
	if (checkMaintain(value)) return
	sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList[type]))
	sessionStorage.setItem('gameType', JSON.stringify(type))
	sessionStorage.setItem('clickedItem', JSON.stringify(value))
	router.push({
		name: 'AllOnlineGames'
	})
}
</script>

<style lang="scss" scoped>
.lobby {
	font-family: 'Alibaba PuHuiTi 3.0';
	display: flex;
	gap: 56px;
	flex-direction: column;

	.lottery {
		.h {
			padding-inline-start: 72px;
			background-image: url(./svg/ball_8.svg);
			background-size: 60px;
			background-repeat: no-repeat;
			background-position-y: center;

			.t {
				color: #1e2637;
				font-size: 28px;
				font-style: normal;
				font-weight: 900;
				height: 40px;
			}

			.d {
				color: #7d889d;
				font-size: 24px;
				font-style: normal;
				font-weight: 400;
			}
		}

		.b {
			margin-top: 32px;
			display: flex;
			flex-wrap: wrap;
			gap: 24px;

			& > img {
				width: 339px;
				height: 200px;
			}
		}
	}
}

.miniGame {
	width: 196px;
	height: 40px;
	background-image: url(./svg/mini.svg);
	background-repeat: no-repeat;
	background-size: cover;
}

.title {
	color: #1e2637;
	font-family: 'Alibaba PuHuiTi 3.0';
	font-size: 28px;
	font-style: normal;
	font-weight: 900;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: left center;
	padding-inline-start: 50px;
	height: 44px;
	line-height: 44px;

	&.pop {
		background-image: url(./svg/pop.svg);
	}

	&.slot {
		background-image: url(./svg/slots_a.svg);
	}

	&.chess {
		background-image: url(./svg/card_a.svg);
	}

	&.fishing {
		background-image: url(./svg/fishing_a.png);
	}

	&.live {
		background-image: url(./svg/live.svg);
	}

	&.sport {
		background-image: url(./svg/sports_a.svg);
	}
}

.tip {
	color: #7d889d;
	height: 34px;
	line-height: 34px;
	font-family: 'Alibaba PuHuiTi 3.0';
	font-size: 24px;
	font-style: normal;
	font-weight: 400;

	span {
	}
}
</style>
