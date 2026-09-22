<template>
	<div class="recommended-games">
		<SectionHeader :title="t('popularTitle')" />
		<div class="recommended-games__list">
			<div
				class="recommended-games__list-item"
				v-for="(item, index) in displayGames"
				:key="index"
				@click="openThirdGame(item)"
			>
				<img v-if="item.imgUrl" v-lazy="item.imgUrl" class="recommended-games__list-item__cover" />
				<div v-else class="recommended-games__list-item__cover recommended-games__list-item__cover--placeholder"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'
import SectionHeader from './SectionHeader.vue'

const { t } = useI18n()
const { homeState, openThirdGame } = useHome()

// 取推荐游戏列表（popular.platformList）
const gameList = computed(() => {
	const all = homeState.allGameList as any
	if (!all?.popular) return []
	return all.popular.clicksTopList || []
})
const displayGames = computed(() => gameList.value.slice(0, 6))
</script>

<style lang="scss" scoped>
.recommended-games {
	background: #272036;
	border: 2px solid #3e2f60;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: inset 0 2px 0 0 #2e384a, 0 4px 4px 0 rgba(0, 0, 0, 0.25);

	&__list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 17px;
		padding: 20px;

		&-item {
			position: relative;
			border: 2px solid #4d6776;
			border-radius: 14px;
			overflow: hidden;
			aspect-ratio: 37 / 50;

			&__cover {
				width: 100%;
				height: 100%;
				object-fit: cover;

				&--placeholder {
					background: linear-gradient(135deg, #3b1f6e, #6366f1);
				}
			}

		}
	}
}
</style>
