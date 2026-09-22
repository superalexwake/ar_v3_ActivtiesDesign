<template>
	<div class="login_tip">
		<div class="tip">
			<div>{{ $t('homeLoginTxt1', [settingS.getProjectName]) }}</div>
			<div>{{ $t('homeLoginTxt2') }}</div>
		</div>
		<div class="btn_box">
			<div class="login" @click="goLogin">{{ $t('login') }}</div>
			<div class="register" @click="goRegister">{{ $t('register') }}</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import {useRouter} from 'vue-router'
import {SettingStore} from '@/stores'

const router = useRouter()
const settingS = SettingStore()
const goLogin = () => {
	router.push('/login')
}

const goRegister = () => {
	router.push('/register')
}

</script>
<style lang="scss" scoped>
.login_tip {
	padding: 24px;

	.tip {
		margin-bottom: 22px;
		div {
			color: #171717;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			font-size: 24px;
		}
		div:first-child {
			font-size: 30px;
		}
	}
	.btn_box {
		display: flex;
		justify-content: space-between;
		align-self: center;
		div {
			width: 336px;
			height: 68px;
			text-align: center;
			border-radius: 34px;
			color: #b1835a;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 68px;
		}
		div:first-child {
			color: var(--main-color);
			border: 2px solid var(--main-color);
		}
		div:last-child {
			color: #fff;
			background: var(--main_gradient-color);
		}
	}
}
</style>
