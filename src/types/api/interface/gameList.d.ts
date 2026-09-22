/**
 * @description: 游戏列表属性
 * @slotslist 游戏列表
 */
export type GameListProps = {
	popularGameList: {
		GameId: number // 游戏ID
		Games: string // 游戏名称
		Img: string // 游戏图片
		VendorId: number // 供应商ID
		ctype: string // 游戏类型
	}[]
	state: number
}

/**
 * @description: 游戏投注记录类型
 * @slotsTypeID 游戏类型ID
 * @slotsName 游戏名称
 */
export type GameBetRecord = {
	slotsTypeID: number
	slotsName: string
}

/**
 * @description: 游戏状态列表
 * @gameStatis 游戏统计数据
 * @sumBetAmount 投注总金额
 */
export type GameStatesList = {
	gameStatis: GameStatisData[]
	sumBetAmount: number
}

/**
 * @description: 游戏统计数据
 * @time 时间
 * @gameType 游戏类型
 * @gameTypeName 游戏类型名称
 * @betAmount 投注金额
 * @betCount 投注次数
 * @betWinLossAmount 投注输赢金额
 */
export type GameStatisData = {
	time: Date
	gameType: number
	gameTypeName: string
	betAmount: number
	betCount: number
	betWinLossAmount: number
}

/**
 * @description: 热门游戏列表
 * @type 游戏类型
 * @orderNo 订单号
 * @tranrefId 交易参考ID
 */
export interface HotGameData {
	type: number
	orderNo: string
	tranrefId: string
}

/**
 * @description: 其他游戏数据
 * @orderNo 订单号
 * @venderCode 供应商代码
 * @gameName 游戏名称
 * @betTime 投注时间
 * @betAmount 投注金额
 * @validBetAmount 有效投注金额
 * @winAmount 赢取金额
 * @winLossAmount 赢输金额
 * @waterAmount 水费金额
 * @orderType 订单类型
 * @orderStatus 订单状态
 * @serviceFeeAmount 服务费金额
 */
export interface GameOtherData {
	orderNo: string
	venderCode: string
	gameName: string
	betTime: Date
	betAmount: number
	validBetAmount: number
	winAmount: number
	winLossAmount: number
	waterAmount: number
	orderType: number
	orderStatus: number
	serviceFeeAmount: number
}
