import { computed, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { getNowdayRechargeAmount, getTurnTableInfo, getTurnTableUserRotateNum, getTurnTableDraw } from '@/api'
import { AwaitApiResult,fixMsg,currency,formatNumberToK } from '@/utils'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';
import {showFailToast} from 'vant'
export function useTurntable() {
	const router = useRouter()
	const { t } = useI18n()
	const store = reactive<any>({
		amount: 0,
		count: 0,
		rotateCount: 0,
		turntableList: [],
		turntableRecord: [],
		taskList: [],
		vipRating: [],
		bindingType: -1,
		result:null,
		dialog:false
	})
	const recordQuery = ref({
		pageNo: 1,
		pageSize: 10
	})
	//1=银行卡，2 =UPI，3=USDT,  4=E-Wallet，5=PIX，6=WavePay，7=TRX，8= KBZPay,10=USDT2  20=NewUPI
	const bindingTypes = {
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
	const myLucky = ref();
	const pull=ref()
	const prizes = computed(() =>
		store.turntableList.map((item: any) => {
			if (item.rewardType === 1) {
				const money=item.rewardSetting+'';
				return {
					fonts: [
						{
							text:`${money.length>=9?formatNumberToK(money):currency(money,'',money.includes('.')?2:0)}` ,
							lineClamp: 2,
							fontColor: '#fff',
							wordWrap: true,
							top: '30%',
							fontSize: '12px'
						}
					],
					imgs: item.prizePicturesUrl?[
						{
							src: item.prizePicturesUrl,
							top: '45%',
							width: '55%',
						}
					]:[]
				}
			}
			return {
				fonts: [
					{
						text: item.rewardSetting,
						lineClamp: 2,
						fontColor: '#fff',
						fontSize: '12px',
						wordWrap: true,
						top: '30%'
					}
				],
				imgs: item.prizePicturesUrl
					? [
							{
								src: item.prizePicturesUrl,
								top: '45%',
								width: '50%',
							}
					  ]
					: null
			}
		})
	)
	const getTurntablAmount = async () => {
		const data = await AwaitApiResult(getNowdayRechargeAmount())
		if (!data) return
		store.amount = data.data || 0
	}
	const getTurntablCount = async () => {
		const data = await AwaitApiResult(getTurnTableUserRotateNum())
		if (!data) return
		store.count = data.data?.sumRotateNum || 0
		store.rotateCount = data.data?.surplusRotateNum || 0
	}
	const getTurntablInfo = async () => {
		const data = await AwaitApiResult(getTurnTableInfo())
		if (data) {
			store.turntableList = data.data.rewardList
			const vipRating = data.data.vipRating.split(',')
			store.vipRating = vipRating.map((item: string) => `Vip${item}`)
			store.taskList = data.data.taskList
			store.bindingType = data.data.bindingType
		}
	}
	const getTurntabl = async () => {
		await Promise.all([getTurntablAmount(), getTurntablCount(), getTurntablInfo()])
	}
	const onStart = useDebounceFn(async () => {
		const data = await getTurnTableDraw();
		if (data.code===0) {
			myLucky.value.play()
			setTimeout((_) => {
				store.result=data.data;
				const index = store.turntableList.findIndex((item: any) => item.rewardSetting === data.data.rewardSetting)
				if (index == -1) return myLucky.value.stop(0)
				myLucky.value.stop(index);
			}, 1500)
		}else {
			if ([904].includes(data.msgCode)){
				showFailToast(t('turntableTip',[bindingTypes[data.data.bindingType]]))
			}else {
				fixMsg(data)
			}

		}
	},600)
	const onEnd = async () => {
		if (!store.result)return;
		store.rotateCount=store.result.surplusRotateNum||0;
		store.dialog=true;
		if (pull.value)pull.value.resetRefresh();
	}

	function onClick() {
		router.go(-1)
	}

	return {
		store,
		prizes,
		myLucky,
		bindingTypes,
		recordQuery,
		pull,
		getTurntabl,
		getTurntablInfo,
		getTurntablAmount,
		onStart,
		onEnd,
		onClick
	}
}
