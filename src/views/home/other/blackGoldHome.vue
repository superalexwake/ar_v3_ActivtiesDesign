<template>
	<div class="content" id="bgHome">
		<NavBar>
			<template #left>
				<div class="logo">
					<img :src="projectIcon" alt="" />
				</div>
				<div class="languages">
					<LangPop />
					<span class="languages-text">{{$t('loginTips',[lotName,siteName])}}</span>
				</div>
			</template>
			<template #right>
				<div class="content__right">
					<div class="btn" @click="onDown" v-if="(apkStore.apk.value) != ApkType.FullApk">
						<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
							<g clip-path="url(#clip0_243_123505)">
								<circle cx="30" cy="30" r="28.5" stroke="#3F3F3F" stroke-width="3" />
								<path fill-rule="evenodd" clip-rule="evenodd"
									d="M29.9999 36.25L16.25 22.5543H25.4166V10H34.5833V22.5543H43.75L29.9999 36.25Z"
									fill="#3F3F3F" stroke="#3F3F3F" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
								<path d="M50 41H10" stroke="#3F3F3F" stroke-width="3" stroke-linecap="round" />
								<path d="M41.25 48.5H18.75" stroke="#3F3F3F" stroke-width="3" stroke-linecap="round" />
							</g>
							<defs>
								<clipPath id="clip0_243_123505">
									<rect width="60" height="60" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<span>{{ $t('downloadAPP') }}</span>
					</div>
					<div class="btn" @click="onClickRightH">
						<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
							<path
								d="M54.3525 27.2813C54.1013 13.8694 43.7044 3.03564 30.9375 3.03564H29.0625C16.2956 3.03564 5.89875 13.8694 5.6475 27.2794C3.405 28.5788 1.875 30.9769 1.875 33.75V37.5C1.875 41.6363 5.23875 45 9.375 45C13.5113 45 16.875 41.6363 16.875 37.5V33.75C16.8721 31.7748 16.0906 29.8803 14.6998 28.4777C13.3091 27.075 11.4214 26.2773 9.44625 26.2575C10.1794 15.3919 18.6863 6.78564 29.0625 6.78564H30.9375C41.3156 6.78564 49.8206 15.3919 50.5537 26.2575C48.5786 26.2773 46.6909 27.075 45.3002 28.4777C43.9094 29.8803 43.1279 31.7748 43.125 33.75V37.5C43.125 40.8863 45.3938 43.7213 48.48 44.6494C45.6947 48.3157 41.7173 50.8953 37.2337 51.9431C36.9242 51.0148 36.3309 50.2072 35.5376 49.6343C34.7443 49.0613 33.7911 48.752 32.8125 48.75C31.5693 48.75 30.377 49.2439 29.4979 50.123C28.6189 51.002 28.125 52.1943 28.125 53.4375C28.125 54.6807 28.6189 55.873 29.4979 56.7521C30.377 57.6312 31.5693 58.125 32.8125 58.125C33.611 58.124 34.3959 57.9181 35.0922 57.5271C35.7884 57.1362 36.3728 56.5732 36.7894 55.8919C40.1684 55.3008 43.3778 53.9795 46.1935 52.0202C49.0093 50.061 51.3637 47.511 53.0925 44.5481C56.0137 43.5244 58.125 40.7681 58.125 37.5V33.75C58.125 30.9769 56.595 28.5788 54.3525 27.2813ZM13.125 33.75V37.5C13.125 39.5681 11.4431 41.25 9.375 41.25C7.30687 41.25 5.625 39.5681 5.625 37.5V33.75C5.625 31.6819 7.30687 30 9.375 30C11.4431 30 13.125 31.6819 13.125 33.75ZM54.375 37.5C54.375 39.51 52.7812 41.1431 50.7938 41.2331L50.6475 41.1638C50.6344 41.1938 50.6138 41.2181 50.6006 41.2463C49.6109 41.2398 48.6639 40.8424 47.966 40.1407C47.2681 39.4389 46.876 38.4897 46.875 37.5V33.75C46.875 31.6819 48.5569 30 50.625 30C52.6931 30 54.375 31.6819 54.375 33.75V37.5Z"
								fill="#3F3F3F" />
						</svg>
						<span>{{ $t('customerServiceTitle') }}</span>
					</div>
				</div>
			</template>
		</NavBar>
		<!-- 头部轮播图 -->
		<Swiper />
		<!-- 滚动通知栏 -->
		<NoticeBar key="home" />
		<div class="balance" v-if="globalStore.token">
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
				<path
					d="M20 19.8182C15.0509 19.8182 11.04 15.8292 11.04 10.9071C11.04 5.98507 15.0509 2 20 2C24.9491 2 28.96 5.98903 28.96 10.9071C28.96 15.8252 24.9491 19.8182 20 19.8182Z"
					fill="#292929" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M20.3788 27.0402C20.1757 27.2624 19.8243 27.2624 19.6212 27.0402L14.3176 21.2395C8.47124 22.1545 4 27.1864 4 33.2567C4 35.3241 5.68552 37 7.76471 37H32.2353C34.3145 37 36 35.3241 36 33.2567C36 27.1864 31.5288 22.1545 25.6824 21.2395L20.3788 27.0402Z"
					fill="#292929" />
			</svg>
			<span>{{ globalStore.getUserInfo.nickName }}-</span>
			<span>{{ currency(walletStore.getAmount) }}</span>
			<span @click="onGetWallet" class="balance-refresh">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
					<path
						d="M4.31322 9.3733C4.56545 9.37359 4.81243 9.44542 5.02548 9.58046C5.23852 9.71549 5.4089 9.90818 5.51681 10.1362C5.62473 10.3642 5.66577 10.6181 5.63516 10.8684C5.60455 11.1188 5.50355 11.3554 5.34388 11.5506L5.34922 11.552C4.55792 12.7353 4.09671 14.1084 4.01317 15.5294C3.92963 16.9505 4.22679 18.3682 4.87399 19.6361C5.52119 20.904 6.49499 21.9762 7.69489 22.7422C8.8948 23.5081 10.2773 23.94 11.6999 23.9933L11.9999 24L18.6665 23.9986V21.4946C18.6664 21.3766 18.6924 21.2601 18.7425 21.1533L18.8012 21.0506C18.919 20.8742 19.102 20.7518 19.3101 20.7103C19.5181 20.6688 19.7341 20.7116 19.9106 20.8293L25.6666 24.6666C25.776 24.7397 25.8657 24.8387 25.9278 24.9547C25.9899 25.0708 26.0223 25.2004 26.0223 25.332C26.0223 25.4636 25.9899 25.5931 25.9278 25.7092C25.8657 25.8253 25.776 25.9242 25.6666 25.9973L19.9092 29.8373C19.7887 29.9177 19.6485 29.9639 19.5038 29.9709C19.359 29.9779 19.2151 29.9454 19.0873 29.8769C18.9596 29.8085 18.8529 29.7066 18.7785 29.5822C18.7042 29.4578 18.665 29.3156 18.6652 29.1706V26.664L11.9999 26.6666C10.055 26.6668 8.14709 26.1352 6.4825 25.1294C4.8179 24.1236 3.45999 22.6818 2.55562 20.9599C1.65126 19.2381 1.23486 17.3018 1.35147 15.3604C1.46808 13.419 2.11325 11.5465 3.21722 9.9453C3.34 9.76831 3.50384 9.6237 3.69471 9.52385C3.88558 9.42401 4.0978 9.37189 4.31322 9.37197V9.3733ZM13.1985 2.38397C13.2863 2.51541 13.3332 2.66991 13.3332 2.82797V5.3333H19.9999C21.9298 5.33301 23.8236 5.85631 25.4796 6.84745C27.1355 7.83859 28.4915 9.26042 29.4031 10.9614C30.3148 12.6625 30.7478 14.579 30.6561 16.5067C30.5644 18.4344 29.9515 20.3011 28.8826 21.908L28.8559 21.948C28.8314 21.9847 28.8065 22.0211 28.7812 22.0573C28.5306 22.3506 28.1612 22.5373 27.7479 22.5373C27.4891 22.5373 27.2358 22.462 27.0191 22.3206C26.8023 22.1791 26.6314 21.9776 26.5272 21.7407C26.423 21.5037 26.3901 21.2416 26.4323 20.9863C26.4746 20.7309 26.5902 20.4934 26.7652 20.3026L26.7519 20.292C27.5073 19.1038 27.9358 17.7372 27.994 16.3304C28.0522 14.9236 27.738 13.5263 27.0833 12.2798C26.4286 11.0333 25.4565 9.98161 24.2652 9.23107C23.0739 8.48053 21.7056 8.0577 20.2985 8.0053L19.9999 7.99997L13.3332 7.99863V10.5053C13.3334 10.6502 13.2943 10.7925 13.2199 10.9169C13.1456 11.0413 13.0388 11.1432 12.9111 11.2116C12.7834 11.2801 12.6394 11.3125 12.4947 11.3056C12.3499 11.2986 12.2098 11.2524 12.0892 11.172L6.33322 7.33063C6.22376 7.25755 6.13403 7.1586 6.07197 7.04254C6.0099 6.92648 5.97744 6.79691 5.97744 6.6653C5.97744 6.53369 6.0099 6.40411 6.07197 6.28806C6.13403 6.172 6.22376 6.07304 6.33322 5.99997L12.0905 2.15997C12.178 2.10174 12.2761 2.06131 12.3792 2.04099C12.4822 2.02066 12.5883 2.02085 12.6913 2.04152C12.7944 2.0622 12.8923 2.10297 12.9795 2.16149C13.0668 2.22002 13.1417 2.29517 13.1999 2.38263L13.1985 2.38397Z"
						fill="#775B3E" />
				</svg>
			</span>
			<span class="balance-msg" @click="router.push({
				name: 'Messages'
			})">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd"
						d="M14 41H34C40 41 44 38 44 31V17C44 10 40 7 34 7H14C8 7 4 10 4 17V31C4 38 8 41 14 41ZM19.3181 24.164C20.6181 25.224 22.3181 25.744 23.9981 25.744C25.6781 25.744 27.3781 25.224 28.6581 24.164L34.9181 19.164C35.5781 18.664 35.6781 17.704 35.1581 17.064C34.6581 16.404 33.6981 16.304 33.0581 16.824L26.7981 21.824C25.2781 23.044 22.6981 23.044 21.1781 21.824L14.9181 16.824C14.6062 16.5974 14.2189 16.5 13.8369 16.5521C13.4549 16.6042 13.1078 16.8017 12.8679 17.1035C12.628 17.4053 12.5139 17.788 12.5493 18.1719C12.5848 18.5558 12.767 18.9112 13.0581 19.164L19.3181 24.164Z"
						fill="#292929" />
				</svg>
			</span>
		</div>
		<Game />
		<LuckyWinners />
		<DailyProfitRank />

		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<!--下载PWA应用-->
		<DownloadPWA />
		<Turntable />
