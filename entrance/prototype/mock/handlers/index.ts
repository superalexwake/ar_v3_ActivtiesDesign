import type { MockRoutes } from '../types'
import { activityCenterRoutes } from './activityCenter'
import { championshipRoutes } from './championship'
import { couponRoutes } from './coupon'
import { dailyTasksRoutes } from './dailyTasks'
import { firstRechargeRoutes } from './firstRecharge'
import { homeRoutes } from './home'
import { invitationBonusRoutes } from './invitationBonus'
import { inviteWheelRoutes } from './inviteWheel'
import { jackpotRoutes } from './jackpot'
import { laundryRoutes } from './laundry'
import { memberPackageRoutes } from './memberPackage'
import { periodCardRoutes } from './periodCard'
import { pointMallRoutes } from './pointMall'
import { rechargeRoutes } from './recharge'
import { redeemGiftRoutes } from './redeemGift'
import { sessionRoutes } from './session'
import { signInRoutes } from './signIn'
import { strongBoxRoutes } from './strongBox'
import { teamPartnerRoutes } from './teamPartner'
import { treasureChestRoutes } from './treasureChest'
import { turntableRoutes } from './turntable'
import { vipRoutes } from './vip'

/** 全部接口的路由表，由各功能文件汇总；各文件的键互不重复 */
export const routes: MockRoutes = {
	...sessionRoutes,
	...homeRoutes,
	...activityCenterRoutes,
	...dailyTasksRoutes,
	...signInRoutes,
	...firstRechargeRoutes,
	...memberPackageRoutes,
	...championshipRoutes,
	...turntableRoutes,
	...inviteWheelRoutes,
	...jackpotRoutes,
	...laundryRoutes,
	...strongBoxRoutes,
	...teamPartnerRoutes,
	...invitationBonusRoutes,
	...vipRoutes,
	...periodCardRoutes,
	...pointMallRoutes,
	...couponRoutes,
	...treasureChestRoutes,
	...redeemGiftRoutes,
	...rechargeRoutes,
}
