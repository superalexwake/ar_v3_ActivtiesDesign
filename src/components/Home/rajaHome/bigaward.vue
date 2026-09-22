<template>
	<div class="homeNav">
		<div class="homeNavTitle"></div>
		<div class="tip">{{ $t('bigAward') }}{{ $t('cpsTip4') }}</div>
		<Swipe class="my-swipe" ref="swipeRef" :autoplay="3000" :lazy-render="false"
			:show-indicators="false">
			<SwipeItem v-for="(item, x) in picList" :key="x">
				<div class="picContainer">
					<div v-for="(game, i) in item" v-lazy="game.imgUrl" alt="" :key="i">
						<div class="multiple">{{ game.multiple }}X</div>
						<img v-lazy="game.imgUrl" />
						<div class="gameName">{{ game.gameName }}</div>
						<div class="bonusAmount">{{ currency(game.bonusAmount) }}</div>
					</div>
				</div>
			</SwipeItem>
		</Swipe>
		<div v-if="globalStore.token" class="raja_btn" @click="goSuperJ">{{ $t('jackEnter') }}</div>
	</div>
</template>
<script setup lang="ts">
	import { Swipe, SwipeItem } from 'vant'
	import { useHome } from '@/hooks'
	import { currency, splitIntoGroups } from '@/utils'
	import { computed, ref } from 'vue'
	import { GlobalStore } from '@/stores'
	import router from '@/router'
	const { homeState } = useHome()
	const globalStore = GlobalStore()
		const swipeRef = ref()
	const picList = computed(() => {
		return splitIntoGroups(homeState.allGameList?.awardrecordlist || [], 3)
	})
		const goSuperJ = () => {
		router.push({
			name: 'SuperJackpot'
		})
	}
</script>
<style scoped lang="scss">
.homeNav{
	margin: 80px 0;
}
	.homeNavTitle {
		width: 426px;
		margin: 0 auto;
		height: 143px;
		background-repeat: no-repeat;
		background-size: 426px auto;
		background-position: center top;
		background-image: url(./svg/superJack.svg);
		position: relative;
		text-align: center;
		span{
			color: #FFF;
			font-family: "Climate Crisis";
			font-size: 30px;
			font-style: normal;
			font-weight: 900;
			line-height: 105%; /* 30.45px */
			letter-spacing: 2.03px;
			display: inline-block;
			width: 200px;
			text-align: center;
		}
		i{
			width: 82px;
			height: 89px;
			position: absolute;
			background-image: url(./svg/jack_icon.svg);
			background-position: center center;
			background-repeat: no-repeat;
			background-size: contain;
			top: -44px;
			right: 0;
		}
	}
	.tip {
		margin:20px 0 24px;
		color: var(--text_color_L1);
		text-align: center;
		font-size: 21px;
		font-style: normal;
		font-weight: 400;
		line-height: 100%; /* 21px */
		span {
			color: #FB5755;
			font-weight: 700;
		}
	}

	.picContainer {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;

		&>div {
			position: relative;
			width: calc((100% - 24px) / 3);
			border-radius: 10px;
			overflow: hidden;
			font-size: 22px;

			img {
				width: 222px;
				height: 300px;
			}

			.multiple {
				position: absolute;
				top: 0;
				left: 0;
				background: linear-gradient(90deg, #da22e4 0%, #981bfa 100%);
				height: 40px;
				line-height: 40px;
				padding: 0 20px;
				font-size: 24px;
				font-weight: 700;
				border-bottom-right-radius: 10px;
				color: #fff;
			}

			.gameName {
				margin-top:12px;
				color: var(--text_color_L1);
				font-size: 19px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				text-align: center;
			}

			.bonusAmount {
				color: var(--text_color_L1);
				font-size: 22px;
				font-style: normal;
				font-weight: 700;
				line-height: normal;
				text-align: center;
			}
		}
	}



	.right_btn {
		svg {
			width: 58px;
			height: 32px;
		}
	}
</style>
