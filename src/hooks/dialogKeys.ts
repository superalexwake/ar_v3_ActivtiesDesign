/** 活动领奖成功弹窗在 DialogQueue 注册表中的 key。 */
export const ACTIVITY_RECEIVE_REWARD_DIALOG_KEY = 'activityReceiveReward'
/** 活动领奖成功弹窗互斥分组，同一时间只保留一条领奖成功弹窗。 */
export const ACTIVITY_RECEIVE_REWARD_DIALOG_GROUP = 'activity-receive-reward'

/** 活动未领取奖励提醒弹窗在 DialogQueue 注册表中的 key。 */
export const ACTIVITY_UN_AWARD_REMINDER_DIALOG_KEY = 'activityUnAwardReminder'
/** 活动未领取奖励提醒弹窗互斥分组，同一时间只保留一条活动未领取提醒。 */
export const ACTIVITY_UN_AWARD_REMINDER_DIALOG_GROUP = 'activity-un-award-reminder'

/** 站内信 C 系居中弹窗在 DialogQueue 注册表中的 key。 */
export const NOTIFY_C_MODAL_KEY = 'notifyCModal'
/** 站内信顶部通知中心在 DialogQueue 注册表中的 key。 */
export const NOTIFY_CENTER_KEY = 'notifyCenter'
/**
 * 通知中心屏蔽路由：三方游戏页 name + 彩票玩法页分组（route.meta.parent）。
 * 命中时消息只进列表不弹横幅，退出这些页面后由 DialogQueue 自动补弹。
 */
export const NOTIFY_CENTER_BLOCKED_ROUTES = ['game', 'AllLotteryGames', 'saasLottery']

/** FastUPI KYC OTP 弹窗在 DialogQueue 注册表中的 key。 */
export const FAST_UPI_KYC_OTP_DIALOG_KEY = 'fastUpiKycOtp'
/** FastUPI KYC OTP 弹窗互斥分组，避免同类验证弹窗并发叠加。 */
export const FAST_UPI_KYC_OTP_DIALOG_GROUP = 'fast-upi-kyc-otp'

/** 钱包安全验证弹窗在 DialogQueue 注册表中的 key。 */
export const SECURITY_VERIFY_DIALOG_KEY = 'securityVerify'
/** 钱包安全验证弹窗互斥分组，同一时间只处理一个安全验证流程。 */
export const SECURITY_VERIFY_DIALOG_GROUP = 'wallet-security-verify'
