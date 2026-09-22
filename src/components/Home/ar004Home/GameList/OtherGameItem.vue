<!--
 * @Author: Seven
 * @Date: 2024-03-19 14:04:23
 * @LastEditTime: 2024-03-19 14:06:02
 * @LastEditors: Seven
 * @Description: 
-->
<template>
	<div class="lotterySlotItem__container">
		<div class="title">
			<svg-icon :name="getUrl" v-if="info.slotsTypeID"></svg-icon>
			<div class="tit">{{ gameTypeTitle[gameType] }}</div>
			<div class="desc">{{ getArrayKey(rootConfig.gameAllName, info.slotsTypeID) }}</div>
		</div>
		<img class="game_img" v-lazy="info.vendorImg || info.categoryImg" />
		<Maintain :item="info" />
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getArrayKey } from '@/utils'
import { computed } from 'vue'
import { rootConfig } from '@/utils/selectArr/rootConfig'

const { t } = useI18n()

const props = withDefaults(
	defineProps<{
		info: any
		isAll: boolean
		gameType: string
	}>(),
	{}
)

const gameTypeTitle: {
	[key: string]: string
} = {
	sport: t('sport'),
	video: t('live'),
	chess: t('chess')
}

/**
 * @description: 动态获取图片url
 * @param {*} computed
 * @return {*}
 */
const getUrl = computed(() => {
	if (props.info.slotsName.indexOf('_') === -1) {
		return props.info.slotsName
	} else {
		return props.info.slotsName.split('_')[0]
	}
})
</script>

<style lang="scss" scoped>
.lotterySlotItem__container {
	width: 100%;
	height: 200px;
	border-radius: 40px;
	background: var(--main_gradient-color2);
	box-shadow: var(--BoxShadowColor-20), var(--BoxShadowColor-25);
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: var(--text_color_black, var(--text_color_L4));
	margin-bottom: 20px;
	position: relative;

	.title {
		margin-left: 36px;
		margin-top: 22px;
		position: relative;
		height: 100%;

		svg {
			position: absolute;
			width: 100px;
			height: 60px;
			top: 10px;
			left: 0;
		}

		.tit {
			padding-top: 70px;
			font-size: 28px;
			font-weight: 700;
			margin-bottom: 13px;
			position: relative;
			text-indent: 14px;
		}

		.tit::before {
			content: '';
			position: absolute;
			display: inline-block;
			left: 0;
			top: 76px;
			width: 6px;
			height: 26px;
			background: var(--text_color_black, var(--text_color_L4));
		}

		.desc {
			font-size: 22px;
		}
	}

	.game_img {
		height: 200px;
		max-width: 300px;
		object-fit: contain;
	}
}
</style>
