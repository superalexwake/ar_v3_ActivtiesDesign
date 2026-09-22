<template>
	<div class="Footer__C">
		<div class="nav c-row c-row-between">
			<div class="c-row left c-row c-row-middle-center">
				<div class="item">
					<p class="txt">{{ $t('quantity') }}</p>
					<span class="num">{{ betNumber || 0 }}</span>
				</div>
				<div class="item">
					<p class="txt">{{ $t('betAmount') }}</p>
					<span class="num">{{ currency(betSum || 0) }}</span>
				</div>
			</div>
			<div class="c-row c-row-middle-center" :class="[betSum > 0 ? 'bet-btn' : 'disabled-btn']" @click="playBet()">
				<span class="">{{ $t('betting') }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { currency } from '@/utils'
const emit = defineEmits(['playBet'])
const props = withDefaults(
	defineProps<{
		betNumber: any
		betSum: any
	}>(),
	{
		betNumber: {
			type: Number,
			default: 0
		},
		betSum: {
			type: Number,
			default: 0
		}
	}
)
const playBet = () => {
	emit('playBet')
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/xoxs.scss';
</style>