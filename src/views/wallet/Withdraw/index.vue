<template>
	<div class="withdraw__container">
		<NavBar :title="$t('withdraw')" left-arrow @click-left="onBack" @click-right="router.push({ name: 'WithdrawHistory' })">
			<template #right>
				<span> {{ $t('withdrawRecords') }}</span>
			</template>
		</NavBar>
		<div class="withdraw__container-content">
			<!--资产余额-->
			<BalanceAssetsW :data_NewSetWithdrawal="data_NewSetWithdrawal" :withdrawalsrule="ResWithdrawalsL.withdrawalsrule" />
			<!--提款方式-->
			<WithdrawalTypes
				:data_NewSetWithdrawal="data_NewSetWithdrawal"
				:withdrawalTypeslist="withdrawalTypeslist"
				:c2cAward="c2cAward"
				@onSelectWithdrawalType="onSelectWithdrawalType"
				:maxRechargeRifts="maxRechargeRifts"
				:ArRechargeRifts="ArRechargeRifts"
			/>
			<!-- upi -->
			<template v-if="[27, 2].includes(data_NewSetWithdrawal.type)">
				<UpiQuickTypes
					v-if="arUpiRecommandBankList.length && data_NewSetWithdrawal.type !== 2"
					:bankList="arUpiRecommandBankList"
					:bank-code="bankCode"
					@onSelectWithdrawalType="
						(code: string) => {
							bankCode = code
							data_NewSetWithdrawal.bid = bankList[0]?.bid || 0
						}
					"
				/>
				<c2cUpi
					:bankCode="bankCode"
					:withdrawalType="data_NewSetWithdrawal.type"
					:withdrawalslist="bankList"
					:bid="data_NewSetWithdrawal.bid"
				/>
			</template>
			<!-- c2cupi -->
			<template v-if="data_NewSetWithdrawal.type == 20">
				<c2cUpi :withdrawalslist="ResWithdrawalsL.withdrawalslist" :bid="data_NewSetWithdrawal.bid" />
				<c2cField
					:c2crule="ResWithdrawalsL.withdrawalsrule"
					:c2cAward="c2cAward"
					@setc2cAmount="setc2cAmount"
					:verify100="verify100"
					:c2cName="withdrawalTypeslist.find((item) => item.withdrawID == 20)?.name || ''"
				>
					<div class="recycleBtnD c2c">
						<button class="recycleBtn" :class="{ active: isActiveC }" @click="onShowPwdD">
							{{ $t('withdraw') }}
						</button>
					</div>
				</c2cField>
				<c2cRecord ref="c2cRecordRef" />
			</template>
			<template v-else-if="data_NewSetWithdrawal.type == 21">
				<ArCard @onShowPwdD="onShowPwdD()" ref="ArCardRef"></ArCard>
			</template>
			<template v-else-if="[4, 23, 24, 22].includes(data_NewSetWithdrawal.type)">
				<RsnType
					v-if="data_NewSetWithdrawal.type === 22"
					:withdrawalslist="ResWithdrawalsL.withdrawalslist"
					:withdrawType="data_NewSetWithdrawal.type"
					:bid="data_NewSetWithdrawal.bid"
					:name="activeName"
					:rsnInfo="rsnInfo"
					:currentType="withdrawalTypeslist.find((item) => item.withdrawID == 22)"
					@getRnsTypeInfo="getRnsTypeInfo"
				/>
				<wC4Id
					v-else
					:withdrawalslist="ResWithdrawalsL.withdrawalslist"
					:withdrawType="data_NewSetWithdrawal.type"
					:bid="data_NewSetWithdrawal.bid"
					:name="activeName"
				/>
				<wC4Field
					:rule="ResWithdrawalsL.withdrawalsrule"
					:award="c2cAward"
					:wtype="data_NewSetWithdrawal.type"
					@setc2cAmount="setc2cAmount"
					:name="withdrawalTypeslist.find((item) => item.withdrawID == 20)?.name || ''"
					v-if="!rsnNoActive"
					:verify100="verify100"
				>
					<div class="recycleBtnD c2c">
						<button class="recycleBtn" :class="{ active: isActiveC }" @click="onShowPwdD">
							{{ $t('withdraw') }}
						</button>
					</div>
				</wC4Field>
				<!--提现记录-->
				<WithdrawHistory ref="withdrawHistory" v-if="!rsnNoActive" />
			</template>
			<template v-else>
				<!--银行卡模块-->
				<div class="bankInfo" @click="ontoBankCard()" v-if="ResWithdrawalsL.withdrawalslist.length">
					<div
						class="bankInfoItem"
						:class="`type${data_NewSetWithdrawal.type}`"
						v-if="[1, 5].includes(data_NewSetWithdrawal.type)"
					>
						<div>
							<svg-icon :name="data_NewSetWithdrawal.type" />

							<span>{{ bankCardList.bankName }}</span>
						</div>
						<div>
							<span>{{ bankCardList.beneficiaryName }}</span>
							<span>{{ bankCardList.accountNo }}</span>
						</div>
						<van-icon name="arrow" />
					</div>
					<div class="bankInfoItem usdt" v-if="[3, 10].includes(data_NewSetWithdrawal.type)">
						<div>
							<img :src="getWalletWithdrawTypeIcon(data_NewSetWithdrawal.type)" />
							<span>{{ bankCardList?.bankAlias || bankCardList.bankName }}</span>
						</div>
						<div>
							<span>{{ bankCardList.accountNo }}</span>
							<van-icon name="arrow" />
						</div>
						<div>
							<span>{{ bankCardList.usdtRemarkName }}</span>
						</div>
					</div>
					<div class="bankInfoItem usdt KBZ" v-if="[6, 8].includes(data_NewSetWithdrawal.type)">
						<div>
							<img :src="getWalletWithdrawTypeIcon(data_NewSetWithdrawal.type)" />
							<span v-if="data_NewSetWithdrawal.type == 6">{{ bankCardList.bankName }}</span>
							<span v-if="data_NewSetWithdrawal.type == 8">{{ bankCardList.walletName }}</span>
						</div>
						<div>
							<span v-if="data_NewSetWithdrawal.type == 6">{{ bankCardList.accountNo }}</span>
							<span v-if="data_NewSetWithdrawal.type == 8">{{ bankCardList.mobileNO }}</span>
						</div>
					</div>
				</div>
				<AddWithdrawType
					v-show="
						[1, 3, 6, 8, 5, 10].includes(data_NewSetWithdrawal.type) && ResWithdrawalsL.withdrawalslist.length == 0
					"
					:type="data_NewSetWithdrawal.type"
					:isShowhintTextO="true"
				/>
				<!--输入区-->
				<WithdrawField
					:data_NewSetWithdrawal="data_NewSetWithdrawal"
					:withdrawalsrule="ResWithdrawalsL.withdrawalsrule"
					:withdrawalslist="ResWithdrawalsL.withdrawalslist"
					:verify100="verify100"
					ref="withdrawField"
				/>

				<div class="recycleBtnD">
					<button class="recycleBtn" :class="{ active: isActiveC }" @click="onShowPwdD">{{ $t('withdraw') }}</button>
				</div>
				<!--提现说明组件-->
				<InstructionsW :withdrawType="data_NewSetWithdrawal.type" :withdrawalsrule="ResWithdrawalsL.withdrawalsrule" />
				<!--提现记录-->
				<WithdrawHistory ref="withdrawHistory" />
			</template>
		</div>

		<!--提现成功弹窗-->
		<van-dialog v-model:show="succeedDialogShow" :show-confirm-button="false" z-index="100">
			<img src="@icon/public/succeed.png" class="succeed" />
			<div class="van-dialog__content-title">{{ $t('tipWithdrawalApplicationSuccess') }}</div>
			<div class="van-dialog__content-note">
				<span>{{ $t('tipWithdrawWillBeCompletedIn2Hours') }}</span
				><span>{{ $t('tipPlaWaitPaciently') }}...</span>
			</div>
			<div class="van-dialog__content-btn" @click="onConfirm()">{{ $t('confirm') }}</div>
		</van-dialog>
		<Dialog
			class="c2c"
			v-model:show="succeedDialogShowC2c"
			:showCancelBtn="false"
			@confirm="onConfirm('c2c')"
			:title="$t('withdrawTip2')"
		>
			<template #header>
				<img src="@icon/public/succeed.png" class="succeedImg" />
			</template>
			<template #content>
				<div class="c2cTip">
					<h1 v-html="$t('withdrawTip3')"></h1>
					<p v-html="$t('withdrawTip4')"></p>
				</div>
			</template>
		</Dialog>
		<!--输入密码弹窗-->
		<van-popup v-if="showBottom" v-model:show="showBottom" position="bottom" closeable round>
			<div class="pwd">
				<div class="pwd-head ar-1px-b">
					<svg-icon name="safeIcon" />
					<h1>{{ $t('withdrawDialogDesc1') }}</h1>
				</div>
				<input type="text" class="is-hidden" />
				<input type="password" class="is-hidden" />
				<PasswordInput v-model:value="data_NewSetWithdrawal.pwd" :label="$t('withdrawDialogPh')" :maxlength="32" />
				<span class="red">{{ $t('withdrawDialogDesc3') }}</span>
				<div class="forgetPwd">
					<span v-if="isOpenForgetPasswordSMSState" @click="forgetPwd">{{ $t('withdrawDialogDesc4') }}</span>
					<div class="red" @click="onservice">{{ $t('withdrawDialogDesc5') }}</div>
				</div>
				<div class="btnD">
					<button @click="() => (showBottom = false)">{{ $t('withdrawDialogDesc6') }}</button>
					<button @click="onNewSetWithdrawal">{{ $t('withdrawDialogDesc7') }}</button>
				</div>
			</div>
		</van-popup>
		<!--不在提现时间内提示-->
		<van-dialog v-model:show="noRightTimeDialogShow" :show-confirm-button="false" z-index="100">
			<NoRightTimeDialog />
		</van-dialog>
		<van-dialog v-model:show="showC2c" :showConfirmButton="false" class="c2cconfirm" width="100%">
			<C2cConfirm v-model:showC2c="showC2c" v-if="showC2c"></C2cConfirm>
		</van-dialog>
		<Dialog
			v-model:show="showAllowWithdraw"
			:showCancelBtn="false"
			:showCloseIcon="true"
			:clickOutSide="true"
			@confirm="() => (showAllowWithdraw = false)"
		>
			<template #content>
				<h1>{{ $t('withdrwsTip1') }}</h1>
			</template>
		</Dialog>
	</div>

	<van-dialog class-name="safebox-dialog" v-model:show="safeBoxShow">
		<div class="content" v-html="safeBoxText"></div>
		<template #footer>
			<div class="question">{{ $t('safeG') }}</div>
			<div class="active" :class="{ a: isCheck }" @click="changeActive">
				<svg-icon name="active" />{{ $t('checkSafeBox') }}
			</div>
			<div class="button">
				<div @click="safeBoxShow = false">{{ $t('no') }}</div>
				<div @click="gotoSafe">{{ $t('go') }}</div>
			</div>
		</template>
	</van-dialog>
	<van-dialog
		class="arupiAmount-dialog"
		:closeOnClickOverlay="true"
		v-model:show="rewardPopup"
		:show-confirm-button="false"
		:width="327"
	>
		<div class="arupiAmount">
			<div class="title1">{{ $t('arupiTitle') }}</div>
			<div class="title2" v-html="content"></div>

			<div class="button">
				<div
					class="goBuy"
					@click="
						() => {
							onSelectWithdrawalType({ withdrawID: 21 })
							rewardPopup = false
							loadRewardPopup = true
						}
					"
				>
					{{ $t('goarWithdraw') }}
				</div>
				<div
					class="clance"
					@click="
						() => {
							rewardPopup = false
							loadRewardPopup = true
						}
					"
				>
					{{ $t('cancel') }}
				</div>
			</div>
		</div>
	</van-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, fixMsg, currency } from '@/utils'
