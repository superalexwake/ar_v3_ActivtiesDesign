<template>
  <div class="lotteryDetail__container">
    <NavBar :title="$t('drawActivity')" left-arrow @click-left="router.go(-1)" />

    <div class="lotteryDetail__container-item" v-if="pointInfo">
      <div class="lotteryDetail__container-item__hero">
        <div class="lotteryDetail__container-item__hero-img">
          <Swipe :autoplay="3000" indicator-color="white">
            <SwipeItem v-for="item of images">
              <img v-lazy="item" />
            </SwipeItem>
          </Swipe>
          <div></div>
        </div>
        <div class="lotteryDetail__container-item__hero-title">
          {{ pointInfo?.name }}
        </div>
        <div class="lotteryDetail__container-item__hero-detail">
          <div>
            <span> {{ $t("startTime") }} </span>
            <div></div>
            <span> {{ pointInfo?.startTime }} </span>
          </div>
          <div>
            <span class="text-spacing">
              {{ $t("betIssue") }}
            </span>
            <div></div>
            <span> {{ pointInfo.issueNumber }} </span>
          </div>
        </div>
        <div class="lotteryDetail__container-item__hero-progress">
          <div>
            <span>{{ $t("progress") }}</span>
            <span>{{ $t("totalActivity") }}</span>
          </div>
          <van-progress
            stroke-width="8px"
            color="#DD9138"
            :percentage="progress(pointInfo.redeemedNumber || 0, pointInfo.totalNumber)"
            :show-pivot="false"
          />
          <div>
            <span
              >{{
                progress(pointInfo.redeemedNumber || 0, pointInfo.totalNumber).toFixed(2)
              }}%</span
            >
            <h1>{{ pointInfo.totalNumber }}{{ $t("sheets") }}</h1>
          </div>
        </div>
        <div
          class="lotteryDetail__container-item__hero-footer"
          v-if="pointInfo.winningNumber"
        >
          <div class="lotteryDetail__container-item__hero-footer__ending">
            <span> {{ $t("lotteryActivityEndTime") }} </span>
            <div>
              {{ pointInfo.endTime }}
            </div>
          </div>
          <div class="lotteryDetail__container-item__hero-footer__cost">
            <span> {{ $t("lotteryWinPeople") }} </span>
            <div style="color: #b247ff">
              {{ hidePhoneNumber(winPeople.userName) }}
            </div>
          </div>
        </div>
        <div class="lotteryDetail__container-item__hero-footer" v-else>
          <div class="lotteryDetail__container-item__hero-footer__ending">
            <span> {{ $t("requiredBeforeEnd") }} </span>
            <div>
              <span> {{ pointInfo.totalNumber - pointInfo.redeemedNumber }} </span>
              {{ $t("sheets") }}
            </div>
          </div>
          <div class="lotteryDetail__container-item__hero-footer__cost">
            <span> {{ $t("perRaffleTicket") }} </span>
            <div class="icon-box">
              <svg-icon name="point" />
              <h5>{{ pointInfo.unit }}.00</h5>
            </div>
          </div>
        </div>
      </div>
      <div class="lotteryDetail__container-item__luckyNumber">
        <h1>{{ $t("prizenumber") }}</h1>
        <div>
          <div class="lotteryDetail__container-item__luckyNumber-number">
            <span v-if="pointInfo.winningNumber">{{ pointInfo.winningNumber }}</span>
            <span v-else>**********</span>
          </div>
          <div class="lotteryDetail__container-item__luckyNumber-text">
            <span v-if="pointInfo.winningNumber">{{ $t("prizenumber") }}</span>
            <span v-else>{{ $t("waitingforlottery") }}</span>
          </div>
          <img src="@public/activity/PointMall/luckyNumber.png" />
        </div>
      </div>
      <div class="lotteryDetail__container-item__footer">
        <div class="lotteryDetail__container-item__footer-tabBar">
          <h1 :class="{ active: activeTab === 0 }" @click="activeTab = 0">
            {{ $t("participant") }}
          </h1>
          <h1 :class="{ active: activeTab === 1 }" @click="activeTab = 1">
            {{ $t("PrizeDetails") }}
          </h1>
        </div>
        <van-tabs
          v-model:active="activeTab"
          type="card"
          background="transparent"
          title-active-color="#151515"
          title-inactive-color="#333"
          animated
        >
          <van-tab :title="$t('popularProduct')" ref="targetContainer">
            <div class="lotteryDetail__container-item__footer-participants">
              <div
                class="lotteryDetail__container-item__footer-participants__item"
                v-for="(item, index) in pointInfo.users"
                :key="index"
              >
                <div
                  class="lotteryDetail__container-item__footer-participants__item-header"
                >
                  <span :class="{ me: item.isWin }">{{
                    hidePhoneNumber(item.userName)
                  }}</span>
                  <span>{{ item.addTime }}</span>
                </div>
                <div
                  class="lotteryDetail__container-item__footer-participants__item-tickets"
                >
                  <div
                    v-for="ticket in item.showAll
                      ? item.tickets
                      : item.tickets.slice(0, 5)"
                    :key="ticket"
                  >
                    <svg-icon name="ticket" />
                    <span>{{ ticket }}</span>
                  </div>
                  <div
                    v-if="!item.showAll && item.tickets.length > 6"
                    class="lotteryDetail__container-item__footer-participants__item-tickets__viewAll"
                  >
                    <div @click="onTicketShowAll(index)">
                      {{ $t("viewAll") }}
                      <svg-icon name="downArrow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab :title="$t('treasureScore')">
            <div
              class="lotteryDetail__container-item__footer-detail"
              v-html="pointInfo.details"
            ></div>
          </van-tab>
        </van-tabs>
      </div>

      <div
        class="lotteryDetail__container-item__participate"
        :class="{ lotteryDetailActive: pointInfo.status == 1 }"
      >
        <span v-if="pointInfo.status == 2"> {{ $t("lotteryActivityUnstarted") }} </span>
        <span v-else-if="pointInfo.status == 0"> {{ $t("lotteryActivityEnd") }} </span>
        <span v-else @click="handleActionSheetShow(true, false)">
          {{ $t("ParticipateInlottery") }}
        </span>
      </div>
    </div>

    <van-action-sheet
      v-model:show="actionSheetShow"
      :title="$t('descLottery1')"
      z-index="2000"
      :close-on-click-overlay="false"
      :closeable="false"
    >
      <div class="lotteryDetail__container-item__actionSheet">
        <div>
          <svg-icon name="point" />
          <span>{{ globalStore.getUserInfo.integral }}</span>
        </div>
        <div>{{ $t("myScores") }}</div>
        <div>
          <div
            v-for="(item, index) in ticketAmount"
            :key="index"
            :class="{
              activeTicket: item.amount === ticketCount,
            }"
            @click="ticketCount = item.amount"
          >
            <span>{{ item.amount }}</span>
            <span>{{ $t("sheets") }}</span>
          </div>
        </div>
        <div>
          <span>{{ $t("needToPay") }}</span>
          <div>
            <svg-icon name="point" />
            {{ pointInfo?.unit * ticketCount || 0 }}.00
          </div>
        </div>
      </div>
      <van-button
        class="lotteryDetail__container-item__actionSheet-button"
        block
        :loading="loading"
        :loading-text="$t('confirmParticipate')"
        @click="onJoin"
        >{{ $t("confirmParticipate") }}</van-button
      >
    </van-action-sheet>
    <div
      class="lotteryDetail__container-item__actionSheetCloseBtn"
      v-if="actionSheetShow"
    >
      <span @click="handleActionSheetShow(false)">
        <svg-icon name="close" />
      </span>
    </div>

    <van-dialog v-model:show="dialogShow" :show-confirm-button="false" z-index="3100">
      <div class="van-dialog__content-title">{{ $t("participateSuccess") }}</div>
      <div class="van-dialog__content-subTitle">
        <span>{{ resultTicket.length }}</span
        >{{ $t("sheets") }}
      </div>
      <div class="van-dialog__content-tips">{{ $t("congratsOnWinTicket") }}</div>

      <div class="van-dialog__content-ticketsList">
        <div>
          <div v-for="item in resultTicket">
            <svg-icon name="ticket" />
            {{ item }}
          </div>
        </div>
      </div>

      <div class="van-dialog__content-confirm" @click="onConfirm">
        {{ $t("confirm") }}
      </div>
      <div class="van-dialog__content-myTreasure" @click="goOrder">
        {{ $t("toMyTreasure") }}
        <van-icon name="arrow" />
        <van-icon name="arrow" style="left: -10px" />
      </div>
      <img src="@public/activity/PointMall/successfullyParticipatedBg.png" />
      <img
        class="van-dialog__content-successfullyParticipatedBottom"
        src="@public/activity/PointMall/successfullyParticipatedBottom.png"
      />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Swipe, SwipeItem } from "vant";
