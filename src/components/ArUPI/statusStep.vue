<template>
	<div class="custom_step" :class="{ appealStyle: ['appeal', 'kyc'].includes(type) }">
		<div v-for="(item, index) in orderStepList" :key="index" class="item" :class="{ activeStyle: active <= index }">
			<div class="number" v-if="active < index">{{ index + 1 }}</div>
			<img src="@public/arupi/step.png" class="stepicon" v-else alt="" />
			<div class="text" :class="{ activeColor: active < index }">{{ item.title }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
	defineProps<{
		type: 'sellWait' | 'buy' | 'appeal' | 'detail' | 'matching' | 'kyc' | string
		active: number
		releaseOrderFlag?: boolean
	}>(),
	{
		active: 1,
		type: 'appeal',
		releaseOrderFlag: false //如果是true 那么就是5个
	}
)
const { t } = useI18n()
// 放单
const releaseOrderStep = [
	{
		title: props.type === 'sellWait' ? t('Matching') : '放单确认'
	},
	{
		title: props.type === 'sellWait' ? '放单确认' : t('transfer')
	}
]
// 不走放单
const onReleaseOrderStep = [
	{
		title: props.type === 'sellWait' ? t('Matching') : t('transfer')
	}
]
const orderStep = props.releaseOrderFlag ? releaseOrderStep : onReleaseOrderStep

const orderStepList = computed(() => {
	if (props.type === 'appeal') {
		return [
			{
				title: t('selltip4')
			},
			{
				title: t('Waiting')
			},
			{
				title: t('completed')
			}
		]
	} else if (props.type === 'matching') {
		return [
			{
				title: t('Matching')
			},
			{
				title: t('ToBePaid')
			},
			{
				title: t('WaitingC')
			},
			{
				title: t('completed')
			}
		]
	} else if (props.type === 'kyc') {
		return [
			{
				title: 'Phone'
			},
			{
				title: 'Send'
			},
			{
				title: 'Finish'
			}
		]
	} else {
		return [
			...orderStep,
			{
				title: props.type === 'buy' ? t('uploadC') : t('ToBePaid')
			},
			{
				title: t('WaitingC')
			},
			{
				title: t('completed')
			}
		]
	}
})
</script>

<style scoped lang="scss">
/* Add some style here */
.custom_step {
	display: flex;
	justify-content: space-between;
	width: 100%; /* 调整步骤条的宽度 */
	margin: auto;
	margin-bottom: 48px;
}
.appealStyle {
	width: 500px;
}
.item {
	width: 120px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	position: relative;
	.stepicon {
		width: 56px;
		height: 56px;
		margin-bottom: 20px;
		margin-top: -8px;
	}
	.number {
		width: 40px;
		height: 40px;
		line-height: 40px;
		border-radius: 50%;
		background: var(--bg_color_L3);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 28px;
		color: var(--text_color_L2);
	}

	.text {
		color: var(--text_color_L1);
		font-size: 24px;
		max-height: 80px;
		font-style: normal;
		font-weight: 400;
		&.activeColor {
			color: var(--text_color_L2);
		}
	}
}

.item::after {
	content: '';
	display: block;
	position: absolute;
	top: 20px;
	left: 108px;
	width: 96px;
	height: 4px;
	border-radius: 8px;
	background: #37d729;
}
.activeStyle::after {
	background: #f0f1f5;
}
.item:last-child::after {
	display: none;
}
</style>
