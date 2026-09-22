export type GameNavItem = {
	type: string
	label: string
}

type GameCategoryLike = {
	categoryCode?: string
	state?: number
	sort?: number
}

export type GameMenuItem = GameNavItem & {
	isShow?: boolean
	key?: string
	sort?: number
}

const normalizeCategoryKey = (categoryCode?: string) => {
	if (!categoryCode) return ''
	return categoryCode.charAt(0).toUpperCase() + categoryCode.slice(1)
}

const parseCachedMenu = (cachedMenu?: string | null) => {
	if (!cachedMenu) return [] as GameMenuItem[]
	try {
		const parsed = JSON.parse(cachedMenu)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

export const buildGameMenuTab = ({
	navItems,
	categories,
	cachedMenu
}: {
	navItems: GameNavItem[]
	categories: GameCategoryLike[]
	cachedMenu?: string | null
}) => {
	const all: GameMenuItem = { type: '', label: 'Lobby' }
	const liveMenu = categories
		.filter((item) => item.state === 1)
		.map((item) => ({
			isShow: true,
			key: normalizeCategoryKey(item.categoryCode),
			sort: item.sort
		}))

	const sourceMenu = liveMenu.length ? liveMenu : parseCachedMenu(cachedMenu)
	const merged = navItems
		.map((item) => {
			const match = sourceMenu.find((menu) => menu.key === item.type)
			return match ? { ...match, ...item } : null
		})
		.filter((item): item is GameMenuItem => item !== null)
		.sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0))
		.filter((item) => item.isShow)

	return [all, ...merged]
}
