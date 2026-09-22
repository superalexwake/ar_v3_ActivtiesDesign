<script setup lang="ts">
import {useGlobalContext} from "@/saasLottery/hooks";
const {onLotteryJump,gameList,gameCode}=useGlobalContext();
console.log('gameList', gameList.value)
const changeText = (text:string)=>{
  if(text.includes('TrxWinGo ')) {
    return text.replace('TrxWinGo ','TrxWinGo<br/>')
  }
  if(text.includes('WinGo ')) {
    return text.replace('WinGo ','WinGo<br/>')
  }
  return text
}
</script>

<template>
  <div class="gameType">
    <div v-for="(item) in gameList">
      <div class="head">
        <span class="t" >{{ item.gameTypeName }}</span>
      </div>
      <div class="typeList">
        <div v-for="(game,index) in item.gameList" :class="{
          active:gameCode===game.gameCode,
          state:game.state===2
        }" @click="onLotteryJump(game)" :key="index" >
          <span v-html="changeText(game.gameName)"></span>
          <div class="maintain" v-if="game.state===2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2987 1.35138C14.9772 0.721242 14.2505 -0.0545458 12.9416 0.478758C11.6328 1.01206 9.0154 2.27215 9.5001 6.00434C8.05286 7.41868 5.19948 10.3508 3.24218 12.3621L3.24202 12.3623L3.24196 12.3623C2.31503 13.3148 1.5891 14.0608 1.30871 14.3412C0.436251 15.2137 0.678572 17.2979 1.30871 17.928C1.93885 18.5581 3.73219 19.3336 4.75007 18.4127C5.56436 17.6759 10.5504 12.3862 12.9416 9.83348C13.9756 10.0112 16.3538 10.0371 17.5946 8.71867C19.1457 7.07068 19.1941 5.76199 19.1457 5.4227C19.0972 5.08341 18.8548 4.55024 18.2247 4.98647C18.0328 5.11935 17.7914 5.34667 17.5224 5.59994L17.5224 5.59997L17.5224 5.59999C16.9084 6.17818 16.1508 6.89157 15.5104 6.92527C14.5895 6.97374 13.5719 6.24669 12.9416 5.4227C12.3114 4.59871 12.4571 3.4839 12.9416 2.80532C13.3293 2.26245 14.0079 1.60983 14.2987 1.35138ZM1.30871 1.0604L3.73219 2.80532V3.67778L7.17357 6.92527L6.05876 8.28243L2.85973 4.98647L1.79339 4.55024L0 2.27215L1.30871 1.0604ZM10.6148 13.9531L12.9416 11.5294C14.541 13.0643 17.8272 16.2505 18.1762 16.7158C18.6124 17.2974 18.0792 18.4607 17.6915 18.8C17.3037 19.1393 15.8496 19.2847 15.2195 18.8C14.7154 18.4123 11.9397 15.4072 10.6148 13.9531Z" fill="white"/>
            </svg>
            <span>{{$t('common.maintain')}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gameType {
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-width: 690px;
  gap: 20px;
  .head {
    color: #323536;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .typeList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px 10px;
    & > div {
      position: relative;
      width: 152px;
      height: 104px;
      color: #323536;
      font-size: 24px;
      font-weight: 400;
      border-radius: 16px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url("@/saasLottery/assets/redStyle/category/bg.svg") no-repeat center center/100%;
      &.active{
        color: #fff;
        background: url("@/saasLottery/assets/redStyle/category/bg_active.svg") no-repeat center center/100%;
      }
      &.state{
        background: #FFEEEF!important;
        padding-bottom: 28px;
        color: #323536;
      }

    }
    .maintain{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #B9BDC1;
      color: #FFF;
      font-size: 18px;
      line-height: 32px;
      border-radius: 0 0 16px 16px;
      svg{
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
    }
  }
}

</style>