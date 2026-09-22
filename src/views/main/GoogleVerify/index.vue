<template>
  <div class="gverify-container">
    <div class="gverify-container-header">
      <NavBar
        :title="$t('googleAuthenticator')"
        class="main"
        left-arrow
        @click-left="router.go(-1)"
      />
      <div class="gverify-container-header-belly">
        <img src="@public/main/googleVerifyBg.png" alt="" />
      </div>
    </div>

    <div class="gverify-container-content">
      <div class="gverify-container-content-item">
        <div class="gverify-container-content-item-title">
          <img src="@icon/wallet/hint.png" alt="" />
          <span>{{ $t("googleIllustrate") }}</span>
        </div>
        <div class="gverify-container-content-item-tip">
          <svg-icon name="hint" />
          <span> {{ $t("googleTip1") }}</span>
        </div>
        <div class="gverify-container-content-item-tip">
          <svg-icon name="hint" />
          <span> {{ $t("googleTip2") }}</span>
        </div>
      </div>
    </div>
    <div class="gverify-container-button" @click="openGoogle">{{ $t("turnGoogle") }}</div>
  </div>
  <!-- 修改 短信&&密码验证弹窗修改 -->
 <div class="gravity-container-modal">
  <DiaLogOther
    v-model:show="show"
    @confirm="confirm"
    @cancel="getOhter"
    :showCancelBtn="otherVerify"
    :cancelText="$t('otherverificationmethods')"
    :title="verifyTitle"
  >
    <template #content>
      <div class="popup-content">
        <div class="box" v-if="isVerify === 1">
          <div class="info">
            <p class="txt">{{ $t("googleTip3") }}</p>
            <p class="txt">{{ $t("googleTip4", [hidePhoneNumber()]) }}</p>
          </div>
          <VerifyInput
            v-model:value="num"
            :isShowVerifyT="false"
            :sendFunc="sendCode"
            typeP="updatePhone"
          />
        </div>
        <div class="box" v-else-if="isVerify === 2">
          <div class="info">
            <p class="txt">{{ $t("googleTip3") }}</p>
            <p class="txt">
              {{ $t("googleTip7", [hideEmail(userInfo?.verifyMethods?.email)]) }}
            </p>
          </div>
          <VerifyInput
            v-model:value="num"
            :isShowVerifyT="false"
            :sendFunc="sendCode"
            typeP="updatePhone"
          />
        </div>
        <div class="box" v-else>
          <label class="label">
            <svg-icon name="editPswIcon" class="img" />
            {{ $t("withdrawDialogDesc2") }}
          </label>
          <input
            class="input"
            maxlength="20"
            v-model="num"
            type="password"
            :placeholder="$t('withdrawDialogPh')"
          />
          <p class="lab">
            <van-icon class="icon" name="warning-o" /><span>{{
              $t("withdrawDialogDesc3")
            }}</span>
          </p>
          <div class="other">
            <span class="pwd" @click="rpwd()">{{ $t("withdrawDialogDesc4") }}</span>
            <span class="service" @click="onservice()">{{
              $t("withdrawDialogDesc5")
            }}</span>
          </div>
        </div>
      </div>
    </template>
  </DiaLogOther>
 </div>

  <van-popup v-model:show="showOther" round position="bottom">
    <van-picker
      :columns-field-names="customFieldName"
      :columns="selectList"
      @cancel="showOther = false"
      @confirm="onClickOther"
    />
  </van-popup>
</template>

<script setup lang="ts">
import VerifyInput from "@/components/Login/VerifyInput.vue";
import DiaLogOther from "@/components/common/DiaLogOther.vue";
import { showFailToast, showSuccessToast } from "vant";
import { AwaitApiResult, hidePhoneNumber, hideEmail } from "@/utils";
import { useUserStore, GlobalStore } from "@/stores";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { GetGoogleVerify, getSmsVerCode, GetEmailVerifyCode } from "@/api";
import type { UserInfo } from "@/types/api";
import { useIsOpen } from "@/components/common/use";

