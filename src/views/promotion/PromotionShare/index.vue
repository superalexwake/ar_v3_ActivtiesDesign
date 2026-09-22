<template>
	<div class="promotionShare__container">
		<NavBar :title="$t('titleInvite')" left-arrow @click-left="onClick" />

		<div class="promotionShare__container-tips">
			<p>{{ $t('tipSwipeToPickBrochure') }}</p>
		</div>

		<!-- 附带优惠券：控制海报附带哪张充值券 -->
		<div v-if="hasProxyCoupon" class="promotionShare__container-coupon" @click="showCouponPicker = true">
			<span class="coupon-label">{{ $t('couponRechargeName') }}</span>
			<span class="coupon-value">{{ selectedCoupon.label }}</span>
			<van-icon name="arrow-down" />
		</div>

		<swiper class="my-swipe" :slidesPerView="'auto'" :centeredSlides="true" :space-between="20" @slideChange="onSlideChange">
			<swiper-slide v-for="poster in posterList" :key="poster.id">
				<div class="promotionShare__container-swiper" :ref="(el) => setPosterRef(el, poster.id)">
					<img class="poster-bg" :src="posterBackgroundUrl" alt="" />
					<div class="sContent">
						<div class="head1">
							<div>
								<img class="head-bg" :src="headBackgroundUrl" alt="" />
								<span class="head-text">{{ $t('fairAndJust') }}</span>
							</div>
							<div>
								<img class="head-bg" :src="headBackgroundUrl" alt="" />
								<span class="head-text">{{ $t('openAndTransparent') }}</span>
							</div>
						</div>
						<div class="head2" v-html="$t('fullOddsReturnRate')"></div>
						<div class="head3">
							<div>
								<img class="logo" src="@icon/promotion/bank.png" alt="" />
								{{ $t('financialSecurity') }}
							</div>
							<div>
								<img class="logo" src="@icon/promotion/trucktick.png" alt="" />
								{{ $t('withdrawFast') }}
							</div>
						</div>
						<div class="head4" v-html="$t('highestRebate', [85])"></div>
					</div>
					<div v-if="qrCodeDataUrl" class="qr-block">
						<img class="qr-code" :src="qrCodeDataUrl" alt="" />
						<p v-if="selectedCouponValue" class="qr-caption">
							{{ $t('couponCodeLabel') }} <span class="qr-caption__code">{{ selectedCouponValue }}</span>
						</p>
					</div>
				</div>
			</swiper-slide>
		</swiper>

		<div class="promotionShare__container-slogan">
			<p>{{ $t('inviteFriends') }}</p>
			<p>
				{{ $t('divideBonus') }}
				<span>{{ $t('tip10billion') }}</span>
				{{ $t('commission') }}
			</p>
		</div>

		<div class="promotionShare__container-buttons">
			<div v-if="canDownloadPoster" class="share" @click="downloadCurrentPoster">
				{{ $t('shareInvitationPoster') }}
			</div>
			<div class="cpy" @click="copyInviteLink">{{ $t('copyInvitationLink') }}</div>
			<div v-if="isLandingPageEnabled" class="cpy" @click="copyLandingPage">{{ $t('clanding') }}</div>
			<!-- <div>{{ $t('copyInvitationLink') }}</div> -->
		</div>

		<p class="promotionShare__container-shareTip">{{ $t('shareToOtherApps') }}</p>

		<div class="promotionShare__container-share">
			<div
				v-for="platform in shareApp"
				:key="platform"
				class="share-item"
				role="button"
				:aria-label="platform"
				@click="onShareTo(platform)"
			>
				<div class="share-icon" :class="`share-icon--${platform.toLowerCase()}`" />
				<span class="share-label">{{ SHARE_LABELS[platform] }}</span>
			</div>
		</div>

		<van-popup v-model:show="showCouponPicker" round position="bottom">
			<van-picker
				:columns="couponOptions"
				:model-value="pickerModelValue"
				@cancel="showCouponPicker = false"
				@confirm="onCouponConfirm"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { copy, AwaitApiResult, formatNumberToK } from '@/utils'
