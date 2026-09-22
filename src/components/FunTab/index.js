import FunTabBar from './tab-bar.js'
export { default as FunTabBar } from './tab-bar.js'
import FunTabItem from './tab-item.js'
export { default as FunTabItem } from './tab-item.js'
import FunTabs from './tabs.js'
export { default as FunTabs } from './tabs.js'

const install = (app) => {
	app.component(FunTabs.name, FunTabs)
	app.component(FunTabItem.name, FunTabItem)
	app.component(FunTabBar.name, FunTabBar)
}
var index = { install }

export { index as default }
