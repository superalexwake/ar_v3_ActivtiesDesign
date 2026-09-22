<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {useRoute} from "vue-router";
import {useGlobal} from '@/saasLottery/hooks'
import k33 from '@/saasLottery/game/K3/views/k33/index.vue';
import ChangLong from '@/components/common/ChangLong.vue'
import { SettingStore } from '@/stores'

const {useProvide,getWebData,setLotteryCode}=useGlobal();
const route=useRoute()
const gameCode=route.query.gameCode;
useProvide();
setLotteryCode(gameCode);
const settingS = SettingStore()
const showChanglong = computed(() => settingS.getIsShowLotteryDragon)
onMounted(async ()=>{
	await getWebData();
})
</script>

<template>
	<k33/>
	<ChangLong v-if="showChanglong" />
</template>