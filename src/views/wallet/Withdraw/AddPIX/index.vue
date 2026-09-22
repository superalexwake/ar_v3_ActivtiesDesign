<template>
	<div class="addBankCard__container">
		<NavBar :title="$t('paymentMethod')" left-arrow @click-left="onBack" />
		<div class="addBankCard__container-content">
			<h1><svg-icon name="pix" />{{ $t('pixInfo') }}</h1>
			<div class="addBankCard__container-content-top">
				<div class="addBankCard__container-content-top-item">
					<div class="label">
						{{ $t('payeeName') }}
					</div>
					<input :readonly="iseditor" :placeholder="$t('phEnterPayeeName')" v-model="data_SetWBC.name" />
				</div>
				<div class="addBankCard__container-content-top-item">
					<div class="label">CPF</div>
					<input
						:readonly="iseditor"
						:placeholder="$t('enterCpf')"
						v-model="data_SetWBC.cpf"
						maxlength="11"
						oninput="value=value.replace(/\D/g,'')"
						@paste="getNumber"
						id="cpf"
					/>
				</div>
				<div class="addBankCard__container-content-top-item">
					<div class="label">{{ $t('pixType') }}</div>
					<div class="ar-searchbar">
						<ArSelect @click-select="onClickSelectN" :selectName="bankName"></ArSelect>
					</div>
				</div>
				<div class="addBankCard__container-content-top-item">
					<div class="label">{{ $t('pixAccount') }}</div>
					<div class="accountNo">
						<div v-if="bankName.toUpperCase().indexOf('PHONE') != -1">+{{ numberType }}</div>
						<!--phone只能输入数字-->
						<input
							v-if="bankName.toUpperCase().indexOf('PHONE') != -1 || bankName.toUpperCase().indexOf('CPF') != -1"
							:placeholder="$t('enterPixAccount')"
							v-model.trim="data_SetWBC.accountNo"
							oninput="value=value.replace(/\D/g,'')"
							maxlength="11"
							@paste="getNumber"
							id="accountNo"
						/>
						<input
							v-else
							:placeholder="$t('enterPixAccount')"
							v-model.trim="data_SetWBC.accountNo"
							oninput="value=value.replace(/\s+/g,'')"
							maxlength="40"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="addBankCard__container-content-btn">
			<button :class="{ active: isActive }" @click="onShowSms">{{ $t('save') }}</button>
			<div
				@click="gotoCustorm"
			>
				<svg-icon name="iconservr-r" />{{ $t('withdrawDialogDesc5') }}
			</div>
		</div>
		<van-popup v-model:show="showPicker" round position="bottom">
			<div class="search">
				<SearchBar :placeholder="$t('searchPixType')" v-model:value="bankNameInput" :isShowClose="true" />
			</div>
			<van-picker
				:columns-field-names="{ text: 'bankName', value: 'bankID', children: 'children' }"
				:columns="fillist"
				@cancel="showPicker = false"
				@confirm="onConfirmBank"
			/>
		</van-popup>
	</div>
</template>

