# 提现域 `useWithdraw` 重构设计文档 v3

> 适用范围：`/wallet/Withdraw` 提现域主链路与其直接消费组件。
> 设计结论：**保持一层 `useWithdraw()`**。不拆 `useWithdrawState()`，不把主提现能力拆成多个 composable。
> 代码风格：新增方法使用函数常量风格（`const fn = () => {}`），不使用 `function` 声明；返回值显式列出，不使用 `...` 展开。
> 当前状态：本文档是目标设计与迁移规范，不代表当前代码已经完成迁移。

---

## 1. 设计目的（Purpose & Context）

### 1.1 背景

`/wallet/Withdraw` 是一个以 `type` 驱动的多渠道提现聚合页，覆盖银行卡、UPI、FastUPI、C2C、AR、RSN、USDT、PIX、KBZ/Wave/C4 等入口。当前主提现态分散在三处：

| 来源 | 当前职责 | 问题 |
|---|---|---|
| `src/views/wallet/Withdraw/index.vue` 本地 reactive/ref | 主提现表单、规则、渠道、弹窗、提交、KYC | 文件过大，业务与 UI 状态混杂 |
| `src/hooks/useWithdraw.hook.ts` 模块 ref | 部分共享状态、文本工具 | 能力不完整，只是“半个状态容器” |
| `walletStore` 持久化切片 | `withdrawal`、`withdrawalslist` | 会把 `pwd` 等表单字段扇写进持久化边界 |

重构目标不是“为了抽 hook 而抽 hook”，而是把提现域的状态、核心提交、加载、KYC/OTP、UI 分发统一成一个可审计的领域入口。

### 1.2 需要解决的问题

| 编号 | 问题 | 影响 |
|---|---|---|
| R1 | 提现状态三源同步，靠 watch 扇写 | 状态来源不唯一，调试困难，容易出现旧 `bid/type/amount` |
| R2 | `useWithdraw` 当前没有核心提交、加载 API、KYC 链路 | 名称像领域 hook，实际只是工具函数，接口语义不完整 |
| R3 | `pwd` 随整表单进入持久化 store | 敏感字段落盘风险 |
| R4 | FastUPI KYC 待验证订单缺少 `expireTimestamp/serverTime` 倒计时契约 | KYC 提现中断弹窗无法按后端过期时间展示 |
| R5 | 金额写入路径分散，部分组件“全部”只改局部值 | 用户看到金额变化，但主提交金额未变 |

### 1.3 设计原则

- **一层入口**：只有 `useWithdraw()`，所有提现域能力从这里返回。
- **显式初始化**：`useWithdraw()` 内部不写 `onMounted`；主页面显式调用 `init()`，子组件/Add 页调用 `useWithdraw()` 不会自动拉接口。
- **API 不裸露**：页面不直接消费 `NewSetWithdrawal/GetWithdrawals/...`；hook 对外暴露领域方法。
- **加账户提交不并入主提现提交**：AddBankCard/USDT/PIX/Kbz/Wave/Type4/RsnPay 的表单结构和 API payload 差异大，不统一成主提现提交方法。
- **状态单源**：主提现态只落在 `state`；跨页面选择回填用白名单字段，不再整表单持久化。

---

## 2. 达成目标（Goals & Metrics）

### 2.1 核心目标

| 指标 | 当前 | 目标 |
|---|---|---|
| 提现域 composable 数量 | `useWithdraw` 半成品 + store + 页面本地态 | **1 个 `useWithdraw()`** |
| 主提现表单数据源 | 页面 reactive + hook ref + walletStore | `state.form` |
| 提现规则数据源 | 页面 `ResWithdrawalsL.withdrawalsrule` + hook ref | `state.rule` |
| 渠道列表数据源 | 页面 `withdrawalTypeslist` + hook ref | `state.typeList` |
| 当前账户列表数据源 | 页面 `ResWithdrawalsL.withdrawalslist` + walletStore | `state.bankList` |
| 主提交入口 | `index.vue:onNewSetWithdrawal` | `useWithdraw().onSubmit` |
| KYC 待验证入口 | 页面局部方法 | `useWithdraw().loadPendingKycOrders` |
| `pwd` 持久化 | 有风险 | 禁止落盘，仅内存，成功/关闭后清理 |

### 2.2 非目标

- 不重写后端 API 契约。
- 不重做 UI 视觉。
- 不把 AddBankCard/USDT/PIX/Kbz/Wave/Type4/RsnPay 的提交逻辑统一进主提现提交。
- 不新增 Pinia store。
- 不拆第二层 `useWithdrawState()`。

---

## 3. 对外暴露的抽象接口集合（Logical View）

### 3.1 总体形态

`useWithdraw()` 是提现域唯一 composable。它返回三类能力：

1. **状态**：`state` + UI refs。
2. **领域方法**：加载、切换、金额、提交、KYC/OTP、路由分发。
3. **文本/输入工具**：供 Add 页继续复用 `makeTxt/onLoad/onInput/checkAccoutNo/setUL`。

