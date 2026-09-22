<template>
	<div class="allGame">
		<div class="allGame-item" v-for="(i, k) in listData" :key="k" @click="onItemClick(i)">
			<img v-lazy="i.img || i.imgUrl || i.categoryImg" />
			<Maintain :item="i" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import Maintain from '@/components/common/Maintain.vue'
// 使用 inject 接收父组件传递的实例
const useHomeHook: any = inject('useHomeHook')
const { homeState, onItemClick } = useHomeHook

// 定义 props 接收父组件的 activeType
const props = defineProps<{
	activeType: string
}>()
const listData = computed(() => {
	// console.log('homeState.allGameList',homeState.allGameList)
	// console.log('activeType', props.activeType, homeState.allGameList?.popular?.clicksTopList)
	if (props.activeType === 'popular') {
		return [...(homeState.allGameList?.popular?.platformList || []), ...(homeState.allGameList?.popular?.clicksTopList || [])]
	}
	const list = homeState.allGameList[props.activeType.toLocaleLowerCase()] || []
	if (props.activeType === 'lottery') return list.map((item: any) => ({ ...item, vendorCode: 'ARLottery' }))
	return list
})
</script>
<style lang="scss" scoped>
.allGame {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	&-item {
		position: relative;
		width: 222px;
		height: 300px;
		img {
			width: 222px;
			height: 300px;
		}
	}
}
</style>