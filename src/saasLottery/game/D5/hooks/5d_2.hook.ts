import { computed, reactive,ref } from 'vue';
import { showToast } from 'vant';
const GameStore: any = reactive({
    issue: '2022040811318',
    typeId: 30,
    betMultiple:'1|5|10|20|50|100',
    // typeList: [],
    tabList:['A','B','C','D','E','SUM'],//table选择类型
    selectTab:'A', //默认tab选中的值
    
    time1: 0,
    time2: 0,
    time3: 0,
    time4: 0,

    /*初始化大小选择*/
    selectBall:null,
    /*初始化球数字数组*/
    barNumList:[],
    // /*选中的下注类型*/
    // betType:{}
    showHistory: false,
    distanceToTop: 0,
    typeList: [
        {
          typeID: 30,
          typeName: 'wingo30s'
        },
        {
          typeID: 1,
          typeName: 'wingo 1min'
        },
        {
          typeID: 2,
          typeName: 'wingo 3min'
        },
        {
          typeID: 3,
          typeName: 'wingo 5min'
        },
        {
          typeID: 5,
          typeName: '5D 1min'
        },
        {
          typeID: 6,
          typeName: '5D 3min'
        },
        {
          typeID: 7,
          typeName: '5D 5min'
        },
        {
          typeID: 8,
          typeName: '5D 10min'
        },
        {
          typeID: 9,
          typeName: 'K3 1min'
        },
        {
          typeID: 10,
          typeName: 'K3 3min'
        },
        {
          typeID: 11,
          typeName: 'K3 5min'
        },
        {
          typeID: 12,
          typeName: 'K3 10min'
        },
        {
          typeID: 13,
          typeName: 'TRX 1min'
        },
        {
          typeID: 14,
          typeName: 'TRX 3min'
        },
        {
          typeID: 15,
          typeName: 'TRX 5min'
        },
        {
          typeID: 16,
          typeName: 'TRX 10min'
        },
    ],
})

const betInfo = reactive({
    coin: 0, //下注金额
    count: 0, //下注倍数
    allCoin: 0, //下注总额
    gametype: 0, //游戏类型 0颜色 1数字 2大小
    typeid: 1, //台号1Min 3Min 5Min 10Min
    issuenumber: '', //期号
    selecttype: 1, //下注内容
    show: false,
});

