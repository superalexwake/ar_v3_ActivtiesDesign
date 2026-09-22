<template>
  <div class="historical-strategy">
    <!-- 策略列表 -->
    <div class="strategy-list">
      <template v-if="list?.length!==0">
        <div class="strategy-card" v-for="(item, index) in list" :key="index">
          <div class="card-header">
            <div class="avatar">
              <img :src="item.headImgUrl" alt="avatar" />
            </div>
            <div class="strategy-info">
              <div class="strategy-name">
                {{item.name}}
                <span class="strategy-type">{{item.playType}}</span>
              </div>
              <div class="strategy-tags">
			  	<div class="tag" :class="item.playBet ? item.playBet : BetContentEnum[item.followPlayType]">
				  {{ item.playBet || BetContentEnum[item.followPlayType] }}
			  	</div>
                <div class="tag tag-martingale" v-if="item?.isOpenDoubleBet===1">{{item.doubleBetMultiple}}</div>
                <div class="tag tag-try-it" v-if="item.orderType===0">Try it</div>
              </div>
            </div>
          </div>
          <div class="card-divider"></div>
          <div class="card-content">
            <div class="info-row">
              <div class="info-item">
                <div class="info-label">{{$t('Tron')}}:</div>
              </div>
				<div class="info-item">
					<div class="info-value">{{Number(item.winIssueCount+item.lossIssueCount)}}</div>
				</div>
            </div>
			<div class="info-row">
				<div class="info-item">
					<div class="info-label">{{$t('Treve')}}:</div>
				</div>
				<div class="info-item">
					<div class="info-value revenue" :class="{ 'negative': item.totalWinLossAmount < 0 }">{{ currency(item.totalWinLossAmount) }}</div>
				</div>
			</div>

			  <div class="info-row">
				  <div class="info-item">
					  <div class="info-label">{{$t('startTime')}}:</div>
				  </div>
				  <div class="info-item">
					  <div class="info-value">{{fromTime(item.startTime)}}</div>
				  </div>
			  </div>
			  <div class="info-row">
				  <div class="info-item">
					  <div class="info-label">{{$t('lotteryActivityEndTime')}}:</div>
				  </div>
				  <div class="info-item">
					  <div class="info-value">{{fromTime(item.endTime)}}</div>
				  </div>
			  </div>
            <div class="status-row">
              <div class="status status-completed" :class="{ 'status-exceeded': item.stopReason!=='IssueCountFinish' }">
                <van-icon name="warning-o" class="status-icon" />
                {{ $t(`${item.stopReason}`)}}
              </div>
              <div class="try-it-watermark" v-if="item.orderType===0">
                <img src="./assets/img/try.png" alt="Try it" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <EmptyState />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon as VanIcon } from 'vant';
import {BetContentEnum, fromTime} from "../../utils";
import EmptyState from "./EmptyState.vue";
import {currency} from "../../utils";
defineProps({
	list: {
		type: Array as () => any,
		default:[]
	  }
});

// 格式化金额
// const formatMoney = (amount: number): string => {
//   return amount.toString();
// };
</script>

