<template>
	<div class="start-page">
		<div>
			<div class="dice"></div>
			<p>{{ $t('fairAndSafe') }}</p>
			<img class="fortune" src="./fortune.png" />
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
	background:#140001 url('./start.svg') left top no-repeat;
	background-size: contain;;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	color:#FFF;
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.dice {
			width: 100%;
			height: 1000px;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 30px;
			max-width: 50%;
			&.vxth {
				margin-top: 40%;
			}
		}
		.fortune{
			width:498px;
			height: 117px;
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text5);
			margin-top: 10px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
