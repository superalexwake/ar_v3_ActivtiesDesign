<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {CodeType, useBank, useCode,VerifyItem} from "@/hooks";
import {computed, onMounted, PropType, ref, watch} from "vue";
import PasswordInput from "@/components/Login/PasswordInput.vue";
import {useRouter} from "vue-router";
import {hidePhoneNumber,hideEmail} from '@/utils';
import type { SecurityVerifySubmit } from '@/hooks/useBank.hook'

const props = defineProps({
	codeType: {
		type: Number as PropType<CodeType>,
		required: true
	},
	submit: {
		type: Function as PropType<SecurityVerifySubmit>,
		required: true,
	},
  phone:{
    type: String as PropType<string>,
    default: '',
  },
  // 显示类型 auth默认验证  phone 手机验证
  showType:{
    type:String as PropType<'auth'|'phone'>,
    default: 'auth',
	  },
	});
const emit = defineEmits<{
	(e: 'close'): void
	(e: 'confirm'): void
}>()
const type = ref('')
const code = ref('')
const loading = ref(false)
const {t} = useI18n();
const router=useRouter();
const {verifyList, verifyModal, verifyActive, openVerify, onSelectVerify,userInfo,isOpenForgetPasswordSMSState} = useBank();
const {getEmailCode, isCount: email_isCount, seconds: email_seconds} = useCode({
	time:300,
	codeType:props.codeType
});
const {isCount, seconds, getSMSCode} = useCode({
	time:120,
	codeType:props.codeType
});
const isConfirm = computed(() => {
  if (!code.value) return true;
  if (verifyActive.value.value==='pwd'  ) {
    if (code.value.length>=8)return false;
    return true
  };
  if (code.value.length===6) return false;
  return true

});
const renderPhone=computed(()=>props.showType==='phone')
const renderType=computed(()=>renderPhone.value?{} as VerifyItem:verifyActive.value)
const mobile=computed(()=>props.phone||userInfo.value?.verifyMethods?.mobile)
const resetInput = () => {
	code.value = ''
}
const close = () => {
	resetInput()
	emit('close')
}
const forgetPwd=()=> {
  close();
  router.push({ name: 'rpwd' })
}
const onservice = () => {
	close()
	router.push({
		name: 'CustomerService'
	})
}
const onConfirm = async () => {
	if (loading.value || isConfirm.value) return
	try {
		loading.value = true
		const res = await props.submit({
			type: type.value,
			code: code.value,
		})
		if (res === false) return
		resetInput()
		emit('confirm')
	} finally {
		loading.value = false
	}
}
watch(verifyActive, () => {
	type.value = verifyActive.value.value
	code.value = ''
})
onMounted(() => {
  if (renderPhone.value) return;
  type.value = verifyActive.value.value;
});
</script>

