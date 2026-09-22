<template>
	<List
		ref="listRef"
		v-model:list="messageData"
		v-model:page-query="messageDataQuery"
		:api="getSiteMessageList"
		:distance="250"
		:isAutoLoad="true"
	>
		<template #content>
			<div class="site-message-list__item" v-for="item in messageData" :key="`${item.title}-${item.addtime}`">
				<div class="site-message-list__item-title">
					<svg-icon name="notificationIcon" />
					<span>{{ item.title }}</span>
				</div>
				<div class="site-message-list__item-desc">{{ item.siteMessage }}</div>
				<h5>{{ item.addtime }}</h5>
			</div>
		</template>
	</List>
</template>

<script setup lang="ts">
import { getSiteMessageList } from '@/api'
import List from '@/components/common/List.vue'
import type { siteMesgData } from '@/types/api'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const listRef = ref<InstanceType<typeof List>>()
const messageData = ref<siteMesgData[]>([])
const messageDataQuery = ref({
	pageSize: 25
})

const { locale } = useI18n()
// 公告内容由后端按语言返回，切换语言后需重新拉取
watch(locale, () => listRef.value?.resetRefresh())
</script>

<style lang="scss" scoped>
.site-message-list {
	&__item {
		min-height: 200px;
		padding: 26px 24px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 20px;
		background: var(--bg_color_L2);
		color: var(--text_color_L1);

		& + div {
			margin-top: 24px;
		}

		&-desc {
			margin-top: 24px;
			color: var(--text_color_L2);
			word-break: normal;
			overflow-wrap: break-word;
			hyphens: auto;
		}

		&-title {
			display: flex;
			justify-content: flex-start;

			span {
				flex: 1;
				min-width: 0; // flex 子项默认不收缩，归零长标题才会换行而非撑破容器
				color: var(--text_color_L1);
				font-size: 32px;
				overflow-wrap: break-word;
			}

			svg {
				min-width: 50px;
				min-height: 50px;
				margin-inline-end: 12px;
			}
		}

		h5 {
			margin-top: 26px;
			color: var(--text_color_L3);
			font-size: 24px;
		}
	}
}
</style>
