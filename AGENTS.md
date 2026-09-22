# Activities 活动原型：AI 修改规则

本仓库是彩票 H5（ar_v2_vue，基线 `masterBranch/main-3.10@be179c89f`）的纯前端原型，供产品设计新活动。所有数据都是前端假数据，不连接任何后端。设计文档：`docs/specs/2026-09-21-活动原型-设计方案.md`（整体方案）、`docs/specs/2026-09-21-活动控制台-控制项设计.md`（控制台与每个活动的控制项，两者冲突时以后者为准）。

## 运行

- Node 22、pnpm 11。`pnpm install` 之后 `pnpm dev`，浏览器会打开 http://localhost:5190/console.html
- 构建：`pnpm build`，产物在 `dist/`

## 目录地图

| 要改的内容 | 位置 |
|---|---|
| 活动页面 | `src/views/activity`（含周卡月卡、积分商城）、`src/views/main`（洗码、电子大奖、保险箱、邀请奖励、充值优惠券、红包兑换）、`src/views/vip`、`src/views/turntable`、`src/views/promotion`、`src/views/wallet/Recharge`（首充赠送） |
| 共享组件 | `src/components`（优先复用） |
| 假数据 | `entrance/prototype/mock/handlers/<功能>.ts`，文件名对应页面（周卡月卡 `periodCard.ts`、积分商城 `pointMall.ts`、优惠券 `coupon.ts`、宝箱 `treasureChest.ts`、红包兑换 `redeemGift.ts`、充值 `recharge.ts` 等） |
| 控制台清单与控制项声明 | `entrance/prototype/public/catalog.json`：`groups` 是左栏清单，`activities` 是每个活动的参数、边界场景、动作 |
| 读取活动参数 | `entrance/prototype/mock/scenario.ts` 的 `params<T>(ctx, '<活动ID>')` |
| 独立 HTML 原型 | `entrance/prototype/public/prototypes/<名称>/index.html` |

## 规则

