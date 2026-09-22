<template>
	<div class="lottery-games" v-if="displayGames.length">
		<SectionHeader
			title="Lottery"
			showAll
			:extraText="`+${lotteryList.length} Games`"
			@click-all="gol2('lottery')"
		/>
		<div class="lottery-games__list">
			<div
				class="lottery-games__list-item"
				v-for="item in displayGames"
				:key="item.id || item.categoryCode"
				@click="onItemClick(item)"
			>
				<span class="lottery-games__list-item__name">{{ item.categoryCode || '' }}</span>
				<div class="lottery-games__list-item__cover">
					<img v-if="item.categoryImg" v-lazy="item.categoryImg" />
					<div v-else class="lottery-games__list-item__cover-placeholder">🎲</div>
				</div>
				<div class="lottery-games__list-item__btn" @click.stop="onItemClick(item)">
					Bet Now
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHome } from '@/hooks'
import router from '@/router'
import SectionHeader from './SectionHeader.vue'

const { homeState, gol2, isAlowGame, isSassLotteryGame, openThirdGame } = useHome()

// 取彩票游戏列表（从 allGameList.lottery）
const lotteryList = computed(() => {
	const all = homeState.allGameList as any
	if (!all?.lottery) return []
	return all.lottery || []
})
const displayGames = computed(() => lotteryList.value.slice(0, 3))

// 彩票路由映射
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

// 点击前往游戏页面
const onItemClick = (item: any) => {
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
.lottery-games {
	background: #272036;
	border: 2px solid #3e2f60;
	border-radius: 15px;
	box-shadow: inset 0 2px 0 0 #2e384a, 0 4px 4px 0 rgba(0, 0, 0, 0.25);

	&__list {
		display: flex;
		gap: 20px;
		padding: 20px;

		&-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 213px;
			border-radius: 20px;
			background: linear-gradient(180deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%);
			padding: 16px 0;
			position: relative;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				inset: 0;
				border-radius: 20px;
				border: 2px solid rgba(255, 255, 255, 0.15);
				pointer-events: none;
			}

			&__name {
				font-size: 26px;
				font-weight: 400;
				color: #fff;
				text-align: center;
				text-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
				z-index: 1;
			}

			&__cover {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 8px 20px;
				z-index: 1;

				img {
					max-width: 128px;
					max-height: 84px;
					object-fit: contain;
				}

				&-placeholder {
					font-size: 60px;
				}
			}

			&__btn {
				width: 140px;
				height: 44px;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2px solid #7693f1;
				border-radius: 35px;
				background: linear-gradient(264deg, #221d2d 0.6%, #373143 98.3%);
				box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
				font-size: 22px;
				font-weight: 500;
				color: #fff;
				letter-spacing: 0.88px;
				opacity: 0.9;
				z-index: 1;
				cursor: pointer;
			}
		}
	}
}
</style>
