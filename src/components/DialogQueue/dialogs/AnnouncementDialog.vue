<template>
	<div class="announcement-dialog">
		<div class="announcement-dialog__header">{{ currentNotice.title }}</div>
		<div class="announcement-dialog__content" v-html="currentNotice.siteMessage"></div>
		<button type="button" class="announcement-dialog__button" @click="confirm">
			{{ $t('confirm') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface AnnouncementNotice {
	title: string
	siteMessage: string
	addtime?: Date | string
}

interface Props {
	notices: AnnouncementNotice[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'close'): void
}>()

const currentIndex = ref(0)
const currentNotice = computed(() => props.notices[currentIndex.value] || { title: '', siteMessage: '' })

function confirm() {
	if (currentIndex.value < props.notices.length - 1) {
		currentIndex.value += 1
		return
	}

	emit('close')
}
</script>

<style scoped lang="scss">
// 样式照原版 91club / 公共首页里的 prompt dialog 复刻：
//   - header：渐变背景 88px 高 居中白字 36px
//   - content：固定 700px 高 + 内部 img 限宽 580px
//   - button：渐变背景 80px 高 胶囊圆角，底部居中
.announcement-dialog {
	width: min(620px, calc(100vw - 48px));
	border-radius: 15px;
	background: var(--bg_color_L1);
	color: var(--text_color_L1);
	overflow: hidden;

	&__header {
		background: var(--main_gradient-color);
		text-align: center;
		height: 88px;
		line-height: 88px;
		color: #ffffff;
		font-weight: 700;
		font-size: 32px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	&__content {
		height: 700px;
		padding: 30px 20px;
		overflow-y: auto;
		word-break: break-word;

		:deep(img) {
			max-width: 580px;
		}
	}

	// 原版 van-dialog footer slot 被定 position:fixed 是个 bug，这里改成 normal flow 居中
	&__button {
		display: block;
		margin: 24px auto 28px;
		width: 80%;
		height: 70px;
		border: 0;
		border-radius: 80px;
		background: var(--main_gradient-color);
		color: #fff;
		font-size: 32px;
		font-weight: 700;
		letter-spacing: 5px;
		font-family: 'Inter';
	}
}
</style>
