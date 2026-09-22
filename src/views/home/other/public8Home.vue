<template>
	<div id="home" class="p8-home">
		<!-- 顶部导航栏占位 -->
		<div class="p8-home__nav-placeholder"></div>

		<!-- 顶部导航栏 fixed -->
		<div class="p8-home__nav">
			<div class="p8-home__nav-left">
				<img :src="projectIcon" alt="logo" class="p8-home__nav-logo" />
			</div>
			<div class="p8-home__nav-right">
				<div class="p8-home__nav-icon" v-if="isLogin" @click="router.push({ name: 'Notification' })">
					<img src="@icon/home/messageIcon.png" />
				</div>
				<div class="p8-home__nav-icon" v-if="(apkStore.apk.value) != ApkType.FullApk" @click="onDown">
					<img src="@icon/home/iconDownload.png" />
				</div>
			</div>
		</div>

		<!-- 用户信息区域（已登录） -->
		<div class="p8-home__user" v-if="isLogin">
			<div class="p8-home__user-avatar" @click="router.push({ name: 'UserInfo' })">
				<img :src="userPhoto" alt="avatar" />
			</div>
			<div class="p8-home__user-info">
				<span class="p8-home__user-name">{{ nickName }}</span>
				<div class="p8-home__user-balance" @click="router.push({ name: 'wallet' })">
					<img src="@icon/home/iconAdd.png" class="p8-home__user-coin" />
					<span class="p8-home__user-amount">{{ currency(balance) }}</span>
				</div>
			</div>
			<div class="p8-home__user-actions">
				<div class="p8-home__user-btn p8-home__user-btn--deposit" @click="router.push({ name: 'Recharge' })">
					<span>{{ $t('recharge') }}</span>
				</div>
				<div class="p8-home__user-btn p8-home__user-btn--withdraw" @click="router.push({ name: 'Withdraw' })">
					<span>{{ $t('withdraw') }}</span>
				</div>
			</div>
		</div>

		<!-- 未登录：头像 + 用户名 + 登录/注册按钮 -->
		<div class="p8-home__guest" v-else>
			<div class="p8-home__guest-avatar">
				<img src="@icon/home/avatarDefault.png" alt="avatar" />
			</div>
			<span class="p8-home__guest-name">{{$t('loginNow')}}</span>
			<div class="p8-home__guest-actions">
				<button class="p8-home__guest-btn p8-home__guest-btn--login" @click="router.push({ name: 'login' })">
					{{ $t('login') }}
				</button>
				<button class="p8-home__guest-btn p8-home__guest-btn--register" @click="router.push({ name: 'register' })">
					{{ $t('register') }}
				</button>
			</div>
		</div>

		<!-- 轮播图 -->
		<Swiper :isShowButton="true" />

		<!-- 滚动通知栏 -->
		<NoticeBar key="home" />

		<!-- 活动卡片 -->
		<ActivityCards />

		<!-- 精选游戏 -->
		<FeaturedGame :gameData="featureGameData" />

		<!-- Featured Games 轮播 -->
		<RecommendedGames />

		<!-- 游戏分类标签 -->
		<div class="p8-home__category-wrapper">
			<div class="p8-home__category-glow"></div>
			<GameCategoryTabs @change="onCategoryChange" />
		</div>

		<!-- 当前分类的游戏区块 -->
		<GameSection :categoryCode="activeCategory" />

		<!-- 中奖信息 -->
		<!-- <div class="p8-home__section-card">
			<SectionHeader :title="$t('winningDetal')" />
			<LuckyWinners />
		</div> -->

		<!-- 今日盈利排行榜 -->
		<!-- <div class="p8-home__section-card">
			<SectionHeader :title="$t('earningsRankingToday')" />
			<DailyProfitRank />
		</div> -->

		<!-- 邀请转盘 -->
		<Turntable />
</div>
</template>

<script setup lang="ts">
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import RecommendedGames from '@/components/Home/Public8Home/RecommendedGames.vue'
import FeaturedGame from '@/components/Home/Public8Home/FeaturedGame.vue'
import GameCategoryTabs from '@/components/Home/Public8Home/GameCategoryTabs.vue'
import GameSection from '@/components/Home/Public8Home/GameSection.vue'
import ActivityCards from '@/components/Home/Public8Home/ActivityCards.vue'
import Turntable from '@/components/common/Turntable.vue'
import { useCommonStore, GlobalStore, useWalletStore } from '@/stores'
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import { currency } from '@/utils'
import { ApkType, useApkState } from '@/stores/apk'
import type { UserInfo } from '@/types/api/interface/store/store'
import defaultAvatar from '@public/images/avatar.png'
import { useAssets } from '@/hooks/useAssets'

