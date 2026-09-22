import {ARBWalletActivate, ARBWalletEnter, activeRSNWallet, enterRSNWallet, getARBWalletMemberInfo,bindPhone} from "@/api"
import {ActiveARwallet, EnterARwallet} from "@/types/api";
import {AwaitApiResult} from "@/utils"
import {closeToast, showLoadingToast} from "vant";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

export interface ArWalletType {
	merchantCode: string;
	memberId: number;
	walletActivationStatus: number;
	balance: number;
	walletAddress: string;
	withdrawalRewardRatio: string;
	minimumWithdrawalAmount: number;
	maximumWithdrawalAmount: number;
	timestamp: string;
}

const arWallet = ref<ArWalletType | undefined>()

/**
 * @description: 获取钱包信息
 * @return {*}
 */
export const useArwallet = () => {

	const {t} = useI18n();
	const router = useRouter()

	const isArWalletActive = computed(() => arWallet.value?.walletActivationStatus === 1)

	/**
	 * @description: 去激活钱包
	 * @param {string} page 返回页面路由名称
	 * @return {*}
	 */
	const goActive = async (page: string, type?: string) => {
		console.log('page', page, type)
		showLoadingToast({
			message: t('loading') + '...',
			forbidClick: true
		})
		const query = {
			returnUrl: 'https://' + window.location.host + '/#/main'
		}
		if (type === 'RSN') {
			const res = await AwaitApiResult<ObjResNull<ActiveARwallet>>(activeRSNWallet(query))
			if (res?.code === 0) {
				window.location.href = res?.data?.walletActivationPageUrl +
					'&memberId=' +
					res.data.memberId +
					'&merchantCode=' +
					res.data.merchantCode +
					'&timestamp=' +
					res.data.timestamp
			}
		} else {
			const res = await AwaitApiResult<ObjResNull<ActiveARwallet>>(ARBWalletActivate(query))
			if (res?.code === 0) {
				window.location.href = res?.data?.walletActivationPageUrl +
					'&memberId=' +
					res.data.memberId +
					'&merchantCode=' +
					res.data.merchantCode +
					'&timestamp=' +
					res.data.timestamp
			}
		}

		
		closeToast()
	}

	/**
	 * 钱包激活前判断的手机绑定
	 */
	const activeBind = async (data:any,page:string)=>{
		const query = {
			phone:data.phone,
			smsvCode:data.smsvCode
		}
		const res =await AwaitApiResult(AwaitApiResult(bindPhone(query)))
		// const res =await bindPhone(query)
		if(res?.code===0){
			await goActive(page)
		}
	}

	/**
	 * @description: 进入钱包
	 * @param {string} page 返回页面路由名称
	 * @return {*}
	 */
	const goWallet = async (page: string, type?: string) => {
		showLoadingToast({
			message: t('loading') + '...',
			forbidClick: true
		})
		const query = {
			returnUrl:'https://' + window.location.host + '/#/main'
		}
		if (type === 'RSN') {
			const res = await AwaitApiResult(enterRSNWallet(query))
			console.log('res', res)
			if (res?.code === 0) {
				let url = res?.data?.walletAccessUrl
				// console.log(url)
				window.location.href = url
			}
		} else {
			const res: ObjResNull<EnterARwallet> = await AwaitApiResult(ARBWalletEnter(query))
			if (res?.code === 0) {
				let url =
					res?.data?.walletAccessUrl
				// console.log(url)
				window.location.href = url
			}
		}
		
		closeToast()
	}

	const getInfo = async () => {
		const res: any = await AwaitApiResult(getARBWalletMemberInfo({ip:localStorage.getItem('ARIP')}))
		if (res.code === 0) {
			arWallet.value = res.data
		}
	}
	const onTradRule = () =>{

		let url =  `https://arwwallet.com`;
		router.push({
			name: 'ArbRule',
			query: {
				url: url
			}
		})
	}

	return {
		getInfo,
		arWallet,
		goWallet,
		goActive,
		activeBind,
		onTradRule,
		isArWalletActive
	}
}