import { defineStore } from 'pinia'
import type { OrderItem, Product } from '@/types/api'

export const useActivityStore = defineStore({
	id: 'activityStore',
	state: () => ({
		lotteryItemDetail: {},
		orderItem: {} as OrderItem,
		redeemItem: {} as Product
	}),
	getters: {
		getLotteryItemDetail: (state) => state.lotteryItemDetail,
		getOrderItem: (state): OrderItem => state.orderItem,
		getRedeemItem: (state): Product => state.redeemItem
	},
	actions: {
		setLotteryItemDetail(item: any) {
			this.lotteryItemDetail = item
		},
		setOrderItem(item: OrderItem) {
			this.orderItem = item
		},
		setRedeemItem(item: Product) {
			this.redeemItem = item
		}
	},
	persist: true //true即为存储
})
