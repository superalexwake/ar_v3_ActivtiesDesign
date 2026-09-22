<template>
	<div class="rpwd__C">
		<NavBar @click-left="onClickLeft" :leftArrow="true" :headLogo="true" class="main">
			<template #right>
				<LangPop />
			</template>
		</NavBar>
		<div class="rpwd__C-heading">
			<h1 class="rpwd__C-heading__title">{{ t('forgetPSW') }}</h1>
			<div class="rpwd__C-heading__subTitle">
				<div>{{ $t('changepasswordphoneoremail') }}</div>
			</div>
		</div>
		<div class="login_container-tab">
			<div
				v-if="userStore.isOpenForgetPasswordSMSState"
				class="tab"
				:class="[tab == 'phone' ? 'active' : '']"
				@click="handle('phone')"
			>
				<svg-icon name="phone" />
				<div :class="[tab == 'phone' ? 'phonefont30active' : '']">
					{{ $t('changepasswordphone') }}
				</div>
			</div>
			<div
				v-if="userStore.isOpenForgetPasswordEmailState"
				class="tab"
				:class="[tab == 'email' ? 'active' : '']"
				@click="handle('email')"
			>
				<div><svg-icon name="email" /> <svg-icon v-show="userStore.isOpenExternalAccount" name="user" /></div>
				<div :class="[tab == 'email' ? 'emailfont30active' : '']">
					{{ $t('changepasswordemail') }}
				</div>
			</div>
		</div>
		<div class="rpwd__C-form">
			<div
				v-if="userStore.isOpenForgetPasswordSMSState"
				class="tab-content"
				:class="[tab == 'phone' ? 'activecontent' : '']"
			>
				<ResetPassword />
			</div>
			<div
				v-if="userStore.isOpenForgetPasswordEmailState"
				class="tab-content"
				:class="[tab == 'email' ? 'activecontent' : '']"
			>
				<ResetEmailPassword />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import LangPop from '@/components/Login/LangPopup.vue'
import ResetPassword from '@/components/Login/ResetPassword.vue'
import ResetEmailPassword from '@/components/Login/ResetEmailPassword.vue'
import { GlobalStore, useUserStore } from '@/stores'
import { ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import i18n from '@/languages'
const { t } = i18n.global
//如果token失效，默认显示登录
const globalStore = GlobalStore()
const userStore = useUserStore()
// 获取是否开启短信相关功能
userStore.getRegisterState()
const router = useRouter()
const tab = ref('phone')
if (!userStore.isOpenForgetPasswordSMSState) {
	tab.value = 'email'
}

// 是否展示没有账号，现在注册内容
const showSubTitle = ref<Boolean>(true)
// 返回上一页
function onClickLeft() {
	router.go(-1)
}
// 处理切换
const handle = (item: string) => {
	tab.value = item
}

globalStore.token && (showSubTitle.value = false)

onBeforeRouteLeave((to, from, next) => {
	if (to.name !== 'About-AboutDetail') {
		const userStore = useUserStore()
		userStore.clearRpwdData()
	}
	next()
})
</script>

<style lang="scss" scoped>
.rpwd__C {
	height: 100%;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
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
		margin-top: 30px;
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
				height: 48px;
				width: 48px;
			}
		}
		.active {
			border-bottom: 4px solid var(--main-color);
			color: var(--main-color);
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
		color: #fff;
		min-height: 140px;
		background: var(--main_gradient-color);

		&__title {
			font-size: 32px;
			font-weight: 700;
			margin-left: 40px;
			padding-top: 20px;
		}

		&__subTitle {
			display: flex;
			flex-direction: column;
			font-size: 22px;
			margin-top: 22px;
			margin-left: 40px;
			height: 84px;
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

			& > div {
				flex-shrink: 0;
				width: 100%;
				transform: translateZ(0);
				backface-visibility: hidden;
			}
		}
	}
}
</style>
