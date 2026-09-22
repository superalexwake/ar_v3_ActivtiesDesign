import { showSuccessToast } from 'vant/lib/toast/function-call'
import SparkMD5 from 'spark-md5'
import dayjs from 'dayjs'
import { showFailToast,showDialog } from 'vant'
import { rootConfig } from '@/utils/selectArr/rootConfig'
import i18n from '@/languages'
export * from './is'
import { isPC } from './is'
import {isHybridApp} from "./jsBridge";
import { native } from '@/utils/bridges'
// @ts-ignore
const t = i18n.global.t



/**
 * @description 请求API
 * @param {function} APi接口
 * @return {Promise}
 * @example const [err, res] = await AwaitWrap(GetUserList({ page: 1, pageSize: 10 }))
 */

export function AwaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
	return promise.then<[null, T]>((data: T) => [null, data]).catch<[U, null]>((err) => [err, null])
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export const getBrowserLang = () => {
	let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
	let defaultBrowserLang = browserLang.toLowerCase().slice(0, 2)
	return defaultBrowserLang
}
/**
 * @description 对比浏览器语言是否在对应的范围内
 */
export const difflanguage = (userlangusge: string, languages: string) => {
	if (userlangusge == 'zh-CN' || userlangusge == 'zh') {
		return languages?.includes(userlangusge) ? 'zh-CN' : 'en'
	} else if (userlangusge == 'bn') {
		return languages?.includes('bdt') ? 'bdt' : 'en'
	} else if (userlangusge == 'pt-br') {
		return languages?.includes('bra') ? 'bra' : 'en'
	} else {
		return languages?.toLowerCase().includes(userlangusge.split('-')[0]) ? userlangusge.split('-')[0] : 'en'
	}
}

/**
 * @description throttle
 * @param {Function} fn
 * @param {number} delay
 * @return {Function}
 */
export const throttle = (fn: any, delay: number, immediate = true): any => {
	let timer: NodeJS.Timeout | null = null
	return function (this: any, ...args: any[]) {
		if (!timer) {
			timer = setTimeout(() => {
				!immediate && fn.apply(this, arguments)
				timer = null
			}, delay)
			immediate && fn.apply(this, args)
		}
	}
}

/**
 * @description debounce
 * @param {Function} fn
 * @param {number} delay
 * @return {Function}
 */
export const debounce = (fn: any, delay: number, immediate = true): any => {
	let timer: NodeJS.Timeout | null = null
	return function (this: any, ...args: any[]) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			!immediate && fn.apply(this, arguments)
			timer = null
		}, delay)
		immediate && fn.apply(this, args)
	}
}

/**
 * @description copy
 * @param {string} text
 * @return {void}
 */

export const copy = (text: any): void => {
	if (!text) return
	const input = document.createElement('input')
	input.setAttribute('readonly', 'readonly')
	input.setAttribute('value', text.toLocaleString())
	document.body.appendChild(input)
	input.select()
	document.execCommand('Copy')
	document.body.removeChild(input)
	showSuccessToast(t('copySuccess'))
}
// /**
//  * @description 获取图标url
//  * @param path
//  * @param name
//  * @param ext
//  * @param dir
//  * @return {string}
//  */
// export const getHomeIcons = (path: string, name: string, ext: string = 'png', dir: string = 'homeImg'): string => {
// 	return new URL(`../assets/${dir}/${path}/${name}.${ext}`, import.meta.url).href
// }
//获取货币符号
export const dollarSign = () => {
	return import.meta.env.VITE_BASE_DOLLARSIGN
}

/**
 * 根据value查找返回key值
 * @param myArray 数组名称
 * @param valueS value值
 * @returns key
 */
export const getArrayKey = (myArray: Array<{ key: any; value: any }>, valueS: any) => {
	let key = myArray.find((item) => item.value === valueS)?.key
	return key
}
export const getArrayValue = (myArray: Array<{ key: any; value: any }>, keyS: any) => {
	return myArray.find((item) => item.key === keyS)?.value
}

// export const getArrayKeyTN = (myArray: Array<{ typeName: string; type: number }>, valueS: number) => {

export const getArrayKeyTN = (myArray: Array<{ typeName: any; type: any }>, valueS: number) => {
	return myArray.find((item) => item.type === valueS)?.typeName
}

