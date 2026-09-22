import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const downloadCenterChildRoutes: RouteRecordRaw[] = [
	viewRoute("/downloadCenter/empty", "empty", "empty", "downloadCenter", () => import("@/views/downloadCenter/empty/index.vue")),
	viewRoute("/downloadCenter/ios", "ios", "ios", "downloadCenter", () => import("@/views/downloadCenter/ios/index.vue"))
]

export const downloadCenterRootRoutes: RouteRecordRaw[] = [
	viewRoute("/downloadCenter", "downloadCenter", "downloadCenter", null, () => import("@/views/downloadCenter/index.vue"))
]

