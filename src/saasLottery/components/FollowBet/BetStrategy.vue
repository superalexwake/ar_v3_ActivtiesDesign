<script setup lang="ts">
import { ref, computed} from 'vue';
import { Icon as VanIcon, Button as VanButton, Switch as VanSwitch } from 'vant';
import {useWinGoStrategy} from "../../hooks";
import {currency} from '@/utils';
import {BetContentEnum} from "../../utils";
const {stopStrategy} = useWinGoStrategy();
const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prohibit']);

const preIssueCount =computed(()=>props.info?.preIssueCount) //默认跟投局数
const winCount=computed(()=>props.info?.winIssueCount) //赢的总局数
const loseCount = computed(()=>props.info?.lossIssueCount);//输的总局数
const benefits = computed(()=>props.info?.totalWinLossAmount);//总收益
const bettingRounds = computed(()=>preIssueCount.value-winCount.value-loseCount.value);//当前剩余局数
const wagerAfterWin = computed(()=>props.info?.betAmount);//当前下注的金额
const wagerAfterLoss = computed(()=>wagerAfterWin.value);//当前下注的金额
const enableMartingale = computed(()=>props.info?.isOpenDoubleBet);//是否开启倍投
const currentMarginAmount =computed(()=>props.info?.currentMarginAmount);//保证金
const stopProfitAmount =computed(()=>props.info?.stopProfitAmount);//止盈
const stopLossAmount =computed(()=>props.info?.stopLossAmount);//止亏
const betAmountAfterLose =computed(()=>props.info?.betAmountAfterLose);//开启倍投后输的下注额


/*折叠状态*/
const isExpanded = ref(false);

// Computed
const progressWidth = computed(() => {
  const total = winCount.value + loseCount.value;
  return total > 0 ? (winCount.value / total) * 100 : 50;
});


/*停止跟投策略操作*/
const stop = async () => {
	await stopStrategy(props.info.orderNo).then(()=>{
		emit('prohibit');
	})
};

// 折叠属性
const activeNames = ref<string[]>([]);
const collapse = ref<any>(null);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  activeNames.value = isExpanded.value ? ['1'] : [];
  collapse.value.toggleAll(isExpanded.value);
};

const playBetClass = computed(() => {
  const playBet = props.info.playBet?.toLowerCase();
  if (playBet?.includes('red')) return 'red';
  if (playBet?.includes('big')) return 'big';
  if (playBet?.includes('small')) return 'small';
  if (playBet?.includes('green')) return 'green';
  if (playBet?.includes('violet')) return 'violet';
  return '';
});


const followTypeClass = computed(() => {
	const followType = BetContentEnum[props.info.followPlayType]
	if (followType?.includes('purple')) return 'purple';
	if (followType?.includes('against')) return 'against';
	if (followType?.includes('follow')) return 'follow';
	return '';
})

</script>

