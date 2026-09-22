export interface LoginData {
	tokenHeader: string
	token: string
	expiresIn: number
	refreshToken: string
	passwordErrorNum: number
	// 站内信实时推送（文档 v3：连接信息并入登录返回）。RefreshToken 响应同样返回这三个字段。
	/** 已拼好 Token 的完整 wss 地址；空串表示未配置推送 → 不连接（降级） */
	webSocketUrl?: string
	/** WebSocket 订阅 Token 过期时刻：13 位毫秒时间戳（UTC） */
	webSocketTokenExpireAt?: number
	/** 要订阅的频道，当前恒为 1 个：/WebApi/{TenantID}/userid/{会员UserId} */
	webSocketChannels?: string[]
}
