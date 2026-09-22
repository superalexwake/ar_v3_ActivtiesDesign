<script setup lang="ts">
// import './assets/D5_3/style/root.scss';
import D5_3 from './views/D5_3/index.vue';
import {useGlobal} from "@/saasLottery/hooks";
import { onMounted} from "vue";
import type {LotteryGameCodeEnum} from "@/saasLottery/api";
import {useRoute} from "vue-router";

const {useProvide,getWebData,setLotteryCode}=useGlobal();
const route=useRoute()
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode as LotteryGameCodeEnum);
onMounted(async ()=>{
  await getWebData();
})
</script>

<template>
	<D5_3/>
</template>