</div>
</template>

<script setup lang="ts">
import LangPop from '@/components/Login/LangPopup.vue'
import LuckyWinners from '@/components/Home/LuckyWinners/index.vue'
import DailyProfitRank from '@/components/Home/DailyProfitRank/index.vue'
import Game from '@/components/Home/BlackGoldHome/Game/index.vue'
import NoticeBar from '@/components/Home/NoticeBar/index.vue'
import Swiper from '@/components/Home/Swiper/index.vue'
import Turntable from '@/components/common/Turntable.vue'
// import InviteTurntable from '@/components/common/InviteTurntable.vue'
import DownloadPWA from '@/components/common/DownloadPWA.vue'
import { GlobalStore, useCommonStore, useWalletStore, SettingStore } from '@/stores'
import { currency} from '@/utils'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHome } from '@/hooks'
import { useServer } from '@/hooks/useServe.hook'
import { useApkState, ApkType } from '@/stores/apk'

const { t: $t } = useI18n()
const router = useRouter()
const walletStore = useWalletStore()
const { setLoading } = useCommonStore()
const lotName = computed(() => SettingStore().getProjectName)

const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
function onClickRightH() {
	getSelfCustomerServiceLink()
	// router.push({
	// 	name: 'CustomerService'
	// })
}
const apkStore = useApkState()