const router = useRouter()
const { setLoading } = useCommonStore()
const globalStore = GlobalStore()
const apkStore = useApkState()
const walletStore = useWalletStore() as any
const { onDown, projectIcon, getMessagesData, getGameType, getAllGame, getWinInfoDetail, homeState } = useHome()

const { getAvatarUrl } = useAssets()

const isLogin = computed(() => !!globalStore.token)
const balance = computed(() => walletStore.getAmount || 0)

const userInfo = computed(() => globalStore.userInfo as UserInfo)
const nickName = computed(() => userInfo.value?.nickName || userInfo.value?.userName || 'User')
const userPhoto = computed(() => {
	const photo = userInfo.value?.userPhoto
	if (photo) return getAvatarUrl(photo)
	return defaultAvatar
})

// 精选游戏：取 featureGame 数组第一个
const featureGameData = computed(() => (homeState.allGameList as any)?.featuregame?.[0])

// 当前选中的游戏分类
const activeCategory = ref('')

const onCategoryChange = (key: string) => {
	activeCategory.value = key
}


setLoading(false)

onMounted(async () => {
	await getGameType()
	await getAllGame()
	getMessagesData()
	getWinInfoDetail()
	setLoading(false)
})
</script>

<style lang="scss" scoped>
.p8-home {
	display: flex;
	flex-direction: column;
	gap: 36px;
	padding: 0 30px 280px;
	background: var(--bg_color_L2);
	min-height: 100vh;

	// ========== 导航栏 ==========
	&__nav-placeholder {
		height: 88px;
	}

	&__nav {
		position: fixed;
		top: 0;
		left: 50%; 
		transform: translateX(-50%);
		width: 750px;
		z-index: 101;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88px;
		padding: 0 30px;
		background-image: url('@icon/home/navBg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
filter: drop-shadow(0 10px 25px rgba(0, 65, 125, 0.12)) drop-shadow(0 2px 0 #C2D5E8);
		@media (max-width: 500px) {
			width: 100%;
			left: 0;
			transform: none;
		}

		&-left {
			flex-shrink: 0;
		}

		&-logo {
			max-width: 160px;
			height: 72px;
			object-fit: contain;
		}

		&-right {
			display: flex;
			align-items: center;
			gap: 20px;
		}

		&-icon {
			width: 48px;
			height: 48px;
			cursor: pointer;

			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
	}

	// ========== 用户信息区域 ==========
	&__user {
		display: flex;
		align-items: center;
		padding: 0px;
		gap: 20px;

		&-avatar {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			overflow: hidden;
			flex-shrink: 0;
			border: 2px solid var(--Dividing-line_color);
			cursor: pointer;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&-info {
			display: flex;
			flex-direction: column;
			gap: 8px;
			flex: 1;
			min-width: 0;
		}

		&-name {
			font-size: 28px;
			font-weight: 600;
			color: var(--text_color_L1);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&-balance {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			cursor: pointer;
			border-radius: 40px;
			background: #ECF4FA;
			padding: 6px 16px 6px 10px;
			width: fit-content;
		}

		&-coin {
			width: 28px;
			height: 28px;
			flex-shrink: 0;
		}

		&-amount {
			font-size: 24px;
			font-weight: 500;
			color: var(--text_color_L1);
			white-space: nowrap;
		}

		&-actions {
			display: flex;
			gap: 12px;
			flex-shrink: 0;
		}

		&-btn {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			width: 120px;
			height: 72px;
			border-radius: 8px;
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			cursor: pointer;

			&--deposit {
				background-image: url('@icon/home/iconDeposit.png');
			}

			&--withdraw {
				background-image: url('@icon/home/iconWithdraw.png');
			}

			span {
				font-size: 20px;
				font-weight: 500;
				color: var(--text_color_L4);
				padding-bottom: 10px;
			}
		}
	}

	// ========== 未登录：头像 + 用户名 + 登录/注册 ==========
	&__guest {
		display: flex;
		align-items: center;
		gap: 20px;

		&-avatar {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			overflow: hidden;
			flex-shrink: 0;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&-name {
			flex: 1;
			min-width: 0;
			font-size: 28px;
			font-weight: 600;
			color: var(--text_color_L1);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&-actions {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-shrink: 0;
		}

		&-btn {
			width: 160px;
			min-width: 160px;
			height: 60px;
			padding: 0 24px;
			border-radius: 16px;
			font-size: 26px;
			font-weight: 600;
			border: none;
			cursor: pointer;
			white-space: nowrap;

			&--login {
				background: #ECF4FA;
				color: var(--text_color_L1);
			}

			&--register {
				background: var(--main_gradient-color, var(--main-color));
				color: var(--text_color_L4, #fff);
			}
		}
	}

	// ========== 通用区块卡片 ==========
	&__section-card {
		background: var(--bg_color_L2);
		border: 1px solid var(--Dividing-line_color);
		border-radius: 15px;
		box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
		overflow: hidden;
	}

	// ========== 轮播图样式覆盖 ==========
	:deep(.swiper_box) {
		position: relative;
		padding: 0;
		margin: 0;

		.my-swipe {
			height: 320px;

			img {
				border-radius: 20px;
			}
		}

		.swiper-button {
			position: absolute;
			bottom: 20px;
			left: 0;
			right: 0;
			z-index: 10;
			gap: 6px;

			span {
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background: var(--main-color);
				opacity: 0.5;
				margin: 6px !important;

				&.active {
					width: 16px;
					height: 10px;
					border-radius: 13px;
					background: var(--main-color);
					opacity: 1;
				}
			}
		}
	}

	// ========== 游戏分类区域光圈 ==========
	&__category-wrapper {
		position: relative;
	}

	&__category-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		max-width: 750px;
		height: 330px;
		border-radius: 875px;
		opacity: 0.2;
		background: linear-gradient(246deg, #3E8FFF 18.68%, #63E8FF 49.62%);
		filter: blur(117px);
		pointer-events: none;
	}

	// ========== 活动卡片/精选游戏 间距收紧 ==========
	:deep(.activity-cards),
	:deep(.featured-game) {
		margin-top: -16px;
	}

	// ========== 通知栏样式覆盖 ==========
	:deep(.noticeBar__container) {
		background: transparent;
		border: none;
		box-shadow: none;
		filter: none;
		border-radius: 0;
		height: 80px;
		padding-inline: 0;

		svg, .notice_svg {
			color: var(--text_color_L1);
			flex-shrink: 0;
			filter: brightness(0);
		}

		.noticeBar__container-body {
			flex: 1;
			overflow: hidden;

			&-text {
				color: var(--text_color_L1);
				font-size: 24px;
			}
		}

		.hotIcon {
			background: linear-gradient(180deg, #36FFBB 0%, #488FFD 100%);
			border: none;
			border-radius: 28px;
			width: 96px;
			height: 41px;
			padding: 0 24px;
			font-size: 22px;
		}
	}

	// ========== 中奖信息 ==========
	:deep(.luckyWinners__container) {
		padding: 20px 0;

		& > h1 {
			display: none !important;
		}
	}

	:deep(.luckyWinners__container-wrapper) {
		height: auto !important;
		overflow: hidden !important;

		& > div {
			display: flex;
			gap: 16px;
		}
	}

	:deep(.luckyWinners__container-wrapper__item) {
		flex-direction: column;
		align-items: flex-start;
		width: 125px;
		flex-shrink: 0;
		height: auto !important;
		padding: 0 !important;
		margin-bottom: 0 !important;
		background: transparent !important;
		border: none !important;
		border-radius: 0 !important;
	}

	:deep(.luckyWinners__container-wrapper__item-img) {
		display: none !important;
	}

	:deep(.luckyWinners__container-wrapper__item-winType) {
		order: -1;
		width: 125px !important;
		height: 160px !important;
		margin: 0 0 8px 0 !important;

		img {
			width: 100% !important;
			height: 100% !important;
			border-radius: 14px !important;
			border: none !important;
			background: none !important;
			object-fit: cover !important;
		}
	}

	:deep(.luckyWinners__container-wrapper__item-info) {
		order: 1;
		width: 100% !important;
		margin: 0 !important;
		text-align: left;

		h1 {
			color: var(--text_color_L2) !important;
			font-size: 20px !important;
			font-family: 'Fredoka', sans-serif !important;
		}
	}

	:deep(.luckyWinners__container-wrapper__item-winAmount) {
		order: 2;
		text-align: left !important;

		h1 {
			color: var(--main-color) !important;
			font-size: 20px !important;
			font-family: 'Fredoka', sans-serif !important;
			font-weight: 400 !important;
			margin-bottom: 0 !important;
		}

		span {
			display: none !important;
		}
	}
:deep(.van-dialog) {
		width: 620px;
	}

	:deep(.van-dialog__content) {

	}

	:deep(.van-dialog__confirm) {
		background: var(--main_gradient-color);
	}

	:deep(.van-button__text) {
		font-size: 32px;
		font-weight: 700;
		letter-spacing: 5px;
		color: var(--text_color_L4);
	}
}

// 获奖弹窗
</style>
