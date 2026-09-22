<template>
	<div class="featured-game-wrapper" v-if="gameData">
		<div class="featured-game__glow"></div>
		<div class="featured-game">
			<div class="featured-game__card">
			<!-- 左侧游戏封面 -->
			<div class="featured-game__cover">
				<img :src="gameData.img" alt="" class="featured-game__cover-img" />
			</div>
			<!-- 右侧信息区 -->
			<div class="featured-game__info">
				<h3 class="featured-game__info-name">{{ gameData.gameNameEn }}</h3>

				<div class="featured-game__info-stats">
					<div class="featured-game__info-stat">
						<span class="featured-game__info-stat__label">Rank</span>
						<span class="featured-game__info-stat__value featured-game__info-stat__value--rank">#01</span>
					</div>
					<div class="featured-game__info-stat">
						<span class="featured-game__info-stat__label">RTP</span>
						<span class="featured-game__info-stat__value featured-game__info-stat__value--rtp">98.21%</span>
					</div>
					<div class="featured-game__info-stat">
						<span class="featured-game__info-stat__label">Score</span>
						<span class="featured-game__info-stat__value featured-game__info-stat__value--score">★★★★★</span>
					</div>
				</div>

				<button class="featured-game__info-btn" @click="onPlay">
					{{ $t('playNow') }} <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2"/><polygon points="10,7 10,17 17,12" fill="currentColor"/></svg>
				</button>
			</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks'

const props = defineProps<{
	gameData?: {
		gameID: string
		gameNameEn: string
		img: string
		vendorCode: string
		vendorId: number
	}
}>()

const { onItemClick } = useHome()

const onPlay = () => {
	if (!props.gameData) return
	onItemClick({
		gameID: props.gameData.gameID,
		vendorCode: props.gameData.vendorCode,
		vendorId: props.gameData.vendorId,
	})
}
</script>

<style lang="scss" scoped>
.featured-game-wrapper {
	position: relative;
}

.featured-game {
	position: relative;
	z-index: 1;
	border-radius: 16px;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.00) 100%);
	box-shadow: 0 4px 12px 0 rgba(108, 188, 231, 0.25);

	&__glow {
		position: absolute;
		bottom: -160px;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 750px;
		height: 440px;
		border-radius: 800px;
		opacity: 0.2;
		background: linear-gradient(246deg, #3E8FFF 18.68%, #63E8FF 49.62%);
		filter: blur(117px);
		pointer-events: none;
	}
	&__card {
		display: flex;
		gap: 20px;
		padding: 20px;
	}

	&__cover {
		flex-shrink: 0;
		width: 200px;
		height: 200px;
		border-radius: 16px;
		overflow: hidden;

		&-img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&__info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;

		&-name {
			font-size: 28px;
			font-weight: 500;
			color: var(--text_color_L1);
			margin: 0;
			line-height: 1.3;
		}

		&-stats {
			display: flex;
			justify-content: space-between;
		}

		&-stat {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 6px;
			flex: 1;

			&__label {
				font-size: 22px;
				color: var(--text_color_L2);
			}

			&__value {
				font-size: 22px;
				font-weight: 600;

				&--rank {
					color: var(--norm_Orange_color);
				}

				&--rtp {
					color: var(--norm_Orange_color);
				}

				&--score {
					color: var(--norm_Orange_color);
					font-size: 20px;
					letter-spacing: 2px;
				}
			}
		}

		&-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 6px;
			width: 100%;
			height: 60px;
			background: linear-gradient(180deg, #36FFBB 0%, #488FFD 100%);
			border: none;
			border-radius: 30px;
			font-size: 24px;
			font-weight: 600;
			color: var(--text_color_L4);
			cursor: pointer;
		}
	}
}
</style>
