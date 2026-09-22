<script setup lang="ts">
import {SettingStore} from "@/stores";
import {computed} from "vue";

const store=SettingStore()
const image=computed(()=>store.winRate.electronicWinRateImgUrl||'')
const isShow=computed(()=>{
	if (store.winRate.isShowElectronicWinRateExternalLink&&image.value) return true;
	return  false
});
const onJump=()=>{
	if (!store.winRate.electronicWinRateExternalLink)return;
	window.open(store.winRate.electronicWinRateExternalLink)
}
</script>

<template>
 <div class="WinRate" v-if="isShow" @click="onJump">
	 <img v-lazy="image" alt="">
 </div>
</template>

<style scoped lang="scss">
.WinRate{
	width:100%;
	min-height: 128px;
	margin-bottom: 30px;
	img{
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
</style>
