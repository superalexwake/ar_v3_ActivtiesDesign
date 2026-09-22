<template>
	<div class="featured-game" v-if="gameData">
		<div class="featured-game__card">
			<!-- 左侧游戏封面 -->
			<div class="featured-game__cover">
				<img :src="gameData.img" alt="" class="featured-game__cover-img" />
			</div>
			<!-- 右侧信息区 -->
			<div class="featured-game__info">
				<h3 class="featured-game__info-name">{{ gameData.gameNameEn }}</h3>

				<div class="featured-game__info-row">
					<span class="featured-game__info-row__stars">★★★★★</span>
					<span class="featured-game__info-row__tag">5.0 | Score</span>
				</div>

				<div class="featured-game__info-row">
					<span class="featured-game__info-row__label">Slot Game</span>
					<span class="featured-game__info-row__tag">#01 | Rank</span>
				</div>

				<div class="featured-game__info-row">
					<span class="featured-game__info-row__label">300K Winner</span>
					<span class="featured-game__info-row__tag">1500x | Max Win</span>
				</div>

				<button class="purple-gradient-btn featured-game__info-btn" @click="onPlay">{{ $t('playNow') }}</button>
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
.featured-game {
	background: #272036;
	border: 2px solid #3e2f60;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: inset 0 2px 0 0 #2e384a, 0 4px 4px 0 rgba(0, 0, 0, 0.25);

	&__card {
		display: flex;
		gap: 16px;
		padding: 24px;
	}

	&__cover {
		flex-shrink: 0;
		width: 280px;
		height: 320px;
		border-radius: 14px;
		overflow: hidden;

		&-img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&__info {
		flex: 1;
		display: flex !important;
		flex-direction: column;
		justify-content: center;
		gap: 14px;

		&-name {
			font-size: 30px;
			font-weight: 600;
			color: #fff;
			margin: 0;
			line-height: 1.2;
			text-align: center;
		}

		&-row {
			text-align: center;
			gap: 12px;

			&__stars {
				font-size: 22px;
				color: #ffc874;
				letter-spacing: 2px;
			}

			&__label {
				font-size: 23px;
				font-family: 'Fredoka', sans-serif;
				color: #FFC874;
				white-space: nowrap;
			}

			&__tag {
				display: inline-flex;
				align-items: center;
				height: 40px;
				padding: 0 16px;
				border: 1px solid rgba(255, 255, 255, 0.25);
				border-radius: 20px;
				font-size: 20px;
				color: rgba(255, 255, 255, 0.8);
				white-space: nowrap;
				margin-left: 10px;
			}
		}

		&-btn {
			margin-top: 6px;
			width: 100%;
			height: 72px;
			font-size: 28px;
			font-weight: 600;
			cursor: pointer;
		}
	}
}
</style>
