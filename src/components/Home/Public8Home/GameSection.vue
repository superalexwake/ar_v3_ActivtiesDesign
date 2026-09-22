<template>
	<!-- 彩票类型 -->
	<div class="game-section" v-if="categoryCode === 'lottery' && lotteryList.length">
		<SectionHeader
			:title="t('code9301')"
			showAll
			:extraText="lotteryList.length > 9 ? `+${lotteryList.length} Games` : ''"
			@click-all="gol2('lottery')"
		/>
		<div class="game-section__grid">
			<div
				class="game-section__grid-item"
				v-for="item in lotteryList.slice(0, 9)"
				:key="item.id || item.categoryCode"
				@click="onLotteryClick(item)"
			>
				<img v-if="getGameImg(item)" v-lazy="getGameImg(item)" />
				<div v-else class="game-section__grid-item__placeholder"></div>
			</div>
		</div>
	</div>

	<!-- 其他类型 -->
	<div class="game-section" v-else-if="gameList.length">
		<SectionHeader
			:title="sectionTitle"
			showAll
			:extraText="gameList.length > 9 ? `+${gameList.length} Games` : ''"
			@click-all="gol2(categoryCode)"
		/>
		<div class="game-section__grid">
			<div
				class="game-section__grid-item"
				v-for="item in gameList.slice(0, 9)"
				:key="item.gameCode || item.slotsName || item.gameID"
				@click="onGameClick(item)"
			>
				<img v-if="getGameImg(item)" v-lazy="getGameImg(item)" />
				<div v-else class="game-section__grid-item__placeholder"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'
import router from '@/router'
import SectionHeader from './SectionHeader.vue'

const props = defineProps<{
	categoryCode: string
}>()

const { homeState, gol2, openThirdGame, isAlowGame, isSassLotteryGame } = useHome()
const { t } = useI18n()

const textMap = computed<Record<string, string>>(() => ({
	popular: t('code9302'),
	fish: t('code9303'),
	slot: t('code9304'),
	sport: t('code9305'),
	casino: t('code9306'),
	pvc: t('code9307'),
	flash: t('code9308'),
	lottery: t('code9301'),
	chess: t('code9307'),
	video: t('code9306')
}))

const gameList = computed(() => {
	const all = homeState.allGameList as any
	if (!all) return []
	const code = props.categoryCode.toLowerCase()
	if (code === 'popular') {
		return all.popular?.platformList || []
	}
	return all[code] || []
})

const lotteryList = computed(() => {
	const all = homeState.allGameList as any
	return all?.lottery || []
})

const sectionTitle = computed(() => {
	const code = props.categoryCode.toLowerCase()
	return textMap.value[code] || props.categoryCode
})

const getGameImg = (item: any) => {
	return item.imgUrl || item.vendorImg || item.categoryImg || item.img || ''
}

const onGameClick = (item: any) => {
	const code = props.categoryCode.toLowerCase()
	if (['slot', 'chess'].includes(code)) {
		gol2(code)
		return
	}
	isAlowGame(item, openThirdGame)
}

const lotteryRoutes = [
	{ value: 1, path: 'WinGo' },
	{ value: 3, path: '5D' },
	{ value: 2, path: 'K3' },
	{ value: 4, path: 'WinTrx' },
	{ value: 5, path: 'XoSo' },
	{ value: 6, path: 'XoSo' },
	{ value: 7, path: 'Binguo' },
	{ value: 8, path: '4D' }
]

const onLotteryClick = (item: any) => {
	isAlowGame(item, (game: any) => {
		if (isSassLotteryGame(game)) {
			return openThirdGame({ ...game, vendorCode: 'ARLottery' })
		}
		const route = lotteryRoutes.find((v) => v.value === game.id)
		if (route) {
			router.push({
				name: 'AllLotteryGames-' + route.path,
				query: { id: game.id }
			})
		}
	})
}
</script>

<style lang="scss" scoped>
.game-section {
	border-radius: 20px;
	overflow: visible;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
	fill: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.00) 60.43%);
	stroke-width: 2px;
	stroke: rgba(255, 255, 255, 0.00);
	filter: drop-shadow(0 4px 12px rgba(108, 188, 231, 0.25));
	&__grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		padding: 20px 20px 20px;

		&::after {
			content: '';
			position: absolute;
			top: 65%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 100%;
			max-width: 750px;
			height: 875px;
			border-radius: 875px;
			opacity: 0.2;
			background: linear-gradient(246deg, #3E8FFF 18.68%, #63E8FF 49.62%);
			filter: blur(117px);
			pointer-events: none;
		}

		&-item {
			position: relative;
			z-index: 1;
			border-radius: 14px;
			overflow: hidden;
			cursor: pointer;
			aspect-ratio: 37 / 50;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			&__placeholder {
				width: 100%;
				height: 100%;
				background: var(--bg_color_L3);
			}
		}
	}
}
</style>
