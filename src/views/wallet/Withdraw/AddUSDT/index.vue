<template>
	<div class="addUSDT__container">
		<NavBar :title="$t('titleAddUSDTAddr')" left-arrow @click-left="onBack" />
		<div class="addUSDT__container-content">
			<div class="addUSDT__container-content-top">
				<img src="@icon/wallet/hint.png" />
				<span>{{ $t('tipBindUrOwnUSDEAddrForFundSafety') }}</span>
			</div>

			<div class="addUSDT__container-content-item">
				<div class="label">
					<svg-icon name="usdt1" class="icon"/>
					{{ $t('selectMainNetwork') }}
				</div>

				<div class="ar-searchbar">
					<ArSelect @click-select="onClickSelectN" :selectName="netWorkLable"></ArSelect>
				</div>
			</div>

			<div class="addUSDT__container-content-item">
				<div class="label">
					<svg-icon name="usdt2" class="icon"/>
					{{ $t('usedAddr') }}
				</div>
				<div class="input">
					<input
						:placeholder="$t('phEnterUSDTAddr')"
						:maxlength="maxlengthAddress"
						v-model="data_SetWBC.usdtaddress"
						@input="checkAddress"
					/>
				</div>
			</div>

			<div class="addUSDT__container-content-item">
				<div class="label">
					<svg-icon name="usdt3" class="icon"/>
					{{ $t('addressAlias') }}
				</div>

				<input :placeholder="$t('phEnterUSDTRemarks')" maxlength="20" v-model.trim="data_SetWBC.usdtRemarkName" />
			</div>

			<div class="addUSDT__container-content-btn">
				<button :class="{ active: isActive }" @click="onShowSms">{{ $t('save') }}</button>
			</div>
		</div>

		<van-popup v-model:show="showPicker" round position="bottom">
			<van-picker
				:columns-field-names="{ text: 'bankName', value: 'bankID', children: 'children' }"
				:columns="originalBankList"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, trimFields } from '@/utils'