重要约束：子组件和 Add 页可以调用 `useWithdraw()`，但只消费所需字段；不调用 `init()`，不触发主链路加载。

### 3.2 类型契约

```ts
interface WithdrawState {
  form: ReqNewSetWithdrawal
  rule: withdrawalsruleList
  typeList: ResWithdrawlist[]
  bankList: withdrawalslist[]
}

interface PendingKycOrder {
  withdrawID: number
  withdrawNumber?: string
  bid?: number
  bankCode?: string
  accountNo?: string
  upiAccount?: string
  mobileNO?: string
  mobileNo?: string
  price?: number
  expireTimestamp?: number
  serverTime?: number
  isKycOnline?: boolean
  [key: string]: unknown
}

interface WithdrawRuntime {
  showBottom: Ref<boolean>
  succeedDialogShow: Ref<boolean>
  succeedDialogShowC2c: Ref<boolean>
  noRightTimeDialogShow: Ref<boolean>
  showAllowWithdraw: Ref<boolean>
  showC2c: Ref<boolean>
  rewardPopup: Ref<boolean>
  safeBoxShow: Ref<boolean>
  vrifyOtp: Ref<boolean>
  showQuickTips: Ref<boolean>
  otpCode: Ref<string>
  curBank: Ref<PendingKycOrder | withdrawalslist | Record<string, never>>
  bankCode: Ref<string>
  activeName: Ref<string>
  verify100: Ref<boolean>
  arUpiRecommandBankList: Ref<any[]>
  c2cAward: Ref<number>
  rsnInfo: Ref<{ balance: number; walletActivationStatus: number; walletAddress: string }>
  bankCardList: Ref<any>
  orderNo: Ref<string>
  kycRemainMs: Ref<number>
  kycCountdownText: ComputedRef<string>
}
```

`state.rule` 保持 `{} as withdrawalsruleList` 初始化，不使用 `null`。当前 `BalanceAssetsW/withdrawField/c2cField/wC4Field` 都有裸访问 `.canWithdrawAmount/.minPrice/.maxPrice`，改成 `null` 会造成运行时 TypeError。真正的 null-safe 是后续组件治理，不在本轮一层 hook 收敛中强行引入。

### 3.3 `useWithdraw()` 接口集合（函数常量风格）

```ts
export const useWithdraw = () => {
  return {
    // 单一数据源
    state,

    // 文本/输入工具
    iseditor,
    makeTxt,
    onLoad,
    onInput,
    checkAccoutNo,
    setUL,

    // 金额与清理
    setAmount,
    clearAmount,
    clearPwd,

    // 初始化与加载
    init,
    loadTypes,
    loadRule,
    loadAward,
    loadRsnInfo,
    refreshBalance,

    // 渠道与账户选择
    selectType,
    onSelectWithdrawalType,
    activeBank,
    ontoBankCard,

    // 主提交链路
    validateSubmit,
    submitWithdraw,
    onSubmit,

    // FastUPI KYC / OTP
    loadPendingKycOrders,
    openKycOtp,
    onVerifyOtp,
    onWithdrawaPwd,
    onShowPwdD,
    startKycCountdown,
    stopKycCountdown,

    // UI 分发与路由
    onConfirm,
    changeActive,
    gotoSafe,
    forgetPwd,
    onservice,

    // UI refs
    showBottom,
    succeedDialogShow,
    succeedDialogShowC2c,
    noRightTimeDialogShow,
    showAllowWithdraw,
    showC2c,
    rewardPopup,
    safeBoxShow,
    vrifyOtp,
    showQuickTips,
    otpCode,
    curBank,
    bankCode,
    activeName,
    verify100,
    arUpiRecommandBankList,
    c2cAward,
    rsnInfo,
    bankCardList,
    orderNo,
    kycRemainMs,
    kycCountdownText,
  }
}
```

### 3.4 API 映射

| 前端 API 函数 | 后端接口 | hook 方法 | 入参来源 | 返回消费 |
|---|---|---|---|---|
| `GetWithdrawalTypes` | `/GetWithdrawalTypes` | `loadTypes` | 无 | 写 `state.typeList`，处理默认渠道、保险箱引导、FastUPI KYC 预检查 |
| `GetWithdrawals` | `/GetWithdrawals` | `loadRule` | `state.form.type` | 写 `state.rule/state.bankList`，处理推荐银行、`bankCode`、奖励弹窗、当前账户 |
| `NewSetWithdrawal` | `/NewSetWithdrawal` | `submitWithdraw` | `state.form` | 返回结果码给 `onSubmit` 分发 |
| `GetListNeedKycConnectWithdrawOrder` | `/GetListFastUpiNeedKycConnectWithdrawOrder` | `loadPendingKycOrders` | `{ categoryId: 27 }` | 写 `curBank`，打开 OTP，启动 KYC 倒计时 |
| `setWithdrawalUPIVerifyOtp` | `/setWithdrawalUPIVerifyOtp` | `onVerifyOtp` | `state.form.bid/otpCode/pin` | 提现前 KYC 验证 |
| `setWithdrawalUPIVerifyOtpByWithdrawId` | `/setWithdrawalUPIVerifyOtpByWithdrawId` | `onVerifyOtp` | `curBank.withdrawID/otpCode/pin` | 历史/中断订单 KYC 验证 |
| `GetSettingByKey` | `/GetSettingByKey` | `loadAward` | `C2CWithdrawRewardRate` | 写 `c2cAward` |
| `getRNSWalletInfo` | `/getRNSWalletInfo` | `loadRsnInfo` | 无 | 写 `rsnInfo` |
| `RecoverBalance` | `/RecoverBalance` 或 SaaS 余额接口 | `refreshBalance` | 可选 `isSaasApi` | 写 `state.rule.amount` |

