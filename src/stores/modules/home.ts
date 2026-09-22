import { defineStore } from 'pinia'

interface HomeStoreState {
	rankList: any[]
	sitemsg: any
	isRead: boolean
	lotterySoltList: any
	currentMenu: string,
	currentTitle: string,
	homeMenu: {
		title: string
		img: string
		key: string
	}[],
}

export const useHomeStore = defineStore({
	id: 'homeStore',
	state: (): HomeStoreState => ({
		rankList: [],
		sitemsg: {},
		isRead: false,
		lotterySoltList: {},
		currentMenu: sessionStorage.getItem('clickedGameType') || '',
		currentTitle: '',
		homeMenu: [],
	}),
	getters: {
		getRankList: (state) => state.rankList,
		getSiteMsg: (state) => state.sitemsg,
		getReadState: (state) => state.isRead,
		getLotterySoltList: (state) => state.lotterySoltList,
		getCurrentMenu: (state) => state.currentMenu,
		getCurrentTitle: (state) => state.currentTitle,
	},
	actions: {
		setRankList(item: any) {
			this.rankList = item
		},
		setSiteMsg(item: any) {
			this.sitemsg = item
		},
		setReadState(item: any) {
			this.isRead = item
		},
		setLotterySoltList(item: any) {
			this.lotterySoltList = item
		},
		setCurrentMenu(item: string) {
			this.currentMenu = item
		},
		setCurrentTitle(item: string) {
			this.currentTitle = item
		},
		setHomeMenu(item: any) {
			this.homeMenu = item
		},
	}
})