<style lang="scss" scoped>
.historical-strategy {
  width: 100%;
  //max-width: 750px;
  margin: 0 auto;
  //font-family: Arial, sans-serif;
  .strategy-list {
    background: var(--bg_color_L2, #FFF);
  }

  .strategy-card {
    background: var(--bg_color_L3, #F6F6F6);
    border-radius: 16px;
    margin-bottom: 32px;
    padding: 20px 24px;
    position: relative;
    overflow: hidden;

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .avatar {
        width: 80px;
        height: 80px;
        //border-radius: 50%;
        //overflow: hidden;
        margin-right: 15px;
        img {
          width: 100%;
          height: 100%;
			border-radius: 50%;
          //object-fit: cover;
        }
      }

      .strategy-info {
        flex: 1;
		  font-weight: 400;
        .strategy-name {
          font-size: 28px;
          color: var(--text_color_L2, #768096);
          margin-bottom: 8px;

          .strategy-type {
			  font-weight: 500;
            color: var(--text_color_L1, #1E2637);
          }
        }

        .strategy-tags {
          display: flex;
          flex-wrap: wrap;

          .tag {
            padding: 0 20px;
			  height: 36px;
			  display: flex;
			  justify-content: center;
			  align-items: center;
            border-radius: 50px;
            font-size: 24px;
            margin-right: 8px;

			  &.red {
				  border: 1px solid rgba(251, 91, 91, 0.50);
				  background: rgba(251, 91, 91, 0.12);
				  color: var(--norm_red-color, #FB5B5B);
			  }
			  &.big{
				  border: 1px solid rgba(245, 160, 54, 0.50);
				  background: rgba(245, 160, 54, 0.12);
				  color: var(--norm_secondary-color, #F5A036);
			  }
			  &.small{
				  border: 1px solid rgba(110, 168, 244, 0.50);
				  background: rgba(110, 168, 244, 0.12);
				  color: var(--norm_bule-color, #6EA8F4);
			  }
			  &.green{
				  border: 1px solid rgba(24, 182, 96, 0.50);
				  background: rgba(24, 182, 96, 0.12);
				  color: var(--norm_green-color, #18B660);
			  }
			  &.violet, &.purple{
				  border: 1px solid rgba(200, 110, 255, 0.50);
				  background: rgba(200, 110, 255, 0.12);
				  color: var(--norm_purple-color, #C86EFF);
			  }
			  &.against{
				  border: 1px solid rgba(183, 128, 95, 0.50);
				  background: rgba(183, 128, 95, 0.12);
				  color: var(--norm_purple-color, #B7805F);
			  }
			  &.follow{
				  border: 1px solid rgba(42, 212, 197, 0.50);
				  background: rgba(42, 212, 197, 0.12);
				  color: var(--norm_purple-color, #2AD4C5);
			  }

				&.tag-try-it {
					background: var(--norm_red-color, #FB5B5B);
				  color: white;
				}
			  &.tag-martingale{
				  background-color: rgba(149, 165, 166, 0.1);
				  color: #7f8c8d;
			  }
          }
        }
      }
    }

    .card-divider {
      height: 1px;
      background-color: var(--Dividing-line_color);
      margin: 10px 0;
    }

    .card-content {
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom:12px;
		&:first-child{
			margin-top:12px;
		}
        .info-item {
          //flex: 1;
          display: flex;
          align-items: center;
			font-size: 28px;
			font-weight: 400;
          .info-label {
            color: var(--text_color_L2, #768096);
            //margin-bottom: 4px;
          }

          .info-value {
            color: var(--text_color_L1, #1E2637);
            &.revenue {
				color: var(--norm_green-color, #18B660);
            }
			  &.negative{
				  color: var(--norm_red-color, #FB5B5B);
			  }
          }
        }
      }

      .status-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .status {
          display: flex;
          align-items: baseline;
          font-size: 24px;
			font-weight: 400;
          .status-icon {
            margin-right: 5px;
          }

          &.status-completed {
            color: var(--norm_secondary-color, #F5A036);
          }

          &.status-exceeded {
			  color: var(--norm_red-color, #FB5B5B);
          }
        }

        .try-it-watermark {
          position: absolute;
          right: 10px;
          bottom: 10px;
          img {
            width: 125px;
            height: auto;
          }
        }
      }
    }
  }

  //.pagination {
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //  padding: 15px 0;
  //
  //  .page-btn {
  //    width: 40px;
  //    height: 40px;
  //    display: flex;
  //    align-items: center;
  //    justify-content: center;
  //    border: 1px solid #eee;
  //    margin: 0 5px;
  //    border-radius: 4px;
  //    font-size: 16px;
  //    color: #666;
  //    cursor: pointer;
  //
  //    &.active {
  //      background-color: #00c07f;
  //      color: white;
  //      border-color: #00c07f;
  //    }
  //
  //    &.prev, &.next {
  //      color: #999;
  //    }
  //  }
  //
  //  .page-ellipsis {
  //    margin: 0 5px;
  //    color: #999;
  //  }
  //}
}
</style>