import { useI18n } from "vue-i18n";
import { CodeType } from "@/hooks";
const { t: $t } = useI18n();

const router = useRouter();

const userStore = useUserStore();
const globalStore = GlobalStore();

const userInfo = globalStore.getUserInfo as UserInfo;

let verifyTitle = ref($t("pwdVerify"));
let isVerify = ref(0); // 验证方式的显示 0密码 1短信 3邮箱
let otherVerify = ref(false); // 是否有多中验证方式
const num = ref(""); //验证码
const showOther = ref(false);

// 静态变量
const selectList = ref<any[]>([]);
const customFieldName = {
  text: "name",
  value: "code",
};

// 是否开启短信验证码
const { isGoogleVerifySms, isGoogleVerifyEmail, registerState } = useIsOpen();
registerState();

const GetGoogleVerifyApi = async (verifyCode: number) => {
  const res = await AwaitApiResult(
    GetGoogleVerify({ verifyCode: num.value.toString(), verifyType: verifyCode })
  );
  console.log(res);
  if (res?.data?.secret) {
    router.push({
      name: "GoogleVerify-BindGoogle",
      query: { secret: res.data?.secret, type: 0 },
    });
  }
};

onMounted(() => {});

const show = ref(false);
const openGoogle = () => {
  num.value = "";
  userStore.setCountDown(0);
  if (userInfo.regType === 1) {
    if (isGoogleVerifySms.value) {
      isVerify.value = 1;
      otherVerify.value = true;
    } else if (userInfo.verifyMethods.email !== "" && isGoogleVerifyEmail.value) {
      isVerify.value = 2;
      otherVerify.value = true;
    } else {
      isVerify.value = 0;
    }
  } else {
    if (isGoogleVerifyEmail.value) {
      isVerify.value = 2;
      otherVerify.value = true;
    } else if (userInfo.verifyMethods.mobile !== "" && isGoogleVerifySms.value) {
      isVerify.value = 1;
      otherVerify.value = true;
    } else {
      isVerify.value = 0;
    }
  }
  verifyTitle.value = getTitle(isVerify.value);
  show.value = true;
};
//验证方式title
const getTitle = (type: number): string => {
  let tit = "";
  switch (type) {
    case 0:
      tit = $t("pwdVerify");
      break;
    case 1:
      tit = $t("SMSVerify");
      break;
    case 2:
      tit = $t("emailverification");
      break;
    default:
      tit = $t("pwdVerify");
      break;
  }
  return tit;
};

const confirm = () => {
  if (isVerify.value === 1 || isVerify.value === 2) {
    if (!num.value) return showFailToast($t("noVerifyCodeFound"));
  } else {
    if (!num.value) return showFailToast($t("pwdNull"));
  }
  let verifyCode = getVerifyCode(isVerify.value);
  GetGoogleVerifyApi(verifyCode);
};

// 获取后端验证code  1.验证手机验证码 2.验证登录密码 3.验证谷歌验证码 4.验证邮箱验证码
const getVerifyCode = (type: number) => {
  let code = 1;
  switch (type) {
    case 0:
      code = 2;
      break;
    case 1:
      code = 1;
      break;
    case 2:
      code = 4;
      break;
    default:
      code = 2;
      break;
  }
  return code;
};

// 当有两种验证方式可以切换的时候
const getOhter = () => {
  showOther.value = true;
  if (
    isGoogleVerifyEmail.value &&
    userInfo.verifyMethods.email !== "" &&
    isGoogleVerifySms.value &&
    userInfo.verifyMethods.mobile !== ""
  ) {
    selectList.value = [
      { name: $t("SMSVerify"), code: 1 },
      { name: $t("emailverification"), code: 2 },
    ];
  } else if (isGoogleVerifyEmail.value && userInfo.verifyMethods.email !== "") {
    selectList.value = [{ name: $t("emailverification"), code: 2 }];
  } else if (isGoogleVerifySms.value && userInfo.verifyMethods.mobile !== "") {
    selectList.value = [{ name: $t("SMSVerify"), code: 1 }];
  }
};

