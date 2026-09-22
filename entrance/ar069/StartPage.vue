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
	background: linear-gradient(0deg, #15131E 0%, #2E6139 50%, #15131E 100%);
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
			width: 694px;
			height:712px;
			background-image: url('./start.png');
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
		}
		.logo {
			background-repeat: no-repeat;
			background-size: contain;
			margin-top: 160px;
			width: 368px;
			&.vxth {
				margin-top: 40%;
			}
		}
		p {
			font-weight: bold;
			font-size: 38px;
			color: var(--text_color_L1);
			margin-top: 30px;
			padding: 0 10px;
			text-align: center;
		}
	}
}
</style>