<template>
  <div class="security">
    <div class="security-header">
      <span class="security-header-left"></span>
      <slot name="header">
        <h5 v-if="renderPhone">{{ t('SMSVerify') }}</h5>
        <h5 v-else>{{ verifyActive.title }}</h5>
      </slot>
      <span class="security-header-right"></span>
    </div>
    <div class="security-content">
      <div v-if="renderType.value==='mobile'||renderPhone">
        <div class="security-hit">
          <p>{{ $t('tipVerifyIdentityForFundSafety') }}</p>
          <span>{{ $t('tip6digitVeriCode', [`${hidePhoneNumber(mobile)} 6`]) }}</span>
        </div>
        <van-field
            center
						type="digit"
            :placeholder="$t('phEnterVerificationCode')"
            :maxlength="6"
            v-model="code"
        >
          <template #button>
            <van-button class="security-code" :disabled="isCount" size="small" type="primary" @click="getSMSCode(mobile)">
              {{ isCount ? `${seconds}S` : $t('send') }}
            </van-button>
          </template>
        </van-field>
      </div>
      <div v-if="renderType.value==='email'">
        <div class="security-hit">
          <p>{{ $t('tipVerifyIdentityForFundSafety') }}</p>
          <span>{{ $t('tipemaildigitVeriCode', [hideEmail(userInfo?.verifyMethods?.email||'')]) }}</span>
        </div>
        <van-field
            center
					type="digit"
            :maxlength="6"
            v-model="code"
            :placeholder="$t('phEnterVerificationCode')"
        >
          <template #button>
            <van-button class="security-code" :disabled="email_isCount" size="small" type="primary"
                        @click="getEmailCode()">{{ email_isCount ? `${email_seconds}S` : $t('send') }}
            </van-button>
          </template>
        </van-field>
      </div>
      <div v-if="renderType.value==='google'">
        <div class="security-hit">
          <p>{{ $t('openauthenticator') }}</p>
          <p>{{ $t('verificationcodegoogle') }}</p>
        </div>
        <van-field
            center
            clearable
            :maxlength="6"
            v-model="code"
            type="number"
            :placeholder="$t('PgoogleVerification')"
        >
        </van-field>
      </div>
      <div v-if="renderType.value==='pwd'">
        <PasswordInput v-model:value="code" :label="$t('withdrawDialogDesc2')" :maxlength="32" />
        <div class="security-tip">
          <p v-if="isOpenForgetPasswordSMSState" @click="forgetPwd">{{ $t('withdrawDialogDesc4') }}</p>
          <p v-else></p>
          <div  @click="onservice">{{ $t('withdrawDialogDesc5') }}</div>
        </div>
      </div>
      <div class="security-btns">
        <van-button v-if="!renderPhone" @click="openVerify" v-show="renderType.value!=='pwd'">{{ $t('otherverificationmethods') }}</van-button>
        <van-button type="primary" :disabled="isConfirm" :loading="loading" @click="onConfirm">{{ $t('confirmAdd') }}</van-button>
        <van-button v-if="renderPhone"   @click="onservice">{{ $t('contactServicer') }}</van-button>
      </div>
    </div>
    <div class="security-footer">
      <slot name="footer">
				<span @click="close">
					<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
						<path
							d="M30 57C44.9117 57 57 44.9117 57 30C57 15.0883 44.9117 3 30 3C15.0883 3 3 15.0883 3 30C3 44.9117 15.0883 57 30 57Z"
							stroke="white"
							stroke-width="4"
							stroke-linejoin="round"
						/>
						<path d="M43 17L17 43" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M17 17L43 43" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</span>
      </slot>
    </div>
    <van-popup teleport="body" v-model:show="verifyModal" :lazy-render="true" round position="bottom">
      <van-picker @cancel="verifyModal=false" @confirm="onSelectVerify" :columns="verifyList"/>
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
.security {
	width: 700px;
	height: 750px;
	background: var(--bg_color_L3);
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	overflow: initial;

	&-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32px 0 36px;

		span {
			width: 110px;
			height: 2px;
			display: inline-block;
		}

		h5 {
			font-family: 'Poppins';
			font-weight: 700;
			font-size: 38px;
			color: var(--text_color_L1);
		}

		&-left {
			background: linear-gradient(90deg, var(--main-color) -2.73%, rgba(255, 255, 255, 0) 91.36%);
			border-radius: 20px;
			transform: matrix(-1, 0, 0, 1, 0, 0);
		}

		&-right {
			background: linear-gradient(90deg, var(--main-color) -2.73%, rgba(255, 255, 255, 0) 91.36%);
			border-radius: 20px;
		}
	}

	&-content {
		width: 660px;
		height: 620px;
		background: var(--bg_color_L2);
		border-radius: 20px;
		padding: 35px 25px;
	}

	&-hit {
		border: 1px solid var(--Dividing-line_color);
		border-radius: 12px;
		height: 230px;
		margin-bottom: 30px;
		color: var(--text_color_L1);
		font-size: 28px;
		font-weight: 400;
		line-height: 36px;
		padding: 26px;

		p {
			margin: 5px 0;
		}
	}
	&-tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 100px 0;
		p {
			color: var(--text_color_L1);
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			line-height: 36px;
		}
		div {
			min-width: 195px;
			height: 50px;
			border-radius: 10px;
			border: 1px solid var(--text_color_L2);
			color: var(--text_color_L2);
			font-size: 24px;
			font-weight: 400;
			line-height: 50px;
			text-align: center;
			padding: 0 4px;
		}
	}

	&-footer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 26px;
		position: absolute;
		bottom: -130px;

		span {
			display: block;
			width: 60px;
			height: 60px;

			svg {
				width: 100%;
				height: 100%;
			}
		}
	}

	&-code {
		background: var(--main_gradient-color);
		border: none;
		width: 190px;
		height: 70px;
		border-radius: 50px;
	}

  &-btns {
    .van-button--primary {
      background: var(--main_gradient-color);
      border: none;
    }

    .van-button {
      display: block;
      width: 100%;
      height: 70px;
      border-radius: 50px;
      &:last-child{
        margin-top: 28px;
      }
    }

    .van-button--default {
      border-color: var(--main-color);
      color: var(--main-color);
	  background-color: transparent;
    }
  }

	:deep(.van-field__button) {
		display: flex;
		align-items: center;
	}
}

.van-cell{
        background:var(--bg_color_L1);
        margin-bottom: 20px;
        border-radius: 40px;
        padding:8px 10px;
    }
</style>
