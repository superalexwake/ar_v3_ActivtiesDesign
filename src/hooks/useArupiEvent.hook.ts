import {getArBruiedPage} from "@/api";
import {useRoute} from "vue-router";
export function useArupiEvent() {
	const route = useRoute();
	const sendRequest = async (params: any) => {
		const data:any=await getArBruiedPage(params);
		if (data.code === 200) {

		}
	}
	 const pageView = async (page:'recharge'|'order',payTypeId=26001) => {
		 const _payTypeId = route.query.payTypeId;
		 const data={
				"buriedPageType":page==='recharge'?1:2,
				"eventType":1,
				"clickType":0,
				payTypeId,
			}
		 if (_payTypeId){
			 data.payTypeId=Number(_payTypeId);
		 }
			await sendRequest(data);
	 };
	const pageLeve = async (page:'recharge'|'order',payTypeId=26001) => {
		const _payTypeId = route.query.payTypeId;
		const data={
			"buriedPageType":page==='recharge'?1:2,
			"eventType":3,
			"clickType":0,
			payTypeId,
		};
		if (_payTypeId){
			data.payTypeId=Number(_payTypeId);
		}
		await sendRequest(data);
	};
	const pageClick = async (clickType:number) => {
		const payTypeId = route.query.payTypeId;
		const data={
			"buriedPageType":2,
			"eventType":2,
			clickType,
			payTypeId:payTypeId?Number(payTypeId):26001,
		}
		await sendRequest(data);
	};
    return {
		pageView,
		pageLeve,
		pageClick,
	}
}