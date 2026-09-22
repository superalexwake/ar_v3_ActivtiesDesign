<template>
	<div class="superjackMain" v-if="globalStore.token && ActiveSotre.isOpenJackpotReward==1">
		<div class="title">{{ $t('superjackpot') }}</div>
		<div class="driver"></div>
		<div class="tip">{{ $t('bigAward') }}{{ $t('cpsTip4') }} <span>{{ currency(settingS.jackportMaxReswadAmount)
			}}</span></div>
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
		<div v-if="globalStore.token" class="btn" @click="goSuperJ">{{ $t('lookBigAward') }}</div>
	</div>
</template>
<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import { currency, splitIntoGroups } from '@/utils'
import {computed, onMounted, ref} from 'vue'
import { GlobalStore, SettingStore } from '@/stores'
import router from '@/router'
import {useActive} from "@/components/common/use";
const { ActiveSotre, getActive } = useActive()
const globalStore = GlobalStore()
const settingS = SettingStore()
const swipeRef = ref()

const props = withDefaults(
	defineProps<{
		gameList: []
	}>(),
	{}
)
const picList = computed(() => {
	return splitIntoGroups(props.gameList || [], 3)
})

const goSuperJ = () => {
	router.push({
		name: 'SuperJackpot'
	})
}
onMounted(async()=>{
	if (globalStore.token) {
		await getActive()
	}
})

</script>
<style scoped lang="scss">
.superjackMain{
	margin-bottom: 40px;
}
.title {
	color: #171717;
	text-align: center;
	font-size: 30px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	margin: 36px 0;
}

.driver {
	width: 100%;
	height: 3px;
	position: relative;
	background-color: #E5E8F5;
	margin-bottom: 30px;
}
.driver::before,
.driver::after {
	content: '';
	position: absolute;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background-color:#E5E8F5;
}

.driver::before {
	left: -8px;
	top: -8px;
	html:lang(ar) &{
		left: unset;
		right: -8px;
	}
}

.driver::after {
	right: -8px;
	top: -8px;
	html:lang(ar) &{
		left: -8px;
		right: unset;
	}
}

.tip {
	color: var(--text_color_L3, #837064);
	font-size: 24px;
	font-style: normal;
	font-weight: 400;
	line-height: 34px;
	margin-bottom: 24px;

	span {
		color: var(--main-color, #FED358);
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
			right: 0;
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
			color: var(--text_color_L3, #837064);
			font-family: Roboto;
			font-size: 22px;
			font-style: normal;
			font-weight: 400;
		}

		.bonusAmount {
			color: var(--main-color, #FED358);
			font-family: Roboto;
			font-size: 22px;
			font-style: normal;
			font-weight: 500;
		}
	}
}

.btn {
	border-radius: 40px;
	background: var(--main_gradient-color, linear-gradient(180deg, #FED358 0%, #FFB472 100%));
	display: flex;
	width: 702px;
	height: 78px;
	padding: 20px;
	font-size: 28px;
	justify-content: center;
	align-items: center;
	color: var(--text_color_L4, #110D14);
	margin-top: 24px;
}

.right_btn {
	svg {
		width: 58px;
		height: 32px;
	}
}
</style>
