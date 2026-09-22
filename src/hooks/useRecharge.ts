import iconWalletWithdrawWithdrawHistoryAllNS from '@public/wallet/withdraw/withdrawHistory/all_NS.png'
import iconWalletWithdrawWithdrawHistoryAll from '@public/wallet/withdraw/withdrawHistory/all.png'
import {
	C2CRechargeConfirm,
	C2CRechargeGetPayingDetail,
	cancelRechargeOrder,
	CheckFirstPixRecharge,
	createC2CRecharge,
	CreateRechargeOrder,
	getARPayOrder,
	getArUpiOrderPay,
	GetBankOrder,
	GetBankOrderInfo,
	GetC2CRechargeAwardAmountList,
	getC2CRechargeDetail,
	GetC2CRechargeRecord,
	getOrderAppeal,
	GetPayTypeName,
	GetRechargeRecord,
	GetRechargeTypes,
	getRNSWalletInfo,
	getRSNOrderPay,
	GetUpiOrder,
	GetUsdtOrder,
	NewSetBankQRCodeOrder,
	NewSetRechargesBankOrder,
	RechargesUpiOrder,
	RechargesUsdtOrder,
	ThirdPay,
	UpdateRechargesUpiOrder,
	UpdateRechargesUsdtOrder,
	UpRechargesBankOrder,
	getArUpiOnGoingOrder,
	cancelPayment,
	arUpiGetBankListToken,
	cancellationReasonList
} from '@/api'
import { GlobalStore, SettingStore } from '@/stores'
import type {
	Banklist,
	C2CRechargeRecord,
	chargeRecordList,
	CreateUpiOrderRep,
	NewSetRechargesBankOrderData,
	PayTypeName,
	PayTypeNameData,
	QrcodeBankInfo,
	RechargeLocalUsdtInfo,
	Rechargetypelist,
	RechargeTypesData,
	RechargeUsdtReq,
	SellerInfo,
	SuggessList,
	ThirdPayInfo,
	UpdateUsdtOrderInfo,
	UpiOrderInfo,
	UpRechargesBankOrderQuery,
	UsdtOrderInfo,
	UserRechargeCouponItem
} from '@/types/api'
import { useDebounceFn } from '@vueuse/core'
import {
	arUpiPayTypeList,
	AwaitApiResult,
	AwaitWrap,
	bouns,
	currency,
	formatTime,
	getUserDeviceType,
	isOpenExternalUrl,
	openExternalUrl,
	partyUrl
} from '@/utils'
import { showFailToast, showLoadingToast, showSuccessToast, showToast, showConfirmDialog } from 'vant'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useEventBus } from '@/components/common/use'
import qrcode from 'qrcode'
import qs from 'qs'
import { isHybridApp, openBrowser } from '@/utils/jsBridge'
import { getFacebookAttributionParams } from '@/utils/point'
import { ArWalletType, useArwallet } from './useARwallet'
import { COUPON_RECHARGE_ORDER_ENABLED } from '@/hooks/useCoupon.hook'
import { useTrigger, useStorage, useCustomService } from '@/hooks'

const getFacebookRechargeVendorId = (isOpenAdjustEvent: boolean) => (isOpenAdjustEvent ? 3 : 1)

interface ThirdPayBankList {
	bankID: number
	bankName: string
	bankCode: string
	sort: number
	payTypeName: string
	type: number
}

interface ReacargeStore {
	rechangeUpiShow: boolean // UPI充值弹窗
	currentMenu: number // 当前充值大类索引
	rechargeSubmitBtnStatus: boolean // 充值提交按钮状态
	rechargeType: PayTypeNameData[] // 充值大类
	bankList: RechargeTypesData['banklist'] // 银行列表
	rechargeTypes: Rechargetypelist[] // 充值渠道
	bank_local: string[] // 本地银行字段信息
	C2CQuickList: SuggessList[] // C2C快速选择金额列表
	quickList: string[] // 快捷金额列表
	currentQuickIndex: number // 当前选中的快捷金额索引
	priceRange: {
		// 金额范围
		min: number
		max: number
	}
	currentPayType: Rechargetypelist // 当前充值渠道
	isRechargeInputDialog: boolean // 是否显示充值弹窗
	amount: number | undefined // 充值金额
	numberPayAmount: number | undefined // 数字货币充值金额
	validateAmount: string
	numberExchangeRate: number | undefined // 数字货币汇率
	rechargeDialogVisible: boolean // 充值弹窗
	bankInfo: {
		[keyof: string]: string
	}
	currentBankIndex: number
	isC2COrder: boolean // 是否C2C订单
	C2COrderInfo: SellerInfo | undefined // C2C订单信息
	isBankOrder: boolean // 是否银行订单
	bankOrderInfo: NewSetRechargesBankOrderData | undefined // 银行订单信息
	currentPayId: number // 当前充值大类ID
	localUsdtInfo: RechargeLocalUsdtInfo[] // 本地USDT充值渠道信息
	currentLocalUsdtIndex: number // 当前本地USDT充值渠道索引
	usdtOrderInfo: UsdtOrderInfo | undefined // usdt订单信息
	isUsdtOrder: boolean // 是否USDT订单
	orderDetail: NewSetRechargesBankOrderData | undefined // 本地银行订单详情
	bankUTR: string // UTR
	localUpiUTR: string // UPI
	upiOrderInfo: UpiOrderInfo | undefined // UPI订单信息
	isUpiOrder: boolean // 是否UPI订单
	CreateUpiOrderRep: CreateUpiOrderRep | undefined // UPI订单信息
	otherBankName: string // 三方银行选择
	thirdPayBankList: ThirdPayBankList[] // 第三方支付银行列表
	selectOtherBank: ThirdPayBankList | undefined // 第三方支付银行选择
	arPayInfo: ArWalletType | undefined
	isArPayOrder: boolean | string // 是否AR订单
	isRsnPayOrder: boolean | string // 是否AR订单
	isArUpiPayOrder: boolean | string // 是否isArUpiPayOrder订单
	rsnInfo: {
		balance: number
		walletActivationStatus: number
		walletAddress: string
	}
	goingOrder: Record<string, any> | null
	arupiGoingOrder: boolean
	payTypeLoading: boolean
	reasonShow: boolean
	selectedCoupon: UserRechargeCouponItem | null // 选中的充值券（供试算/带券下单）
	couponSyncKey: number // 带券下单后自增，触发券面板与后端对账
	// rechargeQrcodeVisible: boolean // 扫码充值弹窗
}

const store = reactive<ReacargeStore>({
	rechangeUpiShow: false,
	rechargeSubmitBtnStatus: false,
	currentMenu: -4,
	rechargeType: [],
	bankList: [],
	rechargeTypes: [],
	bank_local: [],
	quickList: [],
	C2CQuickList: [],
	priceRange: {
		min: 0,
		max: 0
	},
	currentPayType: {} as Rechargetypelist,
	isRechargeInputDialog: JSON.parse(localStorage.getItem('userInfo') || '{}').isOpenOfficialRechargeInputDialog === '1',
	amount: undefined,
	numberPayAmount: undefined,
	numberExchangeRate: 0,
	validateAmount: '',
	currentQuickIndex: -1,
	rechargeDialogVisible: false,
	bankInfo: {},
	currentBankIndex: 0,
	isC2COrder: false,
	C2COrderInfo: undefined,
	isBankOrder: false,
	bankOrderInfo: undefined,
	isUsdtOrder: false,
	currentPayId: 0,
	localUsdtInfo: [],
	currentLocalUsdtIndex: 0,
	usdtOrderInfo: {} as UsdtOrderInfo,
	orderDetail: {} as NewSetRechargesBankOrderData,
	bankUTR: '',
	localUpiUTR: '',
	upiOrderInfo: undefined,
	isUpiOrder: false,
	CreateUpiOrderRep: undefined,
	otherBankName: '',
	thirdPayBankList: [],
	selectOtherBank: undefined,
	arPayInfo: undefined,
	isArPayOrder: false,
	isRsnPayOrder: false,
	isArUpiPayOrder: false,
	rsnInfo: {
		balance: 0,
		walletActivationStatus: 0,
		walletAddress: ''
	},
	goingOrder: null,
	arupiGoingOrder: false,
	payTypeLoading: false,
	reasonShow: false,
	selectedCoupon: null,
	couponSyncKey: 0
	// rechargeQrcodeVisible: false
})

// 带券下单参数收口。绝不传 0——前端签名不跳零值、后端 SortJson 跳零值，传 0 会致签名串不一致而验签失败(对接文档 §1.1/§8-2)
const attachCoupon = (params: any) => {
	const id = store.selectedCoupon?.userRechargeCouponId
	if (COUPON_RECHARGE_ORDER_ENABLED && id) params.userRechargeCouponId = id
}

// 下单请求已返回，带券单可能已被后端锁券(锁后即从可用券列表消失)，通知面板重拉对账。
// 不判成败：下单响应不含券结果(对接文档 §6.2)，券是否真锁只有重拉才知道，一律拉最省心
const syncCouponAfterOrder = () => {
	if (store.selectedCoupon) store.couponSyncKey++
}

const locakBankList = [9, 10, 18, 19]
const numberPayList = [11, 16, 19]
const countdownRef = ref<HTMLElement>() // 倒计时dom
const transfer = ref(1) // 转账类型 1 银行  2钱包
const countdown = ref<NodeJS.Timer | any>() // 倒计时
const isFirstPixRecharge = ref(false) // 是否首次pix充值
const needPixInfo = ref(false)
const pollingQuickAmount = ref<NodeJS.Timer | any>()

