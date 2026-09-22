<!--
 * @Author: Jason s1017349071@163.com
 * @Date: 2023-04-08 17:26:11
 * @LastEditors: Seven
 * @LastEditTime: 2024-03-27 16:15:43
 * @FilePath: \ar_v2_vue\src\components\Home\GameList\OtherGameItem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="other_game">
		<div v-for="item in gameList" :key="item.slotsTypeID" style="position: relative">
			<img
				v-lazy="getImg(item)"
				alt=""
				class="other_img"
				:class="{ noSlot: currentMenu !== 'slot' }"
				@click="onItemClick(item)"
			/>
			<Maintain :item="item"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Chess } from '@/types/api'

const props = withDefaults(
	defineProps<{
		gameList: Chess[]
		currentMenu: string
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
	&>div{
		position: relative;
	}

	.other_img {
		width: 330px;
		z-index: 1;
		height: 300px;
		border-radius: 20px;
		background: linear-gradient(125.43deg, #ff8e89 12.38%, #ffc3a2 87.13%);
	}
	.noSlot {
		height: 340px;
	}
	.tip {
		position: absolute;
		z-index: 2;
		top: 80px;
		width: 100%;
		left: 0;
		text-align: center;
		color: #fff;
		font-size: 22px;
		font-weight: 700;
	}
}
</style>
