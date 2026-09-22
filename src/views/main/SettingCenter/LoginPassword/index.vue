<template>
  <div class="LoginP-container">
    <NavBar
      :title="$t('titleEditPsw')"
      class="white"
      left-arrow
      @click-left="router.go(-1)"
    />

    <div class="LoginP-container-form">
      <PasswordInput v-model:value="data.oldPwd" :label="$t('oldPSW')" :maxlength="32" />
      <PasswordInput v-model:value="data.newPwd" :label="$t('newPSW')" />
      <PasswordInput
        class="mgb48"
        v-model:value="data.confirmNewPwd"
        :label="$t('confirmPSW')"
      />
      <div v-show="isTips" class="LoginP-container-tips">
        <span>{{ $t("tipUnmatchPsw") }}</span>
      </div>

      <!--
				功能暂时不可用且跳转 重置密码页有bug
			-->
      <div
        v-if="userStore.isOpenForgetPasswordEmailState || userStore.isOpenForgetPasswordSMSState"
        class="LoginP-container-remember"
        @click="ResetPwd"
      >
        <span>{{ $t("forgotOldPSW") }}</span>
        <van-icon name="arrow" color="var(--text_color_L2)" />
      </div>
      <div
        class="LoginP-container-remember"
        @click="router.push({ name: 'CustomerService' })"
        v-else
      >
        <span>{{ $t("contactServicer") }}</span>
        <van-icon name="arrow" color="var(--text_color_L2)" />
      </div>

      <div class="LoginP-container-button">
        <button @click="handleBtnClick">{{ $t("saveChanges") }}</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import PasswordInput from "@/components/Login/PasswordInput.vue";
import { AwaitApiResult } from "@/utils";
import { ResetPassword } from "@/api";
import { reactive } from "vue";
import type { ResetPasswordReq } from "@/types/api";
import { ref } from "vue";
import { validate, validateText } from "@/plugins/validate";
import { showFailToast, showToast } from "vant";
import { useIsOpen } from "@/components/common/use";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores";

let data = reactive<ResetPasswordReq>({
  oldPwd: "",
  newPwd: "",
  confirmNewPwd: "",
});

const userStore = useUserStore()
// 获取是否开启短信相关功能
userStore.getRegisterState()
const { t } = useI18n();
const isTips = ref(false);
const router = useRouter();
//修改密码
async function handleBtnClick() {
  if (!validate.passReg3.test(data.newPwd)) {
    return showFailToast({
      message: t(validateText.passReg2),
      wordBreak: "break-word",
    });
  }

  if (data.newPwd !== data.confirmNewPwd) {
    isTips.value = true;
    return;
  } else {
    isTips.value = false;
  }
  const res = await AwaitApiResult(ResetPassword(data));
  if (res) {
    showToast(t("rpdsucceed"));
    await userStore.logoutLocal("/login");
  }
}

//进入重置密码页面
function ResetPwd() {
  router.push({ name: "rpwd" });
}
// 是否开启短信验证码
const { isSmSForgetPasswordState, registerState } = useIsOpen();
registerState();
</script>

<style lang="scss" scoped>
.LoginP-container {
  height: 100%;
  padding-inline: 40px;
  overflow-y: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;

  &-tips {
    margin-top: -20px;
    margin-bottom: 12px;
    padding-left: 17px;
    color: var(--main-color);
    font-size: 24px;
  }

  &-form {
    position: relative;
    margin-top: 100px;
    overflow: hidden;

    .passwordInput__container {
      margin-bottom: 52px;
    }

    .mgb48 {
      margin-bottom: 48px !important;
    }
  }

  &-remember {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    font-size: 26px;
    line-height: 26px;

    span {
      color: var(--text_color_L2);
    }
  }

  &-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 133px;

    button {
      width: 580px;
      height: 80px;
      color: var(--text_color_L4);
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 4px;
      border-radius: 80px;
      border: none;
      background: var(--main_gradient-color);
    }
  }
}
</style>
