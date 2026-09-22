<template>
  <div class="about-container">
    <div class="about-container-header">
      <NavBar
        :title="`${$t('aboutTitle')}`"
        class="main"
        left-arrow
        @click-left="router.go(-1)"
      />
      <div class="about-container-header-belly">
        <img src="@public/main/aboutBg.png" alt="" />
      </div>
    </div>

    <div class="about-container-content">
      <div
        class="about-container-content-item ar-1px-b"
        @click="onItemClick('Protocols')"
      >
        <div class="about-container-content-item-title">
          <svg-icon name = "privacyIcon" />
          <span>{{ $t("pravicyProtocal") }}</span>
        </div>
        <van-icon name="arrow" size="18px" color="var(--text_color_L2)" />
      </div>
      <div
        class="about-container-content-item ar-1px-b"
        @click="onItemClick('Agreement')"
      >
        <div class="about-container-content-item-title">
          <svg-icon name = "riskProtocal" />
          <span>{{ $t("riskProtocal") }}</span>
        </div>
        <van-icon name="arrow" size="18px" color="var(--text_color_L2)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRouter } from "vue-router";
const router = useRouter();
// 带参数进入详情 Protocols：隐私协议 Agreement 风险披露协议
function onItemClick(paramValue: string) {
  router.push({
    name: "About-AboutDetail",
    state: { paramValue },
  });
}
</script>

<style lang="scss" scoped>
.about-container {
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

  &-content {
    padding: 0 30px;

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 50px 0 23px 0;
      font-size: 30px;

      svg {
        width: 68px;
        height: 68px;
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
  }
}
</style>
