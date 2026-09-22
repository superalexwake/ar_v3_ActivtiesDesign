<template>
    <div class="progress" :style="progressStyle">
        <div class="line" :style="lineStyle"></div>
		<div v-if="isShowStep" class="step">{{ step }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props =defineProps({
	strokeWidth: {
		type: Number,
		default: 12,
	},
	total: {
		type: Number,
		default: 0
	},
	numerical: {
		type: Number,
		default: 0
	},
	color: {
		type: String,
		default: 'var(--text_color_L4)'
	},
	trackColor: {
		type: String,
		default: 'var(--bg_color_L1)'
	},
	isShowStep: {
		type: Boolean,
		default: true
	}
})
const progressStyle = computed(()=>{
	return {
		background: props.trackColor,
		height: `${props.strokeWidth}px`,
		'border-radius': `${props.strokeWidth}px`,
	}
})
const lineStyle = computed(()=>{
	let width = '0';
	if(props.numerical == 0 || props.total == 0) {
		width = '0'
	} else if((props.numerical > props.total)) {
	 	width = '100'
	} else {
		width = String(((props.numerical / props.total) * 100).toFixed(2))
	}
	return {
		background: props.color,
		width: `${width}%`,
		height: `${props.strokeWidth}px`,
		'border-radius': `${props.strokeWidth}px`,
	}
})
const step = computed(()=> `${props.numerical }/${props.total}`)
</script>

<style lang="scss" scoped>
.progress {
	width: 100%;
	position: relative;
	overflow: hidden;
	.step {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%)translateY(-50%);
		color: var(--text_color_L1);
	}
	.line {

	}
}
</style>