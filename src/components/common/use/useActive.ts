import { GetLoadedSetting, GetActiveSetting, GetFirstRechargeList, ReceiveFirstRechargeReward, SaveUserDayRequest, SaveUserGuidelines,
    GetDailyAwardCount } from "@/api";
import { AwaitApiResult } from "@/utils";
import { computed, reactive } from "vue";

// 活动中心红点聚合(红点一律读 activityRedDot.*,勿再用老字段拼)
export interface ActivityRedDot {
    activityAwardCount: number   // 活动奖励(每日+每周)待领笔数
    invitationBonusCount: number // 邀请奖励已完成未领取数
    bettingRebateCount: number   // 洗码量可领(≥100 为 1)
    superJackpotCount: number    // 超级大奖未领笔数
    firstGiftCount: number       // 新会员礼包可领档数
    invitedWheelCount: number    // 邀请转盘可抽次数
    attendanceBonusCount: number // 今日可签到领奖
    totalCount: number           // 以上聚合,底部 Activity 用
}
const createRedDot = (): ActivityRedDot => ({
    activityAwardCount: 0,
    invitationBonusCount: 0,
    bettingRebateCount: 0,
    superJackpotCount: 0,
    firstGiftCount: 0,
    invitedWheelCount: 0,
    attendanceBonusCount: 0,
    totalCount: 0,
})

const ActiveObj = reactive({
    isTaskState: false, // 是否开启邀请人任务
    isOpenJackpotReward: false, // 是否开启超级大奖
    isOpenWashCode: false, // 是否开启洗码量
    unJackpotCount: 0, // 未领取超级大奖数
    isOpenActivityAward: false, // 是否开启活动奖励
    unWeeklyAwardCount: 0, // 未领取每周奖励数
    unDayAwardCount: 0, //未领取每日奖励数
    isFinishUserGuidelines: false, // 只提示一次是否需要弹窗，后台参数 true:已完成，false：未完成，前端展示取反后端参数
    isFirstUserDayRequest: false, // 是否弹窗每日提示，后台参数true：首次，false：不是首次
    FirstRechargeList: [], // 首存奖励任务列表
    newbieGiftPackCount: 0, //未领取新手礼包奖励数
    isOpenChampion: 0, //是否展示锦标赛入口
	newMemberGiftPackageSwitch:false,  //新会员礼包
    firstDepositRewardCodeAmount: '', // 首充戏码量倍数
	todayRewards:0,
	totalRewards: 0,
	activityRedDot: createRedDot(),
})
const ActiveTaskMap = {
    'A1': { goPath: 'Recharge', icon: 'weeklyType1'}, // Recharge amount
    'A2': { goPath: 'Recharge', icon: 'weeklyType1'}, // Recharge times
    'A3': { goPath: 'Withdraw', icon: 'weeklyType2'}, // withdraw amount
    'A4': { goPath: 'Withdraw', icon: 'weeklyType2'}, // withdraw times
    'B5': { goPath: 'home', homeType: 'lottery', icon: 'weeklyType3'}, // bit lotterry amount
    'B6': { goPath: 'home', homeType: 'lottery', icon: 'weeklyType3'}, // bit lotterry times
    'B7': { goPath: 'home', homeType: 'slot', icon: 'weeklyType4'}, // bit Electronic game amount
    'B8': { goPath: 'home', homeType: 'slot', icon: 'weeklyType4'}, // bit Electronic game times
    'B9': { goPath: 'home', homeType: 'video', icon: 'weeklyType5'}, // bit video game amount
    'B10': { goPath: 'home', homeType: 'video', icon: 'weeklyType5'}, // bit video game amount
    'B11': { goPath: 'home', homeType: 'sport', icon: 'weeklyType6'}, // bit sport amount
    'B12': { goPath: 'home', homeType: 'sport', icon: 'weeklyType6'}, // bit sport times
    'B13': { goPath: 'home', homeType: 'chess', icon: 'weeklyType7'}, // bit chess amount
    'B14': { goPath: 'home', homeType: 'chess', icon: 'weeklyType7'}, // bit chess times
    'C15': { goPath: 'PromotionShare', icon: 'weeklyType8'}, // Number of invites
    'D16': { goPath: 'DailySignIn', icon: 'weeklyType9'}, // Active continuous check-in
    'D17': { goPath: 'SuperJackpot', icon: 'weeklyType10'}, // super jackpot
    'D18': { goPath: 'StrongBox', icon: 'weeklyType11'}, // recharge amount in the safety box
    'D19': { goPath: 'Laundry', icon: 'weeklyType12'}, // recharge amount in the Amount of laundry
}
const translateBoolean = (val: string) => {
    return val === '1'
}
// 白名单取字段:拒绝内部字段 newbieGiftPackCount(已计入 activityAwardCount 与 totalCount)
const setRedDot = (raw: any) => {
    const src = raw || {}
    ActiveObj.activityRedDot = {
        activityAwardCount: Number(src.activityAwardCount) || 0,
        invitationBonusCount: Number(src.invitationBonusCount) || 0,
        bettingRebateCount: Number(src.bettingRebateCount) || 0,
        superJackpotCount: Number(src.superJackpotCount) || 0,
        firstGiftCount: Number(src.firstGiftCount) || 0,
        invitedWheelCount: Number(src.invitedWheelCount) || 0,
        attendanceBonusCount: Number(src.attendanceBonusCount) || 0,
        totalCount: Number(src.totalCount) || 0,
    }
}

