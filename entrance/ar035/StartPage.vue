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
	background: linear-gradient(191deg, #3195FB 21.75%, #4FA9FF 39.66%, #A7D9FB 62.25%, #9CA4E9 85.21%, #F6BFD0 99.4%);
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
			width: 664px;
			height: 582px;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			background-image: url('./start.png');
			margin-bottom: 27px;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 35px;
			width: 240px;
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
