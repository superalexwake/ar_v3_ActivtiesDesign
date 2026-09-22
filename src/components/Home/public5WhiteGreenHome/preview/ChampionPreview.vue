<template>
	<Champion :item-d="previewItem" :state="previewStatus" />
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import Champion from '../Champion.vue'
import { useChampionship } from '@/hooks/useChampionship.hook'

type PreviewState = 'ongoing' | 'upcoming' | 'ended'

const props = withDefaults(
	defineProps<{
		previewState?: PreviewState
	}>(),
	{
		previewState: 'ongoing'
	}
)

const { serviceNowTime } = useChampionship()

watchEffect(() => {
	serviceNowTime.value = '2026-04-28 12:00:00'
})

const previewStatus = computed(() => {
	if (props.previewState === 'upcoming') return 0
	if (props.previewState === 'ended') return 2
	return 1
})

const previewItem = computed(() => {
	const base = {
		id: 1001,
		sumBonus: 12888888,
		startTime: '2026-04-29 18:30:00',
		endTime: '2026-04-30 23:59:59'
	}

	if (props.previewState === 'upcoming') {
		return {
			...base,
			startTime: '2026-04-30 18:30:00',
			endTime: '2026-05-01 23:59:59'
		}
	}

	if (props.previewState === 'ended') {
		return {
			...base,
			startTime: '2026-04-26 18:30:00',
			endTime: '2026-04-27 23:59:59'
		}
	}

	return base
})
</script>
