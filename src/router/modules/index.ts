import type { RouteRecordRaw } from 'vue-router'
import { activityDeepRoutes, activityChildRoutes, activityRootRoutes } from './activity'
import { arWalletRootRoutes, installAppRootRoutes, loginRootRoutes, registerRootRoutes, rpwdRootRoutes } from './standalone'
import { arupiChildRoutes, arupiRootRoutes } from './arupi'
import { downloadCenterChildRoutes, downloadCenterRootRoutes } from './download-center'
import { notFoundRoutes } from './fallback'
import { homeDeepRoutes, homeChildRoutes } from './home'
import { mainDeepRoutes, mainChildRoutes, mainRootRoutes, maintenanceRootRoutes } from './main'
import { promotionDeepRoutes, promotionChildRoutes, promotionRootRoutes } from './promotion'
import { saasLotteryChildRoutes } from './saas-lottery'
import { turntableChildRoutes, turntableRootRoutes } from './turntable'
import { vipChildRoutes, vipRootRoutes } from './vip'
import { walletDeepRoutes, walletChildRoutes, walletRootRoutes } from './wallet'

export const pageRoutes: RouteRecordRaw[] = [
	...activityDeepRoutes,
	...homeDeepRoutes,
	...mainDeepRoutes,
	...promotionDeepRoutes,
	...walletDeepRoutes,
	...activityChildRoutes,
	...arupiChildRoutes,
	...downloadCenterChildRoutes,
	...homeChildRoutes,
	...mainChildRoutes,
	...promotionChildRoutes,
	...saasLotteryChildRoutes,
	...turntableChildRoutes,
	...vipChildRoutes,
	...walletChildRoutes,
	...activityRootRoutes,
	...arWalletRootRoutes,
	...arupiRootRoutes,
	...downloadCenterRootRoutes,
	...installAppRootRoutes,
	...loginRootRoutes,
	...mainRootRoutes,
	...maintenanceRootRoutes,
	...promotionRootRoutes,
	...registerRootRoutes,
	...rpwdRootRoutes,
	...turntableRootRoutes,
	...vipRootRoutes,
	...walletRootRoutes
]

export const fallbackRoutes: RouteRecordRaw[] = [
	...notFoundRoutes
]

export const routes: RouteRecordRaw[] = [
	...pageRoutes,
	...fallbackRoutes
]
