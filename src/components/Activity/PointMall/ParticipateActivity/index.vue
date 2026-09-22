<template>
  <div class="pointMall__container-treasureActivity">
    <div>
      <svg-icon name="diamond"/>
      <span>{{ $t("pointsTreasure") }}</span>
    </div>
    <p class="treasureActivity-tips">{{ $t("descComponents1") }}</p>
    <p class="treasureActivity-desc">{{ $t("descComponents2") }}</p>
    <button @click="onLotteryActivityClick">{{ $t("participateLottery") }}</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function onLotteryActivityClick() {
  router.push({
    name: `${String(router.currentRoute.value.name)}-LotteryActivity`,
  });
}
</script>

<style lang="scss" scoped>
.pointMall__container-treasureActivity {
  position: relative;
  left: 50%;
  top: -80px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 642px;
  height: 280px;
  padding: 10px 15px 20px;
  border-radius: 10px;
  background: url("@icon/activity/PointMall/headerBodyBg.png") no-repeat center
    var(--bgDark-2, var(--bg_color_L2));
  background-size: cover;
  box-shadow: var(--BoxShadowColor-33);

  div {
    display: flex;
    align-items: center;

    svg{
      width: 48px;
      height: 48px;
    }
    img {
      width: 48px;
      height: 48px;
    }

    span {
      display: inline-block;
      color: var(--textBlueLight, var(--text_color_L1));
      font-family: Inter;
      font-size: 36px;
      font-style: normal;
      font-weight: 700;
      line-height: 48px;
      margin-left: 4px;
    }
  }

  .treasureActivity-tips {
    color: var(--darkTextW, var(--text_color_L1));
    font-family: Inter;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px;
    margin-bottom: 14px;
  }

  .treasureActivity-desc {
    color: var(--text_color_L2);
    font-family: Inter;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 30px;
  }

  button {
    width: 520px;
    height: 70px;
    color: var(--text_color_L4);
    border: none;
    text-align: center;

    border-radius: 50px;
    background: var(--main_gradient-color);
    margin: 0 auto;
  }
}
</style>
