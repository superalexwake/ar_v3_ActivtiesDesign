<template>
  <div class="financialServices__container">
    <div v-if="safeState == '1' || userInfo.isOpenPointMall == 1" class="financialServices__container-footer">
      <!-- 保险箱 -->
      <div v-if="safeState == '1'" @click="goPath('StrongBox')">
        <svg-icon name="vault" />
        <div>
          <div>
            <span>{{ $t("vault") }}</span>
            <div class="financialServices__container-footer-des">
              <svg-icon name="vaultSmallIcon" />
              <h4>{{ currency(safeAmount) }}</h4>
              <van-icon name="arrow" color="var(--text_color_L2)" />
            </div>
          </div>
          <!-- <span>{{ $t('dailyRate') + dayShareRate }}%，{{ shareTime + $t('minCalculateIncome') }}</span> -->
          <span>{{ isOpenNewSetting ? $t("dailyRateReturn2", [numFilter2(dayShareRate/48 , 3, 1), shareTime]) : $t("dailyRateReturn", [dayShareRate, shareTime]) }}</span>
        </div>
      </div>
      <!-- 积分商城 -->
      <div v-if="userInfo.isOpenPointMall == 1" @click="goPath('PointMall')">
        <svg-icon name="points" />
        <div>
          <div>
            <span>{{ $t("points") }}</span>
            <div class="financialServices__container-footer-des">
              <svg-icon name="pointsSmallIncon" />
              <h4>{{ currency(userInfo.integral, " ") }}</h4>
              <van-icon name="arrow" color="var(--text_color_L2)" />
            </div>
          </div>
          <span>{{ $t("vaultdesc2") }}</span>
        </div>
      </div>
    </div>
    <!-- 下注-交易-充值-提现 -->
    <div class="financialServices__container-box">
      <div @click="goPath('BetRecords')">
        <svg-icon name="betHistory" />
        <div class="financialServices__container-box-para">
          <h3>{{ $t("bet") }}</h3>
          <span>{{ $t("mybetRecords") }}</span>
        </div>
      </div>
      <div @click="goPath('TransAction')">
        <svg-icon name="tradeHistory" />
        <div class="financialServices__container-box-para">
          <h3>{{ $t("trade") }}</h3>
          <span>{{ $t("tradeRecords") }}</span>
        </div>
      </div>
      <div @click="goPath('RechargeHistory')">
        <svg-icon name="rechargeHistory" />
        <div class="financialServices__container-box-para">
          <h3>{{ $t("recharge") }}</h3>
          <span>{{ $t("myRchargeHistory") }}</span>
        </div>
      </div>
      <div @click="goPath('WithdrawHistory')">
        <svg-icon name="myWithdrawHistory" />
        <div class="financialServices__container-box-para">
          <h3>{{ $t("withdraw") }}</h3>
          <span>{{ $t("myWithdrawHistory") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from "@/types/api";
import { getWealthState } from "@/api";
import { useRouter } from "vue-router";
import {currency, numFilter2} from "@/utils";
import { GlobalStore } from "@/stores";
import { ref } from "vue";
import { useEventBus } from "@/components/common/use";
const eventBus = useEventBus();
const globalStore = GlobalStore();
const userInfo = globalStore.getUserInfo as UserInfo;
const router = useRouter();
const dayShareRate = ref(0);
const shareTime = ref(0);
const safeAmount = ref(0);
const safeState = ref("0");
const isOpenNewSetting = ref(false)

const props = withDefaults(defineProps<{ userInfo: UserInfo }>(), {});
const goPath = (name: string) => {
  if (name === "RechargeHistory") eventBus.emit("changeKeepAliveKey");
  router.push({ name });
};

const getSafeInfoData = () => {
  getWealthState().then((res) => {
    safeState.value = res.state;
    dayShareRate.value = res.dayShareRate;
    shareTime.value = res.shareTime;
    safeAmount.value = res.safeAmount;
	  isOpenNewSetting.value = res.isOpenNewSetting === "1"
  });
};

getSafeInfoData();
</script>

<style lang="scss" scoped>
.financialServices__container {
  display: flex;
  flex-direction: column;
  gap: 40px;
  &-header {
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding-block: 10px;
      color: var(--main-color);
      background: none;
      border: 1px solid var(--main-color);
      border-radius: 99rem;
      outline: none;
      font-size: 30px;

      img {
        width: 40px;
        height: auto;
      }
    }
  }

  &-box {
    display: flex;
    justify-content: space-between;
    padding: 0;
    flex-wrap: wrap;
    gap:20px;

    &-para {
      padding: 0 10px;
      box-shadow: none !important;
      display: flex;
      flex-direction: column;

      h3 {
        font-size: 28px;
        color: var(--text_color_L1);
      }
    }

    & > div {
      width: calc((100% - 20px) / 2);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: var(--text_color_L2);
      padding: 18px;
      background: var(--darkBg, var(--bg_color_L2));
      border-radius: 10px;

      svg {
        min-width: 70px;
        min-height: 81px;
      }

      span {
        font-size: 24px;
        color: var(--text_color_L2);
      }

      & > div {
        position: relative;
        padding: 10px;
        border-radius: 20px;

        img {
          &:first-of-type {
            width: 80px;
          }
        }

        .icon-shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          html:lang(ar) & {
            left: unset;
            right: 0;
          }
        }
      }
    }
  }

  &-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text_color_L1);

    &-des {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      img {
        width: 42px !important;
      }

      :deep(.van-icon) {
        font-size: 32px;
      }
    }

    & > div {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 26px 0 26px 16px;
      border-radius: 20px;
      background: var(--bg_color_L2);

      > svg {
        min-width: 81px;
        height: 81px;
        margin-right: 18px;
      }

      & > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        padding: 10px 0;

        & > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px 0 0;

          h4 {
            font-size: 28px;
            color: #fff;
            border-radius: 9rem;
            background: var(--norm_secondary-color);
            padding: 0 10px;
          }
          svg {
            min-width: 37px;
            height: 37px;
            margin-right: 13px;
          }
          span {
            font-size: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 5px;

            &:first-of-type {
              font-weight: 600;
            }
          }
        }

        & > span {
          font-size: 22px;
        }
      }
    }
  }
}
</style>
