<template>
	<div class="noticeBar__container">
		<img src="@/assets/icons/home/okwinHome/notice.png" class="notice_icon" />

		<div class="noticeBar__container-body">
			<div class="noticeBar__container-body-text" v-if="list && list[0] && list[0].siteMessage">
				{{ list[0]?.siteMessage }}
			</div>
		</div>

		<button @click="router.push({ name: 'Messages', query: { tab: 'site' } })" class="more">
			<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
				<g clip-path="url(#clip0_3_4738)">
					<path d="M25.8735 0H0.5V25.3913H25.8735V0Z" fill="white" fill-opacity="0.01"/>
					<path d="M13.187 23.2756C17.54 23.2756 21.1161 19.8236 21.1161 15.3927C21.1161 14.305 21.0609 13.1389 20.4584 11.3267C19.8559 9.5145 19.7345 9.28058 19.0974 8.1614C18.8252 10.4453 17.3689 11.3972 16.9989 11.6816C16.9989 11.3857 16.1179 8.11274 14.7822 6.15443C13.4709 4.23215 11.6876 2.97101 10.6419 2.11621C10.6419 3.74007 10.1855 6.15443 9.53187 7.38459C8.87824 8.61475 8.7555 8.65955 7.93905 9.57501C7.12266 10.4905 6.74792 10.7732 6.06522 11.884C5.38254 12.9948 5.25781 14.4743 5.25781 15.562C5.25781 19.9929 8.83405 23.2756 13.187 23.2756Z" fill="white"/>
				</g>
				<defs>
					<clipPath id="clip0_3_4738">
						<rect width="25.3735" height="25.3913" fill="white" transform="translate(0.5)"/>
					</clipPath>
				</defs>
			</svg>{{ $t('more') }}
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
.noticeBar__container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 72px;
	background-color: #fff;
	border-radius: 50px;
	margin-bottom: 32px;
	position: relative;
	z-index: 2;
	box-shadow: 0px 8px 16px 0px rgba(133, 147, 161, 0.16);
	.notice_icon {
		width: 42px;
		height: 42px;
		margin-right: 18px;
	}
	.noticeBar__container-body {
		width: 446px;
		.noticeBar__container-body-text {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 24px;
			color: #303A4C;
		}
	}
	.more {
		width: 150px;
		height: 50px;
		font-size: 24px;
		color: #fff;
		line-height: 50px;
		border-radius: 50px;
		border: none;
		background: linear-gradient(118deg, #FF8E89 26.37%, #FFC3A2 89.18%);
		svg {
			width: 26px;
			height: 26px;
		}
	}
}
</style>
