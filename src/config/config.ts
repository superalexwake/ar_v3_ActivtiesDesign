// ? 全局不动配置项 只做导出不做修改

// * 首页地址（默认）
export const HOME_URL: string = '/'

// * 登录页地址（默认）
export const LOGIN_URL: string = '/login'

// * 路由白名单地址
export const ROUTER_WHITE_LIST: string[] = [
	'/500',
	'/',
	'/main',
	'/activity',
	'/activity/ActivityDetail',
	'/promotion',
	'/promotion/PromotionRule',
	'/promotion/RebateRatio',
	'/wallet',
	'/main/About/AboutDetail',
	'/rpwd',
	'/register',
	'/main/CustomerService',
	'/main/CustomerService/ServiceCollection',
	'/maintenance',
	'/downloadCenter',
	'/downloadCenter/ios',
	'/downloadCenter/empty',
	'/installApp',
	'/turntable',
	'/home/AllGames',
	'/home/AllOnlineGames',
	'/home/Casino',
	'/home/Casino/Detail',
	'/home/Chess',
	'/home/Chess/Detail',
	'/home/FishGames',
	'/home/Fishing',
	'/home/HotGames',
	'/home/Lottery',
	'/home/Messages',
	'/home/Original',
	'/home/Slots',
	'/home/eSports'
]

// * tabbar白名单地址
export const TAB_BAR_WHITE_LIST: string[] = ['home', 'activity', 'main', 'promotion', 'chat', 'wallet']
