# 活动中心改版设计方案（2026-09-22）

## 背景

Eason 基于 Figma 设计稿（`活动.png`，750×2992）给出活动页改版的完整、逐项、带精确像素值的规格，并已就三点关键歧义当场拍板：

1. 任务并入活动页做切换，原「点图标进独立任务页」的路不留。
2. 第 6 个图标是普通幸运大转盘（v1 后台「大转盘配置」），不是邀请转盘。
3. 本次只做活动页；任务页签内各子页签的样式改版是下一张卡，本次不动。

规格本身已经是完整设计产物（结构、尺寸、颜色、交互全部给出），不存在需要通过问答挖掘的模糊意图；本文件把它落成 superpowers 流程要求的设计文档存档，不重复推导。

## 架构决策

### 1. 活动/任务顶部切换

- 新增 `ActivitySwitchTabs.vue`：受控组件，`active` prop + `switch` emit，两态 `'activity' | 'task'`。
- 状态放在 `Section/index.vue`，与路由 query `tab` 双向同步（`router.replace`，不压 history），刷新后保持页签。
- 「任务」内容用 `defineAsyncComponent` 懒加载 `src/views/activity/DailyTasks/index.vue`，首次切到「任务」才挂载（`v-if="hasOpenedTask"` + `v-show` 保留状态，避免反复切换丢失滚动/表单状态）。
- `DailyTasks/index.vue` 新增 `embedded` prop：为真时隐藏其自身 `NavBar` 与顶部大图 banner，只保留子页签条 + 列表 + 弹窗（子页签内部逻辑与样式本次不动）。

### 2. 图标行

- 复用现有 `ActivityEntryGrid.vue`，仅保留图标网格（`.activity-panel-header`），移除内嵌的「礼物兑换」「每日签到」两张卡（`.activity-panel-content`），因为它们被下面两项替代/移除。
- 第 1 个图标（活动奖励）点击改为切到本页「任务」页签（不再 `router.push('DailyTasks')`）。
- 第 6 个图标改名「大转盘」，跳转目标由 `turntable`（邀请转盘路由）改为 `Turntable`（`/activity/Turntable`，已确认是普通大转盘，经代码核实其 `useTurntable.hook.ts`/`@lucky-canvas` 实现与邀请转盘的 `useTurntable.ts`/pixi.js 实现是两套不同代码）。

### 3. 礼物兑换卡（新组件 `GiftExchangeCard.vue`）

- 输入 8 位兑换码 + 「领取奖励」按钮，直接复用 `src/views/main/RedeemGift/index.vue` 已在用的 `ConversionRedpage` 接口（同一 mock 假数据源），成功走 `showSuccessToast`，失败在卡片内展示固定文案「兑换码错误，请重新输入」（不弹全局 dialog，简化掉原页面按 msgCode 区分四种失败文案的展示，只统一提示一行）。
- 「查看记录」跳转 `RedeemGift` 路由（无独立记录页，符合任务说明的兜底选项）。

### 4. 活动筛选 + 列表（新组件 `ActivityFilterTabs.vue`，改造 `ActivityBannerList.vue`）

- mock 数据（`entrance/prototype/mock/handlers/activityCenter.ts`）给现有 6 条 banner 各加 `category`（`recharge`/`game`/`newUser`）与 `tag`（`hot`/`recommend`/`new`/空）两个机器可读枚举字段；标签展示文案通过组件层 `$t()` 映射（与筛选 Tab 同口径），不in mock 里存本地化文案，避免和 i18n 体系重复维护。
- `Section/index.vue` 按 `activeCategory` 过滤后传给 `ActivityBannerList`。
- 锦标赛条目（`contents === '/activity/Championship'`）在图片右侧叠加「倒计时」「最高奖金」两个小框，数据复用 Section 里已有的 `championEntranceVO`（`useChampionship()`），仅在 `state === 1`（进行中）时显示；不额外起定时器，按当前时刻与 `endTime` 的差值一次性计算（与入口卡片 `card.vue` 各自独立展示，互不影响）。

### 5. 既有「锦标赛入口卡」(`cardBox`/`Card` 组件) 的去留

设计稿未画出这张独立卡片，任务规格的 7 条改动点里也没有提到它；本次判断为**保留不动**（放在图标行和礼物兑换卡之间，与原代码顺序一致），因为它是既有能完整工作的功能块，删除属于任务未点名的范围扩张。已在待确认事项中向 Eason 说明，如需去掉或挪位置需另行确认。

## 涉及文件

- 新建：`src/components/Activity/Section/ActivitySwitchTabs.vue`、`ActivityFilterTabs.vue`、`GiftExchangeCard.vue`
- 改造：`src/components/Activity/Section/index.vue`、`ActivityEntryGrid.vue`、`ActivityBannerList.vue`、`src/views/activity/DailyTasks/index.vue`（加 `embedded` prop）
- mock：`entrance/prototype/mock/handlers/activityCenter.ts`（banner 加 category/tag）
- 控制台：`entrance/prototype/public/catalog.json`（4 条落在「每日任务页」的入口 target 改为 `/activity?tab=task`）
- i18n：`src/languages/modules/{zh,en,hd}.ts` 新增少量固定文案 key（任务页签、新人筛选、标签文案、兑换卡文案、大转盘图标文案）

## 不做的事

- 任务页签内子页签（新手礼包/每日/每周/周卡/月卡）的样式改版——下一张卡。
- 头部奖金区域结构调整——只核对不改。
