import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { GlobalStore, SettingStore } from '@/stores'
import { getLocal,setHtmlLang } from '@/utils'
import languages from '@/languages/languages'
import { setGlobalLocale } from '@/languages'
import { useRouter } from 'vue-router'
import i18n from '@/languages'
import { changeLange } from '@/utils/selectArr/rootConfig'
import { useLanguageUpdate } from './useInfoupdate.hook'
const show = ref(false)
export function useLang() {
	const { locale } = useI18n()
	const globalStore = GlobalStore()
	const router = useRouter()

	// type：1个人中心 2登陆
	async function onClick(key: string, type: number) {
		setHtmlLang(key)
		// // ToDoA 仅有中文文本翻译
		locale.value = key
		globalStore.updateLanguage(key)
		// 公告缓存是按语言取的，切语言后作废，避免公告栏重新挂载时命中旧语言缓存
		globalStore.setMessage(null)
		await setGlobalLocale(key)
		// 上报语言切换
		useLanguageUpdate().upUserLanguage()
		changeLange(i18n.global.t)
		localStorage.setItem('needUpd', '1')
		if (type === 1) {
			goBack()
		} else {
			show.value = false
		}
	}

	const goBack = () => {
		router.back()
	}

	const languagesList = computed(() => {
		let index = 0
		const languagelist = SettingStore().getLanguage
		const list: any[] = []
		if (languagelist) {
			const languagesN = languagelist?.replace('th','tha').split('|')
			languagesN?.forEach((j: string) => {
				languages.forEach((i) => {
					if (j.toLowerCase().indexOf(i.key.toLowerCase()) !== -1) {
						list.push(i)
						index++
					} else if (i.key.toLowerCase().indexOf(j.toLowerCase()) !== -1) {
						list.push(i)
						index++
					}
				})
			})
		}
		if (!globalStore.getLanguage) globalStore.updateLanguage(getLocal())
		if (index == 0) return languages
		return list
	})

	const getLangName = (key: string) => {
		const nameObj = languagesList.value.find((item) => {
			return item.key === key
		})
		return nameObj?.key.toLocaleUpperCase() || ''
	}

	return { onClick, languagesList, locale, goBack, getLangName, show }
}