let filledByOpenAll = 0
let fullLoadInFlight: Promise<unknown> | null = null
// null 未探明 / true 走 GetLoadedSetting / false 回落 GetActiveSetting
let mergedApi: boolean | null = null

export const trackFullLoad = <T>(request: Promise<T>): Promise<T> => {
    fullLoadInFlight = request
    void request.finally(() => {
        if (fullLoadInFlight === request) fullLoadInFlight = null
    })
    return request
}

const applyActive = (data: any) => {
    ActiveObj.isTaskState = translateBoolean(data.isTaskState)
    ActiveObj.isOpenJackpotReward = translateBoolean(data.isOpenJackpotReward)
    ActiveObj.isOpenWashCode = translateBoolean(data.isOpenWashCode)
    ActiveObj.isOpenActivityAward = translateBoolean(data.isOpenActivityAward)
    ActiveObj.unJackpotCount = data.unJackpotCount
    ActiveObj.unWeeklyAwardCount = data.unWeeklyAwardCount || 0
    ActiveObj.isFinishUserGuidelines = !data.isFinishUserGuidelines
    ActiveObj.isFirstUserDayRequest = data.isFirstUserDayRequest
    ActiveObj.newbieGiftPackCount = data.newbieGiftPackCount || 0
    ActiveObj.isOpenChampion = data.isOpenChampion
    ActiveObj.todayRewards = data.todayRewards || 0
    ActiveObj.totalRewards = data.totalRewards || 0
    ActiveObj.newMemberGiftPackageSwitch = translateBoolean(data.newMemberGiftPackageSwitch)
    setRedDot(data?.activityRedDot ?? data?.ActivityRedDot)
}

// 缺 activityRedDot 判定为老后端,整包丢弃并标记回落
// fromOpenAll=true 时打时间戳(仅 useGlobalDialog 的全量调用传)
export const applyActiveFromLoadedSetting = (data: any, fromOpenAll = false) => {
    if ((data?.activityRedDot ?? data?.ActivityRedDot) == null) {
        if (data) mergedApi = false // 空响应是请求失败,不改判定
        return
    }
    mergedApi = true
    applyActive(data)
    if (fromOpenAll) filledByOpenAll = Date.now()
}

export const resetRedDot = () => {
    filledByOpenAll = 0
    setRedDot(null)
}

export function useActive() {
    // 不加 token 守卫:访客也要拿真实开关值渲染活动页入口
    // force=true 用于领取动作后,必须绕过跳过窗口,否则红点不减
    async function getActive(force = false) {
        if (!force && fullLoadInFlight) await fullLoadInFlight
        if (!force && Date.now() - filledByOpenAll < 5000) {
            filledByOpenAll = 0
            return
        }
        if (mergedApi !== false) {
            const res: any = await AwaitApiResult(GetLoadedSetting({ onlyRedDot: true }))
            if(res?.code === 0 || res?.data) applyActiveFromLoadedSetting(res.data)
            if (mergedApi) return
        }
        const legacy: any = await AwaitApiResult(GetActiveSetting())
        if(legacy?.data) applyActive(legacy.data)
    }
    async function saveUserGuidelines() {
        if(!localStorage.getItem('token')) return;
        const res = await AwaitApiResult(SaveUserGuidelines())
        if(res.code == 0) ActiveObj.isFinishUserGuidelines = false;
    }
    async function saveUserDayRequest() {
        const res = await AwaitApiResult(SaveUserDayRequest())
        if(res.code == 0) ActiveObj.isFirstUserDayRequest = false;
    }
    async function getFirstRechargeList(val: boolean = false) {
        if(!localStorage.getItem('token')) return;
        const res = await AwaitApiResult(GetFirstRechargeList({getAll: val}))
        if(res?.code == 0) {
            let isFinish = false
            ActiveObj.FirstRechargeList = res.data.map((item: any)=>{
                if(isFinish) item.canReceive = false;
                if(item.canReceive) isFinish = true;
                return item;
            })
            return new Promise((resolve)=>{
                resolve(res.data)
            })
        }
    }
    async function receiveFirstRechargeReward(taskId: any) {
        const res = await AwaitApiResult(ReceiveFirstRechargeReward({taskId}))
        if(res?.code == 0) {
            await getFirstRechargeList()
            await getActive(true)
            return new Promise((resolve)=>{
                resolve(true)
            })
        }
        return new Promise((resolve)=>{
            resolve(res?.data || null)
        })
    }
    async function getDailyAwardCount() {
        if(!localStorage.getItem('token')) return;
        const res = await AwaitApiResult(GetDailyAwardCount())
        if(res.code == 0) ActiveObj.unDayAwardCount = res?.data || 0;
    }
    const ActiveSotre = computed(()=>ActiveObj)
    const allUnAwardCount = computed(()=> ActiveSotre.value.unWeeklyAwardCount + ActiveSotre.value.unDayAwardCount + ActiveSotre.value.newbieGiftPackCount)
    return {
        ActiveTaskMap,
        ActiveSotre,
        allUnAwardCount,
        getActive,
        refreshRedDot: () => getActive(true),
        saveUserGuidelines,
        saveUserDayRequest,
        getFirstRechargeList,
        receiveFirstRechargeReward,
        getDailyAwardCount
    }
}
