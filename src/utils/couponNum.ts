import { getHashParams } from './basic'

const COUPON_NUM_KEY = 'couponNum'

const normalizeCouponNum = (v: any) => String(v || '').replace(/[\s\n\t\r]/g, '')
const getStoredCouponNum = () => localStorage.getItem(COUPON_NUM_KEY) || sessionStorage.getItem(COUPON_NUM_KEY)

/** 从邀请链接 URL / storage 解析券码（注册携带券码自动领取），并落 storage 跨页保留 */
export const resolveCouponNum = () => {
	const params = getHashParams()
	const couponNum = [params.couponNum, getStoredCouponNum()].map(normalizeCouponNum).find(Boolean) || ''
	if (couponNum) localStorage.setItem(COUPON_NUM_KEY, couponNum)
	return couponNum
}
