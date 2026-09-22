<template>
  <!-- 投注内容 begin -->
  <van-popup v-model:show="betDialog" style="box-shadow: 0px -18px 40px rgba(37, 37, 60, 0.26); " class="betPopup" :lock-scroll="false" position="bottom" :round="true"
    :overlay="false" :close-on-click-overlay="false">
    <div class="bet">
      <div class="bet-body">
        <div class="one">
          <div class="title" v-if="actNav === 0">{{ t('betPopDesc1') }}</div>
          <div>
            <div v-for="item of playBet">
              <div class="bet-title" v-if="actNav !== 0">{{ $t(item.name) }}</div>
              <ul v-if="item.code === 'SumNum'" class="bet-nums">
                <li v-for="bet of item.list"
                  :class="[bet.playBet, bet.playType, bet.playBet % 2 === 0 && !['Big', 'Small', 'Odd', 'Even'].includes(bet.playBet) ? 'green' : 'red num' + bet.playBet]">
                  <template v-if="['Big', 'Small', 'Odd', 'Even'].includes(bet.playBet)">
                    {{ t(`${BetEnum[bet.playBet]}`) }}
                  </template>
                  <template v-else>
                    {{ bet.playBet }}
                  </template>
                </li>
              </ul>
              <ul v-if="['NumSame2', 'NumSame3', 'NumDiff3', 'NumDiff2'].includes(item.code)" class="bet-dices">
                <li v-for="bet of item.list" :class="[bet.playBet]">
                  <div class="popup-type2-d" >{{bet.playBet}}</div>
                </li>
              </ul>
              <ul v-if="item.code === 'NumSame2Mult'" class="bet-dices">
                <li v-for="bet of item.list" :class="['popup-type2-o',bet.playBet]">
                  <div :class="['number' + num]" v-for="num of bet.playBet?.split('+')">
                    {{ formattedString(num) }}
                  </div>
                </li>
              </ul>
              <div v-if="item.code === 'NumNear3All'" class="bet-all">
                {{ $t('k3RecordDesc7') }}
              </div>
              <div v-if="item.code === 'NumSame3All'" class="bet-all">
                {{ $t('k3bet3Desc4') }}
              </div>
            </div>
          </div>
        </div>
        <div class="l1 Betting__Popup-body-line">
          <div class="title">{{ $t('amount') }}</div>
          <div class="amount">
            <div v-for="(c, k) in betScopes" :key="k" :class="{ active: c == amount }" @click="amount = c">
              {{ formatNum(c) }}
            </div>
          </div>
        </div>
        <div class="l1 Betting__Popup-body-line">
          <div class="title">{{ $t('numbers') }}</div>
          <div class="m">
            <div @click="Stepper(1)">-</div>
            <input v-model="betMultiple" class="Betting__Popup-input" type="number" @input="enforceMaxValue" />
            <!-- <van-field
						class="Betting__Popup-input"
						v-model="betMultiple"
						type="number"
						:maxlength="4"
						@input="enforceMaxValue"
					/> -->
            <div @click="Stepper(2)">+</div>
          </div>
        </div>
        <div class="l1 Betting__Popup-body-line">
          <div class="title"></div>
          <div class="multiples">
            <div v-for="(m, k) in betMultiples" :key="k" :class="{ active: m === betMultiple }"
              @click="betMultiple = m">
              X{{ m }}
            </div>
          </div>
        </div>
        <div class="l2">
            <van-checkbox v-model="agreePreSale" checked-color="var(--main-color)">
                {{ $t('agree') }}
                <span class="rules" @click.stop="showPreSale = true">{{ $t('presaleRules') }}</span>
            </van-checkbox>
        </div>
      </div>
      <div class="bet-foot">
        <div class="bet-foot-c" @click="onClearBet">
          {{ t('cancel') }}
        </div>
        <div class="bet-foot-s" :class="{ disabled: loading || !canSubmit }" @click="betting">
          {{ t('totalAmount') }} <span>{{ currency((betMultiple * amount || 0) * allBets) }}</span>
        </div>
      </div>
    </div>
  </van-popup>
  <!-- 预售规则弹层 begin-->
  <van-popup v-model:show="showPreSale" :close-on-click-overlay="false" round>
    <BetRule :title="t('presaleRules')" @close="showPreSale = false">
      {{ $t('betPopTXT') }}
    </BetRule>
  </van-popup>
  <van-popup v-model:show="betLimitDialog" @open="getBetLimit" :close-on-click-overlay="false" round>
    <BetRule :title="$t('common.limit')" @close="betLimitDialog = false">
      <div class="flex-center" style="height: 100%" v-if="betLimitLoading">
        <van-loading type="spinner" color="#FD565C" />
      </div>
      <table class="limit-table" v-else>
        <thead>
          <tr>
            <th>{{ t('common.play') }}</th>
            <th>{{ t('common.choice') }}</th>
            <th>{{ t('common.limit') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of betLimit">
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
import { computed, ref, } from 'vue';
import { formatNum, sanitizeBetCountInput, clampBetCountInput } from '@/saasLottery/utils';
import { useI18n } from 'vue-i18n';
import {currency} from "@/utils";
import { BetRule } from '@/saasLottery/components';
import { useK3Context } from "../../hooks";
import { useGlobalContext, useToast } from "@/saasLottery/hooks";
import { BetEnum } from "@/saasLottery/utils/enum";
const { t } = useI18n();
const {
  betMultiple,
  betMultiples,
  playBet,
  agreePreSale,
  betDialog,
  betScopes,
  amount,
  loading,
  betLimitLoading,
  betLimit,
  onClearBet,
  onBetting,
  getBetLimit
} = useK3Context()
const { balance, } = useGlobalContext();
const message = useToast()
const props = defineProps({
	actNav: {
		type: Number,
		default: 0
	}
})
const calculateCombinations = (arrayLength: number, combinationLength: number): number => {
  if (combinationLength > arrayLength || combinationLength < 0) return 0;

  // 优化的组合数计算方法
  let result = 1;
  for (let i = 0; i < combinationLength; i++) {
    result *= arrayLength - i;
    result /= i + 1;
  }
  return result;
};
const formattedString = (str) =>{
  return str.replace(/_/g, ",");
}
const allBets = computed(() => {
  const numSame = playBet.value.filter((item) => item.code === 'NumSame2Mult');
  const count: any = numSame.map((item) => item.list.map((bet) => {
    const code = bet.playBet?.split('+')[1];
    return code?.split('_').lengthcon
  })).flat() || []
  const num = playBet.value.filter((item) => (item.code !== 'NumSame2Mult' && item.code !== 'NumDiff3' && item.code !== 'NumDiff2')).map((item) => item.list.length);
  const NumDiff3 = calculateCombinations(playBet.value.filter((item) => item.code === 'NumDiff3')[0]?.list.length || 0, 3);
  const NumDiff2 = calculateCombinations(playBet.value.filter((item) => item.code === 'NumDiff2')[0]?.list.length || 0, 2);
  console.log('num.value', NumDiff3);
  console.log('num.value', NumDiff2);
  return num.reduce((acc, cur) => acc + cur, 0) + count.reduce((acc, cur) => acc + cur, 0) + NumDiff3 + NumDiff2;
})
const showPreSale = ref(false);
const betLimitDialog = ref(false);
// 份数加减
const Stepper = (e: number) => {
  const cur = clampBetCountInput(betMultiple.value) ?? 0;
  switch (e) {
    case 1:
      if (cur > 1) betMultiple.value = cur - 1;
      break;
    case 2:
      betMultiple.value = clampBetCountInput(cur + 1) as number;
      break;
    default:
  }
};
// 输入过程中:只保留正整数(去小数、去负号、去前导0)并限制上限,允许清空以便重新输入
const enforceMaxValue = (e: Event) => {
  const val = sanitizeBetCountInput(e);
  if (val !== null) betMultiple.value = val;
}
const canSubmit = computed(() => Number(betMultiple.value) >= 1)
const betting = () => {
  if (!canSubmit.value) return
  if ((betMultiple.value * amount.value * allBets.value) > balance.value) {
    return message.error(t('common.code_142'))
  }
  onBetting()
}
</script>

<style lang="scss" scoped>
@media (min-width: 501px) {
  .betPopup{
    max-width: 10rem;
    left: 50%;
    transform: translateX(-50%);
  }
}

.bet {
  background: #fff;
  max-width: 750px;
  margin: 0 auto;
  border-radius: 32px 32px 0px 0px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);

  &-body {
    padding: 25px 30px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-size: 24px;
    color: var(--text_color_L1);
    background: var(--bg_color_L2);
    .one {
      .title {
        color: var(--text_color_L1);
      }
    }
    .l1 {
      height: fit-content;
      display: flex;

      &>div {
        &.title {
          width: 138px;
          height: auto;
          display: flex;
          align-items: center;
        }
      }

      &.Betting__Popup-body-line {
        font-size: 32px;
        color: var(--text_color_L1);
        height: 56px;
        line-height: 56px;
        display: flex;
        justify-content: space-between;
      }

      .amount {
        display: flex;
        justify-content: space-between;

        &>div {
          padding: 0 16px;
          background: var(--bg_color_L3);
          color: var(--text_color_L2);
          border-radius: 6px;

          &.active {
            background:var(--main-color);
            color: #fff;
          }

          &+div {
            margin-left: 12px;
          }
        }
      }

      .multiples {
        display: flex;
        &>div {
          padding: 0 16px;
          background: var(--bg_color_L3);
          color: var(--text_color_L2);
          border-radius: 6px;

          & + div {
            margin-left: 12px;
				}
        &.active {
          background: var(--main-color);
          color: #fff;
        }
      }
    }
      .m {
        display: flex;

        &>div {
          width: 56px;
          height: 56px;
          text-align: center;
          font-size: 50px;
          padding: 0;
          background: var(--main-color);
          color: #fff;
          flex: none;
          border-radius: 6px;

        }

        .Betting__Popup-input {
          padding: 2px 20px;
          width: 158px;
          margin: 0 12px;
          background-color: var(--bg_color_L1);
          color: var(--text_color_L1);
          text-align: center;
          font-size: 28px;
          line-height: 54px;
          border: none;
          &::after {
            content: none;
          }
        }
      }
    }

    .l2 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: fit-content;
      font-size: 28px;
      color: var(--text_color_L2);

      &>div {
        display: flex;
        align-items: center;
        gap: 24px;
      }

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
        margin-left: 26px;
        font-size: 24px;
        color: var(--norm_red-color);
        cursor: pointer;
      }
    }

    .active {
      background:var(--main-color);
      color: #fff;
      border-color: var(--main-color);
    }
  }

  &-foot {
    height: 100px;
    display: flex;
    text-align: center;
    font-size: 28px;

    &>div {
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
      background: var(--main-color);
      color: var(--text_color_L4);

      &.disabled {
        opacity: 0.6;
      }

      span {
        margin-left: 4px;
      }
    }
  }

  &-title {
    color: var(--text_color_L1);
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 6px;
    margin-top: 10px;
  }

  &-nums {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    li {
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      height: 48px;
      line-height: 48px;
    }

    li.SumNum {
      width: 48px;
      text-align: center;
      background: #b5b5b5;
      border-radius: 48px;
      font-size: 24px;
      color: #fff;
      margin: 4px;

      &.red {
        background-color: var(--norm_red-color);
      }

      &.green {
        background-color: var(--norm_green-color);
      }

    }

    li.SumBigSmall,
    li.SumOddEven {
      font-weight: normal;
      color: #fff;
      background-color: var(--norm_secondary-color);
      border-radius: 8px;
      width: 80px;
      font-size: 24px !important;
    }

  }

  &-dices {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    li {
      // display: flex;
      // padding: 16px 12px;
      // justify-content: center;
      // align-items: center;
      // gap: 8px;
      // border-radius: 8px;
      // background: #F0F1F7;
      // text-align: center;

      .popup-type2-d{
        height: 44px;
        background: var(--norm_Purple-color);
        border-radius: 8px;
        color: var(--text_color_L1);
        line-height: 44px;
        text-align: center;
        margin: 2px 4px;
        font-size: 24px;
        padding: 0 18px;
      }
      &.popup-type2-o{
        height: 44px;
        display: flex;
        align-items: center;
        
        border-radius: 8px;
        text-align: center;
        overflow: hidden;
        font-size: 24px;

        & + div {
          margin-left: 10px;
        }

        :deep(div) {
          height: 100%;
          line-height: 44px;
          padding: 0 10px;
          flex: none;
          color: var(--text_color_L1);
          background: var(--norm_red-color);
          &:last-child {
            background-color: var(--norm_green-color);
          }
        }
      }
    }
  }

  &-all {
    width: max-content;
			height: 44px;
			line-height: 44px;
			padding: 0 42px;
			background: var(--norm_red-color);
			border-radius: 8px;
			font-size: 24px;
			color: var(--text_color_L1);
			margin-bottom: 16px;
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
