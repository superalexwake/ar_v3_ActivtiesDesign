<template>
	<div class="gamesList__container">
		<div class="gamesList__container-title">
			{{ title }}
		</div>

		<GameList :currentGame="gameType" :isAll="true" />
	</div>
</template>

<script setup lang="ts">
import GameList from '@/components/Home/RedHome/GameList/GameListGrid.vue'

withDefaults(
	defineProps<{
		gameData: {
			gameList: any[]
			isShow: boolean
			title: string
			img: string
			key: string
		}
		title: string
		gameType: string
	}>(),
	{}
)
</script>

<style lang="scss" scoped>
.gamesList__container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 24px;

	&-title {
		margin-top: 26px;
		display: flex;
		align-items: center;
		margin-bottom: 24px;
		color: var(--darkTextW,var(--text_color_L1));
		font-size: 30px;
		font-weight: 600;

		&::before {
			content: '';
			display: block;
			width: 6px;
			height: 30px;
			background: var(--darkLight2,var(--main-color));
			margin-right: 10px;
		}
	}

	&-list {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-items: center;
		gap: 31px 20px;

		&__item {
			width: 216px;
			min-height: 160px;
			max-height: 260px;
			background: var(--main_gradient-color2);
			border-radius: 40px;
			position: relative;

			.lottery_text {
				color: var(--textW);
				font-size: 30px;
				font-weight: 700px;
				position: absolute;
				top: 28px;
				left: 20px;
				html:lang(ar) &{
					left: unset;
					right: 20px;
				}
			}

			.item_default {
				width: 100%;
				height: 100%;
				border-radius: 40px;
				object-fit: fill !important;
			}

			.item_img {
				height: 150px;
				object-fit: cover;
				position: absolute;
				border-radius: 40px;
				left: 20px;
				html:lang(ar) &{
					left: unset;
					right: 20px;
				}
			}

			.lottery_img {
				max-width: 150px;
				height: 150px;
				object-fit: cover;
				position: absolute;
				border-radius: 40px;
				right: 20px;
			}

			.logo_img {
				position: absolute;
				top: 10px;
				right: 28px;
				width: 98px;
			}
		}
	}

	&-other {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		color: var(--text_color_L2);
		font-size: 24px;
		font-weight: 500;
		cursor: pointer;

		&__item {
			width: 100%;
			height: 200px;
		}
	}
}
</style>
