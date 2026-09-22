<template>
  <div class="gamestats-container">
    <NavBar :title="$t('gameStats')" left-arrow @click-left="router.go(-1)" />
    <div class="gamestats-container-header">
      <van-tabs v-model:active="activeTabValue" type="card" @change="handelTab">
        <van-tab v-for="item in buttonList" :title="item.title"></van-tab>
      </van-tabs>
    </div>
    <div class="gamestats-container-banner">
      <h1>{{ currency(gameData.sumBetAmount || 0) }}</h1>
      <span>{{ $t("totalBetAmount") }}</span>
    </div>
    <div class="gamestats-container-list-wrapper">
      <Empty v-if="gameData.list.length === 0" style="margin-top: 40px" />
      <div class="gamestats-container-items" v-else>
        <div
          class="gamestats-container-item"
          v-for="(item, index) in gameData.list"
          :key="index"
        >
          <h1>
            <i
              class="gamestats-container-item-icon"
              :style="gameIconMask(item)"
            ></i>
            <span>{{ item.gameTypeName }}</span>
          </h1>
          <div class="gamestats-container-item-content">
            <i class="gamestats-container-item-steps"></i>
            <div class="gamestats-container-item-content-list">
              <div>
                <h4>{{ $t("betAmount") }}</h4>
                <h5>{{ currency(item.betAmount) }}</h5>
              </div>
              <div>
                <h4>{{ $t("betTimes") }}</h4>
                <h5>{{ item.betCount }}</h5>
              </div>
              <div>
                <h4>{{ $t("winningAmount") }}</h4>
                <span>{{ currency(item.betWinLossAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GameStatis } from "@/api";
import { gameTypeIcon } from "@/components/Home/RedHome/GameList/GameList";
import type { GameStatisData, ReqGetNewMyEmerd } from "@/types/api";
import { AwaitWrap, getDate, currency } from "@/utils";
import { getGameStatsIcon } from "@/utils/assetIcons";
import dayjs from "dayjs";
import { showFailToast } from "vant";
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Empty from "@/components/Empty/index.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const activeTabValue = ref(0);

const buttonList = [
  {
    title: t("today"),
    records: "hello",
  },
  {
    title: t("yesterday"),
    records: "hello",
  },
  {
    title: t("thisWeek"),
    records: "hello",
  },
  {
    title: t("thisMonth"),
    records: "hello",
  },
];

const getTime = (x: number) => {
  let time = {
    start: 0,
    end: 0,
  };
  switch (x) {
    case 0:
      time = getDate().today;
      break;
    case 1:
      time = getDate().yesterday;
      break;
    case 2:
      time = getDate().last7days;
      break;
    case 3:
      time = getDate().thisMonth;
      break;
  }
  let date = {
    startDate: dayjs(time.start * 1000).format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs(time.end * 1000).format("YYYY-MM-DD HH:mm:ss"),
  };
  return date;
};
const qeuryParms = reactive<ReqGetNewMyEmerd>({
  startDate: getTime(0).startDate,
  endDate: getTime(0).endDate,
});

// console.log(dayjs().startOf('day').)
const fixIconName = (item: any) => {
  //转小写，大小写不一致的问题处理
  const it = gameTypeIcon.find(
    (x) => item.gameTypeName.toLowerCase() === x.typeName
  ) as any;
  return it?.icon;
};

const gameIconMask = (item: any) => {
  const url = `url(${getGameStatsIcon(fixIconName(item))})`;
  return { maskImage: url, WebkitMaskImage: url };
};

const gameData = reactive<{
  list: GameStatisData[];
  sumBetAmount: number;
}>({
  list: [],
  sumBetAmount: 0,
});
// 获取游戏统计列表
const getList = async () => {
  const [err, res] = await AwaitWrap(GameStatis(qeuryParms));
  if (err) {
    showFailToast({
      message: err.msg,
      wordBreak: "break-word",
    });
  }
  if (res) {
    gameData.list = res.gameStatis;
    gameData.sumBetAmount = res.sumBetAmount;
  }
};

onMounted(() => {
  getList();
});

const handelTab = (val: number) => {
  qeuryParms.startDate = getTime(val).startDate;
  qeuryParms.endDate = getTime(val).endDate;
  getList();
};
</script>

<style lang="scss" scoped>
.gamestats-container {
  &-header {
    padding: 30px 0 0;
    width: 100%;
    overflow: auto;

    &-items {
      width: 850px;
    }

    :deep(.van-tabs__wrap) {
      height: 60px;
    }

    :deep(.van-tabs--card) {
      .van-tabs__wrap {
        // width: 850px;
        .van-tab--card {
          width: 100%;
          height: 60px;
          background: var(--bg_color_L2);
          box-shadow: none;
          border-radius: 40px;
          font-size: 26px;
          text-align: center;
          color: var(--text_color_L2);
          border: none;
          margin: 0 5px;
        }

        .van-tabs__nav--card {
          border: none;
          background: transparent;
        }

        .van-tab--active {
          background: var(--main_gradient-color);
          color: var(--text_color_L4);
        }
      }
    }
  }

  &-banner {
    height: 240px;
    background: var(--bg_color_L2);
    border-radius: 20px;
    margin: 30px 24px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      color: var(--norm_secondary-color);
      font-size: 42px;
      font-weight: bold;
    }

    span {
      color: var(--text_color_L2);

      margin-top: 24px;
      font-size: 30px;
    }
  }

  &-list-wrapper {
    padding-bottom: 38px;
  }

  &-items {
    background: var(--darkBg, var(--bg_color_L2));
    border-radius: 10px;
    margin: 24px;
    padding: 0px 20px;
    padding-right: 40px;
  }

  &-item {
    padding-top: 27px;

    &:last-child {
      padding-bottom: 27px;
    }

    h1 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-bottom: 14px;

      span {
        font-size: 30px;
        font-weight: bold;
        color: var(--text_color_L1);
      }
    }

    &-icon,
    &-steps {
      display: block;
      flex-shrink: 0;
      background: var(--main_gradient-color2, var(--main-color));
      mask-repeat: no-repeat;
      mask-position: center;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
      -webkit-mask-size: contain;
    }

    &-icon {
      width: 60px;
      height: 60px;
      margin-right: 12px;
      margin-left: 4px;
    }

    &-steps {
      width: 22px;
      height: 128px;
      margin-right: 32px;
      margin-left: 22px;
      mask-image: url("@/assets/svg/gameStats/gameStatsSteps.svg");
      -webkit-mask-image: url("@/assets/svg/gameStats/gameStatsSteps.svg");
    }

    &-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-bottom: 8px;

      &-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding-bottom: 19px;

          &:last-of-type {
            padding-bottom: 0 !important;
          }

          h4 {
            font-size: 28px;
            color: var(--text_color_L2);
          }

          h5 {
            font-size: 28px;
            color: var(--darkTextW, var(--text_color_L1));
          }

          span {
            font-size: 28px;
            color: var(--main-color);
          }
        }
      }
    }
  }
}
</style>
