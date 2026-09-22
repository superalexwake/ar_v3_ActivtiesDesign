import {computed, ComputedRef, WritableComputedRef, inject, provide, reactive, ref, Ref, onMounted} from "vue";
import {useLottery, useToast, INJECT_KEY, SOUND_BG, SOUND_EF, useStorage, useGlobalContext} from "@/saasLottery/hooks";
import {
    getK3Bet,
    GetHistoryIssuePageRsp,
    LotteryGameCodeEnum,
    GetGameInfoRspPlayRate,
    getLotteryOssHistoryIssue, GetBetLimitRsp, getLotteryWinLossResult
} from "@/saasLottery/api";
import {delay} from '@/saasLottery/utils'
import {useI18n} from "vue-i18n";
interface K3State{
    betScopes:ComputedRef<number[]>
    betMultiples:ComputedRef<number[]>
    historyIssues:ComputedRef<any[]>,
    issue:ComputedRef<string>,
    canBet:ComputedRef<boolean>,
    gameCode:ComputedRef<LotteryGameCodeEnum>,
    amount:WritableComputedRef<number>,
    betMultiple:WritableComputedRef<number>,
    betDialog:ComputedRef<boolean>
    betLimitLoading:Ref<boolean>
    playRate:ComputedRef<number>,
    onClearBet:()=>void,
    onBetting:()=>void,
    getBetLimit:()=>Promise<void>,
    agreePreSale:Ref<boolean>,
    loading:Ref<boolean>,
    sound:WritableComputedRef<boolean>,
    soundBg:ComputedRef<boolean>,
    soundEffects:ComputedRef<boolean>,
    onSwitchSound:()=>void,
    betLimit:ComputedRef<GetBetLimitRsp[]>
    historyIssuesTotalPage:ComputedRef<number>,
    playBet:ComputedRef<{name:string,list:GetGameInfoRspPlayRate[],isBet:boolean,code:string}[]>
}
interface K3Store{
    betDialog:boolean,
    amount:number,
    betMultiple:number,
    playType:string,
    playBetNum: any[],
    playBetTowSome:any[],
    playBetOnePair:any[][],
    playBetThreeSome:any[]
    playBetNumSameAny:any[]
    playBetNumDiff3:any[]
    playBetNumDiff2:any[]
    playBetNumNear3All:any[]
    playRate:number,
    /*
     *开奖历史数据
     */
    historyIssues:GetHistoryIssuePageRsp[],
    historyIssuesTotalPage:number
}

//  一对特殊
const getOnePairlist=(list:GetGameInfoRspPlayRate[][])=>{
    const bets:GetGameInfoRspPlayRate[]=[];
    list[0].forEach((item)=>{
        const text= list[1].map((num)=>num.playBet);
        bets.push({
            ...item,
            playBet:item.playBet+'+'+text.sort().join('_')
        })
    });
    return bets
}
/**
 * 获取开奖结果为了保证后台并发要求
 * 采取第一页取oss 非第一页走接口
 *
 */
