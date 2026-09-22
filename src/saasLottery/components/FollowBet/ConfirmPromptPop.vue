<script setup lang="ts">
import {PropType} from "vue";
defineProps({
  title:{
    type:String as PropType<string>
  },
  showPop:{
    type:Boolean as PropType<boolean>,
    default:false
  }
})
const emit=defineEmits(['cancel','confirm'])
</script>

<template>
  <van-popup
      :show="showPop"
      round
      :close-on-click-overlay="false"
      class="boxPop"
  >
    <div class="bet-rule">
      <div class="bet-rule-head">
        <div class="sound-dot"></div>
        <span>· {{ title }} ·</span>
        <div class="sound-dot"></div>
      </div>

      <div class="bet-rule-body">
        <!-- <slot></slot>-->
        <div class="bet-rule-body-iconImg">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="60" fill="#F95959"/>
            <path d="M60 33.75V71.25" stroke="white" stroke-width="8" stroke-linecap="round"/>
            <circle cx="60" cy="88.125" r="3.75" fill="white" stroke="white" stroke-width="3.75"/>
          </svg>
        </div>
        <p>{{$t('ruleT41')}}</p>
        <div class="bet-rule-body-foot">
          <van-button plain hairline type="success" class="bt1" @click="emit('cancel')">{{$t('cancel')}}</van-button>
          <van-button type="success" class="bt2" @click="emit('confirm')">{{$t('confirm')}}</van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">

.bet{
  &-rule {
    width: 650px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    &-head {
      height: 88px;
      line-height: 88px;
      color: #fff;
      font-size: 32px;
      text-align: center;
      background: var(--main-color);
      background-size: contain;
      span{
        margin: 0 10px;
      }
    }
    &-dot{
      height: 6px;
      width: 6px;
      background: var(--bg_color_L2);
      border-radius: 50%;
    }

    &-body {
      color: var(--text_color_L1);
      background: var(--bg_color_L2);
      padding:32px;
      font-weight: 500;
      font-size: 28px;
      &-iconImg{
        text-align: center;
      }
      &-foot{
        display: flex;
        justify-content:space-between;
        button{
          width:45%;
        }
	    button:before{
		  background: transparent;
	  	}
      }
      p{
        margin: 32px 0;
      }
    }
	  .bt1{
		  border: 1px solid var(--main-color);
		  color: var(--main-color);
		  &:after,&:before{
			  border: none;
		  }
		  background: transparent;
	  }
	  .bt2{
		  border:none;
		  background: var(--main_gradient-color, linear-gradient(90deg, #49C755 15.38%, #0F9957 98.73%));
	  }
  }
}
</style>