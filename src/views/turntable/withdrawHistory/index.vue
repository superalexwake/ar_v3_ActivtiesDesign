<template>
  <div class="withdraw-history">
      <!-- <HeadNav :leftArrow="true" @click-s="onClickLeft" :title="$t('t589')" /> -->
       <NavBar :leftArrow="true" @click-left="onClickLeft" :title="$t('t589')" />

       <List
			:distance="100"
			:api="getUserInvitedWheelWithdrawList"
			v-model:list="historyList"
		>
    <template #content>
      <div class="record_list">
      <div class="item" v-for="item in historyList" :key="item.orderNo">

        <div class="flex flex-between head">
          <div class="left">{{ $t('withdraw') }}</div>
          <div class="right" :class="stateClass[item.auditState]">{{ auditState[item.auditState] }}</div>
        </div>

        <div class="info">
          <div class="flex flex-between info_i">
            <span>{{ $t('amount') }}</span>
            <div class="amount">{{ currency(item.withdrawAmount) }}</div>
          </div>

          <div class="flex flex-between info_i" v-if="item.withdrawCategoryName">
            <span>{{ $t('type') }}</span>
            <div>{{ item.withdrawCategoryName }}</div>
          </div>
          <div class="flex flex-between info_i">
            <span>{{ $t('time') }}</span>
            <div>{{dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </div>
          <div class="flex flex-between info_i">
            <span>{{ $t('orderNo') }}</span>
            <div class="flex flex-row flex-center">
              <div>{{ item.orderNo }}</div>
              <svg-icon name="copy" @click="copy(item.orderNo)" icon-class="copy" />
            </div>
          </div>
          <div class="remark" v-if="item.reason">
            <div>{{ $t('remark') }}</div>
            <div class="reason">{{ item.reason }}</div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </List>

  
    <!-- <Empty v-if="historyList.length === 0" /> -->

    <!-- <Pagination
    :total-items="pageInfo.total"
    :itemsPerPage="pageInfo.pageSize"
    :model-value="pageInfo.page"
    @changePage="getPageListHistory"
    /> -->
  </div>

</template>

<script lang="ts" setup>
import { useTurntables } from "@/hooks";
import { useRouter } from "vue-router";
// import Empty from "@/components/common/Empty/index.vue";
import {getUserInvitedWheelWithdrawList} from "@/api";
import {currency,copy} from "@/utils";
import {useI18n} from "vue-i18n";
import dayjs from "dayjs";
import List from "@/components/common/List.vue";
// import Empty from "@/components/common/Empty/index.vue";

const router = useRouter();
const {historyList} = useTurntables();
const {t} = useI18n()
const onClickLeft = () => {
  router.back();
};

// "0 - 待审核" | "1 - 审核中" | "2 - 通过" | "3 - 不通过"
const auditState = {
  0: t('t126'),
  1: t('t590'),
  2: t('rechargeState2'),
  3: t('withdrawState2')
};
const stateClass= {
  0: "processing",
  1: "withdrawing",
  2: "completed",
  3: "reject"
};

// Example lifecycle hook
// onMounted(() => {
//   getPageListHistory()
// });
</script>

<style scoped>
.flex {
  display: flex;
}
.flex-between {
  justify-content: space-between;
}
.withdraw-history {
  background: var(--bg_color_L1, #EEEFF5);
  padding: 32px 30px;

  .record_list {
    .item {
      border-radius: 20px;
      background: var(--bg_color_L2, #FFF);
      box-shadow: 0px 4px 28px 0px rgba(56, 58, 76, 0.03);
      padding: 32px 24px;
      margin-bottom: 24px;
      .head {
        margin-bottom: 32px;
        align-items: center;
        .left {
          padding: 8px 24px;
          color: var(--text_color_L4, #FFF);
          font-size: 28px;
          font-weight: 600;
          line-height: 42px; /* 150% */
          border-radius: 8px;
          background: var(--main_gradient-color);
        }
        .right {
          text-align: right;
          font-size: 28px;
          font-weight: 500;
          line-height: 42px; /* 150% */
        }
        .reject {
          color: var(--norm_red-color, #F95959);
        }
        .completed {
          color: var(--norm_green-color, #4CB957);
        }
        .processing {
          color: var(--norm_bule-color, #63A1FF);
        }
        .withdrawing {
          color:  var(--norm_orange_color, #F6AF0B);
        }
      }

      .info {
        border-top: 1px solid var(--Dividing_line_color, #E6E8F0);
        padding-top: 24px;
        .info_i {
          margin-bottom: 12px;
          span {
            color: var(--text_color_L2, #848694);
            font-size: 24px;
            font-weight: 400;
            line-height: 36px; /* 150% */
          }
          div {
            color: var(--text_color_L2, #848694);
            font-size: 24px;
            font-weight: 400;
            line-height: 36px; /* 150% */
            align-items: center;
            .copy {
              width: 24px;
              height: 24px;
              margin-left: 8px;
              color: var(--main-color);
            }
          }
          .amount {
            color: var(--text_color_L1, #383A4C);
            text-align: right;
            font-size: 28px;
            font-weight: 600;
            line-height: 42px; /* 150% */
          }
        }
        .remark {
          color: var(--text_color_L2, #848694);
          font-size: 24px;
          font-weight: 400;
          line-height: 36px; /* 150% */
          margin-bottom: 24px;
          .reason {
            border-radius: 12px;
            border: 2px solid var(--Dividing_line_color, #E8E9F2);
            padding: 16px 20px;
          }
        }
      }
    }

  }
}
</style>
