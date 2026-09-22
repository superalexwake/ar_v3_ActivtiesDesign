<template>
  <div class="pointMall__container">
    <NavBar
        :title="$t('pointsMall')"
        :placeholder="false"
        left-arrow
        @click-left="onClick"
    />
    <div class="pointMall__container-header">
      <img src="@public/activity/PointMall/headerBg.png"/>
      <div class="pointMall__container-header__content">
        <svg-icon name="point"/>
        <span>{{ $t("avaliablePoints") }}</span>
        <h1>{{ globalStore.getUserInfo.integral }}</h1>
      </div>
      <!-- 参与抽奖 -->
      <ParticipateActivity/>
    </div>

    <Rules/>

    <ProductList/>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import ParticipateActivity from "@/components/Activity/PointMall/ParticipateActivity/index.vue";
import ProductList from "@/components/Activity/PointMall/ProductList/index.vue";
import Rules from "@/components/Activity/PointMall/Rules/index.vue";
import {GlobalStore} from "@/stores";

const globalStore = GlobalStore();
const router = useRouter();

function onClick() {
  router.go(-1);
}
</script>

<style lang="scss" scoped>
.pointMall__container {
  position: relative;
  width: 100%;
  font-family: "Inter", sans-serif;
  overflow: hidden;

  &-header {
    position: relative;
    width: 100%;
    height: 640px - 92px;
    background-color: var(--main_gradient-color);
    margin-bottom: 250px;

    & > img {
      width: 100%;
      height: 100%;
    }

    &__content {
      position: absolute;
      left: 50%;
      bottom: 138px;
      transform: translate(-50%, 30%);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      color: var(--text_white, var(--text_color_L1));

      svg {
        width: 48px;
        height: 48px;
      }

      img {
        width: 48px;
        height: 48px;
      }

      & > span {
        margin-top: 8px;
        color: var(--text_white, var(--text_color_L1));
        font-size: 24px;
      }

      & > h1 {
        color: var(--text_white, var(--text_color_L1));
        font-size: 42px;
        font-weight: 600;
      }
    }
  }
}
</style>
