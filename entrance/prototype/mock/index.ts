import axios from 'axios'
import { createMockAdapter, readLang } from './adapter'
import { routes } from './handlers'
import { userInfoOf } from './handlers/session'
import { DEFAULT_SCENARIO, readScenario, resolveParams } from './scenario'
import { readState, writeState } from './state'
import type { Catalog, MockContext, ParamValue, Scenario, SessionState } from './types'

/** 伪造登录态涉及的 localStorage 键 */
const SESSION_KEYS = ['token', 'tokenHeader', 'refreshToken', 'userInfo']

const scenario = readScenario()
const state = readState()
const ready = loadParams(scenario, state)
window.__protoMock = { unhandled: [], scenario, defaultScenario: DEFAULT_SCENARIO, params: {} }
axios.defaults.adapter = createMockAdapter(routes, scenario, state, ready)
disableServiceWorker()
// 顶层 await：main.ts 在它完成后才创建 App 和 store
window.__protoMock.params = await ready
writeState(state)
applySession()

async function loadParams(scenario: Scenario, state: SessionState): Promise<Record<string, Record<string, ParamValue>>> {
	try {
		const response = await fetch('catalog.json', { cache: 'no-store' })
		if (!response.ok) throw new Error('HTTP ' + response.status)
		const catalog = (await response.json()) as Catalog
		return resolveParams(catalog.activities, scenario, state)
	} catch (error) {
		console.error('[mock] catalog.json 加载失败：', error)
		return {}
	}
}

function disableServiceWorker(): void {
	if (!('serviceWorker' in navigator)) return
	void navigator.serviceWorker.getRegistrations().then((list) => list.forEach((item) => void item.unregister()))
	// greatPwa 会在页面 load 时注册 /ar-sw.js；返回挂起的 Promise，既不注册也不产生失败日志
	navigator.serviceWorker.register = () => new Promise<ServiceWorkerRegistration>(() => {})
}

function applySession(): void {
	if (!scenario.loggedIn) {
		SESSION_KEYS.forEach((key) => localStorage.removeItem(key))
		return
	}
	localStorage.setItem('token', 'prototype-token')
	localStorage.setItem('tokenHeader', 'Bearer ')
	localStorage.setItem('refreshToken', 'prototype-refresh')
	// 真实登录会写入不带加号的区号，手机号输入组件（如激活验证弹窗）直接读取它
	localStorage.setItem('numberType', '91')
	try {
		const ctx: MockContext = { path: '', body: {}, scenario, state, lang: readLang(), params: window.__protoMock.params }
		localStorage.setItem('userInfo', JSON.stringify(userInfoOf(ctx)))
	} catch (error) {
		// 清单加载失败时参数为空，读取参数会抛错；与 handler 返回 code -1 一样只记录，不中断 H5 启动
		console.error('[mock] userInfo 种子生成失败：', error)
	}
}