export function useK3() {
    const toast=useToast();
    const {t}=useI18n()
    const {localStore}=useStorage()
    const {updateBalance,onBetTrigger,getGameInfo}=useGlobalContext();
    const VoiceType = ref(localStorage.getItem('volumeShow') || '1')
    // const dice=new Howl({
    //     src: [loop],
    //     loop:false,
	// 	preload:false,
    // });
    // const tipsSound=new Howl({
    //     src: [tips],
	// 	preload:false,
    // });
    // const countDownSound=new Howl({
    //     src: [count_down],
	// 	preload:false,
    // });
    // const diceOpen=new Howl({
    //     src: [open_dice],
	// 	preload:false,
    // });




    const state =reactive<K3Store>({
        betDialog:false,
        amount:1,
        betMultiple:0,
        playType:'',
        playRate:0,
        playBetNum:[],
        playBetTowSome:[],
        playBetOnePair:[[],[]],
        playBetThreeSome:[],
        playBetNumSameAny:[],
        playBetNumDiff3:[],
        playBetNumNear3All:[],
        playBetNumDiff2:[],
        /*
         *开奖历史数据
         */
        historyIssues:[],
        historyIssuesTotalPage:0

    })
    const betMultiple = ref(0);
    const animationLock=ref(false);
    const animationRoll=ref(false);
    const loading=ref(false);
    const lottieEl=ref();
    const actNav = ref(0)
    const winner=ref();
    const mapBet=new Map();

    /**
     * 清理数据
     */
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
        bgSound,
        issueLoading,
        lotteryCode,
        soundBg,
        soundEffects,
        betLimit,
		issueData,
        onSwitchIntroduce,
        onSwitchSound,
        getIssue,
        getIntroduce,
        canAutoPlay,
        getBetLimit,
		visibilityStatus
    }=useLottery({
        async processSound(countdown) {
			if (countdown<=5){
				onClearBet();
			}
            if(countdown==1){
                const data=await getOpenLottery(issue.value);
                await delay(400)
                animationRoll.value=true;
                setTimeout(async ()=>{
                    state.historyIssues=data?.list||[];
                    animationLock.value=false;
                    animationRoll.value=false;
                },1350)
                setTimeout(async ()=>{
                    await getWinLossResult(data?.list||[]);
                },1000)
            }
            if (countdown===6){
                animationLock.value=true;
            }
        },
    })
    /*
     * 数字投注
     */
    const numbers=computed(()=>{
        //@ts-ignore
        const base= rates.value.filter(({playType})=>playType==='SumNum').sort((a,b)=>a.playBet-b.playBet);
        //@ts-ignore
        const other=rates.value.filter((item)=>['SumBigSmall','SumOddEven'].includes(item.playType))
        const list= [...base,];
        other.forEach((item)=>{
            if (item.playType==='SumBigSmall'){
                list.push({...item,playBet:'Small'},{...item,playBet:'Big'})
            }else {
                list.push({...item,playBet:'Even'},{...item,playBet:'Odd'})
            }
        })
        return list
    });

    /*
     * 两个相同玩法 
     */
    const same2Rate=computed(()=>{
        return rates.value.find(({playType}:any)=>playType==='NumSame2')||{};
    })
    const same2Mult=computed(()=>{
        return rates.value.find(({playType}:any)=>playType==='NumSame2Mult')||{};
    });
    /*
     * 三个相同玩法 
     */
    const numSame3=computed(()=>{
        return rates.value.find(({playType}:any)=>playType==='NumSame3')||{};
    })
    const same3All=computed(()=>{
        const sameAllItem = rates.value.find(({playType}:any)=>playType==="NumSame3All")||{};
        return {...sameAllItem, playBet:'AAA'}
    })
    /**
     * 不相同玩法
     *  三个不相同
     * 两个不相同 NumDiff2
     * 三个连续 NumNear3All
    */
    const numDiff3=computed(()=>{
        return rates.value.find(({playType}:any)=>playType==='NumDiff3')||{};
    })
    const numNear3All=computed(()=>{
        const nearItem = rates.value.find(({playType}:any)=>playType==='NumNear3All')||{};
        return {...nearItem, playBet:'ABC'}
    })
    const numDiff2=computed(()=>{
        return rates.value.find(({playType}:any)=>playType==='NumDiff2')||{};
    })

    const betDialog = computed({
        get() {
            return state.betDialog ;
        },
        set(val: boolean) {
            state.betDialog = val;
        },
    });
    const amount = computed({
        get() {
            return state.amount ;
        },
        set(val: number) {
            state.amount = val;
        },
    });
    const playRate=computed(()=>state.playRate)
    const historyIssues=computed(()=>state.historyIssues);
    const lotteryList = computed(() => state.historyIssues[0]?.premium?.split('') || []);
    const historyIssuesTotalPage=computed(() => state.historyIssuesTotalPage);
    // 当前选中投注分组
    const playBet=computed(()=>{
        const bets=[
            {
                name:'k3RecordDesc1',
                code:"SumNum",
                list:state.playBetNum,
                isBet:state.playBetNum.length>=1
            },
            {
                name:'k3RecordDesc2',
                code:"NumSame2",
                list:state.playBetTowSome,
                isBet:state.playBetTowSome.length>=1
            },
            {
                // 待特殊处理
                name:'k3RecordDesc3',
                code:"NumSame2Mult",
                list:getOnePairlist(state.playBetOnePair),
                isBet:state.playBetOnePair[0].length>=1&&state.playBetOnePair[1].length>=1
            },
            {
                // 待特殊处理
                name:'k3RecordDesc4',
                code:"NumSame3",
                list:state.playBetThreeSome,
                isBet:state.playBetThreeSome.length>0,
            },
            {
                // 待特殊处理
                name:'k3RecordDesc5',
                code:"NumSame3All",
                list:state.playBetNumSameAny,
                isBet:state.playBetNumSameAny.length>0,
            },
            {
                // 待特殊处理
                name:'k3RecordDesc6',
                code:"NumDiff3",
                list:state.playBetNumDiff3,
                isBet:state.playBetNumDiff3.length>=3,
            },
            {
                // 待特殊处理
                name:'k3RecordDesc7',
                code:"NumNear3All",
                list:state.playBetNumNear3All,
                isBet:state.playBetNumNear3All.length>0,
            },
            {
                // 待特殊处理
                name:'k3RecordDesc8',
                code:"NumDiff2",
                list:state.playBetNumDiff2,
                isBet:state.playBetNumDiff2.length>=2,
            },
        ];
        return bets.filter((item)=>item.isBet)
    })

    const bets=ref<string[]>([]);
    // 大小，单双只能个选一个
    const getRadio = (item:GetGameInfoRspPlayRate) =>{
        let redioType = ''
        if(item.playBet == 'Big') {
            redioType = "Small"
        } else if (item.playBet == 'Small') {
            redioType = "Big"
        }else if (item.playBet == 'Even') {
            redioType = "Odd"
        }else if (item.playBet == 'Odd') {
            redioType = "Even"
        }
        const i = bets.value.findIndex((key)=>key===`${item.playType}_${redioType}`);
        state.playBetNum=state.playBetNum.filter(({playType,playBet})=>`${playType}_${playBet}`!==`${item.playType}_${redioType}`);
        if(i != -1) bets.value.splice(i,1)
    }
    /*
     * 投注
     * 随机动画进行中不让点击
     */
    const onBet=({item,playType}:{item:GetGameInfoRspPlayRate,playType:string})=>{
		if (!canBet.value) return;
		const betType=`${item.playType}_${item.playBet}`;
        const hasBet=bets.value.includes(betType);
        const hasIndex=bets.value.findIndex((key)=>key===betType);

        if (playType==='SumNum'){
            if(hasBet){
                state.playBetNum=state.playBetNum.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetNum.push(item);
                bets.value.push(betType)
            }
            getRadio(item)          
        }
        if (playType==='NumSame2'){
            if(hasBet){
                state.playBetTowSome=state.playBetTowSome.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetTowSome.push(item);
                bets.value.push(betType)
            }
        }

        if (playType==='NumSame3All'){
            if(hasBet){
                state.playBetNumSameAny=state.playBetNumSameAny.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetNumSameAny.push(item);
                bets.value.push(betType)
            }
        }
        if (playType==='NumSame3'){
            if(hasBet){
                state.playBetThreeSome=state.playBetThreeSome.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetThreeSome.push(item);
                bets.value.push(betType)
            }
        }

        if (playType==='NumDiff3'){
            if(hasBet){
                state.playBetNumDiff3=state.playBetNumDiff3.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetNumDiff3.push(item);
                bets.value.push(betType)
            }
        }
        if (playType==='NumNear3All'){
            if(hasBet){
                state.playBetNumNear3All=state.playBetNumNear3All.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetNumNear3All.push(item);
                bets.value.push(betType)
            }
        }
        if (playType==='NumDiff2'){
            if(hasBet){
                state.playBetNumDiff2=state.playBetNumDiff2.filter(({playType,playBet})=>`${playType}_${playBet}`!==betType);
                bets.value.splice(hasIndex,1)
            }else{
                state.playBetNumDiff2.push(item);
                bets.value.push(betType)
            }
        }
        // 处理一对的情况
        if (['NumSame2Mult','NumSame2Mult2'].includes(playType)){
            const isUpperLayer=playType==='NumSame2Mult';
            const realPlay='NumSame2Mult';
            const realBet=`${realPlay}_${item.playBet}`;
            const _hasBet=bets.value.includes(realBet);
            const _hasIndex=bets.value.findIndex((key)=>key===realBet);

            if (isUpperLayer) {
                if(_hasBet){
                    state.playBetOnePair[0] = state.playBetOnePair[0].filter(v => `${realPlay}_${v.playBet}`!==realBet);
                    bets.value.splice(_hasIndex,1)
                }else{
                    state.playBetOnePair[0].push(item);
                    bets.value.push(realBet)
                    state.playBetOnePair[1] = state.playBetOnePair[1].filter(v => !realBet.startsWith(`${realPlay}_${v.playBet}`));
                    bets.value=bets.value.filter((code)=>!(realBet.startsWith(code)&&realBet!=code))
                }
            } else {
                if(_hasBet){
                    state.playBetOnePair[1] = state.playBetOnePair[1].filter(v => `${realPlay}_${v.playBet}`!==realBet);
                    bets.value.splice(_hasIndex,1)
                }else{
                    state.playBetOnePair[1].push(item);
                    bets.value.push(realBet);
                    state.playBetOnePair[0] = state.playBetOnePair[0].filter(v => !`${realPlay}_${v.playBet}`.startsWith(realBet));
                    bets.value=bets.value.filter((code)=>!(code.startsWith(realBet)&&code!=realBet))
                }
            }

        }
		if (issueData.value?.gameCode!==gameCode.value) return ;
        state.betDialog=playBet.value.some((item)=>item.isBet);
        state.amount=betScopes.value[0]||1;
        betMultiple.value=betMultiples.value[0]||1;
        console.log(playBet.value)
    };
    const onClearBet=(clearBet=false)=>{
        state.betDialog=false;
        state.playType='';
        state.playRate=0;
        betMultiple.value=0;
        state.amount=0;
        bets.value = []
        state.playBetNum = []
        state.playBetOnePair=[]
        state.playBetTowSome=[]
        state.playBetThreeSome=[]
        state.playBetNumSameAny=[]
        state.playBetNumDiff3=[]
        state.playBetNumNear3All=[]
        state.playBetNumDiff2=[]
        state.playBetOnePair= [[],[]];
		clearBet&&mapBet.clear();
        
    }


    /*
     * 中奖弹窗逻辑
     */
    const getWinLossResult=async (history:any[])=>{
        try {
            const  list=[...mapBet.keys()].reverse();
            if (!list.length)return;
            const issueNumber=list[0];
			const index=history.findIndex((item) => item.issueNumber === issueNumber);
			if (index >0) return  mapBet.clear();
            const {result,data}=await getLotteryWinLossResult({
                issueNumber
            });
            if (!result)return;
            if (data.status===null){
				mapBet.delete(issueNumber);
                return ;
            }
            onBetTrigger()
            mapBet.delete(issueNumber);
            if(!winner.value)return;
            const isWin=data.status===true;
            const openResult=history.find((item)=>item.issueNumber===issueNumber)
            winner.value.open({
                isWin,
                amount: data.winAmount||0,
                issueNumber,
                result:openResult,
            })
			mapBet.clear();
            if (isWin) updateBalance();
        }catch (e){

        }
    };
    const onBetting= async ()=>{
       if (loading.value)return;
       if (!agreePreSale.value) return  toast.error(t('common.agreePreSale'));
       if (!issue.value) return  toast.error(t('common.noIssueNumber'));
        try {
           const betContent:any[]=[];
           playBet.value.forEach((item)=>{
               console.log(item)
            if (['NumDiff3', 'NumDiff2'].includes(item.code)) {
                let NumDiff2Bet = item.code+`_${item.list.map(({playBet})=>playBet).sort().join('_')}`;
                betContent.push(NumDiff2Bet)
            } else {
                const list= item.list.map((bet)=>`${bet.playType}_${bet.playBet}`.replace('+','_'));
                betContent.push(...list)
            }
           });
            loading.value=true;
            const {result}=await getK3Bet({
                gameCode:gameCode.value,
                issueNumber:issue.value,
                amount:state.amount,
                betMultiple:betMultiple.value,
                betContent,
            });
            if (!result) return;
            mapBet.set(issue.value,1);
            onClearBet();
            toast.success(t('common.betSuccessful'));
            onBetTrigger();
            updateBalance()
       }catch (e){
        console.log(e)
       }finally {
           loading.value=false
       }
    }
    /*
     * 获取开奖历史
     */
    const getHistoryIssues=async ()=>{
        try {
            const {result,data}=await getLotteryOssHistoryIssue({
                gameCode:gameCode.value,
                lotteryCode:lotteryCode.value,
            });
            if (!result) return;
            state.historyIssues=data.list||[];
            state.historyIssuesTotalPage=data.totalPage||0
        }catch (e){

        }finally {

        }

    };
    const getOpenLottery=async (issue:string)=>{
        try {
            const {result,data}=await getLotteryOssHistoryIssue({
                gameCode:gameCode.value,
                lotteryCode:lotteryCode.value,
            });
            if (!result) return;
            const list=data.list||[]
            const item=list[0];
            if (item.issueNumber!==issue) return{
                list:data.list,
                item:null
            };
            return  {
                item,
                list:data.list,
            };

        }catch (e){

        }finally {

        }

    };
	const getlotteryissue=async ()=>{
		await Promise.all([getGameInfo(),getIssue(true),getHistoryIssues()])
	}
    // 开启、关闭音频
    const setVoice = () => {
        VoiceType.value == '1' ? (VoiceType.value = '2') : (VoiceType.value = '1')
        localStorage.setItem('volumeShow', VoiceType.value)
    }
    const useProvide=()=>{
        provide<K3State>(INJECT_KEY,{
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
            soundBg,
            soundEffects,
            betLimit,
            historyIssuesTotalPage,
            onClearBet,
            onBetting,
            getBetLimit,
            onSwitchSound,
        })
    }
    const changeType = (index: number) => {
        actNav.value = index
        onClearBet()
    }

    onMounted(async ()=>{
        const data=await canAutoPlay();
        const bg=localStore.get<number>(SOUND_BG)
        const ef=localStore.get<number>(SOUND_EF)
        if (data){
            if(bg===1){
                soundBg.value=true;
                bgSound.play();
            }
            if(ef===1){
                soundEffects.value=true;
            }
        }
    })
    return {
        betScopes,
        betMultiples,
        numbers,
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
        lottieEl,
        historyIssues,
        lotteryList,
        animationLock,
        animationRoll,
        issueLoading,
        bets,
        winner,
        onSwitchIntroduce,
        getIssue,
        onSwitchSound,
        useProvide,
        onBet,
        onClearBet,
        getIntroduce,
        getHistoryIssues,
        actNav,
        changeType,
		getlotteryissue,
        same2Mult,
        same2Rate,
        numSame3,
        same3All,
        numDiff3,
        numNear3All,
        numDiff2,
        setVoice,
        VoiceType,
		visibilityStatus
    }
}
export function useK3Context(){
    return inject<K3State>(INJECT_KEY,{} as K3State)
}


