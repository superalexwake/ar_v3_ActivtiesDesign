<template>
	<div class="GameList__C">
		<div
			v-for="(item, index) in props.gameList"
			:key="index"
			class="GameList__C-item"
			:class="{ active: currentGameIndex == index }"
			@click="$emit('changeGame', index)"
		>
			<div v-html="item.typeName"></div>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		gameList: any
		currentGameIndex: any
	}>(),
	{
		gameList: {
			type: Array,
			default: () => []
		},
		currentGameIndex: {
			type: Number,
			default: 0
		}
	}
)
</script>
<style lang="scss" scoped>
.GameList__C {
	height: 180px;
	width: calc(100% - 52px);
	background: var(--bg_color_L3);
	border-radius: 20px;
	position: relative;
	margin: 26px auto 0 auto;
	display: flex;

	&-item {
		width: 25%;
		height: 100%;
		position: relative;
		z-index: 2;
		text-align: center;

		& > div {
			height: 100%;
			line-height: 30px;
			font-size: 24px;
			margin: auto;
			color: var(--text_color_L2);
			padding-top: 108px;
			background-image: url('@icon/home/time.png');
			background-size: 88px;
			background-position: center 14px;
			background-repeat: no-repeat;
		}

		&.active {
			background: var(--main_gradient-color2);
			border-radius: 20px;
			

			& > div {
				color: var(--text_color_L4);
				background-image: url('@icon/home/time_a.png');
			}
		}
	}
}
</style>
