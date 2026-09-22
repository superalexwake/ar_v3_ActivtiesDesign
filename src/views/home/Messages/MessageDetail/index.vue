<template>
	<div class="messageDetail__container content">
		<NavBar left-arrow @click-left="onClickLeft" :title="$t('notificationDetails')" />

		<div class="messageDetail__container-wrapper">
			<div class="messageDetail__container-title">
				<div>
					<div>
						<component :is="messageIconNoDot" />
						<span>{{ message.title }}</span>
					</div>
					<span>{{ message.addTime }}</span>
				</div>
				<component :is="messageGarbage" @click="onDeleteClick" />
			</div>
			<div class="messageDetail__container-content" v-html="formatNotifyMessageHtml(message.messages)"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { setMessageState } from '@/api'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import type { UserState } from '@/types/api'
import { useI18n } from 'vue-i18n'
import { formatNotifyMessageHtml } from '@/utils'
const { t: $t } = useI18n()

const userStore = useUserStore()

const router = useRouter()

const message = ref<UserState['messageDetail']>({} as UserState['messageDetail'])

const messageIconNoDot = defineAsyncComponent(() => import('@/svg/home/messageIconNoDot.vue'))

const messageGarbage = defineAsyncComponent(() => import('@/svg/home/messageGarbage.vue'))

function onClickLeft() {
	router.back()
}

function onDeleteClick() {
	showConfirmDialog({
		title: $t('warning'),
		message: $t('warningTxt1')
	}).then(() => {
		setMessageState({
			//uid: userInfo.userId,
			//sign: userInfo.sign,
			messageID: message.value.messageID,
			state: 2
		})

		router.back()
	})
}

onMounted(async () => {
	message.value = userStore.getMessagesDetail
	if (message.value.state === 1) return
	await setMessageState({
		//uid: userInfo.userId,
		//sign: userInfo.sign,
		messageID: message.value.messageID,
		state: 1 // 1:已读 2:删除
	})
	userStore.setMessageDetail({
		...message.value,
		state: 1
	})
})
</script>

<style lang="scss" scoped>
.messageDetail__container {
	padding-bottom: 0;

	&-wrapper {
		padding: 20px 12px 50px;
		border-radius: 10px;
		background: var(--bg_color_L2);
	}

	&-title {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--gray-color-1);

		& > div {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin-left: 0.5rem;

			& > div {
				display: flex;
				align-items: center;
				margin-bottom: 8px;
				font-size: 30px;
				font-weight: 600;

				svg {
					width: 48px;
					height: 48px;
					margin-right: 7px;
				}
			}

			& > span {
				color: var(--text_color_L2);
				font-size: 24px;
				font-weight: 400;
			}
		}

		& > svg {
			width: 36px;
			height: 36px;
		}
	}

	&-content {
		color: var(--text_color_L2);
		font-size: 24px;
		line-height: 40px;
	}
	&-content :deep(.notify-message-highlight) {
		color: var(--main-color);
		font-weight: 600;
	}
}
</style>
