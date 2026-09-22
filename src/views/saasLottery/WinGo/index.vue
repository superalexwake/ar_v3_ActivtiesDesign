<script setup lang="ts">
import {useRoute} from "vue-router";
import { computed } from 'vue'
import type {LotteryGameCodeEnum} from "@/saasLottery/api";
import {useGlobal} from '@/saasLottery/hooks'
import Wingo1 from '@/saasLottery/game/WinGo/views/wingo3/index.vue';
import ChangLong from '@/components/common/ChangLong.vue'
import { SettingStore } from '@/stores'
const route=useRoute()
const {useProvide,setLotteryCode}=useGlobal();
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode as LotteryGameCodeEnum);
const settingS = SettingStore()
const showChanglong = computed(() => settingS.getIsShowLotteryDragon)
</script>

<template>
	<Wingo1/>
	<ChangLong v-if="showChanglong" />
</template>
<style lang="scss">
</style>