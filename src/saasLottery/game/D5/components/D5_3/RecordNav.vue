<template>
	<div class="RecordNav__C">
		<div
			v-for="(item, index) in navList"
			:key="index"
			@click="$emit('changeC', item.componentName)"
			:class="{ active: props.record == item.componentName }"
		>
			{{ item.name }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
	record: {
		type: String,
		default: 'GameRecord'
	}
})

const navList = ref([
	{ name:t('gameRecords'), componentName: 'GameRecord' },
	{ name:t('chartTrends'), componentName: 'Trend' },
	{ name:t('myGameRecords'), componentName: 'MyGameRecord' }
])
</script>
<style lang="scss" scoped>
.RecordNav__C {
	width: calc(100% - 52px);
	height: 72px;
	line-height: 72px;
	display: flex;
	justify-content: space-between;
	margin: 24px auto 0;
	& > div {
		width: calc((100% - 38px) / 3);
		height: 100%;
		background: var(--bg_color_L2);
		border-radius: 16px;
		font-size: 28px;
		color: var(--text_color_L2);
		text-align: center;
		overflow: hidden;

		&.active {
			background: var(--main_gradient-color,var(--main_gradient-color));
			font-weight: 600;
			color: var(--text_color_L4);
		}
	}
}
</style>
