<!--记录和比赛结果容器  -->
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
	{ name: t('gameRecords'), componentName: 'GameRecord' },
	{ name: t('myGame'), componentName: 'MyGameRecord' }
])
</script>
<style lang="scss" scoped>
@import '@/assets/styles/xoxs.scss';
</style>
