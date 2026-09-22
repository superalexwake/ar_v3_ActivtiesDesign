# API 接口使用情况统计报告(排除活动类与 SaaS 彩票体系)

> 生成日期:2026-07-11 · 分支:`masterBranch/main-3.04` · 方式:多 Agent 并行深度分析(9 个清点 Agent + 8 个对抗性核查 Agent,共 17 个,224 次代码检索)

## 1. 结论速览

- 统计范围内(主 API 体系 + ArUpi 支付体系)共清点 **368 个 API 请求函数**。SaaS 彩票独立体系(26 个函数)与活动类接口按要求排除。
- **在使用:346 个函数**;其中活动类 77 个(排除),**排除后在用 269 个函数,对应 271 个去重后端点**。
- **未使用(死代码候选):22 个函数 / 15 个端点**,全部经对抗性核查二次确认(0 个翻案)。
- `src/api/url.ts` 注册表共 **348 个键**,其中 2 个孤儿键:`WinGetWinsUserAmount`(彻底死键)、`GetMaintenanceInfo`(键死了,但端点被 `src/views/maintenance/index.vue:62` 裸字符串调用,仍是活接口)。

## 2. 分析方法与范围

| 体系 | 端点定义方式 | 请求层 | 是否计入统计 |
|---|---|---|---|
| 主 API(`src/api/modules/` 17 个模块) | 集中注册表 `src/api/url.ts`(348 键) | `src/api/axios.ts` | ✅ 计入 |
| ArUpi 支付/上传(`src/api/arupi/`) | 模块内字符串字面量(`/ar-wallet/...`) | 独立 `src/api/arupi/axios.ts` | ✅ 计入 |
| SaaS 彩票(`src/saasLottery/api/`) | 模块内字符串字面量(`/Lottery/...`) | 独立 request 层 | ❌ 按要求排除 |

**"在使用"判定:** 函数被 api 定义层之外的业务代码(views / components / hooks / stores / utils / router / plugins)真实 import 并调用。仅被 api 层自身或 barrel 再导出引用不算。每个函数逐一 grep 核实(含 `@/` 别名、相对路径、`src/api/index.ts` 再导出链、动态调用)。

**活动类判定(排除范围):** 活动中心/活动列表/签到/每日每周任务/新手礼包/宝箱/积分商城/积分抽奖/首充回归奖励/大转盘/邀请转盘/锦标赛/邀请奖励/奖金中心/电子大奖 Jackpot。核心业务(登录注册/用户/钱包充提/C2C/保险箱/游戏与彩票投注/VIP/洗码/推广返佣/客服/消息/系统配置/埋点)不属于活动类。

**质量保障:** 每个被标记"未使用"的结论,都由独立的对抗性核查 Agent 用 6 种手段(函数名/注册键/端点字面量/动态调用/再导出链/全仓复扫)尝试反驳,全部 22 个结论均通过核查。

## 3. 总览统计

| 分组 | 函数总数 | 在用 | 其中活动类(排除) | **在用·非活动** | 未使用 |
|---|---:|---:|---:|---:|---:|
| home | 45 | 38 | 2 | **36** | 7 |
| wallet | 83 | 81 | 0 | **81** | 2 |
| user / mine / vip / common / eventTrack | 67 | 61 | 11 | **50** | 6 |
| games | 77 | 74 | 0 | **74** | 3 |
| promotion / turntable | 17 | 15 | 5 | **10** | 2 |
| activity | 61 | 60 | 59 | **1** | 1 |
| arupi | 18 | 17 | 0 | **17** | 1 |
| **合计** | **368** | **346** | **77** | **269** | **22** |

去重后端点维度:在用·非活动 **271** 个;在用·活动类(排除)**77** 个;未使用 **15** 个。

## 4. 在用接口明细(排除活动类)

共 **269 个函数**,按模块分组。「调用方」列出代表业务文件及总调用文件数。

### 4.1 home — 首页 / 游戏列表 / 消息公告 / 保险箱(src/api/modules/home.ts) (36)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `GetAllowBetSetting` | `/GetAllowBetSetting` | 获取是否允许未充值用户进行游戏的开关 | hooks/useHome.hook.ts |
| `GetAppDownloadConfigList` | `/GetAppDownloadConfigList` | 获取隐私安装(App下载配置)列表 | views/downloadCenter/index.vue |
| `GetElectronWithChildGame` | `/GetElectronWithChildGame` | 获取电子分类厂商及子游戏列表 | hooks/useHome.hook.ts 等3处 |
| `GetGameCategoryList` | `/GetGameCategoryList` | 获取游戏大类列表及显示开关 | hooks/useHome.hook.ts 等8处 |
| `GetHomeSettings` | `/GetHomeSettings` | 获取首页显示设置 | stores/modules/setting.ts |
| `GetHotLotteryList` | `/GetHotLotteryList` | 获取热门彩票列表 | components/Home/damanHome/GameScenesDaman/LotteryList.vue |
| `GetLotteryCategoryList` | `/GetLotteryCategoryList` | 获取彩票大类列表及显示开关 | views/main/BetRecords/index.vue |
| `GetPwaDomainList` | `/GetPwaDomainList` | 获取PWA域名列表 | hooks/usePwa.ts |
| `GetSelfCustomerServiceLink` | `/GetSelfCustomerServiceLink` | 获取自营客服中心链接 | hooks/useServe.hook.ts |
| `getAllGameList` | `/GetAllGameList` | 获取所有游戏列表 | hooks/useHome.hook.ts 等8处 |
| `getBalanceByARGame` | `/GetBalanceByARGame` | 内嵌AR游戏获取钱包余额 | views/home/game/index.vue |
| `getBannerList` | `/GetBannerList` | 获取首页轮播图列表 | hooks/useHome.hook.ts |
| `getDailyProfitRank` | `/GetDailyProfitRank` | 获取每日盈利(中奖人)排行榜 | hooks/useHome.hook.ts 等2处 |
| `getFBMsgSubscribe` | `/UserFBMsgSubscribe` | FCM推送消息订阅/退订 | stores/modules/user.ts 等2处 |
| `getGameUrl` | `/GetGameUrl` | 获取三方游戏进入链接 | hooks/useHome.hook.ts 等4处 |
| `getHomeData` | `/GetAppDownloadUrl` | 获取首页/App下载地址数据(键名GetHomeWebSite实际指向/GetAppDownloadUrl) | hooks/useHome.hook.ts 等2处 |
| `getHomePwaSettingPageInfo` | `/HomePwaSettingPageInfo` | 获取首页PWA安装设置页信息 | hooks/usePwa.ts 等2处 |
| `getLotteryGameTypeList` | `/GetLotteryGameTypeList` | 获取彩票游戏类型列表 | components/Home/BlackGoldHome/GameList/LotterySlotItem.vue 等3处 |
| `getMessages` | `/GetMessageList` | 获取站内信(个人消息)列表 | components/Home/Messages/PersonalMessageList.vue |
| `getSafeAmount` | `/GetSafeAmount` | 获取保险箱余额 | views/main/StrongBox/index.vue |
| `getSafeInfo` | `/GetSafeInfo` | 获取保险箱中心信息 | views/main/StrongBox/index.vue 等2处 |
| `getSafeList` | `/GetSafeList` | 获取保险箱记录列表 | views/main/StrongBox/index.vue |
| `getSafeLogList` | `/GetSafeLogList` | 获取保险箱历史日志列表 | views/main/StrongBox/StrongBoxRecord/index.vue |
| `getSafeUserAmount` | `/GetSafeUserAmount` | 获取用户可转入保险箱的钱包余额 | views/main/StrongBox/index.vue |
| `getSiteMessage` | `/GetSitePopMsgList` | 获取首页登录成功弹窗公告 | hooks/useGlobalDialog.hook.ts |
| `getSiteMessageList` | `/GetSiteMessageList` | 获取站点公告列表(跑马灯/公告页) | hooks/useNotice.hook.ts 等8处 |
| `getThirdGameList` | `/GetThirdGameList` | 获取第三方游戏列表(带缓存) | components/Home/club91Home/seachGame.vue 等5处 |
| `getThirdGameListC` | `/GetThirdGameList` | 获取第三方游戏列表(无缓存版, 锦标赛页用) | hooks/useChampionship.hook.ts |
| `getTransfer` | `/Transfer` | 获取/触发转账信息 | stores/modules/index.ts |
| `getVideWithChildGame` | `/GetVideWithChildGame` | 获取视讯厂商及子游戏列表 | hooks/useHome.hook.ts 等3处 |
| `getWealthState` | `/GetWealthState` | 获取是否开启保险箱(财富)功能状态 | components/Main/FinancialServices/index.vue |
| `hotifyARGameRecover` | `/NotifyARGameRecover` | 三方SaaS游戏余额回收(通知下分) | stores/modules/index.ts |
| `setAllMessageState` | `/SetAllMessageState` | 站内信全部标记已读 | components/Home/Messages/PersonalMessageList.vue |
| `setMessageState` | `/SetOneMessageState` | 设置单条站内信已读状态 | components/Home/Messages/PersonalMessageList.vue 等2处 |
| `setSafeBack` | `/SetSafeBack` | 保险箱转出到钱包 | views/main/StrongBox/index.vue |
| `updateOnlineStatus` | `/UpdateOnlineStatus` | 更新用户在线状态(心跳) | saasLottery/hooks/useLottery.hook.ts |

