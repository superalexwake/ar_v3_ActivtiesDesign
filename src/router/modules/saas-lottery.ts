import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const saasLotteryChildRoutes: RouteRecordRaw[] = [
	viewRoute("/saasLottery/D5", "D5", "D5", "saasLottery", () => import("@/views/saasLottery/D5/index.vue")),
	viewRoute("/saasLottery/K3", "K3", "K3", "saasLottery", () => import("@/views/saasLottery/K3/index.vue")),
	viewRoute("/saasLottery/MotoRace", "MotoRace", "MotoRace", "saasLottery", () => import("@/views/saasLottery/MotoRace/index.vue")),
	viewRoute("/saasLottery/SaasChangLong", "SaasChangLong", "SaasChangLong", "saasLottery", () => import("@/views/saasLottery/SaasChangLong/index.vue")),
	viewRoute("/saasLottery/TrxWinGo", "TrxWinGo", "TrxWinGo", "saasLottery", () => import("@/views/saasLottery/TrxWinGo/index.vue")),
	viewRoute("/saasLottery/VideoWinGo", "VideoWinGo", "VideoWinGo", "saasLottery", () => import("@/views/saasLottery/VideoWinGo/index.vue")),
	viewRoute("/saasLottery/WinGo", "WinGo", "WinGo", "saasLottery", () => import("@/views/saasLottery/WinGo/index.vue")),
	viewRoute("/saasLottery/WinGoRecord", "WinGoRecord", "WinGoRecord", "saasLottery", () => import("@/saasLottery/game/WinGo/views/wingo3/betRecord.vue")),
	viewRoute("/saasLottery/TrxWinGoRecord", "TrxWinGoRecord", "TrxWinGoRecord", "saasLottery", () => import("@/saasLottery/game/TrxWinGo/views/trx2/betRecord.vue")),
	viewRoute("/saasLottery/K3Record", "K3Record", "K3Record", "saasLottery", () => import("@/saasLottery/game/K3/views/k33/betRecord.vue")),
	viewRoute("/saasLottery/D5Record", "D5Record", "D5Record", "saasLottery", () => import("@/saasLottery/game/D5/views/D5_3/betRecord.vue"))
]

