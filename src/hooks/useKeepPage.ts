import router from '@/router/index'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 这里把targetPages参数设置为数组，因为目标页面可能有多个，比如B -> C, B -> D
export function useKeepPage(targetPages: string[]) {
	//console.log('router',router.options.routes)
	const routerN = useRouter()

	/**
	 * @description: 更新路由meta.keepAlive值
	 * @param {name} string 需要修改的路由名称
	 * @param {val} boolean 修改的值
	 * @return {*}
	 */
	const updateRouterKeepAlive = (name: string, val: boolean) => {
		console.log('routes', router.options.routes[41])
		router.options.routes.forEach((item) => {
			if (item.name === name) {
				item.meta!.keepAlive = val
			}
		})
	}

	/**
	 * @description: 设置页面缓存
	 * @param {toName} string 目标页面name
	 * @param {fromName} string 来源页面name
	 * @return {*}
	 */
	const setKeepPage = (toName: string, fromName: string) => {
		// 判断是否进入目标页面
		updateRouterKeepAlive(fromName, targetPages.includes(toName))
	}

	// 设置路由钩子
	onBeforeRouteLeave((to, from) => {
		setKeepPage(to.name as string, from.name as string)
	})

	return {
		setKeepPage,
		updateRouterKeepAlive
	}
}
