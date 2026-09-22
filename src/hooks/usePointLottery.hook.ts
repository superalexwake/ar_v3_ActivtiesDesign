import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { showSuccessToast } from 'vant'
import { PointItem, MyPointItem, UserAddress } from '@/types/api'
import {
	GetPointsLotteryDetails,
	JoinPointsLottery,
	GetPointLotteryUserAddress,
	SetDefaultPointsLotteryUserAddress,
	DeletePointsLotteryUserAddress
} from '@/api'
import { AwaitApiResult } from '@/utils'
import { useRoute } from 'vue-router'

export function usePointLottery() {
	const { t } = useI18n()
	const route = useRoute()
	const loading = ref<boolean>(false)
	const pointTabs = [
		{
			label: t('all'),
			value: -1
		},
		{
			label: t('about2Start'),
			value: 2
		},
		{
			label: t('ongoing'),
			value: 1
		},
		{
			label: t('ended'),
			value: 0
		}
	]

	const myPointTabs = [
		{
			label: t('all'),
			value: -1
		},
		{
			label: t('ongoing'),
			value: 0
		},
		{
			label: t('hasWon'),
			value: 2
		},
	]
	const pointTabActive = ref<number>(-1)
	const list = ref<PointItem[]>([])
	const myPointList = ref<MyPointItem[]>([])
	const pointInfo = computed<PointItem | null>(() => list.value[0] || null)
	const winPeople=computed(()=>pointInfo.value?.users.find((item)=>item.isWin===true)||{})
	const listRef = ref()
	const pointQuery = ref({
		pageNo: 1,
		status: pointTabActive.value,
		pageSize: 10
	})
	const myPointQuery = ref({
		pageNo: 1,
		orderStatus: pointTabActive.value,
		pageSize: 10
	})

	// 抽奖详情
	const ticketCount = ref(1)
	const resultTicket = ref<string[]>([])
	const pointLotteryID = computed(() => {
		const id = route.query.pointsLotteryID as string
		if (id) return parseInt(id, 10)
		return null
	})
	const address = ref<UserAddress[]>([])
	const pointRest = () => {
		list.value = []
		pointQuery.value.status = pointTabActive.value
		myPointQuery.value.orderStatus = pointTabActive.value
		myPointQuery.value.pageNo = pointQuery.value.pageNo = 1
	}

	const getTicket = (list: PointItem[]) => {
		return list.map((item) => {
			if (!item.users) item.users = []
			const users = item.users.map((user) => {
				const tickets: string[] = []
				user.orderInfoList.forEach((tik) => {
					tickets.push(...tik.ticketsInfoList.map((value) => value.ticketNumber))
				})
				user.addTime = user.orderInfoList[0].addTime
				user.tickets = tickets
				user.showAll = false
				user.isWin=tickets.includes(list[0].winningNumber)
				return user
			})
			item.users = users
			return item
		})
	}

	// 获取抽奖详情
	const getPointLotteryInfo = async () => {
		if (!pointLotteryID.value) return
		const data: any = await GetPointsLotteryDetails({
			pointLotteryID: pointLotteryID.value
		})
		list.value = getTicket(data.data.list)
	}

	// 参与抽奖
	const onJoin = async () => {
		if (loading.value) return
		loading.value = true
		if (!pointLotteryID.value) return
		const data = await AwaitApiResult(
			JoinPointsLottery({
				pointsLotteryID: pointLotteryID.value,
				counts: ticketCount.value
			})
		)
		loading.value = false
		if (!data) return
		const list = data.data || []
		resultTicket.value = list.map((item: any) => item.ticketNumber)
	}
	const getAddress = async () => {
		const data: any = await GetPointLotteryUserAddress()
		if (data) address.value = data.data||[]
		if (!address.value.length) return
		if (!address.value.find((item) => item.defaultAddress === true)) {
			address.value[0].defaultAddress = true
		}
	}

	const setDefault = async (addressId: number, defaultAddress: boolean) => {
		if (defaultAddress) return
		const data = await AwaitApiResult(SetDefaultPointsLotteryUserAddress({ addressId }))
		if (data) {
			showSuccessToast(`${t('rpdsucceed')}`)
		}
	}
	const delAddress = async (addressId: number) => {
		const data = await AwaitApiResult(DeletePointsLotteryUserAddress({ addressId }))
		if (data) {
			const index = address.value.findIndex((item) => item.addressId == addressId)
			address.value.splice(index, 1)
			showSuccessToast(`${t('deleteSuccess')}`)
		}
	}

	return {
		pointTabs,
		myPointTabs,
		pointTabActive,
		list,
		myPointList,
		pointQuery,
		myPointQuery,
		listRef,
		loading,
		resultTicket,
		ticketCount,
		pointInfo,
		address,
		winPeople,
		onJoin,
		getPointLotteryInfo,
		pointRest,
		getAddress,
		setDefault,
		delAddress
	}
}