import type { ReqSetWithdrawalUsdt, ResBankList } from '@/types/api'
import { GetBankList, SetWithdrawalUsdt } from '@/api'
import { useCommonStore } from '@/stores'
import { showFailToast, showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { CodeType, useBank, type SecurityVerifyPayload } from '@/hooks'

const { t } = useI18n()
const { isOpenWithdraw, openSecurityVerifyDialog } = useBank()
const { setLoading } = useCommonStore()
const router = useRouter()
const fromV = (router.currentRoute.value.query.fromV as string) || 'Withdraw-USDT'
function onBack() {
	router.replace({
		name: fromV,
		query: { type: 'Add' }
	})
}

const showPicker = ref(false)

//获取主网络列表
let originalBankList = reactive<ResBankList[]>([])
async function getBankList() {
	const res = await AwaitApiResult(
		GetBankList({
			withdrawid: 3
		})
	)
	if (res) {
		originalBankList = res.data.banklist
		netWorkLable.value = originalBankList.length > 0 ? originalBankList[0].bankName : ''
		data_SetWBC.bankid = originalBankList.length > 0 ? originalBankList[0].bankID : 0
	}
}

const netWorkLable = ref('')

const onConfirm = ({ selectedOptions }: any) => {
	showPicker.value = false
	netWorkLable.value = selectedOptions[0].bankName
	data_SetWBC.bankid = selectedOptions[0].bankID
}
//状态下拉框点击事件
function onClickSelectN() {
	showPicker.value = true
}

//主网络类型不同，地址长度不同
const maxlengthAddress = computed(() => {
	if (netWorkLable.value.toUpperCase().indexOf('TRC') != -1) return 36
	else if (netWorkLable.value.toUpperCase().indexOf('BEP') != -1) return 42
	else if (netWorkLable.value.toUpperCase().indexOf('ERC') != -1) return 46
	else return 100
})

const data_SetWBC = reactive<ReqSetWithdrawalUsdt>({
	withdrawid: 3,
	bankid: 0,
	usdtaddress: '',
	smsCode: '',
	usdtRemarkName: '',
	type: '',
	codeType: CodeType.addUSDT
})

const checkAddress = (event:Event)=>{
	const target = event.target as HTMLInputElement;
	data_SetWBC.usdtaddress = target.value.replace(/[^\w\/]/ig,'');
}
const isActive = computed(() => {
	if (data_SetWBC.usdtRemarkName.trim().length == 0 || data_SetWBC.bankid == 0 || data_SetWBC.usdtaddress.trim().length == 0) {
		return false
	} else {
		return true
	}
})
// 检查参数是否正确 返回true 代表校验通过
const checkValue = () => {
	if (!isActive.value) return
	if (data_SetWBC.bankid == 0) {
		return showFailToast({
			message: t('onConfirmMsg1'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.usdtaddress.toString().trim().length == 0) {
		return showFailToast({
			message: t('onConfirmMsg2'),
			wordBreak: 'break-word'
		})
	}
	const isBep20 = netWorkLable.value.toUpperCase().indexOf('BEP') != -1
	if (isBep20 && !/^0x[0-9a-fA-F]{40}$/.test(data_SetWBC.usdtaddress.trim())) {
		return showFailToast({
			message: t('onConfirmMsg5'),
			wordBreak: 'break-word'
		})
	}
	if (!isBep20 && data_SetWBC.usdtaddress.trim().length < 30) {
		return showFailToast({
			message: t('onConfirmMsg4'),
			wordBreak: 'break-word'
		})
	}
	if (netWorkLable.value.toUpperCase().indexOf('TRC') != -1) {
		if (data_SetWBC.usdtaddress.trim().slice(0, 1) != 'T' || data_SetWBC.usdtaddress.trim().length > 36) {
			return showFailToast({
				message: t('onConfirmMsg5'),
				wordBreak: 'break-word'
			})
		}
	}
	if (netWorkLable.value.toUpperCase().indexOf('ERC') != -1) {
		if (data_SetWBC.usdtaddress.trim().slice(0, 2) != '0x' || data_SetWBC.usdtaddress.trim().length > 46) {
			return showFailToast({
				message: t('onConfirmMsg5'),
				wordBreak: 'break-word'
			})
		}
	}
	if (data_SetWBC.usdtRemarkName.toString().trim().length == 0) {
		return showFailToast({
			message: t('onConfirmMsg3'),
			wordBreak: 'break-word'
		})
	}
	return true
}
async function onconfirm() {
	if (checkValue() !== true) return false

	setLoading(true)
	try {
		const res = await AwaitApiResult(SetWithdrawalUsdt(trimFields({ ...data_SetWBC })))
		if (!res) return false
		showSuccessToast(t('addedSuccessfully'))
		await router.replace({
			name: fromV,
			query: { type: 'Add' },
			replace: true
		})
		return true
	} finally {
		setLoading(false)
	}
}
onMounted(async () => {
	await getBankList()
})
const submitSecurityVerify = ({ type, code }: SecurityVerifyPayload) => {
	data_SetWBC.type = type
	data_SetWBC.smsCode = code
	return onconfirm()
}
//判断是否开启验证码
async function onShowSms() {
	//判断是否开启需要验证码
	data_SetWBC.smsCode = ''
	if (checkValue() !== true) return
	if (isOpenWithdraw.value) {
		return openSecurityVerifyDialog({
			codeType: data_SetWBC.codeType,
			submit: submitSecurityVerify,
		})
	}
	await onconfirm()
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/extend';

.addUSDT__container {
	padding-inline: 24px;
	padding-block: 0 30px;
	padding-top: 10px;

	:deep(.navbar__content-left > .van-icon) {
		font-size: 40px;
	}

	@mixin flex {
		display: flex;
		align-items: center;
	}

	&-content {
		&-top {
			@include flex;
			height: 74px;
			background: var(--bg_color_L2);
			border-radius: 60px;
			padding: 10px 40px;

			img {
				width: 35px;
				height: 35px;
				margin-right: 15px;
			}

			span {
				color: var(--norm_red-color);
				font-weight: 500;
				font-size: 24px;
			}
		}

		&-selectB {
			@include flex;
			justify-content: space-between;
			margin-top: 40px;

			> div:last-of-type {
				font-weight: 500;
				font-size: 24px;
			}
		}

		&-item {
			margin: 70px 0;

			.label {
				@include flex;
				margin-bottom: 24px;
				color: var(--text_color_L1);
				font-weight: 500;
				font-size: 32px;

				.icon {
					width: 48px;
					height: 48px;
					margin-right: 12px;
				}
			}

			.input {
				position: relative;

				> img {
					position: absolute;
					right: 15px;
					top: 15px;
					width: 48px;
				}
			}

			input {
				border: none;
				width: 100%;
				padding: 10px 26px;
				background: var(--bg_color_L2);
				border-radius: 10px;
				color: var(--text_color_L2);
				font-size: 28px;
				height: 80px;

				&::placeholder {
					color: var(--text_color_L3);
				}
			}

			.ar-searchbar__selector {
				width: 100%;
			}
		}

		&-btn {
			margin-top: 150px;

			button {
				@include button(
					$background: linear-gradient(180deg, #cfd1de 0%, #c7c9d9 100%),
					$boxShadow: 0px 4px 0px #b6bad0,
					$textShadow: 0px 2px 1px #afb0be
				);

				&.active {
					background: var(--main_gradient-color);
					text-shadow: none;
				}
			}
		}
	}
}

.info-dialog {
	&-content {
		&-hint {
			border: 1px solid #ebebed;
			border-radius: 12px;
			height: 230px;
			padding: 20px;
			display: flex;
			flex-direction: column;
			gap: 10px;

			span {
				font-size: 24px;
				color: var(--text_color_L1);
				font-weight: 400;
				font-family: 'Poppins';
			}
		}
	}
}

:deep(.verifyInput__container) {
	margin-top: 20px;

	.verifyInput__container-label {
		display: none;
	}

	.verifyInput__container-input {
		input {
			background: var(--bg_color_L2);
			border-radius: 40px;
			height: 80px;
			font-weight: 400;
			font-size: 24px;

			&::placeholder {
				color: var(--text_color_L3);
			}
		}

		button {
			right: 15px;
			top: 18%;
		}
	}
}
</style>
