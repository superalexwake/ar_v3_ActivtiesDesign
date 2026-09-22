import iconHomeBanner from '@public/home/banner.png'
/*
 * @Author: Seven
 * @Date: 2024-03-14 17:00:09
 * @LastEditTime: 2025-03-04 12:16:07
 * @LastEditors: Seven
 * @Description: 
 */

import { GetElectronWithChildGame, GetGameCategoryList, getAllGameList, getBannerList, getDailyProfitRank, getGameUrl, getHomeData, getVideWithChildGame, GetAllowBetSetting } from "@/api"
import router from "@/router"
import { GlobalStore, SettingStore, useHomeStore } from "@/stores"
import { AllGameList, ElectronWithChildGame, Home, HomeGameList, VideoListType } from '@/types/api'
import { AwaitApiResult, updateHostname, AwaitWrap, currency, encodeToBase64, getUserAgent, isOpenInternalUrl, isPC, openInternalUrl, partyUrl, fixMsg,getSlotTitle } from '@/utils'
import { isHybridApp, openBrowser } from "@/utils/jsBridge"
import { useSessionStorage,useDebounceFn  } from "@vueuse/core"
import { useLoading } from '@/components/common/use'
import { showDialog, showFailToast, showToast } from 'vant'
import { computed, reactive, ref } from "vue"
import { useI18n } from "vue-i18n";
import {usePwaDownload} from "@/hooks/usePwa";
import {useStorage} from "@/hooks/useStorage.hook";
import { requireLoginAction } from '@/hooks/useLoginIntercept'

export type WinInfoType = {
  type: string;
  typeName: string;
  userPhoto: string;
  nickName: string;
  betAmount: number;
  amount: number;
  winTime: string;
  showType: number;
  imgUrl: string;
  entryType: string;
  vendorCode: string;
  vendorId: number;
  gameID: string;
  gameNameEn: string;
  state: number;
  isMaintain: number;
  isGameSaasMaintain: number;
  typeId: number | null;
}
export type RankLiskType = {
  nickName: string;
  price: number;
  time: string;
  typeName: string;
  userPhoto: string;
}


