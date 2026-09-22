<template>
	<div class="addtype4_C">
		<NavBar :title="Type4name+' ' + t('paymentMethod')" left-arrow @click-left="onBack" />
		<div class="addtype4_C-header">{{ Type4name }}</div>
		<template v-if="withdrawType==4">
			<div class="addtype4_C-title">{{ $t('selectType') }}</div>
			<van-field
				class="addtype4-input"
				v-model="activeBink.bankName"
				:readonly="true"
				right-icon="arrow-down"
				:placeholder="$t('tipSelectPls')"
				@click="showPicker = true"
			/>
		</template>
		<template v-else>
			<div class="addtype4_C-title">{{ $t('bankname') }}</div>	
			<div class="selectB">{{ activeBink.bankName }}</div>
		</template>
		<div class="addtype4_C-title">{{ $t('name') }}</div>
		<van-field
			class="addtype4-input"
			v-model.trim="type4Form.beneficiaryName"
			:maxlength="50"
			:placeholder="$t('phEnter') + $t('name')"
			@input="makeTxt(type4Form, 'beneficiaryName')"
			:readonly="iseditor"
		/>
		<p v-if="!iseditor" class="first-bind-tip">✓ {{ $t('firstBindNameLockTip') }}</p>
		<div class="addtype4_C-title">{{ $t('account') }}</div>
		<van-field
			class="addtype4-input"
			v-model.trim="type4Form.mobileNo"
			:maxlength="15"
			:type="inputType"
			:placeholder="$t('phEnter') + $t('account')"
			@input="onChange"
		/>
		<div class="sumbitBtn" @click="onSubmit" :class="{ disable: !canSumbit }">{{ $t('save') }}</div>
		<van-toast v-model:show="successTip">
			<template #message>
				<div class="successTip">
					<div>{{ $t('addedSuccessfully') }}</div>
				</div>
			</template>
		</van-toast>
	</div>
	<van-popup v-model:show="showPicker" round position="bottom">
		<van-picker
			:columns="originalBankList"
			:columns-field-names="customFieldName"
			@cancel="showPicker = false"
			@confirm="onConfirm"
		/>
	</van-popup>
</template>
<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AwaitApiResult, trimFields } from '@/utils'
import { GetBankList, SetWithdrawalWallet } from '@/api'
import { showFailToast, showSuccessToast } from 'vant'
import type { ResBankList } from '@/types/api'
import { CodeType, useBank, useWithdraw, type SecurityVerifyPayload } from '@/hooks'
const { iseditor, onLoad, makeTxt } = useWithdraw()
const { t } = useI18n()
const router = useRouter()
const { isOpenWithdraw, openSecurityVerifyDialog } = useBank()
const Type4name = router.currentRoute.value.query.Type4name as string
const withdrawType = Number(router.currentRoute.value.query.withdrawType)
const successTip = ref<boolean>(false)
const type4Form = reactive({
	withdrawId: withdrawType,
	mobileNo: '',
	bankId: '',
	smsCode: '',
	beneficiaryName: '',
	type: '',
	codeType: CodeType.addEWallet
})
const activeBink = ref<any>({
	bankName: '',
	bankID: 0,
	reserved: ''
})
const showPicker = ref(false)
const onBack = () => {
	router.replace({
		name: 'Withdraw-Type4',
		query: { type: 'Add', Type4name: Type4name, withdrawType: withdrawType }
	})
}
const customFieldName = {
	text: 'bankName',
	value: 'bankID'
}
const canSumbit = computed(() => {
	return type4Form.mobileNo && type4Form.bankId && type4Form.beneficiaryName
})
const onlyNum = Boolean(import.meta.env.VITE_ADDTYPE4_ONLY_NUM === '1');
const inputType = computed(()=>{
	if ([23,24].includes(withdrawType)) return 'digit';
	if (onlyNum) return 'digit';
	return  'text'
})
function onChange(e: Event) {
	const el = e.target as HTMLInputElement
	//去掉中文
	if (![23,24].includes(withdrawType)){
		el.value = el.value
	}else {
		const reg = /[^0-9]/g;
		el.value = el.value.replace(reg, '')
	}

}
//获取银行卡列表
let originalBankList = ref<ResBankList[]>([])
async function getBankList() {
	const res = await AwaitApiResult(
		GetBankList({
			withdrawid: withdrawType
		})
	)
	if (res) {
		originalBankList.value = res.data.banklist
		if([23,24].includes(withdrawType)) {
			activeBink.value = res.data.banklist[0]
			type4Form.bankId = res.data.banklist[0].bankID
		}
	}
}
onMounted(async () => {
	await getBankList()
})
const onconfirm = async () => {
	const res = await AwaitApiResult(SetWithdrawalWallet(trimFields({ ...type4Form })))
	if (!res) return false
	showSuccessToast(t('addedSuccessfully'))
	router.replace({
		name: 'Withdraw-Type4',
		query: { type: 'Add', Type4name: Type4name, withdrawType: withdrawType }
	})
	return true
}
const submitSecurityVerify = ({ type, code }: SecurityVerifyPayload) => {
	type4Form.type = type
	type4Form.smsCode = code
	return onconfirm()
}
const onConfirm = (val: any) => {
	let value = { ...val.selectedOptions[0] } as any
	activeBink.value = value
	type4Form.bankId = value.bankID
	showPicker.value = false
}

