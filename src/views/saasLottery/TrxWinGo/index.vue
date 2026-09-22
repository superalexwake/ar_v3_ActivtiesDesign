<script setup lang="ts">
import {useRoute} from "vue-router";
import type {LotteryGameCodeEnum} from "@/saasLottery/api";
import { useGlobal } from '@/saasLottery/hooks'
import TrxWinGo2 from '@/saasLottery/game/TrxWinGo/views/trx2/index.vue';
import { SettingStore } from '@/stores'
import { computed } from 'vue'
import ChangLong from '@/components/common/ChangLong.vue'
const route=useRoute()
const {useProvide,setLotteryCode}=useGlobal();
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode as LotteryGameCodeEnum);
const settingS = SettingStore()
const showChanglong = computed(() => settingS.getIsShowLotteryDragon)
</script>

<template>
	<TrxWinGo2/>
	<ChangLong v-if="showChanglong" />
</template>
<style lang="scss">
.van-config-provider {
	position: relative;
}
</style>