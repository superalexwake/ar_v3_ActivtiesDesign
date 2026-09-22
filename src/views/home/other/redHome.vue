<template>
	<div id="home" class="red-home content">
		<NavBar class="white">
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

		<!-- 头部轮播图 -->
		<Swiper />

		<!-- 滚动通知栏 -->
		<NoticeBar key="home" color="red" />

		<!-- 热门、彩票、游戏选项卡 -->
		<GameList ref="gameListRef" />

		<bigaward />
		<!-- 中奖信息 -->
		<LuckyWinners />

		<!-- 今日盈利排行榜 -->
		<DailyProfitRank />
		<!-- 巴西站底部logo文字 -->
		<BottomLogoText />

		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<!--下载PWA应用-->
		<DownloadPWA />
		<Turntable />
</div>
</template>

<script setup lang="ts">
import Point from '@/components/common/Point.vue'
import DailyProfitRank from '@/components/Home/DailyProfitRank/index.vue'
import GameList from '@/components/Home/RedHome/GameList/index.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import Turntable from '@/components/common/Turntable.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import BottomLogoText from '@/components/common/BottomLogoText.vue'
import bigaward from '@/components/Home/RedHome/GameList/bigaward.vue';
import { useCommonStore } from '@/stores'
import { onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import { useApkState, ApkType } from '@/stores/apk'

const router = useRouter()
const { setLoading } = useCommonStore()
const { onDown, projectIcon, isRead, getMessagesData } = useHome()


function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}

setLoading(false)
const gameListRef = ref()
const apkStore = useApkState()

onMounted(() => {
	// getMessage()
	// 获取通知消息，判断是否已读
	getMessagesData()
	setLoading(false)
})
</script>

<style lang="scss" scoped>
.red-home {
	:deep(.swiper_box) {
		padding: 0;
		margin: 20px 0;
	}
}

.content {
	font-family: $font-family;
	gap: 10px;
	padding-bottom: 280px;

	&__right {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 15px;

		svg {
			position: relative;
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
			font-size: 40px;
			margin-top: -10px;
			color: var(--main-color);
		}
	}
}

.navbar {
	&__content {
		&-left {
			img {
				height: 80%;
			}
		}

		&-right {
			svg {
				width: 48px;
			}
		}
	}
}

.van-nav-bar {
	background: #f7f8ff;

	.van-nav-bar__content {
		.van-nav-bar__left {
			img {
				height: 100%;
			}
		}

		.van-nav-bar__right {
			svg {
				width: 48px;
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
	height: 930px;
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;

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

	.van-button__text {
		color: #fff;
		width: 80%;
		height: 70px;
		text-align: center;
		line-height: 70px;
		background: var(--main_gradient-color);
		border-radius: 80px;
		z-index: 100;
		font-weight: 700;
		font-size: 32px;
		font-family: 'Inter';
		font-style: normal;
		letter-spacing: 5px;
	}
}

</style>
