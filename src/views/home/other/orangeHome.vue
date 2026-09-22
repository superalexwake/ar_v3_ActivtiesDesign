<template>
	<div id="home" class="orange_content">
		<NavBar backgroundColor="var(--main_gradient-color)">
			<template #left>
				<img :src="projectIcon" alt="" />
			</template>
			<template #right>
				<div class="content_right">
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

		<HomeMenu v-model:currentMenu="currentMenu" v-model:currentTitle="currentTitle" />

		<HomeContainer :currentMenu="currentMenu" :currentTitle="currentTitle" />

		<LuckyWinners />

		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<DailyProfitRank />
		<!--下载PWA应用-->
		<DownloadPWA />
		<Turntable />
</div>
</template>

<script setup lang="ts">
import Point from '@/components/common/Point.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import HomeMenu from '@/components/Home/OrangeHome/HomeMenu/index.vue'
import HomeContainer from '@/components/Home/OrangeHome/HomeContainer/index.vue'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import DailyProfitRank from '@/components/Home/DailyProfitRank/index.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import { useCommonStore } from '@/stores'
import { onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import { useApkState, ApkType } from '@/stores/apk'

const router = useRouter()
const { setLoading } = useCommonStore()
const { onDown, projectIcon, isRead, getMessagesData } = useHome()

const currentMenu = ref(sessionStorage.getItem('currentMenu') || '')
const currentTitle = ref('')
const apkStore = useApkState()
function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}
setLoading(false)
onMounted(() => {
	getMessagesData()
	setLoading(false)
})

</script>

<style lang="scss" scoped>
.orange_content {
	width: 100%;
	padding-bottom: 170px;

	.content_right {
		display: flex;
		flex-direction: row;
		align-items: center;

		.message {
			position: relative;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;

			svg {
				width: 56px;
				height: 56px;
				color: #fff;
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
			width: 48px;
			height: 48px;
			margin-left: 14px;
			color: var(--text_white);
		}
	}

	.navbar {
		&__content {
			&-left {
				img {
					height: 80%;
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
		}

		.van-nav-bar__content {
			.van-nav-bar__left {
				img {
					height: 100%;
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

	}
:deep() .van-dialog {
		width: 622px;
		height: 930px;
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;

		&__content {
			position: relative;
			width: 100%;


		}


	}

	.dailyProfitRank,
	.luckyWinners__container {
		padding: 0 30px;
	}

	:deep(.swiper_box) {
		padding: 0;

		img {
			border-radius: 0;
		}
	}

	:deep(.navbar-fixed) {
		background: var(--main_gradient-color);
		color: var(--text_white)
	}
}
</style>
