<template>
  <div class="pointMall__container-info">
    <div class="pointMall__container-info__left" @click="onInfoClick('Rules')">
      <svg-icon :name = "'pointRule'" />
      <span>{{ $t("pointsRule") }}</span>
    </div>
    <div class="pointMall__container-info__right" @click="onInfoClick('Record')">
      <svg-icon :name = "'pointRecord'" />
      <span>{{ $t("pointsRecord") }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
function onInfoClick(name: "Rules" | "Record") {
  router.push({
    name: `${String(router.currentRoute.value.name)}-${name}`,
  });
}
</script>

<style lang="scss" scoped>
.pointMall__container-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
  padding-inline: 15px;

  &__left,
  &__right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 326px;
    height: 144px;
    padding-block: 17px 11px;
    border-radius: 20px;
    color: var(--text_color_L1);
    background: var(--bg_color_L2);
    svg {
      width: 72px;
      height: 72px;
    }

    span {
      font-size: 24px;
    }
  }
}
</style>
