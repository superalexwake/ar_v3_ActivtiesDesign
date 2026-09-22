<template>
	<van-popup v-model:show="show" teleport="body">
		<div class="captcha" :style="captchaWrapperStyle">
			<div class="captcha__main" :style="(imgWrapperStyle as any)">
				<img v-if="src" ref="backgroundRef" alt="background" class="captcha_background" :src="src" />
				<img
					v-show="sliderSrc"
					ref="sliderRef"
					alt="slider"
					class="captcha_slider"
					:class="{ goFirst: isOk, goKeep: isKeep }"
					:src="sliderSrc"
				/>
				<div v-if="showVerifyTip" class="captcha_message">
					<div class="captcha_message__icon">
						<svg v-if="isPassing" height="28" viewBox="0 0 28 28" width="28" xmlns="http://www.w3.org/2000/svg">
							<g
								fill="none"
								fill-rule="evenodd"
								stroke="#fff"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							>
								<path
									d="M22.776 4.073A13.2 13.2 0 0 0 14 .75C6.682.75.75 6.682.75 14S6.682 27.25 14 27.25 27.25 21.318 27.25 14c0-.284-.009-.566-.027-.845"
								/>
								<path d="M7 12.5l7 7 13-13" />
							</g>
						</svg>
						<svg v-else height="28" viewBox="0 0 28 28" width="28" xmlns="http://www.w3.org/2000/svg">
							<g fill="none" fill-rule="evenodd" stroke="#fff" stroke-width="1.5">
								<circle cx="14" cy="14" r="13.25" />
								<path
									d="M8.75 8.75l10.5 10.5M19.25 8.75l-10.5 10.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</g>
						</svg>
					</div>
					<div class="captcha_message__text">
						{{ isPassing ? successTip : failTip }}
					</div>
				</div>
				<div v-if="showGenerateLoadding" class="captcha_message loadding">
					<div class="captcha_message__icon captcha_message__icon--loadding"></div>
					<div class="captcha_message__text">{{ $t('loading') }}...</div>
				</div>
				<div v-if="showVerifyLoadding" class="captcha_message">
					<div class="captcha_message__icon captcha_message__icon--loadding"></div>
					<div class="captcha_message__text"></div>
				</div>
			</div>
			<div ref="dragVerifyRef" class="captcha__bar" :style="dragVerifyStyle">
				<div
					ref="progressBarRef"
					class="captcha_progress_bar"
					:class="{ goFirst2: isOk }"
					:style="progressBarStyle"
				></div>
				<div class="captcha_progress_bar__text" :style="textStyle">
					{{ $t('slideCaptchaText') }}
				</div>
				<div
					ref="handlerRef"
					class="captcha_handler"
					:class="{ goFirst: isOk }"
					:style="handlerStyle"
					@mousedown="handleDragStart"
					@touchstart="handleDragStart"
				>
					<svg
						p-id="819"
						:style="handlerSvgStyle"
						version="1.1"
						viewBox="0 0 1024 1024"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M500.864 545.728a47.744 47.744 0 0 0 6.72-48.896 24.704 24.704 0 0 0-4.48-8.384L240.256 193.088a34.24 34.24 0 0 0-28.608-17.408 34.24 34.24 0 0 0-25.856 12.864 46.592 46.592 0 0 0 0 59.52l238.08 264.512-238.08 264.512a46.592 46.592 0 0 0-1.088 59.52 32 32 0 0 0 50.56 0l265.6-290.88z"
							p-id="820"
						/>
						<path
							d="M523.84 248.064l236.992 264.512-238.08 264.512a46.592 46.592 0 0 0 0 59.52 32 32 0 0 0 50.56 0l265.6-292.608a47.744 47.744 0 0 0 6.72-48.832 24.704 24.704 0 0 0-4.48-8.448L578.304 191.36a34.24 34.24 0 0 0-55.552-2.816 46.592 46.592 0 0 0 1.088 59.52z"
							p-id="821"
						/>
					</svg>
				</div>
			</div>
			<div v-if="showRefresh" class="captcha__actions">
				<a class="captcha__action" :style="refreshTextColorStyle" @click="handleRefresh">
					<svg
						:fill="refreshColorStyle"
						height="20px"
						version="1.1"
						viewBox="0 0 20 20"
						width="20px"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10,4 C12.0559549,4 13.9131832,5.04358655 15.0015086,6.68322231 L15,5.5 C15,5.22385763 15.2238576,5 15.5,5 C15.7761424,5 16,5.22385763 16,5.5 L16,8.5 C16,8.77614237 15.7761424,9 15.5,9 L12.5,9 C12.2238576,9 12,8.77614237 12,8.5 C12,8.22385763 12.2238576,8 12.5,8 L14.5842317,8.00000341 C13.7999308,6.20218044 12.0143541,5 10,5 C7.23857625,5 5,7.23857625 5,10 C5,12.7614237 7.23857625,15 10,15 C11.749756,15 13.3431487,14.0944653 14.2500463,12.6352662 C14.3958113,12.4007302 14.7041063,12.328767 14.9386423,12.4745321 C15.1731784,12.6202971 15.2451415,12.9285921 15.0993765,13.1631281 C14.0118542,14.9129524 12.0990688,16 10,16 C6.6862915,16 4,13.3137085 4,10 C4,6.6862915 6.6862915,4 10,4 Z"
							fill-rule="nonzero"
						/>
					</svg>
					<!-- <span class="captcha__action__text">刷新</span> -->
				</a>
			</div>
		</div>
	</van-popup>
