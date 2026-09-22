/**
 * @获取vip会员信息
 * @userId 用户ID
 * @vipLevel Vip等级
 * @nickName 昵称
 * @exp 经验值
 * @settlementDate 结算时间
 */
export interface ResGetVipUsers {
	userId: number
	vipLevel: number
	nickName: string
	exp: number
	settlementDate: number
}

/**
 * @获取vip操作日志返回数据
 * @orderNo 记录订单号
 * @type 类型
 * @typeStr 类型名
 * @awardAmount 余额
 * @bonusPoints 积分
 * @experience 经验
 * @remark 备注
 * @createTime 创建时间
 */
export interface ResGetPageListVipUserRecord {
	orderNo: string
	type: number
	typeStr: string
	awardAmount: number
	bonusPoints: number
	experience: number
	remark: string
	createTime: string
}

/**
 * @获取vip等级信息返回数据
 * @id 奖励编码
 * @name 奖励名称
 * @description 奖励描述
 * @integral 奖励积分
 * @balance 奖励余额
 * @rate 比率
 */
export interface ResGetListVipLevel {
	id: number
	name: string
	description: string
	integral: number
	balance: number
	rate: number
}

/**
 * @获取vip会员奖励返回数据
 * @id 奖励ID
 * @rewardType 奖励类型
 * @integral 积分
 * @balance 余额
 * @status 状态 1 未领取 2 已领取
 * @rate 百分比
 */
export interface ResGetListVipUserRewards {
	id: number
	rewardType: number
	integral: number
	balance: number
	status: number
	rate: number
}

/**
 * @获取vip用户等级详细返回数据
 * @id Vip等级
 * @vipName Vip名称
 * @status 1 未解锁 2已达成
 * @currentExp 当前经验
 * @upgrade 升级条件
 * @relegationExp 当前保级经验
 * @relegation 保级条件
 * @amount 每投注多少钱等于 1EXP
 * @upgradeStatus 是否领取升级奖励 1 未领取，2已领取
 */

export interface ResGetVipUserLevelDetail {
	id: number
	vipName: string
	status: number
	currentExp: number
	upgrade: number
	relegationExp: number
	relegation: number
	amount: number
	upgradeStatus: number
	deductExp: number
}

/**
 * @领取奖励参数
 * @receiveId 奖励ID
 * @vipLevel VIP等级
 * @rewardType 奖励类型
 */
export interface ReqAddReceiveAward {
	receiveId: number
	vipLevel: number
	rewardType: number
}

/**
 * 返水详情
 * @id 等级
 * @electronic 电子洗码
 * @realPerson 真人洗码
 * @physicalEducation 体育洗码
 * @lottery 彩票洗码
 * @chess 棋牌洗码
 */
export interface ResGetAllVipLevelList {
	id: number
	electronic: number
	realPerson: number
	physicalEducation: number
	lottery: number
	chess: number
}
