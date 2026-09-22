import { deepCopy } from '@/utils'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore({
	id: 'commonStore',
	state: () => ({
		isLoading: false,
		teleportTarget: null,
		keepAliveList: ['RechargeHistory'] as any
	}),
	getters: {
		getLoading: (state) => state.isLoading,
		getKeepAliveList: (state) => state.keepAliveList
	},
	actions: {
		setLoading(item: any) {
			this.isLoading = item
		},
		setKeepAliveList(item: any) {
			if (this.keepAliveList.includes(item)) return
			this.keepAliveList.push(item)
		},
		reastKeepAliveList() {
			this.keepAliveList = []
		},
		removeKeepAliveList(item: any) {
			let list = deepCopy(this.keepAliveList)
			const index = list.indexOf(item)
			if (index > -1) {
				list.splice(index, 1)
				this.keepAliveList = list
			}
		}
	}
})
