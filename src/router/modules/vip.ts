import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const vipChildRoutes: RouteRecordRaw[] = [
	viewRoute("/vip/RebateDetails", "RebateDetails", "RebateDetails", "vip", () => import("@/views/vip/RebateDetails/index.vue")),
	viewRoute("/vip/RecordVsruleHistory", "RecordVsruleHistory", "RecordVsruleHistory", "vip", () => import("@/views/vip/RecordVsruleHistory/index.vue"))
]

export const vipRootRoutes: RouteRecordRaw[] = [
	viewRoute("/vip", "vip", "vip", null, () => import("@/views/vip/index.vue"))
]

