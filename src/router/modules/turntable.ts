import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const turntableChildRoutes: RouteRecordRaw[] = [
	viewRoute("/turntable/withdrawHistory", "withdrawHistory", "withdrawHistory", "turntable", () => import("@/views/turntable/withdrawHistory/index.vue"))
]

export const turntableRootRoutes: RouteRecordRaw[] = [
	viewRoute("/turntable", "turntable", "turntable", null, () => import("@/views/turntable/index.vue"))
]

