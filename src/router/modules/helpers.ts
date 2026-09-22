import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

type LazyRouteComponent = () => Promise<Component>

type RouteMetaOptions = {
	tabBar?: boolean
	keepAlive?: boolean
}

export function viewRoute(
	path: string,
	name: string,
	title: string,
	parent: string | null,
	component: LazyRouteComponent,
	options: RouteMetaOptions = {}
): RouteRecordRaw {
	return {
		path,
		name,
		component,
		meta: {
			title,
			...(parent ? { parent } : {}),
			tabBar: options.tabBar === true,
			keepAlive: options.keepAlive === true
		}
	}
}

export function redirectRoute(path: string, redirect: string, title: string): RouteRecordRaw {
	return {
		path,
		redirect,
		meta: {
			title,
			tabBar: false,
			keepAlive: false
		}
	}
}
