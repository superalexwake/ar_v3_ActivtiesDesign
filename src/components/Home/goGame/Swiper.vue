<template>
	<swiper
		class="my-swipe"
		:slides-per-view="1"
		:space-between="20"
		:autoplay="{
			delay: 5000,
			disableOnInteraction: false
		}"
		:modules="modules"
		:loop="true"
	>
		<swiper-slide v-for="(item, index) in getBanner" :key="index">
			<img v-lazy="item.bannerUrl" @click="onJump(item.url)" />
		</swiper-slide>
	</swiper>
</template>

<script setup lang="ts">

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Autoplay } from 'swiper'
import { onMounted } from 'vue'
import { useHome } from '@/hooks'


const {getBannerApi,getBanner } = useHome()
const modules = [Autoplay]
onMounted(async () => await getBannerApi())
</script>

<style lang="scss" scoped>
.my-swipe {
	width: 100%;
	height: 320px;
	box-sizing: border-box;
    position: relative;
    z-index: 0;
	img {
		width: 100%;
		height: 100%;
	}
}
</style>
