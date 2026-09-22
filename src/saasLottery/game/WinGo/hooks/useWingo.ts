import {
    computed,
    ComputedRef,
    WritableComputedRef,
    inject,
    provide,
    reactive,
    ref,
    Ref,
    onMounted,
} from "vue";
import {Howl} from 'howler';
import {useGlobalContext, useLottery, INJECT_KEY,SOUND_BG,SOUND_EF, useToast, useStorage} from "@/saasLottery/hooks";
import {
    GetHistoryIssuePageRsp,
    WinGoBetContentEnum,
    LotteryGameCodeEnum,
    GetBetLimitRsp,
    getLotteryOssHistoryIssue,
    getLotteryWinLossResult,
    getWinGoBet,
} from "@/saasLottery/api";
import {delay, lazyCachedFunction, toCamelCase} from '@/saasLottery/utils'
import {useI18n} from "vue-i18n";
interface WingoState{
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
    playBet:ComputedRef<string|number|null>,
    onClearBet:()=>void,
    onBetting:()=>void,
    getBetLimit:()=>Promise<void>,
    agreePreSale:Ref<boolean>,
    loading:Ref<boolean>,
    sound:WritableComputedRef<boolean>
    historyIssuesTotalPage:ComputedRef<number>,
    betLimit:ComputedRef<GetBetLimitRsp[]>
    soundEffects:WritableComputedRef<boolean>,
    soundBg:WritableComputedRef<boolean>,
}
interface WingoStore{
    betDialog:boolean,
    amount:number,
    betMultiple:number,
    playType:string,
    playBet:number|string|null,
    playRate:number,
    /*
     *开奖历史数据
     */
    historyIssues:GetHistoryIssuePageRsp[],
    historyIssuesTotalPage:number
}

/*
 * 获取开奖结果为了保证后台并发要求
 * 采取第一页取oss 非第一页走接口
 */
