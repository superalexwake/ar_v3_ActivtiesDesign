<template>
	<div class="lobby">
		<template v-for="(item, idx) in newList" :key="idx">
			<div v-if="item === 'Lottery'" class="lottery">
				<div class="h">
					<div class="t">{{ $t('lottery') }}</div>
				</div>
				<div class="b">
					<img v-for="(i, k) in lotterytList" :key="k" :src="i.categoryImg" @click="isAlowGame(i, golottery)" />
				</div>
			</div>
			<lobbyItem
				v-else-if="item === 'Popular'"
				:listData="popList"
				@item-click="onItemClick"
				@more-click="moreClick('Popular')"
			>
				<template #head>
					<div class="title pop">{{ $t('popularTitle') }}</div>
				</template>
			</lobbyItem>
			<lobbyItem
				v-else-if="item === 'Flash'"
				:listData="miniList"
				@more-click="moreClick('Flash')"
				@item-click="onItemClick"
			>
				<template #head>
					<div class="title miniGame">{{$t('code9308')}}</div>
				</template>
			</lobbyItem>
			<lobbyItem
				v-else-if="item === 'Video'"
				:listData="liveList"
				@more-click="moreClick('Video')"
				@item-click="onItemClick"
			>
				<template #head>
					<div class="title live">{{ $t('live') }}</div>
				</template>
			</lobbyItem>
			<lobbyItem
				v-else-if="item === 'Slot'"
				:listData="slotList"
				@more-click="moreClick('Slot')"
				@item-click="goleve2($event, 'slot')"
			>
				<template #head>
					<div class="title slot">{{ $t('electronicGame') }}</div>
				</template>
			</lobbyItem>
			<lobbyItem
				v-else-if="item === 'Sport'"
				:listData="sportList"
				@more-click="moreClick('Sport')"
				@item-click="onItemClick"
			>
				<template #head>
					<div class="title sport">{{ $t('sport') }}</div>
				</template>
			</lobbyItem>
			<lobbyItem
				v-else-if="item === 'Chess'"
				:listData="chessList"
				@more-click="moreClick('Chess')"
				@item-click="goleve2($event, 'chess')"
			>
				<template #head>
					<div class="title chess">{{ $t('chess') }}</div>
				</template>
			</lobbyItem>
			<lobbyItem
				v-else-if="item === 'Fish'"
				:listData="fishList"
				@more-click="moreClick('Fish')"
				@item-click="onItemClick"
			>
				<template #head>
					<div class="title fishing">{{ $t('fishing') }}</div>
				</template>
			</lobbyItem>
		</template>
		<CountActive />
		<bigaward />
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import lobbyItem from './lobbyItem.vue';
import bigaward from './bigaward.vue';
import CountActive from './CountActive.vue';
// 使用 inject 接收父组件传递的实例
const useHomeHook: any = inject('useHomeHook');
const { homeState, isAlowGame, onItemClick,isSassLotteryGame,openThirdGame } = useHomeHook;

// 定义 Emits
const emit = defineEmits<{
	(e: 'change-type', item: any): void;
}>();
const router = useRouter()

const props = defineProps<{
	tabList: [];
}>();

// console.log('props.tabList',props.tabList);
const newList = computed(() => {
	return props.tabList.map((item: any) => {
		return item.key;
	});
})

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
];
const lotterytList = computed(() => {
	return homeState.allGameList?.lottery.map((i: any) => {
		i.img = i.categoryImg
		return i;
	}) || []
})
const miniList = computed(() => {
	return homeState.allGameList?.flash || []
})

const popList = computed(() => {
	return homeState.allGameList?.popular?.platformList.map((i: any) => {
		i.img = i.imgUrl
		return i;
	}) || [];
})

const slotList = computed(() => {
	return homeState.allGameList?.slot.map((i: any) => {
		i.img = i.vendorImg
		return i;
	}) || [];
})

const chessList = computed(() => {
	return homeState.allGameList?.chess.map((i: any) => {
		i.img = i.vendorImg
		return i;
	}) || []
})

const fishList = computed(() => {
	return homeState.allGameList?.fish || [];
})

const liveList = computed(() => {
	return homeState.allGameList?.video.map((i: any) => {
		i.img = i.vendorImg
		return i;
	}) || [];
})
const sportList = computed(() => {
	return homeState.allGameList?.sport.map((i: any) => {
		i.img = i.vendorImg
		return i;
	}) || [];
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
const moreClick = (value:any) => {
	emit('change-type', value); // 向父组件发送事件和数据
}
const goleve2 = (value: any, type: string) => {
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
	font-family: "Alibaba PuHuiTi 3.0";
	display: flex;
	gap: 56px;
	flex-direction: column;
	padding:40px 24px;
	background:linear-gradient(180deg, #231C21 42.3%, rgba(35, 28, 33, 0.00) 100%);
	border-radius: 24px;
	.lottery {
		.h {
			padding-inline-start:55px;
			background-image: url('@/assets/p5BlackGoldStyle/icons/home/ball_8.png');
			background-size: 40px;
			background-repeat: no-repeat;
			background-position-y: center;

			.t {
				color: var(--text_color_L1, #FDE4BC);
				font-size: 28px;
				font-style: normal;
				font-weight: 600;
				height: 40px;
			}
		}

		.b {
			margin-top: 20px;
			display: flex;
			flex-wrap: wrap;
			gap: 24px;

			&>img {
				width: 339px;
				height: 200px;
			}
		}
	}
}

//.miniGame {
//    width:40px;
//    height: 40px;
//    background-image: url(@/assets/p5BlackGoldStyle/icons/home/MiniGame.png);
//    background-repeat: no-repeat;
//    background-size: cover;
//}

.title {
	color: var(--text_color_L1, #FDE4BC);
	font-family: "Alibaba PuHuiTi 3.0";
	font-size: 28px;
	font-style: normal;
	font-weight: 900;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: left center;
	padding-inline-start: 50px;
	height: 44px;
	line-height: 44px;

	&.miniGame {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/MiniGame.png);
	}
	&.pop {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/Popular.png);
	}

	&.slot {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/Slots.png);
	}

	&.chess {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/PVC.png);
	}

	&.fishing {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/Fishing.png);
	}

	&.live {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/Casino.png);
	}

	&.sport {
		background-image: url(@/assets/p5BlackGoldStyle/icons/home/Sports.png);
	}
}

.tip {
	color: #7D889D;
	height: 34px;
	line-height: 34px;
	font-family: "Alibaba PuHuiTi 3.0";
	font-size: 24px;
	font-style: normal;
	font-weight: 400;

	span {}
}
</style>