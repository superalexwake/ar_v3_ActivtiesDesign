<script setup lang="ts">
import Dragon from './Dragon.vue'
import {PropType} from "vue";
import {HomeGameList} from "@/types";
import {useGameContext, useHome} from "@/hooks";
const props = defineProps({
	platformList: {
		type: Array as PropType<HomeGameList[]>,
		default: []
	},
	type:{
		type: String as PropType<'line'|'card'>,
		default:'line'
	}
})
const { onItemLottery } = useGameContext()
const { isAlowGame} = useHome()
</script>

<template>
	<div class="daman-lottery">
		<div v-for="item in platformList" :key="item.categoryCode" class="daman_img" @click="isAlowGame(item, onItemLottery)">
			<h3>{{item.categoryCode}}</h3>
			<img  v-lazy="item.categoryImg" alt=""/>
		<!--<div class="daman-btn">GO <van-icon name="arrow" /></div>-->
		</div>
	</div>
  <Dragon/>
</template>

<style scoped lang="scss">
.daman-lottery{
	width: 100%;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;
	margin-bottom: 20px;
	.daman_img{
		position: relative;
		width:222px;
		min-height:240px;
		height:auto;
		border-radius: 20px;
		background: url('@icon/public/daman-lottery_background.png') no-repeat center center;
		img{
			width:100%;
			object-fit: cover;
		}
		h3{
			margin-top: 30px;
			//margin-bottom: 10px;
			color: #FFF;
			text-shadow: 0px 2px 1px var(--main-color);
			font-family: Inter;
			font-size: 32px;
			text-align: center;
			font-weight: 600;
		}
	}

	img{
		display: block;
		margin: 0 auto;
	}
	.daman-btn{
		position: absolute;
		bottom:20px;
		right:20px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160px;
		height: 50px;
		line-height: 50px;
		border-radius: 100px;
		background-color: var(--darkLight, transparent);
		color: var(--text_color_L4);
		font-size: 30px;
		font-style: normal;
		font-weight: 700;
		border: 1px solid var(--darkLight,var(--bg_color_L2));
		gap: 10px;
		svg {
			width: 30px;
			height: 30px;
		}
	}
}
</style>