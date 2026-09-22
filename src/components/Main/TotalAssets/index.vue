<template>
  <div class="TotalAssets__container">
    <div class="TotalAssets__container-header">
      <div class="TotalAssets__container-header__left">
        <svg-icon name="vault" />
      </div>
      <div class="TotalAssets__container-header__right">
        <svg-icon name="safeIcon" />
        {{ $t("fundSafety") }}
      </div>
    </div>
    <div class="TotalAssets__container-main">
		{{ currency(props.safeAmount || 0) }}
    </div>
    <div class="TotalAssets__container-tip">{{ $t("descTotalAssets") }}<span>{{ currency(isOpenNewSetting ? willSafeEarnings : Number(safeAmount)*income) }}</span></div>
    <div v-if="isOpenNewSetting && Number(maxSafeAmount) > 0">{{$t('safeNewTip')}} {{currency((maxSafeAmount))}}</div>
  </div>
</template>

<script setup lang="ts">
import { currency } from "@/utils";

const props = defineProps({
  safeAmount: {
    type: String,
    default: "0",
  },
  income: {
    type: Number,
    default: 0,
  },
  isOpenNewSetting: {
    type: Boolean,
    default: false,
  },
  maxSafeAmount: {
    type: String,
    default: "0",
  },
willSafeEarnings: {
	type: String,
	default: "0",
}
});
</script>

<style lang="scss" scoped>
.TotalAssets__container {
  width: 100%;
  height: 260px;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  border-radius: 20px;
  color: var(--text_color_L4);
  padding: 29px 25px 0 25px;
  background-image: url("@icon/wallet/TotalAssetsBg.png");

  &-header {
    display: flex;
    justify-content: space-between;
    height: 40px;

    &__left {
      font-weight: 400;
      font-size: 26px;

      svg {
        margin-right: 16px;
        min-width: 36px;
        min-height: 36px;
      }
    }

    &__right {
      height: 40px;
      border: 1px solid var(--text_color_L4);
      border-radius: 14px;
      font-weight: 400;
      font-size: 22px;
      padding: 0 27px;
      color: var(--text_color_L4);

      svg {
        margin-inline-end: 7px;
        min-width: 27px;
        min-height: 30px;
      }
    }

    &__left,
    &__right {
      display: flex;
      align-items: center;

      img {
        width: 30px;
        height: 30px;
        margin-inline-end: 16px;
      }
    }
  }

  &-main {
    height: 55px;
    display: flex;
    align-items: center;
    margin: 16px 28px 28px 0;
    font-weight: 700;
    font-size: 48px;
    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.12);
  }

  &-tip {
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
    span {
      font-size: 32px;
      font-weight: 600;
    }
  }
}
</style>
