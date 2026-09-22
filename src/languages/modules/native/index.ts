// vant-ui 语言包处理

import { Locale } from 'vant'

import zh from 'vant/es/locale/lang/zh-CN'
import en from 'vant/es/locale/lang/en-US'
import rus from 'vant/es/locale/lang/ru-RU'
import vi from 'vant/es/locale/lang/vi-VN'
import id from 'vant/es/locale/lang/id-ID'
import hd from 'vant/es/locale/lang/hi-IN'
import tha from 'vant/es/locale/lang/th-TH'
import bra from 'vant/es/locale/lang/pt-BR'
import bd from 'vant/es/locale/lang/bn-BD'
import md from './md' //需要自己写
import my from './my' //需要自己写
import ph from './ph' //需要自己写
import pk from './pak' //需要自己写
import ta from './ta' //需要自己写
import te from './te' //需要自己写
import ar from 'vant/es/locale/lang/ar-SA' //阿拉伯语

const nativeLang = {
	zh, // 中
	en, // 英
	rus, // 俄
	vi, // 越南
	id, // 印度尼西亚
	hd, // 印地
	tha, // 泰
	th: tha, // 泰
	md, // 缅甸
	bra, // 葡萄牙
	my, // 马来西亚
	ph, // 菲律宾
	pk, //巴基斯坦
	bd,
	ar,
	ta,//泰米尔语
	te,//泰卢固语
}
if (localStorage.language) {
	Locale.use(localStorage.language, nativeLang[localStorage.language])
}

export const setNativeLang = (lang: string) => {
	Locale.use(lang, nativeLang[lang])
}
