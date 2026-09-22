<template>
	<div class="content">
		<NavBar backgroundColor="#fff">
			<template #left>
				<img :src="projectIcon" alt="" />
			</template>
			<template #right>
				<div class="content__right">
					<div class="message" @click="onClickRightH">
						<svg-icon name="notification" />
						<Point v-show="!isRead" class="point" />
					</div>
					<svg-icon v-if="(apkStore.apk.value) != ApkType.FullApk" @click.stop="onDown" name="down"
						class="down"></svg-icon>
				</div>
			</template>
		</NavBar>

		<LoginTip v-if="isShowLoginTip" />
		<!-- 头部轮播图 -->
		<Swiper />


		<div class="whiteGLing"></div>
		<!-- 滚动通知栏 -->
		<NoticeBar key="home" />
		<div class="whiteGLing mb"></div>
		<div class="box1">
			<!-- 游戏菜单 -->
			<GameMenu />
			<GameContainer />



			<!-- 中奖信息 -->
			<LuckyWinners />

			<!-- 今日盈利排行榜 -->
			<DailyProfitRank />
		</div>

		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<!--下载PWA应用-->
		<DownloadPWA />
		<Turntable />
</div>
</template>

<script setup lang="ts">
import Point from '@/components/common/Point.vue'
import DailyProfitRank from '@/components/Home/WhiteGoldHome/DailyProfitRank/index.vue'
import LuckyWinners from '@/components/Home/WhiteGoldHome/LuckyWinners/index.vue'
import NoticeBar from '@/components/Home/WhiteGoldHome/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import { GlobalStore, useCommonStore } from '@/stores'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import { useApkState, ApkType } from '@/stores/apk'
import GameMenu from '@/components/Home/WhiteGoldHome/GameMenu/index.vue'
import GameContainer from '@/components/Home/WhiteGoldHome/GameContainer/index.vue'
import LoginTip from '@/components/Home/WhiteGoldHome/LoginTip/index.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
const {
	onDown,
	projectIcon,
	isRead,
	getMessagesData
} = useHome()
const apkStore = useApkState()
const globalState = GlobalStore()
const router = useRouter()
const { setLoading } = useCommonStore()


function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}

const isShowLoginTip = computed(() => {
	return !globalState.getToken
	// return true
})


setLoading(false)
onMounted(() => {
	// getMessage()
	// 获取通知消息，判断是否已读
	getMessagesData()
	// openAll()
	setLoading(false)
})

</script>
<style lang="scss" scoped>
.content {
	font-family: $font-family;
	gap: 10px;
	padding: 0;
	padding-bottom: 320px;
	background: #F7F8FF !important;

	&__right {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;

		svg {
			position: relative;
			width: 52px;
			height: 52px;
		}

		.message {
			position: relative;

			svg {
				width: 56px;
				height: 56px;
				color: var(--main-color);
			}
		}

		.point {
			position: absolute;
			top: 2px;
			right: 0px;
		}

		.down {
			color: var(--main-color);
			font-size: 62px;
			margin-top: -10px;
		}
	}
}

::v-deep(.navbar-fixed) {
	box-shadow: 0px 4px 10px 0px rgba(217, 217, 217, 0.68);
}

.navbar {
	background: #fff;

	&__content {
		&-left {
			img {
				height: 80%;
			}
		}

		&-right {
			svg {
				width: 58px;
			}
		}
	}
}

.customer {
	position: fixed;
	bottom: 180px;
	right: 30px;
	width: 112px;
	height: 112px;
	border-radius: 50%;
	z-index: 99;

	img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
}
:deep() .van-dialog {
	width: 622px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	background: #fff;
	padding-bottom: 22px;

	&__content {
		position: relative;
		width: 100%;


	}


	&__footer {
		z-index: 100;
		position: fixed;
		bottom: 30px;
		display: flex;
		flex-grow: 1;
		gap: 20px;
		width: 90%;
	}

	.van-button--default {
		background-color: transparent;
	}

	.van-button__text {
		color: #fff;
		width: 80%;
		height: 70px;
		text-align: center;
		line-height: 70px;
		background: var(--main_gradient-color);
		filter: drop-shadow(0px 4px 0px #896646);
		border-radius: 80px;
		z-index: 100;
		font-weight: 700;
		font-size: 32px;
		font-family: 'Inter';
		font-style: normal;
		letter-spacing: 5px;
	}
}


.box1 {
	padding: 0 24px;
}

.message_icon {
	width: 52px;
	height: 52px;
	background: url('@icon/goldWHome/notify.png') no-repeat center;
	background-size: contain;
	display: inline-block;
}

.whiteGLing {
	border-bottom: 1px solid #E5E8F5;

	&.mb {
		margin-bottom: 20px;
	}
}

:deep(.noticeBar__container) {
	margin-bottom: 0;
	margin: 0 24px 0 24px;
	width: calc(100% - 48px);
}
</style>
