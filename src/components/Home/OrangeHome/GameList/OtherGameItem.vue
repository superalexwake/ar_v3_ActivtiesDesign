<template>
	<div class="other_game">
		<img v-for="item in gameList" :key="item.slotsTypeID" v-lazy="getImg(item)" alt="" class="other_img"
			@click="onItemClick(item)" />
	</div>
</template>

<script setup lang="ts">
import type { Chess } from '@/types/api'

const props = withDefaults(
	defineProps<{
		gameList: Chess[]
		currentMenu: string
		info: any
	}>(),
	{}
)

const getImg = (item: Chess) => {
	return item.vendorImg
}
const emit = defineEmits(['onItemClick'])

/**
 * @description: 点击游戏前往游戏页面
 * @return {*}
 */
const onItemClick = (item: any) => {
	emit('onItemClick',  item, props.currentMenu)
}
</script>

<style lang="scss" scoped>
.other_game {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 38px;
	margin-bottom: 30px;

	.other_img {
		width: 100%;
		height: auto;
		border-radius: 20px;
		background: linear-gradient(157deg, #FF9902 0%, #FFD058 100%);
		box-shadow: 0px -4px 10px 0px #fff6f4 inset, 0px 8px 16px 4px #d0d0ed5c;
	}
}
</style>
