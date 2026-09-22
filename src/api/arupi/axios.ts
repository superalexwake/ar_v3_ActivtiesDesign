import axios, { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import i18n from '@/languages'
import { showFailToast , showSuccessToast } from 'vant';
import { useStorage } from '@/hooks'
import { arbApiLine } from './line'
const { localStore } = useStorage();
// baseURL 不再写死,改由请求拦截器动态注入(arbApiLine 测速选中值 → 兜底 VITE_BAST_URL)
const axiosInstance: AxiosInstance = axios.create({
	timeout: 30000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		config.baseURL = arbApiLine.active
		const requestQuery = config.data;
		if (requestQuery) {
			Object.keys(requestQuery).forEach((key) => {
				if (requestQuery[key] === '') {
					delete requestQuery[key]
				}
			})
		}
		if (config.method === 'post') {
			config.data = {
				...config.data,
				token: localStore.get('ar_p_t'),
			}
		}
		if (config.method === 'get'){
			config.params = {
				...config.params,
				 token: localStore.get('ar_p_t')||'',
			};
			//config.url=`${config.url}?${new URLSearchParams(config.params).toString()}`
		}
		return config;
	},
	(error: any) => {
		// 处理请求错误
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		const t = i18n.global.t
		const { data ,config, status } = response;
		if(config.method === 'put'&& status ===200){
			showSuccessToast(t('UploadSuccessful'));
			return true;
		}

		return data
	},
	async (error: any) => {
		const t = i18n.global.t
		const config = error?.config
		// 仅“未收到任何响应”(连接超时/网络断/DNS 失败——请求未到达服务器)才切地址重试,
		// 避免对已响应的非幂等 POST(提交UTR/确认支付)重复提交。候选耗尽则报错。
		if (config && !error.response && arbApiLine.rotate()) {
			config.baseURL = arbApiLine.active
			return axiosInstance(config)
		}
		showFailToast(t('pServer'))
		return Promise.reject(error);
	},
);

export default axiosInstance;
