import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'lib-flexible'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from '@/router'
import tools from '@/plugins/tools'
router.addRoute(
	{
		path: '/',
		name: 'home',
		component:() => import(`@/views/home/other/public5WhiteGreenHome.vue`),
		meta: {
			title: 'home',
			tabBar: true,
			keepAlive: false
		}
	}
)
if (import.meta.env.DEV) {
	router.addRoute({
		path: '/preview/public5WhiteGreenHome',
		name: 'preview-public5WhiteGreenHome',
		component: () => import('@/components/Home/public5WhiteGreenHome/preview/index.vue'),
		meta: {
			title: 'preview-public5WhiteGreenHome',
			tabBar: false,
			keepAlive: false
		}
	})
}
const app = createApp(App)
const pinia = createPinia()
tools(app)
pinia.use(piniaPluginPersistedstate)

app.use(router).use(pinia)
app.mount('#app')
