<template>
	<div class="onlineGamesItem__container" :class="{ allGame: isAll }">
		<div v-for="item in getGameList" :key="item.slotsTypeID" class="item" @click="goGame(item)">
			<img class="gameImg" v-lazy="item.vendorImg" />
			<Maintain :item="item"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
