<script setup lang="ts">
import { useRouter } from 'vue-router';

import Champion from './Champion.vue'
// import Champion from '@/components/Activity/Championship/card.vue'
import {useChampionship} from "@/hooks";
import {useActive} from "@/components/common/use";
import {onMounted, ref, watch} from "vue";
const router = useRouter();
const { championEntranceV, championEntranceVO } = useChampionship();
import {GlobalStore} from "@/stores";
const globalStore = GlobalStore()
const { ActiveSotre, getActive } = useActive()
const isRefresh = ref(false)
watch(isRefresh, (val) => {
  if (isRefresh.value) {
    championEntranceV()
  }
})
watch(()=>ActiveSotre.value.isOpenChampion,
	(newValue)=>{
		if(newValue){
			championEntranceV()
		}
	},{immediate: true})
onMounted(  async ()=>{
  if (globalStore.token) {
  	await getActive()
  }
})
</script>

<template>
  <div class="count-active" v-if="globalStore.token">
    <Champion
        v-if="ActiveSotre.isOpenChampion == 1"
        :itemD="championEntranceVO"
        :state="championEntranceVO.state"
        v-model:isRefresh="isRefresh"
        @click="() => router.push({ name: 'Championship' })"
    />
    <div class="wv">
      <img src="@icon/home/jb_l.png" @click="router.push({ name: 'Turntable' })"/>
      <img src="@icon/home/jb_r.png" @click="router.push({ name: 'vip' })"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-active {
  .count{
    img{
      height: 323px;
      width: 100%;
    }
  }
  .wv {
    display: flex;
    justify-content: space-between;

    img {
      height: 136px;
      width: calc(50% - 12px);
    }
  }
}
</style>