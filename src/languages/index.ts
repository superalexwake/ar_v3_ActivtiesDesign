import { createI18n } from 'vue-i18n'
import {getLocal} from '@/utils'
import { changeLange } from '@/utils/selectArr/rootConfig'
import { setNativeLang } from './modules/native'
import { ref } from 'vue'
import en from './modules/en'


let local = localStorage.getItem('language') || import.meta.env.VITE_BASE_LANGUAGE
let messages: any = ref({
	 en,
})
const i18n = createI18n({
	legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
	locale: local, // 设置语言类型
	fallbackLocale: 'en',
	globalInjection: true, // 全局挂载
	warnHtmlMessage: false, // 停止警告报错
	messages: messages.value,
	silentTranslationWarn: true, // 禁止警告
	datetimeFormats: {
		zh: {
			// 根据需求自定义
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			},
			long: {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			}
		},
		en: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		rus: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		vi: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		my: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		id: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		hd: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		th: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		md: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		bra: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		bd: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		pk: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		ar: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		ta: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		},
		te: {
			short: {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			}
		}
	}
});
const loadLocaleMessages = async (locale: string) => {
	let source=locale;
	const map:any={
		pk:'pak',
		bd:'bdt',
		th:'tha',
	}
	if (map[locale]) {
		locale = map[locale]
	}

	if (!messages.value[source]) {
		const messagesModule = await import(`./modules/${locale}.ts`);
		console.log('messagesModule.default',messagesModule.default)
		messages.value[source] = messagesModule.default
		i18n.global.setLocaleMessage(source, messagesModule.default)
	}
}
changeLange(i18n.global.t)
export const setGlobalLocale = async (langStr?: string) => {
	const lang = langStr || getLocal()
	await loadLocaleMessages(lang)
	i18n.global.locale.value = lang
	setNativeLang(lang)
	changeLange(i18n.global.t)
}

export default i18n