import { useCoupon } from '@/hooks/useCoupon.hook'
import type { RechargeCouponItem } from '@/types/api'
import QRCode from 'qrcode'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { GetUrlAddress } from '@/api'
import { isHybridApp } from '@/utils/jsBridge'
import { showFailToast, showLoadingToast } from 'vant'
import { useShare, type SharePlatform } from '@/hooks/useShare'
import posterBackgroundUrl from '@icon/promotion/poster.png'
import headBackgroundUrl from '@icon/promotion/bg1.png'

interface UrlAddressData {
	url?: string
	landingPageUrl?: string
	isLandingPageEnabled?: boolean
}

const POSTER_COUNT = 3
const FIRST_POSTER_INDEX = 0
const MIN_LOADING_VISIBLE_MS = 300
const FIRST_POSTER_PRE_RENDER_DELAY_MS = 2000
const OKWIN_DOMAINS = [
	'https://okwinslots1.com/#/register?invitationCode=',
	'https://okwinslots2.com/#/register?invitationCode=',
	'https://okwinslots3.com/#/register?invitationCode=',
	'https://okwinslots4.com/#/register?invitationCode=',
	'https://okwinslots5.com/#/register?invitationCode='
]

const { share, shareApp } = useShare()
const SHARE_LABELS: Record<SharePlatform, string> = {
	Whatsapp: 'WhatsApp',
	Telegram: 'Telegram',
	Facebook: 'Facebook',
	Twitter: 'X'
}
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const posterList = Array.from({ length: POSTER_COUNT }, (_, id) => ({ id }))
const currentIndex = ref(0)
const landingPageUrl = ref('')
const isLandingPageEnabled = ref(false)
const baseInviteUrl = ref('')
const qrCodeDataUrl = ref('')
const posterRefs = ref<Array<HTMLElement | null>>([])
const isDownloadingPoster = ref(false)
const canDownloadPoster = !isHybridApp()
const projectName = import.meta.env.VITE_BASE_PROJECTNAME
const posterUrlCache = new Map<number, string>()
const posterRenderTasks = new Map<number, Promise<string>>()
let posterRendererImportTask: Promise<typeof import('@zumer/snapdom')> | null = null
let posterRendererPreloadTimer: ReturnType<typeof window.setTimeout> | null = null
let firstPosterPreRenderTimer: ReturnType<typeof window.setTimeout> | null = null

interface CouponOption {
	value: string
	label: string
	text: string
	disabled?: boolean
}

// 券种映射为下拉项：比率小数×100，0=不限则省略对应文案，白名单券标 🔒
const toCouponOption = (c: RechargeCouponItem): CouponOption => {
	const percent = +(c.rechargeGiftRate * 100).toFixed(2)
	// 与 CouponArrivalDialog 同口径：券上限恒用 k，百万级也不切 M
	const limitText = formatNumberToK(c.rechargeGiftLimit, 'k')
	const limit = c.rechargeGiftLimit > 0 ? ` · ${t('couponUpperLimit', [limitText])}` : ''
	const days = c.couponValidDays > 0 ? ` · ${t('couponValidDays', [c.couponValidDays])}` : ''
	const base = t('couponMaxReturns', [percent])
	return {
		value: c.couponNum,
		label: `${base}${c.authListId > 0 ? ' 🔒' : ''}`,
		text: `${base}${limit}${days}${c.authListId > 0 ? ' · 🔒' : ''}`
	}
}

const proxyCouponList = ref<RechargeCouponItem[]>([])
// 必须 computed：t() 结果写进普通数组会固化首次翻译，切语言后选项文案不再重算
const couponOptions = computed<CouponOption[]>(() => {
	const noCoupon: CouponOption = { value: '', label: t('noCoupon'), text: t('noCoupon') }
	return [...proxyCouponList.value.map(toCouponOption), noCoupon]
})

const showCouponPicker = ref(false)
const selectedCouponValue = ref('')
const selectedCoupon = computed(
	() => couponOptions.value.find((item) => item.value === selectedCouponValue.value) ?? couponOptions.value[0]
)
const pickerModelValue = computed(() => [selectedCouponValue.value])
const hasProxyCoupon = computed(() => proxyCouponList.value.length > 0)

