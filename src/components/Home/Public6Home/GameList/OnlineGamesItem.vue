<template>
	<div class="minGame_container" :class="{ all_game: isAll }">
		<div class="onlineGamesItem" :class="gameType" v-for="item in getGameList" :key="item.gameID" @click="onItemClick(item)">
			<img :class="gameType === 'fish' ? 'fish_img' : 'min_game_img'" v-lazy="item.img" :key="item.gameID" />
			<Maintain :item="item"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Fish } from '@/types/api'
import { computed, onMounted } from 'vue'

const props = withDefaults(
	defineProps <{
		gameData:Fish[]
		isAll: boolean
		gameType: string
	}>(),
	{}
)

const getGameList = computed(() => {
	if (props.isAll) return props.gameData
	return props.gameData.length > 8 ? props.gameData.slice(0, 8) : props.gameData
})

const emit = defineEmits(['onItemClick'])
const onItemClick = (item: any) => {
	emit('onItemClick', item)
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.minGame_container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap:16px 14px;
	margin-bottom:26px;
}
.onlineGamesItem {
	position: relative;
	width: 180px;
	height: 240px;
	display: flex;
	justify-content: center;
	align-items: center;
	grid-gap: 16px 14px;
	.fish_img {
		width: 180px;
		height: 240px;
	}
	.min_game_img {
		width: 180px;
		height: 240px;
	}
}
.all_game {
	grid-template-columns: repeat(3, 1fr);
	grid-gap:16px 14px;
	.onlineGamesItem {
		width: 180px;
		height: fit-content;
		border-radius: 16px;
		.fish_img {
			width: 180px;
			height: auto;
			border-radius: 16px;
		}
		.min_game_img {
			width: 180px;
			height: fit-content;
			max-height: 240px;
		}
		&.fish {
			background: transparent;
		}
	}
}
</style>
