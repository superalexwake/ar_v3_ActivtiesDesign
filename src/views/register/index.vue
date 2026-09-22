<template>
	<div class="resgister__C">
		<NavBar @click-left="onClickLeft" :leftArrow="true" :headLogo="true" class="main">
			<template #right>
				<LangPop />
			</template>
		</NavBar>
		<div class="resgister__C-heading">
			<h1 class="resgister__C-heading__title">{{ $t('register') }}</h1>
			<div class="resgister__C-heading__subTitle">
				<span>{{ $t('registerbyphoneoremail') }}</span>
			</div>
		</div>
		<div class="login_container-tab">
			<div v-if="registerData.registerMobileState != '0'" class="tab" :class="[tab == 'phone' ? 'active' : '']"
				@click="handle('phone')">
				<svg-icon name="phone" />
				<div>
					{{ $t('phoneregister') }}
				</div>
			</div>
			<div v-if="registerData.registerEmailState != '0'" class="tab" :class="[tab == 'email' ? 'active' : '']"
				@click="handle('email')">
				<svg-icon name="email" />
				<div>
					{{ $t('emailregister') }}
				</div>
			</div>
		</div>

		<div class="resgister__C-form">
			<div v-if="registerData.registerMobileState != '0'" class="tab-content"
				:class="[tab == 'phone' ? 'activecontent' : '']">
				<Register ref="register" :registerData="registerData" @submit="submit" />
			</div>
			<div v-if="registerData.registerEmailState != '0'" class="tab-content"
				:class="[tab == 'email' ? 'activecontent' : '']">
				<EmailRegister ref="register" :registerData="registerData" @submit="submit" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import LangPop from '@/components/Login/LangPopup.vue'
	import Register from '@/components/Login/Register.vue'
	import EmailRegister from '@/components/Login/EmailRegister.vue'
	import { onMounted, ref } from 'vue'
	import { onBeforeRouteLeave, useRouter } from 'vue-router'
	import type { ResRegisterState } from '@/types/api'
	import { AwaitApiResult } from '@/utils'
	import { RegisterState } from '@/api'
	import { GlobalStore, useUserStore } from '@/stores'
	import { useGlobalDialog } from "@/hooks";
	const { openAll } = useGlobalDialog()
	const globalStore = GlobalStore()
	const user = useUserStore()
	const visitorId = ref('')
	// 登录和注册页
	// 泰国电话 限制10位 不足10位 将按钮置灰
	const registerData = ref<any>({
		isRegisterState: '1', //是否开放注册,默认开放
		SMSstate: '0', //是否开放短信注册，默认不开放
		registerStateMsg: '', //是否开放注册内容
		/*	hasCaptcha: '0',*/
		hasRegisterCaptcha: '0',
		registerEmailState: '0',
		registerMobileState: '0',
		isOpenRegisterSMS: '0',
		isOpenRegisterEmail: '0',
		isInvitecode: '0' //是否开启邀请码必填
	})
	const tab = ref('phone')
	const router = useRouter()
	// 判断是否登录,登录后直接跳转首页
	if (globalStore.token) {
		router.push({ name: 'home' })
	}

	// 处理切换
	const handle = (item: string) => {
		tab.value = item
	}
	onBeforeRouteLeave((to, from, next) => {
		next();
		// 注册后可能 redirect 回原页而非首页，仍须入队；显示路由由各弹窗 allowedRoutes 兜底
		// currentRoute 要到 finalizeNavigation 才更新，守卫内入队会被 routeGuard 按旧路由丢弃，故等导航确认
		const stop = router.afterEach(() => {
			stop()
			void openAll()
		})
	})
	const register = ref()

	function onClickLeft() {
		router.push({ name: 'home' })
	}

	async function registerState() {
		const res: ObjResNull<ResRegisterState> = await AwaitApiResult(RegisterState())
		if (res) {
			registerData.value.isRegisterState = res.data.registerState //是否开放注册1：开放注册
			registerData.value.registerStateMsg = res.data.registerStateMsg //是否开放注册内容
			registerData.value.registerEmailState = res.data.registerEmailState //是否开放邮件注册
			registerData.value.registerMobileState = res.data?.registerMobileState // 是否开放手机注册
			registerData.value.isOpenRegisterSMS = res.data?.isOpenRegisterSMS // 是否开启短信验证码
			registerData.value.isOpenRegisterEmail = res.data?.isOpenRegisterEmail // 是否开启邮箱验证码
			registerData.value.hasRegisterCaptcha = res.data.isOpenRegisterCaptcha
			registerData.value.isInvitecode = res.data?.isInvitecode
			user.setTermAndPolicy(Boolean(res.data?.registerPrivacyChecked === '1'))
			console.log('res', res)
			if (Number(res.data.registerEmailState) + Number(res.data?.registerMobileState) == 0) {
				if (res.data?.isOpenRegisterSMS !== '1') {
					tab.value = 'email'
				}
				router.push({ name: 'login' })
			} else {
				registerData.value.registerSMSState = res.data.registerSMSState //是否开放短信注册
				if (registerData.value.registerEmailState !== '0' && res.data?.registerMobileState == '0') {
					tab.value = 'email'
				}
			}
		}
	}
	registerState()


	// 兼容 dataLayer
	const dataLayer: any[] = (window as any).dataLayer || [];
	function gtag(...args: any[]) {
		dataLayer.push(args);
	}

	// 提取邀请码
	function getInvitationCodeFromHash(): string | null {
		const hash = window.location.hash;
		const match = hash.match(/invitationCode=([\d]+)/);
		return match ? match[1] : null;
	}

	// 初始化 Google Analytics
	const invitationCode: any = ref(null);
	const submit = () => {
		if (invitationCode.value) {
			console.log('提交邀请码:', invitationCode.value);
			window.gtag && window.gtag('event', 'register_button_click', {
				invitation_code: invitationCode.value
			});
		}
	}
	getInvitationCodeFromHash();
	onMounted(async () => {
		invitationCode.value = getInvitationCodeFromHash();
		if (invitationCode.value) {
			if (window.gtag) {
				window.gtag('event', 'page_view_with_invitation', {
					invitation_code: invitationCode.value
				});
				console.log('Google Analytics 已初始化，发送页面浏览事件');
			} else {
				console.warn('Google Analytics 未初始化，无法发送事件');
			}
		}
		// 懒加载 FingerprintJS
		const { default: FingerprintJS } = await import('@fingerprintjs/fingerprintjs');
		// 加载FingerprintJS
		if (!localStorage.getItem('arvId')) {
			FingerprintJS.load().then(fp => {
				// 获取指纹
				fp.get().then(result => {
					localStorage.setItem('arvId', result.visitorId);
				});
			}).catch(error => {
				console.error('Error generating fingerprint:', error);
			});
		}
	})