裸 API 不暴露给页面。页面只调用领域方法，避免页面直接知道后端接口细节。

---

## 4. 参数契约与影响范围（Detailed Design）

本章按“字段参数 / 方法参数 / API payload 参数”三层审计。每个参数必须说明其业务作用、直接消费函数、错误影响和解决的问题，避免把字段仅当作类型占位。

### 4.1 `state.form` 参数审计

| 参数 | 数据类型 | 是否必填/可空 | 取值范围与前置条件 | 参数作用 | 使用函数/调用方 | 影响范围 | 解决的问题 |
|---|---|---|---|---|---|---|---|
| `state.form.type` | `number` | 必填，不可空 | 必须来自 `state.typeList[].withdrawID`；初始化可为 `0`，但 `loadRule/submit` 前必须落到有效渠道 | 作为提现渠道主键，决定读取哪套规则、展示哪类账户、提交到哪个提现通道 | `loadRule` 作为 `GetWithdrawals.withdrawid`；`onSelectWithdrawalType/selectType` 写入；`onSubmit` 结果码分发；`ontoBankCard` 路由选择；模板 `v-if` 控制模块展示 | 错误值会加载错规则、错账户列表、错 UI 分支；`0` 未处理会导致 `typeList[0]` 默认选择崩溃或空通道提交 | 消除页面本地 type、hook type、store type 三源分裂 |
| `state.form.bid` | `number` | 账户类提现必填，不可空 | 账户提现必须为当前 `state.bankList[].bid`；无账户时为 `0`；FastUPI 需结合 `bankCode` 过滤后的列表校验 | 标识当前收款账户或 UPI/钱包地址，是提交收款目标 | `activeBank` 反查当前账户；`onShowPwdD` 找 FastUPI KYC 账户；`validateSubmit` 判断按钮可用；`submitWithdraw` 传给 `NewSetWithdrawal`；列表页回填 query `bid` | 过期或错误 `bid` 会展示 A 账户但提交 B 账户，或按钮误禁用/误启用 | 把账户选择回填从持久化 store 改为 hook 单源 |
| `state.form.amount` | `number` | 提交必填，不可空 | 输入阶段允许 `0`；提交时必须 `> 0`，且符合两位小数格式、`rule.minPrice <= amount <= rule.maxPrice`、`amount <= rule.canWithdrawAmount`；`verify100=true` 时必须整百 | 提现金额，所有金额输入组件必须写到该字段 | `setAmount` 唯一写入口；`withdrawField/c2cField/wC4Field/arField` 消费；`validateSubmit` 校验；`submitWithdraw` 传 API；`isActiveC` 计算按钮状态 | 未同步会出现“界面显示已点全部，但提交金额仍为 0/旧值”；错误范围会触发后端拒绝或资金风险 | 收敛 C2C/C4/AR 多组件金额写入分散问题 |
| `state.form.pwd` | `string` | 提交必填；非提交状态可为空 | 只允许保存在内存；打开密码弹窗前清空；提交成功、关闭弹窗、失败结束后调用 `clearPwd` | 提现二级密码，仅参与 `NewSetWithdrawal` 提交 | `PasswordInput` 双向绑定；`validateSubmit` 必填校验；`submitWithdraw` payload；`clearPwd` 清理 | 落入 Pinia persist/localStorage 会造成敏感信息持久化；未清空会复用旧密码 | 切断旧 watch 整表单扇写导致的密码落盘 |
| `state.form.name` | `string \| undefined` | 可选 | 可为空；不得作为渠道名称真值，渠道名称以 `activeName/typeList` 为准 | API 兼容字段，只允许透传，不参与前端展示和业务决策 | `submitWithdraw` 原样透传 | 被错误当作展示名称会造成多语言/渠道名称错乱 | 保持 API 兼容，不扩大使用范围 |
| `state.form.tip` | `string` | 必填，不可空 | 初始化为 `''`，当前主链路不作为决策字段 | 满足 `ReqNewSetWithdrawal` 类型必填契约 | `submitWithdraw` 透传 | 缺失会造成 TS 类型不完整或 API payload 缺字段 | 修复当前 hook 初始化缺少 `tip` 的类型缺口 |

