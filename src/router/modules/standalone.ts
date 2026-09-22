import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const arWalletRootRoutes: RouteRecordRaw[] = [
	viewRoute("/arWallet", "arWallet", "arWallet", null, () => import("@/views/arWallet/index.vue"))
]

export const installAppRootRoutes: RouteRecordRaw[] = [
	viewRoute("/installApp", "installApp", "installApp", null, () => import("@/views/installApp/index.vue"))
]

export const loginRootRoutes: RouteRecordRaw[] = [
	viewRoute("/login", "login", "login", null, () => import("@/views/login/index.vue"))
]

export const registerRootRoutes: RouteRecordRaw[] = [
	viewRoute("/register", "register", "register", null, () => import("@/views/register/index.vue"))
]

export const rpwdRootRoutes: RouteRecordRaw[] = [
	viewRoute("/rpwd", "rpwd", "rpwd", null, () => import("@/views/rpwd/index.vue"))
]

