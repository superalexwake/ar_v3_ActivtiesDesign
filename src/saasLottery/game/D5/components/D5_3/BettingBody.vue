<template>
  <!-- 彩种类型选择 -->
  <div class="FDB__C-nav">
    <div
        v-for="(item, index) in navList"
        :key="index"
        :class="{ active: actNav.name == `${item.name}`}"
        @click="emit('changeType', index, item)"
    >
      {{ item.name }}
    </div>
  </div>
  <!-- 大小奇偶选择 -->
  <div class="FDB__C-H">
    <div
        v-for="(item, index) in bigSmallEven"
        :key="index"
        :class="{ active: onTabID == index+1,[item?.playBet]:true }"
        @click="emit('onTab', index+1,item)"
    >
      <span>{{ $t(`${BetEnum[item?.playBet]}`) }}</span>
      <span>{{ item?.playRate }}X</span>
		<!--<span>{{ item?.playBet }}</span>-->
		<!--<span>{{ item?.playRate }}</span>-->
    </div>
  </div>

  <!-- 球选择 -->
  <div class="FDB__C-Num">
    <template v-if="actNav?.name !== 'SUM'">
      <div
          v-for="(item, index) in numList"
          :key="index"
          :txt="index"
          :class="{ active: numberChack[index] }"
          @click="emit('numberTab',index,item)"
      >
        <div class="round">{{ index}}</div>
        <div class="rate">
          {{item.playRate}}X
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import {BetEnum} from "@/saasLottery/utils/enum";
withDefaults(
    defineProps<{
      navList: any
      actNav: any
      bigSmallEven: any
      numList: any
      onTabID: any
      numberChack: any
    }>(),
    {}
)
const emit = defineEmits(['changeType', 'onTab', 'numberTab'])
</script>
<style lang="scss" scoped>
.FDB__C {
  &-nav {
    display: flex;
    border-bottom: 1px solid var(--Dividing-line_color);

    & > div {
      width: 80px;
      height: 80px;
      line-height: 80px;
      background: var(--bg_color_L3);
      font-size: 36px;
      font-weight: 700;
      color: var(--text_color_L1);
      border-radius: 40px 40px 0 0;
      position: relative;
      margin-right: 20px;
      text-align: center;

      &:last-child {
        font-size: 32px;
      }

      &.active {
        background:var(--main-color);
        color:var(--text_color_L4);
        &::after {
          background:radial-gradient(circle at 100% 0, transparent 20px, var(--main-color) 20px);
        }
      }

      &::after {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: 0;
        right: -20px;
        z-index: 9;
        html:lang(ar) &{
          left: -20px;
          right: unset;
        }
      }
    }
  }

  &-H {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 66px;
    line-height: 66px;
    margin-top: 24px;
    font-size: 26px;
	color: var(--text_color_L2);

    & > div {
      width: calc((100% - 102px) / 4);
      height: 100%;
      border-radius: 10px;
      padding: 0 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      color: #fff;
      opacity: 0.5;
      &.Big {
        background: var(--norm_secondary-color);
      }

      &.Small {
        background: var(--norm_bule-color);
      }

      &.Even {
        background: var(--norm_green-color);
      }

      &.Odd {
        background: var(--norm_red-color);
      }

      &.active {
        opacity: 1;
      }
    }
  }

  &-Num {
    padding: 26px 0 0 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 250px;

    & > div {
      width: 20%;
      height: 50%;

      .round {
        width: 66px;
        height: 66px;
        border: 1px solid var(--text_color_L3);
        border-radius: 50%;
        color: var(--text_color_L3);
        font-size: 28px;
        text-align: center;
        line-height: 66px;
        margin: auto;
      }

      .rate {
        line-height: 24px;
        font-size: 24px;
        color: var(--text_color_L2);
        text-align: center;
      }

      &.active {
        .round {
          background:var(--main-color);
          border: 1px solid var(--main-color);
          color: var(--text_white);
        }
      }
    }
  }
}
</style>