import { getWalletWithdrawTypeIcon } from '@/utils/assetIcons'
import {
	GetWithdrawalTypes,
	GetWithdrawals,
	NewSetWithdrawal,
	getRNSWalletInfo,
} from '@/api'
import type {
	ResWithdrawlist,
	ReqNewSetWithdrawal,
	ResWithdrawals,
	withdrawalsruleList,
	withdrawalslist,
	UserInfo
} from '@/types/api'
import { useCommonStore, useWalletStore, useUserStore, GlobalStore, SettingStore } from '@/stores'
import { showDialog, showFailToast } from 'vant'
import PasswordInput from '@/components/Login/PasswordInput.vue'
import BalanceAssetsW from '@/components/Wallet/Withdraw/BalanceAssetsW.vue'
import WithdrawHistory from '@/components/Wallet/Withdraw/WithdrawHistory.vue'
import WithdrawalTypes from '@/components/Wallet/Withdraw/withdrawalTypes.vue'
import UpiQuickTypes from '@/components/Wallet/Withdraw/upiQuickTypes.vue'
import WithdrawField from '@/components/Wallet/Withdraw/withdrawField.vue'
import AddWithdrawType from '@/components/Wallet/Withdraw/AddWithdrawType.vue'
import InstructionsW from '@/components/Wallet/Withdraw/InstructionsW.vue'
import C2cConfirm from '@/components/Wallet/Withdraw/c2cConfirm.vue'
import c2cField from '@/components/Wallet/Withdraw/c2cField.vue'
import c2cUpi from '@/components/Wallet/Withdraw/c2cUpi.vue'
import c2cRecord from '@/components/Wallet/Withdraw/c2cRecord.vue'
import wC4Field from '@/components/Wallet/Withdraw/wC4Field.vue'
import wC4Id from '@/components/Wallet/Withdraw/wC4Id.vue'
import RsnType from '@/components/Wallet/Withdraw/RsnType.vue'
import Dialog from '@/components/common/Dialog.vue'
import ArCard from '@/components/Wallet/Withdraw/Ar/card.vue'
import NoRightTimeDialog from '@/components/Wallet/Withdraw/noRightTimeDialog.vue'
import { useFastUpiKycOtp, useWithdraw } from '@/hooks'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useServer } from '@/hooks/useServe.hook'
import { useDebounceFn } from '@vueuse/core'
import { createDialogQueueItem } from '@/components/DialogQueue/registry'
import { useDialogQueue } from '@/components/DialogQueue/useDialogQueue'
import { NOTIFY_C_MODAL_KEY } from '@/hooks/dialogKeys'
const { setWithdrawal, setWithdrawalsrule, setWithdrawalTypeslist } = useWithdraw()
const { openKycOtpByBid, openNeedKycOrderDialog } = useFastUpiKycOtp()
const { getSelfCustomerServiceLink } = useServer({ ServerType: 2 })
const isCheck = ref<boolean>(false)
const rewardPopup = ref<boolean>(false)
const loadRewardPopup = ref<boolean>(false)
const { t } = useI18n()
const { setLoading } = useCommonStore()
const { getUserInfo, getRegisterState, $state } = useUserStore()
const router = useRouter()
const route = useRoute()
const queue = useDialogQueue()
const walletStore = useWalletStore()
const withdrawField = ref()
const ArCardRef = ref()
const withdrawHistory = ref()
const bankCardList = ref<any>({})
const rsnInfo = ref({
	balance: 0,
	walletActivationStatus: 0,
	walletAddress: ''
})
const c2cRecordRef = ref()
// C2C 提现奖励比例已停止拉取（不再调用 GetSettingByKey），恒为 0；相关展示位自带判空会自动隐藏
const c2cAward = ref<number>(0)
const showC2c = ref(false)
const showAllowWithdraw = ref(false)
const isOpenForgetPasswordSMSState = computed(() => $state.isOpenForgetPasswordSMSState)
const globalStore = GlobalStore()
const stting = SettingStore()
const userInfo = computed(() => {
	return globalStore.userInfo as UserInfo
})