/**
 * @description 禁止ios在点击输入框时自动放大
 */

export const addMaximumScaleToMetaViewport = () => {
	const el = document.querySelector('meta[name=viewport]')

	if (el !== null) {
		let content = el.getAttribute('content')
		let re = /maximum\-scale=[0-9\.]+/g

		if (re.test(content as string)) {
			content = (content as string).replace(re, 'maximum-scale=1.0')
		} else {
			content = [content, 'maximum-scale=1.0'].join(', ')
		}

		el.setAttribute('content', content)
	}
}

/**
 * @description if ios
 * @returns {boolean}
 */
export const checkIsIOS = (): boolean => {
	return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
export const entitiesToUtf16 = (str: string) => {
	return (
		typeof str == 'string' &&
		str.replace(/&#(\d+);/g, function (match, dec) {
			let H = Math.floor((dec - 0x10000) / 0x400) + 0xd800
			let L = (Math.floor(dec - 0x10000) % 0x400) + 0xdc00
			return String.fromCharCode(H, L)
		})
	)
}

// 翻译
export const isJSON = (str: string) => {
	if (typeof str === 'string') {
		try {
			let updateStr = str.replace(/\r/g, '\\r').replace(/\n/g, '\\n')
			var obj = JSON.parse(updateStr)
			if (typeof obj === 'object' && obj) {
				return true
			} else {
				return false
			}
		} catch (e) {
			return false
		}
	}
}

export const downLoadFile = (data: File) => {
	var blob = new Blob([data], {
		type: 'application/vnd.ms-excel'
	})
	var objectUrl = URL.createObjectURL(blob)
	var a = document.createElement('a')
	document.body.appendChild(a)
	a.setAttribute('style', 'display:none')
	a.setAttribute('href', objectUrl)
	var filename = `${new Date().valueOf()}.xlsx`
	a.setAttribute('download', filename)
	a.click()
	URL.revokeObjectURL(objectUrl)
}

/*
 * status 1对象 2数组
 */
export const checkedVal = (status: number, values: any, limit: number, that: any, key: string, attr: string, index: number) => {
	var limit = limit || 99999999.99
	//console.log(obj, "eeeee");
	//var values = obj.target.value;
	//console.log(values=='', values > limit, limit);
	//console.log("isNumer:", values,  !isNaN(values * 1));
	if (values != '' && isNaN(values * 1)) {
		if (status == 1) {
			if (key) {
				that.$set(that[attr], key, limit)
			} else {
				that[attr] = limit
			}
		} else if (status == 2) {
			if (key) {
				that[attr][index][key] = limit
			} else {
				that[attr][index] = limit
			}
		}
		return
	}
	values =
		values > limit
			? limit
			: values.indexOf('.') != -1
			? values.replace(/^\s+|\s+$/g, '').split('.')[0] +
			  '.' +
			  values
					.replace(/^\s+|\s+$/g, '')
					.split('.')[1]
					.substr(0, 2)
			: values.replace(/^\s+|\s+$/g, '')

	if (status == 1) {
		if (key) {
			that.$set(that[attr], key, values)
		} else {
			that[attr] = values
		}
	} else if (status == 2) {
		if (key) {
			that[attr][index][key] = values
		} else {
			that[attr][index] = values
		}
	}
}

// 年月日固定返回
export const getDate = () => {
	const result = {
		today: {
			//今天
			start: dayjs().startOf('day').unix(),
			end: dayjs().endOf('day').unix()
		},
		yesterday: {
			//昨天
			start: dayjs().subtract(1, 'days').startOf('day').unix(),
			end: dayjs().subtract(1, 'days').endOf('day').unix()
		},
		tomorrow: {
			start: dayjs().subtract(-1, 'days').startOf('day').unix(),
			end: dayjs().subtract(-1, 'days').endOf('day').unix()
		},
		last7days: {
			//近7天
			start: dayjs().subtract(1, 'weeks').startOf('day').unix(),
			end: dayjs().subtract(1, 'days').endOf('day').unix()
		},
		thisMonth: {
			//本月
			start: dayjs().startOf('months').unix(),
			end: dayjs().endOf('day').unix()
		},
		lastMonth: {
			//上月
			start: dayjs().subtract(1, 'months').startOf('month').unix(),
			end: dayjs().subtract(1, 'months').endOf('month').unix()
		}
	}
	return result
}

