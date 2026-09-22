<template>
  <div class="vip-content-card">
    <div class="vip-content-card-item">
      <swiper
        class="my-swipe"
        :slidesPerView="'auto'"
        :centeredSlides="true"
        :space-between="20"
        @slideChangeTransitionEnd="onSlideChange"
        @swiper="setControlledSwiper"
      >
        <swiper-slide
          :class="`itemInfo level${itemL.id}`"
          v-for="itemL in levelInfoListShow"
          :key="itemL.id"
        >
          <!--status:2 已达成-->
          <template v-if="itemL?.status == 2 && itemL.id != level">
            <div class="itemInfo-right">
              <img :src="getVipLogo(itemL.id)" />
            </div>
            <div class="itemInfo-head">
              <div>
                <img
                  :src="getVipCrown(itemL.id)"
                />
                <h1 :class="`level${itemL.id != 1 ? 2 : itemL.id}`">
                  {{ itemL.vipName }}
                </h1>
                <img src="@public/vip/swiper/HaveReached.png" />
                <span class="bgg">{{ $t("achieved") }}</span>
              </div>
              <div class="border" :class="`level${itemL.id}`">
                <p v-html="$t('vipTip1', [itemL.id, itemL.id])"></p>
              </div>
            </div>
            <div class="itemInfo-bottom mt50">
              <h2 v-if="itemL.upgradeStatus == 2" :class="`level${itemL.id}`">
                {{ $t("vipTip3", [itemL.id]) }}
              </h2>
              <h2 v-else :class="`level${itemL.id}`">{{ $t("vipTip14", [itemL.id]) }}</h2>
            </div>
          </template>

          <template v-if="itemL?.id == level">
            <div class="itemInfo-right">
              <img :src="getVipLogo(itemL.id)" />
            </div>
            <div class="itemInfo-head">
              <div>
                <img
                  :src="getVipCrown(itemL.id)"
                />
                <h1 :class="`level${itemL.id != 1 ? 2 : itemL.id}`">
                  {{ itemL.vipName }}
                </h1>
                <img src="@public/vip/swiper/HaveReached.png" />
                <span class="bgg">{{ $t("achieved") }}</span>
              </div>
              <div class="border mb25" :class="`level${itemL.id}`">
                <p v-html="$t('vipTip1', [itemL.id, itemL.id])"></p>
              </div>
              <div class="mb8">{{ $t("vipcondition") }}</div>
            </div>
            <div class="itemInfo-bottom">
              <div class="first">
                <div class="left">
                  <span :class="`level level${itemL.id}`">
                    {{
                      haspermission
                        ? getRelegationExp(itemL.relegationExp, itemL.relegation)
                        : 0
                    }}/{{ itemL.relegation }}
                  </span>
                </div>
                <p class="right">
                  {{
                    $t("completed1", [
                      getMath(
                        haspermission
                          ? getRelegationExp(itemL.relegationExp, itemL.relegation)
                          : 0,
                        itemL.relegation
                      ),
                    ])
                  }}
                </p>
              </div>

              <div>
                <van-progress
                  :class="`level${itemL.id}`"
                  :percentage="
                    getMath(
                      haspermission
                        ? getRelegationExp(itemL.relegationExp, itemL.relegation)
                        : 0,
                      itemL.relegation
                    )
                  "
                  stroke-width="8"
                  color="linear-gradient(180deg, #FFFCE7 0%, #FFC821 100%)"
                  :track-color="trackColor[itemL.id]"
                  :show-pivot="false"
                />
              </div>
              <div>
                <span v-html="$t('vipTip2', [itemL.deductExp])"></span>
              </div>
            </div>
          </template>
          <!--status:1 未解锁-->
          <template v-if="itemL?.status == 1 && itemL?.id != level">
            <div class="itemInfo-right">
              <img :src="getVipLogo(itemL.id)" />
            </div>
            <div class="itemInfo-head">
              <div>
                <img
                  :src="getVipCrown(itemL.id)"
                />
                <h1 :class="`level${itemL.id != 1 ? 2 : itemL.id}`">
                  {{ itemL.vipName }}
                </h1>
                <img src="@public/vip/swiper/ununlocked.png" />
                <span>{{ $t("notUnlocked") }}</span>
              </div>
              <div class="mb30">
                <p
                  v-html="$t('experience', [itemL.id, itemL.upgrade - itemL.currentExp])"
                ></p>
              </div>
              <div class="border" :class="`level${itemL.id}`">
                {{ $t("experience1", [dollarSign, itemL.amount]) }}
              </div>
            </div>
            <div class="itemInfo-bottom">
              <p>{{ itemL.vipName }}</p>
              <div>
                <van-progress
                  :class="`level${itemL.id}`"
                  :percentage="
                    getMath(haspermission ? itemL.currentExp : 0, itemL.upgrade)
                  "
                  stroke-width="8"
                  color="linear-gradient(180deg, #FFFCE7 0%, #FFC821 100%)"
                  :track-color="trackColor[itemL.id]"
                  :show-pivot="false"
                />
              </div>
              <div>
                <span :class="`level level${itemL.id}`"
                  >{{ haspermission ? itemL.currentExp : 0 }}/{{ itemL.upgrade }}</span
                >
                <span>{{ $t("upgrade", [itemL.upgrade]) }}</span>
              </div>
            </div>
          </template>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { AwaitApiResult } from "@/utils";
