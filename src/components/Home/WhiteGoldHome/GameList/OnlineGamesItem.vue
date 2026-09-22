<template>
	<div class="minGame_container" :class="{ all_game: isAll }">
		<div class="onlineGamesItem" v-for="item in getGameList" :key="item.gameID" @click="onItemClick(item)">
			<img :class="gameType === 'fish' ? 'fish_img' : 'min_game_img'" v-lazy="item.img" :key="item.gameID" />
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
	emit('onItemClick', { item, key: props.gameType })
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.minGame_container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 34px;
	margin-bottom: 30px;
}
.onlineGamesItem {
	width: 244px;
	height: 244px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: var(--main_gradient-color2);
	grid-gap: 14px;
	.fish_img {
		width: 240px;
		height: 240px;
	}
	.min_game_img {
		width: 244px;
		height: 244px;
	}
}
.all_game {
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 26px;
	.onlineGamesItem {
		width: 216px;
		height: 216px;
		border-radius: 20px;
		.fish_img {
			width: 212px;
			height: 212px;
			border-radius: 20px;
		}
		.min_game_img {
			width: 216px;
			height: 216px;
		}
	}
}
</style>
