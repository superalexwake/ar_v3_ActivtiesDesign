<template>
	<div class="dailyProfitRank">
		<div class="title">
			<img class="title__icon" :src="rankChartIcon" alt="" />
			{{ $t('earningsRankingToday') }}
		</div>
		<div class="dailyProfitRank__content">
			<div class="dailyProfitRank__content-topThree">
				<div
					class="dailyProfitRank__content-topThree__item"
					v-for="(item, index) in getTopThree"
					:key="index"
					:class="[`rank-pos-${index}`, { 'rank-empty': !item }]"
					:style="{ order: index === 0 ? 2 : index === 2 ? 3 : 1 }"
				>
					<template v-if="item">
						<div class="badge-wrapper">
							<template v-if="!isUserPhoto(item.userPhoto)">
								<img class="avatar-img" :src="defaultAvatar" />
							</template>
							<template v-else>
								<img
									class="avatar-img"
									v-lazy="getAvatarUrl(item.userPhoto)"
									:data-img="defaultAvatar"
								/>
							</template>
						</div>
						<span class="item__name">{{ desensitizeString(item.nickName) }}</span>
						<span class="item__rank-num">{{ `0${index + 1}` }}</span>
						<span class="item__amount">{{ currency(item.price) }}</span>
					</template>
				</div>
			</div>

			<div class="rank-list-card" v-if="theRest.length > 0">
				<template v-for="(item, index) in theRest" :key="index">
					<div class="rank-list-card__item">
						<div class="rank-list-card__item-left">
							<span class="rank-num">{{ index + 4 }}</span>
							<div class="rank-list-card__item-user">
								<img v-lazy="getAvatarUrl(item.userPhoto) || defaultAvatar" />
								<span class="rank-name">{{ desensitizeString(item.nickName) }}</span>
							</div>
						</div>
						<span class="rank-amount">{{ currency(item.price) }}</span>
					</div>
					<div class="rank-divider" v-if="index < theRest.length - 1"></div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks'
import type { Home } from '@/types/api'
import { currency, desensitizeString, isUserPhoto } from '@/utils'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAssets } from '@/hooks/useAssets'
import rankChartIcon from '@icon/home/icon_rankChart.png?url'

const { defaultAvatar, getAvatarUrl } = useAssets()
const { t } = useI18n()

const { homeState } = useHome()

const emptyData: Home.DailyProfitRankProps = {
	nickName: t('noData'),
	userPhoto: '',
	price: 0,
	time: '',
	typeName: ''
}

const sortedList = computed(() => [...homeState.rankList].sort((a, b) => b.price - a.price))

const getTopThree = computed(() => {
	const list = sortedList.value.slice(0, 3)
	while (list.length < 3) {
		list.push({ ...emptyData })
	}
	return list
})

const theRest = computed(() => sortedList.value.slice(3, 10))
</script>

<style lang="scss" scoped>
.dailyProfitRank {
	color: var(--text_color_L1);


	.title {
		height: 60px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 36px;
		font-weight: 500;


		&__icon {
			width: 60px;
			height: 60px;
			flex-shrink: 0;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;

		&-topThree {
			position: relative;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			justify-items: center;
			width: 100%;
			height: 383px;
			z-index: 1;
			background: url('@/assets/public5WhiteGreen/icons/home/DailyProfitRankStage.png') no-repeat center center / 100% 100%;

			&__item {
				position: relative;
				isolation: isolate;
				display: flex;
				flex-direction: column;
				align-items: center;

				&.rank-empty {
					visibility: hidden;
					pointer-events: none;
				}
				&:nth-child(1) { left: 3px; }
				&:nth-child(2) { left: 2px; }
				&:nth-child(3) { left: 7px; }

				.badge-wrapper {
					--avatar-offset-x: 0px;
					--avatar-offset-y: 0px;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					transform: translate(var(--avatar-offset-x), var(--avatar-offset-y));

					.avatar-img {
						border-radius: 50%;
						object-fit: cover;
					}
				}

				.item__name {
					position: relative;
					z-index: 2;
					margin-top: 20px;
					margin-bottom: 28px;
					font-size: 24px;
					font-weight: 700;
					width: 200px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					text-align: center;
					color: #223935;
					padding: 0 10px;
				}

				.item__rank-num {
					position: relative;
					z-index: 2;
					font-size: 32px;
					font-weight: 700;
					text-align: center;
					line-height: 1;
					background-clip: text;
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
				}

				.item__amount {
					position: relative;
					z-index: 2;
					margin-top: 6px;
					font-size: 22px;
					text-align: center;
					padding: 0 10px;
					width: 200px;
				}

				&.rank-pos-0 {
					top: 14px;
					z-index: 3;
					.badge-wrapper {
						/* --avatar-offset-x: 2px;
						--avatar-offset-y: 12px; */
						width: 120px;
						height: 134px;
						.avatar-img { width: 70px; height: 70px; }
					}
					.item__rank-num {
						font-size: 52px;
						background-image: linear-gradient(180deg, #0cd781 17%, rgba(12, 215, 129, 0.1) 74%);
					}
					.item__amount { color: #0cd781; }
				}

				&.rank-pos-1 {
					top: 123px;
					z-index: 1;
					.badge-wrapper {
						/* --avatar-offset-x: 5px;
						--avatar-offset-y: 6px; */
						width: 84px;
						height: 94px;
						.avatar-img { width: 50px; height: 50px; }
					}
					.item__name { margin-top: 5px; margin-bottom: 28px; }
					.item__rank-num {
						background-image: linear-gradient(180deg, rgba(89, 153, 255, 0.8) 26%, rgba(62, 129, 255, 0.27) 61%, rgba(33, 100, 255, 0) 75%);
					}
					.item__amount { color: #3388ff; }
				}

				&.rank-pos-2 {
					top: 157px;
					z-index: 2;
					.badge-wrapper {
						--avatar-offset-x: -9px;
						--avatar-offset-y: 10px;
						width: 84px;
						height: 94px;
						.avatar-img { width: 50px; height: 50px; }
					}
					.item__name { margin-top: 5px; margin-bottom: 28px; }
					.item__rank-num {
						background-image: linear-gradient(180deg, rgba(255, 106, 89, 0.8) 26%, rgba(255, 94, 62, 0.27) 61%, rgba(255, 59, 33, 0) 75%);
					}
					.item__amount { color: #ff5533; }
				}
			}
		}
	}
}

.rank-list-card {
	width: 100%;
	background: linear-gradient(180deg, var(--win-row-bg-from) 0%, var(--win-row-bg-to) 100%);
	border: 2px solid var(--win-row-border);
	border-radius: 24px;
	padding: 32px 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;

	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__item-left {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	&__item-user {
		display: flex;
		align-items: center;
		gap: 12px;

		img {
			width: 64px;
			height: 64px;
			border-radius: 50%;
			flex-shrink: 0;
		}
	}

	.rank-num {
		font-size: 24px;
		font-weight: 700;
		color: var(--main-color);
		min-width: 28px;
		text-align: center;
	}

	.rank-name {
		font-size: 24px;
		color: var(--text_color_L1);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px;
	}

	.rank-amount {
		font-size: 24px;
		color: var(--main-color);
		font-weight: 500;
	}

	.rank-divider {
		height: 2px;
		background: var(--Dividing-line_color);
	}
}
</style>
