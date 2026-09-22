<template>
	<div class="onlineGamesItem__container" :class="{ allGame: isAll }">
		<div v-for="item in getGameList" :key="item.slotsTypeID" class="item" @click="onItemClick(item)">
			<img class="gameImg" v-lazy="item.vendorImg" />
			<Maintain :item="item" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {onMounted, computed, PropType} from 'vue'

const props = defineProps({
	gameData: {
		type: Object as PropType<{
			gameList: any[]
			isShow: boolean
			title: string
			img: string
			gameType: string
		}>,
		default: () => ({})
	},
	isAll: {
		type: Boolean,
		default: false
	}
})


const getGameList = computed(() => {
	if (props.isAll) return props.gameData.gameList
	return props.gameData?.gameList.slice(0, 6) as any[]
})

const emit = defineEmits(['onItemClick'])
const onItemClick = (item: any) => {
	emit('onItemClick', item,'slot')
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.onlineGamesItem__container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 16px;
	margin-bottom: 62px;
	.item {
		position: relative;
		width: 252px;
		height: 320px;
		.gameImg {
			width: 252px;
			height: 320px;
			//border-radius: 20px;
		}
	}
}
.allGame {
	grid-template-columns: repeat(2, 1fr);
	.item {
		width: 340px;
		height: 310px;
		.gameImg {
			display: block;
			margin: 0 auto;
			width: 100%;
			max-height: 100%;
			object-fit: cover;
			border-radius: 10px;
		}
	}
}
</style>
