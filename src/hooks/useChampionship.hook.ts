import {
    championEntrance, getChampionTaskDetail, getTop10ChampionTaskDataUserList, getThirdGameListC, getGameUrl
} from '@/api'
import {AwaitApiResult, encodeToBase64, getUserAgent, isOpenInternalUrl, isPC, openInternalUrl, partyUrl} from '@/utils'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { GlobalStore } from '@/stores'
import { useRouter } from 'vue-router'
import { showDialog, type TabsInstance } from 'vant'
import { useLoading } from '@/components/common/use'
import { isHybridApp, openBrowser } from '@/utils/jsBridge'
import router from "@/router";


const serviceNowTime = ref()
export function useChampionship() {
    const { t } = useI18n()
    const router = useRouter()
    const championEntranceVO:any = ref({})
    const championTaskDetailVO = ref<any>({})
    const top10UserListVO = ref<any[]>([])
    const thirdGameListVO = ref<any[]>([])
    const arLotteryList = ref<any[]>([])

    //0-未开始，1-进行中，2-已结束
    const tabList = [
        {
            key: 1,
            title: t('ongoing')
        },
        {
            key: 0,
            title: t('cpsTip2')
        },
        {
            key: 2,
            title: t('ended')
        }
    ]

    //1=银行卡，2 =UPI，3=USDT,  4=E-Wallet，5=PIX，6=WavePay，7=TRX，8= KBZPay,10=USDT2  20=NewUPI
    const type:any ={
        1: t('bankCard'),
        2: 'UPI',
        3: 'USDT',
        4: 'E-Wallet',
        5: 'PIX',
        6: 'WavePay',
        7: 'TRX',
        8: 'KBZPay',
        10: 'USDT2',
        20: 'NewUPI'
    }
    // lottery
    
    let lotteryList = reactive<any>({
        30:{
            typeId: 30,
            class: 'wingo',
            title: 'Win Go 30s',
            path: 'WinGo',
            icon: 'Win Go',
        },
        1:{
            typeId: 1,
            class: 'wingo',
            title: 'Win Go 1Min',
            path: 'WinGo',
            icon: 'Win Go',
        },
        2:{
            typeId: 2,
            class: 'wingo',
            title: 'Win Go 3Min',
            path: 'WinGo',
            icon: 'Win Go',
        },
        3:{
            typeId: 3,
            class: 'wingo',
            title: 'Win Go 5Min',
            path: 'WinGo',
            icon: 'Win Go',
        },
        4:{
            typeId: 4,
            class: 'wingo',
            title: 'Win Go 10Min',
            path: 'WinGo',
            icon: 'Win Go',
        },
        5:{
            typeId: 5,
            class: 'd5',
            title: '5D 1Min',
            path: '5D',
            icon: '5D',
        },
        6:{
            typeId: 6,
            class: 'd5',
            title: '5D 3Min',
            path: '5D',
            icon: '5D',
        },
        7:{
            typeId: 7,
            class: 'd5',
            title: '5D 5Min',
            path: '5D',
            icon: '5D',
        },
        8:{
            typeId: 8,
            class: 'd5',
            title: '5D 10Min',
            path: '5D',
            icon: '5D',
        },
        9:{
            typeId: 9,
            class: 'k3',
            title: 'K3 1Min',
            path: 'K3',
            icon: 'K3',
        },
        10:{
            typeId: 10,
            class: 'k3',
            title: 'K3 3Min',
            path: 'K3',
            icon: 'K3',
        },
        11:{
            typeId: 11,
            class: 'k3',
            title: 'K3 5Min',
            path: 'K3',
            icon: 'K3',
        },
        12:{
            typeId: 12,
            class: 'k3',
            title: 'K3 10Min',
            path: 'K3',
            icon: 'K3',
        },
        13:{
            typeId: 13,
            class: 'trx',
            title: 'Trx Win Go 1Min',
            path: 'WinTrx',
            icon: 'Trx Win Go',
        },
        14:{
            typeId: 14,
            class: 'trx',
            title: 'Trx Win Go 3Min',
            path: 'WinTrx',
            icon: 'Trx Win Go',
        },
        15:{
            typeId: 15,
            class: 'trx',
            title: 'Trx Win Go 5Min',
            path: 'WinTrx',
            icon: 'Trx Win Go',
        },
        16:{
            typeId: 16,
            class: 'trx',
            title: 'Trx Win Go 10Min',
            path: 'WinTrx',
            icon: 'Trx Win Go',
        }
    })
    //竞标赛入口
    const championEntranceV = async () => {
        const res = await AwaitApiResult(championEntrance())
        if (res?.data) {
            championEntranceVO.value = res?.data
            serviceNowTime.value = res.serviceNowTime
        }
    }

    //获取赛事详细信
    const getChampionTaskDetailV = async (championId: number) => {
        const res = await AwaitApiResult(getChampionTaskDetail({ championId }))
        if (res?.data) {
            championTaskDetailVO.value = res?.data
            serviceNowTime.value = res.serviceNowTime
            if(championTaskDetailVO.value?.vendorCode == 'ARLottery') {
                return arLotteryList.value = championTaskDetailVO.value?.subGameNames?.map((i:any)=>{
                    return {
						vendorCode:'ARLottery',
						gameCode:i,
						title : i.replace('_', ' ')
					};
                })||[];
            }
            if (championTaskDetailVO.value?.vendorId) {
				const list=championTaskDetailVO.value.subGameIds||[]
                getThirdGameListV(championTaskDetailVO.value.vendorId, list)
            }
        }
    }

    //赛事前10名会员
    const getTop10UserList = async (championId: number) => {
        const res = await AwaitApiResult(getTop10ChampionTaskDataUserList({ championId }))
        if (res?.data) {
            top10UserListVO.value = res?.data
        }
    }

    //获取子游戏
    const getThirdGameListV = async (vendorId: number, id: string[]) => {
        let params: any = {
            type: vendorId,
            gameNameEn: '',
            isMiniGame:false,
			typeId:id[0]?Number(id[0]):null,
			typeIds:id||[],
        }
        const res = await AwaitApiResult(getThirdGameListC(params))
        if (res?.data) {
            thirdGameListVO.value = res?.data?.gameLists
        }
    }

    //跳转游戏
    const { start, end, flag } = useLoading()
    function onItemClick(item: { gameID: string; vendorId: number,vendorCode:any, gameNameEn: string ,slotsTypeID:any}) {
        const globalStore = GlobalStore()
        if (!globalStore.token) {
            router.push({ name: 'login' })
            return;
        }
        showDialog({
            title: t('tips'),
            message: t('tipsPlayGame'),
            cancelButtonText: t('cancel'),
            showCancelButton: true
        }).then(async () => {
            start(() => {
                showDialog({
                    title: '',
                    message: t('gameLoadTimeOut')
                }).then(() => {
                    router.push({
                        path: '/'
                    })
                })
            })
			const query={
                    vendorCode: item.hasOwnProperty('vendorCode')&&item.vendorCode?item.vendorCode:Number(item.vendorId)|| Number(item.slotsTypeID),
                    gameCode: item.gameID,
					returnUrl:location.origin,
                }
			if (item.hasOwnProperty('vendorCode')){
				query.deviceType=getUserAgent(false)
			}else {
				query.phonetype= getUserAgent()
			}
            const res = await AwaitApiResult(
                getGameUrl(query)
            )
            if (res && !flag.value) {
				!flag.value && end(true)
                if(isOpenInternalUrl()) {
                    openInternalUrl({
						...(res?.data||{}),
                        title: item.gameNameEn
                    })
                } else if (isHybridApp()) {
                    openBrowser('game', {
						...(res?.data||{}),
                        gameName: item.gameNameEn
                    })
                } else {
					if (isPC){
						return partyUrl(res?.data, 1)
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
            !flag.value && end()
        })
    }

    return {
        tabList, championEntranceV, championEntranceVO,
        serviceNowTime, getChampionTaskDetailV, championTaskDetailVO,
        getTop10UserList, top10UserListVO, thirdGameListVO, onItemClick,type, arLotteryList
    }
}
