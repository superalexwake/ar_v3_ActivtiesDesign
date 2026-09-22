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
	background: linear-gradient(180deg, #FF8988 0%, #FFD0BA 100%);
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
			width: 280px;
			height: 280px;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			background-image: url('./start.png');
			margin-bottom: 100px;
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
