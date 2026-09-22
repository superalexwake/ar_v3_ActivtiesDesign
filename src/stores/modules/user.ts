import { defineStore } from 'pinia'
import { GetUserInfo, login, Register, RegisterState, getFBMsgSubscribe, LoginOff } from '@/api'
import { GlobalStore, SettingStore, useWalletStore, useCommonStore, useNotifyWsStore } from '@/stores'
import type { RegisterReq, ResRegisterState, UserState } from '@/types/api'
import { AwaitApiResult, fixMsg, getUserAgent } from '@/utils'
import { useTrigger } from '@/hooks'
import { apkParamsUpdate, getAdjustDeviceId } from '@/utils/jsBridge'
import { useLocalStorage } from '@vueuse/core/index'
import { native } from '@/utils/bridges'
import { useLanguageUpdate } from '@/hooks'
import { emitEvent } from '@/hooks/useEventbus'
import { getFacebookAttributionParams } from '@/utils/point'
import { getCurrentRoute, getLoginRedirectFromRoute, pushRoute, replaceRoute } from '@/router/navigation'
import { clearDialogSessionState } from '@/components/DialogQueue/sessionKeys'
import { clearRegCoupons, stashRegCoupons } from '@/components/DialogQueue/regCouponStash'
import type { RouteLocationRaw } from 'vue-router'

const getFacebookAttributionPayload = () => {
	const facebookAttribution = getFacebookAttributionParams()
	return {
		pixelId: facebookAttribution.pixelId,
		fbcId: facebookAttribution.fbcId,
		fbc: facebookAttribution.fbc,
		fbp: facebookAttribution.fbp,
		adId: facebookAttribution.adId
	}
}

type NotifyWsSessionPayload = {
	webSocketUrl?: string
	webSocketChannels?: string[]
	webSocketTokenExpireAt?: number
}

const getNotifyWsSubscription = (data: NotifyWsSessionPayload) => ({
	webSocketUrl: data.webSocketUrl,
	channels: data.webSocketChannels ?? [],
	tokenExpireAt: data.webSocketTokenExpireAt ?? 0,
})

