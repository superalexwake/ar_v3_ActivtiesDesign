<template>
	<div class="start-page">
		<div>
			<div class="dice"></div>
			<img class="logo" src="./logo2.png" />
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
		.dice {
			position: absolute;
			top: -130px;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: url('./people.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top:14rem;
			width: 350px;
			position: relative;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text_color_L4);
			margin-top: 30px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
