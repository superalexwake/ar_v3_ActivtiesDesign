import type { Result } from './axios-types'

//这个暂时没被使用
// export interface ActivityListData extends Result {
// 	data: {
// 		activitylist: []
// 		pageno: number
// 		totalpage: number
// 	}
// }

export interface DailySignInData extends Result {
	data: {
		signInlist: [
			{
				amount: number
				bouns: number
				day: number
				isReceive: number
				issuccessfully: number
				rechargesID: number
			}
		]
		signModel: {
			isCycle: number
			signCount: number
			signInSum: number
		}
	}
}

export namespace Login {
	/**
	 * @用户登录
	 * @username 用户名
	 * @pwd      密码
	 * @phonetype 手机类型 66/86
	 */
	export interface ReqLoginForm {
		username: string
		pwd: string
		phonetype: number
	}

	export interface ResLogin {
		token: string
	}

	export interface Expired {
		uid: number
		keycode: number
		sign: string
	}
}