export const useUserStore = defineStore({
	id: 'userStore',

	state: (): UserState => ({
		currentView: 'SignIn',
		userForm: {
			number: '',
			password: '',
			verify: '',
			rePassword: '',
			invitation: '',
			packId: native.getPackId() || '',
			numberType: '',
			email: '',
			remember: false,
			termAndPolicy: false,
			vCode: '',
			logintype: '',
			rememberpwd: false
		},
		rPwdForm: {
			number: '',
			numberType: '',
			email: '',
			verify: '',
			password: '',
			rePassword: ''
		},
		ARIP: '',
		numberTypes: [],
		countDown: 0,
		countEmailDown: 0,
		remember: false,
		messageDetail: {} as UserState['messageDetail'],
		isShowSMS: false, // 是否开放短信注册 取值字段：registerSMSState
		isRegisterState: false, // 是否开注册 取值字段：registerState
		isAddBankCardSMS: false, // 是否开启银行卡短信验证 取值字段：isOpenAddBankCardSMS
		isOpenForgetPasswordSMSState: false, // 是否开启忘记密码短信开关 取值字段：smsForgetPasswordState
		isOpenForgetPasswordEmailState: false, //是否开启邮箱开关
		isOpenRegisterEmailState: false,
		isOpenRegisterSMSState: false,
		isOpenCaptcha: false, //是否开登陆启图片验证
		isOpenRegisterCaptcha: false, //是否开启注册图片验证
		isOpenAddWithdrawEmailState: false, //银行卡手机提现验证码处理
		isOpenAddWithdrawSMSState: false, //银行卡邮件提现验证码处理,
		isOpenAddBankCardOpenEmail: false, // 绑定银行卡是否展示邮件
		isOpenExternalAccount: false,
		state: null,
		isOpenRegisterSMS: false,
		isOpenRegisterEmail: false
	}),
	getters: {
		getCurrentView: (state) => state.currentView,
		getUserForm: (state) => state.userForm,
		getNumberTypes: (state) => state.numberTypes,
		getMessagesDetail: (state): UserState['messageDetail'] => state.messageDetail
	},

	actions: {
		setCurrentView(view: string) {
			this.currentView = view
		},

		setUserForm(form: UserState['userForm']) {
			this.userForm = form
		},

		setNumberTypes(types: string[]) {
			this.numberTypes = types
		},
		setTermAndPolicy(v: boolean) {
			this.userForm.termAndPolicy = v
		},
		setNumberType(type: string) {
			this.userForm.numberType = type
			this.rPwdForm.numberType = type
		},

		setCountDown(count: number) {
			this.countDown = count
		},
		setCountEmailDown(count: number) {
			this.countEmailDown = count
		},
		setMessageDetail(detail: UserState['messageDetail']) {
			this.messageDetail = detail
		},
		async loginout() {
			const store = GlobalStore()
			localStorage.removeItem('lotteryLoginUrl')
			localStorage.removeItem('tokenHeader')
			localStorage.removeItem('refreshToken')
			clearDialogSessionState()
			clearRegCoupons()
			localStorage.removeItem('isToLogin')
			localStorage.removeItem('ar_token')
			localStorage.removeItem('firstSave')
			sessionStorage.removeItem('ar_pay')
			store.setUserInfo({})
			useLocalStorage('userInfo', {})
			await useNotifyWsStore().reset('auth:logout')
		},
		async logoutLocal(redirect: RouteLocationRaw = { name: 'login' }) {
			const navigation = pushRoute(redirect)
			if (navigation) void navigation.catch(() => {})
			const store = GlobalStore()
			store.setToken('')
			useWalletStore().setTimestampLast(0)
			localStorage.removeItem('isOpenFollow')
			this.userForm.vCode = ''
			await this.loginout().catch(() => {})
			localStorage.setItem('isToLogin', '1')
		},
		async logout(redirect: RouteLocationRaw = { name: 'login' }) {
			await LoginOff({}).catch(() => {})
			await this.logoutLocal(redirect)
		},
		remember(isInit = false) {
			const logintype = this.userForm.logintype || 'mobile'
			this.userForm.logintype = logintype
			const storeKey = `ar_account_${logintype}`
			const str = localStorage.getItem(storeKey) || ''
			const getValue = (value: string) => {
				try {
					return JSON.parse(value)
				} catch (e) {
					return null
				}
			}
			if (isInit) {
				const form = getValue(str)
				if (!form) return
				if (logintype === 'email') {
					this.userForm.email = form.email
				} else {
					this.userForm.number = form.number
					if (form.numberType) this.userForm.numberType = form.numberType
				}
				if (form.password) {
					this.userForm.rememberpwd = true
					this.userForm.password = form.password
				} else {
					this.userForm.rememberpwd = false
					this.userForm.password = ''
				}
				return
			}
			const numberType = this.userForm.numberType
			const number = this.userForm.number
			const email = this.userForm.email
			const password = this.userForm.rememberpwd ? this.userForm.password : ''
			localStorage.setItem(storeKey, JSON.stringify({ email, numberType, number, password, logintype }))
		},
		async signIn(params: {
			number?: string
			password?: string
			email?: string
			numberType: string
			logintype: string
			captchaId?: string
			track?: Object
			vCode?: string
		}) {
			let data: any = {}
			if (params.logintype == 'email') {
				data = {
					username: params.email,
					captchaId: params.captchaId,
					track: params.track,
					pwd: params.password,
					phonetype: getUserAgent(),
					logintype: params.logintype,
					packId:native.getPackId() || "",
					deviceId: native.getDeviceId()||localStorage.getItem('arvId'),
				}
			} else {
				data = {
					username: params.numberType + params.number,
					captchaId: params.captchaId,
					track: params.track,
					pwd: params.password,
					phonetype: getUserAgent(),
					logintype: params.logintype,
					packId:native.getPackId() || "",
					deviceId: native.getDeviceId()||localStorage.getItem('arvId')
				}
			}
			const fireBaseToken = localStorage.getItem('fireBaseToken') || null
			if (fireBaseToken) {
				data.fireBaseToken = fireBaseToken
			}
			Object.assign(data, getFacebookAttributionPayload())
			if (params.vCode) data.vCode = params.vCode
			const globalStore = GlobalStore()
			const { onTriggerLogin } = useTrigger()
			return new Promise(async (resolve, reject) => {
				const res: any = await login(data, { 'AR-REAL-IP': this.ARIP })
				if (res.data && res.code === 0) {
					const { token, tokenHeader, refreshToken, lotteryLoginUrl, parentUserId } = res.data
					const notifyWs = useNotifyWsStore()
					await notifyWs.reset('auth:login:clear-current')
					globalStore.setToken(token)
					this.remember()
					localStorage.setItem('tokenHeader', tokenHeader)
					localStorage.setItem('refreshToken', refreshToken)
					localStorage.setItem('numberType', params.numberType)
					localStorage.setItem('number', params.number || '')
					localStorage.setItem('email', params.email || '')
					localStorage.setItem('isToLogin', '1')
					if (lotteryLoginUrl) localStorage.setItem('lotteryLoginUrl', lotteryLoginUrl)

					const userInfo = await this.getUserInfo({ signature: token })
					await notifyWs.replaceSession(getNotifyWsSubscription(res.data))
					onTriggerLogin(userInfo?.data?.userId)
					await replaceRoute(getLoginRedirectFromRoute(getCurrentRoute()) || { name: 'home' })
					const { setLoading } = useCommonStore()
					setLoading(false)
					apkParamsUpdate('prediction', 'userId', [parentUserId])
					apkParamsUpdate('fcm', 'login', token)
					emitEvent.update_firebase_token();
					if (fireBaseToken) {
						await getFBMsgSubscribe({ fireBaseToken, isSubscribe: true })
					}
					return resolve({})
				}
				// 登录错误提示豁免
				const whitelist = [122, 33]
				if (!whitelist.includes(res.msgCode)) fixMsg(res)
				reject(res)
			})
		},

		async getUserInfo(params: { signature: string }) {
			const globalStore = GlobalStore()
			const walletStore = useWalletStore()
			const setting = SettingStore()
			const res = await AwaitApiResult(GetUserInfo(params))
			
			if (res) {
				globalStore.setUserInfo(res?.data)
				if (!setting.getIsSwitchSaasBalance) {
					walletStore.setAmount(res?.data?.amount)
				}
				walletStore.setUSDTCanAdd(res?.data)
				// 上报语言
				// 判断当前语言和用户语言是否一致
				if (res?.data?.useLanguage != globalStore.getLanguage) {
					const { upUserLanguage } = useLanguageUpdate()
					upUserLanguage()
				}
				return res
			}
		},
		async register(regParam: RegisterReq) {
			const gpcadid = getAdjustDeviceId('advertisingId')
			if (gpcadid) Object.assign(regParam, { gpcadid })
			const fireBaseToken = localStorage.getItem('fireBaseToken') || null
			if (fireBaseToken) {
				regParam.fireBaseToken = fireBaseToken
			}
			regParam.packId = native.getPackId() || "";
			Object.assign(regParam, getFacebookAttributionPayload())
			const res = await AwaitApiResult(Register(regParam, { 'AR-REAL-IP': this.ARIP }))
			return new Promise(async (resolve, reject) => {
				if (res) {
					emitEvent.update_firebase_token();
					const {
						token,
						tokenHeader,
						refreshToken,
						lotteryLoginUrl,
						webSocketUrl,
						webSocketChannels,
						webSocketTokenExpireAt,
						regReceivedRechargeCoupons,
					} = res.data || {}
					await useNotifyWsStore().reset('auth:register:clear-current')
					if (token) GlobalStore().setToken(token)
					stashRegCoupons(regReceivedRechargeCoupons)
					if (tokenHeader) localStorage.setItem('tokenHeader', tokenHeader)
					if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
					localStorage.setItem('isToLogin', '1')
					if (lotteryLoginUrl) localStorage.setItem('lotteryLoginUrl', lotteryLoginUrl)
					await useNotifyWsStore().replaceSession({
						webSocketUrl,
						channels: webSocketChannels ?? [],
						tokenExpireAt: webSocketTokenExpireAt ?? 0,
					})
					resolve(res)
				} else {
					reject(res)
				}
			})
		},
		async getIp() {
			// if (this.ARIP) return
			// try {
			// 	const res = await axios.post('https://tosma.lhlasjdanc.com/')
			// 	const ipRegex =
			// 		/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
			// 	if (res.data && ipRegex.test(res.data)) {
			// 		console.log('getIp', res.data)
			// 		this.ARIP = res.data || ''
			// 	}
			// } catch (error) {}
		},
		sendCode() {
			this.countDown = 120
			const timer = setInterval(() => {
				if (this.countDown > 0) {
					this.countDown--
				} else {
					clearInterval(timer)
				}
				if (this.countDown === 0) {
					clearInterval(timer)
				}
			}, 1000)
		},
		sendEmailCode() {
			this.countEmailDown = 300
			const emailtimer = setInterval(() => {
				if (this.countEmailDown > 0) {
					this.countEmailDown--
				} else {
					clearInterval(emailtimer)
				}
				if (this.countEmailDown === 0) {
					clearInterval(emailtimer)
				}
			}, 1000)
		},
		setRemember(remember: boolean) {
			this.remember = remember
		},
		setICode(code: string) {
			this.userForm.invitation = code
		},
		clearRpwdData() {
			this.rPwdForm = {
				number: '',
				numberType: SettingStore().getAreacode.replace('+', '') || '',
				verify: '',
				password: '',
				rePassword: '',
				email: ''
			}
			this.userForm.number = ''
		},
		async getRegisterState() {
			const res: ObjResNull<ResRegisterState> = await AwaitApiResult(RegisterState())
			if (res) {
				const {
					registerSMSState,
					registerState,
					isOpenAddBankCardSMS,
					isOpenForgetPasswordSMS,
					isOpenForgetPasswordEmail,
					registerEmailState,
					registerMobileState,
					isOpenAddWithdrawEmail,
					isOpenAddWithdrawSMS,
					isOpenCaptcha = '0',
					isOpenRegisterCaptcha = '0',
					addBankCardOpenEmail,
					isOpenExternalAccount,
					isOpenRegisterSMS,
					isOpenRegisterEmail
				} = res.data
				this.state = res.data
				const hasOpen = (num: string = '0') => {
					return Boolean(num === '1')
				}
				// 重置手机号和短信注册是同一个开关
				this.isShowSMS = hasOpen(registerSMSState)
				this.isRegisterState = hasOpen(registerState)
				this.isAddBankCardSMS = hasOpen(isOpenAddBankCardSMS)
				this.isOpenForgetPasswordSMSState = hasOpen(isOpenForgetPasswordSMS)
				this.isOpenForgetPasswordEmailState = hasOpen(isOpenForgetPasswordEmail)
				this.isOpenRegisterEmailState = hasOpen(registerEmailState)
				this.isOpenRegisterSMSState = hasOpen(registerMobileState)
				this.isOpenCaptcha = hasOpen(isOpenCaptcha)
				this.isOpenRegisterCaptcha = hasOpen(isOpenRegisterCaptcha)
				// 是否开启邮箱体现验证
				this.isOpenAddWithdrawEmailState = hasOpen(isOpenAddWithdrawEmail)
				// 是否开启短信体现验证
				this.isOpenAddWithdrawSMSState = hasOpen(isOpenAddWithdrawSMS)
				this.isOpenAddBankCardOpenEmail = hasOpen(addBankCardOpenEmail)
				this.isOpenExternalAccount = hasOpen(isOpenExternalAccount)
				this.isOpenRegisterSMS = hasOpen(isOpenRegisterSMS)
				this.isOpenRegisterEmail = hasOpen(isOpenRegisterEmail)

				return res
			}
			return {}
		}
	}
})