import { useActivityStore } from "@/stores/modules/activity";
import { hidePhoneNumber } from "@/utils";
import { usePointLottery } from "@/hooks";
import { GlobalStore } from "@/stores";

const router = useRouter();
const route = useRoute();
const globalStore = GlobalStore();
const activityStore = useActivityStore();
const {
  getPointLotteryInfo,
  onJoin,
  winPeople,
  list,
  loading,
  ticketCount,
  resultTicket,
  pointInfo,
} = usePointLottery();
const progress = (num1: number, num2: number) => {
  if (num1 == 0 && num2 == 0) return 100;
  return (num1 / num2) * 100;
};
const images = computed(() =>
  [
    pointInfo.value?.img_Five,
    pointInfo.value?.img_Four,
    pointInfo.value?.img_One,
    pointInfo.value?.img_Three,
    pointInfo.value?.img_Two,
  ].filter(Boolean)
);
const activeTab = ref(0);
const actionSheetShow = ref(false);
const activeTicketType = ref(0);
const dialogShow = ref(false);
const ticketAmount = [
  {
    amount: 1,
    price: 10,
  },
  {
    amount: 3,
    price: 30,
  },
  {
    amount: 5,
    price: 50,
  },
  {
    amount: 10,
    price: 100,
  },
  {
    amount: 20,
    price: 200,
  },
  {
    amount: 30,
    price: 300,
  },
  {
    amount: 50,
    price: 500,
  },
  {
    amount: 100,
    price: 1000,
  },
];
function onClick() {
  router.back();
}
function goOrder() {
  router.push({
    name: "PointMall-MyLottery",
  });
}

