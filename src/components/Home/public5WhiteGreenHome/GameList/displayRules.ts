export function shouldShowCategoryTitle(activeType = '') {
	return activeType === '' || activeType === 'Popular'
}
