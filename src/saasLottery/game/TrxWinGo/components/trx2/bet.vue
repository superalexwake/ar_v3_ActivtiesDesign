<template>
  <div class="bet_body">
    <div v-show="countdown.total <= 10 * 1000" class="bet_body-mark">
      <div>{{ countdownTime[3] || "0" }}</div>
      <div>{{ countdownTime[4] || "0" }}</div>
    </div>
    <div class="color">
      <div class="green" @click="onBet(colors[0])">{{ $t(`betGreen`) }}</div>
      <div class="violet" @click="onBet(colors[1])">{{ $t(`betViolet`) }}</div>
      <div class="red" @click="onBet(colors[2])">{{ $t(`betRed`) }}</div>
    </div>
    <div class="betNum">
      <div
        v-for="(item, index) in numbers"
        :key="index"
        :class="[randomNum == item.playBet ? 'active' : '', 'b' + index]"
        @click="onBet(item)"
      ></div>
    </div>
    <div class="ramd" v-if="betMultiples">
      <div @click="onRandom" :class="[betMultiples.length <= 4 && 'f1', 'l']">
        {{ $t("randomBet") }}
      </div>
      <div
        v-for="(item, i) in betMultiples"
        :key="i"
        :class="[item === betMultiple && 'active', 'r']"
        @click="betMultiple = item"
      >
        x{{ item }}
      </div>
    </div>
    <div class="size">
      <div @click="onBet(bigSmalls[0])" class="big">{{ $t(`big`) }}</div>
      <div @click="onBet(bigSmalls[1])" class="small">
        {{ $t(`small`) }}
      </div>
    </div>
  </div>
  <!-- 投注内容 begin -->
  <van-popup
    v-model:show="betDialog"
    position="bottom"
    :round="true"
    teleport="body"
  >
    <div :class="['bet', 'bet-' + playBet]">
      <div class="bet-body">
        <div class="head">
          <div class="title">{{ currentGame }}</div>
          <div class="selectName">
            {{ t("selectMay") }}
            {{ isNaN(Number(playBet)) ? t("bet" + playBet.charAt(0).toUpperCase()+playBet.slice(1)) : playBet }}
          </div>
        </div>
        <div class="l1">
          <div class="title">{{ $t("amount") }}</div>
          <div class="amount">
            <div
              v-for="(c, k) in betScopes"
              :key="k"
              :class="{ active: c == amount }"
              @click="amount = c"
            >
              {{ formatNum(c) }}
            </div>
          </div>
        </div>
        <div class="l1">
          <div class="title">{{ $t("quantity") }}</div>
          <div class="m">
            <div @click="Stepper(1)">-</div>
            <input
              v-model="betMultiple"
              type="number"
              @input="enforceMaxValue"
            />
            <div @click="Stepper(2)">+</div>
          </div>
        </div>
        <div class="l1">
          <div class="title"></div>
          <div class="multiples">
            <div
              v-for="(m, k) in betMultiples"
              :key="k"
              :class="{ active: m === betMultiple }"
              @click="betMultiple = m"
            >
              X{{ m }}
            </div>
          </div>
        </div>
        <div class="l2">
          <van-checkbox
            v-model="agreePreSale"
            checked-color="var(--norm_red-color)"
          >
            {{ $t("agree") }}
            <span @click="showPreSale = true">{{
              $t("presaleRules")
            }}</span>
          </van-checkbox>
          <!-- <div>
            <span @click="betLimitDialog = true">{{ $t("common.limit") }}</span>
          </div> -->
        </div>
      </div>
      <div class="bet-foot">
        <div class="bet-foot-c" @click="onClearBet">
          {{ t("cancel") }}
        </div>
        <div class="bet-foot-s" :class="{ disabled: loading || !canSubmit }" @click="betting">
          {{ t("totalAmount") }}
          <span>{{ currency(betMultiple * amount || 0) }}</span>
        </div>
      </div>
    </div>
  </van-popup>

  <!-- 预售规则弹层 begin-->
  <van-popup
    v-model:show="showPreSale"
    :close-on-click-overlay="false"
    round
    teleport="body"
  >
    <BetRule :title="t('presaleRules')" @close="showPreSale = false">
      {{ $t("betPopTXT") }}
    </BetRule>
  </van-popup>
  <van-popup
    v-model:show="betLimitDialog"
    @open="getBetLimit"
    :close-on-click-overlay="false"
    round
    teleport="body"
  >
    <BetRule :title="$t('common.limit')" @close="betLimitDialog = false">
      <div class="flex-center" style="height: 100%" v-if="betLimitLoading">
        <van-loading type="spinner" color="#FD565C" />
      </div>
      <table class="limit-table" v-else>
        <thead>
          <tr>
            <th>{{ $t("common.play") }}</th>
            <th>{{ $t("common.choice") }}</th>
            <th>{{ $t("common.limit") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, k) in betLimit" :key="k">
            <td>{{ item.playType }}</td>
            <td>{{ item.betContent }}</td>
            <td>{{ currency(item.maxPayoutAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </BetRule>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, inject, computed } from "vue";
import { currency, formatNum, sanitizeBetCountInput, clampBetCountInput } from "@/saasLottery/utils";
import { useI18n } from "vue-i18n";
import { BetRule } from "@/saasLottery/components";
import { useGlobalContext, useToast } from "@/saasLottery/hooks";
// 接收父组件传入的 currentGame
const props = defineProps({
  currentGame: {
    type: String,
    default: "",
  },
});
// 使用 inject 接收父组件传递的实例
const trxWinHook = inject("trxWinHook");
const {
  onRandom,
  bigSmalls,
  onBet,
  colors,
  numbers,
  randomNum,
  countdownTime,
  countdown,
  betMultiples,
  betDialog,
  betMultiple,
  playBet,
  agreePreSale,
  betScopes,
  amount,
  onClearBet,
  onBetting,
  loading,
  betLimit,
  getBetLimit,
  betLimitLoading,
}: any = trxWinHook;
const { t } = useI18n();
const { balance } = useGlobalContext();
const message = useToast();
const showPreSale = ref(false);
const betLimitDialog = ref(false);
// 份数加减
const Stepper = (e: number) => {
  const cur = clampBetCountInput(betMultiple.value) ?? 0;
  if (e === 1) {
    if (cur > 1) betMultiple.value = cur - 1;
  } else {
    betMultiple.value = clampBetCountInput(cur + 1) as number;
  }
};
// 输入过程中:只保留正整数(去小数、去负号、去前导0)并限制上限,允许清空以便重新输入
const enforceMaxValue = (e: Event) => {
  const val = sanitizeBetCountInput(e);
  if (val !== null) betMultiple.value = val;
};
const canSubmit = computed(() => Number(betMultiple.value) >= 1);
const betting = () => {
  if (!canSubmit.value) return;
  if (betMultiple.value * amount.value > balance.value) {
    return message.error(t("common.code_142"));
  }
  onBetting();
};
</script>

<style lang="scss" scoped>
.bet_body {
  height: 571px;
  width: calc(100% - 52px);
  margin: 22px auto 0;
  background: var(--darkBg, var(--bg_color_L2));
  box-shadow: var(--boxShadowColor-35);
  border-radius: 20px;
  padding: 14px 20px 19px 14px;
  position: relative;

  &-mark {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    color: var(--main-color);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    html:lang(ar) & {
      left: unset;
      right: 0;
      direction: ltr;
    }

    & > div {
      display: flex;
      align-content: center;
      justify-content: center;
      border-radius: 30px;
      background-color: var(--bg_color_L3);
      font-weight: 700;
      font-size: 280px;
      width: 240px;

      & + div {
        margin-left: 78px;
      }
    }
  }

  .color {
    height: 70px;
    display: flex;
    justify-content: space-between;

    & > div {
      width: calc((100% - 60px) / 3);
      height: 70px;
      line-height: 70px;
      font-weight: 500;
      font-size: 28px;
      color: #fff;
      text-align: center;
    }

    .green {
      background: var(--norm_green-color);
      border-radius: 0px 20px 0px 20px;
      box-shadow: var(--boxShadowColor-48);
    }

    .violet {
      background: var(--norm_Purple-color);
      box-shadow: var(--boxShadowColor-49);
      border-radius: 10px;
    }

    .red {
      background: var(--norm_red-color);
      border-radius: 20px 0 20px 0;
      box-shadow: var(--boxShadowColor-red);
    }
  }

  .betNum {
    height: 260px;
    margin-top: 26px;
    background: var(--bg_color_L1);
    border-radius: 20px;
    padding: 13px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    & > div {
      width: 110px;
      height: 50%;
      border-radius: 50%;
      font-weight: 400;
      text-align: center;
      background-repeat: no-repeat;
      background-size: 110px;
      background-position: center;

      &.active {
        transform: scale(0.9);
      }

      $list: 0 1 2 3 4 5 6 7 8 9;

      @each $i in $list {
        &.b#{$i} {
          background-image: url("@game/TrxWinGo/assets/trx2/img/n#{$i}.png");
        }
      }
    }
  }

  .ramd {
    margin-top: 22px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .l {
      width: 160px;
      height: 68px;
      line-height: 68px;
      text-align: center;
      border: 2px solid var(--darkLight, var(--norm_red-color));
      border-radius: 16px;
      font-size: 28px;
      color: var(--darkLight, var(--norm_red-color));
    }

    .r {
      height: 60px;
      width: 74px;
      line-height: 60px;
      font-size: 24px;
      color: var(--darkTextW, var(--text_color_L2));
      background: var(--bgDark-4, var(--bg_color_L1));
      border-radius: 16px;
      text-align: center;

      &.active {
        background: var(--norm_green-color);
        color: #fff;
      }
    }
  }

  .size {
    height: 72px;
    display: flex;
    margin-top: 20px;
    justify-content: center;

    & > div {
      width: 310px;
      height: 72px;
      line-height: 72px;
      text-align: center;
      font-size: 32px;
      color: #fff;
    }

    .big {
      background-color: var(--norm_secondary-color);
      border-radius: 40px 0px 0px 40px;
    }

    .small {
      background: var(--norm_bule-color);
      border-radius: 0 40px 40px 0;
    }
  }
}

.bet {
  background: #fff;
  max-width: 750px;
  margin: 0 auto;
  border-radius: 16px 16px 0 0;

  &-body {
    padding-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-size: 24px;
    color: #323536;
    background: var(--bg_color_L2);

    .head {
      height: 190px;
      position: relative;
      padding-top: 30px;

      .title {
        height: 44px;
        font-weight: 700;
        font-size: 36px;
        text-align: center;
        color: #fff;
      }

      .selectName {
        width: 560px;
        height: 50px;
        margin: 16px auto 0;
        background: #fff;
        border-radius: 10px;
        text-align: center;
        font-weight: 500;
        font-size: 26px;
        color: #000000;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
      }

      &::after {
        content: "";
        position: absolute;
        width: 50%;
        left: 0;
        bottom: 0;
        height: 59px;
        background-image: linear-gradient(
          9deg,
          var(--bg_color_L2) 50%,
          transparent 50%
        );
      }

      &::before {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        width: 50%;
        height: 59px;
        background-image: linear-gradient(
          -9deg,
          var(--bg_color_L2) 50%,
          transparent 50%
        );
      }
    }

    .l1 {
      font-size: 32px;
      color: var(--text_color_L1);
      height: 56px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;
      padding: 0 24px;

      & > div {
        &.title {
          width: fit-content;
          flex: none;
          height: auto;
          display: flex;
          align-items: center;
        }
      }

      .amount {
        display: flex;
        gap: 12px;

        & > div {
          padding: 0 16px;
          background: var(--bg_color_L3);
          border-radius: 10px;
        }
      }

      .multiples {
        display: flex;
        gap: 12px;

        & > div {
          padding: 0 16px;
          background: var(--bg_color_L3);
          border-radius: 10px;
        }
      }

      .m {
        display: flex;
        gap: 12px;

        & > div {
          padding: 0 16px;
          background-color: var(--norm_red-color);
          color: #fff;
          border-radius: 10px;
        }

        & > input {
          border: 1px solid var(--bg_color_L3);
          background-color: var(--bg_color_L1);
          padding: 2px 20px;
          width: 158px;
          margin: 0 12px;
          text-align: center;

          :deep(.van-field__control) {
            text-align: center;
            font-size: 28px;
            line-height: 54px;
          }
        }
      }

      .b14 {
        width: 120px;
        height: 80px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }

      .bred {
        background-color: var(--norm_red-color);
        box-shadow: 0px 4px 0px 0px #d5191d;
      }

      .bgreen {
        background-color: #13c164;
        box-shadow: 0px 4px 0px 0px #08aa61;
      }

      .bviolet {
        background-color: #b76bf2;
        box-shadow: 0px 4px 0px 0px #a043e8;
      }

      .bbig {
        background-color: #f8b460;
        box-shadow: 0px 4px 0px 0px #f49c30;
      }

      .bsmall {
        background-color: #609dec;
        box-shadow: 0px 4px 0px 0px #2d7fe9;
      }
    }

    .l2 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: fit-content;
      font-size: 28px;
      color: #323536;
      padding: 0 24px;

      .true {
        border-radius: 8px;
        border: 1px solid #e1e3f2;
        background: #f2f1f1;
        color: #f2f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;

        svg {
          width: 20px;
          height: 13px;
        }
      }

      span {
        color: var(--norm_red-color);
        cursor: pointer;
      }
    }

    .active {
      color: var(--text_color_L4);
    }
  }

  &-foot {
    height: 100px;
    display: flex;
    text-align: center;
    font-size: 28px;

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    &-c {
      flex: 1;
      background: var(--bg_color_L3);
      color: var(--text_color_L2);
    }

    &-s {
      flex: 2;
      background: var(--button_dis_color);
      color: var(--text_color_L4);

      &.disabled {
        opacity: 0.6;
      }

      span {
        font-size: 32px;
        font-weight: 700;
        color: var(--text_color_L4);
        margin-left: 4px;
      }
    }
  }

  &-green,
  &-1,
  &-3,
  &-7,
  &-9 {
    .head {
      background: var(--norm_green-color);
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_green-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_green-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_green-color);
    }
  }

  &-red,
  &-2,
  &-4,
  &-6,
  &-8 {
    .head {
      background: var(--norm_red-color);
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_red-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_red-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_red-color);
    }
  }

  &-0 {
    .head {
      background: linear-gradient(
        to bottom right,
        var(--norm_red-color) 50%,
        var(--norm_Purple-color) 0
      );
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_red-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_red-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_red-color);
    }
  }

  &-5 {
    .head {
      background: linear-gradient(
        to bottom right,
        var(--norm_green-color) 50%,
        var(--norm_Purple-color) 0
      );
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_green-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_green-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_green-color);
    }
  }

  &-violet {
    .head {
      background: var(--norm_Purple-color);
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_Purple-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_Purple-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_Purple-color);
    }
  }
  &-big {
    .head {
      background: var(--norm_secondary-color);
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_secondary-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_secondary-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_secondary-color);
    }
  }

  &-small {
    .head {
      background: var(--norm_bule-color);
    }

    .l1 {
      & > div:last-of-type {
        & > div.active {
          background: var(--norm_bule-color);
        }
      }

      .m {
        & > div {
          background-color: var(--norm_bule-color);
        }
      }
    }

    .bet-foot-s {
      background: var(--norm_bule-color);
    }
  }
}

.limit-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;

  th,
  td {
    border: 1px solid #e1e1e1;
    padding: 8px;
  }

  th {
    background-color: #f5f5f5;
  }

  td {
    background-color: #ffffff;
  }

  tbody th {
    font-size: 26px;
  }
}
</style>
