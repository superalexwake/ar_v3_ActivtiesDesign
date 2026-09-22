<template>
	<div class="guide-container">
		<NavBar :title="$t('guideTitle')" left-arrow @click-left="router.go(-1)" />
		<div class="guide-container-content" v-html="contentMsg" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AwaitApiResult } from '@/utils'
import { GetPlayingGuide } from '@/api'
import type { ReqPlayingGuide } from '@/types/api'
const router = useRouter()
const contentMsg = ref<ReqPlayingGuide>()
// 获取新手指南
onMounted(async () => {
	//请求新手指南内容
	const res = await AwaitApiResult(GetPlayingGuide())
	if (res) {
		contentMsg.value = res.data.playingGuide
	}
})
</script>

<style lang="scss" scoped>
.guide-container {
	padding: 0 24px 30px;
}

:deep(.guide-container-content) {
	font-size: 26px;
	color: var(--text_color_L2);

	img {
		max-width: 99% !important;
	}
}
</style>
