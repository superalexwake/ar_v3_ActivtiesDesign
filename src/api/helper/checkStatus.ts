/*
 * @Description:
 */
import { showFailToast, showLoadingToast } from 'vant'
import i18n from '@/languages'
const { t } = i18n.global

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number) => {
	let msg = ''
	switch (status) {
		case 400:
			msg = t('statusTip1')
			break
		// case 401: token 已过期
		// 	msg = t('statusTip2')
		// 	break
		// case 403:  挤线问题
		// 	msg = t('statusTip3')
		// 	break
		case 404:
			msg = t('statusTip4')
			break
		case 405:
			msg = t('statusTip5')
			break
		case 408:
			msg = t('statusTip6')
			break
		case 500:
			msg = t('statusTip7')
			break
		case 502:
			msg = t('statusTip8')
			break
		case 503:
			msg = t('statusTip9')
			break
		case 504:
			msg = t('statusTip10')
			break
		default:
			msg = t('statusTip11')
	}
	if (msg) {
		showFailToast(msg)

	} else {
		showLoadingToast({
			message: 'loading...',
			forbidClick: true,
		});
	}
}
