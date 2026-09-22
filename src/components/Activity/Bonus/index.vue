<script setup lang="ts">
import { onMounted } from 'vue'
import { useBonusPack } from '@/hooks'
import BonusItem from '@/components/Activity/Bonus/item.vue'

const emit = defineEmits<{
	(e: 'close'): void
}>()
const {getRewards,list,query,onBonusPack} = useBonusPack();
type BonusPackItem = Parameters<typeof onBonusPack>[0]

onMounted(() => {
	getRewards()
})

async function handlePack(item: BonusPackItem) {
	const result = await onBonusPack(item)
	if (result === 'navigate') emit('close')
}
</script>

<template>
	<div class="reward-dialog">
		<div class="title">
			{{ $t('bonusCollection') }}
		</div>
		<div class="container">
			<BonusItem  v-for="item of list"
						:key="item.activityId"
						:item="item"
						:state="query.receiveState"
						:time="false"
						@pack="handlePack"
			/>
		</div>
		<button type="button" class="close" @click="emit('close')"></button>
	</div>
</template>

<style scoped lang="scss">
.reward-dialog {
	position: relative;
	width: 622px;
	padding: 26px 0 20px;
	border-radius: 16px;
	background: var(--bg_color_L1) url('@/assets/icons/home/reward_bg.png') no-repeat center/cover;
	overflow: visible;

	.title {
		padding: 0 32px;
		width: 600px;
		display: flex;
		align-items: center;
		color: var(--main-color);
		font-family: Roboto;
		font-size: 48px;
		font-style: normal;
		font-weight: 700;
		text-align: left;
		height: 106px;
	}
	.container {
		height: 660px;
		padding: 0 24px;
		background: var(--bg_color_L1);
		overflow-y: auto;
	}

	.close {
		position: absolute;
		width: 60px;
		height: 60px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		left: 50%;
		transform: translateX(-50%);
		bottom: -70px;
		background-image: url('@/assets/icons/activity/PointMall/close.png');
		background-repeat: no-repeat;
		background-size: contain;
	}
}
</style>
