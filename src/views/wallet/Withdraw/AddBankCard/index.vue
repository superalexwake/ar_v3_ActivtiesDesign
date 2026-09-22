<template>
  <div class="addBankCard__container">
    <NavBar :title="titleName" left-arrow @click-left="onBack" />
    <div v-if="step == 0" class="addBankCard__container-content">
      <div class="addBankCard__container-content-top">
        <img src="@icon/wallet/hint.png" />
        <span>{{ $t("tipBindUrOwnCardToEnsureFundSafety") }}</span>
      </div>
      <div class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="bank"></svg-icon>
          {{ $t("selectBank") }}
        </div>
        <div class="selectB" @click="onClickSelectN">
          {{ bankName }} <van-icon name="arrow" />
        </div>
      </div>
      <!--验证收款人姓名-->
      <div class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="name"></svg-icon>
          {{ $t("payeeName") }}
        </div>
        <input
          :placeholder="$t('phEnterPayeeName')"
          v-model.trim="data_SetWBC.beneficiaryname"
          maxlength="50"
          @input="makeTxt(data_SetWBC, 'beneficiaryname')"
          :readonly="iseditor"
        />
        <span v-if="showtips" class="red">{{ $t("validateDesc21") }}</span>
        <p v-if="showtips" class="red">{{ $t("example") }} : DINH THI HUYEN</p>
        <p v-if="!iseditor" class="first-bind-tip">✓ {{ $t("firstBindNameLockTip") }}</p>
      </div>

      <div class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="bankCard"></svg-icon>
          {{ $t("bankcardNo") }}
        </div>

        <input
          :placeholder="$t('phEnterBankcardNo')"
          v-model.trim="data_SetWBC.accountno"
          maxlength="25"
          @input="accountNoInput"
        />
      </div>
      <div class="addBankCard__container-content-item">
        <div class="label phone_icon">
          <svg-icon name="phone"></svg-icon>
          {{ $t("tel") }}
        </div>

        <input
          :placeholder="$t('phEnterPayeeTel')"
          v-model.trim="data_SetWBC.mobileno"
          maxlength="12"
          @input="onInput(data_SetWBC, 'mobileno')"
        />
      </div>
      <div v-if="isOpenAddBankCardOpenEmail" class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="email"></svg-icon>
          {{ $t("email") }}
        </div>
        <input
          type="text"
          :placeholder="$t('inputemail')"
          v-model.trim="data_SetWBC.email"
          maxlength="250"
        />
      </div>
      <div v-if="isINR" class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="ifscCode"></svg-icon>
          {{ $t("IFSCCode") }}
        </div>

        <input
          :placeholder="$t('phEnter') + $t('IFSCCode')"
          v-model.trim="data_SetWBC.ifsccode"
          @blur="makeTxtIfscCode"
          @input="ifscInput"
          maxlength="11"
        />
      </div>
      <div v-if="isBDT" class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="address"></svg-icon>
          Routing Number
        </div>

        <input
          :placeholder="$t('phEnter') + ' Routing Number'"
          v-model.trim="data_SetWBC.ifsccode"
        />
      </div>
      <div v-if="!isINR && !isBDT" class="addBankCard__container-content-item">
        <div class="label">
          <svg-icon name="address"></svg-icon>
          {{ $t("branchBankAddr") }}
        </div>

        <textarea
          class="textarea"
          name="remark"
          id=""
          cols="30"
          rows="10"
          :placeholder="$t('phEnterBranchAddr')"
          v-model.trim="data_SetWBC.bankbranchaddress"
          maxlength="100"
        ></textarea>
      </div>
      <div class="addBankCard__container-content-btn">
        <button :class="{ active: isActive }" @click="onShowSms">{{ $t("save") }}</button>
      </div>
    </div>
    <div v-else>
      <!--选择银行卡-->
      <ChooseBank :bankList="originalBankList" @onSelectItem="onSelectItem"/>
    </div>
  </div>
  <BankView v-model="dialog" :list="list" @changeBank="onChangeBank" />
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, maxlength, trimFields } from '@/utils'
import type { ReqWithdrawalBankCard } from '@/types/api'
import { SetWithdrawalBankCard } from '@/api'
import { useCommonStore, useUserStore, SettingStore } from '@/stores'
import { showFailToast, showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'
import ChooseBank from '@/views/wallet/Withdraw/ChooseBank/index.vue'
import { useBank, CodeType, useWithdraw, type SecurityVerifyPayload } from '@/hooks'
import { validate, validateText } from '@/plugins/validate'
// import { getBankInfoByIFSC } from './blank'
import { GetBankList } from '@/api'
import type { ResBankList } from '@/types/api'
import BankView from './banks.vue'

interface BankInfo {
  name: string;
  code: number;
}
const dialog = ref(false)
const { t } = useI18n()
const step = ref(0)
const { setLoading } = useCommonStore()
const userStore = useUserStore()
const router = useRouter()
const { isOpenWithdraw, isOpenAddBankCardOpenEmail, openSecurityVerifyDialog } = useBank()
const fromV = (router.currentRoute.value.query.fromV as string) || 'Withdraw-BankCard'
const bankN = ref()
const list = ref<BankInfo[]>([])
const {iseditor,onInput,setUL,onLoad,makeTxt}= useWithdraw()

//银行名称
const bankName = computed(() => {
	if (bankN.value) {
		return bankN.value
	} else {
		return t('addCardMsg1')
	}
})

//选择银行卡
function onSelectItem(item: any) {
	data_SetWBC.bankid = item.bankID
	bankN.value = item.bankName
	step.value = 0
}

//页面名称
const titleName = computed(() => {
	if (step.value == 0) {
		return t('titleAddBankCard')
	} else {
		return t('selectBank')
	}
})

const showtips = ref(false)
const isINR = ref(false) //判断是不是印度币种
const isBDT = ref(false) //判断是不是孟加拉国货币
//判断如果是越南币就展示提示信息
let originalBankList = reactive<ResBankList[]>([])

const settingS = SettingStore()
const dollarSign = computed(() => settingS.getDollarSign)
if (dollarSign.value) {
	showtips.value = ['₫','K'].includes(dollarSign.value)
	isINR.value = dollarSign.value == '₹'
	isBDT.value = dollarSign.value == '৳'
}

function onBack() {
	if (step.value > 0) {
		return (step.value = 0)
	}
	router.replace({
		name: fromV,
		query: { type: 'Add' }
	})
}
const data_SetWBC = reactive<ReqWithdrawalBankCard>({
	smsCode: '',
	ifsccode: '',
	bankid: 0,
	beneficiaryname: '',
	accountno: '',
	email: '',
	mobileno: '',
	bankcitycode: '',
	bankprovincecode: '',
	bankbranchaddress: '',
	type: '',
	codeType: CodeType.addBankCard
})
onMounted(() => {
  getBankListApi()
})
// 选择银行
async function getBankListApi() {
	const res = await AwaitApiResult(
		GetBankList({
			withdrawid: 1
		})
	)
  if (res) {
    originalBankList = res.data.banklist
    // 防止接口慢检测如果当前输入框存在数据则手动触发匹配
    if (data_SetWBC.ifsccode && data_SetWBC.ifsccode.length >= 4) {
      makeTxtIfscCode()
    }
  }
}

const submitSecurityVerify = ({ type, code }: SecurityVerifyPayload) => {
	data_SetWBC.type = type
	data_SetWBC.smsCode = code
	return onconfirm()
}


// 判断是否有填写表单
const isActive = computed(() => {
	if (
		data_SetWBC.beneficiaryname.trim().length == 0 ||
		data_SetWBC.accountno.trim().length == 0 ||
		data_SetWBC.mobileno.trim().length == 0 ||
		(!isINR.value == true && !isBDT.value == true && data_SetWBC.bankbranchaddress.trim().length == 0) ||
		data_SetWBC.bankid == 0 ||
		(isINR.value == true && data_SetWBC.ifsccode.trim().length == 0) ||
		(isBDT.value == true && data_SetWBC.ifsccode.trim().length == 0)
	) {
		return false
	} else {
		return true
	}
})
const cheackValue = () => {
	const numberType = localStorage.getItem('numberType') || userStore.userForm.numberType
	if (!isActive.value) return false
	if (data_SetWBC.bankid == 0) {
		return showFailToast({
			message: t('addCardMsg1'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.beneficiaryname.toString().trim().length == 0) {
		return showFailToast({
			message: t('addCardMsg2'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.accountno.toString().trim().length == 0) {
		return showFailToast({
			message: t('addCardMsg3'),
			wordBreak: 'break-word'
		})
	}else{
		//巴西特殊处理，一定要包含-
		let regex:any;
		if (dollarSign.value == 'R$') {
			regex = /^[0-9\-]{6,25}$/;
			if(data_SetWBC.accountno.indexOf('-')==-1){
				return showFailToast({
					message: t('code212'),
					wordBreak: 'break-word'
				})
			}
		}else{
			regex = /^[0-9]{6,25}$/;
		}
		if (!regex.test(data_SetWBC.accountno)) {
			return showFailToast({
				message: t('code212'),
				wordBreak: 'break-word'
			})
		}
	}
	if (bankName.value.toUpperCase() == 'STATE BANK OF INDIA'){
		if(data_SetWBC.accountno.toString().trim().charAt(0)=='0'){
			return showFailToast({
				message: t('addBC1',[bankName.value]),
				wordBreak: 'break-word'
			})
		}
	}
	if (data_SetWBC.mobileno.toString().trim().length == 0) {
		return showFailToast({
			message: t('addCardMsg4'),
			wordBreak: 'break-word'
		})
	}
	if (!maxlength(numberType, data_SetWBC.mobileno.trim().length)) {
		return showFailToast({
			message: t('wrongTel'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.bankbranchaddress.toString().trim().length == 0 && !isINR.value == true && !isBDT.value == true) {
		return showFailToast({
			message: t('addCardMsg5'),
			wordBreak: 'break-word'
		})
	}
	if (isOpenAddBankCardOpenEmail.value && data_SetWBC.email.toString().trim().length == 0) {
		return showFailToast({
			message: t('addCardMsg6'),
			wordBreak: 'break-word'
		})
	}
	if (isINR.value == true) {
		if(data_SetWBC.ifsccode.trim().length == 0){
			return showFailToast({
				message: t('phEnter') + t('IFSCCode'),
				wordBreak: 'break-word'
			})
		}else{
			let regex=/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/;
			if (!regex.test(data_SetWBC.ifsccode)) {
				return showFailToast({
					message: t('IFSCCode') + t('formatErr'),
					wordBreak: 'break-word'
				})
			}
		}
	}
	if (isOpenAddBankCardOpenEmail.value && !validate.email1.test(data_SetWBC.email)) {
		return showFailToast({
			message: t(validateText.email),
			wordBreak: 'break-word'
		})
	}
	if (isBDT.value == true && data_SetWBC.ifsccode.trim().length == 0) {
		return showFailToast({
			message: t('phEnter') + ' Routing Number',
			wordBreak: 'break-word'
		})
	}
	return true
}
async function onShowSms() {
	//判断是否开启需要验证码
	data_SetWBC.smsCode = ''

	if (cheackValue() !== true) return
	if (isOpenWithdraw.value) {
		return openSecurityVerifyDialog({
			codeType: CodeType.addBankCard,
			submit: submitSecurityVerify,
		})
	}
	await onconfirm()
}
async function onconfirm() {
	const numberType = localStorage.getItem('numberType') || userStore.userForm.numberType
	setLoading(true)
	try {
		const res = await AwaitApiResult(
			SetWithdrawalBankCard(trimFields(Object.assign({}, data_SetWBC, { mobileno: numberType + data_SetWBC.mobileno })))
		)
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


function accountNoInput(){
	if (dollarSign.value == 'R$') {
		data_SetWBC.accountno = data_SetWBC.accountno.replace(/[^\d\-]+/g,'');
	}else{
		data_SetWBC.accountno = data_SetWBC.accountno.replace(/[^\d]+/g,'');
	}
}

// 通过ifsc的前四位获取银行信息
function getBankInfoByIFSC(ifsc: string) {
  const bankCode = ifsc.substring(0, 4).toUpperCase();
  // return originalBankList.reduce((total, bank) => {
  //   if (bank.ifscCode.toUpperCase() === bankCode) {
  //     return {
  //       name: bank.bankName,
  //       code: bank.bankID
  //     }
  //   }
  //   return total;
  // }, { name: '', code: 0 } as BankInfo);
  return originalBankList.filter(item => {
    if (item.ifscCode.toUpperCase() === bankCode) {
      return true
    }
    return false
  }).map(item => ({
    name: item.bankName,
    code: item.bankID
  }))
}
const ifscInput = () => {
  data_SetWBC.ifsccode = data_SetWBC.ifsccode.replace(/[^a-zA-Z0-9]/g, '')
  setUL(data_SetWBC,'ifsccode')
}
//ifsccode:大写字母加数字
const makeTxtIfscCode = () => {
  const bankInfo = getBankInfoByIFSC(data_SetWBC.ifsccode.substring(0,4));

  if (bankInfo.length > 1 && data_SetWBC.ifsccode.length >= 4) {
    list.value = bankInfo
    return dialog.value = true
  }
  const bank = bankInfo[0] || { name: '', code: 0 }
  if (bank && bank.code && data_SetWBC.ifsccode) {
    bankN.value = bank.name;
    data_SetWBC.bankid = bank.code;
  } else {
    bankN.value = t('addCardMsg1');
    data_SetWBC.bankid = 0;
  }
	setUL(data_SetWBC,'ifsccode')
}

const onChangeBank = (bank: BankInfo) => {
  bankN.value = bank.name;
  data_SetWBC.bankid = bank.code;
}

const chooseBankCanClick = computed(() => {
  const bankInfo = getBankInfoByIFSC(data_SetWBC.ifsccode);
  if( isINR.value && bankInfo.code != 0 && data_SetWBC.ifsccode) return false
  return true
})

//状态下拉框点击事件
function onClickSelectN() {
  // if( !chooseBankCanClick.value ) return
	step.value = 2
}
onLoad(data_SetWBC,'beneficiaryname')
</script>
<style lang="scss" scoped>
@import "@/assets/styles/extend";

.addBankCard__container {
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
    /**
	本页面全局样式
	*/
    div,
    span {
      font-family: $font-family;
      font-size: 24px;
      color: var(--text_color_L2);
    }

    input,
    textarea {
      border: none;
      width: 100%;
      padding: 10px 26px;
      background: var(--bg_color_L2);
      border-radius: 10px;
      color: var(--text_color_L1);
      font-size: 28px;
      //safari浏览器不能输入
      user-select: text;

      &::placeholder {
        color: var(--text_color_L3);
      }
    }

    input {
      height: 80px;
      color: var(--text_color_L1);
    }

    textarea {
      height: 160px;
    }

    &-top {
      @include flex;
      height: 74px;
      background-color: var(--bgDark-2, var(--bg_color_L2));
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
        color: var(--darkTextW, var(--text_color_L1));
        &.phone_icon > .svg-icon{
          color: var(--main-color);
        }
        .svg-icon {
          width: 48px;
          height: 48px;
          margin-right: 12px;
        }
      }

      .selectB {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28px;
        color: var(--text_color_L4);
        background: var(--main_gradient-color);
        height: 70px;
        border-radius: 10px;
        padding: 0 20px;
        &.no-click {
          background: var(--button_dis_color) !important;
        }
      }

      .first-bind-tip {
        margin: 16px 0 0;
        color: var(--main-color);
        font-size: 22px;
        line-height: 1.4;
      }
    }

    &-btn {
      margin-top: 150px;

      button {
        @include button(
          $background: var(--button_dis_color),
        );

        &.active {
          background: var(--main_gradient-color);
          text-shadow: none;
        }
      }
    }
  }

  .search {
    //z-index: 100;
    height: 80px;
    display: flex;
    justify-content: center;
    //position: fixed;
    //top: 100px;
    //left: 0;
    width: 100%;
    margin-top: 20px;
  }

  :deep(.searchbar-container) {
    width: 94%;

    .searchbar-container__searchbar {
      height: 80px;
      border-radius: 10px;
      border: 1px solid #e6e8e8;
    }

    i {
      right: auto;
      left: 20px;
      html:lang(ar) & {
        right: 20px;
        left: auto;
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
        font-family: "Poppins";
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
      background: var(--bg_color_L1);
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

    & > div {
      background: linear-gradient(180deg, #ff7172 0%, #ff8d83 100%);
      border-radius: 10px;
      color: var(--textW);

      & > span {
        color: var(--textW);
      }
    }
  }
}

.red {
  color: var(--norm_red-color) !important;
}
</style>
