<template>
	<Dialog
		class="newDialog"
		v-model:show="isVisible"
		:isShowHeader="false"
		:title="$t('bindPhone')"
		:showCancelBtn="true"
		:show-footer="true"
	>
		<template #content>
			<PhoneInput
				v-model:show-validate="showPhoneValidate"
				:typeP="'bindPhone'"
				:number="param.PhoneNumber"
				:number-type="param.numberType"
				@changeT="changeT"
				@changeN="changeN"
			/>
			<VerifyInput
				:isTip="false"
				v-model:value="param.smsCode"
				:typeP="'bindPhone'"
				:isShowVerifyT="isShowVerifyT"
				:sendFunc="sendCode"
				:number="param.PhoneNumber"
				:numberType="param.numberType"
			/>
		</template>
		<template #footer>
			<div class="footer">
				<button @click="confirm" class="sure">{{ $t('confirm') }}</button>
				<button @click="cancel" class="cancel">{{ $t('cancel') }}</button>
			</div>
		</template>
	</Dialog>
</template>
<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import { CodeType } from "@/hooks";
import {AwaitApiResult} from "@/utils";
import { getSmsVerCode } from "@/api";
import Dialog from "@/components/common/Dialog.vue";
import PhoneInput from "@/components/Login/PhoneInput.vue";
import VerifyInput from "@/components/Login/VerifyInput.vue";
import { showSuccessToast} from "vant";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/stores";
const {t} = useI18n()
const isShowVerifyT = ref(true)
const showPhoneValidate = ref(false)
const userStore = useUserStore()

const emits = defineEmits<{
	(e: "update:isVisible", val: boolean): void;
	(e: "onConfirm", item: any): void;
	(e: "onCancel"): void;
}>()

const props=defineProps({
	isVisible: {
		// 是否展示弹窗
		type: Boolean,
		default: ref(false),
	}
})
const isVisible=computed({
	get(): boolean {
		return props.isVisible || false;
	},
	set(val: boolean) {
		emits("update:isVisible", val);
	},
})

const param = reactive({
	PhoneNumber: '',
	numberType: localStorage.getItem('numberType') as string,
	smsCode:''
})
/*区号获取*/
const changeT = (value: string) => {
	param.numberType = value
}
/*手机号获取*/
const changeN = (value: string) => {
	param.PhoneNumber = value
}

/*确认绑定接口*/
const confirm = ()=>{
	const query={phone:param.numberType+param.PhoneNumber,smsvCode:param.smsCode};
	emits("onConfirm", query);
	userStore.setCountDown(0) //界面初始化时清空验证码计时器
};

/*取消按钮*/
const cancel=()=>{
	param.PhoneNumber='';
	param.smsCode='';
	userStore.setCountDown(0) //界面初始化时清空验证码计时器
	emits("onCancel");
}

// 短信验证码
const sendCode = async () => {
	// console.log(param.PhoneNumber.length)
	const res = await AwaitApiResult(
		getSmsVerCode({
			phone: param.numberType+param.PhoneNumber,
			codeType: CodeType.bindEmailMmobile,
		})
	);
	if(res){
		return  showSuccessToast(t("sendSuccess"));
	}else {
		return -1
	}
}

onMounted(() => {
	userStore.setCountDown(0) //界面初始化时清空验证码计时器
})
</script>
<style lang="scss" scoped>
.newDialog{
	:deep(.dialog__container){
		background: var(--bg_color_L1);
	}
	:deep(.dropdown__list){
		width: 550px;
	}
	:deep(.dialog__container-footer){
		margin: 0;
	}
	.footer{
		display: flex;
		flex-direction: column;
		gap:10px;
		button{
			width: 100%;
			border-radius: 30px;
			border: none;
			padding: 15px 0;
			color:var(--text_color_L4);
			background: var(--main-color);
			&:last-of-type{
				background:var(--bg_color_L4);
				box-shadow:none;
				text-shadow:none;
				color:var(--main-color);
				border:1px solid var(--main-color);
			}
		}
	}
}

</style>