### 4.2 wallet — 钱包 / 充值 / 提现 / C2C(src/api/modules/wallet.ts) (81)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `ARBWalletActivate` | `/ARBWalletActivateNet` | 激活ARB钱包 | components/Wallet/Recharge/RechargeMenu.vue 等5处 |
| `ARBWalletEnter` | `/ARBWalletEnterNet` | 进入ARB钱包 | hooks/useARwallet.ts |
| `C2CRechargeAppeal` | `/C2CRechargeAppeal` | C2C充值申诉 | views/wallet/RechargeHistory/RechargeUpiDetail/index.vue |
| `C2CRechargeConfirm` | `/C2CRechargeConfirm` | 确认C2C充值订单已支付 | hooks/useRecharge.ts |
| `C2CRechargeGetPayingDetail` | `/C2CRechargeGetPayingDetail` | 获取进行中的C2C充值订单 | hooks/useRecharge.ts |
| `C2CWithdrawAppeal` | `/C2CWithdrawAppeal` | C2C提现申诉 | views/wallet/Withdraw/C2cDetail/index.vue |
| `C2CWithdrawConfirm` | `/C2CWithdrawConfirm` | C2C提现确认到账 | views/wallet/Withdraw/C2cDetail/index.vue |
| `C2CWithdrawOrderAmountError` | `/C2CWithdrawOrderAmountError` | C2C提现上报金额错误 | views/wallet/Withdraw/c2cWrongAmount/index.vue |
| `C2CWithdrawRematch` | `/C2CWithdrawRematch` | C2C提现继续匹配 | components/Wallet/Withdraw/c2cDetailOther.vue |
| `C2CWithdrawalCancel` | `/C2CWithdrawalCancel` | C2C提现取消订单 | views/wallet/Withdraw/c2cCancelWithdrawal/index.vue |
| `ChangeC2CWithdrawOrderAmount` | `/ChangeC2CWithdrawOrderAmount` | C2C提现更改订单金额 | components/Wallet/Withdraw/c2cModifyAmount.vue |
| `CheckFirstPixRecharge` | `/CheckFirstPixRecharge` | 查询PIX是否首次充值 | hooks/useRecharge.ts |
| `CreateRechargeOrder` | `/CreateRechargeOrder` | ARpay充值下单 | hooks/useRecharge.ts |
| `GetARGameAndPlatWallets` | `/GetARGameAndPlatWallets` | 获取AR游戏与平台钱包 | stores/modules/wallet.ts |
| `GetAllwallets` | `/GetAllwallets \| /GetSaasAllwallets` | 获取所有钱包(按SaaS开关动态切换端点) | stores/modules/wallet.ts |
| `GetBalance` | `/GetBalance` | 获取主钱包余额 | stores/modules/wallet.ts 等4处 |
| `GetBankList` | `/GetBankList` | 获取银行列表 | views/wallet/Withdraw/AddBankCard/index.vue 等8处 |
| `GetBankOrder` | `/GetBankOrder` | 获取银行充值订单信息 | hooks/useRecharge.ts |
| `GetBankOrderInfo` | `/GetBankOrderInfo` | 查询银行充值订单状态 | hooks/useRecharge.ts 等2处 |
| `GetC2CCancelReason` | `/GetC2CCancelReason` | 获取C2C充值/提现取消原因列表 | views/wallet/CancelRecharge/index.vue 等2处 |
| `GetC2CRechargeAwardAmountList` | `/GetC2CRechargeAwardAmountList` | 获取C2C充值推荐金额列表 | hooks/useRecharge.ts |
| `GetC2CRechargeRecord` | `/GetC2CRechargeRecord` | 获取C2C充值记录 | hooks/useRecharge.ts 等2处 |
| `GetC2CWithdrawOrderDetail` | `/GetC2CWithdrawOrderDetail` | 按订单号查询C2C提现订单详情 | components/Wallet/Withdraw/c2cDetailOther.vue 等2处 |
| `GetC2CWithdrawRecommendedAmount` | `/GetC2CWithdrawRecommendedAmount` | C2C提现更改金额时的推荐金额 | components/Wallet/Withdraw/c2cModifyAmount.vue |
| `GetC2CWithdrawRecord` | `/GetC2CWithdrawRecord` | 获取C2C提现记录 | components/Wallet/Withdraw/c2cRecord.vue 等2处 |
| `GetListNeedKycConnectWithdrawOrder` | `/GetListFastUpiNeedKycConnectWithdrawOrder` | 查询需要KYC/OTP验证的提现订单 | hooks/useFastUpiKycOtp.hook.ts |
| `GetNewUPIBindMobileNo` | `/GetNewUPIBindMobileNo` | 获取当前用户绑定UPI用的手机号 | views/wallet/Withdraw/AddUpi/index.vue 等2处 |
| `GetNewUPICanBindCardList` | `/GetNewUPICanBindCardList` | 获取可绑定UPI的银行卡列表 | components/Wallet/Withdraw/AddUpi/bindBank.vue |
| `GetPayTypeName` | `/GetPayTypeName` | 获取支付大类列表 | stores/modules/wallet.ts 等2处 |
| `GetRechargeRecord` | `/GetRechargeRecord` | 获取充值记录 | hooks/useRecharge.ts 等2处 |
| `GetRechargeTypes` | `/GetRechargeTypes` | 获取充值渠道列表 | hooks/useRecharge.ts 等2处 |
| `GetSettingByKey` | `/GetSettingByKey` | 根据key获取系统字典值 | components/Wallet/Withdraw/c2cModifyAmount.vue 等2处 |
| `GetTransactions` | `/GetTransactions` | 获取交易记录 | views/wallet/TransAction/index.vue |
| `GetTransactionsTypes` | `/GetTransactionsTypes` | 获取交易类型列表 | views/wallet/TransAction/index.vue |
| `GetUpiOrder` | `/GetUpiOrder` | 获取UPI充值订单详情 | hooks/useRecharge.ts |
| `GetUsdtOrder` | `/GetUsdtOrder` | 获取USDT充值订单 | hooks/useRecharge.ts |
| `GetUserRealName` | `/GetUserRealName` | 获取实名信息 | views/wallet/Withdraw/AddPIX/index.vue |
| `GetWithdrawLog` | `/GetWithdrawLog` | 获取提现记录 | views/wallet/WithdrawHistory/index.vue |
| `GetWithdrawLogF` | `/GetWithdrawLog` | 获取提现页底部最近5条提现记录(与GetWithdrawLog同端点) | components/Wallet/Withdraw/WithdrawHistory.vue |
| `GetWithdrawalTypes` | `/GetWithdrawalTypes` | 获取提现类别 | views/wallet/WithdrawHistory/index.vue 等2处 |
| `GetWithdrawals` | `/getWithdrawals` | 获取提现方式对应的所有银行/账户信息 | components/Wallet/Withdraw/c2cModifyAmount.vue 等8处 |
| `NewSetBankQRCodeOrder` | `/NewSetBankQRCodeOrder` | 银行卡扫码支付下单 | hooks/useRecharge.ts |
| `NewSetRechargesBankOrder` | `/NewSetRechargesBankOrder` | 获取银行下单信息(本地银行充值下单) | hooks/useRecharge.ts |
| `NewSetWithdrawal` | `/NewSetWithdrawal` | 提交提现申请 | views/arWallet/index.vue 等2处 |
| `RechargesUpiOrder` | `/RechargesUpiOrder` | UPI充值下单 | hooks/useRecharge.ts |
| `RechargesUsdtOrder` | `/RechargesUsdtOrder` | USDT充值下单 | hooks/useRecharge.ts |
| `RecoverBalance` | `/RecoverBalance \| /RecoverSaasBalance` | 获取用户回收余额(按SaaS开关动态切换端点) | stores/modules/wallet.ts 等4处 |
| `SetWithdrawalBankCard` | `/SetWithdrawalBankCard` | 添加银行卡 | views/wallet/Withdraw/AddBankCard/index.vue |
| `SetWithdrawalCpf` | `/SetWithdrawalCpf` | 添加PIX(CPF)提现账户 | views/wallet/Withdraw/AddPIX/index.vue |
| `SetWithdrawalFastUPI` | `/SetWithdrawalFastUPI` | 添加快捷UPI提现账号 | views/wallet/Withdraw/AddFastUpi/index.vue |
| `SetWithdrawalNewUPI` | `/SetWithdrawalUPI` | 添加UPI提现账号 | views/wallet/Withdraw/AddUpi/index.vue |
| `SetWithdrawalUsdt` | `/SetWithdrawalUsdt` | 添加USDT提现地址 | views/wallet/Withdraw/AddUSDT/index.vue |
| `SetWithdrawalWallet` | `/SetWithdrawalWallet` | 添加电子钱包提现地址(Wave/Kbz/RsnPay/Type4) | views/wallet/Withdraw/AddRsnPay/index.vue 等4处 |
| `ThirdPay` | `/ThirdPay` | 三方支付下单查询 | hooks/useRecharge.ts |
| `UpRechargesBankOrder` | `/UpRechargesBankOrder` | 取消本地银行充值订单 | hooks/useRecharge.ts |
| `UpdateRechargesUpiOrder` | `/UpdateRechargesUpiOrder` | 完成UPI充值(更新订单) | hooks/useRecharge.ts |
| `UpdateRechargesUsdtOrder` | `/UpdateRechargesUsdtOrder` | 更新USDT充值订单 | hooks/useRecharge.ts |
| `activeRSNWallet` | `/RSNWalletActivateNet` | 激活RSN钱包 | hooks/useARwallet.ts |
| `arUpiGetBankListToken` | `/ArUpiGetBankListToken` | 获取ArUpi银行列表token | hooks/useRecharge.ts |
| `arUpiSubmitUtr` | `/ArUpiSubmitUtr` | 提交UTR交易号 | components/Wallet/Recharge/RechargeRecord.vue 等2处 |
| `cancelC2CRechargeCancel` | `/C2CRechargeCancel` | 取消C2C充值订单 | views/wallet/CancelRecharge/index.vue |
| `cancelRechargeOrder` | `/ArUpiCancelRechargeOrder` | 取消ArUpi充值订单 | hooks/useRecharge.ts |
| `checkUpiIdExists` | `/CheckUpiIdExists` | 检测UPI ID是否已存在 | views/wallet/Withdraw/AddUpi/index.vue |
| `checkUpiIdFastExists` | `/CheckFastUpiIdExists` | 检测快捷UPI ID是否已存在 | views/wallet/Withdraw/AddFastUpi/index.vue |
| `createC2CRecharge` | `/C2CRecharge` | 生成C2C充值订单 | hooks/useRecharge.ts |
| `deleteBankCard` | `/DeleteBankCard` | 删除银行卡/USDT地址 | views/wallet/Withdraw/USDT/index.vue 等3处 |
| `enterRSNWallet` | `/RSNWalletEnterNet` | 进入RSN钱包 | hooks/useARwallet.ts |
| `getARBWalletMemberInfo` | `/ARBWalletMemberInfoNet` | 获取ARB钱包会员信息 | hooks/useARwallet.ts |
| `getARPayOrder` | `/GetARPayUrl` | 获取是否有AR钱包订单并返回支付链接 | hooks/useRecharge.ts 等2处 |
| `getArBruiedPage` | `/ArBuriedPage` | ArUpi充值事件埋点上报 | hooks/useArupiEvent.hook.ts |
| `getArUpiOnGoingOrder` | `/GetArUpiOnGoingOrder` | 获取进行中的ArUpi充值订单 | hooks/useRecharge.ts |
| `getArUpiOrderPay` | `/GetPayUrl` | 获取ArUpi充值订单支付链接 | hooks/useRecharge.ts |
| `getC2CRechargeDetail` | `/C2CRechargeGetOrderDetail` | 获取C2C充值订单详情 | hooks/useRecharge.ts 等3处 |
| `getOrderAppeal` | `/CreateRechargeOrderAppeal` | 充值订单申诉 | hooks/useRecharge.ts |
| `getRNSWalletInfo` | `/RSNWalletMemberInfoNet` | 获取RSN钱包会员信息 | hooks/useRecharge.ts 等2处 |
| `getRSNOrderPay` | `/GetRSNPayUrl` | 获取RSNpay充值支付订单链接 | hooks/useRecharge.ts |
| `setWithdrawalUPISendOtp` | `/SetWithdrawalFastUPISendOtp` | 快捷UPI绑定发送OTP | hooks/useCode.hook.ts |
| `setWithdrawalUPISendOtpByBid` | `/SetWithdrawalFastUPISendOtpByBid` | 提现按绑定ID发送OTP | hooks/useCode.hook.ts |
| `setWithdrawalUPISendOtpByWithdrawId` | `/SetWithdrawalFastUPISendOtpByWithdrawId` | 提现记录按提现ID发送OTP | hooks/useCode.hook.ts |
| `setWithdrawalUPIVerifyOtp` | `/SetWithdrawalFastUPIVerifyOtp` | 提现验证OTP | hooks/useFastUpiKycOtp.hook.ts |
| `setWithdrawalUPIVerifyOtpByWithdrawId` | `/SetWithdrawalFastUPIVerifyOtpByWithdrawId` | 提现记录按提现ID验证OTP | hooks/useFastUpiKycOtp.hook.ts |

