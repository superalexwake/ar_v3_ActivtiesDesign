/**
 * @充值记录查询参数
 * @startDate 开始日期
 * @endDate 结束日期
 * @state 充值状态-1 查所有
 */
export type ReqchargeRecord = {
	startDate?: string
	endDate?: string
	state?: number
	type?: number
}

/**
 * @充值记录查询参数
 * @startDate 开始日期
 * @endDate 结束日期
 * @state 充值状态-1 查所有
 * @type 充值状态-1 查所有
 * @category 状态
 */
export type C2CReqchargeRecord = {
	startDate?: string
	endDate?: string
	state?: number
	type?: number
	payId?: number
	payTypeId?: number
	category?: number
}

/**
 * @充值记录查询返回列表
 * @rechargeNumber 编号
 * @addTime 订单生成时间
 * @type 类型
 * @price 金额
 * @state 状态
 * @uRate 兑换比例
 * @uGold 兑换金额
 */
export interface chargeRecordList {
	rechargeNumber: string
	addTime: string
	type: number
	price: number
	state: number
	uRate: number
	uGold: number
	payID: number
	payName: string
	groupID?: number
	workOrderIds?: string // 关联工单Id列表，逗号分隔；空串=无工单
	serviceFee?: number // 手续费
	actualAmount?: number // 付款上分金额（You get）
	serviceFeeRate?: number // 手续费率
	orderAmount?: number // 订单金额（You pay）
	paidAmount?: number // 实付金额
	channelBonusAmount?: number // 通道奖励金额
	rechargeLevelBonusAmount?: number // 充值等级奖励金额
	quickBonusAmount?: number // 快捷金额奖励
	vipBonusAmount?: number // vip奖励金额
	firstRechargeBonusAmount?: number // 首充奖励金额（暂不展示）
	orderTotalActualAmount?: number // 订单实际总上分金额，付款上分+充值奖励+充值等级+vip等级+返利券
}

export interface C2CRechargeRecord {
	id: number
	orderNo: string
	category: number
	withdrawOrderId: number
	withdrawOrderNo: string
	transactionNo: string
	userId: number
	sellerAccountNo: string
	orderAmount: number
	finalAmount: number
	discountAmount: number
	discountRate: number
	state: number
	stateName: string
	remark: string
	cancelReason: string
	createTime: string
	confrimBeginTime: string
	appealBeginTime: string
	finishTime: string
	lastUpdateTime: string
	serviceTime: string
	startTime: string
	endTime: string
	intervalM: number
}

//充值记录查询返回列表
// export interface ReschargeRListRes {
// 	pageNo: number
// 	list: Array<chargeRecordList>
// 	totalPage: number
// 	totalCount: number
// }

/**
 * @提现记录查询参数
 * @startDate 开始日期
 * @endDate 结束日期
 * @state 订单状态-1 查所有
 * @type 提现类型-1 查所有
 */
export type ReqdWithdrawLog = {
	startDate?: string
	endDate?: string
	state?: number
	type?: number
	category?: number
}

/**
 * @提现记录查询返回列表
 * @withdrawID 订单id
 * @type 提现类型
 * @withdrawNumber 订单号
 * @withdrawName 类型名称
 * @price 金额
 * @addTime 生成时间
 * @realityAmount 真实金额
 * @remark 备注
 * @state 状态 0待审核 1通过 2未通过 3第三方审核结果
 * @uRate 兑换比例
 * @uGold 兑换金额
 * @tranRefId UTR 交易参考号，仅出款成功后才有值
 */
export interface withdrawLogList {
	withdrawID: number
	type: number
	withdrawNumber: string
	withdrawName: string
	price: number
	addTime: string
	realityAmount: number
	remark: string
	state: number
	uRate: number
	uGold: number
	tranRefId?: string
	needKycConnect?: boolean
	upiAccountInfo?: Record<string, unknown>
	expireTimestamp?: number | string
	serverTime?: number | string
}

