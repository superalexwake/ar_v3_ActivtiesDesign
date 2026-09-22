<template>
	<div class="onlineGamesItem__container" :class="{ allGame: isAll }">
		<div v-for="item in getGameList" :key="item.slotsTypeID" class="item" @click="goGame(item)">
			<img class="gameImg" v-lazy="item.vendorImg" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'

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
	margin-bottom: 62px;
	.item {
		width: 252px;
		height: 320px;
		background: linear-gradient(118deg, #FF9902 26.37%, #FFD058 89.18%);
		box-shadow: 0px 8px 16px rgba(208, 208, 237, 0.36), inset 0px -4px 10px #fff6f4;
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
