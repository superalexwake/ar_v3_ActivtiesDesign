// 必须是第一个导入：mock 要在任何 axios.create 之前替换 axios.defaults.adapter
import './mock'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'lib-flexible'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from '@/router'
import tools from '@/plugins/tools'
import { sitRouter } from './template'
import '@/assets/styles/ar.scss'
// import VConsole from 'vconsole'


sitRouter.map((ro) => {
	router.addRoute(ro)
})

// new VConsole()

const app = createApp(App)
const pinia = createPinia()
tools(app)
pinia.use(piniaPluginPersistedstate)

app.use(router).use(pinia)
app.mount('#app')
