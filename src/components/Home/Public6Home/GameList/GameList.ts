import i18n from '@/languages'
const $t = i18n.global.t
export const gameList = [
	// {
	// 	name: $t('hot'),
	// 	img: 'hot',
	// 	type: 22,
	// 	reqType: 0,
	// 	show: true
	// },
	{
		name: $t('lottery'),
		img: 'lottery',
		type: 3,
		reqType: 1
	},
	{
		name: $t('electronic'),
		img: 'slot',
		type: 0,
		reqType: 2
	},
	{
		name: $t('sport'),
		img: 'sport',
		type: 2,
		reqType: 2
	},
	{
		name: $t('live'),
		img: 'live',
		type: 1,
		reqType: 2
	},
	{
		name: $t('chess'),
		img: 'board',
		type: 4,
		reqType: 2
	},
	{
		name: $t('fishing'),
		img: 'fishing',
		type: 11,
		reqType: 1
	},
	{
		name: $t('miniGame'),
		img: 'miniGame',
		type: 20,
		reqType: 1
	}
]

export const gameTypeIcon = [
	{
		name: $t('chess'),
		type: 5,
		icon: 'iconChess',
		typeName: 'chesscard'
	},
	{
		name: $t('fishing'),
		type: 3,
		icon: 'iconFishing',
		typeName: 'fish'
	},
	{
		name: $t('electronic'),
		type: 2,
		icon: 'iconElectric',
		typeName: 'electronic'
	},
	{
		name: $t('lottery'),
		type: 0,
		icon: 'iconLottery',
		typeName: 'lottery'
	},
	{
		name: $t('sport'),
		type: 4,
		icon: 'iconPhysics',
		typeName: 'sport'
	},
	{
		name: $t('live'),
		type: 5,
		icon: 'iconRealPerson',
		typeName: 'video'
	},
	{
		name: $t('miniGame'),
		type: 6,
		icon: 'iconMiniGame',
		typeName: 'smallgame'
	},
	{
		name: $t('electronic'),
		type: 2,
		icon: 'iconSlots',
		typeName: 'slot'
	}
]