// export const getDateStr = () => {
// 	let times: any = new Date()
// 	times.getYear() // 获取当前年份(2位)
// 	times.getFullYear() // 获取完整的年份(4位,1970-????)
// 	times.getMonth() // 获取当前月份(0-11,0代表1月)
// 	times.getDate() // 获取当前日(1-31)
// 	times.getDay() // 获取当前星期X(0-6,0代表星期天)
// 	times.getTime() // 获取当前时间(从1970.1.1开始的毫秒数)
// 	times.getHours() // 获取当前小时数(0-23)
// 	times.getMinutes() // 获取当前分钟数(0-59)
// 	times.getSeconds() // 获取当前秒数(0-59)
// 	times.getMilliseconds() // 获取当前毫秒数(0-999)
// 	times.toLocaleDateString() // 获取当前日期

// 	var mytime = times.toLocaleTimeString() // 获取当前时间
// 	times.toLocaleString() // 获取日期与时间
// }

/**
 *
 * @param fmt
 * @returns
	* // "yyyy-MM-dd HH:mm:ss"
	// let timeStr = getDateStr('[yyyy,MM,dd]')
	// let tStr = "'" + timeStr + "'"
	// console.log('timeStr', timeStr)
	// console.log('tStr', tStr)
 */
export const getDateStr = (fmt: any) => {
	let times: any = new Date()
	var o: any = {
		'M+': times.getMonth() + 1, // 月份
		'd+': times.getDate(), // 日
		'h+': times.getHours(), // 小时
		'm+': times.getMinutes(), // 分
		's+': times.getSeconds(), // 秒
		'q+': Math.floor((times.getMonth() + 3) / 3), // 季度
		S: times.getMilliseconds() // 毫秒
	}
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (times.getFullYear() + '').substr(4 - RegExp.$1.length))
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt))
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))

	return fmt
}

export const formatTimeDay = (
	year: string | number = '',
	month: string | number = '',
	day: string | number = '',
	placeholder = '-'
) => {
	return [year.toString(), month.toString(), day.toString()].join(placeholder)
}
type inDateType = {
	time?: string
	status?: number
	format?: string
}
/**
 * 用于处理时间弹窗插件
 * @param obj
 * status: 1 // {key: '2023-03-10', value: ['2023', '03', '10']}
 * 		   2 // {key: '13:21:37', value: ['13', '21', '37']}
 *  	else // {key: '2023-03-10 13:21:37', value: ['2023', '03', '10', '13', '21', '37']}
 * @returns
 */
export const fixDateStr = (obj?: inDateType): { key: string; value: any } => {
	// let { time = '', status = 1, format = 'YYYY-MM-DD HH:mm:ss' } = obj
	let time = obj?.time || ''
	let status = obj?.status || 1
	let format = obj?.format || 'YYYY-MM-DD HH:mm:ss'

	let values: any = {
		key: '',
		value: []
	}

	function fixDayjs() {
		return time ? dayjs(time) : dayjs()
	}
	let timeline
	let value
	switch (status) {
		case 1:
			format = 'YYYY-MM-DD'
			timeline = fixDayjs().format(format)
			value = timeline.split('-')
			break
		case 2:
			format = 'HH:mm:ss'
			timeline = fixDayjs().format(format)
			value = timeline.split(':')
			break
		case 3:
			format = 'YYYY-MM'
			timeline = fixDayjs().format(format)
			value = timeline.split('-')
			break
		default:
			timeline = fixDayjs().format(format)
			let arr = timeline.split(' ')
			let arr2 = arr[0].split('-')
			let arr3 = arr[1].split(':')
			value = [...arr2, ...arr3]
			break
	}

	values = {
		key: timeline,
		value: value
	}
	return values
}
export const dateRange = (code: number) => {
	const minDate = new Date(2022, 0, 1)
	const maxDate = new Date()
	if (code == -1) {
		maxDate.setTime(maxDate.getTime() - 24 * 60 * 60 * 1000)
	}
	return {
		minDate,
		maxDate
	}
}

export const dateRange1 = () => {
	const minDate = new Date(1970, 0, 1)
	const maxDate = new Date()

	return {
		minDate,
		maxDate
	}
}

