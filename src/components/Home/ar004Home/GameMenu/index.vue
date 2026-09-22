<template>
	<div class="game_menu">
		<div class="menu_box1">
			<div @click="handleClickMenu('popular')">
				<img :src="gameMenu.popular?.img" alt="" />
				<span>{{ $t('hot') }}</span>
			</div>
			<div @click="handleClickMenu('lottery')">
				<img :src="gameMenu.lottery?.img" alt="" />
				<span>{{ $t('lottery') }}</span>
			</div>
			<div @click="handleClickMenu('slot')">
				<img :src="gameMenu.slot?.img" alt="" />
				<span>{{ $t('electronic') }}</span>
			</div>
		</div>

		<div class="menu_box2">
			<div @click="handleClickMenu('sport')">
				<img :src="gameMenu.sport?.img" alt="" />
				<span>{{ $t('sport') }}</span>
			</div>
			<div @click="handleClickMenu('video')" class="live_menu">
				<img :src="gameMenu.video?.img" alt="" />
				<span>{{ $t('live') }}</span>
			</div>
			<div @click="handleClickMenu('chess')">
				<img :src="gameMenu.chess?.img" alt="" />
				<span>{{ $t('chess') }}</span>
			</div>
		</div>
		<div class="menu_box3">
			<div @click="handleClickMenu('fish')">
				<img :src="gameMenu.fish?.img" alt="" />
				<span>{{ $t('fishing') }}</span>
			</div>
			<div @click="handleClickMenu('flash')">
				<img :src="gameMenu.flash?.img" alt="" />
				<span>{{ $t('miniGame') }}</span>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		allGameList: any[]
	}>(),
	{}
)

const emit = defineEmits(['clickMenu'])

const gameMenu = computed(() => {
	let menu: any = {}
  const list=props.allGameList||[];
  list.forEach((item) => {
		menu[item.gameType] = item
	})
	return menu
})

const handleClickMenu = (type: string) => {
	emit('clickMenu', { type, gameMenu: gameMenu.value[type] })
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
				color: var(--text_color_black, var(--text_color_L4));
				text-align: 18px;
			}

			img {
				margin-top: -32px;
				margin-bottom: 10px;
			}
		}

		div:nth-child(1) {
			width: 248px;
			height: 206px;
			background: url('@icon/blueHome/hot_bg.png') no-repeat center center;

			img {
				width: 195px;
				height: 162px;
			}
		}

		div:nth-child(2),
		div:nth-child(3) {
			width: 188px;
			height: 206px;

			img {
				width: 175px;
				height: 162px;
			}
		}

		div:nth-child(2) {
			background: url('@icon/blueHome/lottery_bg.png') no-repeat center center;
		}

		div:nth-child(3) {
			background: url('@icon/blueHome/electronic_bg.png') no-repeat center center;
		}

		div::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) scale(0);
			width: 200px;
			height: 200px;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.5);
			opacity: 0.5;
			pointer-events: none;
			transition: transform 0.5s ease-out, opacity 1s ease-in;
		}

		div:hover::after {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0;
			transition: transform 0.5s ease-out, opacity 0.5s ease-out;
		}
	}

	.menu_box2 {
		width: 100%;
		height: 174px;
		background: url('@icon/blueHome/third_bg.png') no-repeat center center;
		display: flex;
		align-items: center;
		border-radius: 20px;
		margin-bottom: 30px;

		div {
			width: 33.33%;
			height: 174px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			span {
				font-size: 26px;
				font-weight: 600;
				color: var(--text_color_black, var(--text_color_L4));
				margin-top: 4px;
			}

			img {
				width: 125px;
				height: 110px;
				margin-top: 4px;
			}
		}

		.live_menu::before {
			content: '';
			position: absolute;
			display: inline-block;
			width: 1px;
			height: 136px;
			background: #ffffff42;
			left: 0;
			top: 20px;
			html:lang(ar) &{
				left: unset;
				right: 0;
			}
		}

		.live_menu::after {
			content: '';
			position: absolute;
			display: inline-block;
			width: 1px;
			height: 136px;
			background: #ffffff42;
			right: 0;
			top: 20px;
			html:lang(ar) &{
				right: unset;
				left: 0;
			}
		}
	}

	.menu_box3 {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		div {
			width: 336px;
			height: 132px;
			display: flex;
			justify-content: row;
			border-radius: 20px;
			position: relative;

			// overflow: hidden;
			img {
				width: 125px;
				height: 96px;
				margin: 18px auto 18px 20px;
			}

			span {
				font-weight: 700;
				font-size: 28px;
				line-height: 36px;
				color: var(--text_color_black, var(--text_color_L4));
				margin-top: 72px;
				margin-right: 28px;
			}
		}

		div:nth-child(1) {
			background: url('@icon/blueHome/fish_bg.png') no-repeat center center;
		}

		div:nth-child(2) {
			background: url('@icon/blueHome/game_mini_bg.png') no-repeat center center;
		}

		// 		.ripple {
		//   position: relative;
		//   overflow: hidden;
		// }

		div::after {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) scale(0);
			width: 200px;
			height: 200px;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.5);
			opacity: 0.5;
			pointer-events: none;
			transition: transform 0.5s ease-out, opacity 1s ease-in;
		}

		div:hover::after {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0;
			transition: transform 0.5s ease-out, opacity 0.5s ease-out;
		}
	}
}
</style>