const rsnNoActive = computed(() => {
	return data_NewSetWithdrawal.type === 22 && rsnInfo.value?.walletActivationStatus === 0
})
// 进入保险箱
const safeBoxText = ref('')
const safeBoxShow = ref(false)
const verify100 = ref(false)
//提现按钮显示状态
const isActiveC = computed(() => {
	const ruleType = [4, 20, 22, 23, 24]
	if (data_NewSetWithdrawal.bid == 0) return false
	if (data_NewSetWithdrawal.amount < 1) return false

	if (verify100.value && data_NewSetWithdrawal.amount > 0) {
		return data_NewSetWithdrawal.amount % 100 !== 0
	}
	if (ruleType.includes(data_NewSetWithdrawal.type) && data_NewSetWithdrawal.amount > 0) {
		if (ResWithdrawalsL.value.withdrawalslist.length == 0) return false
		if (data_NewSetWithdrawal.amount > ResWithdrawalsL.value.withdrawalsrule.canWithdrawAmount) return false
		return true
	}
	const ruleType_2 = [1, 2, 3, 5, 6, 8, 10, 27]
	if (
		!ruleType_2.includes(data_NewSetWithdrawal.type) ||
		withdrawField.value?.showValidate ||
		withdrawField.value?.showValidateUB ||
		(data_NewSetWithdrawal.type == 1 && data_NewSetWithdrawal.amount.toString().indexOf('.') != -1)
	) {
		return false
	}
	return true
})

