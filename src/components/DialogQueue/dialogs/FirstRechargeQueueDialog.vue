<template>
	<div class="first-recharge-queue-dialog">
		<div class="first-recharge-queue-dialog__header">
			<div class="first-recharge-queue-dialog__title">{{ $t('firstDialogH') }}</div>
			<div class="first-recharge-queue-dialog__tip">{{ $t('firstDialogTip') }}</div>
		</div>
		<div class="first-recharge-queue-dialog__body">
			<firstItem :list="ActiveSotre.FirstRechargeList" @gorecharge="gorecharge" @close="onClaimed" />
		</div>
		<div class="first-recharge-queue-dialog__footer">
			<div class="first-recharge-queue-dialog__today" :class="{ active: noToday }" @click="toggleNoToday">
				<van-checkbox :model-value="noToday" @click.stop="toggleNoToday" />
				{{ $t('noTipToday') }}
			</div>
			<button type="button" class="first-recharge-queue-dialog__button" @click="goDetail">
				{{ $t('activity') }}
			</button>
		</div>
		<button type="button" class="first-recharge-queue-dialog__close" @click="closeWithReason"></button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import firstItem from '@/components/Activity/FirstRecharge/listItem.vue'
import { useActive } from '@/components/common/use'
import { useDialogQueue } from '../useDialogQueue'

const emit = defineEmits<{
	(e: 'close'): void
	(e: 'confirm'): void
	(e: 'dismiss-today'): void
}>()
const router = useRouter()
const queue = useDialogQueue()
const { ActiveSotre } = useActive()

/**
 * 是否勾选"今日不再"。关闭弹窗时根据该状态走两条 emit：
 *   - true  → emit('dismiss-today')；Host 用 reason='dismiss-today' 关闭，
 *             dismissForToday 中间件包过的 onClose 会写入 localStorage
 *   - false → emit('close')         正常关闭，无持久化副作用
 *
 * 入队前的"今日已 dismiss"判定和 list 预检都搬到了 producers.ts 的 firstRechargePipe 里，
 * 这里只负责呈现 + 关闭语义。
 */
const noToday = ref(false)

function toggleNoToday() {
	noToday.value = !noToday.value
}

function closeWithReason() {
	if (noToday.value) emit('dismiss-today')
	else emit('close')
}

/**
 * 领取成功后关闭。此时列表已被 receiveFirstRechargeReward 刷新过（已 await）：
 *   - 还有可领档位 → 走 persistent 隐藏，切下一个 tab 时再弹继续领
 *   - 全部领完     → emit('confirm') 真正出队，否则 persistent 项会在下次路由切换时
 *                    被重新激活，浮出一个空列表弹窗（本次修复的 bug）
 */
function onClaimed() {
	const list = ActiveSotre.value.FirstRechargeList
	const hasClaimable = Array.isArray(list) && list.some((i: any) => i.canReceive && !i.isFinshed)
	if (hasClaimable) closeWithReason()
	else emit('confirm')
}

function goDetail() {
	closeWithReason()
	queue.discard()
	router.push({ name: 'FirstRecharge' })
}

function gorecharge() {
	closeWithReason()
	queue.discard()
	router.push({ name: 'Recharge' })
}
</script>

<style scoped lang="scss">
.first-recharge-queue-dialog {
	width: min(620px, calc(100vw - 48px));
	border-radius: 20px;
	background: var(--bg_color_L2);
	color: var(--text_color_L1);
	position: relative;

	&__header {
		min-height: 140px;
		padding-top: 25px;
		border-radius: 20px 20px 0 0;
		background-color: var(--bg_color_L3);
		text-align: center;
	}

	&__title {
		font-size: 28px;
	}

	&__tip {
		margin-top: 20px;
		font-size: 22px;
		font-weight: 400;
		color: var(--text_color_L2);
	}

	&__body {
		max-height: calc(100dvh - 630px);
		padding: 20px 10px;
		background-color: var(--bg_color_L2);
		overflow: auto;
	}

	&__body :deep(.first_list-item) {
		background: var(--bg_color_L3);
		box-shadow: none;
	}

	&__footer {
		min-height: 100px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		border-radius: 0 0 20px 20px;
		background-color: var(--bg_color_L3);
	}

	&__today {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text_color_L2);
		font-size: 24px;
	}

	&__button {
		width: 200px;
		min-height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 25px;
		background: var(--main_gradient-color);
		color: var(--text_color_L4);
		font-size: 28px;
		font-weight: 700;
	}

	&__close {
		position: absolute;
		width: 60px;
		height: 60px;
		border: 0;
		border-radius: 50%;
		left: 50%;
		transform: translateX(-50%);
		bottom: -70px;
		background: url('@/assets/icons/activity/PointMall/close.png') no-repeat center/contain;
	}
}
</style>
