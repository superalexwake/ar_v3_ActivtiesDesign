<template>
	<div class="resgister__C">
		<NavBar @click-left="onClickLeft" :left-arrow="true">
			<template #right>
				<LangPop />
			</template>
		</NavBar>
		<loginTypeNav :loginList="loginList" :activeLogin="activeLogin" @activeLogin="changeActive" />
		<div class="resgister__C-form">
			<Register ref="register" :registerData="registerData" :loginType="activeLogin" />
		</div>
	</div>
</template>

<script setup lang="ts">
import LangPop from '@/components/Login/LangPopup.vue'
import Register from '@/components/Login/RegisterBra.vue'
import loginTypeNav from '@/components/common/loginTypeNav.vue'
import {  onMounted, ref } from 'vue'
import { useRouter,onBeforeRouteLeave } from 'vue-router'
import {GlobalStore, useUserStore} from '@/stores'
import { computed } from 'vue'
import {useGlobalDialog} from "@/hooks";
const {openAll}=useGlobalDialog()
const globalStore = GlobalStore()
const userStore = useUserStore()

const activeLogin = ref('mobile')
const loginList = computed(()=>{
	const list = [];
	if(!userStore.isOpenRegisterSMSState && userStore.isOpenRegisterEmailState) activeLogin.value = 'email'
	if(userStore.isOpenRegisterSMSState) list.push({ type: 'mobile', name: 'phoneregister' });
	if(userStore.isOpenRegisterEmailState) list.push({ type: 'email', name: 'emailregister' });
	return list
})
// 登录和注册页
// 泰国电话 限制10位 不足10位 将按钮置灰
const registerData = ref<any>({
	isRegisterState: '1', //是否开放注册,默认开放
	SMSstate: '0', //是否开放短信注册，默认不开放
	registerStateMsg: '', //是否开放注册内容
	/*hasCaptcha: '0',*/
	hasRegisterCaptcha: '0',
	registerEmailState: '0',
	registerMobileState: '0',
	isOpenRegisterSMS: '0',
	isOpenRegisterEmail: '0',
	isInvitecode: '0' //是否开启邀请码必填
})
const router = useRouter()
// 判断是否登录,登录后直接跳转首页
if (globalStore.token) {
	router.push({ name: 'home' })
}

onBeforeRouteLeave((to, from, next)=>{
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
const changeActive = (val: any) => {
	activeLogin.value = val
}
// 获取是否开启短信相关功能
userStore.getRegisterState().then((res:any)=>{
	registerData.value.isRegisterState = res.data.registerState //是否开放注册1：开放注册
	registerData.value.registerStateMsg = res.data.registerStateMsg //是否开放注册内容
	registerData.value.registerEmailState = res.data.registerEmailState //是否开放邮件注册
	registerData.value.registerMobileState = res.data?.registerMobileState // 是否开放手机注册
	registerData.value.isOpenRegisterSMS = res.data?.isOpenRegisterSMS // 是否开启短信验证码
	registerData.value.isOpenRegisterEmail = res.data?.isOpenRegisterEmail // 是否开启邮箱验证码
	registerData.value.hasRegisterCaptcha = res.data.isOpenRegisterCaptcha
	registerData.value.isInvitecode = res.data?.isInvitecode
	if (Number(res.data.registerEmailState) + Number(res.data?.registerMobileState) == 0) {
		console.log('xxx')
		if (res.data?.isOpenRegisterSMS !== '1') {
			tab.value = 'email'
		}
		// showFailToast({
		// 	message: 'Registrado com Sucesso',
		// 	wordBreak: 'break-word'
		// })
		router.push({ name: 'login' })
	} else {
		registerData.value.registerSMSState = res.data.registerSMSState //是否开放短信注册
		if (registerData.value.registerEmailState !== '0' && res.data?.registerMobileState == '0') {
			tab.value = 'email'
		}
	}
})

onMounted(async ()=>{
	// 懒加载
	 const { default: FingerprintJS } = await import('@fingerprintjs/fingerprintjs')
    // 加载FingerprintJS
	if(!localStorage.getItem('arvId')) {
    	FingerprintJS.load().then(fp => {
    	  // 获取指纹
    	  fp.get().then(result => {
			localStorage.setItem('arvId',result.visitorId);
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
	color: #fff;
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
	padding: 0 30px;
	//overflow-y: scroll;
	white-space: nowrap;
	//-webkit-overflow-scrolling: touch;

	.van-nav-bar {
		background-color: #f7f8ff;

		.leftArrow {
			width: 34px;
			height: auto;
		}
	}
	:deep(.navbar-fixed) {
		background: transparent;
	}

	&-form {
		position: relative;
		margin-top: 30px;
		overflow: hidden;
		background: #081C37;
		border-radius: 12px;
		padding: 40px 24px;
	}
}
</style>