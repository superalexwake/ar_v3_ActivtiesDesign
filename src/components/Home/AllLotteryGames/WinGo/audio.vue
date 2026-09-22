<template>
	<audio id="voice1" :muted="muted">
		<source src="../../../../assets/audio/di1.mp3" type="audio/mpeg" />
	</audio>
	<audio id="voice2" :muted="muted">
		<source src="../../../../assets/audio/di2.mp3" type="audio/mpeg" />
	</audio>
</template>
<script setup lang="ts">
import { GlobalStore } from '@/stores'
import { nextTick, onMounted, ref, watch } from 'vue'

const muted = ref(false)

watch(
	() => GlobalStore().visibility,
	(newVal) => {
		if (newVal === 0) {
			muted.value = true
		} else {
			setTimeout(() => {
				muted.value = false
			}, 500)
		}
	}
)

/**
 * @description: ios自动播放需要事件激活
 * @return {*}
 */
const audioPlay = () => {
	muted.value = true
	nextTick(() => {
		const ttsAudio1: any = document.getElementById(`voice1`)
		const ttsAudio2: any = document.getElementById(`voice2`)
		ttsAudio1.play()
		ttsAudio2.play()

		ttsAudio1.pause()
		ttsAudio2.pause()
		muted.value = false
		document.removeEventListener('touchstart', audioPlay)
	})
}

onMounted(() => {
	document.addEventListener('touchstart', audioPlay)
})
</script>
