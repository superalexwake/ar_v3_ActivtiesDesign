<template>
	<div class="FDP__C">
		<div class="FDP__C-text">{{ $t('betResult') }}</div>
		<div class="FDP__C-list">
			<div v-for="(item, index) in prizeNumList" :key="index">
				<div class="num">{{ item }}</div>
				<div class="letter">{{ textMap[index] }}</div>
			</div>
		</div>
		<div class="FDP__C-symbol">=</div>
		<div class="FDP__C-sum">{{ sumCount }}</div>
	</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
const prizeNumList = computed(() => {
	return [...props.premium]
})
const props = defineProps({
	sumCount: {
		type: Number,
		default: 0
	},
	premium: {
		type: String,
		default: '00000'
	}
})
// 名称映射
const textMap = ref(['A', 'B', 'C', 'D', 'E'])
</script>
<style lang="scss" scoped>
.FDP__C {
	height: 146px;
	width: calc(100% - 52px);
	margin: 26px auto 22px;
	border-radius: 20px;
	padding: 20px 26px;
	background: var(--darkBg,var(--bg_color_L2));
	display: flex;
	align-items: flex-start;

	&-text {
		color: var(--text_color_L2);
		height: 100px;
		line-height: 50px;
		font-size: 26px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&-symbol {
		width: 18px;
		margin: 0 10px;
		font-size: 26px;
		line-height: 70px;
		color: var(--text_color_L1);
	}

	&-sum {
		height: 70px;
		width: 70px;
		line-height: 70px;
		background: var(--main-color);
		font-size: 26px;
		color: var(--text_color_L4);
		border-radius: 50%;
		text-align: center;
		flex: none;
	}

	&-list {
		display: flex;
		width: fit-content;
		flex: none;

		& > div {
			width: 70px;
			height: 100%;
			margin-left: 16px;

			.num {
				height: 70px;
				width: 70px;
				line-height: 70px;
				background: var(--bg_color_L3);
				font-size: 26px;
				color: var(--darkTextW,var(--text_color_L1));
				border-radius: 50%;
				text-align: center;
			}

			.letter {
				margin-top: 4px;
				text-align: center;
				font-size: 28px;
				color: var(--text_color_L2);
			}
		}
	}

	& > div {
		height: 70px;
	}
}
</style>
