<script setup lang="ts">
	import {useRoute} from "vue-router";
	import type {LotteryGameCodeEnum} from "@/saasLottery/api";
  import { useGlobal } from '@/saasLottery/hooks'
  import TrxWinGo2 from './views/trx2/index.vue';


  const route=useRoute()
  const {useProvide,setLotteryCode}=useGlobal();
  const gameCode=route.query.gameCode;
  useProvide();
  setLotteryCode(gameCode as LotteryGameCodeEnum);
</script>

<template>
	<TrxWinGo2/>
</template>
<style lang="scss">
  .van-config-provider {
    position: relative;
  }
</style>