//提现记录查询返回列表
// export interface ResdWithdrawLogListRes {
// 	pageNo: number
// 	totalPage: number
// 	totalCount: number
// 	list: Array<withdrawLogList>
// }

/**
 * @交易记录查询参数
 * @type 类型
 * @date 日期
 */
export type ReqTransactions = {
	type?: number
	date?: string
}

/**
 * @交易记录查询返回列表
 * @amount 金额
 * @type 类型(界面上明细)
 * @typeName 类型名字
 * @orderNum 订单号
 * @addTime 添加时间
 * @remark 交易备注
 */
export interface transactionsList {
	amount: number
	type: number
	typeName: string
	orderNum: string
	addTime: string
	remark: string
	typeColor: string
}

//交易记录查询返回列表
// export interface ResTransactions {
// 	pageNo: number
// 	totalPage: number
// 	totalCount: number
// 	list: Array<transactionsList>
// }

/**
 * @获取银行列表的参数
 * @withdrawid 提款方式
 */
export type ReqBankList = {
	withdrawid: number
}

/**
 * @获取银行返回列表
 * @bankID 银行ID
 * @bankName 名称
 * @reserved 银行类型
 */
export type ResBankList = {
	bankID: number
	bankLogo: string
	bankName: string
	reserved: number
	ifscCode: string
}

/**
 * @获取提现类别返回列表
 * @withdrawID 提现类型id
 * @name 类型名称
 * @isAdd 0可以 1不可以
 */
export interface ResWithdrawlist {
	withdrawID: number
	name: string
	isAdd: number
	withAfterImgUrl: string
	withBeforeImgUrl: string
}

/**
 * @获取交易类型返回列表
 * @type 类型id
 * @typeName 类型名称
 */
export interface ResTransactionsTypes {
	type: number
	typeName: string
}

/**
 * @获取对应提现方式下的所有银行信息查询参数
 * @withdrawid 提现方式id
 */
export interface ReqWithdrawals {
	withdrawid: number
}

/**
 * @该提现方式下的银行卡列表
 * @accountNo 银行卡号
 * @bankAddress 分行地址
 * @bankCity 银行城市
 * @bankName 银行名称
 * @bankAlias 银行/主网络展示别名，后端可能不返回，缺失时回退 bankName
 * @bankProvince 银行省份
 * @beneficiaryName 收款人姓名
 * @bid 银行信息id
 * @ifsCode 不详
 * @mobileNo 手机号
 * @withType 提款方式
 */
export interface withdrawalslist {
	// [x: string]: ?number
	accountNo: string
	bankAddress: string
	bankCity: stirng
	bankName: string
	bankAlias?: string
	bankProvince: string
	beneficiaryName: string
	bid: number
	ifsCode: string
	mobileNo: string
	withType: number
	usdtRemarkName: string
}

/**
 * @该提现方式下的提款规则
 * @amountofCode  打码量金额
 * @withdrawRemainingCount 每日剩余提现次数
 * @startTime 开始时间
 * @endTime 结束时间
 * @fee 费率
 * @minPrice 单次最小提现额
 * @maxPrice 单次最大提现额
 * @amount 可用余额
 * @uRate 兑换比例
 * @uGold 兑换金额
 * @canWithdrawAmount 可提现金额
 * @withMinPrice 最小费率金额
 * @withMaxPrice 最大费率金额
 */
export interface withdrawalsruleList {
	amountofCode: number
	withdrawRemainingCount: number
	startTime: string
	endTime: string
	fee: number
	minPrice: number
	maxPrice: number
	amount: number
	uRate: number
	uGold: number
	canWithdrawAmount: number
	c2cUnitAmount?: number
	withMaxPrice: number
	withMinPrice: number
	arbWithdrawRecommand: Record<string, any>
}
/**
 * @获取对应提现方式下的所有银行信息返回数据
 * @withdrawalslist 该提现方式下的银行列表
 * @withdrawalsrule 该提现方式下的提款规则
 */
