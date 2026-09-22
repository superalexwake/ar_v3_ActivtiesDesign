<template>
	<div class="lobby">
		<template v-for="(item, idx) in showList" :key="idx">
			<!-- Lottery -->
			<lobbyItem
				v-if="item.key === 'Lottery'"
				:list-data="lotteryList"
				display-type="Lottery"
				:title="$t('lottery')"
				:title-icon="partnerIcons.icon_Lottery"
				tag-text="Lottery"
				@item-click="onLotteryClick"
				@more-click="emit('change-type', 'Lottery')"
			/>
			<!-- 其他分类（厂商列表类型） -->
			<lobbyItem
				v-else-if="item.key === 'Popular'"
				:list-data="popularList"
				display-type="Popular"
				:title="$t('popularTitle')"
				:title-icon="partnerIcons.icon_Popular"
				vendor-mode
				@item-click="onItemClick"
				@more-click="emit('change-type', 'Popular')"
			/>
			<lobbyItem
				v-else-if="item.key === 'Flash'"
				:list-data="flashList"
				display-type="Flash"
				:title="$t('code9308')"
				:title-icon="partnerIcons.icon_MiniGame"
				vendor-mode
				@item-click="onItemClick"
				@more-click="emit('change-type', 'Flash')"
			/>
			<lobbyItem
				v-else-if="item.key === 'Video'"
				:list-data="videoList"
				display-type="Video"
				:title="$t('live')"
				:title-icon="partnerIcons.icon_Casino"
				vendor-mode
				@item-click="onItemClick"
				@more-click="emit('change-type', 'Video')"
			/>
			<lobbyItem
				v-else-if="item.key === 'Slot'"
				:list-data="slotList"
				display-type="Slot"
				:title="$t('electronicGame')"
				:title-icon="partnerIcons.icon_Slots"
				vendor-mode
				@item-click="onSlotClick"
				@more-click="emit('change-type', 'Slot')"
			/>
			<lobbyItem
				v-else-if="item.key === 'Sport'"
				:list-data="sportList"
				display-type="Sport"
				:title="$t('sport')"
				:title-icon="partnerIcons.icon_Sports"
				vendor-mode
				@item-click="onItemClick"
				@more-click="emit('change-type', 'Sport')"
			/>
			<lobbyItem
				v-else-if="item.key === 'Chess'"
				:list-data="chessList"
				display-type="Chess"
				:title="$t('chess')"
				:title-icon="partnerIcons.icon_PVC"
				vendor-mode
				@item-click="onChessClick"
				@more-click="emit('change-type', 'Chess')"
			/>
			<lobbyItem
				v-else-if="item.key === 'Fish'"
				:list-data="fishList"
				display-type="Fish"
				:title="$t('fishing')"
				:title-icon="partnerIcons.icon_Fishing"
				vendor-mode
				@item-click="onItemClick"
				@more-click="emit('change-type', 'Fish')"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import lobbyItem from './lobbyItem.vue'
import { partnerIcons } from './partnerIcons'

const props = defineProps<{
	tabList: any[]
}>()

const emit = defineEmits<{
	(e: 'change-type', value: string): void
}>()

const useHomeHook: any = inject('useHomeHook')
const { homeState, isAlowGame, onItemClick, isSassLotteryGame, openThirdGame, gol2chess } = useHomeHook
const router = useRouter()

// 显示顺序按 tabList，过滤掉 Lobby 自己
const showList = computed(() => props.tabList.filter((i: any) => i.key && i.key !== ''))

const lotteryList = computed(() => homeState.allGameList?.lottery || [])
const popularList = computed(
	() =>
		homeState.allGameList?.popular?.platformList?.map((i: any) => ({
			...i,
			img: i.imgUrl || i.vendorImg
		})) || []
)
const flashList = computed(() => homeState.allGameList?.flash || [])
const videoList = computed(
	() =>
		homeState.allGameList?.video?.map((i: any) => ({
			...i,
			img: i.vendorImg
		})) || []
)
const slotList = computed(
	() =>
		homeState.allGameList?.slot?.map((i: any) => ({
			...i,
			img: i.vendorImg
		})) || []
)
const sportList = computed(
	() =>
		homeState.allGameList?.sport?.map((i: any) => ({
			...i,
			img: i.vendorImg
		})) || []
)
const chessList = computed(
	() =>
		homeState.allGameList?.chess?.map((i: any) => ({
			...i,
			img: i.vendorImg
		})) || []
)
const fishList = computed(() => homeState.allGameList?.fish || [])

const lotteryRoutes = [
	{ value: 1, path: 'WinGo' },
	{ value: 2, path: 'K3' },
	{ value: 3, path: '5D' },
	{ value: 4, path: 'WinTrx' },
	{ value: 9, path: 'MotoRace' },
	{ value: 10, path: 'VideoWinGo' }
]

const onLotteryClick = (item: any) => {
	if (isSassLotteryGame(item)) {
		isAlowGame(item, () => openThirdGame({ ...item, vendorCode: 'ARLottery' }))
		return
	}
	const match = lotteryRoutes.find((v) => v.value === item.id)
	if (!match) return
	isAlowGame(item, () => {
		router.push({
			name: 'AllLotteryGames-' + match.path,
			query: { id: item.id }
		})
	})
}

const onSlotClick = (item: any) => {
	sessionStorage.setItem('slotGamesList', JSON.stringify(homeState.allGameList?.slot || []))
	sessionStorage.setItem('gameType', JSON.stringify('slot'))
	sessionStorage.setItem('clickedItem', JSON.stringify(item))
	router.push({ name: 'AllOnlineGames' })
}

const onChessClick = (item: any) => {
	gol2chess(item, homeState.allGameList?.chess)
}
</script>

<style scoped lang="scss">
.lobby {
	display: flex;
	flex-direction: column;
	gap: 48px;
}
</style>
