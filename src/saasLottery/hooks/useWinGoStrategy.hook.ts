import {addFollowBet, getFollowBetList, getFollowHistory, stopFollowBet,getFollowGameRule,getBetStrategy} from "@/saasLottery/api";
import {reactive, computed} from "vue";
import {showToast} from "vant";
import {useGlobalState} from "./useGlobal.hook";
import {useI18n} from 'vue-i18n'
export const useWinGoStrategy = () => {
	const {gameCode}=useGlobalState()
	const {t} = useI18n()
	const state = reactive({
        totalCount: 0,
        totalPage: 0,
        pageNo: 1,
        pageSize: 10,
		// 策略初始化列表
		strategiesList:[],
		/*历史记录策略列表*/
		historyStrategiesList:[],
		/*当前跟投的策略信息*/
		currentStrategy:[],
		/*当前跟投信息的订单号*/
		orderNo:'',
		/*跟投规则*/
		followRule:{}
    })

    const pageNo = computed(()=> state.pageNo)
    const pageSize = computed(()=> state.pageSize)
    const totalPage = computed(()=> state.totalPage)
    const totalCount = computed(()=> state.totalCount)
    const strategiesList = computed(()=> state.strategiesList)
    const historyStrategiesList = computed(()=> state.historyStrategiesList)
    const currentStrategy = computed(()=> state.currentStrategy)
    const orderNo = computed(()=> state.currentStrategy[0]?.orderNo||'')
    const followRule = computed(()=> state.followRule)


    // 获取策略列表
    const getStrategiesList = async () => {
		// state.strategiesList=[]
		const { data, code,msgCode } = await getFollowBetList({ gameCode: gameCode?.value });
		if (code === 0) {
			state.strategiesList = data||[];
			//const _orderNo=localStore.get("FollowNo");
			//state.orderNo=_orderNo||''
			const strategy:any =  data?.find((item: any) => item.orderNo!==null) ;
			if (strategy){
				state.currentStrategy=[strategy];
			}
			const item =  data?.find((item: any) => item.orderNo===orderNo.value) ;
			const current= state.currentStrategy[0]||{}
			if (!item)return;
			if (item?.orderNo===current?.orderNo){
				state.currentStrategy =[Object.assign(current,{...item})]
			}
		}else {
			showToast({ message:t(`code${msgCode}`)})
		}
    }

	/*当前跟投策略*/
	const getCurrentStrategy = async (item:any) => {
		if (!item)return;
		const {data, code,msgCode}=await getBetStrategy({ orderNo: item });
		if(code === 0 ){
			// state.currentStrategy = [{...data}] as any
			// Object.assign(state,{currentStrategy:[data]})
			const current= state.currentStrategy[0]||{}
			state.currentStrategy =[Object.assign(current,{...data})]
			/*自动跟投时完毕后数据要清除*/
			if(data.state===0){
				state.currentStrategy=[];
				await getStrategiesList()
			}
		}else {showToast({ message:t(`code${msgCode}`)})}
	}


    /*历史记录策略列表*/
    const getHistoryStrategiesList = async (item:{ pageNo: number, pageSize: number }) => {
		const { data, code,msgCode } = await getFollowHistory({ gameCode: gameCode?.value, ...item });
        if (code === 0) {
            state.totalCount = data.totalCount;
            state.totalPage = data.totalPage;
			state.historyStrategiesList = data.list;
        }else {showToast({ message:t(`code${msgCode}`)})}
    }

    /*新增策略*/
    const addStrategy = async (item:any) => {
		try{
			const { data, code,msgCode } = await addFollowBet(item)
			if(code === 0){
				state.currentStrategy = [{...data}] as any
				showToast({ message:t('hint7')})
			}else{
				showToast({ message:t(`code${msgCode}`)})
			}
		}catch (e) {}
    }

    /*停止策略*/
    const stopStrategy = async (item:any) => {
		const { code,msgCode } = await stopFollowBet({ orderNo: item })
        if(code === 0){
			/*清除当前策略信息*/
            showToast({ message:t('hint8')})
        }else {
			showToast({ message:t(`code${msgCode}`)})
        }
    }

	/*跟投规则获取接口*/
	const getFollowBetRule = async ()=>{
		const { data, code,msgCode } = await getFollowGameRule({ gameCode: gameCode?.value });
		if(code === 0){
			state.followRule = data||{}
		}else {
			showToast({ message:t(`code${msgCode}`)})
		}
	}

	const getFollowBetAll= async ()=>{
		state.currentStrategy=[]
		await Promise.all([
			getStrategiesList()
		])
	}

    return {
        getStrategiesList,
        getHistoryStrategiesList,
        addStrategy,
        stopStrategy,
		getFollowBetAll,
		getFollowBetRule,
		getCurrentStrategy,
		historyStrategiesList,
		strategiesList,
		orderNo,
		currentStrategy,
        pageNo,
        totalPage,
        pageSize,
        totalCount,
		followRule,
    };
}