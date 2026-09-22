import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const promotionDeepRoutes: RouteRecordRaw[] = [
	viewRoute("/promotion/MyCommission/MyCommissionDetail", "MyCommission-MyCommissionDetail", "MyCommissionDetail", "MyCommission", () => import("@/views/promotion/MyCommission/MyCommissionDetail/index.vue")),
	viewRoute("/promotion/MyInvitation/InvitationDetail", "MyInvitation-InvitationDetail", "InvitationDetail", "MyInvitation", () => import("@/views/promotion/MyInvitation/InvitationDetail/index.vue")),
	viewRoute("/promotion/Server/ServiceCollection", "Server-ServiceCollection", "ServiceCollection", "Server", () => import("@/views/promotion/Server/ServiceCollection/index.vue")),
	viewRoute("/promotion/TeamPartner/Invitation", "TeamPartner-Invitation", "Invitation", "TeamPartner", () => import("@/views/promotion/TeamPartner/Invitation/index.vue")),
	viewRoute("/promotion/TeamReport/TeamReportDetail", "TeamReport-TeamReportDetail", "TeamReportDetail", "TeamReport", () => import("@/views/promotion/TeamReport/TeamReportDetail/index.vue"))
]

export const promotionChildRoutes: RouteRecordRaw[] = [
	viewRoute("/promotion/CommissionDetail", "CommissionDetail", "CommissionDetail", "promotion", () => import("@/views/promotion/CommissionDetail/index.vue")),
	viewRoute("/promotion/MyCommission", "MyCommission", "MyCommission", "promotion", () => import("@/views/promotion/MyCommission/index.vue")),
	viewRoute("/promotion/MyInvitation", "MyInvitation", "MyInvitation", "promotion", () => import("@/views/promotion/MyInvitation/index.vue")),
	viewRoute("/promotion/MyReceive", "MyReceive", "MyReceive", "promotion", () => import("@/views/promotion/MyReceive/index.vue")),
	viewRoute("/promotion/PromotionRule", "PromotionRule", "PromotionRule", "promotion", () => import("@/views/promotion/PromotionRule/index.vue")),
	viewRoute("/promotion/PromotionShare", "PromotionShare", "PromotionShare", "promotion", () => import("@/views/promotion/PromotionShare/index.vue")),
	viewRoute("/promotion/RebateRatio", "RebateRatio", "RebateRatio", "promotion", () => import("@/views/promotion/RebateRatio/index.vue")),
	viewRoute("/promotion/Server", "Server", "Server", "promotion", () => import("@/views/promotion/Server/index.vue")),
	viewRoute("/promotion/Subordinate", "Subordinate", "Subordinate", "promotion", () => import("@/views/promotion/Subordinate/index.vue")),
	viewRoute("/promotion/TeamPartner", "TeamPartner", "TeamPartner", "promotion", () => import("@/views/promotion/TeamPartner/index.vue")),
	viewRoute("/promotion/TeamReport", "TeamReport", "TeamReport", "promotion", () => import("@/views/promotion/TeamReport/index.vue"))
]

export const promotionRootRoutes: RouteRecordRaw[] = [
	viewRoute("/promotion", "promotion", "promotion", null, () => import("@/views/promotion/index.vue"), { tabBar: true })
]