export interface ResWithdrawals {
	withdrawalslist: Array<withdrawalslist>
	withdrawalsrule: withdrawalsruleList
}

/**
 * @提现参数
 * @amount 金额
 * @pwd 密码
 * @type 提现方式大类
 * @bid 银行id
 */
export interface ReqNewSetWithdrawal {
	amount: number
	pwd: string
	type: number
	bid: number
	name?: string
	tip: string
}

/**
 * @添加银行卡的参数
 * @smsCode 验证码
 * @ifsccode 不详
 * @bankid 银行id
 * @beneficiaryname 收款人姓名
 * @accountno 银行账号
 * @email 邮箱
 * @mobileno 手机号
 * @bankcitycode 开户行城市
 * @bankprovincecode 开户行省份
 * @bankbranchaddress 开户行地址
 */
export interface ReqWithdrawalBankCard {
	smsCode: string
	ifsccode: string
	bankid: number
	beneficiaryname: string
	accountno: string
	email: string
	mobileno: string
	bankcitycode: string
	bankprovincecode: string
	bankbranchaddress: string
	type: string
	codeType: number
}

/**
 * @删除银行卡参数
 * @bid 银行卡id
 * @withdrawid 提款方式
 */
export interface ReqDeleteBankCard {
	bid: number
	withdrawid: number
}

/**
 * @添加usdt地址
 * @withdrawid 提款方式大类
 * @bankid 主网络id
 * @usdtaddress 地址
 * @smsCode 短信验证码
 * @usdtRemarkName 地址别称
 */
export interface ReqSetWithdrawalUsdt {
	withdrawid: number
	bankid: number
	usdtaddress: string
	smsCode: ''
	usdtRemarkName: string
	type: string
	codeType: number
}

/**
 * @description: 充值类型列表
 * @typelist 充值类型列表
 */
export interface PayTypeName {
	typelist: Array<PayTypeNameData>
}

/**
 * @description: 充值类型数据
 * @payID 充值类型id
 * @payName 充值名称
 * @minPrice 最小充值金额
 * @maxPrice 最大充值金额
 * @scope 充值范围
 * @typeName 类型名称
 */
export interface PayTypeNameData {
	payNameUrl2: string
	payNameUrl: string
	payID: number
	payTypeID: number
	payName: string
	minPrice: number
	maxPrice: number
	scope: string
	typeName: string
	paySysName: string
	maxRechargeRifts?: number
	payNameUrl: string
	payNameUrl2: string
	maxRechargeRifts: number
}

/**
 * @description: 充值渠道数据
 * @rechargetypelist 渠道列表
 * @banklist 银行列表
 */
export interface RechargeTypesData {
	rechargetypelist: Rechargetypelist[]
	banklist: Banklist[]
	localUsdtlist: RechargeLocalUsdtInfo[]
	thirdPayBankList: ThirdPayBankList[]
}

export interface ThirdPayBankList {
	bankID: number
	bankName: string
	bankCode: string
	sort: number
	payTypeName: string
	type: number
}

export interface Banklist {
	bankLogo: string
	bankName: string
	accountName: string
	bankAccountNumber: string
	sort: number
	transferType: number
}

/**
 * @description: 充值类型列表
 * @payTypeID 充值类型id
 * @payID 充值id
 * @payName 充值名称
 * @miniPrice 最小充值金额
 * @maxPrice 最大充值金额
 * @scope 充值范围
 * @paySendUrl 充值发送url
 * @parameters 参数
 * @startTime 开始时间
 * @endTime 结束时间
 * @rechargeRifts 充值间隔
 */