### 4.2 `state.rule` 参数审计

| 参数 | 数据类型 | 是否必填/可空 | 取值范围与前置条件 | 参数作用 | 使用函数/调用方 | 影响范围 | 解决的问题 |
|---|---|---|---|---|---|---|---|
| `state.rule.amount` | `number` | 必填 | `RecoverBalance` 或 `GetWithdrawals` 后端返回；初始化可为 `undefined` 但组件需容错 | 可用余额展示值 | `BalanceAssetsW` 展示与刷新写入 | 空值会展示 `0/NaN` 或刷新写入失败 | 余额刷新从子组件写 prop 改成 hook 统一写规则态 |
| `state.rule.canWithdrawAmount` | `number` | 必填 | `>= 0` | 当前可提现余额上限 | `isActiveC`、`withdrawField`、`c2cField`、`wC4Field`、`arField` | 错误会导致超额提现按钮可用或可提现被误禁用 | 统一所有金额组件的余额上限判断 |
| `state.rule.minPrice` | `number` | 必填 | `>= 0` 且 `<= maxPrice` | 单笔最小提现金额 | `validateSubmit`、`withdrawField`、`c2cField`、`wC4Field`、`arField`、`InstructionsW` | 错误会导致小额提现误放行或误拒绝 | 统一前端提示与提交校验 |
| `state.rule.maxPrice` | `number` | 必填 | `>= minPrice` | 单笔最大提现金额 | `validateSubmit`、`onGetAllAmount` 类逻辑、说明组件 | 错误会导致超限提现误放行或“全部”金额错误 | 统一“全部”金额封顶逻辑 |
| `state.rule.amountofCode` | `number` | 必填 | `>= 0` | 稽核/流水限制提示，非金额输入值 | `withdrawField.validateTxt`、`InstructionsW` | 错误会导致用户看不到提款限制原因 | 保留后端提款限制提示能力 |
| `state.rule.startTime/endTime` | `string` | 必填 | `HH:mm` 或后端现有格式；必须成对存在 | 提现时间窗口展示与 msgCode=220 弹窗文案 | `NoRightTimeDialog`、`InstructionsW` | 空值会导致时间外弹窗显示错误 | 把提现时间说明与规则态绑定 |
| `state.rule.fee` | `number` | 必填 | `0 <= fee <= 1`，当前代码按比例直接计算 | 手续费比例，决定到账金额 | `withdrawField.dz`、`wC4Field.dz`、`InstructionsW` | 错误会造成到账金额展示错误 | 统一到账金额计算依据 |
| `state.rule.withMinPrice/withMaxPrice` | `number` | 必填 | 手续费适用金额区间 | 限定手续费生效范围 | `withdrawField.dz`、`wC4Field.dz`、`InstructionsW` | 错误会导致手续费错误应用 | 避免所有渠道都无条件扣费 |
| `state.rule.uRate` | `number` | USDT 场景必填 | `> 0` | USDT 数量和法币金额换算率 | `withdrawField.calculatedCount/calculatedAmount` | 为 0/空会导致 USDT 数量 `Infinity/NaN` | 固化 USDT 换算前置条件 |
| `state.rule.c2cUnitAmount` | `number \| undefined` | C2C 场景可选 | 未返回时默认 100；存在时必须 `> 0` | 决定 C2C 输入份数到实际提现金额的换算单位 | `c2cField.actualAmount/changeAmount/allAmount`、`InstructionsW` | 错误会造成 C2C 实际提交金额偏差 | 明确 C2C “输入份数 x 单位金额”模型 |
| `state.rule.arbWithdrawRecommand` | `Record<string, any>` | 可选 | 存在时才展示推荐/奖励弹窗 | ARB/ARUPI 推荐奖励配置 | `loadRule` 设置 `rewardPopup`、`content/maxRechargeRifts/ArRechargeRifts` | 错误会误弹奖励引导或奖励比例错 | 把奖励弹窗从页面散落状态收敛到规则派生 |

### 4.3 列表与运行态参数审计

