<template>
	<div id="gameTypePoint" />
	<van-tabs
		v-if="homeState.gameTypeList"
		v-model:active="active"
		sticky
		class="gameTypeHome"
		ref="root"
		:class="{ isTop: state.fixed }"
		@click-tab="onScrollTo"
	>
		<van-tab v-for="(item, i) in gameList" :key="i" :name="item.categoryCode.toLowerCase()">
			<template #title>
				<div class="tabs-btn">
					<img v-lazy="item.categoryImg" alt="" :data-img="defaultImgAvatar" />
					{{ item.title }}
				</div>
			</template>
		</van-tab>
	</van-tabs>
	<div class="game-content">
		<component  v-for="(item, index) in gameList" :key="index" :is="GameRecordList[item.categoryCode.toLowerCase()]" :id="item.categoryCode.toLowerCase()" />
	</div>
</template>
<script setup lang="ts">
import { useHome } from '@/hooks'
import { computed, onMounted, reactive, ref } from 'vue'
import { useScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useAssets } from '@/hooks/useAssets'
const { defaultImgAvatar } = useAssets()
import lottery from './lottery.vue'
import fish from './fish.vue'
import slot from './slot.vue'
import flash from './flash.vue'
import sport from './sport.vue'
import video from './video.vue'
import chess from './chess.vue'
import popular from './popular.vue'
import bigaward from './bigaward.vue'

// 动态组件
const GameRecordList = {
	lottery,
	fish,
	slot,
	flash,
	sport,
	video,
	chess,
	popular,
	bigaward
}
const { getAllGame, getGameType, homeState } = useHome()
const { t } = useI18n()
const textMap = {
	fish: t('fishing'),
	lottery: t('lottery'),
	slot: t('electronic'),
	flash: t('code9308Flash'),
	sport: t('sport'),
	video: t('code9306Video'),
	chess: t('code9307Chess'),
	popular: t('code9302Popular'),
	bigaward: t('superjackpot')
}
const gameList: any = computed(() =>
	homeState.gameTypeList.map((item) => {
		item.title = textMap[item.categoryCode.toLowerCase()]
		return item
	})
)
const active = ref('')
const state = reactive({
	fixed: false
})
const root = ref<HTMLDivElement>()

const onScrollTo = (value: any) => {
	var element = document.getElementById(active.value)
	if (element) {
		var distanceToTop = getElementDistanceToTop(element);
		window.scrollTo({
		    top: distanceToTop - 140,
		    behavior: 'smooth' // 使用平滑滚动效果
		});
	}
}
function getElementDistanceToTop(element) {
    var distance = 0;
    while (element) {
        distance += element.offsetTop;
        element = element.offsetParent;
    }
    return distance;
}
const { y } = useScroll(window, {
	onScroll() {
		var element = document.getElementById('gameTypePoint')
		var rect = element?.getBoundingClientRect()
		state.fixed = 1 > (rect?.top || 10)
	},
	throttle: 100
})
onMounted(async () => {
	getGameType()
	await getAllGame()
})
</script>

<style scoped lang="scss">
.game-content {
	color: var(--text_color_L1);
	display: flex;
	flex-direction: column;
	gap: 40px;
}
.gameTypeHome {
	margin-bottom: 40px;
	&.isTop {
		position: sticky;
		top: 90px;
		z-index: 100;
		:deep(.van-tabs__wrap) {
			height: 170px;
		}
	}
	:deep(.van-tabs__wrap) {
		height: 152px;
		.van-tabs__nav {
			background: var(--bg_color_L1);
			padding: 0;
			.van-tab {
				color: var(--text_color_L1);
				opacity: 0.7;
				&.van-tab--active {
					opacity: 1;
					font-weight: 400;
				}
			}
			.van-tabs__line {
				display: none;
			}
			.tabs-btn {
				display: flex;
				flex-direction: column;
				align-items: center;
				min-width: 114px;
				img {
					width: 114px;
					height: 114px;
				}
				svg {
					width: 48px;
					height: 48px;
				}
			}
		}
	}
}
</style>
