import {
    ContentType,
    VAxios,
    AxiosTransform,
    AxiosInstance,
    AxiosRequestConfig,
} from './';
import {STORAGE_TOKEN} from '@/saasLottery/hooks/constant'
import {signData,synchronizer} from '@/saasLottery/utils'
import {useStorage, useToast} from "@/saasLottery/hooks";
import router from '@/router'
import i18n from '@/languages'
const {localStore}=useStorage();
const toast=useToast()
const t=i18n.global.t;
const SAAS_API_URL= import.meta.env.VITE_SAAS_API_URL || '';
const SAAS_JSON_URL= import.meta.env.VITE_SAAS_JSON_URL ||'';
const onKickOut=(expired:boolean)=>{
    localStore.remove(STORAGE_TOKEN);
	//localStorage.removeItem('lotteryLoginUrl')
    toast.error({
        //@ts-ignore
        message:`${expired?t('common.tokenExpired'):t('common.token')}`,
		onClose(){

		}
    });
	router.push({
		path:'/'
	})

}
const transform: AxiosTransform = {
    transformRequestHook: (res, options) => {
        const { isTransformResponse, isReturnNativeResponse } = options

        const method = res.config.method?.toLowerCase()
        if (res.status === 204 && ['put', 'patch', 'delete'].includes(method || '')) {
            return res
        }

        if (isReturnNativeResponse) {
            return res
        }
        if (!isTransformResponse) {
            return res.data
        }
        const { data } = res
        if (!data) {
            throw new Error('请求接口错误')
        }
        const { code } = data
        const hasSuccess = data && code === 0
        if (hasSuccess) {
            return data.data
        }
        throw new Error(`请求接口错误, 错误码: ${code}`)
    },
    requestInterceptors:(config,_options)=>{
        if (config.url?.endsWith('.json')) {
			config.baseURL = localStore.get('ar_api_json')||SAAS_JSON_URL;
			config.url=config.url+'?ts='+Date.now();
			return config
		}
		config.baseURL = `${localStore.get('ar_api')||SAAS_API_URL}/api`;
		const lang = localStorage.getItem('language')|| 'en';
		const mapLang:any = {
			hd:'hi',
			md:'my',
			bra:'pt',
			my:'ms',
			pk:'ur',
			ph:'tl',
			bdt:'bn',
			bd:"bn",
		};
		const language = mapLang[lang]||lang||'en';
        if (config.method==='get') {
            config.params=signData(Object.assign(config.params||{},{language}));
        }else {
            signData(Object.assign(config.data||{},{language}));
        }
        return config;
    },
    // 请求前处理配置
    beforeRequestHook: (config, _options) => {
        const { apiUrl } = _options;
		//@ts-ignore
		_options.ts=Date.now();
        config.url = `${apiUrl||config.baseURL||''}${config.url}`;
        if (!config.headers){
            config.headers={};
        }
        if(!config.url?.includes('.json')){
            config.headers.Authorization= `Bearer ${localStore.get(STORAGE_TOKEN)}`
        }
        return config
    },

    // 响应拦截器处理
    responseInterceptors: (res) => {
        const {data,headers,config}=res;
		const {requestOptions}=config as any;
		const time=Date.now()-(requestOptions?.ts||0);
        const token=headers['authorization']||'';
        const status=data.code||res.status;
		if (data.serviceTime&&!config.url?.includes('.json')){
			synchronizer.syncTime(data.serviceTime+(time/2));
		}
        if ([401].includes(status)) {
            onKickOut(headers.hasOwnProperty('token-expired'))
        };
        if (token&&![401].includes(data.code||res.status)) {
            localStore.set(STORAGE_TOKEN,token.replace('Bearer ',''));
        };
        if ([0].includes(data.code)){
            res.data.result=true;
        }else {
            if (res.data) res.data.result=false;
            const msgcode=res.data.msgCode;
            if (msgcode&&![401].includes(status)){
                toast.error(`${res.data.msgCode} ${t(`common.code_${res.data.msgCode}`)}`)
            }

        }
        return res
    },
    // 响应错误处理
    responseInterceptorsCatch: async (error: any, instance: AxiosInstance) => {
        const { config ,response={},} = error;
        const {headers={}}=response;
		console.log("error>>",error)

        if ([401].includes(response.data?.code||response.status)) {
            onKickOut(headers.hasOwnProperty('token-expired'))
        };
        if (!config || !config.requestOptions.retry) return Promise.reject(error)
        config.retryCount = config.retryCount || 0

        if (config.retryCount >= config.requestOptions.retry.count) return Promise.reject(error)

        config.retryCount += 1

        const backoff = new Promise((resolve) => {
            setTimeout(() => {
                resolve(config)
            }, config.requestOptions.retry.delay || 1)
        })
        config.headers = { ...config.headers, 'Content-Type': ContentType.Json }
        return backoff.then((config) => instance.request(config as AxiosRequestConfig))
    },
}
export const request = new VAxios(
    {
            authenticationScheme:"Bearer",
            baseURL: '/api',
            // 超时
            timeout: 10 * 1000,
            // 携带Cookie
            withCredentials: false,
            // 头信息
            headers: {
                'Content-Type': ContentType.Json,
            },
            // 数据处理方式
            transform
        }
)

export const jsonRequest = new VAxios(
    {
        authenticationScheme:"Bearer",
        //baseURL: import.meta.env.VITE_SAAS_JSON_URL || '',
        // 超时
        timeout: 10 * 1000,
        // 携带Cookie
        withCredentials: false,
        // 头信息
        headers: {
            'Content-Type': ContentType.Json,
        },
        // 数据处理方式
        transform,
        requestOptions:{
            retry:false
        }
    }
)