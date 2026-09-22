<template>
  <div class="vip-content-recordVsrule">
    <div class="vip-content-recordVsrule-head">
      <button
        v-haspermission="18"
        :class="{ active: activeIndex == 1 }"
        @click="onSwitch(1)"
      >
        {{ $t("record") }}
      </button>
      <button :class="{ active: activeIndex == 2 }" @click="onSwitch(2)">
        {{ $t("rule") }}
      </button>
    </div>
    <template v-if="activeIndex == 1">
      <div v-haspermission="18" class="vip-content-recordVsrule-con">
        <template v-if="vipLogList.length > 0">
          <div class="item ar-1px-b" v-for="(item, index) in vipLogList" :key="index">
            <template v-if="item.type == 1 || item.type == 2">
              <div class="item-left">
                <span class="green">{{ getArrayKey(rootConfig.VipType, item.type) }}</span
                ><span>{{ setRemark(item.type, item.remark) }}</span>
                <span>{{ item.createTime }}</span>
              </div>
              <div class="item-right">
                <p>
                  <img src="@icon/main/gold.png" />{{
                    currency(item.awardAmount, " ", 0)
                  }}
                </p>
                <p>
                  <img src="@icon/main/love.png" />{{
                    currency(item.bonusPoints, " ", 0)
                  }}
                </p>
              </div>
            </template>
            <template v-if="item.type == 3 || item.type == 4">
              <div class="item-left">
                <span class="red">{{ getArrayKey(rootConfig.VipType, item.type) }}</span
                ><span>{{ setRemark(item.type, item.remark) }}</span
                ><span>{{ item.createTime }}</span>
              </div>
              <div class="item-right">
                <span></span>
                <span></span>
                <span>{{ item.experience }} EXP</span>
              </div>
            </template>
            <template v-if="item.type == 5">
              <div class="item-left">
                <span class="yellow">{{
                  getArrayKey(rootConfig.VipType, item.type)
                }}</span
                ><span>{{ setRemark(item.type, item.remark) }}</span
                ><span>{{ item.createTime }}</span>
              </div>
            </template>
            <template v-if="item.type == 6">
              <div class="item-left">
                <span class="blue">{{ getArrayKey(rootConfig.VipType, item.type) }}</span
                ><span>{{ setRemark(item.type, item.remark) }}</span
                ><span>{{ item.createTime }}</span>
              </div>
              <div class="item-right">
                <span></span>
                <span></span>
                <span class="green">{{ item.experience }} EXP</span>
              </div>
            </template>
            <template v-if="[7, 8].includes(item.type)">
              <div class="item-left">
                <span class="yellow">{{
                  getArrayKey(rootConfig.VipType, item.type)
                }}</span
                ><span>{{ setRemark(item.type, item.remark) }}</span
                ><span>{{ item.createTime }}</span>
              </div>
            </template>
          </div>
        </template>
        <Empty v-else />
        <button v-haspermission="18" @click="onViewAll">{{ $t("viewAll") }}</button>
      </div>
    </template>
    <template v-else>
      <div class="vip-content-recordVsrule-con">
        <div class="con-content">
          <div class="con-content__title">
            <h1>{{ $t("vipPrivilege") }}</h1>
            <p>{{ $t("vipRule") }}</p>
          </div>

          <div class="con-content__rules">
            <div
              class="con-content__rules-item ruleHead"
              v-for="(item, index) in rulesList"
              :key="index"
            >
              <svg-icon name="ruleHead" />
              <div class="con-content__rules-item__title">
                {{ item.title }}
              </div>
              <div class="con-content__rules-item__titleRight"></div>
              <p>
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { rootConfig } from "@/utils/selectArr/rootConfig";
import { AwaitApiResult, getArrayKey, currency } from "@/utils";
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { GetPageListVipUserRecord } from "@/api";
import type { ResGetPageListVipUserRecord } from "@/types/api";
import Empty from "@/components/Empty/index.vue";
import { useSessionStorage } from "@vueuse/core";

const { t } = useI18n();
const router = useRouter();
let permission: any = useSessionStorage("permission", null);
permission && (permission = JSON.parse(permission.value));
const activeIndex = ref(1);
if (permission && permission[18] === false) activeIndex.value = 2;

const rulesList = [
  {
    title: t("promotionCriteria"),
    content: t("rVsTip1", [sessionStorage.getItem("vipAmount") || 1000]),
  },
  {
    title: t("promotionOrder"),
    content: t("rVsTip2"),
  },
  {
    title: t("relegationRequirements"),
    content: t("rVsTip3"),
  },
  {
    title: t("downgradeStandard"),
    content: t("rVsTip4"),
  },
  {
    title: t("upgradeReward"),
    content: t("rVsTip5"),
  },
  {
    title: t("wealName2"),
    content: t("rVsTip6"),
  },
  {
    title: t("wealName3"),
    content: t("rVsTip7"),
  },
  {
    title: t("wealName4"),
    content: t("rVsTip8"),
  },
];

