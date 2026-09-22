<!--
 * @Author: Seven
 * @Date: 2024-03-19 14:27:58
 * @LastEditTime: 2024-03-19 14:27:59
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="minGame_container" :class="{ all_game: isAll }">
		<div class="onlineGamesItem" v-for="item in getGameList" :key="item.gameID" @click="onItemClick(item)">
			<img :class="gameData.gameType === 'fish' ? 'fish_img' : 'min_game_img'" v-lazy="item.img" :key="item.gameID" />
			<Maintain :item="item" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Fish } from '@/types/api'
import { computed, onMounted } from 'vue'

const props = withDefaults(
	defineProps<{
		gameData: {
			gameList: Fish[]
			isShow: boolean
			title: string
			img: string
			gameType: string
		}
		isAll: boolean
	}>(),
	{}
)

const getGameList = computed(() => {
	if (props.isAll) return props.gameData.gameList
	return props.gameData.gameList.length > 8 ? props.gameData.gameList.slice(0, 8) : props.gameData.gameList
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
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 34px;
	margin-bottom: 30px;
}
.onlineGamesItem {
	position: relative;
	width: 222px;
	height: 300px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: var(--main_gradient-color2);
	grid-gap: 14px;
	.fish_img {
		width: 222px;
		height: 300px;
	}
	.min_game_img {
		width: 222px;
		height: 300px;
	}
}
.all_game {
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;
	.onlineGamesItem {
		width: 222px;
		height: 300px;
		border-radius: 20px;
		.fish_img {
			width: 222px;
			height: 300px;
			border-radius: 20px;
		}
		.min_game_img {
			width: 222px;
			height: 300px;
		}
	}
}
</style>
