<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useVModels } from '@vueuse/core'
import { useChampionship } from '@/hooks'
import { currency } from '@/utils'
import { CurrentTime, useCountDown } from '@vant/use'

const { serviceNowTime } = useChampionship()

const props = withDefaults(
	defineProps<{
		itemD?: any
		state?: number
		isRefresh?: boolean
	}>(),
	{
		itemD: () => ({}),
		isRefresh: false
	}
)

const emit = defineEmits(['update:isRefresh'])
const { isRefresh } = useVModels(props, emit)

const countDownTime = ref(0)
const countDown = ref()

const onLoad = () => {
	if (props.state == 1) {
		const startTime = serviceNowTime.value.replace(/-/g, '/')
		const endTime = props.itemD.endTime.replace(/-/g, '/')
		countDownTime.value = new Date(endTime).getTime() - new Date(startTime).getTime()

		if (countDownTime.value > 0) {
			countDown.value = useCountDown({
				time: countDownTime.value,
				onChange: change
			})
			countDown.value.start()
		}
	}
}

watch(
	() => props.itemD.id,
	() => {
		onLoad()
	},
	{ immediate: true }
)

const current = computed(() => {
	return countDown.value?.current
})

function change(c: CurrentTime) {
	if (c.total == 0) isRefresh.value = true
	else isRefresh.value = false
}

function formatD(obj: any) {
	if (!obj) return { hours: '00', minutes: '00', seconds: '00' }
	return {
		hours: String(obj.hours).padStart(2, '0'),
		minutes: String(obj.minutes).padStart(2, '0'),
		seconds: String(obj.seconds).padStart(2, '0')
	}
}
</script>

<template>
	<div class="tournament-container">
		<div class="contentChamp">
			<h1 class="title">{{ $t('eTournament') }}</h1>
			<h2 class="subtitle">{{ $t('winTips5') }}</h2>
			<div class="prize">{{ currency(itemD?.sumBonus || 0) }}</div>

			<div v-if="state == 1" class="countdown">
				<div class="countdown-item">
					<div class="countdown-value">{{ current?.days }}</div>
					<div class="countdown-label">Days</div>
				</div>
				<div class="countdown-separator">:</div>
				<div class="countdown-item">
					<div class="countdown-value">{{ formatD(current)?.hours }}</div>
					<div class="countdown-label">Hours</div>
				</div>
				<div class="countdown-separator">:</div>
				<div class="countdown-item">
					<div class="countdown-value">{{ formatD(current)?.minutes }}</div>
					<div class="countdown-label">Minutes</div>
				</div>
				<div class="countdown-separator">:</div>
				<div class="countdown-item">
					<div class="countdown-value">{{ formatD(current)?.seconds }}</div>
					<div class="countdown-label">Seconds</div>
				</div>
			</div>

			<h1 v-else-if="state == 0" class="timeText">{{ $t('startTime') }}</h1>
			<h1 v-else-if="state == 2" class="timeText">{{ $t('ended') }}</h1>
			<div v-if="state == 0" class="timeText">{{ itemD?.startTime }}</div>
			<div v-if="state == 2" class="timeText">00:00:00</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.tournament-container {
	width: 100%;
	height: 324px;
	background: url('@icon/home/champion_bg.png') no-repeat center / 100% 100%;
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	margin-bottom: 32px;
}

.contentChamp {
	width: 100%;
	padding: 50px 24px 32px 24px;
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);

	.timeText {
		color: var(--main-color);
		font-size: 24px;
	}
}

.title {
	color: #fff;
	text-shadow: 0 4px 8px rgba(0, 80, 40, 0.35);
	font-style: italic;
	transform: skewX(-10deg);
	font-size: 40px;
	font-weight: 600;
	margin-bottom: 12px;
}

.subtitle {
	color: rgba(255, 255, 255, 0.85);
	font-family: 'Poppins';
	font-weight: 500;
	font-size: 26px;
}

.prize {
	color: #fff;
	text-shadow: 0 4px 8px rgba(0, 80, 40, 0.35);
	font-family: 'Poppins';
	font-size: 50px;
	font-weight: 700;
	margin: 10px 0;
}

.countdown {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 8px;
}

.countdown-item {
	min-width: 80px;
	height: 80px;
	text-align: center;
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.18);
	backdrop-filter: blur(6px);
}

.countdown-value {
	color: #fff;
	text-align: center;
	text-shadow: 0 2px 2px rgba(0, 80, 40, 0.25);
	font-family: 'Poppins';
	font-size: 36px;
	font-weight: 700;
}

.countdown-label {
	font-size: 18px;
	color: rgba(255, 255, 255, 0.85);
}

.countdown-separator {
	font-size: 24px;
	font-weight: bold;
	color: #fff;
}
</style>