const onClickOther = ({ selectedOptions }: any) => {
  verifyTitle.value = getTitle(selectedOptions[0].code);
  isVerify.value = selectedOptions[0].code;
  showOther.value = false;
};

// 短信&&密码验证
const sendCode = async () => {
  if (isVerify.value === 1) {
    const res = await AwaitApiResult(
      getSmsVerCode({
        phone: userInfo.verifyMethods.mobile,
        codeType: CodeType.openGoogle,
      })
    );
    if (!res) {
      return -1;
    } else {
      showSuccessToast($t("sendSuccess"));
    }
  } else {
    const res = await AwaitApiResult(
      GetEmailVerifyCode({
        email: userInfo.verifyMethods.email,
        emailType: CodeType.openGoogle,
      })
    );
    if (!res) {
      //当手机号发送验证码失败时，重新启用发送验证码功能
      return -1;
    } else {
      showSuccessToast($t("sendSuccess"));
    }
  }
};

function onservice() {
  router.push({
    name: "CustomerService",
  });
}
function rpwd() {
  router.push({
    name: "rpwd",
  });
}
</script>
<style lang="scss" scoped>
.gverify-container {
  &-header {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: 370px;

    &-belly {
      img {
       width: 100%;
       height: 100%;
       object-fit: cover;
      }
    }
  }

  &-content {
    padding: 0 30px;
    margin-top: 30px;

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      // height: 420px;
      background: var(--darkBg, var(--bg_color_L2));
      border-radius: 20px;
      padding: 34px;
      &-title {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-bottom: 46px;
        font-size: 30px;
        color: var(--textBlueLight, var(--text_color_L1));
      }
      img {
        width: 68px;
        padding-right: 14px;
      }
      &-tip {
        display: flex;
        column-gap: 25px;
        font-size: 26px;
        color: var(--text_color_L2);
        position: relative;
        margin-bottom: 30px;
        line-height: 40px;
        svg {
          min-width: 30px;
          min-height: 30px;
          html:lang(ar) & {
            transform: scaleX(-1);
          }
        }
      }
    }
  }
  &-button {
    width: 642px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-radius: 70px;
    font-size: 30px;
    color: var(--text_color_L4);
    margin: 50px auto 42px;
    background: var(--main_gradient-color);
  }
  :deep(.navbar__content) {
    .navbar__content-center,
    .van-icon {
      color: var(--textW);
    }
  }
}

.popup {
  min-height: 476px;
  &-content {
    padding: 0 0 40px;
    .info {
      min-height: 180px;
      border: 1px solid var(--borderColor-30);
      padding: 20px;
      border-radius: 20px;
      margin-bottom: 50px;
      .txt {
        color: var(--text_color_L1);
        font-size: 24px;
        color: var(--text_color_L1);
        line-height: 40px;
      }
    }
    .box {
      .label {
        display: flex;
        align-items: center;
        color: var(--text_color_L1);
        font-size: 32px;
        margin-bottom: 20px;
        .img {
          width: 48px;
          height: 48px;
          display: block;
          margin-right: 10px;
        }
      }

      .input {
        height: 88px;
        line-height: 88px;
        border-radius: 20px;
        border: none;
        width: 100%;
        padding: 0 40px;
        background: var(--bg_color_L1);
        font-size: 28px;
        &::placeholder{
          color: var(--text_color_L3);
        }
      }
      .lab {
        margin-top: 20px;
        color: var(--text_color_L2);
        .icon {
          font-size: 30px;
          color: var(--norm_red-color);
          margin-inline-end: 10px;
        }
        & > span {
          color: var(--norm_red-color);
        }
      }
      .other {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        color: var(--text_color_L2);
        font-size: 28px;
        .service {
          display: inline-block;
          padding: 10px 30px;
          border: 1px solid var(--text_color_L3);
          border-radius: 10px;
          color: var(--text_color_L1);
          font-size: 24px;
        }
      }
    }
  }
}
</style>
