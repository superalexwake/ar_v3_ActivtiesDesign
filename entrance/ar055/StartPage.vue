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
	background: #292929;
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
			width: 676px;
			height: 517px;
			background-image: url('./start.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 160px;
			width: 350px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			margin-top: 30px;
			padding: 0 10px;
			text-align: center;
			background: linear-gradient(180deg, #FAE59F 0%, #C49440 100%);
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
}
</style>
