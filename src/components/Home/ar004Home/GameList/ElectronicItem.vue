<!--
 * @Author: Seven
 * @Date: 2024-03-19 14:04:43
 * @LastEditTime: 2024-03-19 14:32:56
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="onlineGamesItem__container" :class="{ allGame: isAll }">
		<div v-for="item in getGameList" :key="item.slotsTypeID" class="item" @click="onItemClick(item)">
			<img class="gameImg" v-lazy="item.vendorImg" />
			<Maintain :item="item" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed, type PropType } from 'vue'

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
	return props.gameData.gameList.slice(0, 6)
})

const emit = defineEmits(['onItemClick'])
const onItemClick = (item: any) => {
	emit('onItemClick', item, props.gameData.gameType)
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
		background: var(--main_gradient-color2);
		border-radius: 20px;
		.gameImg {
			width: 252px;
			height: 320px;
			border-radius: 20px;
		}
	}
}
.allGame {
	grid-template-columns: repeat(3, 1fr);
	.item {
		width: 222px;
		height: 280px;
		.gameImg {
			width: 222px;
			height: 280px;
		}
	}
}
</style>