// 获取当前语言
export const getLocal = () => {
	return localStorage.getItem('language')||import.meta.env.VITE_BASE_LANGUAGE || 'en'
	// return useLocalStorage('language', getBrowserLang())
}

export function setHtmlLang(key:any){
	let lang = key === 'ar' ? 'ar' : 'en'
	let dir = key === 'ar' ? 'rtl' : 'ltr'
	document.documentElement.lang = lang;
	document.documentElement.dir = dir;
}

//传入接口的语言key
export const getLocal1 = () => {
	const value= getArrayKey(rootConfig.languageCodes, localStorage.getItem('language')||import.meta.env.VITE_BASE_LANGUAGE||'en');
	if (value===undefined) return 0;
	return value;
}
export const setLocal = (lang: string) => {
	localStorage.setItem('language', lang)
}

export const numFilter2 = (num: number, decimal: number, str: number) => {
	if (num) {
		let newNum = num.toString()
		if (str == 1) {
			let numStr = parseFloat(newNum).toFixed(2)
			if (numStr.charAt(numStr.length - 1) == '0') {
				decimal = 1
			}
		}
		let index = newNum.indexOf('.')
		if (index !== -1) {
			newNum = newNum.substring(0, decimal + index + 1)
		} else {
			newNum = newNum.substring(0)
		}
		return parseFloat(newNum).toFixed(decimal)
	}
}

//格式化货币金额
export const digitalCarry = (value: any) => {
	if (!value) {
		return 0
	}

	let sign = ''
	if (value > 1000000) {
		value /= 1000000
		sign = 'M'
	} else if (value > 1000) {
		value /= 1000
		sign = 'K'
	}
	if (value.toString().indexOf('.') > -1) {
		value = value.toFixed(2)
	}
	return value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + sign
}

export const accMul = (arg1: number, arg2: number) => {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString()
	try {
		m += s1.split('.')[1].length
	} catch (e) {}
	try {
		m += s2.split('.')[1].length
	} catch (e) {}
	return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}

/**
 * @description: 接口请求异常处理方法
 * @param {Promise} promise
 * @return {*}
 */
export const fixMsg = (res: any) => {
	// @ts-ignore
	const t = i18n.global.t
	let msg
	let msgCodes = [214, 215, -1]
	let codes = ['']
	if (res.msgCode) {
		if (msgCodes.includes(res.msgCode) || codes.includes(res.code)) {
			msg = res.msg
		}  else {
			const codemsg='code' + res.msgCode
			const translated = t(codemsg)
			msg = (translated && translated !== codemsg) ? translated : res.msg
		}
	} else {
		msg = res.msg || ''
	}
	let msgCode = res.msgCode
	if(msg){
		if(msgCode===1006){
			return showDialog({ message: t(`code${msgCode}`), allowHtml: true});
		}
		showFailToast({
			message: `Error: ${msgCode ? msgCode : ''} \n ` + msg,
			wordBreak: 'break-word',
			className:'fail_message_toast',
			iconSize: 28
		})
	}
	// msg && showFailToast({
	// 		message: `Error: ${msgCode ? msgCode : ''} \n ` + msg,
	// 		wordBreak: 'break-word',
	// 		className:'fail_message_toast',
	// 		iconSize: 28
	// 	})
}
const white = [0,1007]
export const AwaitApiResult = async <T = any>(promise: Promise<any>): Promise<T | null> => {
	const result: IRes | any = await promise
		.then((res: IRes) => {
			if (res && !white.includes(res.code)) {
				fixMsg(res)
				return null
			}
			return res
		})
		.catch((error) => {
			fixMsg(error)
			return null
		})
	return result
}

//获取设备类型
export const getUserAgent = (isOld=true) => {
	//-1:未知 0:PC  1:Android  2:IOS  3:ipad
	if (!isOld){
		return  isPC?0:3;
	}
	let phonetype = -1
	let ua = navigator.userAgent.toLowerCase()
	// if(isHybridApp()) {
    //     return 5
    // }
	if (isPC) {
		phonetype = 0
	} else if (ua.indexOf('android') != -1 || ua.indexOf('adr') > -1) {
		phonetype = 1
	} else if (ua.indexOf('iphone') != -1) {
		phonetype = 2
	} else if (ua.indexOf('ipad') != -1) {
		phonetype = 3
	} else {
		phonetype = -1
	}
	//console.log("设备类型（0:PC  1:Android  2:IOS  3:ipad ）", phonetype);
	return phonetype
}