// 选中券 couponNum 拼进邀请链接（§5.3：与 invitationCode 并存），复制/分享/二维码统一走 shareUrl
const appendCouponNum = (url: string) => {
	if (!url || !selectedCouponValue.value) return url
	return `${url}${url.includes('?') ? '&' : '?'}couponNum=${encodeURIComponent(selectedCouponValue.value)}`
}
const shareUrl = computed(() => appendCouponNum(baseInviteUrl.value))

// 拉取代理可推广券；有券默认选第一张（推券）
const loadProxyCoupons = async () => {
	const list = await useCoupon().fetchProxyInvitation()
	proxyCouponList.value = list
	if (list.length) selectedCouponValue.value = list[0].couponNum
}

const onCouponConfirm = ({ selectedOptions }: { selectedOptions: CouponOption[] }) => {
	selectedCouponValue.value = selectedOptions[0].value
	showCouponPicker.value = false
}

const onSlideChange = (swiper: { activeIndex: number }) => {
	currentIndex.value = swiper.activeIndex
}

const onClick = () => {
	router.back()
}

const setPosterRef = (el: Element | null, index: number) => {
	posterRefs.value[index] = el instanceof HTMLElement ? el : null
}

const getInvitationCode = () => {
	const { code } = route.query
	return Array.isArray(code) ? String(code[0] ?? '') : String(code ?? '')
}

const getRandomOkwinDomain = () => {
	const randomIndex = Math.floor(Math.random() * OKWIN_DOMAINS.length)
	return OKWIN_DOMAINS[randomIndex]
}

const getHashBaseUrl = () => {
	const hashRouteIndex = window.location.href.lastIndexOf('/#/')
	if (hashRouteIndex >= 0) return window.location.href.substring(0, hashRouteIndex + 3)
	return `${window.location.origin}/#/`
}

const normalizeRegisterPath = (url: string) => {
	const registerIndex = url.lastIndexOf('re')
	if (registerIndex >= 0) return url.substring(registerIndex)
	return url.replace(/^\/+/, '')
}

