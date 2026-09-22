const lotteryCodeMap: Record<number, string> = {
	1: 'Win Go',
	2: 'K3',
	3: '5D',
	4: 'Trx Win Go',
	5: 'XOSO',
	6: 'FXOSO',
	7: 'Bingo18',
	8: '4D',
	9: 'MotoRace',
	10: 'VideoWinGo'
}

const getLotteryCategoryCode = (item: any) => {
	if (item?.categoryCode) return item.categoryCode
	const lotteryId = Number(item?.id)
	if (lotteryId) return lotteryCodeMap[lotteryId] || ''
	if (typeof item?.gameCode === 'string') {
		if (item.gameCode.startsWith('TrxWinGo')) return 'Trx Win Go'
		if (item.gameCode.startsWith('VideoWinGo')) return 'VideoWinGo'
		if (item.gameCode.startsWith('WinGo')) return 'Win Go'
		if (item.gameCode.startsWith('K3')) return 'K3'
		if (item.gameCode.startsWith('D5')) return '5D'
		if (item.gameCode.startsWith('MotoRace')) return 'MotoRace'
	}
	return ''
}

export const formatLotteryName = (categoryCode = '') => {
	let text = categoryCode || ''
	switch (text) {
		case 'Trx Win Go':
			return 'Trx Win'
		case 'K3':
		case '5D':
			return `${text} Lotre`
		default:
			return text
	}
}

export const getLotteryCardName = (item: any) => {
	const categoryCode = getLotteryCategoryCode(item)
	if (categoryCode) {
		return formatLotteryName(categoryCode)
	}
	return item?.gameName || item?.gameNameEn || item?.slotsName || item?.gameCode || item?.name || ''
}
