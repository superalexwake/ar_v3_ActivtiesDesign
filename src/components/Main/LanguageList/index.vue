<template>
  <div :class="type === 2 ? 'list info' : 'list'">
    <div
      class="item ar-1px-b"
      v-for="(item, index) in languagesList"
      :key="index"
      @click="onClick(item.key, type)"
      :class="item.key == locale ? `checked` : ''"
    >
      <div class="item-title">
        <img :src="getLangFlag(item.key)" />
        <span v-if="type === 2">{{ item.key.toLocaleUpperCase() }}</span>
        <span v-else>{{ item.name }}</span>
      </div>
      <van-radio-group v-model="locale">
        <van-radio :name="item.key" />
      </van-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAssets } from "@/hooks/useAssets";
import { useLang } from "@/hooks/useLanguage.hook";
const { onClick, languagesList, locale } = useLang();
const { getLangFlag } = useAssets();
defineProps({
  type: {
    // 是否展示弹窗
    type: Number,
    default: 1,
  },
});
</script>

<style lang="scss" scoped>
.list {
  padding: 0 30px;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px 20px 30px;
    font-size: 30px;
    margin: 40px 0;

    img {
      width: 68px;
      padding-right: 14px;
    }

    span {
      font-size: 30px;
      color: var(--text_color_L1);
    }

    &-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  &.info {
    .item {
      margin: 20px 0;
    }
  }
  .checked {
    background: var(--bg_color_L2);
    border-radius: 20px;
  }
}
</style>
