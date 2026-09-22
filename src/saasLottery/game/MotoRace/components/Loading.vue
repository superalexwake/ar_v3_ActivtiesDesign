<script setup lang="ts">
import {  computed } from "vue";


const props = defineProps({
	progress: {
		type: Number,
		default: 100,
	}
});
const maxProgress = 100;

const radius = 150;
const pi = Math.PI;
const arcLength = pi * radius;

// 计算 stroke-dashoffset 实现精确加载效果
const dashOffset = computed(() => {
	return arcLength - (props.progress / maxProgress) * arcLength;
});

</script>

<template>
	<transition name="fade">


<div class="loading_moto">
	<div class="loading-mask"></div>
	<div class="loading-container">
		<svg class="loading_svg" viewBox="0 -50 320 200">
			<!-- 背景半圆（灰色） -->
			<path
				d="M10,150 A150,150 0 0,1 310,150"
				stroke="#ccc"
				stroke-width="6"
				fill="transparent"
			/>
			<!-- 动态半圆弧（橙色） -->
			<path
				d="M10,150 A150,150 0 0,1 310,150"
				stroke="orange"
				stroke-width="6"
				fill="transparent"
				:stroke-dasharray="arcLength"
				:stroke-dashoffset="dashOffset"
				stroke-linecap="round"
			/>
		</svg>

		<div class="progress-text">{{ progress }}</div>
		<div class="loading-text">LOADING</div>

	</div>
</div>
	</transition>
</template>

<style scoped lang="scss">
.loading_moto{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 7;
	.loading-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 7;
		background-color: rgba(0, 0, 0, 0.5);
	}


	.loading-container {
		position: relative;
		z-index: 8;
		margin-top: 290px;
		width: 100%;
		background-color: transparent;
		color: white;
		font-family: Arial, sans-serif;
		border-radius: 10px;
		.loading_svg {
			width: 160px;
			height: 120px;
			display: block;
			margin: auto;
		}
	}

	.progress-text {
		width: 140px;
		height: 70px;
		//background: #2e3;
		font-size: 24px;
		font-weight: bold;
		text-align:center;
		line-height: 110px;
		margin: -78px auto 8px;
		position: relative;
		overflow: hidden;
	}
	.progress-text::after {
		content: '';
		display: block;
		position: absolute;
		top: 0px;
		left: 1px;
		width: 140px;
		height: 140px;
		background: url('../assets/images/circle.png') no-repeat center center;
		background-size: 100%;
		animation: loading-rotate 5s linear infinite;
	}

	.loading-text {
		width: 160px;
		margin: auto;
		border-top: 2px solid #afafaf;
		text-align: center;
		line-height: 30px;
		font-size: 14px;
	}
}

@keyframes loading-rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}


</style>