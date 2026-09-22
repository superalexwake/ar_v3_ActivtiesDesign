<template>
	<div id="home" class="red-home content">
		<!--下载推广信息条-->
		<div class="hangBar"  v-if="ishowBar">
			<NavBar class="downBar">
				<template #left>
					<div class="leftInfo">
						<div class="logo">
							<img :src="setting.getWebIco" />
						</div>
						<div class="destion">
							<div>{{$t('barInfo1')}}</div>
							<div>{{$t('barInfo2')}}</div>
						</div>
					</div>
				</template>
				<template #right>
					<div class="rightInfo"><!-- v-if="(apkStore.apk.value) != ApkType.FullApk"-->
						<img class="icon1" src="@icon/home/Clipboard.png" alt="">
						<div class="town" @click.stop="onDown">{{$t('installBar')}}</div>
						<img class="icon2" src="@icon/home/close.png"  @click="closeBar" alt="">
					</div>
				</template>
			</NavBar>
			<div class="hang">
				<img :src="projectIcon" alt="" style="height:80%" />
				<div class="content__right">
					<div class="message" @click="onClickRightH">
						<svg-icon name="navInfomation" />
						<Point v-show="!isRead" class="point" />
					</div>
					<LangPop />
				</div>
			</div>
		</div>

		<!--顶部的导航条-->
		<NavBar class="white" v-if="!ishowBar">
			<template #left>
				<img :src="projectIcon" alt="" />
			</template>
			<template #right>
				<div class="content__right">
					<div class="message" @click="onClickRightH">
						<svg-icon name="navInfomation" />
						<Point v-show="!isRead" class="point" />
					</div>
					<LangPop />
				</div>
			</template>
		</NavBar>

		<!-- 头部轮播图 -->
		<Swiper />

		<!-- 滚动通知栏 -->
		<NoticeBar key="home" color="red" />

		<!--信息栏-->
		<PersonCenterInfoBar />

		<!-- 热门、彩票、游戏选项卡 -->
		<GameList ref="gameListRef" />

		<bigaward />
		<!-- 中奖信息 -->
		<LuckyWinners />

		<!-- 今日盈利排行榜 -->
		<DailyProfitRank />

		<!-- 巴西站底部logo文字 -->
		<!--<BottomLogoText />-->

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
import GameList from '@/components/Home/Public6Home/GameList/index.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import bigaward from '@/components/Home/Public6Home/GameList/bigaward.vue';
import PersonCenterInfoBar from '@/components/Home/Public6Home/PersonInfoBar.vue'
import { useCommonStore,SettingStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'
import LangPop from '@/components/Login/LangPopup.vue'

// import { useApkState, ApkType } from '@/stores/apk'
// import BottomLogoText from '@/components/common/BottomLogoText.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'

const setting = SettingStore()
const { t: $t } = useI18n()
const router = useRouter()
const { setLoading } = useCommonStore()
const { onDown, projectIcon, isRead, getMessagesData } = useHome()

/*是否显示下载信息栏*/
const ishowBar = ref(true)
// const ishowBar = ref(sessionStorage.getItem('ishowBar') !== 'false')
const closeBar=()=>{
	ishowBar.value = false
	// sessionStorage.setItem('ishowBar', 'false')
}


function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}

setLoading(false)
const gameListRef = ref()
// const apkStore = useApkState()

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
	padding-bottom: 320px;

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
				width:48px;
				height:48px;
				color: var(--main-color);
			}
		}

		.point {
			position: absolute;
			top: 2px;
			right: 0px;
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
	width: 620px;
	//height: 930px;
	//border-radius: 15px;
	//display: flex;
	//flex-direction: column;
	//align-items: center;
	//justify-content: flex-start;
	//overflow: hidden;
	&__content {
		//position: relative;
		//width: 100%;
		//


	}

	&__footer {
		//z-index: 100;
		//position: fixed;
		//bottom: 30px;
		//display: flex;
		//flex-grow: 1;
		//gap: 20px;
		//width: 90%;
	}

	.van-button__text {
		font-size: 32px;
		font-weight: 700;
		font-family: 'Inter';
		font-style: normal;
		letter-spacing: 5px;
		color: #fff;
		//width: 80%;
		//height: 70px;
		//text-align: center;
		//line-height: 70px;
		//border-radius: 80px;
		//z-index: 100;
	}
	&__confirm{
		background: var(--light-main_gradient-color, var(--bg_color_L3));
	}
}


</style>
