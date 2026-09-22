<template>
  <div class="dropdown">
    <div class="dropdown__value">
      <input
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :value="keyword"
        :placeholder="`+${typeValue}`"
        :readonly="!searchable"
        :disabled="disabled"
        @focus="open"
        @input="onInput"
        @keyup.enter="confirm"
      />
      <van-icon name="arrow-down" :class="{ arrowActive: active }" @click="toggle" />
    </div>
    <div class="dropdown__list" :class="{ active: active }">
      <div
        v-for="item in visibleList"
        :key="item.code"
        class="dropdown__list-item"
        :class="{ active: bare(item.dialCode) === selectedCode }"
        @click="handleClick(item.dialCode)"
      >
        <span>{{ item.dialCode }}</span>
        {{ item.name }}
      </div>
      <div v-if="!visibleList.length" class="dropdown__list-empty">
        {{ $t("noData") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import countryList from "./countryList";
import { SettingStore } from "@/stores";
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    typeValue: string;
  }>(),
  {
    disabled: false,
  }
);
const settingS = SettingStore();
const emits = defineEmits<{
  (e: "changeT", val: string): void;
}>();
const active = ref(false);
const keyword = ref("");
const list = Object.values(countryList);

// typeValue 在各调用方有带 + 和不带 + 两种写法，统一剥掉 + 再比较
const bare = (dialCode: string) => dialCode.replace("+", "");

function toggle() {
  if (props.disabled) return;
  active.value = !active.value;
}

function open() {
  if (props.disabled) return;
  active.value = true;
}

// keyword 未变化时不会触发重渲染，须手动回写 el.value，否则非法字符残留在框里
function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  keyword.value = el.value.replace(/\D/g, "");
  el.value = keyword.value;
  active.value = true;
  const first = visibleList.value[0];
  if (keyword.value && first) emits("changeT", bare(first.dialCode));
}

function handleClick(e: string) {
  emits("changeT", bare(e));
  active.value = false;
}

function confirm(e: KeyboardEvent) {
  (e.target as HTMLInputElement).blur();
  active.value = false;
}

const areaCodeList = computed(() => {
  const areaCodes = settingS.getAreaPhoneLenList.map((item) => item.area);
  if (!areaCodes.length) return list;
  // 按 areaPhoneLenList 的顺序展示（后端返回顺序即优先级），而非 countryList 声明顺序
  return areaCodes.flatMap((area) => {
    const found = list.find((item) => item.dialCode === area);
    return found ? [found] : [];
  });
});

const searchable = computed(() => areaCodeList.value.length >= 3);

const selectedCode = computed(() => bare(props.typeValue));

const visibleList = computed(() => {
  if (!keyword.value) return areaCodeList.value;
  return areaCodeList.value.filter((item) => bare(item.dialCode).startsWith(keyword.value));
});

watch(active, (val) => {
  if (!val) keyword.value = "";
});

const close = () => {
  active.value = false;
};
defineExpose({ close });
</script>

<style lang="scss" scoped>
.dropdown {
  position: absolute;
  width: 186px;
  height: 88px;
  color: var(--text_color_L2);
  text-align: center;
  line-height: 88px;
  background: var(--bg_color_L2);
  outline: none;
  border-radius: 20px;

  &__value {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 30px;
    font-size: 30px;
    cursor: pointer;

    input {
      // 够放最长的 +1684
      width: 88px;
      height: 100%;
      color: inherit;
      font-size: inherit;
      text-align: start;
      line-height: normal;
      border: none;
      outline: none;
      background: transparent;

      // 未输入时用 placeholder 显示当前区号，颜色须与正文一致
      &::placeholder {
        color: inherit;
        opacity: 1;
      }
    }

    i {
      flex-shrink: 0;
      margin-left: 10px;
      transition: transform 0.3s ease;
    }

    .arrowActive {
      transform: rotate(180deg);
    }
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 646px;
    font-size: 28px;
    max-height: 0;
    text-align: start;
    opacity: 0;
    pointer-events: none;
    border-radius: 10px;
    background-color: var(--bg_color_L2);
    overflow: hidden;
    z-index: 1;
    overflow-y: scroll;
    transition: opacity 0.2s ease-in-out, max-height 0.2s ease-in-out;
    html:lang(ar) & {
      left: unset;
      right: 0;
    }
    &::-webkit-scrollbar {
      width: 0;
    }

    &-item {
      padding-left: 30px;
      cursor: pointer;

      span {
        display: inline-block;
        width: 100px;
      }

      &.active {
        background: var(--main-color);
        color: #fff;
      }
    }

    &-empty {
      padding: 30px;
      text-align: center;
      line-height: normal;
    }

    &.active {
      max-height: min(480px, 50vh);
      opacity: 1;
      pointer-events: auto;
      z-index: 10;
    }
  }
}
</style>
