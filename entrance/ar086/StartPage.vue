<template>
	<div class="start-page">
		<div>
			<div class="dice"></div>
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
	//background: rgba(5, 1, 43, 1);
	background:#05012b;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	//align-items: center;

	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.dice {
			width:691px;
			height:702px;
			background-size: cover;
			background-repeat: no-repeat;
			background-position: center;
			background-image: url('./start.png');
			//margin-bottom: 27px;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 100px;
			width: 320px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--main-color);
			margin-top: 100px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
<script setup lang="ts">
</script>