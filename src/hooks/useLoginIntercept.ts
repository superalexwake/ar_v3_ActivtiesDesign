import type { RouteLocationRaw, Router } from 'vue-router'
import { pushEventRewardsLoginDialog } from '@/components/DialogQueue/producers'
import { GlobalStore } from '@/stores'

export async function requireLoginAction() {
	if (GlobalStore().token) return true

	await pushEventRewardsLoginDialog()

	return false
}

export async function pushWithLoginIntercept(
	router: Router,
	to: RouteLocationRaw,
) {
	if (!(await requireLoginAction())) return false
	await router.push(to)
	return true
}