//翻译remark
function setRemark(type: number, remark: string) {
  switch (type) {
    case 1:
      return t("vipTip12");
    case 2:
      return t("vipTip13");
    case 3:
      return t("vipTip10");
    case 4:
      return t("vipTip11", [remark]);
    case 5:
      return t("vipTip6", [remark]);
    case 6:
      return t("vipTip7");
    case 7:
      return t("vipTip15", [remark]);
    case 8:
      return t("vipTip17", [remark]);
  }
}
function onSwitch(index: number) {
  activeIndex.value = index;
}
function onViewAll() {
  router.push({
    name: "RecordVsruleHistory",
  });
}
const pageQuery = reactive<any>({
  pageSize: 10,
  pageNo: 1,
});
const vipLogList = ref<ResGetPageListVipUserRecord[]>([]);
async function getPageListVipUserRecord() {
  const res = await AwaitApiResult(GetPageListVipUserRecord(pageQuery));
  if (res) {
    vipLogList.value = res.data.list;
  }
}
onMounted(() => {
  getPageListVipUserRecord();
});

defineExpose({
  getPageListVipUserRecord,
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/VIP/vip.scss";

.vip-content-recordVsrule {
  margin-top: 30px;

  &-head {
    border-radius: 12px;
    height: 88px;
    color: var(--light-main_gradient-color,var(--text_color_L2));
    font-size: 32px;
    line-height: 88px;

    > button {
      position: relative;
      border: none;
      width: 50%;
      background: var(--bg_color_L2);
      color: var(--text_color_L2);
      &::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        margin-inline: auto;
        width: 120px;
        height: 3px;
        bottom: 0;
      }
    }

    > button.active {
      color: var(--main-color);
      border-radius: 12px;
      &::before {
        background-color: var(--main-color);
      }
    }
  }

  &-con {
    border-radius: 12px;
    @include fc;

    /**记录 */
    .item {
      @include fr;
      margin: 25px 20px 10px;
      justify-content: space-between;

      > div {
        @include fc;
      }

      span.yellow {
        color: var(--norm_secondary-color);
      }

      span.red {
        color: var(--norm_red-color);
      }

      span.blue {
        color: var(--norm_bule-color);
      }

      span.green {
        color: var(--norm_green-color);
      }

      &-left {
        > span {
          margin-bottom: 15px;
        }

        > span:nth-of-type(1) {
          font-size: 30px;
        }

        > span:nth-of-type(2) {
          color: var(--text_color_L2);
        }
      }

      &-right {
        justify-content: space-around;

        > p {
          background-color: transparent;
          border: 1px solid var(--main-color);
          border-radius: 10px;
          min-width: 150px;
          font-size: 26px;
          padding: 2px 10px;
          align-items: center;
          display: flex;
          color: var(--main-color);
          margin-left: auto;
          text-align: right;

          > img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
          }
        }

        > p:nth-of-type(1) {
          color: var(--norm_secondary-color);
          margin-top: 5px;
          margin-bottom: 10px;
          border-color: var(--norm_secondary-color);
        }

        > span {
          margin-left: auto;
          text-align: right;
          min-width: 150px;
        }
      }
    }

    /**规则 */
    .con-content {
      padding: 20px 0 60px;

      &__title {
        text-align: center;

        h1 {
          margin-bottom: 15px;
          color: var(--main-color);
          font-size: 36px;
          line-height: 36px;
          font-weight: 600;
        }

        p {
          color: var(--text_color_L2);
          font-size: 28px;
        }
      }

      &__rules {
        @include fc;
        gap: 52px;
        margin-top: 53px;
        margin-inline: 20px;

        &-item {
          position: relative;
          padding: 0 18px 20px;
          border-radius: 20px;
          background: var(--bg_color_L2);

          @mixin titleS {
            position: absolute;
            top: -20px;
            width: 20px;
            height: 40px;
            background-color: var(--norm_red-color);
            clip-path: polygon(50% 0%, 100% 0%, 50% 50%, 100% 100%, 50% 100%, 0% 50%);
            z-index: 5;
          }

          &__title {
            height: 60px;
            color: #fff;
            font-size: 24px;
            text-align: center;
            line-height: 60px;
            position: relative;
            z-index: 2;
          }

          p {
            color: var(--text_color_L2);
            font-size: 24px;
            line-height: 50px;
          }

          &__commission {
            display: flex;
            justify-content: space-between;
            width: calc(100% + 2px);
            margin-left: -1px;
            background: var(--bg_color_L2);

            & > div {
              flex: 1;
              text-align: center;

              &:first-of-type {
                & > div {
                  &:last-of-type {
                    div {
                      border-left: none;

                      img {
                        width: 97.55px;
                        height: 44.4px;
                      }
                    }
                  }
                }
              }

              & > div {
                &:first-of-type {
                  height: 100px;
                  color: #fff;
                  font-size: 26px;
                  line-height: 100px;
                  background: var(--norm_red-color);
                }

                &:last-of-type {
                  color: var(--text_color_L2);
                  font-weight: 300;
                  font-size: 0.875rem;

                  div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 173px;
                    height: 66px;
                    padding: 5px 0;
                    border-top: 1px solid var(--borderColor-5);
                    border-left: 1px solid var(--borderColor-5);
                  }
                }
              }
            }
          }
        }
      }
    }
    > button {
      border: none;
      background: var(--main_gradient-color);
      border-radius: 40px;
      height: 80px;
      line-height: 80px;
      color: var(--text_color_L4);
      letter-spacing: 0.04em;
      font-size: 30px;
      margin: 40px 20px;
    }
  }
}
</style>
