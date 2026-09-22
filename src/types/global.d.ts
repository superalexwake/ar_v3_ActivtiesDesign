import type { AxiosResponse } from 'axios'

// * global
declare global {
	interface Navigator {
		browserLanguage: string
		/** iOS Safari 私有 API：当前页面是否运行在主屏添加的独立模式下。 */
		standalone?: boolean
	}

	interface Window {
		MSStream: boolean
		gtag:any
		fbq:any
		webkit:any
		external:any
		CONFIG:any
	}

	/**
	 * Chromium 的 PWA 安装提示事件。
	 * https://web.dev/customize-install/
	 */
	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[]
		readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
		prompt(): Promise<void>
	}

	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent
	}

	interface PageQuery {
		pageSize: number
		pageNo: number
		[key: string]: any
	}
	interface IRes {
		data: any
		code: number
		msg: string
		msgCode: number
	}
	interface ListRes<T> extends IRes {
		data: {
			list: T[]
			pageNo: number
			totalCount: number
			totalPage: number
		}
	}
	interface ObjRes<T> extends IRes {
		data: T
	}
	/**
	 * @返回分页参数
	 * @pageSize 每页数据量大小
	 * @pageNo 当前页
	 * @totalCount 总条数
	 */
	interface MessageData<T> {
		list: Array<T>
		pageNo: number
		totalPage: number
		totalCount: number
	}

	interface CommonRes<T> extends AxiosResponse<ListRes<T>> {}
	interface CommonObjRes<T> extends AxiosResponse<ObjRes<T>> {}
	type ObjResNull<T> = ObjRes<T> | null
}

declare module '@vue/runtime-core' {
	export interface ComponentCustomProperties {
		$u: any
		$selArr: any
	}
}

export {}
