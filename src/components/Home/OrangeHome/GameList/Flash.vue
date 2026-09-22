<template>
	<div class="flash_game">
		<img class="gameImg" v-for="item in gameList" :key="item.vendorId" v-lazy="item.img" @click="onItemClick(item)"/>
	</div>
</template>

<script setup lang="ts">
import type { Fish } from '@/types/api'

withDefaults(
	defineProps<{
		gameList: Fish[]
	}>(),
	{}
)

const emit = defineEmits(['onItemClick'])

/**
 * @description: 点击游戏前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	emit('onItemClick', item)
}
</script>

<style lang="scss" scoped>
.flash_game {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
	margin-bottom: 62px;
	.gameImg {
		width: 100%;
		height: 216px;
	}
}
</style>
