<template>
	<div class="login__container" ref="loginContainerRef">
		<NavBar @click-left="onClickLeft" class="main" :leftArrow="true" :headLogo="true">
			<template #right>
				<LangPop />
			</template>
		</NavBar>
		<div class="login__container-heading">
			<h1 class="login__container-heading__title">{{ t('login') }}</h1>
			<div class="login__container-heading__subTitle">
				<div>{{ $t('pleaseloginphoneoremail') }}</div>
				<div>{{ $t('forgetyourpassword') }}</div>
			</div>
		</div>
		<div class="login_container-tab">
			<div class="tab" :class="[tab == 'mobile' ? 'active' : '']" @click="handle('mobile')">
				<svg-icon name="phone" />
				<div>
					{{ $t('phoneN') }}
				</div>
			</div>
			<div class="tab" :class="[tab == 'email' ? 'active' : '']" @click="handle('email')">
				<div>
					<svg-icon name="email" />
					<svg-icon v-show="userStore.isOpenExternalAccount" name="user" />
				</div>
				<div>
					{{ userStore.isOpenExternalAccount ? $t('otherlogin') : $t('emaillogin') }}
				</div>
			</div>
		</div>
		<div class="login__container-form">
			<div class="tab-content" :class="[tab == 'mobile' ? 'activecontent' : '']">
				<SignIn ref="signIn" />
			</div>
			<div class="tab-content" :class="[tab == 'email' ? 'activecontent' : '']">
				<EmailSignIn ref="signIn" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import LangPop from '@/components/Login/LangPopup.vue'
import SignIn from '@/components/Login/SignIn.vue'
import EmailSignIn from '@/components/Login/EmailSignIn.vue'
import { useUserStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useGlobalDialog } from '@/hooks'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import i18n from '@/languages'
const { t } = i18n.global

// 登录和注册页
const router = useRouter()
const userStore = useUserStore()
// 获取是否开启短信相关功能
userStore.getRegisterState()
const tab = ref('mobile')
const loginContainerRef = ref<HTMLElement>(undefined as unknown as HTMLElement)
userStore.userForm.logintype = tab.value
const { openAll } = useGlobalDialog()
function onClickLeft() {
	router.replace('/')
}
const handle = (item: string) => {
	tab.value = item
	userStore.userForm.logintype = item
	userStore.userForm.password = ''
	userStore.remember(true)
}
onBeforeRouteLeave((to, from, next) => {
	next()
	// 登录后可能 redirect 回原页而非首页，仍须入队；显示路由由各弹窗 allowedRoutes 兜底
	// currentRoute 要到 finalizeNavigation 才更新，守卫内入队会被 routeGuard 按旧路由丢弃，故等导航确认
	const stop = router.afterEach(() => {
		stop()
		void openAll()
	})
})
onMounted(async () => {
	const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
	if (!localStorage.getItem('arvId')) {
		try {
			const fp = await FingerprintJS.load();
			const result = await fp.get();
			localStorage.setItem('arvId', result.visitorId);
		} catch (error) {
			console.error('Error generating fingerprint:', error);
		}
	}
	userStore.remember(true)
	//await userStore.getIp()
})
</script>

<style lang="scss" scoped>
.right {
	display: flex;
	align-items: center;
	font-size: 30px;
	color: var(--textW);
	img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		overflow: hidden;
		display: block;
		margin-right: 10px;
	}
}

.login__container {
	height: 100%;
	overflow-y: scroll;
	white-space: nowrap;
	-webkit-overflow-scrolling: touch;

	&::-webkit-scrollbar {
		width: 0;
	}
	.van-nav-bar {
		background-color: #f6f6f6;

		.leftArrow {
			width: 34px;
			height: auto;
		}
	}
	.login_container-tab {
		width: 100%;
		overflow-x: hidden;
		display: flex;
		flex-direction: row;
		overflow: hidden;
		padding: 0 40px;
		.tab {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 14px 0;
			align-items: center;
			border-bottom: 2px solid var(--Dividing-line_color);
			color: var(--text_color_L2);
			gap: 20px;
			font-size: 30px;
			font-weight: 700;
			line-height: 30px;
			svg {
				height: 48px;
				width: 48px;
			}
		}
		.active {
			color: var(--main-color);
			border-bottom: 4px solid var(--main-color);
		}
		.basicimg {
			width: 48px;
			height: 48px;
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
		}
	}
	&-heading {
		min-height: 200px;
		background: var(--light-main_gradient-color,var(--bg_color_L2));
		padding: 0 40px;
		&__title {
			font-size: 32px;
			font-weight: 700;
			color: #fff;
			padding-top: 20px;
		}

		&__subTitle {
			display: flex;
			flex-direction: column;
			font-size: 22px;
			margin-top: 22px;
			margin-bottom: 40px;
			color: #fff;
			white-space: normal;
		}
	}

	&-form {
		position: relative;
		margin-top: 56px;
		overflow: hidden;
		padding-inline: 40px;
		margin-bottom: 56px;
		.tab-content {
			display: none;
		}
		.activecontent {
			display: block;
		}
		&__wrapper {
			position: relative;
			display: flex;
			gap: 50px;
			width: 100%;
			height: 100%;
			box-sizing: content-box;

			& > div {
				flex-shrink: 0;
				width: 100%;
			}
		}
	}
}
</style>