function onTicketShowAll(idx: number) {
  if (!list.value.length) return;
  list.value[0].users[idx].showAll = !list.value[0].users[idx].showAll;
}

function handleActionSheetShow(action: boolean, participate: boolean = false) {
  if (!participate) {
    actionSheetShow.value = action;
    if (!action) {
      activeTicketType.value = 0;
    }
  } else {
    handleParticipate();
  }
}

function handleParticipate() {
  dialogShow.value = true;
}
const onConfirm = async () => {
  dialogShow.value = false;
  actionSheetShow.value = false;
  await getPointLotteryInfo();
};
watch(resultTicket, (data) => {
  if (data.length) dialogShow.value = true;
});
onMounted(async () => {
  await getPointLotteryInfo();
});
</script>

<style lang="scss" scoped>
.lotteryDetail__container {
  svg {
    width: 32px;
    height: 32px;
  }
  padding-bottom: 180px;
  font-family: $font-family;
  background: var(--bg_color_L1);

  :deep(.van-nav-bar) {
    background-color: var(--bg_color_L2);

    .van-nav-bar__content {
      .van-nav-bar__left {
        .van-icon {
          color: var(--text_color_L1);
        }
      }

      .van-nav-bar__title {
        color: var(--text_color_L1);
      }
    }
  }
  :deep(.van-action-sheet__header) {
    line-height: 80px;
    padding-top: 20px;
    color: var(--text_color_L1);
  }

  :deep(.van-action-sheet__content) {
    background: var(--bg_color_L2);
    div {
      color: var(--main-color);
    }
  }

  &-item {
    display: flex;
    flex-direction: column;

    &__hero {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      background: var(--bg_color_L2);
      padding-bottom: 40px;
      margin-bottom: 30px;
      overflow: hidden;

      &-img {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        background: var(--bg_color_L3);
        height: 527px;
        position: relative;

        img {
          height: 500px;
          width: 500px;
        }
        .van-swipe-item {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .van-swipe {
          width: 100%;
          height: 100%;
        }
      }

      &-title,
      &-detail,
      &-progress,
      &-footer {
        padding-inline: 12px;
      }

      &-title {
        font-size: 30px;
        color: var(--text_color_L1);
        margin: 24px 0;

        & > span {
          color: var(--text_color_L);
        }
      }

      &-detail {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        color: var(--text_color_L1);
        margin-bottom: 45px;

        & > div {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 10px;
          font-size: 24px;
          background-color: var(--bg_color_L3);

          & > span {
            color: var(--text_color_L2);
            &:first-child {
              flex: 20%;
              text-align: center;
            }

            &.text-spacing {
              text-align: justify;
              text-align-last: justify;
              padding: 0 20px;
            }

            &:last-child {
              flex: 80%;
              font-size: 24px;
              line-height: 24px;
            }
          }

          & > div {
            height: 18px;
            width: 1px;
            background: var(--Dividing-line_color);
          }
        }
      }

      &-progress {
        margin-bottom: 20px;

        h1 {
          font-size: 28px;
          font-weight: bold;
          color: var(--text_color_L1);
        }

        & > div {
          &:first-of-type,
          &:last-of-type {
            display: flex;
            justify-content: space-between;
            font-size: 24px;
          }

          &:first-of-type {
            font-size: 24px;
            margin-bottom: 10px;
            color: var(--text_color_L2);
          }

          &:last-of-type {
            margin-top: 10px;
            color: #848592;

            span {
              &:last-of-type {
                color: var(--text_color_L1);
              }
            }
          }
        }
      }

      &-footer {
        &__ending,
        &__cost {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 60px;
          margin-block: 5px;
          border: 1px solid var(--bgColor-6);
          background: var(--bg_color_L3);

          .icon-box {
            color: var(--norm_secondary-color);
          }
          & > span,
          & > div {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 5px 10px;
          }

          & > span {
            flex: 0.6;
            background: var(--HomebgLightColor);
            clip-path: polygon(0 0, 100% 0%, 90% 100%, 0% 100%);
          }

          & > div {
            flex: 0.4;
            justify-content: flex-end;
            font-size: 1.125rem;
            font-weight: 600;

            img {
              width: 32px;
              height: 32px;
              margin-inline: 5px;
            }
          }
        }

        &__ending,
        &__cost {
          span {
            font-size: 28px;
            color: var(--text_color_L1);
          }

          h5 {
            font-weight: bold;
            font-size: 30px;
          }

          & > div {
            color: var(--text_color_L1);
            font-size: 26px;
            font-weight: 500;

            & > span {
              font-size: 28px;
              font-weight: 600;
            }
          }
        }
      }
    }

    &__luckyNumber {
      display: flex;
      flex-direction: column;
      margin-top: 40px;
      padding-inline: 12px;

      h1 {
        position: relative;
        margin-bottom: 15px;
        padding-left: 20px;
        color: var(--text_color_L1);
        font-size: 36px;
        font-weight: 600;

        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 6px;
          height: 36px;
          background: var(--main-color);
        }
      }

      & > div {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #d37116;

        img {
          width: 100%;
          height: 100%;
        }

        & > div {
          position: absolute;

          &:first-of-type {
            top: 30%;
            font-size: 42px;
            font-weight: 900;
          }

          &:last-of-type {
            bottom: 25%;
            font-weight: bold;
          }
        }
      }
    }

    &__footer {
      margin-top: 50px;
      padding-inline: 12px;
      h1 {
        &.active {
          color: var(--text_color_L1);
          font-weight: 500 !important;
        }
        &:not(.active) {
          color: var(--text_color_L2);
          font-weight: 400;
        }
      }

      &-tabBar {
        display: flex;
        align-items: center;
        gap: 1rem;

        h1 {
          position: relative;
          margin-bottom: 0.5rem;
          padding-left: 20px;

          font-size: 36px;

          &:first-of-type {
            &::before {
              content: "";
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              width: 6px;
              height: 36px;
              background: var(--main-color);
            }
          }
        }
      }

      :deep(.van-tabs) {
        .van-tabs__wrap {
          display: none;
        }
      }

      &-participants {
        display: flex;
        flex-direction: column;
        gap: 20px;

        &__item {
          display: flex;
          flex-direction: column;
          padding: 16px 14px;
          border-radius: 10px;
          background-color: var(--bg_color_L2);

          &-header {
            display: flex;
            justify-content: space-between;
            padding: 10px 0 16px;
            font-weight: 500;
            line-height: 25px;
            color: var(--text_color_L1);

            span {
              &.me {
                color: var(--norm_red-color);
              }
              &:last-of-type {
                color: var(--text_color_L2);
                font-size: 24px;
              }
            }
          }

          &-tickets {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            row-gap: 0.875em;
            padding: 15px 0;
            color: var(--text_color_L1);
            border-radius: 10px;
            background: var(--bg_color_L1);

            & > div {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;

              svg {
                width: 78px;
                height: 42px;
                margin-right: 5px;
              }

              span {
                display: block;
                width: 240px;
                color: var(--text_color_L1);
                font-size: 26px;
                font-style: normal;
                font-weight: 400;
                line-height: 28px;
              }
            }

            &__viewAll {
              color: var(--main-color);

              & > div {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 300px;
                height: 50px;
                padding: 2px 0;
                border: 1px solid var(--main-color);
                border-radius: 9rem;
                font-size: 26px;
                font-style: normal;
                font-weight: 400;
                line-height: 28px;

                svg {
                  width: 32px;
                  height: 32px;
                  margin-inline: 5px;
                }
              }
            }
          }
        }
      }

      &-detail {
        font-size: 34px;
        color: var(--text_color_L1);
        img {
          width: 100%;
        }
      }
    }

    &__participate {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 10px 0;
      color: var(--text_color_L2);
      text-align: center;
      background: var(--button_dis_color);
      z-index: 100;
      height: 120px;
      line-height: 100px;
      font-size: 34px;
      max-width: 10rem;
      &.lotteryDetailActive {
        background: var(--bg_color_L3);
      }
      span {
        display: block;
        color: var(--text_white, var(--main-color));
        width: 100%;
        height: 100%;
      }
    }

    &__actionSheet {
      padding: 0 12px;

      & > div {
        &:first-of-type {
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 48px;
            height: 48px;
            margin-right: 6px;
          }
          span {
            display: block;
            margin-top: 6px;
            line-height: 48px;
            font-size: 36px;
            color: var(--main-color);
          }
        }

        &:nth-of-type(2) {
          text-align: center;
          margin-block: 20px;
          color: var(--text_color_L2);
          font-size: 24px;
        }

        &:nth-of-type(3) {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          justify-items: center;
          gap: 30px;
          width: 100%;
          margin-top: 10px;

          & > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding-block: 5px;
            color: var(--norm_red-color);
            font-family: "Inter", sans-serif;
            border-radius: 10px;
            background: var(--bg_color_L3);
            transition: all 0.1s ease-in-out;

            span {
              font-size: 32px;

              &:last-of-type {
                font-size: 22px;
                color: var(--text_color_L1);
              }
            }

            &.activeTicket {
              color: var(--text_color_L4);
              background: var(--main_gradient-color);
              //box-shadow: var(--BoxShadowColor-36);
              span {
                &:last-of-type {
                  color: var(--text_color_L4);
                }
              }
            }
          }
        }

        &:nth-of-type(4) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 60px;
          margin-top: 20px;
          //border: 1px solid var(--borderColor-17);
          background: var(--bg_color_L3);
          border-radius: 10px;

          & > span,
          & > div {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 5px 10px;
          }

          & > span {
            flex: 0.6;
            color: var(--text_color_L1);
          }

          & > div {
            flex: 0.4;
            justify-content: flex-end;
            gap: 0.375rem;
            color: var(--norm_secondary-color);
            font-size: 30px;

            img {
              width: 32px;
              height: 32px;
            }
          }
        }
      }
      &-button {
        border: none;
        background: var(--bg_color_L3);
        height: 120px;
        border-radius: 0;
        color: var(--text_color_L1);
        margin-top: 40px;
      }
    }

    &__actionSheetCloseBtn {
      position: fixed;
      bottom: 780px;
      left: 50%;
      margin-left: -30px;
      text-align: center;
      transition: all 0.3s ease-in-out;
      z-index: 2000;

      svg {
        width: 60px;
        height: 60px;
      }
    }
  }

  :deep(.van-dialog) {
    background: transparent;
    width: 670px;
    .van-dialog__content {
      position: relative;

      img {
        width: 100%;
      }
    }
  }

  .van-dialog {
    &__content {
      &-title,
      &-subTitle,
      &-ticketsList,
      &-tips,
      &-confirm,
      &-myTreasure,
      &-successfullyParticipatedBottom {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
      }

      &-title {
        top: 120px;
        color: var(--text_color_L1);
        font-size: 42px;
        font-weight: bold;
      }

      &-subTitle {
        top: 210px;
        color: #ffef89;

        & > span {
          color: #ffef89;
          font-size: 48px;
          vertical-align: middle;
        }
      }

      &-tips {
        top: 275px;
        color: var(--text_color_L1);
        font-size: 24px;
        font-weight: 300;
      }

      &-ticketsList {
        top: 55%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 40%;
        padding-inline: 5px;
        overflow: hidden;
        z-index: 1;

        & > div {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: 40px 40px;
          column-gap: 5px;
          width: 100%;
          height: 100%;
          padding-bottom: 40px;
          overflow-y: auto;

          & > div {
            display: flex;
            align-items: center;
            height: 40px;
            color: var(--norm_red-color);
            font-size: 24px;
          }
        }

        &__ticket {
          width: 66px;
          height: 36px;
          margin-right: 5px;
        }
      }

      &-confirm {
        bottom: 210px;
        color: var(--text_color_L1);
        font-size: 36px;
        font-weight: bold;
        z-index: 3;
      }

      &-myTreasure {
        bottom: 45px - 25px;
        width: 598px;
        height: 80px;
        padding: 0.25rem;
        color: var(--text_color_L1);
        text-align: center;
        font-size: 32px;
        border: 1px solid var(--text_color_L1);
        border-radius: 9rem;
        box-shadow: var(--BoxShadowColor-37);
        z-index: 3;
      }

      &-successfullyParticipatedBottom {
        bottom: 0;
        z-index: 2;
      }
    }
  }
}
</style>
