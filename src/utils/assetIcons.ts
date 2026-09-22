import vipWeal1 from '@icon/main/weal/1.png'
import vipWeal2 from '@icon/main/weal/2.png'
import vipWeal3 from '@icon/main/weal/3.png'
import vipWeal4 from '@icon/main/weal/4.png'
import vipWeal5 from '@icon/main/weal/5.png'
import welfare1 from '@icon/main/myWelfare/welfare1.png'
import welfare2 from '@icon/main/myWelfare/welfare2.png'
import welfare3 from '@icon/main/myWelfare/welfare3.png'
import welfare4 from '@icon/main/myWelfare/welfare4.png'
import welfare5 from '@icon/main/myWelfare/welfare5.png'
import iconChess from '@/assets/svg/gameStats/iconChess.svg?url'
import iconFishing from '@/assets/svg/gameStats/iconFishing.svg?url'
import iconLottery from '@/assets/svg/gameStats/iconLottery.svg?url'
import iconMiniGame from '@/assets/svg/gameStats/iconMiniGame.svg?url'
import iconPhysics from '@/assets/svg/gameStats/iconPhysics.svg?url'
import iconRealPerson from '@/assets/svg/gameStats/iconRealPerson.svg?url'
import iconSlots from '@/assets/svg/gameStats/iconSlots.svg?url'
import withdrawType1 from '@icon/wallet/withdrawType/1.png'
import withdrawType3 from '@icon/wallet/withdrawType/3.png'
import withdrawType4 from '@icon/wallet/withdrawType/4.png'
import withdrawType5 from '@icon/wallet/withdrawType/5.png'
import withdrawType6 from '@icon/wallet/withdrawType/6.png'
import withdrawType8 from '@icon/wallet/withdrawType/8.png'
import withdrawType10 from '@icon/wallet/withdrawType/10.png'
import withdrawType21 from '@icon/wallet/withdrawType/21.png'
import rechargeIcon from '@icon/wallet/rechargeIcon.png'
import rechargeHistory from '@icon/wallet/rechargeHistory.png'
import succeedIcon from '@icon/wallet/succeed.png'
import tipIcon from '@icon/wallet/tip.png'
import trxIcon from '@icon/wallet/trx.png'
import usdtIcon from '@icon/wallet/usdt.png'
import widthdrawBlue from '@icon/wallet/widthdrawBlue.png'
import withdrawHistory from '@icon/wallet/withdrawHistory.png'

const vipWealIconMap: Record<string, string> = {
	'1': vipWeal1,
	'2': vipWeal2,
	'3': vipWeal3,
	'4': vipWeal4,
	'5': vipWeal5
}

const vipWelfareIconMap: Record<string, string> = {
	'1': welfare1,
	'2': welfare2,
	'3': welfare3,
	'4': welfare4,
	'5': welfare5
}

const gameStatsIconMap: Record<string, string> = {
	iconChess,
	iconElectric: iconSlots,
	iconFishing,
	iconLottery,
	iconMiniGame,
	iconPhysics,
	iconRealPerson,
	iconSlots
}

const walletWithdrawTypeIconMap: Record<string, string> = {
	'1': withdrawType1,
	'3': withdrawType3,
	'4': withdrawType4,
	'5': withdrawType5,
	'6': withdrawType6,
	'8': withdrawType8,
	'10': withdrawType10,
	'21': withdrawType21
}

const walletIconMap: Record<string, string> = {
	rechargeIcon,
	rechargeHistory,
	succeed: succeedIcon,
	tip: tipIcon,
	trx: trxIcon,
	usdt: usdtIcon,
	widthdrawBlue,
	withdrawHistory
}

export const getVipWealIcon = (id?: string | number) => {
	return vipWealIconMap[String(id)] || ''
}

export const getVipWelfareIcon = (type?: string | number) => {
	return vipWelfareIconMap[String(type)] || ''
}

export const getGameStatsIcon = (name?: string) => {
	return gameStatsIconMap[String(name)] || ''
}

export const getWalletWithdrawTypeIcon = (type?: string | number) => {
	return walletWithdrawTypeIconMap[String(type)] || ''
}

export const getWalletIcon = (name?: string) => {
	return walletIconMap[String(name)] || ''
}
