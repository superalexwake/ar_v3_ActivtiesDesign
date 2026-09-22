<template>
	<div class="swiper_box">
		<swiper class="my-swipe"
				:slides-per-view="1"
				:space-between="20"
				@slideChange="onSlideChange"
				:autoplay="{
				delay: 5000,
				disableOnInteraction: false
			}" :modules="modules" :loop="true">
			<swiper-slide v-for="(item, index) in getBanner" :key="index">
				<img v-lazy="item.bannerUrl" @click="goPage(item.url)" />
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Autoplay } from 'swiper'
import { onMounted, ref } from 'vue'
import { useHome } from '@/hooks'
const {getBannerApi,getBanner } = useHome()
const swiperIndex = ref(0)
const modules = [Autoplay]
const onSlideChange = (e:any) => {
	if (e.activeIndex >= getBanner.value.length) {
		swiperIndex.value = e.activeIndex - getBanner.value.length
	} else {
		swiperIndex.value = e.activeIndex
	}
}

const goPage = (newUrl: string) => {
	newUrl && (window.location.href = newUrl)
}

onMounted(async () => {
	await getBannerApi()
})
</script>

<style lang="scss" scoped>
.swiper_box {
	position: relative;
	margin-bottom: 16px;
	.swiper-button {
		padding-top: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		span {
			position: relative;
			display: inline-block;
			width: 8px;
			height: 8px;
			border-radius: 8px;
			background-color: #656565;
			margin: 0 15px;
			transition: all 0.5s ease;
		}
		.active {
			background-color: var(--main-color);
			width: 20px;
			height: 8px;
			transition: all 0.3s ease;
		}
	}
	.my-swipe {
		height: 320px;
		box-sizing: border-box;
		img {
			width: 100%;
			height: 100%;
			border-radius: 20px;
			filter: var(--BoxShadowColor-35);
		}
	}
}


</style>
