<template>
	<div class="fish_game">
		<div class="item" v-for="item in gameList" :key="item.vendorId" @click="onItemClick(item)">
			<img :src="item.img" alt="" :data-img="iconImagesAvatar" />
			<Maintain :item="item"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import iconImagesAvatar from '@public/images/avatar.png'
import type { Fish } from '@/types/api'

withDefaults(
	defineProps<{
		gameList: Fish[]
	}>(),
	{}
)

const emit = defineEmits(['onItemClick'])
const onItemClick = (item: any) => {
	emit('onItemClick',  item )
}
</script>

<style lang="scss" scoped>
.title {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
		img {
			width: 48px;
			height: 48px;
			margin-right: 10px;
		}
			font-size: 30px;
			line-height: 30px;
			font-weight: 700;
	}

.fish_game {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 14px;
	.item {
		width: 220px;
		position: relative;
		//height: 220px;
		background: linear-gradient(118.23deg, #ff8e89 26.37%, #ffc3a2 89.18%);
		border-radius: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 12px;
		img {
			width: 200px;
			//height: 200px;
			border-radius: 16px;
		}
		.hot_bage {
			position: absolute;
			right: -6px;
			top: -8px;
			width: 38px;
			height: 36px;
		}
	}
}
</style>
