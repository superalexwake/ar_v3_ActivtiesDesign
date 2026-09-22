<template>
	<div class="addupi_C">
		<NavBar :title="$t('paymentMethod')" left-arrow @click-left="onBack" />
		<div class="addupi_C-header wallet_18"><svg-icon :name="'upi'"></svg-icon>{{ $t('UPIInformation') }}</div>
		<div class="addupi_C-title">UPI Name</div>
		<van-field
			class="upi-input"
			v-model.trim="UPIForm.beneficiaryName"
			:maxlength="30"
			:placeholder="$t('phEnterUPIName')"
			:readonly="iseditor"
			@input="makeTxt(UPIForm, 'beneficiaryName')"
			:rules="[{ required: true, message: $t('phEnterUPIName') }]"
		/>
		<p v-if="!iseditor" class="first-bind-tip">✓ {{ $t('firstBindNameLockTip') }}</p>
		<div class="addupi_C-title">{{ $t('phoneN') }}</div>
		<div class="addupi_C_number">
			<van-field
				class="upi-input number"
				v-model.number.trim="UPIForm.mobileNo"
				type="text"
				@input="onChange"
				:maxlength="numberLength(numberType)"
				:placeholder="$t('plsEnterTel')"
			/>
		</div>
		<div class="tip"><van-icon name="warning-o" size="14" />{{ $t('upiTip1') }}</div>
		<div class="addupi_C-title">UPI ID</div>
		<van-field
			class="upi-input"
			v-model.trim="UPIForm.accountNo"
			:maxlength="30"
			type="text"
			@input="inputAccountNo"
			:placeholder="$t('phEnterUPIID')"
		/>
		<div class="addupi_C-title">{{ $t('confirm') }} UPI ID</div>
		<van-field
			@paste="onpaste"
			class="upi-input"
			v-model.trim="UPIForm.confirmAccountNo"
			:maxlength="30"
			type="text"
			:placeholder="$t('phEnterUPIID')"
		/>
		<div class="upi_tip">
			<span>{{ $t('upi_tip_safe_title') }}</span>
			<p>{{ $t('upi_tip_safe') }}</p>
		</div>
		<div class="bind-bank-sumbit" :class="{ disable: !canSumbit }" @click="bindSumbit">{{ $t('save') }}</div>
	</div>
</template>
<script setup lang="tsx">
import { computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SettingStore } from '@/stores'
import { AwaitApiResult, maxlength, numberLength, trimFields } from '@/utils'
import { checkUpiIdExists, GetNewUPIBindMobileNo } from '@/api'
import { useI18n } from 'vue-i18n'
import { SetWithdrawalNewUPI } from '@/api'
import { showSuccessToast, showFailToast, showToast } from 'vant'
import { CodeType, useBank, useWithdraw, type SecurityVerifyPayload } from '@/hooks'
import { onClickOutside } from '@vueuse/core'
import { imageDataFromFile } from './scanner'
const router = useRouter()
const route = useRoute()
const { isOpenWithdraw, openSecurityVerifyDialog } = useBank()

const stting = SettingStore()
const numberType = ref('91')
const number = ref('')
const { t } = useI18n()
const issmssend = ref('')
const fileList = ref([])
const dropDown = ref()
const { iseditor, onLoad, makeTxt } = useWithdraw()
const onBack = () => {
	router.replace({
		name: 'Withdraw-Upi',
		query: {
			type: 'Add',
			bid: route.query.bid || ''
		}
	})
}

const UPIForm = reactive<any>({
	beneficiaryName: '',
	accountNo: '',
	smsCode: '',
	type: '',
	bankCode: '',
	categoryId: 2,
	mobileNo: '',
	codeType: CodeType.addNewUPI_N,
	confirmAccountNo: ''
})
const onpaste = (e: any) => {
	e.preventDefault() //阻止默认粘贴事件
	//阻止粘贴
	return false
}
const submitSecurityVerify = ({ type, code }: SecurityVerifyPayload) => {
	UPIForm.type = type
	UPIForm.smsCode = code
	return onConfirm()
}
function onChange(e: Event) {
	const el = e.target as HTMLInputElement
	//去掉中文

	const reg = /[^0-9]/g
	el.value = el.value.replace(reg, '')
}
const inputAccountNo = (e: any) => {
	// 去除所有中文
	UPIForm.accountNo = e.target.value.replace(/[\u4e00-\u9fa5]/g, '')
}
const extractPa = (url: string, upiId: string) => {
	let pa = ''
	if (url.includes('://')) {
		const urlObj = new URL(url)
		pa = urlObj.searchParams.get('pa') || ''
		return pa === upiId
	} else {
		const match = url.match(/pa=([^&\s]+)/)
		pa = match ? match[1] : ''
		return pa === upiId
	}
	return false
}
/**
 * @description: 检测二维码是否正确 bankcode 不存在不校验
 * @param file
 */
const checkCode = async (file?: any) => {
	const _file = fileList.value[0] || file
	const upiid = UPIForm.accountNo || ''
	if (!upiid) return showFailToast(t('phEnterUPIID'))
	if (!_file) return showFailToast(t('withdrawQrcodeTips'))
	try {
		const resultImage = await imageDataFromFile(_file.file)
		if (!extractPa(resultImage.data, upiid.trim())) {
			return showFailToast(t('qrupiId'))
		}
		return true
	} catch (e) {
		console.log(e)
		return showFailToast(t('upiUploadImg'))
	}
}
const uploadFile = async (file: any) => {
	if (typeof (await checkCode(file)) === 'boolean') {
		return true
	}
	return false
}
const changeT = (value: string) => {
	numberType.value = value
}

