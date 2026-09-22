<template>
  <NavBar
    :title="$t('invitationBonus')"
    backgroundColor="linear-gradient(90deg, #FB5C5B 0%, #FF988C 100%)!important"
    left-arrow
    @click-left="router.go(-1)"
  />
  <div class="bonus-header">
    <div class="title left">
      {{ $t("inviteFriendRecharge") }}
    </div>
    <div class="bonus-header-flex">
      <div>
        <div class="tip left">{{ $t("inviteTip1") }}</div>
        <div class="tip left">{{ $t("inviteTip2") }}</div>
        <div class="tip left">{{ $t("inviteTip3") }}</div>
        <div class="time left">{{ TaskDate }}</div>
      </div>
    </div>

    <div class="nav">
      <div class="rule" @click="goPath('InvitationBonus-Rule')">
        {{ $t("inviteRule") }}
      </div>
      <div class="record" @click="goPath('InvitationBonus-Record')">
        {{ $t("inviteRecord") }}
      </div>
    </div>
  </div>
  <div class="bonus-container">
    <div v-for="(item, index) in taskData?.taskList" :key="index" class="bonus-items">
      <div class="head" :class="{ isFinshed: item.isFinshed }">
        <div class="left">
          {{ $t("award") }}
          <div>{{ index + 1 }}</div>
        </div>
        <div class="right">{{ currency(item.taskAmount) }}</div>
      </div>
      <div class="detail">
        <div class="text">{{ $t("invitationMember") }}</div>
        <div class="people">{{ item.taskPeople }}</div>
      </div>
      <div class="detail">
        <div class="text">{{ $t("rechargePerPerson") }}</div>
        <div class="num">{{ currency(item.rechargeAmount) }}</div>
      </div>
      <div class="line"></div>
      <div class="task">
        <div>
          <div class="peopleval">
            {{ `${item.efficientPeople} / ${item.taskPeople}` }}
          </div>
          <div class="text">{{ $t("invitationMember") }}</div>
        </div>
        <div>
          <div class="rechargeval">
            {{ `${item.rechargePeople} / ${item.taskRechargePeople}` }}
          </div>
          <div class="text">{{ $t("rechargeNumber") }}</div>
        </div>
      </div>
      <div
        class="btn"
        :class="{ active: item.isFinshed && item.isReceive === 0 }"
        @click="onClaimClick(item)"
      >
        {{ btnText(item) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currency, AwaitApiResult } from "@/utils";

import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import type { TaskList } from "@/types/api";
import { getTaskList, SetTaskOrder } from "@/api";

import { onMounted } from "vue";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const taskData = ref<TaskList>();
const TaskDate = computed(() => {
  if (taskData.value?.taskList && taskData.value?.taskList.length) {
    const { beginDate = "", endDate = "" } = taskData.value?.taskList[0];
    return `${beginDate.split(" ")[0]} - ${endDate.split(" ")[0]}`;
  }
  return "";
});

const getList = async () => {
  const list = await getTaskList();
  taskData.value = list;
};
async function claimPoints(item: any) {
  const res: any = await AwaitApiResult(
    SetTaskOrder({
      taskId: item.taskID,
    })
  );
  showToast(t("code" + res.msgCode));
  getList();
}
function onClaimClick(item: any) {
  if (item.isFinshed && item.isReceive === 0) {
    claimPoints(item);
  }
}
const btnText = (item: any) => {
  if (!item.isFinshed) return t("undone");
  if (item.isReceive == 0) return t("receive");
  return t("claimed");
};
const goPath = (routeName: string) => {
  router.push({ name: routeName });
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
:deep(.navbar-fixed) {
  background: var(--bg_color_L2);
  color: var(--text_color_L1);
  .van-icon {
    color: var(--text_color_L1);
  }
}
.bonus {
  &-header {
    min-height: 320px;
    width: 100%;
    background-image: url("@/assets/icons/main/invitation_bg.png"),
      linear-gradient(94deg, #f99937 2.72%, #ff6922 43.54%, #ff8039 98.54%);
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% 360px;
    padding:20px;
    color: var(--text_color_L1);
    &-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0 20px;
      img {
        width: 200px;
        height: 200px;
      }
    }
    .title {
      font-size: 36px;
      margin-bottom:20px;
      color: #fff;
    }
    .tip {
      font-size: 24px;
      margin-bottom: 16px;
      color: #fff;
		max-width: 420px;
		line-height: 30px;
    }
    .time {
      font-size: 36px;
      font-weight: 500;
      margin-bottom: 26px;
      color: #fff;
    }
    .nav {
      width: calc(100% - 48px);
      margin: auto;
      background-color: var(--light-bg_white, var(--bg_color_L3));
      padding: 24px 0;
      height: 180px;
      color: var(--text_color_L2);
      display: flex;
      border-radius: 20px;
      & > div {
        width: 50%;
        text-align: center;
        font-size: 24px;
        min-height: 126px;
        padding-top: 110px;
        background-repeat: no-repeat;
        background-size: 100px;
        background-position: top;
        &.rule {
          background-image: url("@icon/main/inviterule.svg");
        }
        &.record {
          background-image: url("@icon/main/inviterecord.svg");
        }
      }
    }
  }
  &-container {
    padding: 24px;
  }

  &-items {
    width: 100%;
    background: var(--bg_color_L2);
    border-radius: 20px;
    margin-top: 20px;
    padding-bottom: 35px;
    .head {
      display: flex;
      justify-content: space-between;
      min-height: 80px;
      margin-bottom: 20px;

      .left {
        position: relative;
        background-color: var(--norm_green-color);
        min-width: 280px;
        flex: none;
        padding: 0 70px 0 20px;
        display: flex;
        align-items: center;
        border-radius: 20px 0 0 0;
        position: relative;
        color: var(--text_white,var(--text_color_L1));
        background-image: url("@/assets/icons/main/unfinish.svg");
        background-repeat: no-repeat;
        background-size: 48px;
        background-position: right 30px center;
        border-radius: 16px 0px 40px 0px;
        

        & > div {
          min-width: 36px;
          height: 36px;
          background-color: var(--light-bg_white, var(--text_color_L1));
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--text_color_L3);
          border-radius: 50%;
          margin-left: 8px;
          
          
        }
      }
      .right {
        flex: 1;
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: right;
        line-height: 26px;
        padding-right: 20px;
        color: var(--norm_secondary-color);
        font-weight: 700;
        border-bottom: 1px solid var(--Dividing-line_color);
      }
      &.isFinshed {
        .left {
          background-image: url("@/assets/icons/main/righticon.svg");
          background-color: var(--norm_green-color);
          & > div {
            color: var(--norm_green-color);
          }
        }
      }
    }
    .detail {
      background-color:var(--bg_color_L3);
      color: var(--text_color_L1);
      border-radius: 4px;
      min-height: 50px;
      line-height: 50px;
      display: flex;
      width: calc(100% - 48px);
      margin: auto;
      & > div {
        width: 50%;
      }
      .text {
        padding: 0 20px;
        font-size: 24px;
        color: var(--text_color_L1);
      }
      .people,
      .num {
        text-align: center;
        font-size: 28px;
        color: var(--text_color_L1);
      }
      .num {
        
        color: var(--norm_red-color);
      }
      & + .detail {
        margin-top: 10px;
      }
    }
    .line {
      border: 1px dashed var(--Dividing-line_color);
      margin: 36px auto;
      position: relative;
      width: calc(100% - 86px);
      padding: 0 10px;
      &::after,
      &::before {
        content: "";
        display: block;
        border-radius: 50%;
        background-color: var(--bg_color_L1);
        position: absolute;
        width: 42px;
        height: 42px;
        top: -21px;
      }
      &::after {
        right: -62px;
      }
      &::before {
        left: -62px;
      }
    }
    .task {
      display: flex;
      min-height: 80px;
      & > div {
        width: 50%;
        text-align: center;
        &:last-of-type{
          border-inline-start: 1px solid var(--Dividing-line_color);
        }
        .peopleval,
        .rechargeval {
          font-size: 32px;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .peopleval {
          color: var(--norm_secondary-color);
        }
        .rechargeval {
          color: var(--norm_red-color);
        }
        .text {
          color: var(--text_color_L2);
        }
      }
    }
    .btn {
      background: var( --button_dis_color, var(--bg_color_L3));
      font-size: 30px;
      font-weight: 700;
      color: var(--text_white, var(--text_color_L1));
      min-height: 70px;
      line-height: 70px;
      text-align: center;
      width: calc(100% - 40px);
      margin: 32px auto 0;
      border-radius: 70px;
      &.active {
        background: var(--main_gradient-color);
        color: var(--text_color_L4);

      }
    }
  }
}
</style>
