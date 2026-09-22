<template>
	<div class="messages__container">
		<NavBar
			:title="$t('notifications')"
			backgroundColor="#f7f8ff"
			left-arrow
			@click-left="onClickLeft"
		/>

		<van-tabs
			v-if="isLoggedIn"
			v-model:active="activeTab"
			class="messages__tabs"
			line-width="0"
			line-height="0"
			title-active-color="var(--text_color_L4)"
			title-inactive-color="var(--text_color_L2)"
			:lazy-render="true"
			@change="onTabChange"
		>
			<van-tab name="personal" :title="$t('notifications')">
				<div class="messages__content">
					<PersonalMessageList />
				</div>
			</van-tab>
			<van-tab name="site" :title="$t('announcement')">
				<div class="messages__content">
					<SiteMessageList />
				</div>
			</van-tab>
		</van-tabs>

		<div v-else class="messages__content">
			<SiteMessageList />
		</div>
	</div>
</template>

<script setup lang="ts">
import PersonalMessageList from '@/components/Home/Messages/PersonalMessageList.vue'
import SiteMessageList from '@/components/Home/Messages/SiteMessageList.vue'
import { GlobalStore } from '@/stores'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type MessageTab = 'personal' | 'site'

const route = useRoute()
const router = useRouter()
const globalStore = GlobalStore()

const isLoggedIn = computed(() => Boolean(globalStore.token))

const resolveTab = (tab: unknown): MessageTab => {
	return tab === 'site' || tab === 'system' ? 'site' : 'personal'
}

const activeTab = ref<MessageTab>(resolveTab(route.query.tab))

watch(
	() => route.query.tab,
	(tab) => {
		activeTab.value = resolveTab(tab)
	}
)

function onClickLeft() {
	router.go(-1)
}

function onTabChange(name: string | number) {
	const tab = resolveTab(name)
	if (route.query.tab === tab) return
	router.replace({
		query: {
			...route.query,
			tab
		}
	})
}
</script>

<style lang="scss" scoped>
.messages__container {
	padding: 24px;
	font-family: 'Inter', sans-serif;

	:deep(.navbar) {
		.navbar__content {
			.navbar__content-right {
				display: flex;
				align-items: center;

				svg {
					width: 44px;
					height: 44px;
					margin-right: 5px;
				}

				span {
					color: var(--text_color_L2);
					font-size: 24px;
				}
			}
		}
	}
}

.messages__tabs {
	:deep(.van-tabs__wrap) {
		height: 72px;
		margin-bottom: 24px;
	}

	:deep(.van-tabs__nav) {
		padding: 8px;
		border-radius: 12px;
		background: var(--bg_color_L2);
	}

	:deep(.van-tab) {
		border-radius: 8px;
		font-size: 28px;
		line-height: 56px;
	}

	:deep(.van-tab--active) {
		background: var(--main-color);
	}
}

.messages__content {
	min-height: 200px;
}
</style>
