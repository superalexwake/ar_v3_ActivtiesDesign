<template>
	<div class="dailyProfitRank">
		<div class="title">
			<img src="@public/home/okwinHome/rank_icon.png" alt="">
			{{ $t('earningsRankingToday') }}
		</div>
		<div class="dailyProfitRank__content">
			<div class="dailyProfitRank__content-topThree">
				<div
					class="dailyProfitRank__content-topThree__item"
					v-for="(item, index) in getTopThree"
					:key="index"
					:style="{
						order: index === 0 ? 2 : index === 2 ? 3 : 1,
						top: index === 0 ? '-112px' : index === 1 ? '-80px' : '-62px'
					}"
				>
					<span class="price">
						{{ currency(item.price) }}
					</span>
					<div class="nick_name">
						<img v-lazy="getOkwinCrownUrl(index + 1)"/>
						{{ desensitizeString(item.nickName) }}
					</div>

					<div class="userPhoto" :class="{smallPhoto: index !== 0}">
						<img
							v-lazy="getAvatarUrl(item.userPhoto)"
							 :data-img="defaultAvatar" />
					</div>

				</div>
			</div>
			<div class="dailyProfitRank__content-list">
				<div class="dailyProfitRank__content-list__item" v-for="(item, index) in theRest" :key="index">
					<span class="left-rank">{{ index + 4 }}</span>
					<template v-if="!isUserPhoto(item.userPhoto)">
						<img src="@public/home/avatar.png"  />
					</template>
					<template v-else>
						<img v-lazy="getAvatarUrl(item.userPhoto)"
							 :data-img="defaultAvatar"/>
					</template>
					<span class="middle-name">{{ desensitizeString(item.nickName) }}</span>
					<!-- <span class="middle-name">{{ formatString(item.nickName, 10) }}</span> -->
					<span class="right-box">{{ currency(item.price) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {useHome} from '@/hooks'
import type {Home} from '@/types/api'
import { currency, desensitizeString, isUserPhoto } from '@/utils'
import { useAssets } from '@/hooks/useAssets'
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'

const { getOkwinCrownUrl, getAvatarUrl, defaultAvatar } = useAssets()

const {t} = useI18n()

const {homeState} = useHome()

const EmptyData = {
	nickName: t('noData'),
	userPhoto: '',
	price: 0,
	time: '',
	typeName: ''
} as const

// 中奖信息处理
watch(
	() => homeState.rankList,
	(newVal) => {
		getTopThree.value.splice(0, newVal.length, ...newVal.sort((a, b) => b.price - a.price).slice(0, 3))
		theRest.value.splice(0, newVal.length, ...newVal.sort((a, b) => b.price - a.price).slice(3, 10))
	}
)

const getTopThree = ref([EmptyData, EmptyData, EmptyData] as Home.DailyProfitRankProps[])

const theRest = ref([] as Home.DailyProfitRankProps[])
</script>

<style lang="scss" scoped>
.dailyProfitRank {
	color: var(--text_color_L1);
	//margin-bottom: 68px;
	height: calc(100vh);
	.title {
		height: 64px;
		display: flex;
		align-items: center;
		margin-bottom: 120px;

		img {
			width: 54.414px;
			height: 48px;
			margin-right: 15px;
		}

		color: #1E2637;
		font-size: 32px;
		font-weight: 700;
	}

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 102px;
		position: relative;

		&-topThree {
			position: relative;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			justify-items: center;
			width: 100%;
			height: 504px;
			z-index: 1;
			background: url('@/assets/icons/home/okwinHome/DailyProfitRankStage.png') no-repeat center center / 100% 100%;

			&__item {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 225px;
				height: 260px;

				&:nth-child(2) {
					right: 0px;
				}

				&:nth-child(3) {
					left: 0px;
				}



				.price {
					color: #fff;
					width: 250px;
					height: 50px;
					padding: 13px 14px;
					font-size: 24px;
					line-height: 24px;
					text-align: center;
					border-radius: 40px;
					background: linear-gradient(90deg, #FF8E8A 15.38%, #FFBFA1 100%);
				}

				.nick_name {
					display: flex;
					align-items: center;
					color: #1E2637;
					padding: 0 10px;
					font-size: 24px;
					width: 214px;
					height: 56px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					img {
						width: 56px;
						height: 56px;
					}
				}
				.userPhoto > img {
					width: 112px;
					height: 112px;
					border-radius:50%;
				}
				.smallPhoto>img {
					width: 80px;
					height: 80px;
				}
			}
		}

		&-list {
			position: absolute;
			top: 300px;
			left: 0;
			z-index: 2;
			padding:40px 26px;
			display: flex;
			flex-direction: column;
			gap: 40px;
			width: 100%;
			max-height: 880px;
			border-radius: 16px;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.49) 0%, rgba(255, 255, 255, 0.70) 100%);
			box-shadow: 0px 4px 16px 0px rgba(208, 208, 237, 0.36), 0px 2px 0px 0px #FFF inset;

			&__item {
				position: relative;
				z-index: 3;
				display: flex;
				align-items: center;
				width: 100%;
				height: 102px;
				span {
					&.left-rank {
						margin-right: 31px;
						color: #9EA3AD;
						font-size: 36px;
						font-weight: 500;
					}

					&.middle-name {
						color:#1E2637;
						font-size: 24px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 200px;
					}

					&.right-box {
						line-height: 50px;
						width: 260px;
						height: 50px;
						margin-left: auto;
						color: #fff;
						font-size: 30px;
						text-align: center;
						border-radius: 40px;
						background: linear-gradient(90deg, #FF8E8A 15.38%, #FFBFA1 100%);
					}
				}

				img {
					width: 80px;
					height: 80px;
					margin-right: 13px;
					border-radius: 50%;
				}
			}
		}
	}
}
</style>