export const useRecharge = () => {
	const { t } = useI18n()
	const eventBus = useEventBus()
	const { localStore } = useStorage()
	const { handleOpen } = useCustomService({ type: 3 })
	const { goWallet } = useArwallet()
	const isC2CRecharge = computed(() => currentPayId.value === 20) // 是否C2C充值
	const isArpay = computed(() => currentPayId.value === 21) // 是否arpay充值
	const isRsnpay = computed(() => currentPayId.value === 22) // 是否arpay充值
	const isArUpiPay = computed(() => arUpiPayTypeList.includes(store.currentPayType?.payTypeID) || currentPayId.value === 26) // 是否arpay充值
	const globalStore = GlobalStore()
	const setting = SettingStore()
	const userInfo = globalStore.getUserInfo
	const usdtRate = computed(() => userInfo.uRate) // usdt汇率
	const trxRate = computed(() => userInfo.trxRate) // trx汇率
	const isOpenOfficialRechargeInputDialog = computed(() => userInfo.isOpenOfficialRechargeInputDialog === '1') // trx汇率
	const IsShowRechargeBankList = computed(
		() => userInfo.isShowRechargeBankList === '1' || ![9, 10].includes(currentPayId.value)
	) // trx汇率
	const isNumberPay = computed(() => numberPayList.includes(currentPayId.value)) // 是否数字货币充值
	const rechargeDetailAmount = computed(
		() => (isNumberPay.value ? Number(store.numberExchangeRate) : Number(store.amount)) || 0
	)

	// vipRechargeRate 在大类上，未在类型声明，用 any 取
	const rechargeCategory = computed<any>(() => store.rechargeType[store.currentMenu] || {})

	// newRechargeRiftRate 取当前选中渠道，非大类统一值
	const channelGiftAmount = computed(
		() => rechargeDetailAmount.value * (Number((store.currentPayType as any)?.newRechargeRiftRate) || 0)
	)

	// 快捷档位固定赠送，手输金额无
	const quickGiftAmount = computed(() =>
		store.currentQuickIndex >= 0 ? Number((store.quickList[store.currentQuickIndex] as any)?.giftAmount) || 0 : 0
	)

	const levelGiftAmount = computed(() => {
		const levelGift = store.currentPayType?.userRechargeLevelGift
		if (!levelGift) return 0
		const ratio = Number(levelGift.giftRatio) || 0
		const maxBonus = Number(levelGift.maxBonusAmount) || 0
		const gift = rechargeDetailAmount.value * ratio
		// maxBonusAmount 为 0 表示不封顶
		return maxBonus > 0 ? Math.min(gift, maxBonus) : gift
	})

	// 充值等级、渠道优惠、快捷赠送三笔合并展示为一行
	const rechargeBonusAmount = computed(() => levelGiftAmount.value + channelGiftAmount.value + quickGiftAmount.value)

	const rechargeVipRewardAmount = computed(
		() => rechargeDetailAmount.value * (Number(rechargeCategory.value.vipRechargeRate) || 0)
	)

	// serviceFeeRate 在当前充值渠道 currentPayType（rechargetypelist）上，不在大类 rechargeType 上
	const rechargeHandlingFee = computed(() =>
		bouns(rechargeDetailAmount.value * (Number(store.currentPayType?.serviceFeeRate) || 0))
	)

	// 选券即展示预估，与 bonus/VIP 同为前端试算口径
	// TODO(核销上线对齐)：BonusMergeMode 互斥(取高/优先券)的真实结算以后端为准，此处暂按叠加展示
	const rechargeCouponBonus = computed(() => {
		const coupon = store.selectedCoupon
		if (!coupon) return 0
		// rechargeDetailAmount 已是法币口径（U 类通道按汇率换算过），与后端门槛同口径；等于门槛即达标
		if (coupon.minRechargeAmount > 0 && rechargeDetailAmount.value < coupon.minRechargeAmount) return 0
		const gift = rechargeDetailAmount.value * (Number(coupon.rechargeGiftRate) || 0)
		// rechargeGiftLimit 为 0 表示不封顶
		return coupon.rechargeGiftLimit > 0 ? Math.min(gift, Number(coupon.rechargeGiftLimit)) : gift
	})

	const rechargeActualCredit = computed(
		() =>
			rechargeDetailAmount.value +
			rechargeBonusAmount.value +
			rechargeVipRewardAmount.value +
			rechargeCouponBonus.value -
			rechargeHandlingFee.value
	)

	// serviceFeeRate 字段缺失 = 旧接口，明细口径无从谈起；四项全为 0 时明细等同于原金额，明细块与充值说明公式一并不展示
	const showRechargeDetail = computed(
		() =>
			rechargeDetailAmount.value > 0 &&
			store.currentPayType?.serviceFeeRate !== undefined &&
			(rechargeBonusAmount.value > 0 ||
				rechargeVipRewardAmount.value > 0 ||
				rechargeCouponBonus.value > 0 ||
				rechargeHandlingFee.value > 0)
	)
	const router = useRouter()
	const rechargeActionSheetShow = ref(false) // 充值弹窗
	const cancelOrderShow = ref(false) // 取消订单弹窗
	const recordRef = ref()
	const RechargeRList = ref<(chargeRecordList & C2CRechargeRecord)[]>([])
	const showOtherSelect = ref(false) // 其他选择弹窗
	const C2CforbiddenShow = ref(false) // 禁止C2C充值弹窗
	const ErrorCount = ref(0) // 错误计数
	const RemainingLimitTime = ref(0) // 禁止交易时间
	const C2COrderTimeOutStatus = ref(false) // C2C订单超时状态
	const thirdRechargeDialog = ref(false) // 第三方充值弹窗
	const thirdRechargeUrl = ref('') // 第三方充值链接
	const pixFlag = ref(false) //
	/**
	 * arupi 钱包充值
	 */
	const showArupiAmount = ref(false)
	const arupiAmountList = ref([])
	const arupiAmount = ref()
	const amountType = ref(2)
	const cancelOrder = ref(false)
	const rechargeOrderNumber = ref('')
	const dollarSign = computed(() => setting.getDollarSign)

	const showAmountError = ref(false) // 展示金额错误弹窗

	const reasonList = ref<any[]>([])
	const from = reactive({
		checked: -1,
		text: ''
	})
	const setCountdownRef = (el: HTMLElement) => {
		countdownRef.value = el
	}

	const numberKeyObj: {
		[key: number]: {
			[key: string]: string
		}
	} = {
		11: {
			key: 'USDT',
			unit: 'USDT',
			selectText: t('selectUSDTNum'),
			placeholder: t('enterUSDTAmount'),
			icon: 'usdt'
		},
		16: {
			key: 'TRX',
			unit: 'TRX',
			selectText: t('selectTRXNum'),
			placeholder: t('enterTRXAmount'),
			icon: 'trx'
		},
		19: {
			key: 'USDT',
			unit: 'USDT',
			selectText: t('selectUSDTNum'),
			placeholder: t('enterUSDTAmount'),
			icon: 'usdt'
		}
	}
	/**
	 * @description: 获取C2C充值单位,例如100则填充为00，1000则填充为000
	 * @param {*} computed
	 * @return {*}
	 */
	const getC2CunitAmount = computed(() => {
		let c2cUnitAmount = store.rechargeTypes[0]?.c2cUnitAmount
		if (c2cUnitAmount) {
			return c2cUnitAmount.toString().substring(1)
		} else {
			return '00'
		}
	})

	const getTransferBankList = computed(() => {
		if (store.bankList?.length < 1) return []
		return store.bankList?.filter((item) => item.transferType === transfer.value)
	})

	const isUpi = computed(() => currentPayId.value === 12)

	/**
	 * @description: 当前充值大类ID
	 */
	const currentPayId = computed(() => store.currentPayId)

	/**
	 * @description: 是否本地银行
	 */
	const isLocakBank = computed(() => locakBankList.includes(currentPayId.value))
	/**
	 * @description: 是否扫码银行卡
	 */
	const isQrcodeBank = computed(() => currentPayId.value === 10)

	/**
	 * @description: 当前充值渠道类型ID
	 */
	const currentPayTypeId = computed(() => store.currentPayType.payTypeID || -1)

	/**
	 * @description: 是否三方充值
	 */
	const isOtherRecharge = computed(
		() => !isLocakBank.value && !isArpay.value && !isRsnpay.value && !isArUpiPay.value && !isUpi.value && !isQrcodeBank.value
	)

	/**
	 * @description: 当前银行名称
	 */
	const currentBankName = computed(() => {
		let bankName =
			dollarSign.value === '৳'
				? getTransferBankList.value[store.currentBankIndex].bankName
				: store.bankList[store.currentBankIndex].bankName
		return bankName
	})

	const currentBankList = computed(() => {
		return dollarSign.value === '৳' ? getTransferBankList.value : store.bankList
	})

	const currentOtherThirdBankList = computed(() => {
		if (store.thirdPayBankList.length > 0) {
			return store.thirdPayBankList.filter((item) => item.type === store.currentPayType.payTypeID)
		}
		return []
	})

	/**
	 * @description: 判断是否拆分本地电子钱包且当前充值大类为电子钱包是否展示银行卡列表
	 * @param {*} computed
	 * @return {*}
	 */
	const isSplitLocalEWallet = computed(() => {
		if (currentPayId.value !== 18) return true
		return !SettingStore().getIsSplitLocalEWallet ? true : false
	})
	/**
	 * @description: 设置当前tab，从store中读取
	 */
	const getRechargeTab = async () => {
		store.rechargeType.unshift({
			payNameUrl2: iconWalletWithdrawWithdrawHistoryAllNS,
			payNameUrl: iconWalletWithdrawWithdrawHistoryAll,
			payID: -1,
			payName: t('all'),
			minPrice: 0,
			maxPrice: -0,
			scope: '',
			typeName: t('all'),
			payTypeID: 0,
			paySysName: ''
		})

		store.currentMenu = 0
		// return walletStore.getPayTabList
	}

	/**
	 * @description: 是否有订单
	 */
	const isHaveOrder = computed(() => {
		if (isUpi.value) {
			return !!store.isUpiOrder
		}
		if (isLocakBank.value || isQrcodeBank.value) {
			return !!store.isBankOrder || !!store.isUsdtOrder
		}
		if (isArpay.value) {
			return !!store.isArPayOrder
		}
		if (isRsnpay.value) {
			return !!store.isRsnPayOrder
		}
		if (isArUpiPay.value) {
			return !!store.isArUpiPayOrder
		}
		return false
	})

	/**
	 * @description: 数字货币汇率
	 */
	const currentUate = computed(() => {
		if (currentPayId.value === 11 || currentPayId.value === 19) {
			return usdtRate.value
		}
		if (currentPayId.value === 16) {
			return trxRate.value
		}
		return 0
	})

	/**
	 * @description: AR wallet
	 */
	const arPay = computed(() => {
		return store.rechargeType.find((item) => item.payID === 21)
	})

	/**
	 * @description: RNS wallet
	 */
	const rnsPay = computed(() => {
		return store.rechargeType.find((item) => item.payID === 22)
	})

	/**
	 * @description: arupi wallet
	 */
	const arUpiPay = computed(() => {
		return store.rechargeType.find((item) => item.payID === 26)
	})

	/**
	 * @description: 获取支付大类，除了upi
	 */
	const getPayTabList = computed(() => {
		return store.rechargeType //.filter((item) => ![21, 22].includes(item.payID))
	})

	/**
	 * @description: 获取本地USDT充值渠道信息
	 */
	const getLocalUsdtInfo = computed(() => store.localUsdtInfo[store.currentLocalUsdtIndex])

	/**
	 *  @description: 充值范围
	 */
	const placeholder = computed(() => {
		const { min, max } = store.priceRange
		return `${currency(min)} - ${currency(max)}`
	})
	/**
	 * @description: 获取充值大类
	 * @param {number[]} preferredPayIds 券包跳转带入的适用大类，按 Tab 展示序取首个命中作默认选中；未命中/未传恒为 0（原默认行为）
	 */
	const getRechargeTypeName = async (isHistory?: boolean, preferredPayIds?: number[]): Promise<void> => {
		restRechargeType()
		store.currentMenu = 0
		store.rechargeType = []
		const type = await getUserDeviceType()
		const result: ObjResNull<PayTypeName> = await AwaitApiResult(GetPayTypeName({ deviceType: type }))
		if (result) {
			store.rechargeType = result.data.typelist
			if (!store.rechargeType.length) return
			const matched = preferredPayIds?.length
				? store.rechargeType.findIndex((item) => preferredPayIds.includes(item.payID))
				: -1
			// currentPayId 与 handleChangeMenu 用同一 index 一步到位：先设 [0] 再切会让券面板 watch 双触发竞态
			const index = matched >= 0 ? matched : 0
			const payID = store.rechargeType[index].payID
			store.currentPayId = payID
			!isHistory && handleChangeMenu(index)
			isHistory && getRechargeTab()
		}
	}

	/**
	 * @description: 电子钱包获取当前通道ID
	 * @return {*}
	 */
	const getElwallett = () => {
		let payTypeId = store.rechargeTypes.find((item) => item.paySysName === currentBankName.value)?.payTypeID as number
		return payTypeId
	}

	/**
	 * @description: 改变充值菜单
	 * @param {number} index 菜单索引
	 * @return {*}
	 */
	const handleChangeMenu = async (index: number) => {
		const currentPayId = getPayTabList.value[index].payID
		store.currentMenu = index
		if (index === -1) {
			store.currentPayId = 21
		} else if (index === -2) {
			store.currentPayId = 22
		} else if (index === -3) {
			store.currentPayId = 26
		} else {
			store.currentPayId = currentPayId
		}
		store.arupiGoingOrder = false
		store.goingOrder = null
		restIsHaveOrder()
		await getRechargeTypes()
		if (isUpi.value && !isArUpiPay.value) {
			getUpiOrderInfo()
		} else if (isArpay.value) {
			getArpayOrderInfo()
		} else if (isRsnpay.value) {
			getRnspayOrderInfo()
		} else if (isArUpiPay.value) {
			getArUpiOrderPayInfo()
			getArUpiOrderPayGoingOrder()
		} else if (isLocakBank.value || isQrcodeBank.value) {
			if (currentPayId.value === 19) {
				getUsdtOrderInfo()
			} else if (currentPayId.value === 18 && !SettingStore().getIsSplitLocalEWallet) {
				// console.log(currentBankName.value)
				// let payTypeId = store.rechargeTypes.find(item => item.paySysName === currentBankName.value)?.payTypeID as number
				getBankOrderInfo(getElwallett())
			} else {
				let payId = store.currentPayType.payTypeID
				getBankOrderInfo(isQrcodeBank.value ? currentPayId.value : payId || -1)
			}
		}

		restAmount() // 重置金额
	}

	const restIsHaveOrder = () => {
		store.isArPayOrder = false
		store.isRsnPayOrder = false
		store.isArUpiPayOrder = false
		store.isC2COrder = false
		store.isUpiOrder = false
		store.isBankOrder = false
		store.isUsdtOrder = false
	}
	const onJumpArUpi = (submitUrl: string, name = 'arupi', isJump = true) => {
		if (!submitUrl) return
		if (setting.getArUpiInputUtrSwitch && name === 'arupi') {
			name = 'arupi_v2'
		}
		const data = qs.parse(submitUrl.split('?')[1])
		localStore.set('ar_p_t', data.token)
		localStore.set('ar_p_lang', data.lang)
		isJump &&
			router.push({
				name,
				query: {
					payTypeId: store.currentPayType.payTypeID
				}
			})
	}

	/**
	 * @description: 获取充值渠道
	 */
	const getRechargeTypes = async (payid?: number, payTypeID?: number, deviceType?: number): Promise<void> => {
		if (store.payTypeLoading) return
		store.payTypeLoading = true
		const l = showLoadingToast({
			message: t('loading') + '...',
			forbidClick: true
		})
		const type = await getUserDeviceType()
		const res: ObjResNull<RechargeTypesData> = await AwaitApiResult(
			GetRechargeTypes({
				payid: currentPayId.value || (payid as number),
				payTypeId: getPayTabList.value[store.currentMenu]?.payTypeID || payTypeID,
				deviceType: type
			})
		)
		store.payTypeLoading = false
		l.close()
		if (res) {
			if (currentPayId.value === 19) {
				store.localUsdtInfo = res.data.localUsdtlist
			}
			store.rechargeTypes = res.data.rechargetypelist
			store.bankList = res.data.banklist
			if (isLocakBank.value && store.bankList?.length > 0) {
				store.currentBankIndex = 0
			}
			if (isQrcodeBank.value) {
				if (store.bankList?.length > 1) {
					store.currentBankIndex = getRandomBank()
				}
				store.bank_local = res.data.rechargetypelist[0].parameters.split('|')
			}
			if (isLocakBank.value) {
				if (currentPayId.value === 18) {
					const initBankName = store.bankList[0].bankName
					const initBankType = res.data.rechargetypelist?.find((res) => res.paySysName === initBankName)
					if (initBankType && initBankType.parameters) {
						store.bank_local = initBankType.parameters.split('|')
					}
				} else {
					store.bank_local = res.data.rechargetypelist[0].parameters.split('|')
				}
				console.log('bank_local', store.bank_local)
			}
			if (res.data?.rechargetypelist.length > 0) {
				store.quickList = res.data.rechargetypelist[0]?.quickConfigList
				store.currentPayType = res.data.rechargetypelist[0]
				store.priceRange = {
					min: Number(res.data.rechargetypelist[0]?.miniPrice),
					max: Number(res.data.rechargetypelist[0]?.maxPrice)
				}
			}
			if (currentPayId.value === 14 && store.currentPayType) {
				store.bank_local = store.currentPayType.parameters.split('|')
			}
			if (isOtherRecharge) {
				store.thirdPayBankList = res.data.thirdPayBankList || []
				if (store.thirdPayBankList.length > 0) {
					store.selectOtherBank = currentOtherThirdBankList.value[0]
				}
			}
		}
	}
	// arupi 快捷支付金额实时性
	const getArupiRechargeQuickTypes = async () => {
		if (!store.currentPayId) return clearInterval(pollingQuickAmount.value)
		const res: ObjResNull<RechargeTypesData> = await AwaitApiResult(
			GetRechargeTypes({
				payid: store.currentPayId
				//payTypeId: getPayTabList.value[store.currentMenu]?.payTypeID
			})
		)
		if (res) {
			store.quickList = res.data.rechargetypelist[0]?.quickConfigList
			store.priceRange = {
				min: Number(res.data.rechargetypelist[0]?.miniPrice),
				max: Number(res.data.rechargetypelist[0]?.maxPrice)
			}
		} else {
			clearInterval(pollingQuickAmount.value)
		}
	}

	// 获取arpay订单
	const getArpayOrderInfo = async () => {
		const res = await AwaitApiResult(getARPayOrder())
		if (res.code === 0) {
			store.isArPayOrder = res.data
		}
	}
	// 获取getArUpiOrderPay订单
	const getArUpiOrderPayInfo = async () => {
		const res = await AwaitApiResult(getArUpiOrderPay({ payTypeId: store.currentPayType.payTypeID }))
		if (res.code === 0) {
			store.isArUpiPayOrder = res.data
		}
	}
	// 获取arupi订单
	const getArUpiOrderPayGoingOrder = async () => {
		const res = await AwaitApiResult(getArUpiOnGoingOrder({ payTypeId: store.currentPayType.payTypeID }))
		if (res?.code === 0) {
			const data = res.data || {}
			if (!res.data) {
				store.arupiGoingOrder = false
				store.reasonShow = false
			}
			store.goingOrder = res.data
			rechargeOrderNumber.value = data.token
			if (data.paymentPageExpire == null) return
			if (
				(data.paymentPageExpire == 0 && data.utrSubmitSuccess == 0) ||
				(data.paymentPageExpire == 1 && data.utrSubmitSuccess == 0)
			) {
				store.arupiGoingOrder = true
			}
		}
	}
	// 获取rsn订单
	const getRnspayOrderInfo = async () => {
		const result = await getRNSWalletInfo()
		if (result?.code === 0) {
			store.rsnInfo = result.data
		}
		const res = await AwaitApiResult(getRSNOrderPay())
		if (res.code === 0) {
			store.isRsnPayOrder = res.data
		}
	}

	/**
	 * @description: 选择充值渠道
	 */
	const handleSelectPayType = (index: number) => {
		store.currentPayType = store.rechargeTypes[index]
		store.quickList = store.rechargeTypes[index]?.quickConfigList
		store.priceRange = {
			min: Number(store.rechargeTypes[index]?.miniPrice),
			max: Number(store.rechargeTypes[index]?.maxPrice)
		}
		if (store.thirdPayBankList.length > 0) {
			store.selectOtherBank = currentOtherThirdBankList.value[0] || ''
		}
		if (currentPayId.value === 14) {
			store.bank_local = store.currentPayType.parameters.split('|')
		}
		restAmount()
	}

	/**
	 * @description: 数字类型充值金额校验
	 */
	const validateAmountNumber = (): boolean => {
		let unit = currentPayId.value === 11 || currentPayId.value === 19 ? 'USDT' : 'TRX'

		// 当前是数字货币充值，且金额小于0
		if ((store.numberPayAmount || store.numberPayAmount === 0) && store.numberPayAmount <= 0) {
			store.validateAmount = t('rangeDesc1')
			return false
		}

		// 当前是数字货币充值，且金额大于最大值
		if ((store.numberPayAmount && store.numberPayAmount > store.priceRange.max)) {
			store.validateAmount = t('rangeDesc3', [store.priceRange.max + unit])
			return false
		}

		// 当前是数字货币充值，且金额小于最小值
		if ((store.numberPayAmount && store.numberPayAmount < store.priceRange.min)) {
			store.validateAmount = t('rangeDesc2', [store.priceRange.min + unit])
			return false
		}
		store.validateAmount = ''
		return true
	}

	/**
	 * @description: 三方充值，本地银行、upi充值类型金额校验
	 */
	const validateAmountOther = () => {
		// 当前不是数字货币充值，且金额小于0
		if ((store.amount || store.amount === 0) && store.amount <= 0) {
			store.validateAmount = t('rangeDesc1')
			return false
		}
		// 当前不是数字货币充值，且金额大于最大值
		if (store.amount && store.amount > store.priceRange.max) {
			store.validateAmount = t('rangeDesc3', [dollarSign.value + store.priceRange.max])
			return false
		}

		// 当前不是数字货币充值，且金额小于最小值
		if (store.amount && store.amount < store.priceRange.min) {
			store.validateAmount = t('rangeDesc2', [dollarSign.value + store.priceRange.min])
			return false
		}
		if (store.currentPayId === 26 && store.amount && store.amount % 100 !== 0) {
			store.validateAmount = t('arupiPayError')
			return false
		}
		store.validateAmount = ''
		return true
	}

	/**
	 * @description: 点击快速选择金额
	 * @param {number} index
	 * @return {*}
	 */
	const handleQuickSelect = (index: number): any => {
		store.currentQuickIndex = index
		amountType.value = 1
		if (isNumberPay.value) {
			store.numberPayAmount = Number(store.quickList[index].rechargeAmount)
			store.numberExchangeRate = round2(currentUate.value * Number(store.quickList[index].rechargeAmount))
			if (validateAmountNumber()) {
				store.numberPayAmount = Number(toDecimal2(store.numberPayAmount.toString()))
				store.numberExchangeRate = round2(store.numberPayAmount * currentUate.value)
			}
			return
		}
		store.amount = Number(store.quickList[index].rechargeAmount)

		if (validateAmountOther()) {
			store.amount = Number(toDecimal2(store.amount.toString()))
		}
	}

	// 汇率换算结果保留 2 位小数（四舍五入），避免浮点误差如 953.4000000000001
	const round2 = (num: number) => Math.round((Number(num) || 0) * 100) / 100

	const toDecimal2 = (str: string) => {
		str = str + ''
		if (str.indexOf('.') > -1) {
			return str.split('.')[0]
		} else {
			return str
		}
	}
	const thirdDatajump = (thirdData = {}) => {
		const {
			data: { redirectUrl, scanCodePay, formUrl, formBody }
		} = thirdData

		if (!scanCodePay && redirectUrl) {
			// scanCodePay 为 false  直接跳转
			let url = redirectUrl
			if (isOpenExternalUrl()) {
				openExternalUrl(url)
			} else if (isHybridApp()) {
				openBrowser('recharge', {
					url: url,
					recharegeName: store.currentPayType.payName
				})
			} else {
				partyUrl(url)
				// thirdRechargeUrl.value = url
				// thirdRechargeDialog.value = true
			}
		} else {
			// scanCodePay 为 true  通过表单提交
			// 创建 一个表单 请求
			const form = document.createElement('form')
			form.action = formUrl
			form.method = 'POST'
			form.target = '_blank'
			for (let key in formBody) {
				if (formBody.hasOwnProperty(key)) {
					// 确保只遍历对象自身的属性，而不是原型链上的属性
					let input = document.createElement('input')
					input.name = key
					input.value = formBody[key]
					input.type = 'hidden'
					form.appendChild(input)
				}
			}
			document.body.appendChild(form)
			form.submit()
		}
	}
	/**
	 * @description: 充值提交
	 * @return {*}
	 */
	const _handleRecharge = async (): Promise<any> => {
		if (!store.rechargeSubmitBtnStatus) return
		const { onTriggerRecharege } = useTrigger()
		onTriggerRecharege({ amount: store.amount })
		if (isArpay.value || isRsnpay.value || isArUpiPay.value) return arPayRecharge()
		if (isOtherRecharge.value) {
			if ([14].includes(currentPayId.value) && store.currentPayType.payInfoSwitch) {
				store.bank_local.map((item) => {
					let keys = item.split(',')[1] as keyof Banklist
					store.bankInfo[keys] = store.bankInfo[keys] || ''
				})
				store.rechargeDialogVisible = true
				return
			}
			return otherRecharge()
		}

		if (isUpi.value) return upiRecharge()

		if (isLocakBank.value || isQrcodeBank.value) {
			if ([10, 18].includes(currentPayId.value) || (store.isRechargeInputDialog && currentPayId.value !== 19)) {
				if (!store.bankList) {
					showFailToast('The payment channel is empty')
					return
				}
				store.bank_local.map((item) => {
					let keys = item.split(',')[1] as keyof Banklist
					store.bankInfo[keys] = currentBankList.value[store.currentBankIndex][keys] as string
				})
				//   console.log('store.bankInfo', store.currentBankIndex, store.bankInfo)
				store.rechargeDialogVisible = true
				return
			} else if (currentPayId.value === 19) {
				usdtRecharge()
			} else {
				// 不弹窗直接跳转
				localBankRecharge()
			}
		}
	}
	const handleRecharge = useDebounceFn(_handleRecharge, 400)

	const arPayRecharge = async () => {
		if (isArpay.value && store.arPayInfo?.walletActivationStatus === 0) {
			showFailToast(t('arNoActive2'))
			return
		}
		//   if (store.arPayInfo?.balance as number >= Number(store.amount)) {
		showLoadingToast({
			message: t('loading') + '...',
			forbidClick: true
		})
		let returnUrl = window.location.origin + '/#/main'
		// console.log('returnUrl', returnUrl)
		const settings: any = SettingStore()
		const facebookAttribution = getFacebookAttributionParams(settings.isOpenAdjustEvent)
		const facebookVendorId = getFacebookRechargeVendorId(settings.isOpenAdjustEvent)
		const type = await getUserDeviceType()
		const params = {
			payTypeId: store.currentPayType.payTypeID,
			amount: store.amount || 0,
			returnUrl,
			pixelId: facebookAttribution.pixelId,
			vendorId: facebookVendorId,
			fbcId: facebookAttribution.fbcId,
			fbc: facebookAttribution.fbc,
			fbp: facebookAttribution.fbp,
			adId: facebookAttribution.adId,
			amountType: amountType.value + '',
			deviceType: type
		}
		attachCoupon(params)
		try {
			const arpayData = await CreateRechargeOrder(params)
			if (arpayData && arpayData.data && arpayData.code === 0) {
				amountType.value = 2
				const {
					data: {
						submitUrl,
						submitType,
						orderResult = 1,
						recommandAmountList,
						onGoingOrder = {},
						addThirdPayOrderRsp = null
					}
				} = arpayData
				if (isArUpiPay.value) {
					if (addThirdPayOrderRsp) {
						return thirdDatajump({ data: addThirdPayOrderRsp })
					}
					if (submitType == 0) {
						return showConfirmDialog({
							title: t('customerService'),
							message: arpayData.msg || ''
						}).then(() => {
							handleOpen()
						})
					}
					if (submitType == 8) {
						showArupiAmount.value = true
						arupiAmountList.value = recommandAmountList || []
						arupiAmount.value = recommandAmountList[0]
						return
					}
					if (submitType == 16) {
						if (onGoingOrder.hasPendingAppealOrder == 1) {
							return showFailToast({
								message: t('haveAppealTip'),
								wordBreak: 'break-word'
							})
						}
						if (onGoingOrder.isCancellable == 0) {
							return showFailToast({
								message: t('haveProgressOrderTip'),
								wordBreak: 'break-word'
							})
						}
						rechargeOrderNumber.value = onGoingOrder?.token
						return (cancelOrder.value = true)
					}
					onJumpArUpi(submitUrl)
				} else {
					if (orderResult == 2) {
						return showFailToast({
							message: t('arbbuy'),
							duration: 2000,
							wordBreak: 'break-word',
							onClose() {
								partyUrl(submitUrl)
							}
						})
					}
					if (isOpenExternalUrl()) {
						openExternalUrl(submitUrl)
					} else if (isHybridApp()) {
						openBrowser('recharge', {
							url: submitUrl,
							recharegeName: store.currentPayType.payName
						})
					} else {
						partyUrl(submitUrl)
					}
				}
			} else {
				if ([1015, 1016].includes(arpayData.msgCode)) {
					return showFailToast({
						message: arpayData.msg || '',
						duration: 2000,
						wordBreak: 'break-word',
						onClose() {
							goWallet()
						}
					})
				}
				if ([621, 623, 624].includes(arpayData.msgCode)) {
					return showConfirmDialog({
						title: t('customerService'),
						message: arpayData.msg || ''
					}).then(() => {
						handleOpen()
					})
				}
				showFailToast({
					message: arpayData.msg || '',
					wordBreak: 'break-word'
				})
			}
		} catch (e) {
			if ([1015, 1016].includes(e.msgCode)) {
				return showFailToast({
					message: e.msg || '',
					duration: 2000,
					wordBreak: 'break-word',
					onClose() {
						goWallet()
					}
				})
			}
		} finally {
			// 唯一裸调下单的入口(其余走 AwaitApiResult 不抛)：超时/断网时后端可能已锁券，必须照样对账
			syncCouponAfterOrder()
		}
	}
	const getCancellationReasonList = async () => {
		const { code, data } = await cancellationReasonList({})
		if (code === '1') {
			reasonList.value = data || []
		}
	}
	const onCancelRechargeOrder = async (isArupi = false) => {
		const { checked, text } = from
		if (isArupi) {
			if (checked === -1 && !text) {
				return showFailToast({
					message: t('selectReason'),
					wordBreak: 'break-word',
					zIndex: 4000
				})
			}
			onJumpArUpi(store.goingOrder?.payUrl, 'arupi', false)
			try {
				const res = await cancelPayment({
					reason: checked > -1 ? reasonList.value[checked]?.reason : text,
					reasonId: checked > -1 ? reasonList.value[checked]?.id : null
				})
				if (res.code === '1') {
					cancelOrder.value = false
					store.arupiGoingOrder = false
					store.goingOrder = null
					store.isArUpiPayOrder = false
					store.reasonShow = false
					showSuccessToast(t('cancelSuccess'))
					setTimeout(() => {
						eventBus.emit('getRecordList')
					}, 2000)
				}
			} catch (e) {}
			return
		}
		const res = await AwaitApiResult(
			cancelRechargeOrder({
				orderCancelToken: rechargeOrderNumber.value || store.goingOrder?.token,
				payTypeId: store.currentPayType.payTypeID,
				reason: checked > -1 ? reasonList.value[checked]?.reason : text,
				reasonId: checked > -1 ? reasonList.value[checked]?.id : null
			})
		)
		if (res) {
			cancelOrder.value = false
			store.reasonShow = false
			store.arupiGoingOrder = false
			store.goingOrder = null
			store.isArUpiPayOrder = false
			setTimeout(() => {
				eventBus.emit('getRecordList')
			}, 2000)
			showSuccessToast(t('cancelSuccess'))
		}
	}
	// ARupipay 充值申诉
	const goToOrderAppeal = async (oderItem: chargeRecordList & C2CRechargeRecord) => {
		store.arupiGoingOrder = false
		const params = {
			orderNumber: oderItem.rechargeNumber || oderItem.merchantOrderNo,
			returnUrl: window.location.origin + '/#/main'
		}
		try {
			const { code, data, msgCode, msg } = await getOrderAppeal(params)
			if (code === 0 && data?.rechargeOrderAppealPageUrl) {
				await onJumpArUpi(data?.rechargeOrderAppealPageUrl, 'kycAppeal')
			} else {
				// debugger
				// console.log('msgCode', code, data, msgCode, msg)
				if (msgCode === -1) {
					return showFailToast({
						message: msg || '',
						wordBreak: 'break-word'
					})
				}
				showFailToast({
					message: t('code' + msgCode) || msg || '',
					wordBreak: 'break-word'
				})
			}
		} catch (error) {
			// console.log('error', error)
			showFailToast({
				message: error.msg || '',
				wordBreak: 'break-word'
			})
		} finally {
			store.goingOrder = null
			store.isArUpiPayOrder = false
		}
	}
	const gotoBanklist = async (oderItem: chargeRecordList & C2CRechargeRecord) => {
		if ((oderItem?.groupID & 2) === 2) return
		try {
			const params = {
				rechargeNumber: oderItem.rechargeNumber || oderItem.merchantOrderNo,
				payTypeId: oderItem.payTypeId || store.currentPayType.payTypeID
				//returnUrl: window.location.origin + '/#/main',
			}
			const { code, data, msgCode, msg } = await arUpiGetBankListToken(params)
			if (code === 0) {
				await onJumpArUpi(`https://test.com?token=${data.token}&lang=en`, 'kycAppeal_v2')
			} else {
				if (msgCode === -1) {
					return showFailToast({
						message: msg || '',
						wordBreak: 'break-word'
					})
				}
				showFailToast({
					message: t('code' + msgCode) || msg || '',
					wordBreak: 'break-word'
				})
			}
		} catch (error) {
			// console.log('error', error)
			showFailToast({
				message: error.msg || '',
				wordBreak: 'break-word'
			})
		} finally {
			store.arupiGoingOrder = false
			store.goingOrder = null
			store.isArUpiPayOrder = false
		}
	}
	const goArapiPayToOrderDetail = (name: string) => {
		store.arupiGoingOrder = false
		onJumpArUpi(store.goingOrder?.payUrl, name)
	}
	const stratPollingQuick = (isClear = false) => {
		clearInterval(pollingQuickAmount.value)
		pollingQuickAmount.value = null
		if (isClear) return
		pollingQuickAmount.value = setInterval(async () => {
			//const res=await api
			if (!isArUpiPay.value) return clearInterval(pollingQuickAmount.value)
			if (store.goingOrder) await getArUpiOrderPayGoingOrder()
			await getArupiRechargeQuickTypes()
		}, 2 * 1000)
	}

	/**
	 * @description: 充值记录跳转到充值详情
	 * @param {number} payID
	 * @param {number} type
	 * @param {number} amount
	 * @param {number} state
	 * @return {*}
	 */
	const historyToDetail = async (payID: number, type: number, amount: number, state: number, orderNo?: number) => {
		store.currentPayId = payID
		if (isArpay.value && state === 0) {
			if (!store.isArPayOrder) {
				await getArpayOrderInfo()
			}
			if (store.isArPayOrder) {
				if (store.isArPayOrder?.includes('&GroupID=')) {
					const url = new URL(store.isArPayOrder?.replaceAll('/#', ''))
					const groupid = url.searchParams.get('GroupID')
					const group = Number(groupid)
					if ((group & 512) === 512) {
						await goWallet()
						return
					}
				}
				window.location.href = store.isArPayOrder as unknown as string
			} else {
				showFailToast(t('C2Ctimeout2'))
			}
			return
		}
		if (isUpi.value && state === 0) {
			router.push({
				name: 'OtherPay',
				query: {
					type: 'upi'
				}
			})
			return
		}
		if (state === 0 && payID === 19) {
			return router.push({
				name: 'RechargeUsdt'
			})
		}
		if ((isLocakBank.value || isQrcodeBank.value) && state === 0) {
			return router.push({
				name: 'RechargeDetail',
				query: {
					currentPayId: payID,
					payTypeId: type,
					amount
				}
			})
		}
	}

	/**
	 * @description: 点击upi充值
	 * @return {*}
	 */
	const upiRecharge = async () => {
		await createUpiOrder()
		router.push({
			name: 'OtherPay',
			query: {
				type: 'upi'
			}
		})
	}

	/**
	 * @description: 前往USDt充值
	 */
	const usdtRecharge = () => {
		router.push({
			name: 'RechargeUsdt',
			query: {
				amount: store.numberPayAmount
			}
		})
	}

	/**
	 * @description: 提交USDT充值
	 * @param {string} address
	 * @return {*}
	 */
	const submitUsdtRecharge = async (query: RechargeUsdtReq) => {
		attachCoupon(query)
		const res = await AwaitApiResult(RechargesUsdtOrder(query))
		syncCouponAfterOrder()
		if (res) {
			showSuccessToast(t('success'))
			eventBus.emit('changeKeepAliveKey')
			router.replace({
				name: 'RechargeHistory'
			})
		}
	}

	/**
	 * @description: 三方充值
	 */
	const otherRecharge = async () => {
		const settingStore: any = SettingStore()
		const values = Object.values(store.bankInfo).filter(Boolean)
		if ([14].includes(currentPayId.value) && !values.length && store.currentPayType.payInfoSwitch) {
			return showFailToast(t('phEnterName'))
		}
		store.rechargeDialogVisible = false
		if (currentPayId.value === 15 || settingStore.getDollarSign === 'R$') {
			const result = await AwaitApiResult(CheckFirstPixRecharge())
			needPixInfo.value = result.data.needSetPIX
			if (result.data.isFirstPixRecharge && !pixFlag.value) {
				isFirstPixRecharge.value = true
				pixFlag.value = true
				return
			}
			if (result.data.needSetPIX) {
				await router.push({
					name: 'Withdraw-AddPIX',
					query: {
						fromV: 'Recharge'
					}
				})
				return
			}
		}
		let amount = 0
		if (isNumberPay.value) {
			amount = store.numberPayAmount as number
		} else {
			amount = store.amount as number
		}
		let info = window.location.origin + ',status/rechargeStatus'
		const settings: any = SettingStore()
		const facebookAttribution = getFacebookAttributionParams(settings.isOpenAdjustEvent)
		const facebookVendorId = getFacebookRechargeVendorId(settings.isOpenAdjustEvent)
		let isBankCode = store.thirdPayBankList.length > 0 && store.selectOtherBank
		if (store.currentPayType.payTypeID >= 10000) {
			// payTypeID大于10000走接口 其他用之前
			await thirdPayHandle(
				amount,
				info,
				facebookAttribution.pixelId,
				facebookAttribution.fbcId,
				facebookAttribution.fbc,
				facebookAttribution.fbp,
				facebookVendorId,
				facebookAttribution.adId,
				isBankCode
			)
		} else {
			let sendUrl = store.currentPayType.paySendUrl
			let url = ''
			if (sendUrl.indexOf('tyid') === -1) {
				url =
					sendUrl +
					'?tyid=' +
					store.currentPayType.payTypeID +
					'&amount=' +
					amount +
					'&uid=' +
					userInfo.userId +
					'&sign=' +
					userInfo.sign +
					(isBankCode ? '&bankCode=' + store.selectOtherBank?.bankCode : '') +
					'&urlInfo=' +
					info +
					`&pixelId=${facebookAttribution.pixelId}&fbcId=${facebookAttribution.fbcId}&adId=${facebookAttribution.adId}`
			} else {
				url =
					sendUrl +
					'&amount=' +
					amount +
					'&uid=' +
					userInfo.userId +
					'&sign=' +
					userInfo.sign +
					(isBankCode ? '&bankCode=' + store.selectOtherBank?.bankCode : '') +
					'&urlInfo=' +
					info +
					`&pixelId=${facebookAttribution.pixelId}&fbcId=${facebookAttribution.fbcId}&adId=${facebookAttribution.adId}`
			}
			if (isOpenExternalUrl()) {
				openExternalUrl(url)
			} else if (isHybridApp()) {
				openBrowser('recharge', {
					url: url,
					recharegeName: store.currentPayType.payName
				})
			} else {
				partyUrl(url)
			}
		}
	}

	// 三方充值接口请求
	const thirdPayHandle = async (
		amount: number,
		info: string,
		pixelId: string,
		fbcId: string,
		fbc: string,
		fbp: string,
		vendorId: number,
		adId: any,
		isBankCode?: any
	) => {
		const type = await getUserDeviceType()
		const params: ThirdPayInfo = {
			payTypeId: store.currentPayType.payTypeID,
			bankCode: isBankCode ? store.selectOtherBank?.bankCode : '',
			urlInfo: info,
			amount,
			pixelId,
			vendorId: vendorId || 1,
			fbcId: fbcId || '',
			fbc,
			fbp,
			adId,
			deviceType: type,
			...store.bankInfo
		}
		attachCoupon(params)
		store.rechargeSubmitBtnStatus = false
		// console.log('isBankCode', isBankCode, params)
		const thirdData = await AwaitApiResult(ThirdPay(params))
		syncCouponAfterOrder()
		store.rechargeSubmitBtnStatus = true
		// console.log('充值数据====', thirdData)
		if (thirdData && thirdData.code === 0) {
			thirdDatajump(thirdData)
			// const {data: {redirectUrl, scanCodePay, formUrl, formBody}} = thirdData
			//
			// if (!scanCodePay && redirectUrl) { // scanCodePay 为 false  直接跳转
			// 	let url = redirectUrl
			// 	if (isHybridApp()) {
			// 		openBrowser('recharge', {
			// 			url: url,
			// 			recharegeName: store.currentPayType.payName
			// 		})
			// 	} else {
			// 		partyUrl(url)
			// 		// thirdRechargeUrl.value = url
			// 		// thirdRechargeDialog.value = true
			// 	}
			// } else { // scanCodePay 为 true  通过表单提交
			// 	// 创建 一个表单 请求
			// 	const form = document.createElement('form')
			// 	form.action = formUrl
			// 	form.method = 'POST'
			// 	form.target = '_blank';
			// 	for (let key in formBody) {
			// 		if (formBody.hasOwnProperty(key)) { // 确保只遍历对象自身的属性，而不是原型链上的属性
			// 			let input = document.createElement('input')
			// 			input.name = key
			// 			input.value = formBody[key]
			// 			input.type = 'hidden'
			// 			form.appendChild(input)
			// 		}
			// 	}
			// 	document.body.appendChild(form)
			// 	form.submit()
			// }
		}
	}

	/**
	 * @description: C2C充值
	 * @return {*}
	 */
	const C2CRecharge = async () => {
		let amount = store.amount?.toString() + getC2CunitAmount.value
		let params = {
			category: currentPayId.value,
			orderAmount: Number(amount)
		}
		const [, result] = await AwaitWrap(createC2CRecharge(params))

		// console.log(result)
		// let res = await AwaitApiResult<ObjResNull<CreateC2CRechargeData>>(createC2CRecharge(params))
		if (result) {
			if (result?.msgCode === 260 && result.code !== 0) {
				showFailToast(result.msg)
				setTimeout(() => {
					router.push({
						name: 'RechargeHistory-RechargeUpiDetail',
						query: {
							type: 'C2C',
							orderNo: result.data.orderId,
							state: result.data.state
						}
					})
				}, 2000)
				return
			}
			if (result.data.state === 1) {
				store.rechangeUpiShow = false
				await router.push({
					name: 'OtherPay',
					query: {
						type: 'C2C'
					}
				})
			} else if (result.data.state === 2) {
				C2CforbiddenShow.value = true
				ErrorCount.value = result.data.errorCount
				RemainingLimitTime.value = result.data.remainingLimitTime
			} else {
				store.currentPayType.paySendUrl = result.data.rechargeChannelInfo?.paySendUrl as string
				// 当前没有可选金额，走三方充值
				store.currentPayType = result.data.rechargeChannelInfo as any

				if (!result.data.suggessList.length) {
					return otherRecharge()
				}
				store.rechangeUpiShow = true
				store.C2CQuickList = result.data.suggessList
			}
		}
	}

	/**
	 * @description: 刷新2C快速充值列表
	 * @param {number} amount
	 * @return {*}
	 */
	const getAmountList = async () => {
		const res = await AwaitApiResult<ObjResNull<SuggessList[]>>(
			GetC2CRechargeAwardAmountList({ amount: store.amount as number })
		)
		if (res) {
			store.C2CQuickList = res.data
		}
	}

	/**
	 * @description: 本地银行充值
	 * @return {*}
	 */
	const localBankRecharge = async () => {
		if (isQrcodeBank.value) {
			// 扫码充值
			return qrcodeBankRecharge()
		}
		if (currentPayId.value !== 9) {
			let mobile = store.bankInfo[store.bank_local[1].split(',')[1]]
			if (mobile && mobile.length && mobile.trim().length < 7) {
				showFailToast({
					message: t('wrongTel'),
					wordBreak: 'break-word'
				})
				return
			}
		}

		// 判断query对象里面是否有空值， 有空值则不跳转
		if (isOpenOfficialRechargeInputDialog.value) {
			for (let key in store.bankInfo) {
				if (!store.bankInfo[key]) {
					showFailToast(t('rechargeBankTip'))
					return
				}
			}
		}

		// console.log(query)
		store.rechargeDialogVisible = false
		// 创建本地银行订单
		const flag = await createLocalBankOrder()
		if (flag) {
			let payTypeID = getPayTabList.value[store.currentMenu].payTypeID
			if (currentPayId.value === 18) {
				payTypeID = getElwallett()
			}
			router.push({
				name: 'RechargeDetail',
				query: {
					currentPayId: currentPayId.value,
					payTypeId: payTypeID,
					amount: store.amount
				}
			})
		}
	}

	const qrcodeBankRecharge = async () => {
		// console.log('store.bankInfo：', store.bankList)

		if (Object.keys(store.bankInfo).length < 2) {
			showFailToast(t('requiredFaild'))
			return
		}
		for (let key in store.bankInfo) {
			if (!store.bankInfo[key]) {
				showFailToast(t('rechargeBankTip'))
				return
			}
		}
		// store.rechargeQrcodeVisible = false
		store.rechargeDialogVisible = false
		let payTypeID = getPayTabList.value[store.currentMenu].payTypeID
		//   console.log('getPayTabList.value', getPayTabList.value, store.currentMenu)
		const flag = await createqrcodeBankOrder()
		//   console.log('flag', flag)
		if (flag) {
			router.push({
				name: 'RechargeDetail',
				query: {
					currentPayId: currentPayId.value,
					payTypeId: payTypeID,
					amount: store.amount
				}
			})
		}
	}

	/**
	 * @description: 支付页面获取C2C订单详情
	 * @param {*} orderNo
	 * @return {*}
	 */
	const getOrderDetail = async (orderNo: number) => {
		const res = await AwaitApiResult<ObjResNull<SellerInfo>>(getC2CRechargeDetail({ orderId: orderNo }))
		if (res) {
			store.C2COrderInfo = res.data
		}
	}

	/**
	 * @description: 充值页面获取C2C充值订单信息
	 * @return {*}
	 */
	const getC2COrderInfo = async () => {
		const res = await AwaitApiResult<ObjResNull<SellerInfo>>(C2CRechargeGetPayingDetail())
		if (res) {
			if (res.data && res.data?.orderNo) {
				store.isC2COrder = true
				countdownTimeFun(res.data.serviceTime as string, res.data.endTime as string, () => {
					store.C2COrderInfo = undefined
					store.isC2COrder = false
				})
				store.C2COrderInfo = res.data
			}
		} else {
			store.C2COrderInfo = undefined
			store.isC2COrder = false
		}
	}

	/**
	 * @description: 获取银行订单信息
	 * @param {number} payID
	 * @return {*}
	 */
	const getBankOrderInfo = async (payID: number) => {
		const res = await AwaitApiResult<ObjResNull<NewSetRechargesBankOrderData>>(GetBankOrder({ payTypeId: payID }))
		if (res) {
			store.orderDetail = res.data
			if (res.data && res.data?.orderNumber) {
				store.bankUTR = res.data.refNo
				store.isBankOrder = true
				countdownTimeFun(res.data.serverTime as string, res.data.addTime1 as string, () => {
					store.bankOrderInfo = undefined
					store.isBankOrder = false
				})
				store.bankOrderInfo = res.data
			} else {
				store.bankOrderInfo = undefined
				store.isBankOrder = false
			}
		}
	}

	/**
	 * @description: 获取当前是否有UPI订单
	 * @return {*}
	 */
	const getUpiOrderInfo = async () => {
		const res = await AwaitApiResult(GetUpiOrder({ type: 82 }))
		if (res) {
			if (res.data && res.data.orderNumber) {
				store.localUpiUTR = res.data.transferUTR
				store.isUpiOrder = true
				countdownTimeFun(res.data.serverTime as string, res.data.addTime1 as string, () => {
					store.upiOrderInfo = undefined
					store.isUpiOrder = false
				})
				store.upiOrderInfo = res.data
			} else {
				store.upiOrderInfo = undefined
				store.isUpiOrder = false
			}
		}
	}

	/**
	 * @description: 创建UPI订单
	 * @return {*}
	 */
	const createUpiOrder = async () => {
		const type = await getUserDeviceType()
		const query: any = { amount: store.amount as number, deviceType: type }
		attachCoupon(query)
		const res = await AwaitApiResult(RechargesUpiOrder(query))
		syncCouponAfterOrder()
		if (res) {
			store.CreateUpiOrderRep = res.data
		}
	}

	/**
	 * @description: otherPay页面完成按钮事件
	 * @param {string} type
	 * @param {number} id
	 * @return {*}
	 */
	const handleFinishUpiOrder = async (type: string, id: number, fileObj?: any) => {
		if (type === 'upi') {
			let query: UpRechargesBankOrderQuery = {
				type: 1,
				tranrefId: store.localUpiUTR,
				orderNo: id + '',
				isBankQRCodeOrder: isQrcodeBank.value,
				certificates: fileObj
			}
			const res = await AwaitApiResult(UpdateRechargesUpiOrder(query))
			if (res) {
				eventBus.emit('changeKeepAliveKey')
				router.replace({
					name: 'RechargeHistory'
				})
			}
		} else {
			const res = await AwaitApiResult(
				C2CRechargeConfirm({
					orderId: id,
					transactionNo: store.localUpiUTR,
					ossUrls: fileObj
				})
			)
			if (res) {
				router.replace({
					name: 'RechargeHistory-RechargeUpiDetail',
					query: {
						orderNo: store.C2COrderInfo?.id,
						state: 1
					}
				})
			}
		}
	}

	/**
	 * @description: 获取Usdt订单信息
	 * @return {*}
	 */
	const getUsdtOrderInfo = async () => {
		const res = await AwaitApiResult<ObjResNull<UsdtOrderInfo>>(GetUsdtOrder({ type: 3 }))
		if (res) {
			if (res.data && res.data?.orderNumber) {
				store.isUsdtOrder = true
				store.isBankOrder = false
				countdownTimeFun(res.data.serverTime as string, res.data.addTime1 as string, () => {
					store.usdtOrderInfo = undefined
					store.isUsdtOrder = false
				})
				store.usdtOrderInfo = res.data
			} else {
				store.usdtOrderInfo = undefined
				store.isUsdtOrder = false
				store.isBankOrder = false
			}
		}
	}

	const handleUpdateUsdtOrder = async (query: UpdateUsdtOrderInfo) => {
		const res = await AwaitApiResult(UpdateRechargesUsdtOrder(query))
		if (res) {
			showSuccessToast(t('success'))
			eventBus.emit('changeKeepAliveKey')
			router.replace({
				name: 'RechargeHistory'
			})
		}
	}

	/**
	 * @description: 创建本地银行订单，本地银行、kbz、wave
	 * @return { *}
	 */
	const createLocalBankOrder = async () => {
		let payTypeID = getPayTabList.value[store.currentMenu].payTypeID
		if (currentPayId.value === 18) {
			payTypeID = getElwallett()
		}
		const type = await getUserDeviceType()
		let query: any = {
			payTypeId: payTypeID,
			amount: store.amount,
			bankName: currentBankName.value,
			transferType: currentBankList.value[store.currentBankIndex].transferType,
			deviceType: type,
			...store.bankInfo
		}
		if (!IsShowRechargeBankList.value) {
			delete query.bankName
		}
		attachCoupon(query)
		const res: ObjResNull<NewSetRechargesBankOrderData> = await AwaitApiResult(NewSetRechargesBankOrder(query))
		syncCouponAfterOrder()
		if (res?.data) {
			store.orderDetail = res.data
			store.bankUTR = res.data.refNo
			return true
		}
		return false
		// NewSetRechargesBankOrder
	}
	/**
	 * @description: 创建本地银行订单，本地银行、kbz、wave
	 * @return { *}
	 */
	const createqrcodeBankOrder = async () => {
		// let payTypeID = getPayTabList.value[store.currentMenu].payTypeID
		const type = await getUserDeviceType()
		let query: QrcodeBankInfo = {
			payTypeId: currentPayId.value,
			amount: store.amount || 0,
			bankName: currentBankName.value,
			//   transferType: currentBankList.value[store.currentBankIndex].transferType,
			deviceType: type,
			...store.bankInfo
		}
		attachCoupon(query)
		const res: ObjResNull<NewSetRechargesBankOrderData> = await AwaitApiResult(NewSetBankQRCodeOrder(query))
		syncCouponAfterOrder()
		if (res?.data) {
			store.orderDetail = res.data
			store.bankUTR = res.data.refNo
			return true
		}
		return false
		// NewSetRechargesBankOrder
	}

	/**
	 * @description: 倒计时
	 * @param {string} startTime
	 * @param {string} endTime
	 * @param {function} callBack
	 * @return {*}
	 */
	const countdownTimeFun = (startTime: string, endTime: string, callBack: () => void) => {
		clearInterval(countdown.value as any)
		countdown.value = undefined
		let countdownTimestamp = getDownTime(startTime, endTime)
		countdown.value = setInterval(() => {
			countdownTimestamp -= 1000

			if (countdownTimestamp < 0) {
				clearInterval(countdown.value as any)
				callBack()
				return
			}

			const time = formatTime(countdownTimestamp, 'mm:ss')
			const spanList = countdownRef.value?.querySelectorAll('span')
			spanList?.forEach((item, index) => {
				item.innerHTML = time[index]
			})
		}, 1000)
	}

	/**
	 * @description: 查询订单状态，本地银行、kbz、wave，如果已支付或者已取消返回上一个页面
	 * @param {string} orderNumber 订单号
	 */
	const getLoclBankOrderDetail = async (orderNumber: string) => {
		if (currentPayId.value === 99) return
		const detail = await AwaitApiResult(GetBankOrderInfo({ rechargeNumber: orderNumber }))
		if (detail.data?.state !== 0) {
			showToast(detail.data?.state === 1 ? t('orderpay') : t('ordercancle'))
			sessionStorage.removeItem('localOrder')
			router.go(-1)
			return
		}
	}

	/**
	 * @description: 本地银行、kbz、wave完成订单
	 * @return {*}
	 */
	const handleFinishOrder = async () => {
		const settingStore: any = SettingStore()
		if ((settingStore.getDollarSign === '₹' && currentPayId.value === 9) || isQrcodeBank.value) {
			let query: UpRechargesBankOrderQuery = {
				type: 1,
				tranrefId: store.bankUTR,
				orderNo: store.orderDetail?.orderNumber as string,
				isBankQRCodeOrder: isQrcodeBank.value
			}
			const res = await AwaitApiResult(UpdateRechargesUpiOrder(query))
			if (res.code === 0) {
				showSuccessToast(t('success'))
			} else {
				showSuccessToast(res.msg)
				return
			}
		}
		eventBus.emit('changeKeepAliveKey')
		router.replace({ name: 'RechargeHistory' })
	}

	/**
	 * @description: 取消订单
	 * @param {*} id
	 * @return {*}
	 */
	const handeCancelOrder = async (orderNo: string, isUpi?: boolean) => {
		const res = await AwaitApiResult(UpRechargesBankOrder({ orderNo: orderNo }))
		if (res) {
			store.isBankOrder = false
			rechargeActionSheetShow.value = false
			cancelOrderShow.value = false
			showSuccessToast(t('cancelSucceed'))
			eventBus.emit('changeKeepAliveKey')
			router.back()
		}
	}

	/**
	 * @description: 获取时间戳
	 * @param {string} start
	 * @param {string} end
	 * @return {*}
	 */
	const getDownTime = (start: string, end: string) => {
		let BirthDay = new Date(start)
		//获取当前时间
		let today = new Date(end)
		let timeold = today.getTime() - BirthDay.getTime() //总豪秒数
		return timeold
	}

	/**
	 * @description: 清空输入框
	 * @return {*}
	 */
	const handleClearInput = () => {
		store.rechargeSubmitBtnStatus = false
		store.amount = undefined
		store.numberPayAmount = undefined
		store.numberExchangeRate = undefined
		store.currentQuickIndex = -1
		store.validateAmount = ''
		amountType.value = 2
	}

	/**
	 * @description: 获取充值记录
	 * @param {*} store.currentId
	 * @return {*}
	 */
	const getRecordList = async () => {
		let query: any = {
			pageNo: 1,
			pageSize: 5,
			startDate: '',
			endDate: '',
			state: -1,
			type: -1,
			payId: store.currentPayId,
			category: store.currentPayId
		}
		if (!isC2CRecharge.value) {
			delete query.category
			delete query.type
		} else {
			query.type = -1
			delete query.payId
		}
		const result: any = await AwaitApiResult(isC2CRecharge.value ? GetC2CRechargeRecord(query) : GetRechargeRecord(query))
		if (result) {
			RechargeRList.value = result.data.list
		}
	}

	/**
	 * @description: 充值弹出窗验证规则校验
	 * @param {string} val
	 * @param {number} index
	 * @param {string} key
	 * @return {*}
	 */
	const validateBankForm = (val: string, index: number, key: string) => {
		// 手机号码只能为数字
		if (index !== 0 && currentPayId.value !== 9) {
			val.replace(/\D/g, '')
			store.bankInfo[key] = val.replace(/\D/g, '')
		}
		// 本地银行输入框去除空格
		if (index === 0) {
			const lang = localStorage.getItem('language')
			const _kay = store.bank_local[0].split(',')[1]
			let str = store.bankInfo[_kay]
			if (lang !== 'vi') {
				str = str.replace(/\s*/g, '')
			}
			store.bankInfo[_kay] = str
		}
	}

	/**
	 * @description: 选择银行卡时，查找对应的通道，获取通道id
	 * @param {number} index
	 * @return {*}
	 */
	const handleSelectBank = (index: number) => {
		store.currentBankIndex = index
		if (store.currentPayId === 18 && store.bankList.length) {
			let bankName = dollarSign.value === '৳' ? getTransferBankList.value[index].bankName : store.bankList[index].bankName
			let Elwallet = store.rechargeTypes.find((item) => {
				return item.paySysName === bankName
			}) as Rechargetypelist
			store.bank_local = Elwallet?.parameters.split('|') || []
			store.bank_local.map((item) => {
				let keys = item.split(',')[1] as keyof Banklist
				store.bankInfo[keys] = store.bankList[store.currentBankIndex][keys] as string
			})
			store.quickList = Elwallet.quickConfigList
			// console.log(store.rechargeTypes.find(item => item.paySysName === store.bankList[val].bankName) as Rechargetypelist)
			// store.currentPayType = store.rechargeTypes.find(item => item.paySysName === store.bankList[val].bankName) as Rechargetypelist
		}
		store.currentPayId === 18 && getBankOrderInfo(getElwallett())
	}

	/**
	 * @description: 重置数据
	 * @param {*} void
	 * @return {*}
	 */
	const restAmount = (): void => {
		store.rechargeSubmitBtnStatus = false
		store.amount = undefined
		store.numberPayAmount = undefined
		store.numberExchangeRate = undefined
		store.validateAmount = ''
		store.currentQuickIndex = -1
		if (isQrcodeBank.value && store.bankList?.length > 1) {
			store.currentBankIndex = getRandomBank()
		} else {
			store.currentBankIndex = 0
		}
		store.localUpiUTR = ''
		store.bankUTR = ''
	}

	/**
	 * @description: input输入框输入完成回调changeQuickInput事件,添加节流
	 * @param {Event} e
	 * @return {*}
	 */
	const handleInput = (e: Event) => {
		clearTimeout((e.target as any).timer)
		;(e.target as any).timer = setTimeout(() => {
			store.validateAmount = ''
			const inputVal = isNumberPay.value ? Number(store.numberPayAmount) : Number(store.amount)
			store.currentQuickIndex = store.quickList.findIndex((q: any) => Number(q?.rechargeAmount) === inputVal)
			// if (isC2CRecharge.value) {
			//   validateAmountC2C()
			//   return
			// }
			if (isNumberPay.value) {
				if (validateAmountNumber()) {
					store.numberExchangeRate = store.numberPayAmount ? round2(store.numberPayAmount * currentUate.value) : 0
				}
				return
			}
			validateAmountOther()
			amountType.value = 2
		}, 500)
	}

	/**
	 * @description: 将超过1000的数字转换为1K
	 */
	const formatNum = (num: number): string => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
		} else {
			return num + ''
		}
	}

	/**
	 * @description: 粘贴
	 */
	const handlePaste = async (): Promise<string> => {
		const res = await navigator.clipboard.readText()
		return res
	}

	/**
	 * @description: 生成图片
	 * @param {*} id
	 * @return {*}
	 */
	const htmlToImage = async (id: string) => {
		const myDiv = document.getElementById(id) as HTMLElement
		if (!myDiv) return
		const { snapdom } = await import('@zumer/snapdom')
		const blob = await snapdom.toBlob(myDiv, {
			type: 'jpeg',
			width: myDiv.offsetWidth,
			height: myDiv.offsetHeight,
			backgroundColor: '#fff',
			quality: 1
		})
		const url = URL.createObjectURL(blob)
		const downloadLink = document.createElement('a')
		downloadLink.href = url
		downloadLink.download = 'qrcode.jpeg'
		document.body.appendChild(downloadLink)
		downloadLink.click()
		downloadLink.remove()
		window.setTimeout(() => URL.revokeObjectURL(url))
	}

	/**
	 * @description: 生成二维码
	 * @param {string} url
	 * @return {*}
	 */
	const createQrCode = async (url: string) => {
		// let url = 'upi://pay?pa=' + orderDetail.value?.sellerAccountNo + '&am=' + orderDetail.value?.orderAmount + '&cu=INR'
		try {
			return qrcode.toDataURL(url)
			console.log(url)
			// const qrCode = await
			// codeUrl.value = qrCode
		} catch (error) {
			console.log('生成二维码失败')
		}
	}

	const restRechargeType = () => {
		store.isBankOrder = false
		store.isUsdtOrder = false
		store.localUpiUTR = ''
		store.bankUTR = ''
	}
	// 随机获取银行卡
	const getRandomBank = () => {
		let index = Math.floor(Math.random() * store.bankList.length)
		return index
	}

	/**
	 * @description: 三方银行确认选择
	 * @param {any} param1
	 * @return {*}
	 */
	const confirmOtherSelectBank = ({ selectedOptions }: any) => {
		showOtherSelect.value = false
		store.selectOtherBank = selectedOptions[0]
	}

	const C2CTimeOut = (startTime: string, endTimt: string): void => {
		let start = new Date(startTime.replace(/-/g, '/')).getTime()
		let end = new Date(endTimt.replace(/-/g, '/')).getTime()
		let distance = start - end
		if (distance <= 0) {
			C2COrderTimeOutStatus.value = true
		}
	}

	// 切换渠道清空金额
	watch(
		() => currentPayTypeId.value,
		() => {
			restAmount()
		}
	)

	onBeforeUnmount(() => {
		// 取消定时器
		clearInterval(countdown.value as any)
	})

	watch([() => store.amount, () => store.numberPayAmount], () => {
		if (!store.amount && !store.numberPayAmount) {
			store.rechargeSubmitBtnStatus = false
			return
		}
		// if (isC2CRecharge.value && store.amount) {
		//   store.rechargeSubmitBtnStatus = validateAmountC2C()
		//   return
		// }
		if (isNumberPay.value && store.numberPayAmount) {
			store.rechargeSubmitBtnStatus = validateAmountNumber()
			return
		}
		if (!isNumberPay.value) {
			store.rechargeSubmitBtnStatus = validateAmountOther() && store.rechargeTypes.length > 0
			return
		}
		if (store.payTypeLoading) store.rechargeSubmitBtnStatus = false
		store.rechargeSubmitBtnStatus = false
	})

	return {
		store,
		confirmOtherSelectBank,
		showOtherSelect,
		getRechargeTypeName,
		handleChangeMenu,
		getRechargeTypes,
		restAmount,
		handleInput,
		formatNum,
		handleRecharge,
		handleQuickSelect,
		isHaveOrder,
		currentPayId,
		numberKeyObj,
		isC2CRecharge,
		isArpay,
		isLocakBank,
		isNumberPay,
		rechargeDetailAmount,
		rechargeBonusAmount,
		rechargeVipRewardAmount,
		rechargeCouponBonus,
		rechargeHandlingFee,
		rechargeActualCredit,
		showRechargeDetail,
		getC2CunitAmount,
		usdtRate,
		trxRate,
		currentBankName,
		currentPayTypeId,
		placeholder,
		showArupiAmount,
		arupiAmountList,
		arupiAmount,
		cancelOrder,
		amountType,
		handleSelectPayType,
		handleClearInput,
		getPayTabList,
		arPay,
		validateBankForm,
		localBankRecharge,
		submitUsdtRecharge,
		getUsdtOrderInfo,
		getLocalUsdtInfo,
		handlePaste,
		createLocalBankOrder,
		getLoclBankOrderDetail,
		handeCancelOrder,
		getAmountList,
		cancelOrderShow,
		rechargeActionSheetShow,
		handleFinishOrder,
		countdownTimeFun,
		countdownRef,
		setCountdownRef,
		getBankOrderInfo,
		getUpiOrderInfo,
		handleFinishUpiOrder,
		getRechargeTab,
		historyToDetail,
		getC2COrderInfo,
		otherRecharge,
		getRecordList,
		htmlToImage,
		createQrCode,
		C2CRecharge,
		onJumpArUpi,
		getTransferBankList,
		transfer,
		isFirstPixRecharge,
		isSplitLocalEWallet,
		RechargeRList,
		handleSelectBank,
		getElwallett,
		IsShowRechargeBankList,
		handleUpdateUsdtOrder,
		getOrderDetail,
		onCancelRechargeOrder,
		isOtherRecharge,
		currentOtherThirdBankList,
		C2CforbiddenShow,
		ErrorCount,
		RemainingLimitTime,
		C2COrderTimeOutStatus,
		C2CTimeOut,
		thirdRechargeDialog,
		thirdRechargeUrl,
		getDownTime,
		currentBankList,
		userInfo,
		showAmountError,
		needPixInfo,
		rnsPay,
		isRsnpay,
		arUpiPay,
		goToOrderAppeal,
		goArapiPayToOrderDetail,
		gotoBanklist,
		stratPollingQuick,
		isArUpiPay,
		recordRef,
		reasonList,
		from,
		getCancellationReasonList
	}
}
