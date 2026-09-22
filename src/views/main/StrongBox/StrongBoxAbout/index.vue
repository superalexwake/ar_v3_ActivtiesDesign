<template>
  <div class="StrongBoxAbout__container">
    <NavBar
      :title="$t('titleLearnAboutVault')"
      :placeholder="false"
      left-arrow
      @click-left="onClick"
    />
    <div class="StrongBoxAbout__container-dailyRate">
      {{
		isOpenNewSetting ? $t("tipMinimumIncome2") + numFilter2(dayShareRate * 100 /48, 3, 1) + "%" :
        $t("tipMinimumIncome") + (dayShareRate && numFilter2(dayShareRate * 100, 2, 1)) +
        "%"
      }}
    </div>
    <div class="StrongBoxAbout__container-header income">{{ $t("income") }}</div>
    <div class="StrongBoxAbout__container-detail">
      <div class="StrongBoxAbout__container-detail-text">
        {{ $t("strongBoxAboutTip") }}
      </div>
      <div class="StrongBoxAbout__container-detail-text">
        {{ $t("tipEarningsCaculatedEveryMinites", [isOpenNewSetting ? '30': '1']) }}
      </div>
      <div class="StrongBoxAbout__container-detail-text">
        {{ $t("tipEarningSettledAfterTransferInOrOut") }}
      </div>
    </div>
    <div class="StrongBoxAbout__container-header transferIn">{{ $t("transferIn") }}</div>
    <div class="StrongBoxAbout__container-detail">
      <div class="StrongBoxAbout__container-detail-text">
        {{ $t("tipBalanceTransferInUnits") }}
      </div>
      <div class="StrongBoxAbout__container-detail-container">
        <div class="StrongBoxAbout__container-detail-container-tip">
          {{ $t("example") }}
        </div>
        <div>{{ $t("tipTransferAmountMustBeMultipleOfCopies") }}</div>
      </div>
    </div>
    <div class="StrongBoxAbout__container-header transferOut">
      {{ $t("transferOut") }}
    </div>
    <div class="StrongBoxAbout__container-detail">
      <div class="StrongBoxAbout__container-detail-text">
        {{ isOpenNewSetting ? $t('safeNewTip2') : $t("tipTransferAnytimeGuarantedUnderSolidIncomes") }}
      </div>
      <div class="StrongBoxAbout__container-detail-container">
        <div class="StrongBoxAbout__container-detail-container-tip red">
          {{ $t("friendlyReminds") }}
        </div>
        <div>{{  $t("tipPlsDoNotTransferInOutFrequently",[isOpenNewSetting ? 30 : 1]) }}</div>
      </div>
    </div>
    <div class="StrongBoxAbout__container-header safety">{{ $t("security") }}</div>
    <div class="StrongBoxAbout__container-detail">
      <div class="StrongBoxAbout__container-detail-text">
        {{ $t("tipFundSaftyEnsuredBySecurityTeam") }}
      </div>
      <div class="StrongBoxAbout__container-detail-text">
        {{ $t("tipTransferIntoVaultToEnsureSafety") }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getSafeInfo } from "@/api";
import { numFilter2, AwaitApiResult } from "@/utils";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
const router = useRouter();
const dayShareRate = ref(0);
const isOpenNewSetting = ref(false)
// 返回上一页
function onClick() {
  router.go(-1);
}
// 获取保险箱日利率
const getSafeInfoData = async () => {
  const res = await AwaitApiResult(getSafeInfo());
  // if (res) {
  // 	dayShareRate.value = res.data.dayShareRate
  // }
  dayShareRate.value = res.data.dayShareRate;
	isOpenNewSetting.value = res.data.isOpenNewSetting === '1'
};

onMounted(() => {
  getSafeInfoData();
});
</script>
<style lang="scss" scoped>
.StrongBoxAbout__container {
  padding: 0 24px 0 24px;

  &-dailyRate {
    width: auto;
    max-width: 500px;
    height: 40px;
    display: flex;
    justify-content: center;
    line-height: 40px;
    background: var(--bg_color_L2);
    border-radius: 40px;
    font-size: 24px;
    color: var(--norm_red-color);
	  text-align: center;
	  margin: 30px auto 30px;

  }

  &-header {
    background: var( --light-main_gradient-color, var(--bg_color_L3));
    color: #fff;
    height: 60px;
    line-height: 60px;
    padding-left: 74px;
    font-size: 32px;
    font-weight: 600;
    position: relative;

    &::after {
      display: block;
      content: "";
      width: 0;
      height: 0;
      border-right: 24px solid var(--bg_color_L1);
      border-bottom: 0 solid transparent;
      border-top: 60px solid transparent;
      position: absolute;
      right: 0;
      top: 0;
    }

    &::before {
      display: block;
      content: "";
      position: absolute;
      height: 42px;
      width: 42px;
      top: 9px;
      left: 20px;
      background-size: 42px;
    }

    &.income {
      &::before {
        background-image: url("@/assets/icons/main/incomeIcon.png");
      }
    }

    &.transferIn {
      &::before {
        background-image: url("@/assets/icons/main/transferInIcon.png");
      }
    }

    &.transferOut {
      &::before {
        background-image: url("@/assets/icons/main/transferOutIcon.png");
      }
    }

    &.safety {
      &::before {
        background-image: url("@/assets/icons/main/safetyIcon.png");
      }
    }
  }

  &-detail {
    background: var(--bg_color_L2);
    border-radius: 0 0 20px 20px;
    padding: 30px 20px;
    margin-bottom: 30px;

    &-text {
      padding: 0 42px 0 44px;
      font-size: 26px;
      line-height: 36px;
      color: var(--text_color_L2);
      background-image: url("@icon/main/trianglered.png");
      background-repeat: no-repeat;
      background-position: 6px 1px;
      background-size: 24px;

      & + .StrongBoxAbout__container-detail-text {
        margin-top: 45px;
      }
    }

    &-container {
      border: 1px solid var(--bg_color_L3);
      border-radius: 20px;
      padding: 20px;
      font-size: 24px;
      color: var(--text_color_L3);
      line-height: 36px;
      width: calc(100% - 40px);
      margin: auto;
      margin-top: 40px;

      &-tip {
        margin-bottom: 20px;

        &.red {
          color: var(--norm_red-color);
        }
      }
    }
  }
}
</style>
