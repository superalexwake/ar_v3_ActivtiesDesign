<template>
	<div class="game_menu">
		<div class="menu_box1">
			<div @click="handleClickMenu('lottery')">
				<img v-lazy="gameMenu.lottery?.img" alt="" />
				<span>{{ $t('lottery') }}</span>
			</div>
			<div @click="handleClickMenu('flash')">
				<img v-lazy="gameMenu.flash?.img" alt="" />
				<span>{{ $t('miniGame') }}</span>
			</div>
			<div @click="handleClickMenu('slot')">
				<img v-lazy="gameMenu.slot?.img" alt="" />
				<span>{{ $t('electronic') }}</span>
			</div>
		</div>

		<div class="menu_box2">
			<div @click="handleClickMenu('sport')">
				<img v-lazy="gameMenu.sport?.img" alt="" />
				<span>{{ $t('sport') }}</span>
			</div>
			<div @click="handleClickMenu('popular')" class="live_menu">
				<img v-lazy="gameMenu.popular?.img" alt="" />
				<span>{{ $t('hot') }}</span>
			</div>
			<div @click="handleClickMenu('video')" >
				<img v-lazy="gameMenu.video?.img" alt="" />
				<span>{{ $t('live') }}</span>
			</div>
		</div>
		<div class="menu_box3">
			<div @click="handleClickMenu('chess')">
				<img v-lazy="gameMenu.chess?.img" alt="" />
				<span>{{ $t('chess') }}</span>
			</div>
			<div @click="handleClickMenu('fish')">
				<img v-lazy="gameMenu.fish?.img" alt="" />
				<span>{{ $t('fishing') }}</span>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import {computed, PropType} from 'vue'

const props = defineProps({
	allGameList:{
		type:Array as PropType<any[]>,
		default:()=>([])
	}
})

const emit = defineEmits(['clickMenu'])

const gameMenu = computed(() => {
	let menu: any = {}
	const list=props.allGameList||[];
	list.forEach((item,index) => {
		menu[item.gameType] = Object.assign(item,index)
	})
	return menu
})

const handleClickMenu = (type: string) => {
	const game=gameMenu.value[type]
	emit('clickMenu', { type, gameMenu:game,index:game.index  })
}

defineExpose({
	handleClickMenu
})
</script>
<style lang="scss" scoped>
.game_menu {
	width: 100%;
	padding-top: 30px;

	.menu_box1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;

		div {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 20px;
			position: relative;

			span {
				font-size: 30px;
				line-height: 36px;
				font-weight: 700;
				color: #333;
				width: 100%;
				text-align: left;
				padding-left: 20px;
			}

			img {
				margin-top: -42px;
				margin-bottom: 10px;
			}
		}

		div:nth-child(1) {
			width: 248px;
			height: 206px;
			background: url('./assets/hot_bg.png') no-repeat center center;

			img {
				width: 195px;
				height: 162px;
			}
		}

		div:nth-child(2),
		div:nth-child(3) {
			width: 210px;
			height: 206px;

			img {
				width: 175px;
				height: 162px;
			}
		}

		div:nth-child(2) {
			background: url('./assets/hot_bg.png') no-repeat center/100%;
		}

		div:nth-child(3) {
			background: url('./assets/hot_bg.png') no-repeat center/100%;
		}
	}

	.menu_box2 {
		width: 100%;
		height: 208px;
		background: url('./assets/third_bg.png') no-repeat center/100%;
		display: flex;
		align-items: center;
		border-radius: 20px;
		margin-bottom: 30px;

		div {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			span {
				font-size: 26px;
				font-weight: 600;
				color: #333;
				margin-top: 4px;
			}

			img {
				width: 200px;
				height: 160px;
			}
		}

		.live_menu::before {
			content: '';
			position: absolute;
			display: inline-block;
			width: 1px;
			height: 136px;
			background: linear-gradient(270deg, #AF8122 0%, #EBC370 101.84%);
			left: 0;
			top: 20px;
		}

		.live_menu::after {
			content: '';
			position: absolute;
			display: inline-block;
			width: 1px;
			height: 136px;
			background: linear-gradient(270deg, #AF8122 0%, #EBC370 101.84%);
			right: 0;
			top: 20px;
		}
	}

	.menu_box3 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		div {
			width: 336px;
			height: 170px;
			display: flex;
			justify-content: row;
			border-radius: 20px;
			position: relative;

			// overflow: hidden;
			img {
				width: 200px;
				height: 160px;
				margin: 0 auto 18px 10px;
			}

			span {
				font-weight: 700;
				font-size: 28px;
				line-height: 36px;
				color: #333;
				margin-top: 72px;
				margin-right: 28px;
			}
		}

		div:nth-child(1) {
			background: url('./assets/bottom.png') no-repeat center/100%;
		}

		div:nth-child(2) {
			background: url('./assets/bottom.png') no-repeat center/100%;
		}

	}
}
</style>