const resolvePromotionUrl = (url?: string) => {
	const normalizedUrl = String(url ?? '').trim()
	if (!normalizedUrl) return ''
	if (/^https?:\/\//i.test(normalizedUrl)) return normalizedUrl
	return `${getHashBaseUrl()}${normalizeRegisterPath(normalizedUrl)}`
}

const buildDefaultInviteUrl = () => {
	return `${window.location.origin}/#/register?invitationCode=${encodeURIComponent(getInvitationCode())}`
}

const buildOkwinInviteUrl = () => {
	return `${getRandomOkwinDomain()}${encodeURIComponent(getInvitationCode())}`
}

const renderQrCode = async () => {
	if (!shareUrl.value) return
	clearFirstPosterPreRenderTimer()
	clearPosterCache()
	qrCodeDataUrl.value = await QRCode.toDataURL(shareUrl.value, {
		errorCorrectionLevel: 'M',
		margin: 1,
		width: 360,
		color: {
			dark: '#000000',
			light: '#ffffff'
		}
	})
	await nextTick()
	scheduleFirstPosterPreRender()
}

const copyInviteLink = () => {
	const inviteUrl = projectName === 'okwin' ? buildOkwinInviteUrl() : shareUrl.value
	if (!inviteUrl) return
	copy(inviteUrl)
}

const copyLandingPage = () => {
	if (!landingPageUrl.value) return
	copy(landingPageUrl.value)
}

async function getUrl() {
	try {
		const res = await AwaitApiResult(GetUrlAddress())
		const data = res?.data as UrlAddressData | undefined

		landingPageUrl.value = data?.landingPageUrl ?? ''
		isLandingPageEnabled.value = Boolean(data?.isLandingPageEnabled && landingPageUrl.value)
		baseInviteUrl.value = resolvePromotionUrl(data?.url) || buildDefaultInviteUrl()
	} catch {
		baseInviteUrl.value = buildDefaultInviteUrl()
	}
}

const onShareTo = (platform: SharePlatform) => {
	if (!shareUrl.value) return
	share({ platform, sharePage: shareUrl.value.toString() })
}

const waitForImage = (image: HTMLImageElement) => {
	if (image.complete && image.naturalWidth > 0) return Promise.resolve()

	return new Promise<void>((resolve) => {
		const cleanup = () => {
			image.removeEventListener('load', onSettled)
			image.removeEventListener('error', onSettled)
		}
		const onSettled = () => {
			cleanup()
			resolve()
		}

		image.addEventListener('load', onSettled, { once: true })
		image.addEventListener('error', onSettled, { once: true })
	})
}

const waitForPosterAssets = async (poster: HTMLElement) => {
	await nextTick()
	await Promise.all(Array.from(poster.querySelectorAll('img')).map(waitForImage))
	await document.fonts?.ready.catch(() => undefined)
}

const waitForFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const waitForMilliseconds = (duration: number) => new Promise<void>((resolve) => setTimeout(resolve, duration))

const waitForNextPaint = async (frames = 2) => {
	await nextTick()
	for (let index = 0; index < frames; index++) {
		await waitForFrame()
	}
}

const loadPosterRenderer = () => {
	if (!posterRendererImportTask) {
		posterRendererImportTask = import('@zumer/snapdom').catch((error) => {
			posterRendererImportTask = null
			throw error
		})
	}

	return posterRendererImportTask
}

const preloadPosterRenderer = () => {
	if (posterRendererImportTask || posterRendererPreloadTimer) return
	posterRendererPreloadTimer = window.setTimeout(() => {
		posterRendererPreloadTimer = null
		loadPosterRenderer().catch(() => undefined)
	}, 500)
}

const clearPosterRendererPreloadTimer = () => {
	if (!posterRendererPreloadTimer) return
	window.clearTimeout(posterRendererPreloadTimer)
	posterRendererPreloadTimer = null
}

const clearFirstPosterPreRenderTimer = () => {
	if (!firstPosterPreRenderTimer) return
	window.clearTimeout(firstPosterPreRenderTimer)
	firstPosterPreRenderTimer = null
}

const clearPosterCache = () => {
	posterUrlCache.forEach((url) => {
		if (url.startsWith('blob:')) URL.revokeObjectURL(url)
	})
	posterUrlCache.clear()
	posterRenderTasks.clear()
}

const createExportPoster = (poster: HTMLElement, width: number, height: number) => {
	const exportPoster = poster.cloneNode(true) as HTMLElement
	Object.assign(exportPoster.style, {
		position: 'fixed',
		left: '0',
		top: '0',
		width: `${width}px`,
		height: `${height}px`,
		margin: '0',
		transform: 'none',
		pointerEvents: 'none',
		zIndex: '-1'
	})

	document.body.appendChild(exportPoster)
	return exportPoster
}

const blobToObjectUrl = (blob: Blob) => {
	return URL.createObjectURL(blob)
}

const renderPosterUrl = async (poster: HTMLElement) => {
	const rect = poster.getBoundingClientRect()
	const width = Math.ceil(rect.width || poster.offsetWidth)
	const height = Math.ceil(rect.height || poster.offsetHeight)
	const exportPoster = createExportPoster(poster, width, height)

	try {
		await waitForPosterAssets(exportPoster)
		await waitForNextPaint()

		const { snapdom } = await loadPosterRenderer()
		const blob = await snapdom.toBlob(exportPoster, {
			type: 'png',
			backgroundColor: 'transparent',
			embedFonts: true,
			scale: Math.min(window.devicePixelRatio || 2, 2),
			width,
			height
		})

		return blobToObjectUrl(blob)
	} finally {
		exportPoster.remove()
	}
}

const getPosterUrl = (index: number, poster: HTMLElement) => {
	const cachedUrl = posterUrlCache.get(index)
	if (cachedUrl) return Promise.resolve(cachedUrl)

	const pendingTask = posterRenderTasks.get(index)
	if (pendingTask) return pendingTask

	const task = renderPosterUrl(poster)
		.then((url) => {
			posterUrlCache.set(index, url)
			return url
		})
		.finally(() => {
			posterRenderTasks.delete(index)
		})

	posterRenderTasks.set(index, task)
	return task
}

const canPreRenderFirstPoster = () => {
	return (
		qrCodeDataUrl.value &&
		currentIndex.value === FIRST_POSTER_INDEX &&
		!posterUrlCache.has(FIRST_POSTER_INDEX) &&
		!posterRenderTasks.has(FIRST_POSTER_INDEX)
	)
}

const scheduleFirstPosterPreRender = () => {
	if (!canPreRenderFirstPoster() || firstPosterPreRenderTimer) return

	preloadPosterRenderer()
	firstPosterPreRenderTimer = window.setTimeout(() => {
		firstPosterPreRenderTimer = null
		if (isDownloadingPoster.value || !canPreRenderFirstPoster()) return

		const poster = posterRefs.value[FIRST_POSTER_INDEX]
		if (!poster) return
		getPosterUrl(FIRST_POSTER_INDEX, poster).catch(() => undefined)
	}, FIRST_POSTER_PRE_RENDER_DELAY_MS)
}

const downloadPosterUrl = (url: string) => {
	const downloadLink = document.createElement('a')
	downloadLink.href = url
	downloadLink.download = `share-${Date.now()}.png`
	document.body.appendChild(downloadLink)
	downloadLink.click()
	downloadLink.remove()
}

const downloadCurrentPoster = async () => {
	if (isDownloadingPoster.value) return
	isDownloadingPoster.value = true

	const loadingStartedAt = Date.now()
	const loadingToast = showLoadingToast({
		message: t('loading'),
		duration: 0,
		forbidClick: true
	})
	let shouldShowFailToast = false

	try {
		await waitForNextPaint()
		const poster = posterRefs.value[currentIndex.value]
		if (!poster) return
		if (!qrCodeDataUrl.value) await renderQrCode()
		await waitForPosterAssets(poster)
		const posterUrl = await getPosterUrl(currentIndex.value, poster)
		downloadPosterUrl(posterUrl)
	} catch {
		shouldShowFailToast = true
	} finally {
		const remainingLoadingTime = MIN_LOADING_VISIBLE_MS - (Date.now() - loadingStartedAt)
		if (remainingLoadingTime > 0) await waitForMilliseconds(remainingLoadingTime)
		loadingToast.close()
		isDownloadingPoster.value = false
		if (shouldShowFailToast) showFailToast(t('fail'))
	}
}

// shareUrl 变化（base 就绪 / 选券切换）即重渲染二维码，海报券码随之更新
watch(shareUrl, () => renderQrCode())

onMounted(() => {
	getUrl()
	loadProxyCoupons()
})

onBeforeUnmount(() => {
	clearPosterRendererPreloadTimer()
	clearFirstPosterPreRenderTimer()
	clearPosterCache()
})
</script>

<style lang="scss" scoped>
.promotionShare__container {
	padding-block: 0 112px;

	:deep(.van-nav-bar) {
		background-color: #f6f6f6;

		.van-nav-bar__content {
			.van-nav-bar__left {
				.van-icon {
					color: var(--text_color_L1);
				}
			}

			.van-nav-bar__title {
				color: var(--text_color_L1);
			}
		}
	}

	&-tips {
		margin-block: 20px;
		color: var(--text_color_L2);
		font-size: 28px;
		text-align: center;
	}

	&-coupon {
		display: flex;
		align-items: center;
		width: 660px;
		height: 88px;
		margin: 0 auto 20px;
		padding: 0 28px;
		border: 1px solid var(--main-color);
		border-radius: 16px;
		cursor: pointer;

		.coupon-label {
			flex-shrink: 0;
			margin-right: 20px;
			font-size: 26px;
			color: var(--text_color_L2);
		}

		.coupon-value {
			flex: 1;
			overflow: hidden;
			font-size: 28px;
			color: var(--text_color_L1);
			text-align: start;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.van-icon {
			flex-shrink: 0;
			margin-left: 8px;
			font-size: 32px;
			color: var(--text_color_L2);
		}
	}

	.swiper {
		width: 100%;

		&-wrapper {
			.swiper-slide {
				width: 500px;
				height: 700px;
				text-align: center;

				// img {
				// 	width: 100%;
				// }
			}
		}
	}

	&-slogan {
		display: flex;
		align-items: center;
		justify-content: center;
		// 长文案语言(印尼语等)一行放不下时整段换行；不加 flex-shrink:0 会先压缩段宽，
		// 把 "Mengundang teman" 断成两行拆词。间距用 column-gap，换行后才不残留右边距
		flex-wrap: wrap;
		column-gap: 54px;
		margin-block: 40px 34px;
		font-size: 32px;

		p {
			flex-shrink: 0;
			max-width: 100%;
			color: var(--text_color_L1);

			span {
				color: var(--norm_red-color);
				font-weight: 700;
			}
		}
	}

	&-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 28px;

		div {
			width: 660px;
			height: 70px;
			color: var(--text_color_L4);
			font-size: 30px;
			text-align: center;
			line-height: 70px;
			border-radius: 9rem;

			&.share {
				background: var(--main_gradient-color);
			}

			&.cpy {
				color: var(--main-color);
				border: 1px solid var(--main-color);
			}
		}
	}

	&-shareTip {
		text-align: center;
		font-size: 26px;
		color: var(--text_color_L2);
		margin-top: 40px;
	}

	&-share {
		display: flex;
		justify-content: center;
		gap: 40px;
		margin-top: 28px;

		.share-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 12px;
			cursor: pointer;
		}

		.share-label {
			font-size: 24px;
			color: var(--text_color_L2);
			line-height: 1;
		}

		.share-icon {
			width: 80px;
			height: 80px;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: center;

			&--whatsapp {
				background-image: url('@public/promotion/whatsapp.svg');
			}
			&--telegram {
				background-image: url('@public/promotion/telegram.svg');
			}
			&--facebook {
				background-image: url('@public/promotion/facebook.svg');
			}
			&--twitter {
				background-image: url('@public/promotion/twitter.svg');
			}
		}
	}
}

