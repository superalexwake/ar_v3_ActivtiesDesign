<template>
	<!-- B 系单条横幅（B1 到账信息 / B2 待领取带 Claim）。像素还原自 Figma 9790-57945/57960。 -->
	<div class="ntf-banner" @click="$emit('primary')">
		<img class="ntf-banner__icon" :src="icon" alt="" />
		<div class="ntf-banner__text">
			<p class="ntf-banner__title">{{ item.title }}</p>
			<p class="ntf-banner__msg" v-html="messageHtml"></p>
		</div>
		<button v-if="isClaim" type="button" class="ntf-banner__claim" @click.stop="$emit('primary')">
			{{ $t('notifyClaim') }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TemplateId, type NotifyItem } from '@/stores/modules/notifyWs'
import { formatNotifyMessageHtml } from '@/utils'
import { iconFor } from './view'

const props = defineProps<{ item: NotifyItem }>()
defineEmits<{ (e: 'primary'): void }>()

const isClaim = computed(
	() => props.item.pushStyle === 'B2' || props.item.templateId === TemplateId.RewardPending,
)
const icon = computed(() => iconFor(props.item))
const messageHtml = computed(() => formatNotifyMessageHtml(props.item.message))
</script>

<style scoped lang="scss">
.ntf-banner {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	gap: 16px;
	width: 702px;
	max-width: calc(100vw - 48px);
	min-height: 196px;
	padding: 40px;
	background: var(--bg_color_L2);
	border-radius: 16px;
	box-shadow: var(--BoxShadowColor-9, 0 4px 24px rgba(0, 0, 0, 0.25));
	pointer-events: auto;
	cursor: pointer;

	&__icon {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		object-fit: contain;
	}
	&__text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	&__title {
		margin: 0;
		color: var(--text_color_L1);
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 30px;
		line-height: 1.25;
		word-break: break-word;
	}
	&__msg {
		margin: 0;
		color: var(--text_color_L2);
		font-family: 'Poppins', sans-serif;
		font-weight: 400;
		font-size: 22px;
		line-height: 1.3;
		word-break: break-word;
	}
	&__msg :deep(.notify-message-highlight) {
		color: var(--main-color);
		font-weight: 600;
	}
	&__claim {
		flex-shrink: 0;
		width: 120px;
		height: 56px;
		padding: 0;
		border: 0;
		border-radius: 80px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 24px;
		cursor: pointer;
	}
}
</style>