### 4.3 user / mine / vip / common / eventTrack — 登录注册 / 我的 / VIP / 通用 / 埋点 (50)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `UploadImages` | `/UploadImage` | 上传图片(multipart) | views/wallet/OtherPay/index.vue 等2处 |
| `UploadVideos` | `/UploadVideo` | 上传视频(multipart) | views/wallet/Withdraw/c2cWrongAmount/index.vue |
| `getDateTimeScopeTypes` | `/GetDateTimeScopeTypes` | 获取时间范围选项列表(选择框组件用) | views/promotion/MyInvitation/index.vue |
| `updateFirebaseToken` | `/UpdateUserFirebaseToken` | 上报Firebase/极光推送Token | hooks/useFireBase.ts |
| `AddCodeWashRecord` | `/AddCodeWashRecord` | 一键洗码 | views/main/Laundry/index.vue |
| `GameStatis` | `/GameStatis` | 获取游戏统计列表 | views/main/GameStats/index.vue |
| `GetAgentServiceTypeList` | `/GetAgentServiceTypeList` | 获取代理客服列表 | hooks/useServe.hook.ts |
| `GetAgreement` | `/GetAgreement` | 获取风险披露协议 | views/main/About/AboutDetail/index.vue |
| `GetCodeWashAmount` | `/GetCodeWashAmount` | 获取可洗码量 | views/main/Laundry/index.vue |
| `GetCodeWashRecordList` | `/GetCodeWashRecordList` | 获取洗码记录分页列表 | views/main/Laundry/LaundryRecord/index.vue |
| `GetCodeWashRule` | `/GetCodeWashRule` | 获取洗码规则 | views/main/Laundry/LaundryRule/index.vue |
| `GetCustomerServiceGroup` | `/GetCustomerServiceGroup` | 获取客服群入口 | hooks/useServe.hook.ts |
| `GetCustomerServiceList` | `/GetCustomerServiceList` | 获取单个客服链接 | hooks/useServe.hook.ts |
| `GetCustomerServiceTypelist` | `/GetCustomerServiceTypelist` | 获取客服类型列表 | hooks/useServe.hook.ts 等7处 |
| `GetGoogleVerify` | `/GetGoogleVerify` | 获取谷歌验证器密钥 | views/main/SettingCenter/index.vue 等2处 |
| `GetPlayingGuide` | `/GetPlayingGuide` | 获取新手玩法指南 | views/main/Guide/index.vue |
| `GetProtocols` | `/GetProtocols` | 获取隐私政策 | views/main/About/AboutDetail/index.vue |
| `SetSafeIntopage` | `/SetSafeInto` | 保险箱转入金额 | views/main/StrongBox/index.vue |
| `SubmitSuggest` | `/SubmitSuggest` | 提交意见反馈 | views/main/Feedback/index.vue |
| `delall` | `/OneKeyMarkAllData` | 一键删除(标记)全部消息数据 | views/main/SettingCenter/index.vue |
| `getBindGoogleVerify` | `/BindGoogleVerify` | 绑定谷歌验证器 | views/main/GoogleVerify/BindGoogle/index.vue |
| `getCloseGoogleVerify` | `/CloseGoogleVerify` | 关闭谷歌验证器 | views/main/GoogleVerify/BindGoogle/index.vue |
| `getNewMyEmerdList` | `/GetNewMyEmerdList` | 获取历史投注记录 | views/main/BetRecords/index.vue |
| `EditNickName` | `/EditNickName` | 修改用户昵称 | components/Main/UserInformation/index.vue |
| `EditUserPhoto` | `/EditUserPhoto` | 修改用户头像 | views/main/Avatar/index.vue |
| `ForgetPassword` | `/ForgetPassword` | 忘记密码重置 | components/Login/ResetPassword.vue 等4处 |
| `GetEmailVerifyCode` | `/EmailVerifyCode` | 发送邮箱验证码 | hooks/useCode.hook.ts 等7处 |
| `GetLoadedSetting` | `/GetLoadedSetting` | 获取全局弹窗配置开关 | hooks/useGlobalDialog.hook.ts |
| `GetUserInfo` | `/GetUserInfo` | 获取用户信息 | stores/modules/user.ts 等2处 |
| `LoginOff` | `/LoginOff` | 退出登录 | stores/modules/user.ts |
| `Register` | `/Register` | 用户注册 | stores/modules/user.ts |
| `RegisterState` | `/RegisterState` | 查询是否开放注册及短信注册开关 | stores/modules/user.ts 等3处 |
| `ResetPassword` | `/ResetPassword` | 修改登录密码 | views/main/SettingCenter/LoginPassword/index.vue |
| `SetUserLanguage` | `/SetUserLanguage` | 上报用户语言 | hooks/useInfoupdate.hook.ts |
| `bindEmail` | `/BindEmail` | 绑定邮箱 | views/main/SettingCenter/BindEmail/index.vue |
| `bindPhone` | `/BindPhone` | 绑定手机号 | hooks/useARwallet.ts 等2处 |
| `captcha` | `/Captcha` | 获取图片滑块验证资源 | components/Login/SignIn.vue 等6处 |
| `getGameBetRecordType` | `/GetThirdGameCategory \| /GetSmallGameOrFishList` | 下注记录页获取三方游戏分类(捕鱼/小游戏走另一端点) | views/main/BetRecords/index.vue |
| `getSmsVerCode` | `/SmsVerifyCode` | 发送短信验证码(注册/登录/忘记密码/提现等场景) | hooks/useCode.hook.ts 等8处 |
| `login` | `/Login` | 账号密码登录 | stores/modules/user.ts |
| `refreshToken` | `/RefreshToken` | 刷新登录Token | api/axios.ts 等2处 |
| `verifyEmailCode` | `/VerifyEmailCode` | 校验邮箱验证码 | views/main/SettingCenter/BindEmail/index.vue |
| `verifyPhoneCode` | `/VerifyPhoneCode` | 校验手机验证码 | views/main/SettingCenter/UpdatePhone/index.vue |
| `AddReceiveAward` | `/AddReceiveAward` | 领取VIP奖励 | components/Vip/MyWelfare.vue 等2处 |
| `GetAllVipLevelList` | `/GetAllVipLevelList` | 获取VIP返水详情列表 | views/vip/RebateDetails/index.vue |
| `GetListVipLevel` | `/GetListVipLevel` | 获取VIP等级信息列表 | components/Vip/Weal.vue |
| `GetListVipUserRewards` | `/GetListVipUserRewards` | 获取VIP会员奖励列表 | components/Vip/MyWelfare.vue |
| `GetPageListVipUserRecord` | `/GetPageListVipUserRecord` | 获取VIP操作日志分页列表 | components/Vip/RecordVsrule.vue 等2处 |
| `GetVipUserLevelDetail` | `/GetVipUserLevelDetail` | 获取VIP用户等级详情 | components/Vip/VipCard.vue |
| `GetVipUsers` | `/GetVipUsers` | 获取VIP会员信息 | views/vip/index.vue 等3处 |

