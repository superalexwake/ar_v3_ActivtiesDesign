<template>
  <div class="info-dialog">
    <van-dialog
      v-model:show="showNew"
      @cancel="
        () => {
          emits('cancel');
        }
      "
      @confirm="
        () => {
          emits('confirm');
        }
      "
      :cancel-button-text="cancelText || t('cancel')"
      :confirm-button-text="confirmText || t('confirm')"
      :show-cancel-button="showCancelBtn"
      :before-close="onBeforeClose"
    >
      <div>
        <div class="info-dialog-header">
          <span class="info-dialog-header-left"></span>
          <slot name="header">
            <h5>{{ title }}</h5>
          </slot>
          <span class="info-dialog-header-right"></span>
        </div>
        <div class="info-dialog-content">
          <slot name="content">
            <div>{{ $t("contentsHere") }}</div>
          </slot>
        </div>
        <div class="info-dialog-footer">
          <slot name="footer">
            <img
              src="@public/main/close.png"
              @click="
                () => {
                  emits('update:show', false);
                }
              "
            />
          </slot>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  show: {
    //是否展示弹窗
    type: Boolean,
    default: false,
  },
  title: {
    //标题
    type: String,
    default: "",
  },
  confirmText: {
    //确认按钮文本
    type: String,
    default: "",
  },
  showCancelBtn: {
    //是否显示取消按钮,默认不显示
    type: Boolean,
    default: false,
  },
  cancelText: {
    //取消按钮文本
    type: String,
    default: "",
  },
});

const emits = defineEmits<{
  (e: "update:show", val: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "beforeClose"): void;
}>();

const showNew = computed({
  get(): boolean {
    return props.show || false;
  },
  set(val: boolean) {
    emits("update:show", val);
  },
});
const beforeClose = (action: any) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (action === "confirm") {
        resolve(true);
      } else {
        // 拦截取消操作
        resolve(false);
      }
    }, 1000);
  });

function onBeforeClose() {
  beforeClose;
}
</script>

<style lang="scss" scoped>
.info-dialog {
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
      font-family: "Poppins";
      font-weight: 700;
      font-size: 38px;
      color: #fff;
    }

    &-left {
      background: linear-gradient(90deg, #fff -2.73%, rgba(230, 235, 240, 0.00) 91.36%);
      border-radius: 20px;
      transform: matrix(-1, 0, 0, 1, 0, 0);
    }

    &-right {
      background: linear-gradient(90deg, #fff -2.73%, rgba(230, 235, 240, 0.00) 91.36%);
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

  &-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 26px;
    position: absolute;
    bottom: -130px;
    img {
      width: 50px;
    }
  }

  :deep() .van-dialog {
    width: 700px;
    height: 750px;
    background: var(--pop_bg-color,var(--bg_color_L3));
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: initial;

    &__content {
      position: relative;
    }

    &__footer {
      z-index: 100;
      position: fixed;
      bottom: 36px;
      display: flex;
      flex-grow: 1;
      gap: 20px;
      width: 90%;
      flex-direction: column;
    }
    .van-dialog__cancel {
      width: 100%;
      height: 70px;
      text-align: center;
      line-height: 70px;
      background: var(--bg_color_L2);
      color: var(--main-color);
      border: 1px solid var(--main-color);
      border-radius: 40px;
      z-index: 100;
      font-weight: 600;
      font-size: 30px;
      font-family: "Poppins";
    }
    .van-dialog__confirm {
      color: var(--text_color_L4);
      width: 100%;
      height: 70px;
      text-align: center;
      line-height: 70px;
      background: var(--main_gradient-color);
      border-radius: 40px;
      z-index: 100;
      font-weight: 600;
      font-size: 30px;
      font-family: "Poppins";
    }
  }
}
</style>