const {
	onDown,
	projectIcon,
	getMessagesData,
} = useHome()
//下载
const siteName = computed(() => import.meta.env.VITE_SITE || 'Game')

setLoading(false)
async function onGetWallet() {
	walletStore.resetData(false, true) // 参数1，是否弹提示，参数2，是否可以回收余额
}
const globalStore = GlobalStore()


onMounted(() => {
	// getMessage()
	// 获取通知消息，判断是否已读
	getMessagesData()
	setLoading(false)
})
</script>

<style lang="scss" scoped>
.content {
	font-family: $font-family;
	gap: 10px;
	padding-bottom: 320px;

	&__right {
		display: flex;
		flex-direction: column;
		gap: 12px;

		.btn {
			width: 250px;
			height: 78px;
			color: #292D2E;
			font-size: 24px;
			font-style: normal;
			font-weight: 500;
			line-height: 78px;
			border-radius: 20px;
			text-align: center;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			background: linear-gradient(180deg, #F6E3A3 0%, #D2A753 100%);
		}

		span {
			display: inline-block;
			margin-left: 10px;
			white-space: pre-wrap;
			width: 150px;
			text-align: center;
			line-height: 30px;
		}

		svg {
			vertical-align: middle;
			width: 50px;
			height: 50px;
		}
	}

	.balance {
		padding: 10px 20px;
		border-radius: 10px;
		height: 60px;
		display: flex;
		align-items: center;
		font-size: 24px;
		color: #292929;
		background: linear-gradient(180deg, #F6E3A3 0%, #D2A753 100%);

		&-refresh {
			width: 32px;
			height: 32px;
			margin-left: 10px;

			svg {
				width: 100%;
				height: 100%;
			}
		}

		&-msg {
			margin-left: auto;
			width: 48px;
			height: 48px;

			svg {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.logo {
	width: 167px;
	height: 68px;
	margin-top: -20px;

	img {
		width: 100%;
	}

}

.languages {
	display: flex;
	align-items: center;

	&-text {
		color: #D9AC4F;
		text-align: center;
		font-size: 24px;
		font-weight: 500;
		line-height: 24px;
		margin-left: 70px;
	}
}

#bgHome {
	:deep(.navbar__content) {
		// 该样式控制内容的高度
		height: 176px !important;
		.navbar__content-left {
			position: relative;
			flex-direction: column;
			align-items: flex-start;
			flex: 1;
			left: 0;
			padding-left: 24px;
		}

		.lang-text {
			display: none;
		}
	}
	.navbar {
		height: 176px;
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
	background: #292929;
	color: #fff;

	&__content {
		position: relative;
		width: 100%;


	}


}

</style>
