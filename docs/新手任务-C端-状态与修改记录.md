# 新手任务 · C 端（H5 每日任务页「新手」页签）状态与修改记录

> 5190 活动原型没有 ChangeLogFab / PageManual 悬浮组件，本文件同时充当该页的修改记录、状态档案和功能说明书。最新在上。

## 2026-10-06（二）三张卡按 V1 真实规则修正

**起因**：用户指出「绑定手机/邮箱」卡的条件（任一即可、手机邮箱两行奖励）与 V1 不符。

**V1 真实规则**（源码：会员接口 `UsersController` 绑定奖励显示段、`UsersService.UpdateUserName2`；后台设置页 BindReward）：
- 绑定手机/邮箱：只奖励「注册时没用的那一个」。手机号注册→绑邮箱领「邮箱奖励」；邮箱注册→绑手机领「手机奖励」。一次性，绑定成功自动到账（没有待领取），已绑过、同 IP 重复注册、同名银行卡被别人绑过则奖励为 0。后台配置键 BindEmailGiftMoney / BindPhoneGiftMoney（Value1=开关，Value2=金额）、BindRewardCodeAmount（打码倍数，本卡未展示）。
- 下载 APP 充值：表 tab_DownAppUserRecord，状态 0 已下载未充值 / 1 已充值待领取 / 2 已领取；**单笔**充值≥后台「充值金额」才变待领取（不累计，V1 无进度数字）；手动领取；对象范围（全部/新会员/老会员回归/指定会员）、同 IP/同设备限制由后台配置；后台键 DownAppRechargeAmount / DownAppBonusAmount / IsShowDownAppBonusAmountSwitch。
- 绑定银行卡：后台有「首次绑卡赠送」设置（键 AddBankGiveAway，只有赠送金额一项）；会员接口源码里没找到对应发放代码，领取方式 V1 查不到，沿用手动领取演示。

**本次改动**：
- 绑定手机/邮箱卡：一张卡、一行奖励，标题随注册方式变为「绑定邮箱有奖」/「绑定手机有奖」；条件文案「首次绑定邮箱/手机，一次性，绑定成功自动到账」；状态只有未完成/已领取（演示「待领取」时仍显示未完成）；对应奖励开关关闭则整张卡不出现；去完成：绑邮箱→绑定邮箱页，绑手机→修改手机页。
- 下载 APP 卡：条件文案改为「下载APP后单笔充值满X，达标后手动领取」；去掉「X/门槛」进度数字和「部分完成」状态（V1 只认单笔、不累计）。
- 银行卡卡：文案不变。
- 控制台「新手任务」：新增「会员注册方式」（手机号注册/邮箱注册）；去掉「部分完成」状态；预设「邮箱注册·绑手机」替换原「部分完成」；手机/邮箱开关含义改为对应注册方式的那张卡的开关。
- 接口 `GetNewbieTaskList` 的 bindContact 多返回 `bindType`（email/phone），downloadApp 多返回 `threshold`，progress 一律 null。

**改动文件**：`entrance/prototype/mock/handlers/dailyTasks.ts`、`entrance/prototype/public/catalog.json`、`src/views/activity/DailyTasks/index.vue`、`src/languages/modules/zh.ts / en.ts / hd.ts`。

**验证**：`pnpm build` 通过；浏览器实测默认（手机号注册→绑定邮箱卡 ₹2）、邮箱注册已领取（绑定手机卡 ₹3，三张卡置灰）、绑定邮箱「去完成」跳绑定邮箱页，控制台无报错。

**后台对齐**：后台新手任务页的手机/邮箱各一项开关+金额，与 V1 配置键含义一致，本窗口未改后台；仅提醒后台「手机/邮箱」展示说明可补一句「按会员注册方式只发其中一项」。

**待用户决定**：银行卡奖励 V1 无发放代码，是否保留「手动领取」演示；新手礼包卡演示数据（1/1、₹88）与后台（7 天×8）不一致仍待定。

## 2026-10-06 三张新手任务卡改走模拟接口

**页面**：`http://localhost:5190/#/activity/DailyTasks?sub=newbie`；控制台左栏「新手任务（绑定手机邮箱/绑定银行卡/下载APP充值）」。

**与后台对应**（Ar_V3 任务管理 > 新手任务，四项：新手礼包 / 绑定手机邮箱有奖 / 绑定银行卡有奖 / 下载APP充值奖励）：
- 新手礼包：沿用页面原有的新手礼包卡，本次未动（演示数据 1/1、₹88，与后台 7 天×8 不一致，见下方待定）。
- 绑定手机/邮箱有奖：一张卡，奖励分「手机」「邮箱」两行，各有启用开关与金额；两项都关则整张卡不显示。去完成 → 设置中心 · 修改手机（`SettingCenter-UpdatePhone`）。
- 绑定银行卡有奖：一张卡，一行奖励。去完成 → 添加银行卡（`Withdraw-AddBankCard`）。
- 下载 APP 充值奖励：条件为「APP 单笔充值 ≥ 门槛」，进度 `当前/门槛`；可选「显示赠送金额」，关闭时卡上不出现赠送金额行。去完成 → 下载 APP 提示（`downAppTip('Recharge')`）。
- 状态：0 未完成（去完成）、1 待领取（领取）、2 已领取。领取后弹「成功领取」并刷新卡片和红点。

**改动文件**：
- `src/api/url.ts`、`src/api/modules/activity.ts`：新增 `GetNewbieTaskList`、`ReceiveNewbieTask`（仅原型用，等真实后端）。
- `src/views/activity/DailyTasks/index.vue`：三张卡改读接口；`NEWBIE_TASK_META` 管徽章/条件文案/跳转；`clickNewbieExtra` 处理去完成/领取。
- `entrance/prototype/mock/handlers/dailyTasks.ts`：新增 `newbieTaskList`、`receiveNewbieTask` 并登记路由。
- `entrance/prototype/public/catalog.json`：新增清单项与 `activities.newbieTasks`（参数：状态、手机/邮箱开关与金额、银行卡金额、APP 门槛与金额、显示赠送金额；5 个一键场景）。
- `src/languages/modules/zh.ts`、`en.ts`、`hd.ts`：删除用不上的写死文案键，补三语徽章/条件文案。

**保留上一窗口的成果**：新手页签、页签角标、三色徽章、条件文案、手机/邮箱两行奖励、去完成跳转、中英文文案。

**验证**：`pnpm build` 通过；浏览器实测默认（4 张卡）、进行中（手机行、无赠送行、60/100）、待领取并领取（弹窗 ₹5.00 → 已领取）、去完成跳到添加银行卡与修改手机页。

**待用户决定**（均未改动；第 1、2 条已被上一节按 V1 取代）：
1. （已取代）绑定手机/邮箱改为按注册方式单行。
2. （已取代）下载 APP 不再显示进度。
3. 新手礼包卡演示数据（1/1、₹88）与后台配置（7 天×8）不一致。
4. 下载 APP「显示赠送金额」后台种子默认关，C 端控制台默认开（便于展示）。
5. 后台三项（手机邮箱/银行卡/下载 APP）默认是自动发放，C 端仍演示「待领取」状态。
