import { getLocal, getLocal1 } from './util'
import i18n from '@/languages'

const $t = i18n.global.t

/**
 * @description format time
 * @param {number | string | Date} timestamp
 * @param {string} format
 * @return {string} date
 * @example formatTime(timestamp, 'yyyy-MM-dd hh:mm:ss') // 2023-02-24 00:00:00
 * @example formatTime(timestamp, 'yyyy-MM-dd') // 2023-02-24
 * @example formatTime(timestamp, 'hh:mm:ss') // 00:00:00
 * @example formatTime(timestamp, 'w') // 一 二 三 四 五 六 日
 */
export const formatTime = (timestamp: number | string | Date, format: string): string => {
	let date = new Date(timestamp)
	let year = date.getUTCFullYear()
	let month = date.getUTCMonth() + 1
	let weekday = date.getUTCDay()
	let day = date.getUTCDate()
	let hour = date.getUTCHours()
	let minute = date.getUTCMinutes()
	let second = date.getUTCSeconds()
	// TODO: implement i18n / 国际化星期天数
	let week = [$t('sunday'), $t('monday'), $t('tuesday'), $t('wednesday'), $t('thursday'), $t('friday'), $t('saturday')]
	return format
		.replace('yyyy', year.toString())
		.replace('MM', month.toString().padStart(2, '0'))
		.replace('M', month.toString())
		.replace('dd', day.toString().padStart(2, '0'))
		.replace('hh', hour.toString().padStart(2, '0'))
		.replace('mm', minute.toString().padStart(2, '0'))
		.replace('ss', second.toString().padStart(2, '0'))
		.replace('w', week[weekday])
}

/**
 * @description format string
 * @param {string} str
 * @param {number} len
 * @return {string}
 */
export const formatString = (str: string, len: number): string => {
	if (str.length > len) {
		return str.slice(0, len) + '...'
	}
	return str.toUpperCase()
}

const NOTIFY_MESSAGE_HIGHLIGHT_RE = /\{\{\{([\s\S]*?)\}\}\}/g
const HTML_ESCAPE_MAP: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
}

export function escapeHtml(value: unknown): string {
	return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char])
}

function formatNotifyPlaceholderValue(value: string): string {
	const raw = value.trim()
	const normalized = raw.replace(/,/g, '')
	const isNumeric = /^[+-]?(?:\d+|\d*\.\d+)$/.test(normalized)
	if (!raw || !isNumeric) return value
	const amount = Number(normalized)
	return Number.isFinite(amount) ? currency(amount) : value
}

export function formatNotifyMessageHtml(message: unknown): string {
	const source = String(message ?? '')
	let html = ''
	let lastIndex = 0

	source.replace(NOTIFY_MESSAGE_HIGHLIGHT_RE, (match, value: string, offset: number) => {
		html += escapeHtml(source.slice(lastIndex, offset))
		html += `<span class="notify-message-highlight">${escapeHtml(formatNotifyPlaceholderValue(value))}</span>`
		lastIndex = offset + match.length
		return match
	})

	html += escapeHtml(source.slice(lastIndex))
	return html
}

/**
 * @description format points
 * @param {number} points
 * @return {string}
 */
export const formatPoints = (points: number): string => {
	const array = points.toString().split('')
	const length = array.length
	if (length > 3) {
		for (let i = length - 3; i > 0; i -= 3) {
			array.splice(i, 0, "'")
		}
	}
	return array.join('')
}

// 文件大小
/**
 * @description format file size
 * @param {number} fileSize
 * @returns {string}
 */
export const formatFileSize = (fileSize: number): string => {
	var temp: number | undefined | string
	if (fileSize < 1024) {
		return fileSize + 'B'
	} else if (fileSize < 1024 * 1024) {
		temp = fileSize / 1024
		temp = temp.toFixed(2)
		return temp + 'KB'
	} else if (fileSize < 1024 * 1024 * 1024) {
		temp = fileSize / (1024 * 1024)
		temp = temp.toFixed(2)
		return temp + 'MB'
	} else {
		temp = fileSize / (1024 * 1024 * 1024)
		temp = temp.toFixed(2)
		return temp + 'GB'
	}
}

/**
 * @description 格式化货币
 * @param value 金额
 * @param _currency 货币符号
 * @param decimals 小数位数
 * @returns {string}
 * @example formatCurrency(1000, '$', 2) // $1,000.00
 */

