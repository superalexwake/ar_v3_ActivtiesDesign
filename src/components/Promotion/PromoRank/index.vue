<template>
	<div>
		<van-sticky :offset-top="50">
			<div class="rank-container">
				<div class="rank-container__header">
					<div class="rank-container__header-left">
						<div class="rank-container__header-left__title">
							<span>T</span>
							<span class="crown">
								<van-icon :name="iconPromotionCrown" />
								O
							</span>
							<span>P</span>
							<span>30</span>
						</div>
						<div class="rank-container__sub-title">
							<span>{{ $t('promotionLederboard') }}</span>
						</div>
					</div>

					<div class="rank-container__header-right">
						<span>{{ $t('statisticalDeadline') }}</span>
						<span>2022-02-07</span>
					</div>
				</div>
			</div>
		</van-sticky>

		<RankList />
	</div>
</template>

<script setup lang="ts">
import iconPromotionCrown from '@public/promotion/crown.png'

import RankList from './RankList.vue'
</script>

<style lang="scss" scoped>
.rank-container {
	position: relative;
	width: 100%;
	height: 180px;
	margin-bottom: -5px;
	padding: 38px 23px;
	font-family: 'Inter', sans-serif;
	border-radius: 10px;
	background: linear-gradient(125deg, #FF8E89 12.38%, #FFC3A2 87.13%);
	box-shadow: var(--BoxShadowColor-23);
	z-index: 2;

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		color: var(--textW);

		&-left,
		&-right {
			display: flex;
			flex-direction: column;
		}

		&-left {
			&__title {
				display: flex;
				align-items: center;
				font-size: 60px;
				font-weight: bold;
				line-height: 60px;

				.crown {
					position: relative;

					i {
						position: absolute;
						top: -20px;
						left: 50%;
						transform: translateX(-50%);
						font-size: 24px;
					}
				}
			}
		}

		&-right {
			gap: 5px;
			font-size: 24px;
		}
	}

	&__sub-title {
		font-size: 28px;
	}
}
</style>
