<template>
	<div class="profit-rank">
		<div class="profit-rank__content">
			<!-- 领奖台 -->
			<div class="profit-rank__podium">
				<!-- 人物信息 -->
				<div class="profit-rank__podium-people">
					<div
						class="profit-rank__podium-item"
						v-for="(item, index) in getTopThree"
						:key="index"
						:style="{
							order: index === 0 ? 2 : index === 2 ? 3 : 1
						}"
						:class="`profit-rank__podium-item--${['1st', '2nd', '3rd'][index]}`"
					>
						<!-- 头像框 -->
						<div class="profit-rank__podium-item__avatar">
							<template v-if="!isUserPhoto(item.userPhoto)">
								<img src="@public/home/avatar.png" />
							</template>
							<template v-else>
								<img v-lazy="getAvatarUrl(item.userPhoto)" :data-img="defaultAvatar" />
							</template>
						</div>
						<!-- 头像下方三角形 -->
						<div class="profit-rank__podium-item__triangle"></div>
						<span class="profit-rank__podium-item__name">
							{{ desensitizeString(item.nickName) }}
						</span>
						<div class="profit-rank__podium-item__amount">
							<img src="@icon/home/coinStack.png" class="coin-icon" />
							<span>{{ currency(item.price) }}</span>
						</div>
					</div>
				</div>
				<!-- 光圈背景 -->
				<img src="@icon/home/rankHalo.png" class="profit-rank__podium-halo" />
				<!-- 领奖台图片 -->
				<img src="@icon/home/DailyProfitRankStage.png" class="profit-rank__podium-stage" />
			</div>

			<!-- 排行列表 -->
			<div class="profit-rank__list">
				<div class="profit-rank__list-item" v-for="(item, index) in theRest" :key="index">
					<span class="profit-rank__list-item__rank">
						<img src="@icon/home/rankWreath.png" class="rank-wreath" />
						<i>{{ index + 4 }}</i>
					</span>
					<template v-if="!isUserPhoto(item.userPhoto)">
						<img src="@public/home/avatar.png" class="profit-rank__list-item__avatar" />
					</template>
					<template v-else>
						<img v-lazy="getAvatarUrl(item.userPhoto)" :data-img="defaultAvatar" class="profit-rank__list-item__avatar" />
					</template>
					<span class="profit-rank__list-item__name">{{ desensitizeString(item.nickName) }}</span>
					<span class="profit-rank__list-item__amount">{{ currency(item.price) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useHome } from '@/hooks'
import { useAssets } from '@/hooks/useAssets'
import { currency, desensitizeString, isUserPhoto } from '@/utils'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { homeState } = useHome()
const { getAvatarUrl, defaultAvatar } = useAssets()

const EmptyData = {
	nickName: t('noData'),
	userPhoto: '',
	price: 0,
	time: '',
	typeName: ''
}

const sortedList = computed(() => {
	return [...homeState.rankList].sort((a, b) => b.price - a.price)
})
const getTopThree = computed(() => {
	const list = sortedList.value.slice(0, 3)
	// 不足3个时用占位数据补齐
	while (list.length < 3) list.push({ ...EmptyData })
	return list
})
const theRest = computed(() => sortedList.value.slice(3, 10))
</script>

<style lang="scss" scoped>
.profit-rank {
	padding: 0 20px 20px;
	color: #fff;
	background: linear-gradient(
		257deg,
		rgba(138, 214, 253, 0.9) 0.97%,
		rgba(127, 160, 252, 0.9) 25%,
		rgba(148, 122, 237, 0.9) 50%,
		rgba(234, 125, 175, 0.9) 75%,
		rgba(246, 172, 151, 0.9) 100%
	);
	box-shadow: 0 0 2px 0 #2e384a inset, 0 4px 4px 0 rgba(0, 0, 0, 0.25);

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	// 领奖台
	&__podium {
		position: relative;
		width: 100%;
		padding-bottom: 220px;

		// 光圈背景 - 领奖台最底层
		&-halo {
			position: absolute;
			top: 40px;
			bottom: 0;
			left: 50%;
			width: 100%;
			display: block;
			animation: haloSpin 12s linear infinite;
		}

		// 领奖台图片 - 在光圈之上
		&-stage { 
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			top: 330px;
			display: block;
			z-index: 1;
		}

		// 人物信息层 - 在领奖台之上
		&-people {
			position: relative;
			z-index: 1;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			justify-items: center;
			width: 100%;
			padding-top: 35px;
		}

		&-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 225px;

			&--1st {
				margin-top: 0;
			}

			&--2nd {
				margin-top: 90px;
			}

				&--3rd {
					margin-top: 130px;
				}

				$rank-suffixes: '1st', '2nd', '3rd';
				@for $i from 1 through 3 {
					&--#{nth($rank-suffixes, $i)} .profit-rank__podium-item__avatar {
						background: url('@public/images/DailyProfitRank/border#{$i}.png') no-repeat center center / 100% 100%;
					}
				}

				// 头像框
				&__avatar {
				position: relative;
				display: grid;
				place-items: center;
				width: 120px;
				min-width: 120px;
				height: 120px;
				min-height: 120px;
				border-radius: 50%;
				overflow: hidden;

				& > img {
					width: calc(100% - 5px);
					height: calc(100% - 5px);
					border-radius: 50%;
				}
			}

			// 三角形 15x14
			&__triangle {
				width: 0;
				height: 0;
				border-left: 12px solid transparent;
				border-right: 12px solid transparent;
				border-top: 16px solid #f6dfff;
				margin-top: 24px;
				border-radius: 10px;
			}

			// 用户名 
			&__name {
				margin-top: 24px;
				font-size: 24px;
				width: 200px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: #fff;
				text-align: center;
			}

			// 金额 - 长方形背景
			&__amount {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				gap: 6px;
				min-width: 120px;
				height: 44px;
				margin-top: 16px;
				padding: 0 16px;
				font-size: 24px;
				text-align: center;
				border-radius: 8px;
				background: rgba(255, 255, 255, 0.2);
				color: #fff;

				.coin-icon {
					width: 30px;
					height: 30px;
					flex-shrink: 0;
				}
			}
		}
	}

	// 排行列表
	&__list {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0 16px;
		margin-top: 20px;
		background: rgba(12, 10, 26, 0.7);
		border-radius: 10px;

		&-item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 102px;
			padding: 11px 19px 11px 20px;
			background: transparent;
			border: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 0;

			&:last-child {
				border-bottom: none;
			}

			&__avatar {
				width: 70px;
				height: 70px;
				margin-right: 16px;
				border-radius: 50%;
				border: 2px solid rgba(255, 255, 255, 0.15);
				flex-shrink: 0;
			}

			&__rank {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16px;
				width: 60px;
				height: 60px;
				flex-shrink: 0;

				.rank-wreath {
					position: absolute;
					width: 100%;
					height: 100%;
					object-fit: contain;
				}

				i {
					position: relative;
					z-index: 1;
					font-style: normal;
					color: #f6e59c;
					font-family: 'Fredoka', sans-serif;
					font-size: 26px;
					font-weight: 500;
					line-height: 100%;
				}
			}

			&__name {
				color: rgba(255, 255, 255, 0.8);
				font-size: 24px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				flex: 1;
				min-width: 0;
			}

			&__amount {
				line-height: 50px;
				min-width: 200px;
				height: 50px;
				margin-left: auto;
				color: #ffcc24;
				font-size: 28px;
				font-weight: 500;
				text-align: right;
				flex-shrink: 0;
			}
		}
	}
}

@keyframes haloSpin {
	from {
		transform: translateX(-50%) rotate(0deg);
	}
	to {
		transform: translateX(-50%) rotate(360deg);
	}
}
</style>
