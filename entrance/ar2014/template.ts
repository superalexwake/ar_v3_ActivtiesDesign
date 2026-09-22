export const sitRouter = [
	{
		path: '/',
		name: 'home',
		component:() => import(`@/views/home/other/redHome.vue`),
		meta: {
			title: 'home',
			tabBar: true,
			keepAlive: false
		}
	},
]