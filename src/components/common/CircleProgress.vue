<template>
	<div class="progress__container">
		<div class="progress__container-content">
			<div class="progress__container-content__left">
				<div class="progress__container-content__left-content"></div>
			</div>
			<div class="progress__container-content__right">
				<div class="progress__container-content__right-content"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type {PropType} from 'vue'
import {onMounted, onUnmounted, ref, watch} from 'vue'

type Percentage = string | number | null

const props = defineProps({
	color: {
		type: String as PropType<string>,
		default: '#FF7172'
	},
	percentage: {
		type: [String, Number] as PropType<Percentage>,
		default: 0
	}
})

const leftRotate = ref<number>(0)

const rightRotate = ref<number>(0)

const color = ref<string>('#FF7172')

const percentage = ref<number>(0)

const intv = ref<NodeJS.Timeout | null>(null)

watch(
	percentage,
	(newVal, oldVal) => {
		if (newVal >= 0 && newVal <= 50) {
			rightRotate.value = (newVal / 50) * 180
			leftRotate.value = 0
		} else if (newVal > 50 && newVal <= 100) {
			rightRotate.value = 180
			leftRotate.value = ((newVal - 50) / 50) * 180
		}
	},
	{ immediate: true }
)

onMounted(() => {
	color.value = props.color

	intv.value = setInterval(() => {
		let percentages = props.percentage as number
		if (percentages && percentages > 0) {
			if (percentage.value > percentages) {
				return
			}
		} else {
			return
		}
		percentage.value += 1
	}, 10)
})

onUnmounted(() => {
	clearInterval(intv.value as NodeJS.Timeout)
	intv.value = null
})
</script>

<style scoped>
.progress__container {
	position: relative;
	width: 110px;
	height: 110px;
	border-radius: 50%;
	border: 1px solid var(--bg_color_L3);
	transform: rotateY(180deg);
}

.progress__container-content {
	position: absolute;
	top: -2px;
	left: 0;
	display: flex;
	width: 110px;
	height: 110px;
}

.progress__container-content__left {
	overflow: hidden;
	width: 110px;
	height: 110px;
}

.progress__container-content__left-content {
	width: 110px;
	height: 110px;
	border-radius: 50%;
	border-width: 2px;
	border-color: var(--bg_color_L3);
	border-top-color: transparent;
	border-right-color: transparent;
	border-style: solid;
	transform: v-bind("'rotate(' + (-135 + leftRotate) + 'deg' + ')'");
	transition: transform 0.1s;
}

.progress__container-content__right {
	position: relative;
	overflow: hidden;
	width: 110px;
	height: 110px;
}

.progress__container-content__right-content {
	position: absolute;
	right: 0;
	width: 110px;
	height: 110px;
	border-radius: 50%;
	border-width: 2px;
	border-color: var(--colorText-26);
	border-top-color: transparent;
	border-left-color: transparent;
	border-style: solid;
	transform: v-bind("'rotate(' + (-225 + rightRotate) + 'deg' + ')'");
	transition: transform 0.1s;
}
</style>
