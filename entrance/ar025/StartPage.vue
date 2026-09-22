<template>
	<div class="start-page">
		<div class="dice"></div>
		<p>{{ $t('fairAndSafe') }}</p>
		<img class="logo" src="./logo.png" />
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.start-page {
	position: fixed;
	z-index: 9999;
	width: 750px;
	height: 100%;
	background: linear-gradient(180deg, #f54545 0%, #ffddcf 87.38%);
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.dice {
		width: 750px;
		height: 657px;
		background-image: url('./start.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
	.logo {
		background-repeat: no-repeat;
		background-size: contain;
		margin-top: 250px;
		width: 390px;
		height: 62px;
	}
	p {
		font-weight: bold;
		font-size: 38px;
		color: #fff;
		margin-top: 30px;
		padding: 0 10px;
		text-align: center;
		margin-top: 60px;
	}
}
</style>
