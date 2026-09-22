import http from '../axios'
import type { AxiosResponse } from 'axios';
import { IResponse } from '../types';

export function upLoaderImg (file: any,signedUrl:string) {	//file为 你读取成功的回调文件信息
	//new 一个FormData格式的参数
	let config = {
        headers: { //添加请求头
			'Content-Type': file.file.type
        }
	}
	return new Promise((resolve, reject) => {
		http.put(signedUrl,file.file,config).then(res => {
	        if (res ) {
				resolve(res)
			} 

        }).catch(err => {
			reject(err)
		});
	})
}
/**
 * 登录
 */
export function PutImage(data: { objectName: string;contentType:string }) {
    return http.post<AxiosResponse,IResponse>('/ar-wallet/v4/apiCenter/generateFileUrl',data)
}


