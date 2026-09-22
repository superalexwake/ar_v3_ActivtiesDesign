import type { RouteRecordRaw } from 'vue-router'
import { viewRoute } from './helpers'

export const walletDeepRoutes: RouteRecordRaw[] = [
	viewRoute("/wallet/RechargeHistory/RechargeUpiDetail", "RechargeHistory-RechargeUpiDetail", "RechargeUpiDetail", "RechargeHistory", () => import("@/views/wallet/RechargeHistory/RechargeUpiDetail/index.vue")),
	viewRoute("/wallet/Withdraw/AddBankCard", "Withdraw-AddBankCard", "AddBankCard", "Withdraw", () => import("@/views/wallet/Withdraw/AddBankCard/index.vue")),
	viewRoute("/wallet/Withdraw/AddFastUpi", "Withdraw-AddFastUpi", "AddFastUpi", "Withdraw", () => import("@/views/wallet/Withdraw/AddFastUpi/index.vue")),
	viewRoute("/wallet/Withdraw/AddKbz", "Withdraw-AddKbz", "AddKbz", "Withdraw", () => import("@/views/wallet/Withdraw/AddKbz/index.vue")),
	viewRoute("/wallet/Withdraw/AddPIX", "Withdraw-AddPIX", "AddPIX", "Withdraw", () => import("@/views/wallet/Withdraw/AddPIX/index.vue")),
	viewRoute("/wallet/Withdraw/AddRsnPay", "Withdraw-AddRsnPay", "AddRsnPay", "Withdraw", () => import("@/views/wallet/Withdraw/AddRsnPay/index.vue")),
	viewRoute("/wallet/Withdraw/AddType4", "Withdraw-AddType4", "AddType4", "Withdraw", () => import("@/views/wallet/Withdraw/AddType4/index.vue")),
	viewRoute("/wallet/Withdraw/AddUSDT", "Withdraw-AddUSDT", "AddUSDT", "Withdraw", () => import("@/views/wallet/Withdraw/AddUSDT/index.vue")),
	viewRoute("/wallet/Withdraw/AddUpi", "Withdraw-AddUpi", "AddUpi", "Withdraw", () => import("@/views/wallet/Withdraw/AddUpi/index.vue")),
	viewRoute("/wallet/Withdraw/AddWave", "Withdraw-AddWave", "AddWave", "Withdraw", () => import("@/views/wallet/Withdraw/AddWave/index.vue")),
	viewRoute("/wallet/Withdraw/BankCard", "Withdraw-BankCard", "BankCard", "Withdraw", () => import("@/views/wallet/Withdraw/BankCard/index.vue")),
	viewRoute("/wallet/Withdraw/C2cDetail", "Withdraw-C2cDetail", "C2cDetail", "Withdraw", () => import("@/views/wallet/Withdraw/C2cDetail/index.vue")),
	viewRoute("/wallet/Withdraw/ChooseBank", "Withdraw-ChooseBank", "ChooseBank", "Withdraw", () => import("@/views/wallet/Withdraw/ChooseBank/index.vue")),
	viewRoute("/wallet/Withdraw/FastUpi", "Withdraw-FastUpi", "FastUpi", "Withdraw", () => import("@/views/wallet/Withdraw/FastUpi/index.vue")),
	viewRoute("/wallet/Withdraw/PIX", "Withdraw-PIX", "PIX", "Withdraw", () => import("@/views/wallet/Withdraw/PIX/index.vue")),
	viewRoute("/wallet/Withdraw/RsnPay", "Withdraw-RsnPay", "RsnPay", "Withdraw", () => import("@/views/wallet/Withdraw/RsnPay/index.vue")),
	viewRoute("/wallet/Withdraw/Type4", "Withdraw-Type4", "Type4", "Withdraw", () => import("@/views/wallet/Withdraw/Type4/index.vue")),
	viewRoute("/wallet/Withdraw/USDT", "Withdraw-USDT", "USDT", "Withdraw", () => import("@/views/wallet/Withdraw/USDT/index.vue")),
	viewRoute("/wallet/Withdraw/Upi", "Withdraw-Upi", "Upi", "Withdraw", () => import("@/views/wallet/Withdraw/Upi/index.vue")),
	viewRoute("/wallet/Withdraw/c2cCancelWithdrawal", "Withdraw-c2cCancelWithdrawal", "c2cCancelWithdrawal", "Withdraw", () => import("@/views/wallet/Withdraw/c2cCancelWithdrawal/index.vue")),
	viewRoute("/wallet/Withdraw/c2cWrongAmount", "Withdraw-c2cWrongAmount", "c2cWrongAmount", "Withdraw", () => import("@/views/wallet/Withdraw/c2cWrongAmount/index.vue")),
	viewRoute("/wallet/WithdrawHistory/WithdrawHistoryDetail", "WithdrawHistory-WithdrawHistoryDetail", "WithdrawHistoryDetail", "WithdrawHistory", () => import("@/views/wallet/WithdrawHistory/WithdrawHistoryDetail/index.vue"))
]

export const walletChildRoutes: RouteRecordRaw[] = [
	viewRoute("/wallet/ArbRule", "ArbRule", "ArbRule", "wallet", () => import("@/views/wallet/ArbRule/index.vue")),
	viewRoute("/wallet/BankStatus", "BankStatus", "BankStatus", "wallet", () => import("@/views/wallet/BankStatus/index.vue")),
	viewRoute("/wallet/CancelRecharge", "CancelRecharge", "CancelRecharge", "wallet", () => import("@/views/wallet/CancelRecharge/index.vue")),
	viewRoute("/wallet/OrderCancel", "OrderCancel", "OrderCancel", "wallet", () => import("@/views/wallet/OrderCancel/index.vue")),
	viewRoute("/wallet/OtherPay", "OtherPay", "OtherPay", "wallet", () => import("@/views/wallet/OtherPay/index.vue")),
	viewRoute("/wallet/Recharge", "Recharge", "Recharge", "wallet", () => import("@/views/wallet/Recharge/index.vue")),
	viewRoute("/wallet/RechargeArUpi", "RechargeArUpi", "RechargeArUpi", "wallet", () => import("@/views/wallet/RechargeArUpi/index.vue")),
	viewRoute("/wallet/RechargeDetail", "RechargeDetail", "RechargeDetail", "wallet", () => import("@/views/wallet/RechargeDetail/index.vue")),
	viewRoute("/wallet/RechargeHistory", "RechargeHistory", "RechargeHistory", "wallet", () => import("@/views/wallet/RechargeHistory/index.vue")),
	viewRoute("/wallet/RechargeUsdt", "RechargeUsdt", "RechargeUsdt", "wallet", () => import("@/views/wallet/RechargeUsdt/index.vue")),
	viewRoute("/wallet/TransAction", "TransAction", "TransAction", "wallet", () => import("@/views/wallet/TransAction/index.vue")),
	viewRoute("/wallet/Withdraw", "Withdraw", "Withdraw", "wallet", () => import("@/views/wallet/Withdraw/index.vue")),
	viewRoute("/wallet/WithdrawHistory", "WithdrawHistory", "WithdrawHistory", "wallet", () => import("@/views/wallet/WithdrawHistory/index.vue"))
]

export const walletRootRoutes: RouteRecordRaw[] = [
	viewRoute("/wallet", "wallet", "wallet", null, () => import("@/views/wallet/index.vue"), { tabBar: true })
]

