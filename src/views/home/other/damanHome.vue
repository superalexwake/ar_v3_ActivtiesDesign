<template>
	<div class="content-daman content">
		<NavBar>
			<template #left>
				<img :src="projectIcon" alt="" />
			</template>
			<template #right>
				<div class="content-daman__right" v-if="!globalStore.getToken">
					<div class="nav-btn login-btn" @click="
						router.push({
							name: 'login'
						})
						">
						{{ $t('login') }}
					</div>
					<div class="nav-btn register-btn" @click="
						router.push({
							name: 'register'
						})
						">
						{{ $t('register') }}
					</div>
				</div>
				<div class="content-daman__right" v-else>
					<div class="message" @click="onClickRightH">
						<svg-icon name="notification" />
						<Point v-show="!isRead" class="point" />
					</div>
				</div>
			</template>
		</NavBar>
		<!-- 头部轮播图 -->
		<Swiper />

		<!-- 滚动通知栏 -->
		<NoticeDaman />
		<!-- 热门、彩票、游戏选项卡 -->
		<GameScenesDaman />
		<!-- 中奖信息 -->
		<LuckyWinners />

		<!-- 今日盈利排行榜 -->
		<DailyProfitRank />
		<TermsDaman />
		<SettingPanel type="daman" />
		<!--下载PWA应用-->
		<DownloadPWA />
		<Turntable />
		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<!-- 巴西站底部logo文字 -->
		<BottomLogoText />
</div>
</template>

<script setup lang="ts">
import Point from '@/components/common/Point.vue'
import DailyProfitRank from '@/components/Home/DailyProfitRank/index.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import SettingPanel from '@/components/Home/damanHome/SettingPanel/index.vue'
import TermsDaman from '@/components/Home/damanHome/TermsDaman/index.vue'
import GameScenesDaman from '@/components/Home/damanHome/GameScenesDaman/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import Turntable from '@/components/common/Turntable.vue'
import NoticeDaman from '@/components/Home/NoticeBar/index.vue'
import BottomLogoText from '@/components/common/BottomLogoText.vue'

import { GlobalStore, useCommonStore, useHomeStore, SettingStore } from '@/stores'

import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const router = useRouter()
const globalStore = GlobalStore()
const { setLoading } = useCommonStore()
const settingS = SettingStore()
// import { useApkState } from '@/stores/apk'
// const apkStore = useApkState()

function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}

setLoading(false)

// 是否已读
const isRead = ref(true)

async function getMessagesData() {
	const homeStore = useHomeStore()
	isRead.value = !(globalStore.getUserInfo.unRead > 0)
	homeStore.setReadState(isRead.value)
}
// 项目图标
const projectIcon = computed(() => settingS.getProjectLogo)
onMounted(() => {
	// 获取通知消息，判断是否已读
	getMessagesData()
	setLoading(false)
})
</script>

<style lang="scss">
.content-daman {
	font-family: $font-family;
	gap: 10px;
	padding-bottom: 320px !important;

	h1:before {
		border-radius: 4px;
	}

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
		}
	}

	.swiper_box {
		padding: 0;
		margin: 20px 0;
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

.nav-btn {
	width: 140px;
	height: 50px;
	border-radius: 10px;
	text-align: center;
	line-height: 48px;
	font-family: Inter;
	font-size: 22px;
	font-weight: 400;
	border: 1px solid var(--main-color);

	&.login-btn {
		font-size: 22px;
		color: var(--main-color);
		font-weight: 400;
	}

	&.register-btn {
		background: var(--main_gradient-color);
		color: #fff;
	}
}
</style>