</script>

<style lang="scss" scoped>
	.right {
		display: flex;
		align-items: center;
		font-size: 30px;
		color: var(--text_color_L4);

		img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			overflow: hidden;
			display: block;
			margin-right: 10px;
		}
	}

	.resgister__C {
		height: 100%;

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
				min-height: 140px;
				border-bottom: 2px solid var(--Dividing-line_color);
				color: var(--text_color_L2);
				gap: 20px;
				font-size: 30px;
				font-weight: 700;
				line-height: 30px;

				svg {
					width: 48px;
					height: 48px;
				}

				&.active {
					border-bottom: 4px solid var(--main-color);
					color: var(--main-color);
				}
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
			background: var(--light-main_gradient-color, var(--bg_color_L2));

			&__title {
				font-size: 32px;
				font-weight: 700;
				color: #fff;
				margin-left: 40px;
				padding-top: 20px;
			}

			&__subTitle {
				display: flex;
				flex-direction: column;
				font-size: 22px;
				margin-top: 22px;
				margin-left: 40px;
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
				transform: translate3d(0, 0, 0);
				transition-property: transform;
				transition-duration: 0s;

				&>div {
					flex-shrink: 0;
					width: 100%;
					transform: translateZ(0);
					backface-visibility: hidden;
				}
			}
		}
	}
</style>
