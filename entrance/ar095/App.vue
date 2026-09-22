<template>
	<LoadingView :loading="isLoad" type="loading" :isGame="isGame">
		<router-view v-slot="{ Component }" :key="codeKey">
			<keep-alive :max="1">
				<component :is="Component" v-if="route.meta.keepAlive" :key="routeKeyValue" />
			</keep-alive>
			<component v-if="!route.meta.keepAlive" :is="Component" />
		</router-view>
		<!--online custom service-->
		<Customer   />
		<TabBar v-if="isTabBar" />
	</LoadingView>
	<StartPage v-if="isStart"></StartPage>
	<DialogQueueHost />
</template>

<script setup lang="ts">
import {
	addMaximumScaleToMetaViewport,
	checkIsIOS,
	getBrowserLang,
	difflanguage,
	setHtmlLang
} from '@/utils'
import { useAntiDebug } from '@/hooks/useAntiDebug'
import { ref, computed, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import i18n, { setGlobalLocale } from '@/languages'
import { useI18n } from 'vue-i18n'
import { useUserStore, SettingStore, useCommonStore, GlobalStore } from '@/stores'
import TabBar from '@/components/TabBar/ar095.vue'
import { useEventBus } from '@/components/common/use'
import { useVisibilityChange } from '@/components/common/use/useVisibilityChange'
import Customer from '@/components/common/Customer.vue'
import StartPage from './StartPage.vue'
import DialogQueueHost from '@/components/DialogQueue/DialogQueueHost.vue'
import { changeLange } from '@/utils/selectArr/rootConfig'

import {useGlobalDialog} from "@/hooks";
useGlobalDialog()
const eventBus = useEventBus()
const isStart = ref(false)
const isload = ref(false)
const route = useRoute()
const userStore = useUserStore()
const settingS = SettingStore()
const { locale } = useI18n()
const globalStore = GlobalStore()
const isGame = ref(false)
const isTabBar = computed(() => {
	return route.meta.tabBar
})

const codeKey = ref(0)
const routeKey = ref(Math.floor(Math.random() * 10000))
const routeKeyValue = computed(() => {
	return (route.name as string) + routeKey.value
})
const changeKeepAliveKey = () => {
	eventBus.on('changeKeepAliveKey', () => {
		routeKey.value = Math.floor(Math.random() * 10000)
	})
}
if (Boolean(sessionStorage.getItem('isload'))) {
	isStart.value = false
} else {
	isload.value = true
	sessionStorage.setItem('isload', isload.value.toString())
	isStart.value = true
}
settingS.getHomeSetting()
useAntiDebug(settingS)
// 监听获取到了手机号码参数就赋值
watch(
	() => settingS.getAreacode,
	(val) => {
		if (!val) return
		userStore.setNumberType(val.substring(1))
	}
)
// 监听获取到了手机号码参数就赋值
watch(
	() => settingS.getDL,
	(val) => {
		locale.value = val
		globalStore.updateLanguage(val)
		setGlobalLocale(val)
		changeLange(i18n.global.t)
	}
)
// 启动页遮罩
setTimeout(() => {
	isStart.value = false
}, 2000)
// isLoading监听
const isLoad = ref(false)
const commonStore = useCommonStore()
commonStore.$subscribe((mutation, state) => {
	isLoad.value = state.isLoading
	commonStore.setLoading(isLoad.value)
})
const currentFontFamily = ref('bahnschrift')
let browerlang = getBrowserLang()
let languages = settingS.getLanguage
let userlanguage = difflanguage(browerlang, languages)
const fixLang = async (index?: number) => {
	// 根据语言匹配字体
	// 根据语言动态设置字体类型
	const langFamilys = [
		{ title: 'vi', fontStyle: 'bahnschrift' },
		{ title: 'else', fontStyle: `'Roboto', 'Inter', sans-serif` }
	]
	const fontIndex = langFamilys.findIndex((item) => item.title == userlanguage)
	if (fontIndex >= 0) {
		currentFontFamily.value = langFamilys[fontIndex].fontStyle
	} else {
		currentFontFamily.value = langFamilys[langFamilys.length - 1].fontStyle
	}
}

const eventFunc = () => {
	eventBus.on('keyChange', () => {
		console.log(222)
		codeKey.value++
	})
	eventBus.on('changeIsGame', () => {
		isGame.value = !isGame.value
		isLoad.value = !isLoad.value
	})
}

const eventOffs = () => {
	eventBus.off('keyChange')
	eventBus.off('changeKeepAliveKey')
	eventBus.off('changeIsGame')
}
//console.log('66666',settingS.getAreacode)
userStore.setNumberType(settingS.getAreacode.substring(1))
fixLang()
onMounted(() => {
	if (checkIsIOS()) {
		addMaximumScaleToMetaViewport()
	}
	eventOffs()
	eventFunc()
	changeKeepAliveKey()
	if(localStorage.getItem('language')){
		setHtmlLang(localStorage.getItem('language'))
	}
})

useVisibilityChange()
</script>
<style lang="scss">
$font-family: v-bind(currentFontFamily);

#app {
	.btn.pwa-btn {
		cursor: pointer;

		.text,
		.bonus {
			color: #fff;
			text-shadow: none;
		}
	}
}

@media screen and (min-width: 800px) {
	html {
		font-size: 2.5rem !important;
	}
}
</style>
