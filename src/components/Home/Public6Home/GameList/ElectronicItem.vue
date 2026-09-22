<template>
	<div class="onlineGamesItem__container" :class="{ allGame: isAll }">
		<div v-for="item in getGameList" :key="item.slotsTypeID" class="item" @click="goGame(item)">
			<img class="gameImg" v-lazy="item.vendorImg" />
			<Maintain :item="item"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import Maintain from '@/components/common/Maintain.vue'

const props = defineProps({
	gameData: {
		type: Array,
		default: []
	},
	isAll: {
		type: Boolean,
		default: false
	}
})

const getGameList = computed(() => {
	if (props.isAll) return props.gameData
	return props.gameData.slice(0, 6) as any[]
})

const emit = defineEmits(['handleOpenGame'])
const goGame = (item: any) => {
	emit('handleOpenGame', item, 'slot')
}

onMounted(() => {})
</script>

<style lang="scss" scoped>
.onlineGamesItem__container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 16px;
	margin-bottom:26px;
	.item {
		position: relative;
		width: 100%;
		aspect-ratio: 252 / 320;
		background: var(--main_gradient-color2);
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		.gameImg {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: 20px;
		}
	}
}
.allGame {
	grid-template-columns: repeat(3, 1fr);
	.item {
		width: 172px;
		height: 232px;
		.gameImg {
			width: 172px;
			height: 232px;
		}
	}
}
</style>
