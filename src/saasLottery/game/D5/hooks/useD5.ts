import {WritableComputedRef, inject, provide, onMounted, ComputedRef, computed, reactive, Ref, ref} from "vue";
import {useI18n} from "vue-i18n";
import {
    GetBetLimitRsp,
    GetHistoryIssuePageRsp,
    getD5Bet,
    getLotteryOssHistoryIssue, getLotteryWinLossResult
} from "@/saasLottery/api";
import {SOUND_BG, SOUND_EF, INJECT_KEY,useGlobalContext, useLottery, useStorage, useToast} from "@/saasLottery/hooks";
import {FDHook} from "./5d.hook";
import {delay} from '@/saasLottery/utils';
interface D5State{
    sound:WritableComputedRef<boolean>,
    gameCode:ComputedRef<string>,
    historyIssues:ComputedRef<any[]>,
    historyIssuesTotalPage:ComputedRef<number>,
    issue:ComputedRef<string>, //当前最新开奖期号
    canBet:ComputedRef<boolean>,
    loading:Ref<boolean>,

    getBetLimit:()=>Promise<void>,//限红列表
    betLimitLoading:Ref<boolean>,//限红的loading
    agreePreSale:Ref<boolean>,//是否同意预售选择按钮
    betLimit:ComputedRef<GetBetLimitRsp[]>

    betScopes:ComputedRef<number[]>,
    betMultiples:ComputedRef<number[]>,
    amount:WritableComputedRef<number>,
    betMultiple:WritableComputedRef<number>,
    playRate:ComputedRef<number>,
    playBet:ComputedRef<string|number|null>,
    onClearBet:()=>void,
    onBetting:()=>void,
    onSwitchSound:()=>void,
    soundEffects:WritableComputedRef<boolean>,
    soundBg:WritableComputedRef<boolean>,

}

interface D5Store{
    /*投注数据*/
    amount:number,
    betMultiple:number,
    playType:string,
    playBet:number|string|null,
    playRate:number,
    /*
     *开奖历史数据
     */
    historyIssues:GetHistoryIssuePageRsp[],
    historyIssuesTotalPage:number,
}

