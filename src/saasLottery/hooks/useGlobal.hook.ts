import { reactive, computed, inject, provide, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue'
import { createGlobalState, useEventBus } from '@vueuse/core'
import {
    getLotteryUserInfo,
    getUserBalance,
    getLotteryGameInfo,
    GetUserInfoRsp,
    GetGameInfoRspApiResponse,
    LotteryGameCodeEnum,
	GetGameListRsp,
	getLotteryGameList,
	GetGameListRspItem
} from '@/saasLottery/api'
import { delay,synchronizer } from "@/saasLottery/utils";
import {
	PRERENDER_APP,
	PRERENDER_KEY,
	STORAGE_TOKEN,
	DEFAULT_LOCALE,
	STORAGE_LANG,
	STORAGE_URL,
	STORAGE_SKIN, Follow_switch
} from "./constant";
import { useStorage } from "./useStorage.hook";
const global_Inject = Symbol('GLOBAL_INJECT');

interface GlobalStore {
    user?: GetUserInfoRsp;
    balance: number
    token: string
    gameInfo?: GetGameInfoRspApiResponse
    lotteryCode: string
    gameCode: LotteryGameCodeEnum
    gameList: GetGameListRsp[];
    lang: string
    redirectUrl: string
    skin: string
    skincolor: string
}
interface GlobalState {
    balance: ComputedRef<number>
    user: ComputedRef<GetUserInfoRsp | undefined>,
    gameInfo: ComputedRef<GetGameInfoRspApiResponse | undefined>,
    gameCode: ComputedRef<LotteryGameCodeEnum | undefined>
    dollarSign: ComputedRef<any>;
    token: ComputedRef<string>;
    redirectUrl: ComputedRef<string>;
    balanceLoading: Ref<boolean>
    getUserInfo: () => Promise<void>,
    updateBalance: () => Promise<any>,
    getGameInfo: () => Promise<void>,
    getWebData: () => Promise<void>,
    globalLoading: Ref<boolean>
    gameList: ComputedRef<GetGameListRsp[]>;
    currentGame: ComputedRef<GetGameListRspItem | undefined>;
    onLotteryJump: (item: GetGameListRsp) => Promise<void> | void,
    skin: ComputedRef<string>,
    skincolor: ComputedRef<string>,
    changeSelectGame: (item: GetGameListRspItem) => void,
    getGameList: (isRefresh: boolean) => Promise<void>,
    onBetTrigger: () => void,
    trigger: any,
    lotteryCode: ComputedRef<string>,
}




const { localStore } = useStorage();
const triggerTimer = useEventBus<string>('stop')
export const useGlobalState = createGlobalState(
    () => {
        // @ts-ignore
        const app_data = window[PRERENDER_APP] || {};
        // @ts-ignore
        const prerender_data = window[PRERENDER_KEY] || {};
        // @ts-ignore
        const prerender =false;
        const baseLang = app_data.Lang || localStore.get(STORAGE_LANG);
        const baseRedirectUrl = app_data.RedirectUrl;
        const state = reactive<GlobalStore>({
            user: prerender_data?.info,
            balance: 0,
            token: localStore.get(STORAGE_TOKEN) || app_data.Token,
            gameInfo: prerender_data?.game,
            gameCode: '' as LotteryGameCodeEnum,
            lotteryCode: '',
            lang: baseLang || DEFAULT_LOCALE,
            gameList: [],
            redirectUrl: baseRedirectUrl || localStore.get(STORAGE_URL) || '',
            // 皮肤
            skin: app_data.Skin||localStore.get(STORAGE_SKIN),
            // 皮肤颜色
            skincolor: app_data.SkinColor,
        });
        const visibility = ref(0);
        const user = computed(() => state.user);
        const balance = computed(() => state.balance || 0);
        const gameInfo = computed(() => state.gameInfo||{});
        const gameCode = computed(() => state.gameCode);
        const lotteryCode = computed(() => state.lotteryCode);
        const lang = computed(() => state.lang);
        const redirectUrl = computed(() => state.redirectUrl);
        const serviceTime = computed(() => synchronizer.getCurrentTime());
        const gameList = computed(() => state.gameList || []);
        const skin = computed(() => state.skin);
        const skincolor = computed(() => state.skincolor);
        const currentGame = computed(() => {
            let games: any[] = []
            state.gameList.forEach((item: any) => {
                games.push(...item.gameList)
            })
            const item = games.find((item) => item.gameCode === gameCode.value)
            return item
        })
        function setUser(data: any) {
            state.user = data;
            state.skin = data.skin;
            state.skincolor = data.skinColor;
			localStore.set(Follow_switch, data.isOpenFollow===true);
            localStore.set(STORAGE_SKIN, data.skin);
        }
        function setBalance(data: number) {
            state.balance = data
        }

        const setvisibility = (value: number | null = null) => {
            if (typeof value === 'number') {
                visibility.value = value
            } else {
                typeof visibility.value === 'number' && (visibility.value += 1)
                console.log('visibility333', visibility.value)
            }
        };
        const visibilitychange = () => {
            if (document.visibilityState === 'visible') {
                console.log('visible')
                setvisibility()
            } else {
                console.log('hidden')
                setvisibility(0)
                // 预留离开当前页签处理
            }
        }
		const setLotteryCode = (gameCode: string) => {
			const lottery = gameCode?.split('_')[0];
			state.gameCode=gameCode as LotteryGameCodeEnum;
			state.lotteryCode=lottery as string;
		}
        return {
			skin,
			skincolor,
			triggerTimer,
			synchronizer,
			redirectUrl,
			lang,
			gameList,
			currentGame,
			prerender,
			serviceTime,
			user,
			balance,
			state,
			gameCode,
			lotteryCode,
			gameInfo,
			visibility,
			visibilitychange,
			setUser,
			setBalance,
			setLotteryCode,
		}
    }
);
export const useGlobal = () => {
    const trigger = useEventBus<string>('bet')
    const {
		lotteryCode,
		skin,
		skincolor,
		redirectUrl,
		balance,
		gameList,
		currentGame,
		prerender,
		user,
		gameInfo,
		gameCode,
		state,
		setUser,
		setBalance,
		setLotteryCode
	} = useGlobalState();
	const token = computed(() => state.token || localStore.get(STORAGE_TOKEN) || '');
    const balanceLoading = ref(false);
    const globalLoading = ref<boolean>(prerender);
    const dollarSign = computed(() => user.value?.sysCurrency);
    const onLotteryJump = async (item: GetGameListRspItem) => {
        if (item.state === 2) return;
        if (item.gameCode === gameCode.value) return;
		setLotteryCode(item.gameCode as string);
		await delay(600)
		trigger.emit('bets')
    }
    const changeSelectGame = onLotteryJump;

    const getUserInfo = async () => {
        try {
            if (!localStore.get(STORAGE_TOKEN)) return;
            // if (user.value) return;
            const data = await getLotteryUserInfo();
            if (data.result) setUser(data.data);
        } catch (e) {

        }
    }

    const updateBalance = async () => {
        if (balanceLoading.value) return;
        try {
            balanceLoading.value = true;
            const { result, data, serviceTime } = await getUserBalance();
            if (result) setBalance(data?.balance || 0);
            return { serviceTime }
        } catch (e) {
            return { serviceTime: 0 }
            console.log(e)
        } finally {
            balanceLoading.value = false;
        }
    }
    const getGameInfo = async () => {
        if (!state.gameCode) return;
        try {
            const data = await getLotteryGameInfo({
                gameCode: state.gameCode,
            });
            console.log('data>>>>>>>>>', data)
            if (data.result) state.gameInfo = data.data;
        } catch (e) {

        }
    };
    const getGameList = async (isRefresh = false) => {
        if (state.gameList.length && !isRefresh) return;
        try {
            const data = await getLotteryGameList();
            if (data.result) {
                // @ts-ignore
                const baseList = data.data.filter((item) => item.gameList?.length > 0).sort((a, b) => b.sort - a.sort);
                baseList.forEach((item) => {
                    // @ts-ignore
                    item.gameList = item.gameList?.sort((a, b) => b.sort - a.sort);
                })
                state.gameList = baseList;
            }
        } catch (e) {

        }
    };
    const onBetTrigger = async () => {
        await delay(2000)
        trigger.emit('bets')
    }
    const getWebData = async () => {
        globalLoading.value = true;
        await Promise.all([getUserInfo(), getGameInfo()]);
        globalLoading.value = false;
        getGameList();
		setTimeout(() => {	updateBalance() }, 1000);
    };
    const useProvide = () => {
        provide<GlobalState>(global_Inject, {
            balance,
            user,
            token,
            gameInfo,
            balanceLoading,
            dollarSign,
            gameCode,
            globalLoading,
            gameList,
            currentGame,
            redirectUrl,
            trigger,
            skin,
            skincolor,
            updateBalance,
            getGameList,
            onBetTrigger,
            getUserInfo,
            getWebData,
            getGameInfo,
            onLotteryJump,
            changeSelectGame,
            lotteryCode,
        })
    };
    return {
        prerender,
        balance,
        user,
        token,
        gameInfo,
        balanceLoading,
        dollarSign,
        gameCode,
        globalLoading,
        gameList,
        currentGame,
        skin,
        skincolor,
		lotteryCode,
		trigger,
        useProvide,
        updateBalance,
        getUserInfo,
        getWebData,
        getGameInfo,
        onLotteryJump,
        getGameList,
        changeSelectGame,
		setLotteryCode,
    }
};
export const useGlobalContext = () => {
    return inject<GlobalState>(global_Inject, {} as GlobalState)
}

