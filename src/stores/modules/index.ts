import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { ClientConfig, GlobalState, UserInfo } from '@/types/api'
import { getLocal, AwaitApiResult } from '@/utils'
import languages from '@/languages/languages'
import { hotifyARGameRecover,getTransfer} from "@/api";
import { useAssets } from '@/hooks/useAssets'
import { clearDialogSessionState } from '@/components/DialogQueue/sessionKeys'

export const GlobalStore = defineStore({
	id: 'GlobalState',
	state: (): GlobalState => ({
		// token
		token: useLocalStorage('token', ''),
		// userInfo
		userInfo: useLocalStorage('userInfo', {}),
		// language
		language: getLocal(),
		// client config
		clientConfig: useLocalStorage('clientConfig', {}),
		requsetData: '',
		isOpen: true,
		apiUrl: localStorage.getItem('ApiUrl') || '',
		visibility: 1,
		deferredPrompt: null,
		dollarSign: '',
		projectLogo: '',
		headLogo: '',
		areaCode: null,
		messageList: null,
		notifyTime:null,
		isNotify:false
	}),
	getters: {
		getToken: (state) => state.token,
		getLanguage: (state) => state.language,
		getLanguageIcon: (state) => {
			const { getLangFlag } = useAssets()
			return getLangFlag(state.language)
		},
		getLanguageName: (state) => {
			for (let item of languages) {
				if (item.key == state.language) {
					return item.name
				}
			}
		},
		getUserInfo: (state): UserInfo => state.userInfo as UserInfo,
		getClientConfig: (state): ClientConfig => state.clientConfig as ClientConfig,
		getReqData: (state) => state.requsetData,
		getIsOpen: (state) => state.isOpen,
		getApiUrl: (state) => state.apiUrl,
		getDollarSign: (state) => state.dollarSign,
		getMessage: (state) => state.messageList,
		getIsNotify: (state) => state.isNotify,
	},
	actions: {
		// setToken
		setToken(token: string) {
			this.token = token;
			localStorage.setItem('token', token)
			clearDialogSessionState()
		},
		// setUserInfo
		setUserInfo(userInfo: GlobalState['userInfo']) {
			this.userInfo = userInfo
			if (userInfo.groupDataShowAuth && userInfo.groupDataShowAuth.length) {
				const groupP = {}
				userInfo.groupDataShowAuth.forEach((item, index) => {
					groupP[item.id] = item.isShow
				})
				sessionStorage.setItem('permission', JSON.stringify(groupP))
			} else {
				sessionStorage.removeItem('permission')
			}
			useLocalStorage('userInfo', userInfo)
		},
		// updateLanguage
		updateLanguage(language: string) {
			this.language = language
			localStorage.setItem('language', language)
		},
		setPrompt(value: any) {
			this.deferredPrompt = value
		},
		SET_HTML_ATTR(webIco: any, projectName: any) {
			document.querySelector("link[rel='icon']")?.setAttribute('href', webIco)
			document.title = projectName
		},
		// setReqData
		setReqData(ReqData: string | {}) {
			this.requsetData = ReqData
		},
		// getIsOpen
		setIsOpen(item: boolean) {
			this.isOpen = item
		},
		setvisibility(value: number | null = null) {
			if (typeof value === 'number') {
				this.visibility = value
			} else {
				this.visibility++
			}
		},
		setMessage(value: any) {
			this.messageList = value
		},
		async notifyARGame(notify = false) {
			if (this.isNotify)return;
			if (notify){
				this.isNotify=true;
				await AwaitApiResult(hotifyARGameRecover());
				this.notifyTime=Date.now();
				this.isNotify=false;
				return
			}
			if(!this.token) return;
			const time= Date.now()-(this.notifyTime||0)
			if (time<=7*1000) return;
			this.isNotify=true;
			await AwaitApiResult(hotifyARGameRecover());
			this.notifyTime=Date.now();
			this.isNotify=false;
		},
		async notifyTransfer(){
			if(!this.token) return;
			try {
				await getTransfer();
			}catch (e) {
				
			}
		}
	}
})