export const formatCurrency = (value: number, _currency: string, decimals: number) => {
	const newVal = new Intl.NumberFormat(getLocal()).format(value)
	const newDecimals = []
	for (let i = 0; i < decimals; i++) {
		newDecimals.push('0')
	}
	return `${_currency}${newVal}.${newDecimals.join('')}`
}

// 货币过滤器
export const currency = (value: any, _currency = '', decimals = 2) => {
	var digitsRE = /(\d{3})(?=\d)/g
	value = parseFloat(value)
	if (!isFinite(value) || (!value && value !== 0)) return ''
	_currency = _currency || sessionStorage.getItem('dollarSign') || '' //加默认值是因为如果没有获取到后台数据会显示null
	decimals = decimals != null ? decimals : 2
	var stringified = Math.abs(value).toFixed(decimals)
	var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified
	var i = _int.length % 3
	var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
	var _float = decimals ? stringified.slice(-1 - decimals) : ''
	var sign = value < 0 ? '-' : ''
	var Language = getLocal1()
	if (Language == '2') {
		return sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float + _currency
	} else {
		return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
	}
}

/**
 * @description 大额数字按千/百万缩写为 k/M，整数省略 .00，避免长数字撑破卡片布局
 * @param num 原始数值
 * @param unit 'auto'（默认，≥100 万自动切 M）或 'k'（恒用 k，不切 M）
 * @returns {string}
 * @example formatNumberToK(10000000) // ₫10M
 * @example formatNumberToK(10000000, 'k') // ₫10,000k
 */
export const formatNumberToK = (num: number | string, unit: 'auto' | 'k' = 'auto') => {
	const number = Number(num)
	if (number < 1000) {
		return currency(number, '', Number.isInteger(number) ? 0 : 2)
	}
	const useM = unit === 'auto' && number >= 1000000
	const scaled = Math.floor((number / (useM ? 1000000 : 1000)) * 100) / 100
	return currency(scaled, '', Number.isInteger(scaled) ? 0 : 2) + (useM ? 'M' : 'k')
}

/**
 * 金额格式化,整数不带小数位,有小数才保留两位。
 *
 * @remarks
 * `currency` 恒定两位小数,按整数价出图的场景会显示成 `₹342.00`。此处仅在整数时降到 0 位;
 * 有小数的分支必须保留——`342.50` 若按 0 位会被四舍五入成 `343`。
 */
export const currencyTrim = (value: any) => currency(value, '', Number(value) % 1 === 0 ? 0 : 2)

//过滤号码
export const filterNum = (value: string) => {
	if (value) {
		return `${value.substr(0, 4)}    ****    ****    ${value.substr(value.length - 4)}`
	} else {
		return ''
	}
}

export const hidePhoneNumber = (mobile?: string) => {
	let phoneNumber = localStorage.getItem('number') || ''
	let are = localStorage.getItem('numberType') || ''
	let phone = mobile ? mobile : are + phoneNumber
	if (phone) {
  // 使用正则表达式将手机号中的数字替换为星号
		if(phone.length>9){
			return '+' + phone.replace(/^(\d{5})\d+(\d{4})$/, '$1****$2')
		}else{
			return '+' + phone.replace(/^(\d{4})\d+(\d{2})$/, '$1****$2')
		}
		
	}
	return ''
}

export const hideEmail = (email: string) => {
	// 使用正则表达式将邮箱中的字符替换为星号
	return email.replace(/^([\w]{0,4})[\w\d]*@([\w\d]{0,15}[\w\d\.]*)$/, (match, p1, p2) => {
		// 获取@符号前的字符数
		const prefixLength = p1.length
		// 获取@符号后的字符数
		const suffixLength = p2.length
		// 如果@符号后的字符数大于15，则截取最后15个字符
		const suffix = suffixLength > 15 ? p2.substring(suffixLength - 15) : p2
		// 返回隐藏后的邮箱地址
		return `${prefixLength > 4 ? p1.substring(0, 4) + '****' : p1 + '****'}${suffixLength > 15 ? '' : '@'}${suffix}`
	})
}
export const getSlotTitle = (str: string) => {
	let text=str||'';
	if (text.includes('G9')) text = text.replace('G9', '9G');
	if (text.includes('AG_Video')) text = 'Choice'
	if (text.includes('AG_Electronic')) text = 'YGG'
	return  text;
}
