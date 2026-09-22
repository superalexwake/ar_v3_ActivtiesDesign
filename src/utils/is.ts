export const isNumeric = (val: any) => typeof val === 'number' || /^\d+(\.\d+)?$/.test(val)
export const isFunction = (val: any) => typeof val === 'function'
export const isObject = (val: any) => val !== null && typeof val === 'object'
export const isPromise = (val: any) => isObject(val) && isFunction(val.then) && isFunction(val.catch)
export const isDef = <T>(val: T): val is NonNullable<T> => val !== undefined && val !== null
export const noon = () => {}
export const stopPropagation = (event: Event) => event.stopPropagation()
export function preventDefault(event: Event, isStopPropagation?: boolean) {
	/* istanbul ignore else */
	if (typeof event.cancelable !== 'boolean' || event.cancelable) {
		event.preventDefault()
	}

	if (isStopPropagation) {
		stopPropagation(event)
	}
}
export function getZIndexStyle(zIndex?: number) {
	const style: any = {}
	if (zIndex !== undefined) {
		style.zIndex = +zIndex
	}
	return style
}
export const isDate = (val: any) => Object.prototype.toString.call(val) === '[object Date]' && !Number.isNaN(val.getTime())
export const inBrowser = typeof window !== 'undefined'
export const UA = navigator.userAgent.toLowerCase()
// 是否为IOS终端
export const isIOS = inBrowser && /ios|iphone|ipad|ipod/.test(UA)
// 是否为Android终端
export const isAndroid = inBrowser && /android|adr/.test(UA)
// ，利用原生向window注入的属性判断是否为app的webview环境
export const isIOSWebview = !!window['webkit']
export const isAndroidWebview = !!window['android']
export const isWebView = isIOSWebview || isAndroidWebview
// 是否为微信的webview环境
export const isWX = /micromessenger|nettype|lauguage/.test(UA)

// 是否为移动端
export const isMobile = /mobi|android|iphone/.test(UA)
export const isPC = !isMobile

/**
 * 浏览器类型
 */
export const isSafari = /safari/.test(UA) && !/chrome/.test(UA)
