<template>
	<div class="noticeBar__container">
		<svg-icon name="noticeBarSpeaker" />
		<div class="noticeBar__container-body">
			<div class="noticeBar__container-body-text" v-if="list && list[0] && list[0].siteMessage">
				{{ list[0]?.siteMessage }}
			</div>
		</div>

		<button @click="router.push({ name: 'Messages', query: { tab: 'site' } })" class="hotIcon">
			{{ $t('more') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { getSiteMessageList } from '@/api'
import { GlobalStore } from '@/stores'
import { AwaitApiResult } from '@/utils'
import { ref, watch } from 'vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

withDefaults(
	defineProps<{
		color: string
	}>(),
	{
		color: 'red'
	}
)

const router = useRouter()

const globalStore = GlobalStore()

const timer = ref<any>(null)

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
