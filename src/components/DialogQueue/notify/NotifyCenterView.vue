<template>
	<!-- B 系单队列项：复用 DialogQueueHost('top') 渲染。读通知中心 store → 1条横幅 / 多条聚合。 -->
	<NotifyBanner v-if="center.count === 1" :item="center.list[0]" @primary="onPrimary(center.list[0])" />
	<NotifyCenterList v-else-if="center.count >= 2" :list="center.list" @row-click="onPrimary" @close="onCloseList" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'
import { pushTreasureChestDialogs } from '@/components/DialogQueue/producers'
import { jumpBy, useNotifyWsStore, type NotifyItem } from '@/stores'
import NotifyBanner from './NotifyBanner.vue'
import NotifyCenterList from './NotifyCenterList.vue'

const TREASURE_CHEST_ACTIVITY_CODE = 118

const emit = defineEmits<{ (e: 'close'): void }>()
const center = useNotifyWsStore()

function closeCurrentBanner() {
	center.clearList()
	emit('close')
}

async function openTreasureChestDialog() {
	await pushTreasureChestDialogs({ allowNonHome: true })
}

async function onPrimary(item?: NotifyItem) {
	if (!item) return
	if (item.activityCode === TREASURE_CHEST_ACTIVITY_CODE) {
		closeCurrentBanner()
		await nextTick()
		await openTreasureChestDialog()
		return
	}
	jumpBy(item.jumpAction, item.activityCode)
	closeCurrentBanner()
}

function onCloseList() {
	closeCurrentBanner()
}

// 列表清空 → 通知 host 关闭本队列项（出队，下次推送再入队）
watch(
	() => center.count,
	(c) => {
		if (c === 0) emit('close')
	},
)

// 单条横幅真正显示到屏幕上，才开始 3s 自动消失计时（见 store.startAutoDismiss）
watch(
	() => (center.count === 1 ? center.list[0].id : ''),
	(id) => {
		if (id) center.startAutoDismiss(id)
	},
	{ immediate: true },
)
onMounted(() => {
	if (center.count === 0) emit('close')
})
</script>