export function useWingo() {
    const toast=useToast();
    const {t}=useI18n()
    const {localStore}=useStorage()
    const {updateBalance,onBetTrigger,getGameInfo}=useGlobalContext();
    let animat:any=null;
    const mapBet=new Map();
    const state =reactive<WingoStore>({
        betDialog:false,
        amount:1,
        betMultiple:0,
        playType:'',
        playBet:null,
        playRate:0,
        /*
         *开奖历史数据
         */
        historyIssues:[],
        historyIssuesTotalPage:0
    })
    const betClose = ref(false)
    const betMultiple = ref(0);
    const randomLock=ref(false);
    const animationLock=ref(false);
    const animationRoll=ref(false);
    const animationNumber=ref<string>('');
    const randomNum=ref(-1);
    const randomInterval=ref<any>(null);
    const loading=ref(false);
    const lottieEl=ref();
    const winner=ref();
    const processSound=async (countdown:number)=> {

        if (countdown===5){
            const  list=[...mapBet.keys()];
            if (!list.includes(issue.value)) mapBet.clear();
            animationLock.value=true;
            onClearBet();
        }

        if(countdown<6){
            betClose.value=true
        }

        if (countdown===6){
            animat&&animat.start()
        }
        if(countdown==2){
            await delay(400)
            const data=await getOpenLottery(issue.value);
            if (data?.item){
                setTimeout(()=>{
                    animationNumber.value=data?.item?.number||'';
                    animationRoll.value=true;
                },1150)
            }
            setTimeout(()=>{
                betClose.value=false
            },2000)
            setTimeout(async ()=>{
                animationNumber.value='';
                state.historyIssues=data?.list||[];
                animationLock.value=false;
                animationRoll.value=false;
            },2700)
            setTimeout(async ()=>{
                await getWinLossResult();
            },3200)
        }
    }
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
        betLimit,
        soundEffects,
        soundBg,
        onSwitchIntroduce,
        onSwitchSound,
        getIssue,
        getIntroduce,
        canAutoPlay,
        getBetLimit,

    }=useLottery({
        bg,
        processSound,
    })

    /*
     * 数字投注
     */
    const nums=Array.from({ length: 10 }, (_, i) => i);
    const numbers=computed(()=>{
        const data=rates.value.find(({playType}:any)=>playType==='Num');
        if (!data) return nums.map((item)=>({
            "playType": "Num",
            "playBet": item,
            "playRate": 0
        }));
        return nums.map((item)=>({
            "playType": "Num",
            "playBet": item,
            "playRate": data.playRate
        }))
    });
    /*
     * 颜色
     * 特殊处理 取唯一颜色 最小赔率展示
     */
    const colors=computed(()=>{
        const list:any[]=rates.value.filter(({playType})=>playType==='Color');
        if (!list.length) return list;
        const groupedRates = list.reduce((acc, rate) => {
            const { playType, playBet, playRate } = rate ;
            if (!acc[playType]) {
                acc[playType] = {};
            }
            if (!acc[playType][playBet]) {
                acc[playType][playBet] = {
                    ...rate,
                    playRates: [playRate]
                };
            } else {
                acc[playType][playBet].playRates.push(playRate);
            }
            return acc;
        }, {});
        const result = Object.values(groupedRates).flatMap((playTypeGroup:any) =>
            Object.values(playTypeGroup).map((group:any) => {
                const minRate = Math.min(...group.playRates);
                const maxRate = Math.max(...group.playRates);
                return {
                    ...group,
                    playRateStr:minRate === maxRate ? `x${minRate}` : `x${minRate}/x${maxRate}`
                };
            })
        );
        return [result[0],result[2],result[1]]
    });

    /*
     * 大小
     */
    const bigSmalls=computed(()=>{
		return rates.value.filter(({playType})=>playType==='BigSmall')
	});
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
    const playBet=computed(()=>state.playBet)
    const historyIssues=computed(()=>state.historyIssues);
    const history1 = computed(() => state.historyIssues[0] || {});
    const history2 = computed(() => state.historyIssues.slice(1, 10) || []);
    const historyIssuesTotalPage=computed(() => state.historyIssuesTotalPage);
    /*
     * 投注
     * 随机动画进行中不让点击
     */
    const onBet=(item:any)=>{
      if (randomLock.value) return;
      if (betClose.value)  return
      state.playBet=item.playBet;
      state.playType=item.playType;
      state.playRate=item.playRate;
      state.betDialog=true;
      state.amount=betScopes.value[0]||1;
      if(!betMultiple.value) betMultiple.value= betMultiples.value[0]||1
    };
    const onClearBet=(clearBet=false)=>{
        state.betDialog=false;
        state.playBet=null;
        state.playType='';
        state.playRate=0;
        betMultiple.value=0;
        state.amount=0;
		clearBet&&mapBet.clear();
    }
    const onRandom = () => {
        if (randomLock.value||!canBet.value) return;
        randomLock.value = true;
        if (!randomInterval.value) {
            randomInterval.value = setInterval(function () {
                randomNum.value = Math.floor(Math.random() * 11);
            }, 60);
        }
        setTimeout(function () {
            if (randomNum.value > 9) randomNum.value = 9;
            clearInterval(randomInterval.value as NodeJS.Timeout);
            randomLock.value = false;
            randomInterval.value = null;
            onBet(numbers.value.find((item)=>item.playBet===randomNum.value));
        }, 5000);
    };

    /*
     * 中奖弹窗逻辑
     */
    const getWinLossResult=async ()=>{
       try {
           const  list=[...mapBet.keys()].reverse();
           if (!list.length)return;
           const issueNumber=list[0];
		   const index=historyIssues.value.findIndex((item) => item.issueNumber === issueNumber);
		   if (index >0) return  mapBet.clear();
           const {result,data}=await getLotteryWinLossResult({
               issueNumber
           });
           if (!result)return;
           console.log('开奖结果',data)
           if (data.status===null){
			   mapBet.delete(issueNumber);
               return ;
           }
           onBetTrigger()
           mapBet.delete(issueNumber);
           if(!winner.value)return;
           const isWin=data.status===true;
           const openResult=historyIssues.value.find((item)=>item.issueNumber===issueNumber)
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

       if (!agreePreSale.value) return  toast.error(t('common.agreePreSale'))
       if (!issue.value) return  toast.error(t('common.noIssueNumber'));
       if(!state.playType)return;
        loading.value=true;
        try {
            const {result}=await getWinGoBet({
                gameCode:gameCode.value,
                issueNumber:issue.value,
                amount:state.amount,
                betMultiple:betMultiple.value,
                betContent:`${state.playType}_${toCamelCase(state.playBet as any)}` as WinGoBetContentEnum
            });
            if (!result)return ;
            onClearBet();
            mapBet.set(issue.value,1);
            toast.success(t('common.betSuccessful'));
            updateBalance()
            onBetTrigger();
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
            console.log('开奖历史记录',data.list||[])
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
            const list=data.list||[];
            state.historyIssuesTotalPage=data.totalPage||0
            const item=list[0];
            console.log('获取开奖结果',data.list||[])
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
    const useProvide=()=>{
        provide<WingoState>(INJECT_KEY,{
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
            soundEffects,
            soundBg,
            onClearBet,
            onBetting,
            getBetLimit,
        })
    }
    onMounted(async ()=>{
        const data=await canAutoPlay();
        const bg=localStore.get<number>(SOUND_BG)
        const ef=localStore.get<number>(SOUND_EF)
        if (data){
            if(bg===1){
                soundBg.value=true;
                bgSound.load()
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
        colors,
        bigSmalls,
        issue,
        countdown,
        countdownTime,
        canBet,
        sound,
        randomNum,
        introduceDialog,
        betMultiple,
        introduceLoading,
        introduceHtml,
        betLimitLoading,
        lottieEl,
        historyIssues,
        history1,
        history2,
        animationLock,
        animationRoll,
        animationNumber,
        issueLoading,
        historyIssuesTotalPage,
        soundEffects,
        soundBg,
        winner,
        bgSound,
        tipsSound,
        loopSound,
        countDownSound,
        onSwitchIntroduce,
        getIssue,
        onSwitchSound,
        useProvide,
        onBet,
        onRandom,
        onClearBet,
        getIntroduce,
        getHistoryIssues,
		getlotteryissue,
    }
}


