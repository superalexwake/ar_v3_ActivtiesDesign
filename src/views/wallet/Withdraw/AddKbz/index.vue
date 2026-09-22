<template>
  <div class="addKBZ">
    <NavBar :title="`${$t('addto')} KBZPay`" left-arrow @click-left="onBack" />
    <div class="addKBZ-top">
      <img src="@icon/wallet/hint.png" />
      <span>{{ $t("WaveTip1") }}</span>
    </div>
    <div class="addKBZ-item">
      <div class="label">
         <svg-icon name = "bank" />
        {{ $t("bankname") }}
      </div>
      <div class="selectB">{{ bankname }}</div>
    </div>
    <div class="addKBZ-item">
      <div class="label">
      <svg-icon name = "name" />
        {{ $t("name") }}
      </div>

      <input
        :placeholder="$t('phEnterName')"
        v-model.trim="data_SetWBC.beneficiaryName"
        maxlength="50"
        @input="makeTxt(data_SetWBC, 'beneficiaryName')"
        :readonly="iseditor"
      />
    </div>
    <div class="addKBZ-item">
      <div class="label">
        <svg-icon name = "phone" />
        {{ $t("tel") }}
      </div>
      <input
        :placeholder="$t('phEnterPayeeTel')"
        v-model.trim="data_SetWBC.mobileNo"
        :maxlength="12"
        @input="onInput(data_SetWBC, 'mobileNo')"
      />
    </div>
    <div class="addKBZ-btn" :class="{ active: isActive }" @click="onShowSms">
      {{ $t("save") }}
    </div>
  </div>
</template>

<script setup lang="tsx">
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult, maxlength, trimFields } from '@/utils'
import type { ResBankList } from '@/types/api'
import { GetBankList, SetWithdrawalWallet } from '@/api'
import { useCommonStore } from '@/stores'
import { showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { CodeType, useBank, useWithdraw, type SecurityVerifyPayload } from '@/hooks'

const {iseditor,onInput,checkAccoutNo,onLoad,makeTxt}= useWithdraw()
const { t } = useI18n()
const router = useRouter()
const { setLoading } = useCommonStore()
let originalBankList = reactive<ResBankList[]>([]) //银行列表
const bankname = ref('')
const { isOpenWithdraw, openSecurityVerifyDialog } = useBank()
const data_SetWBC = reactive<any>({
	smsCode: '',
	withdrawId: 8,
	bankId: 0,
	mobileNo: '',
	beneficiaryName: '',
	type: '',
	codeType: CodeType.addKBZ
})

//保存按钮状态
const isActive = computed(() => {
	if (data_SetWBC.mobileNo.trim().length == 0 || data_SetWBC.bankId == 0 || data_SetWBC.beneficiaryName.trim().length == 0) {
		return false
	} else {
		return true
	}
})
//获取银行列表
async function getBankList() {
	const res = await AwaitApiResult(
		GetBankList({
			withdrawid: 8
		})
	)
	if (res) {
		originalBankList = res.data.banklist
		bankname.value = originalBankList.length > 0 ? originalBankList[0].bankName : ''
		data_SetWBC.bankId = originalBankList.length > 0 ? originalBankList[0].bankID : 0
	}
}
onMounted(async () => {
	await getBankList()
})
const checkValue =  () => {
	if (!isActive.value) return false
	if (!localStorage.getItem('numberType')) return false
	if (data_SetWBC.bankId == 0) {
		return showFailToast({
			message: t('addCardMsg1'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.beneficiaryName.toString().trim().length == 0) {
		return showFailToast({
			message: t('phEnterName'),
			wordBreak: 'break-word'
		})
	}
	if (data_SetWBC.mobileNo.toString().trim().length == 0) {
		return showFailToast({
			message: t('addCardMsg4'),
			wordBreak: 'break-word'
		})
	}else{
		let isCheck =  checkAccoutNo(data_SetWBC.mobileNo,t('tel') + t('formatErr'))
		if(!isCheck) return
	}
	if (!maxlength(localStorage.getItem('numberType') as string, data_SetWBC.mobileNo.trim().length)) {
		return showFailToast({
			message: t('wrongTel'),
			wordBreak: 'break-word'
		})
	}
	return true
}
const submitSecurityVerify = ({ type, code }: SecurityVerifyPayload) => {
	data_SetWBC.type = type
	data_SetWBC.smsCode = code
	return onconfirm()
}
async function onShowSms() {
	if (checkValue() !== true) return
	//判断是否开启需要验证码
	data_SetWBC.smsCode = ''
	if (isOpenWithdraw.value) {
		return openSecurityVerifyDialog({
			codeType: CodeType.addKBZ,
			submit: submitSecurityVerify,
		})
	}
	await onconfirm()
}

//添加wave
async function onconfirm() {
	setLoading(true)
	try {
		const res = await AwaitApiResult(SetWithdrawalWallet(trimFields({ ...data_SetWBC })))
		if (!res) return false
		router.replace({
			name: 'Withdraw',
			query: { type: 'Add' },
			replace: true
		})
		return true
	} finally {
		setLoading(false)
	}
}

function onBack() {
	router.replace({
		name: 'Withdraw',
		query: { type: 'Add' }
	})
}

onLoad(data_SetWBC,'beneficiaryName')
</script>

<style scoped lang="scss">
@mixin flex {
  display: flex;
  align-items: center;
}

.addKBZ {
  padding: 10px 24px 30px;

  &-top {
    display: flex;
    background: var(--bg_color_L2);
    border-radius: 60px;
    padding: 15px 40px;

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

  &-item {
    margin: 70px 0;

    .label {
      @include flex;
      margin-bottom: 24px;
      color: var(--text_color_L1);

      .svg-icon {
        width: 48px;
        height: 48px;
        margin-right: 12px;
        color: var(--main-color);
      }
    }

    .selectB {
      font-size: 28px;
      color: var(--text_color_L4);
      background: var(--main_gradient-color);
      height: 80px;
      line-height: 80px;
      border-radius: 10px;
      padding: 0 20px;
    }
  }

  &-btn {
    margin-top: 150px;
    background: var(--main_gradient-color);
    height: 70px;
    line-height: 70px;
    font-size: 30px;
    color: var(--text_color_L4);
    border-radius: 80px;
    text-align: center;

    &.active {
      background: var(--main_gradient-color);
      text-shadow: none;
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
}

div,
span {
  font-family: $font-family;
  font-weight: 500;
  font-size: 32px;
  color: var(--text_color_L1);
}

input {
  border: none;
  width: 100%;
  padding: 10px 26px;
  background: var(--bg_color_L2);
  border-radius: 10px;
  color: var(--text_color_L2);
  font-size: 28px;
  //safari浏览器不能输入
  user-select: text;

  &::placeholder {
    color: var(--text_color_L3);
  }
}

input {
  height: 80px;
}
</style>
