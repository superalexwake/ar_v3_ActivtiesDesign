import { GetBalance,d4GameBetting,  get4DGameConfig, getGame4DIssue,get4DOddsList,getGameTypeList,getMy4DHistoryBetting,
     get4DGameResult,get4DGameResultByType,d4GameCancelOrder } from "@/api";
import { D4, WinGo } from "@/types/api";
import { AwaitApiResult } from "@/utils";
import dayjs from "dayjs";
import { useCommonStore } from '@/stores'
import { showFailToast } from "vant";
import { computed, onBeforeUnmount, reactive, ref } from "vue"
import { useI18n } from 'vue-i18n'
const timeShow = ref(false);
const promptShow = ref(false)
const gameListIndex = ref(0) //0:开奖记录，1:我的比赛
const typeList = ref()//彩种列表
const myHistory = ref() //我的投注记录
export function use4D(){
    interface dataTS{
        timeVal:string
        lotteryList:number[]
        lotteryTab:D4.GameIssueRes[]
        timeIndex:number
        tabId: number;
        rollNum: number;
        betQuantity: number;
        betAmount: number;
        totalAmount: number;
        betType: number[];
        betPay: number;
        betPayList:number[]
        betTypeList:number[]
        dupleList: {
            list: number[];
        }[];
        allActive: number[];
        banbetpay: number;
        multipleList:number[]
        betAmountList:number[]
        duplex:boolean
        balance:number
        stopTime:null|NodeJS.Timeout
    }
    const dataStore = reactive<dataTS>({
        timeVal:dayjs().format('YYYY-MM-DD'), //默认选择当天时间
        timeIndex:0, //时间下标
        lotteryList:[], //彩种选中集合
        lotteryTab:[], //彩种集合
        tabId:1, //1输入投注 2选择投注
        rollNum:0,//点击R的次数
        betQuantity:0, //数量
        betAmount:0, //单注投注金额
        totalAmount:0,  //总金额
        betType:[], //投注类型集合
        betTypeList:[], //投注类型集合 1.大万 2.小万 3.一等奖 4.二等奖 5.三等奖 6.特别奖 7.安慰奖
        betPay:1, //玩法选中  1.四位直选 2.四位全保 3.四位包字 4.四位来回 5.四位R选   0:四位直选 1:四位全保 2:四位包字 3:四位来回 4:四位R选
        betPayList:[], //玩法集合
        dupleList:[{ list:[]},{ list:[]},{list:[]},{list:[]}], //复式选中集合
        allActive:[], //复式个十百千选中
        banbetpay:0, //判断玩法是可选
        multipleList:[1,5,10,20,50,100], //倍数集合
        betAmountList:[10,50,100,500,1000,5000],//投注金额集合
        duplex:false, //是否为复式
        balance:0, //余额
        stopTime:null

    })
    const { t } = useI18n()
    const { setLoading } = useCommonStore()
    const num = ref('') //输入的号码
    const countVal = ref<number>(1) //默认倍数
    const checked = ref(true) //是否同意预售规则
    const preSaleRule = ref(false) //预售规则弹窗
    const betShow = ref(false);
    const oddsList = ref([{}])  //赔率列表
    const newGameResult = ref() //所有彩种最新一期开奖结果
    const gameResultByTypeO = ref() //开奖结果
    const tabList = [{
        name:t('xosoTxt90'),
        type:0
    },{
        name:t('xosoTxt89'),
        type:1
    },{
        name:t('xosoTxt88'),
        type:2
    },{
        name:t('xosoTxt87'),
        type:3
    }]

    //默认当天投注彩票时间
    const timeVal = computed(()=>dataStore.timeVal);

    const timeIndex = computed(()=>dataStore.timeIndex);
    //彩种选中集合
    const lotteryList = computed(()=>dataStore.lotteryList);
    //彩种集合
    const lotteryTab = computed(()=>dataStore.lotteryTab);
    //tab切换ID
    const tabId = computed(()=>dataStore.tabId)
    //判断有几个R
    const rollNum = computed(()=>dataStore.rollNum)
    //选中投注类型集合
    const betType = computed(()=>dataStore.betType)
    //投注类型集合
     const betTypeList = computed(()=>dataStore.betTypeList)
    //玩法选中
    const betPay = computed(()=>dataStore.betPay)
     //玩法集合
    const betPayList = computed(()=>dataStore.betPayList)
    //单注选中金额
    const count = computed(()=>dataStore.betAmount)
    //总金额
    const totalAmount = computed(()=>dataStore.totalAmount)
    //数量
    const betQuantity = computed(()=>dataStore.betQuantity)
    //四位全保 四位包字是否可选
    const banbetpay = computed(()=>dataStore.banbetpay)
    //复式选中集合
    const dupleList = computed(()=>dataStore.dupleList)
    //复式个十百千选中
    const allActive = computed(()=>dataStore.allActive)
    //倍数集合
    const multipleList = computed(()=>dataStore.multipleList)
    //投注金额集合
    const betAmountList = computed(()=>dataStore.betAmountList)
    //是否为复式
    const duplex = computed(()=>dataStore.duplex)
    //余额
    const balance = computed(()=>dataStore.balance)

    //时间格式星期几
    const getTimeWeek = (date:string) =>{
        const daysOfWeek = [t('Sunday'), t('Monday'), t('Tuesday'), t('Wednesday'), t('Thursday'), t('Friday'), t('Saturday')];
        const day = new Date(date)
        const dayOfWeekIndex = daysOfWeek[day.getDay()];
        return dayOfWeekIndex;
    }
    // 选择时间
    const onTime = (item:D4.GameIssueRes,index:number) =>{
        dataStore.timeIndex = index;
        dataStore.timeVal = item.date;
        getClear(1)
        timeShow.value = false;
    }
    //彩种选择
    const lotterTab = (item:D4.gamesList,index:number) =>{
        if(dataStore.lotteryList.includes(item.type)){
            let hasNum = dataStore.lotteryList.indexOf(item.type)
            dataStore.lotteryList.splice(hasNum,1);//存在就删除
        }else{
            dataStore.lotteryList.push(item.type)
        }
        getAmonut(dataStore.betType.length,dataStore.betAmount,dataStore.betPay);
    }
    //投注切换
    const onTab = (id:number) =>{
        dataStore.tabId = id;
        getClear(0);
    }
    // 切换的时候清除选中数据 0: 投注切换 1:弹窗清除&&投注清空
    const getClear = (type:number) =>{
        num.value = '';
        dataStore.betPay = 1;
        dataStore.rollNum = 0;
        dataStore.betType.length = 0;
        dataStore.betAmount = dataStore.betAmountList[0];
        dataStore.dupleList.forEach((item)=>item.list = []);
        dataStore.allActive.length = 0;
        countVal.value = 1;
        clearCompute()
        betShow.value = false;
        if(type==1){
            dataStore.lotteryList.length = 0;
        }
    }
    //计算数量&&金额&&玩法可选清除
    const clearCompute =() =>{
        dataStore.totalAmount = 0;
        dataStore.betQuantity = 0;
        dataStore.banbetpay = 0;
    }
    // 点击Roll
    const onRoll = () =>{
        if(dataStore.rollNum>=2||num.value.length>=4) return showFailToast(t('EnterTip'));
        dataStore.betPay = 5;
        num.value += 'R';
        dataStore.rollNum = getRQuantity(num.value.split(''))
        console.log(num.value)
        getAmonut(dataStore.betType.length,dataStore.betAmount,dataStore.betPay);
    }
    //input监听
    const getInput = (e:any) =>{
        num.value = e.target.value;
        if(num.value == ''){
            dataStore.betPay = 1;
        }
        if(num.value.length !==4){
            clearCompute()
        }else{
            const isNum = numFormat(e.target.value);
            if(isNum){
                getAmonut(dataStore.betType.length,dataStore.betAmount,dataStore.betPay);
                dataStore.banbetpay = getBoxQuantity(num.value);
                if(dataStore.banbetpay === 1){
                    dataStore.betPay = 1;
                }
            }else{
                num.value = '';
                dataStore.betPay = 1;
                showFailToast(t('FormatTip1'));
            }
        }
        dataStore.rollNum = getRQuantity(num.value.split(''))
    }
    //光标离开
    const getBlur = (e:any) =>{
        if(e.target.value ==''||e.target.value.length !== 4) return;
        const isNum = numFormat(e.target.value)
        if(!isNum){
            num.value = '';
            dataStore.betPay = 1;
            showFailToast(t('FormatTip1'));
        } 
    }
    //判断输入的格式是否符合标准
    const numFormat = (num:string) =>{
        let isNum =/^[0-9]{4}|\R[0-9]{3}|[0-9]{1}\R[0-9]{2}|[0-9]{2}\R[0-9]{1}|\R[0-9]{2}\R|[0-9]{2}\R{2}|\R{2}[0-9]{2}|[0-9]{3}\R|[0-9]\R{2}[0-9]|[0-9]\R[0-9]\R|\R[0-9]\R[0-9]$/.test(num);
        return isNum;
    }
    // 判断R出现了多少次
    const getRQuantity = (arr:string[]) =>{
        let index = arr.indexOf('R'),num = 0;
        while (index !== -1) {
            num++
            index = arr.indexOf('R', index + 1)
        }
        return num;
    }
    //选择投注类型
    const onBetType = (item:number) =>{
        const {betType,betAmount,betPay} =dataStore;
        if(betType.includes(item)){
            let hasNum = betType.indexOf(item)
            betType.splice(hasNum,1);//存在就删除
        }else{
            betType.push(item)
        }
        getAmonut(betType.length,betAmount,betPay);
    }
    //选择玩法
    const onBetpay = (type:number) =>{
        dataStore.betPay = type;
        getAmonut(dataStore.betType.length,dataStore.betAmount,type);
    }
    // 选金额
    const onAmount = (count:number) =>{
        dataStore.betAmount = count;
        getAmonut(dataStore.betType.length,count,dataStore.betPay);
    } 
     // 计算金额&&数量 type:投注类型 pay:玩法 count:投注金额
     const getAmonut = (typelen:number,count:number,pay?:number) =>{
        let { tabId,dupleList,lotteryList } = dataStore;
        if(tabId === 1){
            if(num.value.length !== 4) return false;
            getCunt(typelen,count,num.value,pay)
        }else{
            if(listMap(dupleList)){ //判断是否是多选 
                dataStore.betQuantity = listCount(dupleList) * lotteryList.length * dataStore.betType.length;//多注基础计算：总数量 = （个十百千复式计算出来的总注数） * 玩法类型长度 * 选中彩种
                dataStore.totalAmount = dataStore.betQuantity * count*lotteryList.length * countVal.value; //多注基础计算：总金额 = 数量 * 单注金额 * 选中彩种长度 * 倍数
            }else{
                const num = dupleList.map(item => item.list[0]).join('');
                if(num.length!==4) return;
                dataStore.banbetpay = getBoxQuantity(num);
                // if(dataStore.banbetpay === 1){
                //     dataStore.betPay = 1;
                // }
                getCunt(typelen,count,num,pay)
            }
        }
    }

    // 计算 数量和 金额
    const getCunt = (typelen:number,count:number,num:string,pay?:number) =>{
        let { rollNum ,lotteryList} = dataStore;
        let basicAmount = typelen * count * lotteryList.length * countVal.value; //单注基础计算：总金额 = 玩法类型长度 * 单注金额 * 选中彩种长度 * 倍数
        let basicQuantity = typelen * lotteryList.length; //单注基础计算：总数量 = 玩法类型长度 * 选中彩种
        let totalAmount = 0 , betQuantity = 0;
        if(pay === 1 || pay === 2){
            totalAmount = basicAmount;
            betQuantity = basicQuantity;
        }else if(pay === 3){
            const betnum = getBoxQuantity(num);
            totalAmount = basicAmount * betnum;
            betQuantity = basicQuantity * betnum;
        }else if(pay === 4){
            const revNum = getReverseBast(num);
            totalAmount = basicAmount * (revNum?1:2);
            betQuantity = basicQuantity * (revNum?1:2);
        }else if(pay === 5){
            totalAmount = basicAmount * (rollNum>0?(rollNum ==1?10:10*10):0);
            betQuantity = basicQuantity * (rollNum>0?(rollNum ==1?10:10*10):0);
        }
        dataStore.totalAmount = totalAmount;
        dataStore.betQuantity = betQuantity;
    }
    //四位来回 格式判断
    const getReverseBast = (number:string) =>{
        return number === number.split('').reverse().join('');
    }
    //四位包字 单独计算数量
    function getBoxQuantity(number:string) {
        function factorial(n:number):number {
            if (n <= 1) {
                return 1;
            } else {
                return n * factorial(n - 1);
            }
        }
        let numArray = number.split('').map(Number);
        let uniqueDigits = [...new Set(numArray)]; // 去除重复数字
        let totalPermutations = factorial(numArray.length);
        let duplicatePermutations = 1;
        for (const digit of uniqueDigits) {
            const digitCount = numArray.filter(d => d === digit).length;
            duplicatePermutations *= factorial(digitCount);
        }
        let result = totalPermutations / duplicatePermutations;
        return result
    }
    // 选择投注逻辑
    //复选：单点，个，十，百，千
    const allAddnum = (type:number) => {
        const { dupleList, allActive ,betType ,betAmount } = dataStore;
        dupleList[type].list = [];
        if(allActive.includes(type)){
            let hasNum = allActive.indexOf(type)
            allActive.splice(hasNum,1);//存在就删除
        }else{
            allActive.push(type);
            for(let i = 0; i<10; i++){
                dupleList[type].list.push(i)
            }
        }
        // dataStore.betQuantity = listCount(dupleList);
        getDuple();
        getAmonut(betType.length,betAmount)
    }
    //复选 单选数字
    const addNumber = (type:number,index:number) =>{
        const { dupleList, allActive,betType,betAmount,betPay } = dataStore;
        const list = dupleList[type].list;
        if(list.includes(index)){
            let hasNum = list.indexOf(index)
            list.splice(hasNum,1);//存在就删除
        }else{
            list.push(index);
        }
        if(list.length === 10){
            allActive.push(type);
        }else{
            if(allActive.includes(type)){
                let hasNum = allActive.indexOf(type)
                allActive.splice(hasNum,1);//存在就删除
            }
        }
        // dataStore.betQuantity = listCount(dupleList)
        getDuple();
        if(listCount(dupleList) > 0){ //单选的时候判断是否组合成一注
            getAmonut(betType.length,betAmount,betPay)
            if(listCount(dupleList) === 1){
                const num = dupleList.map(item => item.list[0]).join('');
                dataStore.banbetpay = getBoxQuantity(num);
            }
            if(dataStore.banbetpay === 1){
                dataStore.betPay = 1;
            }
        }else{
            if(listMap(dupleList)){ //判断单点是否有某一列有两个
                dataStore.banbetpay = listMap(dupleList)?1:0
            }else{
                clearCompute()
            }
            
        }
    }
    // 判断是否是多选
    const getDuple =() => {
        const { dupleList } = dataStore;
        dataStore.duplex = listMap(dupleList);
        dataStore.banbetpay = listMap(dupleList)?1:0
        if(listMap(dupleList)){
            dataStore.betPay = 1;
        }
    }
    //计算复式选中的时候，个，十，百，千中是否含有两位数
    function listMap(list:any){
        for (let i = 0; i < list.length; i++) {
            const arr = list[i]['list'];
            if (Array.isArray(arr) && arr.length > 1) {
                return true;
            }
        }
        return false;
    }
    // 复选计算数量
    function listCount(list:any) {
        let sum = 1;
        list.forEach((item: any,index:number)=>{
            sum*=item.list.length;
        })
        return sum;
    }
    /*
        投注弹窗里面的逻辑
    */
    //点击投注
    const onClickBet = () =>{
        betShow.value = true;
        
    }
    //份数加减 1减 2加
    const onStepper = (type: number) => {
        const { betType,betAmount,betPay } = dataStore;
        switch (type) {
            case 1:
                if (countVal.value > 1){
                    countVal.value--
                }
                break
            case 2:
                countVal.value++
                break
            default:
        }
        getAmonut(betType.length,betAmount,betPay)
    }
    // 改变输入框的值
    const changeStep = (e: any) => {
        const { betType,betAmount ,betPay} = dataStore;
        countVal.value = e.target.value
        getAmonut(betType.length,betAmount,betPay)
    }
    //选择倍数
    const onMltiple = (item:number) =>{
        const { betType,betAmount ,betPay} = dataStore;
        countVal.value = item;
        getAmonut(betType.length,betAmount,betPay)
    }
    // 同意预售规则
    const checkboxChange = (e:any) => {
        console.log(e)
        checked.value = e;
    }
    //下注
    const onBet =() =>{
        const {lotteryList, lotteryTab,timeIndex,tabId ,betPay ,betType , betQuantity ,betAmount ,dupleList ,totalAmount ,balance} = dataStore;
        if(totalAmount>balance) return showFailToast(t('wfDesc3')); //判断余额
        if((betQuantity/lotteryList.length)>7000) return showFailToast(t('d4BetTip',[7000])); //每个彩种单注不能超7000
        if(!checked.value) return showFailToast(t('agreePresaleRules'));
        let data:any = {};
        data.type = lotteryList;
        data.gameType = betPay;
        let betContent = '';
        if(tabId === 1){
            betContent = num.value;
        }else{
            betContent = dupleList.map((item)=>item.list.sort((a, b) => a - b).join(',')).join('|');
        }
        data.betContent = betContent;
        data.betType = betType;
        data.betMethod = tabId
        data.betNumber = betQuantity
        data.multiple =  Number(countVal.value)
        data.amount = betAmount
        data.issueNumber = lotteryList.map((type) => {
            const list = lotteryTab[timeIndex].games.find((item) => item.type === type);
            return list?.issueNumber;
        });
        betShow.value = false
        getGameBetting(data)
        promptClose()
    }
    const promptClose = () => {
        setTimeout(()=>{
            promptShow.value = false;
        },1500)
    }
    //获取余额
    const getWinsUserAmount = async () => {
        const res = await AwaitApiResult<ObjResNull<WinGo.resGetWinsUserAmount>>(GetBalance())
        if (res?.data) {
            dataStore.balance = res?.data.amount || 0
        }
    }
    // 
    const getGameConfig = async() =>{
        const res = await AwaitApiResult(get4DGameConfig())
        if(res?.data){
            dataStore.multipleList = res?.data.betMultiplier || []
            dataStore.betAmountList = res?.data.betAmount || []
            dataStore.betTypeList = res?.data.betType || []
            dataStore.betPayList = res?.data.gameType || []
            dataStore.betAmount = res?.data.betAmount[0]||0
        }
    }
    const getGameIssue = async() =>{
        setLoading(true)
        const res = await AwaitApiResult(getGame4DIssue())
        if(res?.data){
            dataStore.timeVal = res.data[dataStore.timeIndex].date;
            dataStore.lotteryTab = res?.data || []
            // getOpenlattery(res.serviceNowTime)
        }
        setLoading(false)
    }
    //获取是否有要开奖的彩种
    const getOpenlattery = (serviceNowTime:string)=>{
        const { lotteryTab ,timeIndex} = dataStore;
        const Timelist = lotteryTab[timeIndex].games.map((item)=> item.stopTime);
        const dateArray = Timelist.map(timeString => new Date(timeString)); 
        const minDate = new Date(Math.min(...dateArray)); 
        const formattedTime = dayjs(minDate).format('YYYY-MM-DD HH:mm:ss');
        console.log('封盘时间:'+formattedTime,'服务器时间:'+serviceNowTime)
        const duration = dayjs(formattedTime).diff(dayjs(serviceNowTime));
        setTime(duration/1000)
    }
    const setTime = (duration:number)=>{
        dataStore.stopTime = setInterval(()=>{
            if(duration>0){
                console.log(duration)
                duration--;
            }else{
                getClear(1);
                clearInterval(dataStore.stopTime as NodeJS.Timeout)
                getGameIssue();
            }
            
        },1000)
    }
    // 投注
    const getGameBetting = async(data:any) =>{
        const res = await AwaitApiResult(d4GameBetting(data))
        if(res?.code === 0){
            promptShow.value = true;
            getWinsUserAmount()
            if(gameListIndex.value === 1){
                //请求我投注记录接口
                getMy4DHistory({pageSize:10,pageNo:1,type:0,date: dayjs(new Date()).format('YYYY-MM-DD')+' 00:00:00'})
            }
            promptClose();
        }else{
            getGameIssue();
        }
        getClear(1)
    }
    //获取赔率
    const getOddsList = async() =>{
        setLoading(true)
        oddsList.value.length=0
        const res = await AwaitApiResult(get4DOddsList())
        if(res?.data){
            res?.data.forEach((items:any) => {
                let dwList = [] as any
                let xwList = [] as any
                let dtList = [] as any
                items.items.forEach((item:any)=>{
                    if(item.playId.split('_').length==1){
                        dtList.push({...item,code:item.playId})
                    }else{
                        if(item.playId.split('_')[0]=='1'){
                            dwList.push({...item,code:item.playId.split('_')[1]})
                        }
                        if(item.playId.split('_')[0]=='2'){
                            xwList.push({...item,code:item.playId.split('_')[1]})
                        }
                    }
                })
                oddsList.value.push({
                    playTypeId:items.playTypeId,
                    playTypeTitle:items.playTypeTitle,
                    lists:[
                        {
                            type:1,
                            list:dwList
                        },
                        {
                            type:2,
                            list:xwList
                        },
                        {
                            type:3,
                            list:dtList
                        }
                    ]
                })
            });
        }
        setLoading(false)
    }

    //获取彩种列表
    const getTypeList = async() =>{
        if(typeList.value) return
        setLoading(true)
        const res = await AwaitApiResult(getGameTypeList())
        if(res?.data){
            typeList.value = res.data.map((item: any) => {
                item.typeName = t(`d4LType${item.typeId}`)
                return item
            })
            typeList.value.unshift({
                typeId:0,
                typeName:t('all')
            })
        }
        setLoading(false)
    }

    //我的投注记录
    const getMy4DHistory = async(params:Object)=>{
        setLoading(true)
        const res = await AwaitApiResult(getMy4DHistoryBetting(params))
        if(res?.data){
            myHistory.value = res?.data || {}
        }
        setLoading(false)
    }
    //所有彩种最新一期开奖结果
    const get4DResult = async()=>{
        setLoading(true)
        const res = await AwaitApiResult(get4DGameResult())
        if(res?.data){
            newGameResult.value = res?.data || []
        }
        setLoading(false)
    }

    //开奖结果
    const gameResultByType = async(params:Object)=>{
        setLoading(true)
        const res = await AwaitApiResult(get4DGameResultByType(params))
        if(res){
            gameResultByTypeO.value = res?.data || {}
        }
        setLoading(false)
    }
    // 4D撤单
    const gameCancelOrder = async(params:Object)=>{
        const res = await AwaitApiResult(d4GameCancelOrder(params))
        return new Promise(async (resolve, reject) => {
            if (res) {
                resolve(res)
            } else {
                reject(res)
            }
        })
    }
    onBeforeUnmount(()=>{
        clearInterval(dataStore.stopTime as NodeJS.Timeout)
    })
    
    return {
        tabList,
        getTimeWeek,
        onTime,
        lotterTab,
        onTab,
        getClear,
        onRoll,
        getInput,
        getBlur,
        onBetType,
        onBetpay,
        onAmount,
        onClickBet,
        addNumber,
        allAddnum,
        onStepper,
        changeStep,
        onMltiple,
        checkboxChange,
        onBet,
        getWinsUserAmount,
        getGameConfig,
        getGameIssue,
        getOddsList,
        getTypeList,
        getMy4DHistory,
        get4DResult,
        gameResultByType,
        gameCancelOrder,
        gameListIndex,
        timeVal,
        lotteryTab,
        timeIndex,
        lotteryList,
        timeShow,
        betShow,
        tabId,
        rollNum,
        banbetpay,
        num,
        betType,
        betTypeList,
        betPay,
        betPayList,
        count,
        totalAmount,
        betQuantity,
        allActive,
        dupleList,
        countVal,
        checked,
        preSaleRule,
        multipleList,
        betAmountList,
        duplex,
        balance,
        promptShow,
        oddsList,
        typeList,
        myHistory,
        newGameResult,
        gameResultByTypeO
    }
}
