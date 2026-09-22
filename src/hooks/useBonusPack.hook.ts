import { ref, reactive, computed } from 'vue'
import {
	AddReceiveAward,
	getReceiveDownAppReward,
	getReceiveReturnAwards,
	getRewardCenterList,
	receiveAward,
	ReceiveDailyAward,
	ReceiveWeeklyAward,
	SetTaskOrder,
	// AddCodeWashRecord,
	ThirdGameReceiveGrandPrizeReward,
	// SetContinuousSinIn
} from '@/api'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { AwaitApiResult } from '@/utils'
import { useTrigger } from './useTrigger.hook'
import { useActive } from '@/components/common/use'
interface BonusPack{
	receiveTaskId:number
	rewardType:number
	vipRewardType:number
	vipLevel:number
	amount: number
	createTime:string
	loading:boolean
	recordType:number
}
type BonusPackActionResult = 'navigate' | 'receive'

export function useBonusPack() {
	const {t}=useI18n()
	const router=useRouter();
	const {onTriggerGoogle}=useTrigger()
	const { refreshRedDot } = useActive()
	const loading=ref(false);
	const query=reactive({
		date:null,
		rewardType:-1,
		receiveState:0,
		"pageSize": 20,
		"pageNo": 1,
	});
	const listRef = ref(null)
	const list=ref<BonusPack[]>([]);
	// const rewardStateMap={
	// 	0:{
	// 		label:t('actTip2'),
	// 		value:0
	// 	},
	// 	1:{
	// 		label:t('claimed'),
	// 		value:1
	// 	},
	// 	2:{
	// 		label:t('rewardExpired'),
	// 		value:2
	// 	}
	// }

	const rewardStateMap = computed(() => ({
		0: { label: t('actTip2'), value: 0 },
		1: { label: t('claimed'), value: 1 },
		2: { label: t('rewardExpired'), value: 2 }
	}))

	const rewardStates = computed(() => {
		// 确保 rewardStateMap 已经有值
		if (!rewardStateMap.value) return []
		return Object.values(rewardStateMap.value)
	})
	// 新手礼包113
	// 回归奖励115
	// 每日签到7
	// 充值赠送10
	// VIP会员升级礼包29
	// 每日奖励118
	// 每周奖励107
	// 合伙人奖励122
	// 彩金充值13
	// 红包3
	// 洗码反水102
	// VIP会员每月奖励30
	// 邀请奖励20
	// 转盘奖励119
	// 电子大奖103
	// 锦标赛奖励114
	// 提现活动奖励126
	// 新会员负盈利送彩金116
	// 邀请转盘奖励130
	// 新会员玩游戏送彩金117

	const rewardTypeMap = computed(() => ({
		113: { label: t('code8113'), value: 113 },
		115: { label: t('code8115'), value: 115 },
		7: { label: t('code9007'), value: 7 },
		10: { label: t('code9010'), value: 10 },
		29: { label: t('code9029'), value: 29 },
		118: { label: t('code8118'), value: 118 },
		107: { label: t('code8107'), value: 107 },
		122: { label: t('TeamPartner'), value: 122 },
		13: { label: t('code9013'), value: 13 },
		3: { label: t('code8003'), value: 3 },
		102: { label: t('washingCode'), value: 102 },
		30: { label: t('code8030'), value: 30 },
		20: { label: t('invitationBonus'), value: 20 },
		119: { label: t('code8119'), value: 119 },
		103: { label: t('code9309'), value: 103 },
		114: { label: t('code8114'), value: 114 },
		126: { label: t('withdrawalRewards'), value: 126 },
		116: { label: t('newMembersRewards'), value: 116 },
		130: { label: t('code8130'), value: 130 },
		117: { label: t('code8117'), value: 117 },
		131:{label:t('code8131'),value:131}
	}))

	// const rewardTypes=computed(()=> [{ value: -1, label: t('all') },...Object.values(rewardTypeMap)]);


	const rewardTypes = computed(() => [
		{ value: -1, label: t('all') },
		...Object.values(rewardTypeMap.value)
	])
	/**
	 * 跳转页面领取
	 */
	const mapParam:Record<number, string>={
		/**
		 * 3:红包
		 */
		3:"RedeemGift",
		/**
		 * 7:签到
		 */
		7: 'DailySignIn',
		/**
		 * 10: 充值赠送
		 */
		10:'Recharge',
		/**
		 * 洗码反水
		 */
		102: 'Laundry',
		/**
		 * 竞标赛
		 */
		114:"Championship",
		/**
		 * 新会员负盈利送彩金
		 */
		116:"MemberPackage",
		/**
		 * 新会员负盈利送彩金
		 */
		117:"MemberPackage",
		/**
		 * 转盘奖励
		 */
		119:'Turntable',
		/**
		 * 合伙人奖励
		 */
		122:'TeamPartner',
		/**
		 * 提现活动奖励
		 */
		126: 'Withdraw',

		/**
		 * 要求转盘
		 */
		130:"turntable",
		/**
		 * 邀请奖励
		 */
		20:"InvitationBonus",
		/**
		 * 每日奖励
		 */
		118:"DailyTasks",
		/**
		 * 每周奖励
		 */
		107:"DailyTasks",
		/**
		 * vip会员每月奖励
		 */
		30:"vip",
		/**
		 * vip会员升级奖励
		 */
		29:"vip",
		/**
		 * 电子大奖奖励
		 */
		103:"SuperJackpot",
	};
	const onTabState=(item:any)=>{
		query.receiveState=item.value;
		listRef.value.resetRefresh()
	}
	const getRewards=async ()=>{
		if (loading.value) return
		try {
			const {pageSize,receiveState,rewardType,...other}=query;
			const data=await getRewardCenterList(Object.assign({},other,{
				receiveState:3,
				rewardType:rewardType===-1?null:rewardType,
				pageSize:20
			}));
			if (data.code===0){
				list.value=data.data.list.map((item:any)=>({...item,loading:false}));
			}
		}catch (e) {

		}finally {
			loading.value = false
		}
	}
	const getListRewards=async (parms={})=>{
		const {rewardType,...other}={...query,...parms};
		console.log(parms)
		return await getRewardCenterList({...other,rewardType:rewardType===-1?null:rewardType,});
	}
	/**
	 * 领取奖励
	 * @param item {BonusPack}
	 */
	const getBonus=async (item: BonusPack)=>{
		/**
		 * 领取奖励
		 */
		const req:Record<any, Function>={
			// /**
			//  * 7:每日签到
			//  */
			// 7:SetContinuousSinIn,
			/**
			 * 20:任务奖励
			 */
			20:SetTaskOrder,
			/**
			 * VIP会员升级礼包
			 */
			29:AddReceiveAward,
			/**
			 * 30:VIP会员每月奖励
			 */
			30:AddReceiveAward,
			/**
			 * 118:每日奖励
			 */
			118:ReceiveDailyAward,
			/**
			 * 107:每周奖励
			 */
			107:ReceiveWeeklyAward,
			// /**
			//  * 102:洗码反水
			//  */
			// 102:AddCodeWashRecord,
			/**
			 * 103:电子大奖
			 */
			103:ThirdGameReceiveGrandPrizeReward,
			/**
			 * 新手礼包
			 */
			113: receiveAward,
			/**
			 * 老会员回归奖励
			 */
			115: getReceiveReturnAwards,
			/**
			 * App下载充值奖励
			 */
			131: getReceiveDownAppReward,
		}
		const convertData:Record<any, any>={
			118:{
				"dailyAwardId":item.receiveTaskId
			},
			107:{
				"weeklyAwardId":item.receiveTaskId
			},
			29:{
				receiveId: item.receiveTaskId,
				vipLevel: item.vipLevel,
				rewardType: item.vipRewardType,
			},
			30:{
				receiveId: item.receiveTaskId,
				vipLevel: item.vipLevel,
				rewardType: item.vipRewardType,
			},
			20:{
				taskId: item.receiveTaskId
			},
			103:{
				orderId: item.receiveTaskId
			},
			113:{
				id: item.receiveTaskId
			},
			102:{
				codeType:-1
			}

		};
		if (!req[item.rewardType])return showToast(`${item.rewardType} ${t('noSupportReceive')}`);
		if (item.loading) return;
		item.loading = true;

		try {
			const request=req[item.rewardType];
			const queryData=convertData[item.rewardType]||{};
			const res= await AwaitApiResult(request(queryData));
			if (res){
				showToast({
					message: t('receiveSuccess'),
					duration:3000,
				});
				refreshRedDot()
				if (listRef.value) {
					listRef.value.resetRefresh()
				}else {
					getRewards()
				};

			}
		}finally {
			item.loading = false;
		}
	}
	/**
	 * 领取奖励
	 * @param item {BonusPack}
	 */
	const onBonusPack = async (item: BonusPack): Promise<BonusPackActionResult> => {
		const isSpecialType = [20, 118, 107, 30, 29, 103].includes(item.rewardType);
		if ((isSpecialType && item.recordType === 1) || (mapParam[item.rewardType] && !isSpecialType)) {
			onTriggerGoogle('reward_center_pages');
			await router.push({ name: mapParam[item.rewardType] });
			return 'navigate'
		}

		await getBonus(item);
		return 'receive'
	};

	return {
		getRewards,
		onBonusPack,
		onTabState,
		getListRewards,
		mapParam,
		listRef,
		list,
		loading,
		query,
		rewardStates,
		rewardTypes,
		rewardTypeMap,
		rewardStateMap
	};
}
