import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const mainDeepRoutes: RouteRecordRaw[] = [
	viewRoute("/main/About/AboutDetail", "About-AboutDetail", "AboutDetail", "About", () => import("@/views/main/About/AboutDetail/index.vue")),
	viewRoute("/main/CustomerService/ServiceCollection", "CustomerService-ServiceCollection", "ServiceCollection", "CustomerService", () => import("@/views/main/CustomerService/ServiceCollection/index.vue")),
	viewRoute("/main/GoogleVerify/BindGoogle", "GoogleVerify-BindGoogle", "BindGoogle", "GoogleVerify", () => import("@/views/main/GoogleVerify/BindGoogle/index.vue")),
	viewRoute("/main/InvitationBonus/Record", "InvitationBonus-Record", "Record", "InvitationBonus", () => import("@/views/main/InvitationBonus/Record/index.vue")),
	viewRoute("/main/InvitationBonus/Rule", "InvitationBonus-Rule", "Rule", "InvitationBonus", () => import("@/views/main/InvitationBonus/Rule/index.vue")),
	viewRoute("/main/Laundry/LaundryRecord", "Laundry-LaundryRecord", "LaundryRecord", "Laundry", () => import("@/views/main/Laundry/LaundryRecord/index.vue")),
	viewRoute("/main/Laundry/LaundryRule", "Laundry-LaundryRule", "LaundryRule", "Laundry", () => import("@/views/main/Laundry/LaundryRule/index.vue")),
	viewRoute("/main/SettingCenter/BindEmail", "SettingCenter-BindEmail", "BindEmail", "SettingCenter", () => import("@/views/main/SettingCenter/BindEmail/index.vue")),
	viewRoute("/main/SettingCenter/LoginPassword", "SettingCenter-LoginPassword", "LoginPassword", "SettingCenter", () => import("@/views/main/SettingCenter/LoginPassword/index.vue")),
	viewRoute("/main/SettingCenter/UpdatePhone", "SettingCenter-UpdatePhone", "UpdatePhone", "SettingCenter", () => import("@/views/main/SettingCenter/UpdatePhone/index.vue")),
	viewRoute("/main/StrongBox/StrongBoxAbout", "StrongBox-StrongBoxAbout", "StrongBoxAbout", "StrongBox", () => import("@/views/main/StrongBox/StrongBoxAbout/index.vue")),
	viewRoute("/main/StrongBox/StrongBoxRecord", "StrongBox-StrongBoxRecord", "StrongBoxRecord", "StrongBox", () => import("@/views/main/StrongBox/StrongBoxRecord/index.vue")),
	viewRoute("/main/SuperJackpot/rule", "SuperJackpot-rule", "rule", "SuperJackpot", () => import("@/views/main/SuperJackpot/rule/index.vue")),
	viewRoute("/main/SuperJackpot/star", "SuperJackpot-star", "star", "SuperJackpot", () => import("@/views/main/SuperJackpot/star/index.vue"))
]

export const mainChildRoutes: RouteRecordRaw[] = [
	viewRoute("/main/About", "About", "About", "main", () => import("@/views/main/About/index.vue")),
	viewRoute("/main/Avatar", "Avatar", "Avatar", "main", () => import("@/views/main/Avatar/index.vue")),
	viewRoute("/main/BetRecords", "BetRecords", "BetRecords", "main", () => import("@/views/main/BetRecords/index.vue")),
	viewRoute("/main/CustomerService", "CustomerService", "CustomerService", "main", () => import("@/views/main/CustomerService/index.vue")),
	viewRoute("/main/Feedback", "Feedback", "Feedback", "main", () => import("@/views/main/Feedback/index.vue")),
	viewRoute("/main/GameStats", "GameStats", "GameStats", "main", () => import("@/views/main/GameStats/index.vue")),
	viewRoute("/main/GoogleVerify", "GoogleVerify", "GoogleVerify", "main", () => import("@/views/main/GoogleVerify/index.vue")),
	viewRoute("/main/Guide", "Guide", "Guide", "main", () => import("@/views/main/Guide/index.vue")),
	viewRoute("/main/InvitationBonus", "InvitationBonus", "InvitationBonus", "main", () => import("@/views/main/InvitationBonus/index.vue")),
	viewRoute("/main/Language", "Language", "Language", "main", () => import("@/views/main/Language/index.vue")),
	viewRoute("/main/Laundry", "Laundry", "Laundry", "main", () => import("@/views/main/Laundry/index.vue")),
	viewRoute("/main/MyCoins", "MyCoins", "MyCoins", "main", () => import("@/views/main/MyCoins/index.vue")),
	viewRoute("/main/MyCps", "MyCps", "MyCps", "main", () => import("@/views/main/MyCps/index.vue")),
	viewRoute("/main/Notification", "Notification", "Notification", "main", () => import("@/views/main/Notification/index.vue")),
	viewRoute("/main/PointDetail", "PointDetail", "PointDetail", "main", () => import("@/views/main/PointDetail/index.vue")),
	viewRoute("/main/RechargeCoupon", "RechargeCoupon", "RechargeCoupon", "main", () => import("@/views/main/RechargeCoupon/index.vue")),
	viewRoute("/main/RedeemGift", "RedeemGift", "RedeemGift", "main", () => import("@/views/main/RedeemGift/index.vue")),
	viewRoute("/main/SettingCenter", "SettingCenter", "SettingCenter", "main", () => import("@/views/main/SettingCenter/index.vue")),
	viewRoute("/main/StrongBox", "StrongBox", "StrongBox", "main", () => import("@/views/main/StrongBox/index.vue")),
	viewRoute("/main/SuperJackpot", "SuperJackpot", "SuperJackpot", "main", () => import("@/views/main/SuperJackpot/index.vue"))
]

export const mainRootRoutes: RouteRecordRaw[] = [
	viewRoute("/main", "main", "main", null, () => import("@/views/main/index.vue"), { tabBar: true })
]

export const maintenanceRootRoutes: RouteRecordRaw[] = [
	viewRoute("/maintenance", "maintenance", "maintenance", null, () => import("@/views/maintenance/index.vue"))
]

