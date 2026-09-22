<template>
  <div class="record">
    <div class="record-head">
      <van-row>
        <van-col span="10"><span>{{ $t('betIssue') }}</span></van-col>
        <van-col span="5"><span>{{ $t('number') }}</span></van-col>
        <van-col span="5"><span>{{ $t('bigOrSmall') }}</span></van-col>
        <van-col span="4"><span>{{ $t('color') }}</span></van-col>
      </van-row>
    </div>
    <div class="record-body">
      <van-row v-for="(item, index) in emerdList" :key="index">
        <van-col span="10">{{ item.issueNumber }}</van-col>
        <van-col span="5" class="numcenter">
          <div class="record-body-num" :class="setColor(item.number)">
            {{ item.number }}
          </div>
        </van-col>
        <van-col span="5">
          <span v-if="Number(item.number) > 4">{{ $t('betBig') }}</span>
          <span v-else>{{ $t('betSmall') }}</span>
        </van-col>
        <van-col span="4">
          <div class="record-origin">
            <template v-if="item.number == '0'">
              <div class="record-origin-I red" />
              <div class="record-origin-I violet" />
            </template>
            <template v-if="item.number == '1' || item.number == '3' || item.number == '7' || item.number == '9'">
              <div class="record-origin-I green" />
            </template>
            <template v-if="item.number == '2' || item.number == '4' || item.number == '6' || item.number == '8'">
              <div class="record-origin-I red" />
            </template>
            <template v-if="item.number == '5'">
              <div class="record-origin-I green" />
              <div class="record-origin-I violet" />
            </template>
          </div>
        </van-col>
      </van-row>
      <section class="flex-center record-body-loading" style="height: 100%" v-if="loading">
        <van-loading  type="spinner" color="#FD565C" />
      </section>
      <div v-if="emerdList.length===0&&!loading" class="record-body-empty flex-center">
        <Empty />
      </div>
    </div>
    <div v-if="emerdList.length" class="record-foot">
      <div class="record-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
        <van-icon name="arrow-left" class="record-icon" size="20" />
      </div>
      <div class="record-foot-page">{{ pageNo }}/{{ totalPage }}</div>
      <div class="record-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
        <van-icon name="arrow" class="record-icon" size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {ref, watch, computed} from 'vue';
  import {GetHistoryIssuePageRsp, getLotteryHistoryIssue} from '@/saasLottery/api'
  import {useGlobalContext} from "@/saasLottery/hooks";
  import { useWingoContext} from "../../hooks";
  import {Empty} from "@/saasLottery/components";
  // 后台有优化需求 第一页取oss 第二页取接口
  const {gameCode}=useGlobalContext();
  const {historyIssues,historyIssuesTotalPage}=useWingoContext()
  const NoaverageEmerdList = ref<GetHistoryIssuePageRsp[]>([]);
  const loading=ref(false)
  const emerdList=computed(()=>NoaverageEmerdList.value.length?NoaverageEmerdList.value:historyIssues.value)
  const totalPage = ref(historyIssuesTotalPage.value);
  const pageSize = ref(10);
  const pageNo = ref(1);
  // 上一页
  const pPage = () => {
    if (pageNo.value<2) {
      return
    };
    pageNo.value--;
    getData();
  };

  // 下一页
  const nPage = () => {
    pageNo.value++;
    if (pageNo.value>totalPage.value) return;
    getData();
  };
  //获取记录
  const getData = async () => {
    try {
      loading.value=true;
      const {result,data,}=await getLotteryHistoryIssue({
        gameCode:gameCode.value,
        pageNo:pageNo.value,
        pageSize:pageSize.value,
      });
      if (result){
        NoaverageEmerdList.value=data.list||[];
        pageNo.value=data.pageNo||1;
        totalPage.value=data.totalPage||0
      }
    }catch (e){

    }finally {
      loading.value=false;
    }
  };
  const isOddNumber = (str: string) => {
    let num = parseInt(str, 10);
    return num % 2 !== 0;
  };

  const setColor = (num: any): any => {
    let className = '';
    if (isOddNumber(num)) {
      className = 'greenColor';
    } else {
      className = 'defaultColor';
    }
    switch (num) {
      case '0':
        className = 'mixedColor0';
        break;
      case '5':
        className = 'mixedColor5';
        break;
    }
    return className;
  };
  watch(historyIssues,()=>{
    NoaverageEmerdList.value=[];
    pageNo.value=1;
  });
  watch(historyIssuesTotalPage,()=>{
    totalPage.value=historyIssuesTotalPage.value;
  })
</script>
<style lang="scss" scoped>
  .record {
    text-align: center;
    font-size: 24px;
    &-head {
      height: 80px;
      border-radius: 10px 10px 0px 0px;
      background: var(--bgDark-2, var(--sheet_nva_color));
      font-weight: 500;
      font-size: 24px;
		text-align: center;
      color: #fff;
      .van-col {
        height: 80px;
		  display: flex;
		  align-content: center;
		  justify-content: center;
		  word-break: break-all;
		  text-overflow: ellipsis;
		  display: -webkit-box;
		  -webkit-box-orient: vertical;
		  -webkit-line-clamp: 2;
      }
    }

    &-body {
      position: relative;
      //border-top: 1px solid #e1e1e1;
      line-height: 80px;
      padding: 0 0 10px 0;
		background: var(--darkBg, var(--bg_color_L2));
		color: var(--darkTextW, var(--text_color_L1));
      margin-bottom: 36px;

      .numcenter {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-loading{
        position: absolute;
        top:0;
        width: 100%;
        height: 100%;
      }

      &-num {
        height: 60px;
        line-height: 60px;
        width: 60px;
        font-weight: bold;
        font-size: 50px;
      }
      .mixedColor0 {
        background: linear-gradient(180deg, #f23f3f 50.96%, rgb(182, 89, 254) 50.97%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .mixedColor5 {
        background: linear-gradient(180deg, #47ba7c 50%, #ec4cdf 50%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .greenColor {
        color: var(--norm_green-color);
      }
      .defaultColor {
        color: var(--norm_red-color);
      }

      &-empty {
        height: 400px;
      }

      & > div {
		  color: var(--darkTextW, var(--text_color_L1));
        //border-bottom: 1px solid #e1e1e1;

      }
      & > div:last-child {
        border-bottom: none;
      }

    }

    &-origin {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      & > div {
        & + div {
          margin-left: 20px;
        }
      }

      &-I {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        &.violet {
          background-color: #ec4cdf;
        }

        &.red {
          background: #f23f3f;
        }

        &.green {
          background: #47ba7c;
        }
      }
    }

    &-foot {
      height: 140px;
      padding: 0 178px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      //margin-bottom: 70px;
		background: var(--darkBg, var(--bg_color_L2));
		color: var(--text_color_L2);

      &-previous,
      &-next {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        background: var(--main-color);
        color: var(--text_color_L4);
        display: flex;
        align-items: center;
        justify-content: center;

        &.disabled {
          background: var(--bg_color_L3);
          pointer-events: none;
          color: var(--dividing-line_color);
        }
      }
    }
  }
</style>
