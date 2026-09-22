<template>
  <div class="t">
    <div class="t_head">
      <div>{{ $t('betIssue') }}</div>
      <div>{{ $t('number') }}</div>
    </div>
    <div class="t-b1">
    <div class="t-b1-l w">
      <div class="w">{{ $t('w8') }}</div>
       <div>{{ $t('w9') }}</div>
  </div>

      <div class="t-b1-l lottery">
      <div>{{ $t('w11') }}</div>
        <div class="t-b1-l-n" >
       <div v-for="item in 10" :key="item">{{ item - 1 }}</div>
       </div>
      </div>
      <div class="t-b1-l" >
        <div>{{ $t('trendDesc3') }}</div>
        <div class="t-b1-l-n">
          <div v-for="(item, r4I) in statistics" :key="'4' + r4I">{{ item.missingCount }}</div>
        </div>
      </div>
      <div class="t-b1-l">
        <div>{{ $t('trendDesc4') }}</div>
        <div class="t-b1-l-n">
          <div v-for="(item, r2I) in statistics" :key="'2' + r2I">{{ item.avgMissing }}</div>
        </div>
      </div>
      <div class="t-b1-l" >
        <div>{{ $t('trendDesc5') }}</div>
        <div class="t-b1-l-n">
          <div v-for="(item, r5I) in statistics" :key="'5' + r5I">{{ item.openCount }}</div>
        </div>
      </div>
      <div class="t-b1-l" >
        <div>{{ $t('trendDesc6') }}</div>
        <div class="t-b1-l-n">
          <div v-for="(item, r3I) in statistics" :key="'3' + r3I">{{ item.maxContinuous }}</div>
        </div>
      </div>
    </div>
    <div class="t-b2">
      <div
          v-for="(item, index) in EmerdList"
          :key="index"
          :IssueNumber="item.issueNumber"
          :Number="item.number"
          :Colour="item.colour"
          :rowId="index"
          class="t-b2-item"
      >
        <van-row>
          <van-col span="9">
            <div class="t-b2-i">{{ item.issueNumber }}</div>
          </van-col>
          <van-col span="15">
            <div class="t-b2-Num">
              <canvas  :id="'myCanvas' + index" ref="canvas" class="line-canvas"></canvas>
              <div class="t-b2-Num-item" :class="Number(item.number) == num - 1 ? 'action' + (num - 1) : ''" v-for="num in 10" :key="num">
                {{ num - 1 }}
              </div>
              <div class="t-b2-Num-BS" :class="{ isB: Number(item.number) > 4 }">
                {{ Number(item.number) > 4 ? 'B' : 'S' }}
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="flex-center t-b2-loading" style="height: 100%" v-if="loading">
        <van-loading  type="spinner" color="#FD565C" />
      </div>
      <div v-if="EmerdList.length===0&&!loading" class="t-b2-empty flex-center">
        <Empty />
      </div>
    </div>
    <div v-if="EmerdList.length" class="t-foot">
      <div class="t-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
        <van-icon name="arrow-left" class="t-icon" size="20" />
      </div>
      <div class="t-foot-page">{{ pageNo }}/{{ totalPage }}</div>
      <div class="t-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
        <van-icon name="arrow" class="t-icon" size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
 import {ref, nextTick, onMounted, computed, watch, onActivated,} from 'vue';
	import { Empty } from '@/saasLottery/components'
  import {useWingoContext} from "../../hooks";
  import {GetHistoryIssuePageRsp, getLotteryHistoryIssue, getLotteryTrendStatistics} from "@/saasLottery/api";
  const {historyIssues,gameCode,historyIssuesTotalPage,issue}=useWingoContext();
  const NoaverageEmerdList = ref<GetHistoryIssuePageRsp[]>([]);
  const EmerdList=computed(()=>NoaverageEmerdList.value.length?NoaverageEmerdList.value:historyIssues.value)
  const statistics=ref<Record<string, any>[]>([])
  const pageNo = ref(1);
  const pageSize = ref(10);
  const loading=ref(false)
  const totalPage = ref(historyIssuesTotalPage.value);
  // 遍历元素，划线
  function getReport() {
    nextTick(() => {
      for (let i = 0; i < EmerdList.value.length; i++) {
        if (EmerdList.value[i + 1]) {
          getCanvas(i,EmerdList.value[i], EmerdList.value[i + 1]);
        }
      }
    });
  }
  function getCanvas(rowId:number,el: any, number: any) {
   //获取Canvas对象(画布)
    let currentNum = parseInt(el.number); //当前
    let termNum = parseInt(number.number); //上一期
    const canvas: any = document.getElementById('myCanvas' + rowId);
    if (canvas && canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); //清除画线从新画
      ctx.beginPath();
      ctx.moveTo(currentNum == 0 ? 20 : currentNum * 29 + 20, 0);

      ctx.lineTo(termNum == 0 ? 20 : termNum * 29 + 20, canvas.height);
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.closePath();
    }
  }
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
  const getTrend=async ()=>{
    const {result,data}= await getLotteryTrendStatistics({
      gameCode:gameCode.value,
      pageNo:pageNo.value,
      pageSize:10,
    });
    if (result) statistics.value=data;
  }
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
  onMounted(async ()=>{
    if (EmerdList.value.length){
      getReport();
    }
    await getTrend();
  });

  onActivated(() => {
    getReport();
	getTrend();
	getData()
  });
  watch(issue,()=>{
	  getTrend();
  })
  watch(EmerdList,()=>{
	 getReport();
  })