const succeedDialogShow = ref(false) //提现成功弹窗显示状态
const succeedDialogShowC2c = ref(false)
const showBottom = ref(false) //输入密码弹出层
const noRightTimeDialogShow = ref(false) //不在提现时间段内提示
//提现接口参数
const data_NewSetWithdrawal = reactive<ReqNewSetWithdrawal>({
	amount: 0,
	pwd: '',
	type: 0,
	bid: 0,
	name: '',
	tip: ''
})

const withdrawSubmitting = ref(false)
const orderNo = ref('')
//#region  获取该提款方式下的银行信息和提款规则
const ResWithdrawalsL = ref<ResWithdrawals>({
	withdrawalslist: [] as Array<withdrawalslist>,
	withdrawalsrule: {} as withdrawalsruleList
})
const content = computed(() => ResWithdrawalsL.value.withdrawalsrule?.arbWithdrawRecommand?.popupContent)
const maxRechargeRifts = computed(() => ResWithdrawalsL.value.withdrawalsrule?.arbWithdrawRecommand?.giftPercent || 0)
const ArRechargeRifts = computed(() => ResWithdrawalsL.value.withdrawalsrule?.arbWithdrawRecommand?.arbGiftPercent || 0)
/**
 * @description 快捷银行
 */
const arUpiRecommandBankList = ref([])
/**
 * @description 银行编码
 */
