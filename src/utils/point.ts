//@ts-nocheck
import { getHashParams } from './basic'
import { getCookie } from './util'
import { getAdjustDeviceId } from './jsBridge'
import { resolveInviteCode } from './inviteCode'

export const query = getHashParams()
const FB_CLICK_ID_KEY = 'fbclid'

export interface FacebookAttributionParams {
	pixelId: string
	fbcId: string
	fbc: string
	fbp: string
	adId: string
}

const getFbClickId = () => {
	const fbclid = String(query.fbclid || '').trim()
	if (fbclid) localStorage.setItem(FB_CLICK_ID_KEY, fbclid)
	return fbclid || localStorage.getItem(FB_CLICK_ID_KEY) || sessionStorage.getItem(FB_CLICK_ID_KEY) || ''
}

export const getStoredPixelId = () => {
	const currentQuery = getHashParams()
	return (
		String(currentQuery.fb_dynamic_pixel || query.fb_dynamic_pixel || '').trim() ||
		localStorage.getItem('pixel') ||
		localStorage.getItem('fb_dynamic_pixel') ||
		sessionStorage.getItem('pixel') ||
		sessionStorage.getItem('fb_dynamic_pixel') ||
		''
	)
}

const getAdjustData = () => {
	const adjust = getAdjustDeviceId('adjustDeviceId')
	if (!adjust) return null
	try {
		return JSON.parse(adjust)?.data || null
	} catch (error) {
		return null
	}
}

export const getFacebookAttributionParams = (isOpenAdjustEvent = false): FacebookAttributionParams => {
	const fbclid = getFbClickId()
	const fbc = getCookie('_fbc') || ''
	const fbp = getCookie('_fbp') || ''
	if (isOpenAdjustEvent) {
		const adjust = getAdjustData()
		const firstPurchaseToken = adjust?.firstPurchaseToken || ''
		const purchaseToken = adjust?.purchaseToken || ''
		return {
			pixelId: [firstPurchaseToken, purchaseToken].filter(Boolean).join('_') || getStoredPixelId(),
			fbcId: fbc || fbp,
			fbc,
			fbp,
			adId: fbclid || adjust?.adjustDeviceId || ''
		}
	}

	return {
		pixelId: getStoredPixelId(),
		fbcId: fbc || fbp,
		fbc,
		fbp,
		adId: fbclid
	}
}

const initFacebookPixel = (pixel: string) => {
	if (!pixel) return

	!(function (f, b, e, v, n, t, s) {
		if (f.fbq) return
		n = f.fbq = function () {
			n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
		}
		if (!f._fbq) f._fbq = n
		n.push = n
		n.loaded = !0
		n.version = '2.0'
		n.queue = []
		t = b.createElement(e)
		t.async = !0
		t.src = v
		s = b.getElementsByTagName(e)[0]
		s.parentNode.insertBefore(t, s)
	})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

	fbq('init', pixel)
	fbq('track', 'PageView')
}

const normalizePixelMatchKey = (url = '') => {
	const value = String(url).trim()
	if (!value) return ''
	return value.replace(/\/+$/, '')
}

const removeDynamicSearchParams = (url = '') => {
	const value = normalizePixelMatchKey(url)
	if (!value) return ''
	try {
		const parsedUrl = new URL(value)
		parsedUrl.searchParams.delete('fbclid')
		parsedUrl.searchParams.delete('fb_dynamic_pixel')
		return normalizePixelMatchKey(parsedUrl.toString())
	} catch (error) {
		return value
	}
}

const getCurrentPixelMatchKeys = (invitationCode = '') => {
	const currentURL = window.location.origin + '/' + window.location.hash
	const currentOrigin = window.location.origin
	const currentDomain = window.location.host
	return Array.from(new Set([
		normalizePixelMatchKey(currentURL),
		removeDynamicSearchParams(currentURL),
		invitationCode ? normalizePixelMatchKey(`${currentOrigin}/#/register?invitationCode=${encodeURIComponent(invitationCode)}`) : '',
		normalizePixelMatchKey(currentOrigin),
		normalizePixelMatchKey(currentDomain)
	].filter(Boolean)))
}

const pointObj = {
	fbNew: (list = []) => {
		const map = {}
		list.forEach((item) => {
			const domainUrl = normalizePixelMatchKey(item.domainUrl)
			const pixelId = String(item.pixelId || '').trim()
			if (domainUrl && pixelId) map[domainUrl] = pixelId
		})
		const lock = localStorage.getItem('pixel') || localStorage.getItem('fb_dynamic_pixel') || sessionStorage.getItem('pixel') || sessionStorage.getItem('fb_dynamic_pixel')
		const currentQuery = getHashParams()
		const queryfb_dynamic_pixel = String(currentQuery.fb_dynamic_pixel || query.fb_dynamic_pixel || '').trim()
		const invitationCode = resolveInviteCode()
		if (queryfb_dynamic_pixel) localStorage.setItem('fb_dynamic_pixel', queryfb_dynamic_pixel)

		const pixel = getCurrentPixelMatchKeys(invitationCode).map((key) => map[key]).find(Boolean) || queryfb_dynamic_pixel || lock
		initFacebookPixel(pixel)
		if (pixel) localStorage.setItem('pixel', pixel)
	}
}

export default pointObj