| 参数 | 数据类型 | 是否必填/可空 | 取值范围与前置条件 | 参数作用 | 使用函数/调用方 | 影响范围 | 解决的问题 |
|---|---|---|---|---|---|---|---|
| `state.typeList` | `ResWithdrawlist[]` | 必填，可为空数组 | `loadTypes` 成功后写入；为空时不得访问 `[0]` | 提现渠道列表和默认渠道来源 | `WithdrawalTypes` 渲染；`selectType/onSelectWithdrawalType`；`withdrawField.quickList`；`loadTypes` 默认选择 | 空数组未保护会导致进页崩溃；错误列表会缺失渠道 | 统一渠道列表来源 |
| `state.bankList` | `withdrawalslist[]` | 必填，可为空数组 | `loadRule` 成功后写入；FastUPI 需按 `bankCode` 过滤派生 | 当前渠道下的收款账户集合 | `activeBank`、`c2cUpi`、`wC4Id`、列表页回填 | 账户列表过期会造成 `bid` 失效或选错账户 | 替代 `walletStore.getWithdrawalslist` 缓存 |
| `bankCode` | `Ref<string>` | FastUPI 场景必填；其他场景可空 | 必须来自 `arUpiRecommandBankList[].bankCode` 或 route query | FastUPI 推荐银行/支付方式过滤条件 | `bankList` 派生过滤；`UpiQuickTypes`；`FastUpi` 回填；`onVerifyOtp` 展示 | 错误会筛空 FastUPI 账户或提交到错误银行 | 解决 FastUPI 多银行子类型选择问题 |
| `curBank` | `Ref<PendingKycOrder \| withdrawalslist \| {}>` | KYC/OTP 弹窗打开时必填 | 必须包含 `bid` 或 `withdrawID`；`slice` 需 `bankCode='slice'` | 当前 OTP 验证对象 | `openKycOtp` 写入；`otp.vue` 展示；`onVerifyOtp` 判断走 `bid` 还是 `withdrawId` 验证 | 缺字段会导致 OTP 发错对象或验证 API 参数缺失 | 统一“提现前验证”和“历史/中断订单验证”两条链路 |
| `curBank.expireTimestamp` | `number \| undefined` | KYC 待验证订单必填 | 毫秒时间戳，必须大于等于 `serverTime` | KYC 过期截止时间 | `startKycCountdown` | 缺失则无法实现提现中断倒计时 | 对齐后端新增 KYC 字段 |
| `curBank.serverTime` | `number \| undefined` | KYC 待验证订单必填 | 毫秒时间戳，后端当前时间 | 倒计时校准基准 | `startKycCountdown` | 直接用本地时间会受设备时间漂移影响 | 确保套壳包/native 包时间一致 |
| `kycRemainMs` | `Ref<number>` | KYC 弹窗打开时必填 | `0 <= kycRemainMs <= expireTimestamp - serverTime` | KYC 弹窗剩余毫秒数 | `kycCountdownText`、OTP 弹窗倒计时 UI | 错误会提前关闭或超时后仍可验证 | 提供组件层只读倒计时状态 |
| `otpCode` | `Ref<string>` | 验证时必填 | 6 位数字，关闭/成功后清空 | 用户输入的 OTP 验证码 | `otp.vue v-model`、`onVerifyOtp` | 未清空会复用旧验证码；为空会提交失败 | 统一 OTP 生命周期 |
| `verify100` | `Ref<boolean>` | 必填 | 来自渠道 `need100 === true` | 控制金额是否必须整百 | `isActiveC`、`withdrawField`、`wC4Field` | 错误会误放行非整百金额 | 把渠道级金额规则从组件散落状态提升 |
| `activeName` | `Ref<string>` | 可空 | 来自当前 `typeList` item.name | 电子钱包/RSN/C4 展示名称 | `RsnType/wC4Id/wC4Field/InstructionsW` | 错误会展示错通道名称 | 避免用 `state.form.name` 充当展示名称 |

### 4.4 方法参数审计

| 方法 | 参数 | 参数类型 | 是否必填/可空 | 参数作用 | 使用函数/调用方 | 错误影响 | 解决的问题 |
|---|---|---|---|---|---|---|---|
| `setAmount(value)` | `value` | `number` | 必填，不可空 | 唯一写入 `state.form.amount` 的入口 | `withdrawField` 输入；`c2cField/wC4Field/arField` 输入和“全部”按钮 | 不走该入口会出现局部金额和提交金额不一致 | 消除金额多源写入 |
| `selectType(item)` / `onSelectWithdrawalType(item)` | `item` | `ResWithdrawlist` | 必填 | 代表用户选择的新提现渠道 | `WithdrawalTypes @onSelectWithdrawalType` | 缺 `withdrawID` 会无法加载规则；缺 `need100/name` 会丢金额规则/展示名 | 把切渠道副作用集中：清金额、清账户、加载规则 |
| `openKycOtp(item)` | `item` | `PendingKycOrder \| withdrawalslist` | 必填 | 当前需要验证的 FastUPI 账户或待验证提现单 | `loadPendingKycOrders`、`onShowPwdD`、FastUPI 选择页 | 缺 `bid/withdrawID` 会导致验证 API 选错；缺时间戳无法倒计时 | 统一 KYC 弹窗打开入口 |
| `onVerifyOtp(pin)` | `pin` | `string` | `slice` 必填，其他银行可空字符串 | FastUPI 特定银行 PIN，和 OTP 一起提交 | `otp.vue @confirm` | 历史记录验证漏传会导致 `slice` 验证失败 | 修复 OTP 组件 confirm 参数被丢弃的问题 |
| `startKycCountdown(expireTimestamp, serverTime)` | `expireTimestamp` | `number` | 必填 | KYC 截止毫秒时间戳 | `openKycOtp` | 小于 `serverTime` 会立即关闭弹窗 | 实现 KYC 提现中断弹窗倒计时 |
| `startKycCountdown(expireTimestamp, serverTime)` | `serverTime` | `number` | 必填 | 后端当前毫秒时间戳，用于校准剩余时间 | `openKycOtp` | 使用本地时间会因设备时间错误导致倒计时不准 | 适配 H5、套壳包、native 包时间差异 |
| `onConfirm(type)` | `type` | `'c2c' \| undefined` | 可空 | 区分普通提现成功和 C2C 成功弹窗 | 成功弹窗确认按钮 | 错误会把 C2C 跳到普通提现记录或不跳详情 | 保留当前成功弹窗分流行为 |
| `refreshBalance(isSaasApi)` | `isSaasApi` | `boolean` | 可选，默认 false | 指定是否强制走 SaaS 余额接口 | 余额刷新按钮/初始化扩展 | 错误会读错余额源 | 对齐 `RecoverBalance(isSaasApi=false)` 当前 API 设计 |

