<template>
	<div class="noticeBar__container" id="noticeBar">
		<span class="notify"></span>
		<div class="noticeBar__container-body">
			<div class="noticeBar__container-body-text" v-if="list && list[0] && list[0].siteMessage">{{ list[0]?.siteMessage }}</div>
		</div>
		<button @click="router.push({ name: 'Messages', query: { tab: 'site' } })">
			{{ $t('more') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import {getSiteMessageList} from '@/api'
import {GlobalStore} from '@/stores'
import {AwaitApiResult} from '@/utils'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'

const router = useRouter()

const globalStore = GlobalStore()

const timer = ref<any>(null)

const list = ref<any>(globalStore.messageList)

// 获取公告内容
const GetMsg = async () => {
	// 获取系统消息
	const res = await AwaitApiResult(getSiteMessageList({ pageNo: 1, pageSize: 5 }))
	if (res) {
		globalStore.setMessage(res.data.list);
		list.value = res.data.list;
		if(!list.value.length) return
		if (timer.value) {
			clearInterval(timer.value)
		}
		timer.value = setInterval(() => {
			list.value.push(list.value.shift() as any)
		}, 7000)
	}
}
onMounted(()=>{
	if(!list.value) {
		setTimeout(()=>{
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
	height: 74px;
	padding-inline: 20px;
	color: #303a4c;
	font-size: 24px;
	border-radius: 99rem;
	background: #fff;
	margin-bottom: 40px;
	span.notify {
		background: url('@icon/goldWHome/notify.png') no-repeat center center;
		background-size: 40px;
		width: 48px;
		height: 48px;
	}
	&-body {
		width: 700px;
		height: 100%;
		overflow: hidden;
		/* 隐藏溢出内容 */
		position: relative;
		/* 设置相对定位，以便设置跑马灯内容的绝对定位 */
		height: 60px;
		line-height: 74px;
		display: flex;
		align-items: center;

		&-text {
			width: 100%;
			height: fit-content;
			max-height: 74px;
			line-height: 37px;
			animation: marquee 7s linear infinite;
			display: flex;
			justify-content: column;
			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: break-word;
			word-break: break-all;
		}

		@keyframes marquee {
			0% {
				transform: translateY(100%);
				/* 初始位置：向上平移0 */
			}

			10% {
				transform: translateY(0);
				/* 中间停顿5秒，保持位置不变 */
			}

			90% {
				transform: translateY(0);
				/* 中间停顿5秒，保持位置不变 */
			}

			100% {
				transform: translateY(-100%);
				/* 终止位置：向上平移100% */
			}
		}
	}

	& > svg {
		width: 32px;
		flex-shrink: 0;
		height: auto;
		margin-right: 17px;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		gap: 5px;
		width: 150px;
		height: 50px;
		margin-left: auto;
		color: #fff;
		border: none;
		border-radius: 40px;
		background: linear-gradient(360deg, #f54545 20.19%, #fe6868 100%);
		svg {
			width: 24px;
			height: auto;
		}
	}
}
</style>
