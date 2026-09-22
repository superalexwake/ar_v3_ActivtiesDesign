<template>
	<List
		ref="msgWrapperRef"
		v-model:list="messageData"
		v-model:page-query="messageDataQuery"
		:api="getMessages"
		:distance="100"
		:isAutoLoad="isAutoLoad"
	>
		<template #content>
			<div class="personal-message-list__item" v-for="item in messageData" :key="item.messageID">
				<div class="personal-message-list__item-title">
					<div>
						<svg-icon class="svg" :name="item.state === 0 ? 'messageIconRed' : 'notification'" />
						<span :title="item.title">{{ item.title }}</span>
					</div>
					<svg-icon class="svg" name="messageGarbage" @click.stop="onDeleteClick(item)" />
				</div>
				<div class="personal-message-list__item-time">
					{{ item.addTime }}
				</div>
				<div class="personal-message-list__item-content" v-html="formatNotifyMessageHtml(item.messages)"></div>
			</div>
		</template>
	</List>
</template>

<script setup lang="ts">
import { getMessages, setAllMessageState, setMessageState } from '@/api'
import List from '@/components/common/List.vue'
import { GlobalStore, useCommonStore, useHomeStore } from '@/stores'
import type { ResMessageList, UserInfo } from '@/types/api'
import { AwaitApiResult, formatNotifyMessageHtml } from '@/utils'
import { showConfirmDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const { setLoading } = useCommonStore()
const globalStore = GlobalStore()
const homeStore = useHomeStore()
const msgWrapperRef = ref<{ resetRefresh: () => void }>()
const isAutoLoad = ref(false)
const messageData = ref<ResMessageList[]>([])
const messageDataQuery = ref({
	pageSize: 25
})

async function readAll() {
	await setAllMessageState({
		state: 1
	})
		.then((res) => {
			if (res) {
				homeStore.setReadState(true)
			}
		})
		.catch(() => {})
}

function onDeleteClick(item: ResMessageList) {
	showConfirmDialog({
		title: $t('warning'),
		message: $t('warningTxt1')
	}).then(async () => {
		const res: ObjResNull<ListRes<ResMessageList>> = await AwaitApiResult(
			setMessageState({
				messageID: item.messageID,
				state: 2
			})
		)

		if (res) {
			messageData.value = messageData.value.filter((message) => message.messageID !== item.messageID)
		}
	})
}

onMounted(async () => {
	setLoading(true)
	await readAll()
	setLoading(false)
	msgWrapperRef.value?.resetRefresh()

	const userInfo = globalStore.getUserInfo as UserInfo
	userInfo.unRead = 0
	globalStore.setUserInfo({
		...userInfo
	})
	homeStore.setReadState(true)
})
</script>

<style lang="scss" scoped>
.personal-message-list {
	&__item {
		padding: 20px;
		border-radius: 5px;
		background: var(--bg_color_L2);

		&-title {
			display: flex;
			align-items: center;
			color: var(--text_color_L1);

			> div {
				flex: 1;
				min-width: 0; // flex 子项默认不收缩，归零长标题才会换行而非撑破容器
				display: flex;
				align-items: center;
			}

			.svg {
				flex-shrink: 0; // 长标题换行时不得挤压图标
				width: 48px;
				height: 48px;

				&:last-of-type {
					width: 36px;
					height: 36px;
					margin-left: auto;
				}
			}

			span {
				flex: 1;
				min-width: 0;
				margin-left: 7px;
				overflow-wrap: break-word; // 超长词在卡片内断行，不撑破容器
				font-size: 30px;
				font-weight: 600;
			}
		}

		&-time {
			margin-block: 8px 28px;
			color: var(--text_color_L3);
			font-size: 24px;
			font-weight: 400;
		}

		&-content {
			color: var(--text_color_L2);
			font-size: 24px;
			font-weight: 400;
			word-break: normal;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		&-content :deep(.notify-message-highlight) {
			color: var(--main-color);
			font-weight: 600;
		}

		& + div {
			margin-top: 24px;
		}
	}
}
</style>
