<template>
	<!-- 彩票类型 -->
	<div class="game-section" v-if="categoryCode === 'lottery' && lotteryList.length">
		<SectionHeader
			:title="t('code9301')"
			showAll
			:extraText="lotteryList.length > 6 ? `+${lotteryList.length} Games` : ''"
			@click-all="gol2('lottery')"
		/>
		<div class="game-section__grid game-section__grid--square">
			<div
				class="game-section__grid-item"
				v-for="item in lotteryList.slice(0, 6)"
				:key="item.id || item.categoryCode"
				@click="onLotteryClick(item)"
			>
				<img v-if="item.categoryImg" v-lazy="item.categoryImg" />
				<div v-else class="game-section__grid-item__placeholder"></div>
			</div>
		</div>
	</div>

	<!-- 其他类型（通用网格） -->
	<div class="game-section" v-else-if="gameList.length">
		<SectionHeader
			:title="sectionTitle"
			showAll
			:extraText="gameList.length > 6 ? `+${gameList.length} Games` : ''"
			@click-all="gol2(categoryCode)"
		/>
		<div class="game-section__grid">
			<div
				class="game-section__grid-item"
				v-for="item in gameList.slice(0, 6)"
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

// 分类名称映射（对应多语言 code93XX）
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

// 获取当前分类的游戏列表
const gameList = computed(() => {
	const all = homeState.allGameList as any
	if (!all) return []
	const code = props.categoryCode.toLowerCase()
	// popular 类型取 clicksTopList
	if (code === 'popular') {
		return all.popular?.platformList || []
	}
	return all[code] || []
})

// 彩票列表
const lotteryList = computed(() => {
	const all = homeState.allGameList as any
	return all?.lottery || []
})

// 分类标题
const sectionTitle = computed(() => {
	const code = props.categoryCode.toLowerCase()
	return textMap.value[code] || props.categoryCode
})

// 获取游戏图片
const getGameImg = (item: any) => {
	return item.imgUrl || item.vendorImg || item.categoryImg || item.img || ''
}

// 通用游戏点击
const onGameClick = (item: any) => {
	const code = props.categoryCode.toLowerCase()
	// slot/chess 类型跳转到 AllGames 二级页面
	if (['slot', 'chess'].includes(code)) {
		gol2(code)
		return
	}
	// 其他类型（popular/fish/video/sport 等）直接打开游戏
	isAlowGame(item, openThirdGame)
}

// 彩票路由
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
	background: #272036;
	border: 2px solid #3e2f60;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: inset 0 2px 0 0 #2e384a, 0 4px 4px 0 rgba(0, 0, 0, 0.25);

	// 通用游戏网格
	&__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		padding: 20px;

		// lottery 正方形
		&--square &-item {
			aspect-ratio: 1 / 1;
		}

		&-item {
			border-radius: 14px;
			border: none;
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
				background: linear-gradient(135deg, #3b1f6e, #6366f1);
			}

		}
	}
}
</style>
