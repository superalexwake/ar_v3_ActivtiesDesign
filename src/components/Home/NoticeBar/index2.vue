<template>
	<div class="notice_91">
		<svg-icon name="91-notice" class="notice"/>
		<div class="notice_91-body">
			<div class="notice_91-body-text" v-if="list && list[0] && list[0].siteMessage">
				{{ list[0]?.siteMessage }}
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
	import { getSiteMessageList } from '@/api'
	import { GlobalStore } from '@/stores'
	import { AwaitApiResult } from '@/utils'
	import { ref, watch } from 'vue'
	import { onMounted } from 'vue'
	import { useI18n } from 'vue-i18n'

	withDefaults(
		defineProps<{
			color: string
		}>(),
		{
			color: 'red'
		}
	)

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
	.notice {
		width: 48px;
		height: 48px;
	}

	.notice_91 {
		display: flex;
		height: 48px;
		box-sizing: border-box;
		overflow: hidden;
		&-body {
			overflow: hidden;
			/* 设置相对定位，以便设置跑马灯内容的绝对定位 */
			height: 60px;
			display: flex;
			align-items: center;
			flex: 1;

			&-text {
				width: 100%;
				height: fit-content;
				color: #1e2637;
				max-height: 48px;
				line-height: 24px;
				font-size: 18px;
				animation: marquee 7s linear infinite;
				display: flex;
				justify-content: column;
				overflow: hidden;
				text-overflow: ellipsis;
				word-wrap: break-word;
				word-break: break-all;
				position: relative;
				top: -6px;
			}

			@keyframes marquee {
				0% {
					transform: translateY(110%);
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
	}
</style>