### 4.4 games — 彩票游戏 WinGo / TRX / K3 / 5D / 4D / Bingo / Xoso(src/api/modules/games/) (74)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `Bingo18Betting` | `/Bingo18Betting` | Bingo18投注下单 | hooks/useBinguo.hook.ts |
| `GetBingo18BetAmount` | `/GetBingo18BetAmount` | 获取Bingo18当期投注金额 | hooks/useBinguo.hook.ts |
| `GetBingo18Last50Result` | `/GetBingo18Last50Result` | 获取Bingo18过去50期开奖结果 | hooks/useBinguoCount.ts 等2处 |
| `GetBingo18LastGameResult` | `/GetBingo18LastGameResult` | 获取Bingo18最新一期开奖结果 | hooks/useBinguo.hook.ts |
| `GetBingo18OddsList` | `/GetBingo18OddsList` | 获取Bingo18赔率列表 | hooks/useBinguo.hook.ts |
| `GetBinguoGameConfig` | `/GetBingo18GameConfig` | 获取Bingo18游戏配置 | hooks/useBinguo.hook.ts |
| `GetGameBingo18Issue` | `/GetGameBingo18Issue` | 获取Bingo18当前期号信息 | hooks/useBinguo.hook.ts |
| `GetLotteryRankList` | `/GetLotteryRankList` | Bingo18中奖排行榜 | hooks/useBinguoCount.ts |
| `GetLotteryResult7Day` | `/GetLotteryResult7Day` | Bingo18近7天开奖数据统计 | hooks/useBinguoCount.ts |
| `GetMyBingo18HistoryBetting` | `/GetMyBingo18HistoryBetting` | 获取Bingo18我的投注记录(分页) | views/home/AllLotteryGames/BinguoRecord/index.vue |
| `GetTrendstatistics` | `/GetTrendstatistics` | Bingo18趋势开奖统计 | hooks/useBinguoCount.ts |
| `GetUserRankList` | `/GetUserRankList` | Bingo18用户个人排名 | hooks/useBinguoCount.ts |
| `d4GameBetting` | `/D4GameBetting` | 4D投注下单 | hooks/use4D.hook.ts |
| `d4GameCancelOrder` | `/D4GameCancelOrder` | 4D投注撤单 | hooks/use4D.hook.ts |
| `get4DGameConfig` | `/Get4DGameConfig` | 获取4D游戏配置 | hooks/use4D.hook.ts |
| `get4DGameResult` | `/Get4DGameResult` | 获取所有4D彩种最新一期开奖结果 | hooks/use4D.hook.ts |
| `get4DGameResultByType` | `/Get4DGameResultByType` | 按彩种获取4D开奖结果 | hooks/use4D.hook.ts |
| `get4DOddsList` | `/Get4DOddsList` | 获取4D赔率列表 | hooks/use4D.hook.ts |
| `getGame4DIssue` | `/GetGame4DIssue` | 获取4D当前期号 | hooks/use4D.hook.ts |
| `getGameTypeList` | `/GetGameTypeList` | 获取4D彩种列表 | hooks/use4D.hook.ts |
| `getMy4DHistoryBetting` | `/GetMy4DHistoryBetting` | 获取4D我的投注记录 | hooks/use4D.hook.ts |
| `Get5DRuleByTypeId` | `/Get5DRuleByTypeId` | 获取5D游戏规则 | stores/modules/lorrery.ts |
| `game5DBetting` | `/Game5DBetting` | 5D投注下单 | components/Home/AllLotteryGames/ChangLong/Bet.vue 等2处 |
| `get5DEmerdList` | `/Get5DEmerdList` | 5D开奖结果图表趋势 | components/Home/AllLotteryGames/FD/Trend.vue |
| `get5DOddsList` | `/Get5DOddsList` | 获取5D赔率列表 | components/Home/AllLotteryGames/FD/Betting.vue |
| `get5DOneEmerd` | `/Get5DOneEmerd` | 获取5D最新一期已开奖结果 | views/home/AllLotteryGames/5D/index.vue |
| `get5DtypeList` | `/Get5DtypeList` | 获取5D游戏类型列表 | stores/modules/lorrery.ts |
| `getD5TheLotteryResult` | `/GetD5TheLotteryResult` | 获取5D用户投注中奖结果 | views/home/AllLotteryGames/5D/index.vue |
| `getGame5DIssue` | `/GetGame5DIssue` | 获取5D最新一期期号 | views/home/AllLotteryGames/5D/index.vue |
| `getMy5DEmerdList` | `/GetMy5DEmerdList` | 我的5D投注记录(分页) | components/Home/AllLotteryGames/FD/MyGameRecord.vue 等2处 |
| `getNoaverage5DEmerdList` | `/GetNoaverage5DEmerdList` | 获取5D开奖结果列表(分页) | components/Home/AllLotteryGames/FD/GameRecord.vue 等2处 |
| `GetK3RuleByTypeId` | `/GetK3RuleByTypeId` | 获取K3游戏规则 | stores/modules/lorrery.ts |
| `getGameK3Issue` | `/GetGameK3Issue` | 获取K3最新一期期号 | views/home/AllLotteryGames/K3/index.vue |
| `getK3NoaverageEmerdList` | `/GetK3NoaverageEmerdList` | 获取K3开奖结果列表 | components/Home/AllLotteryGames/K3/Trend.vue 等3处 |
| `getK3OddsList` | `/GetK3OddsList` | 获取K3赔率列表 | components/Home/AllLotteryGames/K3/Betting.vue |
| `getK3OneEmerd` | `/GetK3OneEmerd` | 获取K3最新一条开奖信息 | views/home/AllLotteryGames/K3/index.vue |
| `getK3TheLotteryResult` | `/GetK3TheLotteryResult` | 获取K3用户投注中奖结果 | views/home/AllLotteryGames/K3/index.vue |
| `getK3TypeList` | `/GetK3TypeList` | 获取K3游戏类型列表 | stores/modules/lorrery.ts |
| `getMyK3EmerdList` | `/GetMyK3EmerdList` | 获取K3我的投注记录(分页) | components/Home/AllLotteryGames/K3/MyGameRecord.vue 等2处 |
| `k3GameBetting` | `/K3GameBetting` | K3投注下单 | components/Home/AllLotteryGames/ChangLong/Bet.vue 等2处 |
| `GetRuleByTypeId` | `/GetRuleByTypeId` | 获取WinGo游戏规则 | stores/modules/lorrery.ts |
| `getLastFiveIssueNumberResult` | `/GetLastFiveIssueNumberResult` | 查询WinGo最近5期开奖结果 | views/home/AllLotteryGames/WinGo/index.vue |
| `getLongDragon` | `/GetLongDragon` | 长龙助手投注列表(含WinGo/K3/5D) | components/Home/AllLotteryGames/ChangLong/Bet.vue |
| `winGoGameBetting` | `/GameBetting` | WinGo投注下单 | components/Home/AllLotteryGames/ChangLong/Bet.vue 等2处 |
| `winGoGetEmerdList` | `/GetEmerdList` | WinGo开奖结果趋势图 | views/home/AllLotteryGames/5D/index.vue 等2处 |
| `winGoGetGameIssue` | `/GetGameIssue` | 获取WinGo最新期号 | views/home/AllLotteryGames/WinGo/index.vue |
| `winGoGetMyEmerdList` | `/GetMyEmerdList` | 我的WinGo游戏投注记录 | components/Home/AllLotteryGames/ChangLong/BetRecord.vue 等3处 |
| `winGoGetNoaverageEmerdList` | `/GetNoaverageEmerdList` | 获取WinGo开奖结果(分页) | components/Home/AllLotteryGames/WinGo/GameRecord.vue 等2处 |
| `winGoGetTypeList` | `/GetTypeList` | 获取WinGo游戏类型列表 | stores/modules/lorrery.ts |
| `winGoGetWinTheLotteryResult` | `/GetWinTheLotteryResult` | WinGo用户投注中奖结果 | views/home/AllLotteryGames/WinGo/index.vue |
| `GetTRXRuleByTypeId` | `/GetTRXRuleByTypeId` | 获取TrxWin游戏规则 | stores/modules/lorrery.ts |
| `getTrxWinTheLotteryResult` | `/GetTrxWinTheLotteryResult` | 获取TrxWin用户投注中奖结果 | views/home/AllLotteryGames/WinTrx/index.vue |
| `winTxrGameTRXBetting` | `/GameTRXBetting` | TrxWin投注下单 | views/home/AllLotteryGames/WinTrx/index.vue |
| `winTxrGetEmerdList` | `/GetTRXEmerdList` | TrxWin开奖结果图表趋势 | views/home/AllLotteryGames/K3/index.vue 等2处 |
| `winTxrGetMyEmerdList` | `/GetTRXMyEmerdList` | 我的TrxWin投注记录(分页) | views/home/AllLotteryGames/BettingRecordWinTrx/index.vue 等3处 |
| `winTxrGetTRXGameIssue` | `/GetTRXGameIssue` | 获取TrxWin最新一期期号 | views/home/AllLotteryGames/WinTrx/index.vue |
| `winTxrGetTRXNoaverageEmerdList` | `/GetTRXNoaverageEmerdList` | 获取TrxWin开奖结果列表 | components/Home/AllLotteryGames/WinTrx/GameRecord.vue 等2处 |
| `winTxrGetTRXtypeList` | `/GetTRXtypeList` | 获取TrxWin游戏类型列表 | stores/modules/lorrery.ts |
| `AddFXosoBetting` | `/AddFXosoBetting` | 急速彩(FXoso)投注下单 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `CancelBetOrder` | `/CancelXosoBetOrder` | 取消Xoso投注订单 | components/Home/AllLotteryGames/NewVietnam/MyRecordList.vue |
| `GetFXosoAreaPlay` | `/GetFXosoAreaPlay` | 获取急速彩区域玩法配置信息 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `GetFXosoAreaPlayOdd` | `/GetFXosoAreaPlayOdd` | 获取急速彩玩法及赔率详情 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `GetFXosoIssueNoList` | `/GetFXosoIssueNoList` | 获取急速彩(FXoso)期号列表 | views/home/AllLotteryGames/XoSo/index.vue 等2处 |
| `GetFXosoRecordPageList` | `/GetFXosoRecordPageList` | 急速彩分页用户投注记录 | views/home/AllLotteryGames/NewVietnam/index.vue 等2处 |
| `GetFXosoResult` | `/GetFXosoResult` | 急速彩最近一期开奖结果 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `GetFXosoResultPageList` | `/GetFXosoResultPageList` | 急速彩分页往期开奖结果 | components/Home/AllLotteryGames/NewVietnam/GameRecord.vue 等2处 |
| `GetFXosoUserResult` | `/GetFXosoUserResult` | 获取急速彩用户中奖结果 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `getXosoAreGamePlay` | `/GetXosoAreaPlay` | 获取Xoso区域玩法配置信息 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `getXosoAreaOdd` | `/GetXosoAreaPlayOdd` | 获取Xoso玩法及赔率详情 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `getXosoBase` | `/GetXosoGameBaseData` | 获取Xoso基础数据 | views/home/AllLotteryGames/XoSoRecord/index.vue |
| `xosoBetting` | `/AddXosoBetting` | Xoso投注下单 | views/home/AllLotteryGames/NewVietnam/index.vue |
| `xosoGetDayIssueNoList` | `/GetIssueNoList` | 获取Xoso开奖日期与期号列表 | views/home/AllLotteryGames/NewVietnam/index.vue 等2处 |
| `xosoGetXosoResult` | `/GetXosoResultPageList` | 获取Xoso开奖结果(分页) | components/Home/AllLotteryGames/NewVietnam/GameRecord.vue |
| `xosoGetXosoUserRecord` | `/GetXosoRecordPageList` | 获取Xoso会员投注记录(分页) | views/home/AllLotteryGames/NewVietnam/index.vue 等2处 |