export function useD5(){
    const toast=useToast();
    const {localStore}=useStorage()
    const mapBet=new Map();
    const winner=ref();
    const {t}=useI18n()
    const {updateBalance,onBetTrigger}=useGlobalContext();
    let initAnimation:any=null;
    // let svga:any=null;
    // const dice=new Howl({
    //     src: [loop],
    //     loop:false,
    // });
    // const tipsSound=new Howl({
    //     src: [tips],
    // });
    // const countDownSound=new Howl({
    //     src: [count_down],
    // });
    // const diceOpen=new Howl({
    //     src: [open_dice],
    // });
    // const startLose=new Howl({
    //     src:[start_close]
    // })
    const betMultiple = ref(1);
    const lottieEl=ref();
    const animationLock=ref(false);
    const animationRoll=ref(false);
    const loading=ref(false);
    /*获取选择的球跟奇偶大小*/
    const {clearBetting,actNav,initContainer,numberList}=FDHook()
    const {
        rates,
        betScopes,
        betMultiples,
        gameCode,
        sound,
        bgSound,
        canBet,
        issue,
        introduceHtml,
        introduceDialog,
        introduceLoading,
        lotteryCode,
        countdownTime,
        betLimitLoading,
        betLimit,
        agreePreSale,
        soundEffects,
        soundBg,
        getIntroduce,
        getIssue,
        onSwitchIntroduce,
        onSwitchSound,
        canAutoPlay,
        getBetLimit,
    } = useLottery({
      //  bg,
        async processSound(countdown) {
            if(countdown==1){
                const data=await getOpenLottery(issue.value);
                await delay(400)
                animationRoll.value=true;

                setTimeout(async ()=>{
                    state.historyIssues=data?.list||[];
                    animationLock.value=false;
                    animationRoll.value=false;
                },1500)
                setTimeout(async ()=>{
                    await getWinLossResults() //获取开奖结果
                },2500)
            }
            if (countdown===6){
                animationLock.value=true;
                onClearBet();
            }
            if (!soundEffects.value)return;
        }
    })

    const state=reactive<D5Store>({
        amount:1, //金额
        betMultiple:1, //倍数
        playType:'',
        playBet:null,
        playRate:0,
        /*
         *开奖历史数据
         */
        historyIssues:[],
        historyIssuesTotalPage:0,
    })

    const historyIssuesTotalPage=computed(() => state.historyIssuesTotalPage);
    const historyIssues=computed(()=>state.historyIssues);
    const playRate=computed(()=>state.playRate)
    const playBet=computed(()=>state.playBet)
    const lastResult=computed(()=>state.historyIssues[0]?.premium?.split('') || []);
    const lastResultSum=computed(()=>state.historyIssues[0]?.sum||0);

    const amount = computed({
        get() {
            return state.amount ;
        },
        set(val: number) {
            state.amount = val;
        },
    });

    /*取消清空投注数据*/
    const onClearBet=(clearBet=false)=>{
        state.playBet=null;
        state.playType='';
        state.playRate=0;
        betMultiple.value=betMultiples.value[0]||1;
        state.amount=betScopes.value[0]||1;
		clearBet&&mapBet.clear();
        clearBetting()
    }

    /*下注*/
    const onBetting=async ()=>{
        if(loading.value)return;
        if (!agreePreSale.value) return  toast.error(t('common.agreePreSale'))
        if (!issue.value) return  toast.error(t('common.noIssueNumber'))

        /*重新组装数据*/
        const List = numberList?.value.sort((a:any,b:any) => (a?.playBet ?? 0) - (b?.playBet ?? 0));
        const List2 = List.map((item:any)=>{
            return{
                ...item,
                playType:`${actNav.value?.code}Num`
            }
        })
        const removeBeforeSubstring=(str:any) =>{
            const aa = str.replace(/^.*?(BigSmall|OddEven)/, '$1') // 去掉指定字符串
            return aa;
        }
        const list3 =  initContainer.value?.map((item:any)=>{
            return{
                ...item,
                playType:`${actNav.value?.code}${removeBeforeSubstring(item?.playType)}`,
            }
        })
        const newData:any[]=[...list3,...List2]
        const endData:any[]=newData?.map((item)=>{
            return `${item.playType}_${item.playBet}`
        })
        try{
            loading.value=true;
            const {result}= await getD5Bet({
                gameCode:gameCode.value,
                issueNumber:issue.value,
                amount:state.amount,
                betMultiple:betMultiple.value,
                betContent:endData
            })
            if (!result)return ;
            mapBet.set(issue.value,1);
            onClearBet();
            toast.success(t('common.betSuccessful'));
            onBetTrigger()
            await updateBalance()

        }catch (e){
            // console.log(e)
        }finally {
            loading.value=false;
        }
    }
    /*
     * 投注的数字展示
     */
    const numList=computed(()=>{
        const intList=Array.from({ length: 10 }, (_, i) => i);
        const data=rates.value.find(({playType}:any)=>playType===`${actNav.value?.code}Num`);
        if (!data) return intList.map((item)=>({
            "playType": `${actNav.value?.code}Num`,
            "playBet": item,
            "playRate": 0
        }));

        return intList.map((item)=>({
            "playType": `${actNav.value?.code}Num`,
            "playBet": item,
            "playRate": data.playRate
        }))
    })


    /*
     * 大小奇偶数据获取
     */
    //切换展示字段说明
    const selectType=(c:string)=>{
        switch (c) {
            case "H":
                return "Big";
            case "L":
                return "Small";
            case "O":
                return "Odd";
            case "E":
                return "Even";
            default:
                return c;
        }
    }
    //颜色切换
    const selectColor=(d:string)=>{
        switch (d) {
            case "H":
                return "#F8B460";
            case "L":
                return "#609DEC";
            case "O":
                return "#F04848";
            case "E":
                return "#13C164";
            default:
                return d;
        }
    }



    // /*奇偶大小数据*/
    const bigSmallEven=computed(()=>{
        const leach1 = rates.value.filter(({playType}:any)=>playType===`${actNav.value?.code}BigSmall`)
        const leach2 = rates.value.filter(({playType}:any)=>playType===`${actNav.value?.code}OddEven`)
        const total = [...leach1,...leach2].sort((a:any, b:any) => a.playTypeId - b.playTypeId)
        const newData = total?.map((item)=>({
            "playType": item.playType,
            "playBet": selectType(item.playBet as string),
            "playRate": item.playRate,
            "playTypeId":item.playTypeId,
            "color":selectColor(item.playBet as string)
        }))
        return newData
    })


    /*获取开奖结果*/
    const getWinLossResults=async ()=>{
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
            if (data.status===null){
				mapBet.delete(issueNumber);
                return ;
            }
            onBetTrigger()
            mapBet.delete(issueNumber);
            if(!winner.value)return;
            const isWin=data.status===true;
            const openResult=historyIssues.value.find((item)=>item.issueNumber===list[0])
            winner.value.open({
                isWin,
                amount: data.winAmount||0,
                issueNumber,
                result:openResult,
            });
			mapBet.clear();
            if (isWin) updateBalance();
        }catch (e){}
    };


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


    /*获取游戏的开奖历史*/
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

    const useProvide=()=>{
        provide<D5State>(INJECT_KEY,{
            betScopes,
            betMultiples,
            betMultiple,
            amount,
            playRate,
            playBet,
            loading,
            agreePreSale,
            betLimitLoading,
            betLimit,
            sound,
            issue,
            canBet,
            historyIssues,
            gameCode,
            historyIssuesTotalPage,
            soundEffects,
            soundBg,
            onClearBet,
            onBetting,
            getBetLimit,//限红列表
            onSwitchSound,
        })
    }

    onMounted(async ()=>{
        const dataQuery=await canAutoPlay();
        const bg=localStore.get<number>(SOUND_BG)
        const ef=localStore.get<number>(SOUND_EF)
        if (dataQuery){
            if(bg===1){
                soundBg.value=true;
                bgSound.play();
            }
            if(ef===1){
                soundEffects.value=true;
            }
        }
    })

    return{
        betScopes,
        betMultiples,
        betMultiple,
        sound,
        issue,
        canBet,
        introduceHtml,
        introduceDialog,
        introduceLoading,
        historyIssues,
        countdownTime,
        rates,
        betLimitLoading,
        betLimit,
        soundEffects,
        soundBg,
        animationLock,
        animationRoll,
        lottieEl,
        lastResultSum,
        lastResult,
        winner,
        onClearBet,
        numList,
        bigSmallEven,
        useProvide,
        getIntroduce,
        onSwitchIntroduce,
        onSwitchSound,
        getHistoryIssues,
        getIssue
    }
}

export function useD5Context(){
    return inject<D5State|any>(INJECT_KEY,{} as D5State|any)
}