</template>
<script setup lang="ts">
import { nextTick } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
	width: {
		type: Number,
		default: 340
	},
	height: {
		type: Number,
		default: 212
	},
	barHeight: {
		type: Number,
		default: 40
	},
	handlerIconWidth: {
		type: Number,
		default: 16
	},
	handlerIconHeigth: {
		type: Number,
		default: 16
	},
	background: {
		type: String,
		default: '#eee'
	},
	circle: {
		type: Boolean,
		default: false
	},
	radius: {
		type: String,
		default: '4px'
	},
	text: {
		type: String,
		default: ''
	},
	progressBarBg: {
		type: String,
		default: '#76c61d'
	},
	successTip: {
		type: String,
		default: 'Verification passed, over 80% of users.'
	},
	failTip: {
		type: String,
		default: 'Verification failed, drag the slider to correctly merge the floating image.'
	},
	showRefresh: {
		type: Boolean,
		default: false
	},
	refreshColor: {
		type: String,
		default: '#505050'
	}
})

const emits = defineEmits<{
	(e: 'finish', val: any): void
	(e: 'refresh'): void
}>()
const show = ref(false)
const isMoving = ref(false)
const x = ref(0)
const y = ref(0)
const isOk = ref(false)
const isKeep = ref(false)
const isFinish = ref(false)
const tracks = ref<any[]>([])
const startSlidingTime = ref<any>(undefined)
const showVerifyTip = ref(false)
const showVerifyLoadding = ref(false)
const showGenerateLoadding = ref(false)
const src = ref('')
const sliderSrc = ref('')
const isPassing = ref(false)
const imgWrapperStyle = computed(() => {
	return {
		width: props.width + 'px',
		height: props.height + 'px',
		position: 'relative',
		overflow: 'hidden'
	}
})
const captchaWrapperStyle = computed(() => {
	return {
		width: props.width + 'px'
	}
})
const dragVerifyStyle = computed(() => {
	return {
		width: props.width + 'px',
		height: props.barHeight + 'px',
		lineHeight: props.barHeight + 'px',
		background: props.background,
		borderRadius: props.circle ? props.barHeight / 2 + 'px' : props.radius
	}
})
const progressBarStyle = computed(() => {
	return {
		background: props.progressBarBg,
		height: props.barHeight + 'px',
		borderRadius: props.circle ? props.barHeight / 2 + 'px 0 0 ' + props.barHeight / 2 + 'px' : props.radius
	}
})
const textStyle = computed(() => {
	return {
		height: props.barHeight + 'px',
		width: props.width + 'px'
		//fontSize: this.textSize,
	}
})
const handlerStyle = computed(() => {
	return {
		width: props.barHeight + 'px',
		height: props.barHeight - 2 + 'px'
		//background: this.handlerBg,
	}
})
const handlerSvgStyle = computed(() => {
	return {
		width: props.handlerIconWidth + 'px',
		height: props.handlerIconHeigth + 'px'
	}
})
const refreshColorStyle = computed(() => {
	return props.refreshColor
})
const refreshTextColorStyle = computed(() => {
	return {
		color: props.refreshColor
	}
})

