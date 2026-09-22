import {computed, reactive} from 'vue';

const GameStore: any = reactive({
    /*球类型选择*/
    navList:[
        {
            name:'A',
            code:'First'
        },
        {
            name:'B',
            code:'Second'
        },
        {
            name:'C',
            code:'Third'
        },
        {
            name:'D',
            code:'Fourth'
        },
        {
            name:'E',
            code:'Fifth'
        },
        {
            name:'SUM',
            code:'Sum'
        }
    ],
    actNav:{name:'A',code:'First'},
    /*大小奇偶类型*/
    // betTypeList:[],
    // ballNum:[0,1,2,3,4,5,6,7,8,9],
    /*初始化大小选择*/
    // selectedItemId:null,
    /*初始化球数组容易*/
    numberList:[],
    // betTypeName:{},
    /*初始化奇偶大小容器*/
    initContainer:[],
    show:false, //投注弹框
})


export const FDHook=()=>{
    const numberList = computed(() => GameStore.numberList);
    const initContainer = computed(() => GameStore.initContainer);
    const navList = computed(() => GameStore.navList);
    const actNav = computed(() => GameStore.actNav);


    /*ABCD Sum切换*/
    const showType= (data:any)=>{
        console.log("彩种类型切换",data)
        GameStore.actNav = data;
        // console.log(GameStore.initContainer)
    }

    /*大小奇偶切换*/
    const selectBox=(item:any)=>{
        console.log("大小切换",item)
        GameStore.show=true
        const index = GameStore.initContainer.findIndex((a:any)=>a.playBet===item.playBet)
        GameStore.numberList = [];
        if (index > -1) {
            GameStore.initContainer.splice(index, 1)
        } else {
            GameStore.initContainer=[]
            GameStore.initContainer.push(item)
        }
        if(GameStore.initContainer.length=== 0){GameStore.show=false}
        console.log("选择的奇偶大小",GameStore.initContainer)
    }

    /*切换数字选择*/
    const toggleItem = (item:any) => {
        GameStore.show=true
        const index = GameStore.numberList.findIndex((a:any)=>a.playBet===item.playBet)
        GameStore.initContainer=[]
        if (index === -1) {
            GameStore.numberList.push(item)
        } else {
            GameStore.numberList.splice(index, 1)
        }
        if(GameStore.numberList.length=== 0){GameStore.show=false}
        console.log("数字选择的值",numberList)
    }

    // 下注
    const bettingPopupShow = computed({
        get(): boolean {
            return GameStore.show || false;
        },
        set(val: boolean) {
            GameStore.show = val;
        },
    });


    // 关闭投注弹窗，并清理相关数据。
    const clearBetting = () => {
        if (!GameStore.show) return;
        GameStore.show = false;
        /*选择的数字跟奇偶大小清空*/
        GameStore.initContainer=[]
        GameStore.numberList = [];
    };


    return{
        bettingPopupShow,
        numberList,
        navList,
        actNav,
        initContainer,
        showType,
        toggleItem,
        clearBetting,
        selectBox,
    }
}