### 4.5 promotion / turntable — 推广返佣 + 大转盘 / 邀请转盘 (10)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `GetAgentServiceList` | `/GetAgentServiceList` | 获取代理专线客服链接 | hooks/useServe.hook.ts |
| `GetPartnerRewards` | `/GetPartnerRewards` | 获取合伙人奖励信息 | hooks/useAgent.hook.ts |
| `GetPartnerRewardsDeatilList` | `/GetPartnerRewardsDeatilList` | 合伙人奖励邀请记录列表 | views/promotion/TeamPartner/Invitation/index.vue |
| `GetPromotionRecord` | `/GetPromotionRecord` | 我的邀请人(下级)记录列表 | views/promotion/Subordinate/index.vue |
| `GetTotalRebateRules` | `/GetTotalRebateRules` | 获取总返佣规则 | views/promotion/PromotionRule/index.vue |
| `PromotionReceiveList` | `/GetCommissionDetails` | 获取用户佣金明细列表 | views/promotion/MyCommission/index.vue 等2处 |
| `getPromotion` | `/NewPromotion` | 推广首页数据(返回完整响应) | views/promotion/index.vue |
| `getPromotionMytem` | `/PromotionMytem` | 获取我的推广邀请列表 | views/promotion/MyInvitation/index.vue |
| `getTeamDayReport` | `/TeamDayReport` | 获取我的团队日报表 | views/promotion/TeamReport/index.vue |
| `promotionTutorial` | `/PromotionTutorial` | 获取佣金规则/推广教程 | views/promotion/RebateRatio/index.vue |

