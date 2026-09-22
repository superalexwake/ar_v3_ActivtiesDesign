<script setup lang="ts">
import {useRoute} from "vue-router";
import type {LotteryGameCodeEnum} from "@/saasLottery/api";
import './assets/wingo3/reset.scss';
import {useGlobal} from '@/saasLottery/hooks'
import Wingo1 from './views/wingo3/index.vue';
const route=useRoute()
const {useProvide,setLotteryCode}=useGlobal();
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode as LotteryGameCodeEnum);
</script>

<template>
	<Wingo1/>
</template>
<style lang="scss">
.van-config-provider{
  position: relative;
}
</style>