### 4.5 API payload 参数审计

| API/hook 方法 | payload 参数 | 数据类型 | 必填/可空 | 参数作用 | 直接消费 | 影响范围 | 解决的问题 |
|---|---|---|---|---|---|---|---|
| `GetWithdrawals` / `loadRule` | `withdrawid` | `number` | 必填 | 当前提现渠道 ID，来自 `state.form.type` | 后端返回当前渠道账户列表和规则 | 错误会加载错通道规则和账户 | 把规则加载绑定到单一 `type` 来源 |
| `NewSetWithdrawal` / `submitWithdraw` | `amount` | `number` | 必填 | 提现金额，来自 `state.form.amount` | 后端创建提现订单 | 错误会造成资金金额错误 | 统一金额校验后再提交 |
| `NewSetWithdrawal` / `submitWithdraw` | `pwd` | `string` | 必填 | 提现密码，来自 `state.form.pwd` | 后端验证提现权限 | 空值提交失败，落盘有安全风险 | 限定敏感字段生命周期 |
| `NewSetWithdrawal` / `submitWithdraw` | `type` | `number` | 必填 | 提现渠道 ID | 后端路由到具体提现通道 | 错误通道会创建错误订单 | 保证提交通道与页面选中一致 |
| `NewSetWithdrawal` / `submitWithdraw` | `bid` | `number` | 必填 | 收款账户 ID | 后端绑定提现账户 | 错误会提现到错误账户 | 保证账户回填和提交一致 |
| `GetListNeedKycConnectWithdrawOrder` / `loadPendingKycOrders` | `categoryId` | `number` | 必填，固定 `27` | FastUPI KYC 分类 ID | 后端返回需 OTP 验证的 FastUPI 关联提现单 | 错误会查不到待验证订单或查错分类 | 把 KYC 预检查限定在 FastUPI 场景 |
| `setWithdrawalUPIVerifyOtp` / `onVerifyOtp` | `bid` | `number` | 提现前验证必填 | 当前 FastUPI 账户 ID | 后端验证账户 KYC OTP | 缺失会无法验证当前账户 | 区分提现前验证和历史订单验证 |
| `setWithdrawalUPIVerifyOtpByWithdrawId` / `onVerifyOtp` | `withdrawId` | `number` | 待验证订单必填 | 历史/中断提现单 ID | 后端验证指定提现单 KYC OTP | 缺失会验证不到中断订单 | 支持 KYC 提现中断恢复 |
| `setWithdrawalUPIVerifyOtp*` / `onVerifyOtp` | `smsCode` | `string` | 必填 | 用户输入 OTP 验证码 | 后端 OTP 校验 | 空值或旧值会验证失败 | 统一 OTP 清理和提交 |
| `setWithdrawalUPIVerifyOtp*` / `onVerifyOtp` | `pin` | `string` | `bankCode='slice'` 必填 | 特定银行二次 PIN | 后端 FastUPI slice 校验 | 漏传会导致 slice KYC 验证失败 | 补齐历史记录 OTP 验证链路 |
| `setWithdrawalUPIVerifyOtp*` / `onVerifyOtp` | `categoryId` | `number` | 必填，固定 `27` | FastUPI 分类 ID | 后端区分 OTP 场景 | 错误会按非 FastUPI 场景校验 | 固定 KYC OTP 场景边界 |

---

## 5. 运行视图与控制流（Process View）

### 5.1 初始化

```ts
const init = async () => {
  resetSessionFields()       // 清 amount/pwd，保留必要 type/bid 记忆
  await getUserInfo()
  await getRegisterState()
  applyRouteBid()
  await loadTypes()
  await loadRule()
  await loadAward()
}
```

关键点：

- `init()` 只能由主提现页调用。
- `loadTypes()` 返回空列表时必须停止后续默认选中，不能访问 `typeList[0]`。
- 如果渠道包含 FastUPI `27`，调用 `loadPendingKycOrders()`，不再依赖用户切到 27 才检查。

### 5.2 加载规则