/*设备判断类型0=PC；3=H5；5=APP*/
export async function getUserDeviceType(): Promise<number>{
	let deviceType:number;
	const ua:boolean = await native.isNativePlatform()
	if(isPC){
		deviceType=0
	}else if(native.isEmbeddedApk() || native.isFullapk()){
		deviceType=5
	}else if (!ua){
		deviceType=3
	}else {
		deviceType=-1
	}
	return deviceType
}


// safari限制在回调中执行window.open,因此需要兼容性写法
export function openWindow(url: string,isHtml:boolean=false) {
	if (isHtml){
		const newPage:any = window.open('', '_blank');
		newPage.document.open();
		newPage.document.write(url);//运行 HTML 代码
		newPage.document.close();
		return newPage
	}else {
		const newPage =window.open(url);
		return newPage;
	}
}
// 第三方跳转
export const partyUrl = (data: string|any, parame?: number) => {
	const isString=typeof data==='string';
	// 需要兼容游戏  returnType 为2的情况是html文本
	// ios pc 安卓都要这样处理
	let link=isString?data:data.url;
	const type=isString?1:data.returnType;
	const phonetype = getUserAgent()
	if (parame == 1 && [1, 2, 3].includes(phonetype)&&isHybridApp()) {
		link += '&home=1'
	}
	if (type===2){
		return openWindow(link,true)
	}
	if (parame === 3) {
		return openWindow(link,false)
	}
	if (isPC) {
		return openWindow(link,false)
	} else {
		// 处理第三方跳转问题，暂时不可修改
		window.location.assign(link)
	}
}
// Md5加密
export const encryptWithMD5 = (data: string) => {
	const encryptedData = SparkMD5.hash(data)
	const encryptedDataHex = encryptedData.toString()
	return encryptedDataHex.toUpperCase().slice(0, 32);
}

/**
 * @description: 深拷贝方法
 * @param {T} obj
 * @return {*}
 */
export function deepCopy<T>(obj: T): T {
	if (typeof obj !== 'object' || obj === null) {
		return obj
	}

	if (Array.isArray(obj)) {
		return obj.map(deepCopy) as unknown as T
	}

	const copiedObj = {} as T
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			copiedObj[key] = deepCopy(obj[key])
		}
	}

	return copiedObj
}

export function randomGuid() {
	return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0
		var v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/**
 * window对象跳转页面
 * @param path
 */
export const windowToPath = (path?: string) => {
	const { protocol, host } = window.location
	const url = path || '/'
	const hashPath = url.startsWith('/') ? url : `/${url}`
	window.location.href = `${protocol}//${host}/#${hashPath}`
}
export function numberLength(numberType:string){
	const disctionlist = sessionStorage.getItem('areaPhoneLenList')
	if (!disctionlist) return true //如果没有返回，保证程序能继续运行，要返回true
	let dictionary: any = JSON.parse(disctionlist as string) //对应区号长度
	let areaLength = dictionary.find((item: any) => item.area == '+' + numberType)?.len //当前区号的长度
	if (areaLength?.indexOf('-') != -1) {
		let areaLengthList = areaLength?.toString().split('-') || []
		if (areaLengthList?.length == 2) {
			return  areaLengthList[1]
		} else {
			return 16
		}
	}
}
//判断手机长度是否等于获取对应区号的长度
export function maxlength(numberType: string, len: number) {
	const disctionlist = sessionStorage.getItem('areaPhoneLenList')
	if (!disctionlist) return true //如果没有返回，保证程序能继续运行，要返回true
	let dictionary: any = JSON.parse(disctionlist as string) //对应区号长度
	let areaLength = dictionary.find((item: any) => item.area == '+' + numberType)?.len //当前区号的长度
	//长度有区间
	if (areaLength?.indexOf('-') != -1) {
		let areaLengthList = areaLength?.toString().split('-') || []
		//==2是为了确保格式是8-10
		if (areaLengthList?.length == 2) {
			if (len < areaLengthList[0] || len > areaLengthList[1]) return false
			else return true
		} else {
			console.log('后端返回的格式有问题：' + areaLength)
			return true //即使格式有问题，也要保证能正常运行,一般不会发生
		}
	}
	if (areaLength != len) return false
	else return true
}

export function debounces<T extends (...args: any[]) => Promise<any>>(
	func: T,
	wait: number,
	immediate = false
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null

	return async function (this: any, ...args: Parameters<T>) {
		const context = this

		const later = async function () {
			timeout = null
			if (!immediate) await func.apply(context, args)
		}

		const callNow = immediate && !timeout

		clearTimeout(timeout as NodeJS.Timeout)
		timeout = setTimeout(later, wait)

		if (callNow) await func.apply(context, args)
	}
}

export function throttles<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null
	let previous = 0

	return function (this: any, ...args: Parameters<T>) {
		const context = this
		const now = Date.now()
		const remaining = wait - (now - previous)

		if (remaining <= 0) {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			previous = now
			func.apply(context, args)
		} else if (!timeout) {
			timeout = setTimeout(function () {
				previous = Date.now()
				timeout = null
				func.apply(context, args)
			}, remaining)
		}
	}
}

