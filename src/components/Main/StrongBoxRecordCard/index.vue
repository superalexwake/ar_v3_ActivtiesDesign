<template>
  <div class="StrongBoxRecordCard__container">
    <div
      class="StrongBoxRecordCard__container-first"
      :class="{ transferIn: props.detail.type == 18 }"
    >
      <div class="StrongBoxRecordCard__container-buttom">
        {{ props.detail.type == 18 ? $t("transferIn") : $t("transferOut") }}
      </div>
      <div class="StrongBoxRecordCard__container-num">
        {{ props.detail.type == 18 ? "+" : "-" }}{{ currency(props.detail.amount) }}
      </div>
    </div>
    <div class="StrongBoxRecordCard__container-rale">
      <span>{{ isOpenNewSetting ? $t("dailyRate2") : $t("dailyRate") }}</span>
      <span>{{ isOpenNewSetting ? (props.detail.dayShareRate/48).toFixed(3): (props.detail.dayShareRate * 100).toFixed(2) }}%</span>
    </div>
    <div class="StrongBoxRecordCard__container-rale">
      <span>{{ $t("settlementIncome") }}</span>
      <span class="StrongBoxRecordCard__container-rale-num">{{
        currency(props.detail.earnings)
      }}</span>
    </div>
    <div class="StrongBoxRecordCard__container-last">
      <span>{{ props.detail.orderNum }}</span>
      <span>{{ props.detail.addTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currency } from "@/utils";

const props = defineProps({
  detail: {
    type: Object,
    default: {
      Type: 18,
      DayShareRate: 0.1,
      Amount: 50000,
      Earnings: 5000,
      OrderNum: "20221115123456789",
      AddTime: "2022/08/24",
    },
  },
	isOpenNewSetting: {
	  type: Boolean, default: false
	}
});
</script>

<style lang="scss" scoped>
.StrongBoxRecordCard__container {
  height: 280px;
  background: var(--darkBg, var(--bg_color_L2));
  box-shadow: var(--BoxShadowColor-9);
  border-radius: 10px;
  padding: 25px 14px 28px 14px;

  &-buttom {
    width: 160px;
    height: 40px;
    border: 1px solid var(--main-color);
    color: var(--main-color);
    font-weight: 500;
    font-size: 24px;
    border-radius: 10px;
    text-align: center;
  }

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & + div {
      margin-top: 10px;
    }

    &:last-child {
      margin-top: 20px;
    }
  }

  &-num {
    font-size: 30px;
    color: var(--norm_secondary-color);
  }

  &-first {
    height: 40px;

    &.transferIn {
      .StrongBoxRecordCard__container-buttom {
        background-color: var(--main-color);
        color: var(--text_color_L4);
      }

      .StrongBoxRecordCard__container-num {
        font-size: 30px;
        color: var(--norm_secondary-color);
      }
    }
  }

  &-rale {
    height: 60px;
    line-height: 60px;
    background: var(--bg_color_L1);
    font-size: 24px;
    color: var(--norm_green-color);
    padding: 0 20px;

    &-num {
      font-weight: 500;
      font-size: 28px;
      color: var(--norm_red-color);
    }
  }

  &-last {
    font-size: 24px;
    color: var(--text_color_L2);

    & > span {
      &:last-child {
        span + span {
          margin-left: 18px;
        }
      }
    }
  }
}
</style>