import { useAssets } from "@/hooks/useAssets";
import { ref } from "vue";
import { GetVipUserLevelDetail } from "@/api";
import type { ResGetVipUserLevelDetail } from "@/types/api";
import { SettingStore } from "@/stores";
import { computed } from "vue";

const { getVipLogo, getVipCrown } = useAssets();

const level = ref(0);
const emits = defineEmits<{
  (e: "changeLevel", val: number): void;
}>();

//不同等级设置不同轨道颜色
let trackColor: any = {
  1: "#748AAA",
  2: "#D67D26",
  3: "#F05C5C",
  4: "#32B6E8",
  5: "#EA6ACA",
  6: "#1EB18B",
  7: "#1B9458",
  8: "#3470E6",
  9: "#8038F5",
  10: "#EF7B27",
};

let controlledSwiper: any = ref();
function setControlledSwiper(swiper: any) {
  controlledSwiper = swiper;
}

const props = defineProps({
  haspermission: {
    // 当期游戏期号，以及倒计时时间等参数。
    type: Boolean,
    default: () => true,
  },
});
//滑动轮播图事件，首页加载时不让触发
const isFirst = ref(true);
const onSlideChange = (swiper: any) => {
  if (isFirst.value) return;
  emits("changeLevel", levelInfoListShow.value[swiper.activeIndex].id);
};

const levelInfoListShow = ref<ResGetVipUserLevelDetail[]>([]); //vip初始信息
async function getVipUserLevelDetail() {
  const res = await AwaitApiResult(GetVipUserLevelDetail());
  if (res) {
    levelInfoListShow.value = res?.data;
    let index = levelInfoListShow.value.findIndex((el) => {
      return el.id == level.value;
    });
    controlledSwiper.slideTo(index == -1 ? 0 : index);
    //存储投注比例
    // let vipAmount = levelInfoListShow.value.find((item) => item.status == 1)?.amount
    let vipAmount =
      levelInfoListShow.value.length > 0 ? levelInfoListShow.value[0]?.amount : 1000;
    sessionStorage.setItem("vipAmount", (vipAmount as unknown) as string);
  }
  isFirst.value = false;
}

//处理百分比数据
function getMath(num1: number, num2: number) {
  if (!num2 || !num2) return 0;
  if (num1 > num2) return 100;
  return Math.round((num1 / num2) * 10000) / 100.0;
}
//获取已完成保级条件
function getRelegationExp(relegationExp: number, relegation: number) {
  return relegationExp > relegation ? relegation : relegationExp;
}
const dollarSign = computed(() => SettingStore().getDollarSign);
defineExpose({
  getVipUserLevelDetail,
  level,
});
</script>

