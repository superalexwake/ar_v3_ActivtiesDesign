import {reactive, computed, ref, inject, onMounted, watch, onUnmounted} from "vue";
import {Howl} from 'howler';
import dayjs from 'dayjs';
import { updateOnlineStatus } from '@/api'
import {GetBetLimitRsp, getGameIntroduce, GetGameIntroduceRsp, getLotteryBetLimit, getLotteryIssue} from "@/saasLottery/api";
import {parseTime} from '@/saasLottery/utils';
import {useGlobalState} from "./useGlobal.hook";
import {useStorage} from "./useStorage.hook";
import {useWorkerIntervalFn} from './useWorkerIntervalFn.hook'
import {SOUND_BG, SOUND_EF} from "./constant";
interface LotteryState{
    // 音效
    bg?:string,
    processSound?:(countdown:number)=>void
	useNext?:boolean
}
interface LotteryStore{
    issue:string;
    issueData:any;
    countdown:number;
    interval:number
    sound:boolean
    agreePreSale:boolean
    introduceDialog:boolean
    betLimit:GetBetLimitRsp[]
    introduceHtml?:GetGameIntroduceRsp,
    soundBg:boolean
    soundEffects:boolean
}
export const INJECT_KEY=Symbol('AR_LOTTERY');
export function useLottery(options?:LotteryState){
    const {localStore}=useStorage()
    const {
		synchronizer,
		gameCode,
		lotteryCode,
		gameInfo,
		triggerTimer,
		setLotteryCode,
	}=useGlobalState()
    const state=reactive<LotteryStore>({
        /*
         *当前期号
         */
        issue:'',
        /*
         *当前期号原始数据
         */
        issueData:null,
        /*
         *倒计时
         */
        countdown: 0,
        /*
         * 当前期号时长
         */
        interval:0,
        /*
         * 声音弹窗
         */
        sound:false,
        /*
         * 声音背景
         */
        soundBg:false,
        /*
         * 声音背景
         */
        soundEffects:false,
        /*
         * 预售规则
         */
        agreePreSale:true,
        /*
         * 玩法说明弹窗
         */
        introduceDialog:false,
        /*
         * 限红数据
         */
        betLimit:[],
        /*
         * 玩法说明html内容
         */
        introduceHtml:undefined,
		/*
		 * 维护状态
		 */
		maintain: false,


    });
	const heartbeatTimer=ref<any>(null)
    const visibilityStatus = ref(true)
    /*
     * 背景音效
     */
    const bgSound = new Howl({
        src: options ? [options.bg] : [''],
        loop: true,
        volume: 1,
        preload:false
    });
    /*
     * 玩法说明 限红loading
     */
    const introduceLoading=ref(false);
    const betLimitLoading=ref(false);
    const issueLoading=ref(false);

    /*
     * 当前期号
     */
    const issue = computed(() => state.issue);
	const issueData=computed(() => state.issueData||{});
    /*
     * 倒计时
     */
    const countdown = computed(() => (
        {
            interval:state.interval||0,
            ...parseTime(state.countdown * 1000)
        }
    ));
    const countdownTime=computed(()=>{
        const minutes=`${countdown.value.minutes}`.padStart(2, '0')
        const seconds:string=`${countdown.value.seconds}`.padStart(2, '0')
        return [...minutes.split(''),':',...seconds.split('')]
    })
    const canBet=computed(()=>countdown.value.seconds>5);
	const closeGame=computed(()=>{
		if (state.maintain) return true
		return gameInfo.value?.state!==1;
	})
    /*
     * 快捷投注金额
     */
    const betScopes=computed(()=>gameInfo.value?.betScopes||[]);
    /*
     * 快捷投注倍数
     */
    const betMultiples=computed(()=>gameInfo.value?.betMultiples||[]);

    /*
     * 投注赔率
     */
    const rates=computed(()=>gameInfo.value?.rates||[]);
    const betLimit=computed(()=>state.betLimit||[]);

    /*
     *
     */
    const sound=computed({
        get() {
            return state.sound ;
        },
        set(val: boolean) {
            state.sound = val;
        },
    });
    const soundBg=computed({
        get() {
            return state.soundBg ;
        },
        set(val: boolean) {
            state.soundBg = val;
            if (state.soundBg){
                localStore.set(SOUND_BG,1)
                bgSound.load();
                bgSound.duration(0);
                bgSound.play();
            }else {
                bgSound.pause();
                localStore.set(SOUND_BG,0)
            }
        },
    });
    const soundEffects=computed({
        get() {
            return state.soundEffects ;
        },
        set(val: boolean) {
            if (val){
                localStore.set(SOUND_EF,1)
            }else {
                localStore.set(SOUND_EF,0)
            };
            state.soundEffects = val;
        },
    });
    const introduceHtml=computed(()=>state.introduceHtml||{});
    const agreePreSale = computed({
        get() {
            return state.agreePreSale ;
        },
        set(val: boolean) {
            state.agreePreSale = val;
        },
    });
    const introduceDialog = computed({
        get() {
            return state.introduceDialog ;
        },
        set(val: boolean) {
            state.introduceDialog = val;
        },
    });
	const heartbeatLoading=ref(false)
    /*
     * 倒计时定时器
     */
    const {pause,resume} = useWorkerIntervalFn(async () => {
        if (state.countdown < 1) {
            pause();
            //@ts-ignore
            const next=state.issueData?.next||null;
			const {useNext=true}= options||{};
            if (next&&useNext){
                await updataCurrentIssue(next as any,state.interval);
                //@ts-ignore
                state.issueData.next=null;
            }else {
                await getIssue();
            }
            return;
        };
        state.countdown -= 1;
        options && options?.processSound?.(state.countdown);
    }, 1000, {
        immediate: false
    });

    const updataCurrentIssue=async (data:Record<string, any>,_interval:number)=>{
         state.issue=data.issueNumber;

         const time = dayjs(data.endTime).valueOf() - dayjs(synchronizer.getCurrentTime()).valueOf();
         state.countdown = Math.floor(time / 1000);
		// console.log(Math.floor(time / 1000),'Math.floor(time / 1000)')
		resume();
		// if (state.countdown>0){
        //     resume();
        // }
    }
    const onSwitchSound=()=>{
        state.sound=!state.sound;
    }
    const onSwitchIntroduce=()=>{
        state.introduceDialog=!state.introduceDialog;
        if(state.introduceDialog){
            introduceLoading.value=true;
        }
    }

    /*
     * 获取期号 5d k3 wingo trx 共用
     */
    const getIssue=async (init=false)=>{
        try {
            if (init) issueLoading.value=true;
            const data:any=await getLotteryIssue({gameCode:gameCode.value,lotteryCode:lotteryCode.value});

			if (!data.current) return pause();
            const interval=data.intervalMinute*60;
            const current=data.current;
			const gameState=gameInfo.value?.state===2;
			const _state= data.state===2;

			if (state.issueData){
				const issueState=state.issueData.state==2;
				if(gameState&&issueState&&_state){
					state.maintain=true;
				}else if (!gameState&&!issueState&&_state){
					state.maintain=true;
				}else if (!gameState&&!issueState&&!_state){
					state.maintain=false;
				}else if (!gameState&&issueState&&!_state){
					state.maintain=false;
				}
				console.log(gameState,issueState,_state,'data')
			}
            state.issueData=data;
            state.interval=interval;
			console.log()
            await updataCurrentIssue(current,interval);

        }catch (e){
			console.log(e,'errr')
            pause();
        }finally {
            issueLoading.value=false;
        }
    }


    /*
     * 获取玩法说明 5d k3 wingo trx 共用
     */
    const getIntroduce=async ()=>{

        try {
            introduceLoading.value=true;
            const {result,data}=await getGameIntroduce(gameCode.value);
            if (!result) return;
            state.introduceHtml=data;
        }catch (e){

        }finally {
            introduceLoading.value=false;
        }

    }
    /*
     * 获取限红 5d k3 wingo trx 共用
     */
    const getBetLimit=async ()=>{
       if (betLimitLoading.value)return;
       try {
           betLimitLoading.value=true;
           const {result,data}=await getLotteryBetLimit(gameCode.value);
           if (!result) return;
           state.betLimit=data
       }catch (e){

       }finally {
           betLimitLoading.value=false
       }

    }



    /*
     *声音是否可以自动播放
     */
    const canAutoPlay=async (url?:string)=> {

		const _url=url||(options ? options.bg : '')
		if (!_url) return false;
        const audio = new Audio();
        audio.src = _url
        audio.muted = true;

        try {
            await audio.play();
            console.log('自动播放允许');
            return true;
        } catch (err) {
            console.log('自动播放被阻止');
            return false;
        }
    }
    const heartbeat=async ()=>{
		if (heartbeatLoading.value)return;
		try {
			heartbeatLoading.value=true;
			await updateOnlineStatus()
		}finally {
			heartbeatLoading.value=false;
		}
	};
	const startHeartbeat=(isClear=false)=>{
		if (heartbeatTimer.value) {
			clearInterval(heartbeatTimer.value);
		}
		if (isClear)return;
		heartbeatTimer.value=setInterval(()=>{
			heartbeat()
		},30*1000);
	}
    const handleVisibilityChange = () => {
        visibilityStatus.value = document.visibilityState === 'visible';
		if (visibilityStatus.value) {
			startHeartbeat();
		}else {
			startHeartbeat(true);
		}
    }
    onMounted(()=>{
		startHeartbeat()
        triggerTimer.on(()=>{
            pause();
        })
        document.addEventListener('visibilitychange', handleVisibilityChange)
    });

    onUnmounted(() => {
		startHeartbeat(true);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    });

    watch(
        () => visibilityStatus.value,
        (val) => {
            if (!val) {
                pause()
            } else {
                setTimeout(() => {
                    getIssue()
                }, 500)
            }
        }
    )
    return {
        betScopes,
        betMultiples,
        rates,
        canBet,
        issue,
        countdown,
        countdownTime,
        soundEffects,
        soundBg,
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
		issueData,
		closeGame,
        getIssue,
        updataCurrentIssue,
        pause,
        onSwitchSound,
        onSwitchIntroduce,
        getIntroduce,
        getBetLimit,
        canAutoPlay,
		setLotteryCode,
        visibilityStatus
    }
}

export function useLotteryContext(){
    return inject(INJECT_KEY,{}) as Record<string, any>
}