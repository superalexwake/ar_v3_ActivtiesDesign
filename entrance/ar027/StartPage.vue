<template>
	<div class="start-page">
		<div>
			<div class="dice"></div>
			<p>{{ $t('fairAndSafe') }}</p>
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
	background: #E52927;
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
			width: 702px;
			height: 701px;
			background-image: url('./start.png');
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 160px;
			width: 350px;
			height: 70px;
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
