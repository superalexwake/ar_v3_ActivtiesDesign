<template>
	<NavBar :title="$t('e1')" left-arrow @click-left="onBack" />
	<div class="download-center">
		<div class="banner"></div>
		<div class="btn1" @click="handleQuickDownload"><svg-icon name="ac_fast" />{{ $t('e2') }}</div>
		<div class="btn2" @click="handleFullDownload"><svg-icon name="ac_download" />{{ $t('e3') }}</div>
		<template v-if="!isIOS && appList.length">
			<div class="btn3" :class="{ open: isAppListOpen }" @click="toggleAppList">
				<svg-icon name="ac_private" /> {{ $t('e8') }} <svg-icon class="down" name="ac_down" />
			</div>
			<div class="app-list" :class="{ open: isAppListOpen }">
				<div
					v-for="app in appList"
					:key="app.downAppURL || app.appName"
					class="app-item"
					@click="downloadExternalUrl(app.downAppURL)"
				>
					<img class="icon" :src="app.imgUrl" />
					<div class="text">{{ app.appName }}</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { usePwaDownload } from '@/hooks/usePwa'
import { AwaitApiResult, isOpenExternalUrl, openExternalUrl } from '@/utils'
import { getHomeData, GetAppDownloadConfigList } from '@/api'
import { GetAppDownloadConfigListItem } from '@/types/api/interface/home'
import { GlobalStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { showFailToast } from 'vant'
import i18n from '@/languages'

const { PWA } = usePwaDownload()
const router = useRouter()
const onBack = () => {
	router.back()
}
type ApkName = 'quick.apk' | 'full.apk'

const iosUrl = ref<string>('')
const appList = ref<Array<GetAppDownloadConfigListItem>>([])
const isAppListOpen = ref(true)
const buildMode = window.CONFIG?.MODE || import.meta.env.MODE
const tenantName = window.CONFIG?.tenant || process.env.NODE_ENV || ''
const downloadStationName = buildMode === 'sit' ? 'sit' : tenantName
const getApkDownloadUrl = (apkName: ApkName) =>
	downloadStationName ? `${window.location.origin}/download/${downloadStationName}/${apkName}?ts=${Date.now()}` : ''
// 检查是ios还是安卓
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const goDownloadEmpty = () => {
	router.push('/downloadCenter/empty')
}
const assertDownloadAvailable = async (downloadUrl: string) => {
	const response = await fetch(downloadUrl, { method: 'HEAD', cache: 'no-store' })
	if (!response.ok) throw new Error('File not found')
}
const triggerBrowserDownload = (downloadUrl: string, apkName: ApkName) => {
	const link = document.createElement('a')
	link.href = downloadUrl
	link.download = apkName
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
const openApkDownload = async (apkName: ApkName, eventName?: string) => {
	const downloadUrl = getApkDownloadUrl(apkName)
	if (!downloadUrl) {
		goDownloadEmpty()
		return
	}
	try {
		await assertDownloadAvailable(downloadUrl)
		eventName && window.gtag && window.gtag('event', eventName)
		if (isOpenExternalUrl()) {
			openExternalUrl(downloadUrl)
			return
		}
		triggerBrowserDownload(downloadUrl, apkName)
	} catch (error) {
		console.error('Download failed:', error)
		goDownloadEmpty()
	}
}
const handleQuickDownload = () => {
	window.gtag && window.gtag('event', 'quick_down_click')
	if (isOpenExternalUrl()) {
		const downloadUrl = getApkDownloadUrl('quick.apk')
		downloadUrl ? openExternalUrl(downloadUrl) : goDownloadEmpty()
		return
	}
	// 如果是iOS，直接跳转到引导ios页面
	if (isIOS) {
		router.push('/downloadCenter/ios')
	} else {
		// 先判断是否可以下载pwa
		if (PWA.canIUse) {
			PWA.download && PWA.download()
		} else {
			// 如果不支持pwa下载，直接下载apk
			openApkDownload('quick.apk')
		}
	}
}
const handleFullDownload = () => {
	if (isIOS) {
		if (iosUrl.value) {
			window.open(iosUrl.value, '_blank')
			return
		}
		goDownloadEmpty()
		return
	}
	openApkDownload('full.apk', 'full_down_click')
}
const downloadExternalUrl = (url: string) => {
	if (!url) {
		goDownloadEmpty()
		return
	}
	if (isIOS) {
		showFailToast(i18n.global.t('downloadFileiOSError'))
		return
	}
	if (isOpenExternalUrl()) {
		openExternalUrl(url)
		return
	}
	window.open(url, '_blank')
}
const toggleAppList = () => {
	isAppListOpen.value = !isAppListOpen.value
}
const getIosUrl = async () => {
	const res = await AwaitApiResult(getHomeData())
	iosUrl.value = res?.data?.iosUrl || ''
}
const getAppDownloadConfigList = async () => {
	const globalStore = GlobalStore()
	const token = globalStore.getToken
	if (!token) {
		appList.value = []
		return
	}
	const res = await AwaitApiResult(GetAppDownloadConfigList())
	appList.value = Array.isArray(res?.data) ? res.data : []
}
onMounted(() => {
	getAppDownloadConfigList()
	// 检查是否支持PWA下载
	if (isIOS) {
		getIosUrl()
	}
})
</script>
<style lang="scss" scoped>
.banner {
	width: 100%;
	height: 353px;
	background: url('@/assets/icons/download/banner.png') no-repeat center center;
	background-size: cover;
	margin-top: 36px;
	margin-bottom: 60px;
}

.btn1 {
	background: var(--norm_orange_color, #f6af0b);
	margin: 0 auto 32px auto;
}

.btn2 {
	background: var(--main_gradient_color, linear-gradient(180deg, #f95959 0%, #f95959 100%));
	margin: 32px auto 32px auto;
}

.btn3 {
	background: var(--norm_purple1_color, linear-gradient(180deg, #7b8eff 0%, #7b8eff 100%));
	margin: 0 auto;
	&.open {
		.down {
			transform: rotate(180deg);
		}
	}
}

.btn3 .down {
	transition: transform 0.3s ease;
}

.btn1,
.btn2,
.btn3 {
	border-radius: 50px;
	display: flex;
	height: 88px;
	width: 590px;
	justify-content: center;
	align-items: center;
	gap: 12px;
	align-self: stretch;
	color: var(--text_color_L4, #fff);
	text-align: center;
	font-family: Poppins;
	font-size: 28px;
	font-style: normal;
	font-weight: 600;
	line-height: 42px;
	position: relative;
	z-index: 1;

	.icon {
		width: 40px;
		height: 40px;
	}
}
.app-list {
	width: 590px;
	background: var(--light-bg_white, #fff);
	margin: 0 auto;
	padding: 0 25px 0;
	box-sizing: border-box;
	position: relative;
	top: -45px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08);
	height: 0;
	transition: height, padding 0.3s ease;
	overflow: hidden;
	&.open {
		height: auto !important;
		padding: 45px 25px 0 !important;
	}
	.app-item {
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--border_color_L2, #e5e5e5);
		padding: 25px;
		gap: 20px;
		.icon {
			width: 72px;
			height: 72px;
			object-fit: cover;
			border-radius: 10px;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
		}
		.text {
			font-size: 28px;
			font-style: normal;
			font-weight: 600;
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		&:last-child {
			border-bottom: none;
		}
	}
}
</style>
