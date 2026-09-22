<script setup lang="ts">
import { PropType } from "vue";

const emit = defineEmits(["change"]);
const props = defineProps({
  icon: {
    type: Boolean,
    default: false,
  },
  btn: {
    type: Boolean,
    default: false,
  },
  count: {
    type: [String, Number] as PropType<string | number>,
    default: "",
  },
  title: {
    type: String as PropType<string>,
    default: "",
  },
});
</script>

<template>
  <div class="daman-title" :class="{ 'daman-line': icon }">
    <div class="daman-title-left">
      <svg-icon v-if="!icon" name="hot" />
      <span>{{ title }}</span>
    </div>
    <div class="btn-all" @click="emit('change')" v-show="btn">
      <span>{{ $t("all") }}</span>
      <span>{{ count }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.5064 19.541C7.99993 19.9904 7.2002 19.6308 7.2002 18.9537C7.2002 18.7288 7.29666 18.5147 7.46512 18.3657L14.6731 11.9896C14.7178 11.95 14.7181 11.8804 14.6738 11.8404L7.45763 5.33217C7.29374 5.18437 7.2002 4.97403 7.2002 4.75334C7.2002 4.078 8.00051 3.72221 8.50188 4.17465L15.8798 10.8325L16.2562 11.1964C16.6628 11.5895 16.6628 12.2412 16.2562 12.6343L15.8798 12.9982L8.5064 19.541Z"
          fill="#666666"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.daman-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  font-size: 36px;
  // margin-bottom: 4px;
  height: 60px;
  font-weight: bold;

  &.daman-line {
    padding-left: 20px;
    color: var(--text_color_L2);
    gap: 40px;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 10px;
      height: 36px;
      background: var(--main-color);
      border-radius: 5px;
    }
  }
  &-left {
    display: flex;
    align-items: center;
    font-size: 32px;
    font-weight: 600;
    gap: 5px;
    color: var(--darkTextW, var(--text_color_L1));
    svg {
      color: var(--main-color);
    }
  }
  .cms-icon {
    color: #f95959;
    margin-right: 8px;
    margin-bottom: 6px;
  }
  .btn-all {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    height:40px;
    border: 1px solid var(--text_color_L2);
    font-size: 22px;
    font-weight: 400;
    color: var(--text_color_L2);
    border-radius: 10px;
    white-space: nowrap;
    padding: 0 4px;
    span {
      color: var(--main-color);
      margin-right: 8px;
      margin-left: 4px;
    }
    svg {
      height: 24px;
      width: 24px;
    }
  }
}
</style>