const bankCode = ref('')
const bankList = computed(() => {
	if (data_NewSetWithdrawal.type !== 27) return ResWithdrawalsL.value.withdrawalslist || []
	return ResWithdrawalsL.value.withdrawalslist.filter((item: any) => item.bankCode === bankCode.value)
})
//获取提款方式
const withdrawalTypeslist = ref<ResWithdrawlist[]>([])
const activeName = ref('')
function onBack() {
	router.back()
}
const changeActive = () => {
	isCheck.value = !isCheck.value
	if (isCheck.value) {
		const thirtyDaysFromNow = new Date().getTime() + 30 * 24 * 60 * 60 * 1000
		localStorage.setItem('popupHideUntil', thirtyDaysFromNow.toString())
	} else {
		localStorage.removeItem('popupHideUntil')
	}
	// console.log(isCheck.value)
}
async function submitWithdrawal() {
	if (!showBottom.value || withdrawSubmitting.value) return
	withdrawSubmitting.value = true
	try {
		if (userInfo.value.isAllowWithdraw == 0) {
			showAllowWithdraw.value = true
			return
		}
		let info = ResWithdrawalsL.value.withdrawalsrule
		data_NewSetWithdrawal.amount = Number(data_NewSetWithdrawal.amount)
		var amtreg = /^\d+(\.\d{1,2})?$/
		if (!amtreg.test(data_NewSetWithdrawal.amount.toString())) {
			//金额格式
			showFailToast(t('showDialogTip1'))
			return
		}

		//当提款方式是bankcard时，金额不能超过单次提现范围
		if (data_NewSetWithdrawal.amount > info.maxPrice || data_NewSetWithdrawal.amount < info.minPrice) {
			showFailToast(t('wordWithdrawal', [currency(info.minPrice), currency(info.maxPrice)]))
			return
		}

		if (!data_NewSetWithdrawal.pwd) {
			showFailToast(t('emptyPassword'))
			return
		}

		setLoading(true)
		const res = await AwaitApiResultW(NewSetWithdrawal(data_NewSetWithdrawal))
		if (res) {
			if (res.code !== 0 && res.msgCode == 220) {
				//不在提现时间范围内
				noRightTimeDialogShow.value = true
				setTimeout(function () {
					noRightTimeDialogShow.value = false
				}, 3000)
			} else if (res.code !== 0 && res.msgCode == 280) {
				//有未完成的订单
				setTimeout(function () {
					if (data_NewSetWithdrawal.type == 20 && res?.data) {
						localStorage.setItem('c2cOrderNo', res?.data)
						router.push({ name: 'Withdraw-C2cDetail', query: { order: res?.data } })
					}
				}, 2000)
			} else if (res.code !== 0 && res.msgCode === 1009) {
				//会员提现名单限制
				await showDialog({ message: t('code1009') })
			} else if (res.code !== 0 && res.msgCode === 287) {
				GetWithdrawalsV()
			} else {
				if (data_NewSetWithdrawal.type == 20) {
					succeedDialogShowC2c.value = true
					orderNo.value = res?.data
				} else {
					succeedDialogShow.value = true
				}
			}
		}
	} finally {
		showBottom.value = false
		setLoading(false)
		withdrawSubmitting.value = false
	}
}

const onNewSetWithdrawal = useDebounceFn(submitWithdrawal, 500)
//进入选择银行或选择usdt地址
function ontoBankCard() {
	const map: any = {
		1: 'Withdraw-BankCard',
		3: 'Withdraw-USDT',
		10: 'Withdraw-USDT',
		5: 'Withdraw-PIX'
	}
	router.replace({
		name: map[data_NewSetWithdrawal.type]
	})
}
const AwaitApiResultW = async <T = any,>(promise: Promise<any>): Promise<T | null> => {
	const result: IRes | any = await promise
		.then((res: IRes) => {
			if (res && res.code !== 0) {
				if ([220, 1009].includes(res.msgCode)) {
					return res
				} else if ([280, 287].includes(res.msgCode)) {
					fixMsg(res)
					return res
				}
				fixMsg(res)
				return null
			}
			return res
		})
		.catch((error) => {
			fixMsg(error)
			return null
		})
	return result
}

//提现成功弹窗确认按钮点击事件
async function onConfirm(type?: string) {
	if (type == 'c2c') {
		succeedDialogShowC2c.value = false
		if ((data_NewSetWithdrawal.type == 20 || data_NewSetWithdrawal.type == 2) && orderNo.value) {
			localStorage.setItem('c2cOrderNo', orderNo.value)
			router.push({ name: 'Withdraw-C2cDetail', query: { order: orderNo.value } })
		}
	} else {
		succeedDialogShow.value = false
		await router.push({ name: 'WithdrawHistory' })
	}
}
function openWithdrawPasswordDialog() {
	data_NewSetWithdrawal.pwd = ''
	showBottom.value = true
}

function pushQuickTipsDialog() {
	const item = createDialogQueueItem(NOTIFY_C_MODAL_KEY, {
		id: 'withdraw-quick-tips',
		props: {
			variant: 'important',
			title: t('notifyImportantNotice'),
			message: t('notifyImportantNoticeMessage', { bankCode: bankCode.value }),
			secondaryMessage: t('notifyImportantNoticeSecondary'),
			actions: {
				secondary: { label: 'notifyCancel', act: 'close' },
				primary: { label: 'notifySubmit', act: 'confirm' },
			},
		},
		policy: { presentation: 'center', priority: 1000 },
		onClose: (reason) => {
			if (reason === 'confirm') openWithdrawPasswordDialog()
		},
	})
	if (item) void queue.push(item)
}

function onFastUpiBidVerified() {
	pushQuickTipsDialog()
}

function onFastUpiOrderVerified() {
	void getConnectWithdrawOrder()
	void GetWithdrawalsV()
}

//展示密码弹窗
function onShowPwdD() {
	if (data_NewSetWithdrawal.type == 27 && stting.getNeedFastKycValidIsOpen) {
		const item = bankList.value.find((i: any) => i.bid == data_NewSetWithdrawal.bid)
		if (item && !item.isKycOnline) {
			void openKycOtpByBid(item, {
				source: 'withdraw',
				onVerified: onFastUpiBidVerified,
			})
			return
		} else if (item && item.isKycOnline) {
			return pushQuickTipsDialog()
		}
	}

	if (data_NewSetWithdrawal.type == 21) {
		if (ArCardRef.value?.isActiveC) {
			data_NewSetWithdrawal.pwd = ''
			showBottom.value = true
		}
	} else {
		if (isActiveC.value) {
			data_NewSetWithdrawal.pwd = ''
			showBottom.value = true
		}
	}
}

