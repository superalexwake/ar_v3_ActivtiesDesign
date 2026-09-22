import {
	GetBetLimitRsp,
	GetHistoryIssuePageRsp,
	getLotteryHistoryIssue,
	getLotteryOssHistoryIssue,
	getLotteryRecord,
	getLotteryWinLossResult,
	LotteryGameCodeEnum,
	motoRaceBet,
	MotoRaceBetContentEnum
} from '@/saasLottery/api'
import { INJECT_KEY, useGlobalContext, useLottery, useToast } from '@/saasLottery/hooks'
import { toCamelCase } from '@/saasLottery/utils'
import { computed, ComputedRef,inject, provide, reactive, ref, Ref, watch, WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import { useSound } from './useSound'

interface MotorcycleState {
	betScopes: ComputedRef<number[]>
	betMultiples: ComputedRef<number[]>
	historyIssues: ComputedRef<any[]>
	issue: ComputedRef<string>
	canBet: ComputedRef<boolean>
	gameCode: ComputedRef<LotteryGameCodeEnum>
	amount: WritableComputedRef<number>
	betMultiple: WritableComputedRef<number>
	betDialog: ComputedRef<boolean>
	betLimitLoading: Ref<boolean>
	playRate: ComputedRef<number>
	playBet: ComputedRef<string | number | null>
	onClearBet: () => void
	onBetting: () => void
	getBetLimit: () => Promise<void>
	agreePreSale: Ref<boolean>
	loading: Ref<boolean>
	historyIssuesTotalPage: ComputedRef<number>
	betLimit: ComputedRef<GetBetLimitRsp[]>
	currentTab: WritableComputedRef<number>
	countdown: ComputedRef<any>
	currentResult: ComputedRef<any>
	statistics: ComputedRef<any>
	currentPlayType: ComputedRef<any>
}

interface MotorcycleStore {
	betDialog: boolean
	amount: number
	betMultiple: number
	playType: string
	playBet: number | string | null
	playRate: number
	/*
	 *开奖历史数据
	 */
	historyIssues: GetHistoryIssuePageRsp[]
	historyIssuesTotalPage: number
	currentTab: number
}

export function useMotorcycle() {
	const toast = useToast()
	const { t } = useI18n()
	const { updateBalance, onBetTrigger } = useGlobalContext()
	const mapBet = new Map()
	const state = reactive<MotorcycleStore>({
		betDialog: false,
		amount: 1,
		betMultiple: 0,
		playType: '',
		playBet: null,
		playRate: 0,
		/*
		 *开奖历史数据
		 */
		historyIssues: [],
		historyIssuesTotalPage: 0,
		currentTab: 1
	})
	const pageInfo = reactive({
		pageSize: 10,
		pageNo: 1,
		totalPage: 0
	})
	const betClose = ref(false)
	const betMultiple = ref(1)
	const loading = ref(false)
	const hisRecord = ref<any[]>([])
	// const totalPage = ref(0)
	const winner = ref()
	const liveTime = ref(0)
	const currentResult = ref<any>(null)
	const statistics = ref<any>({})
	const myRecord = ref<any[]>([])

	const hisPageInfo = reactive({
		pageSize: 10,
		pageNo: 1,
		totalPage: 50
	})
	const { isMuted,soundSetting, visibleMute} = useSound()

	const {
		rates,
		betScopes,
		betMultiples,
		issue,
		countdown,
		countdownTime,
		canBet,
		sound,
		gameCode,
		agreePreSale,
		introduceDialog,
		introduceLoading,
		betLimitLoading,
		introduceHtml,
		issueLoading,
		lotteryCode,
		betLimit,
		issueData,
		onSwitchIntroduce,
		onSwitchSound,
		getIssue,
		getIntroduce,
		getBetLimit,
		setLotteryCode,
		visibilityStatus,
	} = useLottery({
		processSound: async () => {}
	})

	/*
	 * 数字投注
	 */
	const nums = Array.from({ length: 10 }, (_, i) => i)
	const numPlay = ['FirstNum', 'SecondNum', 'ThirdNum']
	const numbers = computed(() => {
		const data = rates.value.find(({ playType }: any) => playType === numPlay[state.currentTab - 1])
		if (!data) return []
		return nums.map((item) => ({
			playType: numPlay[state.currentTab - 1],
			playBet: item + 1,
			playRate: data.playRate
		}))
	})

	const bigSmall = [
		{
			label: '1st',
			type: 'FirstBigSmall',
			value1: 'Big',
			value2: 'Small'
		},
		{
			label: '2nd',
			type: 'SecondBigSmall',
			value1: 'Big',
			value2: 'Small'
		},
		{
			label: '3rd',
			type: 'ThirdBigSmall',
			value1: 'Big',
			value2: 'Small'
		}
	]
	const oddEven = [
		{
			label: '1st',
			type: 'FirstOddEven',
			value1: 'Odd',
			value2: 'Even'
		},
		{
			label: '2nd',
			type: 'SecondOddEven',
			value1: 'Odd',
			value2: 'Even'
		},
		{
			label: '3rd',
			type: 'ThirdOddEven',
			value1: 'Odd',
			value2: 'Even'
		}
	]
	const bigSmallData = computed(() => {
		let str = ['FirstBigSmall', 'SecondBigSmall', 'ThirdBigSmall']
		const data = rates.value.filter(({ playType }: any) => str.includes(playType))
		if (!data) return []
		return bigSmall.map((item, index) => ({
			...item,
			playRate1: data.find(({ playType, playBet }: any) => playType === item.type && playBet === 'Big')?.playRate || 1,
			playRate2: data.find(({ playType, playBet }: any) => playType === item.type && playBet === 'Small')?.playRate || 1
		}))
	})

	const oddEvenData = computed(() => {
		let str = ['FirstOddEven', 'SecondOddEven', 'ThirdOddEven']
		const data = rates.value.filter(({ playType }: any) => str.includes(playType))
		if (!data) return []
		return oddEven.map((item, index) => ({
			...item,
			playRate1: data.find(({ playType, playBet }: any) => playType === item.type && playBet === 'Odd')?.playRate || 1,
			playRate2: data.find(({ playType, playBet }: any) => playType === item.type && playBet === 'Even')?.playRate || 1
		}))
	})

	const betDialog = computed({
		get() {
			return state.betDialog
		},
		set(val: boolean) {
			state.betDialog = val
		}
	})
	const amount = computed({
		get() {
			return state.amount
		},
		set(val: number) {
			state.amount = val
		}
	})
	const currentTab = computed({
		get() {
			return state.currentTab
		},
		set(val: number) {
			state.currentTab = val
		}
	})

	const playRate = computed(() => state.playRate)
	const playBet = computed(() => state.playBet)
	const historyIssues = computed(() => state.historyIssues)
	const history1 = computed(() => state.historyIssues[0] || {})
	const history2 = computed(() => state.historyIssues.slice(1, 10) || [])
	const historyIssuesTotalPage = computed(() => state.historyIssuesTotalPage)
	const currentPlayType = computed(() => state.playType)

	const onBet = (item: any) => {
		if (betClose.value) return
		if (issueData.value?.gameCode !== gameCode.value) return
		if (countdown.value.seconds <= 22) {
			showToast({
				message: t('moto10'),
			})
			return
		}
		state.playBet = item.playBet
		state.playType = item.playType
		state.playRate = item.playRate
		state.betDialog = true
		state.amount = betScopes.value[0] || 1
		if (!betMultiple.value) betMultiple.value = betMultiples.value[0] || 1
	}

	const handleBet = (type: string, index: number) => {
		if (betClose.value) return
		if (issueData.value?.gameCode !== gameCode.value) return
		if (countdown.value.seconds <= 22) {
			showToast({
				message: t('moto10'),
			})
			return
		}
		const oddEven = ['FirstOddEven', 'SecondOddEven', 'ThirdOddEven']
		const bigSmall = ['FirstBigSmall', 'SecondBigSmall', 'ThirdBigSmall']

		if (betClose.value) return
		if (type === 'Odd' || type === 'Even') {
			state.playType = oddEven[index]
		}
		if (type === 'Big' || type === 'Small') {
			state.playType = bigSmall[index]
		}
		state.playBet = type
		state.playRate =
			rates.value.find(({ playType, playBet }: any) => playType === state.playType && playBet === type)?.playRate || 1

		state.betDialog = true
		state.amount = betScopes.value[0] || 1
		if (!betMultiple.value) betMultiple.value = betMultiples.value[0] || 1
	}

	const onClearBet = (clearBet = false) => {
		state.betDialog = false
		state.playRate = 0
		betMultiple.value = 1
		state.amount = 0
		state.playType = ''
		clearBet && mapBet.clear()
		setTimeout(() => {
			state.playBet = null
		}, 300)
	}

	const onBetting = async () => {
		if (loading.value) return
		if (!agreePreSale.value) return toast.error(t('common.agreePreSale'))
		if (!issue.value) return toast.error(t('common.noIssueNumber'))
		if (!state.playType) return
		if (issueData.value?.gameCode !== gameCode.value) return
		loading.value = true
		try {
			const { result } = await motoRaceBet({
				gameCode: gameCode.value,
				issueNumber: issue.value,
				amount: state.amount,
				betMultiple: betMultiple.value,
				betContent: `${state.playType}_${toCamelCase(state.playBet as any)}` as MotoRaceBetContentEnum
			})
			if (!result) return
			onClearBet()
			mapBet.set(issue.value, 1)
			toast.success(t('common.betSuccessful'))
			updateBalance()
			onBetTrigger()
			const timeRecord = setTimeout(()=> {
				getRecord()
				clearTimeout(timeRecord)
			}, 1000)
		} catch (e) {
			console.log(e)
		} finally {
			loading.value = false
		}
	}

		// 上一页
		const prevPage = () => {
			pageInfo.pageNo--
			getRecord()
		}
		// 下一页
		const nextPage = () => {
			pageInfo.pageNo++
			getRecord()
		}


	// 获取参数
	const getRecord = async () => {
		try {
			loading.value = true
			const { result, data } = await getLotteryRecord({
				pageSize: pageInfo.pageSize,
				pageNo: pageInfo.pageNo,
				gameCode: gameCode.value
			})
			if (result) {
				myRecord.value = data?.list || []
				pageInfo.totalPage = data?.totalPage || 0
				
			}
		} catch (e) {

		} finally {
			loading.value = false
		}
		
	}

	// 获取开奖结果
	const getOpenLottery = async (issue: string) => {
		try {
			const { result, data } = await getLotteryOssHistoryIssue({
				gameCode: gameCode.value,
				lotteryCode: lotteryCode.value
			})
			if (!result) return
			const list = data.list || []
			state.historyIssuesTotalPage = data.totalPage || 0
			const item = list[0]
			console.log(item.issueNumber, issue)
			if (item.issueNumber !== issue)
				return {
					list: data.list,
					item: null
				}
			return {
				item,
				list: data.list
			}
		} catch (e) {
		} finally {
		}
	}

	/*
	 * 中奖弹窗逻辑
	 */
	const getWinLossResult = async () => {
		try {
			const list = [...mapBet.keys()]
			if (!list.length) return
			const issueNumber = list[0]
			const { result, data } = await getLotteryWinLossResult({
				issueNumber
			})
			if (!result) return
			console.log('开奖结果', data)
			if (data.status === null) {
				mapBet.set(issueNumber, 2)
				return
			}
			onBetTrigger()
			mapBet.delete(issueNumber)
			if (!winner.value) return
			const isWin = data.status === true
			const openResult = historyIssues.value.find((item) => item.issueNumber === list[0])
			winner.value.open({
				isWin,
				amount: data.winAmount || 0,
				issueNumber,
				result: openResult
			})
			if (isWin) updateBalance()
		} catch (e) {
			console.log(e)
		}
	}

	/*
	 * 获取开奖历史
	 */
	const getHistoryIssues = async (isFirst?: boolean) => {
		try {
			const { result, data } = await getLotteryOssHistoryIssue({
				gameCode: gameCode.value,
				lotteryCode: lotteryCode.value
			})
			if (!result) return
			state.historyIssues = data.list || []
			if (isFirst && countdown.value.seconds <= 22) {
				hisRecord.value = data.list?.slice(1, 10) || []
			} else {
				hisRecord.value = data.list || []
			}
			hisPageInfo.pageNo = 1
			statistics.value = data.statistics || {}
			state.historyIssuesTotalPage = data.totalPage || 0
		} catch (e) {
		} finally {
		}
	}

	const getHistorys = async () => {
		try {
			const { result, data } = await getLotteryHistoryIssue({
				gameCode: gameCode.value,
				pageSize: hisPageInfo.pageSize,
				pageNo: hisPageInfo.pageNo
			})
			if (!result) return
			console.log('getHistorys', data)
			hisPageInfo.totalPage = data.totalPage || 0
			hisRecord.value = data.list || []
		} catch (e) {
		} finally {
		}
	}

	const nextHistory = async () => {
		hisPageInfo.pageNo += 1
		await getHistorys()
	}

	const prevHistory = async () => {
		if (hisPageInfo.pageNo <= 1) return
		hisPageInfo.pageNo -= 1
		await getHistorys()
	}

	watch(
		() => countdown.value.seconds,
		async (val) => {
		
			if (val <= 23 && betDialog.value) {
				betDialog.value = false
			}
			if (val >= 17 && val <= 20) {
				if (currentResult.value) return
				const data = await getOpenLottery(issue.value)
				console.log('开奖结果', data)
				if (data?.item) {
					currentResult.value = data.item
				}
				setTimeout(async () => {
					state.historyIssues = data?.list || []
				}, 800)
			}

			if (val <= 17 && !currentResult.value) {
				if (val === 13 || val === 6) {
					const data = await getOpenLottery(issue.value)
					if (data?.item) {
						currentResult.value = data.item
					}
					setTimeout(async () => {
						state.historyIssues = data?.list || []
					}, 800)
				}
			}

			if (val === 1) {
				getRecord()
				getWinLossResult()
				currentResult.value = null
				getHistoryIssues()
			}

			if (val <= 0) {
			}
		}
	)

	watch(() => visibilityStatus.value,(val) =>{
		if (!val && !isMuted.value) {
			visibleMute()
		} else if (val && isMuted.value && soundSetting.value) {
			visibleMute()
		}

		if (!val) {
			liveTime.value = new Date().getTime()
		}
		if (val) {
			const time = new Date().getTime() - liveTime.value
			if (time > 10000) {
				window.location.reload()
			}
		}
	})

	const useProvide = () => {
		provide<MotorcycleState>(INJECT_KEY, {
			betScopes,
			betMultiples,
			issue,
			canBet,
			gameCode,
			amount,
			betDialog,
			betMultiple,
			playRate,
			agreePreSale,
			playBet,
			loading,
			sound,
			historyIssues,
			betLimitLoading,
			historyIssuesTotalPage,
			betLimit,
			onClearBet,
			onBetting,
			getBetLimit,
			currentTab,
			countdown,
			getWinLossResult,
			currentResult: computed(() => currentResult.value),
			statistics: computed(() => currentResult.value?.statistics),
			currentPlayType,
			visibilityStatus
		})
	}

	return {
		betScopes,
		betMultiples,
		issue,
		countdown,
		countdownTime,
		canBet,
		sound,
		introduceDialog,
		betMultiple,
		introduceLoading,
		introduceHtml,
		betLimitLoading,
		historyIssues,
		history1,
		history2,
		issueLoading,
		historyIssuesTotalPage,
		onSwitchIntroduce,
		getIssue,
		onSwitchSound,
		useProvide,
		onBet,
		onClearBet,
		getIntroduce,
		setLotteryCode,
		currentTab,
		numbers,
		handleBet,
		getHistoryIssues,
		currentResult,
		statistics,
		getOpenLottery,
		bigSmallData,
		oddEvenData,
		winner,
		getHistorys,
		nextHistory,
		prevHistory,
		hisPageInfo,
		hisRecord,
		currentPlayType,
		visibilityStatus,
		prevPage,
		nextPage,
		getRecord,
		pageInfo,
		myRecord
	}
}

export function useMotorcycleContext() {
	return inject<MotorcycleState>(INJECT_KEY, {} as MotorcycleState)
}
