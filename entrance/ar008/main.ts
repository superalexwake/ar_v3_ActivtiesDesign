import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'lib-flexible'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from '@/router'
import tools from '@/plugins/tools'
import '@/assets/styles/ar.scss'

router.addRoute(
	{
		path: '/',
		name: 'home',
		component:() => import(`@/views/home/other/rajaHome.vue`),
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