<style lang="scss" scoped>
.vip-content-card {
  min-height: 300px;
  .mb25 {
    margin-bottom: 25px;
  }

  .mt50 {
    margin-top: 70px;
  }

  .mb8 {
    margin-bottom: 8px;
  }

  .mb30 {
    margin-bottom: 30px;
  }

  //文本渐变色-由上到下
  @mixin h1Bg($color1: #ffffff, $color2: #ffffff, $percentage: 0%) {
    background: linear-gradient(180deg, $color1 $percentage, $color2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bgg {
    @include h1Bg(#f3ffdd, #a6ff7d);
  }

  .itemInfo {
    border-radius: 10px;
    width: 572px;
    min-height: 315px;
    color: #fff;
    font-weight: 400;
    font-size: 22px;
    padding: 15px 20px;
    position: relative;

    &-right {
      position: absolute;
      right: 10px;
      top: 10px;
      html:lang(ar) & {
        left: 10px;
        right: unset;
      }
      img {
        width: 140px;
        height: auto;
      }
    }

    &-head {
      > div:nth-of-type(1) {
        display: flex;
        flex-direction: row;
        align-items: center;

        > img:nth-of-type(1) {
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }

        > h1 {
          font-weight: 900;
          font-size: 48px;
          margin-right: 20px;

          //顶部vip的文本渐变色
          &.level1 {
            @include h1Bg(#ffffff, #d0dae6, 39.98%);
          }

          &.level2 {
            @include h1Bg(#fff9d6, #ffe650, 39.98%);
          }
        }

        > img:nth-of-type(2) {
          width: 30px;
          margin-right: 5px;
        }
      }

      > div.border {
        border-radius: 6px;
        padding-top: 2px;
        padding-bottom: 2px;
        display: inline-block;
        padding: 0 8px;

        :deep(h3) {
          display: inline;
        }

        :deep(h3.level1) {
          color: #fff;
        }

        :deep(h3.level2) {
          @include h1Bg(#f09238, #d26d0a);
        }

        :deep(h3.level3) {
          @include h1Bg(#ff767e, #e93a42);
        }

        :deep(h3.level4) {
          @include h1Bg(#25c9fd, #096cfe);
        }

        :deep(h3.level5),
        :deep(h3.level6),
        :deep(h3.level7),
        :deep(h3.level8),
        :deep(h3.level9),
        :deep(h3.level10) {
          @include h1Bg(#fffdf3, #eeff2b);
        }

        //设置.border的边框颜色
        $colorBR: (
          1: #c4d2e7,
          2: #ffe2c5,
          3: #ffd2ca,
          4: #d6faff,
          5: #fee0ff,
          6: #b2ffe3,
          7: #82f059,
          8: #9ce7ff,
          9: #f9dcff,
          10: #ffee94,
        );

        @each $key, $value in $colorBR {
          &.level#{$key} {
            border: 1px solid map-get($colorBR, $key);
          }
        }
      }
    }

    &-bottom {
      > p {
        text-align: right;
        margin-bottom: 10px;
      }

      > div.first {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 10px;
      }

      > div:last-of-type {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
      }

      > h2 {
        font-size: 28px;
        text-align: left;

        &.level1,
        &.level3,
        &.level5,
        &.level7,
        &.level8,
        &.level9,
        &.level10 {
          color: #fff;
        }

        &.level2 {
          color: #b95d04;
        }

        &.level4 {
          color: #2789e0;
        }

        &.level6 {
          color: #089f78;
        }
      }

      span.level {
        border-radius: 40px;
        padding: 0px 10px;
      }

      //span背景渐变色第一个颜色
      $spanBGF: (
        1: #899fbf,
        2: #ef9033,
        3: #ff7878,
        4: #40c4ed,
        5: #d669fe,
        6: #23c89d,
        7: #67d145,
        8: #308fff,
        9: #b45aff,
        10: #ff940a,
      );
      //span背景渐变色第二个颜色
      $spanBGS: (
        1: #6f85a5,
        2: #c97420,
        3: #f05c5c,
        4: #30b4e9,
        5: #f951d6,
        6: #17af87,
        7: #27b770,
        8: #1277ea,
        9: #8945fa,
        10: #eb7119,
      );

      @each $key, $value in $spanBGF {
        span.level#{$key} {
          background: linear-gradient(
            90deg,
            map-get($spanBGF, $key) 0%,
            map-get($spanBGS, $key) 92.31%
          );
        }
      }
    }
  }

  //卡片背景图
  //背景渐变色第一个颜色
  $colorBGF: (
    1: #a6b7d0,
    2: #f8bd83,
    3: #ffa493,
    4: #78dbeb,
    5: #df91fb,
    6: #61dca6,
    7: #57b733,
    8: #54baf1,
    9: #d084e2,
    10: #eeaf3a,
  );
  //背景渐变色第二个颜色
  $colorBGS: (
    1: #889ebe,
    2: #e2984e,
    3: #ff7878,
    4: #48c7f0,
    5: #ef82d5,
    6: #229b5f,
    7: #229b5f,
    8: #3d77e8,
    9: #8d49ff,
    10: #f98b3b,
  );
  //阴影渐变色第一个颜色
  $colorBSF: (
    1: #7991b6,
    2: #d77d22,
    3: #fc5a51,
    4: #25baea,
    5: #da62bd,
    6: #10b087,
    7: #1b8e56,
    8: #2964d8,
    9: #8238fa,
    10: #ec6d0f,
  );
  //阴影渐变色第二个颜色
  $colorBSS: (
    1: #bdcadc,
    2: #fcca97,
    3: #ffaea0,
    4: #89eaff,
    5: #fba4f7,
    6: #90ffce,
    7: #6dc950,
    8: #7ed1ff,
    9: #de7cf5,
    10: #ffc456,
  );

  @each $key, $value in $colorBGF {
    .itemInfo.level#{$key} {
      background: url("@/assets/icons/vip/swiper/bg/bg#{$key}.png") no-repeat center,
        linear-gradient(
          117.29deg,
          map-get($colorBGF, $key) 21.85%,
          map-get($colorBGS, $key) 67.02%
        );
      box-shadow: 0px 2px 0px map-get($colorBSF, $key),
        inset 0px 2px 0px map-get($colorBSS, $key);
    }
  }

  :deep(.swiper) {
    width: 100%;
    height: 100%;
  }

  //进度条轨道阴影渐变色第一个颜色
  $colorsF: (
    1: #b1c4e1,
    2: #ffc387,
    3: #ffada0,
    4: #7ee9fc,
    5: #ffb4f5,
    6: #62ecbc,
    7: #4fc54d,
    8: #70a4ff,
    9: #b27cff,
    10: #ffb64b,
  );
  //进度条轨道阴影渐变色第二个颜色
  $colorsS: (
    1: #607596,
    2: #ad5913,
    3: #d62f36,
    4: #2e96d5,
    5: #d73db1,
    6: #1a9575,
    7: #117443,
    8: #1b57c8,
    9: #7129ee,
    10: #d7610b,
  );

  @each $key, $value in $colorsF {
    :deep(.van-progress.level#{$key}) {
      box-shadow: 0px 1px 0px map-get($colorsF, $key),
        inset 0px 4px 4px map-get($colorsS, $key);
    }
  }
}
</style>
