<template>
	<div class="homeNav">
		<div class="title">
			<div><b />{{ $t('superjackpot') }}</div>
			<div class="right_btn">
				<svg-icon name="p3a_l" @click="handleOffset('left')" />
				<svg-icon name="p3a_r" @click="handleOffset('right')" />
			</div>
		</div>
		<div class="tip">{{ $t('bigAward') }}{{ $t('cpsTip4') }} <span>{{ currency(settingS.jackportMaxReswadAmount) }}</span></div>
		<Swipe
			class="my-swipe"
			ref="swipeRef"
			:autoplay="3000"
				:lazy-render="false"
			:show-indicators="false"
		>
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
		<div v-if="globalStore.token" class="btn" @click="goSuperJ">{{ $t('lookBigAward') }}</div>
	</div>
</template>
<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import { useHome } from '@/hooks'
import { currency, splitIntoGroups } from '@/utils'
import { computed, ref } from 'vue'
import { GlobalStore, SettingStore } from '@/stores'
import router from '@/router'
const { homeState } = useHome()
const globalStore = GlobalStore()
const settingS = SettingStore()
const swipeRef = ref()
const picList = computed(() => {
	return splitIntoGroups(homeState.allGameList?.awardrecordlist || [], 3)
})
/**
 * @description: 左右滚动游戏
 * @param {*} type
 * @return {*}
 */
const handleOffset = (type: string): void => {
	if (type === 'left') {
		swipeRef.value?.prev()
	} else {
		swipeRef.value?.next()
	}
}
const goSuperJ = () => {
	router.push({
		name: 'SuperJackpot'
	})
}
</script>
<style scoped lang="scss">
.title {
	height: 42px;
	display: flex;
	align-items: center;
	font-size: 30px;
	font-weight: 500;
	margin-bottom: 10px;
	justify-content: space-between;
	&>div {
		display: flex;
		align-items: center;
		gap: 12px
	}
	b {
		display: block;
		height: 26px;
		width: 8px;
		border-radius: 4px;
		background-color: var(--main-color);
	}
}
.tip {
	font-size: 22px;
	color: var(--text_color_L2);
	line-height: 34px;
	margin-bottom: 24px;
	span {
		color: var(--main-color);
	}
}
.picContainer {
	display: flex;
	flex-wrap: nowrap;
	gap: 12px;
	& > div {
		position: relative;
		width: calc((100% - 24px) / 3);
		border-radius: 10px;
		overflow: hidden;
		font-size: 22px;
		img {
			width: 100%;
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
		}
		.bonusAmount {
			color: var(--main-color);
		}
	}
}
.btn {
	width: 640px;
	height: 50px;
	line-height: 50px;
	background-color: var(--bg_color_L3);
	font-size: 28px;
	text-align: center;
	border-radius: 25px;
	color: var(--main-color);
	margin: 24px auto 40px auto;
}
.right_btn {
	svg {
		width: 58px;
		height: 32px;
	}
}
:deep(.van-swipe-item){
	margin-right: 12px;
}
</style>