async function getWithdrawalTypes() {
	setLoading(true)
	let shouldCheckFastUpiNeedKycOrder = false
	const res = await AwaitApiResult(GetWithdrawalTypes())
	if (res) {
		withdrawalTypeslist.value = res?.data.withdrawlist || []
		setWithdrawalTypeslist(withdrawalTypeslist.value)
		//重新进入页面时选中上次选择的提款方式
		if (
			walletStore.getWithdrawal.type &&
			withdrawalTypeslist.value.find((item) => item.withdrawID == walletStore.getWithdrawal.type)
		) {
			data_NewSetWithdrawal.type = walletStore.getWithdrawal.type
		} else if (!withdrawalTypeslist.value.find((item) => item.withdrawID == walletStore.getWithdrawal.type)) {
			data_NewSetWithdrawal.type = 0
		}
		if (data_NewSetWithdrawal.type == 0) {
			data_NewSetWithdrawal.type = withdrawalTypeslist.value[0].withdrawID
			activeName.value = withdrawalTypeslist.value[0].name
			if (data_NewSetWithdrawal.type == 20) showC2c.value = true
		}
		// 电子钱包带名称
		if ([4, 23, 24].includes(data_NewSetWithdrawal.type)) {
			activeName.value =
				withdrawalTypeslist.value.find((item: any) => item.withdrawID == data_NewSetWithdrawal.type)?.name || ''
		}
		if (data_NewSetWithdrawal.type == 22) {
			activeName.value = withdrawalTypeslist.value.find((item: any) => item.withdrawID == 22)?.name || ''
		}

		// 是否展示引导弹窗
		let hideUntil = localStorage.getItem('popupHideUntil') || undefined //获取缓存时间
		const currentTime = new Date().getTime()
		safeBoxShow.value = res.data.isOpenSafeGuide
		if (safeBoxShow.value) {
			const storedTime = parseInt(hideUntil, 10)
			if (currentTime < storedTime) {
				safeBoxShow.value = false
			}
			safeBoxText.value = res.data.safeGuideContent || ''
		}
		// safeBoxShow.value = res.data.isOpenSafeGuide||false;
		shouldCheckFastUpiNeedKycOrder = shouldCheckFastUpiNeedKycOrderOnEntry()
	}
	setLoading(false)
	if (shouldCheckFastUpiNeedKycOrder) void getConnectWithdrawOrder()
}

const getRnsTypeInfo = async () => {
	try {
		const result = await getRNSWalletInfo()
		if (result?.code === 0) {
			rsnInfo.value = result.data
		} else {
			showFailToast({
				message: result?.msg
			})
		}
	} catch (error) {
		console.log('error', error)
	}
}
const getConnectWithdrawOrder = async () => {
	await openNeedKycOrderDialog({
		source: 'withdraw',
		onVerified: onFastUpiOrderVerified,
	})
}
const shouldCheckFastUpiNeedKycOrderOnEntry = () =>
	data_NewSetWithdrawal.type !== 27 && withdrawalTypeslist.value.some((item) => item.withdrawID == 27)

//切换提款方式，清空金额和usdt数量
async function onSelectWithdrawalType(item: any) {
	if (data_NewSetWithdrawal.type != item.withdrawID) {
		router.replace()
		if (item.withdrawID == 20) {
			showC2c.value = true
		}
		verify100.value = item.need100 === true
		data_NewSetWithdrawal.type = item.withdrawID
		bankCardList.value = {}
		await GetWithdrawalsV()
		activeName.value = item.name || ''
		data_NewSetWithdrawal.bid = bankList.value.length > 0 ? bankList.value[0].bid : 0
		data_NewSetWithdrawal.amount = 0
		withdrawField.value && (withdrawField.value.usdtCount = 0)
	}
}

function acitveBank() {
	bankCardList.value = ResWithdrawalsL.value.withdrawalslist.find((item: any) => {
		return item.bid == data_NewSetWithdrawal.bid
	})
	const withdrawalslist = data_NewSetWithdrawal.type === 27 ? bankList.value : ResWithdrawalsL.value.withdrawalslist || []
	if (!bankCardList.value && withdrawalslist.length) {
		data_NewSetWithdrawal.bid = withdrawalslist[0].bid
		bankCardList.value = withdrawalslist[0]
	}
}

/**
 * @description: 获取提现类别下的银行信息和提现规则
 * @constructor
 * arUpiRecommandBankList 快捷提现  27 快捷提现upi  2upi
 */