<script setup lang="tsx">
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, trimFields } from '@/utils'
import type { ReqSetWithdrawalCpf, ResBankList } from '@/types/api'
import { SetWithdrawalCpf, GetUserRealName, GetBankList } from '@/api'
import { useCommonStore } from '@/stores'
import { showFailToast, showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'
import SearchBar from '@/components/SearchBar/index.vue'
import { validate, validateText } from '@/plugins/validate'
import { CodeType, useBank, type SecurityVerifyPayload } from '@/hooks'
import { useServer } from '@/hooks/useServe.hook'
const { getSelfCustomerServiceLink } = useServer({ServerType: 2})

const { t } = useI18n()
const { setLoading } = useCommonStore()
const router = useRouter()
const bankName = ref('')
const showPicker = ref(false)
const fromV = (router.currentRoute.value.query.fromV as string) || 'Withdraw-PIX'

function onBack() {
	router.replace({
		name: fromV,
		query: { type: 'Add' }
	})
}
const { isOpenWithdraw, openSecurityVerifyDialog } = useBank()
const data_SetWBC = reactive<ReqSetWithdrawalCpf>({
	bankId: 0,
	accountNo: '',
	name: '',
	cpf: '',
	smsCode: '',
	type: '',
	codeType: CodeType.addPIX,
	pixType: ''
})
const numberType = ref(localStorage.getItem('numberType') as string)
const bankNameInput = ref('')
let fillist = ref<any>([])
//获取银行卡列表
let originalBankList = reactive<ResBankList[]>([])

//保存按钮启用禁用样式
const isActive = computed(() => {
	if (
		data_SetWBC.accountNo.trim().length == 0 ||
		data_SetWBC.name.trim().length == 0 ||
		data_SetWBC.cpf.trim().length == 0 ||
		data_SetWBC.bankId == 0
	) {
		return false
	} else {
		return true
	}
})
const gotoCustorm = () =>{
	getSelfCustomerServiceLink()
}

//将复制过来的内容去掉非数字的内容
function getNumber(e: any) {
	e.preventDefault()
	// 获取剪贴板中的原始文本
	const clipboardText = e.clipboardData.getData('text')
	// 去掉不是数字的字符
	const cleanedValue = clipboardText.replace(/[^\d]/g, '')
	// 将清理后的值粘贴到文本框中
	e.target.value = cleanedValue
	if (e.target.id == 'cpf') {
		data_SetWBC.cpf = cleanedValue //如果不加这句isActive会检测不到
	} else if (e.target.id == 'accountNo') {
		data_SetWBC.accountNo = cleanedValue //如果不加这句isActive会检测不到
	}
}

const checkValue = () => {
	if (!isActive.value) return
	if (data_SetWBC.name.trim().length == 0) {
		return showFailToast({
			message: t('phEnterPayeeName'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.cpf.trim().length == 0) {
		return showFailToast({
			message: t('enterCpf'),
			wordBreak: 'break-word'
		})
	}
	//校验cpf格式
	if (!validarCPF(data_SetWBC.cpf.trim())) {
		return showFailToast({
			message: t('tipsCpf1'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.bankId == 0) {
		return showFailToast({
			message: t('tipsCpf2'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.accountNo.trim().length == 0) {
		return showFailToast({
			message: t('tipsCpf3'),
			wordBreak: 'break-word'
		})
	}
	//PHONE,CPF类型，accountNo限制长度11
	if (bankName.value.toUpperCase().indexOf('PHONE') != -1 || bankName.value.toUpperCase().indexOf('CPF') != -1){
		if (data_SetWBC.accountNo.trim().length != 11) {
			return showFailToast({
				message: t('tipsCpf4'),
				wordBreak: 'break-word'
			})
		}
	}
	//CPF类型
	if(bankName.value.toUpperCase().indexOf('CPF') != -1){
		if(data_SetWBC.accountNo != data_SetWBC.cpf){
			return showFailToast({
				message: t('pixTip1'),
				wordBreak: 'break-word'
			})
		}
	}
	//EMALL
	if (['EMALL','EMAIL'].includes(bankName.value.toUpperCase())) {
		if (!validate.email1.test(data_SetWBC.accountNo.trim())) {
			return showFailToast({
				message: t(validateText.email),
				wordBreak: 'break-word'
			})
		}
	}
	return true
}
async function onShowSms() {
	if (checkValue() !== true) return
	//判断是否开启需要验证码
	data_SetWBC.smsCode = ''
	if (isOpenWithdraw.value) {
		return openSecurityVerifyDialog({
			codeType: CodeType.addPIX,
			submit: submitSecurityVerify,
		})
	}
	await onconfirm()
}
async function onconfirm() {
	setLoading(true)
	try {
		//PHONE
		let data = data_SetWBC
		if (bankName.value.toUpperCase().indexOf('PHONE') != -1) {
			const accountNo = numberType.value + data_SetWBC.accountNo
			data = Object.assign({}, data_SetWBC, { accountNo })
		}
		const res = await AwaitApiResult(SetWithdrawalCpf(trimFields({ ...data })))
		if (!res) return false
		showSuccessToast(t('addedSuccessfully'))
		data_SetWBC.accountNo = '' //当请求失败，pix类型为phone时，如果不清空，区号会显示在pix账号输入框里
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

const iseditor = ref(true) //是否禁用收款人姓名，cpf 输入框
//获取实名认证信息
async function getUserRealName() {
	const res = await AwaitApiResult(GetUserRealName())
	if (res) {
		if (res.data != null) {
			iseditor.value = true
			data_SetWBC.name = res.data.realName
			data_SetWBC.cpf = res.data.idCard
		} else {
			iseditor.value = false
		}
	} else {
		iseditor.value = false
	}
}

async function getBankList() {
	const res = await AwaitApiResult(
		GetBankList({
			withdrawid: 5
		})
	)
	if (res) {
		originalBankList = res.data.banklist
		bankName.value = originalBankList.length > 0 ? originalBankList[0].bankName : ''
		data_SetWBC.bankId = originalBankList.length > 0 ? originalBankList[0].bankID : 0
		fillist.value = originalBankList
		setAccountNo()
	}
}

watch(bankNameInput, () => {
	//模糊搜索
	if (originalBankList.length > 0) {
		fillist.value = originalBankList.filter((p) => {
			return p.bankName.toLowerCase().indexOf(bankNameInput.value.toLowerCase()) !== -1
		})
	}
})

function setAccountNo(){
	data_SetWBC.accountNo = ''
	data_SetWBC.pixType = ''
	if(bankName.value.toUpperCase().indexOf('CPF') != -1){
		data_SetWBC.pixType = 'cpf'
		if(data_SetWBC.cpf.trim().length != 0){
			data_SetWBC.accountNo = data_SetWBC.cpf
		}
	}
}

//当银行列表下拉框弹出时清空模糊搜索输入框
watch(showPicker, () => {
	if (showPicker.value) {
		bankNameInput.value = ''
	}
})

//状态下拉框点击事件
function onClickSelectN() {
	showPicker.value = true
}

const onConfirmBank = ({ selectedOptions }: any) => {
	showPicker.value = false
	if (selectedOptions[0]) {
		bankName.value = selectedOptions[0].bankName
		data_SetWBC.bankId = selectedOptions[0].bankID
		setAccountNo()
	}
}

//cpf算法校验 正确格式：111.444.777-35
function validarCPF(cpf: string) {
	cpf = cpf.replace(/[^\d]+/g, '')
	if (cpf == '') return false
	// Elimina CPFs invalidos conhecidos
	if (
		cpf.length != 11 ||
		cpf == '00000000000' ||
		cpf == '11111111111' ||
		cpf == '22222222222' ||
		cpf == '33333333333' ||
		cpf == '44444444444' ||
		cpf == '55555555555' ||
		cpf == '66666666666' ||
		cpf == '77777777777' ||
		cpf == '88888888888' ||
		cpf == '99999999999'
	)
		return false 
	// Valida 1o digito
	let add = 0
	for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i)
	let rev = 11 - (add % 11)
	if (rev == 10 || rev == 11) rev = 0
	if (rev != parseInt(cpf.charAt(9))) return false
	// Valida 2o digito
	add = 0
	for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i)
	rev = 11 - (add % 11)
	if (rev == 10 || rev == 11) rev = 0
	if (rev != parseInt(cpf.charAt(10))) return false
	return true
}
onMounted(async () => {
	await getUserRealName()
	await getBankList()
})
const submitSecurityVerify = ({ type, code }: SecurityVerifyPayload) => {
	data_SetWBC.type = type
	data_SetWBC.smsCode = code
	return onconfirm()
}
</script>
<style lang="scss" scoped>
.addBankCard__container {
	padding-inline: 24px;
	padding-block: 0 30px;
	padding-top: 10px;
	font-size: 26px;

	@mixin flex {
		display: flex;
		align-items: center;
	}

	&-content {
		/**
	本页面全局样式
	*/
		input,
		textarea {
			border: none;
			width: 100%;
			padding: 10px 26px;
			background: var(--bg_color_L2);
			border-radius: 12px;
			color: var(--text_color_L1);
			min-height: 88px;
			//safari浏览器不能输入
			user-select: text;
		}

		input {
			height: 88px;
		}

		textarea {
			height: 160px;
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

		> h1 {
			font-size: 30px;
			margin: 20px 0;
			display: flex;
			align-items: center;
			gap: 10px;
			color: var(--text_color_L1);
			svg {
				width: 48px;
				height: 48px;
			}
		}

		&-top {
			padding: 0px 15px;
			border-radius: 12px;

			&-item {
				padding: 20px 0;
				position: relative;

				.label {
					@include flex;
					margin-bottom: 24px;
					font-size: 30px;
					color: var(--text_color_L1);

					.icon {
						width: 48px;
						height: 48px;
						margin-right: 12px;
					}
				}

				.accountNo {
					display: flex;
					flex-direction: row;
					align-items: center;
					border-radius: 12px;
					color: var(--text_color_L1);
					& > div:first-child {
						padding-right: 5px;
					}
				}

				:deep(.ar-searchbar__selector) {
					width: 100%;
					height: 88px;

					> div {
						line-height: 88px;
						font-size: 26px;
					}
				}
			}
		}

		&-sms {
			padding: 30px 15px;
			border-radius: 10px;
		}

		&-btn {
			margin-top: 100px;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 40px;
			text-align: center;

			> div,
			button {
				border-radius: 80px;
				min-height: 70px;
				width: 80%;
				// line-height: 70px;
			}

			> div {
				border: 1px solid var(--main-color);
				color: var(--main-color);
				display: flex;
				align-items: center;
				gap: 10px;
				justify-content: center;
				svg {
					width: 48px;
					height: 48px;
				}
			}

			> button {
				background:var(--button_dis_color);
				color: var(--text_color_L1);
				border: none;

				&.active {
					background: var(--main_gradient-color);
					color: var(--text_color_L4);
				}
			}
		}
	}

	.search {
		height: 80px;
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 20px;
	}

	:deep(.searchbar-container) {
		width: 94%;
		.searchbar-container__searchbar {
			height: 80px;
			border-radius: 60px;
			border: 1px solid var(--bg_color_L3);
			background: var(--bg_color_L1);
		}

		i {
			right: auto;
			left: 20px;
			html:lang(ar) &{
				right: 20px;
				left: auto;
			}
		}
	}
}
.input {
	width: 100%;
	height: 80px;
	background: var(--bg_color_L2);
	border-radius: 40px;
	border: none;
	margin-top: 80px;
	padding-left: 40px;
}
:deep(.ar-searchbar) {
	width: 100%;

	.ar-searchbar__selector {
		width: 100%;

		> div {
			color: var(--text_color_L2);

			> span {
				color: var(--text_color_L2);
			}
		}
	}
}
</style>
