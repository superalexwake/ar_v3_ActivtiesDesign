import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const homeDeepRoutes: RouteRecordRaw[] = [
	viewRoute("/home/AllLotteryGames/4D", "AllLotteryGames-4D", "4D", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/4D/index.vue")),
	viewRoute("/home/AllLotteryGames/4DLotteryResults", "AllLotteryGames-4DLotteryResults", "4DLotteryResults", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/4DLotteryResults/index.vue")),
	viewRoute("/home/AllLotteryGames/4DOdds", "AllLotteryGames-4DOdds", "4DOdds", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/4DOdds/index.vue")),
	viewRoute("/home/AllLotteryGames/4DPlay", "AllLotteryGames-4DPlay", "4DPlay", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/4DPlay/index.vue")),
	viewRoute("/home/AllLotteryGames/4DmyGame", "AllLotteryGames-4DmyGame", "4DmyGame", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/4DmyGame/index.vue")),
	viewRoute("/home/AllLotteryGames/5D", "AllLotteryGames-5D", "5D", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/5D/index.vue")),
	viewRoute("/home/AllLotteryGames/BettingRecord5D", "AllLotteryGames-BettingRecord5D", "BettingRecord5D", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/BettingRecord5D/index.vue")),
	viewRoute("/home/AllLotteryGames/BettingRecordK3", "AllLotteryGames-BettingRecordK3", "BettingRecordK3", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/BettingRecordK3/index.vue")),
	viewRoute("/home/AllLotteryGames/BettingRecordWin", "AllLotteryGames-BettingRecordWin", "BettingRecordWin", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/BettingRecordWin/index.vue")),
	viewRoute("/home/AllLotteryGames/BettingRecordWinTrx", "AllLotteryGames-BettingRecordWinTrx", "BettingRecordWinTrx", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/BettingRecordWinTrx/index.vue")),
	viewRoute("/home/AllLotteryGames/Binguo", "AllLotteryGames-Binguo", "Binguo", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/Binguo/index.vue")),
	viewRoute("/home/AllLotteryGames/BinguoCount", "AllLotteryGames-BinguoCount", "BinguoCount", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/BinguoCount/index.vue")),
	viewRoute("/home/AllLotteryGames/BinguoRecord", "AllLotteryGames-BinguoRecord", "BinguoRecord", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/BinguoRecord/index.vue")),
	viewRoute("/home/AllLotteryGames/ChangLong", "AllLotteryGames-ChangLong", "ChangLong", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/ChangLong/index.vue")),
	viewRoute("/home/AllLotteryGames/K3", "AllLotteryGames-K3", "K3", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/K3/index.vue")),
	viewRoute("/home/AllLotteryGames/NewVietnam", "AllLotteryGames-NewVietnam", "NewVietnam", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/NewVietnam/index.vue")),
	viewRoute("/home/AllLotteryGames/Play", "AllLotteryGames-Play", "Play", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/Play/index.vue")),
	viewRoute("/home/AllLotteryGames/WinGo", "AllLotteryGames-WinGo", "WinGo", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/WinGo/index.vue")),
	viewRoute("/home/AllLotteryGames/WinTrx", "AllLotteryGames-WinTrx", "WinTrx", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/WinTrx/index.vue")),
	viewRoute("/home/AllLotteryGames/WinTrxIframe", "AllLotteryGames-WinTrxIframe", "WinTrxIframe", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/WinTrxIframe/index.vue")),
	viewRoute("/home/AllLotteryGames/XoSo", "AllLotteryGames-XoSo", "XoSo", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/XoSo/index.vue")),
	viewRoute("/home/AllLotteryGames/XoSoRecord", "AllLotteryGames-XoSoRecord", "XoSoRecord", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/XoSoRecord/index.vue")),
	viewRoute("/home/AllLotteryGames/XoSoRecordF", "AllLotteryGames-XoSoRecordF", "XoSoRecordF", "AllLotteryGames", () => import("@/views/home/AllLotteryGames/XoSoRecordF/index.vue")),
	viewRoute("/home/Casino/Detail", "Casino-Detail", "Detail", "Casino", () => import("@/views/home/Casino/Detail/index.vue")),
	viewRoute("/home/Chess/Detail", "Chess-Detail", "Detail", "Chess", () => import("@/views/home/Chess/Detail/index.vue")),
	viewRoute("/home/Messages/MessageDetail", "Messages-MessageDetail", "MessageDetail", "Messages", () => import("@/views/home/Messages/MessageDetail/index.vue"))
]

export const homeChildRoutes: RouteRecordRaw[] = [
	viewRoute("/home/AllGames", "AllGames", "AllGames", "home", () => import("@/views/home/AllGames/index.vue"), { keepAlive: true }),
	viewRoute("/home/AllOnlineGames", "AllOnlineGames", "AllOnlineGames", "home", () => import("@/views/home/AllOnlineGames/index.vue")),
	viewRoute("/home/Casino", "Casino", "Casino", "home", () => import("@/views/home/Casino/index.vue")),
	viewRoute("/home/Chess", "Chess", "Chess", "home", () => import("@/views/home/Chess/index.vue")),
	viewRoute("/home/FishGames", "FishGames", "FishGames", "home", () => import("@/views/home/FishGames/index.vue")),
	viewRoute("/home/Fishing", "Fishing", "Fishing", "home", () => import("@/views/home/Fishing/index.vue")),
	viewRoute("/home/HotGames", "HotGames", "HotGames", "home", () => import("@/views/home/HotGames/index.vue")),
	viewRoute("/home/Lottery", "Lottery", "Lottery", "home", () => import("@/views/home/Lottery/index.vue")),
	viewRoute("/home/Messages", "Messages", "Messages", "home", () => import("@/views/home/Messages/index.vue")),
	viewRoute("/home/Original", "Original", "Original", "home", () => import("@/views/home/Original/index.vue")),
	viewRoute("/home/Slots", "Slots", "Slots", "home", () => import("@/views/home/Slots/index.vue")),
	viewRoute("/home/eSports", "eSports", "eSports", "home", () => import("@/views/home/eSports/index.vue")),
	viewRoute("/home/game", "game", "game", "home", () => import("@/views/home/game/index.vue"))
]

