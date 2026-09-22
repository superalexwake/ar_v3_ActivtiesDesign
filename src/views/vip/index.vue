<template>
  <div class="vip">
    <div class="vip-header">
      <NavBar title="VIP" class="main" left-arrow @click-left="router.go(-1)" />
      <div class="vip-header-wrapper">
        <div class="vip-header-wrapper-avatar" @click="showEditAvatarDialog">
          <img
            :src="avatarUrl"
            class="userAvatar"
            @error="fixIcons(avatarUrl, 'userAvatar')"
          />
        </div>

        <div class="vip-header-wrapper-name">
          <div
            class="vip-header-wrapper-name-vip"
            :class="['n' + vipUsersData?.vipLevel]"
          ></div>
          <div class="vip-header-wrapper-name-nickName">
            <h3>{{ vipUsersData?.nickName }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="vip-content">
      <div class="vip-content-empirical">
        <div>
          <p class="red">
            {{ $t("eightThousandEXP", [haspermission ? vipUsersData?.exp : 0]) }}
          </p>
          <p>{{ $t("myExperience") }}</p>
        </div>
        <div>
          <p
            class="timeTop"
            v-html="$t('fifteenDays', [haspermission ? vipUsersData?.settlementDate : 0])"
          ></p>
          <p>{{ $t("settlementTime") }}</p>
        </div>
      </div>
      <div class="vip-content-tip">{{ $t("vipTip18") }}</div>
      <!--vip卡片-->
      <VipCard
        ref="vipCardRef"
        :haspermission="haspermission"
        @changeLevel="changeLevel"
      />
      <!--等级福利-->
      <Weal ref="weal" />
      <!--我的福利-->
      <MyWelfare
        @succeedDialog="onChangeShowD"
        ref="myWelfare"
        v-show="vipUsersData?.vipLevel > 0"
      />
      <!--记录规则-->
      <RecordVsrule ref="recordVsrule" v-if="isVipCardFinish" />
    </div>

    <!--领取成功弹窗-->
    <van-dialog
      v-model:show="succeedDialogShow"
      :show-confirm-button="false"
      z-index="99"
    >
      <img src="@icon/public/succeed.png" class="succeed" />
      <div class="van-dialog__content-title">{{ $t("receivedSuccessfully") }}</div>
      <div class="van-dialog__content-note">
        <div>
          <p class="main">
            <img src="@icon/main/love.png" />{{
              currency(dialogItem?.integral, " ", 0)
            }}
          </p>
          <p class="yellow">
            <img src="@icon/main/gold.png" />{{
              currency(dialogItem?.balance, " ", 0)
            }}
          </p>
        </div>
        <div>
          <p v-html="$t('vipTip4', [dialogItem?.integral, dialogItem?.balance])"></p>
          <!-- <p>{{ $t('vipTip5') }}</p> -->
        </div>
      </div>
      <div class="van-dialog__content-btn">
        <button @click="onRefresh">{{ $t("sure") }}</button>
      </div>
      <img
        class="close"
        src="@public/main/close.png"
        @click="succeedDialogShow = false"
      />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { AwaitApiResult, currency } from "@/utils";
import { useAssets } from "@/hooks/useAssets";
import { GlobalStore, useCommonStore } from "@/stores";
import { GetVipUsers } from "@/api";
import type { UserInfo } from "@/types/api";

import VipCard from "@/components/Vip/VipCard.vue";
import Weal from "@/components/Vip/Weal.vue";
import MyWelfare from "@/components/Vip/MyWelfare.vue";
import RecordVsrule from "@/components/Vip/RecordVsrule.vue";
import { useSessionStorage } from "@vueuse/core";

const { getAvatarUrl, defaultImgAvatar1 } = useAssets();
const globalStore = GlobalStore();
const userInfo = globalStore.getUserInfo as UserInfo;
const avatarUrl = ref(getAvatarUrl(userInfo.userPhoto));
const router = useRouter();
const { setLoading } = useCommonStore();
const succeedDialogShow = ref(false); //领取成功弹窗显示状态
const dialogItem = ref(); //领取成功后弹窗上显示的值
const vipCardRef = ref();
const weal = ref();
const myWelfare = ref();
const recordVsrule = ref();
const isVipCardFinish = ref(false);

function showEditAvatarDialog() {
  router.push({ name: "Avatar" });
}

let permission: any = useSessionStorage("permission", null);
permission && (permission = JSON.parse(permission.value));
const haspermission = ref(true);
if (permission && permission[18] === false) haspermission.value = false;
const vipUsersData = ref(); //vip初始信息
async function getVipUsers() {
  setLoading(true);
  const res = await AwaitApiResult(GetVipUsers());
  if (res) {
    if (res?.data) {
      vipUsersData.value = res.data;

      //请求等级福利
      weal.value.level = vipUsersData.value?.vipLevel;
      weal.value.getListVipLevel(vipUsersData.value?.vipLevel);

      //请求我的福利
      if (vipUsersData.value?.vipLevel > 0) {
        myWelfare.value.levelMy = vipUsersData.value?.vipLevel;
        myWelfare.value.getListVipUserRewards(vipUsersData.value?.vipLevel);
      }

      //轮播图
      vipCardRef.value.level = vipUsersData.value?.vipLevel;
      await vipCardRef.value.getVipUserLevelDetail();

      //确保轮播图组件执行完之后，存了投注比例，再执行记录和规则组件
      isVipCardFinish.value = true;
    }
  }
  setLoading(false);
}

onMounted(() => {
  getVipUsers();
});

//滑动轮播图重新请求等级福利数据
function changeLevel(level: number) {
  nextTick(() => {
    //请求等级福利
    weal.value.level = level;
    weal.value.getListVipLevel(level);

    //请求我的福利
    if (level <= vipUsersData.value?.vipLevel) {
      myWelfare.value.levelMy = level;
      myWelfare.value.getListVipUserRewards(level);
    }
  });
}

//成功领取后弹窗处理
function onChangeShowD(item: any) {
  dialogItem.value = item;
  succeedDialogShow.value = true;
}

function onRefresh() {
  succeedDialogShow.value = false;
  recordVsrule.value.getPageListVipUserRecord();
}

const fixIcons = (url: any, className: string) => {
  url = defaultImgAvatar1;

  let dom: any = document.querySelector(`.${className}`);
  dom.src = url;
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/VIP/vip.scss";

.vip {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  color: var(--text_color_L2);
  padding-bottom: 60px;

  &-header {
    background: var(--light-main_gradient-color,var(--bg_color_L2));
    height: 330px;
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 34px;

    &-wrapper {
      display: flex;
      justify-content: flex-start;
      width: 100%;

      &-avatar {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        margin-right: 20px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &-name {
        @include fc;
        justify-content: space-between;
        padding: 20px 0;

        &-vip {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 30px;
          color: #fff;

          img {
            width: 100px;
            margin: 0 10px;
          }

          .editPencil {
            width: 30px;
          }
        }

        &-nickName {
          width: 230px;
          border-radius: 40px;
          padding: 0 18px;
          color: #fff;
          font-size: 28px;
          display: flex;
        }
      }
    }
  }

  &-content {
    @include fc;
    position: relative;
    padding-inline: 25px;

    > div {
      width: 702px;
    }

    &-empirical {
      position: absolute;
      top: -70px;
      @include fr;
      justify-content: space-between;

      > div {
        background: var(--light-bg_white,var(--bg_color_L3));
        border-radius: 10px;
        width: 330px;
        text-align: center;
        padding: 15px;
        gap: 8px;
        @include fc;

        > p.red {
          font-weight: 500;
          font-size: 28px;
          color: var(--main-color);
        
        }

        > p:nth-of-type(2) {
          color: var(--text_color_L2);
         
        }

        > :deep(p) {
          line-height: 36px;
        

          > span {
            color: var(--text_color_L1);
            font-weight: 900;
            font-size: 36px;
          }
        }

        .timeTop {
          @include fr;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
      }
    }
    &-tip {
      margin-top: 75px;
      border-radius: 10px;
      border: 1px solid var(--Dividing-line_color);
      padding: 12px 20px;
      line-height: 28px;
      margin-bottom: 15px;
      font-size: 22px;
      color: var(--text_color_L2);
    }
  }

  :deep(.van-dialog) {
    overflow: visible;
    padding: 0 50px;
    min-width: 550px;

    .van-dialog__content {
      position: relative;
      @include fc;
      align-items: center;
      padding-block: 96px 24px;
    }
  }

  $list: 0 1 2 3 4 5 6 7 8 9 10;

  @each $i in $list {
    .n#{$i} {
      width: 100px;
      height: 44px;
      margin: 0 10px;
      background-image: url("@/assets/icons/vip/grade/#{$i}.png");
      background-size: 100px 44px;
    }
  }

  .van-dialog {
    &__content {
      > img {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      img.succeed {
        top: -70px;
        width: 400px;
      }

      img.fail {
        top: 3.2px;
        width: 160px;
      }

      img.close {
        bottom: -80px;
        width: 55px;
      }

      &-title {
        margin-top: 100px;
        margin-bottom: 50px;
        color: var(--text_color_L1);
        font-weight: 700;
        font-size: 36px;
        line-height: 36px;
        font-family: "Poppins";
      }

      &-note {
        margin-bottom: 70px;
        @include fc;
        font-size: 24px;

        > div:nth-of-type(1) {
          @include fr;
          justify-content: space-around;

          > p {
            border-radius: 30px;
            padding: 3px 20px;
            @include fr;
            align-items: center;

            > img {
              width: 36px;
              height: 36px;
            }
          }

          > p:nth-of-type(1) {
            background-color: transparent;
            border: 1px solid var(--main-color);
            
          }

          > p:nth-of-type(2) {
            background-color: transparent;
            border: 1px solid var(--norm_secondary-color);
           
          }
        }

        > div:nth-of-type(2) {
          margin-top: 30px;
          text-align: center;
          line-height: 50px;
          

          > p:first-of-type {
            color: var(--text_color_L2);
            font-weight: 500;
            
          }

          > p:last-of-type {
            font-size: 22px;
          }
        }
      }

      &-btn {
        @include fc;
        align-items: center;
        width: 100%;

        > button {
          border: none;
          font-size: 30px;
          border-radius: 144px;
          padding: 20px 0;
          width: 95%;
          margin-bottom: 20px;
          background: var(--main_gradient-color);
          color: var(--text_color_L4);
        }
      }
    }
  }
}
.main {
  color: var(--main-color);
}
</style>
