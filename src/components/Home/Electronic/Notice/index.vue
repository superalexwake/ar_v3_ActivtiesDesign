<template>
	<div class="noticeBar__container" :class="isHome ? 'homenotice': ''">
		<component class="notice-icon" :is="speakerIcon" />

		<div class="noticeBar__container-body">
			<div class="noticeBar__container-body-text" v-if="list && list[0] && list[0].siteMessage">
				{{ list[0]?.siteMessage }}
			</div>
		</div>

		<!-- <button class="more" @click="$router.push({ name: 'Messages', query: { tab: 'site' } })">
			{{ $t('more') }}
		</button> -->

		<div class="more" @click="router.push({ name: 'Messages', query: { tab: 'site' } })">
			<p class="wen">{{ $t('more') }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getSiteMessageList } from '@/api'
import { GlobalStore } from '@/stores'
import { AwaitApiResult } from '@/utils'
import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
	isHome: {
		type: Boolean,
		default: false
	}
})

const router = useRouter()

const globalStore = GlobalStore()

const timer = ref<any>(null)

const speakerIcon = defineAsyncComponent(() => import('@/svg/home/noticeBarSpeaker.vue'))

// const hotIcon = defineAsyncComponent(() => import('@/svg/home/noticeBarHot.vue'))

const list = ref<any>(globalStore.messageList)

// 获取公告内容
const GetMsg = async () => {
	// 获取系统消息
	const res = await AwaitApiResult(getSiteMessageList({ pageNo: 1, pageSize: 5 }))
	if (res) {
		globalStore.setMessage(res.data.list)
		list.value = res.data.list
		if (!list.value.length) return
		if (timer.value) {
			clearInterval(timer.value)
		}
		timer.value = setInterval(() => {
			list.value.push(list.value.shift() as any)
		}, 7000)
	}
}
onMounted(() => {
	if (!list.value) {
		setTimeout(() => {
			GetMsg()
		}, 1000)
	}
})

const { locale } = useI18n()
// 公告内容由后端按语言返回，切换语言后需重新拉取
watch(locale, GetMsg)
</script>

<style lang="scss" scoped>
</style>