//校验账号8到15位的数字和大小写字母
function checkText(obj: any) {
	let regex = /^[A-Za-z\d]{8,15}$/;
	if (!regex.test(obj)) {
		showFailToast({
			message: t('account') + t('formatErr'),
			wordBreak: 'break-word'
		})
		return false
	}
	return true
}
//校验账号8-15位数字
function checkAccoutNo(obj: any, hint: string) {
	let regex = /^[0-9]{8,15}$/
	if (!regex.test(obj)) {
		showFailToast({
			message: hint,
			wordBreak: 'break-word'
		})
		return false
	}
	 // 判断第一位是否为0
	 if (`${obj}`.charAt(0) !== '0') {
		showFailToast({
			message: t('charAtone'),
			wordBreak: 'break-word'
		})
		return false
	}
	return true
}
const cheackValue = () => {
	const _onlyNum=onlyNum||[23,24].includes(withdrawType);
	if (type4Form.mobileNo.toString().trim().length > 0) {
		let isCheck = _onlyNum ? checkAccoutNo(type4Form.mobileNo, t('account') + t('formatErr')) : checkText(type4Form.mobileNo)
		if (!isCheck) return
	}

	return true
}
const onSubmit = async () => {
	if (cheackValue() !== true) return;
	if (isOpenWithdraw.value) {
		return openSecurityVerifyDialog({
			codeType: CodeType.addEWallet,
			submit: submitSecurityVerify,
		})
	}
	await onconfirm()
}

onLoad(type4Form, 'beneficiaryName')
</script>
<style lang="scss" scoped>
.addtype4_C {
	padding: 0 20px;
	height: 100vh;
	overflow: auto;
	.selectB {
		font-size: 28px;
		color: var(--text_color_L4);
		background: var(--main_gradient-color);
		height: 80px;
		line-height: 80px;
		border-radius: 10px;
		padding: 0 20px;
	}
	&-header {
		height: 42px;
		line-height: 42px;
		font-weight: 700;
		font-size: 36px;
		color: var(--darkTextW, var(--text_color_L1));
		padding-inline-start: 122px;
		background-image: url('@/assets/icons/wallet/withdraw/c2c/upi.png');
		background-size: 100px 42px;
		background-repeat: no-repeat;
		background-position: left center;
	}

	.successTip {
		width: 600px;
		height: 140px;
		font-weight: 700;
		font-size: 30px;
		color: var(--textW);
		background-color: var(--main-color);
		border-radius: 20px;
		padding: 40px 0;

		& > div {
			height: 60px;
			line-height: 60px;
			width: fit-content;
			margin: auto;
			padding-left: 75px;
			background-image: url('@assets/icons/wallet/successicon.png');
			background-size: 60px;
			background-position: left center;
			background-repeat: no-repeat;
		}
	}

	&-header {
		height: 60px;
		line-height: 60px;
		font-weight: 700;
		font-size: 36px;
		color: var(--darkTextW, var(--text_color_L1));
		padding-left: 82px;
		background-image: url('@icon/wallet/withdrawType/4.png');
		background-size: 60px;
		background-repeat: no-repeat;
		background-position: left center;
	}

	&-title {
		height: 40px;
		line-height: 40px;
		margin: 50px 0 24px 0;
		font-weight: 500;
		font-size: 32px;
		color: var(--darkTextW, var(--text_color_L1));
	}

	.first-bind-tip {
		margin: 16px 0 0;
		color: var(--main-color);
		font-size: 22px;
		line-height: 1.4;
	}

	&-Safety {
		height: 48px;
		line-height: 48px;
		font-weight: 600;
		font-size: 36px;
		color: var(--text_color_L1);
		margin-top: 124px;
		padding-left: 65px;
		background-image: url('@icon/wallet/safety.png');
		background-size: 48px;
		background-repeat: no-repeat;
		background-position: left center;

		&-tip {
			margin-top: 48px;
			font-size: 30px;
			color: var(--text_color_L1);
			margin-bottom: 28px;
		}
	}

	.sumbitBtn {
		height: 70px;
		line-height: 70px;
		width: 100%;
		color: var(--text_color_L4);
		font-weight: 700;
		font-size: 30px;
		text-align: center;
		background: var(--main_gradient-color);
		max-width: 750px;
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);

		&.disable {
			background: var(--button_dis_color);
			color: var(--text_color_L1);
			pointer-events: none;
		}
	}

	.addtype4-input {
		height: 70px;
		padding: 0 20px;
		font-size: 28px;
		color: var(--text_color_L2);
		background: var(--bg_color_L2);
		width: 100%;
		border-radius: 4px;

		:deep(.van-field__value) {
			padding: 14px 0;
			width: 100%;

			input {
				width: 100%;

				&::placeholder {
					color: var(--text_color_L3);
				}
			}
		}
	}
}

:deep(.van-toast) {
	overflow: hidden;
	background-color: transparent;
	padding: 0;
}
</style>
