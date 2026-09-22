<template>
	<div class="lotterySlotItem__container">
		<img class="game_img" v-lazy="info.vendorImg" />
		<Maintain :item="info"/>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Maintain from '@/components/common/Maintain.vue'
const { t } = useI18n()

const props = withDefaults(
	defineProps<{
		info: any
		isAll: boolean
		gameType: string
	}>(),
	{}
)

// const gameTypeTitle = {
// 	sport: t('sport'),
// 	video: t('live'),
// 	chess: t('chess')
// } as any
</script>

<style lang="scss" scoped>
.lotterySlotItem__container {
	width: 100%;
	height: fit-content;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: var(--textW);
	margin-bottom: 20px;
	position: relative;
	border-radius: 8px;
	overflow: hidden;

	.title {
		width: 100%;
		position: absolute;
		z-index: 2;
		bottom: 0;
		left: 0;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 6px;
		.tit {
			text-align: center;
			font-size: 22px;;
		}
	}

	.game_img {
		width: 100%;
		height: auto;
		object-fit: contain;
		position: relative;
		top: 0;
		left: 0;
		z-index: 1;
	}
}
</style>
