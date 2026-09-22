<template>
	<div class="pointMall-rule__container content">
		<NavBar :title="$t('pointsRule')" left-arrow @click-left="onClick" />
		<!-- <div class="pointMall-rule__container-claimRule">
			<div class="pointMall-rule__container-claimRule__title">1.{{ $t('claimPoints') }}</div>
			<div class="pointMall-rule__container-claimRule__body">
				<div>{{ $t('descRules1') }}</div>
				<div>
					<p>{{ $t('inviteFriends') }}</p>
					<p>{{ $t('earnPoints') }}</p>
				</div>
				<div @click="router.push({ path: '/main/InvitationBonus' })">
					<span> {{ $t('toClaim') }} </span>
					<van-icon name="upgrade" />
				</div>
			</div>
		</div> -->

		<div class="pointMall-rule__container-pointRule">
			<div class="pointMall-rule__container-pointRule__title">{{ $t('bonusPoints') }}</div>
			<div class="pointMall-rule__container-pointRule__body">
				<div>{{ $t('descRules2') }}</div>
				<div>
					<div v-for="(item, index) in pointRule" :key="index">
						<p>{{ item.title }}</p>
						<li v-for="subItem in item.body" :key="subItem">{{ subItem }}</li>
					</div>
				</div>
				<div @click="toBet()" >
					<span class="toBet"> {{ $t('goBetting') }} </span>
					<van-icon name="upgrade" color="#D23838"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {AwaitApiResult} from '@/utils'
import {GetProductRules} from '@/api'
import {onMounted, reactive} from 'vue'
import type {ProductRules} from '@/types/api'

const { t: $t } = useI18n()

const router = useRouter()

const pointRule = reactive<{ title: string; body: string[] }[]>([
	{
		title: $t('betAmounts'),
		body: []
	},
	{
		title: $t('rewordPercent'),
		body: []
	}
])

/**
 * @description: 获取积分规则信息
 * @return {*}
 */
const getProductRules = async () => {
	const res = await AwaitApiResult(GetProductRules())
	if (res) {
		const list: ProductRules[] = res.data
		console.log(res)
		list.map((item) => {
			pointRule[0].body.push(item.lotteryAmount + '')
			pointRule[1].body.push((item.exchange_Rate * 1000 * 100) / 1000 + '%')
			return item
		})
	}
}

onMounted(() => {
	getProductRules()
})

function onClick() {
	router.back()
}

const toBet = () => {
	sessionStorage.setItem('clickedGameType', 'lottery')
	router.push({ path: '/' })
}
</script>

<style lang="scss" scoped>
.pointMall-rule__container {
	font-family: $font-family;

	:deep(.van-nav-bar) {
		background-color: var(--bg_color_L2);

		.van-nav-bar__content {
			.van-nav-bar__left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}

			.van-nav-bar__title {
				color: var(--text_color_L1);
			}
		}
	}

	&-claimRule,
	&-pointRule {
    margin-top: 24px;
		&__title {
			height: 70px;
			padding: 16px 20px;
			color: var(--text_white, var(--text_color_L1));
			font-size: 32px;
			line-height: 70px-16px * 2;
			background: var(--light-main-color,var(--bg_color_L3));
			clip-path: polygon(0 0, 65% 0%, 60% 100%, 0% 100%);
		}

		&__body {
			display: flex;
			flex-direction: column;
			gap: 30px;
			padding: 30px 22px 23px;
			border-radius: 10px;
			background: var(--darkBg,var(--bg_color_L2));
			

			& > div {
				&:first-of-type {
					color: var(--text_color_L2);
					font-size: 26px;
				}

				&:last-of-type {
					display: flex;
					align-items: center;
					gap: 14px;
					color: var(--main-color);
					font-size: 30px;

					i {
						font-size: 32px;
						transform: rotate(90deg);
					}
				}
			}
		}
	}

	&-claimRule {
		margin-bottom: 1rem;

		&__body {
			div {
				&:nth-of-type(2) {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
					height: 140px;
					padding: 34px 0;
					padding-left: 9rem;
					color: var(--text_color_L1);
					font-size: 32px;
					border-radius: 10px;
					background: url('@/assets/icons/activity/PointMall/claimRuleBg.png') no-repeat center;
					background-color: var(--main-color);
					background-position-x: 10px;
					background-size: cover;
				}
			}
		}
	}

	&-pointRule {
		&__body {
			& > div {
				&:nth-of-type(2) {
					display: flex;
					width: 100%;
					min-height: 370px;
					border-radius: 10px;
					overflow: hidden;

					& > div {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						color: var(--text_color_L1);
						p,
						li {
							width: 100%;
							font-size: 28px;
							text-align: center;
						}
						p,li:nth-of-type(even) {
							background: var(--sheet_detail_bg_color);
						}
						p,li:nth-of-type(odd) {
							background: var(--bg_color_L2);
						}

						p {
							height: 70px;
							line-height: 70px;
							background: var(--light-main-color, var(--bg_color_L3));
							color: var(--text_white, var(--text_color_L1));
						}

						li {
							height: 61px;
							line-height: 61px;
							list-style: none;
							background: var(--sheet_detail_bg_color);
							color: var(--darkTextW,var(--text_color_L2));
							border-bottom: 1px solid var(--bgDark-2,var(--sheet_detail_bg_color));
							&:last-of-type {
								border-bottom: none;
							}
						}
					}
				}
			}
		}
	}
	.toBet {
		color: var(--darkLight,var(--norm_red-color));
	}
}
</style>
