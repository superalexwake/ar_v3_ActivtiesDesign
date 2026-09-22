<template>
	<div class="other_box">
		<div class="other_item" v-for="item in gameList" :key="item.slotsTypeID" @click="handleSelect(item)">
			<img v-lazy="item.vendorImg"  />
			<Maintain :item="item"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type {Chess} from '@/types/api'

const props = withDefaults(
	defineProps<{
		gameType: string
		gameList: Chess[]
	}>(),
	{}
)

const emit = defineEmits(['onItemClick'])

const handleSelect = (item: Chess) => {
	emit('onItemClick', {item, key: props.gameType})
}
</script>

<style lang="scss" scoped>
.other_box {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 24px;

	.other_item {
		position: relative;
		width: 340px;
		height: 346px;
		border-radius: 48px;
		background: linear-gradient(90deg, #FFC59A 0%, #FF8580 100%);
		img {
			width: 100%;
			height: 346px;
			border-radius: 16px;
		}
	}
}
</style>
