<template>
	<div class="lotterySlotItem__container">
		<img class="game_img" v-lazy="info.vendorImg" />
		<span class="game_text">{{title}}</span>
		<Maintain :item="info" />
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = withDefaults(
	defineProps<{
		info: any,
		title:string
	}>(),
	{}
)

</script>

<style lang="scss" scoped>
.lotterySlotItem__container {
	position: relative;
	width: 350px;
	height: 310px;
	border-radius: 20px;
	.game_text{
		position: absolute;
		bottom: 4px;
		left: 50%;
		transform: translateX(-50%);
		color: #D9AC4F;
		font-weight: 700;
	}
	.game_img {
		display: block;
		margin: 0 auto;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 10px;
	}
}
</style>
