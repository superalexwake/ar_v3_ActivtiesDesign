import { GetListNeedKycConnectWithdrawOrder, setWithdrawalUPIVerifyOtp, setWithdrawalUPIVerifyOtpByWithdrawId } from '@/api'
import { createDialogQueueItem } from '@/components/DialogQueue/registry'
import { useDialogQueue } from '@/components/DialogQueue/useDialogQueue'
import { useEventBus } from '@/components/common/use'
import i18n from '@/languages'
import { AwaitApiResult } from '@/utils'
import { showSuccessToast } from 'vant'
import { FAST_UPI_KYC_OTP_DIALOG_GROUP, FAST_UPI_KYC_OTP_DIALOG_KEY } from './dialogKeys'

const FAST_UPI_CATEGORY_ID = 27
export const FAST_UPI_KYC_OTP_EXPIRED_EVENT = 'fast-upi-kyc-otp-expired'

export type FastUpiKycOtpMode = 'bid' | 'withdrawOrder' | 'addPayment'
export type FastUpiKycOtpSource = 'withdraw' | 'history' | 'ws' | 'fast-upi'
export type FastUpiOtpSubmit = (target: FastUpiKycOtpTarget, smsCode: string, pin?: string) => Promise<unknown> | unknown
export type FastUpiKycOtpExpiredHandler = (target: FastUpiKycOtpTarget) => void | Promise<void>

export interface FastUpiKycOtpTarget extends Record<string, unknown> {
	mode: FastUpiKycOtpMode
	bid?: number
	withdrawId?: number
	bankCode: string
	upi: string
	mobile: string
	amount?: number
	orderNo?: string
	expireTimestamp?: number
	serverTime?: number
	raw?: Record<string, unknown>
}

export interface FastUpiKycOtpDialogProps extends Record<string, unknown> {
	target: FastUpiKycOtpTarget
	submit?: FastUpiOtpSubmit
	onExpired?: FastUpiKycOtpExpiredHandler
}

export interface FastUpiKycOtpOpenOptions {
	id?: string
	source?: FastUpiKycOtpSource
	showSuccess?: boolean
	submit?: FastUpiOtpSubmit
	onVerified?: (target: FastUpiKycOtpTarget) => void | Promise<void>
	onExpired?: FastUpiKycOtpExpiredHandler
}

export interface FastUpiNeedKycOrderResult {
	count: number
	openedCount: number
	orders: FastUpiKycOtpTarget[]
}

const asRecord = (value: unknown): Record<string, unknown> =>
	value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}

const toOptionalNumber = (value: unknown): number | undefined => {
	if (value == null || value === '') return undefined
	const num = Number(value)
	return Number.isFinite(num) ? num : undefined
}

const toStringValue = (value: unknown): string => value == null ? '' : String(value)

const firstValue = (...values: unknown[]) => values.find(value => value != null && value !== '')

const upperCamelKey = (key: string) => key[0].toUpperCase() + key.slice(1)

const pickTimingValue = (item: Record<string, unknown>, data: Record<string, unknown>, key: string) =>
	item[key] ?? item[upperCamelKey(key)] ?? data[key] ?? data[upperCamelKey(key)]

const isValidKycOrder = (target: FastUpiKycOtpTarget): boolean => target.serverTime! < target.expireTimestamp!

/**
 * 统一 FastUPI KYC OTP 弹窗所需账户字段。
 */
const normalizeFastUpiKycOtpTarget = (rawValue: unknown, mode: FastUpiKycOtpMode): FastUpiKycOtpTarget => {
	const raw = asRecord(rawValue)
	const accountInfo = asRecord(raw.upiAccountInfo ?? raw.UpiAccountInfo)
	const data = { ...accountInfo, ...raw }
	return {
		mode,
		bid: toOptionalNumber(firstValue(data.bid, data.Bid)),
		withdrawId: toOptionalNumber(firstValue(data.withdrawID, data.withdrawId, data.WithdrawID, data.WithdrawId)),
		bankCode: toStringValue(firstValue(data.bankCode, data.BankCode)),
		upi: toStringValue(firstValue(data.upiAccount, data.accountNo, data.AccountNo)),
		mobile: toStringValue(firstValue(data.mobileNo, data.mobileNO, data.MobileNo, data.MobileNO)),
		amount: toOptionalNumber(firstValue(data.price, data.withdrawalAmount, data.orderAmount, data.amount)),
		orderNo: data.withdrawNumber as string,
		expireTimestamp: toOptionalNumber(firstValue(data.expireTimestamp, data.ExpireTimestamp)),
		serverTime: toOptionalNumber(firstValue(data.serverTime, data.ServerTime)),
		raw,
	}
}

/**
 * 补齐 GetWithdrawLog 可能在响应根返回的 KYC 倒计时时间。
 */
const normalizeWithdrawLogTiming = <T extends { expireTimestamp?: unknown; serverTime?: unknown }>(
	list: T[],
	data: Record<string, unknown> = {},
): T[] =>
	list.map((item) => {
		const record = item as Record<string, unknown>
		return {
			...item,
			expireTimestamp: pickTimingValue(record, data, 'expireTimestamp') as T['expireTimestamp'],
			serverTime: pickTimingValue(record, data, 'serverTime') as T['serverTime'],
		} as T
	})

