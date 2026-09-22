<template>
	<div class="activity-filter-tabs">
		<div
			v-for="item in filters"
			:key="item.key"
			class="activity-filter-tabs__item"
			:class="{ 'is-active': modelValue === item.key }"
			@click="$emit('update:modelValue', item.key)"
		>{{ item.label }}</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/** 活动列表筛选分类 */
export type ActivityCategory = 'all' | 'recharge' | 'game' | 'newUser'

defineProps<{
	modelValue: ActivityCategory
}>()

defineEmits<{
	(e: 'update:modelValue', value: ActivityCategory): void
}>()

const { t } = useI18n()
const filters = computed<{ key: ActivityCategory; label: string }[]>(() => [
	{ key: 'all', label: t('all') },
	{ key: 'recharge', label: t('recharge') },
	{ key: 'game', label: t('game') },
	{ key: 'newUser', label: t('activityFilterNewUser') },
])
</script>

<style lang="scss" scoped>
.activity-filter-tabs {
	display: flex;
	align-items: center;
	gap: 16px;
	margin: 32px 24px 0;

	&__item {
		flex-shrink: 0;
		min-width: 116px;
		height: 60px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: var(--bg_color_L1, #fff);
		color: var(--text_color_L2, #768096);
		font-size: 28px;

		&.is-active {
			background: #F95959;
			color: #fff;
		}
	}
}
</style>
