<template>
  <div class="vip-content-myWelfare">
    <transition mode="out-in">
      <div class="slideMy" :key="levelMy">
        <div class="vip-content-myWelfare-head ar-1px-b">
          <svg-icon name="crown" />
          <h1>{{ $t("vipDesc1") }}</h1>
        </div>
        <div class="vip-content-myWelfare-con">
          <div class="cards" v-for="(item, index) in vipLevelList" :key="index">
            <template v-if="item.rewardType == 1 || item.rewardType == 2">
              <div class="card">
                <div class="card-head">
                  <img :src="getVipWelfareIcon(item.rewardType)" />
                  <div class="card-head-mon">
                    <p>
                      <img src="@icon/main/gold.png" />{{
                        currency(item.balance, " ", 0)
                      }}
                    </p>
                    <p>
                      <img src="@icon/main/love2.png" />{{
                        currency(item.integral, " ", 0)
                      }}
                    </p>
                  </div>
                </div>
                <div class="card-bottom">
                  <h1>{{ $t(`wealName${item.rewardType}`) }}</h1>
                  <span>{{ $t(`wealDescription${item.rewardType}`) }}</span>
                </div>
              </div>
              <button v-if="item.status == 2" class="noActive">
                {{ $t("vipDesc4") }}
              </button>
              <button v-else class="active" @click="onReceive(item)">
                {{ $t("vipDesc7") }}
              </button>
            </template>
            <template v-else>
              <div class="card">
                <div class="card-head tilt">
                  <img :src="getVipWelfareIcon(item.rewardType)" />
                  <div class="card-head-mon">
                    <p><img src="@icon/main/wallet1.png" />{{ item.rate }}%</p>
                  </div>
                </div>
                <div class="card-bottom">
                  <h1 v-if="item.rewardType != 3">
                    {{ $t(`wealName${item.rewardType}`) }}
                  </h1>
                  <h1 v-else>{{ $t(`wealName${item.rewardType}_1`) }}</h1>
                  <span>{{ $t(`wealDescription${item.rewardType}`) }}</span>
                  <div
                    class="viewD"
                    v-if="item.rewardType == 5"
                    @click="router.push({ name: 'RebateDetails' })"
                  >
                    {{ $t("viewDetail") }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { AwaitApiResult, currency } from "@/utils";
import { getVipWelfareIcon } from "@/utils/assetIcons";
import { ref } from "vue";
import { GetListVipUserRewards, AddReceiveAward } from "@/api";
import type { ResGetListVipUserRewards } from "@/types/api";
import { useCommonStore } from "@/stores";
import { useRouter } from "vue-router";

const router = useRouter();
const { setLoading } = useCommonStore();
const levelMy = ref(0);
const emits = defineEmits<{
  (e: "succeedDialog", val: object): void;
}>();

const vipLevelList = ref<ResGetListVipUserRewards[]>([]);
async function getListVipUserRewards(level: number) {
  setLoading(true);
  const res = await AwaitApiResult(
    GetListVipUserRewards({
      vipLevel: level,
    })
  );
  if (res) {
    vipLevelList.value = res.data.filter((item: any) => {
      return (item.rewardType > 2 && item.rate > 0) || item.rewardType <= 2;
    });
  }
  setLoading(false);
}

//领取
async function onReceive(item: any) {
  const res = await AwaitApiResult(
        AddReceiveAward({
      receiveId: item.id,
      vipLevel: levelMy.value,
      rewardType: item.rewardType,
    })
  );
  if (res) {
    getListVipUserRewards(levelMy.value); //领取成功，重新获取数据
    if (res?.data) {
      emits("succeedDialog", {
        integral: res?.data.integral,
        balance: res?.data.balance,
      });
    }
  }
}

defineExpose({
  getListVipUserRewards,
  levelMy,
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/VIP/vip.scss";

.vip-content-myWelfare {
  @include bg;
  padding: 30px 10px 10px;
  min-height: 550px;

  &-head {
    @include fr;

    img, .svg-icon {
      width: 48px;
      height: 48px;
      margin-right: 10px;
    }

    h1 {
      width: 87%;
      color: var(--text_color_L1);
      font-weight: 600;
      font-size: 32px;
      padding-bottom: 20px;
    }
  }

  /* 进入之前和离开后的样式 */
  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  /* 离开和进入过程中的样式 */
  .v-enter-active,
  .v-leave-active {
    /* 添加过渡动画 */
    transition: opacity 0.5s ease;
  }

  /* 进入之后和离开之前的样式 */
  .v-enter-to,
  .v-leave-from {
    opacity: 1;
  }

  &-con {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;

    .cards {
      margin-bottom: 30px;

      .card {
        border-radius: 10px;
        width: 330px;

        > div {
          width: 100%;
        }

        &-head {
          background: var(--main_gradient-color);
          background-size: cover;
          height: 180px;
          display: flex;
          justify-content: center;
          position: relative;
          border-radius: 20px 20px 0 0;

          > img {
            width: auto;
            height: 180px;
          }

          &-mon {
            position: absolute;
            width: 100%;
            bottom: 0;
            height: 40px;
            background: linear-gradient(
              180deg,
              rgba(0, 23, 24, 0.25) 0%,
              rgba(0, 0, 0, 0.5) 100%
            );
            @include fr;
            justify-content: space-between;

            > p {
              padding: 5px 2px;
              color: var(--text_color_L4);
              display: flex;
              justify-content: center;

              > img {
                width: 30px;
                height: 30px;
                margin-right: 5px;
              }
            }
          }
        }

        &-head.tilt {
          > div {
            justify-content: start;
            clip-path: polygon(0 0, 100% 0%, 90% 100%, 0% 100%);
            width: 60%;
            left: 0;
            html:lang(ar) & {
              left: unset;
              right: 0;
            }
          }
        }

        &-bottom {
          background: var(--bg_color_L3);
          padding: 15px 10px;
          min-height: 140px;
          border-end-start-radius: 20px;
          border-end-end-radius: 20px;

          > h1 {
            color: var(--text_color_L1);
            font-size: 26px;
            margin-bottom: 10px;
          }

          .viewD {
            height: 60px;
            line-height: 60px;
            border-radius: 80px;
            border: 0.5px var(--main-color) solid;
            text-align: center;
            margin-top: 20px;
            color: var(--main-color);
            font-size: 26px;
            letter-spacing: 1.04px;
          }
        }
      }

      button {
        border-radius: 80px;
        width: 100%;
        height: 60px;
        line-height: 60px;

        letter-spacing: 0.04em;
        font-weight: 700;
        font-size: 30px;
        border: none;
        margin-top: 15px;
      }

      button.noActive {
        background: var(--button_dis_color);
        color: var(--text_color_L2);
      }

      button.active {
        background: var(--main_gradient-color);
        color: var(--text_color_L4);
      }
    }
  }
}
</style>