const dragVerifyRef = ref()
const progressBarRef = ref()
const backgroundRef = ref()
const sliderRef = ref()
const handlerRef = ref()
// 开始请求生成图片时调用
const startRequestGenerate = () => {
	show.value = true
	nextTick(() => {
		reset()
		setDragVerifyRef()
	})
	showGenerateLoadding.value = true
}
// 结束请求生成图片时调用
const endRequestGenerate = (srcD: any, sliderSrcD: any) => {
	showGenerateLoadding.value = false
	src.value = srcD
	sliderSrc.value = sliderSrcD
}
// 开始请求校验时调用
const startRequestVerify = () => {
	showVerifyLoadding.value = true
}
// 结束请求校验时调用
const endRequestVerify = (isPassing: any) => {
	isPassing.value = isPassing
	showVerifyLoadding.value = false
	showVerifyTip.value = true
}
const reset = () => {
	x.value = 0
	y.value = 0
	tracks.value = []
	isMoving.value = false
	isFinish.value = false
	showGenerateLoadding.value = false
	showVerifyLoadding.value = false
	showVerifyTip.value = false
	isPassing.value = false
	if (progressBarRef) progressBarRef.value.style.width = 0
	if (sliderRef) sliderRef.value.style.left = 0
	if (handlerRef) handlerRef.value.style.left = 0
}
const removeEventListeners = () => {
	window.removeEventListener('touchmove', handleDragMoving)
	window.removeEventListener('touchend', handleDragFinish)
	window.removeEventListener('mousemove', handleDragMoving)
	window.removeEventListener('mouseup', handleDragFinish)
}
const handleDragStart = (e: any) => {
	if (!isPassing.value && src.value && sliderSrc.value && !isFinish.value) {
		window.addEventListener('touchmove', handleDragMoving)
		window.addEventListener('touchend', handleDragFinish)
		window.addEventListener('mousemove', handleDragMoving)
		window.addEventListener('mouseup', handleDragFinish)

		isMoving.value = true
		startSlidingTime.value = new Date()
		x.value = e.pageX || e.touches[0].pageX
		y.value = e.pageY || e.touches[0].pageY
	}
}
const handleDragMoving = (e: any) => {
	if (isMoving.value && !isPassing.value && src.value && sliderSrc.value && !isFinish.value) {
		const _x = (e.pageX || e.touches[0].pageX) - x.value
		const _y = (e.pageY || e.touches[0].pageY) - y.value

		handlerRef.value.style.left = _x + 'px'
		progressBarRef.value.style.width = _x + props.barHeight / 2 + 'px'
		sliderRef.value.style.left = _x + 'px'

		tracks.value.push({
			x: Math.round(_x),
			y: Math.round(_y),
			t: new Date().getTime() - startSlidingTime.value.getTime()
		})
	}
}
const handleDragFinish = () => {
	if (isMoving.value && !isPassing.value && src.value && sliderSrc.value && !isFinish.value) {
		isMoving.value = false
		isFinish.value = true
		removeEventListeners()
		emits('finish', {
			backgroundImageWidth: backgroundRef.value.offsetWidth,
			backgroundImageHeight: backgroundRef.value.offsetHeight,
			sliderImageWidth: sliderRef.value.offsetWidth,
			sliderImageHeight: sliderRef.value.offsetHeight,
			startTime: startSlidingTime.value,
			endTime: new Date(),
			tracks: tracks.value
		})
	}
}
const setShowHiden = (value: boolean) => {
	show.value = value
}
const setDragVerifyRef = () => {
	dragVerifyRef.value.style.setProperty('--textColor', '#333')
	dragVerifyRef.value.style.setProperty('--width', Math.floor(props.width / 2) + 'px')
	dragVerifyRef.value.style.setProperty('--pwidth', -Math.floor(props.width / 2) + 'px')
}
const handleRefresh = () => {
	reset()
	emits('refresh')
}

