<template>
	<div class="dailyProfitRank">
		<div class="title"></div>
		<div class="dailyProfitRank__content">
			<div class="dailyProfitRank__content-topThree">
				<div
					class="dailyProfitRank__content-topThree__item"
					v-for="(item, index) in getTopThree"
					:key="index"
					:style="{
						order: index === 0 ? 2 : index === 2 ? 3 : 1,
						top: index === 0 ? '0' : '30px'
					}"
				>
					<div class="avat_icon" :class="{firstIcon:index === 0}" >
						<template v-if="!isUserPhoto(item.userPhoto)">
							<img src="@public/home/avatar.png"  />
						</template>
						<template v-else>
							<img v-lazy="getAvatarUrl(item.userPhoto)" :data-img="defaultAvatar" />
						</template>
					</div>
					<span>
						{{ desensitizeString(item.nickName) }}
					</span>
					<span>
						{{ currency(item.price) }}
					</span>
				</div>
			</div>
			<div class="dailyProfitRank__content-list">
				<div class="dailyProfitRank__content-list__item" :class="`itemW-${index}`" v-for="(item, index) in theRest" :key="index">
					<span class="left-rank">{{ index + 4 }}</span>
					<template v-if="!isUserPhoto(item.userPhoto)">
						<img src="@public/home/avatar.png"  />
					</template>
					<template v-else>
						<img v-lazy="getAvatarUrl(item.userPhoto)" :data-img="defaultAvatar" />
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
import { useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
import type { Home } from '@/types/api'
import { currency, desensitizeString, isUserPhoto } from '@/utils'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { defaultAvatar, getAvatarUrl } = useAssets()
const { t } = useI18n()

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
	margin-top: 40px;
	.title {
		width: 426px;
		margin: 0 auto 28px;
		height: 109px;
		background-repeat: no-repeat;
		background-size: 426px auto;
		background-position: center center;
		background-image: url(./svg/playesBg.svg);
		position: relative;
		text-align: center;
		padding-top:12px;
		span{
			color: #FFF;
			font-family: "Climate Crisis";
			font-size: 30px;
			font-style: normal;
			font-weight: 900;
			line-height: 105%; /* 30.45px */
			letter-spacing: 2.03px;
			display: inline-block;
			width: 300px;
			text-align: center;
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
			width: 592px;
			height: 303px;
			z-index: 1;
			background: url('./svg/rank_icon.svg') no-repeat center center;
			background-size:592px 303px;
			margin-bottom: 20px;
			&__item {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 180px;
				height: 260px;

				&:nth-child(2) {
					right: 8px;
				}

				&:nth-child(3) {
					left: 12px;
					.avat_icon {
						box-shadow: 0px 4px 4px 0px rgba(0, 221, 255, 0.47);
					}
					:last-child{
						color:#FFEA00;
					}
				}
				.avat_icon {
					width: 83px;
					height: 83px;
					margin:68px 0 50px;
					box-shadow: 0 4px 4px 0 rgba(255, 242, 0, 0.46);
					flex-shrink: 0;
					aspect-ratio: 1/1;
					overflow: hidden;
					border-radius: 100px;
					>img{
						width:100%;
						height: 100%;
					}
					&.firstIcon{
						width: 123px;
						height: 123px;
						flex-shrink: 0;
						aspect-ratio: 1/1;
						border-radius: 96px;
						box-shadow: 0 4px 9px 0px rgba(0, 255, 212, 0.72);
						overflow: hidden;
					}
				}

				& > span {
					color: #fff;
					padding: 0 10px;
					text-align: center;

					&:first-of-type {
						color: #FFF;
						font-family: Geologica;
						font-size: 19px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}

					&:last-of-type {
						color: #00FFB7;
						font-family: Geologica;
						font-size: 19px;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
					}
				}
			}
		}

		&-list {
			position: relative;
			z-index: 2;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			height: 666px;
			background: url('./svg/rankBg.svg') left top no-repeat;
			padding:5px 0 217px;
			background-size: contain;
			&__item {
				display: flex;
				align-items: center;
				width: 630px;
				height: 55px;
				padding: 4px 19px 4px 33px;
				background: #4E0814;
				border-radius: 10px;
				margin-bottom: 10px;
				&.itemW-0, &.itemW-5, &.itemW-6{
					width:642px;
				}
				span {
					&.left-rank {
						margin-right: 16px;
						color: var(--text_color_L2);
						font-size: 36px;
						font-weight: 500;
						width:42px;
					}

					&.middle-name {
						color: var(--text_color_L1);
						font-size: 24px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						width: 200px;
					}

					&.right-box {
						width: 260px;
						height: 42px;
						margin-left: auto;
						text-align: center;
						color: #FF0062;
						font-size: 19px;
						font-style: normal;
						font-weight: 400;
						line-height: 42px;
					}
				}

				img {
					width: 42px;
					height: 42px;
					margin-right: 13px;
					border-radius: 50%;
				}
			}
		}
	}
}
</style>