/**
 * 查询当前会员待补 KYC 连接验证的 FastUPI 提现订单。
 */
const getNeedKycOrders = async (): Promise<FastUpiKycOtpTarget[]> => {
	try {
		const res = await GetListNeedKycConnectWithdrawOrder({ categoryId: FAST_UPI_CATEGORY_ID })
		if (res?.code !== 0 || !Array.isArray(res.data)) return []
		return res.data
			.map((item: unknown) => normalizeFastUpiKycOtpTarget(item, 'withdrawOrder'))
			.filter(isValidKycOrder)
	} catch {
		return []
	}
}

/**
 * 按目标来源提交 FastUPI KYC OTP，提现前验证走 bid，提现记录补验证走 withdrawId。
 */
const verifyKycOtp = (target: FastUpiKycOtpTarget, smsCode: string, pin?: string) => {
	const payload = {
		smsCode,
		categoryId: FAST_UPI_CATEGORY_ID,
		pin,
	}
	if (target.mode === 'withdrawOrder') {
		return AwaitApiResult(
			setWithdrawalUPIVerifyOtpByWithdrawId({
				...payload,
				withdrawId: target.withdrawId,
			}),
		)
	}
	return AwaitApiResult(
		setWithdrawalUPIVerifyOtp({
			...payload,
			bid: target.bid,
		}),
	)
}

/**
 * 创建 FastUPI KYC OTP 队列项，统一优先级、分组和验证成功回调。
 */
const createFastUpiKycOtpDialog = (target: FastUpiKycOtpTarget, options: FastUpiKycOtpOpenOptions = {}) => {
	const dialogTarget = { ...target }
	const id = options.id || `fast-upi-kyc-otp-${target.mode}-${target.withdrawId || target.bid || Date.now()}`
	return createDialogQueueItem<FastUpiKycOtpDialogProps>(FAST_UPI_KYC_OTP_DIALOG_KEY, {
		id,
		props: {
			target: dialogTarget,
			submit: options.submit,
			onExpired: (expiredTarget) => {
				useEventBus().emit(FAST_UPI_KYC_OTP_EXPIRED_EVENT, expiredTarget)
				void options.onExpired?.(expiredTarget)
			},
		},
		policy: {
			presentation: 'center',
			priority: 1200,
			group: FAST_UPI_KYC_OTP_DIALOG_GROUP,
			force: true,
			closeOnClickOverlay: false,
		},
		onClose: (reason) => {
			if (reason !== 'confirm') return
			if (options.showSuccess) {
				showSuccessToast({
					type: 'success',
					message: i18n.global.t('verifySuccess'),
					duration: 2000,
				})
			}
			void options.onVerified?.(dialogTarget)
		},
	})
}

/**
 * FastUPI KYC OTP 流程入口。
 *
 * @returns 标准化数据、查待验证订单、打开队列弹窗、提交 OTP 的函数集合。
 */
export const useFastUpiKycOtp = () => {
	const queue = useDialogQueue()

	/**
	 * 使用已标准化的目标账户打开 KYC OTP 队列弹窗。
	 */
	const openKycOtpDialog = async (target: FastUpiKycOtpTarget, options: FastUpiKycOtpOpenOptions = {}) => {
		const item = createFastUpiKycOtpDialog(target, options)
		if (!item) return false
		return queue.push(item)
	}

	/**
	 * 查询待 KYC 连接验证订单，并按订单顺序全部加入 OTP 队列。
	 */
	const openNeedKycOrderDialog = async (options: FastUpiKycOtpOpenOptions = {}): Promise<FastUpiNeedKycOrderResult> => {
		const orders = await getNeedKycOrders()
		let openedCount = 0
		for (const target of orders) {
			if (await openKycOtpDialog(target, options)) openedCount += 1
		}
		return {
			count: orders.length,
			openedCount,
			orders,
		}
	}

	/**
	 * 提现页或 FastUPI 列表按 bid 打开 KYC OTP 队列弹窗。
	 */
	const openKycOtpByBid = (raw: unknown, options?: FastUpiKycOtpOpenOptions) =>
		openKycOtpDialog(normalizeFastUpiKycOtpTarget(raw, 'bid'), options)

	/**
	 * 提现记录按 withdrawId 打开 KYC OTP 队列弹窗。
	 */
	const openKycOtpByWithdrawOrder = (raw: unknown, options?: FastUpiKycOtpOpenOptions) =>
		openKycOtpDialog(normalizeFastUpiKycOtpTarget(raw, 'withdrawOrder'), options)

	return {
		normalizeFastUpiKycOtpTarget,
		normalizeWithdrawLogTiming,
		getNeedKycOrders,
		openKycOtpDialog,
		openNeedKycOrderDialog,
		openKycOtpByBid,
		openKycOtpByWithdrawOrder,
		verifyKycOtp,
	}
}
