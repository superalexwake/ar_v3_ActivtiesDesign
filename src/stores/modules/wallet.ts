/*
 * @Description:
 */
import { defineStore } from 'pinia'
import type { withdrawalslist, ResBankList, ReqNewSetWithdrawal, PayTypeNameData, PayTypeName } from '@/types/api'
import { GetPayTypeName, GetBalance, RecoverBalance, GetAllwallets, GetARGameAndPlatWallets } from '@/api'
import { AwaitApiResult, delay } from '@/utils'
import { showSuccessToast } from 'vant'
import i18n from '@/languages'
import { SettingStore } from './setting'
import {GlobalStore} from './index'
import kbzIcon from '@icon/wallet/detail/kbz_icon.png'
import waveIcon from '@icon/wallet/detail/wave_icon.png'
const { t } = i18n.global

interface WalletStoreProps {
	bankName: any
	withdrawalslist: withdrawalslist[]
	bankList: ResBankList[]
	withdrawals: ReqNewSetWithdrawal | any
	payTabList: PayTypeNameData[]
	amount: number
	timestampLast: number
	allwallets: string
	isAllowUserAddUSDT: any
	timestamp:number
}
let walletLoading=false
export const useWalletStore = defineStore({
	id: 'walletStore',
	state: (): WalletStoreProps => ({
		bankName: {},
		withdrawalslist: [],
		bankList: [],
		withdrawals: {
			amount: 0,
			pwd: '',
			type: 0,
			bid: 0
		},
		payTabList: [],
		amount: 0,
		timestampLast: 0, //上次时间戳
		timestamp:0,
		allwallets: '', //钱包页面的请求数据
		isAllowUserAddUSDT: true // 是否能添加USTD
	}),
	getters: {
		getBankName: (state) => state.bankName,
		getWithdrawalslist: (state): withdrawalslist[] => state.withdrawalslist, //getOrderItem: (state): OrderItem => state.orderItem,
		getBankList: (state): ResBankList[] => state.bankList,
		getWithdrawal: (state) => state.withdrawals,
		getPayTabList: (state): PayTypeNameData[] => state.payTabList,
		getAmount: (state) => state.amount,
		getTimestampLast: (state) => state.timestampLast,
		getAllwallets: (state) => state.allwallets,
		getADDUSTD: (state) => state.isAllowUserAddUSDT
	},
	actions: {
		setBankName(item: any) {
			this.bankName = item
		},
		setWithdrawalslist(item: withdrawalslist[]) {
			this.withdrawalslist = item
		},
		setBankList(item: ResBankList[]) {
			this.bankList = item
		},
		setWithdrawal(item: any) {
			this.withdrawals = item
		},
		setPayTabList(item: PayTypeNameData[]) {
			this.payTabList = item
		},
		setAmount(item: number) {
			this.amount = item
		},
		setUSDTCanAdd(item: any) {
			this.isAllowUserAddUSDT = item?.isAllowUserAddUSDT === undefined ? true : Boolean(item?.isAllowUserAddUSDT === '1')
		},
		setTimestampLast(item: number) {
			this.timestampLast = item
		},
		setAllwallets(item: string) {
			this.allwallets = item
		},
		async GetARGameAndPlatWallets(noTip?: boolean) {
			const timestamp = new Date().getTime() / 1000 //当前时间戳
			if ((timestamp - this.timestamp <= 4)){
				return
			}
			const res = await AwaitApiResult(GetARGameAndPlatWallets());
			if (res) {
				this.timestamp=timestamp
				this.allwallets=res?.data;
				let newData = res?.data.thidGameBalanceList || []
				let mainMoney = 0
				let otherMoney = 0
				if (newData) {
					for (var i of newData) {
						if (i.vendorCode === 'Lottery') mainMoney += i.balance
						else otherMoney += i.balance
					}
				}
				this.amount = mainMoney + otherMoney;
				if (noTip)  showSuccessToast(t('refreshSuccess'))

			}
		},
		async getAllwalletsBalance(noTip?: boolean,isSaasApi: boolean = false) {
			const global=GlobalStore()
			const timestamp = new Date().getTime() / 1000 //当前时间戳
			if ((timestamp - this.timestampLast <= 6)){
				return
			}
			if (walletLoading)return;
			walletLoading=true;
			if (global.getIsNotify){
				await  delay(1400)
			}
			const res = await AwaitApiResult(GetAllwallets(isSaasApi));
			walletLoading=false
			if (res) {
				this.timestampLast=timestamp
				this.allwallets=res?.data;
				let newData = res?.data.thidGameBalanceList || []
				let mainMoney = 0
				let otherMoney = 0
				if (newData) {
					for (var i of newData) {
						if (i.vendorCode === 'Lottery') mainMoney += i.balance
						else otherMoney += i.balance
					}
				}
				this.amount = mainMoney + otherMoney;
				if (noTip)  showSuccessToast(t('refreshSuccess'))

			}
		},
		// 刷新余额数据  参数1，是否弹提示，参数2，是否可以回收第三方游戏余额
		async resetData(noTip?: boolean, Recover?: boolean) {
			const res = await AwaitApiResult(Recover ? RecoverBalance() : GetBalance())
			if (res) {
				this.amount = res?.data.amount
				if (noTip) return
				showSuccessToast(t('refreshSuccess'))
			}
		},
		async getPayTypeName() {
			const result: ObjResNull<PayTypeName> = await AwaitApiResult(GetPayTypeName())
			if (result) {
				if (SettingStore().getIsSplitLocalEWallet) {
					let typelist = result.data.typelist.map((item) => {
						if (item.payID === 18 && item.paySysName === 'KBZPay') {
							item.payNameUrl = kbzIcon
							item.payNameUrl2 = kbzIcon
						}
						if (item.payID === 18 && item.paySysName === 'WavePay') {
							item.payNameUrl = waveIcon
							item.payNameUrl2 = waveIcon
						}
						// item.typeName = t(`code${item.typeNameCode}`)
						return item
					})
					this.setPayTabList(typelist)
					result
				}
				this.setPayTabList(result.data.typelist)
			}
		}
	},
	persist: true //true即为存储qq
})
