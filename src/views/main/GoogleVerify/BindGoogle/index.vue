<template>
  <div class="gverify-container">
    <div class="gverify-container-header">
      <NavBar
        :title="$t('googleVerify')"
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
        <div class="gverify-container-content-code">
          <canvas id="qr-code"></canvas>
        </div>
        <div class="gverify-container-content-item-title">
          <img src="@icon/main/googleKey.png" alt="" />
          <span>{{ $t("safeKey") }}</span>
        </div>
        <div class="gverify-container-content-item-text">{{ keyAuth }}</div>
        <div class="gverify-container-content-item-button" @click="copy(keyAuth)">
          {{ $t("copyKey") }}
        </div>
        <div class="gverify-container-content-item-tip">
          {{ $t("tipSaveKeyProperly") }}
        </div>
      </div>
    </div>
    <div class="gverify-container-footer">
      <div class="gverify-container-content-item footer-wrapper">
        <div class="gverify-container-content-item-title">
          <img src="@icon/main/privacyIcon.png" alt="" />
          <span>{{ $t("bindStep") }}</span>
        </div>
        <div class="gverify-container-content-item-steps">
          1.{{ $t("tipDownloadGoogleVerify") }}
        </div>
        <div class="footer-wrapper-button" @click="gverifyDownload">
          <img src="@icon/main/gverifyDownload.png" alt="" />
          <span>{{ $t("downloadGoogleVerify") }}</span>
        </div>
        <div class="gverify-container-content-item-steps">
          2.{{ $t("tipCopyKeyToBind") }}
        </div>
        <div class="gverify-container-content-item-steps">
          3.{{ $t("tipAddNewAccount") }}
        </div>
        <div class="gverify-container-content-item-steps">
          4.{{ $t("tipNametheAccountPasteTheKey") }}
        </div>
        <div class="gverify-container-content-item-steps">
          5.{{ $t("tipGenerateSuccessCode") }}
        </div>
      </div>
    </div>
    <div class="gverify-container-button" @click="bind">
      <span v-if="type === 0">{{ $t("confirmBinding") }}</span>
      <span v-else> {{ $t("closeGoogle") }}</span>
    </div>
  </div>
  <!-- 验证弹窗 -->
  <VerifyPopup
    :showPopup="show"
    @onConfirm="onConfirm"
    @onBack="show = false"
  ></VerifyPopup>
</template>

<script setup lang="ts">
import VerifyPopup from "@/components/Main/VerifyPopup/index.vue";
import { copy, AwaitApiResult, partyUrl, dateRange } from "@/utils";
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { getBindGoogleVerify, getCloseGoogleVerify } from "@/api";
import { SettingStore } from "@/stores";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import QRCode from "qrcode";
const { t: $t } = useI18n();
const router = useRouter();
const route = useRoute();
const { maxDate } = dateRange(0);
const nowDate = dayjs(maxDate).startOf("day").format("YYYY-MM-DD");
const keyAuth = route.query.secret;
const lotName = computed(() => SettingStore().getProjectName);
const keyAuthQR = `otpauth://totp/${nowDate}?secret=${route.query.secret}&issuer=${lotName.value}`;
const type = Number(route.query.type); //0 绑定 1关闭

// 绑定谷歌验证码
const GoogleVerify = async (code: string, type: number) => {
  const api =
    type == 0
      ? getBindGoogleVerify({ googleCode: code })
      : getCloseGoogleVerify({ googleCode: code });
  const res = await AwaitApiResult(api);
  if (res?.code == 0) {
    router.push({
      name: "main",
    });
  }
};
const gverifyDownload = () => {
  partyUrl("https://support.google.com/accounts/answer/1066447", 1);
};
const bind = () => {
  show.value = true;
};

const show = ref(false);
const onConfirm = (e: string) => {
  GoogleVerify(e, type);
};
function qrCode() {
  QRCode.toCanvas(
    document.getElementById("qr-code"),
    keyAuthQR as string,
    (error: any) => {
      if (error) console.error(error);
    }
  );
}
onMounted(() => {
  qrCode();
});
</script>
<style lang="scss" scoped>
.gverify-container {
  padding-bottom: 40px;
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

  &-content,
  &-footer {
    padding: 0 30px;
    margin-top: 30px;
    &-code {
      display: flex;
      justify-content: center;
    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      background: var(--darkBg, var(--bg_color_L2));
      border-radius: 20px;
      padding: 20px 34px 34px;

      &-steps {
        position: relative;
        font-size: 26px;
        color: var(--text_color_L2);
        margin-top: 38px;
        padding-inline-start: 32px;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          transform: rotate(45deg);
          background: var(--main_gradient-color);
          position: absolute;
          top: 6px;
          left: 0;
        }
      }

      &-title {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-bottom: 16px;
        font-size: 30px;
        color: var(--darkTextW, var(--text_color_L1));
      }

      img {
        width: 68px;
        padding-right: 14px;
      }

      &-text {
        width: 642px;
        height: 80px;
        line-height: 80px;
        background: var(--bg_color_L1);
        border-radius: 10px;
        font-size: 22px;
        color: var(--text_color_L1);
        padding-left: 32px;
      }

      &-button {
        width: 642px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border: 1px solid var(--main-color);
        border-radius: 20px;
        font-size: 30px;
        color: var(--main-color);
        margin: 30px 0 42px;
      }

      &-tip {
        font-size: 22px;
        color: var(--norm_red-color);
      }
    }

    .footer-wrapper {
      min-height: 678px;

      div {
        width: 100%;
        display: flex;
        justify-content: flex-start;
      }

      &-button {
        align-items: center;
        justify-content: center !important;
        width: 634px;
        height: 80px;
        background: var(--main_gradient-color);
        border-radius: 80px;
        font-size: 28px;
        letter-spacing: 0.04em;
        color: var(--text_color_L4);

        margin-top: 35px;

        img {
          width: 50px;
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
</style>
