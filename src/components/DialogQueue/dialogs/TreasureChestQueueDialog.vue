<template>
	<div class="treasure-chest-dialog">
		<div class="treasure-chest-dialog__title">
			{{ $t('treasureChest1', { task: chest.taskTitle || '' }) }}
		</div>
		<div class="treasure-chest-dialog__subtitle">
			{{ $t('treasureChest2', { amount: previewAmount }) }}
		</div>

		<div class="treasure-chest-dialog__rewards">
			<div class="treasure-chest-dialog__animation">
				<div v-if="!isChestOpened">
					<div class="treasure-chest-dialog__box-bg-light"></div>
					<div class="treasure-chest-dialog__box-closed"></div>
				</div>
				<div v-else>
					<div class="treasure-chest-dialog__box-open"></div>
					<div class="treasure-chest-dialog__box-front-light"></div>
					<div class="treasure-chest-dialog__reward">
						{{ $t('treasureChest4', { amount: rewardAmount || 0 }) }}
					</div>
				</div>
			</div>
		</div>

		<div class="treasure-chest-dialog__button-box">
			<button
				v-if="isChestOpened"
				type="button"
				class="treasure-chest-dialog__button"
				@click="handleConfirm"
			>
				{{ $t('confirm') }}
			</button>
			<button
				v-else
				type="button"
				class="treasure-chest-dialog__button"
				:disabled="loading"
				@click="handleOpenChest"
			>
				{{ $t('treasureChest3') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { showFailToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { OpenTreasureChest } from '@/api'
import { fixMsg } from '@/utils'

export interface TreasureChestDialogChest {
	rewardConfigId: number | string
	taskType: number | string
	taskTitle?: string
	rewardAmount?: number | string
	minRewardAmount?: number | string
	maxRewardAmount?: number | string
	isShow?: number
}

export interface TreasureChestQueueDialogProps {
	chest: TreasureChestDialogChest
}

const props = defineProps<TreasureChestQueueDialogProps>()
const emit = defineEmits<{
	(e: 'confirm'): void
	(e: 'close'): void
}>()
const { t } = useI18n()

const loading = ref(false)
const isChestOpened = ref(false)
const rewardAmount = ref<number | string>(0)
type TreasureChestRewardData = number | string | {
	rewardAmount?: number | string
	amount?: number | string
}

const hasRewardRange = computed(() => Boolean(props.chest.minRewardAmount && props.chest.maxRewardAmount))
const previewAmount = computed(() => {
	if (hasRewardRange.value) {
		return `${props.chest.minRewardAmount || 0}~${props.chest.maxRewardAmount || 0}`
	}
	return props.chest.rewardAmount || 0
})

const getRewardAmount = (data?: TreasureChestRewardData) => {
	if (typeof data === 'number' || typeof data === 'string') return data
	return data?.rewardAmount ?? data?.amount ?? props.chest.rewardAmount ?? 0
}

const showOpenChestFailed = async (result: IRes | unknown) => {
	emit('close')
	await nextTick()

	const errorResult = result as IRes
	if (errorResult?.msgCode || errorResult?.msg) {
		fixMsg(errorResult)
		return
	}

	const code = errorResult?.code ?? ''
	const codeMessageKey = code === '' ? '' : `code${code}`
	const codeMessage = codeMessageKey ? t(codeMessageKey) : ''
	showFailToast({
		message: `Error: ${code}\n ${codeMessage === codeMessageKey ? '' : codeMessage}`,
		wordBreak: 'break-word',
		className: 'fail_message_toast',
		iconSize: 28,
	})
}

async function handleOpenChest() {
	if (loading.value || isChestOpened.value) return

	loading.value = true
	let result: ObjRes<TreasureChestRewardData> | null = null

	try {
		result = await OpenTreasureChest({
			rewardConfigId: props.chest.rewardConfigId,
			taskType: props.chest.taskType,
		})
	} catch (error) {
		loading.value = false
		await showOpenChestFailed(error)
		return
	}

	loading.value = false
	if (!result) {
		await showOpenChestFailed({ msg: t('fail') })
		return
	}
	if (result.code !== 0) {
		await showOpenChestFailed(result)
		return
	}

	rewardAmount.value = getRewardAmount(result.data)
	isChestOpened.value = true
}

function handleConfirm() {
	emit('confirm')
}
</script>

<style scoped lang="scss">
.treasure-chest-dialog {
	width: min(622px, calc(100vw - 32px));
	color: #fff;
	background: transparent;

	&__title {
		color: #FDE240;
		text-align: center;
		-webkit-text-stroke-width: 1.5px;
		-webkit-text-stroke-color: #AB1E1E;
		font-family: "Poppins";
		font-size: 36px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
	}

	&__subtitle {
		margin-top: 30px;
		color: #FFF;
		text-align: center;
		font-family: "Poppins";
		font-size: 28px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	&__rewards {
		position: relative;
	}

	&__animation {
		position: relative;
		display: flex;
		width: 500px;
		height: 500px;
		margin: 0 auto;
		align-items: center;
		justify-content: center;
	}

	&__box-bg-light,
	&__box-closed,
	&__box-open,
	&__box-front-light {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	&__box-bg-light {
		z-index: 1;
		background: url('@/assets/icons/treasureChest/box_bg_light.png') no-repeat center/cover;
		animation: treasure-chest-rotate 12s linear infinite;
	}

	&__box-closed {
		z-index: 2;
		background: url('@/assets/icons/treasureChest/box_closed.png') no-repeat center/cover;
		animation: treasure-chest-shake 2.5s ease-in-out infinite;
	}

	&__box-open {
		z-index: 3;
		background: url('@/assets/icons/treasureChest/box_open.png') no-repeat center/cover;
	}

	&__box-front-light {
		z-index: 4;
		background: url('@/assets/icons/treasureChest/box_front_light.png') no-repeat center/cover;
		animation: treasure-chest-rotate 12s linear infinite;
	}

	&__reward {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 5;
		width: 100%;
		color: #FFE65B;
		text-align: center;
		-webkit-text-stroke-width: 2px;
		-webkit-text-stroke-color: #AB1E1E;
		font-family: "Poppins";
		font-size: 48px;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		animation: treasure-chest-scale-in 0.6s ease-out forwards;
	}

	&__button-box {
		display: flex;
		justify-content: center;
		margin-top: 40px;
	}

	&__button {
		display: flex;
		width: 380px;
		height: 100px;
		border: 0;
		align-items: center;
		justify-content: center;
		background: url('@/assets/icons/treasureChest/chest_btn.png') no-repeat center/cover;
		color: #fff;
		font-size: 36px;
		font-weight: 600;
		line-height: 100px;
	}

	&__button:disabled {
		opacity: 0.7;
	}
}

@keyframes treasure-chest-rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

@keyframes treasure-chest-shake {
	0% {
		transform: translateX(0) rotate(0deg);
	}
	5% {
		transform: translateX(-16px) rotate(-6deg);
	}
	10% {
		transform: translateX(16px) rotate(6deg);
	}
	15% {
		transform: translateX(-16px) rotate(-6deg);
	}
	20% {
		transform: translateX(16px) rotate(6deg);
	}
	25% {
		transform: translateX(-16px) rotate(-6deg);
	}
	30% {
		transform: translateX(0) rotate(0deg);
	}
	100% {
		transform: translateX(0) rotate(0deg);
	}
}

@keyframes treasure-chest-scale-in {
	0% {
		transform: translate(-50%, -50%) scale(0);
		opacity: 0;
	}
	50% {
		transform: translate(-50%, -50%) scale(1.2);
	}
	100% {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
}
</style>
