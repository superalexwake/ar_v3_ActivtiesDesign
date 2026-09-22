<template>
	<div class="start-page">
		<div class="dice"></div>
		<div>
			<img class="logo" src="./logo.png" />
			<p>{{ $t('fairAndSafe') }}</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.start-page {
	position: fixed;
	z-index: 9999;
	width: 750px;
	height: 100%;
	background:linear-gradient(180deg, #1B3959 0%, #1B3959 100%);
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: start;
	.dice {
		width:750px;
		height:1166px;
		background-image: url('./start.png');
		background-repeat: no-repeat;
		background-size: 100%;
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
			//margin-top: 120px;
			width: 320px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text_color_L4);
			//margin-top: 30px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
<script setup lang="ts">
</script>