.promotionShare__container-swiper {
	position: relative;
	height: 100%;
	overflow: hidden;

	.poster-bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		object-fit: fill;
		pointer-events: none;
	}

	.sContent {
		position: relative;
		z-index: 1;
		padding: 0 16px;
		display: flex;
		flex-direction: column;

		.logo {
			width: fit-content;
			height: 38px;
		}

		.head1 {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: stretch;
			margin-top: 22px;
			height: fit-content;

			> div {
				position: relative;
				width: 50%;
				font-family: 'Inter';
				font-style: normal;
				font-weight: 700;
				font-size: 26px;
				line-height: 31px;
				color: #f24544;
				padding: 6px 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				overflow: hidden;
			}

			.head-bg {
				position: absolute;
				inset: 0;
				z-index: 0;
				width: 100%;
				height: 100%;
				object-fit: fill;
				pointer-events: none;
			}

			.head-text {
				position: relative;
				z-index: 1;
			}
		}

		.head2 {
			color: #fff;
			text-shadow: 0px 2px 0px #4ea9ff, 0px 6px 10px #0c5895;
			font-family: Roboto;
			font-size: 30px;
			font-style: normal;
			font-weight: 900;
			margin-top: 8px;

			> span {
				color: red !important;
			}
		}

		.head3 {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			margin-top: 10px;

			> div {
				display: flex;
				flex-direction: column;
				align-items: center;
				line-height: 32px;
				border: 1px solid #fff4c6;
				border-radius: 10px;
				min-width: 180px;
				min-height: 120px;
				gap: 6px;
				justify-content: center;
				color: #fff;
				font-family: Roboto;
				font-size: 22px;

				> img {
					width: 60px;
					height: 60px;
				}
			}
		}

		.head4 {
			color: #fff;
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 700;
			font-size: 32px;
			line-height: 40px;
			margin-top: 20px;

			:deep(span) {
				letter-spacing: 1px;
				color: #ffe46c;
			}
		}
	}

	.qr-block {
		position: absolute;
		left: 50%;
		z-index: 22;
		transform: translateX(-50%);
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.qr-code {
		width: 182px !important;
		height: 182px !important;
	}

	.qr-caption {
		margin-top: 14px;
		padding: 0 30px;
		font-family: 'Roboto';
		font-size: 22px;
		font-weight: 700;
		line-height: 1.3;
		color: #fff;
		text-align: center;
		text-shadow: 0 2px 4px rgba(12, 88, 149, 0.6);

		.qr-caption__code {
			color: #ffe46c;
			letter-spacing: 1px;
		}
	}
}
</style>
