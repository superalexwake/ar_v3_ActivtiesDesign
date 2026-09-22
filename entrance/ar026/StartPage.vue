<template>
	<div class="start-page">
		<div>
			<div class="dice"></div>
			<p>Situs Slot Gacor Terbaik & Terpercaya</p>
			<img class="logo" src="./logo.png" />
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
	background: #131923;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.dice {
			width: 640px;
			height: 640px;
			background-image: url('./start.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 160px;
			width: 320px;
			height: 120px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: #fff;
			margin-top: 30px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
