<template>
	<NavBar class="white" :title="$t('titlePromotion')">
		<template #right>
			<svg-icon name="subordinate" @click="onToSubordinate" />
		</template>
	</NavBar>
	<HeroSection v-if="isLoggedIn && promotionData" :promotion="promotionData"></HeroSection>
	<template v-else>
		<section class="promotionGuest">
			<div class="promotionGuest__content">
				<div class="promotionGuest__icon">
					<svg-icon name="team_partner" />
				</div>
				<div class="promotionGuest__title">{{ $t('promotionGuestTitle') }}</div>
				<p class="promotionGuest__desc">{{ $t('promotionGuestDesc') }}</p>
				<button type="button" class="promotionGuest__action" @click="onGuestLoginClick">
					{{ $t('promotionGuestAction') }}
					<van-icon name="arrow" size="22" />
				</button>
			</div>
		</section>
		<!-- 登录前平铺展示邀请规则 -->
		<RuleContent />
	</template>

	<div v-if="isLoggedIn" class="content">
		<div class="shareBtnContainer">
			<button class="shareBtn" @click="onShareBtnClick">{{ $t('invitationLink') }}</button>
		</div>
		<div class="promote__cell">
			<div v-for="item in cellList" class="promote__cell-item" @click="handleClickCell(item)">
				<div class="label">
					<svg-icon :name = "(`${item.name}`)" />
					<span>{{ item.title }}</span>
				</div>
				<div class="arrow">
					<span v-if="item.name === 'copy_Code' && isLoggedIn" @click.stop="handleCopyCode">{{ promotionData?.mycode }}
						<svg-icon name="copy"/>
					</span>
					<van-icon v-else name="arrow" size="24" color="var(--text_color_L1)" />
				</div>
			</div>
		</div>

		<div v-if="isLoggedIn" v-haspermission="20" class="commission">
			<div class="commission__title">
				<svg-icon name="promotionData" />
				<span>{{ $t('promotionData') }}</span>
			</div>
			<div class="commission__body">
				<div>
					<span>{{ promotionData?.children_Lv_RebateAmount_Week }}</span>
					<span>{{ $t('directGrossCommission') }}</span>
				</div>
				<!--因越南代理需求，临时处理下这个问题，周一再统一处理-->
				<span></span>
				<div>
					<span>{{ promotionData?.children_Lv_RebateAmount }}</span>
					<span>{{ $t('teamGrossCommission') }}</span>
				</div>
			</div>

			<div class="commission__body">
				<div>
					<span>{{ promotionData?.children_Lv_1_Count }}</span>
					<span>{{ $t('directSubordinate') }}</span>
				</div>
				<!--因越南代理需求，临时处理下这个问题，周一再统一处理-->
				<span></span>
				<div>
					<span>{{ promotionData?.children_Lv_Count_X }}</span>
					<span>{{ $t('totalsubordinates') }}</span>
				</div>
			</div>
		</div>
		<!-- <PromoRank /> -->
	</div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/Promotion/HeroSection/index.vue'
import RuleContent from '@/components/Promotion/RuleContent/index.vue'
import { useRouter } from 'vue-router'
import { fixMsg, copy } from '@/utils'
import {getPromotion} from '@/api'
import type { PromotionData } from '@/types/api'
import {computed, ref} from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useKeepPage } from '@/hooks/useKeepPage'
import { pushWithLoginIntercept, requireLoginAction } from '@/hooks/useLoginIntercept'
import {GlobalStore, SettingStore} from "@/stores";
useKeepPage(['TeamReport'])

const { t: $t } = useI18n()
const globalStore = GlobalStore()
const userInfo = globalStore.getUserInfo as UserInfo
const router = useRouter()
const loading = ref(false)
const store=SettingStore()
const isLoggedIn = computed(() => Boolean(globalStore.token))
const PUBLIC_PROMOTION_ROUTE_NAMES = new Set(['PromotionRule', 'RebateRatio'])
const cellList = computed(()=>[
	Boolean(store.getIsPartnerReward && userInfo.isPartnerReward === '1' )&&{
		title: $t('TeamPartner'),
		name: 'team_partner',
		path: 'TeamPartner'
	},
	{
		title: $t('copyCode'),
		name: 'copy_Code',
		
	},
	// {
	// 	title: $t('myInvitation'),
	// 	icon: 'invite',
	// 	path: 'MyInvitation'
	// },
	{
		title: $t('subordinateD'),
		name: 'team_port',
		path: 'TeamReport'
	},
	{
		title: $t('commissionDetail'),
		name: 'commission',
		path: 'MyCommission'
	},
	{
		title: $t('invitationRules'),
		name: 'invite_reg',
		path: 'PromotionRule'
	},
	{
		title: $t('poxyServer'),
		name: 'server',
		path: 'Server'
	},
	{
		title: $t('rebateRatio'),
		name: 'rebateRatio',
		path: 'RebateRatio'
	}
].filter(Boolean))

onMounted(() => {
	if (globalStore.token) getInfo()
})

const promotionData = ref<PromotionData>({
	mylink: 'http://55lottery.com/#/register?r_code=5284741404',
	aglink: 'MTg5MCY9Jj0mZXlKaFoyVnVkRjlwWkNJNk5ERTBNRFI5Jj0mPSZUWUtQOFg%3d',
	mycode: '',
	children_Lv_1_Count: 0,
	children_Lv_Count_X: 0,
	children_Lv_1_Count_Add: 0,
	children_Lv_Count_X_Add: 0,
	children_Lv_1_Count_Add_Yesterday: 0,
	children_Lv_Count_X_Add_Yesterday: 0,
	children_Lv_RebateAmount_Yesterday: 0,
	children_Lv_1_RebateAmount_Yesterday: 0,
	children_Lv_RebateAmount_Week: 0,
	children_Lv_1_RebateAmount_X_Yesterday: 0,
	children_Lv_RebateAmount: 0
})

