<template>
	<div class="onlineGamesItem__container" :class="{ allGame: isAll }">
		<div v-for="item in getGameList" :key="item.slotsTypeID" class="item" @click="onItemClick(item)">
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

const emit = defineEmits(['onItemClick'])
const onItemClick = (item: any) => {
	emit('onItemClick', { item, key: 'slot' })
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
		background: var(--main_gradient-color2);
		box-shadow: var(--BoxShadowColor-9), var(--BoxShadowColor-20);
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
