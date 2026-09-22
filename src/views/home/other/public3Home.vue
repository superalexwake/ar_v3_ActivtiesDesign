<template>
	<NavBar>
		<template #left>
			<img :src="projectIcon" alt="" />
		</template>
		<template #right>
			<div class="nav-right" v-if="!globalStore.getToken">
				<div class="nav-btn login" @click="
					router.push({
						name: 'login'
					})
					">
					{{ $t('login') }}
				</div>
				<div class="nav-btn" @click="
					router.push({
						name: 'register'
					})
					">
					{{ $t('register') }}
				</div>
			</div>
			<div class="nav-right" v-else>
				<svg-icon name="wallet1" />
				<div class="money">
					<div class="text">{{ $t('balance') }}</div>
					<div>{{ currency(walletStore.getAmount) }}</div>
				</div>
			</div>
		</template>
	</NavBar>
	<div class="p3home">
		<Swiper :isShowButton="true" />
		<NoticeBar />
		<GameList />
		<!-- 中奖信息 -->
		<Winner />
		<!-- 今日盈利排行榜 -->
		<Rank />
		<Team />
	</div>
	<!--下载PWA应用-->
	<DownloadPWA />
	<!-- 邀请转盘 -->
	<!-- <InviteTurntable /> -->
	<Turntable />
</template>

<script setup lang="ts">
import Swiper from '@/components/Home/Swiper/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import GameList from '@/components/Home/Public3Home/gameList.vue'
import Winner from '@/components/Home/Public3Home/winner.vue'
import Rank from '@/components/Home/DailyProfitRank/index.vue'
import Team from '@/components/Home/Public3Home/team.vue'
import { GlobalStore, SettingStore, useWalletStore } from '@/stores'
import { useHome } from '@/hooks'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { currency } from '@/utils'
import Turntable from '@/components/common/Turntable.vue'
import DownloadPWA from "@/components/common/DownloadPWA.vue";
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
const { projectIcon } = useHome()
const globalStore = GlobalStore()
const walletStore = useWalletStore()
const setting = SettingStore()
const router = useRouter()

onMounted(() => {
	if (globalStore.getToken) {
		if (setting.getIsSwitchSaasBalance) {
			walletStore.GetARGameAndPlatWallets(false);
		} else {
			walletStore.resetData(false, false);
		}
	}
})

</script>
<style lang="scss" scoped>
.p3home {
	padding: 0 24px 320px 24px;

	.swiper_box {
		margin-top: 20px;
		padding: 0;
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
