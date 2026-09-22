<!--  -->
<template>
	<NavBar :title="$t('activityDestitle')" backgroundColor="#f54545" :placeholder="false" left-arrow @click-left="onClick" />
	<div v-if="activitydetailList.coverUrl || activitydetailList.title || activitydetailList.img" class="active-container">
		<img class="banner" :src="activitydetailList.coverUrl" />
		<div class="active-box">
			<div class="title">{{ activitydetailList.title }}</div>
			<iframe v-if="activitydetailList.jumpType == 4" :src="activitydetailList.contents"></iframe>
			<div v-else-if="activitydetailList.jumpType !== 3" v-html="activitydetailList.img"></div>

			<div v-else>
				<div v-for="(item, index) in imgs" :key="index">
					<img :src="item?.Url" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import { AwaitApiResult } from '@/utils'
import type { ResActivityDetailList } from '@/types/api'
import { GetActivityDetail } from '@/api'
import { useCommonStore } from '@/stores'
import { useRouter } from 'vue-router'
const router = useRouter()
const { setLoading } = useCommonStore()
// const showimg = ref<any>('')
const activitydetailList = ref<ResActivityDetailList>({} as ResActivityDetailList)
const getActivityList = async () => {
	setLoading(true)
	const res = await AwaitApiResult(
		GetActivityDetail({
			bannerId: Number(router.currentRoute.value.query.id)
		})
	)
	if (res?.data?.jumpType === 3) {
		activitydetailList.value = res.data
	} else {
		// let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签'
		// showimg.value = Boolean(res.data.img.match(imgReg))
		activitydetailList.value = res.data
	}
	setLoading(false)
}
const imgs=computed(()=>{
	if (!activitydetailList.value?.img) return [];
	try {
		return  JSON.parse(activitydetailList.value.img)
	}catch (e) {
		return  []
	}
})
function onClick() {
	router.go(-1)
}
onMounted(async () => {
	getActivityList()
})
</script>
<style lang="scss" scoped>
.active-container {
	.banner {
		width: 100%;
		display: block;
		max-height: 360px;
	}
	.active-box {
		border-radius: 20px;
		padding: 20px 26px 26px;
		background: var(--bg_color_L2);
		position: relative;
		z-index: 2;
		.title {
			font-size: 28px;
			font-weight: 600;
			text-align: center;
			margin-bottom: 20px;
			color: var(--text_color_L1);
		}
		:deep(img) {
			display: block !important;
			width: 100% !important;
		}
	}
	iframe {
		display: block;
		width: 100%;
		height: 80vh;
		border: none;
	}
}
</style>