export interface Rechargetypelist {
	delayedRewardDays: number
	paySysName: string
	payTypeID: number
	payID: number
	payName: string
	miniPrice: number
	maxPrice: number
	scope: string
	paySendUrl: string
	parameters: string
	startTime: string
	endTime: string
	rechargeRifts: number
	c2cUnitAmount: number
	quickConfigList: arry
	serviceFeeRate?: number // 手续费率
	newRechargeRiftRate?: number // 渠道优惠费率
	// 充值等级赠送：按 giftRatio 比例赠送，封顶 maxBonusAmount
	userRechargeLevelGift?: {
		userLevel: number
		giftRatio: number
		maxBonusAmount: number
	} | null
}

/**
 * @description: 银行订单查询参数
 * @bankType 银行类型
 * @bankName 银行名称
 * @accountName 账户名称
 * @bankAccountNumber 银行账号
 * @amount 金额
 */
export interface BankOrderQuery {
	bankType: number
	bankName?: string
	accountName?: string
	bankAccountNumber?: string
	amount: number
	transferType: number
}

/**
 * @description: 新增充值银行订单返回数据
 * @orderNumber 订单号
 * @bankName 银行名称
 * @accountName 账户名称
 * @bankAccountNumber 银行账号
 * @addTime 添加时间
 * @addTime1 添加时间1
 * @copyBankAccountNumber 复制银行账号
 * @serverTime 服务器时间
 * @ifscCode IFSC代码
 * @bankPhone 银行电话
 * @refNo 参考号
 * @amount 金额
 * @copyAmount 复制金额
 */
export interface NewSetRechargesBankOrderData {
	orderNumber: string
	bankName: string
	accountName: string
	bankAccountNumber: string
	addTime: string
	addTime1: string
	copyBankAccountNumber: string
	serverTime: string
	ifscCode: string
	bankPhone: string
	refNo: string
	amount: string
	copyAmount: string
	extend1: string
	extend2: string
	bankCardQRCodeUrl?: string
}

/**
 * @description: 更新充值银行订单查询参数
 * @type 类型
 * @orderNo 订单号
 * @tranrefId 交易参考ID
 */
export interface UpRechargesBankOrderQuery {
	type?: number
	orderNo: string
	tranrefId?: string
	isBankQRCodeOrder?: boolean
}

/**
 * @获取主钱包返回数据
 * @money 可提现金额
 * @totalAmount 总提现金额
 * @uRate 兑换比例
 * @uGold 兑换金额
 * @todayAmount 今日提现金额
 */
export interface resWallet {
	money: string
	totalAmount: string
	uRate: number
	uGold: number
	todayAmount: string
}

/**
 * @一键回收钱包返回数据
 * @amount 可用余额
 * @uRate 兑换比例
 * @uGold 兑换金额
 */
export interface resUserAmount {
	amount: number
	uRate: number
	uGold: number
}

export interface C2CRechargeCancel {
	orderId: number
	cancelReason: string
}

export interface CreateC2CRechargeQuery {
	category: number
	orderAmount: number
}

export interface CreateC2CRechargeData {
	state: number
	suggessList: SuggessList[]
	sellerInfo: SellerInfo
	rechargeChannelInfo?: RechargeChannelInfo
	remainingLimitTime: number
	errorCount: number
}

export interface SellerInfo {
	id: number
	orderNo: string
	sellerAccountNo: string
	orderAmount: number
	finalAmount: number
	discountAmount: number
	state: number
	stateName: string
	createTime: string
	confrimBeginTime: string
	appealBeginTime: string
	serviceTime: string
	startTime: string
	endTime: string
	transactionNo: string
	sellerAccountNo: string
	cancelReason: string
	intervalM: number
	ossUrls: string
	withdrawOssUrls: string
	lastUpdateTime: sting
	isAppealCompleted: boolean
	stateChangeList: {
		beforeChangeState: number
		backChangeState: number
		stateChangeTime: string
	}
}

export interface SuggessList {
	id: number
	amount: number
	c2CRechargeRewardRate: number
	c2CRechargeAwardAmount: number
}

