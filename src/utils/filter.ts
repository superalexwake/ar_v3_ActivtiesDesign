import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import 'dayjs/locale/en'

// import { getLocal } from './util'

const local = localStorage.getItem('language') || 'zh'

let key = ''
switch (local) {
	case 'zh_TC':
		key = 'zh-tw'
		break
	case 'tc':
		key = 'zh-tw'
		break
	default:
		key = local
		break
}
if (key) {
	dayjs.locale(key)
}

//过滤时间
export const filterDate = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
	/**
	 *
	 * date 1.支持10位unix时间戳
	 *      2.支持 new Date()
	 *      3.fmt 默认返回格式'YYYY-MM-DD HH:mm' 可自行传递。
	 */
	// if (status === 1) {
	//     return filterDatepro(date, fmt)
	// }
	var timezone = 8 //目标时区时间，东八区
	var offset_GMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
	if (!date) {
		return ''
	}
	if (typeof date === 'number') {
		date = new Date(date * 1000)
	}
	var nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000)

	var o = {
		'M+': targetDate.getMonth() + 1,
		'D+': targetDate.getDate(),
		'h+': targetDate.getHours() % 12 === 0 ? 12 : targetDate.getHours() % 12,
		'H+': targetDate.getHours(),
		'm+': targetDate.getMinutes(),
		's+': targetDate.getSeconds(),
		'q+': Math.floor((targetDate.getMonth() + 3) / 3),
		S: targetDate.getMilliseconds()
	}
	var week = {
		0: '\u65e5',
		1: '\u4e00',
		2: '\u4e8c',
		3: '\u4e09',
		4: '\u56db',
		5: '\u4e94',
		6: '\u516d'
	}
	if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (targetDate.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(
			RegExp.$1,
			(RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']
		)
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
		}
	}
	return fmt
}

// 时分秒的格式化 1为原时间转换，2为将字符串转换为北京时间戳
export const filterTimeStamp = (date, status = 1, fmt = 'YYYY-MM-DD HH:mm:ss') => {
	var str = date
	if (status === 1) {
		if (isNaN(str)) {
			str = 0
		}
		str = Math.round(parseInt(date.valueOf()))
		str = dayjs(str).format(fmt)
	} else if (status === 2) {
		str = makeNewTimes(str)
	}
	return str
}

// 2020-01-01 => 10位时间戳
export const makeNewTimes = (value) => {
	value = value.replace(/-/g, '/')
	var str = Math.round(parseInt(new Date(value).valueOf()) / 1000)
	if (isNaN(str)) {
		str = 0
	}
	return str
}

// 1.本文件会将const.js里面定义的常量key自动生成为过滤器和函数（自动挂载到Vue原型上）
// 2.过滤器名称以 filter + key 结构组成且key首字母大写
// 3.eg: const.js 里面定义的key=disableStatus 则生成的过滤器名称为:filterDisableStatus
// 4.在页面js可以直接通过 this.filterDisableStatus 作为函数访问
// 5.在模板内可以做直接通过 {{ status | filterDisableStatus}} 作为过滤器访问
// 6.如需添加额外的过滤器，则像下面的货币过滤器（currency）这样定义，同时在filters里面注册

//13位时间戳转换为10位 unix时间戳
export const toUnix = (timestamp) => {
	return parseInt(timestamp / 1000)
}

//提交修改时间戳
export const Timestamp = (data) => {
	// return data;
	//算出本地时间与北京时间的偏差
	var piancha = new Date().getTimezoneOffset() / 60
	if (piancha > 0) {
		var offsetTime = 8 - piancha
		var offsetTime = offsetTime * 60 * 60
		var s = data - offsetTime - 46800 + offsetTime
	} else {
		var offsetTime = 8 + piancha
		var offsetTime = offsetTime * 60 * 60
		var s = data - offsetTime
	}
	return s < 0 ? 0 : s
}
export const toBeiJingTime = (obj, keys) => {
	let post = obj
	if (post.startTime) {
		post.startTime = parseInt(post.startTime / 1000 || 0)
		post.startTime = Timestamp(post.startTime)
	}
	if (post.endTime) {
		post.endTime = parseInt(post.endTime / 1000 || 0)
		post.endTime = Timestamp(post.endTime)
	}
	if (keys && keys.length > 0) {
		keys.map((v) => {
			let setObj = post[v]
			if (setObj) {
				setObj = parseInt(setObj / 1000 || 0)
				setObj = Timestamp(setObj)
			}
		})
	}

	return post
}
export const getNowTime = () => {
	return Math.ceil(new Date().getTime() / 1000)
}

/**
 *
 * @returns {number 10位} 当前时间+7天后的 时间戳
 */
export const nextWeek = () => {
	return dayjs(new Date()).add(7, 'day').unix()
}

/**
 *
 * @param {*} data
 * * date 1.支持10位unix时间戳
 *        2.支持 new Date()
 * @param {*} fmt 默认返回格式'YYYY-MM-DD HH:mm' 可自行传递。
 * @returns
 * let testTimeStamp = 316339616 // 1980
 * console.log('fromNow', filter.fromNow(testTimeStamp)) // 43 years ago
 */
export const fromNow = (data, fmt = 'YYYY-MM-DD HH:mm:ss') => {
	// console.log(dayjs("1990-01-01"),'dayyyyyy');
	// console.log(dayjs().toNow(), "now", dayjs());
	let dayObj = filterDate(data, fmt)
	return dayjs().to(dayjs(dayObj))
}

// do awesome filter
const filters = {
	filterDate,
	filterTimeStamp,
	makeNewTimes,
	toUnix,
	toBeiJingTime,
	fromNow
}

export const refiter = filters
