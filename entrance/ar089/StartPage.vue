<template>
	<div class="start-page">
		<div>
			<img class="logo" src="./logo.png" />
			<div class="dice"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.start-page {
	position: fixed;
	z-index: 9999;
	width: 750px;
	height: 100%;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: center;
	background-image: url('./bg.png');
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.logo {
			background: none;
			top:2.5rem;
			width:90%;
			position: absolute;
		}
		.dice {
			position: absolute;
			top: 2rem;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: url('./start.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}
	}
}
</style>
