<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useVModels } from "@vueuse/core";
import { useChampionship } from "@/hooks";
import {currency} from "@/utils";
import { CurrentTime, useCountDown } from "@vant/use";
const { serviceNowTime } = useChampionship();

const props = withDefaults(
	defineProps<{
		itemD?: any;
		state?: number;
		isRefresh?: boolean;
	}>(),
	{
		itemD: {},
		isRefresh: false,
	}
);

const onLoad=()=> {
	if (props.state == 1) {
		const startTime = serviceNowTime.value.replace(/-/g, "/");
		const endTime = props.itemD.endTime.replace(/-/g, "/");
		countDownTime.value = new Date(endTime).getTime() - new Date(startTime).getTime();

		if (countDownTime.value > 0) {
			countDown.value = useCountDown({
				time: countDownTime.value,
				onChange: change,
			});
			countDown.value.start();
		}
	}
}

const emit = defineEmits(["update:isRefresh"]);
const { isRefresh } = useVModels(props, emit);
const countDownTime = ref(0);
const countDown = ref();
watch(() => props.itemD.id,(val) => {
	onLoad();
},{ immediate: true });

const current = computed(() => {
	return countDown.value.current;
});

function change(current: CurrentTime) {
	if (current.total == 0) isRefresh.value = true;
	else isRefresh.value = false;
}

function formatD(obj: any) {
	return {
		hours: String(obj.hours).padStart(2, "0"),
		minutes: String(obj.minutes).padStart(2, "0"),
		seconds: String(obj.seconds).padStart(2, "0")
	};
}
</script>

<template>
	<div class="tournament-container">
		<div class="contentChamp">
			<h1 class="title">{{ $t('eTournament') }}</h1>
			<h2 class="subtitle">{{ $t("winTips5") }}</h2>
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

			<h1 v-else-if="state == 0" class="timeText">{{ $t("startTime") }}</h1>
			<h1 v-else-if="state == 2" class="timeText">{{ $t("ended") }}</h1>
			<div v-if="state == 0" class="timeText">
				{{ itemD?.startTime }}
			</div>
			<div v-if="state == 2" class="timeText">00:00:00</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.tournament-container {
	width: 100%;
	//min-height:260px;
	height:324px;
	background:url("@/assets/p5BlackGoldStyle/icons/home/champion_bg.png");
	background-size: 100% 100%;
	background-position:center;
	background-repeat: no-repeat;
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	margin-bottom: 32px;
}

.contentChamp {
	width: 100%;
	padding:50px 24px 32px 24px;
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	.timeText{
		color: #FFD29F;
		font-size: 24px;
	}
}

.title {
	color: var(--text_color_L1, #FDE4BC);
	text-shadow: 0px 4px 8px rgba(123, 63, 0, 0.65);
	font-family: '851-CAI978';
	font-style: italic;
	transform: skewX(-10deg);
	font-size: 40px;
	font-style: normal;
	font-weight: 600;
	margin-bottom: 12px;
}

.subtitle {
	color: #FFD29F;
	font-family: 'Poppins';
	font-weight: 500;
	font-size: 26px;
}

.prize {
	color: #FFB61A;
	text-shadow: 0px 4px 8px rgba(93, 48, 0, 0.65);
	font-family: 'Poppins';
	font-size: 50px;
	font-style: normal;
	font-weight: 700;
	margin: 10px 0;
}

.countdown {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap:8px;
}

.countdown-item {
	border-radius: 12px;
	min-width: 80px;
	height: 80px;
	text-align: center;
	border-radius: 16px;
	background: linear-gradient(180deg, rgba(232, 142, 52, 0.50) 0%, rgba(106, 94, 86, 0.20) 100%);
}

.countdown-value {
	color: #FFD29F;
	text-align: center;
	text-shadow: 0px 2px 2px rgba(123, 63, 0, 0.25);
	font-family: Poppins;
	font-size: 36px;
	font-style: normal;
	font-weight: 700;
}

.countdown-label {
	font-size:18px;
	color: #FFD29F;
}

.countdown-separator {
	font-size: 24px;
	font-weight: bold;
	color: #FFD29F;
}

</style>