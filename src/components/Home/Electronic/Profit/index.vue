vuein
<template>
	<div class="profit">
		<div class="title">{{ $t('earningsRankingToday') }}</div>
		<div class="profit__list">
			<div v-for="(item, index) in homeState.rankList" :key="index" class="profit__list-item">
				<img class="usePhoto" v-lazy="item.userPhoto" :data-img="defaultAvatar" />
				<div class="profit__list-item__info">
					<div class="rank">
						<div class="name">{{ desensitizeString(item.nickName )}}</div>
						<div class="rank_num">
							<i class="rank_img" :class="`rank_img-${index + 1}`" v-if="index < 3" />
							<span :class="`no${index + 1}`">NO{{ index + 1 }}</span>
						</div>
					</div>
					<div class="price">{{ currency(item.price) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { currency } from '@/utils'
import { useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
const {homeState} = useHome()
const { defaultAvatar } = useAssets()

const desensitizeString = (str: string) => {
	if (str.length  >= 7) {
    return str.substring(0, 3) + '***' + str.substring(str.length - 3, str.length);
  } else {
    const stars = '***';
    const paddingLength = 7 - str.length;
    const padding = '*'.repeat(paddingLength);
    return str.substring(0, Math.ceil((7 - paddingLength) / 2)) + stars + padding + str.substring(Math.ceil((7 - paddingLength) / 2));
  }
}
</script>
<style lang="scss" scoped>
.profit {
	margin-bottom: 30px;

	.title {
		background: url('@/assets/icons/home/profit.png') no-repeat left center;
		background-size: 42px 42px;
		padding-left: 56px;
		font-size: 30px;
		margin-bottom: 26px;
		color:var(--text_color_L1)
	}

	&__list {
		background: var(--bg_color_L2);
		border-radius: 12px 12px 12px 12px;
		padding: 30px 18px;

		&-item {
			height: 115px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom: var(--Dividing-line_color);

			.usePhoto {
				width: 74px;
				height: 74px;
				border-radius: 50%;
			}

			&__info {
				width: 556px;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: 74px;

				.rank {
					.name {
						font-size: 24px;
					}

					.rank_num {
						color: #ffcb7d;
						font-size: 24px;

						.rank_img {
							width: 24px;
							height: 40px;
							display: inline-block;
							margin-right: 12px;
							vertical-align: bottom;
							background: no-repeat center / contain;
						}

						@for $i from 1 through 3 {
							.rank_img-#{$i} { background-image: url('@public/electronic/no#{$i}.png'); }
						}

						span {
							font-size: 24px;
						}

						.no1 {
							font-size: 30px;
							color: #fbae3b;
						}

						.no2 {
							font-size: 30px;
							color: #96aaaf;
						}

						.no3 {
							font-size: 30px;
							color: #f59369;
						}
					}
				}

				.price {
					color: #ffffff;
					font-size: 30px;
					text-align: right;
				}
			}
		}

		&-item:last-child {
			border-bottom: none;
		}
	}
}
</style>