<template>
  <div class="strategy-content">
    <div class="title">
      <div class="label">{{props.info?.name}}</div>
      <div class="value">{{props.info?.playType}}</div>
		<div class="bet" :class="props.info?.playBet ? playBetClass : followTypeClass">
			{{ props.info?.playBet || BetContentEnum[props.info?.followPlayType] }}
		</div>
		<div class="try" v-if="props.info?.orderType === 0">{{ $t('tryIt') }}</div>
    </div>

    <div class="progress-bar">
      <div class="progressBox" :style="{ width: progressWidth + '%' }"></div>
    </div>

    <div class="win-lose-stats">
      <div class="win">
        <h2>{{$t('stWin')}} {{ winCount }}</h2>
      </div>
      <div class="lose">
        <h2>{{$t('stLose')}} {{ loseCount }}</h2>
      </div>
    </div>

    <div class="strategy-benefits">
      <div class="label">{{$t('sb')}}</div>
      <div class="amount">{{ currency(benefits) }}</div>
    </div>

    <van-collapse v-model="activeNames" ref="collapse">
      <div class="betting-details">
        <!-- 试玩标识 -->
        <div class="try" v-if="info?.orderType===0">
          <img src="./assets/img/try.png" alt="">
        </div>
        <div class="box">
          <div class="detail-row">
            <span class="detail-label">{{$t('bron')}}</span>
            <span class="detail-value">{{ bettingRounds }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{$t('waaw')}}</span>
            <span class="detail-value win-wager">{{ currency(wagerAfterWin) }}</span>
          </div>
          <div class="detail-row" v-if="info?.isOpenDoubleBet===1">
            <span class="detail-label">{{$t('waal')}}</span>
            <span class="detail-value">
				<!--{ currency(wagerAfterLoss) }}-->
              {{enableMartingale===1?currency(betAmountAfterLose):currency(wagerAfterLoss)}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{$t('wtem')}}</span>
            <van-switch
                active-color="var(--main-color)"
                :active-value="1"
                :inactive-value="0"
                v-model="enableMartingale"
                disabled
                size="24"
            />
          </div>
          <van-collapse-item name="1" :border="false" :is-link="false">
            <div class="detail-row">
              <span class="detail-label">{{$t('margin')}}</span>
              <span class="detail-value">{{currency(currentMarginAmount)}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{$t('tpa')}}</span>
              <span class="detail-value top1">+{{currency(stopProfitAmount)}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{$t('sla')}}</span>
              <span class="detail-value top2">-{{currency(stopLossAmount)}}</span>
            </div>
          </van-collapse-item>
        </div>
		  <div class="expand-more" @click="toggleExpand">
			  {{!isExpanded?$t('emore'):$t('pickUp')}}
			  <van-icon :name="!isExpanded?'arrow-down':'arrow-up'" />
		  </div>
      </div>
    </van-collapse>

    <div class="stop-button-container">
      <van-button block type="primary" :disabled="info?.state===2" class="stop-button" @click="stop">
        {{info?.state===2?$t('hint6'):$t('stopStrage')}}
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.strategy-content {
  padding: 20px;

  .title {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .label {
      font-size: 28px;
      color: var(--text_color_L2, #768096);
    }
    .bet{
      border-radius: 50px;
      padding: 5px 20px;
      font-size: 24px;
      font-weight: 400;
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
    }

    .value {
      font-size: 28px;
      font-weight: 600;
      color: var(--text_color_L1, #1E2637);
      margin: 0 10px;
    }
    .try{
      display: flex;
      font-size: 24px;
      color: #fff;
		height: 36px;
      padding: 5px 20px;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
		margin-left: 10px;
      background: var(--norm_red-color, #FB5B5B);
    }
  }

  .progress-bar {
    height: 12px;
    background: var(--norm_red-color, #FB5B5B);
    border-radius: 10px;
    //margin-bottom: 20px;
    position: relative;
    overflow: hidden;

    .progressBox {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      //border-radius: 10px 0px 0px 10px;
      background: var(--norm_green-color, #18B660);
    }
  }

  .win-lose-stats {
    display: flex;
    justify-content: space-between;
    margin-top:8px;

    h2 {
      font-size: 36px;
      font-weight: 600;
      margin: 0;
    }

    .win {
      color: var(--text_color_L1);
    }

    .lose {
      color: var(--text_color_L1);
      text-align: right;
    }
  }

  .strategy-benefits {
    //margin-bottom: 30px;
    margin: 24px 0 32px 0;
    display: flex;
    align-items: center;
    .label {
      font-size: 24px;
      color:var(--text_color_L2, #768096);
      margin-right: 10px;
    }

    .amount {
      font-size: 24px;
      font-weight: 600;
      color: var(--text_color_L1, #1E2637);
    }
  }

  .betting-details {
    background-color: var(--bg_color_L2);
    border-radius: 12px;
    margin-bottom: 20px;
    position: relative;
    .try{
      position: absolute;
      z-index: 100;
      top:30px;
      left:50%;
      width: 172px;
      height: 124px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .box{
      padding: 20px;
      border-bottom: 1px solid var(--Dividing-line_color, #E1E1E1);
      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        //border-bottom: 1px solid #f5f5f5;
        &:first-child {
          //padding-top: 0;
        }
        &:last-child {
          padding-bottom: 0;
        }

        .detail-label {
          font-size: 24px;
          color: var(--text_color_L1, #1E2637);
        }

        .detail-value {
          font-size: 26px;
          font-weight: 600;
          color: var(--text_color_L1, #1E2637);

          &.win-wager {
            color: var(--norm_secondary-color, #F5A036);
          }
          &.top1 {
            color: var(--norm_green-color, #18B660);
          }
          &.top2 {
            color: var(--norm_red-color, #FB5B5B);
          }
        }
      }
    }


    .expand-more {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--text_color_L2, #768096);
      font-size: 24px;
      padding: 20px 0 24px 0;
      cursor: pointer;

      .van-icon {
        margin-left: 5px;
      }
    }
  }

  .stop-button-container {
    margin-top: 30px;
    .stop-button {
      height: 80px;
      font-size: 28px;
      font-weight: 500;
      border-radius: 16px;
      background: var(--main_gradient-color, linear-gradient(90deg, #49C755 15.38%, #0F9957 98.73%));
      border: none;
    }
  }
}

:deep(.van-collapse-item__title){
  display: none;
}
:deep(.van-collapse-item__content){
  padding: 0;
}
</style>