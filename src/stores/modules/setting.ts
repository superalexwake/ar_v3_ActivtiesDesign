import { GetHomeSettings } from '@/api'
import { AwaitApiResult, setHtmlLang } from '@/utils'
import { defineStore } from 'pinia'
import pointObj from '@/utils/point'
import { injectManifestBlob } from '@/hooks/usePwa'
import { eventbusGlobalListener, emitEvent, eventType } from '@/hooks/useEventbus'
import { useFireBase } from '@/hooks/useFireBase'
import { indexdb } from '@/hooks/useIndexDB'
import { toRaw } from 'vue'
import type { LastestAppVersionInfo } from '@/types/appUpdate'
import { arbApiLine } from '@/api/arupi/line'

export const SettingStore: any = defineStore({
	id: 'SettingStore',
	persist: true, //true即为
	state: () => ({
		areaPhoneLenList: [] as any[], // 电话号码校验规则
		areacode: '',
		headLogo: import.meta.env.VITE_BASE_HEADLOGO, // 图片地址
		isShowAppDownloadUp: false, //是否开启App下载（true:开启，false:关闭）
		isShowAppDownloadDown: false, //是否显示App下载（true:开启，false:关闭）
		isShowLotteryDragon: false, //是否开启彩票长龙显示（true:开启，false:关闭）
		isShowDownAppBonusAmountSwitch: false, //是否显示下载APP奖励金额开关
		jackportMaxReswadAmount: 0, // 大奖奖励最大金额
		projectName: '', // 前端站点名字
		projectLogo: import.meta.env.VITE_BASE_PROJECTLOGO, // 前台logo
		languages: import.meta.env.VITE_BASE_LANGUAGE, // 语言
		webIco: '', // ico
		dollarSign: import.meta.env.VITE_BASE_DOLLARSIGN, // 货币符号
		upperOrLower: import.meta.env.VITE_BASE_UPPERORLOWER, // 提现人姓名是否大小写
		defaultCurrentLanguage: '',
		isSplitLocalEWallet: false, // 是否分开本地钱包
		isOpenLoginChangeLanguage: '0', //是否开启登陆注册选择语言
		ossUrl: '',
		rewardValidityTime: 0, // 超级大奖领取过期时间
		winRate: {} as Record<string, any>, // 电子中奖率
		isShowHotGameWinOdds: false, // 热门游戏中奖率开关
		isShowAppHandCodeWashingSwitch: false, // 是否展示一键戏码
		bigTurntableLink: '', // 邀请转盘
		bigTurntableImgUrl: '', // 邀请转盘图片
		homeBigTurntableLink: '', // 大转盘
		homeBigTurntableImgUrl: '', // 大转盘图片
		telegramExternalLink: '', // Tg外链
		telegramImgUrl: '', // Tg图片
		lotteryDragonIcon: '', // 彩票长龙图标
		isOpenTurntable: false,
		isPartnerReward: false,
		isSelfCustomerService: false, // 是否开启客服中心
		webSiteUrl: '',
		isOpenAdjustEvent: false, //是否开启adJust事件
		isOpenRegisterPhoneFirstZeroSwitch: import.meta.env.VITE_SHOWREGISTERTIP || false, //手机号码注册是否首位限制0开关
		firebaseConfig: {} as Record<string, any>, // firebase配置
		isOpenArLottery: false,
		isSwitchSaasBalance: false,
		arUpiInputUtrSwitch: false,
		isOpenInvitedWheel: false, // 是否开启邀请转盘
		invitedWheelImgUrl: '',
		invitedWheelTotalPrizeAmount: 0, // 邀请转盘总奖池金额
		isOpenDownAppRewardSwitch: false, // 是否开启下载app奖励
		isShowRewardCenter: false, // 是否显示奖励中心
		downAppBonusAmount: 0, // 下载App奖励金额
		downAppRechargeAmount: 0, // 下载App奖励充值金额
		bonusCenterImgUrl: '', // 奖励中心图片地址
		isOpenBrowserConsoleDebug: true, // 是否开启浏览器控制台调试
		needKycValidIsOpen: false,
		needFastKycValidIsOpen: false,
		homeBigTurntableSwitch: false,
		lastestAppVersionInfo: null as LastestAppVersionInfo | null
	}),
	getters: {
		getArUpiInputUtrSwitch: (state) => state.arUpiInputUtrSwitch,
		getIsCanAppDownload: (state) => state.isShowAppDownloadUp,
		getIsShowAppDownloadIcon: (state) => state.isShowAppDownloadDown,
		getIsShowLotteryDragon: (state) => state.isShowLotteryDragon,
		getJackportMaxReswadAmount: (state) => state.jackportMaxReswadAmount,
		getProjectLogo: (state) => {
			return state.projectLogo
		},
		getHeadLogo: (state) => {
			return state.headLogo
		},
		getDollarSign: (state) => state.dollarSign,
		getAreaPhoneLenList: (state) => state.areaPhoneLenList,
		getAreacode: (state) => state.areacode,
		getLanguage: (state) => state.languages,
		getWebIco: (state) => state.webIco,
		getProjectName: (state) => state.projectName,
		getUpperOrLower: (state) => state.upperOrLower,
		getDL: (state) => state.defaultCurrentLanguage,
		getIsSplitLocalEWallet: (state) => state.isSplitLocalEWallet,
		getLoginChangeLanguage: (state) => state.isOpenLoginChangeLanguage,
		getOSSUrl: (state) => state.ossUrl,
		getRewardValidityTime: (state) => state.rewardValidityTime,
		getWinRate: (state) => state.winRate,
		getIsShowAppHandCodeWashingSwitch: (state) => state.isShowAppHandCodeWashingSwitch,
		getBigTurntableLink: (state) => state.bigTurntableLink,
		getHomeBigTurntableLink: (state) => state.homeBigTurntableLink,
		getHomeBigTurntableImgUrl: (state) => state.homeBigTurntableImgUrl,
		getTelegramExternalLink: (state) => state.telegramExternalLink,
		getTelegramImgUrl: (state) => state.telegramImgUrl,
		getBigTurntableImgUrl: (state) => state.bigTurntableImgUrl,
		getLotteryDragonIcon: (state) => state.lotteryDragonIcon,
		getOpenTurntable: (state) => state.isOpenTurntable,
		getIsPartnerReward: (state) => state.isPartnerReward,
		getIsSelfCustomerService: (state) => state.isSelfCustomerService,
		getWebSiteUrl: (state) => state.webSiteUrl,
		getFirebaseConfig: (state) => state.firebaseConfig,
		getIsOpenArLottery: (state) => state.isOpenArLottery,
		getIsSwitchSaasBalance: (state) => state.isSwitchSaasBalance,
		getIsOpenInvitedWheel: (state) => state.isOpenInvitedWheel,
		getIsOpenDownAppRewardSwitch: (state) => state.isOpenDownAppRewardSwitch,
		getInvitedWheelImgUrl: (state) => state.invitedWheelImgUrl,
		getInvitedWheelTotalPrizeAmount: (state) => state.invitedWheelTotalPrizeAmount,
		getIsShowRewardCenter: (state) => state.isShowRewardCenter,
		getBonusCenterImgUrl: (state) => state.bonusCenterImgUrl,
		getIsShowDownAppBonusAmountSwitch: (state) => state.isShowDownAppBonusAmountSwitch,
		getDownAppBonusAmount: (state) => state.downAppBonusAmount,
		getDownAppRechargeAmount: (state) => state.downAppRechargeAmount,
		getNeedKycValid: (state) => state.needKycValidIsOpen,
		getNeedFastKycValidIsOpen: (state) => state.needFastKycValidIsOpen,
		getIsOpenBrowserConsoleDebug: (state) => state.isOpenBrowserConsoleDebug,
		getHomeBigTurntableSwitch: (state) => state.homeBigTurntableSwitch,
		getLastestAppVersionInfo: (state) => state.lastestAppVersionInfo
	},
	actions: {
		async getHomeSetting() {
			this.lastestAppVersionInfo = null
			const res = await AwaitApiResult(GetHomeSettings())
			if (res && res.data) {
				const {
					areaPhoneLenList,
					arbApiUrl,
					headLogo,
					isShowAppDownloadUp,
					isShowAppDownloadDown,
					isShowLotteryDragon,
					jackportMaxReswadAmount,
					projectName,
					projectLogo,
					languages,
					webIco,
					dollarSign,
					upperOrLower,
					defaultCurrentLanguage,
					isSplitLocalEWallet,
					isOpenLoginChangeLanguage,
					electronicWinRateExternalLink,
					electronicWinRateImgUrl,
					isShowElectronicWinRateExternalLink,
					isShowHotGameWinOdds,
					isShowAppHandCodeWashingSwitch,
					rewardValidityTime,
					ossUrl,
					bigTurntableLink,
					bigTurntableImgUrl,
					homeBigTurntableLink,
					homeBigTurntableImgUrl,
					lotteryDragonIcon,
					telegramExternalLink,
					telegramImgUrl,
					isOpenTurntable,
					isPartnerReward,
					eventRegionConfigList,
					isSelfCustomerService,
					webSiteUrl,
					firstDepositRewardCodeAmount,
					isOpenRegisterPhoneFirstZeroSwitch,
					isShowDownAppBonusAmountSwitch,
					isOpenAdjustEvent,
					firebaseConfig,
					jgConfig,
					isOpenArLottery,
					isSwitchSaasBalance,
					arUpiInputUtrSwitch,
					isOpenInvitedWheel,
					isOpenDownAppRewardSwitch,
					invitedWheelImgUrl,
					invitedWheelTotalPrizeAmount,
					isShowRewardCenter,
					downAppBonusAmount,
					downAppRechargeAmount,
					bonusCenterImgUrl,
					isOpenBrowserConsoleDebug,
					needKycValidIsOpen,
					homeBigTurntableSwitch,
					needFastKycValidIsOpen,
					lastestAppVersionInfo
				} = res.data
				this.projectName = projectName || import.meta.env.VITE_BASE_PROJECTNAME
				injectManifestBlob(projectName) // 注入manifest
				this.ossUrl = ossUrl
				this.rewardValidityTime = rewardValidityTime
				this.areaPhoneLenList = areaPhoneLenList
				arbApiLine.measure(arbApiUrl)
				this.headLogo = headLogo
				this.isShowAppDownloadUp = isShowAppDownloadUp
				this.isShowAppDownloadDown = isShowAppDownloadDown
				this.isShowLotteryDragon = isShowLotteryDragon
				this.jackportMaxReswadAmount = jackportMaxReswadAmount
				this.projectLogo = projectLogo
				this.languages = languages
				this.webIco = webIco
				this.dollarSign = dollarSign
				this.upperOrLower = upperOrLower
				this.areacode = areaPhoneLenList[0]?.area || ''
				this.isSplitLocalEWallet = isSplitLocalEWallet
				this.isOpenLoginChangeLanguage = isOpenLoginChangeLanguage
				this.isShowHotGameWinOdds = isShowHotGameWinOdds || false
				this.isShowDownAppBonusAmountSwitch = isShowDownAppBonusAmountSwitch || false
				this.isShowAppHandCodeWashingSwitch = isShowAppHandCodeWashingSwitch
				this.winRate = {
					electronicWinRateExternalLink,
					electronicWinRateImgUrl,
					isShowElectronicWinRateExternalLink
				}
				this.bigTurntableLink = bigTurntableLink
				this.bigTurntableImgUrl = bigTurntableImgUrl
				this.homeBigTurntableLink = homeBigTurntableLink
				this.homeBigTurntableImgUrl = homeBigTurntableImgUrl
				this.lotteryDragonIcon = lotteryDragonIcon
				this.telegramExternalLink = telegramExternalLink
				this.telegramImgUrl = telegramImgUrl
				this.isOpenTurntable = isOpenTurntable
				this.homeBigTurntableSwitch = homeBigTurntableSwitch || false
				this.isPartnerReward = isPartnerReward
				this.isSelfCustomerService = isSelfCustomerService
				this.webSiteUrl = webSiteUrl
				this.isOpenRegisterPhoneFirstZeroSwitch = isOpenRegisterPhoneFirstZeroSwitch
				this.isOpenAdjustEvent = isOpenAdjustEvent
				this.firebaseConfig = firebaseConfig
				this.isOpenArLottery = isOpenArLottery || false
				this.isSwitchSaasBalance = isSwitchSaasBalance || false
				this.arUpiInputUtrSwitch = arUpiInputUtrSwitch || false
				this.isOpenInvitedWheel = isOpenInvitedWheel || false // 是否开启邀请转盘
				this.isOpenDownAppRewardSwitch = isOpenDownAppRewardSwitch || false // 是否开启APP下载奖励
				this.invitedWheelImgUrl = invitedWheelImgUrl || '' // 邀请转盘图片链接
				this.bonusCenterImgUrl = bonusCenterImgUrl || '' // 邀请转盘图片链接
				this.invitedWheelTotalPrizeAmount = invitedWheelTotalPrizeAmount || 0 // 邀请转盘总奖池金额
				this.isShowRewardCenter = isShowRewardCenter || false
				this.isOpenBrowserConsoleDebug = isOpenBrowserConsoleDebug
				this.downAppBonusAmount = downAppBonusAmount || 0
				this.downAppRechargeAmount = downAppRechargeAmount || 0
				this.needKycValidIsOpen = needKycValidIsOpen || false
				this.needFastKycValidIsOpen = needFastKycValidIsOpen || false
				this.lastestAppVersionInfo = lastestAppVersionInfo || null
				sessionStorage.setItem('dollarSign', dollarSign)
				sessionStorage.setItem('fa1', firstDepositRewardCodeAmount)
				sessionStorage.setItem('areaPhoneLenList', JSON.stringify(areaPhoneLenList))
				if (!localStorage.getItem('language')) {
					this.defaultCurrentLanguage = defaultCurrentLanguage.replace('tha', 'th')
					setHtmlLang(this.defaultCurrentLanguage) //此时还没存language,设置默认lang
				}
				// 设置ico和title
				document.querySelector("link[rel='icon']")?.setAttribute('href', webIco)
				document.title = projectName
				pointObj.fbNew(eventRegionConfigList || [])
			}

			// 初始化eventbus 监听
			this.globalEventBusListener(res.data)
		},
		async globalEventBusListener(data: any) {
			const hasFirebase = data?.firebaseConfig?.messagingSenderId
			const hasJPush = data?.jgConfig?.webConfig
			if (!hasFirebase && !hasJPush) return;
			if (hasFirebase) {
				await indexdb.setKeyToDb('firebaseConfig', JSON.stringify(toRaw(data?.firebaseConfig)) || {});
			}
			const {initFirebase, uploadToken, requestPermission} = useFireBase(data?.firebaseConfig || {}, data?.jgConfig || null);
			eventbusGlobalListener((event) => {
				if (event === eventType.update_firebase_token) {
					requestPermission()
					initFirebase()
					uploadToken()
				}
			})
			emitEvent.update_firebase_token();
		}
	}
})
