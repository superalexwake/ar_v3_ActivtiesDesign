<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type {LotteryGameCodeEnum} from "@/saasLottery/api";
import {useRoute} from "vue-router";
import D5_3 from '@/saasLottery/game/D5/views/D5_3/index.vue';
import {useGlobal} from "@/saasLottery/hooks";
import { SettingStore } from '@/stores'
import ChangLong from '@/components/common/ChangLong.vue'
const {useProvide,getWebData,setLotteryCode}=useGlobal();
const route=useRoute()
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode as LotteryGameCodeEnum);
const settingS = SettingStore()
const showChanglong = computed(() => settingS.getIsShowLotteryDragon)
onMounted(async ()=>{
	await getWebData();
})
</script>

<template>
	<D5_3/>
	<ChangLong v-if="showChanglong" />
</template>