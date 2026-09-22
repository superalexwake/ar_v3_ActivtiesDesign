<template>
	<div class="addupi_C-header wallet_18">{{ $t('UPIInformation') }}</div>
	<div class="addupi_C-title">UPI Name</div>
	<van-field
		class="upi-input"
		v-model="UPIForm.beneficiaryName"
		:maxlength="30"
		:placeholder="$t('phEnterUPIName')"
		:rules="[{ required: true, message: $t('phEnterUPIName') }]"
	/>
	<div class="addupi_C-title">UPI ID</div>
	<van-field class="upi-input" v-model="UPIForm.accountNo" :maxlength="30" type="text" :placeholder="$t('phEnterUPIID')" />
	<div class="sumbitBtn" @click="onSubmit" :class="{ disable: !canSumbit }">{{ $t('save') }}</div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores'
import { showFailToast } from 'vant'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const emits = defineEmits<{
	(e: 'submitupi', val: any): void
	(e: 'setStep', val: any): void
	(e: 'bindSumbit', val: any): void
}>()
const { t } = useI18n()
const userStore = useUserStore()
const UPIForm = ref<any>({
	beneficiaryName: '',
	accountNo: '',
	smsCode: '',
	type: ''
})
const canSumbit = computed(() => {
	return UPIForm.value.beneficiaryName && UPIForm.value.accountNo
})
const numberType = localStorage.getItem('numberType') || ''
const number = localStorage.getItem('number') || ''

const onSubmit = () => {
	if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(UPIForm.value.accountNo)) {
		return showFailToast(t('UPIID'))
	}
	emits('submitupi', Object.assign({}, UPIForm.value))
}
</script>
<style lang="scss" scoped>
.addupi_C {
	&-form {
		max-height: calc(100% - 70px);
		overflow: auto;
	}

	&-header {
		height: 42px;
		line-height: 42px;
		font-weight: 700;
		font-size: 36px;
		color: var(--text_color_L1);
		padding-left: 122px;
		background-size: 100px 42px;
		background-repeat: no-repeat;
		background-position: left center;
	}

	&-title {
		height: 40px;
		line-height: 40px;
		margin: 50px 0 24px 0;
		font-weight: 500;
		font-size: 32px;
		color: var(--text_color_L1);
	}

	&-Safety {
		height: 48px;
		line-height: 48px;
		font-weight: 600;
		font-size: 36px;
		color: var(--text_color_L1);
		margin-top: 124px;
		padding-left: 65px;
		background-image: url('@/assets/icons/wallet/withdraw/c2c/safety.png');
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
}

.upi-input {
	height: 70px;
	padding: 0 20px;
	font-size: 28px;
	color: var(--text_color_L2);
	width: 100%;
	

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

.sumbitBtn {
	height: 70px;
	line-height: 70px;
	width: 100%;
	color: var(--text_color_L4);
	font-weight: 700;
	font-size: 30px;
	text-align: center;
	background: var(--main-color);
	max-width: 750px;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);

	&.disable {
		background: var(--button_dis_color);
		pointer-events: none;
	}
}

:deep(.verifyInput__container-label) {
	display: none !important;
}
.servicerBtn {
	height: 70px;
	line-height: 70px;
	border: 1px solid var(--main-color);
	width: 660px;
	margin: auto;
	border-radius: 35px;
	text-align: center;
	font-size: 30px;
	color: var(--main-color);
}
.errorTip {
	color: var(--norm_red-color);
	font-size: 22px;
	margin-bottom: 60px;
	:deep(i) {
		font-size: 24px;
	}
}
</style>
