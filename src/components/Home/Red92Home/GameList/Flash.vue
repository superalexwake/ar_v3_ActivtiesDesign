<template>
	<div class="flash_game">
		<div class="gameImg" v-for="item in gameList" :key="item.vendorId" @click="onItemClick(item)">
			<img  v-lazy="item.img"  />
			<Maintain :item="item"/>
		</div>
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
	emit('onItemClick', item )
}
</script>

<style lang="scss" scoped>
.flash_game {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 24px;
	margin-bottom: 62px;
	.gameImg {
		position: relative;
		width: 216px;
		img{
			width: 100%;
		}
	}
}
</style>
