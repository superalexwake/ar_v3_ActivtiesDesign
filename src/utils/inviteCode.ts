import { getHashParams } from './basic'
import { native } from './bridges'

const INVITE_CODE_KEY = 'invitecode'

const normalizeInviteCode = (code: any) => String(code || '').replace(/[\s\n\t\r]/g, '')
const getStoredInviteCode = () => localStorage.getItem(INVITE_CODE_KEY) || sessionStorage.getItem(INVITE_CODE_KEY)

export const resolveInviteCode = () => {
	const params = getHashParams()
	const invitationCode = [
		native.getInvitationCode(),
		params.invitationCode,
		params.r_code,
		params.invitecode,
		params.invitstionCode,
		getStoredInviteCode()
	].map(normalizeInviteCode).find(Boolean) || ''

	if (invitationCode) localStorage.setItem(INVITE_CODE_KEY, invitationCode)
	return invitationCode
}
