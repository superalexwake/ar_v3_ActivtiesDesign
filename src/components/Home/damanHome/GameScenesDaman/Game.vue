<script setup lang="ts">
import { PropType} from 'vue'
import { HomeGameList } from '@/types'
import { useGameContext, useHome } from '@/hooks'
import Maintain from '@/components/common/Maintain.vue'

const props = defineProps({
	platformList: {
		type: Array as PropType<HomeGameList[]>,
		default: []
	},
	isAll: {
		type: Boolean,
		default: false
	},
	enterGame:{
		type: Boolean,
		default: false
	},
	odd:{
		type: Boolean,
		default: false
	},
	title:{
		type: String,
		default: ''
	},
    code:{
		type: String,
		default: ''
  	},

})
const { onGame,goGame } = useGameContext()
const { isAlowGame} = useHome()

</script>

<template>
	<div class="daman__container" :class="{ allGame: isAll }">
		<div v-for="item in platformList" :key="`${item.slotsTypeID||item.vendorId}-${item.gameID}`" class="item" @click="enterGame?isAlowGame(item, goGame):onGame(Object.assign({},item,{key:props.code}))">
			<img class="gameImg" v-lazy="item.vendorImg||item.img||item.imgUrl" />
			<div class="game-type" v-if="title">{{title}}</div>
			<div class="game-odd" v-if="odd">
				<span>{{$t('winOdds')}}</span>
				<span>{{item.winOdds}}%</span>
				<div class="win-p" :style="{width:`${Math.min(item.winOdds,100)}%`}"/>
			</div>
			<Maintain :item="item"/>
		</div>
	</div>
</template>


<style scoped lang="scss">
.daman__container {

	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 16px;
	margin-bottom: 62px;
	&.allGame {
		grid-template-columns: repeat(3, 1fr);
		.item {
			width: 222px;
			min-height: 300px;
			height:auto;
			.gameImg {
				width: 222px;
				height: 300px;
			}
		}
	}
	.cms-icon{
		color: #F95959;
		margin-right: 8px;
	}
	.item {
		position: relative;
		width: 220px;
		height: 300px;
		border-radius: 20px;
		.gameImg {
			width: 252px;
			height: 320px;
			border-radius: 20px;
			background: var(--main_gradient-color);
		}
		.game-type{
			position: absolute;
			bottom: 10px;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			font-size: 24px;
			font-weight: 600;
		}
	}
	//.gameImg {
	//	object-fit: cover;
	//}
	h2{
		    display: flex;
		    align-items: center;
			position: relative;
			margin-bottom: 26px;
			font-size: 36px;
			font-weight: bold;
		&.daman-line{
			padding-left: 20px;
			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				width: 6px;
				height: 30px;
				background: #f64646;
				border-radius: 4px;
			}
		}
	}
	.game-odd{
		display: flex;
		height: 36px;
		background: #E6E6E6;
		color: var(--text_color_L1);
		width: 100%;
		border-radius: 10px;
		font-size: 22px;
		overflow: hidden;
		margin-top: 6px;
		margin-bottom: 10px;
		position: relative;
		span{
			position: relative;
			z-index: 1;
			display: block;
			height: 100%;
			flex: 1;
			line-height: 40px;
			&:first-child{
				padding-left: 10px;
			}
			&:nth-child(2){
				text-align: right;
				padding-right: 10px;
				color: var(--darkTextW,var(--text_color_L1))
			}
		}
		.win-p{
			background: var(--main-color);
			position: absolute;
			left: 0;
			height: 100%;
		}

	}
}
</style>