1. 禁止接入真实接口、真实账号和真实用户数据；接口域名保持 `https://prototype.invalid`。
2. 页面调用了新接口：在对应功能的 handlers 文件里加处理函数，键使用 `@/api/url` 的常量（如 `[api.GetDailyAwardList]`），返回字段与页面读取的字段一致。新功能就新建 handlers 文件，并在 `handlers/index.ts` 登记。
3. mock 层只能导入第三方库、mock 自身文件、`@/api/url` 和 `import type`，不能导入 `src` 下的其他运行时模块。
4. 领取类接口使用 `claim()`，领取键以 `<活动ID>:` 开头（如 `signIn:3`）；列表的已领取状态用 `rewardStatus()`（`entrance/prototype/mock/state.ts`）。控制台按活动 ID 清理会话数据，键名不按约定，该活动的“边界场景”和“恢复默认”就不会生效。
5. 新增页面入口：在 `catalog.json` 的 `groups` 中登记，`kind` 取 `route`、`popup`、`html`、`none`；有可调参数的活动在清单项上写 `activity`（活动 ID），并在 `activities` 中声明参数、边界场景和动作（格式见控制项设计 §1.1）。
6. 独立 HTML 原型：复制 `prototypes/_example` 目录并改名后修改，再在 `catalog.json` 的 `groups` 里新增（或沿用已有的）“新设计”分组登记，路径写 `prototypes/<名称>/index.html`。
7. 只看原型相关的租户文件：入口 `entrance/prototype`、皮肤 `src/assets/redStyle`、首页 `src/views/home/other/redHome.vue`。`entrance/` 下其他租户目录和 `src/assets` 下其他皮肤目录不参与构建，不要修改，也不要当作参考；这些租户目录里的接口域名已换成 `prototype.invalid`，GA、Firebase 等统计与推送配置已清空，不要填回真实值。
8. 禁止改动：`entrance/prototype/main.ts` 第一行的 `import './mock'`、`entrance/prototype/mock/index.ts` 的安装顺序。`src/` 下只允许三类改动：`src/plugins/html.ts`；从 `upstream/uat` 整体移植、内容与 uat 完全一致的周卡月卡相关文件（含其中 `src/api/url.ts` 新增的接口 key 和 `src/api/modules/activity.ts` 新增的函数）；请求签名的空实现（`src/api/http/requestBuilder.ts` 的 `signRequest`、`src/saasLottery/utils/md5.ts` 的 `signData` 不计算签名，防止代码被拿去直接连接真实后端，不要恢复）。根提交是基线快照，`git diff --name-only $(git rev-list --max-parents=0 HEAD) -- src` 列出的就是这些文件，结果里不应出现其他路径。`src/api/axios.ts`、`src/api/http/` 等请求层其余部分禁止改动。
9. 代码约定：TypeScript；导出的类型和函数写中文 TSDoc；早返回、少嵌套；不新增依赖。
10. handlers 只能修改 `ctx.state`，不允许在模块顶层保存可变状态（如模块级 `let` 数组）；需要跨请求保留的数据按第 14 条存放。
11. “空数据”类边界场景下，奖励类列表返回空数组 `[]`；如果页面对空数组解构或访问会直接抛异常，则返回进度归零的占位项，而不是返回空数组。
12. 活动开关是各活动的 `enabled` 参数。接口编码：`useActive.ts` 读取的字段（`GetLoadedSetting`、`GetActiveSetting`）用字符串 `'1'`/`'0'`；`GetHomeSettings` 的开关字段按原始布尔值读取，用 `true`/`false`。
13. mock 层通过根目录 `tsconfig.json` 做类型检查（`include` 里的 `entrance/prototype/**/*.ts`），改完 mock 代码后可以单独跑一次类型检查确认没有引入类型错误。
14. 功能自有的会话数据一律用 `featureState(ctx, '<活动ID>', init)`（`entrance/prototype/mock/state.ts`）存放：键等于活动 ID，`init` 由该活动的参数生成；不要再往 `SessionState` 顶层加功能专用字段。
15. 假数据里用户可见的文案一律写成 `pick(ctx, 中文, 英文, 印地语)`（`entrance/prototype/mock/i18n.ts`）三语齐写；会话数据里只存语言无关的键或 ID，返回时再 `pick()`；金额、日期、编号等非文案字段不需要翻译；印地语用天城文，行业术语可保留英文。
16. 加控制项：在 `catalog.json` 的 `activities.<活动ID>.params` 里声明（名称、类型、默认值、范围），在对应 handler 里用 `params<T>(ctx, '<活动ID>')` 读取；默认值只写在 `catalog.json`，handler 里不另写默认值；不需要改 `console.html`。一键场景写在同一活动的 `presets` 里，没写的参数取默认值。
17. 倒计时参数（`type: "countdown"`）在 handler 里拿到的是截止时刻的毫秒时间戳，`0` 表示关闭；handler 自己换算成页面需要的格式，并按页面要求在信封顶层返回 `serviceNowTime`；截止时刻已过时返回“已结束”的数据，不能返回会让页面反复重新请求的数据。
18. 失败信封用 `fail(msg, { msgCode, data, code })`（`entrance/prototype/mock/envelope.ts`）：默认 `code: -2`，由请求拦截器弹提示；页面自己 `await` 接口、只处理成功分支且没有 catch 的接口（如大转盘抽奖、红包兑换）用 `code: 1`。

## 改完自检

1. `pnpm dev` 打开控制台，点开改过的页面，浏览器控制台没有报错。
2. 在控制台右栏把改过的活动的边界场景各点一次，画面符合预期。
3. 浏览器控制台里没有 `[mock] 未覆盖:` 开头的警告（有的话说明页面用到的接口还没有假数据）。
4. `pnpm build` 通过。
