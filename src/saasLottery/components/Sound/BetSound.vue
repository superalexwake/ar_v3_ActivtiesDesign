<script setup lang="ts">
import {useLotteryContext} from "@/saasLottery/hooks";
const emit=defineEmits(['close'])
const {soundBg,soundEffects}=useLotteryContext()
</script>

<template>
  <div class="sound">
    <div class="sound-head">
      <div class="sound-dot"></div>
      <span>
        {{$t('common.sound')}}
      </span>
      <div class="sound-dot"></div>
    </div>

    <div class="sound-body">
      <div>
        <span>{{$t('common.sound_background')}}</span>
        <van-switch v-model="soundBg" active-color="#61ED7D"  inactive-color="#E9EAF2"/>
      </div>
      <div>
        <span>{{$t('common.sound_effect')}}</span>
        <van-switch v-model="soundEffects" active-color="#61ED7D"  inactive-color="#E9EAF2"/>
      </div>
    </div>
    <div class="sound-foot">
      <div class="sound-foot-btn" @click="emit('close')">
        {{$t('common.close')}}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sound{
  width: 600px;
  &-head {
    height: 88px;
    line-height: 88px;
    color: #fff;
    font-size: 32px;
    text-align: center;
    background: #fd565c url('@/saasLottery/assets/redStyle/rule/bg1.png') top;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    span{
      margin: 0 10px;
    }
  }
  &-dot{
    height: 6px;
    width: 6px;
    background: #fff;
    border-radius: 50%;
  }

  &-body {
    position: relative;
    color: #323536;
    padding: 80px 120px 0 120px;
    font-weight: 500;
    font-size: 28px;
    line-height: 40px;
    &>div{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
    }
  }
  &-foot {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;

    &-btn {
      width: 320px;
      background: #f3f4fa;
      border-radius: 40px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 28px;
      color: #323536;
      font-weight: 500;
    }
  }
}
</style>