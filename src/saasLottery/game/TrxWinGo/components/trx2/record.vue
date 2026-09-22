<template>
  <div class="trx_r">
    <div class="trx_r-head">
      <van-row>
        <van-col span="5"><span>
			{{ $t('winTrxNum') }}
		</span></van-col>
        <van-col span="5">
			<span>{{ $t('winTrxDesc1') }}</span>
		</van-col>
        <van-col span="5">
			<span>{{ $t('winTrxDesc2') }}</span>
		</van-col>
        <van-col span="4">
			<span>{{ $t('winTrxDesc3') }}</span>
		</van-col>
        <van-col span="5">
			<span>{{ $t('winTrxDesc4') }}</span>
		</van-col>
      </van-row>
    </div>
    <div class="trx_r-body">
      <template v-if="NoaverageEmerdList.length">
        <van-row v-for="(item, index) in NoaverageEmerdList" :key="index">
          <van-col span="5">{{ item.issue }}</van-col>
          <van-col span="6">
            <div class="fl">
              {{ item.blockNumber }}
              <div v-if="item.blockNumber" class="Binquire" @click="goTron(item.blockNumber)" />
            </div>
          </van-col>
          <van-col span="4"> {{ item.time }}</van-col>
          <van-col span="4">{{ item.blockName }}</van-col>
          <van-col span="4">
            <div class="numberC">
              <div class="number" :class="['num' + item.number]">{{ item.number }}</div>
              <div :class="[Number(item.number) > 4 ? 'big' : 'small']">
                {{ Number(item.number) > 4 ? 'B' : 'S' }}
              </div>
            </div>
          </van-col>
        </van-row>
      </template>
      <div v-else class="trx_r-body-empty">
        <Empty />
      </div>
    </div>
    <div v-if="NoaverageEmerdList.length" class="trx_r-foot">
      <div class="trx_r-foot-previous" :class="{ disabled: pageNo <= 1 }" @click="pPage">
        <van-icon name="arrow-left" class="trx_r-icon" size="20" />
      </div>
      <div class="trx_r-foot-page">{{ pageNo }}/{{ totalPage }}</div>
      <div class="trx_r-foot-next" :class="{ disabled: pageNo >= totalPage }" @click="nPage">
        <van-icon name="arrow" class="trx_r-icon" size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onActivated, watch, onDeactivated, inject } from 'vue';
  import { GetHistoryIssuePageRsp, getLotteryHistoryIssue } from '@/saasLottery/api'
  import {Empty} from '@/saasLottery/components'
  import { useGlobalContext } from "@/saasLottery/hooks";
  const list = ref<any>([]);
  // 使用 inject 接收父组件传递的实例
  const trxWinHook: any = inject('trxWinHook');
  // 后台有优化需求 第一页取oss 第二页取接口
  const { gameCode, trigger } = useGlobalContext();
  const NoaverageEmerdList = ref<GetHistoryIssuePageRsp[]>([]);
  const { historyIssuesTotalPage, historyIssues, update } = trxWinHook;
  // 使用 inject 接收父组件传递的实例
  const totalPage = ref(historyIssuesTotalPage.value);
  const pageSize = ref(10);
  const pageNo = ref(1);
  const loading = ref(false)
  // 上一页
  const pPage = () => {
    if (pageNo.value < 2) {
      return
    };
    pageNo.value--;
    getData();
  };
  const emits = defineEmits<{
    (e: 'changefive', val: any): void;
  }>();
  // 下一页
  const nPage = () => {
    pageNo.value++;
    if (pageNo.value > totalPage.value) return;
    getData();
  };
  //获取记录
  const getData = async () => {
    try {
      loading.value = true;
      const { result, data, } = await getLotteryHistoryIssue({
        gameCode: gameCode.value,
        pageNo: pageNo.value,
        pageSize: pageSize.value,
      });
      if (result) {
        NoaverageEmerdList.value = data.list.map((item: any) => {
          if (item.blockId) {
            var disLength = item.blockId.length;
            var shortName2 = item.blockId.substring(disLength - 4, disLength);
            item.blockName = '**' + shortName2;
          }
          if (item.issueNumber) {
            let number = item.issueNumber;
            var Number1 = number.substring(0, 3);
            var disLength1 = item.issueNumber.length;
            var Number2 = item.issueNumber.substring(disLength1 - 4, disLength1);
            item.issue = Number1 + '**' + Number2;
          }
          if (item.blockTimestamp) {
            let date = new Date(item.blockTimestamp)
            item.time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
          }
          return item;
        }) || [];
        pageNo.value = data.pageNo || 1;
        totalPage.value = data.totalPage || 0
      }
    } catch (e) {

    } finally {
      loading.value = false;
    }
  };


  const goTron = (item: any) => {
    let url = `https://tronscan.org/#/block/${item}`;
    window.location.href = url
  };
  const lock = ref(false);

  watch(historyIssuesTotalPage, () => {
    totalPage.value = historyIssuesTotalPage.value;
  })
  watch(update, () => {
    pageNo.value = 1;
    getData()
  });
  onDeactivated(() => {
    lock.value = true;
  });
  onActivated(() => {
    lock.value = false;
    getData();
  });
  trigger.on(() => {
    getData();
  })
