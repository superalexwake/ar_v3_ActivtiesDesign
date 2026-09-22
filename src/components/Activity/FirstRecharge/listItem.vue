<template>
  <div v-for="(item, index) in list" :key="index" class="first_list-item">
    <div class="head">
      <div class="title">
        {{ $t("firstSave") }}<span>{{ item.rechargeAmount }}</span>
      </div>
      <div class="orange">+ {{ currency(item.rewardAmount) }}</div>
    </div>
    <div class="description">
      {{ $t("firstSaveT", [item.rechargeAmount, item.rewardAmount]) }}
    </div>
    <div class="foot">
      <arProgress
        :stroke-width="16"
        color="var(--norm_secondary-color)"
        :total="item.rechargeAmount"
        :numerical="item.canReceive ? item.rechargeAmount : 0"
      />
      <div class="btn" :class="[getClass(item, isRule)]" @click="clickBtn(item)">
        {{ getText(item) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currency } from "@/utils";
import arProgress from "@/components/common/Progress.vue";
import { useActive } from "@/components/common/use";
import { useActivityReceiveRewardDialog } from "@/hooks/useActivityReceiveRewardDialog.hook";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["gorecharge", "close"]);
let lock = false;
defineProps({
  list: {
    type: Array,
    default: () => [
      {
        rewardAmount: 123,
      },
    ],
  },
  isRule: {
    type: Boolean,
    default: false,
  },
});
const { receiveFirstRechargeReward } = useActive();
const { openActivityReceiveRewardDialog } = useActivityReceiveRewardDialog();

const getClass = (item: any, isRule: Boolean) => {
  const { canReceive, isFinshed } = item;
  if (!canReceive) return "n2" + (isRule ? " rule" : "");
  if (canReceive && !isFinshed) return "n1" + (isRule ? " rule" : "");
  if (isFinshed) return "n3" + (isRule ? " rule" : "");
  if (!isFinshed) return "n2" + (isRule ? " rule" : "");
};
const getText = (item: any) => {
  const { canReceive, isFinshed } = item;
  if (!canReceive) return t("torecharge");
  if (isFinshed) return t("claimed");
  return t("receive");
};
const clickBtn = async (item: any) => {
  const { canReceive, isFinshed } = item;
  if (!canReceive) {
    return emit("gorecharge");
  }
  if (isFinshed || lock) return;
  lock = true;
  const res = await receiveFirstRechargeReward(item.id);
  lock = false;
  if (res) {
    void openActivityReceiveRewardDialog(item.rewardAmount);
    emit("close");
  }
};
</script>

<style lang="scss" scoped>
.first_list-item {
  padding: 20px;
  border-radius: 20px;
  background: var(--bg_color_L2);
  .head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    .title {
      font-size: 28px;
      color: var(--text_color_L1);
      & > span {
        margin-left: 8px;
        color: var(--norm_secondary-color);
      }
    }
    .orange {
      font-size: 26px;
      color: var(--norm_secondary-color);
    }
  }
  .description {
    font-size: 22px;
    color: var(--text_color_L2);
    margin-bottom: 20px;
  }
  .foot {
    display: flex;
    align-items: center;
    & > div {
      flex: 1;
    }
    .btn {
      width: 160px;
      min-height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      font-size: 24px;
      margin-left: 42px;
      border-radius: 10px;
      padding: 0 10px;
      color: var(--text_color_L4);
      &.n1 {
        background: var(--main_gradient-color);
        &.rule {
          opacity: 0;
          pointer-events: none;
        }
      }
      &.n2 {
        border: 1px solid var(--norm_secondary-color);
        color: var(--norm_secondary-color);
        &.rule {
          opacity: 0;
          pointer-events: none;
        }
      }
      &.n3 {
        box-shadow: var(--BoxShadowColor-12);
        background: var(--linearGradien-17);
      }
    }
  }
  & + .first_list-item {
    margin-top: 20px;
  }
}

</style>