export const getDictionary = () => {
	const dictionary = import.meta.env.VITE_BASE_DICTIONARY
	return dictionary
}

export const getProjectName = () => {
	const ProjectName = import.meta.env.VITE_BASE_PROJECTNAME
	return ProjectName
}

/**
 * @description 0到99随机选组
 * @length 长度 10,20,30,40,50
 * @scope 范围  0~99输入100  0~999输入1000
 */
export const generateRondomNumbers = (length: number, start: number, end: number, threenumber: number) => {
	let numbers: any[] = []
	let leng = threenumber == 0 ? 2 : 3
	while (numbers.length < length) {
		var randomNum = Math.floor(Math.random() * (end - start + 1)) + start //生成0到99的随机数
		if (!numbers.includes(randomNum.toString().padStart(leng, '0'))) {
			numbers.push(randomNum.toString().padStart(leng, '0'))
		}
	}
	return numbers
}
/**
 * @description 选取同号数组
 * @start 起始值
 * @end   终点值
 */
export const getSameDigitNumbers = (start: number, end: number, digits: number) => {
	let numbers = []
	for (let i = start; i <= end; i++) {
		const numStr = i.toString().padStart(digits, '0')
		const firstDigit = numStr[0]
		if (numStr.split('').every((digit) => digit === firstDigit)) {
			numbers.push(i.toString().padStart(digits, '0'))
		}
	}
	return numbers
}
/**
 *  @description  选择一段区间内单双
 *  @start  区间起始值
 *  @end    区间结束值
 *  @even   指定数字是偶数或者奇数
 *  @size   生成长度，不足使用0进行补充
 */
export const getevenodd = (start: number, end: number, even: string, size: number) => {
	let numbers = []
	const isEven = even === 'even'
	for (let i = start; i <= end; i++) {
		if (i % 2 === 0) {
			if (isEven) {
				numbers.push(i.toString().padStart(size, '0'))
			}
		} else {
			if (!isEven) {
				numbers.push(i.toString().padStart(size, '0'))
			}
		}
	}
	return numbers
}
/**
 * @description  全部选中
 * @start 区间起始值
 * @end 区间结束㢟
 */
export const getall = (start: number, end: number) => {
	let numbers = []
	for (let i = start; i <= end; i++) {
		numbers.push(i.toString())
	}
	return numbers
}
/**
 *  @description  选择一段区间内大小
 *  @start  区间起始值
 *  @end    区间结束值
 *  @even   指定数字是大或者小
 *  @size   生成长度，不足使用0进行补充
 */
export const getbigsmall = (start: number, end: number, big: string, size: number) => {
	let numbers = []
	const isBig = big === 'big'
	const smallnumber = Math.floor((end + start) / 2)
	for (let i = start; i <= end; i++) {
		if (isBig) {
			if (i > smallnumber) {
				numbers.push(i.toString().padStart(size, '0'))
			}
		} else {
			if (i <= smallnumber) {
				numbers.push(i.toString().padStart(size, '0'))
			}
		}
	}
	return numbers
}
// 判断数组是否有相同项
export const checkDuplicateItems = (arr: any) => {
	const seenItems = new Set()
	for (let item of arr) {
		if (seenItems.has(item)) {
			return true
		}
		seenItems.add(item)
	}
	return false
}
/***
 * @description 是否是生产环境
 */
export const IS_PROD = import.meta.env.PROD
export const IS_DEV = import.meta.env.DEV

