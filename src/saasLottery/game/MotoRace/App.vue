<script setup lang="ts">
// import type {LotteryGameCodeEnum} from "@/saasLottery/api";
import { useGlobal } from '@/saasLottery/hooks'
import MotuoCar from './views/index.vue';

// const route=useRoute()
const {useProvide,setLotteryCode}=useGlobal();
// const gameCode=route.query.gameCode;
useProvide();
setLotteryCode('MotoRace_1M');
</script>

<template>
	<MotuoCar />
</template>
<style lang="scss">
.van-config-provider {
	position: relative;
}
</style>