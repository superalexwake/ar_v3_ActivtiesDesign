import {computed, reactive,ref} from "vue";
import {getDailyProfitRank} from "@/api";
import type {DailyProfitRankItem} from "@/types";
interface WinnerStore{
	list:DailyProfitRankItem[],
	penarikanlist:DailyProfitRankItem[]
	timer:NodeJS.Timeout|null
	source:null|Record<string, DailyProfitRankItem>
}
const store=reactive<WinnerStore>({
	list:[],
	topList: [],
	penarikanlist:[],
	timer:null,
	source:null
});
/*
 * 首页中奖滚动
 */
export function useWinner(){
	const wrapperRef = ref<HTMLElement|null>(null)
	const winnerList=computed(()=>store.list);
	const topList = computed(()=> store.topList)
	const penarikanlist=computed(()=>store.penarikanlist||[])
	const source=computed<WinnerStore['source']>(()=>store.source)
	const desensitizeString = (str: string) => {
		if (str.length >= 7) {
			return str.substring(0, 3) + '***' + str.substring(str.length - 3)
		} else {
			const stars = '***'
			const paddingLength = 7 - str.length
			const padding = '*'.repeat(paddingLength)
			return (
				str.substring(0, Math.ceil((7 - paddingLength) / 2)) +
				stars +
				padding +
				str.substring(Math.ceil((7 - paddingLength) / 2))
			)
		}
	}
    const getWinner=async ()=>{
      const {data}=await getDailyProfitRank();
	    store.list=data.dataList||[];
		store.topList = data.penarikanList || []
		store.penarikanlist=data.penarikanList||[]
	}
	const destroyTimer=()=>{
		if (!store.timer) return;
		clearInterval(store.timer);
		store.timer=null;
	}
	const startTimer=()=>{
		if (!store.list.length)return;
		destroyTimer();
		store.timer = setInterval( () => {
			if (!store.list.length) return;
			if (!wrapperRef.value) return destroyTimer();
			store.list.unshift(store.list.pop() as DailyProfitRankItem)
		}, 3000)
	};

	// 大类别名 对应中奖接口的列表key值
	const map: any = {
		k3list: 'K3',
		fishslist: 'Fish',
		smallgameslist: 'SmallGame',
		trxwigolist: 'TrxHash',
		wlist: 'WinGo'
	}
	const getImages = (value: string = '') => {
		if (!value) return
		const name = map[value]
		if (name) return name
		return value
	}



	return {
		getWinner,
		startTimer,
		destroyTimer,
		desensitizeString,
		getImages,
		penarikanlist,
		wrapperRef,
		winnerList,
		source,
		topList
	}
}