export const AllBlur = () => {
	if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
		// 获取页面上所有的输入元素
		var inputElements: any = document.querySelectorAll('input, textarea')
		// 遍历输入元素并将焦点移除
		for (var i = 0; i < inputElements.length; i++) {
			inputElements[i].blur()
		}
		return true
	}
	return false
}

export const removeVietnameseDiacritics = (input) => {
	var diacriticsMap = {
		á: 'a',
		à: 'a',
		ả: 'a',
		ã: 'a',
		ạ: 'a',
		ắ: 'a',
		ằ: 'a',
		ẳ: 'a',
		ẵ: 'a',
		ặ: 'a',
		ấ: 'a',
		ầ: 'a',
		ẩ: 'a',
		ẫ: 'a',
		ậ: 'a',
		é: 'e',
		è: 'e',
		ẻ: 'e',
		ẽ: 'e',
		ẹ: 'e',
		ế: 'e',
		ề: 'e',
		ể: 'e',
		ễ: 'e',
		ệ: 'e',
		í: 'i',
		ì: 'i',
		ỉ: 'i',
		ĩ: 'i',
		ị: 'i',
		ó: 'o',
		ò: 'o',
		ỏ: 'o',
		õ: 'o',
		ọ: 'o',
		ố: 'o',
		ồ: 'o',
		ổ: 'o',
		ỗ: 'o',
		ộ: 'o',
		ớ: 'o',
		ờ: 'o',
		ở: 'o',
		ỡ: 'o',
		ợ: 'o',
		ú: 'u',
		ù: 'u',
		ủ: 'u',
		ũ: 'u',
		ụ: 'u',
		ứ: 'u',
		ừ: 'u',
		ử: 'u',
		ữ: 'u',
		ự: 'u',
		ý: 'y',
		ỳ: 'y',
		ỷ: 'y',
		ỹ: 'y',
		ỵ: 'y',
		đ: 'd'
	}
	return input.toLowerCase().replace(/[áàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵđ]/g, function (match) {
		return diacriticsMap[match] || match
	})
}
// export const desensitizeString = (str: string): string => {
// 	if (str?.length >= 7) {
// 		return str.substring(0, 3) + '***' + str.substring(str.length - 3)
// 	} else {
// 		const stars = '***'
// 		const paddingLength = 7 - str.length
// 		const padding = '*'.repeat(paddingLength)
// 		return (
// 			str.substring(0, Math.ceil((7 - paddingLength) / 2)) +
// 			stars +
// 			padding +
// 			str.substring(Math.ceil((7 - paddingLength) / 2))
// 		)
// 	}
// }

/*脱敏处理优化*/
export const desensitizeString = (str: string): string => {
	if (typeof str !== 'string' || !str) return ''
	if (str.length >= 7) {
		return str.substring(0, 3) + '***' + str.substring(str.length - 3)
	} else {
		const totalLen = 7
		const leftLen = Math.floor((totalLen - 3) / 2)
		const rightLen = totalLen - 3 - leftLen
		const left = str.substring(0, leftLen)
		const right = str.substring(str.length - rightLen)
		return left + '***' + right.padStart(rightLen, '*')
	}
}


export function getCookie(cookieName:string) {
	var name = cookieName + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var cookieArray = decodedCookie.split(';');

	for (var i = 0; i < cookieArray.length; i++) {
		var cookie = cookieArray[i];
		while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}

	// 如果未找到对应的cookie，返回null或其他你希望的默认值
	return null;
}

export const bouns = (value:any)=>{
	return Math.round(value * 100) / 100;
}

export function splitIntoGroups(arr, groupSize) {
	var result = []
	for (var i = 0; i < arr.length; i += groupSize) {
		result.push(arr.slice(i, i + groupSize))
	}
	return result
}
export function isUserPhoto(value:string){
	if (!value) return false;
	if (value.startsWith('http')||value.startsWith('/')) return false;
	return  Number(value)<21
}

// 去除对象内所有字符串字段两端的空格（浅层，返回原对象）
export function trimFields<T extends Record<string, any>>(obj: T): T {
	for (const key in obj) {
		if (typeof obj[key] === 'string') {
			obj[key] = (obj[key] as string).trim() as T[Extract<keyof T, string>]
		}
	}
	return obj
}
