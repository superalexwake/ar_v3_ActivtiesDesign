import { useDocumentVisibility } from '@vueuse/core'
import { computed, effectScope, ref, watch } from 'vue'
import { useGlobalDialog } from './useGlobalDialog.hook'

export enum ActivityStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    ENDED = 'ENDED'
}

interface ReBenefitData {
    type: number
    bonusAmount: number
    bonusAmountRate: number
    bonusAmountLimit: number
    activeStartTime: string
    activeEndTime: string
    totalRechargeCount: number
    netRechargeAmount: number
    isFinish: boolean,
    rewardAmount?: number
}

interface TimeUnits {
    hours: string
    minutes: string
    seconds: string
}

interface CountdownSnapshot {
    status: ActivityStatus
    remainingSeconds: number
    msToNextStep: number
}

interface ReBenefitStore {
    reBenefitObj: ReBenefitData | null
    serviceNowTime: null | number | string
}

// 全局单例：首页悬浮图标与回归弹窗共用同一份倒计时
const remainingSeconds = ref(0)
const activityStatus = ref<ActivityStatus>(ActivityStatus.NOT_STARTED)
let countdownWindow: { startAt: number; endAt: number } | null = null
let timerId: ReturnType<typeof setTimeout> | null = null
let serverClockOffset = 0
let hasBootstrapped = false

const parseTimeToTimestamp = (time?: string | number | null): number => {
    if (!time) return 0
    // iOS 不支持 '-' 分隔的日期字符串
    const timestamp = new Date(String(time).replace(/-/g, '/')).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
}

const padZero = (num: number): string => String(num).padStart(2, '0')

const toSnapshot = (status: ActivityStatus, remainingMs: number): CountdownSnapshot => {
    const safeMs = Math.max(0, remainingMs)
    return { status, remainingSeconds: Math.floor(safeMs / 1000), msToNextStep: safeMs % 1000 }
}

// 每次按绝对时间重算而不逐秒累减，定时器被节流或挂起后能自愈
const resolveCountdown = (): CountdownSnapshot => {
    if (!countdownWindow) return toSnapshot(ActivityStatus.ENDED, 0)

    const now = Date.now() + serverClockOffset
    if (now < countdownWindow.startAt) return toSnapshot(ActivityStatus.NOT_STARTED, countdownWindow.startAt - now)
    if (now <= countdownWindow.endAt) return toSnapshot(ActivityStatus.IN_PROGRESS, countdownWindow.endAt - now)
    return toSnapshot(ActivityStatus.ENDED, 0)
}

const stopTimer = () => {
    if (timerId === null) return
    clearTimeout(timerId)
    timerId = null
}

// 按「距下次变化还有多久」唤醒而非 setInterval(1000)：显示值由 floor 采样得到，
// 定时器只会晚不会早，采样点漂过一整秒就会漏掉一个数字（5 → 3）
const refreshCountdown = () => {
    const snapshot = resolveCountdown()
    activityStatus.value = snapshot.status
    remainingSeconds.value = snapshot.remainingSeconds

    stopTimer()
    if (snapshot.status === ActivityStatus.ENDED) return
    timerId = setTimeout(refreshCountdown, snapshot.msToNextStep + 10) // +10ms 确保越过秒边界
}

// 起止时间是服务器墙上时间，与 Date.now() 差着时区偏移，靠 serverClockOffset 抵消；
// 接口漏传服务器时间时沿用上一次的偏移，抹回 0 会让跨时区用户差几个小时
const syncFromStore = (store: ReBenefitStore) => {
    const serverNow = parseTimeToTimestamp(store.serviceNowTime)
    if (serverNow) serverClockOffset = serverNow - Date.now()

    const startAt = parseTimeToTimestamp(store.reBenefitObj?.activeStartTime)
    const endAt = parseTimeToTimestamp(store.reBenefitObj?.activeEndTime)
    countdownWindow = startAt && endAt ? { startAt, endAt } : null

    refreshCountdown()
}

// 必须用 detached scope：挂在组件上的话，切走页面时 watch 会随组件一起销毁，
// 而 hasBootstrapped 又挡住重建，倒计时就永远停住了
const bootstrapCountdown = (store: ReBenefitStore) => {
    if (hasBootstrapped) return
    hasBootstrapped = true

    effectScope(true).run(() => {
        watch(() => [store.reBenefitObj, store.serviceNowTime], () => syncFromStore(store), { immediate: true })
        // 切后台时定时器会被节流，回前台校准一次
        watch(useDocumentVisibility(), (visibility) => {
            if (visibility === 'visible') refreshCountdown()
        })
    })
}

const splitTime = (totalSeconds: number): TimeUnits => {
    const total = Math.max(0, totalSeconds)

    return {
        hours: padZero(Math.floor(total / 3600)),
        minutes: padZero(Math.floor((total % 3600) / 60)),
        seconds: padZero(total % 60)
    }
}

export function useReBenefit() {
    const { store } = useGlobalDialog()

    bootstrapCountdown(store)

    const reBenefitObj = computed<ReBenefitData | null>(() => store.reBenefitObj || null)
    const serviceNowTime = computed(() => store.serviceNowTime || '')
    const timeUnits = computed<TimeUnits>(() => splitTime(remainingSeconds.value))
    const formattedTime = computed(() => {
        const { hours, minutes, seconds } = timeUnits.value
        return `${hours}:${minutes}:${seconds}`
    })

    return {
        reBenefitObj,
        serviceNowTime,
        remainingSeconds,
        activityStatus,
        formattedTime,
        timeUnits
    }
}
