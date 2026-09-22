<template>
  <div class="bind-container">
    <NavBar :title="title" class="white" left-arrow @click-left="clickLeft" />
    <div class="email-container">
      <div v-show="showEmail">
        <EmailInput
          ref="email"
          :type="type"
          :email="parmas.email"
          @changeN="changeN"
        ></EmailInput>
      </div>
      <VerifyEmailInput
        v-model:value="smsvCode"
        :isShowVerifyT="isShowVerifyT"
        :typeP="typeP"
        :sendFunc="sendSMS"
        :email="parmas.email"
      />
      <div v-show="isShowVerify" class="updateP-container-tips">
        <span>{{ $t("tipVerifyCodeRequired") }}</span>
      </div>
      <div class="bind-button">
        <button @click="onNext" v-show="showNextB">{{ $t("nextStep") }}</button>
        <button @click="onSave" v-show="showSaveB">{{ $t("toBind") }}</button>
      </div>
    </div>
    <Dialog
      v-model:show="DialogShow"
      @confirm="onLaundy"
      :show-cancel-btn="false"
      confirmText="confirm"
	  :picname="succeedIcon"
      :title="$t('bindsuccess')"
    >
      <template #content>
        <div class="Laundry-Con" v-if="userInfo?.bindReward > 0">
          <div class="Laundry-Con_tip">
            <div class="reward">{{ $t("award") }}</div>
            <div class="money">{{ currency(userInfo?.bindReward) }}</div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
<!--绑定邮箱逻辑---判断是否有邮箱---输入邮箱，获取验证码---绑定邮箱
修改邮箱逻辑---判断是否有邮箱---邮箱获取验证码---提交修改邮箱请求-->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { showSuccessToast } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { currency, AwaitApiResult } from "@/utils";
import succeedIcon from '@icon/public/succeed.png'
import EmailInput from "@/components/Login/EmailInput.vue";
import VerifyEmailInput from "@/components/Login/VerifyEmailInput.vue";
import Dialog from "@/components/common/HomeDialog.vue";
import { GetEmailVerifyCode, bindEmail, verifyEmailCode } from "@/api";
import { useUserStore, GlobalStore } from "@/stores";
import { showFailToast } from "vant";
import { validate, validateText } from "@/plugins/validate";
import type { UserInfo } from "@/types/api";
import { CodeType } from "@/hooks";
const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const globalStore = GlobalStore();
const userInfo = globalStore.getUserInfo as UserInfo;
const type = ref("bindemail");
const isShowVerifyT = ref(true);
const isShowVerify = ref(false);
const DialogShow = ref(false);
const typeP = ref("");
typeP.value = userInfo?.verifyMethods?.email != "" ? "updateEmail" : "bindEmail";
const title = ref("");
title.value =
  userInfo?.verifyMethods?.email != "" ? t("safetyVerification") : t("bindEmail");
const parmas = {
  email: "",
};
const smsvCode = ref("");
parmas.email = userInfo?.verifyMethods?.email;
// 是否绑定邮箱
const showEmail = ref(false);
showEmail.value = userInfo?.verifyMethods?.email == "";
const showNextB = ref(true);
showNextB.value = userInfo?.verifyMethods?.email != "";
const showSaveB = ref(false);
showSaveB.value = userInfo?.verifyMethods?.email == "";

const clickLeft = () => {
  router.go(-1);
};
const changeN = (value: string) => {
  parmas.email = value;
};

const sendSMS = async () => {
  if (typeP.value == "bindEmail") {
    if (!validate.email1.test(parmas.email)) {
      userStore.setCountEmailDown(0);
      return showFailToast({
        message: t(validateText.email),
        wordBreak: "break-word",
      });
    }
  } else {
    if (!validate.email1.test(userInfo?.verifyMethods?.email)) {
      userStore.setCountEmailDown(0);
      return showFailToast({
        message: t(validateText.email),
        wordBreak: "break-word",
      });
    }
  }
  const res = await AwaitApiResult(
    GetEmailVerifyCode({
      email: parmas.email,
      emailType: showEmail.value ? CodeType.bindEmailMmobile : CodeType.resetEmailMmobile,
    })
  );

  if (res) {
    showSuccessToast(t("sendSuccess"));
  } else {
    userStore.setCountEmailDown(0);
  }
};
const onNext = async () => {
  // 邮箱验证
  if (!validate.email1.test(parmas.email)) {
    return showFailToast({
      message: t(validateText.email),
      wordBreak: "break-word",
    });
  }
  // 验证码验证
  if (!smsvCode.value.trim()) {
    return showFailToast({
      message: t("noVerifyCodeFound"),
      wordBreak: "break-word",
    });
  }
  const res = await AwaitApiResult(
    verifyEmailCode({
      email: parmas.email,
      code: smsvCode.value,
      type: CodeType.resetEmailMmobile,
    })
  );
  if (res) {
    typeP.value = "bindEmail"; //切换页面标题
    title.value = t("bindEmail");
    showNextB.value = false; //隐藏下一步按钮
    isShowVerify.value = false; //隐藏没有输入验证码的提示文本

    showEmail.value = true; //显示手机号码输入框
    isShowVerifyT.value = false; //隐藏验证码上方的标题
    showSaveB.value = true; //显示保存按钮
    smsvCode.value = ""; //第一步完成后清空验证码输入框
    parmas.email = "";
    //第一步完成后清空验证码输入框
    userStore.setCountEmailDown(0); //清空邮箱验证码计时器
  }
  isShowVerify.value = false;
};
const onSave = async () => {
  // 邮箱验证
  if (!validate.email1.test(parmas.email)) {
    return showFailToast({
      message: t(validateText.email),
      wordBreak: "break-word",
    });
  }
  // 验证码验证
  if (!smsvCode.value.trim()) {
    return showFailToast({
      message: t("noVerifyCodeFound"),
      wordBreak: "break-word",
    });
  }
  const res = await AwaitApiResult(
    bindEmail({ email: parmas.email, emailvCode: smsvCode.value })
  );
  if (res) {
    if (userInfo?.verifyMethods?.email != "") {
      showSuccessToast(t("rpdsucceed"));
      router.push({ name: "main" });
    } else {
      DialogShow.value = true;
    }
  }
};
const onLaundy = () => {
  router.push({ name: "main" });
  DialogShow.value = false;
};
onMounted(() => {
  userStore.setCountEmailDown(0); //界面初始化时清空验证码计时器
});
</script>
<style lang="scss" scoped>
.bind-container {
  width: 100%;
  .email-container {
    padding: 90px 24px 300px 24px;
  }
  .bind-button {
    margin-top: 577px;
    button {
      width: 674px;
      height: 80px;
      background: var(--main_gradient-color);
      font-size: 30px;
      font-weight: 700;
      color: var(--text_color_L4);
      border-radius: 80px;
      border: none;
    }
  }
}
.Laundry-Con_tip {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .reward {
    color: var(--text_color_L2);
    font-size: 30px;
  }
  .money {
    color: var(--main-color);
    font-size: 30px;
  }
}
</style>
