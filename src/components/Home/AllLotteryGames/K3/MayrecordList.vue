<template>
  <div class="MyGameRecordList__C">
    <template v-for="(item, index) in mayrecord" :key="index">
      <div class="MyGameRecordList__C-item" @click.stop.prevent="Emerd(index)">
        <div
          class="MyGameRecordList__C-item-l"
          :class="['MyGameRecordList__C-item-l-' + colorClass(item)]"
        >
          {{ changeText(item) }}
        </div>
        <div class="MyGameRecordList__C-item-m">
          <div class="MyGameRecordList__C-item-m-top">
            {{ item.issueNumber }}
          </div>
          <div class="MyGameRecordList__C-item-m-bottom">{{ item.addTime }}</div>
        </div>
        <div
          v-if="item.profitAmount"
          class="MyGameRecordList__C-item-r"
          :class="{ success: item.state }"
        >
          <div v-if="item.profitAmount" :class="{ success: item.state }">
            {{ item.state ? $t("success") : $t("fail") }}
          </div>
          <span>{{ `${item.state ? "+" : "-"}${currency(item.profitAmount)}` }}</span>
        </div>
      </div>
      <div v-if="index == showIndexRe" class="MyGameRecordList__C-detail">
        <div class="MyGameRecordList__C-detail-text">{{ $t("detailMay") }}</div>
        <div class="MyGameRecordList__C-detail-line" v-if="item.orderNumber">
          {{ $t("orderNoMay") }}
          <div @click="copy(item.orderNumber)">
            {{ item.orderNumber }}
            <svg-icon name="copy" />
          </div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("issueMay") }}
          <div>{{ item.issueNumber }}</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("amountMay") }}
          <div>{{ currency(item.amount) }}</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("numMay") }}
          <div>{{ item.betCount }}</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("afterTaxAmount") }}
          <div class="red">{{ currency(item.realAmount) }}</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("tax") }}
          <div>{{ currency(item.fee) }}</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("resultMay") }}
          <div class="numList" v-if="item.premium">
            <div
              v-for="(num, index) in item.premium"
              :key="index"
              :class="['n' + num]"
            ></div>
          </div>
          <div v-else>--</div>
        </div>
        <div class="MyGameRecordList__C-detail-line noLine">
          {{ $t("selectMay") }}
          <div class="line1" v-if="item.gameType == 1">
            <template v-if="item.oneList.length > 0">
              <span>{{ $t("k3RecordDesc1") }}</span>
              <span v-for="(li, index) in item.oneList" :key="index + '1'" class="btn">
                {{ betnumName(li) }}
              </span>
            </template>
          </div>
          <!-- 2个相同的数字 -->
          <div class="line1" v-if="item.gameType == 2">
            <template v-if="item.oneList.length > 0">
              <span class="">{{ $t("k3RecordDesc2") }}</span>
              <span
                class="btn actionViolet"
                v-for="(li, index) in item.oneList"
                :key="index + '1'"
                >{{ li }}</span
              >
            </template>
            <template v-if="item.towList.length > 0">
              <span class="">{{ $t("k3RecordDesc3") }}</span>
              <span
                class="btn actionRedGreen"
                v-for="(li, index) in item.towList"
                :key="index + '1'"
                >{{ li }}</span
              >
            </template>
          </div>
          <div class="line1" v-if="item.gameType == 3">
            <template v-if="item.oneList.length > 0">
              <span class="">{{ $t("k3RecordDesc4") }}</span>
              <span
                class="btn actionViolet"
                v-for="(li, index) in item.oneList"
                :key="index + '1'"
                >{{ li }}
              </span>
            </template>
            <div class="btn actionBtn" v-if="item.towList">{{ $t("k3RecordDesc5") }}</div>
          </div>
          <!-- 不同的号码 -->
          <div class="line1" v-if="item.gameType == 4">
            <template v-if="item.oneList.length > 0">
              <span class="">{{ $t("k3RecordDesc6") }}</span>
              <span
                class="actionViolet"
                v-for="(li, index) in item.oneList"
                :key="index + '1'"
                >{{ li }}</span
              >
            </template>
            <div class="actionBtn" v-if="item.towList">{{ $t("k3RecordDesc7") }}</div>
            <template v-if="item.threeList.length > 0">
              <span class="">{{ $t("k3RecordDesc8") }}</span>
              <span
                class="actionViolet"
                v-for="(li, index) in item.threeList"
                :key="index + '1'"
                >{{ li }}</span
              >
            </template>
          </div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("statusMay") }}
          <div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
            {{ item.state ? $t("success") : $t("fail") }}
          </div>
          <div v-else>{{ $t("k3RecordDesc9") }}</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("winOrLose") }}
          <div v-if="item.state != 2" :class="[item.state ? 'green' : 'red']">
            {{ `${item.state ? "+" : "-"} ${currency(item.profitAmount)}` }}
          </div>
          <div v-else>--</div>
        </div>
        <div class="MyGameRecordList__C-detail-line">
          {{ $t("createTime") }}
          <div>{{ item.addTime }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { currency, copy } from "@/utils";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(defineProps<{ mayrecord: any[] }>(), {});

const showIndexRe = ref(-1);

// 归一玩法:1=Total 2=二同类 3=三同类 4=不同号类
// 二同一不同在游戏内页是数组 towList,在独立记录页是 Boolean(towList)+towListArr，故只认数组
const betParts = (item: any) => {
  const gt = String(item.gameType);
  const one: string[] = item.oneList || [];
  const three: string[] = item.threeList || [];
  const pairOne: string[] = Array.isArray(item.towListArr)
    ? item.towListArr
    : Array.isArray(item.towList)
      ? item.towList
      : [];
  return { gt, one, three, pairOne, anyAll: (gt === "3" || gt === "4") && item.towList === true };
};

// 单注:仅一个来源且恰好为基础位数(三不同=3、二不同=2,其余=1)
const isSingleBet = (p: any) => {
  if (p.gt === "1") return p.one.length === 1;
  if (p.gt === "2") return p.one.length + p.pairOne.length === 1;
  if (p.gt === "3") return p.one.length + (p.anyAll ? 1 : 0) === 1;
  const src = (p.one.length ? 1 : 0) + (p.three.length ? 1 : 0) + (p.anyAll ? 1 : 0);
  if (src !== 1) return false;
  if (p.anyAll) return true;
  return p.one.length ? p.one.length === 3 : p.three.length === 2;
};

/**
 * 映射縂投注名稱
 * @param name 映射的名称
 */
const betnumName = (name: string) => {
  switch (name) {
    case "H":
      return t("k3Big");
    case "L":
      return t("k3Small");
    case "O":
      return t("k3Odd");
    case "E":
      return t("k3Even");
    default:
      return name;
  }
};
/**
 * 点击展示详情
 * @param index 展示详情
 */
const Emerd = (index: number) => {
  if (showIndexRe.value == index) {
    showIndexRe.value = -1;
  } else {
    showIndexRe.value = index;
  }
};
const changeText = (item: any) => {
  const p = betParts(item);
  // 二同一不同:单组(对子|单号)为一注,显号码拼接(如 33|2,4 → 3324)
  if (p.pairOne.length === 1 && !p.one.length && !p.three.length && !p.anyAll)
    return p.pairOne[0].replace(/[|,]/g, "");
  if (p.pairOne.length || !isSingleBet(p)) return t("betMulti");
  if (p.anyAll) return p.gt === "3" ? "AAA" : "ABC";
  if (p.gt === "4") return (p.one.length ? p.one : p.three).join("");
  const map: Record<string, string> = { H: "Big", L: "Small", O: "Odd", E: "Even" };
  return map[p.one[0]] ?? p.one[0];
};

// 色块背景：指定号码类紫；混入二同一不同/任意三同/三连号通选/大小单双 → 红绿对角
const colorClass = (item: any) => {
  const p = betParts(item);
  if (p.pairOne.length) return "multiMixed";
  if (p.anyAll && (p.one.length || p.three.length)) return "multiMixed";
  if (p.gt === "3" || p.gt === "4") return p.anyAll ? "combo" : "same";
  if (p.gt === "2") return "same";
  // Total 类:多选按全奇红/全偶绿/混合红绿，混入大小单双也算混合
  const nums = p.one.filter((v: string) => /^\d+$/.test(v)).map(Number);
  if (p.one.length > 1) {
    if (nums.length !== p.one.length) return "multiMixed";
    const hasOdd = nums.some((n: number) => n % 2 === 1);
    const hasEven = nums.some((n: number) => n % 2 === 0);
    if (hasOdd && hasEven) return "multiMixed";
    return hasOdd ? "multiOdd" : "multiEven";
  }
  const map: Record<string, string> = { H: "big", L: "small", O: "odd", E: "even" };
  const v = p.one[0];
  if (map[v]) return map[v];
  if (!/^\d+$/.test(v ?? "")) return "combo";
  return Number(v) % 2 === 0 ? "evenNum" : "oddNum";
};
</script>
<style lang="scss" scoped>
@import "../MyGameRecord.scss";

// 大小沿用 MyGameRecord.scss 的 -big/-small（橙/蓝）
.MyGameRecordList__C-item-l {
  &-odd,
  &-even,
  &-combo {
    font-size: 24px;
  }
  &-odd,
  &-oddNum,
  &-combo {
    background-color: var(--norm_red-color);
  }
  &-even,
  &-evenNum {
    background-color: var(--norm_green-color);
  }
  &-same {
    background-color: var(--norm_Purple-color);
  }
  &-multiOdd,
  &-multiEven,
  &-multiMixed {
    font-size: 24px;
  }
  &-multiOdd {
    background-color: var(--norm_red-color);
  }
  &-multiEven {
    background-color: var(--norm_green-color);
  }
  &-multiMixed {
    background-image: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_green-color) 50%);
  }
}