async function handleCopyCode() {
	if (!(await requireLoginAction())) return

	copy(promotionData.value?.mycode)
}

async function onShareBtnClick() {
	await pushWithLoginIntercept(router, {
		name: 'PromotionShare',
		query: {
			code: promotionData.value?.mycode
		},
	})
}

async function onGuestLoginClick() {
	await requireLoginAction()
}

const handleClickCell = async (item: { title: string; name: string; path?: string }) => {
	if (item.name === 'copy_Code') {
		await handleCopyCode()
		return
	}

	if (!item.path) return
	if (PUBLIC_PROMOTION_ROUTE_NAMES.has(item.path)) {
		await router.push({ name: item.path })
		return
	}

	await pushWithLoginIntercept(router, { name: item.path })
}

const getInfo = async () => {
	if (!globalStore.token) return
	loading.value = true
	try {
		const data = await getPromotion() as any;
		if (data){
			promotionData.value = data.data;
		};
		if (data.msgCode===13){
			fixMsg(data)
		}

	} catch (error: any) {
		throw error
	} finally {
		loading.value = false
	}
}

async function onToSubordinate() {
	await pushWithLoginIntercept(router, { name: 'Subordinate' })
}
</script>

<style lang="scss" scoped>
/**
* #TODO:拆分样式
*/

.promotionGuest {
	position: relative;
	padding: 44px 24px 70px;
	background-image: url('@/assets/icons/promotion/promotionbg.png'), var(--main_gradient-color);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover, 100% 100%;

	&::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: -2px;
		left: 0;
		display: block;
		height: 92px;
		background-color: var(--bg_color_L1);
		z-index: 1;
	}

	&__content {
		position: relative;
		z-index: 2;
		width: 700px;
		margin: 0 auto;
		padding: 34px 28px 30px;
		border-radius: 20px;
		background: var(--darkBg, var(--bg_color_L2));
		box-shadow: var(--BoxShadowColor-9);
		text-align: center;
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 82px;
		height: 82px;
		margin: 0 auto 18px;
		border-radius: 50%;
		background: var(--main_gradient-color);

		svg {
			width: 52px;
			height: 52px;
		}
	}

	&__title {
		margin-bottom: 12px;
		color: var(--text_color_L1);
		font-size: 34px;
		font-weight: 700;
		line-height: 44px;
	}

	&__desc {
		margin: 0 auto 26px;
		color: var(--text_color_L2);
		font-size: 24px;
		line-height: 34px;
	}

	&__action {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 360px;
		height: 70px;
		margin-bottom: 22px;
		padding: 0 34px;
		border: none;
		border-radius: 99rem;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 28px;
		font-weight: 700;
	}
}

.content {
	.shareBtnContainer {
		margin: 36px 0 26px;
		width: 100%;
		height: 70px;
		text-align: center;
		.shareBtn {
			width: 660px;
			height: 100%;
			color: var(--text_color_L4);
			font-size: 30px;
			font-weight: bold;
			letter-spacing: 1px;
			
			border: none;
			border-radius: 99rem;
			background: var(--main_gradient-color);
		}
	}

	.commission {
		display: flex;
		flex-direction: column;
		min-height: 220px;
		padding: 19px 14px;
		border-radius: 10px;
		background-color: var(--bg_color_L2);
		box-shadow:var(--BoxShadowColor-9);
		margin-bottom: 225px;

		&__title {
			display: flex;
			align-items: center;
			margin-bottom: 17px;
			font-size: 28px;
			font-weight: 600;
			letter-spacing: 0.5px;
			color:var(--text_color_L1);

			svg {
				margin-right: 8px;
				font-size: 48px;
				width: 48px;
			}
		}

		&__body {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			margin-top: 20px;
			& > div {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;

				span {
					letter-spacing: 1px;
					font-family: 'Inter', sans-serif;
					text-align: center;

					&:first-of-type {
						color: var(--text_color_L1);
						font-size: 30px;
						font-weight: 500;
					}

					&:last-of-type {
						color: var(--text_color_L2);
						font-size: 24px;
						line-height: 40px;
					}
				}
			}

			& > span {
				width: 0.5px;
				height: 70px;
				background: var(--Dividing-line_color);
			}
		}
	}
}

.promote__cell {
	&-item {
		padding: 28px 20px 28px 28px;
		background: var(--bg_color_L2);
		box-shadow:var(--BoxShadowColor-9);
		border-radius: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		.label {
			display: flex;
			align-items: center;

			svg {
				width: 60px;
				height: 60px;
				margin-right: 10px;
			}

			span {
				font-weight: 300;
				font-size: 28px;
				line-height: 22px;
				color: var(--text_color_L1);
			}
		}

		.arrow {
			display: flex;
			align-items: center;

			span {
				font-weight: 400;
				font-size: 24px;
				line-height: 22px;
				color: var(--text_color_L2);
				margin-right: 8px;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				gap: 10px;
				svg {
					width: 36px;
					height: 36px;
				}
			}
		}
	}
}

:deep(.navbar__content-right) {
	svg {
		width: 48px;
		height: 48px;
	}
}
</style>
