import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const arupiChildRoutes: RouteRecordRaw[] = [
	viewRoute("/arupi/Appeal", "Appeal", "Appeal", "arupi", () => import("@/views/arupi/Appeal/index.vue")),
	viewRoute("/arupi/Fail", "Fail", "Fail", "arupi", () => import("@/views/arupi/Fail/index.vue")),
	viewRoute("/arupi/Payment", "Payment", "Payment", "arupi", () => import("@/views/arupi/Payment/index.vue")),
	viewRoute("/arupi/arupi_v2", "arupi_v2", "arupi_v2", "arupi", () => import("@/views/arupi/arupi_v2/index.vue")),
	viewRoute("/arupi/kycAppeal", "kycAppeal", "kycAppeal", "arupi", () => import("@/views/arupi/kycAppeal/index.vue")),
	viewRoute("/arupi/kycAppeal_v2", "kycAppeal_v2", "kycAppeal_v2", "arupi", () => import("@/views/arupi/kycAppeal_v2/index.vue"))
]

export const arupiRootRoutes: RouteRecordRaw[] = [
	viewRoute("/arupi", "arupi", "arupi", null, () => import("@/views/arupi/index.vue"))
]