async function GetWithdrawalsV() {
	setLoading(true)
	const res = await AwaitApiResult(GetWithdrawals({ withdrawid: data_NewSetWithdrawal.type }))
	setLoading(false)
	if (res) {
		ResWithdrawalsL.value = res.data
		arUpiRecommandBankList.value = res?.data.arUpiRecommandBankList || []
		if (data_NewSetWithdrawal.type === 27) {
			if (arUpiRecommandBankList.value.length > 0 && !route.query.bankCode) {
				bankCode.value = arUpiRecommandBankList.value[0].bankCode
			} else {
				bankCode.value = route.query.bankCode
			}
		}
		walletStore.setWithdrawalslist(res.data.withdrawalslist)
		setWithdrawalsrule(res.data?.withdrawalsrule)
		if (res.data?.withdrawalsrule?.arbWithdrawRecommand && !loadRewardPopup.value) {
			rewardPopup.value = true
		}
		if (res.data.lastBandCarkName) {
			localStorage.setItem('lastBandCarkName', res.data?.lastBandCarkName)
		} else {
			localStorage.removeItem('lastBandCarkName')
		}
		acitveBank()
	}
}

//联系客服
function onservice() {
	getSelfCustomerServiceLink()
}

//进入重置密码页面
function forgetPwd() {
	router.push({ name: 'rpwd' })
}
// 跳转去保险箱
const gotoSafe = () => {
	router.push({ name: 'StrongBox' })
}
/******** c2c提现 **********/