```ts
const loadRule = async () => {
  const res = await AwaitApiResult(GetWithdrawals({ withdrawid: state.form.type }))
  if (!res) return
  state.rule = res.data.withdrawalsrule || ({} as withdrawalsruleList)
  state.bankList = res.data.withdrawalslist || []
  arUpiRecommandBankList.value = res.data.arUpiRecommandBankList || []
  syncBankCode()
  syncLastBandCarkName(res.data.lastBandCarkName)
  activeBank()
  showRewardIfNeeded(res.data.withdrawalsrule)
}
```

### 5.3 主提交

```ts
const onSubmit = useDebounceFn(async () => {
  if (!validateSubmit()) return
  setLoading(true)
  const res = await submitWithdraw()
  setLoading(false)
  if (!res) return

  if (res.code !== 0 && res.msgCode === 220) openNoRightTimeDialog()
  else if (res.code !== 0 && res.msgCode === 280) routeToC2cDetailIfNeeded(res.data)
  else if (res.code !== 0 && res.msgCode === 1009) openWithdrawBlockedDialog()
  else if (res.code !== 0 && res.msgCode === 287) await loadRule()
  else openSuccessDialog(res.data)

  clearPwd()
}, 500)
```

提交拆分规则：

- `validateSubmit()`：只做本地规则校验和 toast。
- `submitWithdraw()`：只调 `NewSetWithdrawal` 并返回结果。
- `onSubmit()`：负责防抖、loading、结果码、弹窗、路由。

### 5.4 FastUPI KYC 待验证订单

```ts
const loadPendingKycOrders = async () => {
  const res = await GetListNeedKycConnectWithdrawOrder({ categoryId: 27 })
  if (res?.code !== 0) return
  const item = res.data?.[0]
  if (!item) return
  openKycOtp(item)
}

const openKycOtp = (item: PendingKycOrder) => {
  curBank.value = item
  otpCode.value = ''
  vrifyOtp.value = true
  if (item.expireTimestamp && item.serverTime) {
    startKycCountdown(item.expireTimestamp, item.serverTime)
  }
}
```

倒计时契约：

- `expireTimestamp/serverTime` 为毫秒时间戳，只在 KYC 场景出现。
- 剩余时间用 `expireTimestamp - serverTime` 初始化，再按本地 elapsed 修正，不直接信任客户端当前时间。
- 倒计时归零时关闭 OTP 弹窗、清 `otpCode`、停止定时器，并刷新待验证订单。

```ts
const startKycCountdown = (expireTimestamp: number, serverTime: number) => {
  stopKycCountdown()
  const startedAt = Date.now()
  const baseRemain = Math.max(0, expireTimestamp - serverTime)
  kycRemainMs.value = baseRemain
  kycTimer.value = window.setInterval(() => {
    kycRemainMs.value = Math.max(0, baseRemain - (Date.now() - startedAt))
    if (kycRemainMs.value === 0) {
      stopKycCountdown()
      vrifyOtp.value = false
      otpCode.value = ''
      loadPendingKycOrders()
    }
  }, 1000)
}
```

### 5.5 OTP 验证

```ts
const onVerifyOtp = async (pin = '') => {
  const isPendingWithdraw = typeof curBank.value.withdrawNumber === 'string'
  const request = isPendingWithdraw
    ? setWithdrawalUPIVerifyOtpByWithdrawId({
        withdrawId: curBank.value.withdrawID,
        smsCode: otpCode.value,
        categoryId: 27,
        pin,
      })
    : setWithdrawalUPIVerifyOtp({
        bid: state.form.bid,
        smsCode: otpCode.value,
        categoryId: 27,
        pin,
      })

  const res = await AwaitApiResult(request)
  otpCode.value = ''
  if (!res) return
  stopKycCountdown()
  vrifyOtp.value = false
  if (isPendingWithdraw) {
    await loadPendingKycOrders()
    await loadRule()
  } else {
    showQuickTips.value = true
  }
}
```

`pin` 必须从 `otp.vue @confirm` 原样传入。`slice` 类型验证依赖 `pin`，不能在历史记录验证链路里丢失。

---

## 6. 当前代码已确认问题（迁移前置或并行修复）

| 级别 | 文件 | 问题 | 处理要求 |
|---|---|---|---|
| 高 | `Type4/index.vue`、`RsnPay/index.vue` | `find` 回调缺 `return`，返回主页面时 `bid` 永远为 0 | 先修 |
| 高 | `c2cField.vue`、`wC4Field.vue`、`Ar/arField.vue` | “全部”只改局部金额，没有回写主提交金额 | 并入 `setAmount` |
| 高 | `WithdrawHistory.vue` | KYC OTP 验证未传 `pin` | 先修 |
| 高 | `AddUpi/index.vue`、`AddFastUpi/index.vue` | 手机号预填写入 `number`，模板绑定 `UPIForm.mobileNo`，且 `JSON.parse` 无保护 | 先修 |
| 中 | `AddType4/index.vue` | 23/24 直接取 `banklist[0]`，空列表崩溃 | 加空数组保护 |
| 中 | `AddRsnPay/index.vue` | 成功后连续两次 `router.replace` | 明确目标页，保留一个 |
| 中 | `C2cDetail/index.vue` | `JSON.parse(ossUrls)` 无保护 | try/catch 或安全解析 |
| 中 | `c2cRecordList.vue`、`c2cDetailOther.vue` | 多个倒计时共用时间源或方向不清晰 | 拆分 timer/state |

