<template>
	<div class="dailyProfitRank">
		<div class="title">{{ $t('earningsRankingToday') }}</div>
		<div class="driver"></div>
		<div class="rank_list">
			<div class="daily_item" v-for="(item, index) in rankList" :key="item.nickName">
				<div class="left">
					<div class="avatar_img" :class="index < 3 ? `avatar_img${index + 1}` : ''">
						<template v-if="!isUserPhoto(item.userPhoto)">
							<img src="@public/home/avatar.png"  />
						</template>
						<template v-else>
							<img v-lazy="getAvatarUrl(item.userPhoto)" :data-img="iconHomeAvatar" />
						</template>
					</div>
					<div class="info">
						<div class="tit">{{ desensitizeString(item.nickName)}}</div>
						<div class="ranking" :class="index < 3 ? `ranking${index + 1}` : ''">NO.{{ index + 1 }}</div>
					</div>
				</div>
				<div class="amount">{{currency(item.price)}}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import iconHomeAvatar from '@public/home/avatar.png'
import {useHome} from '@/hooks';
import { currency, desensitizeString, isUserPhoto } from '@/utils'
import {computed, onMounted} from 'vue'
import { useAssets } from '@/hooks/useAssets'

const { getAvatarUrl } = useAssets()
const {homeState, getWinInfoDetail} = useHome()
const rankList = computed(() => homeState.rankList)

onMounted(async() => {
	await getWinInfoDetail()
})

</script>

<style lang="scss" scoped>
.dailyProfitRank {
	.title {
		color: #171717;
		text-align: center;
		font-size: 30px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		margin-bottom: 36px;
	}
	.driver {
		width: 100%;
		height: 3px;
		position: relative;
		background-color: #FB716C;
		margin-bottom: 30px;
	}
	.driver::before,
	.driver::after {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #FB716C;
	}

	.driver::before {
		left: -8px;
		top: -8px;
		html:lang(ar) &{
			left: unset;
			right: -8px;
		}
	}

	.driver::after {
		right: -8px;
		top: -8px;
		html:lang(ar) &{
			left: -8px;
			right: unset;
		}
	}

	.rank_list {
		padding: 0 20px;
		border-radius: 30px;
		background-color: var(--bg_color_L2);
		.daily_item {
			display: flex;
			flex-direction: row;
			height: 120px;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #ECEEF6;
			.amount {
				color: #171717;
				text-align: right;
				font-size: 30px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
			.left {
				display: flex;
				flex-direction: row;
				align-items: center;
				.avatar_img {
					border: 2px solid transparent;
					background-clip: padding-box, border-box;
					background-origin: padding-box, border-box;
					background-image: linear-gradient(to right, #F0F0F5, #F0F0F5), linear-gradient(to bottom, #FFD89D, #B9730C);
					// border-image: linear-gradient(to bottom, #FFD89D, #B9730C) 1;
					border-radius: 50%;
					width: 74px;
					height: 74px;
					margin-right: 24px;
					img {
						margin-top: 1px;
						width: 70px;
						height: 70px;
						border-radius: 50%;
					}
				}
				.avatar_img1 {
					background-image: linear-gradient(to right, #F0F0F5, #F0F0F5), linear-gradient(to bottom, #FFD89D, #B9730C);
				}
				.avatar_img2 {
					background-image: linear-gradient(to right, #F0F0F5, #F0F0F5), linear-gradient(to bottom, #E7ECED, #237286);
				}
				.avatar_img3 {
					background-image: linear-gradient(to right, #F0F0F5, #F0F0F5), linear-gradient(to bottom, #FECAB3, #D05824);
				}
				.info {
					.tit {
						color: #171717;
						font-size: 24px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						margin-bottom: 6px;
					}
					.ranking {
						color: #707070;
						font-size: 24px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}
					.ranking1, .ranking2, .ranking3 {
						font-size: 30px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						padding-left: 36px;
					}
					.ranking1 {
						color: #FBAE3B;
						background: url('@/assets/icons/home/icons/top1.png') no-repeat left center;
						background-size: 24px 100%;
					}
					.ranking2 {
						color: #508E9E;
						background: url('@/assets/icons/home/icons/top2.png') no-repeat left center;
						background-size: 24px 100%;
					}
					.ranking3 {
						color: #F59369;
						background: url('@/assets/icons/home/icons/top3.png') no-repeat left center;
						background-size: 24px 100%;
					}
				}
			}
		}
		.daily_item:last-child {
			border-bottom: none;
		}
		.daily_item1 {

		}
	}
}
</style>
