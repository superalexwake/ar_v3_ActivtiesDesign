export default {
	// 首页
	GetHomeWebSite: '/GetAppDownloadUrl',
	GetAppDownloadConfigList: '/GetAppDownloadConfigList', // 获取隐私安装列表
	GetBannerList: '/GetBannerList',
	GetHotGameList: '/GetHotGameList',
	GetClicksTopGameList: '/GetClicksTopGameList',
	//GetThirdGameList等于原先的GetSlots; 视讯 = 小游戏
	GetThirdGameList: '/GetThirdGameList',
	GetThirdGameCategory: '/GetThirdGameCategory',
	GetSmallGameOrFishList: '/GetSmallGameOrFishList', // 获取捕鱼和小游戏的三方游戏大类
	GetGameCategoryList: '/GetGameCategoryList', // 获取游戏分类列表
	GetLotteryCategoryList: '/GetLotteryCategoryList', // 获取彩票分类列表
	GetHotLotteryList: '/GetHotLotteryList', // 热门彩票
	GetAllGameList: '/GetAllGameList', // 获取所有游戏列表
	GetGameUrl: '/GetGameUrl',
	GetMessageList: '/GetMessageList',
	SetOneMessageState: '/SetOneMessageState', //设置单个消息状态
	SetAllMessageState: '/SetAllMessageState', //设置所有信息状态
	GetHomeSettings: '/GetHomeSettings', //获取首页设置
	OneKeyMarkAllData: '/OneKeyMarkAllData', // 一键删除
	GetElectronWithChildGame: '/GetElectronWithChildGame', // 获取电子厂商及子游戏
	GetVideWithChildGame: '/GetVideWithChildGame', // 获取视频厂商及子游戏
	GetLotteryGameTypeList: '/GetLotteryGameTypeList', // 获取彩票游戏类型
	GetBalanceByARGame: '/GetBalanceByARGame', //获取钱包余额

	GetSelfCustomerServiceLink: '/GetSelfCustomerServiceLink', // 获取客服中心地址
	IsCanAppDownload: '/IsCanAppDownload', // 是否开启app下载
	GetDailyProfitRank: '/GetDailyProfitRank', // 中奖人信息
	GetSlotGamesList: '/GetSlotGamesList', // 游戏列表启用状态
	GetSiteMessageList: '/GetSiteMessageList', // 公告信息
	GetSiteMessage: '/GetSitePopMsgList', //首页公告-登录成功弹出
	GetMaintenanceInfo: '/GetMaintenanceInfo', // 查询维护信息
	GetAllowBetSetting: '/GetAllowBetSetting', // 允许未充值用户进行游戏
	NotifyARGameRecover: '/NotifyARGameRecover', // 通知下分
	Transfer: '/Transfer', //转账
	FBMsgSubscribe: '/UserFBMsgSubscribe', //FCM消息订阅
	// 保险箱
	GetSafeInfo: '/GetSafeInfo', // 获取保险箱中心信息 -ok
	GetWealthState: '/GetWealthState', // 是否开启保险箱功能 - ok
	GetSafeAmount: '/GetSafeAmount', // 获取保险箱金额
	SetSafeBack: '/SetSafeBack', // 保险箱转出
	GetSafeUserAmount: '/GetSafeUserAmount', // 保险箱获取用户余额
	SetSafeInto: '/SetSafeInto', // 保险箱转入
	GetSafeList: '/GetSafeList', // 获取保险箱列表-ok
	GetSafeLogList: '/GetSafeLogList', // 获取保险箱历史列表 -ok

	// activity
	GetActivityList: '/GetActivityList', // 获取活动列表
	GetActivityDetails: '/GetActivityDetails', //获取活动详情
	GetDailyTaskList: '/GetTaskList', //获取邀请人任务
	GetContinuousSignInRecharges: '/GetContinuousSignInRecharges', // 连续签到
	GetProductList: '/GetProductList',
	GetBannerTypeList: '/GetBannerTypeList',
	GetIntegralLogList: '/GetIntegralLogList',
	GetProductOrderList: '/GetProductOrderList',
	GetProductOrderDetails: '/GetProductOrderDetails',
	SetProductOrder: '/SetProductOrder',
	SetContinuousSinIn: '/SetContinuousSinIn', // 签到 连续在线签到
	GetContinuousSinInList: '/GetContinuousSinInList', // 签到记录
	CancelOrderData: '/CancelOrderData', // 取消订单
	GetUserAddress: '/GetUserAddress', // 获取用户地址
	UpdateUserAddress: '/UpdateUserAddress', // 更新用户地址
	GetProductRules: '/GetProductRules', // 获取积分规则信息
	GetPointMallState: '/GetPointMallState', //是否开放积分商城
	//积分抽奖
	GetPointsLotteryList: '/GetPointsLotteryList', // 积分抽奖列表
	GetPointsLotteryDetails: '/GetPointsLotteryDetails', // 积分抽奖详情
	GetPointsLotteryOrderList: '/GetPointsLotteryOrderList', // 我参与的积分抽奖
	GetPointLotteryUserAddress: '/GetPointLotteryUserAddress', // 积分抽奖收货地址
	AddPointsLotteryUserAddress: '/AddPointsLotteryUserAddress', // 添加积分抽奖收货地址
	UpdatePointLotteryUserAddress: '/UpdatePointLotteryUserAddress', // 更新积分抽奖收货地址
	SetDefaultPointsLotteryUserAddress: '/SetDefaultPointsLotteryUserAddress', // 更新积分抽奖默认收货地址
	DeletePointsLotteryUserAddress: '/DeletePointsLotteryUserAddress', // 删除积分抽奖默认收货地址
	ReceiveAllGrandAward: '/ReceiveAllGrandAward', //一键全部领取超级大奖
	JoinPointsLottery: '/JoinPointsLottery', //参与积分抽奖
	GetPrize: '/GetPrize', //领取积分抽奖

	ReceiveFirstRechargeReward: '/ReceiveFirstRechargeReward', // 领取首充弹窗
	GetFirstRechargeList: '/GetFirstRechargeList', // 获取首充奖励
	GetActiveSetting: '/GetActiveSetting', // 获取活动开关配置
	GetWeeklyAwardList: '/GetWeeklyAwardList', // 获取对应用户每周奖励任务列表
	ReceiveWeeklyAward: '/ReceiveWeeklyAward', // 领取符合条件的每周任务奖励
	GetWeeklyAwardRecordList: '/GetWeeklyAwardRecordList', // 获取对应用户每周奖励任务领取记录
	SaveUserGuidelines: '/SaveUserGuidelines', // 保存新手活动任务新手指引完成情况。
	SaveUserDayRequest: '/SaveUserDayRequest', // 保存每周活动奖励每日访问弹窗记录
	GetNewbieGiftPackage: '/GetNewbieGiftPackage', // 获取新手礼包
	ReceiveAward: '/ReceiveAward', //领取新手礼包
	GetDailyAwardCount: '/GetDailyAwardCount', //每日奖励未领取数量
	GetDailyAwardList: '/GetDailyAwardList', //每日任务列表
	ReceiveDailyAward: '/ReceiveDailyAward', //领取每日任务
	GetDailyAwardRecordList: '/GetDailyAwardRecordList', //每日任务领取记录
	GetPeriodCardInfo: '/GetPeriodCardInfo', //周卡月卡活动信息(配置+档位+我的持卡)
	BuyPeriodCard: '/BuyPeriodCard', //购买周卡月卡
	TakeDailyReward: '/TakeDailyReward', //领取周卡月卡的每日奖励
	GetMyPeriodCardRecords: '/GetMyPeriodCardRecords', //我的周卡月卡购买记录
	GetActivityCenterTabSort: '/GetActivityCenterTabSort', //活动中心 5 个 Tab 的后台排序
	GetTreasureChestPopupItems: '/GetTreasureChestPopupItems', //获取宝箱活动配置
	OpenTreasureChest: '/OpenTreasureChest', //获取宝箱活动ID

	// 推广
	NewPromotion: '/NewPromotion', // 推广首页
	PromotionMytem: '/PromotionMytem', // 我的推广邀请列表
	PromotionTutorial: '/PromotionTutorial', // 佣金规则
	// PromotionReceiveList: '/PromotionReceiveList', //佣金明细
	GetUrlAddress: '/GetUrlAddress', // 获取推广地址
	GetPromotionRecord: '/GetPromotionRecord', //我的邀请人记录(新增下级页面)
	GetAgentServiceList: '/GetAgentServiceList', // 专线客服
	GetTotalRebateRules: '/GetTotalRebateRules', //总返佣
	GetCommissionDetails: '/GetCommissionDetails', //获取用户佣金明细详情
	//我的团队
	GetTeamDayReport: '/TeamDayReport', // 我的团队报表
	GetPartnerRewards: '/GetPartnerRewards', // 合伙人奖励
	GetPartnerRewardsDeatilList: '/GetPartnerRewardsDeatilList', //合伙人奖励邀请记录
	// login 登录接口
	Login: '/Login',
	RefreshToken: '/RefreshToken',
	GetUserInfo: '/GetUserInfo', //获取用户信息
	SmsVerifyCode: '/SmsVerifyCode',
	Register: '/Register', // 注册
	RegisterState: '/RegisterState', //验证是否开放注册和短信注册
	LoginOff: '/LoginOff', // 登出
	ForgetPassword: '/ForgetPassword', // 忘记密码
	ResetPassword: '/ResetPassword', // 修改登录密码
	EditUserPhoto: '/EditUserPhoto', // 修改头像
	EditNickName: '/EditNickName', //修改昵称
	VerifyPhoneCode: '/VerifyPhoneCode', //验证手机验证码
	ResetPhoneNum: '/ResetPhoneNum', //更换手机号码
	captcha: '/Captcha', // 获取图片验证
	checkCaptcha: '/Validate', // 图片验证校验功能
	GetLoadedSetting: '/GetLoadedSetting', //弹窗开关
	GetOldReturnNewRechargeAwardInfo: '/GetOldReturnNewRechargeAwardInfo', //获取回归充值奖励信息
	ReceiveReturnAwards: '/ReceiveReturnAwards', //回归佣金领取
	ReceiveDownAppReward: '/ReceiveDownAppReward', //app下载奖励领取
	ReceiveRegisterGift: '/ReceiveRegisterGift', //注册彩金领取
	GetCurrentCoupon: '/GetCurrentCoupon', // 指定状态返利券列表(券包 Tab)
	GetCurrentUnReceivedCoupon: '/GetCurrentUnReceivedCoupon', // 未领取返利券(弹窗/角标)
	ReceiveCoupon: '/ReceiveCoupon', // 一键领取全部未领取返利券
	GetRechargeCategoryUsableCoupon: '/GetRechargeCategoryUsableCoupon', // 指定充值大类可用返利券
	GetInvitationNoAuthCouponByNumber: '/GetInvitationNoAuthCouponByNum', // 券码查券信息(注册落地页)
	GetProxyUserInvitationCoupon: '/GetProxyUserInvitationCoupon', // 代理可推广的邀请链接返利券
	GetUserMaxGiftRate: '/GetUserMaxGiftRate', // 用户最高可奖励比率(充值按钮营销气泡)
	// 我的
	ConversionRedpage: '/ConversionRedpage', // 兑换奖励
	GetRedpagePageList: '/GetRedpagePageList', // 兑换奖励记录
	GameStatis: '/GameStatis', // 游戏统计列表
	GetNewMyEmerdList: '/GetNewMyEmerdList', //获取历史投注结果
	GetTaskList: '/GetTaskList', // 邀请好友
	SetTaskOrder: '/SetTaskOrder', // 邀请好友
	GetCurrentActivityTasks: '/GetCurrentActivityTasks', // 获取当前任务活动详情
	GetCurrentActivityLevel1People: '/GetCurrentActivityLevel1People', //邀请记录
	GetGoogleVerify: '/GetGoogleVerify', // 获取谷歌验证码
	GetCustomerServiceTypelist: '/GetCustomerServiceTypelist', // 获取客服列表
	GetAgentServiceTypeList: '/GetAgentServiceTypeList', // 获取客服列表
	GetCustomerServiceList: '/GetCustomerServiceList', // 获取客服集合
	GetIsExistGrandPrizeReward: '/GetIsExistGrandAward', //首页大奖状态取值
	ThirdGameReceiveGrandPrizeReward: '/ReceiveGrandAward', //大奖状态改变
	GetThirdGameRewardsRecordPageList: '/GetGrandAwardPageList', // 大奖列表
	GetReWordConfigList: '/GetGrandAwardConfigList', //获取电子奖励配置
	GetThirdGameAwardRecordPageList: '/GetHomeGrandAwardPageList', //获取电子大奖，奖励记录列表
	bindEmail: '/BindEmail', //绑定邮箱
	VerifyEmailCode: '/VerifyEmailCode', //验证邮箱
	BindPhone: '/BindPhone', //绑定手机号
	EmailVerifyCode: '/EmailVerifyCode', //邮箱验证码
	BindGoogleVerify: '/BindGoogleVerify', //绑定谷歌验证码
	ResetGoogleVerify: '/ResetGoogleVerify', //重置谷歌验证码
	CloseGoogleVerify: '/CloseGoogleVerify', //关闭谷歌验证码
	RecoverBalance: '/RecoverBalance', //获取用户余额(回收余额)
	RecoverSaasBalance: '/RecoverSaasBalance', //获取用户余额(回收余额)
	GetCustomerServiceGroup: '/GetCustomerServiceGroup', //客服群入口

	// 关于
	GetProtocols: '/GetProtocols', //隐私政策
	GetAgreement: '/GetAgreement', //风险披露协议
	GetPlayingGuide: '/GetPlayingGuide', //新手指南
	SubmitSuggest: '/SubmitSuggest', //意见反馈

	//钱包
	GetBalance: '/GetBalance',
	GetAllwallets: '/GetAllwallets', //获取所有钱包
	GetSaasAllwallets: '/GetSaasAllwallets', //获取所有钱包
	GetARGameAndPlatWallets: '/GetARGameAndPlatWallets', //获取所有钱包
	GetUserAmount: '/GetUserAmount', //一键回收钱包
	GetRechargeRecord: '/GetRechargeRecord', //充值记录
	GetC2CRechargeRecord: '/GetC2CRechargeRecord', //C2C充值记录
	GetWithdrawLog: '/GetWithdrawLog', //提现记录
	GetTransactions: '/GetTransactions', //交易记录
	GetTransactionsTypes: '/GetTransactionsTypes', //交易类型
	//提现相关
	GetWithdrawalTypes: '/GetWithdrawalTypes', //提现类别
	GetBankList: '/GetBankList', //获取银行列表
	getWithdrawals: '/getWithdrawals', //获取当前提现方式对应的所有银行信息
	NewSetWithdrawal: '/NewSetWithdrawal', //提现
	SetWithdrawalBankCard: '/SetWithdrawalBankCard', //添加银行卡
	DeleteBankCard: '/DeleteBankCard', //删除银行卡,usdt地址
	SetWithdrawalUsdt: '/SetWithdrawalUsdt', //添加usdt地址
	SetWithdrawalWallet: '/SetWithdrawalWallet', // 添加电子钱包地址
	SetWithdrawalCpf: '/SetWithdrawalCpf', //添加pix
	GetUserRealName: '/GetUserRealName', //获取实名信息
	SetWithdrawalUPISendOtp: '/SetWithdrawalFastUPISendOtp',
	SetWithdrawalUPISendOtpByWithdrawId: '/SetWithdrawalFastUPISendOtpByWithdrawId',
	SetWithdrawalUPIVerifyOtpByWithdrawId: '/SetWithdrawalFastUPIVerifyOtpByWithdrawId',
	SetWithdrawalUPISendOtpByBid: '/SetWithdrawalFastUPISendOtpByBid',
	SetWithdrawalUPIVerifyOtp: '/SetWithdrawalFastUPIVerifyOtp',
	GetListNeedKycConnectWithdrawOrder: '/GetListFastUpiNeedKycConnectWithdrawOrder',
	//彩票
	// WinGo
	WinGoGetTypeList: '/GetTypeList', // 游戏列表
	WinGoGetGameIssue: '/GetGameIssue', // 当期信息
	WinGoGetNoaverageEmerdList: '/GetNoaverageEmerdList', // 游戏记录
	WinGoGetMyEmerdList: '/GetMyEmerdList', // 我的游戏记录
	WinGoGetEmerdList: '/GetEmerdList', // 开奖结果趋势图
	WinGoGameBetting: '/GameBetting', // 投注
	WinGoGetWinTheLotteryResult: '/GetWinTheLotteryResult', // 查询中奖参数
	GetLastFiveIssueNumberResult: '/GetLastFiveIssueNumberResult', // 查询最近5期开奖结果
	GetRuleByTypeId: '/GetRuleByTypeId', // 获取wingo玩法类型介绍
	// WinTxr
	WinTxrGetTRXtypeList: '/GetTRXtypeList', // 游戏列表
	WinTxrGetTRXGameIssue: '/GetTRXGameIssue', // 当期信息
	WinTxrGetTRXNoaverageEmerdList: '/GetTRXNoaverageEmerdList', // 游戏记录
	WinTxrGetTRXMyEmerdList: '/GetTRXMyEmerdList', // 我的游戏记录
	WinTxrGetEmerdList: '/GetTRXEmerdList', // 开奖结果趋势图
	WinTxrGameTRXBetting: '/GameTRXBetting', // 投注
	GetTrxWinTheLotteryResult: '/GetTrxWinTheLotteryResult', // 查询中奖参数
	GetTRXRuleByTypeId: '/GetTRXRuleByTypeId', // 获取Trx游戏玩法规则
	// xoso
	GetXosoGameBaseData: '/GetXosoGameBaseData', //获取XOSO基础数据
	GetVietnamAreList: '/GetListGameConfig', //获取越南游戏类型
	GetDayIssueNolist: '/GetIssueNoList', //获取开奖提起和期号
	GetXosoOdds: '/GetListXosoOdds', //获取游戏玩法赔率列表
	GetXosoResult: '/GetXosoResultPageList', //获取开奖结果（分页）
	GetXosoUserRecord: '/GetXosoRecordPageList', //获取会员投注记录(分页)
	XosoBetting: '/AddXosoBetting', //XOSO投注
	GetListUserResult: '/GetUserResultList', //用户投注中奖结果
	CancelBetOrder: '/CancelXosoBetOrder', // xoso订单取消
	GetXosoAreGamePlay: '/GetXosoAreaPlay', //获取区域玩法配置信息
	GetXosoAreaPlayOdd: '/GetXosoAreaPlayOdd', //获取玩法及赔率详情

	//急速xoso
	GetFXosoIssueNoList: '/GetFXosoIssueNoList', //获取开奖提起和期号
	GetFXosoAreaPlay: '/GetFXosoAreaPlay',
	GetFXosoAreaPlayOdd: '/GetFXosoAreaPlayOdd',
	GetFXosoResultPageList: '/GetFXosoResultPageList',
	GetFXosoResult: '/GetFXosoResult', //最近一期开奖结果
	GetFXosoRecordPageList: '/GetFXosoRecordPageList', //分页获取会员投注记录
	AddFXosoBetting: '/AddFXosoBetting', //投注
	GetFXosoUserResult: '/GetFXosoUserResult', //获取用户的中奖结果

	// Win获取钱包
	WinGetWinsUserAmount: '/GetWinsUserAmount',
	// K3
	GetK3TypeList: '/GetK3TypeList', // 獲取游戲類型
	GetGameK3Issue: '/GetGameK3Issue', // 當期信息
	GetK3OneEmerd: '/GetK3OneEmerd', // 獲取上期開獎信息
	GetK3OddsList: '/GetK3OddsList', // 獲取投注賠率
	K3GameBetting: '/K3GameBetting', // 投注
	GetK3NoaverageEmerdList: '/GetK3NoaverageEmerdList', //游戲記錄
	GetMyK3EmerdList: '/GetMyK3EmerdList', // 获取我的游戏记录
	GetK3TheLotteryResult: '/GetK3TheLotteryResult', // 用户投注中奖结果
	GetK3RuleByTypeId: '/GetK3RuleByTypeId', // 获取TrxWin游戏类型玩法
	// 5D
	Get5DtypeList: '/Get5DtypeList', // 获取游戏类型
	GetGame5DIssue: '/GetGame5DIssue', // 获取当期信息
	Get5DOneEmerd: '/Get5DOneEmerd', // 获取上期开奖信息
	Get5DOddsList: '/Get5DOddsList', // 过去赔率
	Game5DBetting: '/Game5DBetting', // 下注
	GetNoaverage5DEmerdList: '/GetNoaverage5DEmerdList', // 游戏记录
	Get5DEmerdList: '/Get5DEmerdList', // 趋势图
	GetMy5DEmerdList: '/GetMy5DEmerdList', // 我的游戏记录
	GetD5TheLotteryResult: '/GetD5TheLotteryResult', // 用户投注中奖结果
	Get5DRuleByTypeId: '/Get5DRuleByTypeId', // 获取5D游戏玩法类型
	// 长龙
	GetLongDragon: '/GetLongDragon', // 长龙投注列表
	// Select 选择框接口
	GetDateTimeScopeTypes: '/GetDateTimeScopeTypes', // 返回时间列表

	GetSettingByKey: '/GetSettingByKey', //根据key获取系统字典值

	// 充值相关
	GetPayTypeName: '/GetPayTypeName', // 获取充值大类列表
	GetRechargeTypes: '/GetRechargeTypes', // 获取充值渠道列表
	NewSetRechargesBankOrder: '/NewSetRechargesBankOrder', // 获取银行下单信息
	UpRechargesBankOrder: '/UpRechargesBankOrder', // 取消本地银行订单
	UpdateRechargesUpiOrder: '/UpdateRechargesUpiOrder', // 完成充值
	GetBankOrder: '/GetBankOrder', //获取银行订单
	GetBankOrderInfo: '/GetBankOrderInfo',
	C2CRechargeCancel: '/C2CRechargeCancel', // 取消C2C充值订单
	C2CRecharge: '/C2CRecharge', // C2C充值
	C2CRechargeGetOrderDetail: '/C2CRechargeGetOrderDetail', // C2C充值订单详情
	C2CRechargeConfirm: '/C2CRechargeConfirm', // C2C充值确认到账
	C2CRechargeGetPayingDetail: '/C2CRechargeGetPayingDetail', // C2C充值订单详情
	GetC2CRechargeAwardAmountList: '/GetC2CRechargeAwardAmountList', // C2C充值奖励金额列表
	GetC2CCancelReason: '/GetC2CCancelReason', // C2C充值提现取消原因列表
	C2CRechargeAppeal: '/C2CRechargeAppeal', // C2C充值申诉
	RechargesUsdtOrder: '/RechargesUsdtOrder', // USDT充值
	GetUsdtOrder: '/GetUsdtOrder', // 获取USDT充值订单
	RechargesUpiOrder: '/RechargesUpiOrder', // UPI充值
	GetUpiOrder: '/GetUpiOrder', // 获取UPI充值订单
	UpdateRechargesUsdtOrder: '/UpdateRechargesUsdtOrder', // 更新USDT充值订单
	CheckFirstPixRecharge: '/CheckFirstPixRecharge', // PIX是否首次充值
	ARBWalletMemberInfo: '/ARBWalletMemberInfoNet', // '/ARBWalletMemberInfo', //获取会员信息
	ARBWalletActivate: '/ARBWalletActivateNet', //'/ARBWalletActivate', // 激活钱包
	ARBWalletEnter: '/ARBWalletEnterNet', //'/ARBWalletEnter', // 进入钱包
	GetARPayUrl: '/GetARPayUrl', // 获取钱包支付链接
	ThirdPay: '/ThirdPay', // 三方支付
	NewSetBankQRCodeOrder: '/NewSetBankQRCodeOrder', // 银行卡扫码支付
	CreateRechargeOrder: '/CreateRechargeOrder', // arpay充值
	RSNWalletMemberInfo: '/RSNWalletMemberInfoNet', // 获取RNS会员信息
	RSNActivateNet: '/RSNWalletActivateNet', // 激活RNS
	RSNEnterNet: '/RSNWalletEnterNet', // 进入rns钱包
	GetRSNPayUrl: '/GetRSNPayUrl', // 获取支付订单
	CreateRechargeOrderAppeal: '/CreateRechargeOrderAppeal', // 充值申诉
	GetArUpiPayUrl: '/GetPayUrl', // 获取支付订单
	CancelRechargeOrder: '/ArUpiCancelRechargeOrder',
	GetArUpiOnGoingOrder: '/GetArUpiOnGoingOrder', //获取进行中的订单
	GetArBruiedPage: '/ArBuriedPage', //充值事件上报钱包
	ArUpiSubmitUtr: '/ArUpiSubmitUtr', // 提交UTR
	ArUpiGetBankListToken: '/ArUpiGetBankListToken', // 提交UTR
	GetRechargeChannel: '/GetRechargeChannel', //获取充值渠道 随机
	CheckUpiIdExists: '/CheckUpiIdExists',
	CheckUpiIdFastExists: '/CheckFastUpiIdExists',
	//验证码相关
	GetCodeModel: '/GetCodeModel', //获取验证码

	// c2c
	SetWithdrawalUPI: '/SetWithdrawalUPI', // 添加UPI账号接口
	SetWithdrawalFastUPI: '/SetWithdrawalFastUPI', // 添加快捷UPI账号接口
	GetC2CWithdrawRecord: '/GetC2CWithdrawRecord', // 提现记录
	GetC2CWithdrawOrderDetail: '/GetC2CWithdrawOrderDetail', //查询提现详情
	C2CWithdrawConfirm: '/C2CWithdrawConfirm', // 提现确认到账
	C2CWithdrawAppeal: '/C2CWithdrawAppeal', // 提现申诉
	GetNewUPICanBindCardList: '/GetNewUPICanBindCardList', // 获取UPI可以绑定的银行卡
	SetWithdrawalNewUPI: '/SetWithdrawalNewUPI', // 添加NewUIP账号接口
	GetNewUPIBindMobileNo: '/GetNewUPIBindMobileNo', //返回当前用户手机号
	C2CWithdrawRematch: '/C2CWithdrawRematch', //c2c继续匹配
	GetC2CWithdrawRecommendedAmount: '/GetC2CWithdrawRecommendedAmount', //c2c更改金额推荐金额
	ChangeC2CWithdrawOrderAmount: '/ChangeC2CWithdrawOrderAmount', //c2c提现更改订单金额
	C2CWithdrawalCancel: '/C2CWithdrawalCancel', //c2c提现取消订单
	C2CWithdrawOrderAmountError: '/C2CWithdrawOrderAmountError', //金额错误
	//vip
	GetVipUsers: '/GetVipUsers', //获取vip会员信息
	GetPageListVipUserRecord: '/GetPageListVipUserRecord', //vip操作日志
	GetListVipLevel: '/GetListVipLevel', //获取vip等级信息
	GetListVipUserRewards: '/GetListVipUserRewards', //获取vip会员奖励
	GetVipUserLevelDetail: '/GetVipUserLevelDetail', //获取vip用户等级详细
	AddReceiveAward: '/AddReceiveAward', //领取奖励
	GetAllVipLevelList: '/GetAllVipLevelList', //洗码详情
	// 洗码
	GetCodeWashAmount: '/GetCodeWashAmount', //洗码量
	AddCodeWashRecord: '/AddCodeWashRecord', //一键洗码
	GetCodeWashRecordList: '/GetCodeWashRecordList', //获取洗码记录(带分页)
	GetCodeWashRule: '/GetCodeWashRule', //洗码规则
	// 上传
	UploadImage: '/UploadImage', // 上传图片
	UploadVideo: '/UploadVideo', //上传视频

	// bingo
	GetMyBingo18HistoryBetting: '/GetMyBingo18HistoryBetting',
	GetBinguoGameConfig: '/GetBingo18GameConfig',
	GetGameBingo18Issue: '/GetGameBingo18Issue', // 获取当期信息
	GetBingo18OddsList: '/GetBingo18OddsList', // 获取赔率列表
	GetBingo18LastGameResult: '/GetBingo18LastGameResult', // 获取最新开奖结果
	GetBingo18BetAmount: '/GetBingo18BetAmount', // 获取当期投注金额
	Bingo18Betting: '/Bingo18Betting', // 投注
	GetBingo18Last50Result: '/GetBingo18Last50Result', // 获取最新50期开奖结果
	GetTrendstatistics: '/GetTrendstatistics', // 趋势开奖统计
	GetLotteryRankList: '/GetLotteryRankList', // 排行榜
	GetLotteryResult7Day: '/GetLotteryResult7Day', // 7天数据统计
	GetUserRankList: '/GetUserRankList', // 用户排名

	// 4D
	Get4DGameConfig: '/Get4DGameConfig', // 4D游戏配置
	GetGame4DIssue: '/GetGame4DIssue', // 4D游戏期号
	Get4DOddsList: '/Get4DOddsList', // 4D游戏赔率
	Get4DGameResult: '/Get4DGameResult', // 所有彩种最新一期开奖结果
	GetMy4DHistoryBetting: '/GetMy4DHistoryBetting', // 4D 我的投注记录
	D4GameBetting: '/D4GameBetting', // 4D投注
	D4GameCancelOrder: '/D4GameCancelOrder', // 4D撤单
	GetGameTypeList: '/GetGameTypeList', //获取彩种列表
	Get4DGameResultByType: '/Get4DGameResultByType', //开奖结果
	//锦标赛
	GetChampionTaskList: '/GetChampionTaskList', //赛事列表
	ChampionEntrance: '/ChampionEntrance', //竞标赛入口
	JoinChampionTask: '/JoinChampionTask', //参加锦标赛
	GetChampionTaskDetail: '/GetChampionTaskDetail', //获取赛事详细信息
	GetTop10ChampionTaskDataUserList: '/GetTop10ChampionTaskDataUserList', //赛事前10名会员
	GetMyChampionTaskList: '/GetMyChampionTaskList', //我的锦标赛列表,

	// 大转盘
	GetNowdayRechargeAmount: '/GetNowdayRechargeAmount', //余额
	GetTurnTableUserRotateNum: '/GetTurnTableUserRotateNum', //次数
	GetTurnTableInfo: '/GetTurnTableInfo', //转盘配置
	GetTurnTableRecord: '/GetTurnTableRecord', //记录
	GetTurnTableDraw: '/TurnTableDraw',
	GetGiftPackUserRewardRecord: '/GetGiftPackUserRewardRecord', //列表配置
	ApplyReceiveGiftPackUserReward: '/ApplyReceiveGiftPackUserReward',
	ApplyFirstCharge: '/ApplyFirstCharge', //新会员首存领取
	// 心跳接口
	UpdateOnlineStatus: '/UpdateOnlineStatus',

	// 邀请转盘
	GetInvitedWheelInfo: '/GetInvitedWheelInfo', // 获取邀请转盘信息
	SpinInvitedWheel: '/SpinInvitedWheel', // 邀请转盘抽奖
	GetUserInvitedWheelWithdrawList: '/GetUserInvitedWheelWithdrawList', // 分页获取用户提现记录列表
	SubmitInvitedWheelWithdraw: '/SubmitInvitedWheelWithdraw', // 邀请轮盘提款
	GetInvitedWheelRules: '/GetInvitedWheelRules', // 获取邀请转盘抽奖规则
	// 获取PWA域名列表
	GetPwaDomainList: '/GetPwaDomainList', // 获取PWA域

	// 奖金中心
	GetRewardCenterList: '/GetRewardCenterList',

	// 语言上报
	SetUserLanguage: '/SetUserLanguage', // 用户语言上报

	// 埋点
	UpdateUserFirebaseToken: '/UpdateUserFirebaseToken', // 上传firebase token
	// 获取pwa
	HomePwaSettingPageInfo: '/HomePwaSettingPageInfo'
}
