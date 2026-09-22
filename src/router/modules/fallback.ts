import type { RouteRecordRaw } from 'vue-router'
import { redirectRoute } from './helpers'

export const notFoundRoutes: RouteRecordRaw[] = [
	redirectRoute("/:pathMatch(.*)", "/", "NotFound")
]
