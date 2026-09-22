<script setup lang="ts">
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {useGlobal} from '@/saasLottery/hooks'
import k33 from './views/k33/index.vue';

const {useProvide,getWebData,setLotteryCode}=useGlobal();
const route=useRoute()
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode);
onMounted(async ()=>{
  await getWebData();
})
</script>

<template>
	<k33/>

</template>