<template>
	<div class="ar-searchbar__selector">
		<div @click="onClickSelectT">
			<span class="noSelect" v-if="startDateValue === '' || endDateValue === ''">{{ $t('datePick') }}</span>
			<span v-else class="ar-searchbar__selector-default"> {{ startDateValue }}/{{ endDateValue }} </span>
			<van-icon name="arrow-down" />
		</div>
	</div>
	<!--<ArSelect @click-select="onClickSelectT" :selectName="$t('datePick')|| (startDateValue / endDateValue )"></ArSelect>-->
	<!-- <van-popup v-model:show="showDataPick" round position="bottom"> -->
	<van-calendar
		v-model:show="showDataPick"
		type="range"
		@confirm="onConfirmDateC"
		:min-date="minDate"
		:max-date="maxDate"
		teleport="body"
	/>
	<!-- </van-popup> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dateRange } from '@/utils'

const { minDate, maxDate } = dateRange()

const emits = defineEmits<{
	(e: 'confirm'): void
}>()

// 日期选择
const startDateValue = ref('')
const endDateValue = ref('')
const showDataPick = ref(false)

const formatDate = (date: any) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
const onConfirmDateC = async (values: any) => {
	showDataPick.value = false
	const [start, end] = values

	startDateValue.value = formatDate(start)
	endDateValue.value = formatDate(end)

	emits('confirm')
}

//时间下拉框点击事件
function onClickSelectT() {
	showDataPick.value = true
}

defineExpose({
	startDateValue,
	endDateValue
})
</script>

<style lang="scss" scoped></style>
