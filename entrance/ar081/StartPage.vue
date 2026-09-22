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
	background: linear-gradient(180deg, #F3CA29 0%, #FFB72C 98.39%);
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;


	.dice {
		width:750px;
		height:916px;
		background-image: url('./start.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			width:320px;
			margin-top:70px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text_color_L4);
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
<script setup lang="ts">
</script>