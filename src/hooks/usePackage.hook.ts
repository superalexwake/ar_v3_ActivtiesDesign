import {AwaitApiResult} from "@/utils";
import {applyFirstCharge, getGiftPackUserRewardRecord, getReceiveGiftPackUserReward} from "@/api";
import {computed, reactive} from "vue";
import {showSuccessToast} from "vant";
import {useI18n} from "vue-i18n";
import { useActive } from '@/components/common/use'

export function usePackage(){
	const {t}=useI18n()
	const { refreshRedDot } = useActive()
	const store=reactive({
		firstDepositConfig:{
			activityStartDate: '',
			bonusLimit: 0,
			firstDeposiSendBonust: 0,
			firstDepositTimeLiness:''
		},
		giftPackConfigList:[],
	    rewardRecordList:[]
	});
	const time=computed<string>(()=>store.firstDepositConfig?.activityStartDate);
	const firstDepositTimeLiness=computed<string>(()=>store.firstDepositConfig?.firstDepositTimeLiness);
	const bonusLimit=computed<number>(()=>store.firstDepositConfig?.bonusLimit);
	const firstDeposiSendBonust=computed<number>(()=>store.firstDepositConfig?.firstDeposiSendBonust)
	const giftPackConfigList=computed(()=>store.giftPackConfigList||[])
	const rewardRecordList=computed(()=>store.rewardRecordList||[])
	const getConfig=async ()=>{
		const data=await AwaitApiResult(getGiftPackUserRewardRecord());
      if (data){
		  store.firstDepositConfig=data.data.firstDepositConfig;
		  store.giftPackConfigList=data.data.giftPackConfigAwardList;
		  store.rewardRecordList=data.data.newUserRewardRecordList;
	  }
	};
	const onReceive=async (orderId:number)=>{
		const data=await AwaitApiResult(getReceiveGiftPackUserReward({
			orderId,
			optType:2
		}))
		if (data){
			showSuccessToast(t('receiveSuccess'));
			await getConfig()
			refreshRedDot()
		}
	}
	const onApply=async (orderId:number)=>{
		const data=await AwaitApiResult(getReceiveGiftPackUserReward({
			orderId,
			optType:1
		}))
		if (data){
			showSuccessToast(t('applySuccess'));
			await getConfig()
			refreshRedDot()
		}
	}
	const onApplyFirstCharge =async ()=>{
		const data=await AwaitApiResult(applyFirstCharge({

		}))
		if (data){
			showSuccessToast(t('applySuccess'));
			await getConfig()
			refreshRedDot()
		}
	}
	return {
		store,
		time,
		firstDepositTimeLiness,
		bonusLimit,
		firstDeposiSendBonust,
		giftPackConfigList,
		rewardRecordList,
		onApplyFirstCharge,
		onReceive,
		onApply,
		getConfig,
	}
}
