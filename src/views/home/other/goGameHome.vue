<template id="navbar">
	<div class="content-daman content">
		<div class="homeHead">
			<div class="noLogin" v-if="!globalStore.getToken">
				<div class="logo">
					<img :src="projectIcon" alt="" />
				</div>
				<div class="register" @click="goOtherPage('register')">Register</div>
				<svg width="2" height="18" viewBox="0 0 2 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path id="Line 1" d="M0.543945 1.44983L0.543946 16.5502" stroke="#343A43" stroke-linecap="round" />
				</svg>
				<div class="login" @click="goOtherPage('login')">Log in</div>
			</div>
			<div v-else class="userInfo">
				<div class="userInfo-container">
					<img :src="avatarUrl" :data-img="defaultImgAvatar1" class="userAvatar" />
					<div class="userInfo-detail">
						<div class="name">{{ globalStore.getUserInfo.nickName }}</div>
						<div class="wallet">{{ currency(money) }}</div>
					</div>
				</div>
				<div class="withdraw" @click="goOtherPage('Withdraw')">Withdraw</div>
				<svg width="2" height="18" viewBox="0 0 2 18" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path id="Line 1" d="M0.543945 1.44983L0.543946 16.5502" stroke="#343A43" stroke-linecap="round" />
				</svg>
				<div class="recharge" @click="goOtherPage('Recharge')">Recharge</div>
			</div>
		</div>

		<!--下载PWA应用-->
		<DownloadPWA />
		<!-- 头部轮播图 -->
		<Swiper />
		<!-- 滚动通知栏 -->
		<NoticeDaman />
		<GameScenesDamanNew />
		<!-- 热门、彩票、游戏选项卡 -->
		<GameScenesDamanHome />
		<TermsDamanNew />
		<SettingPanel type="daman" />
		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<Turntable />
</div>
</template>

<script setup lang="ts">
import SettingPanel from '@/components/Main/SettingPanel/index.vue'
import Swiper from '@/components/Home/goGame/Swiper.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import DownloadPWA from '@/components/Home/goGame/DownloadPWA.vue'
import NoticeDaman from '@/components/Home/goGame/NoticeBar/index.vue'
import GameScenesDamanNew from '@/components/Home/goGame/GameScenesDamanNew.vue'
import GameScenesDamanHome from '@/components/Home/goGame/GameScenesDamanHome.vue'
import TermsDamanNew from '@/components/Home/goGame/TermsDamanNew.vue'
import { GlobalStore, useCommonStore, useHomeStore, SettingStore, useWalletStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGlobalDialog } from '@/hooks'
import Turntable from '@/components/common/Turntable.vue'
import { currency } from '@/utils'
import { useAssets } from '@/hooks/useAssets'

const router = useRouter()
const globalStore = GlobalStore()
const { downAppTip } = useGlobalDialog()
const { setLoading } = useCommonStore()
const settingS = SettingStore()
const walletStore = useWalletStore()
const money = computed(() => walletStore.getAmount)
const { getAvatarUrl, defaultImgAvatar1 } = useAssets()

const avatarUrl = ref(getAvatarUrl(globalStore.getUserInfo.userPhoto));
setLoading(false)

// 是否已读
const isRead = ref(true)

async function getMessagesData() {
	const homeStore = useHomeStore()
	isRead.value = !(globalStore.getUserInfo.unRead > 0)
	homeStore.setReadState(isRead.value)
}

const goOtherPage = (name: any) => {
	if (name === 'withdraw' || name === 'recharge') {
		downAppTip(name);
		return
	}
	router.push({
		name
	})
	// GetGrandPrizeReward()
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
#navbar {
	z-index: 1;
}

.content-daman {
	font-family: $font-family;
	gap: 10px;
	padding-bottom: 280px !important;
	z-index: 1;

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

	.homeHead {
		height: 92px;
		border-radius: 16px;
		background: var(--bg_color_L2);
		padding: 0 24px;
		width: 100%;
		//margin-bottom: 20px;
		.noLogin {
			height: 100%;
			display: flex;
			align-items: center;

			.logo {
				flex: 1;
				display: flex;
				align-items: center;

				img {
					height: 64px;
					width: auto;
				}
			}

			.register {
				font-size: 26px;
				background: var(--main-color);
				border-radius: 12px;
				font-weight: 500;
				line-height: 54px;
				padding: 0 18px;
				color: #f6f6f6;
			}

			svg {
				height: 30px;
				margin: 0 20px;
			}

			.login {
				color: var(--text_color_L1);
				font-size: 26px;
				font-weight: 500;
			}
		}

		.userInfo {
			display: flex;
			align-items: center;
			height: 100%;
			width: 100%;

			&-container {
				display: flex;
				flex: 1;

				.userAvatar {
					width: 68px;
					height: 68px;
					margin-right: 20px;
				}
			}

			&-detail {
				.name {
					background: var(--Text-effects, linear-gradient(180deg, #f5f6ff -2.72%, rgba(245, 246, 255, 0) 219.64%));
					background-clip: text;
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					font-family: Lato;
					font-size: 28px;
				}

				.wallet {
					color: #858C96;
					font-size: 24px;
					margin-top: 14px;
				}
			}

			.withdraw,
			.recharge {
				font-size: 22px;
				padding-top: 56px;
				color: var(--text_color_L1);
				background-position: top;
				background-repeat: no-repeat;
				background-size: 50px 56px;
			}

			.withdraw {
				background-image: url('@/assets/svg/withdraw.svg');
			}

			.recharge {
				background-image: url('@/assets/svg/recharge.svg');
			}

			svg {
				height: 40px;
				margin: 0 20px;
			}
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

.nav-btn {
	width: 140px;
	height: 50px;
	border-radius: 10px;
	text-align: center;
	line-height: 48px;
	font-family: Inter;
	font-size: 22px;
	font-weight: 400;
	z-index: 1;

	&.login-btn {
		color: #f2f7ff;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-family: Inter;
		font-size: 26px;
		font-style: normal;
		font-weight: 500;
		line-height: normal;
		letter-spacing: -0.39px;
	}

	&.register-btn {
		background: #1d6be1;
		color: #fff;
		display: flex;
		padding: 9px;
		justify-content: center;
		align-items: center;
		color: var(--Red-0, #f6f6f6);
		text-align: center;
		font-family: Inter;
		font-size: 26px;
		font-weight: 500;
		letter-spacing: -0.39px;
	}
}
</style>
