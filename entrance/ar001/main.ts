import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'lib-flexible'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from '@/router'
import tools from '@/plugins/tools'
import '@/assets/styles/ar.scss'
import {checkAndUpdate} from "@/utils/app_update"


checkAndUpdate({
  jsonUrl: 'https://prototype.invalid/arsit-inr/version.json',
  immediate: false,                 // 立即切换；或 false：下次启动生效
  embeddedVersion: '1.0.0',        // 你的内置 H5 初始版本
  onLog: console.log,
})


router.addRoute(
	{
		path: '/',
		name: 'home',
		component:() => import(`@/views/home/other/red92Home.vue`),
		meta: {
			title: 'home',
			tabBar: true,
			keepAlive: false
		}
	}
)
const app = createApp(App)
const pinia = createPinia()
tools(app)
pinia.use(piniaPluginPersistedstate)

app.use(router).use(pinia)
app.mount('#app')
