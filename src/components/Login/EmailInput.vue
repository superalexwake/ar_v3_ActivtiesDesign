<template>
  <div class="emailcontainer">
    <div class="emailinput__container">
      <div class="emailinput__container-label">
        <svg-icon name="email" class="emailinput__container-label__icon" />
        <span>{{
          userStore.isOpenExternalAccount
            ? `${$t("otherlogin")} ${$t("login")}`
            : $t("email")
        }}</span>
      </div>
      <div class="emailinput__container-input">
        <input
          type="text"
          name="userEmail"
          maxlength="250"
          v-model="inputemail"
          :placeholder="$t('inputemail')"
          @input="onChange"
          ref="email"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores";
import { ref, computed, nextTick } from "vue";
const userStore = useUserStore();
const prop = withDefaults(
  defineProps<{
    type: string;
    email: string;
  }>(),
  {}
);
const emits = defineEmits<{
  (e: "update:show-validate", val: boolean): void;
  (e: "changeN", val: string): void;
}>();
const inputemail = computed({
  get(): string {
    return prop.email;
  },
  set(val: string) {
    emits("changeN", val);
  },
});
function onChange(e: Event) {
  const el = e.target as HTMLInputElement;
  //去掉中文

  const reg = /[\u4e00-\u9fa5]/g;
  el.value = el.value.replace(reg, "");
  if (el.value.length > 0) {
    emits("update:show-validate", false);
  }
}
const email = ref();
function getFocus() {
  nextTick(() => {
    email.value.focus();
  });
}
defineExpose({
  getFocus,
});
</script>
<style lang="scss" scoped>
.emailinput__container {
  margin-bottom: 60px;

  &-label,
  &-input {
    display: flex;
    align-items: center;
    padding: 0 2px;
  }

  &-label {
    margin-bottom: 24px;
    color: var(--text_color_L1);
    font-size: 30px;
    svg {
      color: var(--main-color);
    }

    &__icon {
      width: 48px;
      height: 48px;
      margin-right: 12px;
    }
  }

  &-input {
    gap: 18px;

    input {
      width: 100%;
      height: 88px;
      padding: 27px 26px 27px 26px;
      color: var(--text_color_L1);
      font-size: 28px;
      border: none;
      border-radius: 20px;
      background: var(--bg_color_L2);
      &::placeholder{
        color: var(--text_color_L3);
      }
    }
  }
  &-tips {
    margin-top: 24px;
    padding-left: 17px;
    color: var(--norm_red-color);
    font-size: 24px;
    display: flex;
    flex-direction: row;
    .tipbg {
      width: 32px;
      height: 32px;
      background-image: url("@icon/wallet/hint.png");
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
