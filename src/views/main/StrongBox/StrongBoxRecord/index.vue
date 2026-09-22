<template>
  <div class="StrongBoxRecord__container">
    <NavBar
      :title="$t('vaultRecords')"
      :placeholder="false"
      left-arrow
      @click-left="onClick"
    />
    <div class="StrongBoxRecord__container-overview">
      <div class="StrongBoxRecord__container-overview-date" @click="showDataPick = true">
        {{ dateValue }}
        <img src="@public/main/dropDown.png" />
      </div>
      <div class="StrongBoxRecord__container-overview-detail">
        <div>
          <div>{{ digitalCarry(transferIn || 0) }}</div>
          <div>{{ $t("transferIn") }}</div>
        </div>
        <div>
          <div>{{ digitalCarry(transferOut || 0) }}</div>
          <div>{{ $t("transferOut") }}</div>
        </div>
        <div>
          <div>{{ digitalCarry(income || 0) }}</div>
          <div>{{ $t("income") }}</div>
        </div>
      </div>
    </div>

    <div
      class="StrongBoxRecord__container-detailList"
      :class="{ empty: !SafeList.length }"
    >
      <template v-if="SafeList.length">
        <infinite-scroll
          class="sysMessage__container-msgWrapper"
          :distance="100"
          :on-arrived-bottom="getSafeLogListData"
          :loading="loading"
          :finished="finished"
          :page="pageNum"
          v-if="SafeList.length > 0"
        >
          <template #content>
            <StrongBoxRecordCard
				:isOpenNewSetting="isNew"
              class="StrongBoxRecord__container-detailList-item"
              v-for="(item, index) in SafeList"
              :key="index"
              :detail="item"
            />
          </template>
        </infinite-scroll>
      </template>
      <div v-else>
        <Empty />
      </div>
    </div>

    <van-popup v-model:show="showDataPick" round position="bottom">
      <van-date-picker
        v-model="currentDate"
        :title="$t('pickDate')"
        :columns-type="['year', 'month']"
        :formatter="formatter"
        @cancel="cancelDataPick"
        @confirm="onConfirmDataPick"
      />
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fixDateStr, AwaitWrap, digitalCarry } from "@/utils";
import { getSafeLogList } from "@/api";
import InfiniteScroll from "@/components/common/InfiniteScroll.vue";
import StrongBoxRecordCard from "@/components/Main/StrongBoxRecordCard/index.vue";
import Empty from "@/components/Empty/index.vue";
import type { ResGetSafeList } from "@/types/api";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();

const router = useRouter();
const showDataPick = ref(false);
// 日期选择
const { value: dateVal } = fixDateStr({ status: 3 });
// const dateValue = ref(`${dateVal[0]}-${dateVal[1].startsWith('0') ? dateVal[1].replace('0', '') : dateVal[1]}`)
const dateValue = ref(`${dateVal[0]}  ${$t("year")} ${dateVal[1]}  ${$t("month")}`);
const currentDate = ref(dateVal);
const SafeList = ref<ResGetSafeList[]>([]);
const transferIn = ref(0);
const transferOut = ref(0);
const income = ref(0);
const pageNum = ref(1);
const finished = ref(false);
const loading = ref(false);
const isNew = router.currentRoute.value.query.isNew ||false

const languagesN = localStorage.getItem("language");

// 时间格式处理方法
function formatter(type: String, option: any) {
  if (type === "year") {
    switch (languagesN) {
      case "vi":
        option.text = $t("year") + " " + option.text;
        break;
      case "en":
        option.text = $t("year") + " " + option.text;
        break;
      default:
        option.text += $t("year");
    }
  }
  if (type === "month") {
    // option.text += $t('month')
    switch (languagesN) {
      case "vi":
        option.text = $t("month") + " " + option.text;
        break;
      case "en":
        option.text = $t("month") + " " + option.text;
        break;
      default:
        option.text += $t("month");
    }
  }
  return option;
}
// 取消日期
const cancelDataPick = () => {
  showDataPick.value = false;
};
// 确认日期
const onConfirmDataPick = ({ selectedOptions }: any) => {
  showDataPick.value = false;
  let [{ text: year }, { text: month }] = selectedOptions;
  if (month.startsWith("0")) {
    month = month.replace("0", "");
  }
  dateValue.value = year + month;
  getSafeLogListData();
};
// 返回上一页
function onClick() {
  router.go(-1);
}
// 查询记录
const getSafeLogListData = async () => {
  const month = `${currentDate.value[0]}-${currentDate.value[1]}`;
  const [err, res] = await AwaitWrap(
    getSafeLogList({ month, pageNo: pageNum.value, pageSize: 20 })
  );
  if (res) {
    //SafeList.value.push(...res.list)
    SafeList.value = res.list;
    transferIn.value = res.extend2;
    transferOut.value = res.extend3;
    income.value = res.extend1;
    loading.value = false;
    if (pageNum.value >= res.totalPage) {
      finished.value = true;
    } else {
      pageNum.value++;
    }
  }
};

onMounted(async () => {
  getSafeLogListData();
});
</script>
<style lang="scss" scoped>
.StrongBoxRecord__container {
  position: relative;
  width: 100%;
  font-family: "Inter", sans-serif;
  overflow: auto;
  padding: 0 0 46px 0;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &-overview {
    height: 240px;
    background-image: url("@icon/main/StrongBoxRecordBg.png");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    padding-top: 104px;
    flex: none;

    &-date {
      position: absolute;
      top: 46px;
      right: 24px;
      height: 46px;
      line-height: 46px;
      border: 0.5px solid #fff;
      border-radius: 40px;
      font-size: 28px;
      text-align: center;
      color: #fff;
      padding: 0 23px;
      display: flex;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        margin-left: 15px;
      }
    }

    &-detail {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-between;
      text-align: center;

      & > div {
        width: 33.3%;
        height: 100%;
        color: #fff;

        & > div {
          font-weight: 500;
          font-size: 28px;
          height: 30px;
          line-height: 30px;

          &:first-child {
            font-size: 36px;
            height: 48px;
            line-height: 48px;
            margin-bottom: 23px;
          }
        }
      }
    }
  }

  &-detailList {
    padding: 40px 24px;

    &-item {
      & + .StrongBoxRecord__container-detailList-item {
        margin-top: 20px;
      }
    }

    &.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
  }
}
</style>