### 4.6 activity — 活动模块(src/api/modules/activity.ts) (1)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `GetUrlAddress` | `/GetUrlAddress` | 获取推广分享链接地址 | hooks/useAgent.hook.ts 等2处 |

### 4.7 arupi — ArUpi 独立支付 / 上传 API(src/api/arupi/) (17)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `CustomerService` | `/ar-wallet/signUp/getCurrentCustomerServiceSystem` | 获取当前客服系统配置 | hooks/arupi/useCustomService.hook.ts |
| `GetAppealKycBankList` | `/ar-wallet/v4/apiCenter/getBanks/forBuyAppeal` | 获取KYC申诉可选银行列表 | views/arupi/kycAppeal/index.vue 等2处 |
| `KycSendMsg` | `/ar-wallet/v4/apiCenter/sendOtp` | KYC验证发送OTP短信 | views/arupi/kycAppeal/index.vue 等2处 |
| `KycVerify` | `/ar-wallet/v4/apiCenter/verifyOtp` | KYC OTP验证(v1) | views/arupi/kycAppeal/index.vue |
| `KycVerifyV2` | `/ar-wallet/v4/apiCenter/confirmPayment` | KYC OTP验证并确认支付(v2) | views/arupi/kycAppeal_v2/index.vue |
| `RechargeAppealExist` | `/ar-wallet/v4/apiCenter/rechargeAppealExist` | 查询是否已提交过充值申诉 | views/arupi/Appeal/index.vue 等3处 |
| `SubmitRechargeAppeal` | `/ar-wallet/v4/apiCenter/submitRechargeAppeal` | 提交充值申诉(附图片/视频) | views/arupi/Appeal/index.vue |
| `cancelPayment` | `/ar-wallet/v4/apiCenter/noPay` | 取消支付订单并上报原因 | hooks/useRecharge.ts 等3处 |
| `cancellationReasonList` | `/ar-wallet/v4/apiCenter/cancellationReasonList` | 获取取消支付原因列表 | hooks/useRecharge.ts 等3处 |
| `confirmAutoPayment` | `/ar-wallet/v4/apiCenter/payWithoutUtr` | 收银台免UTR自动确认支付 | views/arupi/arupi_v2/index.vue |
| `confirmPayment` | `/ar-wallet/v4/apiCenter/subUtr` | 收银台提交UTR确认支付 | views/arupi/index.vue 等2处 |
| `getOrderStatus` | `/ar-wallet/v4/apiCenter/status` | 支付订单状态轮询查询 | hooks/arupi/useOrderStatus.hook.ts |
| `getStayTime` | `/ar-wallet/v4/apiCenter/onPaymentPageExit` | 上报支付页面停留/退出时长 | hooks/arupi/useOrderStatus.hook.ts |
| `paymentDetails` | `/ar-wallet/v4/apiCenter/fetchThirdPartyRechargePageInfoEncryption` | 获取收银台支付页面信息(加密) | views/arupi/index.vue 等2处 |
| `subForWakeUp` | `/ar-wallet/v4/apiCenter/subForWakeUp` | 唤醒第三方支付App时上报 | views/arupi/index.vue 等2处 |
| `PutImage` | `/ar-wallet/v4/apiCenter/generateFileUrl` | 获取文件上传的预签名URL | components/ArUPI/KycUploadImage.vue 等2处 |
| `upLoaderImg` | `PUT {signedUrl} (动态签名URL直传)` | 用签名URL直传(PUT)图片文件到对象存储 | components/ArUPI/KycUploadImage.vue 等2处 |

## 5. 已排除的活动类接口(在用)

以下 **77 个函数**在业务中实际使用,但按要求归入活动类、不计入第 4 节统计。

### home — 首页 / 游戏列表 / 消息公告 / 保险箱(src/api/modules/home.ts) (2)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `GetReWordConfigList` | `/GetGrandAwardConfigList` | 获取电子大奖(Jackpot)奖励配置 | hooks/useJackpot.hook.ts |
| `GetThirdGameAwardRecordPageList` | `/GetHomeGrandAwardPageList` | 获取电子大奖奖励记录分页列表 | views/main/SuperJackpot/star/index.vue |

### user / mine / vip / common / eventTrack — 登录注册 / 我的 / VIP / 通用 / 埋点 (11)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `ConversionRedpage` | `/ConversionRedpage` | 礼品码兑换奖励 | views/main/RedeemGift/index.vue |
| `GetPointMallState` | `/GetPointMallState` | 查询积分商城是否开放 | components/common/use/useIsOpen.ts |
| `getRedpagePageList` | `/GetRedpagePageList` | 获取礼品码兑换记录列表 | views/main/RedeemGift/index.vue |
| `GetOldReturnNewRechargeAwardInfo` | `/GetOldReturnNewRechargeAwardInfo` | 获取回归用户充值奖励信息 | hooks/useGlobalDialog.hook.ts |
| `GetThirdGameRewardsRecordPageList` | `/GetGrandAwardPageList` | 获取电子大奖记录分页列表 | views/main/SuperJackpot/index.vue |
| `SetTaskOrder` | `/SetTaskOrder` | 领取邀请好友任务奖励 | hooks/useBonusPack.hook.ts 等2处 |
| `ThirdGameReceiveGrandPrizeReward` | `/ReceiveGrandAward` | 领取三方游戏电子大奖 | hooks/useBonusPack.hook.ts 等2处 |
| `getReceiveDownAppReward` | `/ReceiveDownAppReward` | 领取APP下载充值奖励 | hooks/useBonusPack.hook.ts 等2处 |
| `getReceiveReturnAwards` | `/ReceiveReturnAwards` | 领取回归奖励 | hooks/useBonusPack.hook.ts 等2处 |
| `getRegisterGift` | `/ReceiveRegisterGift` | 领取注册登录彩金 | components/DialogQueue/dialogs/RewardAmountDialog.vue |
| `getTaskList` | `/GetTaskList` | 获取邀请好友任务列表 | views/main/InvitationBonus/index.vue 等2处 |

