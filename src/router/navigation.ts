import type { Router, RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'
import { LOGIN_URL } from '@/config/config'

const REDIRECT_QUERY_KEY = 'redirect'
const DEBUG_BYPASS_QUERY_KEY = 'check'
const REDIRECT_BLOCK_PATHS = [LOGIN_URL, '/register', '/rpwd']

let appRouter: Router | null = null

export function setAppRouter(router: Router) {
	appRouter = router
}

export function pushRoute(to: RouteLocationRaw) {
	return appRouter?.push(to)
}

export function replaceRoute(to: RouteLocationRaw) {
	return appRouter?.replace(to)
}

export function getCurrentRoute(): RouteLocationNormalizedLoaded | undefined {
	return appRouter?.currentRoute.value
}

export function normalizeLoginRedirect(value: unknown) {
	const raw = Array.isArray(value) ? value[0] : value
	if (typeof raw !== 'string') return ''
	if (!raw.startsWith('/') || raw.startsWith('//')) return ''

	const path = raw.split('?')[0].split('#')[0]
	if (REDIRECT_BLOCK_PATHS.includes(path)) return ''

	return raw
}

export function createLoginRedirectQuery(fullPath: string) {
	const redirect = normalizeLoginRedirect(fullPath)
	if (!redirect) return undefined

	const params = new URLSearchParams(fullPath.split('?')[1]?.split('#')[0] || '')
	const query: Record<string, string> = { [REDIRECT_QUERY_KEY]: redirect }
	if (params.get(DEBUG_BYPASS_QUERY_KEY) === '0') {
		query[DEBUG_BYPASS_QUERY_KEY] = '0'
	}
	return query
}

export function getLoginRedirectFromRoute(route?: { query?: Record<string, unknown> }) {
	return normalizeLoginRedirect(route?.query?.[REDIRECT_QUERY_KEY])
}
