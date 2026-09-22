<template>
	<div class="content_home">
		<NavBar class="main">
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
		<NoticeBar key="home" />

		<HomeMenu v-model:currentMenu="currentMenu" v-model:currentTitle="currentTitle" />

		<HomeContainer :currentMenu="currentMenu" :currentTitle="currentTitle" />

		<LuckyWinners />

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
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import HomeMenu from '@/components/Home/Red92Home/HomeMenu/index.vue'
import HomeContainer from '@/components/Home/Red92Home/HomeContainer/index.vue'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import DailyProfitRank from '@/components/Home/DailyProfitRank/index.vue'
import BottomLogoText from '@/components/common/BottomLogoText.vue'
import { GlobalStore, useCommonStore, useHomeStore, SettingStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '@/hooks'
import { useApkState, ApkType } from '@/stores/apk'
const router = useRouter()
const { setLoading } = useCommonStore()
const settingS = SettingStore()
const apkStore = useApkState()

//下载

setLoading(false)

const currentMenu = ref(sessionStorage.getItem('currentMenu') || '')
const currentTitle = ref('')

const { onDown } = useHome()
function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}
const globalStore = GlobalStore()
// 是否已读
const isRead = ref(true)
// const gameListRef = ref()

async function getMessagesData() {
	const homeStore = useHomeStore()
	isRead.value = !(globalStore.getUserInfo.unRead > 0)
	homeStore.setReadState(isRead.value)
}

// 项目图标
const projectIcon = computed(() => {
	return settingS.getProjectLogo
})

onMounted(() => {
	// getMessage()
	// 获取通知消息，判断是否已读
	getMessagesData()
	// openAll()
	setLoading(false)
})

</script>

<style lang="scss" scoped>
.content_home {
	font-family: $font-family;
	padding-bottom: 340px;

	.content__right {
		display: flex;
		flex-direction: row;
		align-items: center;

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
			width: 48px;
			height: 48px;
			margin-left: 24px;
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


}
</style>
