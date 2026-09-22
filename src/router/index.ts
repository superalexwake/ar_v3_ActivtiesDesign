import { createRouter, createWebHashHistory } from 'vue-router'
import { GlobalStore } from '@/stores'
import {setGlobalLocale} from '@/languages';
import { LOGIN_URL, ROUTER_WHITE_LIST } from '@/config/config'
import { checkPwaApp, isInPwaApp } from '@/hooks'
import { isHybridApk } from '@/utils/jsBridge'
import { routes } from './modules'
import { createLoginRedirectQuery, getLoginRedirectFromRoute, setAppRouter } from './navigation'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: routes,
	scrollBehavior(to, from, savedPosition) {
		return { top: 0 }
	}
})
setAppRouter(router)

router.beforeEach(async (to, from, next) => {
	const globalStore = GlobalStore()
	await setGlobalLocale()
	// 允许修改登录密码页 跳转到 登录页
	let toLoginPaths = [
		'/',
		'/main/About/AboutDetail',
		'/main/SettingCenter/LoginPassword',
		'/main/SettingCenter',
		'/maintenance',
	]

	// isInPwaApp 新语义：返回 true = 在 PWA 里。旧代码这里是 `isInPwaApp() &&`（实现取反 + 调用方双重否定），
	// 翻转之后这里改为 `!isInPwaApp()`，行为不变："不在 PWA 且不在 hybrid 时跳 installApp"。
	if (!isInPwaApp() && !isHybridApk()) {
		if ((await checkPwaApp()) == 1 && to.name !== 'installApp') {
			return next({
				name: 'installApp'
			});
		}
	}
	// 是否允许跳转登录页
	if (Number(localStorage.getItem('isToLogin')) == 1 || (toLoginPaths.includes(from.path) && to.path === LOGIN_URL)) {
		localStorage.setItem('isToLogin', '2')
		return next()
	}


	if (to.path === LOGIN_URL) {
		if (globalStore.token) {
			return next(getLoginRedirectFromRoute(to) || '/')
		}
		return next()
	}
	if (ROUTER_WHITE_LIST.includes(to.path)) return next()
	if (import.meta.env.DEV && to.path.startsWith('/preview/')) return next()

	if (!globalStore.token) {
		const query = createLoginRedirectQuery(to.fullPath)
		return next({
			path: LOGIN_URL,
			...(query ? { query } : {}),
			replace: true,
		})
	}
	if (['/main'].includes(to.path)) {
		globalStore.notifyARGame()
	}
	next()
})

export default router
