<template>
	<div class="featured-games" v-if="gameList.length">
		<div class="featured-games__header">
			<span class="featured-games__header-title">Featured Games</span>
			<div class="featured-games__header-right">
				<button class="featured-games__header-seeall" @click="gol2('popular')">See All</button>
				<div class="featured-games__header-arrows">
					<div
						class="featured-games__header-arrow"
						:class="{ disabled: isBeginning }"
						@click="swiperInstance?.slidePrev()"
					>
						<svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</div>
					<div
						class="featured-games__header-arrow"
						:class="{ disabled: isEnd }"
						@click="swiperInstance?.slideNext()"
					>
						<svg viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</div>
				</div>
			</div>
		</div>
		<Swiper
			:slides-per-view="3"
			:slides-per-group="3"
			:space-between="16"
			@swiper="onSwiper"
			@slideChange="onSlideChange"
		>
			<SwiperSlide v-for="(item, index) in gameList" :key="index">
				<div class="featured-games__item" @click="openThirdGame(item)">
					<div class="featured-games__item-cover">
						<img v-if="item.imgUrl" v-lazy="item.imgUrl" />
						<div v-else class="featured-games__item-cover__placeholder"></div>
					</div>
				</div>
			</SwiperSlide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { useHome } from '@/hooks'
import type { Swiper as SwiperType } from 'swiper'

const { homeState, openThirdGame, gol2 } = useHome()

const gameList = computed(() => {
	const all = homeState.allGameList as any
	if (!all?.popular) return []
	return all.popular.clicksTopList || []
})

const swiperInstance = ref<SwiperType>()
const isBeginning = ref(true)
const isEnd = ref(false)

const onSwiper = (swiper: SwiperType) => {
	swiperInstance.value = swiper
	isBeginning.value = swiper.isBeginning
	isEnd.value = swiper.isEnd
}

const onSlideChange = (swiper: SwiperType) => {
	isBeginning.value = swiper.isBeginning
	isEnd.value = swiper.isEnd
}
</script>

<style lang="scss" scoped>
.featured-games {
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;

		&-title {
			font-size: 30px;
			font-weight: 700;
			color: var(--text_color_L1);
		}

		&-right {
			display: flex;
			align-items: center;
			gap: 20px;
		}

		&-seeall {
			font-size: 22px;
			font-weight: 500;
			color: var(--text_color_L2);
			border: 1px solid var(--Dividing-line_color);
			border-radius: 28px;
			padding: 6px 20px;
			cursor: pointer;
			border-radius: 8px;
			background: #D9ECFA;
		}

		&-arrows {
			display: flex;
			gap: 8px;
		}

		&-arrow {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			background: var(--main-color);

			svg {
				width: 30px;
				height: 30px;
				color: var(--text_color_L4);
			}

			&.disabled {
				background: rgba(217, 236, 250, 1);
				cursor: default;

				svg {
					color: rgba(157, 186, 214, 1);
				}
			}
		}
	}

	&__item {
		cursor: pointer;

		&-cover {
			width: 100%;
			aspect-ratio: 3 / 4;
			border-radius: 16px;
			overflow: hidden;

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
