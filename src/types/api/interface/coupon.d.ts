/**
 * 充值返利券 · 后端真契约类型（见 docs 返利券前端对接文档 §3）
 * 比率 rechargeGiftRate 为小数原值（0.05=5%），展示层自行 ×100
 */

/** 券业务类型：1 代理邀请链接（本期）/ 2 渠道注册码 / 3 代理红包码 / 4 人工充值 */
export type CouponBusinessType = 1 | 2 | 3 | 4

/** 券适用充值大类（随券下发，name 为后台配置的大类名，展示直接用无需反查） */
export interface RechargeCategoryItem {
	id: number
	name: string
}

/** 用户券状态：0 未领取(后端无产生入口) / 1 未使用 / 2 锁定中 / 3 已使用 / 4 已过期 */
export type UserCouponState = 0 | 1 | 2 | 3 | 4

/** 券种信息（RechargeCouponItem） */
export interface RechargeCouponItem {
	couponId: number
	couponNum: string
	rechargeGiftRate: number // 小数原值，0.05=5%
	rechargeGiftLimit: number // 单次赠送上限，0=不限
	bonusMergeMode: number // 赠金合并方式：1 取高互斥 / 2 优先券互斥 / 3 叠加
	minRechargeAmount: number // 最低充值门槛，0=不限
	couponValidDays: number // 领取后有效天数，0=不限期
	amountofCode: number // 赠金打码量倍数
	rechargeCategorys: RechargeCategoryItem[] // 适用充值大类；空数组=未配大类，该券恒不可选（库备注写"空=全部"与实现相反）
	couponBusinessType: CouponBusinessType
	agentListId: number // 推广授权代理名单 ID，0=不限
	authListId: number // 领取白名单批次 ID，0=人人可领
	isFirstRechargeAvailable?: boolean // true=仅首充会员可用；库默认值为 1，运营须显式配置非首充券
}

/** 用户券（UserRechargeCouponItem，券种基础上追加用户维度字段） */
export interface UserRechargeCouponItem extends RechargeCouponItem {
	userRechargeCouponId: number
	userRechargeCouponSate?: UserCouponState // 后端契约拼写少个 t，按原样取；多状态混查时靠它分组
	// null 双含义：未领取=尚未起算；已领取且不限期=永久有效
	expireTime: string | null
	lockOrderNumber: string | null // 锁走该券的充值单号；下单后回查此值确认券是否真被锁（下单响应不含券结果）
	// 仅"未使用"且有到期时间的券有值；倒计时以响应 serviceNowTime 为基准，勿用本地时间
	remainingMinutes: number | null
}
