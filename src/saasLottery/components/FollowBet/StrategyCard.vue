<template>
  <div class="strategy-card">
    <div class="strategy-header">
      <div class="box">
        <div class="avatar-container">
          <img :src="strategy?.headImgUrl" alt="Avatar" class="avatar" />
        </div>
        <div class="strategy-nammax">{{ strategy.name }}</div>
      </div>

      <div class="strategy-info">
        <div class="strategy-name">{{ $t(strategy.playType) }}</div>
        <div class="strategy-followers">
          <img src="./assets/img/uer.png" alt="user" class="followers-icon" />
          <span class="followers-count">{{ strategy.followUserCount }}</span>
          <span class="followers-text">{{$t('followed')}}</span>
        </div>
        <div class="strategy-tags">
			<div class="tag type-tag"
				 :class="strategy.playBet ? playBetClass : followTypeClass">
				{{strategy.playBet ? $t(strategy.playBet) : $t(BetContentEnum[strategy.followPlayType])}}
			</div>
			<div class="tag method-tag"
				 v-if="strategy.isSupportDoubleBet === 1"
				 v-text="$t('martingale')">
			</div>
        </div>
      </div>
    </div>

    <div class="strategy-stats">
      <div class="stat-item">
        <div class="stat-label">
          {{$t('roi')}}
          <div class="stat-value roi">+{{strategy.actualMaxOrderReturnRate<1 ? strategy.actualMaxOrderReturnRate*100 : strategy.actualMaxOrderReturnRate}}%</div>
          <van-icon name="question-o" class="info-icon" @click="Tips(1)" />
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-label">
		  {{$t('tp')}}
          <van-icon name="question-o" class="info-icon" @click="Tips(2)" />
        </div>
        <div class="stat-value">{{ currency(strategy.actualTotalProfitAmount) }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">
          {{$t('totalBetA')}}
          <van-icon name="question-o" class="info-icon" @click="Tips(3)" />
        </div>
        <div class="stat-value">{{currency(strategy.actualTotalBetAmount)}}</div>
      </div>
    </div>
    <!--跟单按钮-->
    <van-button
		:disabled="strategy.orderNo==orderNo"
        block
        type="primary"
        class="follow-btn"
        @click="followBetAgain"
    >
      {{$t('fts')}}
    </van-button>
  </div>

  <!-- 新增跟投设置弹窗 -->
  <FollowBetPop
    :show="setPop"
    :destroy-on-close="true"
    :title="$t('strageSet')"
    @close="handleClose"
    :isClose="true"
  >
    <FollowSetForm ref="FollowSetFormRef" @confirm="formalBet" @try="formalBet" :infoData="strategy" />
  </FollowBetPop>
</template>

<script setup lang="ts">
import {Icon as VanIcon, Button as VanButton, showToast} from 'vant';
import {ref, computed} from "vue";
import FollowBetPop from "./FollowBetPop.vue";
import FollowSetForm from "./FollowSetForm.vue";
import {convertStringsToNumbers,currency,BetContentEnum} from "../../utils";
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props =  defineProps({
  strategy: {
	type: Object as () => any,
	required: true
  },
	defineAmount:{
		type: Number,
		required: true
	},
	minAmount:{
		type: Number,
		required: true
	},
	orderNo:{
		type: String,
		required: true
	},
});

const FollowSetFormRef=ref<any>(null);
const handleClose = () => {
	setPop.value=false;
	FollowSetFormRef.value?.show()
}

const strategy = ref({...props.strategy,defineAmount:props.defineAmount,minAmount:props.minAmount});
const emit =defineEmits(['follow','cancelBet']);


const playBetClass = computed(() => {
	const playBet = strategy.value.playBet.toLowerCase();
	if (playBet.includes('red')) return 'red';
	if (playBet.includes('big')) return 'big';
	if (playBet.includes('small')) return 'small';
	if (playBet.includes('green')) return 'green';
	if (playBet.includes('violet')) return 'violet';
	return '';
});

const followTypeClass = computed(() => {
	const followType = BetContentEnum[strategy.value.followPlayType]
	if (followType?.includes('purple')) return 'purple';
	if (followType?.includes('against')) return 'against';
	if (followType?.includes('follow')) return 'follow';
	return '';
})


/*弹框提示优化*/
const Tips=(type:number)=>{
	if(type===1){
    showToast(t('ruleT21'))
  }else if(type===2){
    showToast(t('ruleT31'))
  }else if(type===3){
    showToast(t('ruleT11'))
	}
}


/*跟单表单弹框设置*/
const setPop=ref(false);
/*若有进行的跟投信息再次点击跟投时逻辑*/
const followBetAgain = ()=>{
  if(props.orderNo){
	  emit('cancelBet')
  }else{
    setPop.value=true
  }
}

/*新增跟投信息*/
const formalBet= async (item:any)=>{
  const newValues = convertStringsToNumbers({...item,followPlanId:strategy.value.id})
	emit('follow',newValues)
	setPop.value=false
	FollowSetFormRef.value?.show()
}

</script>
<style lang="scss" scoped>
.strategy-card {
  background: var(--bg_color_L3, #F6F6F6);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  .strategy-header {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--Dividing-line_color);
    .box{
      text-align: center;
      margin-right: 20px;
      .avatar-container {
        width: 80px;
        height: 80px;
        margin: auto;
        //border-radius: 50%;
        //overflow: hidden;
        //margin-right: 12px;
        .avatar {
          width: 100%;
          height: 100%;
			border-radius: 50%;
          object-fit: cover;
        }
      }
    }


    .strategy-info {
      flex: 1;

      .strategy-name {
        font-size:28px;
        font-weight: 500;
	  	color: var(--text_color_L1, #1E2637);
        margin-bottom: 4px;
      }

      .strategy-followers {
        display: flex;
        align-items: center;
		  margin:6px 0 10px 0;
        .followers-icon {
          margin-right: 4px;
          //font-size: 24px;
          width: 24px;
        }

        .followers-count {
			color: var(--norm_red-color, #FB5B5B);
          font-size:24px;
          margin-right:8px;
			font-weight: 600;
        }

        .followers-text {
			color: var(--text_color_L2, #768096);
          font-size: 24px;
        }
      }
    }

    .strategy-nammax {
		margin-top:8px;
		color: var(--text_color_L2, #768096);
      font-size: 24px;
    }
  }

  .strategy-tags {
    display: flex;
    //margin-bottom: 16px;

    .tag {
		display: flex;
		height: 36px;
		padding: 0 20px;
		justify-content: center;
		align-items: center;
        border-radius: 50px;
        font-size:24px;
        margin-right: 8px;
    }

    .type-tag {
        background-color: rgba(52, 152, 219, 0.1);
		border: 1px solid rgba(110, 168, 244, 0.50);
		color: var(--norm_bule-color, #6EA8F4);
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

    .method-tag {
      background-color: rgba(149, 165, 166, 0.1);
      color: #7f8c8d;
    }
  }

  .strategy-stats {
    margin-bottom: 16px;

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

	  &:first-child {
		margin-top: 12px;
	  }
      &:last-child {
        margin-bottom: 0;
      }

      .stat-label {
        display: flex;
        align-items: baseline;
	  	color: var(--text_color_L2, #1E2637);
        font-size: 24px;

        .info-icon {
          margin-left: 4px;
          font-size:24px;
          color: #999;
        }
      }

      .stat-value {
        font-size: 24px;
        font-weight: 500;
		  color: var(--text_color_L1, #1E2637);

        &.roi {
          margin-left: 15px;
		  color: var(--norm_red-color, #FB5B5B);
          font-size: 40px;
          font-weight: 500;
        }
      }
    }
  }

  .follow-btn {
    height: 80px;
    border-radius: 16px;
    font-size: 28px;
    font-weight: 500;
    background: var(--main_gradient-color, linear-gradient(90deg, #49C755 15.38%, #0F9957 98.73%));
    border: none;
  }
}
</style>