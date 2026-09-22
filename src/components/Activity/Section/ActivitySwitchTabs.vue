<template>
	<div class="activity-switch-tabs">
		<div
			v-for="tab in tabs"
			:key="tab.key"
			class="activity-switch-tabs__item"
			:class="{ 'is-active': active === tab.key }"
			@click="$emit('switch', tab.key)"
		>{{ tab.label }}</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/** 活动页顶部「活动｜任务」切换的两个页签 */
export type ActivityTopTab = 'activity' | 'task'

defineProps<{
	active: ActivityTopTab
}>()

defineEmits<{
	(e: 'switch', tab: ActivityTopTab): void
}>()

const { t } = useI18n()
const tabs = computed<{ key: ActivityTopTab; label: string }[]>(() => [
	{ key: 'activity', label: t('activity') },
	{ key: 'task', label: t('activityTaskTab') },
])
</script>

<style lang="scss" scoped>
.activity-switch-tabs {
	display: flex;
	height: 88px;
	margin: 32px 24px 0;
	background: #FFFFFF;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

	&__item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		color: var(--text_color_L2, #768096);

		&.is-active {
			margin: 8px 4px;
			height: 72px;
			background: var(--main_gradient-color);
			border-radius: 12px;
			color: var(--text_color_L4, #fff);
			font-weight: 700;
		}
	}
}
</style>
