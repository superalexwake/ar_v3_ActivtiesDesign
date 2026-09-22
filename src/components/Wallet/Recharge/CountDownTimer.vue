<template>
	<span :class="className" class="count_timer">{{ timeStr }}</span>
</template>

<script lang="ts" setup>
import { formatTime } from '@/utils'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
	defineProps<{
		startTime: string
		endTime: string
		className?: string
	}>(),
	{}
)

const timer = ref<NodeJS.Timeout>()
const timeStr = ref('00:00')

onMounted(() => {
	let start = props.startTime
	let end = props.endTime
	let startTime = new Date(start.replace(/-/g, '/')).getTime()
	let endTime = new Date(end.replace(/-/g, '/')).getTime()
	let distance = startTime - endTime
	timer.value = setInterval(() => {
		distance -= 1000
		timeStr.value = formatTime(distance, 'mm:ss')
		if (distance < 0) {
			clearInterval(timer.value)
			timeStr.value = '00:00'
			console.log('Countdown finished!')
		}
	}, 1000)
})
onBeforeUnmount(() => {
	clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.count_timer {
	background: none;
	display: inline-block;
	text-align: left !important;
	min-width: 80px !important;
}
</style>