//填充已经绑定的手机号码
function getCurrentNumberType(numNo: string) {
	const disctionlist = sessionStorage.getItem('areaPhoneLenList')
	let dictionary: any = JSON.parse(disctionlist as string)
	let area = dictionary.find((item: any) => numNo.indexOf(item.area.replace('+', '')) == 0)?.area.replace('+', '')
	if (area) {
		numberType.value = area
		number.value = numNo.substring(area.length)
	}
}

const canSumbit = computed(() => {
	return UPIForm.beneficiaryName && UPIForm.accountNo && number && numberType
})
const loading = ref(false)
/**
 * @description: 获取用户绑定手机号
 * @return {*}
 */
const getCardList = async () => {
	const res = await AwaitApiResult(GetNewUPIBindMobileNo())
	issmssend.value = res?.data || ''
	if (issmssend.value != '') {
		getCurrentNumberType(issmssend.value)
	}
}
const isAdd = async () => {
	if (!stting.getNeedKycValid) return false
	const res = await AwaitApiResult(
		checkUpiIdExists({
			categoryId: 2,
			accountNo: UPIForm.accountNo
		})
	)
	if (res) {
		if (res.data) {
			showFailToast({
				message: t('code254'),
				wordBreak: 'break-word'
			})
		}
		return res.data
	}
	return false
}
const onConfirm = async () => {
	const { confirmAccountNo, ...other } = UPIForm
	if (loading.value) return false
	loading.value = true
	try {
		const res = await AwaitApiResult(SetWithdrawalNewUPI(trimFields(other)))
		if (!res) return false
		showSuccessToast(t('addedSuccessfully'))
		await router.replace({
			name: 'Withdraw-Upi',
			query: {
				bid: route.query.bid || ''
			}
		})
		return true
	} finally {
		loading.value = false
	}
}

onLoad(UPIForm, 'beneficiaryName')
const bindSumbit = async () => {
	//
	const upiRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/
	if (!UPIForm.mobileNo) {
		return showFailToast(t('pphone'))
	}
	if (!maxlength(numberType.value, `${UPIForm.mobileNo}`.trim().length)) {
		return showFailToast({
			message: t('wrongTel'),
			wordBreak: 'break-word'
		})
	}
	if (!upiRegex.test(UPIForm.accountNo)) {
		return showFailToast(t('UPIID'))
	}
	if (!upiRegex.test(UPIForm.confirmAccountNo)) {
		return showFailToast(t('confirmAccountNo'))
	}
	if (UPIForm.accountNo !== UPIForm.confirmAccountNo) {
		return showFailToast(t('UPIIDNotSame'))
	}
	if (await isAdd()) {
		return
	}
	if (isOpenWithdraw.value) {
		return openSecurityVerifyDialog({
			codeType: UPIForm.codeType,
			submit: submitSecurityVerify,
		})
	}
	return onConfirm()
}
onClickOutside(dropDown, () => {
	dropDown.value.close()
})
getCardList()
</script>
<style lang="scss" scoped>
.addupi_C {
	padding: 20px 20px 130px;
	height: 100vh;
	overflow: auto;

	&-header {
		height: 42px;
		line-height: 42px;
		font-weight: 700;
		font-size: 36px;
		color: var(--text_color_L1);
		padding-left: 0;
		background-size: 100px 42px;
		background-repeat: no-repeat;
		background-position: left center;
		svg {
			width: 102px;
			height: 42px;
		}
	}
	&-uploader {
		display: flex;
		width: 160px;
		height: 160px;
		padding: 24px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 16px;
		background: var(--bg_color_L2);
		border-radius: 10px;
		&-btn {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			gap: 8px;
			color: var(--text_color_L2);
		}
	}
	&-title {
		height: 40px;
		line-height: 40px;
		margin: 50px 0 24px 0;
		font-weight: 500;
		font-size: 32px;
		color: var(--text_color_L1);
	}
	.upi-input {
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
					color: var(--text_color_L2);
				}
			}
		}
	}
	&_number {
		display: flex;
		justify-content: space-between;

		> span {
			border-radius: 10px;
			height: 70px;
			line-height: 70px;
			font-size: 28px;
			padding-left: 20px;
			width: 100%;
			background: var(--button_dis_color);
		}
		.dropdown {
			position: relative;
			height: 70px;
			line-height: 70px;
			border-radius: 5px;
			:deep(.dropdown__value) {
				span {
					height: 70px;
				}
			}
		}
	}
	.tip {
		color: var(--main-color);
		font-size: 22px;
		margin: 20px 10px 40px;
	}
	.first-bind-tip {
		margin: 16px 10px 0;
		color: var(--main-color);
		font-size: 22px;
		line-height: 1.4;
	}
}

.bind-bank-sumbit {
	height: 120px;
	line-height: 120px;
	width: 100%;
	max-width: 750px;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	background-color: var(--main-color);
	color: var(--text_color_L4);
	font-size: 30px;
	text-align: center;
	letter-spacing: 1.2px;

	&.disable {
		background: var(--button_dis_color);
		pointer-events: none;
	}
}

.upi_tip {
	margin-top: 10px;
	color: var(--Secondary_red_color);
}
@media screen and (max-width: 500px) {
	.bind-bank-sumbit {
		max-width: none;
	}
}
</style>
