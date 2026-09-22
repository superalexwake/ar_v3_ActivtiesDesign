import {useEventBus} from "@vueuse/core";
import {isHybridApp, isAnalysisHybridApp, openAnalysisHybrid, openHybrid,} from '@/utils/jsBridge'
type  TriggerEvent='login'|'register'|'purchase'|'first_purchase'|'recharge';
// 自定义事件
const mapEvent:any={
	login:'Login',
	register:'Register',
	purchase:'Purchase',
	first_purchase:'FirstPurchase',
	recharge:"Recharge"
}
// fb标准事件
const fbEvent:any={
	login:'FbLogin',
	register:'CompleteRegistration',
	recharge:'AddToCart',
	first_purchase:'AddToCart',
	purchase:'Purchase'
}
const redditEvent:any={
	login:'Lead',
	register:'SignUp',
	recharge:'AddToCart',
	first_purchase:'AddToCart',
	purchase:'Purchase'
}

const tikTokEvent:any={
	register:'CompleteRegistration',
	purchase:'Purchase',
	recharge:'AddToCart',
}


const bus = useEventBus<TriggerEvent,any>('gtag');

const isGoogle= ()=>{
	return 'dataLayer' in window
}
const isFacebook=()=>{
	return 'fbq' in window;
}
// Reddit pixel
const isReddit=()=>{
	return 'rdt' in window;
}

// TikTok pixel
const isTikTok=()=>{
	return 'ttq' in window;
}

const banfbSelf = Boolean(import.meta.env.VITE_BAN_FBSELF === '1');
bus.on((event, payload)=>{
	if (isGoogle()){
		window.gtag('event', event, payload);
	}
	if (isFacebook()){
		if(!banfbSelf)window.fbq('trackCustom', mapEvent[event], payload);
		window.fbq('track', fbEvent[event], payload);
	};
	if (isReddit()){
		window.rdt('track', redditEvent[event]);
	}
	if(isTikTok()){
		window.ttq.track(tikTokEvent[event], payload);
	}
	try {
		if(isAnalysisHybridApp()){
			openAnalysisHybrid(event,payload);
		}else {
			if(isHybridApp()) openHybrid(event,payload)
		}
		if (!window.android || !window.android.onEvent) return;
		if (payload){
			window.android.onEvent(event,JSON.stringify(payload))
		}else {
			window.android.onEvent(event)
		}
	}catch (e) {
		console.log(e,'error')
	}

	console.log(event)
})
export function useTrigger() {
	/**
	 * 触发登录事件
	 * @param data {any}
	 */
	const onTriggerLogin=(data:any)=>{
		console.log('onTriggerLogin', data)
		bus.emit('login',{content_name:data})
	}
	/**
	 * 触发注册事件
	 * @param data {any}
	 */
	const onTriggerRegister=(data:any)=>{
		console.log('register', data);
		bus.emit('register',{content_name:data})
	}
	/**
	 * 触发充值事件
	 * @param data {any}
	 */
	const onTriggerRecharege=(data:any)=>{
		bus.emit('recharge',{
			currency:import.meta.env.VITE_BASE_DOLLARSIGN||'',
			value:data.amount||0,
			content_name: (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).userId : '') || ''
		})
	}
	/**
	 * 触发购买事件
	 * @param data {any}
	 * @param isFirst {boolean}
	 */
	const onTriggerPurchase=(data:any,isFirst:boolean)=>{
		bus.emit(isFirst?'first_purchase':'purchase',{
			currency:import.meta.env.VITE_BASE_DOLLARSIGN||'',
			value:0,
			content_name: (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).userId : '') || ''
		})
	}
	/**
	 * 触发谷歌统计事件
	 * @param event {string}
	 * @param payload {Record<any, any>}
	 */
	const onTriggerGoogle=(event:string, payload?:Record<any, any>)=>{
		if (isGoogle()){
			if (payload) {
				window.gtag('event', event, payload);
			}else {
				window.gtag('event', event);
			}

		}
	}
	return {
		onTriggerLogin,
		onTriggerRegister,
		onTriggerPurchase,
		onTriggerRecharege,
		onTriggerGoogle,
	}
}
