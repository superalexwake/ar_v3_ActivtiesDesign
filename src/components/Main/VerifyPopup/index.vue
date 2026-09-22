<template>
  <div class="popups">
    <van-popup
      v-model:show="showPopup"
      position="center"
      round
      class="popup"
      :close-on-click-overlay="false"
    >
      <div class="popup-content">
        <div class="tit">
          {{ $t("googleVerification") }}
        </div>
        <div class="con">
          <div class="info">
            <p class="txt">{{ $t("googleTip5") }}</p>
            <p class="txt">{{ $t("googleTip6") }}</p>
          </div>
          <div class="box">
            <input
              class="input"
              type="text"
              v-model="num"
              maxlength="6"
              oninput="value=value.replace(/\D/g,'')"
              :placeholder="$t('PgoogleVerification')"
            />
            <p class="lab">
              <van-icon class="icon" name="warning-o" />{{ $t("PVerificationCode") }}
              <span @click="onservice">{{ $t("contactServicer") }}</span>
            </p>
          </div>
          <div class="popup-foot">
            <div v-throttle-click="{ handler: confirm, wait: 1000 }">
              {{ $t("confirm") }}
            </div>
            <div @click="back">{{ $t("withdrawDialogDesc6") }}</div>
          </div>
        </div>
        <img src="@public/main/close.png" class="close" @click="back" />
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import { showFailToast } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const router = useRouter();
const { t: $t } = useI18n();

const emits = defineEmits<{
  (e: "update:showPopup", val: boolean): void;
  (e: "onConfirm", item: any): void;
  (e: "onBack"): void;
}>();

const props = defineProps({
  showPopup: {
    // 是否展示弹窗
    type: Boolean,
    default: ref(false),
  },
});

const showPopup = computed({
  get(): boolean {
    return props.showPopup || false;
  },
  set(val: boolean) {
    emits("update:showPopup", val);
  },
});
const num = ref("");

// 确认
const confirm = () => {
  if (!num.value) return showFailToast($t("googleKey"));
  emits("onConfirm", num.value.toString());
};
// 返回
const back = () => {
  num.value = "";
  emits("onBack");
};

// 联系客服
function onservice() {
  router.push({
    name: "CustomerService",
  });
}
</script>

<style lang="scss" scoped>
:deep(.popup) {
  left: 0 !important;
}
.popup {
  &-content {
    padding: 0 20px 20px;
    min-height: 476px;
    position: relative;
    background: var(--bg_color_L3);
    border-radius: 20px;
    .close {
      position: absolute;
      bottom: -74px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 60px;
      height: 60px;
    }
    .tit {
      text-align: center;
      height: 100px;
      line-height: 100px;
      color: var(--text_color_L1);
      font-size: 32px;
      font-weight: 600;
      position: relative;
      &::after,
      &::before {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        width: 110px;
        height: 2px;
      }
      &::after {
        background: linear-gradient(
          90deg,
          var(--main-color) -2.73%,
          rgba(255, 255, 255, 0) 91.36%
        );
        border-radius: 20px;
        transform: matrix(-1, 0, 0, 1, 0, 0);
      }
      &::before {
        right: 0;
        background: linear-gradient(
          90deg,
          var(--main-color) -2.73%,
          rgba(255, 255, 255, 0) 91.36%
        );
        border-radius: 20px;
      }
    }
    .con {
      background: var(--darkBg, var(--bg_color_L2));
      border-radius: 20px;
      padding: 30px;
    }
    .info {
      min-height: 180px;
      padding: 20px;
      border-radius: 20px;
      margin-bottom: 20px;
      border: 1px solid var(--Dividing-line_color);
      .txt {
        color: var(--norm_red-color);
        font-size: 24px;
        line-height: 40px;
        white-space: normal;
      }
    }
    .box {
      .input {
        height: 88px;
        line-height: 88px;
        border-radius: 20px;
        border: none;
        width: 100%;
        padding: 0 40px;
        background-color: var(--bg_color_L1);
        color: var(--text_color_L1);
      }
      .lab {
        margin-top: 20px;
        color: var(--norm_red-color);
        white-space: normal;
        .icon {
          font-size: 30px;
          margin-right: 10px;
        }
      }
    }
  }
  &-foot {
    & > div {
      height: 70px;
      line-height: 70px;
      border-radius: 70px;
      margin-top: 20px;
      text-align: center;
      font-size: 34px;
      font-weight: 700;
      &:first-child {
        color: var(--text_color_L4);
        background: var(--main_gradient-color);
      }
      &:last-child {
        border: 1px solid var(--main-color);
        color: var(--main-color);
      }
    }
  }
}
</style>
