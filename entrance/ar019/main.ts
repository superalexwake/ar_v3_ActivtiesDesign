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
		component:() => import(`@/views/home/other/electronic.vue`),
		meta: {
			title: 'home',
			tabBar: true,
			keepAlive: false
		}
	}
)
router.addRoute(
	{
		path: '/login',
		name: 'login',
		component:() => import('../../src/views/login/loginBra.vue'),
		meta: {
			title: 'login',
			tabBar: false,
			keepAlive: false
		}
	}
)
router.addRoute(
	{
		path: '/register',
		name: 'register',
		component:() => import('../../src/views/register/registerBra.vue'),
		meta: {
			title: 'register',
			tabBar: false,
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
