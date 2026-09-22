import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const activityDeepRoutes: RouteRecordRaw[] = [
	viewRoute("/activity/Championship/ChampionshipDetail", "Championship-ChampionshipDetail", "ChampionshipDetail", "Championship", () => import("@/views/activity/Championship/ChampionshipDetail/index.vue")),
	viewRoute("/activity/DailySignIn/Record", "DailySignIn-Record", "Record", "DailySignIn", () => import("@/views/activity/DailySignIn/Record/index.vue")),
	viewRoute("/activity/DailySignIn/Rules", "DailySignIn-Rules", "Rules", "DailySignIn", () => import("@/views/activity/DailySignIn/Rules/index.vue")),
	viewRoute("/activity/DailyTasks/Record", "DailyTasks-Record", "Record", "DailyTasks", () => import("@/views/activity/DailyTasks/Record/index.vue")),
	viewRoute("/activity/MemberPackage/Rules", "MemberPackage-Rules", "Rules", "MemberPackage", () => import("@/views/activity/MemberPackage/Rules/index.vue")),
	viewRoute("/activity/PointMall/AddAddress", "PointMall-AddAddress", "AddAddress", "PointMall", () => import("@/views/activity/PointMall/AddAddress/index.vue")),
	viewRoute("/activity/PointMall/LotteryActivity", "PointMall-LotteryActivity", "LotteryActivity", "PointMall", () => import("@/views/activity/PointMall/LotteryActivity/index.vue")),
	viewRoute("/activity/PointMall/LotteryDetail", "PointMall-LotteryDetail", "LotteryDetail", "PointMall", () => import("@/views/activity/PointMall/LotteryDetail/index.vue")),
	viewRoute("/activity/PointMall/MyLottery", "PointMall-MyLottery", "MyLottery", "PointMall", () => import("@/views/activity/PointMall/MyLottery/index.vue")),
	viewRoute("/activity/PointMall/MyOrders", "PointMall-MyOrders", "MyOrders", "PointMall", () => import("@/views/activity/PointMall/MyOrders/index.vue")),
	viewRoute("/activity/PointMall/OrderDetail", "PointMall-OrderDetail", "OrderDetail", "PointMall", () => import("@/views/activity/PointMall/OrderDetail/index.vue")),
	viewRoute("/activity/PointMall/ReceiveLottery", "PointMall-ReceiveLottery", "ReceiveLottery", "PointMall", () => import("@/views/activity/PointMall/ReceiveLottery/index.vue")),
	viewRoute("/activity/PointMall/Record", "PointMall-Record", "Record", "PointMall", () => import("@/views/activity/PointMall/Record/index.vue")),
	viewRoute("/activity/PointMall/Redeem", "PointMall-Redeem", "Redeem", "PointMall", () => import("@/views/activity/PointMall/Redeem/index.vue")),
	viewRoute("/activity/PointMall/Rules", "PointMall-Rules", "Rules", "PointMall", () => import("@/views/activity/PointMall/Rules/index.vue")),
	viewRoute("/activity/Turntable/Detail", "Turntable-Detail", "Detail", "Turntable", () => import("@/views/activity/Turntable/Detail/index.vue")),
	viewRoute("/activity/Turntable/Introduce", "Turntable-Introduce", "Introduce", "Turntable", () => import("@/views/activity/Turntable/Introduce/index.vue")),
	viewRoute("/activity/Turntable/Rules", "Turntable-Rules", "Rules", "Turntable", () => import("@/views/activity/Turntable/Rules/index.vue"))
]

export const activityChildRoutes: RouteRecordRaw[] = [
	viewRoute("/activity/ActivityDetail", "ActivityDetail", "ActivityDetail", "activity", () => import("@/views/activity/ActivityDetail/index.vue")),
	viewRoute("/activity/Bonus", "Bonus", "Bonus", "activity", () => import("@/views/activity/Bonus/index.vue")),
	viewRoute("/activity/Championship", "Championship", "Championship", "activity", () => import("@/views/activity/Championship/index.vue")),
	viewRoute("/activity/DailySignIn", "DailySignIn", "DailySignIn", "activity", () => import("@/views/activity/DailySignIn/index.vue")),
	viewRoute("/activity/DailyTasks", "DailyTasks", "DailyTasks", "activity", () => import("@/views/activity/DailyTasks/index.vue")),
	viewRoute("/activity/FirstRecharge", "FirstRecharge", "FirstRecharge", "activity", () => import("@/views/activity/FirstRecharge/index.vue")),
	viewRoute("/activity/MemberPackage", "MemberPackage", "MemberPackage", "activity", () => import("@/views/activity/MemberPackage/index.vue")),
	viewRoute("/activity/PointMall", "PointMall", "PointMall", "activity", () => import("@/views/activity/PointMall/index.vue")),
	viewRoute("/activity/Turntable", "Turntable", "Turntable", "activity", () => import("@/views/activity/Turntable/index.vue"))
]

export const activityRootRoutes: RouteRecordRaw[] = [
	viewRoute("/activity", "activity", "activity", null, () => import("@/views/activity/index.vue"), { tabBar: true })
]