### promotion / turntable — 推广返佣 + 大转盘 / 邀请转盘 (5)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `getInvitedWheelInfo` | `/GetInvitedWheelInfo` | 获取邀请转盘活动信息 | hooks/useTurntable.ts |
| `getInvitedWheelRules` | `/GetInvitedWheelRules` | 获取邀请转盘抽奖规则 | views/turntable/components/Rule.vue |
| `getUserInvitedWheelWithdrawList` | `/GetUserInvitedWheelWithdrawList` | 分页获取邀请转盘提现记录 | hooks/useTurntable.ts 等2处 |
| `spinInvitedWheel` | `/SpinInvitedWheel` | 邀请转盘抽奖 | hooks/useTurntable.ts |
| `sumitInvitedWheelWithdraw` | `/SubmitInvitedWheelWithdraw` | 提交邀请转盘提现申请 | components/WithdrawDialog/index.vue |

### activity — 活动模块(src/api/modules/activity.ts) (59)

| 函数 | 端点 | 说明 | 调用方 |
|---|---|---|---|
| `AddPointsLotteryUserAddress` | `/AddPointsLotteryUserAddress` | 添加积分抽奖收货地址 | views/activity/PointMall/AddAddress/index.vue |
| `CancelOrderData` | `/CancelOrderData` | 取消积分商城订单 | views/activity/PointMall/OrderDetail/index.vue |
| `DeletePointsLotteryUserAddress` | `/DeletePointsLotteryUserAddress` | 删除积分抽奖收货地址 | hooks/usePointLottery.hook.ts |
| `GetActiveSetting` | `/GetActiveSetting` | 获取活动开关配置信息 | components/common/use/useActive.ts |
| `GetActivityDetail` | `/GetActivityDetails` | 获取活动详情 | views/activity/ActivityDetail/index.vue |
| `GetActivityList` | `/GetActivityList` | 获取活动列表 | components/Activity/Section/index.vue |
| `GetBannerTypeList` | `/GetBannerTypeList` | 获取积分商城banner分类列表 | components/Activity/PointMall/ProductList/index.vue |
| `GetCurrentActivityLevel1People` | `/GetCurrentActivityLevel1People` | 获取邀请活动一级邀请记录 | views/main/InvitationBonus/Record/index.vue |
| `GetCurrentActivityTasks` | `/GetCurrentActivityTasks` | 获取当前邀请活动任务详情 | views/main/InvitationBonus/Rule/index.vue |
| `GetDailyAwardCount` | `/GetDailyAwardCount` | 获取每日奖励未领取数量 | components/common/use/useActive.ts |
| `GetDailyAwardList` | `/GetDailyAwardList` | 获取每日任务列表 | views/activity/DailyTasks/index.vue |
| `GetDailyAwardRecordList` | `/GetDailyAwardRecordList` | 获取每日任务领取记录 | views/activity/DailyTasks/Record/index.vue |
| `GetDailySignIn` | `/GetContinuousSignInRecharges` | 获取连续签到内容与金额配置 | views/activity/DailySignIn/index.vue 等2处 |
| `GetFirstRechargeList` | `/GetFirstRechargeList` | 获取首充奖励列表(是否展示首充弹窗) | components/common/use/useActive.ts |
| `GetIntegralLogList` | `/GetIntegralLogList` | 获取积分变动记录 | views/activity/PointMall/Record/index.vue |
| `GetPointLotteryUserAddress` | `/GetPointLotteryUserAddress` | 获取积分抽奖用户收货地址 | hooks/usePointLottery.hook.ts |
| `GetPointsLotteryDetails` | `/GetPointsLotteryDetails` | 获取积分抽奖详情 | hooks/usePointLottery.hook.ts |
| `GetPointsLotteryList` | `/GetPointsLotteryList` | 获取积分抽奖列表(分页) | components/Activity/PointMall/ProductList/index.vue 等2处 |
| `GetPointsLotteryOrderList` | `/GetPointsLotteryOrderList` | 获取我参与的积分抽奖列表 | views/activity/PointMall/MyLottery/index.vue |
| `GetPrize` | `/GetPrize` | 领取积分抽奖奖品 | views/activity/PointMall/ReceiveLottery/index.vue |
| `GetProductList` | `/GetProductList` | 获取积分商城商品列表(分页) | components/Activity/PointMall/ProductList/index.vue |
| `GetProductOrderDetails` | `/GetProductOrderDetails` | 获取积分商城订单详情 | views/activity/PointMall/OrderDetail/index.vue |
| `GetProductOrderList` | `/GetProductOrderList` | 获取积分商城兑换订单列表 | views/activity/PointMall/MyOrders/index.vue |
| `GetProductRules` | `/GetProductRules` | 获取积分规则说明 | views/activity/PointMall/Rules/index.vue |
| `GetTreasureChestPopupItems` | `/GetTreasureChestPopupItems` | 获取完成任务后可弹出的宝箱奖励配置 | components/DialogQueue/producers.ts 等2处 |
| `GetUserAddress` | `/GetUserAddress` | 获取积分商城收货地址 | views/activity/PointMall/Redeem/index.vue 等2处 |
| `GetWeeklyAwardList` | `/GetWeeklyAwardList` | 获取每周奖励任务列表 | views/activity/DailyTasks/index.vue |
| `GetWeeklyAwardRecordList` | `/GetWeeklyAwardRecordList` | 获取每周奖励任务领取记录 | views/activity/DailyTasks/Record/index.vue |
| `JoinPointsLottery` | `/JoinPointsLottery` | 参与积分抽奖 | hooks/usePointLottery.hook.ts |
| `OpenTreasureChest` | `/OpenTreasureChest` | 点击开启宝箱领取奖励 | components/DialogQueue/dialogs/TreasureChestQueueDialog.vue 等2处 |
| `ReceiveAllGrandAward` | `/ReceiveAllGrandAward` | 一键领取全部超级大奖 | hooks/useJackpot.hook.ts |
| `ReceiveDailyAward` | `/ReceiveDailyAward` | 领取每日任务奖励 | hooks/useBonusPack.hook.ts 等2处 |
| `ReceiveFirstRechargeReward` | `/ReceiveFirstRechargeReward` | 领取首充奖励 | components/common/use/useActive.ts |
| `ReceiveWeeklyAward` | `/ReceiveWeeklyAward` | 领取符合条件的每周奖励任务 | hooks/useBonusPack.hook.ts 等2处 |
| `SaveUserDayRequest` | `/SaveUserDayRequest` | 保存每周活动奖励每日访问弹窗记录 | components/common/use/useActive.ts |
| `SaveUserGuidelines` | `/SaveUserGuidelines` | 保存新手活动任务新手指引完成情况 | components/common/use/useActive.ts |
| `SetContinuousSinIn` | `/SetContinuousSinIn` | 执行连续在线签到 | views/activity/DailySignIn/index.vue |
| `SetDefaultPointsLotteryUserAddress` | `/SetDefaultPointsLotteryUserAddress` | 设置积分抽奖默认收货地址 | hooks/usePointLottery.hook.ts |
| `SetProductOrder` | `/SetProductOrder` | 提交积分商城兑换订单 | views/activity/PointMall/Redeem/index.vue |
| `UpdatePointLotteryUserAddress` | `/UpdatePointLotteryUserAddress` | 更新积分抽奖收货地址 | views/activity/PointMall/AddAddress/index.vue |
| `UpdateUserAddress` | `/UpdateUserAddress` | 更新积分商城收货地址 | views/activity/PointMall/AddAddress/index.vue |
| `applyFirstCharge` | `/ApplyFirstCharge` | 新会员首存奖励申请领取 | hooks/usePackage.hook.ts |
| `championEntrance` | `/ChampionEntrance` | 获取锦标赛入口信息 | hooks/useChampionship.hook.ts |
| `getChampionTaskDetail` | `/GetChampionTaskDetail` | 获取锦标赛赛事详细信息 | hooks/useChampionship.hook.ts |
| `getChampionTaskList` | `/GetChampionTaskList` | 获取锦标赛赛事列表 | views/activity/Championship/index.vue |
| `getCheckInList` | `/GetContinuousSinInList` | 获取签到记录列表 | views/activity/DailySignIn/Record/index.vue |
| `getGiftPackUserRewardRecord` | `/GetGiftPackUserRewardRecord` | 获取礼包奖励领取记录与配置 | hooks/usePackage.hook.ts |
| `getMyChampionTaskList` | `/GetMyChampionTaskList` | 获取我参与的锦标赛列表 | views/main/MyCps/index.vue |
| `getNewbieGiftPackage` | `/GetNewbieGiftPackage` | 获取新手礼包信息 | views/activity/DailyTasks/index.vue |
| `getNowdayRechargeAmount` | `/GetNowdayRechargeAmount` | 获取当日充值金额(大转盘条件) | hooks/useTurntable.hook.ts |
| `getReceiveGiftPackUserReward` | `/ApplyReceiveGiftPackUserReward` | 申请领取礼包奖励 | hooks/usePackage.hook.ts |
| `getRewardCenterList` | `/GetRewardCenterList` | 获取奖金中心奖励列表 | hooks/useBonusPack.hook.ts |
| `getTop10ChampionTaskDataUserList` | `/GetTop10ChampionTaskDataUserList` | 获取锦标赛前10名会员榜单 | hooks/useChampionship.hook.ts |
| `getTurnTableDraw` | `/TurnTableDraw` | 执行大转盘抽奖 | hooks/useTurntable.hook.ts |
| `getTurnTableInfo` | `/GetTurnTableInfo` | 获取大转盘配置信息 | hooks/useTurntable.hook.ts |
| `getTurnTableRecord` | `/GetTurnTableRecord` | 获取大转盘抽奖记录 | views/activity/Turntable/index.vue |
| `getTurnTableUserRotateNum` | `/GetTurnTableUserRotateNum` | 获取大转盘剩余抽奖次数 | hooks/useTurntable.hook.ts |
| `joinChampionTask` | `/JoinChampionTask` | 报名参加锦标赛 | views/activity/Championship/index.vue |
| `receiveAward` | `/ReceiveAward` | 领取新手礼包奖励 | hooks/useBonusPack.hook.ts 等2处 |

