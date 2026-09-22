<template>
	<div class="announcement-dialog">
		<div class="announcement-dialog__header">{{ $t('promptT') }}</div>

		<template v-if="isImage">
			<div class="announcement-dialog__image-scroll">
				<img class="announcement-dialog__image" :src="currentNotice.imageUrl" alt="" />
			</div>
		</template>
		<template v-else>
			<div class="announcement-dialog__subtitle">{{ currentNotice.title }}</div>
			<div class="announcement-dialog__content-scroll">
				<div class="announcement-dialog__content" v-html="currentNotice.siteMessage"></div>
			</div>
		</template>

		<div class="announcement-dialog__footer">
			<template v-if="hasJump">
				<button type="button" class="announcement-dialog__button announcement-dialog__button--cancel" @click="confirm">
					{{ $t('cancel') }}
				</button>
				<button type="button" class="announcement-dialog__button announcement-dialog__button--go" @click="goToView">
					{{ $t('announcementGoToView') }}
				</button>
			</template>
			<button v-else type="button" class="announcement-dialog__button announcement-dialog__button--solo" @click="confirm">
				{{ $t('confirm') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

interface AnnouncementNotice {
	title: string
	siteMessage: string
	addtime?: Date | string
	/** 图片公告的图片地址；有值即按图片公告展示 */
	imageUrl?: string
	/** 后台配置的跳转内容；有值则底部为“取消/前往查看”，无值则为单个“确认” */
	jumpUrl?: string
}

interface Props {
	notices: AnnouncementNotice[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'close'): void
}>()
const router = useRouter()

const currentIndex = ref(0)
const currentNotice = computed(() => props.notices[currentIndex.value] || { title: '', siteMessage: '' })
const isImage = computed(() => Boolean(currentNotice.value.imageUrl))
const hasJump = computed(() => Boolean(currentNotice.value.jumpUrl))

/** “确认”（无跳转）与“取消”（有跳转）共用：有下一条公告就翻到下一条，没有就关闭。 */
function confirm() {
	if (currentIndex.value < props.notices.length - 1) {
		currentIndex.value += 1
		return
	}

	emit('close')
}

/** “前往查看”：跳到当前公告配置的跳转内容，然后关闭弹窗（不再展示队列里剩余的公告）。 */
function goToView() {
	const jumpUrl = currentNotice.value.jumpUrl
	if (jumpUrl) router.push(jumpUrl)
	emit('close')
}
</script>

<style scoped lang="scss">
// 样式照 figma 设计稿的公告弹窗复刻，弹窗左上角为原点：
//   - header：横向渐变 88px 高，白字居中，固定文案“Prompt”
//   - 文字公告：副标题（公告标题）+ 正文（siteMessage，可滚动，右侧常显自定义滚动条）
//   - 图片公告：只展示一张图，图片比内容区高时整体可滚动，同样的常显滚动条
//   - footer：无跳转时“确认”单按钮；有跳转时“取消”+“前往查看”两个按钮
.announcement-dialog {
	position: relative;
	width: min(622px, calc(100vw - 48px));
	height: 930px;
	border-radius: 20px;
	background: #ffffff;
	overflow: hidden;

	&__header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 88px;
		border-radius: 20px 20px 0 0;
		background: linear-gradient(90deg, #fea175 0%, #fe5b5b 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		font-family: 'Poppins', 'Inter', sans-serif;
		font-weight: 700;
		font-size: 36px;
	}

	&__subtitle {
		position: absolute;
		top: 105px;
		left: 0;
		right: 0;
		text-align: center;
		color: #fe6868;
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 28px;
		line-height: 60px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	// 滚动容器铺满“内容区可用宽度”（距弹窗右边 26，含滚动条自身宽度）；
	// 内部文字/图片再各自定宽，令滚动条落在距弹窗右边 26、宽 20 的位置。
	&__content-scroll,
	&__image-scroll {
		position: absolute;
		top: 176px;
		left: 26px;
		right: 26px;
		bottom: 150px;
		overflow-y: auto;
		overflow-x: hidden;

		// 常显滚动条：轨道 #F1F1F1，滑块 #C1C1C1，宽 20；上下各一个小三角箭头（不做点击交互）
		scrollbar-width: thin;
		scrollbar-color: #c1c1c1 #f1f1f1;

		&::-webkit-scrollbar {
			width: 20px;
		}
		&::-webkit-scrollbar-track {
			background: #f1f1f1;
		}
		&::-webkit-scrollbar-thumb {
			background: #c1c1c1;
			border-radius: 10px;
		}
		&::-webkit-scrollbar-button:vertical:start:decrement {
			display: block;
			height: 8px;
			background: #f1f1f1;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 0;
				height: 0;
				border-left: 6px solid transparent;
				border-right: 6px solid transparent;
				border-bottom: 8px solid #c1c1c1;
			}
		}
		&::-webkit-scrollbar-button:vertical:end:increment {
			display: block;
			height: 8px;
			background: #f1f1f1;
			position: relative;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 0;
				height: 0;
				border-left: 6px solid transparent;
				border-right: 6px solid transparent;
				border-top: 8px solid #505050;
			}
		}
	}

	&__content {
		width: 528px;
		color: #1e2637;
		font-size: 24px;
		line-height: 36px;
		text-align: left;
		word-break: break-word;

		:deep(img) {
			max-width: 100%;
		}
	}

	&__image {
		display: block;
		width: 528px;
	}

	&__footer {
		position: absolute;
		top: 780px;
		left: 0;
		right: 0;
		height: 150px;
		background: #ffffff;
	}

	// top 相对 &__footer 算（footer 是 position:absolute，是按钮的定位上下文）：
	// footer 本身 top:780px，815-780=35px，两者相加正好是按钮上边缘距弹窗顶 815px
	&__button {
		position: absolute;
		top: 35px;
		border: 0;
		border-radius: 80px;
		font-family: 'Inter', sans-serif;
		font-weight: 700;
		font-size: 32px;
	}

	&__button--solo {
		left: 50%;
		transform: translateX(-50%);
		width: 400px;
		height: 80px;
		background: linear-gradient(90deg, #ff867a 0%, #f95959 100%);
		color: #ffffff;
	}

	&__button--cancel {
		left: 47px;
		width: 240px;
		height: 84px;
		background: transparent;
		border: 1px solid #fb5b5b;
		color: #fb5b5b;
	}

	&__button--go {
		left: 335px;
		width: 240px;
		height: 80px;
		background: #f95959;
		color: #ffffff;
	}
}
</style>
