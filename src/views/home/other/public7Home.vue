<template>
	<div id="home" class="purple-home">
		<!-- 顶部导航栏占位 -->
		<div class="purple-home__nav-placeholder"></div>
		<!-- 顶部导航栏 fixed -->
		<div class="purple-home__nav">
			<img v-if="isLogin" src="@icon/home/navBg.png" class="purple-home__nav-bg" />
			<!-- 已登录：左(余额) 中(logo) 右(下载+语言) -->
			<template v-if="isLogin">
				<div class="purple-home__nav-left purple-home__nav-left--login">
					<div class="purple-home__nav-chip" @click="router.push({ name: 'wallet' })">
						<span class="purple-home__nav-chip__amount">{{ currency(balance) }}</span>
						<img src="@icon/home/iconAdd.png" class="purple-home__nav-chip__add" @click.stop="router.push({ name: 'Recharge' })" />
					</div>
				</div>
				<div class="purple-home__nav-center">
					<img :src="projectIcon" alt="logo" class="purple-home__nav-logo" />
				</div>
				<div class="purple-home__nav-right">
					<div class="purple-home__nav-download" v-if="(apkStore.apk.value) != ApkType.FullApk" @click="onDown">
						<img src="@icon/home/iconDownload.png" />
					</div>
					<LangPop />
				</div>
			</template>
			<!-- 未登录：左(logo) 右(Login + Register) -->
			<template v-else>
				<div class="purple-home__nav-left">
					<img :src="projectIcon" alt="logo" class="purple-home__nav-logo" />
				</div>
				<div class="purple-home__nav-auth">
					<button class="purple-home__nav-auth__login" @click="router.push({ name: 'login' })">Login</button>
					<button class="purple-home__nav-auth__register" @click="router.push({ name: 'register' })">Register</button>
				</div>
			</template>
		</div>

		<!-- 头部轮播图 -->
		<Swiper :isShowButton="true" />

		<!-- 滚动通知栏 -->
		<NoticeBar key="home" />

		<!-- 游戏分类标签 -->
		<GameCategoryTabs @change="onCategoryChange" />

		<!-- 当前分类的游戏区块 -->
		<GameSection :categoryCode="activeCategory" />

		<!-- 推荐游戏 -->
		<RecommendedGames />

		<!-- 精选游戏 -->
		<FeaturedGame :gameData="featureGameData" />

		<!-- 中奖信息 -->
		<div class="purple-home__section-card">
			<SectionHeader :title="$t('winningDetal')" />
			<LuckyWinners />
		</div>

		<!-- 今日盈利排行榜 -->
		<div class="purple-home__section-card">
			<SectionHeader :title="$t('earningsRankingToday')" />
			<DailyProfitRank />
		</div>

		<!-- 合作厂商 -->
		<PartnerLogos />

		<!-- 下载PWA应用 -->
		<!-- <DownloadPWA /> -->
		<!-- 邀请转盘 -->
		<Turntable />
</div>
</template>

<script setup lang="ts">
import DailyProfitRank from '@/components/Home/Public7Home/DailyProfitRank.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index093.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import SectionHeader from '@/components/Home/Public7Home/SectionHeader.vue'
import RecommendedGames from '@/components/Home/Public7Home/RecommendedGames.vue'
import FeaturedGame from '@/components/Home/Public7Home/FeaturedGame.vue'
import GameCategoryTabs from '@/components/Home/Public7Home/GameCategoryTabs.vue'
import GameSection from '@/components/Home/Public7Home/GameSection.vue'
import PartnerLogos from '@/components/Home/Public7Home/PartnerLogos.vue'
import Turntable from '@/components/common/Turntable.vue'
// import DownloadPWA from '@/components/common/DownloadPWA.vue'
import LangPop from '@/components/Login/LangPopup.vue'
import { useCommonStore, GlobalStore, useWalletStore } from '@/stores'
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import { useServer } from '@/hooks/useServe.hook'
import { currency } from '@/utils'
import { ApkType, useApkState } from '@/stores/apk'

const router = useRouter()
const { setLoading } = useCommonStore()
const globalStore = GlobalStore()
const apkStore = useApkState()
const walletStore = useWalletStore() as any
const { onDown, projectIcon, getMessagesData, isAppDownload, getGameType, getAllGame, getWinInfoDetail, homeState } = useHome()
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })


