<script setup lang="ts">
import {useI18n} from "vue-i18n";
import { useHome } from "@/hooks";
const {t}=useI18n();
// 跳转入口页面
const {isAlowGame,goChangLong,showChanglong} = useHome()
const changlongEnter = () => {
  isAlowGame('',goChangLong)
}
</script>

<template>
  <div class="daman-dragon" @click="changlongEnter" v-if="showChanglong">
    <img class="daman-dragon-image" src="./assets/dragon.png" alt="">
    <div class="daman-dragon-right">
      <h3>Win Go {{$t('loongAssistant')}}</h3>
      <p>{{t('dragonTips')}}</p>
      <div class="daman-dragon-btn">{{t('dragonEntry')}}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.daman-dragon{
  display: flex;
  min-height: 200px;
  background: url("@icon/home/bj.png") no-repeat center/100%;
  padding:16px 0 0 10px;
  margin-bottom:20px;
  &-image{
    width: 180px;
    height: 148px;
  }
  &-right{
    padding-left: 25px;
    color: #FFF;
    padding-bottom: 20px;
    h3{
      text-shadow: 0px 2px 2px #FD4646;
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    p{
      border-radius: 60px;
      background: var(--darkLight,var(--main-color));
      padding: 6px 20px;
      line-height: 25px;
      max-width: 400px;
      text-align:center;

    }
  }
  &-btn{
    margin-top: 30px;
    width: 200px;
    height: 50px;
    border-radius: 100px;
    text-align:center;
    background: linear-gradient(180deg, #FFBD40 0%, #FF7F3D 100%);
    box-shadow: 0px 2px 0px 0px #FFEC75 inset;
    filter: drop-shadow(0px 2px 0px #F24B16);
    text-shadow: 0px 2px 2px rgba(253, 70, 70, 0.50);
    font-family: Roboto;
    font-size: 26px;
    font-weight: 700;
    line-height: 50px;
  }
}
</style>