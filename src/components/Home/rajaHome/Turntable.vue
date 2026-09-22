<template>
	<div
		v-if="store.getTelegramExternalLink"
		class="turntable-telegram"
		@click="onTelegram"
	/>
</template>

<script setup lang="ts">
import {SettingStore} from "@/stores";

const store=SettingStore();

const onTelegram = () => {
	if (!store.getTelegramExternalLink)return;
	window.open(store.getTelegramExternalLink)
}
</script>
<style lang="scss">

.turntable-telegram{
	position: fixed;
	bottom: 440px;
	right: 15px;
	width: 140px;
	height: 140px;
	border-radius: 50%;
	z-index: 100; //层级需要高于头部导航栏
	touch-action:none;
	background:url( '@/assets/icons/home/tg_bg.png')no-repeat center/cover;
}
</style>
