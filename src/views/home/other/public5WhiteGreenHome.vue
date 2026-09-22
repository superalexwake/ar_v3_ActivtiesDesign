<template>
	<div id="home" class="p8-home">
		<!-- 顶部导航栏（随内容流，不固定） -->
		<div class="p8-home__nav">
			<div class="p8-home__nav-left">
				<img :src="projectIcon" alt="logo" class="p8-home__nav-logo" />
			</div>
			<div class="p8-home__nav-right" v-if="isLogin">
				<div class="p8-home__nav-icon" @click="router.push({ name: 'Notification' })">
					<img :src="messageIconImg" />
				</div>
				<div class="p8-home__nav-icon" v-if="(apkStore.apk.value) != ApkType.FullApk" @click="onDown">
					<img :src="iconDownloadImg" />
				</div>
			</div>
		</div>

		<!-- 未登录时的登录/注册卡片（紧跟 nav 之下、属于内容流的一部分） -->
		<div class="p8-home__guest" v-if="!isLogin">
			<button class="p8-home__guest-btn p8-home__guest-btn--login" @click="router.push({ name: 'login' })">
				{{ $t('login') }}
			</button>
			<button class="p8-home__guest-btn p8-home__guest-btn--register" @click="router.push({ name: 'register' })">
				{{ $t('register') }}
			</button>
		</div>

		<!-- 滚动通知栏 -->
		<NoticeBar key="home" />
		<!-- 轮播图 -->
		<Swiper :isShowButton="true" />

		

		<!-- 活动卡片 -->
		<ActivityCards />

		<!-- 游戏列表：tab 切换 + Lobby 聚合 + 公共底部(SuperJackpot/LuckyWinners/DailyProfitRank) -->
		<GameList />

		<!-- 平台说明 / 合作伙伴 / 年龄提示（迁移自 ar078 team） -->
		<Terms />

		<!-- 邀请转盘 -->
		<Turntable />
		<!--下载PWA应用-->
		<DownloadPWA :closable="isAr095" dismiss-key="ar095-home-download-pwa" />
		<!-- 公告/获奖等弹窗统一走全局 DialogQueue（DialogQueueHost），在登录/注册后由 openAll 入队 -->
	</div>
</template>

<script setup lang="ts">
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import ActivityCards from '@/components/Home/public5WhiteGreenHome/ActivityCards.vue'
import GameList from '@/components/Home/public5WhiteGreenHome/GameList/index.vue'
import Terms from '@/components/Home/public5WhiteGreenHome/Terms.vue'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'

import { useCommonStore, GlobalStore } from '@/stores'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import messageIconImg from '@icon/home/messageIcon.png'
import iconDownloadImg from '@icon/home/iconDownload.png'
import { ApkType, useApkState } from '@/stores/apk'

const router = useRouter()
const { setLoading } = useCommonStore()
const globalStore = GlobalStore()
const apkStore = useApkState()
const { onDown, projectIcon, getMessagesData, getGameType, getAllGame, getWinInfoDetail } = useHome()
const isAr095 = import.meta.env.VITE_BASE_PROJECTNAME === 'ar095'

const isLogin = computed(() => !!globalStore.token)

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
	gap: 24px;
	padding: 0 30px 320px;
	background:
		url('@icon/home/headMask.png') no-repeat top center / 100% auto,
		var(--bg_color_L2);
	min-height: 100vh;

	// ========== 导航栏（内容流，不固定） ==========
	&__nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88px;

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

	// ========== 未登录：Login + Register 左右各 50% ==========
	&__guest {
		display: flex;
		align-items: center;
		gap: 20px;

		&-btn {
			flex: 1;
			height: 80px;
			border: none;
			border-radius: 20px;
			font-size: 28px;
			font-weight: 600;
			color: #fff;
			cursor: pointer;
			white-space: nowrap;

			&--login {
				background: linear-gradient(180deg, #5EB6FF 0%, #C6C8FF 100%);
				box-shadow: 0 3px 12px 0 rgba(168, 184, 255, 0.45);
			}

			&--register {
				background: var(--main_gradient-color);
				box-shadow: 0 3px 12px 0 rgba(12, 215, 129, 0.45);
			}
		}
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
			background: var(--main_gradient-color2);
			border: none;
			border-radius: 28px;
			width: 96px;
			height: 41px;
			padding: 0 24px;
			font-size: 22px;
		}
	}

}
</style>
