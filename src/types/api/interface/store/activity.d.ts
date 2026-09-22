export interface Product {
	grandTotal: number
	integral: number
	productID: number
	productImg: string
	productName: string
	stock: number
}

export interface OrderItem {
	addTime: string
	counts: number
	integral: number
	orderNumber: string
	productImg: string
	productName: string
	remark: string | null
	state: number
}

export interface BannerListItem {
	url: string
	bannerUrl: string
}
export interface ProductTypeListItem {
	typeID: string
	typeName: string
}