export interface reqSetWithdrawalUPI {
	beneficiaryName: string
	accountNo: string
	relationId: number
	smsCode: number
	type: string
}

export interface resGetC2CWithdrawOrderDetail {
	id: number
	orderNo: string
	type: number
	withdrawName: string
	createTime: string
	orderAmount: number
	realAmount: number
	discountAmount: number
	serviceAmount: number
	state: number
	cancelReasonId: number
	reasonText: string
	remark: string
	transactionNo: string
	sellerAccountNo: string
	rechargeFinishTime: string
}

export interface RechargeChannelInfo {
	payTypeID: number
	payID: number
	payName: string
	payNameCustom: null
	miniPrice: number
	maxPrice: number
	scope: string
	paySendUrl: string
	parameters: string
	startTime: string
	endTime: string
	rechargeRifts: number
	c2cUnitAmount: number
	paySysName: string
}

export interface RechargeLocalUsdtInfo {
	usdtID: number
	usdtName: string
	usdtType: number
	state: number
	scot: number
	addTime: Date
	upTime: Date
	ratioBet: number
	coding: string
}

export interface RechargeUsdtReq {
	usdtId: number
	usdtType: number
	amount: number
	rechargeAddress: string
	transferOutAddress: string
	userRechargeCouponId?: number // 带券下单：选中券实例ID，仅 >0 时传(绝不传0)
}

export interface UsdtOrderInfo {
	usdtType: number
	orderNumber: string
	bankName: string
	rechargeAddress: string
	addTime: string
	addTime1: string
	serverTime: string
	amount: string
	transferOutAddress: string
	usdtId: number
}

export interface UpiOrderInfo {
	orderNumber: string
	upiAccount: string
	addTime: string
	addTime1: string
	serverTime: string
	amount: string
	transferUTR: string
}

export interface CreateUpiOrderRep {
	orderNumber: string
	upiAccount: string
	addTime: string
	addTime1: string
	serverTime: string
	amount: string
	payID: number
}

//ResUserRealName
/**
 * @获取实名信息
 * @idCard 身份证，CPF
 * @realName 姓名
 */
export interface ResUserRealName {
	idCard: string
	realName: string
}

/**
 * @添加pix
 * @bankId 银行id
 * @accountNo 钱包地址
 * @name 姓名
 * @cpf Cpf
 * @smsCode 短信验证码
 */
export interface ReqSetWithdrawalCpf {
	bankId: number
	accountNo: string
	name: string
	cpf: string
	smsCode: string
	type: string
	codeType: number
	pixType: string
}

export interface UpdateUsdtOrderInfo {
	usdtId: number
	usdtType: number
	rechargeAddress: string
	transferOutAddress: string
	amount: number
	orderNo: string
}

export interface ActiveARwallet {
	merchantCode: string
	memberId: number
	walletActivationPageUrl: string
	timestamp: string
}
export interface EnterARwallet {
	merchantCode: string
	memberId: number
	walletAccessUrl: string
	timestamp: string
}
export interface ThirdPayInfo {
	payTypeId: number
	amount: number
	urlInfo?: string
	pixelId: string
	fbcId: string
	vendorId: number
	fbp: string
	fbc: string
	returnUrl?: string
	bankCode?: string
	adId?: string
	userRechargeCouponId?: number // 选中券实例ID(带券下单)。仅 >0 时传；绝不传0——前端签名不跳零值/后端SortJson跳零值,传0会验签失败
}

export interface QrcodeBankInfo {
	payTypeId: number
	amount: number
	bankName: string
	accountName?: string
	bankAccountNumber?: string
	urlInfo?: string
	pixelId?: string
	fbcId?: string
	vendorId?: number
	returnUrl?: string
	userRechargeCouponId?: number // 带券下单：选中券实例ID，仅 >0 时传(绝不传0)
}
