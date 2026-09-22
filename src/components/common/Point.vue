<template>
	<div class="point point-flicker"></div>
</template>

<script setup lang="ts"></script>
 
<style lang="scss" scoped>
.point {
	width: 10px;
	height: 10px;
	background-color: var(--norm_red-color);
	position: relative;
	border-radius: 50%;
}

/* 设置动画前颜色 */
.point-flicker:after {
	background-color: var(--norm_red-color);
}

/* 设置动画后颜色 */
.point-flicker:before {
	background-color: rgba(0, 168, 253, 0.2);
}

/* 设置动画 */
.point-flicker:before,
.point-flicker:after {
	content: '';
	width: 16px;
	height: 16px;
	position: absolute;
	left: 50%;
	top: 50%;
	margin-left: -8px;
	margin-top: -8px;
	border-radius: 50%;
	/* CSS3 animation 属性 网址 */
	/* https://www.w3school.com.cn/cssref/pr_animation.asp */
	animation: warn 1.5s ease-out 0s infinite;
	//html:lang(ar) &{
	//	left: unset;
	//	right: 50%;
	//}
}

/* @keyframes 规则用于创建动画。在 @keyframes 中规定某项 CSS 样式，就能创建由当前样式逐渐改为新样式的动画效果。 */
@keyframes warn {
	0% {
		transform: scale(0.5);
		opacity: 1;
	}

	30% {
		opacity: 1;
	}

	100% {
		transform: scale(1.4);
		opacity: 0;
	}
}
</style>