const isLogin = computed(() => !!globalStore.token)
const balance = computed(() => walletStore.getAmount || 0)

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
.purple-home {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 0 30px 280px;
	background: var(--bg_color_L1);
	min-height: 100vh;


	// 通用区块卡片
	&__section-card {
		background: #272036;
		border: 2px solid #3e2f60;
		border-radius: 15px;
		box-shadow: inset 0 2px 0 0 #2e384a, 0 4px 4px 0 rgba(0, 0, 0, 0.25);
		overflow: hidden;
		// margin-top: 20px;
		margin-bottom: 20px;
	}

	// 推荐游戏、游戏区块、合作厂商额外间距
	:deep(.recommended-games),
	:deep(.game-section),
	:deep(.partner-logos) {
		margin-bottom: 20px;
	}


	// 导航占位
	&__nav-placeholder {
		height: 88px;
	}

	// 顶部导航
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
		background-color: var(--bg_color_L1);
		@media (max-width: 500px) {
			width: 100%;
			left: 0;
			transform: none;
		}

		// 导航背景图
		&-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: fill;
			z-index: 0;
		}

		&-left {
			position: relative;
			z-index: 1;
			flex-shrink: 0;

			&--login {
				position: absolute;
				left: 0;
			}
		}

		&-logo {
			max-width: 160px;
			height: 72px;
			object-fit: contain;
		}

		&-center {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 1;
			display: flex;
			justify-content: center;

			.purple-home__nav-logo {
				max-width: 220px;
				height: 88px;
			}
		}

		&-right {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			gap: 12px;
			flex-shrink: 0;
			margin-left: auto;

			:deep(.img) {
				width: 35px !important;
				height: 35px !important;
			}

			:deep(.languageName) {
				color: #F6DFFF !important;
			}
		}

		// 余额芯片
		&-chip {
			display: flex;
			align-items: center;
			overflow: hidden;
			&__coin {
				width: 48px;
				height: 48px;
				flex-shrink: 0;
				margin-bottom: -4px;
			}

			&__amount {
				padding: 0 6px;
				font-size: 24px;
				// font-weight: 500;
				color: #ffcc24;
				white-space: nowrap;
				overflow: hidden;
				display: block;
				width: 160px;
				margin-right: 6px;
				padding-left:20px;
			}

			&__add {
				width: 36px;
				height: 36px;
				flex-shrink: 0;
				cursor: pointer;
			}
		}

		// 下载按钮
		&-download {
			width: 44px;
			height: 44px;
			flex-shrink: 0;
			cursor: pointer;
			margin-right: 12px;

			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}

		// 未登录按钮组
		&-auth {
			position: relative;
			z-index: 1;
			display: flex;
			align-items: center;
			gap: 16px;
			margin-left: auto;

			button {
				height: 56px;
				padding: 0 32px;
				border-radius: 28px;
				font-size: 26px;
				font-weight: 600;
				border: 2px solid transparent;
				cursor: pointer;
				white-space: nowrap;
				width: 160px;
			}

			&__login {
				background:
					linear-gradient(#0c0a1a, #0c0a1a) padding-box,
					linear-gradient(95deg, #a1edff, #3131b9, #fcf5ff, #363bb5, #3d49be, #4a64b4, #efe0ff, #6363da, #ffb184) border-box;
				color: #fff;
			}

			&__register {
				background:
					linear-gradient(95deg, #FB8466 3%, #BD5BD4 30%, #7473FA 65%, #53B2FA 103%) padding-box,
					linear-gradient(95deg, #a1edff, #3131b9, #fcf5ff, #363bb5, #3d49be, #4a64b4, #efe0ff, #6363da, #ffb184) border-box;
				color: #fff;
			}
		}
	}

	// 轮播图样式覆盖
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
			bottom: 44px;
			left: 0;
			right: 0;
			z-index: 10;
			gap: 6px;
			span {
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 0.3);
				margin: 6px !important;

				&.active {
					width: 20px;
    				height: 10px;
      				border-radius: 10px;
					background: linear-gradient(95deg, #FB8466 2.97%, #BD5BD4 30.32%, #7473FA 65.33%, #53B2FA 102.56%);
				}
			}
		}
	}

	// 通知栏样式覆盖
	:deep(.noticeBar__container) {
		background: #272036;
		border: 2px solid #3E2F60;
		box-shadow: 0 2px 0 0 #2E384A inset;
		filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
		border-radius: 80px;
		height: 80px;
		svg {
			color: #a78bfa;
			flex-shrink: 0;
		}

		.noticeBar__container-body {
			flex: 1;
			overflow: hidden;

			&-text {
				color: rgba(255, 255, 255, 0.7);
				font-size: 24px;
			}
		}

		.hotIcon {
			fill: linear-gradient(95deg, #FB8466 2.97%, #BD5BD4 30.32%, #7473FA 65.33%, #53B2FA 102.56%);
			stroke-width: 2px;
			stroke: #A1EDFF;
			border-radius: 50px;
		}
	}

	// ========== 中奖信息 - 横向滚动卡片 ==========
	// 隐藏原始标题（用 SectionHeader 代替）
	:deep(.luckyWinners__container) {
		padding: 20px 0;

		& > h1 {
			display: none !important;
		}
	}

	// 横向滚动容器
	:deep(.luckyWinners__container-wrapper) {
		height: auto !important;
		overflow: hidden !important;

		& > div {
			display: flex;
			gap: 16px;
		}
	}

	// 每个中奖卡片 - 纵向布局
	:deep(.luckyWinners__container-wrapper__item) {
		flex-direction: column;
		align-items: flex-start;
		width: 125px;
		// min-width: 130px;
		flex-shrink: 0;
		height: auto !important;
		padding: 0 !important;
		margin-bottom: 0 !important;
		background: transparent !important;
		border: none !important;
		border-radius: 0 !important;
	}

	// 隐藏头像
	:deep(.luckyWinners__container-wrapper__item-img) {
		display: none !important;
	}

	// 游戏图片放最上面
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

	// 用户名
	:deep(.luckyWinners__container-wrapper__item-info) {
		order: 1;
		width: 100% !important;
		margin: 0 !important;
		text-align: left;

		h1 {
			color: #D7D7D7 !important;
			font-size: 20px !important;
			font-family: 'Fredoka', sans-serif !important;
		}
	}

	// 金额
	:deep(.luckyWinners__container-wrapper__item-winAmount) {
		order: 2;
		text-align: left !important;

		h1 {
			color: #FFC874 !important;
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
		background: linear-gradient(135deg, #3b1f6e, #6366f1);
	}

	:deep(.van-button__text) {
		font-size: 32px;
		font-weight: 700;
		letter-spacing: 5px;
		color: #fff;
	}
}

// 获奖弹窗
</style>