const homeState = reactive<{
  banner: Array<Home.SwiperProps>,
  winInfoList: Array<WinInfoType>,
  rankList: Array<RankLiskType>,
  gameTypeList: Array<HomeGameList>,
  allGameList: AllGameList | undefined,
  slotsGame: Array<ElectronWithChildGame>
  videoGame: Array<VideoListType>
	iosDialog: boolean
}>({
  banner: [],
  winInfoList: [],
  rankList: [],
  gameTypeList: [],
  allGameList: undefined,
  slotsGame: [],
  videoGame: [],
	iosDialog: false
})
export const useHome = () => {

  const settingS = SettingStore() as any
  const globalStore = GlobalStore()
  const userInfo = globalStore.getUserInfo
  const { start, end, flag } = useLoading()
	const {localStore}=useStorage()
  const { t } = useI18n()
	const {PWA} = usePwaDownload()
  const isRead = ref(true)
  const showPWA = useSessionStorage('show-pwa-download', true)
  const showChanglong = computed(() => settingS.getIsShowLotteryDragon) // 是否展示长龙
  const isAppDownload = computed(() => settingS.getIsCanAppDownload) //是否开启下载开关
  const isAppDownloadIcon = computed(() => settingS.getIsShowAppDownloadIcon) //是否开启下载开关
  const projectIcon = computed(() => settingS.getProjectLogo) // 项目图标
  const getBanner = computed(() => homeState.banner) // 轮播图
  const getWinInfo = computed(() => homeState.winInfoList) // 中奖信息
	const downloadIcon = computed(() => settingS.getWebIco) // 下载图标
	const webSiteUrl = computed(() => settingS.getWebSiteUrl) // 网站url
	const headLogo = computed(() => settingS.getHeadLogo) // 项目图标
  const isOpenInvitedWheel = computed(() => settingS.getIsOpenInvitedWheel) // 是否开启邀请转盘

  const isAlowNoRechargeGame = computed(() => {
    if(userInfo.allowNoRechargeGame === "1") return false;
    if(userInfo.canDirectToGame) return false;
    return true;
  }) 

  /**
   * @description: 获取消息是否已读
   * @return {*}
   */
  function getMessagesData(): void {
    const homeStore = useHomeStore()
    isRead.value = !(globalStore.getUserInfo.unRead > 0)
    homeStore.setReadState(isRead.value)
  }

  /**
   * @description: 获取首页顶部轮播图
   * @return {*}
   */
  const getBannerApi = async (): Promise<void> => {
    const res = await AwaitApiResult(getBannerList())
    if (res) {
      homeState.banner = res.data
      if (homeState.banner.length === 0) {
        homeState.banner.push({
          bannerUrl: iconHomeBanner,
          url: ''
        })
      }
    }
  }

  /**
   * @description: app下载
   * window._domain /web/config.js 中的kv检测逻辑
   * @return {*}
   */
  async function onDown(): Promise<void> {
		  router.push({
			  path: '/downloadCenter'
		  })
  }


  /**
   * @description: 获取中奖信息和盈利
   * @return {*}
   */
  async function getWinInfoDetail(): Promise<void> {
    const [err, res] = await AwaitWrap(getDailyProfitRank())
    if (err) {
      showFailToast({
        message: err.msg,
        wordBreak: 'break-word'
      })
    } else if (res) {
      homeState.winInfoList = res.dataList || []
		const dailyProfitList = res.penarikanList || []
	 
      if (dailyProfitList.length > 0) {
        homeState.rankList = dailyProfitList
      }
    }
  }

  /**
   * @description: 游戏大类获取，页面展示的大类显示隐藏和顺序都根据这个接口
   * @return {*}
   */
  const getGameType = async () => {
    const res = await AwaitApiResult<ObjResNull<HomeGameList[]>>(GetGameCategoryList())
    if (res) {
      homeState.gameTypeList = res.data || []
    }
  }

  /**
   * @description: 获取所有游戏
   * @return {*}
   */
  const getAllGame = async () => {
    const res = await AwaitApiResult<ObjResNull<AllGameList>>(getAllGameList())
    const otherList = ['slot', 'video', 'chess', 'sport', 'lottery']
    if (res) {
      let gameData: {
        [key: string]: any
      } = {}
      for (const [key, value] of Object.entries(res.data)) {
        let k = key.toLocaleLowerCase()
        if (key !== 'popular' && otherList.includes(k)) {
          gameData[k] = (value as Array<any>).filter((suc: any) => suc.state === 1);
        } else {
          gameData[k] = value
        }
      }
      console.log('gameData', gameData)
      homeState.allGameList = gameData as AllGameList
    }
  }

  /**
   * @description: 获取电子游戏厂商及其子游戏
   * @return {*}
   */
  const getSlotList = async () => {
    const res = await AwaitApiResult(GetElectronWithChildGame())
    if (res) {
      homeState.slotsGame = res.data
      console.log('homeState.slotsGame', homeState.slotsGame);
    }
  }

  // 电子 含子类游戏
	const getVideonChildGame=async ()=>{
		const res= await AwaitApiResult(getVideWithChildGame())
		if (!res)return;
		homeState.videoGame = res.data
	}
  //跳转二级页面
  const gol2 = (type:any) => {
    router.push({
      name: 'AllGames',
      query: {
        type
      }
    })
  }

  //跳转二级页面棋牌
  const gol2chess = (info:any,list:any) => {
    sessionStorage.setItem('gameType', JSON.stringify('chess'))
    sessionStorage.setItem('clickedItem', JSON.stringify(info))
    sessionStorage.setItem('slotGamesList', JSON.stringify(list))
    router.push({
      name: 'AllOnlineGames'
    })
  }
   const isSassGame=(info:any):boolean=>{
		if (!info)return false
	  return info.hasOwnProperty('vendorCode')&&info.vendorCode
	};
	const isSassLotteryGame=(info:any):boolean=>{
		if (!info)return false;
		const isCode=info.hasOwnProperty('gameCode');
		if(!info.gameCode) return settingS.getIsOpenArLottery
		return isCode&&info.gameCode
	};
	const goSassLotteryGame=async (lotteryurl:any,query:Record<any, any>,jump=true)=>{
		const parseCode = (path: string) => {
			const urls = path.split('_');
			return {
				gameCode: path,
				lottery: urls[0]
			}
		};
		const url=new URL(lotteryurl);
		// url searchParams 获取 参数
		const searchParams = url.searchParams;
		const token=searchParams.get('Token');
		const skin=searchParams.get('Skin');
		const lang=searchParams.get('Lang');
		localStore.set('ar_token',token);
		localStore.set('ar_api', updateHostname('api',url.origin));
		localStore.set('ar_api_json',updateHostname('draw',url.origin));
		localStore.set('ar_lang',lang||'en')
		localStore.set('ar_skin',skin);
		if (jump){
			const data=parseCode(query.gameCode);
			await router.push({
				name:data.lottery,
				query:data
			})
		}

	}
	const commonGame=async (info:any)=>{
		start(() => {
			// source.cancel('cancel')
			showDialog({
				title: '',
				message: t('gameLoadTimeOut')
			}).then(() => {
				router.push({
					path: '/'
				})
			})
		})
		let query = {
			gameCode: info.gameCode || info.gameID,
			vendorCode: isSassGame(info) ? info.vendorCode : Number(info.vendorId) || Number(info.slotsTypeID),
			returnUrl: location.origin
		}
		if (isSassGame(info)) {
			query.deviceType = getUserAgent(false)
		} else {
			query.phonetype = getUserAgent()
		}
		const lotteryURL=localStorage.getItem('lotteryLoginUrl');
		if (['ARLottery'].includes(query.vendorCode)&&lotteryURL){
			!flag.value && end(true);
			globalStore.notifyTransfer();
			await goSassLotteryGame(lotteryURL,query);
			return
		}
		const res = await AwaitApiResult(getGameUrl({
				...query
			}
		))
		if (res && !flag.value) {
			!flag.value && end(true)

			if (['ARLottery'].includes(query.vendorCode)){
				await goSassLotteryGame(res?.data?.url, query)
				return
			}
      if(isOpenInternalUrl()) {
        openInternalUrl({
			...(res?.data || {}),
			title: info.slotsName || info.gameNameEn || '',
			vendorCode: query.vendorCode,
			isCache: ['JILI', 'INOUT', 'PG'].includes(query.vendorCode)
		})
      } else if (isHybridApp()) {
				openBrowser('game', {
					...(res?.data || {}),
					gameName: info.slotsName || info.gameNameEn || '',
					vendorCode: query.vendorCode
				})
			} else {

				if (isPC||['Wickets9','CMD','IM','SaBa','ARLottery','ARBET'].includes(query.vendorCode)){
          			if(query.vendorCode == 'PG') return partyUrl(res?.data,)
					const page = partyUrl(res?.data, 1);
					const timer = setInterval(() => {
						if (page?.closed) {
							clearInterval(timer);
							console.log('新窗口已关闭');
							globalStore.notifyARGame(true)
							// 可以在这里执行后续操作
						}
					}, 500);
					return
				}
				return router.push({
					name:'game',
					query:{
						url:encodeToBase64(res?.data?.url),
						vendorCode:query.vendorCode,
					}
				})
			}
		} else {
			!flag.value && end(true)
			return
		}
	}
	const debounceGame=useDebounceFn(commonGame,500)
	const goChangLong=async ()=>{
		 const lotteryURL=localStorage.getItem('lotteryLoginUrl');
		if (settingS.getIsOpenArLottery){
			if (lotteryURL) {
				await globalStore.notifyTransfer()
				await goSassLotteryGame(lotteryURL, {}, false)
				await router.push({ name: 'SaasChangLong' })
				return
			}


			const res = await AwaitApiResult(getGameUrl({
				vendorCode: 'ARLottery',
				deviceType: getUserAgent(false),
			}))
			if (res && res.data) {
				await globalStore.notifyTransfer();
				await goSassLotteryGame(res.data.url, {}, false);
				await router.push({ name: 'SaasChangLong' });
				return;
			} else {
				fixMsg(res)
				return;
			}
		}
		router.push({ name: 'AllLotteryGames-ChangLong' })
	}
	/**
	 * 检查维护
	 * @param item
	 */
	const checkMaintain=(item:any)=>{
		const isMaintain=item.isMaintain||item.isGameSaasMaintain;
		if (isMaintain===1){
			return showToast({
				message: `${getSlotTitle(item.slotsName || item.vendorCode)} ${t('GameMaintenance')}`,
				type: 'fail'
			})
		} ;
		return false
	}
  /**
   * @description: 打开三方游戏
   * @param {any} info
   * @return {*}
   */
  const openThirdGame = async (info: any) => {
    if (!(await requireLoginAction())) return;
    if (['ARLottery'].includes(info.vendorCode)){
		return await debounceGame(info);
	}
    showDialog({
      title: t('tips'),
      message: t('tipsPlayGame'),
      cancelButtonText: t('cancel'),
      showCancelButton: true
    }).then(async () => {
		await commonGame(info);
    })
  }

  // 三方游戏判断容许首充才能进入游戏
  const onItemClick = (info: any) =>{
    isAlowGame(info, openThirdGame)
  }
	/**
	 * 判断彩票容许首充才能进入游戏
	 * 判断维护
	 * @param item
	 * @param callFn
	 */
  const isAlowGame = async(item:any, callFn: any) =>{
	if (checkMaintain(item.item||item))return;
	if (!globalStore.token) {
		return requireLoginAction();
	}
		// 判断是否是彩票
	if (!item.vendorCode) {
		return callFn(item);
	}
    if (isAlowNoRechargeGame.value) {
      const res = await AwaitApiResult(GetAllowBetSetting())
      if (!res) return;
      const {data: {allowNoRechargeGame, userRechargeTimes, lowestRechargeAmountToGame, userRechargeAmount, canDirectToGame }} = res
      if(allowNoRechargeGame == '1')return callFn(item);
      if(canDirectToGame) return callFn(item);

      if(Number(lowestRechargeAmountToGame) && Number(lowestRechargeAmountToGame) > userRechargeAmount ) {
        return showDialog({
          title: t('tips'),
          message: `${t('gameT',[currency(lowestRechargeAmountToGame)])}`,
          showCancelButton: true
        }).then(() => {
          router.push({name: 'Recharge'})
        }).catch(() => {
          // if(item.id || item.typeId) callFn(item)
        });
      }
      if (Number(lowestRechargeAmountToGame) === 0 && userRechargeTimes===0) {
        return showDialog({
          title: t('tips'),
          message: `${t('code1003')}\n${t('rechargeNow')}`,
          showCancelButton: true
        }).then(() => {
          router.push({name: 'Recharge'})
        }).catch(() => {
			if (settingS.getIsOpenArLottery)return;
           if(item.id || item.typeId) callFn(item);
          console.log('点击取消2')
        });
      }
      callFn(item)
    } else {
      callFn(item)
    }
  }

	// 中奖卡片进游戏，未关联子游戏或未启用的项
	const onWinInfoClick = async (item: WinInfoType) => {
		if (item.entryType !== 'gameItem') return
		if (!(await requireLoginAction())) return;
		if (!item.vendorCode){
			if (item.typeName.includes('K3')){
				router.push({
					name: 'AllLotteryGames-K3',
					query: { id: 2 }
				})
				return

			}
			if (item.typeName.includes('5D')) {
				router.push({
					name: 'AllLotteryGames-5D',
					query: { id: 3 }
				})
				return
			}
			if (item.typeName.includes('XoSo')) {
				router.push({
					name: 'AllLotteryGames-XoSo',
					query: { id: 5 }
				})
				return
			}
			if (item.typeName.includes('TrxWin')){
				router.push({
					name: 'AllLotteryGames-WinTrx',
					query: { id: 4 }
				})
				return
			}
			if (item.typeName.includes('WinGo')) {
				router.push({
					name: 'AllLotteryGames-WinGo',
					query: { id: 1 }
				})
				return
			}
			return;
		}
		isAlowGame({ ...item, slotsName: item.gameNameEn }, openThirdGame)
	}

  return {
    getBannerApi,
    onDown,
    getMessagesData,
    getWinInfoDetail,
    getGameType,
    getAllGame,
    onItemClick,
    onWinInfoClick,
    getSlotList,
    getVideonChildGame,
	openThirdGame,
	checkMaintain,
    isRead,
    getBanner,
    getWinInfo,
    showChanglong,
    isAppDownload,
    isAppDownloadIcon,
    showPWA,
    projectIcon,
    homeState,
    gol2,
    gol2chess,
	downloadIcon,
	webSiteUrl,
    isAlowGame,
	isSassLotteryGame,
	  goSassLotteryGame,
	  goChangLong,
	  headLogo,
    isOpenInvitedWheel
  }
}