这些问题不是 hook 拆分本身造成，但会影响重构验收。迁移前不处理，会把既有 bug 带进新架构。

---

## 7. 迁移步骤

### S1：重写 `useWithdraw.hook.ts`

- 建立模块级 `state`。
- 建立模块级 UI refs。
- 保留文本工具：`makeTxt/onLoad/onInput/checkAccoutNo/setUL/iseditor`。
- 新增主链路方法：`init/loadTypes/loadRule/validateSubmit/submitWithdraw/onSubmit`。
- 新增 KYC 方法：`loadPendingKycOrders/openKycOtp/onVerifyOtp/startKycCountdown/stopKycCountdown`。

### S2：主页面迁移

- `index.vue` 删除本地 `data_NewSetWithdrawal/ResWithdrawalsL/withdrawalTypeslist`。
- 模板绑定替换为 `state.form/state.rule/state.bankList/state.typeList`。
- `onMounted(init)` 显式触发初始化。
- 删除 `walletStore.setWithdrawal` 扇写 watch。

### S3：子组件金额写入统一

- `withdrawField/c2cField/wC4Field/arField` 统一调用 `setAmount`。
- 所有“全部”按钮必须走 `setAmount`，不能只改局部 `amount`。

### S4：列表页与选择页回填

- BankCard/USDT/PIX/UPI/FastUPI/Type4/RsnPay 返回主页面时只传白名单 query：`bid/type/bankCode`。
- 主页面通过 `init/applyRouteBid/loadRule/activeBank` 恢复状态。

### S5：Add 页工具消费

- Add 页继续调用 `useWithdraw()`，只取 `iseditor/onLoad/makeTxt/onInput/checkAccoutNo/setUL`。
- Add 页不调用 `init()`，不触发主提现 API。
- Add 页的提交 API 仍留在各自页面，避免把不同 payload 强行统一。

---

## 8. 验收标准

### 8.1 静态验收

- `rg "useWithdrawState" src` 无结果。
- `rg "walletStore.setWithdrawal" src/views/wallet/Withdraw src/components/Wallet/Withdraw` 无主提现扇写。
- `rg "data_NewSetWithdrawal =" src/views/wallet/Withdraw/index.vue` 无本地主表单定义。
- `rg "NewSetWithdrawal" src/views/wallet/Withdraw/index.vue` 无结果，提交 API 只在 hook 内。
- `rg "GetListNeedKycConnectWithdrawOrder" src/views/wallet/Withdraw/index.vue` 无结果，KYC API 只在 hook 内。

### 8.2 行为验收

| 场景 | 预期 |
|---|---|
| 普通银行卡提现 | 选择账户、输入金额、密码提交成功，成功弹窗仍跳记录 |
| UPI/FastUPI 提现 | `bid/type/bankCode` 回填正确 |
| FastUPI 待 KYC 订单 | 进入提现页自动弹 OTP，显示 `expireTimestamp/serverTime` 倒计时 |
| FastUPI `slice` | OTP 验证带 `pin` |
| C2C 提现 | 金额、奖励、成功弹窗、详情跳转保持原行为 |
| AR/C4/C2C 点“全部” | 主提交金额同步更新 |
| 提现时间外 | `msgCode=220` 弹不在提现时间 |
| 未完成订单 | `msgCode=280` 跳 C2C 详情 |
| 规则刷新 | `msgCode=287` 后重新 `loadRule` |
| 二次进入提现页 | `amount/pwd` 清空，`type/bid` 按白名单恢复 |

### 8.3 回归命令

```bash
NODE_ENV=sit npx vite --mode sit build
```

如只做文档变更，不需要跑构建；代码迁移开始后必须使用 SIT 构建路径验证。

---

## 9. 最终结论

提现域应收敛为**一层 `useWithdraw()`**：

- 一层不是“只放状态”，而是“提现域唯一入口”。
- 主提现 API、核心提交、KYC/OTP、倒计时、结果码 UI 分发都属于 `useWithdraw()`。
- Add 页提交不属于主提现提交，不进入统一 submit。
- `init()` 显式调用，避免子组件调用 hook 时重复拉接口。
- `expireTimestamp/serverTime` 是 FastUPI KYC 场景的强契约，必须进入 hook 的 KYC 倒计时状态。

按这个方向，`index.vue` 可以退化为模板绑定与 `onMounted(init)`，提现核心行为进入一个可测试、可审计、职责完整的领域 hook。
