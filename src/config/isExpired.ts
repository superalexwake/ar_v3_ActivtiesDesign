// import router from '@/router'
// import i18n from '@/languages'
// import { showDialog } from 'vant'
// import { LOGIN_URL } from './config'
// import { GlobalStore } from '@/stores'

// import type { UserInfo } from '@/types/api'

// export const isExpired = async () => {
// 	const { t } = i18n.global
// 	const globalStore = GlobalStore()

// 	// const { UserId, Sign, KeyCode } = globalStore.userInfo as UserInfo

// 	// const res = await isTokenExpired({
// 	//     uid: UserId,
// 	//     keycode: KeyCode,
// 	//     sign: Sign,
// 	// }).catch(() => {
// 	//     throw new Error('isTokenExpired error')
// 	// })
// 	// if (res.success) {
// 	//     // State 0正常 1账号已在别处登录 2登入已过期
// 	//     if (res.data.State > 0) {
// 	//         const message =
// 	//             res.data.State === 1
// 	//                 ? t('informationTip1')
// 	//                 : t('informationTip')
// 	//         showDialog({
// 	//             title: t('tips'),
// 	//             message: message,
// 	//             confirmButtonText: t('confirm'),
// 	//         }).then(() => {
// 	//             globalStore.userInfo = {}
// 	//             globalStore.token = ''
// 	//             router.push(LOGIN_URL)
// 	//         })
// 	//     }
// 	// } else {
// 	//     if (res.msg == 'uid can not be empty' || res.msg == 'UserID error') {
// 	//         globalStore.userInfo = {}
// 	//         globalStore.token = ''
// 	//         router.push(LOGIN_URL)
// 	//     } else {
// 	//         showDialog({
// 	//             title: t('tips'),
// 	//             message: res.msg,
// 	//             confirmButtonText: t('confirm'),
// 	//         })
// 	//     }
// 	// }
// }
export {}
