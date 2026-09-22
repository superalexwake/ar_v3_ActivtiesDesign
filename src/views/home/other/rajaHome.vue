<template>
	<NavBar class="rajaNav">
		<template #left>
			<img style="height: 40px" :src="projectIcon" alt="" />
		</template>
		<template #right>
			<div class="content__right">
				<div class="message" @click="onClickRightH">
					<svg-icon name="notification" />
					<Point v-show="!isRead" class="point" />
				</div>
				<!-- <div v-if="isAppDownload" class="homeIcon down" @click="onDown"></div> -->
				<i class="rajaCustomer" @click="goToCustomer"></i>
			</div>
		</template>
	</NavBar>
	<div class="rajaHome">
		<div class="nologin" v-if="!globalStore.getToken">
			<div class="nav-btn login" @click=" router.push({ name: 'login' })">{{ $t('login') }}</div>
			<div class="nav-btn" @click=" router.push({ name: 'register' })">{{ $t('register') }}</div>
		</div>
		<NoticeBar />
		<Swiper :isShowButton="true" />
		<div class="raja-icon">
			<div class="raja_trun" @click="router.push({ name: 'Turntable' })"></div>
			<div class="raja_vip" @click="router.push({ name: 'vip' })"></div>
			<!--			<svg-icon name="raja_trun" @click="router.push({ name: 'Turntable' })"/>-->
			<!--			<svg-icon name="raja_vip" @click="router.push({ name: 'vip' })"/>-->
		</div>
		<game />

		<bigaward />
		<!-- 中奖信息 -->
		<Winner />
		<!-- 今日盈利排行榜 -->
		<Rank />
		<Team />
	</div>
	<!--下载PWA应用-->
	<DownloadPWA />
	<Turntable />
	<!-- 邀请转盘 -->
	<!-- <InviteTurntable /> -->
</template>

<script setup lang="ts">
import Swiper from '@/components/Home/Swiper/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import game from '@/components/Home/rajaHome/game.vue'
import Winner from '@/components/Home/rajaHome/winner.vue'
import Rank from '@/components/Home/rajaHome/rank.vue'
import Team from '@/components/Home/rajaHome/team.vue'
import bigaward from '@/components/Home/rajaHome/bigaward.vue';
import { GlobalStore } from '@/stores'
import { useHome } from '@/hooks'
import { useRouter } from 'vue-router'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from "@/components/common/DownloadPWA.vue";
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import Point from "@/components/common/Point.vue";
import { useServer } from "@/hooks/useServe.hook";

const { projectIcon } = useHome()
const globalStore = GlobalStore()
const router = useRouter()

const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })

function onClickRightH() {
	router.push({
		name: 'Messages'
	})
}

function goToCustomer() {
	// router.push({ name: 'CustomerService' })
	getSelfCustomerServiceLink()
}

</script>
<style lang="scss" scoped>
.rajaHome {
	background: #260002;
	padding: 24px 24px 320px 24px;

	.raja-icon {
		display: flex;
		justify-content: space-between;
		padding: 10px 12px 32px;

		>div {
			width: 327px;
			height: 118px;
			background: url("@/assets/rajaStyle/icons/home/turn_icon.png") no-repeat;
			background-size: 100% auto;

			&.raja_vip {
				width: 329px;
				background: url("@/assets/rajaStyle/icons/home/vip_icon.png") no-repeat;
				background-size: 100% auto;
			}
		}
	}
}

.nologin {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 44px;
	padding: 11px 0 34px;

	.nav-btn {
		height: 78px;
		width: 229px;
		color: var(--text_color_L1);
		font-size: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 400;
		line-height: normal;
		background: #FF4144;
		border-radius: 16px;

		&.login {
			background: #ff7119;
		}
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
	}
}

img {
	height: 60px;
	width: auto;
}

.nav-right {
	display: flex;
	align-items: center;
	gap: 20px;

	.nav-btn {
		border: 1px solid var(--main-color);
		color: var(--main-color);
		box-sizing: border-box;
		height: 60px;
		line-height: 60px;
		padding: 0 36px;
		border-radius: 10px;
		font-size: 24px;

		&.login {
			background: var(--main_gradient-color);
			color: var(--text_color_L4);
		}
	}

	svg {
		width: 48px;
		height: 48px;
	}

	.money {
		color: var(--main-color);

		.text {
			color: var(--text_color_L2);
		}
	}
}

.noticeBar__container {
	width: calc(100% - 56px);
	margin: 40px auto;
	background-color: var(--bg_color_L2);
}
</style>
