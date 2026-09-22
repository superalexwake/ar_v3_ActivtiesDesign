<template>
	<div class="start-page">
		<div class="dice"></div>
		<div>
			<p>{{ $t('fairAndSafe') }}</p>
			<img class="logo" src="./logo.png" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.start-page {
	position: fixed;
	z-index: 9999;
	width: 750px;
	height: 100%;
	background: rgba(26, 140, 255, 1);
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.dice {
		width:640px;
		height:567px;
		background-image: url('./start.png');
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: center;
		//margin: 300px 0 80px;
		margin: 0;
	}
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 100px;
			width: 320px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text_color_L4);
			margin-top: 100px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
<script setup lang="ts">
</script>