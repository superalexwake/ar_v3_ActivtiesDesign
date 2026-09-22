<script setup lang="ts">
import { useRouter } from "vue-router";
import { currency } from "@/utils";
import { useJackpot } from "@/hooks";
import { onMounted } from "vue";
const router = useRouter();
const { getRuleList, ruleList, gotoCustom } = useJackpot();
const dollarSign = sessionStorage.getItem("dollarSign");
const transformedRange = (item: string) => {
  const [bet, bet2] = item.split("-");
  return `${bet}X-${bet2}X`;
};
onMounted(() => getRuleList());
</script>

<template>
  <div class="jackpot-rule">
    <NavBar :title="$t('ruleillustrate')" left-arrow @click-left="router.go(-1)" />
    <div class="rule-bannerMain">
      <div class="rule-content">
        <div class="rule-content-top">
          <div class="rule-content-top-right">
            <h3>{{ $t("superjackpot") }}</h3>
            <p>{{ $t("ruleillustrate1") }}</p>
          </div>
        </div>
        <div class="rule-content-tip">
          <svg-icon name="warningTriangle" />
          <p>
            {{ $t('ruleillustrate2') }}
          </p>
        </div>
      </div>
    </div>
    <div class="jackpot-rule-wrap">
      <div class="title">
        <svg-icon name="superJackpotRule" />
        {{$t('winTips5')}}
      </div>
      <div class="table-container">
        <div class="table-title">
          <div>{{ $t("winningrate") }}</div>
          <div>{{ $t("betAmounts") }}</div>
          <div>{{ $t("winTips5") }}</div>
        </div>
        <div class="table-content" v-for="(item, index) in ruleList" :key="index">
          <div>{{ transformedRange(item.multipleName) }}</div>
          <div>
            {{ dollarSign
            }}{{
              item.betAmountName.split("-")[0] +
              "-" +
              dollarSign +
              item.betAmountName.split("-")[1]
            }}
          </div>
          <div>{{ currency(item.awardAmount) }}</div>
        </div>
      </div>
      <div class="jackpot-rule-owener">
        <svg-icon name="rightTriangle" />
        {{$t('ruleillustaate3')}}
      </div>
      <div class="jackpot-rule-custom" @click="gotoCustom">
        <svg-icon name="customerPublic" />
        {{ $t('withdrawDialogDesc5') }}
      </div>
    </div>
    </div>


</template>

<style scoped lang="scss">
.jackpot-rule {
  .rule-bannerMain {
    background: linear-gradient(
      180deg,
      #f55d4d 0%,
      #f59571 33.39%,
      #f5a181 61.81%,
      #ef5334 100%
    );
  }
  .rule-content {
    width: 100%;
    min-height: 450px;
    background: url("@/assets/icons/main/superJackpotRulebg.png") no-repeat;
    background-size: contain;
    color: #fff;
    padding: 50px;

    &-top {
      display: flex;

      svg {
        width: 200px;
        height: 200px;
      }

      &-right {
        flex: 1;
        max-width: 384px;
      }

      h3 {
        margin-bottom: 10px;
        font-size: 30px;
        font-weight: 700;
      }

      p {
        font-size: 24px;
        font-weight: 400;
        line-height: 40px;
      }
    }

    &-tip {
      padding: 24px 30px;
      border-radius: 16px;
      font-size: 22px;
      font-weight: 300;
      line-height: 40px;
      display: flex;
      margin-top: 60px;
      background: rgba(212, 91, 52, 0.5);

      p {
        flex: 1;
        padding-left: 10px;
      }

      svg {
        width: 36px;
        height: 36px;
      }
    }
  }

  &-wrap {
    padding: 35px 24px;
  }

  .title {
    color: var(--darkTextW,var(--text_color_L1));
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;

    svg {
      fill: var(--main-color);
      width: 48px;
      height: 48px;
      vertical-align: middle;
      html:lang(ar) & {
        transform: scaleX(-1);
      }
    }
  }

  .table-container {
    width: 100%;
    background: var(--bgDark-3,var(--bg_color_L2));
    border-radius: 16px;
    overflow: hidden;
  }

  .table-title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-height: 80px;
    line-height: 80px;
    background: var(--sheet_nva_color);
    color: #fff;

    & > div {
      flex: 1;
      font-size: 24px;
      text-align: center;
    }
  }

  .table-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    line-height: 35px;
    font-size: 24px;
    text-align: center;

    background-color: var(--bg_color_L2);
    &:nth-child(odd) {
      background: var(--bg_color_L1);
    }

    & > div {
      flex: 1;  
    }

    & > div:nth-child(1) {
      color: var(--norm_secondary-color);
    }

    & > div:nth-child(2) {
      color: var(--text_color_L1);
    }

    & > div:nth-child(3) {
      color: var(--norm_red-color);
    }
  }

  &-owener {
    background: var(--darkBg,var(--bg_color_L2));
    border-radius: 20px;
    padding: 40px 24px;
    margin-top: 20px;
    margin-bottom: 50px;
    color: var(--text_color_L2);
    font-size: 24px;
    font-weight: 500;
    svg{
      color: var(--darkLight2,var(--main-color));
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 20px;
      html:lang(ar) & {
        transform: scaleX(-1);
      }
    }
  }

  &-custom {
    height: 80px;
    color: var(--text_color_L4);
    text-align: center;
    line-height: 80px;
    background:  var(--main_gradient-color);
    border-radius: 50px;
    font-size: 30px;
    font-weight: 700;

    svg {
      color: var(--text_color_L4);
      width: 48px;
      height: 48px;
      vertical-align: middle;
    }
  }
}
</style>
