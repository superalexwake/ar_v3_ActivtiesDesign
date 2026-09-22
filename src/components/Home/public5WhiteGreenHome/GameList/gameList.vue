<template>
	<div class="game-list">
		<!-- Popular: 推荐 + 热门点击 两段 -->
		<template v-if="activeType === 'Popular'">
			<div class="game-list__section">
				<div class="game-list__head">
					<img v-if="cfg?.icon" :src="cfg.icon" alt="" />
					<span>{{ cfg?.label }}</span>
				</div>
				<div class="game-list__grid">
					<div v-for="(item, i) in platformList" :key="'p' + i" class="popular-card" @click="handleClick(item)">
						<div class="popular-card__img">
							<img v-lazy="item.imgUrl" alt="" />
							<Maintain :item="item" />
						</div>
						<div class="popular-card__odds">
							<span class="popular-card__odds-label">{{ $t('winOdds') }}</span>
							<span class="popular-card__odds-value">{{ item.winOdds }}%</span>
							<div class="popular-card__odds-bar" :style="{ width: `${Math.min(item.winOdds, 100)}%` }" />
						</div>
					</div>
				</div>
			</div>
			<div class="game-list__section" v-if="clicksTopList.length">
				<div class="game-list__head">
					<img :src="cfg?.icon" alt="" />
					<span>{{ $t('popular') }}</span>
				</div>
				<div class="game-list__grid">
					<GameCard
						v-for="(item, i) in clicksTopList"
						:key="'c' + i"
						:item="{ ...item, img: item.imgUrl }"
						:tag-icon="item.vendorCode"
						:tag-text="item.vendorCode || item.vendorName || cfg?.label"
						:name="item.gameName || item.gameNameEn || item.gameCode"
						@click="handleClick"
					/>
				</div>
			</div>
		</template>

		<!-- 其他分类：单段网格 -->
		<template v-else>
			<div v-if="showCategoryTitle" class="game-list__head">
				<img v-if="cfg?.icon" :src="cfg.icon" alt="" />
				<span>{{ cfg?.label }}</span>
			</div>
			<div class="game-list__grid">
				<GameCard
					v-for="(item, i) in listData"
					:key="i"
					:item="item"
					:tag-icon="item.vendorCode"
					:tag-text="
						vendorMode
							? item.vendorName || item.vendorCode || item.name
							: item.vendorCode || item.vendorName || cfg?.label
					"
					:name="vendorMode ? '' : getCardName(item)"
					@click="handleClick"
				/>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import GameCard from './GameCard.vue'
import Maintain from '@/components/common/Maintain.vue'
import { shouldShowCategoryTitle } from './displayRules'
import { getLotteryCardName } from './lotteryName'
import { partnerIcons } from './partnerIcons'

const props = defineProps<{
	activeType: string
}>()

const useHomeHook: any = inject('useHomeHook')
const { homeState, onItemClick, isAlowGame, isSassLotteryGame, openThirdGame, gol2chess } = useHomeHook
const { t } = useI18n()
const router = useRouter()

const itemTitle: Record<string, { label: string; icon: string }> = {
	Lottery: { label: t('lottery'), icon: partnerIcons.icon_Lottery },
	Popular: { label: t('popularTitle'), icon: partnerIcons.icon_Popular },
	Flash: { label: t('code9308'), icon: partnerIcons.icon_MiniGame },
	Video: { label: t('live'), icon: partnerIcons.icon_Casino },
	Sport: { label: t('sport'), icon: partnerIcons.icon_Sports },
	Chess: { label: t('chess'), icon: partnerIcons.icon_PVC },
	Fish: { label: t('fishing'), icon: partnerIcons.icon_Fishing }
}

const cfg = computed(() => itemTitle[props.activeType])
const showCategoryTitle = computed(() => shouldShowCategoryTitle(props.activeType))

// 厂商模式：每项是厂商（显示 vendorName/vendorImg）；
// Lottery/Flash/Fish 是子游戏列表，要展示游戏名
const vendorMode = computed(() => ['Popular', 'Video', 'Sport', 'Chess'].includes(props.activeType))

// Popular 专用：两段数据
const platformList = computed(() => homeState.allGameList?.popular?.platformList || [])
const clicksTopList = computed(() => homeState.allGameList?.popular?.clicksTopList || [])

const listData = computed(() => {
	const key = props.activeType.toLowerCase()
	const raw = homeState.allGameList?.[key] || []
	// 厂商分类用 vendorImg 作为卡片图
	if (['Slot', 'Sport', 'Chess', 'Video'].includes(props.activeType)) {
		return raw.map((i: any) => ({ ...i, img: i.vendorImg }))
	}
	return raw
})

const getCardName = (item: any) => {
	if (props.activeType === 'Lottery') {
		return getLotteryCardName(item)
	}
	return item.gameName || item.gameNameEn || item.slotsName || item.categoryName || item.gameCode || item.name
}

const lotteryRoutes = [
	{ value: 1, path: 'WinGo' },
	{ value: 2, path: 'K3' },
	{ value: 3, path: '5D' },
	{ value: 4, path: 'WinTrx' },
	{ value: 9, path: 'MotoRace' },
	{ value: 10, path: 'VideoWinGo' }
]

const handleClick = (item: any) => {
	if (props.activeType === 'Lottery') {
		if (isSassLotteryGame(item)) {
			isAlowGame(item, () => openThirdGame({ ...item, vendorCode: 'ARLottery' }))
			return
		}
		const match = lotteryRoutes.find((v) => v.value === item.id)
		if (!match) return
		isAlowGame(item, () => {
			router.push({
				name: 'AllLotteryGames-' + match.path,
				query: { id: item.id }
			})
		})
		return
	}
	if (props.activeType === 'Chess') {
		gol2chess(item, homeState.allGameList?.chess)
		return
	}
	onItemClick(item)
}
</script>

<style scoped lang="scss">
.game-list {
	display: flex;
	flex-direction: column;
	gap: 48px;

	&__head {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text_color_L1);
		font-size: 30px;
		font-weight: 600;
		margin-bottom: 24px;

		img {
			width: 40px;
			height: 40px;
			object-fit: contain;
		}
	}

	&__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

.popular-card {
	display: flex;
	flex-direction: column;
	gap: 12px;
	cursor: pointer;

	&__img {
		position: relative;
		width: 100%;
		aspect-ratio: 11 / 15;
		border-radius: 16px;
		overflow: hidden;

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&__odds {
		position: relative;
		display: flex;
		align-items: center;
		height: 36px;
		border-radius: 10px;
		background: rgba(158, 162, 168, 0.25);
		font-size: 22px;
		color: #001534;
		overflow: hidden;

		span {
			position: relative;
			z-index: 1;
			line-height: 36px;
		}

		&-bar {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			border-radius: 10px 0 0 10px;
			background: var(--main_gradient-color);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
		}
	}

	&__odds-label {
		flex: 1 1 auto;
		min-width: 0;
		padding-left: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__odds-value {
		flex: 0 0 auto;
		padding: 0 12px 0 8px;
		text-align: right;
		white-space: nowrap;
	}
}
</style>
