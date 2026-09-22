<template>
	<div class="swiper_box">
		<swiper class="my-swipe" :slides-per-view="1" :space-between="20"  @slideChange="onSlideChange"
			:autoplay="{
				delay: 5000,
				disableOnInteraction: false
			}" :modules="modules" :loop="true">
			<swiper-slide v-for="(item, index) in getBanner" :key="index">
				<img v-lazy="item.bannerUrl" @click="goPage(item)" />
			</swiper-slide>
		</swiper>
		<div class="swiper-button" v-if="getBanner.length > 1 && isShowButton">
			<span v-for="i in getBanner.length" :key="i" :class="{ active: swiperIndex === i - 1 }"></span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Autoplay } from 'swiper'
import { onMounted, ref } from 'vue'
import { useHome } from '@/hooks'
import { useRouter } from 'vue-router'
import { useServer } from '@/hooks/useServe.hook'

defineProps({
	isShowButton: {
		type: Boolean,
		default: false
	}
})
const router = useRouter()
const {getBannerApi,getBanner,openThirdGame } = useHome()
const { getSelfCustomerServiceLink } = useServer({ServerType: 2})
const swiperIndex = ref(0)
const modules = [Autoplay]
const onSlideChange = (e:any) => {
	if (e.activeIndex >= getBanner.value.length) {
		swiperIndex.value = e.activeIndex - getBanner.value.length
	} else {
		swiperIndex.value = e.activeIndex
	}
}
//  0-电子 1-真人 2-体育  3-彩票  4-棋牌
const categoryTypeMap:any = {
	0: 'slot',
	1: 'video',
	2: 'sport',
	3: 'lottery',
	4: 'chess'
}
const goPage = (item: Record<string, any>) => {
	if (item.jumpLinkType==1){
		if (!item.gameCode){
			// 电子棋牌
			if ([0,4].includes(item.categoryType)&&item.vendorCode){
			 	router.push({ name: 'AllOnlineGames',
					query: {
						game: item.categoryType==0?'slot':'chess',
						vendorCode: item.vendorCode || ''
				} })
				return
			}
			// 真人 体育
			if ([1,2].includes(item.categoryType)&&item.vendorCode){
				return  openThirdGame(item)
			}
			// 彩票 其他
			const type=categoryTypeMap[item.categoryType]||'';
			router.push({ name: 'AllGames',
				query: {
					type,
				} })
			return
		}
		openThirdGame(item)
		return
	} else if (item.jumpLinkType==2){
		// 跳转客服
		getSelfCustomerServiceLink()
		return
	}
	const newUrl=item.url;
	newUrl && (window.location.href = newUrl)
}

onMounted(async () => {
	await getBannerApi()
})
</script>

<style lang="scss" scoped>
.swiper_box {
	position: relative;
	padding:0 26px;
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
