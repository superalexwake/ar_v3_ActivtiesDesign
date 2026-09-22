// =============================================================================
// 弹窗会话标记（sessionStorage）单一定义点。
// 零依赖叶子模块：stores（setToken/loginout）与 producers 都从这里取，避免循环引用。
// =============================================================================

const ANNOUNCEMENT_SESSION_KEY = 'pop_prompt'
const SUPER_JACKPOT_SESSION_KEY = 'pop_laundry'

/** 清空弹窗相关会话标记；登录、登出、进入认证页时调用。 */
export function clearDialogSessionState() {
	sessionStorage.removeItem(ANNOUNCEMENT_SESSION_KEY)
	sessionStorage.removeItem(SUPER_JACKPOT_SESSION_KEY)
}

/** 本次会话是否已展示过公告弹窗。 */
export function hasShownAnnouncementInSession() {
	return sessionStorage.getItem(ANNOUNCEMENT_SESSION_KEY) === '1'
}

/** 本次会话是否已展示过超级大奖引导。 */
export function hasShownSuperJackpotPromptInSession() {
	return sessionStorage.getItem(SUPER_JACKPOT_SESSION_KEY) === '1'
}

export function markAnnouncementShown() {
	sessionStorage.setItem(ANNOUNCEMENT_SESSION_KEY, '1')
}

export function markSuperJackpotPromptShown() {
	sessionStorage.setItem(SUPER_JACKPOT_SESSION_KEY, '1')
}