</script>
<style lang="scss" scoped>
  .t {
    width: 100%;
    text-align: center;
    font-size: 24px;
    padding: 0 0 24px 0;

    .t_head {
      height: 80px;
      line-height: 80px;
      font-weight: 700;
      font-size: 26px;
      color: #fff;
      border-radius: 10px 10px 0px 0px;
      background: var(--sheet_nva_color);
      div:nth-child(1) {
        width: 30%;
        display: inline-block;
        text-align: center;
      }
      div:nth-child(2) {
        width: 70%;
        display: inline-block;
        text-align: center;
      }
    }
    &-head {
      height: 80px;
      line-height: 80px;
      background: var(--sheet_nva_color);
      border-radius: 10px 10px 0 0;
      font-weight: 700;
      font-size: 26px;
      color: #fff;
    }

    &-b1 {
      background: var(--bgDark-2, var(--bg_color_L2));
      padding-bottom: 28px;

      &-l {
        display: flex;
        font-size: 26px;
        color: var(--text_color_L1);
        .w {
          font-weight: 500;
          font-size: 28px;
        }
        & > div {
          &:first-child {
            width: 278px;
            padding-left: 20px;
            text-align: left;
          }
        }

        &-n {
          display: flex;
          justify-content: space-between;
          flex: 1;
          padding-right: 15px;

          & > div {
            width: 36px;
            height: 36px;
            line-height: 36px;
            font-size: 26px;
            color: #9DA7B3;
            text-align: center;
          }
        }

        &.lottery {
          .t-b1-l-n {
            & > div {
              border-radius: 50%;
              width: 36px;
              height: 36px;
              line-height: 32px;
              font-size: 26px;
              font-weight: 400;
              text-align: center;
              font-family: Roboto;
              border: 1px solid #fd565c;
              color: #fd565c !important;
            }
          }
        }
        & + .t-b1-l {
          margin-top: 20px;
        }

        &:first-child {
          padding-top: 26px;
          height: 57px;
          //padding-left: 20px;
        }

        &-lottery {
          height: 36px;
        }
      }
    }

    &-b2 {
      position: relative;
      font-size: 24px;
      background-color: var(--bg_color_L2, var(--text_color_L1));
      padding: 0 0 10px 0;
      //border-top: 1px solid #e1e3f2;
      margin-bottom: 36px;
      &-item {
        height: 100px;
        padding: 34px 20px;
        border-bottom: 1px solid #e1e3f2;
      }
      &-item:last-child {
        border-bottom: none;
      }
      &-empty {
        height: 400px;
      }
      &-loading{
        position: absolute;
        top:0;
        width: 100%;
        height: 100%;
      }

      &-i {
        color: var(--text_color_L1);
        text-align: left;
      }

      &-Num {
        display: flex;
        position: relative;
        height: 32px;

        & > div {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 50%;
        }

        &-item {
          border: 1px solid #e1e3f2;
          color: #BBB;
          margin-right: 8px;
          font-size: 24px;

          &.action0 {
            position: relative;
            z-index: 10;
            border: none;
            color: #fff;
            background-image: linear-gradient(135deg, #fd565c 0%, #fd565c 50.37%, #ec4cdf 50.38%, #ec4cdf 100%) !important;
          }

          &.actionB {
            border: none;
            color: #fff;
            background-color: #f3bd14;
          }

          &.actionS {
            border: none;
            color: #fff;
            background-color: var(--bgColor-13);
          }

          &.action5 {
            border: none;
            color: #fff;
            background-image: linear-gradient(to bottom right, #47ba7c 50%, #ec4cdf 0) !important;
            position: relative;
            z-index: 10;
          }

          &.action1,
          &.action3,
          &.action7,
          &.action9 {
            border: none;
            color: #fff;
            background-color: #47ba7c;
            position: relative;
            z-index: 10;
          }

          &.action2,
          &.action4,
          &.action6,
          &.action8 {
            border: none;
            color: #fff;
            background-color: #fd565c;
            position: relative;
            z-index: 10;
          }
        }

        &-BS {
          color: #fff;
          background: #609dec;
          margin-left: 14px;

          &.isB {
            background: #f3bd14;
          }
        }
      }

      .line-canvas {
        position: absolute;
        top: 50%;
        left: 0;
        height: 100px;
        width: calc(100% - 48px);
        z-index: 0;
        html:lang(ar) & {
          left: unset;
          right: 0;
          transform: scaleX(-1);
        }
      }
    }

    &-origin {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &-I {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        &.violet {
          background-color: var(--bgcolor-21);
        }

        &.red {
          background: #fd565c;
        }

        &.green {
          background: var(--bgcolor-22);
        }
      }
    }

    &-foot {
      height: 140px;
		background: var(--darkBg, var(--bg_color_L2));
		color: var(--text_color_L2);
      padding: 0 178px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 70px;
      &-page {
        color: var(--text_color_L2);
      }
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
          color: var(--text_color_L2);
        }
      }
    }
  }
</style>
