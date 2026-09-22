<template>
  <div class="passwordInput__container">
    <div class="passwordInput__container-label">
      <svg-icon name="editPswIcon" class="passwordInput__container-label__icon" />
      <span>{{ label }}</span>
    </div>
    <div class="passwordInput__container-input">
      <input
        :type="isVisible ? 'text' : 'password'"
        :placeholder="placeholder"
        :maxlength="maxlength"
        @input="onInput"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        ref="inputPwd"
        :value="value"
        autocomplete="new-password"
      />
      <img :src="getEyecon" class="eye" @click="changeI" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import i18n from "@/languages";
import eyeVisibleIcon from "@icon/main/eyeVisible.png";
import eyeInvisibleIcon from "@icon/main/eyeInvisible.png";
const t = i18n.global.t;

const inputPwd = ref();
// 明文数据
const password = ref("");
const isComposing = ref(false);

const prop = withDefaults(
  defineProps<{
    value?: string;
    maxlength?: number;
    label: string;
  }>(),
  {
    maxlength: 15,
  }
);

const emit = defineEmits<{
  (e: "update:value", val: string): void;
}>();

watch(
  password,
  (val) => {
    emit("update:value", val);
  },
  {
    flush: "post",
  }
);

const onInput = (payload: Event) => {
  if (isComposing.value) return;

  let positionIndex = getIndex();
  const target = payload.target as HTMLInputElement;
  // target.value = target.value.trim()
  target.value = target.value.replace(/\s+/g, ""); //去掉所有空格
  // 中文去掉
  const reg = /[\u4e00-\u9fa5]/g;
  target.value = target.value.replace(reg, "");

  valueRecover(positionIndex, target.value);
  valueConver(target.value);
  setIndex(positionIndex);
};

const isVisible = ref(false);
const getEyecon = computed(() =>
	isVisible.value ? eyeVisibleIcon : eyeInvisibleIcon
);
const getIndex = () => {
  //获取光标位置
  var rangeData = { start: 0, end: 0 };
  rangeData.start = inputPwd.value.selectionStart;
  rangeData.end = inputPwd.value.selectionEnd;
  return rangeData;
};
// 去掉中文方式 返回数据
const valueRecover = (positionIndex: { start?: number; end: any }, value: string) => {
  if (value.length > 1 && !value.includes("•")) {
    password.value = value;
    return;
  }
  //恢复数据
  let _password = value.split("•").join("");
  if (_password) {
    let index = password.value.length - (value.length - positionIndex.end);
    password.value =
      password.value.slice(0, positionIndex.end - _password.length) +
      _password +
      password.value.slice(index);
  } else {
    password.value =
      password.value.slice(0, positionIndex.end) +
      password.value.slice(positionIndex.end + password.value.length - value.length);
  }
};
const valueConver = (value: string | any[]) => {
  if (isVisible.value) return;
  //输入框里的数据转换，将123转为特殊符号
  if (!value) {
    inputPwd.value.value = "";
    return;
  }
  let data = "";
  for (let i = 0; i < value.length; i++) {
    data += "•";
  }
  inputPwd.value.value = data;
};
const setIndex = (rangeData: { start: any; end: any }) => {
  inputPwd.value.setSelectionRange(rangeData.start, rangeData.end);
};
const onCompositionStart = () => {
  isComposing.value = true;
};
const onCompositionEnd = (e: any) => {
  if (!isComposing.value) return;
  isComposing.value = false;
  onInput(e);
};
const changeI = () => {
  isVisible.value = !isVisible.value;
  if (isVisible.value) {
    inputPwd.value.value = password.value;
  } else {
    valueConver(password.value);
  }
};
onMounted(() => {
  password.value = prop.value || "";
  valueConver(password.value);
});

const languagesN = localStorage.getItem("language");

const placeholder = computed(() => {
  let value;
  let label = prop.label;
  switch (languagesN) {
    case "vi":
      switch (label) {
        case "Đặt mật khẩu":
          value = t("setLoginPSW");
          break;
        case "Xác nhận mật khẩu":
          value = t("enterPswConfirmation");
          break;
        default:
          value = t("phEnter") + label;
          break;
      }
      break;
    // case 'zh':
    // 	console.log('This is an vi.')
    // 	break
    default:
      value = label;
  }
  return value;
});
</script>

<style lang="scss" scoped>
.passwordInput__container {
  margin-bottom: 40px;

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

    &__icon {
      width: 48px;
      height: 48px;
      margin-right: 12px;
    }
  }

  &-input {
    position: relative;
    gap: 18px;
    border-radius: 20px;

    input {
      width: 99%;
      height: 88px;
      padding: 27px 26px;
      font-size: 28px;
      border: none;
      border-radius: 20px;
      background: var(--bg_color_L2);
      color: var(--text_color_L1);
      &::placeholder{
        color: var(--text_color_L3);
      }
    }

    img {
      position: absolute;
      top: 50%;
      right: 30px;
      transform: translateY(-50%);
      width: 40px;
      height: auto;
    }
  }
}
</style>
