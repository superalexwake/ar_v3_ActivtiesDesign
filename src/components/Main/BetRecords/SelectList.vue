<template>
  <van-popup v-model:show="showPopup" round position="bottom" @click-overlay="onOverlay">
    <div class="list">
      <div
        :class="index == selectId ? 'item active' : 'item'"
        v-for="(item, index) in list"
        :key="index"
        @click="onSelectClick(item, index)"
      >
        <div v-if="tabId === 0"><img class="img" v-lazy="item.img" />{{ getSlotTitle(item.key) }}</div>
        <div v-else>
          <i class="img" :class="`bet-${item.value}`" />
          {{ getSlotTitle(item.key) }}
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { getSlotTitle } from '@/utils'
const emits = defineEmits<{
  (e: "update:showPopup", val: boolean): void;
  (e: "onClick", val: any, index: number): void;
  (e: "onBack"): void;
}>();

const props = defineProps({
  showPopup: {
    // 是否展示弹窗
    type: Boolean,
    default: ref(false),
  },
  list: {
    type: Array,
    default: () => [],
  },
  tabId: {
    type: Number,
    default: 0,
  },
  selectId: {
    type: Number,
    default: 0,
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
const onSelectClick = (item: any, index: number) => {
  emits("onClick", item, index);
};
// 取消，确认
const onOverlay = () => {
  emits("onBack");
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 80px;
  line-height: 55px;
  padding: 35px 30px 0;
  .cancel {
    color: var(--text_color_L2);
  }
  .confirm {
    color: var(--main_gradient-color);
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 35px 24px 14px;
  .item {
    width: calc(50% - 21px);
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 100px;
    background: var(--bg_color_L3);
    border-radius: 20px;
    margin-bottom: 20px;
    font-size: 28px;
    color: var(--text_color_L2);
    & > div {
      display: flex;
      align-items: center;
    }
    .img {
      display: block;
      width: 80px;
      height: 80px;
      margin-right: 20px;
      background: no-repeat center / contain;
    }
    &.active {
      background: var(--main_gradient-color);
      color: var(--text_color_L4);
    }
  }
  $bet-values: (-1, 1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 29, 30, 35, 37, 38, 41, 42, 44, 45, 46, 47, 49, 101);
  @each $v in $bet-values {
    .item .bet-#{$v} { background-image: url('@public/main/BetRecord/#{$v}.png'); }
    .item.active .bet-#{$v} { background-image: url('@public/main/BetRecord/acitve/#{$v}.png'); }
  }
}
</style>
