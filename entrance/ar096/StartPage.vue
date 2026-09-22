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
}
</style>
