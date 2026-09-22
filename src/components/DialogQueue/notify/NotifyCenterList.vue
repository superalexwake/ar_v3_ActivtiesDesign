<template>
	<!-- B 系多条聚合：通知中心，可展开/收起。像素还原自 Figma 9790-62350。 -->
	<div class="ntf-center">
		<div class="ntf-center__group">
			<div class="ntf-center__header">
				<div class="ntf-center__htitle">
					<img class="ntf-center__bell" :src="bell" alt="" />
					<span class="ntf-center__hname">{{ $t('notifyCenterTitle', { n: list.length }) }}</span>
				</div>
				<div class="ntf-center__actions">
					<div class="ntf-center__toggle" @click="expanded = !expanded">
						<span class="ntf-center__toggle-txt">{{ expanded ? $t('notifyCollapse') : $t('notifyExpand') }}</span>
						<svg class="ntf-center__chevron" :class="{ 'is-up': expanded }" viewBox="0 0 20 20" fill="none">
							<path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<button type="button" class="ntf-center__close" :aria-label="$t('close')" @click.stop="$emit('close')">
						<van-icon name="cross" />
					</button>
				</div>
			</div>
			<div v-if="expanded" class="ntf-center__divider" />
		</div>

		<template v-if="expanded">
			<div v-for="(item, i) in list" :key="item.id" class="ntf-center__group">
				<div class="ntf-center__row" @click="$emit('rowClick', item)">
					<div class="ntf-center__rleft">
						<img class="ntf-center__ricon" :src="iconFor(item)" alt="" />
						<div class="ntf-center__rtext">
							<p class="ntf-center__rtitle">{{ item.title }}</p>
							<p class="ntf-center__rmsg" v-html="formatNotifyMessageHtml(item.message)"></p>
						</div>
					</div>
					<span class="ntf-center__time">{{ relativeTime(item.receivedAt, $t) }}</span>
				</div>
				<div v-if="i < list.length - 1" class="ntf-center__divider" />
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import bell from '@/assets/icons/notify/bell.png'
import type { NotifyItem } from '@/stores/modules/notifyWs'
import { formatNotifyMessageHtml } from '@/utils'
import { iconFor, relativeTime } from './view'

defineProps<{ list: NotifyItem[] }>()
defineEmits<{
	(e: 'rowClick', item: NotifyItem): void
	(e: 'close'): void
}>()

const expanded = ref(false)
</script>

<style scoped lang="scss">
.ntf-center {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 24px;
	width: 702px;
	max-width: calc(100vw - 48px);
	padding: 24px 40px;
	background: var(--bg_color_L2);
	border-radius: 16px;
	box-shadow: var(--BoxShadowColor-9, 0 4px 24px rgba(0, 0, 0, 0.25));
	pointer-events: auto;

	&__group {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
	}
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		width: 100%;
	}
	&__htitle {
		display: flex;
		align-items: center;
		gap: 16px;
		min-width: 0;
	}
	&__bell {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		object-fit: contain;
	}
	&__hname {
		color: var(--text_color_L1);
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 30px;
	}
	&__actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}
	&__toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
		cursor: pointer;
	}
	&__toggle-txt {
		color: var(--main-color);
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 22px;
	}
	&__chevron {
		width: 20px;
		height: 20px;
		color: var(--main-color);
		transition: transform 0.2s ease;
		&.is-up {
			transform: rotate(180deg);
		}
	}
	&__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--bg_color_L3);
		color: var(--text_color_L2);
		font-size: 24px;
		cursor: pointer;
	}
	&__divider {
		width: 100%;
		height: 1px;
		background: var(--Dividing-line_color);
	}

	&__row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		width: 100%;
		cursor: pointer;
	}
	&__rleft {
		display: flex;
		align-items: center;
		gap: 16px;
		flex: 1;
		min-width: 0;
	}
	&__ricon {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		object-fit: contain;
	}
	&__rtext {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	&__rtitle {
		margin: 0;
		color: var(--text_color_L1);
		font-family: 'Poppins', sans-serif;
		font-weight: 500;
		font-size: 24px;
		word-break: break-word;
	}
	&__rmsg {
		margin: 0;
		color: var(--text_color_L2);
		font-family: 'Poppins', sans-serif;
		font-weight: 400;
		font-size: 22px;
		word-break: break-word;
	}
	&__rmsg :deep(.notify-message-highlight) {
		color: var(--main-color);
		font-weight: 600;
	}
	&__time {
		flex-shrink: 0;
		margin-top: 4px;
		color: var(--text_color_L3, var(--text_color_L2));
		font-family: 'Poppins', sans-serif;
		font-weight: 400;
		font-size: 20px;
		text-align: right;
		white-space: nowrap;
	}
}
</style>