defineExpose({
	startRequestVerify,
	endRequestVerify,
	startRequestGenerate,
	endRequestGenerate,
	setShowHiden
})
onUnmounted(() => {
	removeEventListeners()
})
</script>
<style scoped>
.captcha {
	user-select: none;
	margin-right: auto;
	margin-left: auto;
}

.captcha__main {
	background: rgb(244, 245, 246);
}

.captcha_background {
	width: 100%;
}

.captcha_slider {
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	height: 100%;
	html:lang(ar) &{
		left: unset;
		right: 0;
	}
}

.captcha_message {
	position: absolute;
	top: 0px;
	left: 0px;
	z-index: 999999;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(34, 34, 34, 0.85);
	-webkit-box-pack: center;
	-webkit-box-align: center;
	html:lang(ar) &{
		left: unset;
		right: 0;
	}
}

.captcha_message__icon {
	width: 28px;
	height: 28px;
	margin: 0px auto;
}

.captcha_message__icon--loadding {
	width: 24px;
	height: 24px;
	background-image: url(data:image/png;base64,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);
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	border-radius: 50%;
	animation: 1s linear 0s infinite normal none running turn;
}

.captcha_message.loadding {
	background-color: rgb(244 245 246);
}

.captcha_message__text {
	display: inline-block;
	max-width: 200px;
	padding: 10px;
	font-size: 14px;
	color: rgb(255, 255, 255);
	text-align: center;
}

.captcha_message.loadding .captcha_message__text {
	color: rgb(202, 202, 202);
}

.captcha__bar {
	position: relative;
	width: 100%;
	margin-top: 5px;
	overflow: hidden;
	text-align: center;
}

.captcha_progress_bar {
	position: absolute;
	width: 0;
}

.captcha_progress_bar__text {
	position: absolute;
	top: 0px;
	width: 100%;
	font-size: 12px;
	color: transparent;
	-moz-user-select: none;
	-webkit-user-select: none;
	-o-user-select: none;
	-ms-user-select: none;
	user-select: none;
	background: -webkit-gradient(
		linear,
		left top,
		right top,
		color-stop(0, var(--textColor)),
		color-stop(0.4, var(--textColor)),
		color-stop(0.5, #fff),
		color-stop(0.6, var(--textColor)),
		color-stop(1, var(--textColor))
	);
	-webkit-background-clip: text;
	animation: slidetounlock 3s infinite;
	-webkit-text-fill-color: transparent;
	-webkit-text-size-adjust: none;
}

.captcha_handler {
	position: absolute;
	top: 0px;
	left: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 1px;
	cursor: move;
	background: rgb(255, 255, 255);
	html:lang(ar) &{
		left: unset;
		right: 0;
	}
}

.captcha__actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 20px;
	padding: 16px 20px 20px 0px;
	line-height: 20px;
	color: rgb(80, 80, 80);
	-webkit-box-pack: justify;
	-webkit-box-align: center;
}

.captcha__action__text {
	font-size: 14px !important;
	color: rgb(80, 80, 80);
}

.captcha__action {
	display: flex;
	align-items: center;
	text-decoration: none;
	cursor: pointer;
}

.goFirst {
	left: 0px !important;
	transition: left 0.5s;
	html:lang(ar) &{
		left: unset;
		right: 0 !important;
	}
}

.goKeep {
	transition: left 0.2s;
}

.goFirst2 {
	width: 0px !important;
	transition: width 0.5s;
}
</style>
<style>
@keyframes slidetounlock {
	0% {
		background-position: var(--pwidth) 0;
	}

	100% {
		background-position: var(--width) 0;
	}
}

@keyframes slidetounlock2 {
	0% {
		background-position: var(--pwidth) 0;
	}

	100% {
		background-position: var(--pwidth) 0;
	}
}

@keyframes turn {
	0% {
		-webkit-transform: rotate(0deg);
	}

	25% {
		-webkit-transform: rotate(90deg);
	}

	50% {
		-webkit-transform: rotate(180deg);
	}

	75% {
		-webkit-transform: rotate(270deg);
	}

	100% {
		-webkit-transform: rotate(360deg);
	}
}
</style>