.MyGameRecordList__C {
  &-detail {
    &-line {
      .numList {
        display: flex;
        align-items: center;
        height: 100%;

        & > div {
          height: 36px;
          width: 36px;
          background-repeat: no-repeat;
          background-size: 36px;
          background-position: center;
          border-radius: 0;
          border: 0;
          $list: 1 2 3 4 5 6;

          @each $i in $list {
            &.n#{$i} {
              background-image: url("@icon/AllGames/n#{$i}.png");
            }
          }

          & + div {
            margin-left: 8px;
          }
        }
      }
    }
  }
  &-item {
    &-l {
      height: 72px;
      width: 72px;
      line-height: normal;
      text-align: center;
      border-radius: 20px;
      color: #fff;
      font-size: 48px;
      margin-right: 22px;
      flex: none;
      // 不设默认背景，色块颜色全由 colorClass 类决定（旧 --main-color 会覆盖 -same/-even 等）
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      word-wrap: break-word;
      word-break: break-all;

      &-H {
        background-color: var(--norm_secondary-color);
      }

      &-L {
        background-color: var(--norm_bule-color);
      }

      &-O {
        background: var(--norm_red-color);
      }

      &-E {
        background: var(--norm_green-color);
      }
      &-num {
        font-size: 24px;
      }
    }
  }
}
</style>