const componentNum = ref(0);
const showGameType = ref(false);
export const FDHookTwo=()=>{

    let lock:number = 0;
      // 钱包金额
    const ProhibitBuyTime = 5;
    const typeId = computed(() => GameStore.typeId);
    const typeList = computed(() => GameStore.typeList||[]);
    const currentGame = computed(() => GameStore.typeList?.find((item: any) => item.typeID == GameStore.typeid) ||'');
    const coinList = computed(() => currentGame.value.scope?.split('|') || [1, 20, 300, 4000]);
    const multipleList = computed(() => currentGame.value.betMultiple?.split('|') || [1, 5, 10, 20, 50, 100]);
    const issue = computed(() => GameStore.issue);
    const selectBall = computed(() => GameStore.selectBall);
    const barNumList = computed(() => GameStore.barNumList||[]);
    const selectTab = computed(() => GameStore.selectTab);
    const tabList = computed(() => GameStore.tabList);
    const showHistory = computed(()=> GameStore.showHistory);
    const distanceToTop = computed(() => GameStore.distanceToTop);
    const countdown = computed(() => `${GameStore.time1}${GameStore.time2}:${GameStore.time3}${GameStore.time4}`);
    // 倒数定时器
    const timeHandle = ref<NodeJS.Timeout | null>(null);
    const getComponentNum = computed(() => componentNum.value);

    
     // 切换游戏
    const changeGame = async (typeID: any) => {
        clearInterval(timeHandle.value as NodeJS.Timeout);
        GameStore.typeid = typeID;
        lock = 1;
        await getGameIssue();
        await getHistory10();
        componentNum.value++;
    };

    const getGameIssue = async () => {
        // const res = await AwaitApiResult<any>(winGoGetGameIssue({ typeId:GameStore.typeid }))
        let res: any;
        if (res) {
          GameStore.issue = res.data.issueNumber;
          GameStore.currentTime = res.data.serviceTime.replace(/-/g, '/');
          GameStore.beginTime = res.data.startTime.replace(/-/g, '/');
          passTime();
        }
    };

    // 过期时间处理
    const passTime = () => {
        const currentTime = new Date(GameStore.currentTime).getTime();
        const beginTime = new Date(GameStore.beginTime).getTime();
        let gameTime = (currentTime - beginTime) / 1000; //游戏时间 = 服务器时间-游戏开始时间 如果大于
        if (gameTime > currentGame.value.intervalM * 60) {
        gameTime = currentGame.value.intervalM * 60;
        }
        GameStore.passTime = currentGame.value.intervalM * 60 - gameTime; //游戏剩余的时间，秒
        timeOutSubTime();
    };

     // 倒计时定时器
    const timeOutSubTime = () => {
        clearInterval(timeHandle.value as NodeJS.Timeout);
        subTime(false);
        timeHandle.value = setInterval(function () {
        subTime();
        }, 1000);
    };

    // 每秒钟处理倒计时
    const subTime = (reload = true) => {
        if (GameStore.passTime <= ProhibitBuyTime) {
        betInfo.show = false;
        }
        // if (VoiceType.value == '1') {
        //     if (GameStore.passTime <= ProhibitBuyTime.value && GameStore.passTime > 1) {
        //         voicePlay(1)
        //     } else if (GameStore.passTime == 1) {
        //         voicePlay(2)
        //     }
        // }
        if (GameStore.passTime > 0) {
        let subTime = GameStore.passTime - ProhibitBuyTime;
        GameStore.time2 = Math.floor(subTime / 60);
        GameStore.time3 = Math.floor((subTime % 60) / 10);
        GameStore.time4 = Math.floor(subTime % 10);
        GameStore.passTime--;
        } else {
        clearInterval(timeHandle.value as NodeJS.Timeout);
        if (reload) {
            getNewData();
        }
        }
    };

    // 获取最新数据
    const getNewData = async () => {
        await getGameIssue(); //期号
        await getWinsUserAmount();
        await getHistory10();
        componentNum.value++;
    };
    
    // 获取钱包金额
    const getWinsUserAmount = async (isShowT: boolean = false) => {
        // const res = await AwaitApiResult<any>(GetBalance())
        let res: any;
        if (res) {
          GameStore.amount = res?.data.amount || 0;
          isShowT && showToast('成功！');
        }
      };

        // 获取最近10期
    const getHistory10 = async () => {
        // const res = await AwaitApiResult<any>(
        // 	winGoGetNoaverageEmerdList({
        // 		pageSize: 10,
        // 		pageNo: 1,
        // 		typeId: GameStore.typeid
        // 	})
        // )
        let res: any;
        if (res?.data) {
        const { list } = res.data;
        GameStore.history10 = list.map((item: any) => item.number);
        }
    };


    const showGameList = (element: any) => {
        GameStore.showHistory = false;
        const rect = element.getBoundingClientRect();
        GameStore.distanceToTop = Math.floor(rect.top) + 'px';
        showGameType.value = true;
        console.log(`元素到视口顶部的距离: ${GameStore.distanceToTop}px`);
    };

    const setShowHistory = (v:boolean) => {
        console.log('123213')
        GameStore.showHistory = v;
    }

    //tab切换事件
    const checkTale= (data:String)=>{
        GameStore.selectTab=data
    }

    /*点击选择球事件*/
    const toggleBall=(item: any)=>{
        const itemIndex = GameStore.barNumList.indexOf(item)
        GameStore.selectBall=null
        if (itemIndex === -1) {
            GameStore.barNumList.push(item)
        } else {
            GameStore.barNumList.splice(itemIndex, 1)
        }
    }

    /*点击选择大小奇偶事件*/
    const selectBox=(item:any)=>{

        if (GameStore.selectBall === item) {
            // 如果点击的是当前选中的项目，则取消选择
            GameStore.selectBall = null;
        } else {
            // 否则，选中点击的项目
            GameStore.barNumList = [];
            GameStore.selectBall = item;
        }
    }


    // 下注
    const bettingPopupShow = computed({
        get(): boolean {
            return betInfo.show || false;
        },
        set(val: boolean) {
            betInfo.show = val;
        },
    });


    // 关闭投注弹窗，并清理相关数据。
    const clearBetting = () => {
        if (!betInfo.show) return;
        betInfo.show = false;
        betInfo.coin = coinList.value[0];
        betInfo.count = multipleList.value[0];
    };


    // 购买份数切换
    const TaskCount = (item: number) => {
        betInfo.count = item;
    };

    const betting=(con: any, type: any)=>{
        betInfo.gametype = type; //选择的是 颜色1 数字2 大小3
        betInfo.selecttype = con; //选择游戏内容
        betInfo.count = betInfo.count || multipleList.value[0];
        betInfo.issuenumber = issue.value; //期号
        betInfo.typeid = typeId.value; //几分钟的游戏
        betInfo.coin = coinList.value[0];
        betInfo.show = true;
    }
    // 提交投注参数。
    const submitBettingData = async ()=>{
        clearBetting()
    }
    return{
        betInfo,
        typeId,
        bettingPopupShow,
        coinList,
        multipleList,
        issue,
        typeList,
        selectTab,
        tabList,
        barNumList,
        selectBall,
        showGameType,
        countdown,
        showHistory,
        distanceToTop,
        getComponentNum,
        toggleBall,
        checkTale,
        betting,
        submitBettingData,
        TaskCount,
        clearBetting,
        selectBox,
        showGameList,
        changeGame,
        setShowHistory
    }
}