const setc2cAmount = (amount: number) => {
	data_NewSetWithdrawal.amount = amount
}
//缓存提现接口参数
watch(data_NewSetWithdrawal, (newVal) => {
	walletStore.setWithdrawal({ ...newVal })
	setWithdrawal(newVal)
})
watch(
	() => data_NewSetWithdrawal.type,
	(value: number) => {
		if (value !== 27) return
		getConnectWithdrawOrder()
	}
)
const init = async () => {
	//重新进入页面时选中上次选择的提款方式
	const bid = router.currentRoute.value?.query?.bid
	if (walletStore.getWithdrawal.type) data_NewSetWithdrawal.type = walletStore.getWithdrawal.type
	getUserInfo({ signature: globalStore.token })
	getRegisterState()
	if (bid) {
		data_NewSetWithdrawal.bid = Number(bid)
	}
	//获取提现类别
	await getWithdrawalTypes()
	await GetWithdrawalsV()
}
onMounted(() => {
	init()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/extend';
@import '@/assets/styles/withdraw';

.withdraw__container {
	font-family: 'Inter';
	font-style: normal;
	color: var(--text_color_L2);
	//padding-bottom: 60px;
	font-weight: 400;
	font-size: 24px;
	line-height: 40px;
	text-align: center;
	letter-spacing: 0.04em;

	:deep(.navbar__content-left > .van-icon) {
		font-size: 40px;
	}
	span.red {
		color: var(--norm_red-color);
	}

	&-content {
		margin-top: 30px;
		padding-inline: 30px;
	}

	.pwd {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		::-webkit-input-placeholder {
			/* WebKit browsers */
			color: var(--text_color_L3);
		}

		:-moz-placeholder {
			/* Mozilla Firefox 4 to 18 */
			color: var(--text_color_L3);
		}

		::-moz-placeholder {
			/* Mozilla Firefox 19+ */
			color: var(--text_color_L3);
		}

		:-ms-input-placeholder {
			/* Internet Explorer 10+ */
			color: var(--text_color_L3);
		}

		> div:nth-of-type(2) {
			margin-top: 25px;
		}

		&-head {
			padding: 30px 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 90%;

			svg {
				width: 48px;
				height: 48px;
				margin-right: 5px;
				color: var(--main-color);
			}

			h1 {
				color: var(--text_color_L1);
				font-weight: 600;
				font-size: 32px;
			}

			h2 {
				color: var(--text_color_L1);
				font-weight: 500;
				font-size: 32px;
			}
		}

		input {
			border-radius: 10px;
			height: 88px;
			width: 90%;
			background: none;
			//padding: 27px 26px;
			font-size: 28px;
			// color: #acafc2;
			padding-left: 20px;
		}

		> span {
			text-align: left;
			width: 90%;
			margin-top: 20px;
		}

		.forgetPwd {
			width: 90%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-top: 40px;

			span {
				color: var(--text_color_L1);
				font-weight: 400;
				font-size: 28px;
			}

			button {
				border: 1px solid var(--text_color_L2);
				border-radius: 10px;
				width: 195px;
				height: 50px;
				background: none;
			}
		}

		.btnD {
			width: 100%;
			margin-top: 60px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			button {
				flex: 1;
				height: 120px;
				font-size: 34px;

				&:nth-of-type(1) {
					background: transparent;
					color: var(--main-color);
					border: 1px solid var(--main-color);
				}

				&:nth-of-type(2) {
					background: var(--main-color);
					color: var(--text_color_L4);
					border: none;
				}
			}
		}
	}

	:deep(.passwordInput__container) {
		padding: 0 40px;
		width: 100%;
	}

	:deep(.van-dialog.c2cconfirm) {
		.van-dialog__content {
			padding-block: 0px !important;
			height: auto !important;
		}
	}

	:deep(.explain) {
		box-shadow: none;
	}
}
.arupiAmount {
	.title1 {
		padding: 20px;
		font-size: 28px;
		font-weight: 600;
		text-align: center;
		margin-bottom: 20px;
		color: var(--text_color_L4);
		background: var(--main_gradient-color);
	}
	.title2 {
		padding: 20px;
		font-size: 28px;
		line-height: 36px;
		color: var(--text_color_L1);
		margin-bottom: 20px;
		word-wrap: break-word;
		max-height: 800px;
		overflow-y: auto;
		:deep(img) {
			width: 100% !important;
		}
	}
	.button {
		padding: 20px;
		display: flex;
		justify-content: space-between;
		&.column {
			flex-direction: column;
			div {
				width: 100%;
				margin-top: 20px;
			}
		}
		& > div {
			width: calc((100% - 20px) / 2);
			height: 76px;
			line-height: 76px;
			border-radius: 20px;
			font-size: 30px;
			text-align: center;
			&.clance {
				border: 1px solid var(--main-color);
				color: var(--main-color);
			}
			&.goBuy {
				background: var(--main-color);
				color: #fff;
			}
		}
	}
}
@media screen and (max-width: 500px) {
	.withdraw__container .recycleBtnD {
		max-width: none;
	}
}

.bankInfo {
	margin-top: 20px;
	margin-bottom: 20px;

	> div {
		border-radius: 20px;
		padding: 20px 20px;
		display: flex;
	}

	.bankInfoItem {
		background: var(--bg_color_L2);

		flex-direction: row;
		display: flex;
		align-items: center;
		.svg-icon {
			width: 62px;
			height: 59px;
		}
		img {
			width: 62px;
			height: 59px;
		}

		> div:nth-of-type(1) {
			width: 29%;
			align-items: center;
		}

		> div:nth-of-type(2) {
			width: 70%;
			background: url('@/assets/icons/wallet/withdraw/line.png') no-repeat left;
			background-size: contain;
			padding-left: 50px;
			text-align: left;
		}

		> div {
			display: flex;
			flex-direction: column;
			//justify-content: space-between;
			//text-align: left;

			span {
				font-size: 28px;
				color: var(--text_color_L2);
				max-width: 95%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			> span:nth-of-type(1) {
				margin: 5px 0px;
			}
		}

		i {
			font-size: 30px;
		}
	}

	.bankInfoItem.usdt {
		flex-direction: column;

		> div {
			flex-direction: row;
			width: 100%;
			align-items: center;
			font-weight: 400;
			font-size: 24px;

			&:nth-of-type(1) {
				img {
					width: 48px;
					height: 48px;
					margin-right: 15px;
				}
			}

			&:nth-of-type(2) {
				padding-left: 0px;
				background: none;
				color: var(--text_color_L2);

				position: relative;

				> i {
					position: absolute;
					right: 0px;
				}
			}

			&:nth-of-type(3) > span {
				color: var(--norm_secondary-color);
			}
		}
	}

	.bankInfoItem.KBZ {
		background: var(--main_gradient-color);

		span {
			color: var(--text_color_L4);
		}
	}

	&.e-wallet {
		span:last-of-type {
			color: var(--text_color_L2) !important;
		}
	}
}

.is-hidden {
	position: absolute;
	left: -10000px;
	top: -10000px;
}
.c2c {
	.succeedImg {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: -38px;
		width: 280px;
		height: 180px;
	}
	h1 {
		color: var(--text_color_L2);
		margin-bottom: 20px;
	}
	p {
		font-size: 22px;
		// color: #888;
		margin-bottom: 50px;
		// background: #F6F6F6;
		border-radius: 10px;
		padding: 20px 30px;
		:deep(span) {
			color: var(--main-color);
		}
	}
}

/**引导去保险箱弹窗样式 */
.safebox-dialog {
	width: 660px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: hidden;
	background: #fff;
	padding-bottom: 22px;

	.content {
		width: 100%;
		margin: auto;
		max-height: 700px;
		padding: 30px 20px;
		overflow-y: auto;
		:deep(img) {
			width: 100% !important;
		}
		img {
			width: 100% !important;
		}
	}
	.question {
		text-align: center;
		color: var(--text_color_L1);
		border-top: 1px solid var(--Dividing-line_color);
		padding: 20px 0;
	}
	.active {
		padding-left: 20px;
		margin: 16px;
		color: var(--text_color_L2);
		font-size: 24px;
		background-repeat: no-repeat;
		background-size: 32px;
		background-position: left;
		background-image: url('@/assets/icons/activity/active.svg');
		&.a {
			background-image: url('@icon/activity/active_b.svg');
		}
	}
	.button {
		display: flex;
		padding-bottom: 24px;
		justify-content: center;
		gap: 50px;
		& > div {
			color: var(--text_color_L1);
			width: 240px;
			line-height: 60px;
			height: 60px;
			text-align: center;
			border-radius: 60px;
			color: var(--main-color);
			border: 1px solid var(--main-color);
			&:last-child {
				background: var(--main-color);
				color: #fff;
			}
		}
	}
}
</style>
