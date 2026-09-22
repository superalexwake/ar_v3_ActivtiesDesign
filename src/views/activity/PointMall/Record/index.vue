<template>
  <div class="pointMallRecord__container">
    <NavBar :title="$t('pointsRecord')" left-arrow @click-left="onClick">
      <template #right>
        <div class="navbar__content-right__buttons">
          <svg-icon name="recordFilter" @click="onFilterClick" />
        </div>
      </template>
    </NavBar>

    <div class="pointMallRecord__container-header">
      <div class="points-date">
        <div class="pointMallRecord__container-header-date" @click="showDataPick = true">
          <div>{{ dateValue }}</div>
          <svg-icon name="dropDown" />
        </div>
      </div>
      <div class="pointMallRecord__container-header__content">
        <div class="pointMallRecord__container-header__content-left">
          <div>{{ income.toFixed(2) }}</div>
          <div>
            <svg-icon name="income" />
            <span>{{ $t("pointsIncome") }}</span>
          </div>
        </div>
        <div class="pointMallRecord__container-header__content-right">
          <div>{{ output.toFixed(2) }}</div>
          <div>
            <svg-icon name="output" />
            <span>{{ $t("payout") }}</span>
          </div>
        </div>
      </div>
    </div>

    <List
        :api="GetIntegralLogList"
        v-model:list="recordList"
        ref="listRef"
        :pageQuery="pageQuery"
    >
      <template #content>
        <div class="pointMallRecord__container-list" v-if="recordList.length > 0">
          <div
              class="pointMallRecord__container-list__item"
              v-for="(item, index) in recordList"
              :key="index"
          >
            <div class="pointMallRecord__container-list__item-left">
              <div>{{ keytransvalue(item.type) }}</div>
              <div>{{ item.addTime }}</div>
            </div>
            <!--这个位置type==3才是红色，其余的时候都是绿色  shon确认-->
            <div class="pointMallRecord__container-list__item-right">
              <div
                  :class="{
                  color2fb192: item.integral && item.type !== 3,
                  colorf95959: item.integral && item.type === 3,
                }"
              >
                <!--这个位置type==3或者4才是-号，其余的时候都是+ shon确认-->
                <span v-if="item.integral && (item.type === 3 || item.type === 4)"
                >-</span
                >
                <span v-else>+</span>{{ item.integral.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </List>
  </div>
  <van-popup  v-model:show="showDataPick" round position="bottom">
    <van-date-picker
        v-model="currentDate"
        :title="$t('pickDate')"
        :columns-type="['year', 'month']"
        :formatter="formatter"
        @cancel="cancelDataPick"
        @confirm="onConfirmDataPick"
    />
  </van-popup>
  <!-- <van-calendar v-model:show="calendarProps.show" type="range" @confirm="onCalenderConfirm" color="#F95959"
		:min-date="calendarProps.minDate" :max-date="calendarProps.maxDate" /> -->

  <van-action-sheet
      v-model:show="filterSheetProps.show"
      :actions="filterSheetProps.actions"
      @select="onFilterConfirm"
  />
</template>

<script setup lang="ts">
import {GetIntegralLogList} from "@/api";
import { dateRange1, fixDateStr } from "@/utils";
import type {ReqIntegralLogList} from "@/types/api";
import {computed, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
// import Empty from '@/components/Empty/index.vue'
import List from "@/components/common/ListSimply.vue";
import dayjs from "dayjs";

const showDataPick = ref(false);
const {t: $t} = useI18n();
const listRef = ref();

const router = useRouter();
const {minDate, maxDate} = dateRange1();
const languagesN = localStorage.getItem("language");
const {value: dateVal} = fixDateStr({status: 3});

let dateValue = ref<any>(`${dateVal[0]}${$t("year")}${dateVal[1]}${$t("month")}`);

// function getMonthFirstLastDay() {
// 	var myDate = new Date()
// 	var currentMonth = myDate.getMonth()
// 	var firstDay = new Date(myDate.getFullYear(), currentMonth, 1)
// 	var lastDay = new Date(firstDay.getFullYear(), currentMonth + 1, 0)
// 	return lastDay
// }
// const calendarProps = reactive({
// 	minDate: new Date(new Date().getFullYear() - 1, 0, 1),
// 	maxDate: getMonthFirstLastDay(),
// 	show: false
// })
const calendarData = reactive({
  startDate: dayjs(minDate).format("YYYY-MM-DD HH:mm:ss"),
  endDate: dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss"),
});

calendarData.startDate = `${dateVal[0]}-${dateVal[1]}-01 00:00:00`;
const lastDay = new Date(dateVal[0], dateVal[1], 0).getDate();
calendarData.endDate = `${dateVal[0]}-${dateVal[1]}-${lastDay} 23:59:59`;

const filterSheetProps = reactive({
  show: false,
  actions: [
    {
      name: $t("pointsAllRecords"),
      value: -1,
    },
    {
      name: $t("pointsBets"),
      value: 0,
    },
    {
      name: $t("pointsRedeem"),
      value: 3,
    },
    {
      name: $t("pointsCanceled"),
      value: 5,
    },
    {
      name: $t("wealName1"),
      value: 6,
    },
    {
      name: $t("wealName2"),
      value: 7,
    },
  ],
  selected: {
    name: "",
    value: 0,
  },
});

const income = computed(() =>
    recordList.value
        .filter((item) => item.type !== 3)
        .reduce((prev, cur) => prev + cur.integral, 0)
);
const output = computed(() =>
    recordList.value
        .filter((item) => item.type === 3)
        .reduce((prev, cur) => prev + cur.integral, 0)
);

interface ProductList {
  addTime: string;
  integral: number;
  orderNumber: string;
  remarks: string;
  type: number;
}

const recordList = ref<Array<ProductList>>([]);

function onClick() {
  router.back();
}

const currentDate = ref(dateVal);

// function onCalendarClick() {
// 	calendarProps.show = true
// }
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
  console.log("取消日期");
  showDataPick.value = false;
};
// 确认日期
const onConfirmDataPick = ({selectedOptions}: any) => {
  console.log("确认日期");
  showDataPick.value = false;
  let [{text: year}, {text: month}] = selectedOptions;
  let yearN = year.slice(0, -1);
  let monthN = month.slice(0, -1);
  if (month.startsWith("0")) {
    month = month.replace("0", "");
  }
  dateValue.value = year + month;
  const lastDay = new Date(
      new Date().getFullYear(),
      selectedOptions[1].value,
      0
  ).getDate();
  calendarData.startDate = `${selectedOptions[0].value}-${selectedOptions[1].value}-01 00:00:00`;
  calendarData.endDate = `${selectedOptions[0].value}-${selectedOptions[1].value}-${lastDay} 23:59:59`;

  // calendarData.endDate = dayjs(new Date(e[1])).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  // getRecordListData(-1)

  pageQuery.startDate = calendarData.startDate;
  pageQuery.endDate = calendarData.endDate;
  listRef.value.resetRefresh();
};

// function onCalenderConfirm(e: any[]) {
// 	// console.log(dayjs(new Date(e[0])).startOf('day').format('YYYY-MM-DD HH:mm:ss'))
// 	calendarData.startDate = dayjs(new Date(e[0])).startOf('day').format('YYYY-MM-DD HH:mm:ss')
// 	calendarData.endDate = dayjs(new Date(e[1])).endOf('day').format('YYYY-MM-DD HH:mm:ss')
// 	dateValue = calendarData.startDate + calendarData.endDate
// 	// getRecordListData(-1)
// 	calendarProps.show = false

// 	listRef.value.resetRefresh()
// }

function onFilterClick() {
  filterSheetProps.show = true;
}

//选择类型列表
function onFilterConfirm(e: { name: string; value: number }) {
  filterSheetProps.selected = e;
  console.log("filterSheetProps.selected", filterSheetProps.selected);
  // getRecordListData(e.value)

  pageQuery.type = e.value;
  filterSheetProps.show = false;
  listRef.value.resetRefresh();
}

function keytransvalue(targerkey: number) {
  const targetObjects = filterSheetProps.actions.filter(
      (item) => item.value === targerkey
  );
  const targetNames = targetObjects.map((item) => item.name);
  const str = targetNames[0];
  if (!str) return "";
  const result = str.replace(/[\[\]"]/g, "");
  return result;
}

const pageQuery = reactive<ReqIntegralLogList>({
  type: -1,
  startDate: calendarData.startDate,
  endDate: calendarData.endDate,
});
// async function getRecordListData(type: number) {
// 	const res = await AwaitApiResult(
// 		GetIntegralLogList({
// 			pageNo: 1,
// 			pageSize: 20,
// 			type: type,
// 			startDate: calendarData.startDate,
// 			endDate: calendarData.endDate
// 		})
// 	)
// 	if (res) recordList.value = res.data.list || []
// }

onMounted(() => {
  // getRecordListData(-1)
  listRef.value.resetRefresh();
});
</script>

<style lang="scss" scoped>
.pointMallRecord__container {
  padding-block: 0 75px;
  font-family: "Inter", sans-serif;

  svg{
    width: 48px;
    height: 48px;
  }
  :deep(.navbar__content-right) {
    .navbar__content-right__buttons {
      display: flex;
      align-items: center;
      gap: 30px;
    }
  }

  .color2fb192 {
    color: var(--main-color) !important;
  }

  .colorf95959 {
    color: var(--norm_red-color) !important;
  }

  .no-data {
    margin-top: 5rem;

    .empty__container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  &-header {
    display: grid;
    place-items: center;
    width: 100%;
    height: 240px;
    color: var(--text_color_L1);
    background: url("@/assets/icons/activity/PointMall/recordHeaderBg.png") no-repeat;
    background-size: cover;
    background-color: var(--light-main-color, var(--bg_color_L2));

    .points-date {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      padding-left: 60px;
      padding-top: 20px;
    }

    &-date {
      min-width: 260px;
      height: 46px;
      line-height: 46px;
      border: 0.5px solid var(--text_white, var(--text_color_L1));
      border-radius: 40px;
      font-size: 28px;
      text-align: center;
      color: var(--text_white, var(--text_color_L1));
      //padding: 0 23px;
      align-items: center;
      display: inline-flex;
      justify-content: space-between;

      div {
        padding: 4px 0 0 16px;
      }
    }

    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 231px;
      width: 100%;

      &-left,
      &-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 100%;

        div {
          &:first-of-type {
            margin-bottom: 24px;
            font-size: 48px;
            color: var(--text_white, var(--text_color_L1));
            font-weight: 500;
            line-height: 48px;
           
            
          }

          &:last-of-type {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text_white, var(--text_color_L1));
            width: 100%;
            gap:10px;
            font-size: 28px;
          }
        }
      }
    }
  }

  &-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 40px;
    padding-inline: 24px;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 19px 20px;
      border-radius: 10px;
      background: var(--darkBg, var(--bg_color_L2));

      &-left {
        div {
          &:first-of-type {
            color: var(--darkTextW, var(--text_color_L1));
            font-size: 30px;
          }

          &:last-of-type {
            margin-top: 8px;
            font-size: 24px;
            color: var(--text_color_L3);
          }
        }
      }

      &-right {
        font-size: 36px;
        font-weight: 400;
        font-family: $font-family;
      }
    }
  }
}
</style>
