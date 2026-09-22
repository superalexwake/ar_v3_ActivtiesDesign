import { onBeforeUnmount, reactive, ref, triggerRef, watch,computed } from 'vue'
import {
	getD5Bet,
	getDragonList,
	getK3Bet,
	getTrxWingoBet, getVideoWinGoBet,
	getWinGoBet,
	motoRaceBet
} from '@/saasLottery/api'
import { GlobalStore } from '@/stores'
import {showToast} from 'vant'
import { useI18n } from 'vue-i18n'
import { toCamelCase, clampBetCountInput } from '@/saasLottery/utils'
import { useToast } from './useToast.hook'
export function useChangLong() {
	const {t}=useI18n()
	const toast=useToast();
	const betlist = ref<[]>([])
	const selectInfo = reactive({
		coin: 1, //下注金额
		count: 1, //下注倍数
		gameName:'',
		issueNumber: '', //期号,
		betMultiples:[],
		betScopes:[],
		playBet:'',
		playType:'',
		gameCode:'',
	})
	const bettingPopupShow = ref(false)
	let timeHandle: any = null // 定时器
	let roolHandle: any = null // 定时器
	// 是否展示预售规则
	const isShowPreSale = ref(false)
// 是否同意预售规则
	const isCheckPreSale = ref(true)
	const lock=ref(false)
	const loading=ref(false)

// 投注金额
	const betTypeList = computed(() =>selectInfo.betMultiples)
	const multipleList=  computed(() =>selectInfo.betMultiples)
	const prohibitBuyTime=(gameCode:string)=>{
		if (gameCode.startsWith('MotoRace')) return 23;
		if (gameCode.startsWith('TrxWinGo')) return 10;
		return 5;
	}
// 份数加减
	const Stepper = (e: number) => {
		const cur = clampBetCountInput(selectInfo.count) ?? 0
		switch (e) {
			case 1:
				if (cur > 1) selectInfo.count = cur - 1
				break
			case 2:
				selectInfo.count = clampBetCountInput(cur + 1) as number
				break
			default:
		}
	}
// 输入框设置数量:只保留正整数,输入过程允许清空以便重新输入
	const changeStep = (e: any) => {
		const val = clampBetCountInput(e)
		if (val !== null) selectInfo.count = val
	}
	const canSubmit = computed(() => Number(selectInfo.count) >= 1)
// 购买份数切换
	const TaskCount = (item: number ) => {
		selectInfo.count = item
	}
// 购买金额切换
	const changeCoin = (item: any) => {
		selectInfo.coin = item
	}
// 知道预售规则
	const knowPreSale = () => {
		isShowPreSale.value = false
		isCheckPreSale.value = true
	}
	const clearBetting= () => {
		bettingPopupShow.value=false;
		isShowPreSale.value=false;
		selectInfo.coin=1;
		selectInfo.count=1;
		selectInfo.issueNumber='';
		selectInfo.gameName='';
		selectInfo.gameCode='';
		selectInfo.playBet='';
		selectInfo.playType='';
	}
// 点击提交金额
	const submitBetting = async () => {
		if (!canSubmit.value) return;
		if (!isCheckPreSale.value) return showToast(t('agreePresaleRules'));
		const game=selectInfo.gameCode.split('_')[0];
		if (!game)return toast.error(t('common.code_403'));
		if (!selectInfo.issueNumber) return  toast.error(t('common.noIssueNumber'));
		if(!selectInfo.playType)return toast.error(t('common.code_403'));
		loading.value=true;
		let betfn:any=async (data:any)=>({});
		let playBet=selectInfo.playBet;
		let betContent:any=`${selectInfo.playType}_${toCamelCase(playBet as any)}`;
		switch (playBet){
			case 'h':
				playBet='Big'
				break
			case 'l':
				playBet='Small'
				break
			case 'o':
				playBet='Odd'
				break
			case 'e':
				playBet='Even'
				break
		}
		switch (game){
			case 'MotoRace':
				betfn=motoRaceBet;
				break;
			case 'D5':
				betfn=getD5Bet;
				betContent=[`${selectInfo.playType}_${toCamelCase(playBet as any)}`]
				break;
			case 'TrxWinGo':
				betfn=getTrxWingoBet;
				break;
			case 'K3':
				betfn=getK3Bet;
				betContent=[`${selectInfo.playType}_${toCamelCase(playBet as any)}`]
				break;
			case 'WinGo':
				betfn=getWinGoBet;
				break;
			case "VideoWinGo":
				betfn=getVideoWinGoBet;
				break;

		}
		try {
			const {result}=await betfn({
				gameCode:selectInfo.gameCode,
				issueNumber:selectInfo.issueNumber,
				amount:selectInfo.coin,
				betMultiple:Number(selectInfo.count),
				betContent,
			});
			if (!result)return ;
			clearBetting();
			toast.success(t('common.betSuccessful'));
		}catch (e){
			console.log(e)
		}finally {
			loading.value=false
		}
	}
	const getDragonListPage = async () => {
		try {
			if (timeHandle) {
				clearInterval(timeHandle)
			}
			if (lock.value)return;
			lock.value=true
			const { data, result, serviceTime } = await getDragonList({})
			if (result) {
				betlist.value = data||[]
				subTIme(serviceTime)
				timeHandle = setInterval(() => {
					subTIme()
				}, 1000);
				if (data&&data.length) {
					clearInterval(roolHandle)
				}else {
					if (roolHandle) {
						clearInterval(roolHandle)
					}
					roolHandle = setInterval(() => {
						getDragonListPage()
					}, 10*1000);
				}
			}
		}catch (e) {

		}finally {
			lock.value=false;
		}
	}
	const subTIme = (serviceTime?: number) => {
		let hasGet = false
		for (let i = 0; i < betlist.value.length; i++) {
			const item: any = betlist.value[i]
			if (serviceTime) {
				item.passTime = Math.floor((item.endTime-serviceTime) / 1000)
				item.time1 = 0
				item.time2 = Math.floor(item.passTime / 60)
				item.time3 = Math.floor((item.passTime % 60) / 10)
				item.time4 = Math.floor(item.passTime % 10);
				let playBetList=[]
				if (item.playType==='SumBigSmall'){
					playBetList=[{...item.playBetList,playBet:'Small'},{...item.playBetList,playBet:'Big'}]
				}else if (item.playType==='SumOddEven'){
					playBetList=[{...item.playBetList,playBet:'Even'},{...item.playBetList,playBet:'Odd'}]
				}else {
					playBetList=Object.keys(item.playBetList).map((key)=>({playBet:key,odds:item.playBetList[key],}))
				}
				item.playBetList=playBetList.sort((bet,bet2)=>bet.playBet.localeCompare(bet2.playBet));
			} else {
				 if (item.passTime < prohibitBuyTime(item.gameCode) && item.issueNumber == selectInfo.issueNumber){
					clearBetting()
				}

				if (item.passTime > 0) {
					item.time2 = Math.floor(item.passTime / 60)
					item.time3 = Math.floor((item.passTime % 60) / 10)
					item.time4 = Math.floor(item.passTime % 10)
					item.passTime--
				} else {
					hasGet = false
					clearInterval(timeHandle)
					getDragonListPage()
					break
				}
				hasGet = item.time3 + item.time4 == 0;
			}
		}
		triggerRef(betlist)
		if (hasGet) {
			console.log('xxx',getDragonListPage)
			clearInterval(timeHandle)
			getDragonListPage()
		}
	}
	const onBet = (item: any,bet:any) => {
		selectInfo.coin = item.betMultiples[0]||1;
		selectInfo.count = item.betScopes[0]||1;
		selectInfo.issueNumber = item.issueNumber;
		selectInfo.gameName=item.gameName;
		selectInfo.betMultiples=item.betMultiples;
		selectInfo.betScopes=item.betScopes;
		selectInfo.playType=item.playType;
		selectInfo.playBet=bet.playBet;
		selectInfo.gameCode=item.gameCode;
		bettingPopupShow.value = true
	}
	onBeforeUnmount(() => {
		clearInterval(timeHandle)
		clearInterval(roolHandle)
	})
	watch(
		() => GlobalStore().visibility,
		(newVal) => {
			getDragonListPage()
		}
	)
	return {
		betlist,
		prohibitBuyTime,
		bettingPopupShow,
		isShowPreSale,
		isCheckPreSale,
		selectInfo,
		betTypeList,
		multipleList,
		loading,
		lock,
		Stepper,
		changeStep,
		canSubmit,
		TaskCount,
		changeCoin,
		knowPreSale,
		submitBetting,
		getDragonListPage,
		onBet,
		clearBetting
	}
}
