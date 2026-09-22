<template>
	<div class="start-page">
		<div class="dice"></div>
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.start-page {
	position: fixed;
	z-index: 9999;
	width: 750px;
	height: 100vh;
	background: #efad02;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	.dice {
		width:100%;
		height:100%;
		background-image: url('./start.png');
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
	}
}
</style>
