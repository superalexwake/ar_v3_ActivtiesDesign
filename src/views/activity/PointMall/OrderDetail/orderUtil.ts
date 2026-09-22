
import orderPendingImg from '@public/activity/PointMall/orderPendingImg.png'
import orderSentImg from '@public/activity/PointMall/orderSentImg.png'
import orderCompletedImg from '@public/activity/PointMall/orderCompletedImg.png'
import orderCanceledImg from '@public/activity/PointMall/orderCanceledImg.png'

import i18n from '@/languages'

const $t = i18n.global.t

export function getStatusImg(index: number) {
	switch (index) {
		case 0:
			return orderPendingImg
		case 1:
			return orderSentImg
		case 2:
			return orderCompletedImg
		case 3:
			return orderCanceledImg
		default:
			return orderPendingImg
	}
}

export function statusText(index: number) {
	switch (index) {
		case 0:
			return $t('tobeDelivered')
		case 1:
			return $t('shipped')
		case 2:
			return $t('completed')
		case 3:
			return $t('canceled')
		default:
			return $t('tobeDelivered')
	}
}
