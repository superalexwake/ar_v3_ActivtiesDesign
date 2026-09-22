<script setup lang="ts">
import Header from '@/components/Home/OkwinHome/Header.vue'
import Swiper from '@/components/Home/OkwinHome/Swiper.vue'
import Notice from '@/components/Home/OkwinHome/NoticeBar.vue'
import MenuItem from '@/components/Home/OkwinHome/MenuItem.vue'
import PlayMain from '@/components/Home/OkwinHome/PlayMain.vue'
import Winning from '@/components/Home/OkwinHome/Winning.vue'
import Rank from '@/components/Home/OkwinHome/Rank.vue'
import { onMounted, ref} from "vue";
import DownloadPWA from "@/components/common/DownloadPWA.vue";
import Turntable from "@/components/common/Turntable.vue";

// import InviteTurntable from '@/components/common/InviteTurntable.vue'

const currentMenu = ref('popular')
const currentTitle = ref('hot')
const handleChangeMenu = ({ key, title }) => {
	currentMenu.value = key
	currentTitle.value = title
}

onMounted(() => {
	currentMenu.value = sessionStorage.getItem('currentKey') || 'popular'
})

</script>

<template>
	<div class="okwin_home">

		<div class="top_bg">
		</div>
		<div class="px-24">
			<Header />
			<Swiper />
			<Notice />
		</div>
		<MenuItem @changeMenu="handleChangeMenu" :currentMenu="currentMenu" />
		<div class="px-24">
			<PlayMain :currentMenu="currentMenu" :currentTitle="currentTitle" />
			<Winning />
			<Rank />
		</div>
		<!-- 邀请转盘 -->
		<!-- <InviteTurntable /> -->
		<DownloadPWA />
		<Turntable />
</div>
</template>

<style scoped lang="scss">
.okwin_home {
	width: 100%;
	padding-bottom: 320px;
	position: relative;

	.top_bg {
		height: 900px;
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0.9;
		background: linear-gradient(180deg, rgba(247, 248, 255, 0.00) 0%, #F7F8FF 100%), linear-gradient(134deg, rgba(255, 137, 137, 0.30) -3.06%, rgba(255, 186, 147, 0.30) 84.86%);
		backdrop-filter: blur(8px);
		z-index: 0;
	}

	.px-24 {
		padding: 0 24px;
	}
}
</style>