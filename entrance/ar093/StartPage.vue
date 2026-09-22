<template>
	<div class="start-page">
		<!-- <div>
			<div class="dice"></div>
			<p>{{ $t('fairAndSafe') }}</p>
			<img class="logo" src="./logo.png" />
		</div> -->
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
			width: 750px;
			height: 813px;
			margin-top: -2rem; // 向上移动60px，可根据需要调整
			background-image: url('./start.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text_color_L4);
			margin-top:30px;
			padding: 0 10px;
			text-align: center;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top:1rem;
			max-width: 50%;
		}
	}
}
</style>
