import { getGameIntroduce, getLotteryBetLimit, getLotteryIssue, getTrxWingoBet, getLotteryOssHistoryIssue, getLotteryWinLossResult } from "@/saasLottery/api";
import { useGlobalContext, useGlobalState, useToast, useWorkerIntervalFn } from "@/saasLottery/hooks";
import { parseTime, toCamelCase } from '@/saasLottery/utils';
import { computed, onMounted, reactive, ref, watch } from "vue";
import dayjs from 'dayjs';
import { useI18n } from "vue-i18n";

const toast = useToast();
export function useTrx() {
    const {  gameCode, lotteryCode, gameInfo, visibility, visibilitychange,synchronizer } = useGlobalState()
    const { trigger, updateBalance, onBetTrigger, getGameInfo } = useGlobalContext()
    const { t } = useI18n()
    //  补全代码
    const state = reactive<any>({
        issue: '',              // 当前期号
        issueData: null,        // 当前期号原始数据
        countdown: 0,           // 倒计时
        interval: 0,            // 当前期号时长
        sound: false,           // 是否开启声音
        soundBg: false,         // 是否开启背景音乐
        soundEffects: false,    // 是否开启音效
        agreePreSale: true,     // 是否同意预售规则
        introduceDialog: false, // 玩法说明弹窗
        introduceHtml: undefined, // 介绍内容
        historyIssues: [], // 历史期号
        result: '', // 开奖结果
        resultAll: '', // 开奖结果
        historyIssuesTotalPage: 0, // 历史期号总页数
        betDialog: false, // 投注弹窗
        playBet: 0, // 投注号码
        amount: 0, // 投注金额
        betLimit: [], // 投注限制
    })
    const mapBet = new Map();
    const betMultiple = ref(0);
    const betClose = ref(false)
    const randomLock = ref(false);
    const loading = ref(false);
    const update = ref(0);
    const winner = ref();
    const randomNum = ref(-1);
    const randomInterval = ref<any>(null);
    const introduceLoading = ref(false);
    const betLimitLoading = ref(false);
    // 开关音频变量
    const VoiceType = ref(localStorage.getItem('volumeShow') || '1')
    const nums = Array.from({ length: 10 }, (_, i) => i);
    // 期号
    const issue = computed(() => state.issue);
    // 倒计时
    const countdown = computed(() => (
        {
            interval: state.interval || 0,
            ...parseTime(state.countdown * 1000)
        }
    ));
    const countdownTime = computed(() => {
        const minutes = `${countdown.value.minutes}`.padStart(2, '0')
        const seconds: string = `${countdown.value.seconds}`.padStart(2, '0')
        return [...minutes.split(''), ':', ...seconds.split('')]
    })
    // 是否可以投注
    const canBet = computed(() => countdown.value.seconds > 10)
    // 投注限制
    const betScopes = computed(() => gameInfo.value?.betScopes || []);
    // 快捷投注倍数
    const betMultiples = computed(() => {
        return gameInfo.value?.betMultiples || []
    });
    const introduceHtml = computed(() => state.introduceHtml || {});
    // 全部开奖结果
    const resultAll = computed(() => state.resultAll);
    // 开奖结果
    const result = computed(() => state.result);
    // 赔率
    const rates = computed(() => gameInfo.value?.rates || []);
    // 颜色
    const colors = computed(() => {
        const list: any[] = rates.value.filter(({ playType }) => playType === 'Color');
        if (!list.length) return list;
        const groupedRates = list.reduce((acc, rate) => {
            const { playType, playBet, playRate } = rate;
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
        const result = Object.values(groupedRates).flatMap((playTypeGroup: any) =>
            Object.values(playTypeGroup).map((group: any) => {
                const minRate = Math.min(...group.playRates);
                const maxRate = Math.max(...group.playRates);
                return {
                    ...group,
                    playRateStr: minRate === maxRate ? `x${minRate}` : `x${minRate}/x${maxRate}`
                };
            })
        );
        return [result.find(i=>i.playBet =='green'), result.find(i=>i.playBet =='violet'), result.find(i=>i.playBet =='red')]
    });
    // 大小
    const bigSmalls = computed(() => {
        const small = rates.value.find(({ playBet }: any) => playBet === 'small');
        const big = rates.value.find(({ playBet }: any) => playBet === 'big');
        return  [big, small]
    });
    // 投注号码
    const numbers = computed(() => {
        const data = rates.value.find(({ playType }: any) => playType === 'Num');
        if (!data) return nums.map((item) => ({
            "playType": "Num",
            "playBet": item,
            "playRate": 0
        }));
        return nums.map((item) => ({
            "playType": "Num",
            "playBet": item,
            "playRate": data.playRate
        }))
    });
    // 历史期号
    const historyIssuesTotalPage = computed(() => state.historyIssuesTotalPage);
    // 历史期号
    const historyIssues = computed(() => state.historyIssues);
    const betDialog = computed(() => state.betDialog);
    const playBet = computed(() => state.playBet);
    // 是否同意预售规则
    const agreePreSale = computed({
        get() {
            return state.agreePreSale;
        },
        set(val: boolean) {
            state.agreePreSale = val;
        },
    });
    const amount = computed({
        get() {
            return state.amount;
        },
        set(val: number) {
            state.amount = val;
        },
    });

    const introduceDialog = computed({
        get() {
            return state.introduceDialog;
        },
        set(val: boolean) {
            state.introduceDialog = val;
        },
    });
    // 投注金额
    const betLimit = computed(() => state.betLimit || []);
    // 获取期号
    const getIssue = async () => {
        const data: any = await getLotteryIssue({ gameCode: gameCode.value, lotteryCode: lotteryCode.value });
        const interval = data.intervalMinute * 60;
        const current = data.current;
        console.log('getLotteryIssue-data', data)
        state.issueData = data;
        state.interval = interval;
        await updataCurrentIssue(current, interval);
    }
    // 更新当前期号
    const updataCurrentIssue = async (data: Record<string, any>, _interval: number) => {
        state.issue = data.issueNumber;
        const time = dayjs(data.endTime).valueOf() - dayjs(synchronizer.getCurrentTime()).valueOf();
        state.countdown = Math.floor(time / 1000);
        if (state.countdown > 0) {
            start();
            console.log('resume')
        }
    }
    // 更新历史期号
    const getHistoryIssues = async () => {
        try {
            const { result, data } = await getLotteryOssHistoryIssue({
                gameCode: gameCode.value,
                lotteryCode: lotteryCode.value,
            });
            if (!result) return;
            state.historyIssues = data.list || [];
            console.log('state.historyIssues', 666666, state.historyIssues)
            if (data.list?.length) {
                state.result = data.list[0].number || '';
                state.resultAll = data.list[0].blockId || '';
            }
            state.historyIssuesTotalPage = data.totalPage || 0
        } catch (e) {
            console.log(e)
        } finally {

        }
    };
    // 投注
    const onBet = (item: any) => {
        if (randomLock.value) return;
        if (betClose.value) return;
		if (state.issueData?.gameCode!==gameCode.value) return;
        state.playBet = item.playBet;
        state.playType = item.playType;
        state.playRate = item.playRate;
        state.betDialog = true;
        state.amount = betScopes.value[0] || 1;
        if (!betMultiple.value) betMultiple.value = betMultiples.value[0] || 1
    };
    const onClearBet = (clearBet = false) => {
        state.betDialog = false;
        state.playBet = null;
        state.playType = '';
        state.playRate = 0;
        betMultiple.value = 0;
        state.amount = 0;
        clearBet && mapBet.clear();
    }
    const onBetting = async () => {
        if (loading.value) return;
        if (!agreePreSale.value) return toast.error(t('common.agreePreSale'))
        if (!issue.value) return toast.error(t('common.noIssueNumber'))
        if (!state.playType) return;
        loading.value = true;
        try {
            const { result } = await getTrxWingoBet({
                gameCode: gameCode.value,
                issueNumber: issue.value,
                amount: state.amount,
                betMultiple: betMultiple.value,
                betContent: `${state.playType}_${toCamelCase(state.playBet as any)}` as any
            });
            if (!result) return;
            mapBet.set(issue.value, 1);
            onClearBet();
            toast.success(t('common.betSuccessful'));
            state.betV++;
            updateBalance()
            onBetTrigger()
        } catch (e) {
            console.log(e)
        } finally {
            loading.value = false
        }
    }
    /*
     * 获取限红 5d k3 wingo trx 共用
     */
    const getBetLimit = async () => {
        if (betLimitLoading.value) return;
        try {
            betLimitLoading.value = true;
            const { result, data } = await getLotteryBetLimit(gameCode.value);
            if (!result) return;
            state.betLimit = data
        } catch (e) {

        } finally {
            betLimitLoading.value = false
        }

    }

    /*
     * 中奖弹窗逻辑
     */
    const getWinLossResult = async () => {
        try {
            const list = [...mapBet.keys()].reverse();
            if (!list.length) return;
            const issueNumber = list[0];
			const index=historyIssues.value.findIndex((item) => item.issueNumber === issueNumber);
			if (index >0) return  mapBet.clear();
            const { result, data } = await getLotteryWinLossResult({
                issueNumber
            });
            if (!result) return;
            if (data.status === null) {
				mapBet.delete(issueNumber);
                return;
            }
            onBetTrigger()
            mapBet.delete(issueNumber);
            if (!winner.value) return;
            const isWin = data.status === true;
            console.log('state.historyIssues', state.historyIssues);
            console.log('list', list[0]);
            const openResult = state.historyIssues.find((item) => item.issueNumber === issueNumber)
            winner.value.open({
                isWin,
                amount: data.winAmount || 0,
                issueNumber,
                result: openResult,
            });
			mapBet.clear();
            if (isWin) updateBalance();
        } catch (e) {

        }
    };
    /*
     * 倒计时定时器
     */
    const { pause, start } = useWorkerIntervalFn(async () => {
        if (state.countdown <= 11 && betDialog) state.betDialog = false;

        if (VoiceType.value == '1') {
            if (state.countdown <= 11 && state.countdown > 1) {
                voicePlay(1)
            } else if (state.countdown == 1) {
                voicePlay(2)
            }
        }
        if (state.countdown < 1) {
            pause();
            //@ts-ignore
            const next = state.issueData?.next || null;
            if (next) {
                updataCurrentIssue(next as any, state.interval);
                //@ts-ignore
                state.issueData.next = null;
            } else {
                await getIssue();
            }
            update.value++;
            setTimeout(async () => {
                await getHistoryIssues();
                getWinLossResult()
            }, 500);
            return;
        };
        state.countdown -= 1;
    }, 1000, {
        immediate: false
    });

    /*
     * 获取玩法说明 5d k3 wingo trx 共用
     */
    const getIntroduce = async () => {

        try {
            introduceLoading.value = true;
            const { result, data } = await getGameIntroduce(gameCode.value);
            if (!result) return;
            state.introduceHtml = data;
        } catch (e) {

        } finally {
            introduceLoading.value = false;
        }

    }
    // 播放音频
    const voicePlay = (action = 1) => {
        const ttsAudio: any = document.getElementById(`voice${action}`)
        if (ttsAudio) {
            ttsAudio.play()
        }
    }

    // 开启、关闭音频
    const setVoice = () => {
        VoiceType.value == '1' ? (VoiceType.value = '2') : (VoiceType.value = '1')
        localStorage.setItem('volumeShow', VoiceType.value)
    }
    const onSwitchIntroduce = () => {
        state.introduceDialog = !state.introduceDialog;
        if (state.introduceDialog) {
            introduceLoading.value = true;
        }
    }
    const onRandom = () => {
		if (randomLock.value) return;
		if (state.countdown<10) return;
        randomLock.value = true;
        if (!randomInterval.value) {
            randomInterval.value = setInterval(function () {
                randomNum.value = Math.floor(Math.random() * 11);
            }, 60);
        }
        setTimeout(() => {
            if (randomNum.value > 9) randomNum.value = 9;
            clearInterval(randomInterval.value as NodeJS.Timeout);
            randomLock.value = false;
            randomInterval.value = null;
			if (state.countdown<10) return;
            onBet(numbers.value.find((item) => item.playBet === randomNum.value));
        }, 3000);
    };
    const getlotteryissue = async () => {
        await Promise.all([getGameInfo(), getIssue(), getHistoryIssues()])
    }
    watch(
        () => visibility.value,
        (newVal) => {
            if (newVal === 0) {
                pause()
            } else {
                pause()
                setTimeout(() => {
                    getIssue()
					getHistoryIssues()
                }, 500)
            }
        }
    )
    onMounted(() => {
        document.addEventListener('visibilitychange', visibilitychange)
    });

    return {
        issue,
        countdown,
        countdownTime,
        canBet,
        betScopes,
        betMultiples,
        getIssue,
        getHistoryIssues,
        resultAll,
        result,
        colors,
        onBet,
        numbers,
        bigSmalls,
        historyIssuesTotalPage,
        historyIssues,
        gameCode,
        trigger,
        betDialog,
        betMultiple,
        playBet,
        agreePreSale,
        amount,
        onClearBet,
        onBetting,
        getBetLimit,
        loading,
        betLimit,
        update,
        winner,
        onRandom,
        randomNum,
        onSwitchIntroduce,
        introduceDialog,
        introduceHtml,
        getIntroduce,
        setVoice,
        VoiceType,
        getlotteryissue,
    }
}