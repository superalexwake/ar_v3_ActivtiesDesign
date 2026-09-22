import type { RemovableRef } from '@vueuse/core'

export interface GlobalState {
	token: RemovableRef<string>
	userInfo: UserInfo | RemovableRef<{}>
	language: string
	clientConfig: ClientConfig | RemovableRef<{}>
	requsetData: string | {}
	isOpen: boolean
	apiUrl: string
	visibility: number
	deferredPrompt: any
	dollarSign: string
	projectLogo: string
	headLogo: string
	areaCode: string | null
	messageList: any[] | null
	notifyTime:number|null
	isNotify:false
}

export interface ClientConfig {
	ApiUrl: string
	AreaCode: string
	DollarSign: string
	HeadLogo: string
	IsShops: number
	Languages: string
	PayUrl: string
	ProjectLogo: string
	ProjectName: string
	WebIco: string
}

// {
//     "sign": "7B8315310A0BF66515C7124614890B98E18B39F6ED30B8C70AF7946DDAE6AC47",
//     "userId": 90270,
//     "userPhoto": "https://api.lightspacecdn.com/img/avatar.cfa8dd9d.svg",
//     "userName": "1234567893",
//     "nickName": "richar-test",
//     "amount": 0,
//     "amountofCode": 0,
//     "isWithdraw": null,
//     "isGoogle": "1",
//     "message": null,
//     "withdrawCount": 0,
//     "startTime": null,
//     "endTime": null,
//     "fee": 0,
//     "unRead": 0,
//     "facebookAppID": "",
//     "googleAppID": null,
//     "twitterAppID": null,
//     "keyCode": 2,
//     "uRate": 1.1,
//     "uGold": 0,
//     "isTaskState": "1",
//     "isvalidator": 0,
//     "isRePwd": "1",
//     "integral": 0,
//     "isShop": "1"
//   }
export interface UserInfo {
	sign: string // token
	userId: number
	userPhoto: string
	userName: string
	nickName: string
	amount: number //用户余额
	amountofCode: number //用户余额类型 $ ￥ usdt
	isWithdraw: number // 是否启用钱包
	isGoogle: string // 是否启用谷歌验证码
	message: string //
	withdrawCount: number //
	userLoginDate: string // 最后登录日期
	startTime: string //
	endTime: string //
	fee: number //
	unRead: number //未读数
	unUsedRechargeCouponCount: number //未使用的充值返利券张数
	facebookAppID: string
	googleAppID: string //
	twitterAppID: string //
	keyCode: number //
	uRate: number // 兑换比例
	trxRate: number // trxRate
	uGold: number // 兑换金额
	isTaskState: string // 是否邀请奖励
	isvalidator: number //
	isRePwd: string //是否充值密码
	integral: number //兑换积分
	isOpenPointMall: string // 积分商城开关
	isOpenWashCode: string //是否邀请奖励洗码量
	isOpenJackpotReward: string //是否超级大奖
	googleVerify: number //是否绑定谷歌验证码
	groupDataShowAuth: Array // 用户组权限
	isShowWalletTotalCT: string //前端钱包页面是否显示总充/提金额字段 0关 1开
	isShowRechargeBankList: string //是否开启银行卡充值列表
	isOpenOfficialRechargeInputDialog: string //是否开启官方充值弹窗
	regType: number //登陆方式
	verifyMethods: verifyMethods //邮箱信息
	bindReward: number //是否开启奖��
	isPopupCommissionSwitch:string //佣金弹窗
	isOpenChampion:string
	isOpenRechargeCoupon: string // 我的充值优惠券开关
	isAllowWithdraw:number //是否开启取款功能
	allowNoRechargeGame:string //是否容许未充值进入游戏
	userRechargeTimes:number //充值次数
	canDirectToGame: boolean // 是否能去游戏
	useLanguage: string // 用户选择的语言
}
interface verifyMethods {
	email: string //绑定的邮箱
	google: string //是否绑定邮箱 0否 1是
	mobile: string //绑定的手机号
}
// export interface UserInfo {
// 	Amount: number
// 	Integral: number
// 	Isvalidator: number
// 	KeyCode: number
// 	NickName: string
// 	Sign: string
// 	Token: string
// 	UserId: number
// 	UserName: string
// 	UserPhoto: string
// }