## 6. 未使用接口(死代码候选,已对抗核查确认)

共 **22 个函数**。每一条都经过独立核查 Agent 以函数名、注册键、端点字面量、动态调用、再导出链五路反查,确认零业务引用。

| 分组 | 函数 | 端点 | 说明 |
|---|---|---|---|
| home | `IsCanAppDownload` | `/IsCanAppDownload` | 获取App下载开关 |
| home | `getClicksTopGameList` | `/GetClicksTopGameList` | 获取点击量排行榜游戏列表 |
| home | `getHotGameList` | `/GetHotGameList` | 获取热门游戏列表 |
| home | `getSlotGamesList` | `/GetSlotGamesList` | 获取游戏列表启用状态 |
| home | `getThirdGameCategory` | `/GetThirdGameCategory` | 获取第三方游戏分类 |
| home | `getThirdGameLists` | `/GetThirdGameList \| /GetClicksTopGameList \| /GetThirdGameCategory` | 按type动态分发的全部游戏列表聚合函数 |
| home | `setSafeInto` | `/SetSafeInto` | 保险箱转入 |
| wallet | `GetRechargeChannel` | `/GetRechargeChannel` | 获取随机充值通道 |
| wallet | `GetUserAmount` | `/GetUserAmount` | 一键回收钱包余额 |
| user-mine-vip-common | `GetCodeModel` | `/GetCodeModel` | 获取验证码模式配置 |
| user-mine-vip-common | `GetIsExistGrandPrizeReward` | `/GetIsExistGrandAward` | 查询首页是否存在待领电子大奖 |
| user-mine-vip-common | `ResetGoogleVerify` | `/ResetGoogleVerify` | 重置谷歌验证器 |
| user-mine-vip-common | `checkCaptcha` | `/Validate` | 校验图片验证码 |
| user-mine-vip-common | `getTypeList` | `/GetTypeList \| /GetTRXtypeList \| /GetK3TypeList \| /Get5DtypeList (按GameTypeEnum动态)` | 按彩票游戏类型获取玩法类型列表 |
| user-mine-vip-common | `resetPhoneNum` | `/ResetPhoneNum` | 更换绑定手机号 |
| games | `getXosoWinTheLotteryResult` | `/GetUserResultList` | 获取Xoso用户投注中奖结果 |
| games | `xosoGetVietnamAreList` | `/GetListGameConfig` | 获取越南彩(Xoso)区域游戏类型列表 |
| games | `xosoGetXosoOdds` | `/GetListXosoOdds` | 获取Xoso游戏玩法赔率列表 |
| promotion-turntable | `getPromotionData` | `/NewPromotion` | 推广首页数据(返回data), 与getPromotion同端点的变体 |
| promotion-turntable | `getUrlAddress` | `/GetUrlAddress` | 获取推广地址(返回data的变体) |
| activity | `GetDailyTaskList` | `/GetTaskList` | 获取邀请人任务列表 |
| arupi | `testOrder` | `/ar-wallet/apiCenter/testOrder` | 测试订单接口(无任何调用方) |

**url.ts 孤儿键(键从未被任何模块/业务引用):**

| 键 | 端点 | 核查结论 |
|---|---|---|
| `WinGetWinsUserAmount` | `/GetWinsUserAmount` | 彻底死键:键与端点全仓零引用。唯一近似匹配是类型名 `resGetWinsUserAmount`,但对应调用实际请求的是 `/GetBalance`,与本端点无关。可安全删除。 |
| `GetMaintenanceInfo` | `/GetMaintenanceInfo` | 键是孤儿,但端点仍活跃:`src/views/maintenance/index.vue:62` 以裸字符串调用轮询维护状态,绕过了 api 层。建议改为走统一注册表而非删除。 |

## 7. 特殊发现

1. **裸端点调用仅 1 处**:src/views/maintenance/index.vue:62 的 /GetMaintenanceInfo,以 axios.get(baseURL + extendURL + '/GetMaintenanceInfo') 轮询维护状态,绕过了 api 层,建议收编回统一注册表。其余全部请求均经由 api 体系,无散落端点。
2. **src/api 之外没有任何文件直接 import url.ts**,注册表只被 17 个 api 模块消费,分层干净。
3. **动态调用点已识别并纳入统计**:home.ts 的 getThirdGameLists 为按 type 动态分发的聚合函数(本身未被业务调用)。
4. **同端点多函数**:/NewPromotion(getPromotion 在用 / getPromotionData 未用)、/GetThirdGameList(缓存版与无缓存版并存,均在用)、/GetTaskList(user.ts:getTaskList 在用,activity.ts:GetDailyTaskList 未用——同端点不同注册键)。统计端点数时已去重。
5. **ArUpi 体系** 18 个函数中仅 testOrder(/ar-wallet/apiCenter/testOrder)未使用,是测试遗留。
6. **SaaS 彩票独立体系(src/saasLottery/api/,26 个函数)按要求排除**,未计入上述任何统计。多 Agent 分析结论备查:26 个函数全部在用、零死代码,调用方 100% 隔离在 src/saasLottery 内。

## 8. 附:方法学与可复核性

- 清点 Agent 按 9 个分组并行:home / wallet / user-mine-vip-common / games / promotion-turntable / activity / arupi / saas-lottery / url-orphans(注册表孤儿键 + 直连 + 裸调用扫描)。
- url-orphans Agent 对 348 个注册键逐一做 word-boundary 全仓 grep,并对孤儿候选用端点值做二次反查防漏。
- 任何"未使用"结论都不采信单一 Agent:由第二个对抗性核查 Agent 独立复验后才写入本报告。