</script>
<style lang="scss" scoped>
  .trx_r {
    width: calc(100% - 52px);
    margin: 36px auto 0;
    text-align: center;
    font-size: 24px;

    &-head {
      min-height: 80px;
      line-height: 40px;
      background: var(--sheet_nva_color);
      border-radius: 10px 10px 0px 0px;
      font-weight: 700;
      font-size: 26px;
      color: #fff;

      .van-col {
        min-height: 80px;
        overflow: hidden;
		  display: flex;
		  justify-content: center;	
		  align-items: center;
      }
    }

    &-body {
      line-height: 80px;

      &-empty {
        height: 400px;
      }

      :deep(.van-col) {
        position: relative;
        height: 100px;
        line-height: 100px;
      }

      &>div {
        background: var(--darkBg, var(--bg_color_L2));
        color: var(--darkTextW, var(--text_color_L1));

        &+div {
          border-top: 1px solid var(--gray-color-1);
        }
      }

      .numberC {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 11px;

        &>div {
          width: 36px;
          height: 36px;
          font-size: 24px;
          line-height: 36px;
        }
      }

      .small,
      .big {
        margin-left: 10px;
      }

      .big {
        color: var(--norm_secondary-color);
      }

      .small {
        color: var(--norm_bule-color);
      }

      .number {
        color: #fff;
        border-radius: 50%;

        &.num1,
        &.num3,
        &.num7,
        &.num9 {
          background-color: var(--norm_green-color);
        }

        &.num2,
        &.num4,
        &.num6,
        &.num8 {
          background-color: var(--norm_red-color);
        }

        &.num0 {
          background-image: linear-gradient(to bottom right, var(--norm_red-color) 50%, var(--norm_Purple-color) 0);
        }

        &.num5 {
          background-image: linear-gradient(to bottom right, var(--norm_green-color) 50%, var(--norm_Purple-color) 0);
        }
      }

      .fl {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        margin-left: 10px;
        position: relative;
      }

      .Binquire {
        width: 32px;
        height: 32px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-image: url('../../assets/trx2/svg/question.svg');
        background-size: contain;
      }
    }

    &-origin {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &>div {
        &+div {
          margin-left: 20px;
        }
      }

      &-I {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        &.violet {
          background-color: var(--bgcolor-21);
        }

        &.red {
          background: #f23f3f;
        }

        &.green {
          background: var(--bgcolor-22);
        }
      }
    }

    &-foot {
      height: 140px;
      background: var(--darkBg, var(--bg_color_L2));
      color: var(--text_color_L1);
      padding: 35px 178px;
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;

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
          background: var(--bg_color_L1);
          pointer-events: none;
          color: var(--text_color_L3);
        }
      }
    }
  }
</style>
