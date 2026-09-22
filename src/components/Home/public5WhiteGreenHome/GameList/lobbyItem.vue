<template>
	<div class="lobby-item">
		<div class="lobby-item__head">
			<div class="lobby-item__title">
				<img v-if="titleIcon" :src="titleIcon" alt="" />
				<span>{{ title }}</span>
			</div>
			<div class="lobby-item__more" @click="$emit('more-click')">
				{{ $t('all') }}
				<i class="lobby-item__arrow">›</i>
			</div>
		</div>

		<Swipe
			class="lobby-item__swipe"
			ref="swipeRef"
			:autoplay="3000"
			:loop="true"
			:show-indicators="false"
			:lazy-render="false"
		>
			<SwipeItem v-for="(row, x) in groupedList" :key="x">
				<div class="lobby-item__row">
					<GameCard
						v-for="(game, i) in row"
						:key="i"
						:item="game"
						:tag-icon="game.vendorCode"
						:tag-text="vendorMode ? game.vendorName || game.vendorCode || game.name : tagText"
						:name="vendorMode ? '' : getCardName(game)"
						@click="$emit('item-click', $event)"
					/>
				</div>
			</SwipeItem>
		</Swipe>
	</div>
</template>

<script setup lang="ts">
import { Swipe, SwipeItem } from 'vant'
import { computed, ref } from 'vue'
import { splitIntoGroups } from '@/utils'
import GameCard from './GameCard.vue'
import { getLotteryCardName } from './lotteryName'

const props = defineProps<{
	listData: Array<any>
	title: string
	titleIcon?: string
	// 子游戏模式下的分类标签（vendorMode=false 时用）
	tagText?: string
	// 厂商模式：true=数据是厂商列表（tag 用 vendorName/vendorImg、不显示游戏名）；false=子游戏列表（显示分类标签 + 游戏名）
	vendorMode?: boolean
	displayType?: string
}>()

defineEmits<{
	(e: 'item-click', item: any): void
	(e: 'more-click'): void
}>()

const swipeRef = ref()

// 3个一组，每组一排
const groupedList = computed(() => splitIntoGroups(props.listData || [], 3))

const getCardName = (game: any) => {
	if (props.displayType === 'Lottery') {
		return getLotteryCardName(game)
	}
	return game.gameName || game.gameNameEn || game.slotsName || game.categoryName || game.gameCode || game.name
}
</script>

<style scoped lang="scss">
.lobby-item {
	&__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 44px;
		margin-bottom: 24px;
	}

	&__title {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text_color_L1);
		font-size: 30px;
		font-weight: 600;

		img {
			width: 40px;
			height: 40px;
			object-fit: contain;
		}
	}

	&__more {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 48px;
		padding: 0 18px;
		border-radius: 12px;
		border: 2px solid #d1f7ff;
		background: linear-gradient(180deg, #effcff 0%, #edfff6 100%);
		color: var(--main-color);
		font-size: 22px;
		font-weight: 500;
		cursor: pointer;
	}

	&__arrow {
		font-style: normal;
		font-size: 24px;
		line-height: 1;
	}

	&__row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	:deep(.van-swipe-item) {
		padding-right: 0;
	}
}
</style>
