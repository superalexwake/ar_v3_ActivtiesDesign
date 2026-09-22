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
	{
		path: '/public3',
		name: 'public3Home',
		component:() => import(`@/views/home/other/public3Home.vue`),
		meta: {
			title: 'public3Home',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/blackGold',
		name: 'blackGold',
		component:() => import(`@/views/home/other/blackGoldHome.vue`),
		meta: {
			title: 'public3Home',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/blackGold',
		name: 'blackGold',
		component:() => import(`@/views/home/other/blackGoldHome.vue`),
		meta: {
			title: 'blackGoldHome',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/blueHome',
		name: 'blueHome',
		component:() => import(`@/views/home/other/blueHome.vue`),
		meta: {
			title: 'blueHome',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/damanHome',
		name: 'damanHome',
		component:() => import(`@/views/home/other/damanHome.vue`),
		meta: {
			title: 'damanHome',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/goGame',
		name: 'goGame',
		component:() => import(`@/views/home/other/goGameHome.vue`),
		meta: {
			title: 'goGameHome',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/orangeHome',
		name: 'orangeHome',
		component:() => import(`@/views/home/other/orangeHome.vue`),
		meta: {
			title: 'orangeHome',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/red92Home',
		name: 'red92Home',
		component:() => import(`@/views/home/other/red92Home.vue`),
		meta: {
			title: 'red92Home',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/whiteGold2Home',
		name: 'whiteGold2Home',
		component:() => import(`@/views/home/other/whiteGold2Home.vue`),
		meta: {
			title: 'whiteGold2Home',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/whiteGoldBigMumbaiHome',
		name: 'whiteGoldBigMumbaiHome',
		component:() => import(`@/views/home/other/whiteGoldBigMumbai.vue`),
		meta: {
			title: 'whiteGoldBigMumbaiHome',
			tabBar: true,
			keepAlive: false
		}
	},
	{
		path: '/whiteGoldHome',
		name: 'whiteGoldHome',
		component:() => import(`@/views/home/other/whiteGoldHome.vue`),
		meta: {
			title: 'whiteGoldHome',
			tabBar: true,
			keepAlive: false
		}
	},
]