<template>
	<div class="start-page">
		<div>
			<div class="dice"></div>
			<p>Retirada rápida, segura,<br/>com total eficiência e credibilidade.</p>
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
	background: linear-gradient(169deg, #E22F2F 1.56%, #FFD0BA 39.74%, #FF8988 39.75%, #FFF 80.92%, #E33333 99%);
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
			background-repeat: no-repeat;
			background-position: center;
			background-image: url('./start.png');
			width: 584px;
			height: 584px;
			background-size: cover;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 160px;
			max-width: 50%;
			&.vxth {
				margin-top: 40%;
			}
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
